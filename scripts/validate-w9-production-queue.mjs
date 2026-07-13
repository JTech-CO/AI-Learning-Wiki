import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [schema, queue, topics, batches, evidence, categories, ...ledgers] = await Promise.all([
  readJson('content-model/schema.production-queue.json'),
  readJson('content-model/evidence/w9-production-queue.json'),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/evidence/w1-batches.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/taxonomy/categories.json'),
  ...['w4', 'w5', 'w6', 'w7', 'w8', 'w9'].map((milestone) => readJson(`content-model/evidence/${milestone}-claim-ledger.json`)),
]);
const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(queue)) errors.push(ajv.errorsText(validate.errors));
const queueById = new Map(queue.topics.map((topic) => [topic.topicId, topic]));
const topicById = new Map(topics.topics.map((topic) => [topic.id, topic]));
const evidenceById = new Map(evidence.articles.map((article) => [article.articleId, article]));
const readyIds = new Set(ledgers.flatMap((ledger) => ledger.articles).filter((article) => article.publicationReady).map((article) => article.articleId));
if (queueById.size !== 1400 || topicById.size !== 1400) errors.push('W9 queue must contain 1,400 unique topics');
if (readyIds.size !== 210) errors.push(`expected 210 unique ready articles, found ${readyIds.size}`);
for (const [topicId, topic] of topicById) {
  const item = queueById.get(topicId);
  if (!item) { errors.push(`${topicId}: missing queue item`); continue; }
  if (item.categoryId !== topic.primaryCategory || item.tier !== topic.tier || item.state !== topic.state || item.rank !== topic.rank) errors.push(`${topicId}: taxonomy fields differ`);
  if (item.publicationReady !== readyIds.has(topicId)) errors.push(`${topicId}: publication state differs`);
  if (item.publicationReady && (item.stage !== 'published' || item.blockers.length)) errors.push(`${topicId}: ready state is invalid`);
  if (item.publicationReady && !evidenceById.get(topicId)?.audit.readyForManualClaimReview) errors.push(`${topicId}: published without W2 evidence readiness`);
  if (topic.state === 'candidate' && (item.stage !== 'research-queued' || item.publicationReady)) errors.push(`${topicId}: candidate bypassed research gate`);
  if (topic.state === 'existing' && !item.publicationReady) errors.push(`${topicId}: all 210 existing articles must be publication-ready after W9`);
}
const batchTopicIds = batches.batches.flatMap((batch) => batch.topicIds);
if (batches.batches.length !== 56 || batchTopicIds.length !== 1400 || new Set(batchTopicIds).size !== 1400) errors.push('W1 batches must cover all topics');
for (const batch of queue.batches) {
  const source = batches.batches.find((item) => item.id === batch.id);
  if (!source || batch.topicCount !== source.topicCount || batch.published + batch.queued !== batch.topicCount) errors.push(`${batch.id}: batch counts differ`);
}
for (const category of categories.categories) {
  const summary = queue.byCategory[category.id];
  if (!summary || summary.topics !== 100 || summary.published !== 15 || summary.existingQueued !== 0 || summary.candidates !== 85) errors.push(`${category.id}: expected 15 published and 85 candidates`);
}
const countStage = (stage) => queue.topics.filter((topic) => topic.stage === stage).length;
if (queue.totals.published !== countStage('published') || queue.totals.sourceRemediation !== countStage('source-remediation') || queue.totals.claimReviewQueued !== countStage('claim-review-queued') || queue.totals.researchQueued !== countStage('research-queued')) errors.push('queue totals differ from topic stages');
if (queue.totals.existing !== 210 || queue.totals.candidates !== 1190 || queue.totals.published !== 210 || queue.totals.sourceRemediation !== 0 || queue.totals.claimReviewQueued !== 0 || queue.totals.researchQueued !== 1190) errors.push('W9 totals must be 210 published existing and 1,190 candidate topics');
if (errors.length) {
  console.error(`W9 production queue validation: ${errors.length} error(s)\n${errors.slice(0, 160).join('\n')}`);
  process.exit(1);
}
console.log('W9 production queue validation: 1,400 topics; 210 published, 1,190 candidates, 15 per category');

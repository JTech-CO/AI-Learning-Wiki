import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [schema, queue, topics, batches, evidence, categories, w4, w5, w6, w7, w8] = await Promise.all([
  readJson('content-model/schema.production-queue.json'),
  readJson('content-model/evidence/w8-production-queue.json'),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/evidence/w1-batches.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/taxonomy/categories.json'),
  readJson('content-model/evidence/w4-claim-ledger.json'),
  readJson('content-model/evidence/w5-claim-ledger.json'),
  readJson('content-model/evidence/w6-claim-ledger.json'),
  readJson('content-model/evidence/w7-claim-ledger.json'),
  readJson('content-model/evidence/w8-claim-ledger.json'),
]);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const errors = [];
if (!validate(queue)) errors.push(ajv.errorsText(validate.errors));
const queueById = new Map(queue.topics.map((topic) => [topic.topicId, topic]));
const topicById = new Map(topics.topics.map((topic) => [topic.id, topic]));
const evidenceById = new Map(evidence.articles.map((article) => [article.articleId, article]));
const readyIds = new Set([...w4.articles, ...w5.articles, ...w6.articles, ...w7.articles, ...w8.articles].filter((article) => article.publicationReady).map((article) => article.articleId));
if (queueById.size !== 1400 || topicById.size !== 1400) errors.push('production queue must contain 1,400 unique taxonomy topics');
if (readyIds.size !== 70) errors.push(`expected 70 unique publication-ready articles, found ${readyIds.size}`);
for (const [topicId, topic] of topicById) {
  const item = queueById.get(topicId);
  if (!item) { errors.push(`${topicId}: missing production queue item`); continue; }
  if (item.categoryId !== topic.primaryCategory || item.tier !== topic.tier || item.state !== topic.state || item.rank !== topic.rank) errors.push(`${topicId}: taxonomy fields differ`);
  if (item.publicationReady !== readyIds.has(topicId)) errors.push(`${topicId}: publication state differs from claim ledgers`);
  if (item.publicationReady && item.stage !== 'published') errors.push(`${topicId}: ready article is not published`);
  if (item.publicationReady && !evidenceById.get(topicId)?.audit.readyForManualClaimReview) errors.push(`${topicId}: published without passing evidence readiness`);
  if (topic.state === 'candidate' && (item.stage !== 'research-queued' || item.publicationReady)) errors.push(`${topicId}: candidate bypassed the research gate`);
  if (topic.state === 'existing' && !item.publicationReady && !['source-remediation', 'claim-review-queued'].includes(item.stage)) errors.push(`${topicId}: existing unreviewed topic has an invalid stage`);
  if (item.publicationReady && item.blockers.length) errors.push(`${topicId}: published topic still has blockers`);
  if (!item.publicationReady && !item.blockers.length) errors.push(`${topicId}: queued topic has no blocker`);
}
const batchTopicIds = batches.batches.flatMap((batch) => batch.topicIds);
if (batches.batches.length !== 56 || batchTopicIds.length !== 1400 || new Set(batchTopicIds).size !== 1400) errors.push('W1 batches must cover all 1,400 topics exactly once');
for (const batch of queue.batches) {
  const source = batches.batches.find((item) => item.id === batch.id);
  if (!source || batch.topicCount !== source.topicCount || batch.published + batch.queued !== batch.topicCount) errors.push(`${batch.id}: batch counts differ from W1`);
}
const categoryIds = new Set(categories.categories.map((category) => category.id));
if (categoryIds.size !== 14 || Object.keys(queue.byCategory).length !== 14) errors.push('production queue must contain all 14 categories');
for (const categoryId of categoryIds) {
  const summary = queue.byCategory[categoryId];
  if (!summary || summary.topics !== 100 || summary.published !== 5 || summary.published + summary.existingQueued + summary.candidates !== 100) errors.push(`${categoryId}: W8 category production counts are invalid`);
}
const countStage = (stage) => queue.topics.filter((topic) => topic.stage === stage).length;
if (queue.totals.published !== countStage('published') || queue.totals.sourceRemediation !== countStage('source-remediation') || queue.totals.claimReviewQueued !== countStage('claim-review-queued') || queue.totals.researchQueued !== countStage('research-queued')) errors.push('production queue stage totals differ from topics');
if (queue.totals.existing !== 163 || queue.totals.candidates !== 1237 || queue.totals.published !== 70 || queue.totals.sourceRemediation + queue.totals.claimReviewQueued !== 93 || queue.totals.researchQueued !== 1237) errors.push('W8 queue totals must be 163 existing, 1,237 candidates, 70 published, 93 existing queued');
if (errors.length) {
  console.error(`W8 production queue validation: ${errors.length} error(s)\n${errors.slice(0, 100).join('\n')}`);
  process.exit(1);
}
console.log('W8 production queue validation: 1,400 topics in 56 batches; 70 published, 93 existing queued, 1,237 candidate research topics');

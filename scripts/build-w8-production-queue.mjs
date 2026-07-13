import { readFile, writeFile } from 'node:fs/promises';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [topics, batches, evidence, research, w4, w5, w6, w7, w8, w8Summary] = await Promise.all([
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/evidence/w1-batches.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/evidence/evidence-ledger.json'),
  readJson('content-model/evidence/w4-claim-ledger.json'),
  readJson('content-model/evidence/w5-claim-ledger.json'),
  readJson('content-model/evidence/w6-claim-ledger.json'),
  readJson('content-model/evidence/w7-claim-ledger.json'),
  readJson('content-model/evidence/w8-claim-ledger.json'),
  readJson('content-model/evidence/w8-summary.json'),
]);

const publicationReady = new Set([...w4.articles, ...w5.articles, ...w6.articles, ...w7.articles, ...w8.articles]
  .filter((article) => article.publicationReady)
  .map((article) => article.articleId));
const evidenceById = new Map(evidence.articles.map((article) => [article.articleId, article]));
const researchById = new Map(research.topics.map((topic) => [topic.topicId, topic]));
const batchByTopic = new Map();
for (const batch of batches.batches) for (const topicId of batch.topicIds) batchByTopic.set(topicId, batch.id);

const queueTopics = topics.topics.map((topic) => {
  const pack = evidenceById.get(topic.id);
  const researchCard = researchById.get(topic.id);
  const ready = publicationReady.has(topic.id);
  const evidenceReady = Boolean(pack?.audit.readyForManualClaimReview);
  let stage;
  let blockers;
  if (ready) {
    stage = 'published';
    blockers = [];
  } else if (topic.state === 'candidate') {
    stage = 'research-queued';
    blockers = ['article-draft', 'source-relevance-review', 'sentence-claim-review'];
  } else if (evidenceReady) {
    stage = 'claim-review-queued';
    blockers = ['sentence-claim-review'];
  } else {
    stage = 'source-remediation';
    blockers = [...new Set([...(pack?.audit.gaps ?? []).filter((gap) => gap !== 'manual-claim-review'), 'sentence-claim-review'])];
  }
  return { topicId: topic.id, categoryId: topic.primaryCategory, tier: topic.tier, state: topic.state, rank: topic.rank, batchId: batchByTopic.get(topic.id), stage, publicationReady: ready, evidenceReady, manualReviewRequired: Boolean(researchCard?.manualReviewRequired), blockers };
});

const countStage = (stage) => queueTopics.filter((topic) => topic.stage === stage).length;
const categoryIds = [...new Set(queueTopics.map((topic) => topic.categoryId))].sort();
const byCategory = Object.fromEntries(categoryIds.map((categoryId) => {
  const members = queueTopics.filter((topic) => topic.categoryId === categoryId);
  return [categoryId, { topics: members.length, published: members.filter((topic) => topic.publicationReady).length, existingQueued: members.filter((topic) => topic.state === 'existing' && !topic.publicationReady).length, candidates: members.filter((topic) => topic.state === 'candidate').length }];
}));
const queueBatches = batches.batches.map((batch) => {
  const members = queueTopics.filter((topic) => topic.batchId === batch.id);
  return { id: batch.id, categoryId: batch.categoryId, phase: batch.phase, topicCount: members.length, published: members.filter((topic) => topic.publicationReady).length, queued: members.filter((topic) => !topic.publicationReady).length };
});
const queue = {
  version: 'W8-2026-07-13',
  generatedAt: w8Summary.generatedAt,
  policy: { publicationRequiresClaimLedger: true, candidatePublicationAllowed: false, stageOrder: ['research-queued', 'source-remediation', 'claim-review-queued', 'published'] },
  totals: { topics: queueTopics.length, categories: categoryIds.length, batches: queueBatches.length, existing: queueTopics.filter((topic) => topic.state === 'existing').length, candidates: queueTopics.filter((topic) => topic.state === 'candidate').length, published: countStage('published'), sourceRemediation: countStage('source-remediation'), claimReviewQueued: countStage('claim-review-queued'), researchQueued: countStage('research-queued') },
  byCategory,
  batches: queueBatches,
  topics: queueTopics,
};
await writeFile('content-model/evidence/w8-production-queue.json', `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
console.log(`W8 production queue: ${queue.totals.topics} topics; ${queue.totals.published} published, ${queue.totals.sourceRemediation} source remediation, ${queue.totals.claimReviewQueued} claim review, ${queue.totals.researchQueued} research queued`);

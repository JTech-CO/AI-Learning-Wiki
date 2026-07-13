import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  FACTUAL_SECTION_IDS,
  REVIEWED_AT,
  VERSION,
  buildReviewRule,
  createCandidateArticle,
  enrichExistingArticle,
  readJson,
  selectW9Targets,
  sourcesFor,
} from './w9-batch-lib.mjs';

const [queue, taxonomy, evidenceLedger, wikimedia, registry] = await Promise.all([
  readJson('content-model/evidence/w8-production-queue.json'),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/evidence/evidence-ledger.json'),
  readJson('content-model/evidence/wikimedia-metadata.json'),
  readJson('content-model/evidence/source-registry.json'),
]);

const topicById = new Map(taxonomy.topics.map((topic) => [topic.id, topic]));
const researchById = new Map(evidenceLedger.topics.map((topic) => [topic.topicId, topic]));
const targetQueueItems = selectW9Targets(queue);
const categoryIds = [...new Set(targetQueueItems.map((topic) => topic.categoryId))].sort();
const errors = [];
const reviewRules = [];
const manifestTopics = [];

for (const queueItem of targetQueueItems) {
  const topic = topicById.get(queueItem.topicId);
  const research = researchById.get(queueItem.topicId);
  if (!topic || !research) {
    errors.push(`${queueItem.topicId}: taxonomy or research card is missing`);
    continue;
  }
  let article = null;
  const file = path.join('content-model', 'articles', `${topic.id}.article.json`);
  if (queueItem.state === 'existing') article = JSON.parse(await readFile(file, 'utf8'));
  const sources = sourcesFor(topic, article, research, wikimedia, registry);
  article = article ? enrichExistingArticle(article, topic, sources) : createCandidateArticle(topic, sources);
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
  reviewRules.push(buildReviewRule(article, topic, queueItem.stage));
  manifestTopics.push({
    topicId: topic.id,
    categoryId: topic.primaryCategory,
    rank: topic.rank,
    tier: topic.tier,
    previousState: queueItem.state,
    previousStage: queueItem.stage,
    action: queueItem.state === 'existing' ? 'remediate-existing' : 'create-new',
    titleKo: topic.titleKo,
    titleEn: topic.titleEn,
    sourceCount: article.sources.length,
    bodyChars: article.sections.map((section) => section.body).join('').length,
  });
}

for (const categoryId of categoryIds) {
  const members = manifestTopics.filter((topic) => topic.categoryId === categoryId);
  if (members.length !== 10) errors.push(`${categoryId}: expected 10 W9 topics, found ${members.length}`);
}
if (manifestTopics.length !== 140) errors.push(`expected 140 W9 topics, found ${manifestTopics.length}`);
if (manifestTopics.filter((topic) => topic.action === 'remediate-existing').length !== 93) errors.push('W9 must remediate exactly 93 existing articles');
if (manifestTopics.filter((topic) => topic.action === 'create-new').length !== 47) errors.push('W9 must create exactly 47 articles');
if (errors.length) throw new Error(`W9 preparation failed:\n${errors.join('\n')}`);

const slices = Array.from({ length: 10 }, (_, index) => ({
  id: `w9-slice-${String(index + 1).padStart(2, '0')}`,
  topics: categoryIds.map((categoryId) => manifestTopics.filter((topic) => topic.categoryId === categoryId)[index].topicId),
}));

const policy = {
  sentenceSegmentation: 'Intl.Segmenter ko sentence',
  rawClaimTextStored: false,
  bodyHashLocked: true,
  publicationRequiresAllClaimsAccepted: true,
  minimumIndependentSourceFamilies: 3,
  sectionClassifications: {
    overview: 'source-supported',
    scope: 'provenance-note',
    mechanism: 'source-supported',
    structure: 'editorial-synthesis',
    applications: 'editorial-synthesis',
    limitations: 'source-supported',
    distinctions: 'editorial-synthesis',
    'worked-example': 'editorial-guidance',
    practice: 'editorial-guidance',
  },
  evidenceSetBySection: {
    overview: 'concept',
    scope: 'provenance',
    mechanism: 'concept',
    structure: 'implementation',
    applications: 'implementation',
    limitations: 'limitations',
    distinctions: 'concept',
    'worked-example': 'implementation',
    practice: 'implementation',
  },
};

const rules = {
  version: VERSION,
  reviewedAt: REVIEWED_AT,
  reviewer: 'Codex W9 scaled production review',
  policy,
  factualSectionIds: FACTUAL_SECTION_IDS,
  articles: reviewRules,
};
const manifest = {
  version: VERSION,
  generatedAt: new Date().toISOString(),
  policy: {
    categories: 14,
    topicsPerCategory: 10,
    topicsPerSlice: 14,
    slices: 10,
    existingFirst: true,
    candidateOrder: 'ascending-rank',
  },
  totals: {
    topics: manifestTopics.length,
    remediatedExisting: manifestTopics.filter((topic) => topic.action === 'remediate-existing').length,
    newlyCreated: manifestTopics.filter((topic) => topic.action === 'create-new').length,
  },
  slices,
  topics: manifestTopics,
};

await mkdir('content-model/evidence', { recursive: true });
await Promise.all([
  writeFile('content-model/evidence/w9-batch-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  writeFile('content-model/evidence/w9-review-rules.json', `${JSON.stringify(rules, null, 2)}\n`, 'utf8'),
]);
console.log(`W9 preparation: ${manifestTopics.length} articles in ${slices.length} resumable slices; 93 remediated and 47 created`);

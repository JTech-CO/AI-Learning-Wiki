import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { topicFacts } from './w12-topic-facts.mjs';
import {
  FACTUAL_SECTION_IDS,
  REVIEWED_AT,
  VERSION,
  buildReviewRule,
  createW12Article,
  familyForW12,
  selectW12Targets,
  sourcesForW12,
} from './w12-content-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [queue, taxonomy, evidenceLedger, wikimedia, registry] = await Promise.all([
  readJson('content-model/evidence/w11-production-queue.json'),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/evidence/evidence-ledger.json'),
  readJson('content-model/evidence/wikimedia-metadata.json'),
  readJson('content-model/evidence/source-registry.json'),
]);

const targetQueueItems = selectW12Targets(queue);
const topicById = new Map(taxonomy.topics.map((topic) => [topic.id, topic]));
const researchById = new Map(evidenceLedger.topics.map((topic) => [topic.topicId, topic]));
const categoryIds = [...new Set(targetQueueItems.map((topic) => topic.categoryId))].sort();
const errors = [];
const manifestTopics = [];
const reviewRules = [];

for (const queueItem of targetQueueItems) {
  const topic = topicById.get(queueItem.topicId);
  const research = researchById.get(queueItem.topicId);
  if (!topic || !research) {
    errors.push(`${queueItem.topicId}: taxonomy or research card missing`);
    continue;
  }
  if (queueItem.state !== 'candidate' || queueItem.stage !== 'research-queued') errors.push(`${topic.id}: W12 target is not a queued candidate`);
  if (!topicFacts[topic.id]) errors.push(`${topic.id}: curated W12 fact profile missing`);
  const file = path.join('content-model', 'articles', `${topic.id}.article.json`);
  const sources = sourcesForW12(topic, research, wikimedia, registry);
  const families = new Set(sources.map(familyForW12));
  if (families.size < 3) errors.push(`${topic.id}: fewer than three source families before writing`);
  if (!sources.some((source) => source.type === 'encyclopedia')) errors.push(`${topic.id}: encyclopedia source missing`);
  if (!sources.some((source) => ['paper', 'standard', 'documentation', 'book'].includes(source.type))) errors.push(`${topic.id}: primary or official source missing`);
  const article = createW12Article(topic, sources);
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
  reviewRules.push(buildReviewRule(article, topic));
  manifestTopics.push({
    topicId: topic.id,
    categoryId: topic.primaryCategory,
    rank: topic.rank,
    tier: topic.tier,
    subarea: topic.subarea,
    previousState: queueItem.state,
    previousStage: queueItem.stage,
    action: 'create-new',
    titleKo: topic.titleKo,
    titleEn: topic.titleEn,
    sourceCount: article.sources.length,
    sourceFamilies: [...families].sort(),
    bodyChars: article.sections.map((section) => section.body).join('').length,
  });
}

for (const categoryId of categoryIds) {
  const members = manifestTopics.filter((topic) => topic.categoryId === categoryId);
  if (members.length !== 10) errors.push(`${categoryId}: expected 10 W12 topics, found ${members.length}`);
}
if (categoryIds.length !== 14) errors.push(`expected 14 categories, found ${categoryIds.length}`);
if (targetQueueItems.length !== 140 || manifestTopics.length !== 140) errors.push(`expected 140 new W12 topics, found ${manifestTopics.length}`);
if (new Set(targetQueueItems.map((topic) => topic.topicId)).size !== 140) errors.push('W12 target IDs are not unique');
if (errors.length) throw new Error(`W12 preparation failed:\n${errors.join('\n')}`);

const slices = Array.from({ length: 10 }, (_, index) => ({
  id: `w12-slice-${String(index + 1).padStart(2, '0')}`,
  topics: categoryIds.map((categoryId) => manifestTopics.filter((topic) => topic.categoryId === categoryId).sort((left, right) => left.rank - right.rank)[index].topicId),
}));
const policy = {
  sentenceSegmentation: 'Intl.Segmenter ko sentence',
  rawClaimTextStored: false,
  bodyHashLocked: true,
  publicationRequiresAllClaimsAccepted: true,
  minimumIndependentSourceFamilies: 3,
  minimumSectionCharacters: 450,
  duplicateParagraphsForbidden: true,
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
const manifest = {
  version: VERSION,
  generatedAt: new Date().toISOString(),
  policy: { categories: 14, newTopicsPerCategory: 10, topicsPerSlice: 14, slices: 10, candidateOrder: 'ascending-rank' },
  totals: { topics: 140, newlyCreated: 140, cumulativeArticles: 630 },
  slices,
  topics: manifestTopics,
};
const rules = { version: VERSION, reviewedAt: REVIEWED_AT, reviewer: 'Codex W12 expansion review', policy, factualSectionIds: FACTUAL_SECTION_IDS, articles: reviewRules };

await mkdir('content-model/evidence', { recursive: true });
await Promise.all([
  writeFile('content-model/evidence/w12-batch-manifest.json', `${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
  writeFile('content-model/evidence/w12-review-rules.json', `${JSON.stringify(rules, null, 2)}\n`, 'utf8'),
]);
console.log(`W12 preparation: ${manifestTopics.length} new articles in ${slices.length} resumable slices; 630 cumulative`);

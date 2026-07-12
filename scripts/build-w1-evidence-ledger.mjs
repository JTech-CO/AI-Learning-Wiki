import { readFile, writeFile } from 'node:fs/promises';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [topicLedger, w0Summary, wikimedia, registry, sourcePolicy, qualityPolicy] = await Promise.all([
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/taxonomy/w0-summary.json'),
  readJson('content-model/evidence/wikimedia-metadata.json'),
  readJson('content-model/evidence/source-registry.json'),
  readJson('content-model/taxonomy/source-policy.json'),
  readJson('content-model/taxonomy/quality-policy.json'),
]);

const researchPhase = (topic) => topic.state === 'existing'
  ? 'existing-enrichment'
  : `${topic.tier}-expansion`;
const manualReviewRequired = (topic) => topic.primaryCategory === 'safety' || topic.volatility === 'fast-changing';
const query = (value) => encodeURIComponent(value);

const topics = topicLedger.topics.map((topic) => ({
  topicId: topic.id,
  titleKo: topic.titleKo,
  titleEn: topic.titleEn,
  categoryId: topic.primaryCategory,
  subarea: topic.subarea,
  tier: topic.tier,
  state: topic.state,
  volatility: topic.volatility,
  researchPhase: researchPhase(topic),
  manualReviewRequired: manualReviewRequired(topic),
  wikimedia: wikimedia.topics[topic.id],
  discovery: {
    wikipediaKo: `https://ko.wikipedia.org/w/index.php?search=${query(topic.titleKo)}`,
    wikipediaEn: `https://en.wikipedia.org/w/index.php?search=${query(topic.titleEn)}`,
    wikidata: `https://www.wikidata.org/w/index.php?search=${query(topic.titleEn)}`,
    arxiv: `https://arxiv.org/search/?query=${query(topic.titleEn)}&searchtype=all`,
    crossref: `https://api.crossref.org/works?query.title=${query(topic.titleEn)}&rows=5&select=DOI,title,author,published,URL,type`,
    openalex: `https://openalex.org/works?search=${query(topic.titleEn)}`,
  },
  authoritativeAnchorIds: registry.categoryAnchors[topic.primaryCategory],
  evidenceTarget: {
    independentFamilies: sourcePolicy.sourcePackMinimum.independentFamilies,
    primarySources: sourcePolicy.sourcePackMinimum.primarySources,
    encyclopediaFamilies: sourcePolicy.sourcePackMinimum.encyclopediaFamilies,
    requiredFunctions: qualityPolicy.structure.requiredFunctions,
  },
}));

const phases = ['existing-enrichment', 'core-expansion', 'standard-expansion', 'brief-expansion'];
const batches = [];
for (const [categoryId] of Object.entries(registry.categoryAnchors)) {
  for (const phase of phases) {
    const members = topics.filter((topic) => topic.categoryId === categoryId && topic.researchPhase === phase);
    const mandatory = members.filter((topic) => topic.manualReviewRequired).map((topic) => topic.topicId);
    const minimumSample = Math.ceil(members.length * qualityPolicy.review.minimumManualSampleRateForOtherBatches);
    batches.push({
      id: `${categoryId}-${phase}`,
      categoryId,
      phase,
      topicIds: members.map((topic) => topic.topicId),
      topicCount: members.length,
      mandatoryManualReviewTopicIds: mandatory,
      minimumManualReviewCount: Math.max(mandatory.length, minimumSample),
    });
  }
}

const evidenceLedger = {
  version: 'W1-2026-07-13',
  generatedAt: wikimedia.collectedAt,
  topicCatalogSha256: w0Summary.catalogSha256,
  sourceRegistryVersion: registry.version,
  topics,
};

const summary = {
  version: 'W1-2026-07-13',
  generatedAt: wikimedia.collectedAt,
  totals: {
    topics: topics.length,
    existingEnrichment: topics.filter((topic) => topic.researchPhase === 'existing-enrichment').length,
    candidateExpansion: topics.filter((topic) => topic.state === 'candidate').length,
    manualReviewRequired: topics.filter((topic) => topic.manualReviewRequired).length,
    wikimediaKoFound: wikimedia.totals.koFound,
    wikimediaEnFound: wikimedia.totals.enFound,
    wikimediaBothFound: wikimedia.totals.bothFound,
    wikimediaNeitherFound: wikimedia.totals.neitherFound,
    batches: batches.length,
  },
  byCategory: Object.fromEntries(Object.keys(registry.categoryAnchors).map((categoryId) => {
    const members = topics.filter((topic) => topic.categoryId === categoryId);
    return [categoryId, {
      topics: members.length,
      koFound: members.filter((topic) => topic.wikimedia.ko).length,
      enFound: members.filter((topic) => topic.wikimedia.en).length,
      manualReviewRequired: members.filter((topic) => topic.manualReviewRequired).length,
    }];
  })),
};

await Promise.all([
  writeFile('content-model/evidence/evidence-ledger.json', `${JSON.stringify(evidenceLedger, null, 2)}\n`),
  writeFile('content-model/evidence/w1-batches.json', `${JSON.stringify({ version: 'W1-2026-07-13', generatedAt: wikimedia.collectedAt, batches }, null, 2)}\n`),
  writeFile('content-model/evidence/w1-summary.json', `${JSON.stringify(summary, null, 2)}\n`),
]);
console.log(`W1 evidence ledger: ${topics.length} research cards, ${batches.length} batches, ${summary.totals.manualReviewRequired} mandatory manual reviews`);

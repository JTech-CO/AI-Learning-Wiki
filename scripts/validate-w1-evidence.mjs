import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFile } from 'node:fs/promises';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [schema, topicLedger, w0Summary, evidence, wikimedia, registry, batchesFile, summary, qualityPolicy] = await Promise.all([
  readJson('content-model/schema.evidence-ledger.json'),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/taxonomy/w0-summary.json'),
  readJson('content-model/evidence/evidence-ledger.json'),
  readJson('content-model/evidence/wikimedia-metadata.json'),
  readJson('content-model/evidence/source-registry.json'),
  readJson('content-model/evidence/w1-batches.json'),
  readJson('content-model/evidence/w1-summary.json'),
  readJson('content-model/taxonomy/quality-policy.json'),
]);

const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(evidence)) errors.push(`evidence schema: ${ajv.errorsText(validate.errors)}`);
if (evidence.topicCatalogSha256 !== w0Summary.catalogSha256) errors.push('W0 catalog hash differs from the W1 evidence ledger');
if (evidence.sourceRegistryVersion !== registry.version) errors.push('source registry version mismatch');

const sourceIds = registry.sources.map((source) => source.id);
const sourceIdSet = new Set(sourceIds);
if (sourceIdSet.size !== sourceIds.length) errors.push('source registry ids must be unique');
if (registry.principles.storeThirdPartyProse !== false || registry.principles.registryAnchorsAreEvidence !== false) errors.push('source registry safety principles are invalid');

const categoryIds = new Set(topicLedger.topics.map((topic) => topic.primaryCategory));
for (const categoryId of categoryIds) {
  const anchors = registry.categoryAnchors[categoryId];
  if (!Array.isArray(anchors) || anchors.length < 3) errors.push(`${categoryId}: expected at least 3 authoritative anchors`);
  for (const anchor of anchors ?? []) if (!sourceIdSet.has(anchor)) errors.push(`${categoryId}: unknown source anchor ${anchor}`);
}

const topicById = new Map(topicLedger.topics.map((topic) => [topic.id, topic]));
const seenTopics = new Set();
for (const card of evidence.topics) {
  const topic = topicById.get(card.topicId);
  if (!topic) errors.push(`${card.topicId}: missing from W0 topic ledger`);
  if (seenTopics.has(card.topicId)) errors.push(`${card.topicId}: duplicate research card`);
  seenTopics.add(card.topicId);
  if (topic && (card.titleKo !== topic.titleKo || card.titleEn !== topic.titleEn || card.categoryId !== topic.primaryCategory || card.tier !== topic.tier || card.state !== topic.state)) errors.push(`${card.topicId}: research card differs from W0 topic`);
  if (JSON.stringify(card.authoritativeAnchorIds) !== JSON.stringify(registry.categoryAnchors[card.categoryId])) errors.push(`${card.topicId}: authoritative anchors differ from category registry`);
  if (card.manualReviewRequired !== (card.categoryId === 'safety' || card.volatility === 'fast-changing')) errors.push(`${card.topicId}: manual review flag mismatch`);
  if (card.wikimedia.ko && card.wikimedia.ko.language !== 'ko') errors.push(`${card.topicId}: invalid Korean Wikimedia reference`);
  if (card.wikimedia.en && card.wikimedia.en.language !== 'en') errors.push(`${card.topicId}: invalid English Wikimedia reference`);
}
if (seenTopics.size !== 1400 || topicById.size !== 1400) errors.push(`expected 1400 unique research cards, found ${seenTopics.size}`);

const metadataIds = Object.keys(wikimedia.topics);
if (metadataIds.length !== 1400 || metadataIds.some((id) => !topicById.has(id))) errors.push('Wikimedia metadata must cover all 1400 topic ids');
const koFound = Object.values(wikimedia.topics).filter((entry) => entry.ko).length;
const enFound = Object.values(wikimedia.topics).filter((entry) => entry.en).length;
const bothFound = Object.values(wikimedia.topics).filter((entry) => entry.ko && entry.en).length;
const neitherFound = Object.values(wikimedia.topics).filter((entry) => !entry.ko && !entry.en).length;
if (koFound !== wikimedia.totals.koFound || enFound !== wikimedia.totals.enFound || bothFound !== wikimedia.totals.bothFound || neitherFound !== wikimedia.totals.neitherFound) errors.push('Wikimedia metadata totals are invalid');

if (batchesFile.batches.length !== 56) errors.push(`expected 56 W1 batches, found ${batchesFile.batches.length}`);
const batchedTopicIds = [];
for (const batch of batchesFile.batches) {
  if (batch.topicCount !== batch.topicIds.length) errors.push(`${batch.id}: topic count mismatch`);
  const members = batch.topicIds.map((id) => evidence.topics.find((topic) => topic.topicId === id)).filter(Boolean);
  if (members.length !== batch.topicIds.length) errors.push(`${batch.id}: unknown topic in batch`);
  if (members.some((topic) => topic.categoryId !== batch.categoryId || topic.researchPhase !== batch.phase)) errors.push(`${batch.id}: category or phase mismatch`);
  const mandatory = members.filter((topic) => topic.manualReviewRequired).map((topic) => topic.topicId);
  if (JSON.stringify(mandatory) !== JSON.stringify(batch.mandatoryManualReviewTopicIds)) errors.push(`${batch.id}: mandatory review list mismatch`);
  const minimumSample = Math.ceil(batch.topicCount * qualityPolicy.review.minimumManualSampleRateForOtherBatches);
  if (batch.minimumManualReviewCount < Math.max(mandatory.length, minimumSample)) errors.push(`${batch.id}: manual review minimum too low`);
  batchedTopicIds.push(...batch.topicIds);
}
if (batchedTopicIds.length !== 1400 || new Set(batchedTopicIds).size !== 1400) errors.push('W1 batches must cover each topic exactly once');

const expectedExisting = topicLedger.topics.filter((topic) => topic.state === 'existing').length;
const expectedCandidates = 1400 - expectedExisting;
if (summary.totals.topics !== 1400 || summary.totals.existingEnrichment !== expectedExisting || summary.totals.candidateExpansion !== expectedCandidates || summary.totals.batches !== 56) errors.push('W1 summary totals are invalid');
if (summary.totals.wikimediaKoFound !== koFound || summary.totals.wikimediaEnFound !== enFound || summary.totals.wikimediaBothFound !== bothFound || summary.totals.wikimediaNeitherFound !== neitherFound) errors.push('W1 summary Wikimedia totals are invalid');

if (errors.length) {
  console.error(`W1 evidence validation: ${errors.length} error(s)\n${errors.slice(0, 100).join('\n')}`);
  process.exit(1);
}
console.log(`W1 evidence validation: 1400 research cards, 56 batches, Wikimedia ko ${koFound} / en ${enFound}, policies OK`);

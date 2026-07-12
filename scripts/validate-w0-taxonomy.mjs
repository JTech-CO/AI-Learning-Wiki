import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loadW0Taxonomy, readJson } from './w0-taxonomy-lib.mjs';

const [schema, ledger, summary, terminology, sourcePolicy, qualityPolicy, loaded] = await Promise.all([
  readJson('content-model/schema.topic-ledger.json'),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/taxonomy/w0-summary.json'),
  readJson('content-model/taxonomy/terminology.json'),
  readJson('content-model/taxonomy/source-policy.json'),
  readJson('content-model/taxonomy/quality-policy.json'),
  loadW0Taxonomy(),
]);

const errors = [...loaded.errors];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(ledger)) errors.push(`ledger schema: ${ajv.errorsText(validate.errors)}`);
if (JSON.stringify(ledger.topics) !== JSON.stringify(loaded.topics)) errors.push('topic-ledger.json does not match the seed catalog; run build-w0-taxonomy.mjs');
if (summary.catalogSha256 !== loaded.digest) errors.push('w0-summary catalog hash differs from seed catalog');
const expectedExisting = loaded.articles.length;
const expectedCandidates = 1400 - expectedExisting;
if (summary.totals.topics !== 1400 || summary.totals.existing !== expectedExisting || summary.totals.candidates !== expectedCandidates) errors.push(`W0 summary totals must be 1400/${expectedExisting}/${expectedCandidates}`);

for (const category of loaded.config.categories) {
  const members = ledger.topics.filter((topic) => topic.primaryCategory === category.id);
  if (members.length !== 100) errors.push(`${category.id}: ledger must contain 100 topics`);
  for (const [tier, quota] of Object.entries(loaded.config.tierQuota)) if (members.filter((topic) => topic.tier === tier).length !== quota) errors.push(`${category.id}/${tier}: tier quota mismatch`);
}

const terminologyIds = terminology.entries.map((entry) => entry.id);
if (new Set(terminologyIds).size !== terminologyIds.length) errors.push('terminology ids must be unique');
if (terminology.entries.length < 25) errors.push('terminology registry must contain at least 25 entries');
if (qualityPolicy.evidence.minimumIndependentSourceFamilies < 3 || qualityPolicy.evidence.minimumPrimarySources < 1) errors.push('quality policy source minimum is too low');
if (qualityPolicy.graph.minimumRelatedArticles < 3 || !qualityPolicy.graph.primaryCategoryCountsOnce) errors.push('quality policy graph requirements are incomplete');
if (qualityPolicy.review.minimumManualSampleRateForOtherBatches < 0.1) errors.push('manual sample rate must be at least 10%');

const sourceById = new Map(sourcePolicy.sources.map((source) => [source.id, source]));
if (!sourceById.has('wikipedia-ko-en') || !sourceById.has('grokipedia') || !sourceById.has('arxiv') || !sourceById.has('acl-anthology')) errors.push('required source policies are missing');
if (sourceById.get('grokipedia')?.countsTowardMinimum !== false || sourceById.get('grokipedia')?.allowedModes.includes('evidence')) errors.push('Grokipedia must remain discovery/metadata only');
if (sourcePolicy.storage.storeFullThirdPartyText !== false) errors.push('third-party full text storage must remain disabled');

if (errors.length) {
  console.error(`W0 taxonomy validation: ${errors.length} error(s)\n${errors.slice(0, 100).join('\n')}`);
  process.exit(1);
}
console.log(`W0 taxonomy validation: 14 categories × 100 = 1400 topics; ${expectedExisting} existing + ${expectedCandidates} candidates; policies OK`);

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const [schema, packsFile, verification, queueFile, summary, articles, topicLedger, w0Summary, w1Evidence, registry, qualityPolicy, pilotManifest] = await Promise.all([
  readJson('content-model/schema.evidence-pack.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/evidence/source-verification.json'),
  readJson('content-model/evidence/w2-remediation-queue.json'),
  readJson('content-model/evidence/w2-summary.json'),
  Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file)))),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/taxonomy/w0-summary.json'),
  readJson('content-model/evidence/evidence-ledger.json'),
  readJson('content-model/evidence/source-registry.json'),
  readJson('content-model/taxonomy/quality-policy.json'),
  readJson('content-model/evidence/w2-pilot-sources.json'),
]);

const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(packsFile)) errors.push(`evidence pack schema: ${ajv.errorsText(validate.errors)}`);
if (packsFile.topicCatalogSha256 !== w0Summary.catalogSha256) errors.push('W2 topic catalog hash mismatch');
if (!verification.policy.metadataOnly || verification.policy.storedProse || !verification.policy.reachabilityDoesNotProveRelevance) errors.push('W2 verification safety policy is invalid');

const expectedUrls = new Set();
for (const article of articles) for (const source of article.sources) expectedUrls.add(source.url);
for (const source of registry.sources) expectedUrls.add(source.canonicalUrl);
const verificationUrls = verification.sources.map((source) => source.url);
if (new Set(verificationUrls).size !== verificationUrls.length) errors.push('source verification URLs must be unique');
if (verificationUrls.length !== expectedUrls.size || verificationUrls.some((url) => !expectedUrls.has(url))) errors.push('source verification scope differs from article sources and registry anchors');
for (const source of verification.sources) {
  if (!['reachable', 'restricted', 'unavailable'].includes(source.state)) errors.push(`${source.url}: invalid verification state`);
  if (source.checkedAt !== verification.checkedAt) errors.push(`${source.url}: checkedAt differs from snapshot`);
}
const stateCount = (state) => verification.sources.filter((source) => source.state === state).length;
if (verification.totals.uniqueUrls !== verification.sources.length || verification.totals.reachable !== stateCount('reachable') || verification.totals.restricted !== stateCount('restricted') || verification.totals.unavailable !== stateCount('unavailable')) errors.push('source verification totals are invalid');

const articleById = new Map(articles.map((article) => [article.id, article]));
const topicById = new Map(topicLedger.topics.map((topic) => [topic.id, topic]));
const researchById = new Map(w1Evidence.topics.map((topic) => [topic.topicId, topic]));
const sourceId = (url) => `src-${createHash('sha256').update(url).digest('hex').slice(0, 12)}`;
const seenArticles = new Set();
const dayMap = {
  evergreen: qualityPolicy.review.evergreenReviewDays,
  periodic: qualityPolicy.review.periodicReviewDays,
  'fast-changing': qualityPolicy.review.fastChangingReviewDays,
};
const addDays = (date, days) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString();
};

for (const pack of packsFile.articles) {
  const article = articleById.get(pack.articleId);
  const topic = topicById.get(pack.articleId);
  const research = researchById.get(pack.articleId);
  if (!article || !topic || !research) {
    errors.push(`${pack.articleId}: missing article, topic or W1 research card`);
    continue;
  }
  if (seenArticles.has(pack.articleId)) errors.push(`${pack.articleId}: duplicate evidence pack`);
  seenArticles.add(pack.articleId);
  if (pack.titleKo !== article.title || pack.titleEn !== article.englishTitle || pack.categoryId !== topic.primaryCategory || pack.tier !== topic.tier || pack.volatility !== article.volatility) errors.push(`${pack.articleId}: metadata mismatch`);
  if (pack.reviewDueAt !== addDays(article.reviewedAt, dayMap[article.volatility])) errors.push(`${pack.articleId}: review due date mismatch`);
  if (JSON.stringify(pack.researchAnchorIds) !== JSON.stringify(research.authoritativeAnchorIds)) errors.push(`${pack.articleId}: research anchors differ from W1`);

  const ids = pack.sources.map((source) => source.id);
  const urls = pack.sources.map((source) => source.url);
  if (new Set(ids).size !== ids.length || new Set(urls).size !== urls.length) errors.push(`${pack.articleId}: duplicate pack source`);
  for (const source of pack.sources) if (source.id !== sourceId(source.url)) errors.push(`${pack.articleId}: unstable source id ${source.id}`);
  for (const source of article.sources) {
    const packed = pack.sources.find((item) => item.url === source.url);
    if (!packed || packed.origin !== 'article' || packed.relevanceStatus !== 'editor-linked') errors.push(`${pack.articleId}: article source missing from evidence pack: ${source.url}`);
  }
  const idSet = new Set(ids);
  const expectedSections = article.sections.map((section) => section.id);
  if (JSON.stringify(pack.sections.map((section) => section.sectionId)) !== JSON.stringify(expectedSections)) errors.push(`${pack.articleId}: section list mismatch`);
  for (const section of pack.sections) for (const id of section.candidateSourceIds) {
    const candidate = pack.sources.find((source) => source.id === id);
    if (!idSet.has(id)) errors.push(`${pack.articleId}/${section.sectionId}: unknown source candidate ${id}`);
    else if (candidate.relevanceStatus !== 'editor-linked') errors.push(`${pack.articleId}/${section.sectionId}: metadata-only source used as claim candidate ${id}`);
  }

  const editorLinkedSources = pack.sources.filter((source) => source.relevanceStatus === 'editor-linked');
  const independentFamilies = new Set(editorLinkedSources.map((source) => source.family)).size;
  const primaryCandidates = editorLinkedSources.filter((source) => source.primaryCandidate).length;
  const encyclopediaFamilies = new Set(editorLinkedSources.filter((source) => source.encyclopedia).map((source) => source.family)).size;
  const reachableSources = editorLinkedSources.filter((source) => ['verified', 'restricted'].includes(source.reachability)).length;
  const factualSections = pack.sections.filter((section) => section.factual).length;
  const sectionsWithCandidates = pack.sections.filter((section) => section.factual && section.candidateSourceIds.length).length;
  const gaps = [];
  if (independentFamilies < qualityPolicy.evidence.minimumIndependentSourceFamilies) gaps.push('source-diversity');
  if (primaryCandidates < qualityPolicy.evidence.minimumPrimarySources) gaps.push('primary-source');
  if (encyclopediaFamilies < 1) gaps.push('encyclopedia-source');
  if (pack.sources.some((source) => source.origin === 'article' && source.reachability === 'unavailable')) gaps.push('unavailable-editor-source');
  if (sectionsWithCandidates < factualSections) gaps.push('unmapped-factual-section');
  gaps.push('manual-claim-review');
  const expectedAudit = { independentFamilies, primaryCandidates, encyclopediaFamilies, reachableSources, factualSections, sectionsWithCandidates, readyForManualClaimReview: !gaps.some((gap) => gap !== 'manual-claim-review'), publicationReady: false, gaps };
  if (JSON.stringify(pack.audit) !== JSON.stringify(expectedAudit)) errors.push(`${pack.articleId}: audit calculation mismatch`);
}

if (seenArticles.size !== articles.length || packsFile.articles.length !== articles.length) errors.push(`expected ${articles.length} evidence packs, found ${packsFile.articles.length}`);
const pilotCategories = new Set();
if (pilotManifest.articles.length !== 14) errors.push(`expected 14 W2 pilot articles, found ${pilotManifest.articles.length}`);
for (const item of pilotManifest.articles) {
  const pack = packsFile.articles.find((candidate) => candidate.articleId === item.articleId);
  if (!pack) {
    errors.push(`${item.articleId}: W2 pilot pack missing`);
    continue;
  }
  pilotCategories.add(pack.categoryId);
  if (!pack.audit.readyForManualClaimReview) errors.push(`${item.articleId}: W2 pilot is not ready for manual claim review`);
  for (const source of item.sources) if (!pack.sources.some((candidate) => candidate.url === source.url && candidate.relevanceStatus === 'editor-linked')) errors.push(`${item.articleId}: curated pilot source missing: ${source.url}`);
}
if (pilotCategories.size !== 14) errors.push(`W2 pilot must cover 14 categories, found ${pilotCategories.size}`);
if (queueFile.queue.length !== articles.length || new Set(queueFile.queue.map((item) => item.articleId)).size !== articles.length) errors.push('remediation queue must cover every existing article exactly once');
const readyCount = packsFile.articles.filter((pack) => pack.audit.readyForManualClaimReview).length;
if (summary.totals.articles !== articles.length || summary.totals.readyForManualClaimReview !== readyCount || summary.totals.publicationReady !== 0 || summary.totals.remediationQueue !== articles.length) errors.push('W2 summary totals are invalid');
if (packsFile.articles.some((pack) => pack.audit.publicationReady)) errors.push('W2 automation must not mark any article publication-ready');

if (errors.length) {
  console.error(`W2 evidence validation: ${errors.length} error(s)\n${errors.slice(0, 100).join('\n')}`);
  process.exit(1);
}
console.log(`W2 evidence validation: ${articles.length} packs, ${verification.sources.length} URL checks, ${readyCount} ready for manual claim review, 0 auto-published`);

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  DEFAULT_EDITOR_QUALITY_MANIFEST,
  deriveArticleQualityContract,
  loadEditorQualityManifest,
  readJson,
  readText,
  sha256,
  verifyFrozenBaselines,
} from './editor-quality-runtime.mjs';

const validationMessage = (validate) => validate.errors
  ?.map((error) => `${error.instancePath || '/'} ${error.message}`)
  .join('; ') ?? 'unknown validation error';
const manifest = loadEditorQualityManifest();

assert.ok(fs.existsSync(manifest.outputs.canonical), 'current editor quality snapshot has not been built');
const snapshot = readJson(manifest.outputs.canonical);
const publicSnapshot = readJson(manifest.outputs.public);
const currentSchema = readJson(manifest.snapshot.schemaPath);
const legacySchema = readJson('content-model/schema.editor-quality-v1.json');
const articleSchema = readJson('content-model/schema.article.json');
const policy = readJson('content-model/taxonomy/quality-policy.json');
const taxonomy = readJson('content-model/taxonomy/categories.json');
const wiki = readJson('public/data/wiki-index.json');
const prompts = readJson('public/data/prompts.json');
const artifacts = readJson('public/data/snippets.json');
const registry = readJson('content-model/labs/registry.json');
const sourceVerification = readJson('content-model/evidence/source-verification.json');
const contract = deriveArticleQualityContract(articleSchema, policy);

const snapshotAjv = new Ajv2020({ allErrors: true, strict: false });
const articleAjv = new Ajv({ allErrors: true, strict: false });
addFormats(snapshotAjv);
addFormats(articleAjv);
snapshotAjv.addSchema(legacySchema);
const validateLegacySnapshot = snapshotAjv.getSchema(legacySchema.$id);
assert.ok(validateLegacySnapshot, 'legacy editor quality schema was not registered');
const validateSnapshot = snapshotAjv.compile(currentSchema);
const validateArticle = articleAjv.compile(articleSchema);
assert.equal(validateSnapshot(snapshot), true, validationMessage(validateSnapshot));
assert.equal(validateSnapshot(publicSnapshot), true, validationMessage(validateSnapshot));
assert.equal(readText(manifest.outputs.canonical), readText(manifest.outputs.public));

for (const baseline of verifyFrozenBaselines(manifest)) {
  assert.equal(baseline.intact, true, `${baseline.id}: frozen baseline hash changed`);
  const frozenSnapshot = readJson(baseline.path);
  assert.equal(validateLegacySnapshot(frozenSnapshot), true, `${baseline.id}: ${validationMessage(validateLegacySnapshot)}`);
}

const articles = fs.readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'))
  .sort()
  .map((file) => readJson(path.join('content-model/articles', file)));
const courses = fs.readdirSync('content-model/paths')
  .filter((file) => file.endsWith('.path.json'))
  .sort()
  .map((file) => readJson(path.join('content-model/paths', file)));
const articleIds = new Set(articles.map((article) => article.id));
const activeTools = registry.tools.filter((tool) => tool.status === 'active');

assert.equal(snapshot.schemaVersion, manifest.snapshot.schemaVersion);
assert.equal(snapshot.snapshotId, manifest.snapshot.id);
assert.equal(snapshot.formulaVersion, manifest.snapshot.formulaVersion);
assert.match(snapshot.asOf, /^\d{4}-\d{2}-\d{2}$/u);
assert.equal(snapshot.counts.articles, articles.length);
assert.equal(snapshot.counts.reviewedArticles, articles.filter(
  (article) => !contract.publicationStatus || article.status === contract.publicationStatus,
).length);
assert.equal(snapshot.counts.courses, courses.length);
assert.equal(snapshot.counts.prompts, prompts.prompts.length);
assert.equal(snapshot.counts.artifacts, artifacts.snippets.length);
assert.equal(snapshot.counts.activeTools, activeTools.length);
assert.equal(wiki.articles.length, articles.length);

let invalidSourceReferences = 0;
let factualSections = 0;
let evidencedFactualSections = 0;
let unresolvedRelations = 0;
let orphanArticles = 0;
let duplicateSectionIds = 0;
for (const article of articles) {
  assert.equal(validateArticle(article), true, `${article.id}: ${validationMessage(validateArticle)}`);
  if (contract.publicationStatus) assert.equal(article.status, contract.publicationStatus, `${article.id}: publication state`);
  assert.ok(article.sections.length >= contract.minimumSectionCount, `${article.id}: section minimum`);
  assert.ok(article.sources.length >= contract.minimumIndependentSourceFamilies, `${article.id}: source minimum`);
  duplicateSectionIds += article.sections.length - new Set(article.sections.map((section) => section.id)).size;
  const relations = [...article.prerequisites, ...article.related];
  if (relations.length === 0) orphanArticles += 1;
  for (const relation of relations) {
    if (!articleIds.has(relation)) unresolvedRelations += 1;
  }
  for (const section of article.sections) {
    const refs = section.sourceRefs ?? [];
    if (section.id !== 'check') {
      factualSections += 1;
      if (refs.length > 0) evidencedFactualSections += 1;
      else if (contract.sourceRefsRequiredForEveryFactualSection) {
        assert.fail(`${article.id}/${section.id}: evidence missing`);
      }
    }
    for (const sourceRef of refs) {
      if (!article.sources[sourceRef - 1]) invalidSourceReferences += 1;
    }
  }
}

const sectionCounts = articles.map((article) => article.sections.length);
assert.equal(snapshot.structure.minimumSectionCount, contract.minimumSectionCount);
assert.equal(snapshot.structure.recommendedSectionCountMin, contract.recommendedSectionCount.min);
assert.equal(snapshot.structure.recommendedSectionCountMax, contract.recommendedSectionCount.max);
assert.equal(snapshot.structure.validSectionCounts, sectionCounts.filter((count) => count >= contract.minimumSectionCount).length);
assert.equal(snapshot.structure.belowMinimumSections, sectionCounts.filter((count) => count < contract.minimumSectionCount).length);
assert.equal(snapshot.structure.belowRecommendedSections, sectionCounts.filter((count) => count < contract.recommendedSectionCount.min).length);
assert.equal(snapshot.structure.aboveRecommendedSections, sectionCounts.filter((count) => count > contract.recommendedSectionCount.max).length);
assert.equal(snapshot.structure.duplicateSectionIds, duplicateSectionIds);
assert.equal(snapshot.structure.unresolvedRelations, unresolvedRelations);
assert.equal(snapshot.structure.orphanArticles, orphanArticles);
assert.equal(snapshot.structure.publicIndexMatches, true);

const reviewDays = {
  evergreen: policy.review.evergreenReviewDays,
  periodic: policy.review.periodicReviewDays,
  'fast-changing': policy.review.fastChangingReviewDays,
};
const asOfTime = new Date(`${snapshot.asOf}T00:00:00.000Z`).getTime();
const day = 24 * 60 * 60 * 1000;
const expectedReviewCounts = {
  overdue: 0,
  dueWithin30Days: 0,
  dueWithin90Days: 0,
  currentBeyond90Days: 0,
};
for (const article of articles) {
  const reviewedTime = new Date(`${article.reviewedAt}T00:00:00.000Z`).getTime();
  const daysRemaining = Math.ceil((reviewedTime + reviewDays[article.volatility] * day - asOfTime) / day);
  if (daysRemaining < 0) expectedReviewCounts.overdue += 1;
  else if (daysRemaining <= 30) expectedReviewCounts.dueWithin30Days += 1;
  else if (daysRemaining <= 90) expectedReviewCounts.dueWithin90Days += 1;
  else expectedReviewCounts.currentBeyond90Days += 1;
}
assert.deepEqual(snapshot.review.counts, expectedReviewCounts);
assert.equal(Object.values(snapshot.review.counts).reduce((sum, value) => sum + value, 0), articles.length);
assert.equal(Object.values(snapshot.review.priorityCounts).reduce((sum, value) => sum + value, 0), snapshot.review.queue.length);
assert.equal(snapshot.counts.reviewQueue, snapshot.review.queue.length);
assert.equal(new Set(snapshot.review.queue.map((item) => item.id)).size, snapshot.review.queue.length);
for (const item of snapshot.review.queue) {
  assert.ok(articleIds.has(item.id), `${item.id}: queue article missing`);
  assert.notEqual(item.priority, 'current', `${item.id}: current article must not be queued`);
  assert.ok(item.reasons.length > 0, `${item.id}: queue reason missing`);
}
const priorityOrder = { blocking: 0, attention: 1, scheduled: 2 };
for (let index = 1; index < snapshot.review.queue.length; index += 1) {
  const previous = snapshot.review.queue[index - 1];
  const current = snapshot.review.queue[index];
  const order = priorityOrder[previous.priority] - priorityOrder[current.priority]
    || previous.dueAt.localeCompare(current.dueAt)
    || previous.title.localeCompare(current.title, 'ko');
  assert.ok(order <= 0, `review queue order changed at ${current.id}`);
}

const sourceByUrl = new Map(sourceVerification.sources.map((source) => [source.url, source]));
const articleSourceUrls = new Set(articles.flatMap((article) => article.sources.map((source) => source.url)));
const trackedSources = [...articleSourceUrls].map((url) => sourceByUrl.get(url)).filter(Boolean);
const sourceStateCount = (state) => trackedSources.filter((source) => source.state === state).length;
assert.equal(snapshot.evidence.uniqueArticleSourceUrls, articleSourceUrls.size);
assert.equal(snapshot.evidence.trackedSourceUrls, trackedSources.length);
assert.equal(snapshot.evidence.untrackedSourceUrls, articleSourceUrls.size - trackedSources.length);
assert.equal(snapshot.evidence.reachableSourceUrls, sourceStateCount('reachable'));
assert.equal(snapshot.evidence.restrictedSourceUrls, sourceStateCount('restricted'));
assert.equal(snapshot.evidence.unavailableSourceUrls, sourceStateCount('unavailable'));
assert.equal(snapshot.evidence.articlesMeetingSourceMinimum, articles.length);
assert.equal(snapshot.evidence.factualSections, factualSections);
assert.equal(snapshot.evidence.evidencedFactualSections, evidencedFactualSections);
assert.equal(snapshot.evidence.invalidSourceReferences, invalidSourceReferences);

assert.equal(snapshot.categories.length, taxonomy.categories.length);
for (const category of snapshot.categories) {
  assert.equal(category.articles, articles.filter((article) => article.categories.includes(category.id)).length);
}
assert.equal(snapshot.coverage.unresolvedCourseSteps, 0);
assert.equal(snapshot.coverage.missingActiveToolPages, 0);
assert.equal(snapshot.coverage.promptRecordsValid, prompts.prompts.length);
assert.equal(snapshot.coverage.artifactRecordsValid, artifacts.snippets.length);
assert.equal(snapshot.coverage.courseLinkedArticles, new Set(
  courses.flatMap((course) => course.steps.map((step) => step.ref)),
).size);
for (const course of courses) {
  for (const step of course.steps) assert.ok(articleIds.has(step.ref), `${course.id}: missing ${step.ref}`);
}
for (const tool of activeTools) {
  assert.ok(fs.existsSync(`src/content/docs${tool.route.slice(0, -1)}.mdx`), `${tool.id}: active route missing`);
}

if (snapshot.release.status === 'complete') {
  assert.ok(snapshot.release.htmlPages > 0);
  assert.ok(snapshot.release.internalLinkReferences >= 0);
  assert.equal(snapshot.release.brokenInternalLinks, 0);
  assert.ok(Object.values(snapshot.release.requiredRoutes).every(Boolean));
  assert.equal(snapshot.overallStatus, 'pass');
  assert.ok(fs.existsSync(manifest.outputs.release), 'release snapshot missing');
  assert.equal(readText(manifest.outputs.release), readText(manifest.outputs.public));
} else {
  assert.equal(snapshot.release.status, 'pending');
  assert.equal(snapshot.overallStatus, snapshot.gates.some((gate) => gate.status === 'blocking') ? 'blocking' : 'pending');
}
assert.equal(snapshot.gates.length, 8);
assert.ok(snapshot.gates.filter((gate) => gate.id !== 'static-build').every((gate) => gate.status === 'pass'));
assert.deepEqual(snapshot.provenance.inputsSha256, {
  manifest: sha256(readText(DEFAULT_EDITOR_QUALITY_MANIFEST)),
  articleSchema: sha256(readText('content-model/schema.article.json')),
  qualityPolicy: sha256(readText('content-model/taxonomy/quality-policy.json')),
  taxonomy: sha256(readText('content-model/taxonomy/categories.json')),
  wikiIndex: sha256(readText('public/data/wiki-index.json')),
  sourceVerification: sha256(readText('content-model/evidence/source-verification.json')),
  promptLibrary: sha256(readText('public/data/prompts.json')),
  artifactLibrary: sha256(readText('public/data/snippets.json')),
});

console.log(
  `Current editor quality validation: ${articles.length} reviewed articles, `
  + `${snapshot.review.queue.length} queued items, ${snapshot.asOf} snapshot passed`,
);

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv from 'ajv';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const validationMessage = (validate) => validate.errors
  ?.map((error) => `${error.instancePath || '/'} ${error.message}`)
  .join('; ') ?? 'unknown validation error';

const snapshot = readJson('content-model/quality/w60-editor-quality.json');
const publicSnapshot = readJson('public/data/editor-quality.json');
const schema = readJson('content-model/schema.editor-quality-v1.json');
const articleSchema = readJson('content-model/schema.article.json');
const wiki = readJson('public/data/wiki-index.json');
const prompts = readJson('public/data/prompts.json');
const artifacts = readJson('public/data/snippets.json');
const policy = readJson('content-model/taxonomy/quality-policy.json');
const taxonomy = readJson('content-model/taxonomy/categories.json');
const registry = readJson('content-model/labs/registry.json');
const sourceVerification = readJson('content-model/evidence/source-verification.json');

const snapshotAjv = new Ajv2020({ allErrors: true, strict: false });
const articleAjv = new Ajv({ allErrors: true, strict: false });
addFormats(snapshotAjv);
addFormats(articleAjv);
const validateSnapshot = snapshotAjv.compile(schema);
const validateArticle = articleAjv.compile(articleSchema);
assert.equal(validateSnapshot(snapshot), true, validationMessage(validateSnapshot));
assert.equal(validateSnapshot(publicSnapshot), true, validationMessage(validateSnapshot));
assert.equal(readText('content-model/quality/w60-editor-quality.json'), readText('public/data/editor-quality.json'));

const articleFiles = fs.readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'))
  .sort();
const articles = articleFiles.map((file) => readJson(`content-model/articles/${file}`));
const articleIds = new Set(articles.map((article) => article.id));
const pathFiles = fs.readdirSync('content-model/paths')
  .filter((file) => file.endsWith('.path.json'))
  .sort();
const courses = pathFiles.map((file) => readJson(`content-model/paths/${file}`));
const activeTools = registry.tools.filter((tool) => tool.status === 'active');

assert.equal(snapshot.milestone, 'W60');
assert.equal(snapshot.asOf, '2026-08-01');
assert.equal(snapshot.formulaVersion, 'editor-quality-v1');
assert.equal(snapshot.counts.articles, 1624);
assert.equal(snapshot.counts.reviewedArticles, 1624);
assert.equal(snapshot.counts.courses, 16);
assert.equal(snapshot.counts.prompts, 1500);
assert.equal(snapshot.counts.artifacts, 120);
assert.equal(snapshot.counts.activeTools, 4);
assert.equal(snapshot.counts.articles, articles.length);
assert.equal(snapshot.counts.courses, courses.length);
assert.equal(snapshot.counts.prompts, prompts.prompts.length);
assert.equal(snapshot.counts.artifacts, artifacts.snippets.length);
assert.equal(snapshot.counts.activeTools, activeTools.length);
assert.equal(wiki.articles.length, articles.length);

for (const article of articles) {
  assert.equal(validateArticle(article), true, `${article.id}: ${validationMessage(validateArticle)}`);
  assert.equal(article.status, 'reviewed', `${article.id}: non-reviewed article`);
  assert.equal(article.sections.length, 10, `${article.id}: section count changed`);
  assert.ok(article.sources.length >= 3, `${article.id}: insufficient sources`);
  for (const section of article.sections) {
    if (section.id !== 'check') assert.ok((section.sourceRefs ?? []).length > 0, `${article.id}/${section.id}: evidence missing`);
    for (const sourceRef of section.sourceRefs ?? []) {
      assert.ok(article.sources[sourceRef - 1], `${article.id}/${section.id}: invalid sourceRef ${sourceRef}`);
    }
  }
  for (const relation of [...article.prerequisites, ...article.related]) {
    assert.ok(articleIds.has(relation), `${article.id}: unresolved relation ${relation}`);
  }
}

assert.equal(
  Object.values(snapshot.review.counts).reduce((sum, value) => sum + value, 0),
  articles.length,
);
assert.equal(snapshot.review.counts.overdue, 0);
assert.equal(snapshot.review.counts.dueWithin30Days, 0);
assert.equal(snapshot.review.counts.dueWithin90Days, 203);
assert.equal(snapshot.review.counts.currentBeyond90Days, 1421);
assert.equal(
  Object.values(snapshot.review.priorityCounts).reduce((sum, value) => sum + value, 0),
  snapshot.review.queue.length,
);
assert.equal(snapshot.counts.reviewQueue, snapshot.review.queue.length);
assert.ok(snapshot.review.queue.length >= 203);
assert.equal(new Set(snapshot.review.queue.map((item) => item.id)).size, snapshot.review.queue.length);

const priorityOrder = { blocking: 0, attention: 1, scheduled: 2 };
for (let index = 1; index < snapshot.review.queue.length; index += 1) {
  const previous = snapshot.review.queue[index - 1];
  const current = snapshot.review.queue[index];
  const order = priorityOrder[previous.priority] - priorityOrder[current.priority]
    || previous.dueAt.localeCompare(current.dueAt)
    || previous.title.localeCompare(current.title, 'ko');
  assert.ok(order <= 0, `review queue order changed at ${current.id}`);
}

assert.equal(snapshot.evidence.uniqueArticleSourceUrls, sourceVerification.totals.articleUrls);
assert.equal(snapshot.evidence.trackedSourceUrls, sourceVerification.totals.articleUrls);
assert.equal(snapshot.evidence.untrackedSourceUrls, 0);
assert.equal(snapshot.evidence.reachableSourceUrls, sourceVerification.totals.reachable);
assert.equal(snapshot.evidence.restrictedSourceUrls, sourceVerification.totals.restricted);
assert.equal(snapshot.evidence.unavailableSourceUrls, sourceVerification.totals.unavailable);
assert.equal(snapshot.evidence.articlesMeetingSourceMinimum, articles.length);
assert.equal(
  snapshot.evidence.factualSections,
  articles.reduce((sum, article) => sum + article.sections.filter((section) => section.id !== 'check').length, 0),
);
assert.equal(snapshot.evidence.evidencedFactualSections, snapshot.evidence.factualSections);
assert.equal(snapshot.evidence.invalidSourceReferences, 0);
assert.equal(snapshot.structure.exactlyTenSections, articles.length);
assert.equal(snapshot.structure.unresolvedRelations, 0);
assert.equal(snapshot.structure.orphanArticles, 0);
assert.equal(snapshot.structure.publicIndexMatches, true);

assert.equal(snapshot.categories.length, taxonomy.categories.length);
assert.equal(snapshot.categories.reduce((sum, category) => sum + category.articles, 0), articles.length);
assert.equal(snapshot.categories.reduce((sum, category) => sum + category.overdue, 0), 0);
assert.equal(snapshot.coverage.unresolvedCourseSteps, 0);
assert.equal(snapshot.coverage.missingActiveToolPages, 0);
assert.equal(snapshot.coverage.promptRecordsValid, prompts.prompts.length);
assert.equal(snapshot.coverage.artifactRecordsValid, artifacts.snippets.length);
assert.ok(snapshot.coverage.courseLinkedArticles > 0);

assert.equal(snapshot.release.status, 'complete');
assert.ok(snapshot.release.htmlPages >= 1672);
assert.ok(snapshot.release.internalLinkReferences > 82965);
assert.equal(snapshot.release.brokenInternalLinks, 0);
assert.ok(Object.values(snapshot.release.requiredRoutes).every(Boolean));
assert.equal(snapshot.overallStatus, 'pass');
assert.equal(snapshot.gates.length, 8);
assert.ok(snapshot.gates.every((gate) => gate.status === 'pass'));

assert.deepEqual(snapshot.provenance.inputsSha256, {
  qualityPolicy: sha256(readText('content-model/taxonomy/quality-policy.json')),
  taxonomy: sha256(readText('content-model/taxonomy/categories.json')),
  wikiIndex: sha256(readText('public/data/wiki-index.json')),
  sourceVerification: sha256(readText('content-model/evidence/source-verification.json')),
  promptLibrary: sha256(readText('public/data/prompts.json')),
  artifactLibrary: sha256(readText('public/data/snippets.json')),
});
assert.equal(snapshot.provenance.qualityPolicyVersion, policy.version);
assert.equal(snapshot.provenance.sourceVerificationVersion, sourceVerification.version);

for (const course of courses) {
  for (const step of course.steps) assert.ok(articleIds.has(step.ref), `${course.id}: missing ${step.ref}`);
}
for (const tool of activeTools) {
  assert.ok(fs.existsSync(`src/content/docs${tool.route.slice(0, -1)}.mdx`), `${tool.id}: active route missing`);
}

for (const file of [
  'src/components/wiki/EditorQualityDashboard.astro',
  'src/content/docs/special/editor-quality.mdx',
  'src/styles/wiki-editor-quality.css',
  'scripts/build-w60-editor-quality.mjs',
  'scripts/check-w60-render.mjs',
]) assert.ok(fs.existsSync(file), `${file}: W60 implementation missing`);

const sidebar = readText('src/components/wiki/WikiSidebar.astro');
const home = readText('src/components/wiki/WikiHome.astro');
assert.match(sidebar, /\/special\/editor-quality\//);
assert.match(home, /\/special\/editor-quality\//);
assert.equal(readText('dist/data/editor-quality.json'), readText('public/data/editor-quality.json'));

console.log(
  `W60 validation: ${articles.length} reviewed articles, ${snapshot.review.queue.length} queued items, `
  + `${snapshot.release.htmlPages} pages and ${snapshot.release.internalLinkReferences} internal links passed`,
);

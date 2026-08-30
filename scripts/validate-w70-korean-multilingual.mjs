import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const quality = readJson('content-model/quality/w70-korean-multilingual.json');
const articleSchema = readJson('content-model/schema.article.json');
const pathSchema = readJson('content-model/schema.path.json');
const taxonomy = readJson('content-model/taxonomy/categories.json');
const course = readJson('content-model/paths/korean-multilingual-ai.path.json');
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateArticle = ajv.compile(articleSchema);
const validatePath = ajv.compile(pathSchema);

const articleFiles = fs.readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'));
const allArticles = articleFiles.map((file) => readJson(`content-model/articles/${file}`));
const allIds = new Set(allArticles.map(({ id }) => id));
const categoryIds = new Set(taxonomy.categories.map(({ id }) => id));
const officialHosts = new Set([
  'www.unicode.org',
  'www.korean.go.kr',
  'arxiv.org',
  'aclanthology.org',
  'datasets-benchmarks-proceedings.neurips.cc',
  'github.com',
  'www.pipc.go.kr',
  'csrc.nist.gov',
  'korquad.github.io',
  'www.kci.go.kr',
  'huggingface.co'
]);

assert.equal(quality.schemaVersion, '1.0');
assert.equal(quality.milestone, 'W70');
assert.equal(quality.reviewedAt, '2026-08-30');
assert.equal(quality.articleCount, 18);
assert.equal(quality.articleIds.length, 18);
assert.equal(new Set(quality.articleIds).size, 18);
assert.ok(Object.values(quality.gates).every(Boolean), 'W70 quality manifest contains a failed gate');
assert.equal(validatePath(course), true, ajv.errorsText(validatePath.errors));
assert.equal(course.id, 'korean-multilingual-ai');
assert.equal(course.title, '한국어·다국어 AI');
assert.ok(course.steps.length >= 30 && course.steps.length <= 40);
assert.equal(course.steps.length, quality.course.stepCount);

const titleSet = new Set();
const englishTitleSet = new Set();
for (const id of quality.articleIds) {
  const file = `content-model/articles/${id}.article.json`;
  assert.ok(fs.existsSync(file), `${id}: article file missing`);
  const article = readJson(file);
  assert.equal(validateArticle(article), true, `${id}: ${ajv.errorsText(validateArticle.errors)}`);
  assert.equal(article.id, id);
  assert.equal(article.status, 'reviewed');
  assert.equal(article.reviewedAt, '2026-08-30');
  assert.ok(article.sections.length >= 6, `${id}: fewer than six sections`);
  const bodyCharacters = article.sections.reduce((sum, section) => sum + section.body.length, 0);
  assert.ok(bodyCharacters >= 2200, `${id}: body depth ${bodyCharacters} < 2200`);
  assert.ok(article.sources.length >= 3 && article.sources.length <= 8, `${id}: source count out of range`);
  assert.ok(article.sources.every(({ type }) => type !== 'encyclopedia'), `${id}: encyclopedia source is not allowed`);
  const sourceHosts = new Set();
  for (const source of article.sources) {
    const url = new URL(source.url);
    assert.equal(url.protocol, 'https:', `${id}: non-HTTPS source ${source.url}`);
    assert.ok(officialHosts.has(url.hostname), `${id}: non-primary source host ${url.hostname}`);
    sourceHosts.add(url.hostname);
  }
  assert.ok(sourceHosts.size >= 2, `${id}: fewer than two source domains`);
  for (const section of article.sections) {
    if (section.id !== 'check') assert.ok((section.sourceRefs ?? []).length > 0, `${id}/${section.id}: missing sourceRefs`);
    for (const sourceRef of section.sourceRefs ?? []) {
      assert.ok(article.sources[sourceRef - 1], `${id}/${section.id}: invalid sourceRef ${sourceRef}`);
    }
  }
  for (const category of article.categories) assert.ok(categoryIds.has(category), `${id}: unknown category ${category}`);
  for (const relation of [...article.prerequisites, ...article.related]) {
    assert.ok(allIds.has(relation), `${id}: unresolved relation ${relation}`);
  }
  assert.equal(course.steps.filter(({ ref }) => ref === id).length, 1, `${id}: course placement must occur once`);
  assert.ok(!titleSet.has(article.title), `${id}: duplicate Korean title`);
  assert.ok(!englishTitleSet.has(article.englishTitle), `${id}: duplicate English title`);
  titleSet.add(article.title);
  englishTitleSet.add(article.englishTitle);
}

for (const step of course.steps) assert.ok(allIds.has(step.ref), `course: unresolved step ${step.ref}`);
assert.equal(new Set(course.steps.map(({ ref }) => ref)).size, course.steps.length, 'course: duplicate step');

console.log(`W70 validation: ${quality.articleCount} reviewed articles, ${course.steps.length} course steps, primary-source and depth gates passed.`);

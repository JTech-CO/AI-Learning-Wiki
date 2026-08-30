import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const generated = process.argv.includes('--generated');
const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(String(value).replace(/\r\n?/g, '\n')).digest('hex');
const catalogText = readText('content-model/research/p2-content-catalog.json');
const catalog = JSON.parse(catalogText);
const ledger = readJson('content-model/evidence/p2-claim-ledger.json');
const report = readJson('content-model/quality/p2-content-expansion.json');
const categoryIds = new Set(readJson('content-model/taxonomy/categories.json').categories.map((category) => category.id));
const articleFiles = fs.readdirSync('content-model/articles').filter((file) => file.endsWith('.article.json')).sort();
const courseFiles = fs.readdirSync('content-model/paths').filter((file) => file.endsWith('.path.json')).sort();
const allArticles = articleFiles.map((file) => readJson(`content-model/articles/${file}`));
const allArticleIds = new Set(allArticles.map((article) => article.id));
const allCourses = courseFiles.map((file) => readJson(`content-model/paths/${file}`));
const allCourseIds = new Set(allCourses.map((course) => course.id));
const p2Ids = catalog.groups.flatMap((group) => group.articleIds);
const ledgerById = new Map(ledger.articles.map((article) => [article.articleId, article]));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateArticle = ajv.compile(readJson('content-model/schema.article.json'));
const validatePath = ajv.compile(readJson('content-model/schema.path.json'));

assert.equal(catalog.schemaVersion, 1);
assert.equal(catalog.release, 'P2');
assert.equal(catalog.version, '1.3.0');
assert.equal(catalog.reviewedAt, '2026-08-30');
assert.deepEqual(catalog.baseline, { articles: 1624, courses: 24 });
assert.deepEqual(catalog.target, { articles: 1676, courses: 27 });
assert.equal(catalog.groups.length, 3);
assert.deepEqual(catalog.groups.map((group) => group.expectedArticles), [18, 18, 16]);
assert.equal(p2Ids.length, 52);
assert.equal(new Set(p2Ids).size, 52, 'P2 article IDs must be unique');
assert.equal(articleFiles.length, catalog.target.articles, 'canonical article count drifted');
assert.equal(courseFiles.length, catalog.target.courses, 'canonical course count drifted');
assert.equal(allArticleIds.size, articleFiles.length, 'canonical article IDs must be unique');
assert.equal(allCourseIds.size, courseFiles.length, 'canonical course IDs must be unique');

const p2Titles = new Set();
const p2EnglishTitles = new Set();
for (const group of catalog.groups) {
  assert.equal(group.articleIds.length, group.expectedArticles, `${group.id}: article target mismatch`);
  const course = readJson(`content-model/paths/${group.courseId}.path.json`);
  assert.equal(validatePath(course), true, `${group.courseId}: ${ajv.errorsText(validatePath.errors)}`);
  assert.equal(course.id, group.courseId);
  assert.equal(course.title, group.courseTitle);
  assert.ok(course.steps.length >= group.minimumCourseSteps && course.steps.length <= group.maximumCourseSteps, `${course.id}: course step range`);
  assert.equal(new Set(course.steps.map((step) => step.ref)).size, course.steps.length, `${course.id}: duplicate steps`);
  for (const step of course.steps) assert.ok(allArticleIds.has(step.ref), `${course.id}: missing article ${step.ref}`);

  for (const articleId of group.articleIds) {
    const articleFile = `content-model/articles/${articleId}.article.json`;
    assert.ok(fs.existsSync(articleFile), `${articleId}: canonical article missing`);
    const raw = readText(articleFile);
    const article = JSON.parse(raw);
    const evidence = ledgerById.get(articleId);
    assert.equal(validateArticle(article), true, `${articleId}: ${ajv.errorsText(validateArticle.errors)}`);
    assert.equal(article.id, articleId, `${articleId}: filename/ID mismatch`);
    assert.equal(article.status, 'reviewed', `${articleId}: article must be reviewed`);
    assert.equal(article.reviewedAt, catalog.reviewedAt, `${articleId}: review date mismatch`);
    assert.ok(article.sections.length >= 6, `${articleId}: at least six topic-specific sections required`);
    assert.ok(article.sections.reduce((sum, section) => sum + section.body.length, 0) >= 2200, `${articleId}: article body is too short`);
    assert.ok(article.sources.length >= 3 && article.sources.length <= 8, `${articleId}: expected 3-8 primary sources`);
    assert.ok(article.sources.every((source) => source.type !== 'encyclopedia'), `${articleId}: secondary encyclopedia source is not allowed in P2`);
    assert.ok(article.sources.every((source) => source.url.startsWith('https://')), `${articleId}: source must use HTTPS`);
    assert.ok(new Set(article.sources.map((source) => new URL(source.url).hostname)).size >= 2, `${articleId}: at least two independent primary-source domains required`);
    assert.ok(article.categories.every((category) => categoryIds.has(category)), `${articleId}: unknown category`);
    assert.doesNotMatch(JSON.stringify(article), /\bW(?:70|71|72|73|74)\b/iu, `${articleId}: planning or guide wording remains`);
    assert.doesNotMatch(`${article.title} ${article.englishTitle}`, /(.+?)\s*\(\1\)/iu, `${articleId}: duplicate bilingual title`);
    assert.ok(!p2Titles.has(article.title), `${articleId}: duplicate Korean title`);
    assert.ok(!p2EnglishTitles.has(article.englishTitle), `${articleId}: duplicate English title`);
    p2Titles.add(article.title);
    p2EnglishTitles.add(article.englishTitle);
    for (const ref of [...article.prerequisites, ...article.related]) assert.ok(allArticleIds.has(ref), `${articleId}: unresolved relation ${ref}`);
    for (const section of article.sections) {
      const refs = section.sourceRefs ?? [];
      if (!section.id.includes('check')) assert.ok(refs.length >= 1, `${articleId}/${section.id}: sourceRefs required`);
      for (const ref of refs) assert.ok(article.sources[ref - 1], `${articleId}/${section.id}: invalid sourceRef ${ref}`);
    }
    assert.equal(course.steps.filter((step) => step.ref === articleId).length, 1, `${articleId}: must appear exactly once in ${course.id}`);
    assert.ok(evidence, `${articleId}: evidence record missing`);
    assert.equal(evidence.articleSha256, sha256(raw), `${articleId}: evidence hash mismatch`);
    assert.equal(evidence.articleBodySha256, sha256(article.sections.map((section) => section.body).join('\n')), `${articleId}: body hash mismatch`);
  }
}

assert.equal(ledger.catalogSha256, sha256(catalogText), 'catalog hash mismatch');
assert.equal(ledger.totals.articles, 52);
assert.equal(ledger.articles.length, 52);
assert.ok(ledger.totals.sections >= 312, 'section coverage is too small');
assert.ok(ledger.totals.sources >= 156, 'primary-source coverage is too small');
assert.ok(ledger.totals.bodyCharacters >= 114400, 'P2 prose coverage is too small');
assert.deepEqual(report.current, catalog.target);
assert.equal(report.groups.length, 3);
assert.ok(Object.values(report.releaseGates).every(Boolean), 'P2 release gate failed');

if (generated) {
  const wiki = readJson('public/data/wiki-index.json');
  const publicArticleIds = new Set(wiki.articles.map((article) => article.id));
  const publicCourseIds = new Set(wiki.courses.map((course) => course.id));
  assert.deepEqual(wiki.counts, catalog.target, 'public wiki counts drifted');
  for (const group of catalog.groups) {
    assert.ok(publicCourseIds.has(group.courseId), `${group.courseId}: public course missing`);
    assert.ok(fs.existsSync(`dist/course/${group.courseId}/index.html`), `${group.courseId}: rendered course missing`);
    for (const articleId of group.articleIds) {
      const publicArticle = wiki.articles.find((article) => article.id === articleId);
      assert.ok(publicArticleIds.has(articleId), `${articleId}: public index entry missing`);
      assert.ok(publicArticle.courses.includes(group.courseId), `${articleId}: public course backlink missing`);
      assert.ok(fs.existsSync(`dist/wiki/${articleId}/index.html`), `${articleId}: rendered article missing`);
    }
  }
  const home = readText('dist/index.html');
  assert.match(home, /<strong>1,676<\/strong>개/u, 'home article count is stale');
  assert.match(home, /<strong>27<\/strong>개/u, 'home course count is stale');
}

console.log(`P2 content expansion valid: 52 reviewed articles, 3 courses, ${ledger.totals.sections} sections and ${ledger.totals.sources} primary sources${generated ? ' with rendered routes' : ''}`);

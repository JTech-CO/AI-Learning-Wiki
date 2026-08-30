import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readText = (file) => readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value.replace(/\r\n?/g, '\n')).digest('hex');
const catalogPath = 'content-model/research/w71-regulation-literacy-catalog.json';
const coursePath = 'content-model/paths/ai-regulation-literacy.path.json';
const catalogText = readText(catalogPath);
const catalog = JSON.parse(catalogText);
const courseText = readText(coursePath);
const course = JSON.parse(courseText);
const publication = readJson('content-model/research/w71-publication-report.json');
const quality = readJson('content-model/quality/w71-regulation-literacy.json');
const articleSchema = readJson('content-model/schema.article.json');
const pathSchema = readJson('content-model/schema.path.json');
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateArticle = ajv.compile(articleSchema);
const validatePath = ajv.compile(pathSchema);
const officialDomains = new Set(['law.go.kr', 'msit.go.kr', 'eur-lex.europa.eu', 'digital-strategy.ec.europa.eu']);

assert.equal(catalog.milestone, 'W71');
assert.equal(catalog.reviewedAt, '2026-08-30');
assert.equal(catalog.terms.length, 18);
assert.equal(new Set(catalog.terms.map(({ id }) => id)).size, 18);
assert.equal(new Set(catalog.terms.map(({ title }) => title)).size, 18);
assert.equal(new Set(catalog.terms.map(({ englishTitle }) => englishTitle)).size, 18);
assert.equal(validatePath(course), true, JSON.stringify(validatePath.errors));
assert.equal(course.id, 'ai-regulation-literacy');
assert.equal(course.title, 'AI 규제와 리터러시');
assert.ok(course.steps.length >= 30 && course.steps.length <= 40);
assert.equal(new Set(course.steps.map(({ ref }) => ref)).size, course.steps.length);

const allArticles = readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'))
  .map((file) => readJson('content-model/articles/' + file));
const allIds = new Set(allArticles.map(({ id }) => id));
const recordsById = new Map(publication.records.map((record) => [record.id, record]));
for (const term of catalog.terms) {
  const file = 'content-model/articles/' + term.id + '.article.json';
  const raw = readText(file);
  const article = JSON.parse(raw);
  assert.equal(validateArticle(article), true, term.id + ': ' + JSON.stringify(validateArticle.errors));
  assert.equal(article.id, term.id);
  assert.equal(article.title, term.title);
  assert.equal(article.englishTitle, term.englishTitle);
  assert.deepEqual(article.categories, ['safety']);
  assert.equal(article.status, 'reviewed');
  assert.equal(article.volatility, 'fast-changing');
  assert.equal(article.reviewedAt, '2026-08-30');
  assert.ok(article.sections.length >= 6, term.id + ': fewer than six sections');
  assert.ok(article.sections.reduce((sum, section) => sum + section.body.length, 0) >= 2200, term.id + ': body too short');
  assert.ok(article.sources.length >= 3 && article.sources.length <= 8, term.id + ': source count');
  assert.ok(article.sources.every(({ type }) => type !== 'encyclopedia'), term.id + ': encyclopedia source');
  const domains = new Set();
  for (const source of article.sources) {
    const url = new URL(source.url);
    const domain = url.hostname.replace(/^www\./, '');
    assert.equal(url.protocol, 'https:', term.id + ': source must use HTTPS');
    assert.ok(officialDomains.has(domain), term.id + ': non-official source domain ' + domain);
    domains.add(domain);
  }
  assert.ok(domains.size >= 2, term.id + ': fewer than two independent official domains');
  for (const section of article.sections) {
    if (section.id !== 'check') assert.ok((section.sourceRefs ?? []).length > 0, term.id + '/' + section.id + ': no sourceRefs');
    for (const sourceRef of section.sourceRefs ?? []) {
      assert.ok(article.sources[sourceRef - 1], term.id + '/' + section.id + ': invalid sourceRef ' + sourceRef);
    }
  }
  for (const ref of [...article.prerequisites, ...article.related]) {
    assert.ok(allIds.has(ref), term.id + ': unresolved relation ' + ref);
  }
  assert.equal(course.steps.filter(({ ref }) => ref === term.id).length, 1, term.id + ': course placement');
  const record = recordsById.get(term.id);
  assert.ok(record, term.id + ': publication record missing');
  assert.equal(record.sha256, sha256(raw), term.id + ': article hash changed');
  assert.equal(record.sectionCount, article.sections.length);
  assert.equal(record.bodyLength, article.sections.reduce((sum, section) => sum + section.body.length, 0));
  assert.equal(record.sourceCount, article.sources.length);
}
for (const { ref } of course.steps) assert.ok(allIds.has(ref), 'course unresolved article ' + ref);

assert.equal(publication.milestone, 'W71');
assert.equal(publication.reviewedAt, '2026-08-30');
assert.equal(publication.addedArticles, 18);
assert.equal(publication.courseSteps, course.steps.length);
assert.deepEqual(publication.articleIds, catalog.terms.map(({ id }) => id));
assert.equal(quality.milestone, 'W71');
assert.equal(quality.reviewedAt, '2026-08-30');
assert.equal(quality.corpus.articles, 18);
assert.ok(quality.corpus.minimumSections >= 6);
assert.ok(quality.corpus.minimumBodyCharacters >= 2200);
assert.ok(quality.corpus.minimumSources >= 3);
assert.ok(quality.corpus.minimumSourceDomains >= 2);
assert.ok(Object.values(quality.releaseGates).every(Boolean), 'W71 release gate failed');
assert.equal(quality.catalogSha256, sha256(catalogText));
assert.equal(quality.courseSha256, sha256(courseText));

console.log('W71 validation: 18 reviewed regulation articles, ' + course.steps.length + ' course steps, official multi-domain evidence passed.');

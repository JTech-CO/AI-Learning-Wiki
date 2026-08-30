import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const canonicalText = (value) => value.replace(/\r\n?/g, '\n');
const sha256 = (value) => createHash('sha256').update(canonicalText(value)).digest('hex');
const catalogText = readText('content-model/research/w59-term-catalog.json');
const catalog = JSON.parse(catalogText);
const publication = readJson('content-model/research/w59-publication-report.json');
const ledger = readJson('content-model/evidence/w59-claim-ledger.json');
const registry = readJson('content-model/labs/registry.json');
const wiki = readJson('public/data/wiki-index.json');
const report = readJson('content-model/quality/w59-term-integration.json');
const articleSchema = readJson('content-model/schema.article.json');
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateArticle = ajv.compile(articleSchema);

const articleFiles = fs.readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'));
const allArticles = articleFiles.map((file) =>
  readJson('content-model/articles/' + file));
const allArticleIds = new Set(allArticles.map((article) => article.id));
const publicIds = new Set(wiki.articles.map((article) => article.id));
const ledgerById = new Map(ledger.articles.map((record) => [record.articleId, record]));
const toolById = new Map(registry.tools.map((tool) => [tool.id, tool]));
const courseById = new Map(
  [...new Set(catalog.terms.map((term) => term.courseId))].map((id) => [
    id,
    readJson('content-model/paths/' + id + '.path.json'),
  ]),
);

assert.equal(catalog.milestone, 'W59');
assert.equal(catalog.reviewedAt, '2026-08-01');
assert.equal(catalog.baselineArticleCount, 1600);
assert.equal(catalog.terms.length, 24);
assert.equal(new Set(catalog.terms.map((term) => term.id)).size, 24);
assert.equal(new Set(catalog.terms.map((term) => term.title)).size, 24);
assert.equal(new Set(catalog.terms.map((term) => term.englishTitle)).size, 24);
assert.ok(articleFiles.length >= 1624, 'current corpus dropped below the W59 article baseline');
assert.ok(wiki.articles.length >= 1624, 'public corpus dropped below the W59 article baseline');
assert.deepEqual(publication.before, { articles: 1600 });
assert.deepEqual(publication.added, { articles: 24 });
assert.deepEqual(publication.after, { articles: 1624 });
assert.deepEqual(ledger.totals, { articles: 24, claimUnits: 240, sources: 126 });
assert.equal(
  ledger.catalogSha256,
  sha256(catalogText),
);
const catalogLf = canonicalText(catalogText);
assert.equal(
  sha256(catalogLf),
  sha256(catalogLf.replace(/\n/g, '\r\n')),
  'catalog hash must not depend on line endings',
);

const categoryCounts = {};
const courseCounts = {};
const toolCounts = {};
for (const term of catalog.terms) {
  const articleFile = 'content-model/articles/' + term.id + '.article.json';
  const articleRaw = readText(articleFile);
  const article = JSON.parse(articleRaw);
  const record = ledgerById.get(term.id);
  const course = courseById.get(term.courseId);
  const tool = toolById.get(term.toolId);

  assert.equal(validateArticle(article), true, term.id + ': article schema invalid');
  assert.equal(article.title, term.title, term.id + ': Korean title mismatch');
  assert.equal(article.englishTitle, term.englishTitle, term.id + ': English title mismatch');
  assert.ok(article.categories.includes(term.category), term.id + ': category mismatch');
  assert.equal(article.status, 'reviewed', term.id + ': review status');
  assert.equal(article.reviewedAt, '2026-08-01', term.id + ': review date');
  assert.equal(article.sections.length, 10, term.id + ': section count');
  assert.ok(
    article.sections.reduce((sum, section) => sum + section.body.length, 0) >= 4000,
    term.id + ': article body too short',
  );
  assert.ok(article.sources.length >= 3, term.id + ': insufficient sources');
  for (const section of article.sections) {
    const sourceRefs = section.sourceRefs ?? [];
    if (section.id !== 'check') assert.ok(sourceRefs.length >= 1, term.id + '/' + section.id + ': missing evidence');
    for (const sourceRef of sourceRefs) {
      assert.ok(article.sources[sourceRef - 1], term.id + '/' + section.id + ': invalid sourceRef');
    }
  }
  for (const ref of [...article.prerequisites, ...article.related]) {
    assert.ok(allArticleIds.has(ref), term.id + ': unresolved article relation ' + ref);
  }

  assert.ok(record, term.id + ': claim ledger entry missing');
  assert.equal(record.articleSha256, sha256(articleRaw), term.id + ': article hash changed');
  assert.equal(
    record.articleBodySha256,
    sha256(article.sections.map((section) => section.body).join('\n')),
    term.id + ': article body hash changed',
  );
  assert.equal(record.claimUnits.length, 10, term.id + ': claim unit count');
  for (const claim of record.claimUnits) {
    const section = article.sections.find(({ id }) => id === claim.sectionId);
    assert.ok(section, term.id + ': missing locked section ' + claim.sectionId);
    assert.equal(claim.textSha256, sha256(section.body), term.id + ': claim text hash');
    assert.deepEqual(claim.sourceRefs, section.sourceRefs ?? [], term.id + ': claim sources');
  }

  assert.ok(course, term.id + ': course missing');
  assert.equal(
    course.steps.filter((step) => step.ref === term.id).length,
    1,
    term.id + ': course link must occur exactly once',
  );
  assert.ok(tool, term.id + ': tool missing');
  assert.equal(
    tool.contentLinks.wikiSlugs.filter((slug) => slug === term.id).length,
    1,
    term.id + ': tool link must occur exactly once',
  );
  assert.ok(publicIds.has(term.id), term.id + ': public index entry missing');

  categoryCounts[term.category] = (categoryCounts[term.category] ?? 0) + 1;
  courseCounts[term.courseId] = (courseCounts[term.courseId] ?? 0) + 1;
  toolCounts[term.toolId] = (toolCounts[term.toolId] ?? 0) + 1;
}

for (const counts of [categoryCounts, courseCounts, toolCounts]) {
  assert.equal(Object.keys(counts).length, 4);
  assert.ok(Object.values(counts).every((count) => count === 6));
}
assert.deepEqual(categoryCounts, publication.categoryCounts);
assert.deepEqual(courseCounts, publication.courseCounts);
assert.deepEqual(toolCounts, publication.toolCounts);

assert.equal(report.milestone, 'W59');
assert.deepEqual(report.corpus, {
  baselineArticles: 1600,
  addedArticles: 24,
  expectedArticles: 1624,
  canonicalArticles: 1624,
  publicArticles: 1624,
});
assert.equal(report.evidence.catalogTerms, 24);
assert.equal(report.evidence.reviewedArticles, 24);
assert.equal(report.evidence.sectionClaims, 240);
assert.equal(report.evidence.sourceReferences, 126);
assert.ok(report.evidence.minimumBodyCharacters >= 4000);
assert.equal(report.connections.length, 24);
assert.ok(Object.values(report.releaseGates).every(Boolean), 'W59 release gate failed');
for (const [file, fingerprint] of Object.entries(report.implementation)) {
  const implementationText = canonicalText(readText(file));
  assert.equal(fingerprint.bytes, Buffer.byteLength(implementationText), file + ': byte count changed');
  assert.equal(fingerprint.sha256, sha256(implementationText), file + ': fingerprint changed');
}

console.log(
  'W59 validation: 24 reviewed terms, four categories, four courses, '
  + 'four tools, 240 claims and 126 sources passed',
);

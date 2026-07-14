import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { loadW19Inputs } from './w19-quality-lib.mjs';
import { BANNED_LITERAL_TRANSLATIONS, countParticleIssues } from './w20-korean-lib.mjs';
import { countArticleDuplicateBlocks, sha256, W21_VERSION } from './w21-duplicate-lib.mjs';
import { buildW21DepthRemediation, buildW21QualityArtifacts } from './w21-quality-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [baseline, report, storedAudit, storedQueue, storedDepth, policy, inputs] = await Promise.all([
  readJson('content-model/quality/w20-quality-audit.json'),
  readJson('content-model/quality/w21-deduplication-report.json'),
  readJson('content-model/quality/w21-quality-audit.json'),
  readJson('content-model/quality/w21-remediation-queue.json'),
  readJson('content-model/quality/w21-depth-remediation.json'),
  readJson('content-model/quality/w21-deduplication-policy.json'),
  loadW19Inputs(),
]);
const expected = buildW21QualityArtifacts(inputs, baseline);
assert.deepEqual(storedAudit, expected.audit, 'W21 quality audit differs from current corpus');
assert.deepEqual(storedQueue, expected.queue, 'W21 remediation queue differs from current corpus');
const expectedDepth = buildW21DepthRemediation(expected.audit, report);
assert.deepEqual(storedDepth, expectedDepth, 'W21 depth remediation queue differs from current corpus');
assert.equal(report.version, W21_VERSION);
assert.equal(policy.version, W21_VERSION);
assert.equal(report.totals.articlesScanned, 1400);
assert.equal(report.totals.articlesChanged, baseline.totals.issues['duplicate-paragraph']);
assert.equal(report.totals.beforeDuplicateParagraphs, baseline.articles.reduce((sum, item) => sum + item.duplicateParagraphCount, 0));
assert.equal(report.totals.paragraphsRemoved, report.totals.beforeDuplicateParagraphs);
assert.equal(report.totals.afterDuplicateParagraphs, 0);
assert.ok(!('duplicate-paragraph' in storedAudit.totals.issues));
assert.equal(storedDepth.totals.queued, 200);
assert.equal(storedDepth.totals.deduplicationRevealed, 132);
assert.equal(storedDepth.totals.preExisting, 68);
const baselineById = new Map(baseline.articles.map((item) => [item.articleId, item]));
const reportById = new Map(report.changes.map((item) => [item.articleId, item]));
assert.equal(reportById.size, report.totals.articlesChanged);
for (const { article, raw } of inputs.loaded) {
  assert.equal(countArticleDuplicateBlocks(article).total, 0, `${article.id}: duplicate paragraph remains`);
  assert.equal(countParticleIssues(article).total, 0, `${article.id}: contextual particle issue regressed`);
  const baselineItem = baselineById.get(article.id);
  const changed = sha256(raw) !== baselineItem.contentSha256;
  assert.equal(reportById.has(article.id), changed, `${article.id}: W21 report differs from corpus hash`);
  if (changed) {
    const item = reportById.get(article.id);
    assert.equal(item.beforeHash, baselineItem.contentSha256);
    assert.equal(item.afterHash, sha256(raw));
  }
}
const dataFiles = (await readdir('content-model/data', { recursive: true })).filter((file) => String(file).endsWith('.json'));
const searchable = [...inputs.loaded.map(({ raw }) => raw), ...(await Promise.all(dataFiles.map((file) => readFile(path.join('content-model/data', file), 'utf8'))))].join('\n');
for (const phrase of BANNED_LITERAL_TRANSLATIONS) assert.ok(!searchable.includes(phrase), `contextless literal translation remains: ${phrase}`);
assert.equal(policy.retainOccurrence, 'first');
assert.equal(policy.removePairedBoldHeading, true);
console.log(`W21 duplicate validation: ${report.totals.articlesChanged} articles, ${report.totals.paragraphsRemoved} paragraphs removed, quality ${report.totals.baselineQualityAverage}->${report.totals.postQualityAverage}`);

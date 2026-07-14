import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { buildW20QualityArtifacts } from './w20-quality-lib.mjs';
import { BANNED_LITERAL_TRANSLATIONS, countParticleIssues, sha256, W20_VERSION } from './w20-korean-lib.mjs';
import { loadW19Inputs } from './w19-quality-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [baseline, report, storedAudit, storedQueue, policy, inputs] = await Promise.all([
  readJson('content-model/quality/w19-quality-audit.json'),
  readJson('content-model/quality/w20-language-normalization.json'),
  readJson('content-model/quality/w20-quality-audit.json'),
  readJson('content-model/quality/w20-remediation-queue.json'),
  readJson('content-model/quality/w20-language-policy.json'),
  loadW19Inputs(),
]);
const expected = buildW20QualityArtifacts(inputs, baseline);
assert.deepEqual(storedAudit, expected.audit, 'W20 quality audit differs from current corpus');
assert.deepEqual(storedQueue, expected.queue, 'W20 remediation queue differs from current corpus');
assert.equal(report.version, W20_VERSION);
assert.equal(policy.version, W20_VERSION);
assert.equal(report.totals.articlesScanned, 1400);
const baselineParticleErrors = baseline.articles.reduce((sum, item) => sum + item.contextualParticleErrors, 0);
assert.ok(report.totals.beforeContextualParticleErrors >= baselineParticleErrors);
assert.ok(report.totals.articlesChanged >= baseline.totals.issues['contextual-particle']);
assert.equal(report.totals.afterContextualParticleErrors, 0);
assert.equal(report.totals.afterExtendedParticleErrors, 0);
assert.equal(report.replacementsByKind.core, report.totals.beforeContextualParticleErrors);
assert.equal(report.totals.replacements, report.replacementsByKind.total);

const baselineById = new Map(baseline.articles.map((item) => [item.articleId, item]));
const reportById = new Map(report.changes.map((item) => [item.articleId, item]));
assert.equal(reportById.size, report.totals.articlesChanged);
for (const { article, raw } of inputs.loaded) {
  const issues = countParticleIssues(article);
  assert.equal(issues.total, 0, `${article.id}: contextual particle issue remains`);
  const baselineItem = baselineById.get(article.id);
  const changed = sha256(raw) !== baselineItem.contentSha256;
  assert.equal(reportById.has(article.id), changed, `${article.id}: W20 change report differs from corpus hash`);
  if (changed) {
    const item = reportById.get(article.id);
    assert.equal(item.beforeHash, baselineItem.contentSha256, `${article.id}: W20 before hash differs from W19`);
    assert.equal(item.afterHash, sha256(raw), `${article.id}: W20 after hash differs from current source`);
  }
}
const dataFiles = (await readdir('content-model/data', { recursive: true })).filter((file) => String(file).endsWith('.json'));
const searchable = [
  ...inputs.loaded.map(({ raw }) => raw),
  ...(await Promise.all(dataFiles.map((file) => readFile(path.join('content-model/data', file), 'utf8')))),
].join('\n');
for (const phrase of BANNED_LITERAL_TRANSLATIONS) assert.ok(!searchable.includes(phrase), `contextless literal translation remains: ${phrase}`);
assert.deepEqual(policy.bannedLiteralTranslations, BANNED_LITERAL_TRANSLATIONS);
console.log(`W20 language validation: ${report.totals.articlesChanged} articles normalized, ${report.totals.replacements} particle corrections, quality ${report.totals.baselineQualityAverage}->${report.totals.postQualityAverage}`);

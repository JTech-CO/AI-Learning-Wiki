import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { BANNED_LITERAL_TRANSLATIONS, W20_VERSION } from './w20-korean-lib.mjs';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [baseline, report, audit, queue, policy] = await Promise.all([
  readJson('content-model/quality/w19-quality-audit.json'),
  readJson('content-model/quality/w20-language-normalization.json'),
  readJson('content-model/quality/w20-quality-audit.json'),
  readJson('content-model/quality/w20-remediation-queue.json'),
  readJson('content-model/quality/w20-language-policy.json'),
]);
assert.equal(report.version, W20_VERSION);
assert.equal(audit.version, W20_VERSION);
assert.equal(queue.version, W20_VERSION);
assert.equal(policy.version, W20_VERSION);
assert.equal(audit.corpus.articles, 1400);
assert.equal(audit.corpus.categories, 14);
assert.equal(report.totals.articlesScanned, 1400);
assert.equal(report.totals.afterContextualParticleErrors, 0);
assert.equal(report.totals.afterExtendedParticleErrors, 0);
assert.equal(report.replacementsByKind.core, report.totals.beforeContextualParticleErrors);
assert.equal(report.totals.replacements, report.replacementsByKind.total);
assert.equal(report.currentCorpusSha256, audit.corpus.sha256);
assert.equal(queue.corpusSha256, audit.corpus.sha256);
assert.deepEqual(policy.bannedLiteralTranslations, BANNED_LITERAL_TRANSLATIONS);
const corpusHash = sha256(audit.articles.map((item) => `${item.articleId}:${item.contentSha256}`).join('\n'));
assert.equal(audit.corpus.sha256, corpusHash, 'W20 frozen corpus hash is internally inconsistent');
const baselineById = new Map(baseline.articles.map((item) => [item.articleId, item]));
const auditById = new Map(audit.articles.map((item) => [item.articleId, item]));
const reportById = new Map(report.changes.map((item) => [item.articleId, item]));
assert.equal(reportById.size, report.totals.articlesChanged);
for (const item of audit.articles) {
  const before = baselineById.get(item.articleId);
  assert.ok(before, `${item.articleId}: missing from W19 baseline`);
  const changed = before.contentSha256 !== item.contentSha256;
  assert.equal(reportById.has(item.articleId), changed, `${item.articleId}: W20 report differs from frozen hashes`);
  assert.equal(item.contextualParticleErrors, 0, `${item.articleId}: W20 frozen audit retains particle errors`);
  if (changed) {
    const change = reportById.get(item.articleId);
    assert.equal(change.beforeHash, before.contentSha256);
    assert.equal(change.afterHash, item.contentSha256);
  }
}
for (const [index, item] of queue.items.entries()) {
  assert.equal(item.rank, index + 1);
  const source = auditById.get(item.articleId);
  assert.ok(source, `${item.articleId}: W20 queue item missing from audit`);
  assert.equal(item.priority, source.priority);
  assert.equal(item.score, source.score);
  assert.deepEqual(item.issueCodes, source.issueCodes);
}
console.log(`W20 frozen language validation: ${report.totals.articlesChanged} articles, ${report.totals.replacements} particle corrections, quality ${report.totals.baselineQualityAverage}->${report.totals.postQualityAverage}`);

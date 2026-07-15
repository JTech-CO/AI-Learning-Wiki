import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadW19Inputs } from './w19-quality-lib.mjs';
import { countParticleIssues } from './w20-korean-lib.mjs';
import { countArticleDuplicateBlocks, sha256 } from './w21-duplicate-lib.mjs';
import { buildW23DepthRemediation, buildW23QualityArtifacts, W23_VERSION } from './w23-quality-lib.mjs';
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [baselineAudit, baselineDepth, report, storedAudit, storedQueue, storedDepth, policy, languageAudit, inputs] = await Promise.all([
  readJson('content-model/quality/w22-quality-audit.json'),
  readJson('content-model/quality/w22-depth-remediation.json'),
  readJson('content-model/quality/w23-restoration-report.json'),
  readJson('content-model/quality/w23-quality-audit.json'),
  readJson('content-model/quality/w23-remediation-queue.json'),
  readJson('content-model/quality/w23-depth-remediation.json'),
  readJson('content-model/quality/w23-restoration-policy.json'),
  readJson('content-model/evidence/w36-language-audit.json'),
  loadW19Inputs(),
]);
const expected = buildW23QualityArtifacts(inputs, baselineAudit);
assert.deepEqual(storedAudit, expected.audit, 'W23 audit differs from current corpus');
assert.deepEqual(storedQueue, expected.queue, 'W23 queue differs from current corpus');
assert.deepEqual(storedDepth, buildW23DepthRemediation(expected.audit, baselineDepth), 'W23 depth queue differs from current corpus');
assert.equal(report.version, W23_VERSION);
assert.equal(policy.version, W23_VERSION);
assert.equal(report.totals.articlesChanged, 14);
assert.equal(report.totals.categoriesCovered, 14);
assert.equal(report.totals.charactersAdded, report.changes.reduce((sum, item) => sum + item.addedCharacters, 0));
assert.equal(storedDepth.totals.queued, 172);
assert.equal(storedDepth.totals.remediated, 14);
const baselineById = new Map(baselineAudit.articles.map((item) => [item.articleId, item]));
const expectedByCategory = new Map();
for (const item of baselineDepth.items.filter((entry) => entry.origin === 'deduplication-revealed')) {
  const current = expectedByCategory.get(item.categoryId);
  if (!current || item.deficitCharacters < current.deficitCharacters || (item.deficitCharacters === current.deficitCharacters && item.articleId.localeCompare(current.articleId) < 0)) expectedByCategory.set(item.categoryId, item);
}
const reportById = new Map(report.changes.map((item) => [item.articleId, item]));
const languageAuditIds = new Set(languageAudit.ledgers.flatMap((ledger) => ledger.articleIds));
assert.equal(languageAuditIds.size, 93);
for (const change of report.changes) {
  assert.equal(change.articleId, expectedByCategory.get(change.categoryId)?.articleId);
  assert.equal(change.beforeHash, baselineById.get(change.articleId)?.contentSha256);
  assert.ok(change.afterCharacters >= policy.scope.targetBodyCharacters);
  assert.equal(change.origin, 'deduplication-revealed');
}
for (const { article, raw } of inputs.loaded) {
  assert.equal(countArticleDuplicateBlocks(article).total, 0, `${article.id}: duplicate paragraph`);
  assert.equal(countParticleIssues(article).total, 0, `${article.id}: contextual particle issue`);
  const changed = sha256(raw) !== baselineById.get(article.id).contentSha256;
  const auditedChange = reportById.has(article.id) || languageAuditIds.has(article.id);
  assert.equal(auditedChange, changed, `${article.id}: report/audit/corpus mismatch`);
  if (reportById.has(article.id)) assert.equal(reportById.get(article.id).afterHash, sha256(raw));
}
assert.equal(report.currentCorpusSha256, storedAudit.corpus.sha256);
assert.equal(policy.rules.automaticFillerAllowed, false);
console.log(`W23 restoration validation: ${report.totals.articlesChanged} articles, ${report.totals.charactersAdded} characters, quality ${report.totals.baselineQualityAverage}->${report.totals.postQualityAverage}, remaining ${storedDepth.totals.queued}`);

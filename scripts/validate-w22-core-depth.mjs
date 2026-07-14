import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { loadW19Inputs } from './w19-quality-lib.mjs';
import { BANNED_LITERAL_TRANSLATIONS, countParticleIssues } from './w20-korean-lib.mjs';
import { countArticleDuplicateBlocks, sha256 } from './w21-duplicate-lib.mjs';
import { buildW22DepthRemediation, buildW22QualityArtifacts, W22_VERSION } from './w22-quality-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [baselineAudit, baselineDepth, report, storedAudit, storedQueue, storedDepth, policy, inputs] = await Promise.all([
  readJson('content-model/quality/w21-quality-audit.json'),
  readJson('content-model/quality/w21-depth-remediation.json'),
  readJson('content-model/quality/w22-depth-report.json'),
  readJson('content-model/quality/w22-quality-audit.json'),
  readJson('content-model/quality/w22-remediation-queue.json'),
  readJson('content-model/quality/w22-depth-remediation.json'),
  readJson('content-model/quality/w22-depth-policy.json'),
  loadW19Inputs(),
]);
const expected = buildW22QualityArtifacts(inputs, baselineAudit);
assert.deepEqual(storedAudit, expected.audit, 'W22 quality audit differs from current corpus');
assert.deepEqual(storedQueue, expected.queue, 'W22 remediation queue differs from current corpus');
assert.deepEqual(storedDepth, buildW22DepthRemediation(expected.audit, baselineDepth), 'W22 depth queue differs from current corpus');
assert.equal(report.version, W22_VERSION);
assert.equal(policy.version, W22_VERSION);
assert.equal(report.totals.articlesScanned, 1400);
assert.equal(report.totals.articlesChanged, 14);
assert.equal(report.totals.categoriesCovered, 14);
assert.equal(Object.keys(report.byCategory).length, 14);
assert.equal(storedDepth.totals.queued, baselineDepth.totals.queued - report.totals.articlesChanged);
assert.equal(storedDepth.totals.remediated, 14);
assert.equal(storedAudit.totals.priorities.P0, 0);
assert.ok(!('body-below-tier-target' in Object.fromEntries(report.changes.map((item) => [item.articleId, item]))));

const baselineById = new Map(baselineAudit.articles.map((item) => [item.articleId, item]));
const baselineDepthByCategory = new Map();
for (const item of baselineDepth.items.filter((entry) => entry.origin === 'pre-existing')) {
  const current = baselineDepthByCategory.get(item.categoryId);
  if (!current || item.deficitCharacters > current.deficitCharacters || (item.deficitCharacters === current.deficitCharacters && item.articleId.localeCompare(current.articleId) < 0)) baselineDepthByCategory.set(item.categoryId, item);
}
const reportById = new Map(report.changes.map((item) => [item.articleId, item]));
assert.equal(reportById.size, 14);
for (const change of report.changes) {
  const baseline = baselineById.get(change.articleId);
  assert.ok(baseline, `${change.articleId}: absent from W21 audit`);
  assert.equal(change.beforeHash, baseline.contentSha256);
  assert.equal(change.articleId, baselineDepthByCategory.get(change.categoryId)?.articleId, `${change.categoryId}: not the highest-deficit pre-existing article`);
  assert.ok(change.afterCharacters >= policy.scope.targetBodyCharacters);
  assert.ok(change.addedCharacters > 0);
  assert.deepEqual(change.affectedSections.sort(), ['applications', 'limitations', 'mechanism', 'practice', 'structure']);
}
for (const { article, raw } of inputs.loaded) {
  assert.equal(countArticleDuplicateBlocks(article).total, 0, `${article.id}: duplicate paragraph remains`);
  assert.equal(countParticleIssues(article).total, 0, `${article.id}: contextual particle issue regressed`);
  const baseline = baselineById.get(article.id);
  const changed = sha256(raw) !== baseline.contentSha256;
  assert.equal(reportById.has(article.id), changed, `${article.id}: W22 report differs from corpus hash`);
  if (changed) assert.equal(reportById.get(article.id).afterHash, sha256(raw));
}
const addedTotal = report.changes.reduce((sum, item) => sum + item.addedCharacters, 0);
assert.equal(report.totals.charactersAdded, addedTotal);
assert.equal(report.currentCorpusSha256, storedAudit.corpus.sha256);
assert.equal(storedDepth.corpusSha256, storedAudit.corpus.sha256);
assert.equal(policy.rules.automaticFillerAllowed, false);
assert.equal(policy.rules.categoryBalanceRequired, true);
const dataFiles = (await readdir('content-model/data', { recursive: true })).filter((file) => String(file).endsWith('.json'));
const searchable = [...inputs.loaded.map(({ raw }) => raw), ...(await Promise.all(dataFiles.map((file) => readFile(path.join('content-model/data', file), 'utf8'))))].join('\n');
for (const phrase of BANNED_LITERAL_TRANSLATIONS) assert.ok(!searchable.includes(phrase), `contextless literal translation remains: ${phrase}`);
console.log(`W22 core depth validation: ${report.totals.articlesChanged} articles, ${report.totals.charactersAdded} characters, quality ${report.totals.baselineQualityAverage}->${report.totals.postQualityAverage}, remaining ${storedDepth.totals.queued}`);

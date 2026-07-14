import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { countParticleIssues, normalizeArticleParticles, sha256, W20_SNAPSHOT_DATE, W20_VERSION } from './w20-korean-lib.mjs';
import { writeW20Artifacts } from './w20-quality-lib.mjs';

const articleDir = 'content-model/articles';
const baselineAudit = JSON.parse(await readFile('content-model/quality/w19-quality-audit.json', 'utf8'));
const baselineById = new Map(baselineAudit.articles.map((item) => [item.articleId, item]));
const files = (await readdir(articleDir)).filter((file) => file.endsWith('.article.json')).sort();
let existingReport = null;
try { existingReport = JSON.parse(await readFile('content-model/quality/w20-language-normalization.json', 'utf8')); } catch {}

const loaded = await Promise.all(files.map(async (file) => {
  const raw = await readFile(path.join(articleDir, file), 'utf8');
  return { file, raw, article: JSON.parse(raw) };
}));
const remainingBefore = loaded.reduce((sum, item) => sum + countParticleIssues(item.article).total, 0);
if (existingReport && remainingBefore === 0) {
  const result = await writeW20Artifacts(existingReport);
  console.log(`W20 Korean normalization already applied: ${result.report.totals.articlesChanged} articles, ${result.report.totals.replacements} replacements`);
  process.exit(0);
}

const changes = [];
const replacementTotals = { object: 0, topic: 0, subject: 0, conjunction: 0, direction: 0, core: 0, extended: 0, total: 0 };
const byCategory = {};
let beforeCore = 0;
let beforeExtended = 0;
for (const { file, raw, article } of loaded) {
  const baseline = baselineById.get(article.id);
  assert.ok(baseline, `${article.id}: missing from W19 baseline`);
  assert.equal(sha256(raw), baseline.contentSha256, `${article.id}: source changed after W19 baseline; normalization requires a fresh review`);
  const before = countParticleIssues(article);
  beforeCore += before.core;
  beforeExtended += before.extended;
  const normalized = normalizeArticleParticles(article);
  if (!normalized.replacements.total) continue;
  const nextRaw = `${JSON.stringify(normalized.article, null, 2)}\n`;
  await writeFile(path.join(articleDir, file), nextRaw, 'utf8');
  for (const key of Object.keys(replacementTotals)) replacementTotals[key] += normalized.replacements[key];
  const categoryId = baseline.categoryId;
  byCategory[categoryId] ??= { articlesChanged: 0, replacements: 0 };
  byCategory[categoryId].articlesChanged += 1;
  byCategory[categoryId].replacements += normalized.replacements.total;
  changes.push({
    articleId: article.id,
    title: article.title,
    categoryId,
    beforeHash: sha256(raw),
    afterHash: sha256(nextRaw),
    replacements: normalized.replacements,
  });
}

const afterLoaded = await Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(articleDir, file), 'utf8'))));
const afterIssues = afterLoaded.map(countParticleIssues);
const afterCore = afterIssues.reduce((sum, item) => sum + item.core, 0);
const afterExtended = afterIssues.reduce((sum, item) => sum + item.extended, 0);
assert.equal(afterCore, 0, 'core contextual particle issues remain after W20');
assert.equal(afterExtended, 0, 'extended contextual particle issues remain after W20');
assert.equal(replacementTotals.core, beforeCore);
assert.equal(replacementTotals.extended, beforeExtended);

const report = {
  version: W20_VERSION,
  snapshotDate: W20_SNAPSHOT_DATE,
  baselineCorpusSha256: baselineAudit.corpus.sha256,
  currentCorpusSha256: null,
  policy: {
    scope: 'exact topic-label particle corrections only',
    semanticRewriteAllowed: false,
    claimLedgerRefreshRequired: true,
  },
  totals: {
    articlesScanned: files.length,
    articlesChanged: changes.length,
    replacements: replacementTotals.total,
    beforeContextualParticleErrors: beforeCore,
    beforeExtendedParticleErrors: beforeExtended,
    afterContextualParticleErrors: afterCore,
    afterExtendedParticleErrors: afterExtended,
    baselineQualityAverage: baselineAudit.totals.averageScore,
    baselineP0: baselineAudit.totals.priorities.P0,
    baselineP1: baselineAudit.totals.priorities.P1,
    baselineP2: baselineAudit.totals.priorities.P2,
  },
  replacementsByKind: replacementTotals,
  byCategory: Object.fromEntries(Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))),
  changes,
};
await mkdir('content-model/quality', { recursive: true });
const result = await writeW20Artifacts(report);
console.log(`W20 Korean normalization: ${changes.length} articles, ${replacementTotals.total} replacements; core ${beforeCore}->0, extended ${beforeExtended}->0; quality ${baselineAudit.totals.averageScore}->${result.audit.totals.averageScore}`);

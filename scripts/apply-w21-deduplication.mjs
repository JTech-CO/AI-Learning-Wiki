import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { countArticleDuplicateBlocks, normalizeArticleDuplicates, sha256, W21_SNAPSHOT_DATE, W21_VERSION } from './w21-duplicate-lib.mjs';
import { writeW21Artifacts } from './w21-quality-lib.mjs';

const articleDir = 'content-model/articles';
const baselineAudit = JSON.parse(await readFile('content-model/quality/w20-quality-audit.json', 'utf8'));
const baselineById = new Map(baselineAudit.articles.map((item) => [item.articleId, item]));
const files = (await readdir(articleDir)).filter((file) => file.endsWith('.article.json')).sort();
let existingReport = null;
try { existingReport = JSON.parse(await readFile('content-model/quality/w21-deduplication-report.json', 'utf8')); } catch {}
const loaded = await Promise.all(files.map(async (file) => {
  const raw = await readFile(path.join(articleDir, file), 'utf8');
  return { file, raw, article: JSON.parse(raw) };
}));
const duplicatesBefore = loaded.reduce((sum, item) => sum + countArticleDuplicateBlocks(item.article).total, 0);
if (existingReport && duplicatesBefore === 0) {
  const result = await writeW21Artifacts(existingReport);
  console.log(`W21 deduplication already applied: ${result.report.totals.articlesChanged} articles, ${result.report.totals.paragraphsRemoved} paragraphs removed`);
  process.exit(0);
}

const baselineDuplicateParagraphs = baselineAudit.articles.reduce((sum, item) => sum + item.duplicateParagraphCount, 0);
const changes = [];
const totals = { rawExact: 0, normalizedEquivalent: 0, paragraphs: 0, pairedHeadings: 0, total: 0 };
const byCategory = {};
let bodyCharactersRemoved = 0;
for (const { file, raw, article } of loaded) {
  const baseline = baselineById.get(article.id);
  assert.ok(baseline, `${article.id}: missing from W20 baseline`);
  assert.equal(sha256(raw), baseline.contentSha256, `${article.id}: source changed after W20 baseline; deduplication requires a fresh review`);
  const normalized = normalizeArticleDuplicates(article);
  if (!normalized.removals.total) continue;
  const nextRaw = `${JSON.stringify(normalized.article, null, 2)}\n`;
  await writeFile(path.join(articleDir, file), nextRaw, 'utf8');
  for (const key of Object.keys(totals)) totals[key] += normalized.removals[key];
  const removedCharacters = raw.length - nextRaw.length;
  bodyCharactersRemoved += removedCharacters;
  const categoryId = baseline.categoryId;
  byCategory[categoryId] ??= { articlesChanged: 0, paragraphsRemoved: 0 };
  byCategory[categoryId].articlesChanged += 1;
  byCategory[categoryId].paragraphsRemoved += normalized.removals.paragraphs;
  changes.push({ articleId: article.id, title: article.title, categoryId, beforeHash: sha256(raw), afterHash: sha256(nextRaw), removedCharacters, affectedSections: normalized.affectedSections, removals: normalized.removals });
}
const afterLoaded = await Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(articleDir, file), 'utf8'))));
const afterDuplicates = afterLoaded.reduce((sum, article) => sum + countArticleDuplicateBlocks(article).total, 0);
assert.equal(afterDuplicates, 0, 'internal duplicate paragraphs remain after W21');
assert.equal(totals.paragraphs, baselineDuplicateParagraphs);
assert.equal(totals.total, baselineDuplicateParagraphs);
assert.equal(changes.length, baselineAudit.totals.issues['duplicate-paragraph']);
const report = {
  version: W21_VERSION,
  snapshotDate: W21_SNAPSHOT_DATE,
  baselineCorpusSha256: baselineAudit.corpus.sha256,
  currentCorpusSha256: null,
  policy: { scope: 'within-article normalized duplicate blocks only', retainedOccurrence: 'first', pairedHeadingRemoval: true, semanticRewriteAllowed: false, crossArticleDeletionAllowed: false, claimLedgerRefreshRequired: true },
  totals: {
    articlesScanned: files.length,
    articlesChanged: changes.length,
    beforeDuplicateParagraphs: baselineDuplicateParagraphs,
    afterDuplicateParagraphs: afterDuplicates,
    paragraphsRemoved: totals.paragraphs,
    pairedHeadingsRemoved: totals.pairedHeadings,
    rawExactRemoved: totals.rawExact,
    normalizedEquivalentRemoved: totals.normalizedEquivalent,
    bodyCharactersRemoved,
    baselineQualityAverage: baselineAudit.totals.averageScore,
    baselineP0: baselineAudit.totals.priorities.P0,
    baselineP1: baselineAudit.totals.priorities.P1,
    baselineP2: baselineAudit.totals.priorities.P2,
  },
  byCategory: Object.fromEntries(Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))),
  changes,
};
const result = await writeW21Artifacts(report);
console.log(`W21 deduplication: ${changes.length} articles, ${totals.paragraphs} paragraphs and ${totals.pairedHeadings} paired headings removed; quality ${baselineAudit.totals.averageScore}->${result.audit.totals.averageScore}`);

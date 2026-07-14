import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { countParticleIssues } from './w20-korean-lib.mjs';
import { countArticleDuplicateBlocks, sha256 } from './w21-duplicate-lib.mjs';
import { W23_RESTORATIONS, W23_TARGET_CHARACTERS } from './w23-restoration-content.mjs';
import { W23_RESTORATION_BUFFERS } from './w23-restoration-buffer.mjs';
import { W23_SNAPSHOT_DATE, W23_VERSION, writeW23Artifacts } from './w23-quality-lib.mjs';

const [baselineAudit, baselineDepth] = await Promise.all([
  readFile('content-model/quality/w22-quality-audit.json', 'utf8').then(JSON.parse),
  readFile('content-model/quality/w22-depth-remediation.json', 'utf8').then(JSON.parse),
]);
const baselineById = new Map(baselineAudit.articles.map((item) => [item.articleId, item]));
const depthById = new Map(baselineDepth.items.map((item) => [item.articleId, item]));
const selectedByCategory = new Map();
for (const item of baselineDepth.items.filter((entry) => entry.origin === 'deduplication-revealed')) {
  const current = selectedByCategory.get(item.categoryId);
  if (!current || item.deficitCharacters < current.deficitCharacters || (item.deficitCharacters === current.deficitCharacters && item.articleId.localeCompare(current.articleId) < 0)) selectedByCategory.set(item.categoryId, item);
}
const ids = Object.keys(W23_RESTORATIONS).sort();
assert.equal(ids.length, 14);
assert.equal(new Set(ids.map((id) => baselineById.get(id)?.categoryId)).size, 14);
for (const id of ids) assert.equal(selectedByCategory.get(baselineById.get(id).categoryId)?.articleId, id, `${id}: not category minimum deduplication deficit`);

const prepared = [];
for (const id of ids) {
  const file = `content-model/articles/${id}.article.json`;
  const raw = await readFile(file, 'utf8');
  const article = JSON.parse(raw);
  const baseline = baselineById.get(id);
  const queued = depthById.get(id);
  assert.equal(sha256(raw), baseline.contentSha256, `${id}: source changed after W22`);
  assert.equal(queued.origin, 'deduplication-revealed');
  const affectedSections = [];
  const additions = { ...W23_RESTORATIONS[id], applications: W23_RESTORATION_BUFFERS[id] };
  for (const [sectionId, addition] of Object.entries(additions)) {
    const section = article.sections.find((item) => item.id === sectionId);
    assert.ok(section?.sourceRefs?.length, `${id}/${sectionId}: evidence-linked section required`);
    section.body = `${section.body}\n\n${addition}`;
    affectedSections.push(sectionId);
  }
  const afterCharacters = article.sections.reduce((sum, section) => sum + section.body.length, 0);
  assert.ok(afterCharacters >= W23_TARGET_CHARACTERS, `${id}: ${afterCharacters} below ${W23_TARGET_CHARACTERS}`);
  assert.equal(countArticleDuplicateBlocks(article).total, 0, `${id}: duplicate paragraph introduced`);
  assert.equal(countParticleIssues(article).total, 0, `${id}: contextual particle issue introduced`);
  const nextRaw = `${JSON.stringify(article, null, 2)}\n`;
  prepared.push({ file, nextRaw, change: { articleId: id, title: article.title, categoryId: baseline.categoryId, tier: baseline.tier, origin: queued.origin, beforeHash: baseline.contentSha256, afterHash: sha256(nextRaw), beforeCharacters: baseline.bodyCharacters, afterCharacters, addedCharacters: afterCharacters - baseline.bodyCharacters, affectedSections } });
}
await Promise.all(prepared.map((item) => writeFile(item.file, item.nextRaw, 'utf8')));
const changes = prepared.map((item) => item.change);
const report = {
  version: W23_VERSION,
  snapshotDate: W23_SNAPSHOT_DATE,
  baselineCorpusSha256: baselineAudit.corpus.sha256,
  currentCorpusSha256: null,
  policy: { scope: 'one minimum-deficit deduplication-revealed article per category', categories: 14, targetCharacters: W23_TARGET_CHARACTERS, automaticFillerAllowed: false, sourceLinkedSectionsOnly: true, claimLedgerRefreshRequired: true },
  totals: { articlesScanned: 1400, articlesChanged: changes.length, categoriesCovered: new Set(changes.map((item) => item.categoryId)).size, charactersAdded: changes.reduce((sum, item) => sum + item.addedCharacters, 0), baselineQualityAverage: baselineAudit.totals.averageScore, baselineP0: baselineAudit.totals.priorities.P0, baselineP1: baselineAudit.totals.priorities.P1, baselineP2: baselineAudit.totals.priorities.P2 },
  byCategory: Object.fromEntries(changes.sort((a, b) => a.categoryId.localeCompare(b.categoryId)).map((item) => [item.categoryId, { articleId: item.articleId, beforeCharacters: item.beforeCharacters, afterCharacters: item.afterCharacters, addedCharacters: item.addedCharacters }])),
  changes,
};
const result = await writeW23Artifacts(report);
console.log(`W23 restoration: ${changes.length} articles, ${report.totals.charactersAdded} characters; quality ${baselineAudit.totals.averageScore}->${result.audit.totals.averageScore}; remaining ${result.depth.totals.queued}`);


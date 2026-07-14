import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildW19Artifacts, loadW19Inputs, W19_VERSION } from './w19-quality-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [storedAudit, storedQueue, inputs] = await Promise.all([
  readJson('content-model/quality/w19-quality-audit.json'),
  readJson('content-model/quality/w19-remediation-queue.json'),
  loadW19Inputs(),
]);
const expected = buildW19Artifacts(inputs);
assert.deepEqual(storedAudit, expected.audit, 'W19 quality audit differs from the current 1,400 article corpus');
assert.deepEqual(storedQueue, expected.queue, 'W19 remediation queue differs from the current audit');
assert.equal(storedAudit.version, W19_VERSION);
assert.equal(storedAudit.corpus.articles, 1400, 'W19 must audit exactly 1,400 articles');
assert.equal(storedAudit.corpus.categories, 14, 'W19 must cover exactly 14 categories');
assert.equal(storedQueue.totals.queued, 1400, 'W19 queue must rank every article');
assert.equal(new Set(storedAudit.articles.map((item) => item.articleId)).size, 1400, 'W19 audit article IDs must be unique');
assert.equal(new Set(storedQueue.items.map((item) => item.rank)).size, 1400, 'W19 queue ranks must be unique');
for (const [categoryId, summary] of Object.entries(storedAudit.categorySummary)) {
  assert.equal(summary.articles, 100, `${categoryId}: W19 expected exactly 100 articles`);
  assert.equal(storedQueue.totals.byCategory[categoryId], 100, `${categoryId}: W19 queue expected exactly 100 articles`);
}
for (const item of storedAudit.articles) {
  assert.ok(item.score >= 0 && item.score <= 100, `${item.articleId}: score outside 0-100`);
  assert.ok(['P0', 'P1', 'P2'].includes(item.priority), `${item.articleId}: invalid priority`);
  assert.match(item.contentSha256, /^[a-f0-9]{64}$/, `${item.articleId}: invalid content hash`);
}
assert.equal(storedQueue.corpusSha256, storedAudit.corpus.sha256);
console.log(`W19 quality validation: 1,400/1,400 audited; average ${storedAudit.totals.averageScore}/100; P0 ${storedAudit.totals.priorities.P0}, P1 ${storedAudit.totals.priorities.P1}, P2 ${storedAudit.totals.priorities.P2}`);

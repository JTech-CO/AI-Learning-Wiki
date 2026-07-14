import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { W19_VERSION } from './w19-quality-lib.mjs';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const [audit, queue] = await Promise.all([
  readFile('content-model/quality/w19-quality-audit.json', 'utf8').then(JSON.parse),
  readFile('content-model/quality/w19-remediation-queue.json', 'utf8').then(JSON.parse),
]);
assert.equal(audit.version, W19_VERSION);
assert.equal(audit.corpus.articles, 1400);
assert.equal(audit.corpus.categories, 14);
assert.equal(queue.totals.queued, 1400);
assert.equal(new Set(audit.articles.map((item) => item.articleId)).size, 1400);
assert.equal(new Set(queue.items.map((item) => item.rank)).size, 1400);
const corpusHash = sha256(audit.articles.map((item) => `${item.articleId}:${item.contentSha256}`).join('\n'));
assert.equal(audit.corpus.sha256, corpusHash, 'W19 frozen corpus hash is internally inconsistent');
assert.equal(queue.corpusSha256, audit.corpus.sha256);
const auditById = new Map(audit.articles.map((item) => [item.articleId, item]));
for (const [index, item] of queue.items.entries()) {
  assert.equal(item.rank, index + 1);
  const source = auditById.get(item.articleId);
  assert.ok(source, `${item.articleId}: queue item missing from W19 audit`);
  assert.equal(item.priority, source.priority);
  assert.equal(item.score, source.score);
  assert.deepEqual(item.issueCodes, source.issueCodes);
}
for (const [categoryId, summary] of Object.entries(audit.categorySummary)) {
  assert.equal(summary.articles, 100, `${categoryId}: W19 expected 100 articles`);
  assert.equal(queue.totals.byCategory[categoryId], 100, `${categoryId}: W19 queue expected 100 articles`);
}
console.log(`W19 frozen baseline validation: 1,400 articles; average ${audit.totals.averageScore}/100; P0 ${audit.totals.priorities.P0}, P1 ${audit.totals.priorities.P1}, P2 ${audit.totals.priorities.P2}`);

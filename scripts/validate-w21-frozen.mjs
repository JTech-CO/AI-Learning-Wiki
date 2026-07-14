import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { W21_VERSION } from './w21-duplicate-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [audit, queue, depth, report, policy] = await Promise.all([
  readJson('content-model/quality/w21-quality-audit.json'),
  readJson('content-model/quality/w21-remediation-queue.json'),
  readJson('content-model/quality/w21-depth-remediation.json'),
  readJson('content-model/quality/w21-deduplication-report.json'),
  readJson('content-model/quality/w21-deduplication-policy.json'),
]);
assert.equal(audit.version, W21_VERSION);
assert.equal(queue.version, W21_VERSION);
assert.equal(depth.version, W21_VERSION);
assert.equal(report.version, W21_VERSION);
assert.equal(policy.version, W21_VERSION);
assert.equal(audit.corpus.articles, 1400);
assert.equal(audit.corpus.sha256, '60fdaae9a8e2a95e7bcbd41878dbfa488f9a28098638922e524edd586fdf79f7');
assert.equal(report.currentCorpusSha256, audit.corpus.sha256);
assert.equal(depth.corpusSha256, audit.corpus.sha256);
assert.equal(queue.corpusSha256, audit.corpus.sha256);
assert.equal(report.totals.articlesChanged, 162);
assert.equal(report.totals.paragraphsRemoved, 427);
assert.equal(report.totals.afterDuplicateParagraphs, 0);
assert.equal(depth.totals.queued, 200);
assert.equal(depth.totals.deduplicationRevealed, 132);
assert.equal(depth.totals.preExisting, 68);
assert.equal(audit.totals.priorities.P0, 0);
assert.equal(audit.totals.priorities.P1, 1400);
assert.ok(!('duplicate-paragraph' in audit.totals.issues));
const auditIds = new Set(audit.articles.map((item) => item.articleId));
assert.equal(auditIds.size, 1400);
for (const item of depth.items) assert.ok(auditIds.has(item.articleId), `${item.articleId}: absent from frozen W21 audit`);
console.log(`W21 frozen validation: ${report.totals.articlesChanged} articles, ${report.totals.paragraphsRemoved} duplicate paragraphs removed, ${depth.totals.queued} depth items transitioned to W22`);


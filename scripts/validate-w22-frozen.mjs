import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [audit, queue, depth, report, policy] = await Promise.all([
  readJson('content-model/quality/w22-quality-audit.json'),
  readJson('content-model/quality/w22-remediation-queue.json'),
  readJson('content-model/quality/w22-depth-remediation.json'),
  readJson('content-model/quality/w22-depth-report.json'),
  readJson('content-model/quality/w22-depth-policy.json'),
]);
assert.equal(audit.version, 'W22-2026-07-15');
assert.equal(queue.version, audit.version);
assert.equal(depth.version, audit.version);
assert.equal(report.version, audit.version);
assert.equal(policy.version, audit.version);
assert.equal(audit.corpus.articles, 1400);
assert.equal(audit.corpus.sha256, '602f131a11aacc835c078779702dcda13006747cbc1e3ed4f41de4ed38db79c5');
assert.equal(report.currentCorpusSha256, audit.corpus.sha256);
assert.equal(depth.corpusSha256, audit.corpus.sha256);
assert.equal(queue.corpusSha256, audit.corpus.sha256);
assert.equal(report.totals.articlesChanged, 14);
assert.equal(report.totals.categoriesCovered, 14);
assert.equal(report.totals.charactersAdded, 51295);
assert.equal(report.totals.remainingDepthArticles, 186);
assert.equal(depth.totals.queued, 186);
assert.equal(audit.totals.averageScore, 69.06);
assert.equal(audit.totals.priorities.P0, 0);
assert.equal(audit.totals.priorities.P1, 1386);
assert.equal(audit.totals.priorities.P2, 14);
console.log(`W22 frozen validation: ${report.totals.articlesChanged} balanced core articles, ${report.totals.charactersAdded} characters, ${depth.totals.queued} items transitioned to W23`);


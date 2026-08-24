import assert from 'node:assert/strict';
import {
  deriveArticleQualityContract,
  loadEditorQualityManifest,
  readJson,
  resolveBuildClock,
  verifyFrozenBaselines,
} from './editor-quality-runtime.mjs';

const manifest = loadEditorQualityManifest();
const fixedNow = new Date('2026-08-24T01:02:03.000Z');
assert.deepEqual(resolveBuildClock({ argv: ['--as-of', '2026-08-20'], env: {}, now: fixedNow, manifest }), {
  asOf: '2026-08-20',
  generatedAt: fixedNow.toISOString(),
  source: 'cli',
});
assert.equal(resolveBuildClock({
  argv: [],
  env: { [manifest.clock.asOfEnvironmentVariable]: '2026-08-21' },
  now: fixedNow,
  manifest,
}).asOf, '2026-08-21');
assert.equal(resolveBuildClock({
  argv: [],
  env: { [manifest.clock.sourceDateEpochEnvironmentVariable]: String(fixedNow.getTime() / 1000) },
  now: new Date('2020-01-01T00:00:00.000Z'),
  manifest,
}).source, 'source-date-epoch');
assert.throws(
  () => resolveBuildClock({ argv: ['--as-of=2026-02-30'], env: {}, now: fixedNow, manifest }),
  /valid calendar date/u,
);

const contract = deriveArticleQualityContract(
  readJson('content-model/schema.article.json'),
  readJson('content-model/taxonomy/quality-policy.json'),
);
assert.equal(contract.publicationStatus, 'reviewed');
assert.equal(contract.minimumSectionCount, 3);
assert.deepEqual(contract.recommendedSectionCount, { min: 5, max: 8 });
assert.equal(contract.minimumIndependentSourceFamilies, 3);
assert.ok(verifyFrozenBaselines(manifest).every((baseline) => baseline.intact));
assert.ok(!Object.values(manifest.outputs).includes(manifest.frozenBaselines[0].path));

console.log('Editor quality runtime: dynamic clock, policy contract and frozen baseline passed');

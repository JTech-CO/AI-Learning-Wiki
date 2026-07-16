import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildW38IndependenceAudit, W38_VERSION } from './w38-independence-lib.mjs';

const [stored, expected] = await Promise.all([
  readFile('content-model/quality/w38-independence-audit.json', 'utf8').then(JSON.parse),
  buildW38IndependenceAudit(),
]);

assert.deepEqual(stored, expected, 'W38 independence audit differs from current repository');
assert.equal(stored.version, W38_VERSION);
assert.equal(stored.baseline.reviewedArticles, 1400);
assert.equal(stored.baseline.wikiCourses, 8);
assert.equal(stored.baseline.legacyModules, 305);
assert.equal(stored.baseline.publicPrompts, 1142);
assert.equal(stored.baseline.publicArtifacts, 25);
assert.equal(stored.legacyDependency.active, true);
assert.deepEqual(stored.legacyDependency.activeConsumers, [
  'scripts/prompt-library.mjs',
  'scripts/build-pages.mjs',
  'scripts/validate-content.mjs',
]);
assert.equal(stored.legacyDependency.moduleSourceDomains['eduverse-ai.app'], 301);
assert.equal(stored.promptQuality.lengthCharacters.atLeast500, 0);
assert.equal(stored.promptQuality.lengthCharacters.maximum, 451);
assert.equal(stored.promptQuality.withExamples, 114);
assert.equal(stored.promptQuality.withUsageNotes, 116);
assert.equal(stored.target.publicPrompts, 1500);
assert.equal(stored.target.publicArtifacts, 120);
assert.equal(stored.blockers.length, 5);

console.log(`W38 independence validation: ${stored.baseline.legacyModules} modules audited; gaps locked at +${stored.gaps.reviewedArticles} articles, +${stored.gaps.wikiCourses} courses, +${stored.gaps.publicPrompts} prompts, +${stored.gaps.publicArtifacts} artifacts`);

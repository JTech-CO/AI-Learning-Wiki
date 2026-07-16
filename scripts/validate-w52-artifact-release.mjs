import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPromptLibrary } from './canonical-library.mjs';
import { ajvMessage, loadLibraryV2Validators, readLibraryEntries } from './library-v2-lib.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const policy = readJson('content-model/library-policy-v2.json');
const base = readJson('content-model/migration/w48-base-library.json');
const staged = readJson('content-model/staging/w51-artifact-manifest.json');
const report = readJson('content-model/quality/w52-artifact-release.json');
const publicData = readJson('public/data/snippets.json');
const entries = await readLibraryEntries('content-model/library/artifacts', '.artifact.json');
const { validateArtifact } = await loadLibraryV2Validators();
const built = await buildPromptLibrary(process.cwd());
const artifacts = entries.map((entry) => entry.value);
const ids = artifacts.map((artifact) => artifact.id);

assert.equal(report.milestone, 'W52');
assert.equal(entries.length, policy.targetCounts.artifacts);
assert.equal(entries.length, 120);
assert.equal(new Set(ids).size, 120);
assert.ok(base.artifactIds.every((id) => ids.includes(id)), 'a frozen W40 artifact ID was lost');
assert.equal(sha256([...base.artifactIds].sort().join('\n')), base.hashes.artifactIdsSha256);
assert.ok(staged.staged.every((item) => ids.includes(item.id)), 'a W51 staged artifact was not promoted');
assert.ok(artifacts.every((artifact) => artifact.status === 'reviewed'), 'draft artifact remains canonical');
for (const { file, value } of entries) assert.equal(validateArtifact(value), true, `${file}: ${ajvMessage(validateArtifact)}`);
assert.deepEqual(new Set(artifacts.map((artifact) => artifact.type)), new Set(['code', 'config', 'query', 'payload', 'schema', 'workflow', 'template']));
assert.deepEqual(report.counts, { canonicalArtifacts: 120, addedArtifacts: 95 });
assert.deepEqual(report.safeguards, { withRuntime: 120, withValidation: 120, withSecurityNotes: 120 });
assert.equal(publicData.snippets.length, 120);
assert.equal(publicData.counts.canonicalArtifacts, 120);
assert.equal(built.counts.canonicalArtifacts, 120);
assert.deepEqual(publicData.snippets.map((item) => item.id).sort(), [...ids].sort());
assert.ok(Object.values(report.courseCoverage).filter((count) => count >= 11).length >= 8, 'professional course artifact coverage incomplete');
const newIds = new Set(staged.staged.map((item) => item.id));
const newArtifacts = artifacts.filter((artifact) => newIds.has(artifact.id));
assert.doesNotMatch(JSON.stringify(newArtifacts), /EduVerse|에듀버스|가장 먼저 쓰세요|지금 바로|클릭하세요/iu);
for (const artifact of newArtifacts) {
  const content = artifact.files.map((file) => file.content).join('\n');
  assert.doesNotMatch(content, /(?:api[_-]?key|token|password|secret)\s*[:=]\s*["'][^"'{][^"']+["']/iu, `${artifact.id}: literal secret`);
  if (['payload', 'schema'].includes(artifact.type)) assert.doesNotThrow(() => JSON.parse(artifact.files[0].content));
}
console.log('W52 artifact release: 120 canonical artifacts, seven types, complete runtime/validation/security metadata and public data OK');

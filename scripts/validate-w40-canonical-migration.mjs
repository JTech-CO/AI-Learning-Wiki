import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildPromptLibrary } from './canonical-library.mjs';
import { ajvMessage, loadLibraryV2Validators, readLibraryEntries } from './library-v2-lib.mjs';

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const base = JSON.parse(await readFile('content-model/migration/w48-base-library.json', 'utf8'));
const [migration, prompts, artifacts, validators, built, publicPrompts, publicArtifacts] = await Promise.all([
  readFile('content-model/migration/w40-library-migration.json', 'utf8').then(JSON.parse),
  readLibraryEntries('content-model/library/prompts', '.prompt.json'),
  readLibraryEntries('content-model/library/artifacts', '.artifact.json'),
  loadLibraryV2Validators(),
  buildPromptLibrary(process.cwd()),
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
  readFile('public/data/snippets.json', 'utf8').then(JSON.parse),
]);

assert.equal(migration.version, 'W40-2026-07-16');
assert.equal(prompts.length, 1500);
assert.equal(artifacts.length, 120);
assert.equal(migration.counts.promptsWithUsageNotes, 1142);
assert.equal(migration.counts.promptsWithExamples, 114);
assert.equal(migration.counts.wikiOriginalPrompts, 32);
assert.equal(migration.counts.migratedReferencePrompts, 1110);

for (const { file, value } of prompts) assert.equal(validators.validatePrompt(value), true, `${file}: ${ajvMessage(validators.validatePrompt)}`);
for (const { file, value } of artifacts) assert.equal(validators.validateArtifact(value), true, `${file}: ${ajvMessage(validators.validateArtifact)}`);

const promptIds = prompts.map((entry) => entry.value.id).sort();
const basePromptIds = promptIds.filter((id) => base.promptIds.includes(id));
const artifactIds = artifacts.map((entry) => entry.value.id).sort();
const baseArtifactIds = artifactIds.filter((id) => base.artifactIds.includes(id));
assert.equal(sha256(basePromptIds.join('\n')), migration.compatibility.publicPromptIdsSha256);
assert.equal(sha256(baseArtifactIds.join('\n')), migration.compatibility.publicArtifactIdsSha256);
assert.deepEqual(publicPrompts.prompts.map((item) => item.id).sort(), promptIds);
assert.deepEqual(publicArtifacts.snippets.map((item) => item.id).sort(), artifactIds);
assert.equal(built.counts.sourceModules, 0);
assert.equal(built.counts.prompts, 1500);
assert.equal(built.counts.snippets, 120);

for (const file of ['scripts/prompt-library.mjs', 'scripts/build-pages.mjs', 'scripts/validate-content.mjs']) {
  const source = await readFile(file, 'utf8');
  assert.doesNotMatch(source, /content-model[\\/]data|path\.join\(CM, ['"]data['"]\)|courses\.json/u, `${file}: legacy input remains active`);
}
for (const directory of ['content-model/library/prompts', 'content-model/library/artifacts']) {
  for (const entry of await readLibraryEntries(directory, directory.endsWith('prompts') ? '.prompt.json' : '.artifact.json')) {
    assert.doesNotMatch(JSON.stringify(entry.value), /EduVerse|에듀버스/iu, `${entry.file}: former-site marker`);
  }
}
assert.equal(migration.legacyInputs.allowedAsBuildInput, false);
assert.equal(migration.legacyInputs.retainedForAuditOnly, true);

console.log(`W40 migration validation: ${prompts.length} prompts and ${artifacts.length} artifacts are canonical; public IDs preserved and 3 legacy consumers cut over`);

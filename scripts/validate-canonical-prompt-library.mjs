import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { buildPromptLibrary } from './canonical-library.mjs';

const [built, publicPrompts, publicArtifacts, component, artifactComponent, controlledPolicy] = await Promise.all([
  buildPromptLibrary(process.cwd()),
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
  readFile('public/data/snippets.json', 'utf8').then(JSON.parse),
  readFile('src/components/PromptExplorer.astro', 'utf8'),
  readFile('src/components/SnippetExplorer.astro', 'utf8'),
  readFile('content-model/prompt-library-policy.json', 'utf8').then(JSON.parse),
]);

assert.equal(built.counts.sourceModules, 0, 'legacy source module is active');
assert.equal(built.counts.canonicalPrompts, 1500);
assert.equal(built.counts.canonicalArtifacts, 120);
assert.equal(publicPrompts.prompts.length, 1500);
assert.equal(publicArtifacts.snippets.length, 120);
assert.equal(publicPrompts.policyVersion, 'W39-2026-07-16');
assert.equal(publicArtifacts.policyVersion, 'W39-2026-07-16');

const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s\p{P}\p{S}]+/gu, '');
const unique = (items, keyOf, label) => {
  const seen = new Set();
  for (const item of items) {
    const key = keyOf(item);
    assert.ok(!seen.has(key), `${label}: ${key}`);
    seen.add(key);
  }
};
unique(publicPrompts.prompts, (item) => item.id, 'duplicate public prompt id');
unique(publicPrompts.prompts, (item) => normalize(item.title), 'duplicate public prompt title');
unique(publicPrompts.prompts, (item) => normalize(item.template), 'duplicate public prompt template');
unique(publicArtifacts.snippets, (item) => item.id, 'duplicate public artifact id');

const allowedTags = new Set(controlledPolicy.controlledTags.map((item) => item.label));
assert.ok(publicPrompts.prompts.every((item) => item.tags.length >= 1 && item.tags.length <= 6 && item.tags.every((tag) => allowedTags.has(tag))), 'uncontrolled prompt tag remains');
assert.ok(publicArtifacts.snippets.every((item) => item.tags.length >= 1 && item.tags.length <= 6 && item.tags.every((tag) => allowedTags.has(tag))), 'uncontrolled artifact tag remains');
assert.ok(publicPrompts.prompts.every((item) => item.notes.length >= 10), 'prompt usage note missing');
assert.equal(publicPrompts.prompts.filter((item) => item.examples.length > 0).length, 500);
assert.deepEqual(new Set(publicArtifacts.snippets.map((item) => item.type)), new Set(['code', 'config', 'query', 'payload', 'schema', 'workflow', 'template']));
assert.ok(publicArtifacts.snippets.every((item) => item.runtime && item.validation && item.securityNotes.length > 0));
assert.ok(!/EduVerse|에듀버스/iu.test(JSON.stringify(publicPrompts.prompts)));
assert.ok(!/EduVerse|에듀버스/iu.test(JSON.stringify(publicArtifacts.snippets)));
assert.match(component, /prompt\.notes/);
assert.match(component, /example\.output/);
assert.match(artifactComponent, /data-snippets-url="\.\.\/data\/snippets\.json"/);

const wikiFiles = new Set(await readdir(path.join('src', 'content', 'docs', 'wiki')));
for (const prompt of publicPrompts.prompts) assert.ok(wikiFiles.has(`${prompt.relatedWikiUrl.split('/').filter(Boolean).at(-1)}.md`), `${prompt.id}: missing related wiki article`);
for (const artifact of publicArtifacts.snippets) assert.ok(wikiFiles.has(`${artifact.relatedWikiUrl.split('/').filter(Boolean).at(-1)}.md`), `${artifact.id}: missing related wiki article`);

console.log(`W40 canonical library: ${publicPrompts.prompts.length} prompts with usage notes and ${publicArtifacts.snippets.length} artifacts load without legacy modules`);

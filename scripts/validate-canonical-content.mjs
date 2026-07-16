import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { ajvMessage, loadLibraryV2Validators, readLibraryEntries } from './library-v2-lib.mjs';

const requireComplete = process.argv.includes('--complete');
const checkGenerated = process.argv.includes('--generated');
const errors = [];
const error = (message) => errors.push(message);
const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s\p{P}\p{S}]+/gu, '');

const [promptEntries, artifactEntries, validators, paths, wikiFiles, libraryPolicy, controlledPolicy] = await Promise.all([
  readLibraryEntries('content-model/library/prompts', '.prompt.json'),
  readLibraryEntries('content-model/library/artifacts', '.artifact.json'),
  loadLibraryV2Validators(),
  readdir('content-model/paths').then(async (files) => Promise.all(files.filter((file) => file.endsWith('.path.json')).map((file) => readFile(path.join('content-model/paths', file), 'utf8').then(JSON.parse)))),
  readdir('src/content/docs/wiki'),
  readFile('content-model/library-policy-v2.json', 'utf8').then(JSON.parse),
  readFile('content-model/prompt-library-policy.json', 'utf8').then(JSON.parse),
]);
const courseIds = new Set(paths.map((course) => course.id));
const wikiSlugs = new Set(wikiFiles.filter((file) => file.endsWith('.md')).map((file) => file.slice(0, -3)));
const allowedTags = new Set(controlledPolicy.controlledTags.map((tag) => tag.label));

for (const { file, value } of promptEntries) {
  if (!validators.validatePrompt(value)) error(`${file}: ${ajvMessage(validators.validatePrompt)}`);
  if (!value.courseIds.every((id) => courseIds.has(id))) error(`${file}: unknown course id`);
  if (!value.relatedWikiSlugs.every((slug) => wikiSlugs.has(slug))) error(`${file}: unknown related wiki slug`);
  if (!value.tags.every((tag) => allowedTags.has(tag))) error(`${file}: uncontrolled tag`);
  if (/EduVerse|에듀버스/iu.test(JSON.stringify(value))) error(`${file}: former-site marker remains`);
}
for (const { file, value } of artifactEntries) {
  if (!validators.validateArtifact(value)) error(`${file}: ${ajvMessage(validators.validateArtifact)}`);
  if (!value.courseIds.every((id) => courseIds.has(id))) error(`${file}: unknown course id`);
  if (!value.relatedWikiSlugs.every((slug) => wikiSlugs.has(slug))) error(`${file}: unknown related wiki slug`);
  if (!value.tags.every((tag) => allowedTags.has(tag))) error(`${file}: uncontrolled tag`);
  if (/EduVerse|에듀버스/iu.test(JSON.stringify(value))) error(`${file}: former-site marker remains`);
}

for (const [label, entries, keyOf] of [
  ['prompt id', promptEntries, (entry) => entry.value.id],
  ['prompt title', promptEntries, (entry) => normalize(entry.value.title)],
  ['prompt template', promptEntries, (entry) => normalize(entry.value.template)],
  ['artifact id', artifactEntries, (entry) => entry.value.id],
]) {
  const seen = new Set();
  for (const entry of entries) {
    const key = keyOf(entry);
    if (seen.has(key)) error(`duplicate ${label}: ${key}`);
    seen.add(key);
  }
}

if (requireComplete) {
  if (promptEntries.length !== libraryPolicy.targetCounts.prompts) error(`prompt count drift: ${promptEntries.length} != ${libraryPolicy.targetCounts.prompts}`);
  if (artifactEntries.length !== libraryPolicy.targetCounts.artifacts) error(`artifact count drift: ${artifactEntries.length} != ${libraryPolicy.targetCounts.artifacts}`);
}

if (checkGenerated) {
  const [publicPrompts, publicArtifacts] = await Promise.all([
    readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
    readFile('public/data/snippets.json', 'utf8').then(JSON.parse),
  ]);
  if (publicPrompts.prompts.length !== promptEntries.length) error('generated prompt count differs from canonical source');
  if (publicArtifacts.snippets.length !== artifactEntries.length) error('generated artifact count differs from canonical source');
  const promptIds = new Set(promptEntries.map((entry) => entry.value.id));
  const artifactIds = new Set(artifactEntries.map((entry) => entry.value.id));
  if (!publicPrompts.prompts.every((prompt) => promptIds.has(prompt.id))) error('generated prompt id missing from canonical source');
  if (!publicArtifacts.snippets.every((artifact) => artifactIds.has(artifact.id))) error('generated artifact id missing from canonical source');
  for (const legacy of ['courses', 'concepts']) {
    try {
      const entries = await readdir(path.join('src/content/docs', legacy));
      if (entries.length) error(`legacy generated directory remains: ${legacy}`);
    } catch (cause) { if (cause.code !== 'ENOENT') throw cause; }
  }
  try { await access('src/content/docs/prompts.md'); error('legacy static prompt page remains'); }
  catch (cause) { if (cause.code !== 'ENOENT') throw cause; }
}

console.log(`content: ${promptEntries.length} canonical prompts, ${artifactEntries.length} canonical artifacts, ${paths.length} wiki courses`);
console.log(`mode: ${requireComplete ? 'release-complete' : 'work-in-progress'}${checkGenerated ? ' + generated data' : ''}`);
for (const message of errors) console.error(`ERROR ${message}`);
console.log(`result: ${errors.length} error(s), 0 warning(s)`);
if (errors.length) process.exit(1);

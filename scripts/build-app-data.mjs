import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPromptLibrary } from './prompt-library.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'data');
const { prompts, snippets, counts, policy } = await buildPromptLibrary(ROOT);
const generatedAt = new Date().toISOString();

await mkdir(OUT, { recursive: true });
await rm(path.join(OUT, 'catalog.json'), { force: true });
await Promise.all([
  writeFile(path.join(OUT, 'prompts.json'), `${JSON.stringify({ generatedAt, policyVersion: policy.version, counts, prompts }, null, 2)}\n`, 'utf8'),
  writeFile(path.join(OUT, 'snippets.json'), `${JSON.stringify({ generatedAt, policyVersion: policy.version, counts, snippets }, null, 2)}\n`, 'utf8'),
]);

console.log(`prompt library: ${counts.sourcePrompts} source - ${counts.duplicateMerges} merged - ${counts.snippets} snippets + ${counts.additions} additions = ${counts.prompts} prompts`);

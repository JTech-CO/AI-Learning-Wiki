import { readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}
const [files, promptData, snippetData] = await Promise.all([
  walk('content-model/data'),
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
  readFile('public/data/snippets.json', 'utf8').then(JSON.parse),
]);
await Promise.all([
  rm('src/content/docs/courses', { recursive: true, force: true }),
  rm('src/content/docs/concepts', { recursive: true, force: true }),
  rm('src/content/docs/prompts.md', { force: true }),
]);
console.log(`prompt integration: ${files.length} source modules -> ${promptData.prompts.length} canonical prompts + ${snippetData.snippets.length} snippets; legacy lesson pages removed`);

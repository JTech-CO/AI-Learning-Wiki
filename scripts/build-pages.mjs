import { readFile, rm } from 'node:fs/promises';

const [promptData, artifactData, migration] = await Promise.all([
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
  readFile('public/data/snippets.json', 'utf8').then(JSON.parse),
  readFile('content-model/migration/w40-library-migration.json', 'utf8').then(JSON.parse),
]);
await Promise.all([
  rm('src/content/docs/courses', { recursive: true, force: true }),
  rm('src/content/docs/concepts', { recursive: true, force: true }),
  rm('src/content/docs/prompts.md', { force: true }),
]);
console.log(`prompt integration: ${promptData.prompts.length} canonical prompts + ${artifactData.snippets.length} canonical artifacts; ${migration.counts.prompts} migrated IDs preserved and legacy lesson pages removed`);
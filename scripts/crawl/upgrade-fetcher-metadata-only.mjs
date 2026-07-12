import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const file = path.join(ROOT, 'scripts', 'crawl', 'fetch-eduverse.mjs');
let source = await readFile(file, 'utf8');

source = source.replace(
  'const entries = [];',
  'const entries = [];\nconst metadataOnly = [];',
);
source = source.replace(
  '    if (!lesson) throw new Error(`Verified lesson missing: ${nodeKey}`);',
  '    if (!lesson) metadataOnly.push(nodeKey);',
);
source = source.replace(
  '      sourceUpdatedAt: lesson.refreshed_at ?? lesson.created_at ?? null,',
  '      sourceUpdatedAt: lesson?.refreshed_at ?? lesson?.created_at ?? null,\n      contentAvailable: Boolean(lesson),',
);
source = source.replace(
  'console.log(`metadata rows: ${nodes.length}; verified lesson rows: ${lessons.length}`);',
  'console.log(`metadata rows: ${nodes.length}; verified lesson rows: ${lessons.length}`);\nconsole.log(`metadata-only curriculum entries: ${metadataOnly.length}`);',
);

if (!source.includes('metadataOnly.push(nodeKey)')) throw new Error('fetcher patch did not apply');
await writeFile(file, source, 'utf8');
console.log('fetcher upgraded for metadata-only curriculum entries');

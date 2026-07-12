import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'content-model', 'data');
const SCHEMA = path.join(ROOT, 'content-model', 'schema.module.json');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of await walk(DATA)) {
  const mod = JSON.parse(await readFile(file, 'utf8'));
  if (mod.source?.url && !/^https?:\/\//i.test(mod.source.url)) {
    mod.source.citation = mod.source.url;
    mod.source.url = `https://eduverse-ai.app/learn?course=${encodeURIComponent(mod.course)}`;
    await writeFile(file, `${JSON.stringify(mod, null, 2)}\n`, 'utf8');
    changed += 1;
  }
}

const schema = JSON.parse(await readFile(SCHEMA, 'utf8'));
schema.$defs.source.properties.citation = { "type": "string", "description": "원문에 기록된 참고 문헌 또는 근거 설명" };
await writeFile(SCHEMA, `${JSON.stringify(schema, null, 2)}\n`, 'utf8');
console.log(`source citations normalized: ${changed}`);

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(ROOT, 'scripts', 'build-app-data.mjs');
let source = await readFile(file, 'utf8');
source = source.replace(
  "const route = (mod) => `/courses/${mod.course}/${String(mod.order).padStart(2, '0')}-${mod.id.split('/').at(-1)}/`;",
  "const route = (mod) => {\n  const number = String(mod.order).padStart(2, '0');\n  const tail = mod.id.split('/').at(-1);\n  const slug = tail.startsWith(number) ? tail : `${number}-${tail}`;\n  return `/courses/${mod.course}/${slug}/`;\n};",
);
if (!source.includes('const slug = tail.startsWith(number)')) throw new Error('route patch failed');
await writeFile(file, source, 'utf8');
console.log('catalog route builder upgraded');

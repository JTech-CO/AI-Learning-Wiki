import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ids = new Set((await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json')).map((file) => file.replace('.article.json', '')));
let changed = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.md')) {
      let source = await readFile(full, 'utf8');
      const next = source.replace(/\/concepts\/([a-z0-9-]+)\//g, (match, id) => ids.has(id) ? `/wiki/${id}/` : match);
      if (next !== source) { await writeFile(full, next, 'utf8'); changed += 1; }
    }
  }
}
await walk('src/content/docs/courses');
console.log(`guide-to-wiki links: ${changed} guide pages updated`);

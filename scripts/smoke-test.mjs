import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const failures = [];

for (const required of ['index.html', '404.html', 'pagefind/pagefind.js']) {
  try { await access(path.join(DIST, required)); }
  catch { failures.push(`missing dist/${required}`); }
}

if (process.env.SITE_URL) {
  try { await access(path.join(DIST, 'sitemap-index.xml')); }
  catch { failures.push('missing dist/sitemap-index.xml with SITE_URL set'); }
}

const index = await readFile(path.join(DIST, 'index.html'), 'utf8').catch(() => '');
if (!index.includes('AI Learning Wiki')) failures.push('home page title missing');

const courseRoot = path.join(DIST, 'courses');
const courseDirs = await readdir(courseRoot, { withFileTypes: true }).catch(() => []);
if (courseDirs.filter((entry) => entry.isDirectory()).length < 8) failures.push('course routes incomplete');

if (failures.length) {
  failures.forEach((message) => console.error(`ERROR ${message}`));
  process.exit(1);
}
console.log('smoke test: dist structure OK');

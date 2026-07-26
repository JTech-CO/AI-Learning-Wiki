import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const configuredBase = process.env.BASE_PATH ?? '/';
const basePath = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
const stripBase = (pathname) => pathname === basePath ? '/' : pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
const htmlFiles = [];
const outputFiles = new Set();

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else {
      const relative = path.relative(root, full).replaceAll('\\', '/');
      outputFiles.add(relative);
      if (entry.name.endsWith('.html')) htmlFiles.push({ full, relative });
    }
  }
}

function hasOutput(pathname) {
  const clean = decodeURIComponent(stripBase(pathname)).replace(/^\/+|\/+$/g, '');
  if (!clean) return outputFiles.has('index.html');
  if (path.extname(clean)) return outputFiles.has(clean);
  return outputFiles.has(clean) || outputFiles.has(`${clean}/index.html`) || outputFiles.has(`${clean}.html`);
}

await walk(root);
const failures = [];
let checked = 0;

for (const { full, relative } of htmlFiles) {
  const html = await readFile(full, 'utf8');
  const route = `${basePath}/${relative.replace(/index\.html$/, '')}`.replace(/\/{2,}/g, '/');
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1].replaceAll('&amp;', '&'));
  for (const href of new Set(hrefs)) {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href) || href.includes('${')) continue;
    const url = new URL(href, `https://local.test${route}`);
    if (url.hostname !== 'local.test') continue;
    if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/pagefind/')) continue;
    checked += 1;
    if (!hasOutput(url.pathname)) failures.push(`${route} -> ${href}`);
  }
}

if (failures.length) {
  console.error(`internal links: ${failures.length} broken\n${failures.slice(0, 30).join('\n')}`);
  process.exit(1);
}
console.log(`internal links: ${checked} references across ${htmlFiles.length} pages OK`);

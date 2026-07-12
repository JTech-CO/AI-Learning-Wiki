import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('./smoke-test.mjs', import.meta.url);
let source = await readFile(file, 'utf8');
source = source.replace("['index.html', '404.html', 'pagefind/pagefind.js', 'sitemap-index.xml']", "['index.html', '404.html', 'pagefind/pagefind.js']");
source = source.replace(
  "const index = await readFile",
  "if (process.env.SITE_URL) {\n  try { await access(path.join(DIST, 'sitemap-index.xml')); }\n  catch { failures.push('missing dist/sitemap-index.xml with SITE_URL set'); }\n}\n\nconst index = await readFile",
);
await writeFile(file, source, 'utf8');
console.log('SITE_URL이 있을 때만 sitemap을 검사하도록 변경했습니다.');

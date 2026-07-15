import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const BASE_PATH = '/AI-Learning-Wiki';
const CANONICAL = 'https://jtech-co.github.io/AI-Learning-Wiki/';
const DIST = path.resolve('dist');

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const [workflow, config, packageJson, home, manifest, wikiIndex, prompts] = await Promise.all([
  readFile('.github/workflows/ci.yml', 'utf8'),
  readFile('astro.config.mjs', 'utf8'),
  readFile('package.json', 'utf8').then(JSON.parse),
  readFile('dist/index.html', 'utf8'),
  readFile('dist/site.webmanifest', 'utf8').then(JSON.parse),
  readFile('dist/data/wiki-index.json', 'utf8').then(JSON.parse),
  readFile('dist/data/prompts.json', 'utf8').then(JSON.parse),
]);

await access('dist/.nojekyll');
await assert.rejects(access('.openai/hosting.json'), 'legacy Sites hosting configuration remains');
await assert.rejects(access('dist/server/index.js'), 'legacy Sites worker remains in the artifact');

assert.equal(packageJson.homepage, CANONICAL);
assert.equal(manifest.start_url, `${BASE_PATH}/`);
assert.equal(manifest.scope, `${BASE_PATH}/`);
assert.ok(manifest.icons.every((icon) => icon.src.startsWith(`${BASE_PATH}/`)), 'manifest icon escapes the Pages base path');
assert.ok(config.includes("base: basePath || '/'"), 'Astro base path is not configured');
assert.ok(home.includes(`<link rel="canonical" href="${CANONICAL}"`), 'home canonical is not the Pages URL');
assert.ok(wikiIndex.articles.every((item) => item.url.startsWith(`${BASE_PATH}/`)), 'wiki index contains root-domain URLs');
assert.ok(
  prompts.prompts.every(
    (item) => item.courseUrl.startsWith(`${BASE_PATH}/`) && item.relatedWikiUrl.startsWith(`${BASE_PATH}/`),
  ),
  'prompt data contains root-domain URLs',
);

assert.match(workflow, /actions\/configure-pages@v5/);
assert.match(workflow, /actions\/upload-pages-artifact@v4/);
assert.match(workflow, /actions\/deploy-pages@v4/);
assert.match(workflow, /pages:\s*write/);
assert.match(workflow, /id-token:\s*write/);
assert.ok(!packageJson.scripts.build.includes('sites:entry'), 'build still creates a Sites worker');

const failures = [];
const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src|action|poster)=["'](\/[^"']*)/gi)) {
    const value = match[1];
    if (value.startsWith('//')) continue;
    if (value === `${BASE_PATH}${BASE_PATH}` || value.startsWith(`${BASE_PATH}${BASE_PATH}/`)) {
      failures.push(`${path.relative(DIST, file)} -> duplicated base: ${value}`);
      continue;
    }
    if (value !== BASE_PATH && !value.startsWith(`${BASE_PATH}/`)) {
      failures.push(`${path.relative(DIST, file)} -> ${value}`);
    }
  }
  if (/fetch\((["'`])\/(?!AI-Learning-Wiki\/)/.test(html)) {
    failures.push(`${path.relative(DIST, file)} -> root fetch()`);
  }
}
assert.equal(failures.length, 0, `GitHub Pages base-path escapes:\n${failures.slice(0, 20).join('\n')}`);

console.log(`W25 GitHub Pages validation: ${htmlFiles.length} pages, canonical, data, manifest and Actions workflow OK`);

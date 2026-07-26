import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const canonicalBase = process.env.SITE_URL ?? 'https://ai-wiki.kr';
const configuredBase = process.env.BASE_PATH ?? '/';
const basePath = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
const read = (file) => readFile(file, 'utf8');
const [home, privacy, terms, packageJson] = await Promise.all([
  read('dist/index.html'),
  read('dist/privacy-policy/index.html'),
  read('dist/terms-of-use/index.html'),
  read('package.json').then(JSON.parse),
]);

assert.match(home, /<title>AI Learning Wiki \| AI Learning Wiki<\/title>/, 'root title is not the Wiki home');
assert.match(home, /<h1[^>]*>AI Learning Wiki<\/h1>/, 'root H1 is not the Wiki home');
assert.ok(home.includes(`<link rel="canonical" href="${canonicalBase}/"`), 'root canonical URL mismatch');
assert.ok(home.includes(`href="${basePath}/privacy-policy/"`), 'root footer lacks privacy route');
assert.ok(home.includes(`href="${basePath}/terms-of-use/"`), 'root footer lacks terms route');
for (const [route, html] of [['privacy-policy', privacy], ['terms-of-use', terms]]) {
  assert.match(html, /<h1[^>]*>/, `${route} content is missing`);
  assert.ok(html.includes(`href="${basePath}/"`), `${route} lacks a root return link`);
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalBase}/${route}/"`), `${route} canonical URL mismatch`);
}
assert.equal(packageJson.homepage, `${canonicalBase}/`, 'package homepage must point to the public site root');
console.log('W24 route validation: root, privacy, terms and canonical URLs are separated correctly');

import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const canonicalOrigin = 'https://ai-learning-wiki.bryan131.chatgpt.site';
const read = (file) => readFile(file, 'utf8');
const [home, privacy, terms, worker, hosting, packageJson] = await Promise.all([
  read('dist/index.html'),
  read('dist/privacy-policy/index.html'),
  read('dist/terms-of-use/index.html'),
  read('dist/server/index.js'),
  read('.openai/hosting.json').then(JSON.parse),
  read('package.json').then(JSON.parse),
]);

assert.match(home, /<title>AI Learning Wiki \| AI Learning Wiki<\/title>/, 'root title is not the Wiki home');
assert.match(home, /<h1[^>]*>AI Learning Wiki<\/h1>/, 'root H1 is not the Wiki home');
assert.ok(home.includes('검토 완료 백과 문서'), 'root lacks home-page article count');
assert.ok(home.includes(`<link rel="canonical" href="${canonicalOrigin}/"`), 'root canonical URL mismatch');
assert.ok(home.includes('href="/privacy-policy/"'), 'root footer lacks privacy route');
assert.ok(home.includes('href="/terms-of-use/"'), 'root footer lacks terms route');
assert.ok(!/<title>개인정보 처리방침/.test(home), 'privacy document replaced the root page');
assert.match(privacy, /<h1[^>]*>개인정보 처리방침<\/h1>/, 'privacy route content mismatch');
assert.match(terms, /<h1[^>]*>이용약관<\/h1>/, 'terms route content mismatch');
for (const [route, html] of [['privacy-policy', privacy], ['terms-of-use', terms]]) {
  assert.ok(html.includes('href="/"'), `${route} lacks a root return link`);
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}/${route}/"`), `${route} canonical URL mismatch`);
}
assert.deepEqual(Object.keys(hosting), ['project_id'], 'hosting.json must contain only project_id');
assert.match(hosting.project_id, /^appgprj_/, 'invalid Sites project id');
assert.equal(packageJson.homepage, `${canonicalOrigin}/`, 'package homepage must point to root');
assert.ok(worker.includes('env.ASSETS.fetch(request)'), 'Sites worker does not delegate to static assets');
assert.ok(!/privacy-policy|Response\.redirect/.test(worker), 'Sites worker contains a route redirect');
console.log('W24 deployment route validation: root, privacy, terms, canonical URL and Sites worker separation OK');


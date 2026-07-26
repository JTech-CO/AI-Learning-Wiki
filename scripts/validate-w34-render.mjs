import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(file, 'utf8');
const [home, course, prompts, article, allPages] = await Promise.all([
  read('dist/index.html'),
  read('dist/course/responsible-ai/index.html'),
  read('dist/prompt-explorer/index.html'),
  read('dist/wiki/cross-entropy/index.html'),
  read('dist/special/all-pages/index.html'),
]);

for (const [route, html] of [['home', home], ['course', course], ['prompt library', prompts]]) {
  assert.doesNotMatch(html, /right-sidebar-container/u, `${route}: right-side document outline should be hidden`);
}
assert.match(article, /right-sidebar-container/u, 'wiki article: right-side document outline missing');
assert.match(home, /전체 문서\(색인\)/u);
assert.doesNotMatch(home, /용어 색인|가나다·영문 용어 색인/u);
assert.match(home, /data-random-document/u, 'home random article link is not direct-enabled');
assert.match(course, /신뢰할 수 있는 AI/u);
assert.doesNotMatch(course, /안전하고 신뢰할 수 있는 AI/u);
assert.match(allPages, /전체 문서\(색인\)/u);

assert.match(home, /data-wiki-base-path="\/"/u, 'rendered random handler is not custom-domain root-aware');
assert.match(home, /encodeURIComponent/u, 'rendered random handler does not build an article URL from its ID');
assert.match(home, /location\.assign/u, 'rendered direct-random navigation handler missing');

console.log('W34 render: non-article outlines hidden, article outline retained, direct random navigation and unified labels rendered');

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const read = (file) => readFile(file, 'utf8');
const [home, course, prompts, article] = await Promise.all([
  read('dist/index.html'),
  read('dist/course/responsible-ai/index.html'),
  read('dist/prompt-explorer/index.html'),
  read('dist/wiki/cross-entropy/index.html'),
]);

for (const [route, html] of [['home', home], ['course', course], ['prompt library', prompts]]) {
  assert.doesNotMatch(html, /right-sidebar-container/u, `${route}: document outline should remain article-only`);
  assert.doesNotMatch(html, /<wiki-table-of-contents\b/u, `${route}: custom outline leaked outside wiki articles`);
}

assert.match(article, /right-sidebar-container/u, 'wiki article: right-side outline missing');
assert.equal((article.match(/<wiki-table-of-contents\b/gu) ?? []).length, 2, 'desktop and mobile outlines were not both rendered');
assert.match(article, />목차</u, 'visible TOC title missing');
assert.match(article, />처음 위치</u, 'page-top navigation missing');
assert.match(article, /data-wiki-toc-toggle-all/u, 'global outline disclosure missing');
assert.match(article, />모두 접기</u, 'initial expanded-state label missing');
assert.ok((article.match(/data-wiki-toc-group/gu) ?? []).length >= 8, 'four collapsible groups were not rendered in both outlines');
assert.match(article, /wiki-toc-depth-1/u, 'nested indentation markup missing');
assert.match(article, /<h2 id="개념과-원리">개념과 원리<\/h2>/u, 'top-level article group missing');
assert.match(article, /<h3 id="개요와-핵심-정의">개요와 핵심 정의<\/h3>/u, 'existing section was not preserved as level three');
assert.match(article, /href="#개요와-핵심-정의"/u, 'existing section anchor missing from outline');

const assetFiles = (await readdir('dist/_astro')).filter((file) => file.endsWith('.js'));
const scripts = (await Promise.all(assetFiles.map((file) => read(path.join('dist/_astro', file))))).join('\n');
const runtime = `${article}\n${scripts}`;
assert.match(runtime, /wiki-table-of-contents/u, 'TOC client runtime missing');
assert.match(runtime, /aria-current/u, 'active-heading runtime missing');
assert.match(runtime, /requestAnimationFrame/u, 'scroll tracking runtime missing');

console.log('W35 render: article-only desktop/mobile outlines expose four collapsible, indented groups with active-heading tracking');

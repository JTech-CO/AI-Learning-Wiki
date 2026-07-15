import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [component, css, wiki, prompts] = await Promise.all([
  readFile('src/components/wiki/WikiSearch.astro', 'utf8'),
  readFile('src/styles/wiki.css', 'utf8'),
  readFile('public/data/wiki-index.json', 'utf8').then(JSON.parse),
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
]);

assert.equal(wiki.articles.length, 1400, 'wiki search corpus changed');
assert.equal(prompts.prompts.length, 1173, 'prompt search corpus changed');
assert.match(component, /id="wiki-search-pagination"[^>]*aria-label="검색 결과 페이지"/, 'search pagination navigation missing');
assert.match(component, /const PAGE_SIZE = 30;/, 'search page size changed');
assert.match(component, /ranked\.slice\(start, end\)/, 'search pagination slice missing');
assert.doesNotMatch(component, /\.slice\(0,\s*100\)/, 'legacy 100-result truncation remains');
assert.match(component, /params\.set\('type', activeType\)/, 'search type URL state missing');
assert.match(component, /params\.set\('page', String\(currentPage\)\)/, 'search page URL state missing');
assert.match(component, /new URL\('\.\.\/prompt-explorer\/', location\.href\)\.pathname/, 'prompt result does not resolve to the library under the active base path');
assert.match(component, /function resultCard\(item\)[\s\S]*link\.href = item\.url;[\s\S]*link\.textContent = item\.title;/, 'search results are not rendered with safe DOM links');
assert.match(component, /results\.replaceChildren\(\.\.\.pageItems\.map/, 'search results are not replaced through the DOM');
assert.doesNotMatch(component, /results\.innerHTML/, 'HTML-string result rendering remains');
assert.match(component, /ArrowRight:[\s\S]*ArrowLeft:[\s\S]*Home:[\s\S]*End:/, 'filter keyboard navigation missing');
assert.match(component, /검색 결과가 없습니다\./, 'empty search message missing');
assert.match(component, /검색 자료를 불러오지 못했습니다\./, 'search load failure message missing');
assert.match(css, /\.wiki-search-filters button:focus-visible,[\s\S]*outline:\s*3px solid #36c;/, 'visible keyboard focus style missing');

const broadNeedle = 'ai';
const broadMatches = [
  ...wiki.articles.map((item) => `${item.title} ${item.englishTitle} ${(item.aliases ?? []).join(' ')} ${item.summary} ${(item.tags ?? []).join(' ')}`),
  ...prompts.prompts.map((item) => `${item.title} ${item.template} ${(item.tags ?? []).join(' ')}`),
].filter((text) => text.toLowerCase().includes(broadNeedle)).length;
assert.ok(broadMatches > 100, 'search corpus no longer exercises pagination beyond the old limit');

console.log(`W32 unified search: ${wiki.articles.length + prompts.prompts.length} records, ${broadMatches} broad matches paginated without truncation`);

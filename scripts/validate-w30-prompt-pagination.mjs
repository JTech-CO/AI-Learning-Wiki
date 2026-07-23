import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [component, css, prompts] = await Promise.all([
  readFile('src/components/PromptExplorer.astro', 'utf8'),
  readFile('src/styles/wiki-library.css', 'utf8'),
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
]);

assert.equal(prompts.prompts.length, 1500, 'prompt catalog count changed');
assert.match(component, /id="prompt-pagination"[^>]*aria-label="프롬프트 목록 페이지"/, 'prompt pagination navigation missing');
assert.match(component, /const PAGE_SIZE = 40;/, 'prompt page size changed');
assert.match(component, /filtered\.slice\(start, end\)\.map\(card\)/, 'prompt page slice missing');
assert.match(component, /previousPage\.disabled = currentPage <= 1;/, 'previous-page boundary missing');
assert.match(component, /nextPage\.disabled = currentPage >= totalPages;/, 'next-page boundary missing');
assert.match(component, /params\.set\('page', String\(currentPage\)\)/, 'prompt page URL state missing');
assert.match(component, /조건에 맞는 프롬프트가 없다\./, 'empty result message missing');
assert.match(css, /\.wiki-pagination\s*\{[^}]*display:\s*flex;/s, 'pagination layout missing');
assert.match(css, /\.wiki-pagination\[hidden\]\s*\{[^}]*display:\s*none;/s, 'pagination hidden state missing');

console.log(`W30 prompt pagination: ${prompts.prompts.length} prompts, 40 per page with persistent filters`);

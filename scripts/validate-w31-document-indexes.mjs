import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const wiki = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8'));
const css = await readFile('src/styles/wiki.css', 'utf8');
const articleById = new Map(wiki.articles.map((article) => [article.id, article]));
const koInitials = ['ko-g', 'ko-gg', 'ko-n', 'ko-d', 'ko-dd', 'ko-r', 'ko-m', 'ko-b', 'ko-bb', 'ko-s', 'ko-ss', 'ko-ng', 'ko-j', 'ko-jj', 'ko-ch', 'ko-k', 'ko-t', 'ko-p', 'ko-h'];
const groupOrder = [...koInitials, ...'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => `en-${letter}`), 'other'];
const groupOf = (title) => {
  const first = title.trim().charAt(0);
  const code = first.codePointAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) return koInitials[Math.floor((code - 0xac00) / 588)];
  if (/^[A-Za-z]$/.test(first)) return `en-${first.toLowerCase()}`;
  return 'other';
};

async function validateIndex(file, expectedArticles) {
  const source = await readFile(file, 'utf8');
  assert.match(source, /class="wiki-letter-index" aria-label="문서 초성 색인"/, `${file}: letter navigation missing`);
  const actualIds = [...source.matchAll(/data-article-id="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(actualIds.length, expectedArticles.length, `${file}: article count mismatch`);
  assert.equal(new Set(actualIds).size, actualIds.length, `${file}: duplicate article entry`);
  assert.deepEqual(new Set(actualIds), new Set(expectedArticles.map((article) => article.id)), `${file}: article membership mismatch`);
  const actualGroups = [...source.matchAll(/data-index-group="([^"]+)"/g)].map((match) => match[1]);
  const expectedGroups = groupOrder.filter((group) => expectedArticles.some((article) => groupOf(article.title) === group));
  assert.deepEqual(actualGroups, expectedGroups, `${file}: Korean-first group order mismatch`);
  for (const group of actualGroups) {
    const actual = actualIds.filter((id) => groupOf(articleById.get(id).title) === group);
    const expected = expectedArticles.filter((article) => groupOf(article.title) === group).sort((left, right) => left.title.localeCompare(right.title, group.startsWith('en-') ? 'en' : 'ko', { numeric: true, sensitivity: 'base' })).map((article) => article.id);
    assert.deepEqual(actual, expected, `${file}: ${group} title order mismatch`);
  }
}

await validateIndex('src/content/docs/glossary.md', wiki.articles);
await validateIndex('src/content/docs/special/all-pages.md', wiki.articles);
for (const category of wiki.categories) await validateIndex(`src/content/docs/category/${category.id}.md`, wiki.articles.filter((article) => article.categories.includes(category.id)));

assert.match(css, /\.wiki-index-list\s*\{[^}]*columns:\s*4;/s, 'document index is not four columns');
assert.match(css, /max-width:\s*50rem[^}]*\.wiki-index-list\s*\{\s*columns:\s*2;/s, 'tablet index columns missing');
assert.match(css, /max-width:\s*28rem[^}]*\.wiki-index-list\s*\{\s*columns:\s*1;/s, 'mobile index columns missing');

console.log(`W31 document indexes: ${wiki.articles.length} articles across ${wiki.categories.length} categories, Korean initials before English letters`);

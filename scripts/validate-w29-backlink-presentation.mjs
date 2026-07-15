import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const articles = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8')).articles;
const articleById = new Map(articles.map((article) => [article.id, article]));
const css = await readFile('src/styles/wiki.css', 'utf8');
const failures = [];

const titleGroup = (title) => /^[가-힣]/u.test(title.trim()) ? 0 : /^[A-Za-z]/.test(title.trim()) ? 1 : 2;
const compareRefs = (leftRef, rightRef) => {
  const leftTitle = articleById.get(leftRef)?.title ?? leftRef;
  const rightTitle = articleById.get(rightRef)?.title ?? rightRef;
  const groupDifference = titleGroup(leftTitle) - titleGroup(rightTitle);
  if (groupDifference) return groupDifference;
  const locale = titleGroup(leftTitle) === 0 ? 'ko' : 'en';
  return leftTitle.localeCompare(rightTitle, locale, { numeric: true, sensitivity: 'base' });
};

for (const file of (await readdir('src/content/docs/wiki')).filter((name) => name.endsWith('.md'))) {
  const id = path.basename(file, '.md');
  const article = articleById.get(id);
  if (!article) continue;
  const source = await readFile(path.join('src/content/docs/wiki', file), 'utf8');
  const section = source.match(/## 이 문서를 가리키는 문서\n\n([\s\S]*?)\n\n## 이 문서를 포함하는 코스/)?.[1];
  if (!section) {
    failures.push(`${id}: backlink section missing`);
    continue;
  }
  const actual = [...section.matchAll(/^- \[[^\]]+\]\(\/wiki\/([^/]+)\/\)$/gm)].map((match) => match[1]);
  const expected = [...new Set(article.backlinks)].sort(compareRefs);
  if (actual.join('\n') !== expected.join('\n')) failures.push(`${id}: backlink title order mismatch`);
}

assert.equal(failures.length, 0, `W29 backlink ordering failed:\n${failures.slice(0, 20).join('\n')}`);
assert.match(css, /\.wiki-backlinks-more\s*>\s*summary\s*\{[^}]*color:\s*#202122\s*!important;/s, 'backlink summary text color is not fixed');
assert.match(css, /\.wiki-backlinks-more\s*>\s*ul\s*\{[^}]*columns:\s*4\s*;/s, 'backlink list is not four columns');

console.log(`W29 backlink presentation: ${articles.length} documents sorted Korean-first, four-column disclosure styled`);

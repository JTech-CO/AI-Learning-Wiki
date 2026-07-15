import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const articles = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8')).articles;
const articleById = new Map(articles.map((article) => [article.id, article]));
const files = (await readdir('src/content/docs/wiki')).filter((file) => file.endsWith('.md'));
const failures = [];

for (const file of files) {
  const id = path.basename(file, '.md');
  const article = articleById.get(id);
  if (!article) {
    failures.push(`${id}: wiki index entry missing`);
    continue;
  }

  const source = await readFile(path.join('src/content/docs/wiki', file), 'utf8');
  const section = source.match(/### 이 문서를 가리키는 문서\n\n([\s\S]*?)\n\n### 이 문서를 포함하는 코스/);
  if (!section) {
    failures.push(`${id}: backlink section missing`);
    continue;
  }

  const expected = new Set(article.backlinks).size;
  const detailsAt = section[1].indexOf('<details class="wiki-backlinks-more">');
  const visibleSource = detailsAt === -1 ? section[1] : section[1].slice(0, detailsAt);
  const visible = (visibleSource.match(/^- \[/gm) ?? []).length;
  const hidden = detailsAt === -1 ? 0 : (section[1].slice(detailsAt).match(/^- \[/gm) ?? []).length;
  const expectedVisible = Math.min(5, expected);
  const expectedHidden = Math.max(0, expected - 5);

  if (visible !== expectedVisible) failures.push(`${id}: visible ${visible}, expected ${expectedVisible}`);
  if (hidden !== expectedHidden) failures.push(`${id}: hidden ${hidden}, expected ${expectedHidden}`);
  if (expectedHidden && !section[1].includes(`<summary>나머지 ${expectedHidden}개 문서 보기</summary>`)) {
    failures.push(`${id}: remaining-count summary missing`);
  }
  if (!expectedHidden && detailsAt !== -1) failures.push(`${id}: unnecessary details disclosure`);
}

if (files.length !== articles.length) failures.push(`document count ${files.length}, index count ${articles.length}`);

if (failures.length) {
  console.error(`W27 backlink validation failed (${failures.length})`);
  for (const failure of failures.slice(0, 30)) console.error(`- ${failure}`);
  process.exit(1);
}

const collapsed = articles.filter((article) => new Set(article.backlinks).size > 5).length;
console.log(`W27 backlink validation passed: ${articles.length} documents, ${collapsed} collapsed lists`);

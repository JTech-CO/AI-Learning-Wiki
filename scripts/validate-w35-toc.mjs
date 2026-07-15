import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const read = (file) => readFile(file, 'utf8');
const [config, desktop, mobile, list, runtime, buildWiki, css] = await Promise.all([
  read('astro.config.mjs'),
  read('src/components/wiki/WikiTableOfContents.astro'),
  read('src/components/wiki/WikiMobileTableOfContents.astro'),
  read('src/components/wiki/WikiTableOfContentsList.astro'),
  read('src/scripts/wiki-toc.ts'),
  read('scripts/build-wiki.mjs'),
  read('src/styles/wiki.css'),
]);

assert.match(config, /TableOfContents:\s*['"]\.\/src\/components\/wiki\/WikiTableOfContents\.astro['"]/u);
assert.match(config, /MobileTableOfContents:\s*['"]\.\/src\/components\/wiki\/WikiMobileTableOfContents\.astro['"]/u);
for (const [name, source] of [['desktop', desktop], ['mobile', mobile]]) {
  assert.match(source, /목차/u, `${name}: visible table-of-contents title missing`);
  assert.match(source, /data-wiki-toc-toggle-all/u, `${name}: expand\/collapse-all control missing`);
  assert.match(source, /aria-expanded="true"/u, `${name}: initial disclosure state is not announced`);
  assert.match(source, /WikiTableOfContentsList/u, `${name}: recursive outline is not rendered`);
}
assert.match(list, /<details open data-wiki-toc-group>/u, 'root groups are not independently collapsible');
assert.match(list, /const label = isTop \? '처음 위치'/u, 'page-top label is not localized');
assert.match(list, /<Astro\.self toc=\{heading\.children\}/u, 'TOC recursion missing');
assert.match(list, /wiki-toc-depth-\$\{depth\}/u, 'nested indentation classes missing');
assert.doesNotMatch(list, /<svg\b/u, 'decorative SVG should not be used in the TOC');
assert.match(runtime, /event\.stopPropagation\(\)/u, 'heading navigation incorrectly toggles its group');
assert.match(runtime, /event\.key === 'Escape'/u, 'mobile keyboard dismissal missing');
assert.match(runtime, /setAttribute\('aria-current', 'true'\)/u, 'active heading is not exposed accessibly');
assert.match(runtime, /requestAnimationFrame/u, 'active heading tracking is not frame-scheduled');
assert.match(runtime, /customElements\.get\('wiki-table-of-contents'\)/u, 'custom element registration guard missing');

assert.match(buildWiki, /tableOfContents: \{ minHeadingLevel: 2, maxHeadingLevel: 4 \}/u);
assert.match(buildWiki, /\['개념과 원리', article\.sections\.slice\(0, 4\)\]/u);
assert.match(buildWiki, /\['활용과 검증', article\.sections\.slice\(4\)\]/u);
assert.match(buildWiki, /## 문서 관계/u);
assert.match(buildWiki, /## 참고와 다음 학습/u);
assert.match(buildWiki, /'#### \$1'/u, 'standalone subtopics are not promoted to level four');
assert.match(css, /\.sl-markdown-content h4/u, 'level-four article headings are not styled');

const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const generatedFiles = (await readdir('src/content/docs/wiki')).filter((file) => file.endsWith('.md'));
assert.equal(generatedFiles.length, 1400, 'wiki article count changed');
assert.equal(generatedFiles.length, articleFiles.length, 'generated article count does not match the content model');

const expectedGroups = ['개념과 원리', '활용과 검증', '문서 관계', '참고와 다음 학습'];
let levelFourHeadings = 0;
for (const file of generatedFiles) {
  const [source, article] = await Promise.all([
    read(path.join('src/content/docs/wiki', file)),
    read(path.join('content-model/articles', file.replace(/\.md$/u, '.article.json'))).then(JSON.parse),
  ]);
  assert.match(source, /^tableOfContents: \{ minHeadingLevel: 2, maxHeadingLevel: 4 \}$/mu, `${file}: heading range missing`);
  const headings = [...source.matchAll(/^(#{2,4})\s+(.+)$/gmu)].map((match) => ({ level: match[1].length, title: match[2].trim() }));
  assert.deepEqual(headings.filter(({ level }) => level === 2).map(({ title }) => title), expectedGroups, `${file}: top-level outline groups differ`);
  assert.equal(headings.filter(({ level }) => level === 3).length, article.sections.length + 6, `${file}: article sections are not represented at level three`);
  levelFourHeadings += headings.filter(({ level }) => level === 4).length;
  assert.doesNotMatch(source, /^## (?:선행 개념|관련 문서|이 문서를 가리키는 문서|이 문서를 포함하는 코스|참고 문헌|코스에서 계속 읽기)$/mu, `${file}: former leaf heading remains at level two`);
}
assert.ok(levelFourHeadings > 0, 'no level-four subtopics were generated');

console.log(`W35 content: ${generatedFiles.length} documents use four collapsible groups, nested level-three sections, and ${levelFourHeadings} level-four subtopics`);

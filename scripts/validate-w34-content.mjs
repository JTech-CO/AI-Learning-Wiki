import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const read = (file) => readFile(file, 'utf8');

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

const [
  config,
  header,
  sidebar,
  home,
  randomArticle,
  buildWiki,
  responsiblePath,
  responsibleCourse,
  allPages,
  promptData,
  wiki,
] = await Promise.all([
  read('astro.config.mjs'),
  read('src/components/wiki/WikiHeader.astro'),
  read('src/components/wiki/WikiSidebar.astro'),
  read('src/components/wiki/WikiHome.astro'),
  read('src/components/wiki/RandomArticle.astro'),
  read('scripts/build-wiki.mjs'),
  read('content-model/paths/responsible-ai.path.json').then(JSON.parse),
  read('src/content/docs/course/responsible-ai.md'),
  read('src/content/docs/special/all-pages.md'),
  read('public/data/prompts.json').then(JSON.parse),
  read('public/data/wiki-index.json').then(JSON.parse),
]);

for (const source of [config, header, sidebar, home]) {
  assert.match(source, /전체 문서\(색인\)/u, 'renamed document index link missing');
}
for (const [file, source] of [['header', header], ['sidebar', sidebar], ['home', home]]) {
  assert.doesNotMatch(source, /용어 색인|가나다·영문 용어 색인/u, `${file}: obsolete glossary tab remains`);
  assert.doesNotMatch(source, /href="\/glossary\//u, `${file}: glossary link remains`);
}
assert.match(sidebar, /data-random-document/u, 'sidebar random link is not direct-enabled');
assert.match(home, /data-random-document/u, 'home random link is not direct-enabled');
assert.match(header, /fetch\(indexUrl\)/u, 'random article index is not loaded');
assert.match(header, /article\.id/u, 'random navigation is not based on canonical article IDs');
assert.match(header, /wiki\/\$\{encodeURIComponent\(article\.id\)\}\//u, 'random navigation target is not a base-aware wiki URL');
assert.match(randomArticle, /const ids = wiki\.articles\.map\(\(article\) => article\.id\)/u);
assert.match(randomArticle, /location\.assign\(`\$\{basePath\}wiki\//u);
assert.doesNotMatch(randomArticle, /urls:\s*wiki\.articles\.map/u, 'legacy root-relative random URL list remains');

assert.match(config, /tableOfContents:\s*false/u, 'non-article table of contents is not globally disabled');
assert.match(buildWiki, /tableOfContents: \{ minHeadingLevel: 2, maxHeadingLevel: 4 \}/u, 'wiki article table of contents override missing');
const nonArticleDocs = (await walk('src/content/docs')).filter((file) => file.endsWith('.md') && !file.includes(`${path.sep}wiki${path.sep}`));
for (const file of nonArticleDocs) {
  assert.doesNotMatch(await read(file), /^tableOfContents:/mu, `${file}: non-article page overrides the disabled table of contents`);
}

assert.equal(responsiblePath.title, '신뢰할 수 있는 AI');
assert.match(responsibleCourse, /^title: "신뢰할 수 있는 AI"$/mu);
assert.doesNotMatch(responsibleCourse, /안전하고 신뢰할 수 있는 AI/u);
assert.equal(wiki.courses.find((course) => course.id === 'responsible-ai')?.title, '신뢰할 수 있는 AI');

assert.equal(promptData.prompts.length, 1500, 'public prompt count changed');
assert.equal(promptData.counts.sourceModules, 0, 'legacy prompt source is active');
assert.equal(promptData.counts.canonicalPrompts, 1500, 'canonical prompt count changed');
const residualTitleTone = /(?:가장|제일)\s*(?:먼저|쉬운 시작|자주|많이|유용|기본)|첫 질문 추천|바로 쓰기|어디든 복붙|바로 쓰게 정리|복붙|통째|도와줘|뽑기|안 죽는|캐내기|헛소리|토큰 다이어트|써보세요|쓰세요|써라|^[①-⑩]|^\d+[.)]\s*/u;
const residualTitles = promptData.prompts.filter((prompt) => residualTitleTone.test(prompt.title));
assert.deepEqual(residualTitles.map((prompt) => [prompt.id, prompt.title]), [], 'CTA, emphasis, or source-site tone remains in prompt titles');
assert.doesNotMatch(JSON.stringify(promptData), /eduverse|에듀버스/iu, 'EduVerse naming remains in public prompt data');
assert.equal(promptData.prompts.find((prompt) => prompt.id === 'outreach-followup-sequence-p1')?.title, '4각도 팔로업 시퀀스 초안 생성');
assert.equal(promptData.prompts.find((prompt) => prompt.id === 'p21-schema')?.title, 'Python 함수를 Claude 도구 스키마로 변환');

const wikiFiles = (await readdir('src/content/docs/wiki')).filter((file) => file.endsWith('.md'));
assert.ok(wikiFiles.length >= 1600, 'wiki article count dropped below the W53 baseline');
let planningMarkers = 0;
for (const file of wikiFiles) {
  const source = await read(path.join('src/content/docs/wiki', file));
  planningMarkers += [...source.matchAll(/(?:\*\*|^#{1,6}\s*)W\d+\s+(?=[가-힣A-Za-z])/gmu)].length;
}
assert.equal(planningMarkers, 0, 'public wiki documents still contain W milestone planning labels');
assert.match(allPages, /^title: 전체 문서\(색인\)$/mu);
assert.doesNotMatch(allPages, /^title: 전체 문서$/mu);

console.log('W34 content: direct random navigation, article-only TOC, canonical prompt titles remain source-neutral, ' + wikiFiles.length + ' wiki documents free of W labels');

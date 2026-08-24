import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildPromptLibrary } from './canonical-library.mjs';
import { rankCatalogItems, scoreCatalogItem } from '../src/lib/catalog-search.mjs';

const [library, searchComponent, promptComponent, snippetComponent, wikiCss, libraryCss] = await Promise.all([
  buildPromptLibrary(process.cwd()),
  readFile('src/components/wiki/WikiSearch.astro', 'utf8'),
  readFile('src/components/PromptExplorer.astro', 'utf8'),
  readFile('src/components/SnippetExplorer.astro', 'utf8'),
  readFile('src/styles/wiki.css', 'utf8'),
  readFile('src/styles/wiki-library.css', 'utf8'),
]);

const sample = {
  title: '대규모 언어 모델',
  englishTitle: 'Large Language Model',
  aliases: ['LLM'],
  tags: ['자연어 처리'],
  summary: '많은 매개변수와 데이터로 학습한 언어 모델이다.',
};
assert.ok(scoreCatalogItem(sample, '대규모언어모델').matched, '띄어쓰기 없는 한글 질의를 찾지 못한다');
assert.ok(scoreCatalogItem(sample, 'ㄷㄱㅁ').matched, '한글 초성 질의를 찾지 못한다');
assert.equal(scoreCatalogItem(sample, 'LLM').reason, '별칭', '영문 약어가 별칭으로 평가되지 않는다');
const ranked = rankCatalogItems([
  { title: '언어 모델 운영', summary: 'LLM 배포' },
  sample,
], 'LLM');
assert.equal(ranked[0].item.title, sample.title, '정확한 별칭 일치가 본문 일치보다 먼저 나오지 않는다');

assert.equal(library.prompts.length, 1500);
assert.equal(library.snippets.length, 120);
const promptIds = new Set();
for (const prompt of library.prompts) {
  assert.match(prompt.url, new RegExp(`^/prompt-explorer/\\?id=${prompt.id}#prompt-${prompt.id}$`), `${prompt.id}: 프롬프트 영구 주소가 잘못됐다`);
  assert.ok(!promptIds.has(prompt.id), `${prompt.id}: 프롬프트 ID 중복`);
  promptIds.add(prompt.id);
}
const snippetIds = new Set();
for (const snippet of library.snippets) {
  assert.match(snippet.url, new RegExp(`^/snippet-explorer/\\?id=${snippet.id}#snippet-${snippet.id}$`), `${snippet.id}: 코드·설정 영구 주소가 잘못됐다`);
  assert.ok(!snippetIds.has(snippet.id), `${snippet.id}: 코드·설정 ID 중복`);
  snippetIds.add(snippet.id);
}

assert.match(searchComponent, /import \{ rankCatalogItems \}/, '통합 검색이 공통 가중 검색기를 사용하지 않는다');
assert.match(searchComponent, /async function loadType\(type\)/, '자료 유형별 지연 로더가 없다');
assert.doesNotMatch(searchComponent, /Promise\.all\(\[fetch\(wikiDataUrl\)/, '페이지 진입 즉시 전체 자료를 병렬로 불러온다');
assert.match(searchComponent, /id="wiki-search-category"/, '분야 필터가 없다');
assert.match(searchComponent, /id="wiki-search-course"/, '코스 필터가 없다');
assert.match(searchComponent, /id="wiki-search-examples"/, '작성 예시 필터가 없다');
assert.match(searchComponent, /deepLink\(promptLibraryUrl, 'prompt', item\.id\)/, '검색 결과의 프롬프트 딥 링크가 없다');
assert.match(searchComponent, /deepLink\(snippetLibraryUrl, 'snippet', item\.id\)/, '검색 결과의 코드·설정 딥 링크가 없다');

for (const [label, component, kind] of [
  ['프롬프트', promptComponent, 'prompt'],
  ['코드·설정', snippetComponent, 'snippet'],
]) {
  const hashFunction = `hash${kind[0].toUpperCase()}${kind.slice(1)}Id`;
  assert.match(component, new RegExp(`initialParams\\.get\\('id'\\).*${hashFunction}\\(\\)`), `${label} 직접 접근 ID 처리가 없다`);
  assert.match(component, new RegExp('article\\.id = `'+kind+'-\\$\\{'), `${label} 카드 앵커가 없다`);
  assert.match(component, /영구 링크 복사/, `${label} 영구 링크 복사 동작이 없다`);
  assert.match(component, /전체 .*목록으로 돌아가기/, `${label} 목록 복귀 링크가 없다`);
}
assert.match(wikiCss, /\.wiki-search-facets\s*\{[^}]*grid-template-columns:/s, '복합 검색 필터 레이아웃이 없다');
assert.match(libraryCss, /\.catalog-deep-link\s*\{/, '자료 딥 링크 안내 스타일이 없다');
assert.match(libraryCss, /\.prompt-card:focus, \.snippet-card:focus/, '직접 접근 대상의 키보드 초점 표시가 없다');

console.log(`P0 search v2: weighted Korean search, lazy typed loading, ${library.prompts.length} prompt and ${library.snippets.length} artifact permalinks passed`);


import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const read = (filePath) => readFile(filePath, 'utf8');
const rootFontPx = 19.2;
const navPaddingPx = 2 * 0.75 * rootFontPx;

const layoutBudgets = [
  {
    label: 'tablet',
    viewport: 768,
    navHeightRem: 7,
    contentPx: (2.65 + 2.35 + 0.25) * rootFontPx,
  },
  {
    label: 'small tablet',
    viewport: 576,
    navHeightRem: 8.6,
    contentPx: (2.35 + 2.35 + 1.6 + (2 * 0.25)) * rootFontPx,
  },
  {
    label: 'mobile',
    viewport: 320,
    navHeightRem: 8.6,
    contentPx: (2.15 + 2.35 + 1.6 + (2 * 0.25)) * rootFontPx,
  },
];

for (const layout of layoutBudgets) {
  const availablePx = (layout.navHeightRem * rootFontPx) - navPaddingPx;
  assert.ok(
    availablePx >= layout.contentPx,
    `${layout.label} ${layout.viewport}px 헤더의 높이 예산이 ${layout.contentPx - availablePx}px 부족하다.`,
  );
}

const sourceCss = await read('src/styles/wiki.css');
assert.doesNotMatch(
  sourceCss,
  /\.wiki-header-links\s*\{[^}]*display:\s*none;/u,
  '반응형 헤더에서 전체 문서(색인) 링크를 숨기면 안 된다.',
);
assert.match(
  sourceCss,
  /@media \(max-width: 60rem\)[\s\S]*?--sl-nav-height:\s*7rem;/u,
  '태블릿 헤더 높이 보정이 없다.',
);
assert.match(
  sourceCss,
  /@media \(max-width: 36rem\)[\s\S]*?--sl-nav-height:\s*8\.6rem;/u,
  '모바일 헤더 높이 보정이 없다.',
);
assert.match(
  sourceCss,
  /html\[data-has-sidebar\] \.page > \.header\s*\{[^}]*padding-inline-end:\s*var\(--sl-nav-pad-x\);/u,
  '모바일 검색 행의 전체 너비 보정이 없다.',
);
assert.match(
  sourceCss,
  /\.wiki-wordmark\s*\{[^}]*grid-column:\s*1;[^}]*padding-inline-end:\s*3\.6rem;/u,
  '모바일 메뉴 버튼과 워드마크의 충돌 방지 여백이 없다.',
);

const headerSource = await read('src/components/wiki/WikiHeader.astro');
assert.match(
  headerSource,
  /<nav class="wiki-header-links"[^>]*>[\s\S]*?<a href="\/special\/all-pages\/">전체 문서\(색인\)<\/a>/u,
  '헤더의 전체 문서(색인) 링크가 누락됐다.',
);

const routeChecks = [
  ['wiki/hypothesis/index.html', '가설'],
  ['index.html', 'wiki-home'],
  ['prompt-explorer/index.html', '프롬프트 자료실'],
  ['lab/evaluation-metrics/index.html', '평가 지표 실험실'],
];

for (const [relativePath, marker] of routeChecks) {
  const html = await read(path.join('dist', relativePath));
  assert.ok(html.includes(marker), `${relativePath}에서 ${marker} 표식을 찾지 못했다.`);
  assert.match(
    html,
    /<header class="header[^"]*">[\s\S]*?<nav class="wiki-header-links"[^>]*>[\s\S]*?href="\/special\/all-pages\/"/u,
    `${relativePath}의 고정 헤더에 전체 문서(색인) 링크가 없다.`,
  );
  assert.match(
    html,
    /<form class="wiki-global-search"[^>]*role="search">/u,
    `${relativePath}의 고정 헤더에 검색 폼이 없다.`,
  );
}

const cssFiles = (await readdir('dist/_astro')).filter((file) => file.endsWith('.css'));
const renderedCss = (
  await Promise.all(cssFiles.map((file) => read(path.join('dist/_astro', file))))
).join('\n');
assert.ok(renderedCss.includes('--sl-nav-height:8.6rem'), '빌드 CSS에 모바일 헤더 높이 보정이 없다.');
assert.ok(renderedCss.includes('padding-inline-end:var(--sl-nav-pad-x)'), '빌드 CSS에 모바일 검색 너비 보정이 없다.');

console.log(
  `responsive header: ${layoutBudgets.length} viewport budgets and ${routeChecks.length} rendered routes passed`,
);

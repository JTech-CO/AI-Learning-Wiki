import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const read = (filePath) => readFile(filePath, 'utf8');

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(
    normalized.length === 3
      ? [...normalized].map((character) => character.repeat(2)).join('')
      : normalized,
    16,
  );
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const relativeLuminance = (hex) => {
  const channels = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
};

const contrastRatio = (foreground, background) => {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
};

const palettePairs = [
  ['본문', '#202122', '#ffffff', 7],
  ['표 머리글', '#202122', '#eaecf0', 7],
  ['링크', '#3366cc', '#ffffff', 4.5],
  ['주요 버튼', '#ffffff', '#3366cc', 4.5],
];

for (const [label, foreground, background, minimum] of palettePairs) {
  const ratio = contrastRatio(foreground, background);
  assert(
    ratio >= minimum,
    `${label} 대비가 ${ratio.toFixed(2)}:1로 기준 ${minimum}:1보다 낮다.`,
  );
}

const wikiCss = await read('src/styles/wiki.css');
assert(
  /:root,\s*:root\[data-theme='dark'\]\s*\{[\s\S]*?--sl-color-white:\s*#202122;[\s\S]*?--sl-color-black:\s*#fff;/u.test(wikiCss),
  '강제 밝은 테마에서 Starlight의 white/black 의미 색상 순서가 올바르지 않다.',
);
assert(
  /\.sl-markdown-content th\s*\{[^}]*color:\s*#202122;[^}]*-webkit-text-fill-color:\s*#202122;/u.test(wikiCss),
  '표 머리글의 명시적 전경색 보정이 없다.',
);
assert(
  /\.sl-markdown-content summary\s*\{[^}]*color:\s*#202122;[^}]*-webkit-text-fill-color:\s*#202122;/u.test(wikiCss),
  '펼침 제목의 명시적 전경색 보정이 없다.',
);
assert(
  /\.sl-markdown-content a:hover\s*\{[^}]*color:\s*#2a4b8d;/u.test(wikiCss),
  '밝은 배경용 링크 호버색 보정이 없다.',
);

const labCss = await read('src/styles/wiki-lab.css');
const labTableSelectors = [
  '.lab-confusion-table',
  '.lab-metric-table',
  '.lab-memory-table',
  '.lab-context-table',
  '.lab-training-state-table',
  '.lab-validation-table',
  '.lab-variable-table',
  '.lab-token-table',
  '.lab-token-cost-table',
  '.lab-rag-metric-table',
  '.lab-rag-query-table',
];
for (const selector of labTableSelectors) {
  assert(labCss.includes(selector), `${selector} 스타일이 누락됐다.`);
}
assert(
  labCss.includes('.lab-tool :is(')
    && labCss.includes('-webkit-text-fill-color: currentColor;'),
  'AI 실험실 표 셀의 명시적 전경색 보정이 없다.',
);


const cssFiles = (await readdir('dist/_astro')).filter((file) => file.endsWith('.css'));
const renderedCss = (
  await Promise.all(cssFiles.map((file) => read(path.join('dist/_astro', file))))
).join('\n');
assert(
  renderedCss.includes('--sl-color-white:#202122;--sl-color-black:#fff'),
  '빌드 CSS에 밝은 테마 의미 색상 보정이 반영되지 않았다.',
);
assert(
  renderedCss.includes('.sl-markdown-content th{color:#202122;-webkit-text-fill-color:#202122;background:#eaecf0}'),
  '빌드 CSS에 표 머리글 전경색 보정이 반영되지 않았다.',
);
assert(
  renderedCss.includes('.sl-markdown-content summary{color:#202122;-webkit-text-fill-color:#202122}'),
  '빌드 CSS에 펼침 제목 전경색 보정이 반영되지 않았다.',
);
assert(
  renderedCss.includes('.lab-tool :is(')
    && renderedCss.includes('-webkit-text-fill-color:currentColor'),
  '빌드 CSS에 AI 실험실 표 셀 전경색 보정이 반영되지 않았다.',
);


const routeChecks = [
  ['index.html', 'wiki-home'],
  ['lab/index.html', 'lab-directory'],
  ['lab/evaluation-metrics/index.html', 'data-evaluation-metrics-lab'],
  ['lab/model-memory/index.html', 'data-model-memory-calculator'],
  ['lab/token-context/index.html', 'data-token-context-calculator'],
  ['lab/rag-evaluation/index.html', 'data-rag-evaluation-lab'],
  ['lab/learning-path/index.html', 'data-learning-path-builder'],
  ['lab/prompt-schema/index.html', 'data-prompt-schema-validator'],
  ['special/editor-quality/index.html', 'data-editor-quality-dashboard'],
  ['prompt-explorer/index.html', 'data-prompts-url'],
  ['snippet-explorer/index.html', 'data-snippets-url'],
  ['wiki/artificial-intelligence/index.html', '참고 문헌'],
];

for (const [relativePath, marker] of routeChecks) {
  const html = await read(path.join('dist', relativePath));
  assert(html.includes(marker), `${relativePath}에서 ${marker} 표식을 찾지 못했다.`);
  assert(
    /href="\/_astro\/common\.[^"]+\.css"/u.test(html),
    `${relativePath}가 보정된 공통 스타일시트를 불러오지 않는다.`,
  );
}


console.log(
  `light-theme contrast: ${routeChecks.length} surfaces, ${labTableSelectors.length} lab table families and ${palettePairs.length} palette pairs passed`,
);

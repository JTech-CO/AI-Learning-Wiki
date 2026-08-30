import assert from 'node:assert/strict'; import fs from 'node:fs';
const read = (file) => fs.readFileSync(file, 'utf8');
const hub = read('dist/lab/index.html'); const page = read('dist/lab/rag-evaluation/index.html');
assert.match(hub, /href="\/lab\/rag-evaluation\/"/); assert.match(page, /data-rag-evaluation-lab/); assert.match(page, /RAG 지표 계산하기/); assert.match(page, /JSON 내보내기/); assert.match(page, /CSV 내보내기/); assert.match(page, /rag-ranking-metrics-v2/);
const css = fs.readdirSync('dist/_astro').filter((file) => file.endsWith('.css')).map((file) => read(`dist/_astro/${file}`)).join('\n'); assert.match(css, /\.lab-rag-metric-table/); assert.match(css, /\.lab-rag-query-table/);
console.log('W68 render: RAG evaluation tool, import/export and lab navigation OK');

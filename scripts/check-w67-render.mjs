import assert from 'node:assert/strict'; import fs from 'node:fs';
const read = (file) => fs.readFileSync(file, 'utf8');
const hub = read('dist/lab/index.html'); const page = read('dist/lab/token-context/index.html');
assert.match(hub, /href="\/lab\/token-context\/"/); assert.match(page, /data-token-context-calculator/); assert.match(page, /문맥 예산 계산하기/); assert.match(page, /모델 메모리·KV 캐시·문맥 계산기/); assert.match(page, /token-context-budget-v1/);
const css = fs.readdirSync('dist/_astro').filter((file) => file.endsWith('.css')).map((file) => read(`dist/_astro/${file}`)).join('\n'); assert.match(css, /\.lab-token-table/); assert.match(css, /\.lab-token-settings-grid/);
console.log('W67 render: token context tool and lab navigation OK');

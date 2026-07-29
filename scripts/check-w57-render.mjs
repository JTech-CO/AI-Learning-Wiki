import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const hubPath = 'dist/lab/index.html';
const toolPath = 'dist/lab/model-memory/index.html';

assert.ok(fs.existsSync(hubPath), 'W57 rendered lab hub is missing');
assert.ok(fs.existsSync(toolPath), 'W57 rendered model memory tool is missing');

const hub = read(hubPath);
const tool = read(toolPath);
assert.match(hub, /AI 실험실/);
assert.match(hub, /모델 메모리·KV 캐시·문맥 계산기/);
assert.match(hub, /href="\/lab\/model-memory\/"/);
assert.match(tool, /data-model-memory-calculator/);
assert.match(tool, /name="parameterBillions"/);
assert.match(tool, /name="precision"/);
assert.match(tool, /name="executionMode"/);
assert.match(tool, /name="layerCount"/);
assert.match(tool, /name="batchSize"/);
assert.match(tool, /name="contextLength"/);
assert.match(tool, /name="kvHeadCount"/);
assert.match(tool, /name="headDimension"/);
assert.match(tool, /메모리 계산하기/);
assert.match(tool, /KV 캐시와 문맥 길이/);
assert.match(tool, /총 추정치에서 제외한 항목/);
assert.match(tool, /계산 가정/);

const compiledStyles = fs.readdirSync('dist/_astro')
  .filter((file) => file.endsWith('.css'))
  .map((file) => read(`dist/_astro/${file}`))
  .join('\n');
assert.match(compiledStyles, /\.lab-memory-table/);
assert.match(compiledStyles, /\.lab-context-table/);
assert.match(compiledStyles, /\.lab-memory-summary/);

console.log('W57 render: /lab/ and /lab/model-memory/ public pages OK');

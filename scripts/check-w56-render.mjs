import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const hubPath = 'dist/lab/index.html';
const toolPath = 'dist/lab/evaluation-metrics/index.html';

assert.ok(fs.existsSync(hubPath), 'W56 rendered lab hub is missing');
assert.ok(fs.existsSync(toolPath), 'W56 rendered evaluation metrics tool is missing');

const hub = read(hubPath);
const tool = read(toolPath);
assert.match(hub, /AI 실험실/);
assert.match(hub, /평가 지표 실험실/);
assert.match(hub, /href="\/lab\/evaluation-metrics\/"/);
assert.match(tool, /data-evaluation-metrics-lab/);
assert.match(tool, /name="trueNegative"/);
assert.match(tool, /name="falsePositive"/);
assert.match(tool, /name="falseNegative"/);
assert.match(tool, /name="truePositive"/);
assert.match(tool, /지표 계산하기/);
assert.match(tool, /혼동행렬/);
assert.match(tool, /임곗값 변화의 방향/);
assert.match(tool, /계산 기준과 가정/);

const compiledStyles = fs.readdirSync('dist/_astro')
  .filter((file) => file.endsWith('.css'))
  .map((file) => read(`dist/_astro/${file}`))
  .join('\n');
assert.match(compiledStyles, /\.lab-metric-table/);
assert.match(compiledStyles, /\.lab-threshold-grid/);

console.log('W56 render: /lab/ and /lab/evaluation-metrics/ public pages OK');

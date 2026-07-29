import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const hubPath = 'dist/lab/index.html';
const toolPath = 'dist/lab/learning-path/index.html';

assert.ok(fs.existsSync(hubPath), 'W55 rendered lab hub is missing');
assert.ok(fs.existsSync(toolPath), 'W55 rendered learning path tool is missing');

const hub = read(hubPath);
const tool = read(toolPath);
assert.match(hub, /AI 실험실/);
assert.match(hub, /맞춤 학습 경로 생성기/);
assert.match(hub, /href="\/lab\/learning-path\/"/);
assert.match(tool, /data-learning-path-builder/);
assert.match(tool, /data-wiki-index-url="\/data\/wiki-index\.json"/);
assert.match(tool, /학습 경로 만들기/);
assert.match(tool, /선수 관계 충족률/);
assert.match(tool, /계산 기준과 가정/);
const compiledStyles = fs.readdirSync('dist/_astro')
  .filter((file) => file.endsWith('.css'))
  .map((file) => read(`dist/_astro/${file}`))
  .join('\n');
assert.match(compiledStyles, /\.lab-tool-form/);

console.log('W55 render: /lab/ and /lab/learning-path/ public pages OK');

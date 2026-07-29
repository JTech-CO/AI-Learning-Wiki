import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const hubPath = 'dist/lab/index.html';
const toolPath = 'dist/lab/prompt-schema/index.html';

assert.ok(fs.existsSync(hubPath), 'W58 rendered lab hub is missing');
assert.ok(fs.existsSync(toolPath), 'W58 rendered prompt schema tool is missing');

const hub = read(hubPath);
const tool = read(toolPath);
assert.match(hub, /AI 실험실/);
assert.match(hub, /프롬프트·JSON Schema 검증기/);
assert.match(hub, /href="\/lab\/prompt-schema\/"/);
assert.match(tool, /data-prompt-schema-validator/);
assert.match(tool, /name="promptText"/);
assert.match(tool, /name="variableDefinitions"/);
assert.match(tool, /name="outputSchema"/);
assert.match(tool, /name="exampleOutput"/);
assert.match(tool, /프롬프트·스키마 검증하기/);
assert.match(tool, /원문 제외 보고서 복사/);
assert.match(tool, /검사 항목/);
assert.match(tool, /변수 대조/);
assert.match(tool, /구조화 출력 검사/);
assert.match(tool, /검사 가정과 한계/);

const compiledStyles = fs.readdirSync('dist/_astro')
  .filter((file) => file.endsWith('.css'))
  .map((file) => read(`dist/_astro/${file}`))
  .join('\n');
assert.match(compiledStyles, /\.lab-validation-table/);
assert.match(compiledStyles, /\.lab-schema-input-grid/);
assert.match(compiledStyles, /\.lab-prompt-schema-summary/);

console.log('W58 render: /lab/ and /lab/prompt-schema/ public pages OK');

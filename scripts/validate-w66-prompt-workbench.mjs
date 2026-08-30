import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  PROMPT_WORKBENCH_VERSION,
  createWorkbenchStorageKey,
  extractBracketVariables,
  fillPromptTemplate,
  inferWorkbenchFormat,
  normalizeWorkbenchState,
  validateWorkbenchOutput,
} from '../src/lib/prompt-workbench.mjs';

const [explorerSource, uiSource, styleSource] = await Promise.all([
  readFile('src/components/PromptExplorer.astro', 'utf8'),
  readFile('src/lib/prompt-workbench-ui.mjs', 'utf8'),
  readFile('src/styles/wiki-library.css', 'utf8'),
]);

const template = [
  '[대상]에게 [요청]을 설명한다.',
  '[대상]의 배경은 [배경: 두 문장]이다.',
  '[문서 링크](https://example.com)는 변수로 세지 않는다.',
].join('\n');
const variables = extractBracketVariables(template);
assert.deepEqual(variables.map(({ token }) => token), ['[대상]', '[요청]', '[배경: 두 문장]']);
assert.equal(variables[0].occurrences, 2);
assert.deepEqual(extractBracketVariables('서비스 범위: [...]').map(({ token }) => token), ['[...]']);

const filled = fillPromptTemplate(template, {
  '[대상]': '입문자',
  '[요청]': '검색 증강 생성',
});
assert.match(filled.completed, /입문자에게 검색 증강 생성을 설명한다/u);
assert.equal(filled.replacedCount, 3);
assert.deepEqual(filled.unresolved.map(({ token }) => token), ['[배경: 두 문장]']);

assert.equal(inferWorkbenchFormat('markdown'), 'markdown');
assert.equal(inferWorkbenchFormat('json-schema'), 'json-schema');
assert.equal(inferWorkbenchFormat('yaml'), 'yaml');
assert.equal(inferWorkbenchFormat('plain'), 'none');

const markdownOk = validateWorkbenchOutput('# 결과\n\n- 항목 1\n- 항목 2', 'markdown');
assert.equal(markdownOk.valid, true);
assert.equal(markdownOk.status, 'ok');
const markdownBroken = validateWorkbenchOutput('#제목\n\n```js\nconst value = 1;', 'markdown');
assert.equal(markdownBroken.valid, false);
assert.ok(markdownBroken.issues.length >= 2);

const schemaOk = validateWorkbenchOutput(JSON.stringify({
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['answer'],
  properties: { answer: { type: 'string' } },
}), 'json-schema');
assert.equal(schemaOk.valid, true);
const schemaBroken = validateWorkbenchOutput('{"type":"object",}', 'json-schema');
assert.equal(schemaBroken.valid, false);
assert.equal(schemaBroken.status, 'error');

const yamlOk = validateWorkbenchOutput('title: 결과\nitems:\n  - 첫 번째\n  - 두 번째', 'yaml');
assert.equal(yamlOk.valid, true);
const yamlBroken = validateWorkbenchOutput('title: 결과\n\titems:\n  key:value\n  key: duplicate', 'yaml');
assert.equal(yamlBroken.valid, false);
assert.match(yamlBroken.issues.map(({ message }) => message).join('\n'), /탭/u);

assert.equal(validateWorkbenchOutput('', 'yaml').status, 'idle');
assert.equal(createWorkbenchStorageKey('sample-prompt'), 'ai-learning-wiki:prompt-workbench:v1:sample-prompt');
assert.throws(() => createWorkbenchStorageKey(''), /ID/u);

const normalized = normalizeWorkbenchState({
  variableValues: { '[대상]': '입문자', '[허용되지 않음]': '제거' },
  testInput: '입력',
  expectedOutput: '출력',
  validationFormat: 'yaml',
}, variables);
assert.equal(normalized.version, PROMPT_WORKBENCH_VERSION);
assert.deepEqual(normalized.variableValues, { '[대상]': '입문자' });
assert.equal(normalized.validationFormat, 'yaml');
assert.equal(normalizeWorkbenchState({ validationFormat: 'html' }, variables).validationFormat, 'none');

assert.match(explorerSource, /createPromptWorkbench\(prompt\)/u);
assert.match(explorerSource, /const promptUrl = \(id, absolute = false\)/u);
assert.match(explorerSource, /url\.searchParams\.set\('id', id\)/u);
assert.match(explorerSource, /url\.hash = `prompt-\$\{encodeURIComponent\(id\)\}`/u);
assert.match(uiSource, /localStorage\.setItem\(createWorkbenchStorageKey\(prompt\.id\)/u);
assert.match(uiSource, /외부 모델이나 서버로 전송하지 않는다/u);
assert.match(uiSource, /원본\/변형 비교/u);
assert.match(uiSource, /JSON Schema Draft 2020-12/u);
assert.doesNotMatch(uiSource, /\bfetch\s*\(|XMLHttpRequest|WebSocket/u);
assert.match(styleSource, /\.prompt-workbench-compare/u);
assert.match(styleSource, /@media\(max-width:50rem\)/u);

const manifest = JSON.parse(await readFile('content-model/quality/w66-core-prompts.json', 'utf8'));
const promptFiles = (await readdir('content-model/library/prompts')).filter((file) => file.endsWith('.prompt.json'));
const prompts = await Promise.all(promptFiles.map(async (file) =>
  JSON.parse(await readFile(path.join('content-model/library/prompts', file), 'utf8'))));
const byId = new Map(prompts.map((prompt) => [prompt.id, prompt]));
assert.equal(manifest.milestone, 'W66');
assert.equal(manifest.targetCount, 300);
assert.equal(manifest.promptIds.length, 300);
assert.equal(new Set(manifest.promptIds).size, 300);
assert.ok(manifest.promptIds.every((id) => byId.has(id)));

for (const id of manifest.promptIds) {
  const prompt = byId.get(id);
  assert.ok(prompt.examples.length > 0, `${id}: 핵심 프롬프트 예시가 없다.`);
  assert.ok(prompt.examples.every(({ input, output }) => input.trim() && output.trim()), `${id}: 핵심 프롬프트 예시가 비었다.`);
}

const withExamples = prompts.filter(({ examples }) => examples.length > 0);
assert.ok(withExamples.length >= Math.ceil(prompts.length * 0.5), `전체 예시 보유율: ${withExamples.length}/${prompts.length}`);
assert.equal(prompts.flatMap(({ examples }) => examples).filter(({ output }) => !output.trim()).length, 0, '빈 기대 출력이 남았다.');

const courseIds = [...new Set(prompts.map(({ courseIds: [courseId] }) => courseId))].sort();
assert.equal(courseIds.length, 16);
for (const courseId of courseIds) {
  const coursePrompts = prompts.filter(({ courseIds: [id] }) => id === courseId);
  const covered = coursePrompts.filter(({ examples }) => examples.length > 0).length;
  assert.ok(covered >= Math.ceil(coursePrompts.length * 0.3), `${courseId}: ${covered}/${coursePrompts.length}`);
  assert.ok(manifest.courseCounts[courseId] >= 18, `${courseId}: 핵심 프롬프트 분배가 부족하다.`);
}

const generatedExamples = prompts.flatMap((prompt) =>
  prompt.examples.filter(({ label }) => label === 'W66 검증 예시').map((example) => ({ prompt, example })));
assert.equal(generatedExamples.length, 218);
for (const { prompt, example } of generatedExamples) {
  assert.ok(example.input.length >= 20, `${prompt.id}: 생성 입력이 지나치게 짧다.`);
  assert.ok(example.output.length >= 80, `${prompt.id}: 생성 기대 출력이 지나치게 짧다.`);
  assert.doesNotMatch(example.input, /\b실제 값\b|요구된 형식에 맞춰/u, `${prompt.id}: 기계적 입력 문구가 남았다.`);
  assert.doesNotMatch(example.input, /\[\s*(?:\.{2,}|…+)\s*\]/u, `${prompt.id}: 말줄임 자리표시자가 남았다.`);
  assert.doesNotMatch(example.output, /\b실제 값\b|요구된 형식에 맞춰|검토 가능한 결과를 제시/u, `${prompt.id}: 기계적 출력 문구가 남았다.`);
  assert.ok(example.output.includes(prompt.title), `${prompt.id}: 기대 출력에 프롬프트 용도가 드러나지 않는다.`);
  const format = inferWorkbenchFormat(prompt.kind);
  if (format !== 'none') {
    const validation = validateWorkbenchOutput(example.output, format);
    assert.equal(validation.valid, true, `${prompt.id}: ${validation.summary}`);
  }
}

console.log(`W66 prompt workbench: core 300/300, examples ${withExamples.length}/${prompts.length}, empty outputs 0, 16 courses >=30%, UI and formats OK`);

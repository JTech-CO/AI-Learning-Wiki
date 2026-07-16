import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ajvMessage, loadLibraryV2Validators } from './library-v2-lib.mjs';

const { ajv, promptSchema, artifactSchema, validatePrompt, validateArtifact } = await loadLibraryV2Validators();
const policy = JSON.parse(await readFile('content-model/library-policy-v2.json', 'utf8'));
assert.equal(policy.version, 'W39-2026-07-16');
assert.equal(ajv.validateSchema(promptSchema), true, ajv.errorsText(ajv.errors));
assert.equal(ajv.validateSchema(artifactSchema), true, ajv.errorsText(ajv.errors));

const prompt = {
  id: 'structured-review-example',
  version: 1,
  title: '구조화된 검토 예시',
  summary: '문서 검토 결과를 지정된 JSON 구조로 반환하는 프롬프트 예시다.',
  kind: 'json-schema',
  difficulty: 'advanced',
  template: '아래 문서를 검토하고 지정된 JSON 스키마로 결과를 작성해줘. 문서: {{document}}',
  variables: [{ name: 'document', description: '검토할 문서 본문', required: true, example: '제품 요구사항 문서' }],
  outputContract: { format: 'json', description: '발견 사항과 심각도를 JSON으로 반환한다.', schema: { type: 'object' }, sections: [] },
  notes: '중요한 판단은 원문 및 담당자의 검토와 대조한다.',
  examples: [{ label: '요구사항 검토', input: '제품 요구사항 문서', output: '{"issues":[]}' }],
  tags: ['문서 분석', '구조화 출력'],
  courseIds: ['prompt-systems'],
  relatedWikiSlugs: ['structured-output'],
  providerScope: 'provider-agnostic',
  provenance: { origin: 'wiki-original', authorship: 'editorial', legacyKey: null },
  status: 'reviewed',
  reviewedAt: '2026-07-16'
};
assert.equal(validatePrompt(prompt), true, ajvMessage(validatePrompt));
assert.equal(validatePrompt({ ...prompt, notes: '' }), false, 'empty usage note must fail');
assert.equal(validatePrompt({ ...prompt, unexpected: true }), false, 'unknown prompt field must fail');

const artifact = {
  id: 'json-schema-validation-example',
  version: 1,
  title: 'JSON Schema 검증 예시',
  summary: 'JSON 문서가 지정된 스키마를 만족하는지 확인하는 설정 자료다.',
  type: 'schema',
  language: 'JSON',
  runtime: 'JSON Schema Draft 7 호환 검증기',
  files: [{ path: 'schema.json', language: 'json', content: '{"type":"object"}' }],
  dependencies: [],
  environmentVariables: [],
  runInstructions: ['schema.json을 Draft 7 호환 검증기에 입력한다.'],
  validation: { method: 'parse', command: null, expectedResult: '스키마가 오류 없이 파싱된다.' },
  securityNotes: ['검증 대상 문서에 비밀 값이나 개인정보를 포함하지 않는다.'],
  tags: ['구조화 출력', '검증'],
  courseIds: ['prompt-systems'],
  relatedWikiSlugs: ['json-schema'],
  provenance: { origin: 'wiki-original', authorship: 'editorial', legacyKey: null },
  status: 'reviewed',
  reviewedAt: '2026-07-16'
};
assert.equal(validateArtifact(artifact), true, ajvMessage(validateArtifact));
assert.equal(validateArtifact({ ...artifact, securityNotes: [] }), false, 'artifact without security notes must fail');
assert.equal(validateArtifact({ ...artifact, type: 'unknown' }), false, 'unknown artifact type must fail');

assert.equal(policy.sourceOfTruth.prompts, 'content-model/library/prompts/*.prompt.json');
assert.equal(policy.sourceOfTruth.artifacts, 'content-model/library/artifacts/*.artifact.json');
assert.equal(policy.compatibility.legacyModulesMayBeBuildInput, false);
assert.equal(policy.promptQuality.longFormThresholdCharacters, 500);
assert.deepEqual(Object.keys(policy.targetCounts).sort(), ['articles', 'artifacts', 'courses', 'prompts']);

console.log('W39 library schemas: prompt v2 and artifact v2 compile; required metadata, closed fields and negative fixtures validated');

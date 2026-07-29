import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  createPortablePromptSchemaReport,
  promptSchemaConstants,
  toPromptSchemaLabSession,
  validatePromptSchema,
} from '../src/lib/prompt-schema.mjs';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const validationMessage = (validate) =>
  validate.errors
    ?.map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ')
  ?? 'unknown validation error';

const registry = readJson('content-model/labs/registry.json');
const wiki = readJson('public/data/wiki-index.json');
const fixtureSet = readJson('content-model/labs/fixtures/w58-prompt-schema.json');
const report = readJson('content-model/quality/w58-prompt-schema.json');
const sessionSchema = readJson('content-model/schema.lab-session-v1.json');
const tool = registry.tools.find(({ id }) => id === 'prompt-schema');
const wikiIds = new Set(wiki.articles.map(({ id }) => id));
const courseIds = new Set(wiki.courses.map(({ id }) => id));

assert.ok(tool, 'prompt-schema tool manifest is missing');
assert.equal(tool.title.ko, '프롬프트·JSON Schema 검증기');
assert.equal(tool.status, 'active');
assert.equal(tool.plannedMilestone, 'W58');
assert.equal(tool.route, '/lab/prompt-schema/');
assert.equal(tool.execution.mode, 'client-only');
assert.equal(tool.execution.networkAccess, 'none');
assert.equal(tool.execution.transmitsUserInput, false);
assert.equal(tool.execution.persistentStorage, 'none');
assert.equal(tool.releaseGate.shareableState, false);
assert.equal(tool.evidence.formulaVersion, promptSchemaConstants.formulaVersion);
assert.deepEqual(
  tool.contracts.inputFields.map(({ id }) => id),
  ['prompt-text', 'variable-definitions', 'output-schema', 'example-output'],
);
assert.deepEqual(
  tool.contracts.warningDefinitions.map(({ code }) => code),
  [
    'UNRESOLVED_VARIABLE',
    'INVALID_VARIABLE_DEFINITIONS',
    'INVALID_JSON_SCHEMA',
    'INVALID_EXAMPLE_JSON',
    'EXAMPLE_SCHEMA_MISMATCH',
  ],
);

for (const wikiSlug of tool.contentLinks.wikiSlugs) {
  assert.ok(wikiIds.has(wikiSlug), `unknown linked wiki article: ${wikiSlug}`);
}
for (const courseId of tool.contentLinks.courseIds) {
  assert.ok(courseIds.has(courseId), `unknown linked course: ${courseId}`);
}
for (const field of [...tool.contracts.inputFields, ...tool.contracts.outputFields]) {
  for (const slug of field.wikiSlugs) {
    assert.ok(wikiIds.has(slug), `${field.id}: unknown linked wiki article ${slug}`);
  }
}

const requiredFiles = [
  'src/lib/prompt-schema.mjs',
  'src/components/lab/PromptSchemaValidator.astro',
  'src/content/docs/lab/prompt-schema.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w58-prompt-schema.json',
];
for (const file of requiredFiles) assert.ok(fs.existsSync(file), `missing W58 file: ${file}`);

const componentSource = readText('src/components/lab/PromptSchemaValidator.astro');
const moduleSource = readText('src/lib/prompt-schema.mjs');
const pageSource = readText('src/content/docs/lab/prompt-schema.mdx');
const sidebarSource = readText('src/components/wiki/WikiSidebar.astro');
const homeSource = readText('src/components/wiki/WikiHome.astro');
const styleSource = readText('src/styles/wiki-lab.css');

assert.match(componentSource, /data-prompt-schema-validator/);
assert.match(componentSource, /aria-live="polite"/);
assert.match(componentSource, /navigator\.clipboard/);
assert.match(componentSource, /reportValidity/);
assert.match(componentSource, /원문 제외 보고서 복사/);
assert.doesNotMatch(componentSource, /URLSearchParams|history\.replaceState/);
assert.doesNotMatch(componentSource, /localStorage|sessionStorage/);
assert.doesNotMatch(componentSource, /fetch\(/);
assert.doesNotMatch(componentSource, /Math\.random/);
assert.match(moduleSource, /Ajv2020/);
assert.match(moduleSource, /addFormats/);
assert.match(moduleSource, /remoteReferencesLoaded|외부 네트워크의 원격 참조/);
assert.match(moduleSource, /createPortablePromptSchemaReport/);
assert.match(pageSource, /prompt-schema-v1/);
assert.match(pageSource, /JSON Schema Draft 2020-12/);
assert.match(pageSource, /원격 `\$ref`/);
assert.match(pageSource, /URL에도 포함하지 않는다/);
assert.match(sidebarSource, /href="\/lab\/prompt-schema\/"/);
assert.match(homeSource, /href="\/lab\/prompt-schema\/"/);
assert.match(styleSource, /\.lab-validation-table/);
assert.match(styleSource, /\.lab-schema-input-grid/);
assert.match(styleSource, /\.lab-prompt-schema-summary/);
assert.match(styleSource, /@media \(max-width: 50rem\)/);
assert.match(styleSource, /\.lab-field textarea:focus-visible/);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSession = ajv.compile(sessionSchema);

const stableResult = (result) => ({
  resultStatus: result.resultStatus,
  promptValidation: result.promptValidation,
  schemaValidation: result.schemaValidation,
  validationReport: result.validationReport,
  warnings: result.warnings,
  assumptions: result.assumptions,
});

assert.equal(fixtureSet.milestone, 'W58');
assert.equal(fixtureSet.toolId, 'prompt-schema');
assert.equal(fixtureSet.formulaVersion, promptSchemaConstants.formulaVersion);
assert.equal(fixtureSet.fixtures.length, tool.releaseGate.deterministicFixtureCount);
assert.equal(new Set(fixtureSet.fixtures.map(({ id }) => id)).size, fixtureSet.fixtures.length);

const observedKeywords = new Set();
for (const fixture of fixtureSet.fixtures) {
  const first = validatePromptSchema(fixture.inputs);
  const second = validatePromptSchema(fixture.inputs);
  assert.deepEqual(stableResult(first), stableResult(second), `${fixture.id}: non-deterministic result`);

  const warningCodes = first.warnings.map(({ code }) => code);
  const issueCodes = first.validationReport.issues.map(({ code }) => code);
  const issueKeywords = first.validationReport.issues.map(({ keyword }) => keyword);
  assert.equal(first.resultStatus, fixture.expected.resultStatus, `${fixture.id}: result status`);
  assert.deepEqual(warningCodes, fixture.expected.warningCodes, `${fixture.id}: warning codes`);
  assert.deepEqual(issueCodes, fixture.expected.issueCodes, `${fixture.id}: issue codes`);
  assert.deepEqual(issueKeywords, fixture.expected.issueKeywords, `${fixture.id}: issue keywords`);
  assert.deepEqual(
    first.promptValidation.unresolvedVariables.undefined,
    fixture.expected.undefinedVariables,
    `${fixture.id}: undefined variables`,
  );
  assert.deepEqual(
    first.promptValidation.unresolvedVariables.unused,
    fixture.expected.unusedVariables,
    `${fixture.id}: unused variables`,
  );
  assert.equal(
    first.schemaValidation.schemaValid,
    fixture.expected.schemaValid,
    `${fixture.id}: schema validity`,
  );
  assert.equal(
    first.schemaValidation.exampleMatchesSchema,
    fixture.expected.exampleMatchesSchema,
    `${fixture.id}: example match`,
  );

  for (const issue of first.validationReport.issues) {
    assert.ok(issue.path.length > 0, `${fixture.id}: issue path is required`);
    assert.ok(issue.message.length >= 8, `${fixture.id}: issue message is too short`);
    assert.ok(issue.suggestion.length >= 8, `${fixture.id}: issue suggestion is too short`);
    if (issue.keyword) observedKeywords.add(issue.keyword);
    for (const slug of issue.wikiSlugs) {
      assert.ok(wikiIds.has(slug), `${fixture.id}: unknown issue article ${slug}`);
    }
  }
  for (const warning of first.warnings) {
    assert.ok(warning.message.length <= 240, `${fixture.id}: warning message is too long`);
    for (const slug of warning.wikiSlugs) {
      assert.ok(wikiIds.has(slug), `${fixture.id}: unknown warning article ${slug}`);
    }
  }
  for (const assumption of first.assumptions) {
    for (const sourceId of assumption.sourceIds) {
      assert.ok(wikiIds.has(sourceId), `${fixture.id}: unknown assumption article ${sourceId}`);
    }
  }

  const session = toPromptSchemaLabSession(first);
  assert.equal(
    validateSession(session),
    true,
    `${fixture.id}: ${validationMessage(validateSession)}`,
  );
  const portable = createPortablePromptSchemaReport(first);
  const portableText = JSON.stringify(portable);
  if (typeof fixture.inputs.promptText === 'string' && fixture.inputs.promptText.length >= 16) {
    assert.equal(
      portableText.includes(fixture.inputs.promptText),
      false,
      `${fixture.id}: portable report leaked prompt text`,
    );
  }
}

for (const keyword of [
  'json-syntax',
  'variable-use',
  'variable-definition',
  'required',
  'additionalProperties',
  'type',
]) {
  assert.ok(observedKeywords.has(keyword), `missing fixture coverage for ${keyword}`);
}

assert.throws(
  () => validatePromptSchema({ promptText: '' }),
  /한 글자 이상/,
);
assert.throws(
  () => validatePromptSchema({ promptText: '가'.repeat(promptSchemaConstants.maxPromptLength + 1) }),
  /초과할 수 없다/,
);

const malformedToken = validatePromptSchema({
  promptText: '{{customer name}}을 요약한다.',
  variableDefinitions: [],
});
assert.deepEqual(
  malformedToken.warnings.map(({ code }) => code),
  ['UNRESOLVED_VARIABLE'],
);
assert.equal(malformedToken.validationReport.issues[0].code, 'MALFORMED_VARIABLE_TOKEN');

const duplicateDefinition = validatePromptSchema({
  promptText: '{{topic}}을 설명한다.',
  variableDefinitions: ['topic', 'topic'],
});
assert.equal(duplicateDefinition.resultStatus, 'error');
assert.ok(
  duplicateDefinition.validationReport.issues.some(
    ({ code }) => code === 'DUPLICATE_VARIABLE_DEFINITION',
  ),
);

const remoteReference = validatePromptSchema({
  promptText: 'JSON으로 답한다.',
  outputSchema: { $ref: 'https://example.com/external-schema.json' },
});
assert.equal(remoteReference.resultStatus, 'error');
assert.deepEqual(
  remoteReference.warnings.map(({ code }) => code),
  ['INVALID_JSON_SCHEMA'],
);

const booleanSchema = validatePromptSchema({
  promptText: 'JSON 값으로 답한다.',
  outputSchema: true,
  exampleOutput: { any: 'value' },
});
assert.equal(booleanSchema.resultStatus, 'ok');
assert.equal(booleanSchema.schemaValidation.exampleMatchesSchema, true);

const exampleWithoutSchema = validatePromptSchema({
  promptText: 'JSON 값으로 답한다.',
  exampleOutput: { value: true },
});
assert.equal(exampleWithoutSchema.resultStatus, 'warning');
assert.deepEqual(
  exampleWithoutSchema.warnings.map(({ code }) => code),
  ['EXAMPLE_SCHEMA_MISMATCH'],
);

assert.equal(report.milestone, 'W58');
assert.equal(report.tool.id, tool.id);
assert.equal(report.tool.status, 'active');
assert.equal(report.publicSurface.shareableParameters.length, 0);
assert.equal(report.publicSurface.reportCopyExcludesRawInputs, true);
assert.equal(report.validationPolicy.remoteReferencesLoaded, false);
assert.equal(report.validationPolicy.rawInputsPersisted, false);
assert.equal(report.validationPolicy.rawInputsInUrl, false);
assert.equal(report.deterministicFixtures.count, fixtureSet.fixtures.length);
assert.equal(report.deterministicFixtures.requiredCount, tool.releaseGate.deterministicFixtureCount);
assert.ok(Object.values(report.releaseGates).every(Boolean), 'W58 release gate failed');
for (const [file, fingerprint] of Object.entries(report.implementation)) {
  assert.equal(fingerprint.bytes, Buffer.byteLength(readText(file)), `${file}: byte count changed`);
  assert.equal(fingerprint.sha256, sha256(readText(file)), `${file}: fingerprint changed`);
}

console.log(
  `W58 prompt schema: ${fixtureSet.fixtures.length} deterministic fixtures, `
  + `${tool.contentLinks.wikiSlugs.length} wiki links, all release gates passed`,
);

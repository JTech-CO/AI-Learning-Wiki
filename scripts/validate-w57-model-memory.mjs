import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  calculateModelMemory,
  modelMemoryConstants,
  toModelMemoryLabSession,
} from '../src/lib/model-memory.mjs';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const closeTo = (actual, expected, label) => {
  const tolerance = Math.max(1, Math.abs(expected)) * 1e-12;
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${label}: expected ${expected}, got ${actual}`,
  );
};
const validationMessage = (validate) =>
  validate.errors
    ?.map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ')
  ?? 'unknown validation error';

const registry = readJson('content-model/labs/registry.json');
const wiki = readJson('public/data/wiki-index.json');
const fixtureSet = readJson('content-model/labs/fixtures/w57-model-memory.json');
const report = readJson('content-model/quality/w57-model-memory.json');
const sessionSchema = readJson('content-model/schema.lab-session-v1.json');
const tool = registry.tools.find(({ id }) => id === 'model-memory');
const wikiIds = new Set(wiki.articles.map(({ id }) => id));
const courseIds = new Set(wiki.courses.map(({ id }) => id));

assert.ok(tool, 'model-memory tool manifest is missing');
assert.equal(tool.title.ko, '모델 메모리·KV 캐시·문맥 계산기');
assert.equal(tool.status, 'active');
assert.equal(tool.plannedMilestone, 'W57');
assert.equal(tool.route, '/lab/model-memory/');
assert.equal(tool.execution.mode, 'client-only');
assert.equal(tool.execution.networkAccess, 'none');
assert.equal(tool.execution.transmitsUserInput, false);
assert.equal(tool.execution.persistentStorage, 'none');
assert.equal(tool.releaseGate.shareableState, true);
assert.equal(tool.evidence.formulaVersion, modelMemoryConstants.formulaVersion);
assert.deepEqual(
  tool.contracts.warningDefinitions.map(({ code }) => code),
  ['ESTIMATE_ONLY', 'TEMPORARY_MEMORY_EXCLUDED'],
);

for (const wikiSlug of tool.contentLinks.wikiSlugs) {
  assert.ok(wikiIds.has(wikiSlug), `unknown linked wiki article: ${wikiSlug}`);
}
for (const courseId of tool.contentLinks.courseIds) {
  assert.ok(courseIds.has(courseId), `unknown linked course: ${courseId}`);
}

const requiredFiles = [
  'src/lib/model-memory.mjs',
  'src/components/lab/ModelMemoryCalculator.astro',
  'src/content/docs/lab/model-memory.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w57-model-memory.json',
];
for (const file of requiredFiles) assert.ok(fs.existsSync(file), `missing W57 file: ${file}`);

const componentSource = readText('src/components/lab/ModelMemoryCalculator.astro');
const moduleSource = readText('src/lib/model-memory.mjs');
const pageSource = readText('src/content/docs/lab/model-memory.mdx');
const sidebarSource = readText('src/components/wiki/WikiSidebar.astro');
const homeSource = readText('src/components/wiki/WikiHome.astro');
const styleSource = readText('src/styles/wiki-lab.css');

assert.match(componentSource, /data-model-memory-calculator/);
assert.match(componentSource, /aria-live="polite"/);
assert.match(componentSource, /history\.replaceState/);
assert.match(componentSource, /navigator\.clipboard/);
assert.match(componentSource, /URLSearchParams/);
assert.match(componentSource, /reportValidity/);
assert.match(moduleSource, /2\s*\*\s*layerCount/);
assert.match(moduleSource, /Adam 계열 1·2차 모멘트/);
assert.doesNotMatch(componentSource, /localStorage|sessionStorage/);
assert.doesNotMatch(componentSource, /fetch\(/);
assert.doesNotMatch(componentSource, /Math\.random/);
assert.match(pageSource, /model-memory-v1/);
assert.match(pageSource, /총 추정치에서 제외한 항목|결과에 포함하지 않는 메모리/);
assert.match(pageSource, /표준 전체 시퀀스 학습의 활성값/);
assert.match(sidebarSource, /href="\/lab\/model-memory\/"/);
assert.match(homeSource, /href="\/lab\/model-memory\/"/);
assert.match(styleSource, /\.lab-memory-table/);
assert.match(styleSource, /\.lab-context-table/);
assert.match(styleSource, /\.lab-memory-summary/);
assert.match(styleSource, /@media \(max-width: 50rem\)/);
assert.match(styleSource, /focus-visible/);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSession = ajv.compile(sessionSchema);

const stableResult = (result) => ({
  inputs: result.inputs,
  bytesPerElement: result.bytesPerElement,
  weightMemory: result.weightMemory,
  trainingStateMemory: result.trainingStateMemory,
  kvCacheMemory: result.kvCacheMemory,
  totalEstimate: result.totalEstimate,
  components: result.components,
  contextScenarios: result.contextScenarios,
  excludedItems: result.excludedItems,
  warnings: result.warnings,
  assumptions: result.assumptions,
});

assert.equal(fixtureSet.milestone, 'W57');
assert.equal(fixtureSet.toolId, 'model-memory');
assert.equal(fixtureSet.formulaVersion, modelMemoryConstants.formulaVersion);
assert.equal(fixtureSet.fixtures.length, tool.releaseGate.deterministicFixtureCount);
assert.equal(new Set(fixtureSet.fixtures.map(({ id }) => id)).size, fixtureSet.fixtures.length);

for (const fixture of fixtureSet.fixtures) {
  const first = calculateModelMemory(fixture.inputs);
  const second = calculateModelMemory(fixture.inputs);
  assert.deepEqual(stableResult(first), stableResult(second), `${fixture.id}: non-deterministic result`);

  closeTo(first.weightMemory.gib, fixture.expected.weightGiB, `${fixture.id}: weight`);
  closeTo(
    first.trainingStateMemory.gib,
    fixture.expected.trainingStateGiB,
    `${fixture.id}: training state`,
  );
  closeTo(first.kvCacheMemory.gib, fixture.expected.kvCacheGiB, `${fixture.id}: KV cache`);
  closeTo(first.totalEstimate.gib, fixture.expected.totalGiB, `${fixture.id}: total`);
  closeTo(
    first.kvCacheMemory.mibPerTokenPerRequest,
    fixture.expected.kvMiBPerTokenPerRequest,
    `${fixture.id}: KV per token`,
  );

  assert.deepEqual(
    first.warnings.map(({ code }) => code),
    fixture.expected.warningCodes,
    `${fixture.id}: warning contract changed`,
  );
  assert.ok(
    [
      first.weightMemory.gib,
      first.trainingStateMemory.gib,
      first.kvCacheMemory.gib,
      first.totalEstimate.gib,
      first.kvCacheMemory.mibPerTokenPerRequest,
    ].every(Number.isFinite),
    `${fixture.id}: outputs must be finite`,
  );
  closeTo(
    first.components.reduce((sum, component) => sum + component.gib, 0),
    first.totalEstimate.gib,
    `${fixture.id}: component sum`,
  );

  const doubled = calculateModelMemory({
    ...fixture.inputs,
    contextLength: fixture.inputs.contextLength * 2,
  });
  closeTo(
    doubled.kvCacheMemory.gib,
    first.kvCacheMemory.gib * 2,
    `${fixture.id}: context scaling`,
  );
  assert.equal(
    first.trainingStateMemory.gib > 0,
    fixture.inputs.executionMode === 'training',
    `${fixture.id}: execution mode state`,
  );

  for (const warning of first.warnings) {
    for (const slug of warning.wikiSlugs) {
      assert.ok(wikiIds.has(slug), `${fixture.id}: unknown warning article ${slug}`);
    }
  }
  for (const assumption of first.assumptions) {
    for (const sourceId of assumption.sourceIds) {
      assert.ok(wikiIds.has(sourceId), `${fixture.id}: unknown assumption article ${sourceId}`);
    }
  }

  const session = toModelMemoryLabSession(first);
  assert.equal(
    validateSession(session),
    true,
    `${fixture.id}: ${validationMessage(validateSession)}`,
  );
}

const validInput = fixtureSet.fixtures[0].inputs;
assert.throws(
  () => calculateModelMemory({ ...validInput, parameterCount: 0 }),
  /0보다 큰 수/,
);
assert.throws(
  () => calculateModelMemory({ ...validInput, precision: 3 }),
  /4, 8, 16, 32비트/,
);
assert.throws(
  () => calculateModelMemory({ ...validInput, executionMode: 'serve' }),
  /추론 또는 학습/,
);
assert.throws(
  () => calculateModelMemory({ ...validInput, layerCount: 1001 }),
  /1 이상 1,000 이하/,
);
assert.throws(
  () => calculateModelMemory({ ...validInput, contextLength: 0 }),
  /1 이상/,
);

assert.equal(report.milestone, 'W57');
assert.equal(report.tool.id, tool.id);
assert.equal(report.tool.status, 'active');
assert.equal(report.deterministicFixtures.count, fixtureSet.fixtures.length);
assert.equal(report.deterministicFixtures.requiredCount, tool.releaseGate.deterministicFixtureCount);
assert.equal(report.calculationPolicy.contextScaling, 'linear');
assert.equal(report.calculationPolicy.temporaryMemoryIncluded, false);
assert.ok(Object.values(report.releaseGates).every(Boolean), 'W57 release gate failed');
for (const [file, fingerprint] of Object.entries(report.implementation)) {
  assert.equal(fingerprint.bytes, Buffer.byteLength(readText(file)), `${file}: byte count changed`);
  assert.equal(fingerprint.sha256, sha256(readText(file)), `${file}: fingerprint changed`);
}

console.log(
  `W57 model memory: ${fixtureSet.fixtures.length} deterministic fixtures, `
  + `${tool.contentLinks.wikiSlugs.length} wiki links, all release gates passed`,
);

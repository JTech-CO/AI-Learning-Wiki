import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  calculateEvaluationMetrics,
  evaluationMetricConstants,
  toEvaluationLabSession,
} from '../src/lib/evaluation-metrics.mjs';

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
const fixtureSet = readJson('content-model/labs/fixtures/w56-evaluation-metrics.json');
const report = readJson('content-model/quality/w56-evaluation-metrics.json');
const sessionSchema = readJson('content-model/schema.lab-session-v1.json');
const tool = registry.tools.find(({ id }) => id === 'evaluation-metrics');
const wikiIds = new Set(wiki.articles.map(({ id }) => id));
const courseIds = new Set(wiki.courses.map(({ id }) => id));

assert.ok(tool, 'evaluation-metrics tool manifest is missing');
assert.equal(tool.status, 'active');
assert.equal(tool.plannedMilestone, 'W56');
assert.equal(tool.route, '/lab/evaluation-metrics/');
assert.equal(tool.execution.mode, 'client-only');
assert.equal(tool.execution.networkAccess, 'none');
assert.equal(tool.execution.transmitsUserInput, false);
assert.equal(tool.execution.persistentStorage, 'none');
assert.equal(tool.releaseGate.shareableState, true);
assert.equal(tool.evidence.formulaVersion, evaluationMetricConstants.formulaVersion);
assert.deepEqual(
  tool.contracts.warningDefinitions.map(({ code }) => code),
  ['ZERO_DENOMINATOR', 'CLASS_IMBALANCE'],
);

for (const wikiSlug of tool.contentLinks.wikiSlugs) {
  assert.ok(wikiIds.has(wikiSlug), `unknown linked wiki article: ${wikiSlug}`);
}
for (const courseId of tool.contentLinks.courseIds) {
  assert.ok(courseIds.has(courseId), `unknown linked course: ${courseId}`);
}

const requiredFiles = [
  'src/lib/evaluation-metrics.mjs',
  'src/components/lab/EvaluationMetricsLab.astro',
  'src/content/docs/lab/evaluation-metrics.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w56-evaluation-metrics.json',
];
for (const file of requiredFiles) assert.ok(fs.existsSync(file), `missing W56 file: ${file}`);

const componentSource = readText('src/components/lab/EvaluationMetricsLab.astro');
const moduleSource = readText('src/lib/evaluation-metrics.mjs');
const pageSource = readText('src/content/docs/lab/evaluation-metrics.mdx');
const sidebarSource = readText('src/components/wiki/WikiSidebar.astro');
const homeSource = readText('src/components/wiki/WikiHome.astro');
const styleSource = readText('src/styles/wiki-lab.css');

assert.match(componentSource, /data-evaluation-metrics-lab/);
assert.match(componentSource, /aria-live="polite"/);
assert.match(componentSource, /history\.replaceState/);
assert.match(componentSource, /navigator\.clipboard/);
assert.match(componentSource, /URLSearchParams/);
assert.match(componentSource, /reportValidity/);
assert.match(moduleSource, /집계 혼동행렬에는 표본별 예측 점수 분포가 없으므로/);
assert.doesNotMatch(componentSource, /localStorage|sessionStorage/);
assert.doesNotMatch(componentSource, /fetch\(/);
assert.doesNotMatch(componentSource, /Math\.random/);
assert.match(pageSource, /classification-metrics-v1/);
assert.match(pageSource, /분모가 0인 지표는 0으로 바꾸지 않고/);
assert.match(sidebarSource, /href="\/lab\/evaluation-metrics\/"/);
assert.match(homeSource, /href="\/lab\/evaluation-metrics\/"/);
assert.match(styleSource, /\.lab-metric-table/);
assert.match(styleSource, /\.lab-threshold-grid/);
assert.match(styleSource, /@media \(max-width: 50rem\)/);
assert.match(styleSource, /focus-visible/);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSession = ajv.compile(sessionSchema);

const stableResult = (result) => ({
  counts: result.counts,
  threshold: result.threshold,
  totals: result.totals,
  metrics: result.metrics.map(({ id, value, numerator, denominator }) => ({
    id,
    value,
    numerator,
    denominator,
  })),
  thresholdEffects: result.thresholdEffects,
  interpretation: result.interpretation,
  warnings: result.warnings,
  assumptions: result.assumptions,
});

assert.equal(fixtureSet.milestone, 'W56');
assert.equal(fixtureSet.toolId, 'evaluation-metrics');
assert.equal(fixtureSet.formulaVersion, evaluationMetricConstants.formulaVersion);
assert.equal(fixtureSet.fixtures.length, tool.releaseGate.deterministicFixtureCount);
assert.equal(new Set(fixtureSet.fixtures.map(({ id }) => id)).size, fixtureSet.fixtures.length);

for (const fixture of fixtureSet.fixtures) {
  const first = calculateEvaluationMetrics(fixture.inputs);
  const second = calculateEvaluationMetrics(fixture.inputs);
  assert.deepEqual(stableResult(first), stableResult(second), `${fixture.id}: non-deterministic result`);

  const actualMetrics = Object.fromEntries(first.metrics.map(({ id, value }) => [id, value]));
  for (const [metricId, expected] of Object.entries(fixture.expectedMetricValues)) {
    const actual = actualMetrics[metricId];
    if (expected === null) {
      assert.equal(actual, null, `${fixture.id}: ${metricId} must be undefined`);
    } else {
      assert.ok(
        Math.abs(actual - expected) < 1e-12,
        `${fixture.id}: ${metricId} expected ${expected}, got ${actual}`,
      );
    }
  }

  assert.deepEqual(
    first.warnings.map(({ code }) => code),
    fixture.expectedWarningCodes,
    `${fixture.id}: warning contract changed`,
  );
  assert.ok(
    first.metrics.every(({ value }) => value === null || Number.isFinite(value)),
    `${fixture.id}: metric must be finite or null`,
  );
  assert.ok(
    first.metrics.every(({ value }) => value === null || (value >= 0 && value <= 1)),
    `${fixture.id}: metric must be a proportion`,
  );
  assert.match(first.thresholdEffects.limitation, /수치로 재계산할 수 없다/);
  assert.equal(first.thresholdEffects.directions.length, 2);

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

  const session = toEvaluationLabSession(first);
  assert.equal(
    validateSession(session),
    true,
    `${fixture.id}: ${validationMessage(validateSession)}`,
  );
}

assert.throws(
  () => calculateEvaluationMetrics({
    trueNegative: -1,
    falsePositive: 0,
    falseNegative: 0,
    truePositive: 0,
  }),
  /0 이상의 정수/,
);
assert.throws(
  () => calculateEvaluationMetrics({
    trueNegative: 1.5,
    falsePositive: 0,
    falseNegative: 0,
    truePositive: 0,
  }),
  /0 이상의 정수/,
);
assert.throws(
  () => calculateEvaluationMetrics({
    trueNegative: 1,
    falsePositive: 0,
    falseNegative: 0,
    truePositive: 1,
    threshold: 1.01,
  }),
  /0 이상 1 이하/,
);

assert.equal(report.milestone, 'W56');
assert.equal(report.tool.id, tool.id);
assert.equal(report.tool.status, 'active');
assert.equal(report.deterministicFixtures.count, fixtureSet.fixtures.length);
assert.equal(report.deterministicFixtures.requiredCount, tool.releaseGate.deterministicFixtureCount);
assert.ok(Object.values(report.releaseGates).every(Boolean), 'W56 release gate failed');
for (const [file, fingerprint] of Object.entries(report.implementation)) {
  assert.equal(fingerprint.bytes, Buffer.byteLength(readText(file)), `${file}: byte count changed`);
  assert.equal(fingerprint.sha256, sha256(readText(file)), `${file}: fingerprint changed`);
}

console.log(
  `W56 evaluation metrics: ${fixtureSet.fixtures.length} deterministic fixtures, `
  + `${tool.contentLinks.wikiSlugs.length} wiki links, all release gates passed`,
);

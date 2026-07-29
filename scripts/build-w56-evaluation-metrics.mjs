import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateEvaluationMetrics } from '../src/lib/evaluation-metrics.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (file) => path.join(root, file);
const readText = (file) => fs.readFileSync(resolve(file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const registry = readJson('content-model/labs/registry.json');
const fixtureSet = readJson('content-model/labs/fixtures/w56-evaluation-metrics.json');
const tool = registry.tools.find(({ id }) => id === 'evaluation-metrics');

const implementationFiles = [
  'src/lib/evaluation-metrics.mjs',
  'src/components/lab/EvaluationMetricsLab.astro',
  'src/components/lab/LabDirectory.astro',
  'src/content/docs/lab/index.mdx',
  'src/content/docs/lab/evaluation-metrics.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w56-evaluation-metrics.json',
];

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
  warningCodes: result.warnings.map(({ code }) => code),
  assumptions: result.assumptions,
});

const fixtureResults = fixtureSet.fixtures.map((fixture) => {
  const first = stableResult(calculateEvaluationMetrics(fixture.inputs));
  const second = stableResult(calculateEvaluationMetrics(fixture.inputs));
  const warningCodes = [...first.warningCodes].sort();
  const expectedWarningCodes = [...fixture.expectedWarningCodes].sort();

  return {
    id: fixture.id,
    total:
      fixture.inputs.trueNegative
      + fixture.inputs.falsePositive
      + fixture.inputs.falseNegative
      + fixture.inputs.truePositive,
    warningCodes,
    expectedWarningCodes,
    deterministic: JSON.stringify(first) === JSON.stringify(second),
    finiteOrNull: first.metrics.every(({ value }) => value === null || Number.isFinite(value)),
    sha256: sha256(JSON.stringify(first)),
  };
});

const report = {
  schemaVersion: '1.0',
  milestone: 'W56',
  releasedAt: registry.updatedAt,
  tool: {
    id: tool.id,
    title: tool.title,
    route: tool.route,
    status: tool.status,
    formulaVersion: tool.evidence.formulaVersion,
    execution: tool.execution,
  },
  publicSurface: {
    hubRoute: registry.hub.route,
    hubPage: 'src/content/docs/lab/index.mdx',
    toolPage: 'src/content/docs/lab/evaluation-metrics.mdx',
    globalNavigation: 'src/components/wiki/WikiSidebar.astro',
    homeNavigation: 'src/components/wiki/WikiHome.astro',
    shareableParameters: ['tn', 'fp', 'fn', 'tp', 'threshold'],
  },
  implementation: Object.fromEntries(implementationFiles.map((file) => [
    file,
    {
      bytes: Buffer.byteLength(readText(file)),
      sha256: sha256(readText(file)),
    },
  ])),
  deterministicFixtures: {
    source: 'content-model/labs/fixtures/w56-evaluation-metrics.json',
    count: fixtureResults.length,
    requiredCount: tool.releaseGate.deterministicFixtureCount,
    results: fixtureResults,
  },
  interpretationPolicy: {
    zeroDenominator: 'null-not-zero',
    classImbalanceRatio: 4,
    thresholdRecalculation: 'direction-only-without-score-distribution',
    binaryClassificationOnly: true,
  },
  releaseGates: {
    clientOnly: tool.execution.mode === 'client-only',
    noNetworkAccess: tool.execution.networkAccess === 'none',
    noInputTransmission: tool.execution.transmitsUserInput === false,
    noPersistentStorage: tool.execution.persistentStorage === 'none',
    assumptionsVisible: tool.releaseGate.disclosesAssumptions,
    keyboardAccessible: tool.releaseGate.keyboardAccessible,
    mobileLayout: tool.releaseGate.mobileLayout,
    linksToWiki: tool.releaseGate.linksToWiki,
    shareableState: tool.releaseGate.shareableState,
    allFixturesDeterministic: fixtureResults.every(({ deterministic }) => deterministic),
    allMetricValuesFiniteOrNull: fixtureResults.every(({ finiteOrNull }) => finiteOrNull),
    allExpectedWarningsMatched: fixtureResults.every(
      ({ warningCodes, expectedWarningCodes }) =>
        JSON.stringify(warningCodes) === JSON.stringify(expectedWarningCodes),
    ),
  },
};

fs.mkdirSync(resolve('content-model/quality'), { recursive: true });
fs.writeFileSync(
  resolve('content-model/quality/w56-evaluation-metrics.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(
  `W56 evaluation metrics: ${fixtureResults.length} deterministic fixtures, `
  + `${tool.status} tool at ${tool.route}`,
);

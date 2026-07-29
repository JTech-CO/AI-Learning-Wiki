import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateModelMemory } from '../src/lib/model-memory.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (file) => path.join(root, file);
const readText = (file) => fs.readFileSync(resolve(file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const registry = readJson('content-model/labs/registry.json');
const fixtureSet = readJson('content-model/labs/fixtures/w57-model-memory.json');
const tool = registry.tools.find(({ id }) => id === 'model-memory');

const implementationFiles = [
  'src/lib/model-memory.mjs',
  'src/components/lab/ModelMemoryCalculator.astro',
  'src/components/lab/LabDirectory.astro',
  'src/content/docs/lab/index.mdx',
  'src/content/docs/lab/model-memory.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w57-model-memory.json',
];

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

const fixtureResults = fixtureSet.fixtures.map((fixture) => {
  const first = stableResult(calculateModelMemory(fixture.inputs));
  const second = stableResult(calculateModelMemory(fixture.inputs));
  const warningCodes = first.warnings.map(({ code }) => code);

  return {
    id: fixture.id,
    executionMode: fixture.inputs.executionMode,
    precision: fixture.inputs.precision,
    weightGiB: first.weightMemory.gib,
    trainingStateGiB: first.trainingStateMemory.gib,
    kvCacheGiB: first.kvCacheMemory.gib,
    totalGiB: first.totalEstimate.gib,
    warningCodes,
    expectedWarningCodes: fixture.expected.warningCodes,
    deterministic: JSON.stringify(first) === JSON.stringify(second),
    finiteOutputs: [
      first.weightMemory.gib,
      first.trainingStateMemory.gib,
      first.kvCacheMemory.gib,
      first.totalEstimate.gib,
    ].every(Number.isFinite),
    sha256: sha256(JSON.stringify(first)),
  };
});

const report = {
  schemaVersion: '1.0',
  milestone: 'W57',
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
    toolPage: 'src/content/docs/lab/model-memory.mdx',
    globalNavigation: 'src/components/wiki/WikiSidebar.astro',
    homeNavigation: 'src/components/wiki/WikiHome.astro',
    shareableParameters: [
      'paramsB',
      'precision',
      'mode',
      'layers',
      'batch',
      'context',
      'kvHeads',
      'headDim',
    ],
  },
  implementation: Object.fromEntries(implementationFiles.map((file) => [
    file,
    {
      bytes: Buffer.byteLength(readText(file)),
      sha256: sha256(readText(file)),
    },
  ])),
  deterministicFixtures: {
    source: 'content-model/labs/fixtures/w57-model-memory.json',
    count: fixtureResults.length,
    requiredCount: tool.releaseGate.deterministicFixtureCount,
    results: fixtureResults,
  },
  calculationPolicy: {
    memoryUnit: 'GiB',
    bytesPerGiB: 1024 ** 3,
    weightFormula: 'parameter-count * precision-bits / 8',
    kvCacheFormula:
      '2 * layers * batch * context-length * kv-heads * head-dimension * precision-bits / 8',
    trainingGradientBytesPerParameter: 4,
    adamMomentBytesPerParameter: 8,
    fp32MasterWeightBytesPerParameterWhenPrecisionBelow32: 4,
    contextScaling: 'linear',
    temporaryMemoryIncluded: false,
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
    allOutputsFinite: fixtureResults.every(({ finiteOutputs }) => finiteOutputs),
    allExpectedWarningsMatched: fixtureResults.every(
      ({ warningCodes, expectedWarningCodes }) =>
        JSON.stringify(warningCodes) === JSON.stringify(expectedWarningCodes),
    ),
  },
};

fs.mkdirSync(resolve('content-model/quality'), { recursive: true });
fs.writeFileSync(
  resolve('content-model/quality/w57-model-memory.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(
  `W57 model memory: ${fixtureResults.length} deterministic fixtures, `
  + `${tool.status} tool at ${tool.route}`,
);

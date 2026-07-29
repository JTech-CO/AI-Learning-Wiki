import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createPortablePromptSchemaReport,
  validatePromptSchema,
} from '../src/lib/prompt-schema.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (file) => path.join(root, file);
const readText = (file) => fs.readFileSync(resolve(file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const registry = readJson('content-model/labs/registry.json');
const fixtureSet = readJson('content-model/labs/fixtures/w58-prompt-schema.json');
const ajvPackage = readJson('node_modules/ajv/package.json');
const ajvFormatsPackage = readJson('node_modules/ajv-formats/package.json');
const tool = registry.tools.find(({ id }) => id === 'prompt-schema');

const implementationFiles = [
  'src/lib/prompt-schema.mjs',
  'src/components/lab/PromptSchemaValidator.astro',
  'src/components/lab/LabDirectory.astro',
  'src/content/docs/lab/index.mdx',
  'src/content/docs/lab/prompt-schema.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w58-prompt-schema.json',
];

const stableResult = (result) => ({
  resultStatus: result.resultStatus,
  promptValidation: result.promptValidation,
  schemaValidation: result.schemaValidation,
  validationReport: result.validationReport,
  warnings: result.warnings,
  assumptions: result.assumptions,
});

const fixtureResults = fixtureSet.fixtures.map((fixture) => {
  const first = stableResult(validatePromptSchema(fixture.inputs));
  const second = stableResult(validatePromptSchema(fixture.inputs));
  const warningCodes = first.warnings.map(({ code }) => code);
  const issueCodes = first.validationReport.issues.map(({ code }) => code);
  const issueKeywords = first.validationReport.issues.map(({ keyword }) => keyword);
  const portable = createPortablePromptSchemaReport({
    ...validatePromptSchema(fixture.inputs),
  });
  const rawInputValues = Object.values(fixture.inputs)
    .filter((value) => typeof value === 'string' && value.length >= 16);
  const portableText = JSON.stringify(portable);

  return {
    id: fixture.id,
    resultStatus: first.resultStatus,
    warningCodes,
    issueCodes,
    issueKeywords,
    schemaValid: first.schemaValidation.schemaValid,
    exampleMatchesSchema: first.schemaValidation.exampleMatchesSchema,
    deterministic: JSON.stringify(first) === JSON.stringify(second),
    expectedContractMatched:
      first.resultStatus === fixture.expected.resultStatus
      && JSON.stringify(warningCodes) === JSON.stringify(fixture.expected.warningCodes)
      && JSON.stringify(issueCodes) === JSON.stringify(fixture.expected.issueCodes)
      && JSON.stringify(issueKeywords) === JSON.stringify(fixture.expected.issueKeywords)
      && JSON.stringify(first.promptValidation.unresolvedVariables.undefined)
        === JSON.stringify(fixture.expected.undefinedVariables)
      && JSON.stringify(first.promptValidation.unresolvedVariables.unused)
        === JSON.stringify(fixture.expected.unusedVariables)
      && first.schemaValidation.schemaValid === fixture.expected.schemaValid
      && first.schemaValidation.exampleMatchesSchema
        === fixture.expected.exampleMatchesSchema,
    portableReportExcludesRawText: rawInputValues.every(
      (rawValue) => !portableText.includes(rawValue),
    ),
    sha256: sha256(JSON.stringify(first)),
  };
});

const report = {
  schemaVersion: '1.0',
  milestone: 'W58',
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
    toolPage: 'src/content/docs/lab/prompt-schema.mdx',
    globalNavigation: 'src/components/wiki/WikiSidebar.astro',
    homeNavigation: 'src/components/wiki/WikiHome.astro',
    shareableParameters: [],
    reportCopyExcludesRawInputs: true,
  },
  implementation: Object.fromEntries(implementationFiles.map((file) => [
    file,
    {
      bytes: Buffer.byteLength(readText(file)),
      sha256: sha256(readText(file)),
    },
  ])),
  deterministicFixtures: {
    source: 'content-model/labs/fixtures/w58-prompt-schema.json',
    count: fixtureResults.length,
    requiredCount: tool.releaseGate.deterministicFixtureCount,
    results: fixtureResults,
  },
  validationPolicy: {
    placeholderSyntaxes: ['{{name}}', '${name}'],
    jsonSchemaDialect: 'Draft 2020-12',
    jsonSchemaEngine: `Ajv ${ajvPackage.version}`,
    formatExtension: `ajv-formats ${ajvFormatsPackage.version}`,
    remoteReferencesLoaded: false,
    asynchronousSchemasSupported: false,
    promptMaxCharacters: 50000,
    jsonFieldMaxCharacters: 100000,
    exampleCount: 1,
    rawInputsPersisted: false,
    rawInputsInUrl: false,
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
    rawInputSharingDisabled: tool.releaseGate.shareableState === false,
    allFixturesDeterministic: fixtureResults.every(({ deterministic }) => deterministic),
    allFixtureContractsMatched: fixtureResults.every(
      ({ expectedContractMatched }) => expectedContractMatched,
    ),
    allPortableReportsExcludeRawText: fixtureResults.every(
      ({ portableReportExcludesRawText }) => portableReportExcludesRawText,
    ),
  },
};

fs.mkdirSync(resolve('content-model/quality'), { recursive: true });
fs.writeFileSync(
  resolve('content-model/quality/w58-prompt-schema.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(
  `W58 prompt schema: ${fixtureResults.length} deterministic fixtures, `
  + `${tool.status} tool at ${tool.route}`,
);

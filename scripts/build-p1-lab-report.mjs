import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { calculateTokenContextBudget } from '../src/lib/token-context.mjs';
import { evaluateRagDataset } from '../src/lib/rag-evaluation.mjs';

const mode = String(process.argv[2] ?? '').toLowerCase();
const configs = {
  w67: {
    milestone: 'W67', toolId: 'token-context', fixture: 'content-model/labs/fixtures/w67-token-context.json', output: 'content-model/quality/w67-token-context.json',
    files: ['src/lib/token-context.mjs', 'src/components/lab/TokenContextCalculator.astro', 'src/content/docs/lab/token-context.mdx', 'src/styles/wiki-lab.css', 'scripts/validate-w67-token-context.mjs'],
    run: (fixture) => calculateTokenContextBudget(fixture.inputs),
  },
  w68: {
    milestone: 'W68', toolId: 'rag-evaluation', fixture: 'content-model/labs/fixtures/w68-rag-evaluation.json', output: 'content-model/quality/w68-rag-evaluation.json',
    files: ['src/lib/rag-evaluation.mjs', 'src/components/lab/RagEvaluationLab.astro', 'src/content/docs/lab/rag-evaluation.mdx', 'src/styles/wiki-lab.css', 'scripts/validate-w68-rag-evaluation.mjs'],
    run: (fixture) => evaluateRagDataset({ cutoffK: fixture.cutoffK, format: fixture.csv ? 'csv' : 'json', dataset: fixture.csv ?? fixture.queries }),
  },
};
const config = configs[mode];
if (!config) throw new Error('usage: node scripts/build-p1-lab-report.mjs w67|w68');
const registry = JSON.parse(fs.readFileSync('content-model/labs/registry.json', 'utf8'));
const fixtureSet = JSON.parse(fs.readFileSync(config.fixture, 'utf8'));
const tool = registry.tools.find(({ id }) => id === config.toolId);
const fingerprint = (file) => { const content = fs.readFileSync(file); return { bytes: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') }; };
const fixtureResults = fixtureSet.fixtures.map((fixture) => {
  const first = config.run(fixture); const second = config.run(fixture);
  return { id: fixture.id, deterministic: JSON.stringify(first) === JSON.stringify(second), warningCodes: first.warnings.map(({ code }) => code), sha256: createHash('sha256').update(JSON.stringify(first)).digest('hex') };
});
const report = {
  schemaVersion: '1.0', milestone: config.milestone, releasedAt: '2026-08-30',
  tool: { id: tool.id, title: tool.title, route: tool.route, status: tool.status, formulaVersion: tool.evidence.formulaVersion, execution: tool.execution },
  implementation: Object.fromEntries(config.files.map((file) => [file, fingerprint(file)])),
  deterministicFixtures: { source: config.fixture, count: fixtureResults.length, requiredCount: tool.releaseGate.deterministicFixtureCount, results: fixtureResults },
  releaseGates: { active: tool.status === 'active', clientOnly: tool.execution.mode === 'client-only', noNetwork: tool.execution.networkAccess === 'none', noInputTransmission: tool.execution.transmitsUserInput === false, noPersistence: tool.execution.persistentStorage === 'none', keyboardAccessible: tool.releaseGate.keyboardAccessible, mobileLayout: tool.releaseGate.mobileLayout, linksToWiki: tool.releaseGate.linksToWiki, deterministic: fixtureResults.every(({ deterministic }) => deterministic) },
};
fs.writeFileSync(config.output, `${JSON.stringify(report, null, 2)}\n`);
console.log(`${config.milestone} ${config.toolId}: ${fixtureResults.length} fixtures, release report updated`);

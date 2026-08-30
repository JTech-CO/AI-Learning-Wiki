import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { calculateTokenContextBudget, estimateTokens, TOKEN_CONTEXT_FORMULA_VERSION, toTokenContextLabSession } from '../src/lib/token-context.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(read(file));
const registry = json('content-model/labs/registry.json');
const fixtures = json('content-model/labs/fixtures/w67-token-context.json');
const sessionSchema = json('content-model/schema.lab-session-v1.json');
const tool = registry.tools.find(({ id }) => id === 'token-context');
const wikiIds = new Set(json('public/data/wiki-index.json').articles.map(({ id }) => id));

assert.ok(tool);
assert.equal(tool.status, 'active');
assert.equal(tool.plannedMilestone, 'W67');
assert.equal(tool.route, '/lab/token-context/');
assert.equal(tool.execution.networkAccess, 'none');
assert.equal(tool.evidence.formulaVersion, TOKEN_CONTEXT_FORMULA_VERSION);
assert.equal(fixtures.fixtures.length, tool.releaseGate.deterministicFixtureCount);
for (const slug of tool.contentLinks.wikiSlugs) assert.ok(wikiIds.has(slug), `missing wiki link ${slug}`);

for (const file of ['src/lib/token-context.mjs', 'src/components/lab/TokenContextCalculator.astro', 'src/content/docs/lab/token-context.mdx', 'src/styles/wiki-lab.css']) assert.ok(fs.existsSync(file), `missing ${file}`);
const component = read('src/components/lab/TokenContextCalculator.astro');
assert.match(component, /data-token-context-calculator/);
assert.match(component, /name="systemText"/);
assert.match(component, /name="retrievalText"/);
assert.match(component, /name="safetyMarginPercent"/);
assert.match(component, /name="inputCostPerMillion"/);
assert.match(component, /lab\/model-memory/);
assert.match(component, /aria-live="polite"/);
assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage/);

const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
const validateSession = ajv.compile(sessionSchema);
for (const fixture of fixtures.fixtures) {
  const first = calculateTokenContextBudget(fixture.inputs);
  const second = calculateTokenContextBudget(fixture.inputs);
  assert.deepEqual(first, second, `${fixture.id}: non-deterministic`);
  assert.equal(first.risk.level, fixture.expected.risk, `${fixture.id}: risk`);
  assert.deepEqual(first.warnings.map(({ code }) => code), fixture.expected.warningCodes, `${fixture.id}: warnings`);
  assert.ok(Number.isFinite(first.totals.inputTokens));
  assert.ok(Number.isFinite(first.costs.batchTotal));
  const session = toTokenContextLabSession(first);
  assert.equal(validateSession(session), true, `${fixture.id}: ${JSON.stringify(validateSession.errors)}`);
}
assert.equal(estimateTokens('', 'bpe'), 0);
assert.ok(estimateTokens('안녕하세요', 'bpe') > 0);
assert.throws(() => calculateTokenContextBudget({ contextWindow: 0, reservedOutput: 0 }), /1 이상의 정수/);
assert.throws(() => calculateTokenContextBudget({ contextWindow: 10, reservedOutput: 0, safetyMarginPercent: 51 }), /50% 이하/);
console.log(`W67 token context: ${fixtures.fixtures.length} deterministic fixtures, contract and privacy gates passed`);

import assert from 'node:assert/strict';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { calculateRankingMetrics, evaluateRagDataset, parseRagCsv, parseRagJson, ragResultToCsv, RAG_EVALUATION_FORMULA_VERSION, toRagEvaluationLabSession } from '../src/lib/rag-evaluation.mjs';

const read = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(read(file));
const registry = json('content-model/labs/registry.json');
const fixtures = json('content-model/labs/fixtures/w68-rag-evaluation.json');
const sessionSchema = json('content-model/schema.lab-session-v1.json');
const tool = registry.tools.find(({ id }) => id === 'rag-evaluation');
const wikiIds = new Set(json('public/data/wiki-index.json').articles.map(({ id }) => id));

assert.ok(tool);
assert.equal(tool.status, 'active');
assert.equal(tool.plannedMilestone, 'W68');
assert.equal(tool.route, '/lab/rag-evaluation/');
assert.equal(tool.execution.networkAccess, 'none');
assert.equal(tool.evidence.formulaVersion, RAG_EVALUATION_FORMULA_VERSION);
assert.equal(fixtures.fixtures.length, tool.releaseGate.deterministicFixtureCount);
for (const slug of tool.contentLinks.wikiSlugs) assert.ok(wikiIds.has(slug), `missing wiki link ${slug}`);

for (const file of ['src/lib/rag-evaluation.mjs', 'src/components/lab/RagEvaluationLab.astro', 'src/content/docs/lab/rag-evaluation.mdx', 'src/styles/wiki-lab.css']) assert.ok(fs.existsSync(file), `missing ${file}`);
const component = read('src/components/lab/RagEvaluationLab.astro');
assert.match(component, /data-rag-evaluation-lab/);
assert.match(component, /accept="\.json,\.csv/);
assert.match(component, /data-export-rag-json/);
assert.match(component, /data-export-rag-csv/);
assert.match(component, /aria-live="polite"/);assert.match(component, /MAX_DATASET_BYTES = 5 \* 1024 \* 1024/);
assert.match(component, /file\.size > MAX_DATASET_BYTES/);
assert.match(component, /TextEncoder/);
assert.match(component, /\['before','after'\]/);
assert.match(component, /JSON 내보내기/);
assert.match(component, /CSV 내보내기/);
assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage/);

const ajv = new Ajv2020({ allErrors: true, strict: false }); addFormats(ajv);
const validateSession = ajv.compile(sessionSchema);
for (const fixture of fixtures.fixtures) {
  const input = { cutoffK: fixture.cutoffK, format: fixture.csv ? 'csv' : 'json', dataset: fixture.csv ?? fixture.queries };
  const first = evaluateRagDataset(input); const second = evaluateRagDataset(input);
  assert.deepEqual(first, second, `${fixture.id}: non-deterministic`);
  assert.ok(Object.values(first.before).every(Number.isFinite));
  assert.ok(Object.values(first.after).every(Number.isFinite));  assert.deepEqual(Object.keys(first.before), ['precisionAtK', 'recallAtK', 'reciprocalRank', 'ndcgAtK', 'duplicateRate', 'evidenceCoverage']);
  assert.deepEqual(Object.keys(first.after), ['precisionAtK', 'recallAtK', 'reciprocalRank', 'ndcgAtK', 'duplicateRate', 'evidenceCoverage']);
  assert.match(ragResultToCsv(first), /"query_id","run"/);
  const session = toRagEvaluationLabSession(first);
  assert.equal(validateSession(session), true, `${fixture.id}: ${JSON.stringify(validateSession.errors)}`);
}
const perfect = calculateRankingMetrics([{ id: 'a', grade: 2 }], [{ id: 'a', hasEvidence: true }], 1);
assert.equal(perfect.precisionAtK, 1); assert.equal(perfect.recallAtK, 1); assert.equal(perfect.reciprocalRank, 1); assert.equal(perfect.ndcgAtK, 1);
const duplicate = calculateRankingMetrics(['a', 'b'], ['a', 'a', 'b'], 3);
assert.equal(duplicate.duplicateRate, 1 / 3); assert.equal(duplicate.recallAtK, 1);
assert.equal(parseRagJson('[{"queryId":"q","relevant":["a"],"before":["a"]}]').length, 1);
assert.equal(parseRagCsv('query_id,document_id,relevance,before_rank,after_rank,has_evidence\nq,a,1,1,1,true').length, 1);
assert.throws(() => calculateRankingMetrics([], ['a'], 1), /한 개 이상/);
console.log(`W68 RAG evaluation: ${fixtures.fixtures.length} deterministic fixtures, import/export and metric gates passed`);



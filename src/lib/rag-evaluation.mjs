export const RAG_EVALUATION_FORMULA_VERSION = 'rag-ranking-metrics-v2';

const finiteGrade = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const normaliseDocument = (value, fallbackRank = null) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return { id: String(value).trim(), grade: 0, hasEvidence: false, rank: fallbackRank };
  }
  if (!value || typeof value !== 'object') throw new TypeError('문서 항목은 ID 문자열 또는 객체여야 한다.');
  const id = String(value.id ?? value.documentId ?? value.docId ?? '').trim();
  return {
    id,
    grade: finiteGrade(value.grade ?? value.relevance),
    hasEvidence: value.hasEvidence === true || value.evidence === true || value.grounded === true || String(value.hasEvidence ?? value.evidence ?? '').toLowerCase() === 'true',
    rank: Number.isInteger(Number(value.rank)) ? Number(value.rank) : fallbackRank,
  };
};

const normaliseRelevant = (values) => {
  if (!Array.isArray(values)) throw new TypeError('정답 관련 문서는 배열이어야 한다.');
  const map = new Map();
  for (const value of values) {
    const document = normaliseDocument(value);
    if (!document.id) throw new TypeError('정답 문서 ID가 비어 있다.');
    map.set(document.id, Math.max(document.grade || 1, map.get(document.id) ?? 0));
  }
  return map;
};

const normaliseRanking = (values) => {
  if (!Array.isArray(values)) throw new TypeError('검색 순위는 배열이어야 한다.');
  return values.map((value, index) => {
    const document = normaliseDocument(value, index + 1);
    if (!document.id) throw new TypeError(`${index + 1}위 문서 ID가 비어 있다.`);
    return { ...document, rank: index + 1 };
  });
};

const dcg = (grades) => grades.reduce((sum, grade, index) => sum + ((2 ** grade) - 1) / Math.log2(index + 2), 0);

export function calculateRankingMetrics(relevantValues, rankingValues, cutoffK) {
  const relevant = normaliseRelevant(relevantValues);
  if (relevant.size === 0) throw new RangeError('정답 관련 문서가 한 개 이상 필요하다.');
  const ranking = normaliseRanking(rankingValues);
  const k = Number(cutoffK);
  if (!Number.isInteger(k) || k < 1) throw new RangeError('평가 절단값 K는 1 이상의 정수여야 한다.');
  const top = ranking.slice(0, k);
  const unique = new Set();
  let duplicateCount = 0;
  const rows = top.map((document, index) => {
    const duplicate = unique.has(document.id);
    if (duplicate) duplicateCount += 1;
    unique.add(document.id);
    const grade = relevant.get(document.id) ?? document.grade ?? 0;
    const relevantHit = grade > 0;
    return {
      rank: index + 1,
      id: document.id,
      grade,
      relevant: relevantHit,
      duplicate,
      hasEvidence: document.hasEvidence,
      reciprocalContribution: relevantHit && !duplicate ? 1 / (index + 1) : 0,
      dcgContribution: ((2 ** grade) - 1) / Math.log2(index + 2),
    };
  });
  const uniqueRelevantHits = new Set(rows.filter(({ relevant }) => relevant).map(({ id }) => id)).size;
  const firstRelevantRank = rows.find(({ relevant, duplicate }) => relevant && !duplicate)?.rank ?? null;
  const grades = rows.map(({ grade }) => grade);
  const idealGrades = [...relevant.values()].sort((left, right) => right - left).slice(0, k);
  const actualDcg = dcg(grades);
  const idealDcg = dcg(idealGrades);
  const denominator = top.length || k;
  return {
    k,
    resultCount: ranking.length,
    relevantCount: relevant.size,
    precisionAtK: uniqueRelevantHits / k,
    recallAtK: uniqueRelevantHits / relevant.size,
    reciprocalRank: firstRelevantRank ? 1 / firstRelevantRank : 0,
    ndcgAtK: idealDcg > 0 ? actualDcg / idealDcg : 0,
    duplicateRate: denominator > 0 ? duplicateCount / denominator : 0,
    evidenceCoverage: denominator > 0 ? rows.filter(({ hasEvidence }) => hasEvidence).length / denominator : 0,
    firstRelevantRank,
    dcg: actualDcg,
    idealDcg,
    rows,
  };
}

export function parseRagJson(text) {
  const parsed = typeof text === 'string' ? JSON.parse(text) : text;
  const queries = Array.isArray(parsed) ? parsed : parsed?.queries;
  if (!Array.isArray(queries) || queries.length === 0) throw new TypeError('JSON에는 하나 이상의 질의 배열이 필요하다.');
  return queries.map((query, index) => ({
    queryId: String(query.queryId ?? query.query_id ?? query.id ?? `query-${index + 1}`),
    relevant: query.relevant ?? query.relevantDocuments ?? [],
    before: query.before ?? query.rankedDocuments ?? query.ranking ?? [],
    after: query.after ?? query.rerankedDocuments ?? query.reranked ?? [],
  }));
}

const parseCsvLine = (line) => {
  const cells = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && quoted && line[index + 1] === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { cells.push(cell); cell = ''; }
    else cell += character;
  }
  cells.push(cell);
  return cells.map((value) => value.trim());
};

export function parseRagCsv(text) {
  const lines = String(text ?? '').replace(/^\uFEFF/u, '').split(/\r?\n/u).filter((line) => line.trim());
  if (lines.length < 2) throw new TypeError('CSV에는 헤더와 하나 이상의 데이터 행이 필요하다.');
  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  const required = ['query_id', 'document_id'];
  for (const field of required) if (!headers.includes(field)) throw new TypeError(`CSV 헤더에 ${field} 열이 필요하다.`);
  const groups = new Map();
  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    const queryId = row.query_id || 'query-1';
    if (!groups.has(queryId)) groups.set(queryId, { queryId, relevant: new Map(), before: [], after: [] });
    const query = groups.get(queryId);
    const document = { id: row.document_id, grade: finiteGrade(row.relevance), hasEvidence: ['true', '1', 'yes', 'y'].includes(String(row.has_evidence).toLowerCase()) };
    if (document.grade > 0) query.relevant.set(document.id, { id: document.id, grade: document.grade });
    const beforeRank = Number(row.before_rank);
    const afterRank = Number(row.after_rank);
    if (Number.isInteger(beforeRank) && beforeRank > 0) query.before.push({ ...document, rank: beforeRank });
    if (Number.isInteger(afterRank) && afterRank > 0) query.after.push({ ...document, rank: afterRank });
  }
  return [...groups.values()].map((query) => ({
    queryId: query.queryId,
    relevant: [...query.relevant.values()],
    before: query.before.sort((a, b) => a.rank - b.rank),
    after: query.after.sort((a, b) => a.rank - b.rank),
  }));
}

const average = (values) => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

export function evaluateRagDataset(input = {}) {
  const k = Number(input.cutoffK ?? 5);
  const queries = typeof input.dataset === 'string'
    ? (input.format === 'csv' ? parseRagCsv(input.dataset) : parseRagJson(input.dataset))
    : parseRagJson(input.dataset);
  const perQuery = queries.map((query) => {
    const before = calculateRankingMetrics(query.relevant, query.before, k);
    const afterRanking = Array.isArray(query.after) && query.after.length > 0 ? query.after : query.before;
    const after = calculateRankingMetrics(query.relevant, afterRanking, k);
    return { queryId: query.queryId, before, after };
  });
  const aggregate = (key, run) => average(perQuery.map((query) => query[run][key]));
  const before = Object.fromEntries(['precisionAtK', 'recallAtK', 'reciprocalRank', 'ndcgAtK', 'duplicateRate', 'evidenceCoverage'].map((key) => [key, aggregate(key, 'before')]));
  const after = Object.fromEntries(['precisionAtK', 'recallAtK', 'reciprocalRank', 'ndcgAtK', 'duplicateRate', 'evidenceCoverage'].map((key) => [key, aggregate(key, 'after')]));
  const delta = Object.fromEntries(Object.keys(before).map((key) => [key, after[key] - before[key]]));
  const binaryOnly = queries.every((query) => query.relevant.every((item) => typeof item !== 'object' || finiteGrade(item.grade ?? item.relevance) <= 1));
  const warnings = binaryOnly ? [{ code: 'BINARY_RELEVANCE_ONLY', severity: 'info', message: '관련성 등급이 모두 1이어서 nDCG가 이진 판정만 반영한다.', wikiSlugs: ['normalized-discounted-cumulative-gain'] }] : [];
  if (perQuery.some(({ before: result, after: reranked }) => result.resultCount < k || reranked.resultCount < k)) warnings.push({ code: 'RESULTS_BELOW_K', severity: 'caution', message: '일부 질의의 결과 수가 K보다 작아 Precision@K의 분모는 K를 유지했다.', wikiSlugs: ['recall-at-k'] });
  return {
    formulaVersion: RAG_EVALUATION_FORMULA_VERSION,
    checkedAt: '2026-08-30',
    k,
    queryCount: perQuery.length,
    before,
    after,
    delta,
    perQuery,
    warnings,
    assumptions: [
      { id: 'macro-average', text: '모든 집계 지표는 질의별 값을 같은 가중치로 평균한 매크로 평균이다.', sourceIds: ['rag-evaluation'] },
      { id: 'duplicate-ignored', text: '같은 문서가 중복 반환되면 첫 결과만 적중으로 세고 이후 중복은 중복률에 포함한다.', sourceIds: ['recall-at-k'] },
      { id: 'graded-gain', text: 'nDCG는 관련성 등급 g에 대해 2^g-1 이득과 log2(rank+1) 할인을 사용한다.', sourceIds: ['normalized-discounted-cumulative-gain'] },
    ],
  };
}

export function ragResultToCsv(result) {
  const rows = [['query_id', 'run', 'precision_at_k', 'recall_at_k', 'reciprocal_rank', 'ndcg_at_k', 'duplicate_rate', 'evidence_coverage']];
  for (const query of result.perQuery) {
    for (const run of ['before', 'after']) rows.push([query.queryId, run, query[run].precisionAtK, query[run].recallAtK, query[run].reciprocalRank, query[run].ndcgAtK, query[run].duplicateRate, query[run].evidenceCoverage]);
  }
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
}

export function toRagEvaluationLabSession(result) {
  return {
    schemaVersion: '1.0', toolId: 'rag-evaluation', toolVersion: '1.0.0', locale: 'ko-KR', resultStatus: result.warnings.some(({ severity }) => severity === 'blocking') ? 'error' : result.warnings.length ? 'warning' : 'ok',
    inputs: { cutoffK: result.k, queryCount: result.queryCount },
    outputs: { 'ranking-metrics-before': result.before, 'ranking-metrics-after': result.after, 'reranking-delta': result.delta },
    warnings: result.warnings, assumptions: result.assumptions,
    wikiLinks: ['rag-evaluation', 'recall-at-k', 'mean-reciprocal-rank', 'normalized-discounted-cumulative-gain', 'context-precision', 'context-recall'],
    provenance: { formulaVersion: result.formulaVersion, sourceVersions: [{ id: 'rag-ranking-formula', version: '2.0.0' }], calculatedAt: new Date().toISOString() },
    privacy: { execution: 'client-only', networkAccess: 'none', transmitted: false, persisted: 'none' },
  };
}

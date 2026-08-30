import fs from 'node:fs';

const file = 'content-model/labs/registry.json';
const registry = JSON.parse(fs.readFileSync(file, 'utf8'));
registry.milestone = 'W54';
registry.updatedAt = '2026-08-30';

const i18n = (ko, en) => ({ ko, en });
const input = (id, ko, en, valueType, required, unit, description, wikiSlugs = [], constraints) => ({
  id, label: i18n(ko, en), valueType, required, unit, description,
  ...(constraints ? { constraints } : {}), wikiSlugs,
});
const output = (id, ko, en, valueType, unit, precision, description, wikiSlugs) => ({ id, label: i18n(ko, en), valueType, unit, precision, description, wikiSlugs });

const token = registry.tools.find(({ id }) => id === 'token-context');
Object.assign(token, {
  status: 'active', plannedMilestone: 'W67',
  summary: '시스템·사용자·도구·검색 문맥과 출력 예약량을 분리해 입력 예산, 안전 여유분, 잘림 위험과 배치 비용 상한을 추정한다.',
  capabilities: [
    '시스템·사용자·도구·검색 문맥의 토큰을 계층별로 추정한다.',
    '입력·출력 예약량과 안전 여유분을 구분해 잘림 위험을 표시한다.',
    '사용자가 입력한 단가와 배치·반복 횟수로 비용 상한을 계산한다.',
    '비교용 문맥 프리셋의 버전과 확인일을 공개하고 KV 캐시 계산기로 연결한다.',
  ],
});
token.execution.networkAccess = 'none';
token.contracts.inputFields = [
  input('system-text', '시스템 지시', 'System instructions', 'text', false, null, '호출 전체에 적용되는 역할, 정책과 출력 규칙이다.', ['token', 'system-prompt']),
  input('user-text', '사용자 입력', 'User input', 'text', true, null, '현재 호출에서 처리할 사용자 메시지나 작업 본문이다.', ['token']),
  input('tool-text', '도구 정의·결과', 'Tool definitions and results', 'text', false, null, '함수 스키마, 도구 호출 결과와 에이전트 상태다.', ['function-calling']),
  input('retrieval-text', '검색 문맥', 'Retrieved context', 'text', false, null, 'RAG가 모델 호출에 포함할 검색 문서 조각이다.', ['rag']),
  input('tokenizer-profile', '토크나이저 프로필', 'Tokenizer profile', 'select', true, null, '토큰 수 근사에 적용할 공급자 비종속 문자 비율 계열이다.', ['tokenizer'], { options: [{ value: 'provider-agnostic', label: i18n('공급자 비종속 추정', 'Provider-agnostic estimate') }, { value: 'bpe', label: i18n('BPE 계열', 'BPE family') }, { value: 'sentencepiece', label: i18n('SentencePiece 계열', 'SentencePiece family') }] }),
  input('context-window', '문맥 창', 'Context window', 'integer', true, '토큰', '모델 호출에서 허용되는 입력과 출력 토큰 상한이다.', ['context-window'], { minimum: 1 }),
  input('reserved-output', '출력 예약량', 'Reserved output', 'integer', true, '토큰', '응답 생성을 위해 문맥 창에서 미리 남겨둘 토큰 수다.', ['context-window'], { minimum: 0 }),
  input('safety-margin', '안전 여유분', 'Safety margin', 'number', true, '%', '토크나이저 차이와 런타임 래퍼를 흡수하도록 비워둘 문맥 비율이다.', ['context-truncation'], { minimum: 0, maximum: 50 }),
  input('batch-size', '배치 크기', 'Batch size', 'integer', true, '요청', '동일한 예산·단가 시나리오로 계산할 동시 요청 수다.', ['batching'], { minimum: 1 }),
  input('calls', '반복 호출 수', 'Repeated calls', 'integer', true, '회', '배치 비용 상한에 반영할 반복 호출 횟수다.', ['api-cost-tracking'], { minimum: 1 }),
  input('input-cost', '입력 단가', 'Input price', 'number', true, 'USD/1M 토큰', '사용자가 확인해 입력하는 백만 입력 토큰당 가격이다.', ['token-cost'], { minimum: 0 }),
  input('output-cost', '출력 단가', 'Output price', 'number', true, 'USD/1M 토큰', '사용자가 확인해 입력하는 백만 출력 토큰당 가격이다.', ['token-cost'], { minimum: 0 }),
];
token.contracts.outputFields = [
  output('estimated-token-count', '예상 입력 토큰', 'Estimated input tokens', 'number', '토큰', 0, '네 메시지 계층과 래퍼를 합친 입력 토큰 근사치다.', ['token', 'tokenizer']),
  output('context-utilization', '문맥 사용률', 'Context utilization', 'number', '%', 1, '입력과 출력 예약량이 전체 문맥 창에서 차지하는 비율이다.', ['context-window']),
  output('remaining-budget', '남은 입력 예산', 'Remaining input budget', 'number', '토큰', 0, '출력 예약량과 안전 여유분, 현재 입력을 제외한 잔여 토큰이다.', ['context-truncation']),
  output('truncation-risk', '잘림 위험', 'Truncation risk', 'budget-report', null, null, '잔여 비율과 초과 토큰을 바탕으로 한 위험 수준과 조치 안내다.', ['context-truncation']),
  output('batch-cost', '배치 비용 상한', 'Batch cost ceiling', 'breakdown', 'USD', 6, '입력 단가, 출력 예약 상한, 배치와 반복 횟수를 반영한 비용이다.', ['token-cost']),
];
token.contracts.warningDefinitions = [
  { code: 'TOKEN_ESTIMATE', severity: 'info', condition: '실제 모델 토크나이저를 사용하지 않는 경우', message: '결과를 정확한 청구 또는 제한 판정값이 아닌 근사치로 표시한다.' },
  { code: 'TRUNCATION_RISK', severity: 'caution', condition: '남은 입력 예산이 전체 입력 예산의 20% 미만인 경우', message: '토크나이저 차이와 추가 도구 결과를 고려해 입력을 줄이도록 안내한다.' },
  { code: 'CONTEXT_OVERFLOW', severity: 'blocking', condition: '입력과 출력 예약량, 안전 여유분이 문맥 창을 초과한 경우', message: '초과 토큰 수를 표시하고 입력 축소 또는 출력 예약량 조정을 안내한다.' },
];
token.contentLinks.wikiSlugs = ['token', 'tokenizer', 'context-window', 'context-truncation', 'token-cost', 'system-prompt', 'function-calling', 'rag', 'prompt-caching'];
token.evidence.formulaVersion = 'token-context-budget-v1';
token.evidence.sources.forEach((source) => { source.accessedAt = '2026-08-30'; });
token.releaseGate.shareableState = true;

const rag = registry.tools.find(({ id }) => id === 'rag-evaluation');
Object.assign(rag, {
  status: 'active', plannedMilestone: 'W68',
  summary: '질의별 정답·검색·재순위 결과에서 Precision@K, Recall@K, MRR, nDCG, 중복률과 근거 포함률을 계산하고 내보낸다.',
  capabilities: [
    'JSON과 CSV로 질의별 정답 문서, 검색 순위와 재순위 결과를 가져온다.',
    'Precision@K, Recall@K, MRR, nDCG, 중복률과 근거 포함률을 계산한다.',
    '초기 검색과 재순위화 결과의 평균·질의별 변화를 비교한다.',
    '계산 결과와 질의별 지표를 JSON 또는 CSV 파일로 내보낸다.',
  ],
});
rag.contracts.inputFields = [
  input('evaluation-dataset', '평가 데이터', 'Evaluation dataset', 'json', true, null, '질의별 정답 문서, 검색 전 순위와 재순위화 후 순위를 담은 JSON 또는 CSV다.', ['rag-evaluation']),
  input('input-format', '입력 형식', 'Input format', 'select', true, null, '브라우저에서 해석할 평가 데이터의 직렬화 형식이다.', ['rag-evaluation'], { options: [{ value: 'json', label: i18n('JSON', 'JSON') }, { value: 'csv', label: i18n('CSV', 'CSV') }] }),
  input('cutoff-k', '평가 절단값 K', 'Evaluation cutoff K', 'integer', true, '순위', '상위 몇 개 검색 결과까지 평가에 포함할지 정하는 값이다.', ['recall-at-k'], { minimum: 1 }),
];
rag.contracts.outputFields = [
  output('ranking-metrics-before', '검색 전 지표', 'Pre-reranking metrics', 'metric-set', null, 4, '초기 검색 결과의 6개 검색 품질 지표와 질의별 내역이다.', ['rag-evaluation', 'recall-at-k']),
  output('ranking-metrics-after', '재순위화 후 지표', 'Post-reranking metrics', 'metric-set', null, 4, '재순위화한 결과의 6개 검색 품질 지표와 질의별 내역이다.', ['rag-evaluation', 'normalized-discounted-cumulative-gain']),
  output('reranking-delta', '재순위화 변화', 'Reranking delta', 'ranking-report', null, 4, '재순위화 전후 Precision·Recall·MRR·nDCG·중복률·근거 포함률의 차이다.', ['mean-reciprocal-rank', 'context-precision', 'context-recall']),
];
rag.contracts.warningDefinitions = [
  { code: 'NO_RELEVANT_DOCUMENT', severity: 'blocking', condition: '정답 관련 문서 집합이 비어 있는 경우', message: '검색 품질 지표를 계산하지 않고 먼저 정답 판정 기준을 입력하도록 안내한다.' },
  { code: 'BINARY_RELEVANCE_ONLY', severity: 'info', condition: '관련성 등급 없이 관련 또는 무관만 입력한 경우', message: 'nDCG가 이진 관련성만 반영하며 등급형 판정보다 정보가 적음을 표시한다.' },
  { code: 'RESULTS_BELOW_K', severity: 'caution', condition: '일부 질의가 K보다 적은 검색 결과를 가진 경우', message: 'Precision@K의 분모는 K를 유지하며 결과 수 부족을 함께 표시한다.' },
];
rag.evidence.formulaVersion = 'rag-ranking-metrics-v2';
rag.evidence.sources.forEach((source) => { source.accessedAt = '2026-08-30'; });
rag.releaseGate.shareableState = false;

fs.writeFileSync(file, `${JSON.stringify(registry, null, 2)}\n`);
console.log('Activated W67 token-context and W68 rag-evaluation lab contracts.');


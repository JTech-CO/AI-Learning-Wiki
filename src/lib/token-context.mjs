export const TOKEN_CONTEXT_FORMULA_VERSION = 'token-context-budget-v1';

export const TOKEN_CONTEXT_PRESETS = Object.freeze([
  { id: 'compact-8k', label: '소형 문맥 · 8K', contextWindow: 8192, version: 'generic-2026.08', checkedAt: '2026-08-30' },
  { id: 'balanced-32k', label: '표준 문맥 · 32K', contextWindow: 32768, version: 'generic-2026.08', checkedAt: '2026-08-30' },
  { id: 'long-128k', label: '장문 문맥 · 128K', contextWindow: 131072, version: 'generic-2026.08', checkedAt: '2026-08-30' },
  { id: 'extended-1m', label: '확장 문맥 · 1M', contextWindow: 1048576, version: 'generic-2026.08', checkedAt: '2026-08-30' },
]);

export const TOKENIZER_PROFILES = Object.freeze({
  'provider-agnostic': { label: '공급자 비종속 추정', latinCharsPerToken: 3.8, hangulPerToken: 1.25 },
  bpe: { label: 'BPE 계열 추정', latinCharsPerToken: 4, hangulPerToken: 1.15 },
  sentencepiece: { label: 'SentencePiece 계열 추정', latinCharsPerToken: 3.6, hangulPerToken: 1.05 },
});

const asNonNegative = (value, label) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw new RangeError(`${label}은(는) 0 이상의 수여야 한다.`);
  return number;
};

const asPositiveInteger = (value, label) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) throw new RangeError(`${label}은(는) 1 이상의 정수여야 한다.`);
  return number;
};

export function estimateTokens(text, profileId = 'provider-agnostic') {
  const profile = TOKENIZER_PROFILES[profileId];
  if (!profile) throw new RangeError('지원하지 않는 토크나이저 프로필이다.');
  const source = String(text ?? '').normalize('NFC');
  if (!source) return 0;

  const hangul = (source.match(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/gu) ?? []).length;
  const cjk = (source.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/gu) ?? []).length;
  const emoji = (source.match(/\p{Extended_Pictographic}/gu) ?? []).length;
  const punctuation = (source.match(/[\p{P}\p{S}]/gu) ?? []).length - emoji;
  const remaining = source
    .replace(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/gu, '')
    .replace(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/gu, '')
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\p{P}\p{S}\s]/gu, '');

  const estimate = (hangul / profile.hangulPerToken)
    + cjk
    + (emoji * 2)
    + (Math.max(0, punctuation) * 0.45)
    + (remaining.length / profile.latinCharsPerToken);
  return Math.max(1, Math.ceil(estimate));
}

export function calculateTokenContextBudget(input = {}) {
  const profileId = input.tokenizerProfile ?? 'provider-agnostic';
  if (!TOKENIZER_PROFILES[profileId]) throw new RangeError('지원하지 않는 토크나이저 프로필이다.');

  const contextWindow = asPositiveInteger(input.contextWindow, '문맥 창');
  const reservedOutput = asNonNegative(input.reservedOutput, '출력 예약량');
  const safetyMarginPercent = asNonNegative(input.safetyMarginPercent ?? 10, '안전 여유분');
  if (safetyMarginPercent > 50) throw new RangeError('안전 여유분은 50% 이하여야 한다.');
  const batchSize = asPositiveInteger(input.batchSize ?? 1, '배치 크기');
  const calls = asPositiveInteger(input.calls ?? 1, '호출 횟수');
  const inputCostPerMillion = asNonNegative(input.inputCostPerMillion ?? 0, '입력 단가');
  const outputCostPerMillion = asNonNegative(input.outputCostPerMillion ?? 0, '출력 단가');

  const segments = [
    ['system', '시스템 지시', input.systemText],
    ['user', '사용자 입력', input.userText],
    ['tool', '도구 정의·결과', input.toolText],
    ['retrieval', '검색 문맥', input.retrievalText],
  ].map(([id, label, text]) => {
    const contentTokens = estimateTokens(text, profileId);
    const wrapperTokens = contentTokens > 0 ? 4 : 0;
    return { id, label, contentTokens, wrapperTokens, tokens: contentTokens + wrapperTokens };
  });

  const inputTokens = segments.reduce((sum, segment) => sum + segment.tokens, 0) + 3;
  const safetyMarginTokens = Math.ceil(contextWindow * safetyMarginPercent / 100);
  const inputBudget = Math.max(0, contextWindow - reservedOutput - safetyMarginTokens);
  const remainingInputBudget = inputBudget - inputTokens;
  const overflowTokens = Math.max(0, -remainingInputBudget);
  const plannedTokens = inputTokens + reservedOutput;
  const utilization = plannedTokens / contextWindow;
  const remainingRatio = inputBudget > 0 ? remainingInputBudget / inputBudget : -1;
  const risk = overflowTokens > 0
    ? { level: 'overflow', label: '문맥 초과', message: `${overflowTokens.toLocaleString('ko-KR')}토큰을 줄여야 한다.` }
    : remainingRatio < 0.05
      ? { level: 'critical', label: '잘림 위험 높음', message: '입력 예산의 95% 이상을 사용한다. 실제 토크나이저 차이로 잘릴 수 있다.' }
      : remainingRatio < 0.2
        ? { level: 'caution', label: '여유 적음', message: '검색 문맥이나 도구 출력이 늘어날 경우를 위해 입력을 줄이는 편이 안전하다.' }
        : { level: 'safe', label: '예산 내', message: '설정한 안전 여유분을 남긴 상태다.' };

  const oneRequestInputCost = inputTokens / 1_000_000 * inputCostPerMillion;
  const oneRequestOutputCost = reservedOutput / 1_000_000 * outputCostPerMillion;
  const multiplier = batchSize * calls;
  const costs = {
    currency: 'USD',
    oneRequestInput: oneRequestInputCost,
    oneRequestOutput: oneRequestOutputCost,
    oneRequestTotal: oneRequestInputCost + oneRequestOutputCost,
    batchRequests: multiplier,
    batchInput: oneRequestInputCost * multiplier,
    batchOutput: oneRequestOutputCost * multiplier,
    batchTotal: (oneRequestInputCost + oneRequestOutputCost) * multiplier,
  };

  const warnings = [
    {
      code: 'TOKEN_ESTIMATE',
      severity: 'info',
      message: '실제 모델 토크나이저가 아닌 언어·문자 계열별 근사치다.',
      wikiSlugs: ['token', 'tokenizer'],
    },
  ];
  if (overflowTokens > 0) warnings.push({
    code: 'CONTEXT_OVERFLOW',
    severity: 'blocking',
    message: `입력과 출력 예약량이 안전 예산을 ${overflowTokens.toLocaleString('ko-KR')}토큰 초과한다.`,
    wikiSlugs: ['context-window'],
  });
  else if (risk.level !== 'safe') warnings.push({
    code: 'TRUNCATION_RISK',
    severity: 'caution',
    message: risk.message,
    wikiSlugs: ['context-window', 'context-truncation'],
  });

  return {
    formulaVersion: TOKEN_CONTEXT_FORMULA_VERSION,
    checkedAt: '2026-08-30',
    profile: { id: profileId, ...TOKENIZER_PROFILES[profileId] },
    preset: TOKEN_CONTEXT_PRESETS.find(({ id }) => id === input.presetId) ?? null,
    inputs: { contextWindow, reservedOutput, safetyMarginPercent, batchSize, calls, inputCostPerMillion, outputCostPerMillion },
    segments,
    totals: { inputTokens, reservedOutput, safetyMarginTokens, inputBudget, remainingInputBudget, overflowTokens, plannedTokens, utilization },
    risk,
    costs,
    warnings,
    assumptions: [
      { id: 'token-estimate', text: '문자 종류별 경험적 비율과 메시지당 고정 래퍼 4토큰으로 입력을 추정한다.', sourceIds: ['tokenizer'] },
      { id: 'reserved-maximum', text: '비용 계산은 예약한 출력 토큰을 모두 생성하는 상한 시나리오를 사용한다.', sourceIds: ['context-window'] },
      { id: 'price-user-input', text: '비용 단가는 사용자가 입력한 백만 토큰당 USD 값이며 공급자 가격을 자동 조회하지 않는다.', sourceIds: ['token-cost'] },
    ],
  };
}

export function toTokenContextLabSession(result) {
  return {
    schemaVersion: '1.0', toolId: 'token-context', toolVersion: '1.0.0', locale: 'ko-KR',
    resultStatus: result.warnings.some(({ severity }) => severity === 'blocking') ? 'error' : result.warnings.length > 1 ? 'warning' : 'ok',
    inputs: result.inputs,
    outputs: { 'estimated-token-count': result.totals.inputTokens, 'context-utilization': result.totals.utilization * 100, 'remaining-budget': result.totals.remainingInputBudget, 'budget-report': { segments: result.segments, costs: result.costs, risk: result.risk } },
    warnings: result.warnings, assumptions: result.assumptions,
    wikiLinks: ['token', 'tokenizer', 'context-window', 'context-truncation', 'token-cost'],
    provenance: { formulaVersion: result.formulaVersion, sourceVersions: [{ id: 'token-budget-formula', version: '1.0.0' }], calculatedAt: new Date().toISOString() },
    privacy: { execution: 'client-only', networkAccess: 'none', transmitted: false, persisted: 'none' },
  };
}


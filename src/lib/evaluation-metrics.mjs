const FORMULA_VERSION = 'classification-metrics-v1';
const TOOL_VERSION = '1.0.0';
const CLASS_IMBALANCE_RATIO = 4;

const METRIC_BLUEPRINTS = Object.freeze([
  {
    id: 'accuracy',
    label: '정확도',
    formula: '(TP + TN) / (TP + TN + FP + FN)',
    wikiSlug: 'accuracy',
    describe: '전체 표본 중 올바르게 분류한 비율이다.',
  },
  {
    id: 'precision',
    label: '정밀도',
    formula: 'TP / (TP + FP)',
    wikiSlug: 'precision-recall',
    describe: '양성으로 예측한 표본 중 실제 양성인 비율이다.',
  },
  {
    id: 'recall',
    label: '재현율',
    formula: 'TP / (TP + FN)',
    wikiSlug: 'precision-recall',
    describe: '실제 양성 표본 중 양성으로 찾아낸 비율이다.',
  },
  {
    id: 'specificity',
    label: '특이도',
    formula: 'TN / (TN + FP)',
    wikiSlug: 'specificity',
    describe: '실제 음성 표본 중 음성으로 올바르게 거른 비율이다.',
  },
  {
    id: 'f1-score',
    label: 'F1 점수',
    formula: '2TP / (2TP + FP + FN)',
    wikiSlug: 'f1-score',
    describe: '정밀도와 재현율의 조화 평균이다.',
  },
]);

function normalizeCount(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    throw new RangeError(`${label}은(는) 0 이상의 정수여야 한다.`);
  }
  return number;
}

function normalizeThreshold(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0 || number > 1) {
    throw new RangeError('분류 임곗값은 0 이상 1 이하의 수여야 한다.');
  }
  return number;
}

function divide(numerator, denominator) {
  return denominator === 0 ? null : numerator / denominator;
}

function metricValue(id, counts, totals) {
  const { trueNegative: tn, falsePositive: fp, falseNegative: fn, truePositive: tp } = counts;

  switch (id) {
    case 'accuracy':
      return { numerator: tp + tn, denominator: totals.total };
    case 'precision':
      return { numerator: tp, denominator: totals.predictedPositive };
    case 'recall':
      return { numerator: tp, denominator: totals.actualPositive };
    case 'specificity':
      return { numerator: tn, denominator: totals.actualNegative };
    case 'f1-score':
      return { numerator: 2 * tp, denominator: (2 * tp) + fp + fn };
    default:
      throw new Error(`지원하지 않는 지표다: ${id}`);
  }
}

function buildThresholdEffects(threshold) {
  const thresholdLabel = threshold === null
    ? '입력되지 않음'
    : threshold.toLocaleString('ko-KR', { maximumFractionDigits: 4 });

  return {
    provided: threshold !== null,
    value: threshold,
    label: thresholdLabel,
    limitation:
      '집계 혼동행렬에는 표본별 예측 점수 분포가 없으므로 다른 임곗값의 혼동행렬이나 지표를 수치로 재계산할 수 없다.',
    directions: [
      {
        id: 'raise',
        label: '임곗값을 높일 때',
        prediction: '양성 예측이 줄어드는 방향으로 움직인다.',
        likelyEffects: [
          '거짓양성(FP)이 줄고 참음성(TN)이 늘 수 있다.',
          '참양성(TP)이 줄고 거짓음성(FN)이 늘 수 있다.',
          '정밀도는 높아지고 재현율은 낮아질 수 있다.',
        ],
      },
      {
        id: 'lower',
        label: '임곗값을 낮출 때',
        prediction: '양성 예측이 늘어나는 방향으로 움직인다.',
        likelyEffects: [
          '참양성(TP)이 늘고 거짓음성(FN)이 줄 수 있다.',
          '거짓양성(FP)이 늘고 참음성(TN)이 줄 수 있다.',
          '재현율은 높아지고 정밀도는 낮아질 수 있다.',
        ],
      },
    ],
  };
}

function buildInterpretation(totals, metrics, warnings) {
  if (totals.total === 0) {
    return '평가 표본이 없어 지표를 해석할 수 없다. 혼동행렬의 네 칸에 실제 평가 건수를 입력해야 한다.';
  }

  if (warnings.some(({ code }) => code === 'CLASS_IMBALANCE')) {
    return '클래스 불균형이 크므로 정확도 하나로 모델을 판단하면 다수 클래스를 잘 맞히는 성질이 성능처럼 보일 수 있다. 정밀도·재현율·특이도·F1 점수와 클래스별 표본 수를 함께 확인해야 한다.';
  }

  if (metrics.some(({ value }) => value === null)) {
    return '일부 지표의 분모가 0이다. 계산 불가를 0점으로 해석하지 말고, 해당 실제 클래스나 예측 클래스가 평가 표본에 존재하는지 먼저 확인해야 한다.';
  }

  return '클래스 분포가 크게 치우치지 않았더라도 목적에 따라 우선 지표가 달라진다. 오탐 비용이 크면 정밀도와 특이도를, 미탐 비용이 크면 재현율을 우선 확인하고 F1 점수로 정밀도와 재현율의 균형을 함께 본다.';
}

export function formatMetric(value, precision = 4) {
  if (value === null) return '계산 불가';
  return value.toLocaleString('ko-KR', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function calculateEvaluationMetrics(input = {}) {
  const counts = {
    trueNegative: normalizeCount(input.trueNegative, '참음성'),
    falsePositive: normalizeCount(input.falsePositive, '거짓양성'),
    falseNegative: normalizeCount(input.falseNegative, '거짓음성'),
    truePositive: normalizeCount(input.truePositive, '참양성'),
  };
  const threshold = normalizeThreshold(input.threshold);
  const totals = {
    total:
      counts.trueNegative
      + counts.falsePositive
      + counts.falseNegative
      + counts.truePositive,
    actualPositive: counts.truePositive + counts.falseNegative,
    actualNegative: counts.trueNegative + counts.falsePositive,
    predictedPositive: counts.truePositive + counts.falsePositive,
    predictedNegative: counts.trueNegative + counts.falseNegative,
  };

  const metrics = METRIC_BLUEPRINTS.map((blueprint) => {
    const { numerator, denominator } = metricValue(blueprint.id, counts, totals);
    const value = divide(numerator, denominator);
    return {
      ...blueprint,
      numerator,
      denominator,
      value,
      formatted: formatMetric(value),
    };
  });

  const warnings = [];
  const undefinedMetrics = metrics.filter(({ value }) => value === null);
  if (undefinedMetrics.length > 0) {
    warnings.push({
      code: 'ZERO_DENOMINATOR',
      severity: 'caution',
      message: `${undefinedMetrics.map(({ label }) => label).join('·')}의 분모가 0이므로 계산 불가로 표시했다. 이를 성능 0으로 해석해서는 안 된다.`,
      wikiSlugs: [...new Set(undefinedMetrics.map(({ wikiSlug }) => wikiSlug))],
    });
  }

  const majority = Math.max(totals.actualPositive, totals.actualNegative);
  const minority = Math.min(totals.actualPositive, totals.actualNegative);
  const imbalanceRatio = totals.total === 0
    ? null
    : minority === 0
      ? Number.POSITIVE_INFINITY
      : majority / minority;
  if (totals.total > 0 && imbalanceRatio >= CLASS_IMBALANCE_RATIO) {
    const ratioText = Number.isFinite(imbalanceRatio)
      ? `${imbalanceRatio.toFixed(1)}배`
      : '한 클래스 표본이 0건';
    warnings.push({
      code: 'CLASS_IMBALANCE',
      severity: 'info',
      message: `실제 양성 ${totals.actualPositive}건과 실제 음성 ${totals.actualNegative}건의 차이가 크다(${ratioText}). 정확도 외 지표를 함께 확인해야 한다.`,
      wikiSlugs: ['accuracy', 'confusion-matrix'],
    });
  }

  const thresholdEffects = buildThresholdEffects(threshold);
  const interpretation = buildInterpretation(totals, metrics, warnings);
  const assumptions = [
    {
      id: 'binary-classification',
      text: '모든 표본은 서로 겹치지 않는 양성 또는 음성 중 하나이며, 이진 분류 결과라고 가정한다.',
      sourceIds: ['confusion-matrix'],
    },
    {
      id: 'single-evaluation-set',
      text: '네 혼동행렬 값은 같은 평가 데이터와 같은 분류 임곗값에서 집계한 결과라고 가정한다.',
      sourceIds: ['confusion-matrix'],
    },
    {
      id: 'threshold-direction-only',
      text: '표본별 예측 점수 분포가 없으므로 임곗값 변경 효과는 일반적인 방향만 설명하며 새 지표를 추정하지 않는다.',
      sourceIds: ['roc-curve', 'precision-recall-curve'],
    },
  ];

  return {
    toolId: 'evaluation-metrics',
    toolVersion: TOOL_VERSION,
    formulaVersion: FORMULA_VERSION,
    calculatedAt: new Date().toISOString(),
    counts,
    threshold,
    totals: {
      ...totals,
      imbalanceRatio,
    },
    metrics,
    thresholdEffects,
    interpretation,
    warnings,
    assumptions,
  };
}

export function toEvaluationLabSession(result) {
  return {
    schemaVersion: '1.0',
    toolId: result.toolId,
    toolVersion: result.toolVersion,
    locale: 'ko-KR',
    resultStatus: result.warnings.length > 0 ? 'warning' : 'ok',
    inputs: {
      'true-negative': result.counts.trueNegative,
      'false-positive': result.counts.falsePositive,
      'false-negative': result.counts.falseNegative,
      'true-positive': result.counts.truePositive,
      'classification-threshold': result.threshold,
    },
    outputs: {
      'classification-metrics': Object.fromEntries(
        result.metrics.map(({ id, value }) => [id, value]),
      ),
      'threshold-effects': result.thresholdEffects,
      'metric-interpretation': result.interpretation,
    },
    warnings: result.warnings,
    assumptions: result.assumptions,
    wikiLinks: [
      'confusion-matrix',
      'accuracy',
      'precision-recall',
      'f1-score',
      'specificity',
      'roc-curve',
      'precision-recall-curve',
      'brier-score',
    ],
    provenance: {
      formulaVersion: result.formulaVersion,
      sourceVersions: [
        { id: 'scikit-model-evaluation', version: '1.9 stable documentation' },
        { id: 'wiki-index', version: 'W56 baseline' },
      ],
      calculatedAt: result.calculatedAt,
    },
    privacy: {
      execution: 'client-only',
      networkAccess: 'none',
      transmitted: false,
      persisted: 'none',
    },
  };
}

export const evaluationMetricConstants = Object.freeze({
  formulaVersion: FORMULA_VERSION,
  toolVersion: TOOL_VERSION,
  classImbalanceRatio: CLASS_IMBALANCE_RATIO,
  metrics: METRIC_BLUEPRINTS,
});

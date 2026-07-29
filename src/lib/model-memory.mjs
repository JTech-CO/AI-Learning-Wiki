const FORMULA_VERSION = 'model-memory-v1';
const TOOL_VERSION = '1.0.0';
const GIB = 1024 ** 3;
const MIB = 1024 ** 2;
const SUPPORTED_PRECISIONS = new Set([4, 8, 16, 32]);
const SUPPORTED_MODES = new Set(['inference', 'training']);

function positiveNumber(value, label) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${label}은(는) 0보다 큰 수여야 한다.`);
  }
  return number;
}

function positiveInteger(value, label, maximum = Number.MAX_SAFE_INTEGER) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > maximum) {
    throw new RangeError(`${label}은(는) 1 이상 ${maximum.toLocaleString('ko-KR')} 이하의 정수여야 한다.`);
  }
  return number;
}

function normalizePrecision(value) {
  const precision = Number(value);
  if (!SUPPORTED_PRECISIONS.has(precision)) {
    throw new RangeError('수치 정밀도는 4, 8, 16, 32비트 중 하나여야 한다.');
  }
  return precision;
}

function normalizeMode(value) {
  const mode = String(value ?? '');
  if (!SUPPORTED_MODES.has(mode)) {
    throw new RangeError('실행 모드는 추론 또는 학습이어야 한다.');
  }
  return mode;
}

function checkedBytes(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} 계산 범위가 너무 크다. 입력값을 줄여야 한다.`);
  }
  return value;
}

function bytesToGiB(bytes) {
  return bytes / GIB;
}

function bytesToMiB(bytes) {
  return bytes / MIB;
}

function kvCacheBytes({
  layerCount,
  batchSize,
  contextLength,
  kvHeadCount,
  headDimension,
  bytesPerElement,
}) {
  return checkedBytes(
    2
      * layerCount
      * batchSize
      * contextLength
      * kvHeadCount
      * headDimension
      * bytesPerElement,
    'KV 캐시',
  );
}

function buildTrainingState(parameterCount, precision, mode) {
  if (mode === 'inference') {
    return {
      bytes: 0,
      bytesPerParameter: 0,
      components: [
        { id: 'gradient', label: '그래디언트', bytesPerParameter: 0, bytes: 0 },
        { id: 'optimizer', label: 'Adam 계열 옵티마이저 상태', bytesPerParameter: 0, bytes: 0 },
        { id: 'master-weight', label: 'FP32 마스터 가중치', bytesPerParameter: 0, bytes: 0 },
      ],
    };
  }

  const gradientBytesPerParameter = 4;
  const optimizerBytesPerParameter = 8;
  const masterWeightBytesPerParameter = precision < 32 ? 4 : 0;
  const components = [
    {
      id: 'gradient',
      label: 'FP32 그래디언트',
      bytesPerParameter: gradientBytesPerParameter,
      bytes: checkedBytes(parameterCount * gradientBytesPerParameter, '그래디언트'),
    },
    {
      id: 'optimizer',
      label: 'Adam 계열 1·2차 모멘트',
      bytesPerParameter: optimizerBytesPerParameter,
      bytes: checkedBytes(parameterCount * optimizerBytesPerParameter, '옵티마이저 상태'),
    },
    {
      id: 'master-weight',
      label: 'FP32 마스터 가중치',
      bytesPerParameter: masterWeightBytesPerParameter,
      bytes: checkedBytes(parameterCount * masterWeightBytesPerParameter, '마스터 가중치'),
    },
  ];
  const bytesPerParameter = components.reduce(
    (sum, component) => sum + component.bytesPerParameter,
    0,
  );

  return {
    bytes: checkedBytes(
      components.reduce((sum, component) => sum + component.bytes, 0),
      '학습 상태',
    ),
    bytesPerParameter,
    components,
  };
}

function buildContextScenarios(inputs, bytesPerElement) {
  const lengths = [...new Set([1024, 8192, 32768, 131072, inputs.contextLength])]
    .sort((left, right) => left - right);

  return lengths.map((contextLength) => {
    const bytes = kvCacheBytes({
      ...inputs,
      contextLength,
      bytesPerElement,
    });
    return {
      contextLength,
      totalCachedTokens: contextLength * inputs.batchSize,
      bytes,
      gib: bytesToGiB(bytes),
      isCurrent: contextLength === inputs.contextLength,
    };
  });
}

export function formatGiB(value, precision = 2) {
  return Number(value).toLocaleString('ko-KR', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

export function formatMemoryBytes(bytes) {
  if (bytes >= GIB) return `${formatGiB(bytesToGiB(bytes))} GiB`;
  if (bytes >= MIB) {
    return `${bytesToMiB(bytes).toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} MiB`;
  }
  return `${Math.round(bytes).toLocaleString('ko-KR')} B`;
}

export function calculateModelMemory(input = {}) {
  const inputs = {
    parameterCount: positiveNumber(input.parameterCount, '파라미터 수'),
    precision: normalizePrecision(input.precision),
    executionMode: normalizeMode(input.executionMode),
    layerCount: positiveInteger(input.layerCount, '레이어 수', 1000),
    batchSize: positiveInteger(input.batchSize, '배치 크기', 100000),
    contextLength: positiveInteger(input.contextLength, '문맥 길이', 100000000),
    kvHeadCount: positiveInteger(input.kvHeadCount, 'KV 헤드 수', 4096),
    headDimension: positiveInteger(input.headDimension, '헤드 차원', 65536),
  };
  const bytesPerElement = inputs.precision / 8;
  const weightBytes = checkedBytes(
    inputs.parameterCount * bytesPerElement,
    '가중치 메모리',
  );
  const trainingState = buildTrainingState(
    inputs.parameterCount,
    inputs.precision,
    inputs.executionMode,
  );
  const currentKvBytes = kvCacheBytes({
    ...inputs,
    bytesPerElement,
  });
  const totalBytes = checkedBytes(
    weightBytes + trainingState.bytes + currentKvBytes,
    '총 메모리',
  );
  const kvBytesPerTokenPerRequest = checkedBytes(
    2
      * inputs.layerCount
      * inputs.kvHeadCount
      * inputs.headDimension
      * bytesPerElement,
    '토큰당 KV 캐시',
  );

  const components = [
    {
      id: 'weights',
      label: '모델 가중치',
      bytes: weightBytes,
      gib: bytesToGiB(weightBytes),
      sharePercent: totalBytes === 0 ? 0 : weightBytes / totalBytes * 100,
      included: true,
    },
    {
      id: 'training-state',
      label: '학습 상태',
      bytes: trainingState.bytes,
      gib: bytesToGiB(trainingState.bytes),
      sharePercent: totalBytes === 0 ? 0 : trainingState.bytes / totalBytes * 100,
      included: inputs.executionMode === 'training',
    },
    {
      id: 'kv-cache',
      label: 'KV 캐시',
      bytes: currentKvBytes,
      gib: bytesToGiB(currentKvBytes),
      sharePercent: totalBytes === 0 ? 0 : currentKvBytes / totalBytes * 100,
      included: true,
    },
  ];

  const warnings = [
    {
      code: 'ESTIMATE_ONLY',
      severity: 'caution',
      message: '입력한 구조와 정밀도만으로 계산한 최소 근사치다. 실제 장치 선택에는 별도 여유 메모리를 두어야 한다.',
      wikiSlugs: ['parameter-count', 'quantization', 'kv-cache'],
    },
    {
      code: 'TEMPORARY_MEMORY_EXCLUDED',
      severity: 'info',
      message: '활성값, 커널 작업 공간, 메모리 단편화, 양자화 메타데이터와 프레임워크 오버헤드는 총 추정치에서 제외했다.',
      wikiSlugs: ['accelerator-memory', 'out-of-memory-error'],
    },
  ];

  const assumptions = [
    {
      id: 'binary-memory-unit',
      text: '모든 용량은 1 GiB를 1,073,741,824바이트로 두는 이진 단위로 표시한다.',
      sourceIds: ['accelerator-memory'],
    },
    {
      id: 'shared-storage-precision',
      text: '선택한 수치 정밀도를 모델 가중치와 KV 캐시 원소에 동일하게 적용하며 양자화 스케일과 영점 메타데이터는 제외한다.',
      sourceIds: ['quantization', 'kv-cache'],
    },
    {
      id: 'decoder-kv-layout',
      text: '각 트랜스포머 레이어가 토큰마다 KV 헤드별 키와 값 벡터 한 쌍을 유지한다고 가정한다.',
      sourceIds: ['kv-cache', 'query-key-value'],
    },
    {
      id: 'adam-training-state',
      text: inputs.executionMode === 'training'
        ? '학습 상태는 파라미터당 FP32 그래디언트 4바이트와 Adam 계열 모멘트 8바이트를 사용하고, 32비트 미만 가중치에는 FP32 마스터 가중치 4바이트를 더한다고 가정한다.'
        : '추론 모드에서는 그래디언트, 옵티마이저 상태와 FP32 마스터 가중치를 할당하지 않는다고 가정한다.',
      sourceIds: ['optimizer-state'],
    },
    {
      id: 'training-kv-scenario',
      text: '학습 모드에서도 KV 캐시는 선택 구조를 비교하기 위한 독립 시나리오로 합산하며 표준 전체 시퀀스 학습의 활성값 메모리를 대신하지 않는다.',
      sourceIds: ['kv-cache', 'accelerator-memory'],
    },
  ];

  return {
    toolId: 'model-memory',
    toolVersion: TOOL_VERSION,
    formulaVersion: FORMULA_VERSION,
    calculatedAt: new Date().toISOString(),
    inputs,
    bytesPerElement,
    weightMemory: {
      bytes: weightBytes,
      gib: bytesToGiB(weightBytes),
      bytesPerParameter: bytesPerElement,
    },
    trainingStateMemory: {
      ...trainingState,
      gib: bytesToGiB(trainingState.bytes),
    },
    kvCacheMemory: {
      bytes: currentKvBytes,
      gib: bytesToGiB(currentKvBytes),
      bytesPerTokenPerRequest: kvBytesPerTokenPerRequest,
      mibPerTokenPerRequest: bytesToMiB(kvBytesPerTokenPerRequest),
      totalCachedTokens: inputs.batchSize * inputs.contextLength,
      formula: '2 × 레이어 × 배치 × 문맥 길이 × KV 헤드 × 헤드 차원 × 원소 바이트',
    },
    totalEstimate: {
      bytes: totalBytes,
      gib: bytesToGiB(totalBytes),
    },
    components,
    contextScenarios: buildContextScenarios(inputs, bytesPerElement),
    excludedItems: [
      '활성값과 역전파용 중간 텐서',
      '어텐션·행렬곱 커널 작업 공간',
      '메모리 할당자 단편화와 프레임워크 오버헤드',
      '양자화 그룹별 스케일·영점과 패킹 메타데이터',
      '텐서 병렬화의 복제·샤딩 및 통신 버퍼',
    ],
    warnings,
    assumptions,
  };
}

export function toModelMemoryLabSession(result) {
  return {
    schemaVersion: '1.0',
    toolId: result.toolId,
    toolVersion: result.toolVersion,
    locale: 'ko-KR',
    resultStatus: result.warnings.length > 0 ? 'warning' : 'ok',
    inputs: {
      'parameter-count': result.inputs.parameterCount,
      precision: result.inputs.precision,
      'execution-mode': result.inputs.executionMode,
      'layer-count': result.inputs.layerCount,
      'batch-size': result.inputs.batchSize,
      'context-length': result.inputs.contextLength,
      'kv-head-count': result.inputs.kvHeadCount,
      'head-dimension': result.inputs.headDimension,
    },
    outputs: {
      'weight-memory': result.weightMemory.gib,
      'training-state-memory': result.trainingStateMemory.gib,
      'kv-cache-memory': result.kvCacheMemory.gib,
      'total-estimate': result.totalEstimate.gib,
      'memory-breakdown': {
        components: result.components,
        contextScenarios: result.contextScenarios,
        excludedItems: result.excludedItems,
      },
    },
    warnings: result.warnings,
    assumptions: result.assumptions,
    wikiLinks: [
      'parameter-count',
      'quantization',
      'kv-cache',
      'context-window',
      'tensor-parallelism',
      'optimizer-state',
    ],
    provenance: {
      formulaVersion: result.formulaVersion,
      sourceVersions: [
        { id: 'transformers-memory', version: 'Transformers 5.6.1' },
        { id: 'wiki-index', version: 'W57 baseline' },
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

export const modelMemoryConstants = Object.freeze({
  formulaVersion: FORMULA_VERSION,
  toolVersion: TOOL_VERSION,
  gib: GIB,
  mib: MIB,
  supportedPrecisions: [...SUPPORTED_PRECISIONS],
  supportedModes: [...SUPPORTED_MODES],
});

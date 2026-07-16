import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'content-model', 'articles');
const researchDir = path.join(root, 'content-model', 'research');

const categories = {
  llm: [
    ['prompt-contract-testing', '프롬프트 계약 테스트', 'Prompt Contract Testing'],
    ['instruction-priority-architecture', '지시 우선순위 아키텍처', 'Instruction Priority Architecture'],
    ['prompt-release-governance', '프롬프트 릴리스 거버넌스', 'Prompt Release Governance'],
    ['structured-output-recovery', '구조화 출력 복구', 'Structured Output Recovery'],
    ['prompt-portfolio-observability', '프롬프트 포트폴리오 관측성', 'Prompt Portfolio Observability'],
    ['multimodal-input-contract', '멀티모달 입력 계약', 'Multimodal Input Contract'],
    ['modality-fallback-policy', '모달리티 대체 정책', 'Modality Fallback Policy'],
    ['cross-modal-latency-budget', '교차 모달 지연 예산', 'Cross-modal Latency Budget'],
    ['multimodal-safety-evaluation', '멀티모달 안전 평가', 'Multimodal Safety Evaluation'],
    ['media-provenance-pipeline', '미디어 출처 파이프라인', 'Media Provenance Pipeline'],
    ['long-context-routing', '긴 문맥 라우팅', 'Long-context Routing'],
    ['context-window-budgeting', '컨텍스트 창 예산 관리', 'Context-window Budgeting'],
    ['context-cache-coherence', '컨텍스트 캐시 일관성', 'Context Cache Coherence'],
    ['instruction-conflict-resolution', '지시 충돌 해소', 'Instruction Conflict Resolution'],
    ['system-prompt-composition', '시스템 프롬프트 합성', 'System Prompt Composition'],
    ['response-contract', '응답 계약', 'Response Contract'],
    ['semantic-output-validation', '의미 기반 출력 검증', 'Semantic Output Validation'],
    ['llm-request-envelope', 'LLM 요청 엔벨로프', 'LLM Request Envelope'],
    ['model-capability-profile', '모델 역량 프로파일', 'Model Capability Profile'],
    ['model-compatibility-matrix', '모델 호환성 행렬', 'Model Compatibility Matrix'],
    ['model-fallback-chain', '모델 대체 체인', 'Model Fallback Chain'],
    ['model-selection-policy', '모델 선택 정책', 'Model Selection Policy'],
    ['token-accounting', '토큰 회계', 'Token Accounting'],
    ['token-budget-controller', '토큰 예산 제어기', 'Token Budget Controller'],
    ['reasoning-effort-control', '추론 노력 제어', 'Reasoning Effort Control'],
    ['reasoning-trace-policy', '추론 추적 정책', 'Reasoning Trace Policy'],
    ['speculative-generation-policy', '투기적 생성 정책', 'Speculative Generation Policy'],
    ['llm-session-state', 'LLM 세션 상태', 'LLM Session State'],
    ['conversation-state-compaction', '대화 상태 압축', 'Conversation State Compaction'],
    ['llm-output-determinism', 'LLM 출력 결정성', 'LLM Output Determinism'],
    ['llm-response-reproducibility', 'LLM 응답 재현성', 'LLM Response Reproducibility'],
    ['llm-feature-flag', 'LLM 기능 플래그', 'LLM Feature Flag'],
    ['model-version-pinning', '모델 버전 고정', 'Model Version Pinning'],
    ['model-deprecation-migration', '모델 종료 마이그레이션', 'Model Deprecation Migration'],
    ['llm-api-contract-test', 'LLM API 계약 테스트', 'LLM API Contract Test'],
    ['llm-client-conformance', 'LLM 클라이언트 적합성', 'LLM Client Conformance'],
    ['llm-routing-gateway', 'LLM 라우팅 게이트웨이', 'LLM Routing Gateway'],
    ['llm-request-normalization', 'LLM 요청 정규화', 'LLM Request Normalization'],
    ['llm-response-normalization', 'LLM 응답 정규화', 'LLM Response Normalization'],
    ['llm-workload-classification', 'LLM 워크로드 분류', 'LLM Workload Classification']
  ],
  evaluation: [
    ['llm-evaluation-contract', 'LLM 평가 계약', 'LLM Evaluation Contract'],
    ['judge-calibration-curve', '판정 모델 교정 곡선', 'Judge Calibration Curve'],
    ['evaluation-budget-allocation', '평가 예산 배분', 'Evaluation Budget Allocation'],
    ['slice-based-release-gate', '슬라이스 기반 릴리스 게이트', 'Slice-based Release Gate'],
    ['online-evaluation-drift', '온라인 평가 드리프트', 'Online Evaluation Drift'],
    ['golden-set-governance', '골든 세트 거버넌스', 'Golden-set Governance'],
    ['evaluation-dataset-lineage', '평가 데이터셋 계보', 'Evaluation Dataset Lineage'],
    ['evaluation-slice', '평가 슬라이스', 'Evaluation Slice'],
    ['capability-regression', '역량 회귀', 'Capability Regression'],
    ['behavioral-regression', '행동 회귀', 'Behavioral Regression'],
    ['pairwise-evaluation-design', '쌍대 비교 평가 설계', 'Pairwise Evaluation Design'],
    ['pointwise-evaluation-design', '개별 채점 평가 설계', 'Pointwise Evaluation Design'],
    ['rubric-reliability', '루브릭 신뢰도', 'Rubric Reliability'],
    ['inter-rater-agreement-for-llm', 'LLM 평가자 간 일치도', 'Inter-rater Agreement for LLMs'],
    ['llm-judge-ensemble', 'LLM 판정 앙상블', 'LLM Judge Ensemble'],
    ['judge-position-randomization', '판정 위치 무작위화', 'Judge Position Randomization'],
    ['judge-length-bias-control', '판정 길이 편향 통제', 'Judge Length-bias Control'],
    ['evaluation-contamination-audit', '평가 오염 감사', 'Evaluation Contamination Audit'],
    ['benchmark-refresh-policy', '벤치마크 갱신 정책', 'Benchmark Refresh Policy'],
    ['benchmark-retirement', '벤치마크 폐기', 'Benchmark Retirement'],
    ['evaluation-confidence-interval', '평가 신뢰구간', 'Evaluation Confidence Interval'],
    ['sequential-evaluation', '순차 평가', 'Sequential Evaluation'],
    ['canary-evaluation', '카나리 평가', 'Canary Evaluation'],
    ['shadow-evaluation', '쉐도 평가', 'Shadow Evaluation'],
    ['counterfactual-evaluation', '반사실 평가', 'Counterfactual Evaluation'],
    ['robustness-evaluation-grid', '견고성 평가 그리드', 'Robustness Evaluation Grid'],
    ['multilingual-evaluation-protocol', '다국어 평가 프로토콜', 'Multilingual Evaluation Protocol'],
    ['domain-expert-evaluation', '도메인 전문가 평가', 'Domain-expert Evaluation'],
    ['evaluation-error-taxonomy', '평가 오류 분류 체계', 'Evaluation Error Taxonomy'],
    ['evaluation-decision-log', '평가 의사결정 로그', 'Evaluation Decision Log']
  ],
  api: [
    ['api-version-negotiation', 'API 버전 협상', 'API Version Negotiation'],
    ['api-schema-evolution', 'API 스키마 진화', 'API Schema Evolution'],
    ['api-backward-compatibility', 'API 하위 호환성', 'API Backward Compatibility'],
    ['llm-api-idempotency', 'LLM API 멱등성', 'LLM API Idempotency'],
    ['llm-api-pagination', 'LLM API 페이지 나누기', 'LLM API Pagination'],
    ['stream-resume-protocol', '스트림 재개 프로토콜', 'Stream Resume Protocol'],
    ['streaming-response-contract', '스트리밍 응답 계약', 'Streaming Response Contract'],
    ['server-sent-event-recovery', 'SSE 복구', 'Server-sent Event Recovery'],
    ['llm-webhook-signature', 'LLM 웹훅 서명', 'LLM Webhook Signature'],
    ['llm-webhook-replay-defense', 'LLM 웹훅 재전송 방어', 'LLM Webhook Replay Defense'],
    ['api-rate-limit-budget', 'API 요청 제한 예산', 'API Rate-limit Budget'],
    ['api-quota-allocation', 'API 할당량 배분', 'API Quota Allocation'],
    ['api-timeout-budget', 'API 타임아웃 예산', 'API Timeout Budget'],
    ['api-retry-budget', 'API 재시도 예산', 'API Retry Budget'],
    ['api-circuit-breaker-policy', 'API 회로 차단기 정책', 'API Circuit-breaker Policy'],
    ['api-error-envelope', 'API 오류 엔벨로프', 'API Error Envelope'],
    ['api-partial-failure', 'API 부분 실패', 'API Partial Failure'],
    ['api-batch-contract', 'API 배치 계약', 'API Batch Contract'],
    ['api-request-deduplication', 'API 요청 중복 제거', 'API Request Deduplication'],
    ['api-client-observability', 'API 클라이언트 관측성', 'API Client Observability'],
    ['api-secret-rotation', 'API 비밀 키 교체', 'API Secret Rotation'],
    ['api-data-retention', 'API 데이터 보유', 'API Data Retention'],
    ['api-region-routing', 'API 리전 라우팅', 'API Region Routing'],
    ['api-provider-abstraction', 'API 공급자 추상화', 'API Provider Abstraction'],
    ['api-conformance-suite', 'API 적합성 테스트 스위트', 'API Conformance Suite']
  ],
  agents: [
    ['agent-idempotency', '에이전트 멱등성', 'Agent Idempotency'],
    ['agent-action-ledger', '에이전트 행동 원장', 'Agent Action Ledger'],
    ['tool-permission-broker', '도구 권한 브로커', 'Tool Permission Broker'],
    ['agent-compensation-transaction', '에이전트 보상 트랜잭션', 'Agent Compensation Transaction'],
    ['agent-incident-playbook', '에이전트 사고 대응 절차', 'Agent Incident Playbook'],
    ['agent-state-machine', '에이전트 상태 기계', 'Agent State Machine'],
    ['agent-run-contract', '에이전트 실행 계약', 'Agent Run Contract'],
    ['agent-step-budget', '에이전트 단계 예산', 'Agent Step Budget'],
    ['agent-loop-watchdog', '에이전트 루프 감시기', 'Agent Loop Watchdog'],
    ['agent-tool-transaction', '에이전트 도구 트랜잭션', 'Agent Tool Transaction'],
    ['agent-tool-retry-policy', '에이전트 도구 재시도 정책', 'Agent Tool Retry Policy'],
    ['agent-tool-timeout-budget', '에이전트 도구 타임아웃 예산', 'Agent Tool Timeout Budget'],
    ['agent-side-effect-control', '에이전트 부수 효과 제어', 'Agent Side-effect Control'],
    ['agent-human-approval-gate', '에이전트 사람 승인 게이트', 'Agent Human-approval Gate'],
    ['agent-escalation-policy', '에이전트 상향 보고 정책', 'Agent Escalation Policy'],
    ['agent-memory-retention', '에이전트 메모리 보유', 'Agent Memory Retention'],
    ['agent-memory-consistency', '에이전트 메모리 일관성', 'Agent Memory Consistency'],
    ['agent-context-handoff', '에이전트 문맥 핸드오프', 'Agent Context Handoff'],
    ['multi-agent-deadlock', '멀티에이전트 교착 상태', 'Multi-agent Deadlock'],
    ['multi-agent-consensus-protocol', '멀티에이전트 합의 프로토콜', 'Multi-agent Consensus Protocol'],
    ['multi-agent-conflict-mediation', '멀티에이전트 충돌 중재', 'Multi-agent Conflict Mediation'],
    ['agent-simulation-test', '에이전트 시뮬레이션 테스트', 'Agent Simulation Test'],
    ['agent-chaos-testing', '에이전트 카오스 테스트', 'Agent Chaos Testing'],
    ['agent-canary-run', '에이전트 카나리 실행', 'Agent Canary Run'],
    ['agent-run-replay', '에이전트 실행 재현', 'Agent Run Replay']
  ],
  inference: [
    ['llm-serving-slo', 'LLM 서빙 SLO', 'LLM Serving SLO'],
    ['token-budget-admission-control', '토큰 예산 수용 제어', 'Token-budget Admission Control'],
    ['continuous-batching-policy', '연속 배칭 정책', 'Continuous Batching Policy'],
    ['model-fleet-routing', '모델 플릿 라우팅', 'Model Fleet Routing'],
    ['llm-cost-attribution', 'LLM 비용 귀속', 'LLM Cost Attribution'],
    ['prefill-decode-disaggregation', '프리필·디코드 분리', 'Prefill-decode Disaggregation'],
    ['continuous-batching-fairness', '연속 배칭 공정성', 'Continuous Batching Fairness'],
    ['kv-cache-admission', 'KV 캐시 수용 제어', 'KV-cache Admission'],
    ['kv-cache-isolation', 'KV 캐시 격리', 'KV-cache Isolation'],
    ['kv-cache-capacity-planning', 'KV 캐시 용량 계획', 'KV-cache Capacity Planning'],
    ['token-scheduler', '토큰 스케줄러', 'Token Scheduler'],
    ['request-preemption', '요청 선점', 'Request Preemption'],
    ['inference-workload-shaping', '추론 워크로드 형상화', 'Inference Workload Shaping'],
    ['inference-queue-discipline', '추론 큐 규칙', 'Inference Queue Discipline'],
    ['inference-backpressure', '추론 역압', 'Inference Backpressure'],
    ['inference-overload-control', '추론 과부하 제어', 'Inference Overload Control'],
    ['inference-warm-pool', '추론 웜 풀', 'Inference Warm Pool'],
    ['model-loading-latency', '모델 로딩 지연 시간', 'Model-loading Latency'],
    ['adapter-serving', '어댑터 서빙', 'Adapter Serving'],
    ['multi-lora-serving', '멀티 LoRA 서빙', 'Multi-LoRA Serving'],
    ['inference-energy-efficiency', '추론 에너지 효율', 'Inference Energy Efficiency'],
    ['inference-carbon-accounting', '추론 탄소 회계', 'Inference Carbon Accounting'],
    ['inference-slo-error-budget', '추론 SLO 오류 예산', 'Inference SLO Error Budget'],
    ['inference-tail-latency-debugging', '추론 꼬리 지연 디버깅', 'Inference Tail-latency Debugging'],
    ['inference-capacity-headroom', '추론 용량 여유분', 'Inference Capacity Headroom']
  ],
  safety: [
    ['ai-attack-surface-map', 'AI 공격 표면 지도', 'AI Attack Surface Map'],
    ['model-abuse-case-library', '모델 악용 사례 라이브러리', 'Model Abuse Case Library'],
    ['guardrail-coverage-matrix', '가드레일 커버리지 행렬', 'Guardrail Coverage Matrix'],
    ['ai-red-team-retest', 'AI 레드팀 재시험', 'AI Red-team Retest'],
    ['model-security-disclosure', '모델 보안 취약점 공개', 'Model Security Disclosure'],
    ['ai-security-control-baseline', 'AI 보안 통제 기준선', 'AI Security Control Baseline'],
    ['model-supply-chain-security', '모델 공급망 보안', 'Model Supply-chain Security'],
    ['model-artifact-signing', '모델 아티팩트 서명', 'Model Artifact Signing'],
    ['model-weight-access-control', '모델 가중치 접근 제어', 'Model-weight Access Control'],
    ['prompt-injection-defense-in-depth', '프롬프트 주입 다계층 방어', 'Prompt-injection Defense in Depth'],
    ['tool-output-sanitization', '도구 출력 정화', 'Tool-output Sanitization'],
    ['retrieval-content-trust', '검색 콘텐츠 신뢰', 'Retrieval Content Trust'],
    ['agent-least-privilege', '에이전트 최소 권한', 'Agent Least Privilege'],
    ['ai-abuse-monitoring', 'AI 악용 모니터링', 'AI Abuse Monitoring'],
    ['ai-anomaly-triage', 'AI 이상 현상 분류', 'AI Anomaly Triage'],
    ['ai-kill-switch', 'AI 긴급 정지 장치', 'AI Kill Switch'],
    ['model-rollback-safety', '모델 롤백 안전성', 'Model Rollback Safety'],
    ['safety-policy-versioning', '안전 정책 버전 관리', 'Safety-policy Versioning'],
    ['safety-exception-process', '안전 예외 처리 절차', 'Safety Exception Process'],
    ['safety-case', '안전성 논증서', 'Safety Case'],
    ['safety-assurance-argument', '안전 보증 논증', 'Safety Assurance Argument'],
    ['red-team-scenario-coverage', '레드팀 시나리오 커버리지', 'Red-team Scenario Coverage'],
    ['red-team-evidence-log', '레드팀 근거 로그', 'Red-team Evidence Log'],
    ['red-team-finding-severity', '레드팀 발견 심각도', 'Red-team Finding Severity'],
    ['red-team-remediation-verification', '레드팀 조치 검증', 'Red-team Remediation Verification']
  ],
  retrieval: [
    ['rag-index-freshness', 'RAG 색인 신선도', 'RAG Index Freshness'],
    ['retrieval-access-control', '검색 접근 제어', 'Retrieval Access Control'],
    ['citation-grounding-contract', '인용 근거 계약', 'Citation Grounding Contract'],
    ['rag-evidence-lineage', 'RAG 근거 계보', 'RAG Evidence Lineage'],
    ['retrieval-capacity-planning', '검색 용량 계획', 'Retrieval Capacity Planning'],
    ['hybrid-retrieval-weighting', '하이브리드 검색 가중치', 'Hybrid-retrieval Weighting'],
    ['reranker-budgeting', '리랭커 예산 관리', 'Reranker Budgeting'],
    ['query-routing-for-retrieval', '검색 질의 라우팅', 'Query Routing for Retrieval'],
    ['retrieval-fallback', '검색 대체 전략', 'Retrieval Fallback'],
    ['retrieval-deduplication', '검색 결과 중복 제거', 'Retrieval Deduplication'],
    ['retrieval-result-diversity', '검색 결과 다양성', 'Retrieval-result Diversity'],
    ['retrieval-provenance', '검색 결과 출처', 'Retrieval Provenance'],
    ['retrieval-cache-invalidation', '검색 캐시 무효화', 'Retrieval Cache Invalidation'],
    ['retrieval-index-migration', '검색 색인 마이그레이션', 'Retrieval Index Migration'],
    ['retrieval-quality-slo', '검색 품질 SLO', 'Retrieval Quality SLO']
  ],
  training: [
    ['preference-data-governance', '선호 데이터 거버넌스', 'Preference Data Governance'],
    ['reward-model-calibration', '보상 모델 교정', 'Reward Model Calibration'],
    ['post-training-ablation', '사후학습 제거 실험', 'Post-training Ablation'],
    ['alignment-capability-retention', '정렬 역량 보존', 'Alignment Capability Retention'],
    ['preference-shift-monitoring', '선호 변화 관측', 'Preference Shift Monitoring'],
    ['sft-data-mixture', 'SFT 데이터 혼합', 'SFT Data Mixture'],
    ['preference-pair-quality', '선호 쌍 품질', 'Preference-pair Quality'],
    ['reward-model-drift', '보상 모델 드리프트', 'Reward-model Drift'],
    ['reward-model-ensemble', '보상 모델 앙상블', 'Reward-model Ensemble'],
    ['dpo-beta-selection', 'DPO 베타 선택', 'DPO Beta Selection'],
    ['post-training-checkpoint-selection', '사후학습 체크포인트 선택', 'Post-training Checkpoint Selection'],
    ['post-training-data-decontamination', '사후학습 데이터 오염 제거', 'Post-training Data Decontamination'],
    ['alignment-evaluation-gate', '정렬 평가 게이트', 'Alignment Evaluation Gate'],
    ['post-training-reproducibility', '사후학습 재현성', 'Post-training Reproducibility'],
    ['post-training-lineage', '사후학습 계보', 'Post-training Lineage']
  ]
};

const expectedDistribution = { llm: 40, evaluation: 30, api: 25, agents: 25, inference: 25, safety: 25, retrieval: 15, training: 15 };
const anchors = {
  llm: ['prompt-engineering', 'multimodal-model'],
  evaluation: ['evaluation', 'benchmark'],
  api: ['api-endpoint', 'api-versioning'],
  agents: ['ai-agent', 'agent-runtime'],
  inference: ['inference', 'model-serving'],
  safety: ['ai-safety', 'ai-threat-modeling'],
  retrieval: ['rag', 'document-retrieval'],
  training: ['fine-tuning', 'rlhf']
};
const fallbackSources = {
  llm: [
    ['Attention Is All You Need', 'https://arxiv.org/abs/1706.03762', 'paper'],
    ['Language Models are Few-Shot Learners', 'https://arxiv.org/abs/2005.14165', 'paper'],
    ['Transformers documentation', 'https://huggingface.co/docs/transformers/', 'documentation']
  ],
  evaluation: [
    ['Holistic Evaluation of Language Models', 'https://arxiv.org/abs/2211.09110', 'paper'],
    ['NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework', 'standard'],
    ['BIG-bench', 'https://arxiv.org/abs/2206.04615', 'paper']
  ],
  api: [
    ['HTTP Semantics RFC 9110', 'https://www.rfc-editor.org/rfc/rfc9110', 'standard'],
    ['OpenAPI Specification', 'https://spec.openapis.org/oas/latest.html', 'standard'],
    ['OWASP API Security Top 10', 'https://owasp.org/API-Security/', 'standard']
  ],
  agents: [
    ['ReAct', 'https://arxiv.org/abs/2210.03629', 'paper'],
    ['Toolformer', 'https://arxiv.org/abs/2302.04761', 'paper'],
    ['Model Context Protocol specification', 'https://modelcontextprotocol.io/specification/', 'standard']
  ],
  inference: [
    ['vLLM', 'https://arxiv.org/abs/2309.06180', 'paper'],
    ['FlashAttention', 'https://arxiv.org/abs/2205.14135', 'paper'],
    ['Triton Inference Server documentation', 'https://docs.nvidia.com/deeplearning/triton-inference-server/', 'documentation']
  ],
  safety: [
    ['NIST AI Risk Management Framework', 'https://www.nist.gov/itl/ai-risk-management-framework', 'standard'],
    ['OWASP Top 10 for LLM Applications', 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', 'standard'],
    ['MITRE ATLAS', 'https://atlas.mitre.org/', 'standard']
  ],
  retrieval: [
    ['Retrieval-Augmented Generation', 'https://arxiv.org/abs/2005.11401', 'paper'],
    ['BEIR', 'https://arxiv.org/abs/2104.08663', 'paper'],
    ['FAISS documentation', 'https://faiss.ai/', 'documentation']
  ],
  training: [
    ['Training language models to follow instructions with human feedback', 'https://arxiv.org/abs/2203.02155', 'paper'],
    ['Direct Preference Optimization', 'https://arxiv.org/abs/2305.18290', 'paper'],
    ['PEFT documentation', 'https://huggingface.co/docs/peft/', 'documentation']
  ]
};

const articleIds = new Set(fs.readdirSync(articleDir).filter((name) => name.endsWith('.article.json')).map((name) => name.replace('.article.json', '')));
const readArticle = (id) => JSON.parse(fs.readFileSync(path.join(articleDir, `${id}.article.json`), 'utf8'));
const normalizeType = (type = '') => {
  if (['paper', 'standard', 'documentation', 'encyclopedia', 'report'].includes(type)) return type;
  if (/paper|journal|proceeding/i.test(type)) return 'paper';
  if (/doc/i.test(type)) return 'documentation';
  return 'report';
};

const courseCandidateMap = new Map();
for (const file of fs.readdirSync(path.join(root, 'content-model', 'course-plans')).filter((name) => name.endsWith('.course-plan.json'))) {
  const plan = JSON.parse(fs.readFileSync(path.join(root, 'content-model', 'course-plans', file), 'utf8'));
  for (const step of plan.phases.flatMap((phase) => phase.steps).filter((step) => step.refType === 'planned')) {
    courseCandidateMap.set(step.candidateId, plan.id);
  }
}

const candidates = [];
const sourcePacks = [];
let order = 1;
for (const [category, topics] of Object.entries(categories)) {
  if (topics.length !== expectedDistribution[category]) throw new Error(`${category}: expected ${expectedDistribution[category]}, got ${topics.length}`);
  for (const [id, ko, en] of topics) {
    const relatedExistingArticleIds = anchors[category];
    const candidate = {
      id,
      order: order++,
      title: { ko, en },
      category,
      priority: courseCandidateMap.has(id) ? 'course-blocking' : 'expansion',
      courseIds: courseCandidateMap.has(id) ? [courseCandidateMap.get(id)] : [],
      relatedExistingArticleIds,
      scope: `${ko}의 정의, 구성 요소, 의사결정 기준, 실패 모드와 운영 검증 범위를 다룬다.`,
      exclusion: '특정 공급자의 현재 제품 메뉴얼만을 요약하거나 검증하지 않은 성능 수치를 일반화하지 않는다.',
      researchQuestions: [
        `${ko}를 인접 개념과 구분하는 필수 조건은 무엇인가?`,
        `${ko}의 성공과 실패를 관측할 지표와 판단 기준은 무엇인가?`,
        `${ko}를 프로덕션에 적용할 때의 트레이드오프와 안전장치는 무엇인가?`
      ],
      sourcePackId: `w42-${id}`,
      status: 'research-queued'
    };
    const collected = [];
    for (const articleId of relatedExistingArticleIds) {
      if (!articleIds.has(articleId)) throw new Error(`${id}: missing anchor ${articleId}`);
      for (const source of readArticle(articleId).sources || []) {
        if (source.url && !collected.some((item) => item.url === source.url)) {
          collected.push({ title: source.title, url: source.url, type: normalizeType(source.type), inheritedFrom: articleId });
        }
      }
    }
    for (const [title, url, type] of fallbackSources[category]) {
      if (!collected.some((item) => item.url === url)) collected.push({ title, url, type, inheritedFrom: null });
    }
    const primary = collected.filter((item) => ['paper', 'standard', 'documentation'].includes(item.type));
    const remainder = collected.filter((item) => !primary.includes(item));
    const seedSources = [...primary, ...remainder].slice(0, 4);
    sourcePacks.push({
      id: candidate.sourcePackId,
      candidateId: id,
      status: 'seeded-unverified',
      requiredSourceTypes: ['primary', 'independent-secondary', 'terminology-cross-check'],
      searchQueries: [`${en} paper standard implementation`, `${ko} 정의 평가 운영 사례`],
      seedSources,
      evidenceRequirements: [
        '정의와 작동 원리를 받침하는 1차 자료를 1건 이상 확보한다.',
        '현장 운영 제약과 실패 모드를 독립 자료로 교차 검증한다.',
        '용어와 범위는 표준·문서·백과 중 하나로 대조한다.'
      ],
      lastChecked: null
    });
    candidates.push(candidate);
  }
}

const queue = {
  schemaVersion: '2.0',
  version: 'W42-2026-07-16',
  generatedAt: '2026-07-16T00:00:00.000Z',
  publicationPolicy: { directPublicationAllowed: false, requiredStages: ['research-queued', 'source-verified', 'claim-reviewed', 'editorial-reviewed', 'published'] },
  totals: { candidates: candidates.length, courseBlocking: candidates.filter((item) => item.priority === 'course-blocking').length, categories: Object.keys(categories).length },
  distribution: expectedDistribution,
  candidates
};
const packs = { schemaVersion: '2.0', version: queue.version, totals: { packs: sourcePacks.length, seedSources: sourcePacks.reduce((sum, pack) => sum + pack.seedSources.length, 0) }, packs: sourcePacks };

fs.mkdirSync(researchDir, { recursive: true });
fs.writeFileSync(path.join(researchDir, 'w42-topic-candidates.json'), `${JSON.stringify(queue, null, 2)}\n`);
fs.writeFileSync(path.join(researchDir, 'w42-source-packs.json'), `${JSON.stringify(packs, null, 2)}\n`);
console.log(`W42 research queue: ${candidates.length} candidates and ${packs.totals.seedSources} source seeds written`);

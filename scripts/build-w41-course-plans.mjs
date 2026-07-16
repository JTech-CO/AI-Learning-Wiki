import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'content-model', 'articles');
const outputDir = path.join(root, 'content-model', 'course-plans');

const definitions = [
  {
    id: 'prompt-systems',
    order: 8,
    title: { ko: '프롬프트 시스템 설계', en: 'Prompt Systems Engineering' },
    audience: '프롬프트를 반복 가능한 제품 품질 관리 단위로 다루려는 기획자와 개발자',
    prerequisites: ['ai-intro', 'ai-work'],
    outcomes: ['지시 계층과 입출력 계약을 설계한다.', '구조화 출력과 복구 전략을 구현한다.', '프롬프트 평가·버전·배포 절차를 정의한다.', '콘텍스트 비용과 품질을 함께 최적화한다.'],
    existing: ['prompt', 'prompt-engineering', 'system-prompt', 'user-prompt', 'prompt-template', 'prompt-delimiter', 'role-prompting', 'zero-shot-prompting', 'few-shot-prompting', 'chain-of-thought-prompting', 'context-engineering', 'context-window', 'structured-output', 'json-schema', 'schema-validation', 'prompt-chaining', 'prompt-caching', 'prompt-compression', 'automatic-prompt-optimization'],
    planned: [
      ['prompt-contract-testing', '프롬프트 계약 테스트', 'Prompt Contract Testing'],
      ['instruction-priority-architecture', '지시 우선순위 아키텍처', 'Instruction Priority Architecture'],
      ['prompt-release-governance', '프롬프트 릴리스 거버넌스', 'Prompt Release Governance'],
      ['structured-output-recovery', '구조화 출력 복구', 'Structured Output Recovery'],
      ['prompt-portfolio-observability', '프롬프트 포트폴리오 관측성', 'Prompt Portfolio Observability']
    ]
  },
  {
    id: 'llm-evaluation', order: 9,
    title: { ko: 'LLM 평가와 관측성', en: 'LLM Evaluation and Observability' },
    audience: '모델과 LLM 기반 시스템의 품질 기준과 배포 게이트를 설계하는 평가 담당자',
    prerequisites: ['ai-engineer'],
    outcomes: ['평가 목적에 맞는 지표와 벤치마크를 선택한다.', '사람·모델 평가의 편향과 불확실성을 계량화한다.', '오프라인과 프로덕션 평가를 연결한다.', '회귀 탐지와 릴리스 판정 규칙을 운영한다.'],
    existing: ['evaluation', 'metric', 'benchmark', 'benchmark-dataset', 'benchmark-suite', 'benchmark-validity', 'benchmark-contamination', 'evaluation-rubric', 'evaluation-sampling', 'evaluation-uncertainty', 'reference-based-evaluation', 'reference-free-evaluation', 'human-evaluation', 'expert-evaluation', 'judge-meta-evaluation', 'generation-evaluation', 'production-evaluation', 'regression-evaluation', 'observability'],
    planned: [
      ['llm-evaluation-contract', 'LLM 평가 계약', 'LLM Evaluation Contract'],
      ['judge-calibration-curve', '판정 모델 교정 곡선', 'Judge Calibration Curve'],
      ['evaluation-budget-allocation', '평가 예산 배분', 'Evaluation Budget Allocation'],
      ['slice-based-release-gate', '슬라이스 기반 릴리스 게이트', 'Slice-based Release Gate'],
      ['online-evaluation-drift', '온라인 평가 드리프트', 'Online Evaluation Drift']
    ]
  },
  {
    id: 'llmops-production', order: 10,
    title: { ko: 'LLMOps와 프로덕션 서빙', en: 'LLMOps and Production Serving' },
    audience: '지연 시간·처리량·비용·안정성을 함께 책임지는 LLM 플랫폼 엔지니어',
    prerequisites: ['ai-engineer', 'automation'],
    outcomes: ['서빙 워크로드의 용량과 SLO를 산정한다.', '캐시·배칭·양자화로 비용과 성능을 조율한다.', '오류·타임아웃·오토스케일 정책을 설계한다.', '관측 지표를 배포 판단과 장애 대응에 연결한다.'],
    existing: ['inference', 'model-serving', 'model-serving-platform', 'inference-server', 'online-inference', 'batch-inference', 'inference-endpoint', 'throughput', 'latency', 'inter-token-latency', 'tail-latency', 'latency-throughput-tradeoff', 'kv-cache', 'paged-kv-cache', 'prompt-caching', 'inference-load-balancing', 'inference-autoscaling', 'inference-capacity-planning', 'inference-monitoring'],
    planned: [
      ['llm-serving-slo', 'LLM 서빙 SLO', 'LLM Serving SLO'],
      ['token-budget-admission-control', '토큰 예산 수용 제어', 'Token-budget Admission Control'],
      ['continuous-batching-policy', '연속 배칭 정책', 'Continuous Batching Policy'],
      ['model-fleet-routing', '모델 플릿 라우팅', 'Model Fleet Routing'],
      ['llm-cost-attribution', 'LLM 비용 귀속', 'LLM Cost Attribution']
    ]
  },
  {
    id: 'advanced-rag', order: 11,
    title: { ko: '고급 RAG와 지식 시스템', en: 'Advanced RAG and Knowledge Systems' },
    audience: '검색 품질과 근거 추적성이 중요한 지식 서비스를 설계하는 개발자',
    prerequisites: ['ai-engineer'],
    outcomes: ['질문과 콘텐츠에 맞는 검색 아키텍처를 선택한다.', '색인·청크·리랭킹 전략을 조율한다.', '검색과 생성 실패를 분리해 평가한다.', '인용·갱신·권한 정책을 포함한 운영 계획을 세운다.'],
    existing: ['rag', 'document-retrieval', 'lexical-retrieval', 'dense-retrieval', 'hybrid-rag', 'embedding-model', 'document-embedding', 'query-embedding', 'vector-index', 'retrieval-filtering', 'reranker', 'cross-encoder-reranker', 'adaptive-retrieval', 'multi-hop-rag', 'iterative-rag', 'corrective-rag', 'graph-rag', 'context-compression-for-rag', 'rag-evaluation'],
    planned: [
      ['rag-index-freshness', 'RAG 색인 신선도', 'RAG Index Freshness'],
      ['retrieval-access-control', '검색 접근 제어', 'Retrieval Access Control'],
      ['citation-grounding-contract', '인용 근거 계약', 'Citation Grounding Contract'],
      ['rag-evidence-lineage', 'RAG 근거 계보', 'RAG Evidence Lineage'],
      ['retrieval-capacity-planning', '검색 용량 계획', 'Retrieval Capacity Planning']
    ]
  },
  {
    id: 'production-agents', order: 12,
    title: { ko: '프로덕션 AI 에이전트', en: 'Production AI Agents' },
    audience: '도구 호출과 상태 변경을 안전하게 운영하는 에이전트 시스템 개발자',
    prerequisites: ['ai-engineer', 'automation'],
    outcomes: ['계획·실행·반성 루프의 종료 조건을 정의한다.', '도구 스키마와 권한 경계를 설계한다.', '메모리와 핸드오프의 일관성을 관리한다.', '궤적·실패·안전성을 평가하고 장애에 대응한다.'],
    existing: ['ai-agent', 'agent-loop', 'agent-goal', 'agent-task-decomposition', 'agent-deliberation', 'agent-plan-quality', 'agent-executor', 'agent-tool', 'agent-tool-accuracy', 'agent-runtime', 'agent-memory', 'episodic-agent-memory', 'long-term-agent-memory', 'agent-reflection', 'agent-self-correction', 'agent-replanning', 'agent-termination-condition', 'agent-sandbox', 'agent-evaluation'],
    planned: [
      ['agent-idempotency', '에이전트 멱등성', 'Agent Idempotency'],
      ['agent-action-ledger', '에이전트 행동 원장', 'Agent Action Ledger'],
      ['tool-permission-broker', '도구 권한 브로커', 'Tool Permission Broker'],
      ['agent-compensation-transaction', '에이전트 보상 트랜잭션', 'Agent Compensation Transaction'],
      ['agent-incident-playbook', '에이전트 사고 대응 절차', 'Agent Incident Playbook']
    ]
  },
  {
    id: 'post-training-alignment', order: 13,
    title: { ko: '사후학습과 정렬 심화', en: 'Post-training and Alignment' },
    audience: '지시 순응·선호 최적화·안전 정렬을 설계하는 모델 개발자와 연구자',
    prerequisites: ['ai-engineer'],
    outcomes: ['SFT와 선호 학습 데이터 파이프라인을 설계한다.', 'RLHF·DPO·RLAIF의 목표와 제약을 비교한다.', '보상 모델과 정책 최적화의 실패를 탐지한다.', '정렬 품질과 역량 보존을 함께 평가한다.'],
    existing: ['fine-tuning', 'supervised-fine-tuning', 'instruction-tuning', 'preference-data', 'pairwise-preference-ranking', 'reward-model', 'outcome-reward-model', 'process-reward-model', 'rlhf', 'reinforcement-learning-from-ai-feedback', 'dpo', 'offline-preference-learning', 'online-preference-learning', 'preference-loss', 'proximal-policy-optimization-for-llm', 'rejection-sampling', 'constitutional-ai', 'reward-hacking', 'alignment'],
    planned: [
      ['preference-data-governance', '선호 데이터 거버넌스', 'Preference Data Governance'],
      ['reward-model-calibration', '보상 모델 교정', 'Reward Model Calibration'],
      ['post-training-ablation', '사후학습 제거 실험', 'Post-training Ablation'],
      ['alignment-capability-retention', '정렬 역량 보존', 'Alignment Capability Retention'],
      ['preference-shift-monitoring', '선호 변화 관측', 'Preference Shift Monitoring']
    ]
  },
  {
    id: 'ai-security-redteam', order: 14,
    title: { ko: 'AI 보안과 레드팀', en: 'AI Security and Red Teaming' },
    audience: '모델·데이터·도구·운영 계층의 위협을 검증하는 보안과 안전 담당자',
    prerequisites: ['ai-engineer'],
    outcomes: ['AI 시스템의 자산과 신뢰 경계를 식별한다.', '프롬프트 주입·제일브레이크·데이터 공격을 시험한다.', '가드레일과 권한 제어의 잔여 위험을 측정한다.', '사고 기록·보고·복구 절차를 운영한다.'],
    existing: ['ai-safety', 'ai-threat-modeling', 'ai-risk-assessment', 'ai-risk-register', 'ai-red-teaming', 'adversarial-testing', 'adversarial-example', 'prompt-injection', 'indirect-prompt-injection', 'jailbreak', 'agent-security', 'guardrail', 'agent-guardrail', 'ai-security-monitoring', 'privacy-attack', 'privacy-audit', 'ai-misuse', 'ai-incident-response', 'ai-incident-reporting'],
    planned: [
      ['ai-attack-surface-map', 'AI 공격 표면 지도', 'AI Attack Surface Map'],
      ['model-abuse-case-library', '모델 악용 사례 라이브러리', 'Model Abuse Case Library'],
      ['guardrail-coverage-matrix', '가드레일 커버리지 행렬', 'Guardrail Coverage Matrix'],
      ['ai-red-team-retest', 'AI 레드팀 재시험', 'AI Red-team Retest'],
      ['model-security-disclosure', '모델 보안 취약점 공개', 'Model Security Disclosure']
    ]
  },
  {
    id: 'multimodal-systems', order: 15,
    title: { ko: '멀티모달 AI 시스템', en: 'Multimodal AI Systems' },
    audience: '텍스트·이미지·음성·영상을 결합한 제품을 설계하는 개발자와 기획자',
    prerequisites: ['ai-engineer'],
    outcomes: ['모달리티별 토큰화와 표현 방식을 비교한다.', '공동 임베딩과 퓨전 구조를 선택한다.', '지연·비용·품질 제약에 맞는 파이프라인을 설계한다.', '모달리티별 평가와 안전 검증을 수행한다.'],
    existing: ['multimodal-model', 'multimodal-language-model', 'multimodal-transformer', 'multimodal-tokenizer', 'interleaved-multimodal-data', 'joint-embedding-space', 'multimodal-embedding', 'cross-modal-alignment', 'cross-modal-attention', 'multimodal-fusion', 'multimodal-instruction-tuning', 'vision-language-model', 'image-embedding', 'audio-model', 'speech-language-model', 'speech-recognition', 'video-understanding', 'multimodal-evaluation', 'multimodal-jailbreak'],
    planned: [
      ['multimodal-input-contract', '멀티모달 입력 계약', 'Multimodal Input Contract'],
      ['modality-fallback-policy', '모달리티 대체 정책', 'Modality Fallback Policy'],
      ['cross-modal-latency-budget', '교차 모달 지연 예산', 'Cross-modal Latency Budget'],
      ['multimodal-safety-evaluation', '멀티모달 안전 평가', 'Multimodal Safety Evaluation'],
      ['media-provenance-pipeline', '미디어 출처 파이프라인', 'Media Provenance Pipeline']
    ]
  }
];

const phaseTitles = [
  { ko: '기반 개념과 설계 경계', en: 'Foundations and design boundaries' },
  { ko: '핵심 구성 요소와 선택', en: 'Core components and choices' },
  { ko: '평가와 최적화', en: 'Evaluation and optimization' },
  { ko: '프로덕션 운영과 통제', en: 'Production operations and controls' }
];

const readArticle = (id) => {
  const file = path.join(articleDir, `${id}.article.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing W41 article: ${id}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

fs.mkdirSync(outputDir, { recursive: true });
for (const entry of fs.readdirSync(outputDir)) {
  if (entry.endsWith('.course-plan.json')) fs.rmSync(path.join(outputDir, entry));
}

for (const definition of definitions) {
  const topics = [
    ...definition.existing.map((articleId) => {
      const article = readArticle(articleId);
      return { refType: 'existing', articleId, title: { ko: article.title, en: article.englishTitle || article.title } };
    }),
    ...definition.planned.map(([candidateId, ko, en]) => ({ refType: 'planned', candidateId, title: { ko, en } }))
  ];
  const phases = phaseTitles.map((title, phaseIndex) => ({
    id: `phase-${phaseIndex + 1}`,
    order: phaseIndex + 1,
    title,
    steps: topics.slice(phaseIndex * 6, phaseIndex * 6 + 6).map((topic, stepIndex) => ({
      order: phaseIndex * 6 + stepIndex + 1,
      ...topic,
      rationale: topic.refType === 'existing'
        ? `${topic.title.ko} 문서로 개념과 프로덕션 판단 근거를 연결한다.`
        : `${topic.title.ko} 백과 후보를 확충해 현장 운영 단계의 공백을 메운다.`
    }))
  }));
  const plan = {
    schemaVersion: '2.0',
    id: definition.id,
    order: definition.order,
    title: definition.title,
    level: 'professional',
    status: 'planned',
    deliveryModel: 'ordered-wiki-path',
    audience: definition.audience,
    estimatedHours: 18,
    prerequisites: definition.prerequisites,
    learningOutcomes: definition.outcomes,
    phases,
    completion: { requiredSteps: 24, assessment: '각 문서의 핵심 판단 기준을 실제 시스템 설계안에 적용한다.' },
    publicationGate: { articleCandidatesReady: false, editorialReviewRequired: true, activateAfter: 'W50' }
  };
  fs.writeFileSync(path.join(outputDir, `${definition.id}.course-plan.json`), `${JSON.stringify(plan, null, 2)}\n`);
}

console.log(`W41 course plans: ${definitions.length} professional ordered-wiki paths written`);

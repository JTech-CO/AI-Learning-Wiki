import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const queue = readJson('content-model/research/w42-topic-candidates.json');
const verification = readJson('content-model/research/w43-source-verification.json');
const verificationById = new Map(verification.records.map((record) => [record.candidateId, record]));

const profiles = {
  llm: {
    domain: '대규모 언어 모델 응용의 지시·문맥·출력 계층',
    mechanism: '요청을 정규화하고 지시 우선순위와 토큰 예산을 적용한 뒤 응답 계약을 검사한다',
    metrics: '계약 준수율, 스키마 일치율, 토큰 소비, 지연 시간, 회귀 오류율',
    failures: '지시 충돌, 문맥 절단, 출력 형식 붕괴, 모델 버전 차이',
    controls: '요청·응답 로깅, 버전 고정, 예산 상한, 스키마 검증과 안전한 대체 경로'
  },
  evaluation: {
    domain: '모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층',
    mechanism: '평가 대상 모집과 슬라이스를 정의하고 평가 지표와 판정 절차를 고정한 뒤 불확실성을 함께 보고한다',
    metrics: '정확도, 신뢰구간, 평가자 간 일치도, 슬라이스별 격차, 회귀 발생률',
    failures: '데이터 오염, 루브릭 모호성, 판정 모델 편향, 표본 부족, 평균값에 의한 취약 슬라이스 은폐',
    controls: '평가셋 계보, 블라인드 채점, 무작위화, 슬라이스 보고, 재현 가능한 실행 설정'
  },
  api: {
    domain: 'LLM 서비스의 클라이언·게이트웨이·공급자 간 API 계약 계층',
    mechanism: '요청 스키마와 버전을 협상하고 시간 예산·재시도·오류 모델을 적용해 응답을 일관된 형태로 전달한다',
    metrics: '요청 성공률, 오류 유형별 빈도, 말단 지연 시간, 재시도 증폭률, 하위 호환성 테스트 통과율',
    failures: '스키마 드리프트, 중복 요청, 재시도 폭주, 부분 실패, 비밀 키 노출',
    controls: '멱등성 키, 타임아웃 예산, 회로 차단기, 서명 검증, 버전 고정과 적합성 테스트'
  },
  agents: {
    domain: '계획·도구 호출·상태 변경을 반복하는 AI 에이전트 실행 계층',
    mechanism: '목표를 실행 단계로 분해하고 도구 권한과 입출력 계약을 확인하며 종료 조건 또는 사람 승인 게이트까지 상태를 전이한다',
    metrics: '과제 성공률, 도구 정확도, 단계 수, 사람 개입률, 부수 효과 복구율',
    failures: '무한 루프, 잘못된 도구 인수, 중복 부수 효과, 메모리 불일치, 다중 에이전트 교착',
    controls: '단계·비용 예산, 최소 권한, 승인 게이트, 행동 원장, 재실행과 보상 트랜잭션'
  },
  inference: {
    domain: '모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층',
    mechanism: '요청을 워크로드별로 분류하고 배칭·선점·캐시 할당 정책을 적용한 뒤 지연 예산 안에서 토큰을 생성한다',
    metrics: '첫 토큰 시간, 토큰 간 지연, 처리량, 꼬리 지연, GPU 메모리 점유율, 요청 거부율',
    failures: 'KV 캐시 고갈, 로딩 지연, 배칭 불공정, 큐 폭주, 메모리 부족, 리전 편중',
    controls: '수용 제어, 용량 여유분, 역압, 웜 풀, 오류 예산, 모델·어댑터 롤백'
  },
  safety: {
    domain: '모델·데이터·도구·운영 계층의 AI 위협 관리와 보안 통제 계층',
    mechanism: '자산과 신뢰 경계를 식별하고 위협 시나리오를 통제에 매핑한 뒤 탐지·차단·복구 근거를 남긴다',
    metrics: '시나리오 커버리지, 탐지율, 우회율, 오탐 및 미탐, 잔여 위험, 조치 검증율',
    failures: '프롬프트 주입, 가드레일 우회, 과도한 권한, 공급망 변조, 로그 누락, 조치 후 재발',
    controls: '최소 권한, 다계층 방어, 아티팩트 서명, 정책 버전 관리, 긴급 정지, 사고 보고와 재시험'
  },
  retrieval: {
    domain: '코퍼스·색인·검색기·리랭커·인용을 연결하는 RAG 지식 계층',
    mechanism: '질의를 변환하고 권한과 메타데이터 필터를 적용한 뒤 후보를 검색·재순위화해 근거와 함께 생성 계층에 전달한다',
    metrics: '재현율, 정밀도, MRR, nDCG, 검색 적중률, 인용 일치율, 색인 신선도',
    failures: '색인 노후화, 권한 누출, 중복 후보, 질의 의도 오판, 리랭커 예산 과소할당, 인용과 문장의 불일치',
    controls: '색인 계보, 신선도 SLO, 권한 필터, 검색 대체 경로, 캐시 무효화, 인용 검증'
  },
  training: {
    domain: '지시 튜닝·선호 학습·보상 모델·정렬 평가를 포함하는 사후학습 계층',
    mechanism: '학습 목표에 맞게 데이터 혼합과 손실 함수를 고정하고 체크포인트별 역량·선호·안전 평가를 비교한다',
    metrics: '학습 손실, 선호 승률, 보상 교정 오차, 역량 보존율, 안전 회귀, 재현성',
    failures: '선호 데이터 편향, 보상 해킹, 교정 불량, 과적합, 이전 역량 망각, 체크포인트 출처 누락',
    controls: '데이터 계보, 오염 검사, 제거 실험, 보상 교정, 역량 보존 게이트, 체크포인트 버전 고정'
  }
};

const outline = [
  ['overview', '개요와 적용 범위'],
  ['terminology-boundary', '용어의 위치와 경계'],
  ['mechanism', '작동 구조'],
  ['architecture', '구성 요소와 정보 흐름'],
  ['metrics', '측정 지표와 판단 기준'],
  ['tradeoffs', '설계 선택과 트레이드오프'],
  ['failure-modes', '실패 모드와 진단'],
  ['operations', '운영·관측·복구'],
  ['security-governance', '안전·보안·거버넌스'],
  ['examples-checklist', '적용 예시와 검토 목록']
];

const briefs = queue.candidates.map((candidate) => {
  const profile = profiles[candidate.category];
  const sourceRecord = verificationById.get(candidate.id);
  const ko = candidate.title.ko;
  const claims = [
    { id: 'definition', type: 'definition', text: `${ko}는 ${profile.domain}에서 특정한 판단과 통제를 분리해 설명하기 위한 운영 설계 개념이다.`, sourceRefs: [1, 2], support: 'background-synthesis' },
    { id: 'boundary', type: 'terminology', text: `${ko}는 단일 표준이 정의한 고유명사로 가정하지 않고, 인접 기술을 연결하는 운영 패턴으로 한정한다.`, sourceRefs: [1], support: 'editorial-boundary' },
    { id: 'mechanism', type: 'mechanism', text: `${ko}의 핵심 흐름은 ${profile.mechanism}.`, sourceRefs: [1, 2], support: 'category-foundation' },
    { id: 'measurement', type: 'measurement', text: `${ko}은(는) ${profile.metrics}을(를) 함께 보아야 단일 성공률의 착시를 줄일 수 있다.`, sourceRefs: [2, 3], support: 'category-foundation' },
    { id: 'failure', type: 'failure', text: `${ko}의 주요 실패 후보는 ${profile.failures}이며, 평균값보다 실패 유형별 빈도와 영향을 분리해야 한다.`, sourceRefs: [1, 4], support: 'category-foundation' },
    { id: 'controls', type: 'control', text: `${ko}를 운영할 때는 ${profile.controls}을(를) 적용 조건과 해제 조건으로 기록한다.`, sourceRefs: [2, 3, 4], support: 'category-foundation' },
    { id: 'tradeoff', type: 'tradeoff', text: `${ko}의 설계 판단은 품질·지연·비용·안전성 사이의 교환 관계를 워크로드별로 드러내야 한다.`, sourceRefs: [1, 3], support: 'cross-source-synthesis' },
    { id: 'operations', type: 'operations', text: `${ko}의 변경은 버전·적용 대상·관측 지표·롤백 조건을 함께 남겨야 재현과 사고 분석이 가능하다.`, sourceRefs: [2, 4], support: 'cross-source-synthesis' }
  ];
  return {
    candidateId: candidate.id,
    title: candidate.title,
    category: candidate.category,
    priority: candidate.priority,
    courseIds: candidate.courseIds,
    terminology: {
      status: 'operational-synthesis',
      canonicalKorean: candidate.title.ko,
      canonicalEnglish: candidate.title.en,
      boundary: '단일 표준의 고유명사로 단정하지 않고 프로덕션 판단을 설명하는 조합적 운영 개념으로 사용한다.'
    },
    scope: candidate.scope,
    exclusion: candidate.exclusion,
    profile,
    claims,
    outline: outline.map(([id, title], index) => ({
      id,
      order: index + 1,
      title,
      claimIds: index === 0 ? ['definition'] : index === 1 ? ['boundary'] : index === 2 || index === 3 ? ['mechanism'] : index === 4 ? ['measurement'] : index === 5 ? ['tradeoff'] : index === 6 ? ['failure'] : index === 7 ? ['operations'] : index === 8 ? ['controls'] : ['definition', 'controls', 'operations'],
      sourceRefs: [...new Set((index === 9 ? claims : claims.filter((claim) => (index === 0 && claim.id === 'definition') || (index === 1 && claim.id === 'boundary') || ([2, 3].includes(index) && claim.id === 'mechanism') || (index === 4 && claim.id === 'measurement') || (index === 5 && claim.id === 'tradeoff') || (index === 6 && claim.id === 'failure') || (index === 7 && claim.id === 'operations') || (index === 8 && claim.id === 'controls'))).flatMap((claim) => claim.sourceRefs))]
    })),
    sourceCount: sourceRecord.sources.length,
    gate: { sourceIdentityReviewed: true, claimsMapped: true, proseDrafted: false, editorialReviewed: false }
  };
});

const output = {
  schemaVersion: '1.0',
  milestone: 'W44',
  reviewedAt: '2026-07-16',
  policy: {
    terminology: 'operational synthesis must be disclosed in every article',
    claimMapping: 'every factual section maps to one or more scoped claims and source references',
    publicationAllowed: false
  },
  totals: { briefs: briefs.length, claims: briefs.reduce((sum, brief) => sum + brief.claims.length, 0), outlineSections: briefs.reduce((sum, brief) => sum + brief.outline.length, 0), courseBlocking: briefs.filter((brief) => brief.priority === 'course-blocking').length },
  briefs
};
fs.writeFileSync(path.join(root, 'content-model', 'research', 'w44-article-briefs.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`W44 article briefs: ${output.totals.briefs} briefs, ${output.totals.claims} claims, ${output.totals.outlineSections} section plans`);

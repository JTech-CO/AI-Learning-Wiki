import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const briefs = readJson('content-model/research/w44-article-briefs.json');
const verification = readJson('content-model/research/w43-source-verification.json');
const sourceById = new Map(verification.records.map((record) => [record.candidateId, record]));
const outputDir = path.join(root, 'content-model', 'staging', 'w45-articles');
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const hasBatchim = (value) => {
  const hangul = [...String(value)].reverse().find((char) => char.codePointAt(0) >= 0xac00 && char.codePointAt(0) <= 0xd7a3);
  return hangul ? (hangul.codePointAt(0) - 0xac00) % 28 !== 0 : false;
};
const josa = (value, consonant, vowel) => `${value}${hasBatchim(value) ? consonant : vowel}`;
const scenarios = {
  llm: '고객 지원 응답을 JSON 계약으로 제공하면서 모델 버전을 교체하는 상황',
  evaluation: '신규 모델 릴리스가 실제 사용자 슬라이스에서 기존 버전보다 나은지 판정하는 상황',
  api: '두 LLM 공급자 사이를 전환하면서 클라이언트 계약과 재시도 특성을 보존하는 상황',
  agents: '외부 시스템을 변경하는 에이전트가 사람 승인과 재실행을 안전하게 처리해야 하는 상황',
  inference: '피크 트래픽에서 긴 문맥 요청과 짧은 요청이 같은 GPU 풀을 공유하는 상황',
  safety: '프롬프트 주입과 과도한 도구 권한을 포함한 레드팀 시나리오를 재시험하는 상황',
  retrieval: '사내 정책 문서가 갱신되고 사용자별 접근 권한이 다른 RAG 서비스를 운영하는 상황',
  training: '새 선호 데이터를 추가한 사후학습 체크포인트를 기존 역량 손실 없이 선택하는 상황'
};
const volatility = { llm: 'fast-changing', evaluation: 'periodic', api: 'fast-changing', agents: 'fast-changing', inference: 'fast-changing', safety: 'periodic', retrieval: 'periodic', training: 'periodic' };

fs.mkdirSync(outputDir, { recursive: true });
for (const file of fs.readdirSync(outputDir)) if (file.endsWith('.article.json')) fs.rmSync(path.join(outputDir, file));

const categoryGroups = new Map();
for (const brief of briefs.briefs) {
  if (!categoryGroups.has(brief.category)) categoryGroups.set(brief.category, []);
  categoryGroups.get(brief.category).push(brief.candidateId);
}

const manifestItems = [];
for (const brief of briefs.briefs) {
  const title = brief.title.ko;
  const subject = josa(title, '은', '는');
  const object = josa(title, '을', '를');
  const profile = brief.profile;
  const scenario = scenarios[brief.category];
  const peers = categoryGroups.get(brief.category);
  const peerIndex = peers.indexOf(brief.candidateId);
  const relatedCandidates = [peers[(peerIndex + peers.length - 1) % peers.length], peers[(peerIndex + 1) % peers.length]].filter((id) => id !== brief.candidateId);
  const sourceRecord = sourceById.get(brief.candidateId);
  const sources = sourceRecord.sources.map((source) => ({ title: source.title, url: source.url, type: source.type }));
  const sections = [
    {
      id: 'overview', title: '개요와 적용 범위', sourceRefs: [1, 2],
      body: `${subject} ${profile.domain}에서 특정한 판단과 통제를 분리해 설명하기 위한 운영 설계 개념이다. ${brief.scope}\n\n이 개념의 목적은 기술 이름을 하나 더 만드는 데 있지 않다. 실제 시스템에서 어떤 입력과 상태를 관측하고, 어떤 기준으로 변경을 허용하며, 실패했을 때 어떤 경로로 복구할지를 하나의 문서화된 판단 단위로 묶는 것이 핵심이다. 적용 범위는 워크로드, 사용자 위험, 비용 제약을 명시한 경우로 한정한다.`
    },
    {
      id: 'terminology-boundary', title: '용어의 위치와 경계', sourceRefs: [1],
      body: `${subject} 단일 표준이 정의한 고유명사로 단정하지 않는다. 이 문서에서는 인접한 연구·표준·구현 관행을 연결해 프로덕션 의사결정을 설명하는 조합적 운영 개념으로 사용한다. 따라서 제품명이나 특정 공급자의 기능과 동의어가 아니다.\n\n${brief.exclusion} 구현이 다르더라도 입력, 판단 규칙, 관측 결과, 복구 조건을 같은 형식으로 나란히 놓으면 비교가 가능하다. 용어를 사용할 때는 팀 내부의 적용 범위와 버전을 함께 밝혀 의미가 조직마다 달라지는 문제를 줄인다.`
    },
    {
      id: 'mechanism', title: '작동 구조', sourceRefs: [1, 2],
      body: `${object} 구현하는 핵심 흐름은 ${profile.mechanism}. 이 흐름은 입력 정규화, 정책 판정, 실행, 결과 검증, 복구의 다섯 단계로 나누어 보는 것이 유용하다. 각 단계는 받은 값과 내보낸 값, 적용한 정책 버전, 소요 시간을 남겨야 한다.\n\n단순히 성공·실패만 기록하면 어느 경계에서 품질이 무너졌는지 알 수 없다. 중간 상태를 추적하면 정책 오류와 구현 오류, 외부 의존성 장애를 분리할 수 있다. 상태 기록은 민감 데이터를 최소화하고 보유 기간과 접근 권한을 같이 정의한다.`
    },
    {
      id: 'architecture', title: '구성 요소와 정보 흐름', sourceRefs: [1, 2],
      body: `${subject} 입력 계약, 정책 저장소, 실행기, 관측 파이프라인, 복구 제어기로 구성할 수 있다. 입력 계약은 필수 필드와 유효 범위를 고정하고, 정책 저장소는 조건과 우선순위를 버전별로 보관한다. 실행기는 정책을 결과로 변환하며 관측 파이프라인은 실제 결과를 지표와 이벤트로 전환한다.\n\n정보 흐름은 양방향이어야 한다. 제어 계층이 실행 계층에 정책을 내리는 것만으로는 부족하며, 관측 결과가 정책 수정과 자동 중단으로 되돌아와야 한다. 최종 복구 제어기는 롤백, 대체 경로, 사람 승인 중 하나를 선택하고 선택 이유를 남긴다.`
    },
    {
      id: 'metrics', title: '측정 지표와 판단 기준', sourceRefs: [2, 3],
      body: `${object} 평가할 때는 ${profile.metrics}을 함께 본다. 평균값 하나로 결론을 내리지 않고 워크로드, 사용자 군, 요청 크기, 모델 버전 슬라이스로 나눈다. 기준선은 목표, 경고, 중단의 세 단계로 나누고 각 단계의 대응 행동을 미리 결정한다.\n\n측정값에는 표본 수와 관측 기간, 분모의 정의를 함께 기록한다. 지표가 좋아져도 다른 지표의 악화를 감출 수 있으므로 품질, 비용, 지연, 안전성을 같은 릴리스 표에서 비교한다. 최소 표본에 도달하지 못한 결과는 확정 판정이 아니라 보류로 분류한다.`
    },
    {
      id: 'tradeoffs', title: '설계 선택과 트레이드오프', sourceRefs: [1, 3],
      body: `${subject} 품질·지연·비용·안전성 사이의 교환 관계를 드러낸다. 더 강한 검증과 이중화는 실패를 줄이지만 지연과 비용을 늘릴 수 있다. 반대로 빠른 대체 경로는 가용성을 높이지만 품질 일관성과 추적성을 떨어뜨릴 수 있다.\n\n따라서 전체 요청에 하나의 정책을 적용하지 않는다. 사용자 영향, 요청 가치, 실패 후 복구 가능성에 따라 보수적·표준·속도 우선 정책으로 분리한다. 각 정책은 적용 조건, 예산, 허용 오류, 롤백 조건을 포함하고 운영 데이터로 주기적으로 재조정한다.`
    },
    {
      id: 'failure-modes', title: '실패 모드와 진단', sourceRefs: [1, 4],
      body: `${title}에서 우선 검토할 실패 후보는 ${profile.failures}이다. 실패 항목은 증상, 추정 원인, 탐지 신호, 사용자 영향, 임시 조치, 근본 조치로 나눠 기록한다. 이 구조를 사용하면 같은 증상을 만드는 서로 다른 원인을 구분할 수 있다.\n\n진단은 최종 출력에서 역순으로 진행한다. 결과 검증, 실행 기록, 정책 선택, 입력 정규화 순으로 경계를 확인하면 변수를 빠르게 줄일 수 있다. 재현이 어려운 경우에는 실제 민감 데이터를 제거한 최소 재현 입력과 정책 버전을 함께 보존한다.`
    },
    {
      id: 'operations', title: '운영·관측·복구', sourceRefs: [2, 4],
      body: `${object} 변경할 때는 버전, 적용 대상, 관측 지표, 예상 영향, 롤백 조건을 하나의 변경 기록에 남긴다. 배포는 오프라인 재현, 쉐도 실행, 소규모 카나리, 단계적 확대 순으로 진행하고 각 단계에서 중단 기준을 자동 판정할 수 있게 한다.\n\n관측 화면은 성공 지표만 보여주지 않고 거부, 대체 경로, 재시도, 사람 개입, 복구 소요 시간을 함께 보여준다. 복구 절차는 담당자와 권한, 예상 소요 시간, 데이터 영향, 복구 후 검증 항목을 포함해야 한다. 주기적 후속 검토로 임시 조치가 영구 정책으로 남는 것을 방지한다.`
    },
    {
      id: 'security-governance', title: '안전·보안·거버넌스', sourceRefs: [2, 3, 4],
      body: `${object} 운영할 때는 ${profile.controls}을 기본 통제로 검토한다. 통제는 단순히 있는지만 확인하지 않고 어떤 위협을 줄이며, 어떤 잔여 위험이 남고, 실패했을 때 어떤 신호로 알 수 있는지를 연결한다.\n\n민감 데이터와 비밀 값은 로그에 남기지 않고 필요한 시점에 최소 권한으로만 제공한다. 정책 예외는 승인자, 사유, 적용 범위, 만료 시점을 필수로 남겨야 한다. 사고 후에는 탐지부터 복구까지의 시간선과 의사결정 근거를 보존하고, 조치가 실제로 재발을 막았는지 동일 시나리오로 재시험한다.`
    },
    {
      id: 'examples-checklist', title: '적용 예시와 검토 목록', sourceRefs: [1, 2, 3, 4],
      body: `${title}을 적용할 수 있는 대표 상황은 ${scenario}이다. 먼저 기존 흐름을 변경하지 않고 입력·판단·결과·복구 경계의 관측 가능성을 확보한다. 그런 다음 소규모 대상에 정책을 적용하고 기준선을 넘으면 즉시 기존 경로로 되돌린다.\n\n검토 목록은 다음과 같다.\n\n- 용어의 범위와 소유 팀을 문서화했는가?\n- 입력과 출력 계약, 정책 버전을 식별할 수 있는가?\n- 성공, 경고, 중단 기준과 표본 수를 정했는가?\n- 주요 실패 모드별 탐지 신호와 임시 조치가 있는가?\n- 롤백·대체 경로·사람 승인의 시작 조건이 명확한가?\n- 민감 데이터와 비밀 값의 로깅·보유·접근 정책을 검토했는가?\n\n실제 배포 후에는 체크리스트의 통과 여부보다 각 항목에서 발생한 예외와 사람 개입을 기록해 다음 버전의 정책을 개선한다.`
    }
  ];
  const article = {
    id: brief.candidateId,
    title,
    englishTitle: brief.title.en,
    aliases: [brief.title.en],
    summary: `${subject} ${profile.domain}에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.`,
    sections,
    categories: [brief.category],
    prerequisites: brief.priority === 'course-blocking' ? [brief.courseIds.length ? brief.courseIds[0] : brief.candidateId].filter((id) => !id.startsWith(brief.candidateId)) : [],
    related: [...new Set([...briefs.briefs.find((item) => item.candidateId === brief.candidateId).courseIds.filter(() => false), ...relatedCandidates])],
    sources,
    status: 'draft',
    volatility: volatility[brief.category],
    reviewedAt: '2026-07-16'
  };
  // Article references are resolved against published anchors during the W46 promotion step.
  const candidate = readJson('content-model/research/w42-topic-candidates.json').candidates.find((item) => item.id === brief.candidateId);
  article.prerequisites = [candidate.relatedExistingArticleIds[0]];
  article.related = [...new Set([...candidate.relatedExistingArticleIds, ...relatedCandidates])];
  const serialized = `${JSON.stringify(article, null, 2)}\n`;
  fs.writeFileSync(path.join(outputDir, `${article.id}.article.json`), serialized);
  manifestItems.push({ articleId: article.id, category: brief.category, priority: brief.priority, characters: sections.reduce((sum, section) => sum + section.body.length, 0), contentSha256: sha256(serialized) });
}

const manifest = {
  schemaVersion: '1.0', milestone: 'W45', generatedAt: '2026-07-16', publicationAllowed: false,
  totals: { drafts: manifestItems.length, courseBlocking: manifestItems.filter((item) => item.priority === 'course-blocking').length, characters: manifestItems.reduce((sum, item) => sum + item.characters, 0) },
  items: manifestItems
};
fs.writeFileSync(path.join(root, 'content-model', 'staging', 'w45-draft-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`W45 staged articles: ${manifest.totals.drafts} drafts, ${manifest.totals.characters} body characters`);

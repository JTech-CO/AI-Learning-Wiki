import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ARTICLE_DIR = path.join(ROOT, 'content-model', 'articles');
const PROMPT_DIR = path.join(ROOT, 'content-model', 'library', 'prompts');
const REVIEW_DATE = '2026-08-09';

function articlePath(id) {
  return path.join(ARTICLE_DIR, `${id}.article.json`);
}

function readArticle(id) {
  return JSON.parse(fs.readFileSync(articlePath(id), 'utf8'));
}

function writeArticle(article) {
  fs.writeFileSync(articlePath(article.id), `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

function promptPath(id) {
  return path.join(PROMPT_DIR, `${id}.prompt.json`);
}

function readPrompt(id) {
  return JSON.parse(fs.readFileSync(promptPath(id), 'utf8'));
}

function writePrompt(prompt) {
  fs.writeFileSync(promptPath(prompt.id), `${JSON.stringify(prompt, null, 2)}\n`, 'utf8');
}

function section(article, id) {
  const value = article.sections.find((item) => item.id === id);
  if (!value) throw new Error(`${article.id}: missing section ${id}`);
  return value;
}

function replaceText(article, before, after) {
  if (article.summary.includes(before)) article.summary = article.summary.replaceAll(before, after);
  for (const item of article.sections) {
    if (item.body.includes(before)) item.body = item.body.replaceAll(before, after);
  }
}

function removeParagraphs(article, sectionId, tests) {
  const target = section(article, sectionId);
  target.body = target.body
    .split('\n\n')
    .filter((paragraph) => !tests.some((test) => test.test(paragraph)))
    .join('\n\n');
}

function appendParagraph(article, sectionId, paragraph) {
  const target = section(article, sectionId);
  if (!target.body.includes(paragraph)) target.body = `${target.body.trim()}\n\n${paragraph}`;
}

function replaceSource(article, matcher, source) {
  const index = article.sources.findIndex((item) => matcher.test(item.url));
  if (index < 0) {
    article.sources.push(source);
    return article.sources.length;
  }
  article.sources[index] = source;
  return index + 1;
}

function ensureSource(article, source) {
  const index = article.sources.findIndex((item) => item.url === source.url);
  if (index >= 0) {
    article.sources[index] = source;
    return index + 1;
  }
  article.sources.push(source);
  return article.sources.length;
}

function addSourceRef(article, sectionId, ...refs) {
  const target = section(article, sectionId);
  target.sourceRefs = [...new Set([...(target.sourceRefs ?? []), ...refs])].sort((a, b) => a - b);
}

const FINAL_SPEC = {
  title: 'Model Context Protocol Specification 2026-07-28',
  url: 'https://modelcontextprotocol.io/specification/2026-07-28',
  type: 'standard',
};

const RELEASE_NOTES = {
  title: 'The 2026-07-28 MCP Specification',
  url: 'https://blog.modelcontextprotocol.io/posts/2026-07-28/',
  type: 'documentation',
};

const FEATURE_SOURCES = {
  'mcp-transport': {
    title: 'MCP 2026-07-28: Transports',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/basic/transports',
    type: 'standard',
  },
  'mcp-client': {
    title: 'MCP 2026-07-28: Architecture',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/architecture',
    type: 'standard',
  },
  'mcp-host': {
    title: 'MCP 2026-07-28: Architecture',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/architecture',
    type: 'standard',
  },
  'mcp-server': {
    title: 'MCP 2026-07-28: Architecture',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/architecture',
    type: 'standard',
  },
  'mcp-tools': {
    title: 'MCP 2026-07-28: Tools',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/server/tools',
    type: 'standard',
  },
  'mcp-resources': {
    title: 'MCP 2026-07-28: Resources',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/server/resources',
    type: 'standard',
  },
  'mcp-prompts': {
    title: 'MCP 2026-07-28: Prompts',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/server/prompts',
    type: 'standard',
  },
  'mcp-elicitation': {
    title: 'MCP 2026-07-28: Elicitation',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation',
    type: 'standard',
  },
  'mcp-sampling': {
    title: 'MCP 2026-07-28: Sampling',
    url: 'https://modelcontextprotocol.io/specification/2026-07-28/client/sampling',
    type: 'standard',
  },
};

function updateMcpSources(article) {
  let featureRef = null;
  if (FEATURE_SOURCES[article.id]) {
    featureRef = replaceSource(
      article,
      /modelcontextprotocol\.io\/specification\/2025-06-18\//,
      FEATURE_SOURCES[article.id],
    );
  }
  const specRef = replaceSource(
    article,
    /modelcontextprotocol\.io\/specification\/2025-11-25$/,
    FINAL_SPEC,
  );
  const releaseRef = replaceSource(
    article,
    /blog\.modelcontextprotocol\.io\/posts\/2026-07-28-release-candidate\//,
    RELEASE_NOTES,
  );
  const ensuredReleaseRef = releaseRef ?? ensureSource(article, RELEASE_NOTES);
  return { featureRef, specRef, releaseRef: ensuredReleaseRef };
}

function applyMcpRefresh() {
  const ids = [
    'mcp',
    'mcp-transport',
    'mcp-client',
    'mcp-host',
    'mcp-server',
    'mcp-tools',
    'mcp-resources',
    'mcp-prompts',
    'mcp-elicitation',
    'mcp-sampling',
  ];

  const articles = Object.fromEntries(ids.map((id) => [id, readArticle(id)]));

  const mcp = articles.mcp;
  removeParagraphs(mcp, 'scope', [/2026년 7월 23일 기준/, /2026-07-28 규격은 최종본이 아닌/]);
  removeParagraphs(mcp, 'mechanism', [/2026-07-28 릴리스 후보/]);
  appendParagraph(
    mcp,
    'scope',
    '2026년 8월 9일 기준 최신 정식 규격은 `2026-07-28`이다. 이 버전은 프로토콜 핵심을 상태 비저장 요청·응답 모델로 바꾸고, 확장 프레임워크와 Tasks, 헤더 기반 라우팅, 목록 응답 캐시 힌트, 권한 부여 강화 및 최소 12개월의 폐기 정책을 도입했다. 구현과 문서에는 `MCP-Protocol-Version`과 기준 날짜를 함께 기록하고 이전 규격과의 호환 경로를 별도로 시험해야 한다.',
  );
  appendParagraph(
    mcp,
    'mechanism',
    '`2026-07-28`에서는 `initialize`/`initialized` 교환과 `Mcp-Session-Id`가 제거됐다. 각 요청은 `_meta`에 프로토콜 버전·클라이언트 정보·기능을 담으며, 사전 기능 탐색이 필요할 때만 선택적 `server/discover`를 호출한다. 애플리케이션 상태가 필요하면 도구가 명시적 핸들을 발급하고 이후 호출의 일반 인자로 전달한다.',
  );

  const transport = articles['mcp-transport'];
  replaceText(
    transport,
    '로컬 표준 입출력이나 원격 HTTP 전송이 요청·응답·알림의 경계를 보존하고 세션·재연결·인증 규칙에 따라 양방향 메시지를 운반한다.',
    '로컬 표준 입출력이나 원격 HTTP 전송은 요청·응답·알림의 경계를 보존하고 요청별 메타데이터·취소·인증 규칙에 따라 메시지를 운반한다.',
  );
  removeParagraphs(transport, 'scope', [/2026년 7월 23일 기준/]);
  removeParagraphs(transport, 'mechanism', [/2025-11-25 안정 규격/, /2026-07-28 릴리스 후보/]);
  appendParagraph(
    transport,
    'scope',
    '`2026-07-28` 정식 규격은 stdio와 Streamable HTTP를 표준 전송으로 정의한다. 이전 규격의 연결 범위 세션과 서버 시작 JSON-RPC 요청은 호환 대상으로만 남으며, 새 구현은 요청별 메타데이터와 응답 범위 스트림을 기준으로 설계한다.',
  );
  appendParagraph(
    transport,
    'mechanism',
    'Streamable HTTP에서는 각 메시지를 단일 MCP 엔드포인트로 POST하고 JSON 응답 또는 요청 범위 SSE 스트림으로 결과를 받는다. 요청 본문의 `_meta`가 프로토콜 정보의 원본이며 `Mcp-Method`와 `Mcp-Name` 헤더는 게이트웨이 라우팅과 정책 적용을 위해 이를 반영한다. 서버는 독립 JSON-RPC 요청을 시작하지 않고 응답·알림만 전송한다.',
  );

  const client = articles['mcp-client'];
  const oldClientSummary = 'MCP 클라이언트는 MCP 호스트 안에서 특정 서버와 일대일 세션을 맺고 프로토콜 메시지를 주고받는 구성 요소다.';
  const newClientSummary = 'MCP 클라이언트는 MCP 호스트 안에서 특정 서버와 일대일 관계를 유지하며 요청별 프로토콜 메시지를 주고받는 구성 요소다.';
  replaceText(client, oldClientSummary, newClientSummary);
  replaceText(
    client,
    '초기화 과정에서 프로토콜 버전과 기능을 협상하고 도구·리소스·프롬프트 목록을 조회하며, 요청 식별자로 호출과 응답·오류·취소를 연결한다.',
    '각 요청에 프로토콜 버전과 클라이언트 기능을 첨부하고 도구·리소스·프롬프트 목록을 조회하며, 요청 식별자로 호출과 응답·오류·취소를 연결한다. 사전 기능 확인이 필요하면 선택적 `server/discover`를 사용한다.',
  );
  appendParagraph(
    client,
    'mechanism',
    '`2026-07-28` 클라이언트는 연결 범위 초기화나 세션 식별자에 의존하지 않는다. 매 요청의 `_meta.io.modelcontextprotocol/*`에 버전·클라이언트 정보·기능을 싣고, 서버별 보안 경계와 구독·알림 상태는 호스트 정책 아래에서 별도로 관리한다.',
  );

  appendParagraph(
    articles['mcp-host'],
    'mechanism',
    '`2026-07-28`에서 호스트는 여러 클라이언트를 만들고 권한·동의·문맥 집계를 조정한다. 각 클라이언트는 요청마다 버전과 기능을 첨부하므로 호스트는 연결 범위 초기화 상태 대신 요청 계약, 서버별 권한 경계, 선택적 `server/discover` 결과를 관리한다.',
  );

  appendParagraph(
    articles['mcp-server'],
    'mechanism',
    '`2026-07-28` 서버는 도구·리소스·프롬프트 기능과 선택적 `server/discover`를 제공하지만 독립 JSON-RPC 요청을 클라이언트에 시작하지 않는다. 작업 도중 사용자 입력이나 모델 호출이 필요하면 `InputRequiredResult`를 반환하고, 클라이언트가 `inputResponses`를 붙여 원래 요청을 다시 보내는 다중 왕복 요청(MRTR)을 사용한다.',
  );

  appendParagraph(
    articles['mcp-tools'],
    'mechanism',
    '`2026-07-28`에서 `tools/list` 결과는 결정적 순서와 `ttlMs`, `cacheScope` 캐시 힌트를 제공할 수 있다. Streamable HTTP의 `tools/call` 요청은 `Mcp-Method`와 `Mcp-Name` 헤더를 사용하므로 게이트웨이가 본문을 해석하지 않고도 도구별 라우팅·계측·권한 정책을 적용할 수 있다.',
  );

  appendParagraph(
    articles['mcp-resources'],
    'mechanism',
    '`2026-07-28`에서 `resources/list`와 `resources/read` 응답은 결정적 순서와 `ttlMs`, `cacheScope` 캐시 힌트를 제공할 수 있다. 변경 알림이 필요하면 클라이언트가 대상 URI를 지정해 `subscriptions/listen` 스트림을 열며, 서버가 별도 요청을 시작하는 방식에 의존하지 않는다.',
  );

  appendParagraph(
    articles['mcp-prompts'],
    'mechanism',
    '`2026-07-28`에서 `prompts/list` 결과는 결정적 순서와 `ttlMs`, `cacheScope` 캐시 힌트를 제공할 수 있다. 클라이언트는 목록을 안전하게 캐시하되 만료·범위 정보를 지키고, `prompts/get`의 인수와 반환 메시지는 요청마다 선언된 기능과 스키마를 기준으로 검증한다.',
  );

  const elicitation = articles['mcp-elicitation'];
  replaceText(
    elicitation,
    '서버가 질문과 응답 스키마를 클라이언트에 보내면 호스트가 승인 가능한 화면을 표시하고 사용자의 수락·거절·취소 상태와 검증된 값을 돌려준다.',
    '서버가 작업 응답을 `input_required`로 반환하면 호스트가 승인 가능한 화면을 표시하고, 클라이언트는 검증된 사용자 응답을 `inputResponses`에 담아 원래 요청을 다시 보낸다.',
  );
  appendParagraph(
    elicitation,
    'mechanism',
    '`2026-07-28`에서는 서버 시작 `elicitation/create` 요청 대신 다중 왕복 요청(MRTR)을 사용한다. 서버는 필요한 입력의 스키마와 이유를 `InputRequiredResult`로 반환하고, 클라이언트는 사용자의 수락·거절·취소를 적용한 뒤 원래 호출을 재개한다. 민감정보 요구와 자동 제출을 금지하고 각 왕복의 동의 기록을 남겨야 한다.',
  );

  const sampling = articles['mcp-sampling'];
  const oldSamplingSummary = 'MCP 샘플링은 서버가 호스트의 모델 호출 능력을 요청해 중첩된 언어 모델 생성을 수행하는 기능이다.';
  const newSamplingSummary = 'MCP 샘플링은 서버가 호스트의 모델 생성 능력을 요청하던 기존 클라이언트 기능이며, 2026-07-28 규격에서 폐기 절차에 들어갔다.';
  replaceText(sampling, oldSamplingSummary, newSamplingSummary);
  replaceText(
    sampling,
    '서버가 메시지·모델 선호·토큰 한도를 포함한 생성 요청을 클라이언트에 보내면 호스트가 사용자 승인과 정책을 적용해 모델을 호출하고 결과를 서버에 반환한다.',
    '이전 규격에서는 서버가 `sampling/createMessage`로 메시지·모델 선호·토큰 한도를 보냈지만, 새 구현은 이 서버 시작 요청을 채택하지 않고 다중 왕복 요청(MRTR)이나 명시적 확장으로 마이그레이션해야 한다.',
  );
  appendParagraph(
    sampling,
    'scope',
    '`2026-07-28` 정식 규격은 Sampling을 폐기 대상으로 지정했으며 최소 12개월의 호환 기간을 둔다. 기존 구현은 즉시 중단되는 것이 아니지만 새 구현에서는 채택하지 않고, 모델 입력이 필요한 작업을 `InputRequiredResult`와 `inputResponses` 기반 MRTR 또는 명시적으로 협상한 확장으로 옮긴다.',
  );

  for (const article of Object.values(articles)) {
    const refs = updateMcpSources(article);
    addSourceRef(article, 'scope', refs.specRef, refs.releaseRef, ...(refs.featureRef ? [refs.featureRef] : []));
    addSourceRef(article, 'mechanism', refs.specRef, refs.releaseRef, ...(refs.featureRef ? [refs.featureRef] : []));
    article.reviewedAt = REVIEW_DATE;
    writeArticle(article);
  }

  console.log(`MCP refresh complete: ${ids.length} articles`);
}


const EU_AI_ACT = {
  title: 'Regulation (EU) 2024/1689: Artificial Intelligence Act',
  url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  type: 'standard',
};

const ARTICLE_50_GUIDELINES = {
  title: 'European Commission Guidelines on Article 50 Transparency Obligations',
  url: 'https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems',
  type: 'documentation',
};

const TRANSPARENCY_CODE = {
  title: 'Code of Practice on Transparency of AI-generated Content',
  url: 'https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content',
  type: 'documentation',
};

function addEuTransparencySources(article) {
  return {
    actRef: ensureSource(article, EU_AI_ACT),
    guidelinesRef: ensureSource(article, ARTICLE_50_GUIDELINES),
    codeRef: ensureSource(article, TRANSPARENCY_CODE),
  };
}

function applyEuAiActRefresh() {
  const ids = ['ai-disclosure', 'ai-compliance-monitoring', 'ai-regulatory-classification', 'content-provenance', 'deepfake-detection'];
  const articles = Object.fromEntries(ids.map((id) => [id, readArticle(id)]));

  const disclosure = articles['ai-disclosure'];
  appendParagraph(disclosure, 'scope', 'EU AI Act Article 50의 투명성 의무는 2026년 8월 2일부터 적용된다. 자연인과 직접 상호작용하는 AI, 합성·조작 콘텐츠의 기계 판독 가능한 표시, 감정 인식·생체 분류, 딥페이크와 일부 공익 목적 텍스트는 서로 다른 제공자·배포자 의무와 예외를 가진다. 따라서 “AI를 사용했다”는 한 문장만으로 모든 사례의 요구를 충족한다고 판단해서는 안 된다.');
  appendParagraph(disclosure, 'mechanism', '고지는 대상·시점·표현·기술 표식을 분리해 설계한다. 상호작용 고지는 이용자가 첫 상호작용 전에 이해할 수 있어야 하며, 생성·조작 콘텐츠의 제공자는 산출물이 AI 생성임을 탐지 가능한 기계 판독 형식으로 표시한다. 딥페이크나 공익 사안에 관한 특정 AI 생성 텍스트를 공개하는 배포자는 사람이 인식할 수 있는 방식으로 그 사실을 알린다. 예외와 역할 구분은 최신 공식 지침과 실제 관할권을 기준으로 확인한다.');
  appendParagraph(disclosure, 'limitations', 'C2PA 같은 출처 메타데이터, 화면의 고지 문구, 내부 감사 기록은 서로 보완하지만 동일하지 않다. 기술 표식이 있다고 이용자 고지가 자동 충족되는 것도 아니고, 고지 문구가 있다고 생성 이력과 무결성이 증명되는 것도 아니다. 법적 적용 여부는 시스템 역할·시장·콘텐츠 목적·인간 편집 통제에 따라 달라지므로 자동 판정 결과를 법률 의견으로 사용하지 않는다.');

  const monitoring = articles['ai-compliance-monitoring'];
  appendParagraph(monitoring, 'scope', '2026년 8월 2일부터 적용된 EU AI Act Article 50을 모니터링 범위에 포함한다. 적용 대상 시스템은 상호작용 고지, 기계 판독 표시, 딥페이크·공익 콘텐츠 공개 같은 통제를 역할별로 추적해야 하며, 규격과 제품 변경 뒤에도 표시가 실제 전달·보존되는지 재검증해야 한다.');
  appendParagraph(monitoring, 'mechanism', '준수 증거는 “의무-통제-시험-책임자-검토일” 행렬로 관리한다. Article 50 사례에서는 원본 산출물의 표식, 배포 과정에서의 보존 여부, 사용자 화면 고지, 예외 적용 근거와 실패 로그를 각각 보존한다. 자발적 행동강령을 따르더라도 서명 여부만으로 준수를 단정하지 않고 실제 통제와 시험 결과를 제시한다.');

  const classification = articles['ai-regulatory-classification'];
  appendParagraph(classification, 'scope', 'EU AI Act의 분류는 하나의 “위험 등급”만 고르는 작업이 아니다. 금지 관행, 고위험 시스템, 범용 AI 모델 의무와 Article 50 투명성 의무는 적용 축이 다르며 하나의 시스템에 동시에 적용될 수 있다. 특히 챗봇·생성 콘텐츠를 무조건 “제한적 위험”으로 확정하는 표현은 역할·용도·예외와 다른 의무를 가릴 수 있다.');
  appendParagraph(classification, 'mechanism', '분류 순서는 관할과 시장, 행위자 역할, 금지 관행, Annex I·III 고위험 범위, 범용 AI 모델 여부, Article 50 투명성 의무, 분야별 법률 순으로 나눈다. 각 결론에는 확인한 조항·기준일·남은 정보·신뢰 수준을 기록하고, 정보가 부족하면 “최소 위험”으로 추정하지 않고 미결정 상태로 남긴다.');

  const provenance = articles['content-provenance'];
  appendParagraph(provenance, 'scope', 'EU AI Act Article 50(2)는 적용 대상 생성·조작 콘텐츠가 AI 생성임을 탐지할 수 있도록 기계 판독 가능한 형식으로 표시할 것을 요구한다. C2PA 같은 출처 증명 규격은 생성·편집 이력과 무결성을 전달하는 구현 수단이 될 수 있지만, 특정 규격 사용 자체가 모든 법적 의무 충족을 보장하지는 않는다.');
  appendParagraph(provenance, 'limitations', '메타데이터는 제거되거나 변환 과정에서 손실될 수 있고, 유효한 서명은 콘텐츠의 진실성 자체가 아니라 기록된 출처와 무결성을 증명한다. 따라서 워터마크·출처 자격증명·사람이 읽는 고지·배포 로그를 함께 시험하고, 실제 게시 경로가 기계 판독 표시를 보존하는지 확인한다.');

  const deepfake = articles['deepfake-detection'];
  appendParagraph(deepfake, 'scope', '기술적 딥페이크 탐지와 법적 공개 의무는 별개다. EU AI Act Article 50은 적용 대상 딥페이크를 배포하는 자에게 콘텐츠가 인위적으로 생성·조작됐음을 명확히 공개하도록 요구하며 2026년 8월 2일부터 적용된다. 탐지기가 낮은 확률을 냈다는 이유만으로 공개 의무가 사라지는 것은 아니다.');
  appendParagraph(deepfake, 'mechanism', '운영 절차는 출처 메타데이터와 서명 검증, 워터마크 탐지, 시청각 포렌식 모델, 생성·편집 기록과 사람 검토를 결합한다. 결과에는 탐지 점수뿐 아니라 사용 모델·임곗값·지원 매체·변환 이력·불확실성을 남기고, 별도 단계에서 Article 50의 공개 대상과 예외를 판정한다.');

  for (const article of Object.values(articles)) {
    const refs = addEuTransparencySources(article);
    addSourceRef(article, 'scope', refs.actRef, refs.guidelinesRef, refs.codeRef);
    addSourceRef(article, 'mechanism', refs.actRef, refs.guidelinesRef);
    addSourceRef(article, 'limitations', refs.actRef, refs.guidelinesRef);
    article.reviewedAt = REVIEW_DATE;
    writeArticle(article);
  }

  const riskPrompt = readPrompt('ai-safety-compliance-p1');
  Object.assign(riskPrompt, {
    version: riskPrompt.version + 1,
    title: 'EU AI Act 적용 범위·의무 예비 점검',
    summary: '시스템의 관할·역할·용도를 바탕으로 EU AI Act의 적용 축과 추가 확인 사항을 근거와 함께 예비 점검한다.',
    difficulty: 'advanced',
    template: `다음 AI 시스템에 대해 EU AI Act 적용 범위와 잠정 의무를 예비 점검하라.

- 기준일: [기준일]
- 출시·사용 시장과 관할: [시장과 관할]
- 조직의 역할: [제공자/배포자/수입자/유통자/기타]
- 의도된 용도와 영향 대상: [용도와 대상]
- 입력·출력·자동 결정과 사람 개입: [처리 흐름]

다음 순서로 작성하라.
1. 적용 범위와 역할을 확인하고 부족한 정보를 먼저 적는다.
2. Article 5 금지 관행 해당 가능성을 검토한다.
3. Annex I·III 고위험 범위와 예외를 검토한다.
4. Article 50 투명성 의무를 위험 분류와 별도 축으로 검토한다.
5. 범용 AI 모델 또는 분야별 법률의 추가 의무 가능성을 적는다.
6. 표에 잠정 결론, 근거 조항·공식 URL, 기준일, 신뢰 수준, 필요한 전문가 검토를 기록한다.

정보가 부족하면 최소 위험으로 추정하지 말고 '판정 보류'로 표시하라. 최신 EUR-Lex 법령과 유럽연합 집행위원회 지침에서 확인할 수 없는 내용은 단정하지 말라. 결과는 법률 자문이 아니라 내부 검토를 위한 초안이라고 명시하라.`,
    variables: [
      { name: 'reference_date', description: '검토 기준일', required: true, example: '2026-08-09' },
      { name: 'market_jurisdiction', description: '출시·사용 시장과 관할', required: true, example: 'EU 회원국 대상 채용 서비스' },
      { name: 'actor_role', description: '조직의 규제상 역할', required: true, example: '배포자' },
      { name: 'intended_use', description: '의도된 용도와 영향 대상', required: true, example: '지원자 이력서 우선순위 산정' },
      { name: 'processing_flow', description: '입출력·자동 결정·사람 개입 흐름', required: true, example: '점수 산정 후 채용 담당자가 최종 검토' },
    ],
    outputContract: { format: 'table', description: '적용 축별 잠정 결론과 근거, 불확실성, 후속 검토를 분리한 표', schema: null, sections: ['적용 전제', '금지 관행', '고위험 범위', 'Article 50', '추가 의무', '판정 보류 사항'] },
    notes: '법률 자문을 대체하지 않는다. 기준일·관할·행위자 역할을 고정하고 EUR-Lex 법령과 유럽연합 집행위원회 최신 지침을 확인한 뒤 법무·준법 담당자가 최종 판단한다.',
    relatedWikiSlugs: ['ai-regulatory-classification', 'ai-disclosure', 'ai-compliance-monitoring'],
    reviewedAt: REVIEW_DATE,
  });
  writePrompt(riskPrompt);

  const cardPrompt = readPrompt('ai-safety-compliance-p2');
  Object.assign(cardPrompt, {
    version: cardPrompt.version + 1,
    summary: '모델의 용도·성능·한계와 검증 근거를 정리하고 필요한 경우 최신 EU AI Act 기술문서 요구와의 차이를 표시한다.',
    difficulty: 'advanced',
    template: `다음 시스템의 모델 카드 초안을 작성하라.

- 기준일·관할: [기준일과 관할]
- 시스템과 모델 버전: [시스템과 모델]
- 의도된 용도·금지 용도: [용도 범위]
- 학습·평가 데이터 개요: [데이터 개요]
- 전체·하위집단 평가 결과: [평가 결과]
- 예비 규제 분류와 근거: [규제 분류 근거]

intended_use, out_of_scope_uses, data, performance_metrics, known_limitations, human_oversight, monitoring, ethical_considerations, owner_contact, version_history 순서로 작성하라. 예비 검토에서 고위험 가능성이 확인된 경우에만 최신 EUR-Lex의 Annex IV 항목과 현재 증거를 매핑한 '기술문서 차이 표'를 추가하라. 매핑되지 않은 항목은 추정해 채우지 말고 담당자·필요 자료·완료 기준을 적는다. 모델 카드는 법적 기술문서 전체를 대체하지 않는다고 명시하라.`,
    variables: [
      { name: 'reference_scope', description: '기준일과 적용 관할', required: true, example: '2026-08-09, EU' },
      { name: 'system_model', description: '시스템명과 모델 버전', required: true, example: '지원서 보조 분석기 2.3' },
      { name: 'use_scope', description: '의도된 용도와 금지 용도', required: true, example: '담당자 검토 지원, 자동 탈락 금지' },
      { name: 'data_overview', description: '학습·평가 데이터 개요', required: true, example: '내부 승인 데이터와 독립 평가셋' },
      { name: 'evaluation_results', description: '전체·하위집단 평가 결과', required: true, example: '전체 F1 0.88, 최저 하위집단 0.79' },
      { name: 'regulatory_basis', description: '예비 분류와 근거 또는 미결정 사유', required: true, example: 'Annex III 고용 분야 해당 가능성' },
    ],
    outputContract: { format: 'mixed', description: '모델 카드 본문과 근거 기반 Annex IV 차이 표', schema: null, sections: ['모델 카드', '근거와 불확실성', '기술문서 차이 표', '검토·승인'] },
    notes: '모델 카드와 Annex IV 기술문서의 목적을 구분한다. 최신 공식 법령을 확인하고 누락 항목을 생성해 채우지 않으며 법무·준법·모델 책임자의 검토를 받는다.',
    relatedWikiSlugs: ['model-transparency', 'ai-regulatory-classification', 'ai-compliance-monitoring'],
    reviewedAt: REVIEW_DATE,
  });
  writePrompt(cardPrompt);

  const disclosurePrompt = readPrompt('p37i-disclose');
  Object.assign(disclosurePrompt, {
    version: disclosurePrompt.version + 1,
    title: 'AI 사용 고지문 작성',
    summary: '실제 AI 사용 범위와 사람의 기여·검증을 구분해 대상 정책과 매체에 맞는 고지문을 작성한다.',
    template: `다음 사실만 사용해 AI 사용 고지문을 작성하라.

- 문서·콘텐츠와 공개 매체: [문서와 매체]
- 사용한 AI 도구와 버전: [도구와 버전]
- AI가 수행한 범위: [AI 사용 범위]
- 사람이 수행한 작성·검증: [사람의 기여와 검증]
- 적용할 기관·학술·서비스 정책: [적용 정책]
- 독자와 공개 지역: [대상과 지역]

'사용 도구 / AI 사용 범위 / 사람의 기여와 검증 / 적용 정책' 순서로 간결하게 작성하라. 제공하지 않은 검증·승인·저작권 상태를 추정하지 말라. EU 공개 콘텐츠처럼 Article 50 검토가 필요할 수 있는 경우에는 학술·기관 고지와 법적 투명성 의무가 별개임을 알리고, 상호작용 고지·기계 판독 표시·딥페이크 또는 공익 콘텐츠 표시 중 추가 검토할 항목을 별도 체크리스트로 제시하라.`,
    variables: [
      { name: 'content_channel', description: '문서·콘텐츠와 공개 매체', required: true, example: '연구 보고서 PDF와 기관 웹사이트' },
      { name: 'tool_version', description: '사용한 AI 도구와 버전', required: true, example: '조직 승인 요약 도구 2.1' },
      { name: 'ai_contribution', description: 'AI가 수행한 범위', required: true, example: '목차 초안과 문장 교정' },
      { name: 'human_review', description: '사람이 수행한 작성과 검증', required: true, example: '데이터 수집, 결론 작성, 모든 인용 대조' },
      { name: 'applicable_policy', description: '기관·학술·서비스 정책', required: false, example: '학회 AI 사용 공개 정책' },
      { name: 'audience_region', description: '독자와 공개 지역', required: false, example: '일반 독자, EU 포함 공개' },
    ],
    outputContract: { format: 'text', description: '사실 기반 AI 사용 고지문과 필요한 경우 별도 법적 투명성 검토 목록', schema: null, sections: ['고지문', '추가 확인 사항'] },
    notes: '기관·학술 정책 준수와 법적 투명성 의무는 별개다. 사실로 제공된 사용 범위만 적고, 공개 지역과 매체에 따라 최신 정책·Article 50 적용 여부를 담당자가 확인한다.',
    relatedWikiSlugs: ['ai-disclosure', 'content-provenance'],
    reviewedAt: REVIEW_DATE,
  });
  writePrompt(disclosurePrompt);

  console.log(`EU AI Act refresh complete: ${ids.length} articles, 3 prompts`);
}

const phase = process.argv[2];
if (phase === '1') {
  applyMcpRefresh();
} else if (phase === '2') {
  applyEuAiActRefresh();
} else {
  throw new Error('Usage: node scripts/apply-2026-08-content-refresh.mjs <1|2>');
}

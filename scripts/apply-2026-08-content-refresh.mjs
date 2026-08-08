import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ARTICLE_DIR = path.join(ROOT, 'content-model', 'articles');
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

const phase = process.argv[2];
if (phase === '1') {
  applyMcpRefresh();
} else {
  throw new Error('Usage: node scripts/apply-2026-08-content-refresh.mjs 1');
}

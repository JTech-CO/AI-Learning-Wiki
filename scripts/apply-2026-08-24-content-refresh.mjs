import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ARTICLE_DIR = path.join(ROOT, 'content-model', 'articles');
const EVIDENCE_DIR = path.join(ROOT, 'content-model', 'evidence');
const REVIEW_DATE = '2026-08-24';

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

function firstSection(article, ids) {
  for (const id of ids) {
    const value = article.sections.find((item) => item.id === id);
    if (value) return value;
  }
  throw new Error(`${article.id}: none of the requested sections exist (${ids.join(', ')})`);
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

function addSourceRefs(target, refs) {
  target.sourceRefs = [...new Set([...(target.sourceRefs ?? []), ...refs])].sort((a, b) => a - b);
}

function appendParagraph(article, sectionIds, paragraph, sources) {
  const target = firstSection(article, sectionIds);
  if (!target.body.includes(paragraph)) target.body = `${target.body.trim()}\n\n${paragraph}`;
  addSourceRefs(target, sources.map((source) => ensureSource(article, source)));
}

function replaceParagraph(article, sectionId, before, after, sources) {
  const target = section(article, sectionId);
  if (target.body.includes(before)) target.body = target.body.replace(before, after);
  else if (!target.body.includes(after)) target.body = `${target.body.trim()}\n\n${after}`;
  addSourceRefs(target, sources.map((source) => ensureSource(article, source)));
}

function updateArticle(id, update) {
  const article = readArticle(id);
  update(article);
  article.reviewedAt = REVIEW_DATE;
  writeArticle(article);
  return id;
}

const SOURCES = {
  openaiChangelog: {
    title: 'OpenAI API Changelog',
    url: 'https://developers.openai.com/api/docs/changelog',
    type: 'documentation',
  },
  openaiModels: {
    title: 'OpenAI API Models',
    url: 'https://developers.openai.com/api/docs/models',
    type: 'documentation',
  },
  openaiDataControls: {
    title: 'OpenAI API Data Controls',
    url: 'https://developers.openai.com/api/docs/guides/your-data',
    type: 'documentation',
  },
  openaiPromptCaching: {
    title: 'OpenAI Prompt Caching',
    url: 'https://developers.openai.com/api/docs/guides/prompt-caching',
    type: 'documentation',
  },
  openaiImageGeneration: {
    title: 'OpenAI 이미지 생성 문서',
    url: 'https://developers.openai.com/api/docs/guides/image-generation',
    type: 'documentation',
  },
  openaiDeprecations: {
    title: 'OpenAI API Deprecations',
    url: 'https://developers.openai.com/api/docs/deprecations',
    type: 'documentation',
  },
  openaiResponsesMigration: {
    title: 'OpenAI Assistants에서 Responses로 이전',
    url: 'https://developers.openai.com/api/docs/guides/migrate-to-responses',
    type: 'documentation',
  },
  gemini37: {
    title: 'Gemini 3.7 Flash',
    url: 'https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash',
    type: 'documentation',
  },
  geminiChangelog: {
    title: 'Gemini API Release Notes',
    url: 'https://ai.google.dev/gemini-api/docs/changelog',
    type: 'documentation',
  },
  gemini37ModelCard: {
    title: 'Gemini 3.7 Flash Model Card',
    url: 'https://deepmind.google/models/model-cards/gemini-3-7-flash/',
    type: 'documentation',
  },
  claudeReleaseNotes: {
    title: 'Claude Platform Release Notes',
    url: 'https://platform.claude.com/docs/en/release-notes/overview',
    type: 'documentation',
  },
  claudeComputerUse: {
    title: 'Claude Computer Use Tool',
    url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool',
    type: 'documentation',
  },
  claudeBrowserUse: {
    title: 'Claude Browser Use Tool',
    url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool',
    type: 'documentation',
  },
  claudeFiles: {
    title: 'Claude Files API',
    url: 'https://platform.claude.com/docs/en/build-with-claude/files',
    type: 'documentation',
  },
  claudePythonSdk: {
    title: 'Claude Python SDK',
    url: 'https://platform.claude.com/docs/en/cli-sdks-libraries/sdks/python',
    type: 'documentation',
  },
  claudeCompliance: {
    title: 'Claude Compliance API',
    url: 'https://platform.claude.com/docs/en/manage-claude/compliance-api',
    type: 'documentation',
  },
  claudePricing: {
    title: 'Claude API Pricing',
    url: 'https://platform.claude.com/docs/en/about-claude/pricing',
    type: 'documentation',
  },
  transformers5150: {
    title: 'Transformers 5.15.0 Release',
    url: 'https://github.com/huggingface/transformers/releases/tag/v5.15.0',
    type: 'documentation',
  },
  transformers5151: {
    title: 'Transformers 5.15.1 Release',
    url: 'https://github.com/huggingface/transformers/releases/tag/v5.15.1',
    type: 'documentation',
  },
  pytorchReleases: {
    title: 'PyTorch Releases',
    url: 'https://github.com/pytorch/pytorch/releases',
    type: 'documentation',
  },
};

const updatedArticleIds = [];

updatedArticleIds.push(updateArticle('api-region-routing', (article) => {
  appendParagraph(
    article,
    ['operations', 'examples-checklist', 'mechanism'],
    'OpenAI는 2026년 8월 21일부터 Global geography 프로젝트의 API 키가 지원되는 요청에 한해 `us.api.openai.com` 또는 `eu.api.openai.com` 같은 지역 접두 도메인으로 처리 위치를 요청별 선택할 수 있게 했다. 이 방식도 고객·프로젝트 자격, 데이터 보존 통제, 엔드포인트와 모델 지원 조건을 그대로 따르므로, 도메인 선택만으로 데이터 경계가 보장된다고 가정하지 말고 요청별 정책 판정과 실제 처리 리전을 함께 감사해야 한다.',
    [SOURCES.openaiChangelog, SOURCES.openaiDataControls],
  );
}));

updatedArticleIds.push(updateArticle('api-cost-tracking', (article) => {
  appendParagraph(
    article,
    ['applications'],
    '가격표에는 효력 시작일·종료일과 표준·한시 상태를 함께 저장한다. 예를 들어 GPT-5.6 Sol의 API 가격은 2026년 8월 21일부터 입력 100만 토큰당 4달러, 출력 100만 토큰당 20달러로 조정됐고 이 프로모션 가격은 적어도 2026년 11월 21일까지 유지될 예정이다. Claude Sonnet 5의 입력 2달러·출력 10달러 가격은 8월 10일 표준 가격으로 확정됐으며, Gemini 3.7 Flash 가격은 12월 31일까지 도입 가격이다. 예정 가격과 확정 가격을 분리하고 적용 기간 밖의 비용을 같은 단가로 재계산하지 않는다.',
    [SOURCES.openaiChangelog, SOURCES.openaiModels, SOURCES.claudePricing, SOURCES.geminiChangelog],
  );
}));

updatedArticleIds.push(updateArticle('prompt-caching', (article) => {
  appendParagraph(
    article,
    ['applications', 'practice'],
    'OpenAI가 2026년 8월 20일 공개한 Prompt Caching 대시보드는 캐시 적중률, 캐시 읽기·쓰기, 캐시 읽기·쓰기·미캐시 토큰의 분해를 보여 주고 모델과 서비스 티어별 필터를 제공한다. 대시보드의 적중률만 보지 말고 캐시 쓰기 대비 재사용 횟수, 만료·무효화 원인, 지연시간과 실제 할인 비용을 같은 기간에 대조해야 한다.',
    [SOURCES.openaiChangelog, SOURCES.openaiPromptCaching],
  );
}));

updatedArticleIds.push(updateArticle('image-generation-api', (article) => {
  const before = '‘이미지 생성 API(Image Generation API)’의 활용 여부는 유행이나 모델 크기가 아니라 해결하려는 문제와 평가 가능한 개선으로 결정한다. 문서 요약 API라면 업로드 주소, 콘텐츠 유형, 처리 상태 조회, 결과 표현과 실패 재시도 조건을 각각 명세하고 큰 문서와 중단된 연결을 시험한다.';
  const after = '‘이미지 생성 API(Image Generation API)’의 활용 여부는 유행이나 모델 크기가 아니라 해결하려는 문제와 평가 가능한 개선으로 결정한다. 투명 배경 자산을 생성한다면 출력 형식, 알파 채널 보존, 편집 입력과 실패 재시도 조건을 각각 명세하고 대상 뷰어·브라우저에서 실제 합성 결과를 시험한다. 2026년 8월 20일부터 `gpt-image-2`와 해당 스냅샷은 Images API 및 Responses API 이미지 생성 도구에서 투명 배경 생성을 미리 보기로 제공한다. `background`를 `transparent`로 지정하고 PNG 또는 WebP를 사용해야 하며 JPEG는 알파 채널을 지원하지 않는다.';
  replaceParagraph(article, 'applications', before, after, [SOURCES.openaiChangelog, SOURCES.openaiImageGeneration]);

  const exampleBefore = '문서 요약 API라면 업로드 주소, 콘텐츠 유형, 처리 상태 조회, 결과 표현과 실패 재시도 조건을 각각 명세하고 큰 문서와 중단된 연결을 시험한다.';
  const exampleAfter = '아이콘을 투명 배경으로 생성한다면 같은 프롬프트를 PNG·WebP·JPEG로 요청해 응답 형식과 알파 채널을 검사한다. 미리 보기 기능은 모델 스냅샷과 API 경로에 따라 달라질 수 있으므로 요청의 `model`, `background`, `output_format`과 검토 날짜를 함께 기록한다.';
  replaceParagraph(article, 'worked-example', exampleBefore, exampleAfter, [SOURCES.openaiChangelog, SOURCES.openaiImageGeneration]);
}));

updatedArticleIds.push(updateArticle('api-deprecation', (article) => {
  const before = '‘API 지원 종료(API Deprecation)’의 활용 여부는 유행이나 모델 크기가 아니라 해결하려는 문제와 평가 가능한 개선으로 결정한다. 문서 요약 API라면 업로드 주소, 콘텐츠 유형, 처리 상태 조회, 결과 표현과 실패 재시도 조건을 각각 명세하고 큰 문서와 중단된 연결을 시험한다.';
  const after = '‘API 지원 종료(API Deprecation)’는 호출 인벤토리, 종료일, 대체 경로와 회귀 시험을 하나의 이행 계획으로 관리할 때 의미가 있다. OpenAI의 `gpt-5.2-chat-latest`와 `gpt-5.3-chat-latest`는 2026년 8월 10일 종료됐으며 권장 대체 모델은 `gpt-5.6-sol`이다. Assistants API는 8월 26일 종료될 예정이므로 Responses API와 Conversations API로 이전해야 한다. Anthropic의 실험적 prompt generation·improvement·templatization 엔드포인트도 8월 17일 종료 뒤 오류를 반환한다. 실험 API도 종료일을 넘기면 동작하지 않으므로 내보내기와 대체 경로 시험을 사전에 완료한다.';
  replaceParagraph(article, 'applications', before, after, [SOURCES.openaiDeprecations, SOURCES.openaiResponsesMigration, SOURCES.claudeReleaseNotes]);

  const exampleBefore = '문서 요약 API라면 업로드 주소, 콘텐츠 유형, 처리 상태 조회, 결과 표현과 실패 재시도 조건을 각각 명세하고 큰 문서와 중단된 연결을 시험한다.';
  const exampleAfter = '지원 종료 대응에서는 코드·프롬프트·대시보드에서 구형 모델 ID와 엔드포인트를 검색하고 호출량을 기준으로 소유자를 배정한다. 대체 API의 상태·도구 호출·대화 보존 계약을 비교한 뒤 고정 평가셋으로 병렬 실행하고, 종료일 전 트래픽 전환과 롤백 불가 시점을 승인한다.';
  replaceParagraph(article, 'worked-example', exampleBefore, exampleAfter, [SOURCES.openaiDeprecations, SOURCES.openaiResponsesMigration]);
}));

updatedArticleIds.push(updateArticle('model-version', (article) => {
  appendParagraph(
    article,
    ['applications', 'scope'],
    'Google은 2026년 8월 13일 Gemini 3.7 Flash를 정식 출시했다. 안정 모델 ID는 `gemini-3.7-flash`이며 텍스트·이미지·영상·음성·PDF 입력과 텍스트 출력, 1,048,576 입력 토큰과 65,536 출력 토큰을 지원한다. 모델 세대명과 안정 ID, 입출력 계약, 사고 수준과 도구 호환성을 별도 필드로 고정해야 별칭 변경이나 모델 교체를 버전 변화와 혼동하지 않는다.',
    [SOURCES.gemini37, SOURCES.geminiChangelog],
  );
}));

updatedArticleIds.push(updateArticle('multimodal-model', (article) => {
  appendParagraph(
    article,
    ['applications', 'scope'],
    'Gemini 3.7 Flash의 2026년 8월 정식 사양은 텍스트·이미지·영상·음성·PDF를 입력으로 받고 텍스트를 출력하며, 이미지 생성과 Live API는 지원하지 않는다고 구분한다. “멀티모달”이라는 표지만으로 모든 모달리티를 양방향 생성한다고 추정하지 말고 입력·출력 방향, 토큰 한도, 도구별 지원 상태와 미리 보기 여부를 모델 버전별로 확인한다.',
    [SOURCES.gemini37, SOURCES.geminiChangelog],
  );
}));

for (const id of ['multimodal-safety-evaluation', 'ai-safety']) {
  updatedArticleIds.push(updateArticle(id, (article) => {
    appendParagraph(
      article,
      ['tradeoffs', 'operations', 'overview'],
      '2026년 8월 Gemini 3.7 Flash 모델 카드는 텍스트·다국어·이미지에서 텍스트로 이어지는 안전 자동 평가, 전문가 레드팀, CBRN·사이버·조작·ML 연구개발 임곗값 평가를 서로 구분한다. 공급자가 평가 질의를 갱신했다고 밝혔으므로 모델 카드 사이의 수치를 그대로 시계열 비교하지 않고 평가셋 버전, 자동·수동 평가 범위와 판단 기준을 함께 기록해야 한다.',
      [SOURCES.gemini37ModelCard],
    );
  }));
}

for (const [id, toolSource] of [
  ['computer-use-agent', SOURCES.claudeComputerUse],
  ['browser-use-agent', SOURCES.claudeBrowserUse],
]) {
  updatedArticleIds.push(updateArticle(id, (article) => {
    appendParagraph(
      article,
      ['security-governance', 'limitations', 'applications'],
      `Anthropic은 2026년 8월 19일 computer use 도구의 정식 버전 \`computer_toolset_20260801\`과 browser use 도구 \`browser_toolset_20260801\`을 공개했다. 브라우저와 컴퓨터 사용은 웹 콘텐츠를 신뢰하지 않는 입력으로 취급하고 최소 권한의 VM·컨테이너, 네트워크 도메인 허용 목록, 비HTTP(S) 차단, 민감 파일·자격 증명 격리와 중요한 행동의 사람 확인을 실행 계층에서 강제해야 한다. JavaScript 실행과 파일 업로드는 필요한 작업에만 활성화한다.`,
      [SOURCES.claudeReleaseNotes, toolSource],
    );
  }));
}

updatedArticleIds.push(updateArticle('file-upload-api', (article) => {
  appendParagraph(
    article,
    ['applications', 'limitations', 'practice'],
    'Anthropic Files API는 2026년 8월 19일 정식 버전으로 전환됐다. 파일 API 계약에는 업로드 만료를 나타내는 `expires_in_seconds`와 `expires_at`, `page`·`next_page` 페이지네이션, `ids[]` 필터를 포함하고, 구형 베타 헤더를 보낼 때의 응답 차이를 버전별로 시험해야 한다. 만료된 파일을 영구 저장소처럼 참조하거나 페이지 첫 결과만 전체 목록으로 해석하지 않는다.',
    [SOURCES.claudeReleaseNotes, SOURCES.claudeFiles],
  );
}));

updatedArticleIds.push(updateArticle('sdk', (article) => {
  appendParagraph(
    article,
    ['limitations', 'applications', 'practice'],
    '2026년 8월 20일 Anthropic Python SDK 1.0은 Python 3.10 이상과 `httpx2` 전송 계층을 요구하고, 레거시 Text Completions 및 Messages의 sampling 매개변수를 제거했다. 비동기 원시 응답은 `await response.parse()`로 파싱하며 Bedrock 리전 누락은 오류가 된다. SDK 주 버전 업그레이드는 HTTP 클라이언트만 교체하는 작업이 아니므로 제거된 메서드·매개변수, 비동기 파싱과 환경 기본값을 계약 테스트해야 한다.',
    [SOURCES.claudeReleaseNotes, SOURCES.claudePythonSdk],
  );
}));

for (const id of ['ai-compliance-monitoring', 'api-audit-log']) {
  updatedArticleIds.push(updateArticle(id, (article) => {
    appendParagraph(
      article,
      ['operations', 'applications', 'security-governance'],
      'Anthropic은 2026년 8월 11일 Compliance API에서 로컬 Cowork·Claude Code 세션의 전사와 메타데이터 조회를 베타로 제공하고, API 응답에 `anthropic-workspace-id` 헤더를 추가했다. 준수 수집 범위와 `read:compliance_user_data` 권한을 명시하고, 워크스페이스 ID를 요청·비용·감사 이벤트의 귀속 검증에 사용하되 전사 보유·접근·삭제 정책은 별도 통제로 관리한다.',
      [SOURCES.claudeReleaseNotes, SOURCES.claudeCompliance],
    );
  }));
}

updatedArticleIds.push(updateArticle('transformers-library', (article) => {
  appendParagraph(
    article,
    ['scope'],
    '2026년 8월 24일 기준 공식 GitHub Releases의 최신 안정 버전은 8월 19일 공개된 Transformers 5.15.1이다. 5.15.0에서는 선형 어텐션 계열 커널을 명시적으로 활성화하도록 바꾸고, 캐시 자르기 API가 음수 상대 오프셋만 받도록 제한했으며, T5 계열에 SDPA 등 여러 어텐션 백엔드를 추가했다. 5.15.1은 DFlash·MTP 후보 생성기의 장치·설정 문제와 CUDA 환경의 Lanczos 이미지 처리 문제를 수정했다. 비공개 보조 API와 기본 어텐션 구현에 의존하지 말고 버전을 고정한 뒤 회귀 시험을 수행한다.',
    [SOURCES.transformers5150, SOURCES.transformers5151],
  );
}));

updatedArticleIds.push(updateArticle('pytorch', (article) => {
  const target = section(article, 'scope');
  target.body = target.body.replace(
    '2026년 7월 23일 기준 공식 GitHub Releases가 표시하는 최신 안정 버전은 2026년 7월 8일 공개된 PyTorch 2.13.0이다.',
    '2026년 8월 24일 재확인 결과 공식 GitHub Releases가 표시하는 최신 안정 버전은 2026년 7월 8일 공개된 PyTorch 2.13.0이다.',
  );
  addSourceRefs(target, [ensureSource(article, SOURCES.pytorchReleases)]);
}));

const mcpArticleIds = [
  'mcp',
  'mcp-client',
  'mcp-host',
  'mcp-server',
  'mcp-transport',
  'mcp-tools',
  'mcp-resources',
  'mcp-prompts',
  'mcp-elicitation',
  'mcp-sampling',
];

for (const id of mcpArticleIds) {
  const article = readArticle(id);
  for (const item of article.sections) {
    item.body = item.body.replaceAll('2026년 8월 9일 기준', '2026년 8월 24일 재확인 결과');
  }
  article.reviewedAt = REVIEW_DATE;
  writeArticle(article);
}

const verifiedUnchangedArticleIds = [
  ...mcpArticleIds,
  'managed-inference-platform',
  'realtime-api',
  'usage-metering',
];

const audit = {
  version: '2026-08-24',
  reviewedAt: REVIEW_DATE,
  reviewWindow: {
    from: '2026-08-01',
    to: REVIEW_DATE,
  },
  policy: {
    primarySourcesOnlyForMutableClaims: true,
    materialChangesOnly: true,
    previewFeaturesMustBeLabeled: true,
    priceClaimsRequireEffectivePeriod: true,
    historicalAuditFilesRemainImmutable: true,
  },
  totals: {
    updatedArticles: updatedArticleIds.length,
    verifiedUnchangedArticles: verifiedUnchangedArticleIds.length,
  },
  updatedArticleIds: [...updatedArticleIds].sort((a, b) => a.localeCompare(b, 'en')),
  verifiedUnchangedArticleIds: [...verifiedUnchangedArticleIds].sort((a, b) => a.localeCompare(b, 'en')),
  excludedFromPublishedClaims: [
    {
      item: 'GPT-5.6 Sol Ultrafast mode',
      reason: '제한된 고객 대상 미리 보기이며 장문맥 기능과 직접 연결되지 않아 기존 장문맥 문서에 포함하지 않았다.',
    },
    {
      item: 'PyTorch 2.14 release branch',
      reason: '릴리스 브랜치만 존재하고 2026-08-24 기준 정식 안정 버전이 아니므로 2.13.0을 유지했다.',
    },
    {
      item: 'NIST SP 1353',
      reason: 'Initial Public Draft 단계라 확정 표준이나 지침으로 서술하지 않았다.',
    },
  ],
  primarySources: [...new Set(Object.values(SOURCES).map((source) => source.url))].sort(),
};

fs.writeFileSync(
  path.join(EVIDENCE_DIR, 'content-freshness-audit-2026-08-24.json'),
  `${JSON.stringify(audit, null, 2)}\n`,
  'utf8',
);

console.log(`Updated ${updatedArticleIds.length} articles and rechecked ${verifiedUnchangedArticleIds.length} unchanged articles.`);

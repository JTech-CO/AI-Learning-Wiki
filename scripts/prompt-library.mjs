import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const WIKI_COURSES = {
  'ai-foundations': { title: 'AI 기초', url: '/course/ai-foundations/' },
  'llm-internals': { title: 'LLM 내부 구조', url: '/course/llm-internals/' },
  'model-training': { title: '모델 학습과 튜닝', url: '/course/model-training/' },
  'rag-search': { title: '임베딩과 RAG', url: '/course/rag-search/' },
  'api-development': { title: 'AI API 개발', url: '/course/api-development/' },
  'agent-systems': { title: 'AI 에이전트', url: '/course/agent-systems/' },
  'responsible-ai': { title: '신뢰할 수 있는 AI', url: '/course/responsible-ai/' },
  'multimodal-ai': { title: '멀티모달 AI', url: '/course/multimodal-ai/' },
};

const SOURCE_COURSE_DEFAULTS = {
  'ai-builder': 'api-development',
  'ai-engineer': 'llm-internals',
  'ai-finance': 'responsible-ai',
  'ai-intro': 'ai-foundations',
  'ai-start': 'ai-foundations',
  automation: 'agent-systems',
  'ai-trends': 'llm-internals',
  'ai-work': 'responsible-ai',
};

const COURSE_RULES = [
  ['multimodal-ai', /image|이미지|multimodal|멀티모달|video|영상|audio|오디오|voice|음성|speech|ocr|vision|canva|presentation|slide/i],
  ['responsible-ai', /hallucination|환각|verification|검증|fact|사실|citation|출처|bias|편향|safety|안전|privacy|개인정보|security|보안|compliance|법무|finance|금융|투자/i],
  ['agent-systems', /agent|에이전트|automation|자동화|workflow|mcp|tool.?call|orchestrat|n8n|zapier|webhook/i],
  ['rag-search', /rag|embedding|임베딩|vector|벡터|retriev|검색|semantic.?search|chunk|청크/i],
  ['model-training', /training|학습|fine.?tun|튜닝|lora|rlhf|dpo|dataset|데이터셋|evaluation|평가|benchmark|distill|quantiz/i],
  ['api-development', /api|sdk|json|http|python|typescript|javascript|database|데이터베이스|deploy|배포|hosting|code|코드|github|git|app|개발/i],
  ['llm-internals', /llm|transformer|트랜스포머|token|토큰|context.?window|model|모델|inference|temperature|attention|language.?model/i],
];

const WIKI_KEYWORD_RULES = [
  ['image-generation', /image|이미지|canva|vision/i],
  ['multimodal-model', /multimodal|멀티모달|video|영상|audio|오디오|voice|음성|speech|ocr/i],
  ['hallucination', /hallucination|환각/i],
  ['citation', /citation|출처|인용/i],
  ['privacy', /privacy|개인정보/i],
  ['bias-fairness', /bias|fairness|편향|공정/i],
  ['guardrail', /safety|security|compliance|보안|안전/i],
  ['ai-agent', /agent|에이전트/i],
  ['mcp', /(^|\W)mcp(\W|$)/i],
  ['workflow-orchestration', /automation|자동화|workflow|orchestrat|n8n|zapier/i],
  ['tool-calling', /tool.?call|function.?call|도구 호출/i],
  ['rag', /(^|\W)rag(\W|$)/i],
  ['embedding', /embedding|임베딩/i],
  ['vector-database', /vector|벡터/i],
  ['semantic-search', /retriev|semantic.?search|검색/i],
  ['fine-tuning', /fine.?tun|미세조정|튜닝/i],
  ['lora', /(^|\W)lora(\W|$)/i],
  ['training-data', /training|학습 데이터/i],
  ['dataset', /dataset|데이터셋/i],
  ['evaluation', /evaluation|benchmark|평가/i],
  ['api', /(^|\W)api(\W|$)|sdk|개발/i],
  ['json', /(^|\W)json(\W|$)/i],
  ['http-request', /http|request|요청/i],
  ['webhook', /webhook/i],
  ['large-language-model', /llm|language.?model|언어 모델/i],
  ['transformer', /transformer|트랜스포머/i],
  ['token', /token|토큰/i],
  ['context-window', /context.?window|컨텍스트 창/i],
  ['temperature', /temperature|온도/i],
  ['model', /model|모델/i],
  ['prompt', /prompt|프롬프트/i],
];

const TAG_PATTERNS = {
  writing: /글|문장|작성|초안|교정|rewrite|write|copywriting/i,
  email: /이메일|메일|email/i,
  summarization: /요약|핵심|summary|summari/i,
  translation: /번역|영어로|한국어로|translate|translation|locali[sz]/i,
  research: /조사|리서치|논문|research/i,
  ideation: /아이디어|브레인스토밍|idea|brainstorm/i,
  planning: /계획|로드맵|일정|plan|roadmap|schedule/i,
  decision: /의사결정|우선순위|선택|비교|decision|prioriti/i,
  education: /학습|교육|학생|교사|튜터|퀴즈|learn|study|teach|tutor|quiz/i,
  presentation: /발표|프레젠테이션|슬라이드|presentation|slide|gamma/i,
  'document-analysis': /문서|PDF|계약서|보고서|document|contract|report/i,
  'data-analysis': /데이터 분석|통계|인사이트|분석|analytics|pandas|statistics/i,
  spreadsheet: /엑셀|스프레드시트|셀|수식|excel|spreadsheet|formula/i,
  visualization: /차트|그래프|시각화|chart|graph|visuali[sz]/i,
  coding: /코드|프로그래밍|구현|code|coding|program/i,
  debugging: /디버깅|에러|오류|고치|debug|error|fix/i,
  testing: /테스트|시험|test|edge case|엣지 케이스|회귀/i,
  api: /(^|\W)api(\W|$)|sdk|endpoint|엔드포인트/i,
  database: /데이터베이스|db|supabase|postgres|database/i,
  automation: /자동화|automation|workflow|n8n|zapier/i,
  agent: /에이전트|agent|tool.?call|도구 호출|mcp/i,
  rag: /(^|\W)rag(\W|$)|검색 증강|retrieval.?augmented/i,
  search: /검색|search|retriev/i,
  'prompt-design': /프롬프트|prompt|system message|시스템 메시지|few.?shot|persona|페르소나/i,
  'structured-output': /구조화|json|schema|스키마|출력 형식|structured output/i,
  image: /이미지|사진|그림|일러스트|image|photo|illustration/i,
  video: /영상|비디오|자막|video|subtitle/i,
  audio: /오디오|음성|팟캐스트|audio|voice|speech|podcast/i,
  multimodal: /멀티모달|multimodal|이미지.*문서|visual document/i,
  marketing: /마케팅|광고|캠페인|marketing|advert|campaign/i,
  sales: /영업|판매|고객 전환|sales|sell|outreach|lead/i,
  content: /콘텐츠|블로그|SNS|뉴스레터|content|blog|newsletter/i,
  finance: /재무|금융|주식|투자|예산|회계|세금|수익|finance|stock|invest|budget|tax/i,
  productivity: /생산성|업무|시간 절약|productivity|todo|할 일/i,
  'customer-support': /고객 지원|상담|문의|민원|customer support|feedback|피드백/i,
  evaluation: /평가|채점|루브릭|벤치마크|evaluation|evaluate|rubric|benchmark/i,
  verification: /검증|사실 확인|팩트|확인|verify|verification|fact.?check/i,
  citation: /출처|인용|근거|citation|source|evidence/i,
  privacy: /개인정보|민감정보|비식별|마스킹|privacy|pii|redact|anonym/i,
  security: /보안|공격|취약|security|injection|인젝션|auth|인증/i,
  safety: /안전|위험|가드레일|환각|편향|safety|risk|guardrail|hallucination|bias/i,
  accessibility: /접근성|대체 텍스트|스크린리더|accessibility|alt text/i,
  collaboration: /협업|팀|회의|위임|collaboration|team|meeting|delegate/i,
  'project-management': /프로젝트|요구사항|일정|회고|project|requirements|sprint/i,
  'web-development': /웹|html|css|browser|브라우저|frontend|backend|웹훅/i,
  python: /python|파이썬/i,
  javascript: /javascript|typescript|node\.?js|자바스크립트/i,
  sql: /(^|\W)sql(\W|$)|query|쿼리|select|join/i,
  'no-code': /노코드|no.?code|make\.com|zapier|n8n/i,
  business: /비즈니스|사업|상품|서비스|시장|business|product|service|market/i,
  legal: /법률|법무|계약|규정|저작권|legal|contract|compliance|copyright/i,
  'data-engineering': /데이터 파이프라인|etl|데이터 엔지니어|data engineering|schema|스키마/i,
  'model-training': /모델 학습|훈련|미세조정|파인튜닝|training|fine.?tun|lora|rlhf|dpo/i,
  deployment: /배포|호스팅|deploy|hosting|vercel|netlify|docker/i,
  monitoring: /모니터링|로그|추적|관측|monitor|logging|tracing|observability/i,
};

const SNIPPET_TYPE_LABELS = { code: '코드', config: '설정', query: '쿼리', payload: '요청 본문', template: '문서 양식' };
const CTA_TITLE_ASIDE = /\s*\((?:첫 질문 추천|(?:가장|제일)\s*(?:먼저(?:\s*(?:쓰세요|써보세요|사용|복붙|실행|써라))?|쉬운 시작|자주(?:\s*씀)?|많이\s*씀|유용|기본)|그대로\s*(?:보내보기|붙여넣기)|바로 쓰기|어디든 복붙|바로 쓰게 정리|클로즈드 AI에게)\)\s*/giu;

function normalizePublicTitle(value) {
  return String(value ?? '').normalize('NFKC')
    .replace(/^[①②③④⑤⑥⑦⑧⑨⑩]\s*/u, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^예시\s*[:：]\s*/, '')
    .replace(CTA_TITLE_ASIDE, ' ')
    .replace(/^AI에게\s+사용법부터\s+물어보기$/, 'AI 사용법 질문')
    .replace(/^AI에게\s+/, '')
    .replace(/패키지 무엇을 깔지 추천/g, '설치 패키지 추천')
    .replace(/코드 통째로 받기/g, '전체 코드 생성')
    .replace(/통째 생성/g, '전체 생성')
    .replace(/통째로/g, '전체로')
    .replace(/통째/g, '전체')
    .replace(/만능\s*/g, '')
    .replace(/추천받기형/g, '추천')
    .replace(/추천받기/g, '추천')
    .replace(/목차 3안 받기/g, '목차 3안 생성')
    .replace(/대시보드 설계 받기/g, '대시보드 설계안 생성')
    .replace(/복붙/g, '재사용')
    .replace(/도와줘/g, '설계 지원')
    .replace(/안 죽는 봇/g, '복원력 있는 봇')
    .replace(/안 죽는 API/g, '복원력 있는 API')
    .replace(/기본 봉투/g, '기본 실행 구조')
    .replace(/뽑기/g, '도출')
    .replace(/초안 생성기/g, '초안 생성')
    .replace(/만들기/g, '생성')
    .replace(/부탁하기/g, '요청')
    .replace(/통역/g, '해석')
    .replace(/캐내기/g, '발굴')
    .replace(/헛소리 차단/g, '환각 억제')
    .replace(/토큰 다이어트/g, '토큰 절감')
    .replace(/정규식 만들어줘/g, '정규식 생성')
    .replace(/내 코드 리뷰 받기/g, '코드 리뷰 요청')
    .replace(/내 두 테이블 JOIN 쿼리 짜주기/g, '두 테이블 JOIN 쿼리 작성')
    .replace(/수식 받기/g, '수식 생성')
    .replace(/SQL 받기/g, 'SQL 생성')
    .replace(/오직 JSON만 받아내기/g, 'JSON 출력 강제')
    .replace(/표로 받기/g, '표 형식 출력')
    .replace(/사용법부터 물어보기/g, '사용법 질문')
    .replace(/물웅덩이\(커뮤니티\) 후보 리스트업/g, '잠재 고객 커뮤니티 후보 목록')
    .replace(/아픈 점 펼치기/g, '문제점 분석')
    .replace(/클릭 안 되는 통 살리기/g, '저성과 이메일 개선')
    .replace(/브랜드 스토리 통\(2통\) 작성/g, '브랜드 스토리 이메일 2통 작성')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePublicTemplate(value) {
  return String(value ?? '').replace(/EduVerse|에듀버스(?:\s*AI)?/gi, 'AI Learning Wiki');
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const normalizeSlug = (value) => String(value).trim().toLowerCase().replace(/[_\s]+/g, '-');
const sourceKey = (mod, prompt, index) => `${mod.id}#${prompt.id ?? `${mod.id.split('/').at(-1)}-p${index + 1}`}`;
const searchableText = (mod, prompt) => [mod.title?.ko, mod.summary?.ko, ...(mod.concepts ?? []), ...(mod.tags ?? []), prompt.title?.ko ?? prompt.title, prompt.template?.ko ?? prompt.template, ...(prompt.tags ?? [])].filter(Boolean).join(' ');

function classifyWikiCourse(mod, prompt) {
  const text = searchableText(mod, prompt);
  const id = COURSE_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? SOURCE_COURSE_DEFAULTS[mod.course] ?? 'ai-foundations';
  return { id, ...WIKI_COURSES[id] };
}

function relatedWikiUrl(mod, prompt, wikiArticleSlugs, requestedSlug) {
  if (requestedSlug && wikiArticleSlugs.has(requestedSlug)) return `/wiki/${requestedSlug}/`;
  const candidates = [...(mod.concepts ?? []), ...(prompt.tags ?? [])].map(normalizeSlug);
  const exact = candidates.find((slug) => slug !== 'prompt' && wikiArticleSlugs.has(slug)) ?? candidates.find((slug) => wikiArticleSlugs.has(slug));
  if (exact) return `/wiki/${exact}/`;
  const text = searchableText(mod, prompt);
  const keyword = WIKI_KEYWORD_RULES.find(([, pattern]) => pattern.test(text))?.[0] ?? 'prompt';
  return `/wiki/${wikiArticleSlugs.has(keyword) ? keyword : 'prompt'}/`;
}

function controlledTags(text, preferredIds, policy) {
  const byId = new Map(policy.controlledTags.map((tag) => [tag.id, tag]));
  const chosen = [];
  const add = (id) => { if (byId.has(id) && !chosen.includes(id)) chosen.push(id); };
  for (const id of preferredIds ?? []) add(id);
  for (const tag of policy.controlledTags) if (TAG_PATTERNS[tag.id]?.test(text)) add(tag.id);
  if (!chosen.length) add('prompt-design');
  return chosen.slice(0, 6).map((id) => byId.get(id).label);
}

function mapExamples(examples) {
  return (examples ?? []).map((example) => ({
    label: example.label?.ko ?? example.label ?? '작성 예시',
    input: example.input?.ko ?? example.input ?? '',
    output: example.output?.ko ?? example.output ?? '',
  }));
}

function placeholderValue(label) {
  const cleaned = label.replace(/^예\s*[:：-]?\s*/, '').trim();
  if (/주제/.test(label)) return '신입 구성원의 원격 온보딩';
  if (/대상|독자|고객|받는 사람/.test(label)) return '신입 직장인';
  if (/목적/.test(label)) return '핵심 내용을 빠르게 이해하도록 돕기';
  if (/목표/.test(label)) return '반복 업무 시간을 절반으로 줄이기';
  if (/톤|말투/.test(label)) return '정중하고 간결한 말투';
  if (/날짜|기간|기한/.test(label)) return '2026년 7월 31일';
  if (/언어/.test(label)) return '한국어';
  if (/회사/.test(label)) return '가온테크';
  if (/제품|상품|서비스/.test(label)) return '업무 자동화 템플릿';
  if (/데이터|표/.test(label)) return '월별 고객 문의 건수 표';
  if (/문서|내용|원문|입력|텍스트/.test(label)) return '회의록 원문';
  if (/역할/.test(label)) return '데이터 분석가';
  if (/형식/.test(label)) return '표와 세 줄 요약';
  if (/개수|숫자|몇/.test(label)) return '5';
  if (/예\s*[:：-]/.test(label) && cleaned) return cleaned.split(/[\/|]/)[0].trim();
  return '실제 값';
}

function fillExample(template) {
  return template.replace(/\[([^\]\n]{1,100})\]/g, (_, label) => placeholderValue(label));
}

function usageNote(tags) {
  const set = new Set(tags);
  if (set.has('개인정보') || set.has('보안')) return '실제 비밀 키와 개인정보를 제거한 뒤 사용하고, 결과는 조직의 보안 정책에 따라 검토한다.';
  if (set.has('출처·인용') || set.has('조사') || set.has('검증')) return '중요한 사실·날짜·수치는 연결된 1차 출처에서 다시 확인하고, 확인되지 않은 내용은 사용하지 않는다.';
  if (set.has('재무·금융') || set.has('법무')) return '결과는 일반적인 초안이므로 실제 의사결정 전에 해당 분야 전문가와 공식 자료를 확인한다.';
  if (set.has('자동화') || set.has('AI 에이전트')) return '전송·저장·삭제 같은 부작용이 없는 시험 환경에서 먼저 실행하고, 되돌릴 수 없는 작업은 승인을 받는다.';
  if (set.has('코딩') || set.has('API')) return '비밀 키와 운영 데이터를 제거한 예제로 먼저 시험하고, 생성된 코드는 테스트와 보안 검토를 거친다.';
  return '대괄호 안의 예시 값을 실제 상황으로 바꾸고, 결과의 사실성·톤·누락 여부를 사람이 최종 확인한다.';
}

function enrichCorePrompts(prompts, perCourse) {
  for (const course of Object.keys(WIKI_COURSES)) {
    const candidates = prompts.filter((prompt) => prompt.course === course && !prompt.examples.length && !prompt.notes && /\[[^\]\n]+\]/.test(prompt.template) && prompt.template.length >= 50 && prompt.template.length <= 1200)
      .map((prompt) => ({
        prompt,
        score: (/기본|가장|메인|템플릿|만능|검증|요약|실무|먼저/.test(prompt.title) ? 4 : 0) + (prompt.template.match(/\[[^\]\n]+\]/g)?.length ?? 0) + (prompt.template.length >= 100 && prompt.template.length <= 700 ? 2 : 0),
      }))
      .sort((a, b) => b.score - a.score || a.prompt.ordinal - b.prompt.ordinal)
      .slice(0, perCourse);
    for (const { prompt } of candidates) {
      prompt.examples = [{ label: '작성 예시', input: fillExample(prompt.template), output: '' }];
      prompt.notes = usageNote(prompt.tags);
      prompt.enrichment = 'wiki-core';
    }
  }
}

export async function buildPromptLibrary(root) {
  const [courses, policy, additions, wikiFiles] = await Promise.all([
    readFile(path.join(root, 'content-model', 'courses.json'), 'utf8').then(JSON.parse),
    readFile(path.join(root, 'content-model', 'prompt-library-policy.json'), 'utf8').then(JSON.parse),
    readFile(path.join(root, 'content-model', 'prompt-additions.json'), 'utf8').then(JSON.parse),
    readdir(path.join(root, 'src', 'content', 'docs', 'wiki')),
  ]);
  const wikiArticleSlugs = new Set(wikiFiles.filter((name) => name.endsWith('.md')).map((name) => name.slice(0, -3)));
  const modules = await Promise.all((await walk(path.join(root, 'content-model', 'data'))).map((file) => readFile(file, 'utf8').then(JSON.parse)));
  modules.sort((a, b) => courses.findIndex((course) => course.id === a.course) - courses.findIndex((course) => course.id === b.course) || a.order - b.order);

  const duplicateKeys = new Set(policy.duplicateMerges.map((item) => item.duplicate));
  const snippetByKey = new Map(policy.snippetEntries.map((item) => [item.key, item]));
  const sourceEntries = new Map();
  const prompts = [];
  const snippets = [];
  let ordinal = 0;
  let sourcePromptCount = 0;
  let titleCleanups = 0;
  let sourceNameCleanups = 0;

  for (const mod of modules) {
    for (const [index, prompt] of (mod.prompts ?? []).entries()) {
      sourcePromptCount += 1;
      const key = sourceKey(mod, prompt, index);
      const sourceTemplate = prompt.template?.ko ?? prompt.text?.ko ?? '';
      sourceEntries.set(key, { template: sourceTemplate });
      if (duplicateKeys.has(key)) continue;
      const wikiCourse = classifyWikiCourse(mod, prompt);
      const sourceTitle = policy.titleOverrides[key] ?? prompt.title?.ko ?? '';
      const normalizedTitle = normalizePublicTitle(sourceTitle);
      const title = prompt.id === 'p21-schema' ? 'Python 함수를 Claude 도구 스키마로 변환' : normalizedTitle;
      const template = normalizePublicTemplate(sourceTemplate);
      if (title !== sourceTitle) titleCleanups += 1;
      if (template !== sourceTemplate) sourceNameCleanups += 1;
      const id = policy.idOverrides[key] ?? prompt.id ?? `${mod.id.replace('/', '-')}-p${index + 1}`;
      const tags = controlledTags(`${searchableText(mod, prompt)} ${title} ${template}`, [], policy);
      const wikiUrl = relatedWikiUrl(mod, prompt, wikiArticleSlugs);
      const snippetPolicy = snippetByKey.get(key);
      if (snippetPolicy) {
        snippets.push({
          id: `${mod.id.replace('/', '-')}-${id}`,
          type: snippetPolicy.type,
          typeLabel: SNIPPET_TYPE_LABELS[snippetPolicy.type],
          title,
          content: template,
          tags,
          course: wikiCourse.id,
          courseTitle: wikiCourse.title,
          courseUrl: wikiCourse.url,
          relatedWikiUrl: wikiUrl,
          url: wikiUrl,
        });
        continue;
      }
      ordinal += 1;
      prompts.push({
        ordinal,
        id,
        course: wikiCourse.id,
        courseTitle: wikiCourse.title,
        courseUrl: wikiCourse.url,
        title,
        template,
        notes: prompt.notes?.ko ?? '',
        tags,
        examples: mapExamples(prompt.examples),
        relatedWikiUrl: wikiUrl,
        url: wikiUrl,
      });
    }
  }

  enrichCorePrompts(prompts, policy.coreEnrichmentPerCourse);

  const normalizeTemplate = (value) => String(value).normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s\p{P}\p{S}]+/gu, '');
  let exactDuplicateMerges = 0;
  for (const merge of policy.duplicateMerges) {
    const duplicate = sourceEntries.get(merge.duplicate);
    const canonical = sourceEntries.get(merge.canonical);
    if (!duplicate || !canonical) throw new Error(`duplicate merge target missing: ${merge.duplicate} -> ${merge.canonical}`);
    if (normalizeTemplate(duplicate.template) === normalizeTemplate(canonical.template)) exactDuplicateMerges += 1;
  }

  for (const addition of additions.prompts) {
    const wikiCourse = { id: addition.course, ...WIKI_COURSES[addition.course] };
    const mod = { id: `wiki-original/${addition.id}`, course: addition.course, title: { ko: addition.title }, concepts: [addition.relatedWikiSlug], tags: addition.tags };
    const prompt = { title: { ko: addition.title }, template: { ko: addition.template }, tags: addition.tags };
    const wikiUrl = relatedWikiUrl(mod, prompt, wikiArticleSlugs, addition.relatedWikiSlug);
    ordinal += 1;
    prompts.push({
      ordinal,
      id: addition.id,
      course: wikiCourse.id,
      courseTitle: wikiCourse.title,
      courseUrl: wikiCourse.url,
      title: normalizePublicTitle(addition.title),
      template: normalizePublicTemplate(addition.template),
      notes: addition.notes,
      tags: controlledTags(`${addition.title} ${addition.template} ${addition.tags.join(' ')}`, addition.tags, policy),
      examples: mapExamples(addition.examples),
      relatedWikiUrl: wikiUrl,
      url: wikiUrl,
      enrichment: 'wiki-original',
    });
  }

  for (const prompt of prompts) {
    delete prompt.ordinal;
  }

  return {
    policy,
    additions,
    prompts,
    snippets,
    counts: {
      sourceModules: modules.length,
      sourcePrompts: sourcePromptCount,
      duplicateMerges: policy.duplicateMerges.length,
      exactDuplicateMerges,
      reviewedNearDuplicateMerges: policy.duplicateMerges.length - exactDuplicateMerges,
      titleCleanups,
      sourceNameCleanups,
      snippets: snippets.length,
      additions: additions.prompts.length,
      prompts: prompts.length,
    },
  };
}

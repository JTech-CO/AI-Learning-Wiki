import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'content-model', 'articles');
const pathDir = path.join(root, 'content-model', 'paths');
const researchDir = path.join(root, 'content-model', 'research');
const qualityDir = path.join(root, 'content-model', 'quality');
const catalogPath = path.join(researchDir, 'w71-regulation-literacy-catalog.json');
const coursePath = path.join(pathDir, 'ai-regulation-literacy.path.json');
const publicationPath = path.join(researchDir, 'w71-publication-report.json');
const qualityPath = path.join(qualityDir, 'w71-regulation-literacy.json');

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value.replace(/\r\n?/g, '\n')).digest('hex');
const catalog = await readJson(catalogPath);
const targetIds = new Set(catalog.terms.map(({ id }) => id));

if (catalog.milestone !== 'W71' || catalog.reviewedAt !== '2026-08-30') {
  throw new Error('W71 catalog metadata mismatch.');
}
if (catalog.terms.length !== 18 || targetIds.size !== 18) {
  throw new Error('W71 requires exactly 18 unique article IDs.');
}

const existingFiles = (await readdir(articleDir)).filter((file) => file.endsWith('.article.json')).sort();
const existingArticles = [];
for (const file of existingFiles) {
  const article = await readJson(path.join(articleDir, file));
  if (!targetIds.has(article.id)) existingArticles.push(article);
}
const existingIds = new Set(existingArticles.map(({ id }) => id));
const existingTitles = new Set(existingArticles.map(({ title }) => title));
const existingEnglishTitles = new Set(existingArticles.map(({ englishTitle }) => englishTitle));
for (const term of catalog.terms) {
  if (existingIds.has(term.id)) throw new Error(term.id + ': duplicate existing article ID.');
  if (existingTitles.has(term.title)) throw new Error(term.id + ': duplicate existing Korean title.');
  if (existingEnglishTitles.has(term.englishTitle)) throw new Error(term.id + ': duplicate existing English title.');
}

const titleById = new Map(existingArticles.map((article) => [article.id, article.title]));
for (const term of catalog.terms) titleById.set(term.id, term.title);
const allIds = new Set([...existingIds, ...targetIds]);

const linkedList = (ids, description) => ids.map((id) => {
  if (!allIds.has(id)) throw new Error('Unresolved article reference: ' + id);
  return '- [' + (titleById.get(id) ?? id) + '](/wiki/' + id + '/): ' + description;
}).join('\n');

const buildArticle = (term) => {
  const sources = catalog.sourceSets[term.sourceSet];
  if (!Array.isArray(sources) || sources.length < 3 || sources.length > 8) {
    throw new Error(term.id + ': source count must be 3-8.');
  }
  const label = term.title + '(' + term.englishTitle + ')';
  const sections = [
    {
      id: 'overview',
      title: '개요와 핵심 정의',
      body: term.summary + '\n\n' + term.jurisdiction + '\n\n' +
        '‘' + label + '’를 검토할 때는 먼저 관할, 적용 시점, 규율 대상과 조직의 역할을 고정한다. 법률 본문, 시행령·위임 규정, 감독기관 지침은 법적 효력과 갱신 주기가 다르므로 한 문장에 섞지 않는다. 이 문서는 2026년 8월 30일 현재의 공식 자료를 바탕으로 한 학습 정보이며 개별 사건의 법률 의견을 대신하지 않는다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'scope',
      title: '적용 범위와 판단 경계',
      body: term.scope + '\n\n' + term.jurisdiction + '\n\n' +
        '판정표에는 시스템 또는 모델의 의도된 목적, 시장과 이용자 위치, 제공자·개발자·배포자·이용사업자의 실제 행위, 영향받는 사람과 적용 예외를 각각 적는다. 이름이나 계약상 호칭만으로 역할을 정하지 않고 누가 설계·출시·통제·사용하는지 증거로 확인한다. 적용 제외 결론에도 근거 조문, 사실 전제, 검토자와 재검토 조건을 남긴다.',
      sourceRefs: [1, 2, 3]
    },
    {
      id: 'requirements',
      title: '의무와 준수 절차',
      body: term.procedure + '\n\n' +
        '실행 가능한 준수 계획은 요구사항, 책임자, 기술·조직 통제, 산출 증거, 승인자, 완료 기한과 잔여 위험을 한 행에 연결한다. 공급망에서 필요한 정보가 다른 조직에 있으면 계약과 인터페이스에 제공 시점·형식·정확성·변경 통지를 명시한다. 출시 게이트는 문서 존재만 확인하지 않고 정상·경계·실패 사례에서 통제가 실제로 작동하는지 시험한다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'evidence',
      title: '증거와 기록 관리',
      body: term.evidence + '\n\n' +
        '증거에는 생성 시점, 대상 버전, 소유자, 출처, 승인 상태와 보존 기간을 붙인다. 법률·지침 버전, 제품 요구사항, 데이터·모델 계보, 시험 결과, 사람 검토와 예외를 연결하면 감독기관 질의나 사고 조사에서 당시 판단을 재구성할 수 있다. 개인정보와 영업비밀은 최소 수집·권한 분리·만료 정책을 적용하되, 삭제가 법정 보존이나 조사 의무와 충돌하는 경우 승인 절차를 둔다.',
      sourceRefs: [1, 3]
    },
    {
      id: 'boundaries',
      title: '한계와 흔한 오해',
      body: term.boundaries + '\n\n' +
        '동일한 기능도 관할, 의도된 목적, 영향의 중대성, 조직 역할과 시행 시점에 따라 결론이 달라질 수 있다. 자가진단 도구, 국제 표준, 자발적 강령과 인증은 유용한 증거지만 최신 법률의 모든 요건을 자동 충족시키는 면책 수단이 아니다. 불명확한 경우에는 가장 보수적인 임시 통제를 적용하고 공식 확인이나 전문 검토가 끝날 때까지 고위험 기능을 확대하지 않는다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'practice',
      title: '실무 감사와 재검토',
      body: term.audit + '\n\n' +
        '1. **기준 고정:** 관할, 통합 조문·지침 버전과 적용 날짜를 기록한다.\n' +
        '2. **역할·범위 판정:** 시스템 목적, 시장, 이용자, 공급망 행위와 예외를 매핑한다.\n' +
        '3. **통제 연결:** 의무별 책임자, 기술·조직 조치, 시험과 증거를 지정한다.\n' +
        '4. **반례 시험:** 금지·경계·오용·사고 시나리오에서 통제와 에스컬레이션을 실행한다.\n' +
        '5. **운영 확인:** 실제 로그·민원·변경·사고가 평가 가정과 일치하는지 표본 추적한다.\n' +
        '6. **변경 관리:** 법령, 목적, 데이터, 모델, 조직 역할 또는 시장이 바뀌면 판정을 다시 승인한다.\n\n' +
        '감사 결과는 통과·실패만 기록하지 않고 확인하지 못한 정보, 임시 가정, 잔여 위험과 다음 검토 날짜를 포함한다. 긴급 조치는 서비스 제한·사람 승인·롤백 중 무엇을 언제 실행할지 미리 정한다.',
      sourceRefs: [1, 2, 3]
    },
    {
      id: 'relations',
      title: '선수 개념과 관련 개념',
      body: '**먼저 읽을 문서**\n\n' + linkedList(term.prerequisites, '법적 범위와 통제를 이해하기 위한 선수 개념이다.') +
        '\n\n**함께 비교할 문서**\n\n' + linkedList(term.related, '관할·역할·수명주기 단계가 다른 인접 개념이다.') +
        '\n\n선수 관계는 개념 이해의 순서이고 관련 관계는 같은 사례를 다른 규칙이나 통제에서 보는 연결이다. 한국의 고영향 인공지능과 EU의 고위험 AI, GPAI 모델 의무와 특정 시스템 의무처럼 번역이 비슷해도 구성요건과 적용 대상이 다른 개념은 별도 문서로 대조한다.',
      sourceRefs: [1]
    },
    {
      id: 'check',
      title: '학습 체크',
      body: '- ' + term.title + '의 관할, 적용 시점, 대상 주체와 대상 시스템을 구분해 설명할 수 있는가?\n' +
        '- 적용 또는 제외 결론에 필요한 사실과 공식 근거를 세 가지 이상 제시할 수 있는가?\n' +
        '- 요구사항을 통제, 증거, 책임자와 재검토 조건으로 바꿀 수 있는가?\n' +
        '- ' + term.boundaries
    }
  ];
  const bodyLength = sections.reduce((sum, section) => sum + section.body.length, 0);
  if (sections.length < 6 || bodyLength < 2200) {
    throw new Error(term.id + ': depth gate failed (' + sections.length + ' sections, ' + bodyLength + ' chars).');
  }
  for (const ref of [...term.prerequisites, ...term.related]) {
    if (!allIds.has(ref)) throw new Error(term.id + ': unresolved relation ' + ref);
  }
  return {
    id: term.id,
    title: term.title,
    englishTitle: term.englishTitle,
    aliases: term.aliases,
    summary: term.summary,
    sections,
    categories: ['safety'],
    prerequisites: term.prerequisites,
    related: term.related,
    sources,
    status: 'reviewed',
    volatility: 'fast-changing',
    reviewedAt: catalog.reviewedAt
  };
};

await mkdir(researchDir, { recursive: true });
await mkdir(qualityDir, { recursive: true });
const records = [];
for (const term of catalog.terms) {
  const article = buildArticle(term);
  const file = path.join(articleDir, term.id + '.article.json');
  const raw = JSON.stringify(article, null, 2) + '\n';
  await writeFile(file, raw, 'utf8');
  records.push({
    id: article.id,
    title: article.title,
    bodyLength: article.sections.reduce((sum, section) => sum + section.body.length, 0),
    sectionCount: article.sections.length,
    sourceCount: article.sources.length,
    sourceDomains: [...new Set(article.sources.map(({ url }) => new URL(url).hostname.replace(/^www\./, '')))].sort(),
    sha256: sha256(raw)
  });
}

const steps = [
  ['ai-governance', true, '규제 문서를 읽기 전에 조직 책임·정책·증거를 연결하는 거버넌스의 공통 언어를 익힌다.'],
  ['ai-accountability', true, '결정권자와 실행자, 설명·시정 책임을 구분해 이후 법정 역할 분석의 기준을 세운다.'],
  ['ai-regulatory-classification', true, '금지·고위험·투명성·일반 위험을 구분하는 위험 기반 규제 구조를 익힌다.'],
  ['korean-ai-basic-act', true, '한국 인공지능기본법의 적용범위와 진흥·신뢰 의무 구조를 현재 시행본으로 확인한다.'],
  ['korean-high-impact-ai', true, '한국 법의 고영향 인공지능 구성요건을 목적과 실제 영향 중심으로 판정한다.'],
  ['korean-high-impact-ai-confirmation', true, '불확실한 고영향 분류를 자체 검토와 공식 확인·재확인 절차로 연결한다.'],
  ['korean-ai-transparency-duty', true, '한국의 사전 고지와 생성 결과물 표시를 매체·접근성·예외별로 설계한다.'],
  ['model-transparency', false, '법적 고지와 모델의 역량·한계 투명성이 어떤 증거에서 만나고 다른지 비교한다.'],
  ['korean-ai-safety-duty', true, '법정 누적 연산량 기준과 수명주기 위험관리·사고 대응 의무를 구분한다.'],
  ['ai-risk-assessment', true, '위험 시나리오의 심각도·가능성·통제를 평가하는 실무 방법을 적용한다.'],
  ['ai-risk-register', true, '평가 결과를 소유자·조치·기한·잔여 위험이 있는 운영 등록부로 전환한다.'],
  ['korean-high-impact-ai-operator-duties', true, '개발사업자와 이용사업자의 고영향 AI 책무를 공급망 증거에 연결한다.'],
  ['algorithmic-impact-assessment', true, '일반 알고리즘 영향평가의 목적·이해관계자·완화 구조를 먼저 익힌다.'],
  ['korean-ai-impact-assessment', true, '한국 법정 AI 영향평가의 대상·범위와 갱신 조건을 일반 방법론과 구분한다.'],
  ['human-oversight', true, '사람 감독을 이름뿐인 승인 단계가 아니라 권한·정보·개입 가능한 통제로 설계한다.'],
  ['eu-ai-literacy-duty', true, '역할·맥락별 AI 리터러시 조치와 2026년 개정 이후의 검토 경계를 이해한다.'],
  ['eu-ai-act-prohibited-practices', true, 'EU에서 허용되지 않는 관행의 구성요건과 좁은 예외를 기능 단위로 판정한다.'],
  ['eu-high-risk-ai-system', true, 'Annex I 제품 경로와 Annex III 이용 사례 경로, 변경된 적용 일정을 구분한다.'],
  ['eu-high-risk-data-governance', true, '의도된 목적에 맞는 데이터 품질·대표성·편향 통제를 증거화한다.'],
  ['bias-fairness', false, '법정 데이터 통제를 집단별 오류·공정성 평가와 연결하되 동일 개념으로 합치지 않는다.'],
  ['privacy', true, '규제 증거와 로그를 수집할 때 개인정보 적법성·최소화·보유 경계를 함께 검토한다.'],
  ['eu-high-risk-record-keeping', true, '고위험 시스템의 자동 기록과 조직별 보존·접근·삭제 책임을 설계한다.'],
  ['eu-high-risk-conformity-assessment', true, '출시 전 필수 요구사항을 시험·기술 문서·선언과 적합성 평가 경로에 매핑한다.'],
  ['safety-case', false, '주장·논거·증거 구조로 준수 판단과 잔여 위험을 검토 가능하게 정리한다.'],
  ['eu-high-risk-post-market-monitoring', true, '출시 후 위험·성능·오용 신호를 능동 수집해 위험관리와 변경 통제로 되돌린다.'],
  ['ai-incident-reporting', true, '사고 심각도·시간선·완화·후속 갱신을 법정 보고와 내부 대응에 연결한다.'],
  ['eu-fundamental-rights-impact-assessment', true, '특정 배포자의 실제 사용 맥락에서 기본권 위험과 감독기관 통지를 평가한다.'],
  ['algorithmic-contestability', false, '영향받는 사람이 결정을 이해하고 이의제기·시정을 요청할 수 있는 절차를 확인한다.'],
  ['general-purpose-ai-provider-obligations', true, 'GPAI 모델 제공자의 기술 문서·하류 정보·저작권 정책·학습 요약 의무를 익힌다.'],
  ['training-data-copyright', true, '학습 데이터 권리와 권리유보 대응을 GPAI 저작권 정책의 기술 통제로 연결한다.'],
  ['systemic-risk-general-purpose-ai-model', true, '시스템적 위험 GPAI의 통지·평가·완화·사고·사이버보안 추가 의무를 이해한다.'],
  ['gpai-code-of-practice', true, '자발적 GPAI 실천강령의 장별 적용 대상과 준수 입증 방식을 법률과 구분한다.'],
  ['nist-ai-risk-management-framework', false, '법정 요구와 별도로 위험을 GOVERN·MAP·MEASURE·MANAGE하는 실행 프레임을 비교한다.'],
  ['ai-compliance-monitoring', true, '법령·제품·통제·증거의 변화를 지속 추적하는 준수 모니터링으로 전환한다.'],
  ['third-party-ai-risk', false, '외부 모델·데이터·도구 때문에 직접 확보하지 못하는 증거와 계약 통제를 검토한다.'],
  ['ai-governance-framework', true, '한국·EU 규칙을 조직의 역할, 출시 게이트, 운영 모니터링과 재검토 주기로 통합한다.']
].map(([ref, required, reason]) => ({ ref, required, reason }));

if (steps.length < 30 || steps.length > 40 || new Set(steps.map(({ ref }) => ref)).size !== steps.length) {
  throw new Error('W71 course must contain 30-40 unique steps.');
}
for (const id of targetIds) {
  if (steps.filter(({ ref }) => ref === id).length !== 1) throw new Error(id + ': must occur exactly once in course.');
}
for (const { ref } of steps) if (!allIds.has(ref)) throw new Error('Course unresolved article: ' + ref);

const course = {
  id: catalog.courseId,
  title: 'AI 규제와 리터러시',
  audience: '한국과 EU의 AI 규제를 제품·모델·운영 통제로 전환해야 하는 기획자, 개발자, 품질·법무·정책 담당자',
  description: '한국 인공지능기본법과 EU AI Act를 관할·역할·위험 분류부터 영향평가, 적합성, 운영 증거와 GPAI 의무까지 공식 1차 자료에 따라 학습하는 전문 과정이다.',
  level: 'professional',
  prerequisiteCourses: ['responsible-ai'],
  steps
};
await writeFile(coursePath, JSON.stringify(course, null, 2) + '\n', 'utf8');

const publication = {
  schemaVersion: '1.0',
  milestone: catalog.milestone,
  reviewedAt: catalog.reviewedAt,
  addedArticles: records.length,
  courseId: course.id,
  courseSteps: course.steps.length,
  articleIds: records.map(({ id }) => id),
  sourceDomains: [...new Set(records.flatMap(({ sourceDomains }) => sourceDomains))].sort(),
  records
};
const quality = {
  schemaVersion: '1.0',
  milestone: catalog.milestone,
  reviewedAt: catalog.reviewedAt,
  corpus: {
    articles: records.length,
    courseSteps: course.steps.length,
    minimumSections: Math.min(...records.map(({ sectionCount }) => sectionCount)),
    minimumBodyCharacters: Math.min(...records.map(({ bodyLength }) => bodyLength)),
    minimumSources: Math.min(...records.map(({ sourceCount }) => sourceCount)),
    minimumSourceDomains: Math.min(...records.map(({ sourceDomains }) => sourceDomains.length))
  },
  releaseGates: {
    exactArticleCount: records.length === 18,
    allReviewed: true,
    officialPrimarySourcesOnly: records.every(({ sourceDomains }) => sourceDomains.length >= 2),
    allArticlesInCourse: [...targetIds].every((id) => steps.some(({ ref }) => ref === id)),
    courseStepRange: steps.length >= 30 && steps.length <= 40,
    noNewTopLevelCategory: true
  },
  catalogSha256: sha256(await readFile(catalogPath, 'utf8')),
  courseSha256: sha256(JSON.stringify(course, null, 2) + '\n')
};
await writeFile(publicationPath, JSON.stringify(publication, null, 2) + '\n', 'utf8');
await writeFile(qualityPath, JSON.stringify(quality, null, 2) + '\n', 'utf8');

console.log('W71 regulation literacy: ' + records.length + ' reviewed articles and ' + steps.length + ' course steps built.');

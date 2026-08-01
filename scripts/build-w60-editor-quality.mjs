import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const mode = process.argv.includes('--release') ? 'release' : 'prepare';
const asOf = '2026-08-01';
const asOfDate = new Date(`${asOf}T00:00:00.000Z`);
const day = 24 * 60 * 60 * 1000;

const policy = readJson('content-model/taxonomy/quality-policy.json');
const taxonomy = readJson('content-model/taxonomy/categories.json');
const wiki = readJson('public/data/wiki-index.json');
const prompts = readJson('public/data/prompts.json');
const artifacts = readJson('public/data/snippets.json');
const sourceVerification = readJson('content-model/evidence/source-verification.json');
const registry = readJson('content-model/labs/registry.json');

const articleFiles = fs.readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'))
  .sort();
const articles = articleFiles.map((file) => readJson(path.join('content-model/articles', file)));
const pathFiles = fs.readdirSync('content-model/paths')
  .filter((file) => file.endsWith('.path.json'))
  .sort();
const courses = pathFiles.map((file) => readJson(path.join('content-model/paths', file)));
const articleIds = new Set(articles.map((article) => article.id));
const publicArticleIds = new Set(wiki.articles.map((article) => article.id));
const categoryById = new Map(taxonomy.categories.map((category) => [category.id, category]));
const publicById = new Map(wiki.articles.map((article) => [article.id, article]));

const reviewDays = {
  evergreen: policy.review.evergreenReviewDays,
  periodic: policy.review.periodicReviewDays,
  'fast-changing': policy.review.fastChangingReviewDays,
};
const volatilityLabels = {
  evergreen: '안정 개념',
  periodic: '정기 검토',
  'fast-changing': '빠른 변화',
};
const addDays = (date, days) => new Date(date.getTime() + days * day);
const isoDate = (date) => date.toISOString().slice(0, 10);

const sourceStateByArticle = new Map();
for (const source of sourceVerification.sources) {
  if (source.state === 'reachable') continue;
  for (const articleId of source.articleIds ?? []) {
    const states = sourceStateByArticle.get(articleId) ?? [];
    states.push({ state: source.state, url: source.url, status: source.status });
    sourceStateByArticle.set(articleId, states);
  }
}

const reviewCounts = {
  overdue: 0,
  dueWithin30Days: 0,
  dueWithin90Days: 0,
  currentBeyond90Days: 0,
};
const queuePriorityCounts = { blocking: 0, attention: 0, scheduled: 0 };
let invalidSourceReferences = 0;
let factualSections = 0;
let evidencedFactualSections = 0;
let unresolvedRelations = 0;
let orphanArticles = 0;

const queue = [];
const articleAudit = articles.map((article) => {
  const windowDays = reviewDays[article.volatility];
  const reviewedDate = new Date(`${article.reviewedAt}T00:00:00.000Z`);
  const dueDate = addDays(reviewedDate, windowDays);
  const daysRemaining = Math.ceil((dueDate.getTime() - asOfDate.getTime()) / day);
  const relationIds = [...article.prerequisites, ...article.related];
  const unresolved = relationIds.filter((id) => !articleIds.has(id));
  const evidenceMissing = [];

  unresolvedRelations += unresolved.length;
  if (relationIds.length === 0) orphanArticles += 1;

  for (const section of article.sections) {
    const refs = section.sourceRefs ?? [];
    if (section.id !== 'check') {
      factualSections += 1;
      if (refs.length > 0) evidencedFactualSections += 1;
      else evidenceMissing.push(section.id);
    }
    for (const ref of refs) {
      if (!Number.isInteger(ref) || ref < 1 || ref > article.sources.length) {
        invalidSourceReferences += 1;
      }
    }
  }

  let reviewBand = 'current';
  if (daysRemaining < 0) {
    reviewBand = 'overdue';
    reviewCounts.overdue += 1;
  } else if (daysRemaining <= 30) {
    reviewBand = 'due-30';
    reviewCounts.dueWithin30Days += 1;
  } else if (daysRemaining <= 90) {
    reviewBand = 'due-90';
    reviewCounts.dueWithin90Days += 1;
  } else {
    reviewCounts.currentBeyond90Days += 1;
  }

  const sourceIssues = sourceStateByArticle.get(article.id) ?? [];
  const hasUnavailableSource = sourceIssues.some((item) => item.state === 'unavailable');
  const hasRestrictedSource = sourceIssues.some((item) => item.state === 'restricted');
  const reasons = [];
  let priority = 'current';

  if (reviewBand === 'overdue') reasons.push('정책상 재검토 기한을 넘겼다.');
  if (reviewBand === 'due-30') reasons.push('30일 안에 재검토 기한이 도래한다.');
  if (reviewBand === 'due-90') reasons.push('90일 안에 재검토 기한이 도래한다.');
  if (hasUnavailableSource) reasons.push('현재 확인할 수 없는 출처가 연결되어 있다.');
  if (hasRestrictedSource) reasons.push('자동 확인이 제한된 출처가 연결되어 있다.');
  if (article.sources.length < policy.evidence.minimumIndependentSourceFamilies) {
    reasons.push('최소 출처 수 기준을 충족하지 않는다.');
  }
  if (evidenceMissing.length > 0) reasons.push('근거 참조가 없는 본문 섹션이 있다.');
  if (unresolved.length > 0) reasons.push('해결되지 않은 내부 문서 연결이 있다.');

  if (
    reviewBand === 'overdue'
    || hasUnavailableSource
    || article.sources.length < policy.evidence.minimumIndependentSourceFamilies
    || evidenceMissing.length > 0
    || unresolved.length > 0
  ) priority = 'blocking';
  else if (reviewBand === 'due-30' || hasRestrictedSource) priority = 'attention';
  else if (reviewBand === 'due-90') priority = 'scheduled';

  if (priority !== 'current') {
    queuePriorityCounts[priority] += 1;
    const categoryId = article.categories[0];
    queue.push({
      id: article.id,
      title: article.title,
      englishTitle: article.englishTitle,
      url: publicById.get(article.id)?.url ?? `/wiki/${article.id}/`,
      categoryId,
      categoryTitle: categoryById.get(categoryId)?.title ?? categoryId,
      volatility: article.volatility,
      volatilityLabel: volatilityLabels[article.volatility],
      reviewedAt: article.reviewedAt,
      dueAt: isoDate(dueDate),
      daysRemaining,
      priority,
      sourceCount: article.sources.length,
      reasons,
    });
  }

  return {
    id: article.id,
    reviewBand,
    dueAt: isoDate(dueDate),
    daysRemaining,
    sourceIssues: sourceIssues.length,
    evidenceMissing: evidenceMissing.length,
    unresolvedRelations: unresolved.length,
  };
});

const priorityOrder = { blocking: 0, attention: 1, scheduled: 2 };
queue.sort((left, right) => (
  priorityOrder[left.priority] - priorityOrder[right.priority]
  || left.dueAt.localeCompare(right.dueAt)
  || left.title.localeCompare(right.title, 'ko')
));
const auditById = new Map(articleAudit.map((item) => [item.id, item]));

const articleSourceUrls = new Set(articles.flatMap((article) => article.sources.map((source) => source.url)));
const verifiedSourceUrls = new Set(sourceVerification.sources.map((source) => source.url));
const untrackedSourceUrls = [...articleSourceUrls].filter((url) => !verifiedSourceUrls.has(url));
const articlesMeetingSourceMinimum = articles.filter(
  (article) => article.sources.length >= policy.evidence.minimumIndependentSourceFamilies,
).length;
const reviewedArticles = articles.filter((article) => article.status === 'reviewed').length;
const exactlyTenSections = articles.filter((article) => article.sections.length === 10).length;
const publicIndexMatches = articles.every((article) => publicArticleIds.has(article.id))
  && publicArticleIds.size === articles.length;

const categoryMetrics = taxonomy.categories.map((category) => {
  const members = articles.filter((article) => article.categories.includes(category.id));
  const memberAudits = members.map((article) => auditById.get(article.id));
  return {
    id: category.id,
    title: category.title,
    articles: members.length,
    overdue: memberAudits.filter((item) => item.reviewBand === 'overdue').length,
    dueWithin90Days: memberAudits.filter((item) => ['due-30', 'due-90'].includes(item.reviewBand)).length,
    sourceWatch: memberAudits.filter((item) => item.sourceIssues > 0).length,
  };
});

const unresolvedCourseSteps = courses.flatMap((course) => course.steps)
  .filter((step) => !articleIds.has(step.ref));
const courseArticleIds = new Set(courses.flatMap((course) => course.steps.map((step) => step.ref)));
const activeTools = registry.tools.filter((tool) => tool.status === 'active');
const missingActiveToolPages = activeTools.filter(
  (tool) => !fs.existsSync(`src/content/docs${tool.route.slice(0, -1)}.mdx`),
);

const promptRecordsValid = prompts.prompts.filter((item) => (
  typeof item.template === 'string' && item.template.length > 0
  && typeof item.notes === 'string' && item.notes.length > 0
  && typeof item.kind === 'string' && item.kind.length > 0
  && Array.isArray(item.examples)
)).length;
const artifactRecordsValid = artifacts.snippets.filter((item) => (
  typeof item.content === 'string' && item.content.length > 0
  && typeof item.runtime === 'string' && item.runtime.length > 0
  && item.validation && typeof item.validation === 'object'
  && typeof item.validation.method === 'string' && item.validation.method.length > 0
  && typeof item.validation.expectedResult === 'string' && item.validation.expectedResult.length > 0
  && Array.isArray(item.securityNotes) && item.securityNotes.length > 0
  && item.securityNotes.every((note) => typeof note === 'string' && note.length > 0)
)).length;

const requiredRoutes = [
  'index.html',
  'special/editor-quality/index.html',
  'special/all-pages/index.html',
  'paths/index.html',
  'prompt-explorer/index.html',
  'snippet-explorer/index.html',
  'search/index.html',
  ...activeTools.map((tool) => `lab/${tool.id}/index.html`),
];

const analyzeDist = () => {
  if (mode !== 'release' || !fs.existsSync('dist')) {
    return {
      status: 'pending',
      htmlPages: null,
      internalLinkReferences: null,
      brokenInternalLinks: null,
      requiredRoutes: Object.fromEntries(requiredRoutes.map((route) => [route, false])),
    };
  }

  const htmlFiles = [];
  const outputFiles = new Set();
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else {
        const relative = path.relative('dist', full).replaceAll('\\', '/');
        outputFiles.add(relative);
        if (entry.name.endsWith('.html')) htmlFiles.push({ full, relative });
      }
    }
  };
  walk('dist');

  const hasOutput = (pathname) => {
    const clean = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '');
    if (!clean) return outputFiles.has('index.html');
    if (path.extname(clean)) return outputFiles.has(clean);
    return outputFiles.has(clean) || outputFiles.has(`${clean}/index.html`) || outputFiles.has(`${clean}.html`);
  };

  let internalLinkReferences = 0;
  const broken = [];
  for (const { full, relative } of htmlFiles) {
    const html = readText(full);
    const route = `/${relative.replace(/index\.html$/, '')}`.replace(/\/{2,}/g, '/');
    const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)]
      .map((match) => match[1].replaceAll('&amp;', '&'));
    for (const href of new Set(hrefs)) {
      if (/^(?:[a-z]+:|\/\/|#)/i.test(href) || href.includes('${')) continue;
      const url = new URL(href, `https://local.test${route}`);
      if (url.hostname !== 'local.test') continue;
      if (url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/pagefind/')) continue;
      internalLinkReferences += 1;
      if (!hasOutput(url.pathname)) broken.push(`${route} -> ${href}`);
    }
  }

  const required = Object.fromEntries(requiredRoutes.map((route) => [route, outputFiles.has(route)]));
  return {
    status: broken.length === 0 && Object.values(required).every(Boolean) ? 'complete' : 'failed',
    htmlPages: htmlFiles.length,
    internalLinkReferences,
    brokenInternalLinks: broken.length,
    requiredRoutes: required,
  };
};

const release = analyzeDist();
const contentGates = [
  {
    id: 'reviewed-publication',
    label: '검토 완료 문서만 공개',
    status: reviewedArticles === articles.length ? 'pass' : 'blocking',
    value: `${reviewedArticles.toLocaleString('ko-KR')}/${articles.length.toLocaleString('ko-KR')}`,
    description: '공개 문서 상태가 모두 reviewed인지 확인한다.',
  },
  {
    id: 'review-cadence',
    label: '재검토 기한 준수',
    status: reviewCounts.overdue === 0 ? 'pass' : 'blocking',
    value: `기한 초과 ${reviewCounts.overdue.toLocaleString('ko-KR')}개`,
    description: `향후 90일 안에 ${(
      reviewCounts.dueWithin30Days + reviewCounts.dueWithin90Days
    ).toLocaleString('ko-KR')}개를 계획 검토한다.`,
  },
  {
    id: 'evidence-coverage',
    label: '출처·본문 근거 범위',
    status: (
      articlesMeetingSourceMinimum === articles.length
      && evidencedFactualSections === factualSections
      && invalidSourceReferences === 0
    ) ? 'pass' : 'blocking',
    value: `${articlesMeetingSourceMinimum.toLocaleString('ko-KR')}/${articles.length.toLocaleString('ko-KR')} 문서`,
    description: '문서당 최소 3개 출처와 본문 섹션의 유효한 sourceRefs를 확인한다.',
  },
  {
    id: 'source-reachability',
    label: '외부 출처 도달성',
    status: sourceVerification.totals.unavailable === 0 && untrackedSourceUrls.length === 0 ? 'pass' : 'blocking',
    value: `도달 ${sourceVerification.totals.reachable.toLocaleString('ko-KR')} · 제한 ${sourceVerification.totals.restricted.toLocaleString('ko-KR')}`,
    description: '접근 제한은 별도 관찰 대상으로 남기며 확인 불가 링크는 출시를 막는다.',
  },
  {
    id: 'relationship-integrity',
    label: '문서 관계 무결성',
    status: unresolvedRelations === 0 && orphanArticles === 0 && publicIndexMatches ? 'pass' : 'blocking',
    value: `미해결 ${unresolvedRelations.toLocaleString('ko-KR')}건`,
    description: '선수·관련 문서와 공개 색인의 ID가 모두 실제 문서로 이어지는지 확인한다.',
  },
  {
    id: 'library-contracts',
    label: '자료실 데이터 계약',
    status: promptRecordsValid === prompts.prompts.length && artifactRecordsValid === artifacts.snippets.length ? 'pass' : 'blocking',
    value: `프롬프트 ${promptRecordsValid.toLocaleString('ko-KR')} · 자료 ${artifactRecordsValid.toLocaleString('ko-KR')}`,
    description: '프롬프트와 코드·설정 자료의 필수 공개 필드를 확인한다.',
  },
  {
    id: 'course-tool-connections',
    label: '코스·도구 연결',
    status: unresolvedCourseSteps.length === 0 && missingActiveToolPages.length === 0 ? 'pass' : 'blocking',
    value: `코스 ${courses.length.toLocaleString('ko-KR')} · 도구 ${activeTools.length.toLocaleString('ko-KR')}`,
    description: '모든 코스 단계와 활성 실험실 도구의 공개 경로를 확인한다.',
  },
];
const staticBuildGate = {
  id: 'static-build',
  label: '정적 빌드·내부 링크',
  status: release.status === 'pending' ? 'pending' : release.status === 'complete' ? 'pass' : 'blocking',
  value: release.status === 'pending'
    ? '빌드 후 확정'
    : `${release.htmlPages.toLocaleString('ko-KR')} 페이지`,
  description: release.status === 'pending'
    ? '프로덕션 빌드가 끝난 뒤 공개 경로와 내부 링크를 확정한다.'
    : `${release.internalLinkReferences.toLocaleString('ko-KR')}개 내부 링크에서 ${release.brokenInternalLinks.toLocaleString('ko-KR')}개 오류를 확인했다.`,
};
const gates = [...contentGates, staticBuildGate];

const snapshot = {
  schemaVersion: '1.0',
  milestone: 'W60',
  asOf,
  formulaVersion: 'editor-quality-v1',
  overallStatus: gates.some((gate) => gate.status === 'blocking')
    ? 'blocking'
    : gates.some((gate) => gate.status === 'pending') ? 'pending' : 'pass',
  counts: {
    articles: articles.length,
    reviewedArticles,
    courses: courses.length,
    prompts: prompts.prompts.length,
    artifacts: artifacts.snippets.length,
    activeTools: activeTools.length,
    reviewQueue: queue.length,
  },
  review: {
    policy: Object.entries(reviewDays).map(([id, days]) => ({
      id,
      label: volatilityLabels[id],
      days,
      articles: articles.filter((article) => article.volatility === id).length,
    })),
    counts: reviewCounts,
    priorityCounts: queuePriorityCounts,
    queue,
  },
  evidence: {
    uniqueArticleSourceUrls: articleSourceUrls.size,
    trackedSourceUrls: articleSourceUrls.size - untrackedSourceUrls.length,
    untrackedSourceUrls: untrackedSourceUrls.length,
    reachableSourceUrls: sourceVerification.totals.reachable,
    restrictedSourceUrls: sourceVerification.totals.restricted,
    unavailableSourceUrls: sourceVerification.totals.unavailable,
    articlesMeetingSourceMinimum,
    factualSections,
    evidencedFactualSections,
    invalidSourceReferences,
  },
  structure: {
    exactlyTenSections,
    unresolvedRelations,
    orphanArticles,
    publicIndexMatches,
  },
  coverage: {
    courseLinkedArticles: courseArticleIds.size,
    unresolvedCourseSteps: unresolvedCourseSteps.length,
    activeTools: activeTools.length,
    missingActiveToolPages: missingActiveToolPages.length,
    promptRecordsValid,
    artifactRecordsValid,
  },
  categories: categoryMetrics,
  gates,
  release,
  provenance: {
    qualityPolicyVersion: policy.version,
    taxonomyVersion: taxonomy.version,
    wikiGeneratedAt: wiki.generatedAt,
    sourceVerificationVersion: sourceVerification.version,
    sourceVerificationCheckedAt: sourceVerification.checkedAt,
    inputsSha256: {
      qualityPolicy: sha256(readText('content-model/taxonomy/quality-policy.json')),
      taxonomy: sha256(readText('content-model/taxonomy/categories.json')),
      wikiIndex: sha256(readText('public/data/wiki-index.json')),
      sourceVerification: sha256(readText('content-model/evidence/source-verification.json')),
      promptLibrary: sha256(readText('public/data/prompts.json')),
      artifactLibrary: sha256(readText('public/data/snippets.json')),
    },
  },
};

const serialized = JSON.stringify(snapshot, null, 2) + '\n';
fs.mkdirSync('content-model/quality', { recursive: true });
fs.mkdirSync('public/data', { recursive: true });
fs.writeFileSync('content-model/quality/w60-editor-quality.json', serialized);
fs.writeFileSync('public/data/editor-quality.json', serialized);
if (mode === 'release' && fs.existsSync('dist/data')) {
  fs.writeFileSync('dist/data/editor-quality.json', serialized);
}

console.log(
  `W60 editor quality (${mode}): ${articles.length} articles, ${queue.length} queued, `
  + `${gates.filter((gate) => gate.status === 'pass').length}/${gates.length} gates passed`,
);

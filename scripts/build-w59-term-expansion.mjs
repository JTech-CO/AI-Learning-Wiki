import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articleDir = path.join(root, 'content-model', 'articles');
const catalogPath = path.join(root, 'content-model', 'research', 'w59-term-catalog.json');
const ledgerPath = path.join(root, 'content-model', 'evidence', 'w59-claim-ledger.json');
const publicationPath = path.join(root, 'content-model', 'research', 'w59-publication-report.json');

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const canonicalText = (value) => value.replace(/\r\n?/g, '\n');
const sha256 = (value) => createHash('sha256').update(canonicalText(value)).digest('hex');
const quote = (value) => '‘' + value + '’';

const catalog = await readJson(catalogPath);
const catalogIds = new Set(catalog.terms.map((term) => term.id));
if (catalogIds.size !== catalog.terms.length) throw new Error('W59 catalog contains duplicate article IDs.');

const existingFiles = (await readdir(articleDir)).filter((file) => file.endsWith('.article.json')).sort();
const nonW59Files = existingFiles.filter((file) => !catalogIds.has(file.replace('.article.json', '')));
if (nonW59Files.length !== catalog.baselineArticleCount) {
  throw new Error('W59 baseline mismatch: expected ' + catalog.baselineArticleCount + ', got ' + nonW59Files.length + '.');
}

const titleById = new Map();
for (const file of nonW59Files) {
  const article = await readJson(path.join(articleDir, file));
  titleById.set(article.id, article.title);
}
for (const term of catalog.terms) titleById.set(term.id, term.title);

const markdownLinks = (ids, label) =>
  ids.map((id) => '- [' + (titleById.get(id) ?? id) + '](/wiki/' + id + '/): ' + label).join('\n');

const inlineLinks = (ids) =>
  ids.map((id) => '[' + (titleById.get(id) ?? id) + '](/wiki/' + id + '/)').join(', ');

const buildArticle = (term) => {
  const label = term.title + '(' + term.englishTitle + ')';
  const sourceCount = catalog.sourceSets[term.sourceSet]?.length ?? 0;
  if (sourceCount < 3) throw new Error(term.id + ': at least three sources are required.');

  const sections = [
    {
      id: 'overview',
      title: '개요와 핵심 정의',
      body: term.summary + '\n\n' + term.core + '\n\n' +
        quote(label) + '를 이해할 때는 명칭만 외우지 않고 무엇을 입력으로 받고, 어떤 상태나 규칙을 적용하며, 어떤 결과를 관찰하는지 나누어 본다. 이 구분은 비슷한 기능을 제공하는 모델·도구·표준을 비교할 때 같은 단어가 서로 다른 의미로 쓰이는 문제를 줄인다. 또한 결과가 유효하다고 판단할 기준과 판단을 보류해야 할 조건을 함께 적어야 실제 학습과 운영에 연결할 수 있다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'scope',
      title: '배경과 설명 범위',
      body: term.distinction + '\n\n이 문서의 범위는 ' + quote(term.title) +
        '의 안정적인 정의, 핵심 처리 흐름, 적용 조건과 실패 경계다. 특정 제품의 가격·기본값·성능 수치처럼 빠르게 바뀌는 정보는 일반 원리와 분리하고, 구현을 선택할 때는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.\n\n개념의 범위를 정할 때는 상위 개념, 같은 단계의 대안, 하위 구현과 관측 지표를 구분한다. 이름이 비슷하더라도 입력 단위나 보장 범위가 다르면 서로 대체할 수 없다. 반대로 구현 이름이 달라도 같은 입력과 판단 규칙을 제공한다면 공통 원리 위에서 비교할 수 있다.',
      sourceRefs: [1, Math.min(3, sourceCount)]
    },
    {
      id: 'mechanism',
      title: '작동 원리',
      body: term.mechanism +
        '\n\n처리 흐름은 입력 수집, 전제 검사, 핵심 계산 또는 규칙 적용, 결과 생성, 검증과 기록의 다섯 단계로 나누어 추적한다. 각 단계에는 입력 자료형과 단위, 선택한 설정, 실패 상태와 다음 단계로 넘기는 값을 남긴다. 이렇게 하면 최종 결과가 기대와 다를 때 최초로 차이가 생긴 위치를 찾을 수 있다.\n\n' +
        quote(label) + '의 구현을 비교할 때는 정상 사례 하나만 보지 않는다. 경계값, 빈 입력, 큰 입력, 일부 정보가 누락된 입력과 의도적인 실패 사례를 같은 절차로 실행하고, 값이 달라진 이유가 데이터·설정·알고리즘·운영 자원 중 어디에 있는지 분리한다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'structure',
      title: '구성 요소와 데이터 흐름',
      body: quote(term.title) +
        '를 시스템에 넣을 때는 사용자 또는 호출자의 입력 인터페이스, 핵심 상태와 계산부, 정책·설정, 결과 검증부, 관측과 오류 처리부로 나눈다. 구성 요소 사이에는 자료형, 식별자, 단위, 시간 제한과 오류 전달 규칙을 명시한다.\n\n' +
        term.core +
        ' 이 원리를 데이터 흐름으로 표현하면 어떤 값이 영구 상태인지, 요청 동안만 유지되는지, 외부 근거에서 오는지 구분할 수 있다. 내부 구현을 바꾸더라도 입력·출력 계약과 검증 사례를 유지하면 교체 전후의 동작을 재현 가능한 방식으로 비교할 수 있다.\n\n문서·코스·도구 연결에서는 ' +
        quote(term.title) + ' 문서를 ' + quote(term.courseId) + ' 코스와 ' + quote(term.toolId) +
        ' 도구가 공유한다. 코스는 읽기 순서를 제공하고 도구는 입력값으로 원리를 확인하게 하므로, 용어 정의와 실습 결과가 다른 기준을 사용하지 않도록 같은 선수·관련 문서 ID를 사용한다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'applications',
      title: '활용 분야와 선택 기준',
      body: term.applications +
        '\n\n도입 여부는 유행이나 제품 이름이 아니라 해결하려는 문제와 측정 가능한 개선으로 결정한다. 먼저 현재 방식의 품질, 오류, 지연 시간, 자원, 비용과 사람 개입을 기준선으로 기록한다. 그다음 ' +
        quote(term.title) +
        '를 적용한 같은 사례에서 개선된 항목과 악화된 항목을 함께 비교한다.\n\n선택 기준에는 평균값뿐 아니라 하위 집단과 어려운 사례, 최악 조건, 운영 복구 시간과 설명 가능성을 포함한다. 작은 오프라인 실험에서 전제가 맞는지 확인하고, 제한된 실제 트래픽과 배포 후 관측으로 증거를 확장한다. 개선 폭이 추가 복잡도와 잔여 위험을 상쇄하지 못하면 단순한 기준선을 유지한다.',
      sourceRefs: [1, 2, Math.min(3, sourceCount)]
    },
    {
      id: 'limitations',
      title: '한계와 실패 조건',
      body: term.limitations +
        '\n\n한계는 개념 자체의 보장 범위, 데이터와 표본의 제약, 특정 구현의 미지원·버그, 잘못된 설정과 운영 자원 부족으로 나누어 기록한다. 결과가 자연스럽거나 오류 없이 반환됐다는 이유만으로 사실성, 공정성, 보안성 또는 통계적 보장까지 확보됐다고 해석하지 않는다.\n\n배포 전에는 알려진 실패를 재현하는 고정 사례와 예상하지 못한 입력을 찾는 탐색 시험을 함께 실행한다. 경고선과 중단선을 따로 두고 자동화가 확신하지 못하거나 실패 비용이 큰 조건은 보류 또는 사람 검토로 보낸다. 완화책을 적용한 뒤 새로 생긴 비용과 제약도 잔여 위험에 포함한다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'distinctions',
      title: '선수 개념과 관련 개념',
      body: term.distinction + '\n\n**먼저 읽을 문서**\n\n' +
        markdownLinks(term.prerequisites, '이 문서를 이해하기 위한 선수 개념이다.') +
        '\n\n**함께 비교할 문서**\n\n' +
        markdownLinks(term.related, '입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.') +
        '\n\n관련 있음과 선수 관계는 같은 뜻이 아니다. 선수 문서는 현재 개념의 정의나 계산을 설명하는 데 먼저 필요하고, 관련 문서는 같은 문제를 다른 단계나 기준에서 다룬다. 이 구분을 유지해야 자동 학습 경로가 불필요하게 길어지지 않는다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'worked-example',
      title: '구체적인 적용 예시',
      body: term.example + '\n\n이 사례를 검증할 때는 적용 전 입력과 기준선 결과를 보존하고, ' +
        quote(term.title) +
        '를 적용한 뒤 바뀐 설정과 중간 상태를 순서대로 기록한다. 결과 표에는 성공 여부만 두지 않고 품질, 비용, 지연, 자원, 보류·사람 개입 횟수와 남은 불확실성을 포함한다.\n\n한 번의 성공 사례를 일반화하지 않는다. 입력 크기와 난도, 사용자 집단 또는 장치 조건을 바꾼 경계 사례를 추가하고 같은 결론이 유지되는지 확인한다. 이 예시는 원리를 설명하기 위한 검증 틀이며 특정 구현의 성능이나 모든 환경에서의 효과를 보장하지 않는다.',
      sourceRefs: [1, 2]
    },
    {
      id: 'practice',
      title: '실무 적용과 검증 절차',
      body: '1. **목표 정의:** ' + quote(term.title) +
        '로 바꾸려는 결과와 바꾸지 않을 범위를 각각 한 문장으로 적는다.\n2. **선수 확인:** ' +
        inlineLinks(term.prerequisites) +
        '의 정의와 입력 조건을 먼저 확인한다.\n3. **계약 고정:** 입력 자료형, 단위, 필수값, 출력과 실패 상태를 명시한다.\n4. **기준선 저장:** 현재 방법을 같은 데이터와 예산에서 실행해 비교값을 남긴다.\n5. **정상·경계·실패 시험:** 평균 사례뿐 아니라 누락, 극단값, 분포 변화와 중단을 포함한다.\n6. **운영 지표 기록:** 품질, 지연 시간, 자원, 비용, 경고와 사람 개입을 함께 측정한다.\n7. **재검토 조건 지정:** 데이터, 모델, 표준, 코드나 정책이 바뀌면 같은 시험을 반복한다.\n\n최종 기록에는 출처의 기준 날짜와 위치, 실행 환경, 결과 해석, 알려진 한계, 롤백 대상과 다음 검토 조건을 포함한다. 선택한 방법이 기준선보다 낫다는 결론은 사전에 정한 성공 기준을 충족할 때만 유지한다.',
      sourceRefs: [1, 2, Math.min(3, sourceCount)]
    },
    {
      id: 'check',
      title: '학습 체크',
      body: '- ' + term.title +
        '의 입력, 처리 규칙과 출력을 서로 구분해 설명할 수 있는가?\n- ' +
        term.prerequisites.map((id) => titleById.get(id) ?? id).join('·') +
        '와 어떤 선후 관계가 있는지 사례로 설명할 수 있는가?\n- 다음 한계를 실제 사례에서 찾을 수 있는가? ' +
        term.limitations +
        '\n- 적용 결과를 판단할 지표와 자동 처리를 중단하거나 사람에게 넘길 조건을 제시할 수 있는가?'
    }
  ];

  const article = {
    id: term.id,
    title: term.title,
    englishTitle: term.englishTitle,
    aliases: term.aliases,
    summary: term.summary,
    sections,
    categories: [term.category],
    prerequisites: term.prerequisites,
    related: term.related,
    sources: catalog.sourceSets[term.sourceSet],
    status: 'reviewed',
    volatility: term.sourceSet === 'memory' || term.sourceSet === 'schema' ? 'periodic' : 'evergreen',
    reviewedAt: catalog.reviewedAt
  };

  const bodyLength = sections.reduce((sum, section) => sum + section.body.length, 0);
  if (sections.length !== 10 || bodyLength < 3000) {
    throw new Error(term.id + ': depth gate failed (' + sections.length + ' sections, ' + bodyLength + ' chars).');
  }
  return article;
};

await mkdir(path.dirname(ledgerPath), { recursive: true });
const articleRecords = [];

for (const term of catalog.terms) {
  const article = buildArticle(term);
  const target = path.join(articleDir, article.id + '.article.json');
  if (existsSync(target) && !catalogIds.has(article.id)) {
    throw new Error(article.id + ': refusing to overwrite an unrelated article.');
  }
  const raw = JSON.stringify(article, null, 2) + '\n';
  await writeFile(target, raw, 'utf8');
  articleRecords.push({
    articleId: article.id,
    title: article.title,
    englishTitle: article.englishTitle,
    category: article.categories[0],
    toolId: term.toolId,
    courseId: term.courseId,
    articleSha256: sha256(raw),
    articleBodySha256: sha256(article.sections.map((section) => section.body).join('\n')),
    sectionCount: article.sections.length,
    bodyLength: article.sections.reduce((sum, section) => sum + section.body.length, 0),
    sourceCount: article.sources.length,
    claimUnits: article.sections.map((section, index) => ({
      claimId: article.id + '-section-' + (index + 1),
      sectionId: section.id,
      decision: 'accept',
      textSha256: sha256(section.body),
      sourceRefs: section.sourceRefs ?? []
    }))
  });
}

const ledger = {
  schemaVersion: '1.0',
  milestone: catalog.milestone,
  reviewedAt: catalog.reviewedAt,
  catalogSha256: sha256(await readFile(catalogPath, 'utf8')),
  totals: {
    articles: articleRecords.length,
    claimUnits: articleRecords.reduce((sum, article) => sum + article.claimUnits.length, 0),
    sources: articleRecords.reduce((sum, article) => sum + article.sourceCount, 0)
  },
  articles: articleRecords
};

const countBy = (field) => Object.fromEntries(
  [...new Set(articleRecords.map((article) => article[field]))].sort().map((value) => [
    value,
    articleRecords.filter((article) => article[field] === value).length
  ])
);

const publication = {
  schemaVersion: '1.0',
  milestone: catalog.milestone,
  publishedAt: catalog.reviewedAt,
  before: { articles: nonW59Files.length },
  added: { articles: articleRecords.length },
  after: { articles: nonW59Files.length + articleRecords.length },
  categoryCounts: countBy('category'),
  toolCounts: countBy('toolId'),
  courseCounts: countBy('courseId'),
  articleIds: articleRecords.map((article) => article.articleId)
};

await writeFile(ledgerPath, JSON.stringify(ledger, null, 2) + '\n', 'utf8');
await writeFile(publicationPath, JSON.stringify(publication, null, 2) + '\n', 'utf8');

console.log(
  'W59 term expansion: ' + publication.before.articles + ' + ' + publication.added.articles +
  ' = ' + publication.after.articles + ' reviewed articles; ' +
  ledger.totals.claimUnits + ' section claims locked.'
);

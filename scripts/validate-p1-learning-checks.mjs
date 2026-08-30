import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const data = await readJson('public/data/learning-checks.json');
const schema = await readJson('content-model/schema.learning-check-v1.json');
const p2Catalog = await readJson('content-model/research/p2-content-catalog.json');
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const courseFiles = (await readdir('content-model/paths')).filter((file) => file.endsWith('.path.json'));
const articles = await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))));
const courses = await Promise.all(courseFiles.map((file) => readJson(path.join('content-model/paths', file))));
const byId = new Map(articles.map((article) => [article.id, article]));
const byTitle = new Map(articles.map((article) => [article.title, article]));
const bySummary = new Map(articles.map((article) => [article.summary, article]));
const courseById = new Map(courses.map((course) => [course.id, course]));
const expectedTypes = new Set(['multiple-choice', 'concept-distinction', 'sequence', 'calculation', 'case-judgment']);
const expectedArticleIds = new Set(
  courses.flatMap((course) => course.steps.map((step) => step.ref)).filter((id) => byId.has(id)),
);
const p2ArticleIds = p2Catalog.groups.flatMap((group) => group.articleIds);
const errors = [];
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSchema = ajv.compile(schema);
if (!validateSchema(data)) {
  errors.push(...(validateSchema.errors ?? []).map((error) => ` ${error.instancePath || '/'}: ${error.message}`));
}

if (data.schemaVersion !== 1) errors.push('schemaVersion은 1이어야 한다.');
if (data.count !== data.assessments?.length) errors.push('count와 실제 학습 체크 수가 다르다.');
if (data.count !== expectedArticleIds.size) {
  errors.push(`학습 체크는 코스 연결 문서 ${expectedArticleIds.size}개를 모두 포함해야 하지만 ${data.count}개다.`);
}

const articleIds = new Set();
const itemTypes = new Set();
const validateReviewUrl = (articleId, reviewUrl) => {
  const wikiMatch = reviewUrl.match(/^\/wiki\/([^/]+)\/(?:#(.+))?$/);
  if (wikiMatch) {
    const target = byId.get(decodeURIComponent(wikiMatch[1]));
    if (!target) {
      errors.push(`${articleId}: 복습 문서 ${wikiMatch[1]}가 없다.`);
      return;
    }
    const anchor = wikiMatch[2] ? decodeURIComponent(wikiMatch[2]) : '';
    const generatedAnchors = new Set(['개념과-원리', '활용과-검증', '문서-관계', '참고와-다음-학습']);
    if (anchor && !generatedAnchors.has(anchor)) {
      errors.push(`${articleId}: 생성 문서에 없는 복습 링크 앵커 #${anchor}를 사용한다.`);
    }
    return;
  }

  const courseMatch = reviewUrl.match(/^\/course\/([^/]+)\/$/);
  if (courseMatch) {
    if (!courseById.has(decodeURIComponent(courseMatch[1]))) {
      errors.push(`${articleId}: 복습 코스 ${courseMatch[1]}가 없다.`);
    }
    return;
  }
  errors.push(`${articleId}: 복습 링크 형식이 잘못됐다(${reviewUrl}).`);
};

for (const assessment of data.assessments ?? []) {
  const article = byId.get(assessment.articleId);
  if (articleIds.has(assessment.articleId)) errors.push(`${assessment.articleId}: 중복 평가다.`);
  articleIds.add(assessment.articleId);
  if (!article) {
    errors.push(`${assessment.articleId}: 정본 문서가 없다.`);
    continue;
  }
  if (!expectedArticleIds.has(assessment.articleId)) {
    errors.push(`${assessment.articleId}: 어떤 학습 코스에도 연결되지 않은 평가다.`);
  }
  if (!assessment.title || !assessment.url || !assessment.teaches?.length || !assessment.assesses?.length) {
    errors.push(`${assessment.articleId}: LearningResource 필드가 비었다.`);
  }
  if (assessment.url !== `/wiki/${assessment.articleId}/`) errors.push(`${assessment.articleId}: 문서 URL이 표제어와 다르다.`);
  if (!Array.isArray(assessment.competencyRequired)) errors.push(`${assessment.articleId}: competencyRequired가 배열이 아니다.`);

  const expectedMemberships = courses
    .filter((course) => course.steps.some((step) => step.ref === assessment.articleId))
    .map((course) => course.id)
    .sort();
  const actualMemberships = [...(assessment.courseIds ?? [])].sort();
  if (JSON.stringify(actualMemberships) !== JSON.stringify(expectedMemberships)) {
    errors.push(`${assessment.articleId}: 코스 연결이 실제 경로와 다르다.`);
  }

  for (const prerequisite of assessment.competencyRequired ?? []) {
    const target = byId.get(prerequisite.id);
    if (!target) errors.push(`${assessment.articleId}: 선수 문서 ${prerequisite.id}가 없다.`);
    if (target && (prerequisite.title !== target.title || prerequisite.url !== `/wiki/${target.id}/`)) {
      errors.push(`${assessment.articleId}: 선수 문서 ${prerequisite.id}의 제목 또는 URL이 다르다.`);
    }
  }

  if (assessment.items?.length !== 1) errors.push(`${assessment.articleId}: 문항은 현재 릴리스에서 1개여야 한다.`);
  for (const item of assessment.items ?? []) {
    itemTypes.add(item.type);
    if (!expectedTypes.has(item.type)) errors.push(`${assessment.articleId}: 알 수 없는 유형 ${item.type}`);
    if (item.choices?.length !== 4) errors.push(`${assessment.articleId}: 선택지는 4개여야 한다.`);
    const choiceIds = new Set(item.choices?.map((choice) => choice.id));
    const choiceTexts = new Set(item.choices?.map((choice) => choice.text.trim()));
    if (choiceIds.size !== 4) errors.push(`${assessment.articleId}: 선택지 ID가 중복됐다.`);
    if (choiceTexts.size !== 4) errors.push(`${assessment.articleId}: 선택지 문구가 중복됐다.`);
    const answerChoice = item.choices?.find((choice) => choice.id === item.answer);
    if (!answerChoice) errors.push(`${assessment.articleId}: 정답 ID가 선택지에 없다.`);
    if ((item.explanation?.trim().length ?? 0) < 20) errors.push(`${assessment.articleId}: 정답 해설이 지나치게 짧다.`);
    if ((item.incorrectReason?.trim().length ?? 0) < 20) errors.push(`${assessment.articleId}: 오답 해설이 지나치게 짧다.`);
    if (item.explanation?.trim() === item.incorrectReason?.trim()) errors.push(`${assessment.articleId}: 정답·오답 해설이 같아서는 안 된다.`);
    if (!item.reviewUrl) errors.push(`${assessment.articleId}: 복습 링크가 필요하다.`);
    else validateReviewUrl(assessment.articleId, item.reviewUrl);

    if (answerChoice && item.type === 'multiple-choice' && answerChoice.text !== article.summary) {
      errors.push(`${assessment.articleId}: 개념 확인 정답이 문서 요약과 다르다.`);
    }
    if (answerChoice && item.type === 'case-judgment' && answerChoice.text !== article.title) {
      errors.push(`${assessment.articleId}: 사례 판단 정답이 현재 표제어와 다르다.`);
    }
    if (answerChoice && item.type === 'concept-distinction') {
      const relationTitles = [...article.prerequisites, ...article.related]
        .map((id) => byId.get(id)?.title)
        .filter(Boolean);
      if (!relationTitles.includes(answerChoice.text)) {
        errors.push(`${assessment.articleId}: 개념 구분 정답이 직접 연결 문서가 아니다.`);
      }
    }
    if (answerChoice && item.type === 'sequence') {
      const validNextTitles = courses.flatMap((course) => {
        const index = course.steps.findIndex((step) => step.ref === assessment.articleId);
        const nextId = index >= 0 ? course.steps[index + 1]?.ref : '';
        return nextId && byId.has(nextId) ? [byId.get(nextId).title] : [];
      });
      if (!validNextTitles.includes(answerChoice.text)) {
        errors.push(`${assessment.articleId}: 학습 순서 정답이 실제 다음 문서가 아니다.`);
      }
    }

    if (answerChoice && item.type !== 'calculation') {
      const useSummary = item.type === 'multiple-choice';
      const valueFor = (candidate) => useSummary ? candidate.summary : candidate.title;
      const lookup = useSummary ? bySummary : byTitle;
      const eligibleCategoryValues = new Set(
        articles
          .filter((candidate) => candidate.id !== article.id && candidate.categories.some((category) => article.categories.includes(category)))
          .map(valueFor)
          .filter((value) => value && value !== answerChoice.text && value !== valueFor(article)),
      );
      if (eligibleCategoryValues.size >= 3) {
        for (const distractor of item.choices.filter((choice) => choice.id !== item.answer)) {
          const candidate = lookup.get(distractor.text);
          if (!candidate || !candidate.categories.some((category) => article.categories.includes(category))) {
            errors.push(`${assessment.articleId}: 같은 분야 오답 후보가 충분하지만 ‘${distractor.text}’은 다른 분야다.`);
          }
        }
      }
    }
  }
}

for (const articleId of expectedArticleIds) {
  if (!articleIds.has(articleId)) errors.push(`${articleId}: 코스 연결 문서의 학습 체크가 없다.`);
}
for (const articleId of p2ArticleIds) {
  if (!articleIds.has(articleId)) errors.push(`${articleId}: P2 신규 문서의 학습 체크가 없다.`);
}
for (const type of expectedTypes) if (!itemTypes.has(type)) errors.push(`문항 유형 ${type}이 없다.`);

const footer = await readFile('src/components/wiki/WikiFooter.astro', 'utf8');
const component = await readFile('src/components/learning/LearningCheck.astro', 'utf8');
if (!footer.includes('LearningCheck')) errors.push('공통 Footer에 LearningCheck가 연결되지 않았다.');
if (!component.includes('application/ld+json')) errors.push('LearningResource 구조화 데이터가 없다.');
if (!component.includes('Astro.locals.starlightRoute.id')) errors.push('현재 문서 ID를 Starlight route에서 읽지 않는다.');
if (!component.includes('recordAssessmentResult') || !component.includes('saveLearningState')) {
  errors.push('통합 브라우저 학습 상태에 결과를 저장하지 않는다.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Learning checks valid: ${data.count} course articles, P2 ${p2ArticleIds.length}/${p2ArticleIds.length}, ${[...itemTypes].join(', ')}`);
}

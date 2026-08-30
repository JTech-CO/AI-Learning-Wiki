import { access, readFile } from 'node:fs/promises';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const data = JSON.parse(await readFile('public/data/learning-checks.json', 'utf8'));
const schema = JSON.parse(await readFile('content-model/schema.learning-check-v1.json', 'utf8'));
const expectedTypes = new Set(['multiple-choice', 'concept-distinction', 'sequence', 'calculation', 'case-judgment']);
const errors = [];
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validateSchema = ajv.compile(schema);
if (!validateSchema(data)) {
  errors.push(...(validateSchema.errors ?? []).map((error) => ` ` + (error.instancePath || '/') + ': ' + error.message));
}

if (data.schemaVersion !== 1) errors.push('schemaVersion은 1이어야 한다.');
if (data.count !== 100 || data.assessments?.length !== 100) errors.push('학습 체크는 정확히 100개여야 한다.');
const articleIds = new Set();
const itemTypes = new Set();

for (const assessment of data.assessments ?? []) {
  if (articleIds.has(assessment.articleId)) errors.push(`${assessment.articleId}: 중복 평가다.`);
  articleIds.add(assessment.articleId);
  try { await access(`content-model/articles/${assessment.articleId}.article.json`); } catch { errors.push(`${assessment.articleId}: 정본 문서가 없다.`); }
  if (!assessment.title || !assessment.url || !assessment.teaches?.length || !assessment.assesses?.length) errors.push(`${assessment.articleId}: LearningResource 필드가 비었다.`);
  if (!Array.isArray(assessment.competencyRequired)) errors.push(`${assessment.articleId}: competencyRequired가 배열이 아니다.`);
  if (assessment.items?.length !== 1) errors.push(`${assessment.articleId}: 문항은 현재 릴리스에서 1개여야 한다.`);
  for (const item of assessment.items ?? []) {
    itemTypes.add(item.type);
    if (!expectedTypes.has(item.type)) errors.push(`${assessment.articleId}: 알 수 없는 유형 ${item.type}`);
    if (item.choices?.length !== 4) errors.push(`${assessment.articleId}: 선택지는 4개여야 한다.`);
    if (!item.choices?.some((choice) => choice.id === item.answer)) errors.push(`${assessment.articleId}: 정답 ID가 선택지에 없다.`);
    if (!item.explanation || !item.incorrectReason || !item.reviewUrl) errors.push(`${assessment.articleId}: 해설·오답 이유·복습 링크가 필요하다.`);
  }
}
for (const type of expectedTypes) if (!itemTypes.has(type)) errors.push(`문항 유형 ${type}이 없다.`);

const footer = await readFile('src/components/wiki/WikiFooter.astro', 'utf8');
const component = await readFile('src/components/learning/LearningCheck.astro', 'utf8');
if (!footer.includes('LearningCheck')) errors.push('공통 Footer에 LearningCheck가 연결되지 않았다.');
if (!component.includes('application/ld+json')) errors.push('LearningResource 구조화 데이터가 없다.');
if (!component.includes('recordAssessmentResult') || !component.includes('saveLearningState')) {
  errors.push('통합 브라우저 학습 상태에 결과를 저장하지 않는다.');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`P1 learning checks valid: ${data.count} assessments, ${[...itemTypes].join(', ')}`);
}

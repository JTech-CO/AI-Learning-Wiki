import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plansDir = path.join(root, 'content-model', 'course-plans');
const pathsDir = path.join(root, 'content-model', 'paths');
const plans = fs.readdirSync(plansDir).filter((name) => name.endsWith('.course-plan.json')).sort().map((name) => JSON.parse(fs.readFileSync(path.join(plansDir, name), 'utf8')));
const before = fs.readdirSync(pathsDir).filter((name) => name.endsWith('.path.json')).length;
const activated = [];

for (const plan of plans) {
  const steps = plan.phases.flatMap((phase) => phase.steps).map((step) => ({
    ref: step.refType === 'existing' ? step.articleId : step.candidateId,
    required: true,
    reason: `${step.title.ko} 문서를 통해 이 단계의 판단 기준과 다음 주제의 연결을 정리한다.`
  }));
  const course = {
    id: plan.id,
    title: plan.title.ko,
    audience: plan.audience,
    description: `${plan.audience} 대상의 핵심 개념부터 평가·운영·통제까지 백과 문서를 순서대로 연결한 전문 학습 코스다.`,
    steps
  };
  fs.writeFileSync(path.join(pathsDir, `${course.id}.path.json`), `${JSON.stringify(course, null, 2)}\n`);
  activated.push({ courseId: course.id, title: course.title, steps: steps.length, existingArticleRefs: plan.phases.flatMap((phase) => phase.steps).filter((step) => step.refType === 'existing').length, w46ArticleRefs: plan.phases.flatMap((phase) => phase.steps).filter((step) => step.refType === 'planned').length });
}

const report = {
  schemaVersion: '1.0', milestone: 'W47', activatedAt: '2026-07-16',
  policy: { deliveryModel: 'ordered-wiki-path', guideLessonsAllowed: false, allStepsRequiredForRecommendedSequence: true },
  totals: { before, added: activated.length, after: fs.readdirSync(pathsDir).filter((name) => name.endsWith('.path.json')).length, steps: activated.reduce((sum, item) => sum + item.steps, 0), existingArticleRefs: activated.reduce((sum, item) => sum + item.existingArticleRefs, 0), w46ArticleRefs: activated.reduce((sum, item) => sum + item.w46ArticleRefs, 0) },
  courses: activated
};
fs.writeFileSync(path.join(root, 'content-model', 'research', 'w47-course-activation.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`W47 course activation: ${report.totals.before} + ${report.totals.added} = ${report.totals.after} courses; ${report.totals.steps} ordered steps`);

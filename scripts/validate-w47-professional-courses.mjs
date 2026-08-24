import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const schema = readJson('content-model/schema.path.json');
const report = readJson('content-model/research/w47-course-activation.json');
const w46 = readJson('content-model/evidence/w46-claim-ledger.json');
const articleIds = new Set(fs.readdirSync(path.join(root, 'content-model', 'articles')).filter((name) => name.endsWith('.article.json')).map((name) => name.replace('.article.json', '')));
const pathFiles = fs.readdirSync(path.join(root, 'content-model', 'paths')).filter((name) => name.endsWith('.path.json'));
const newPlans = fs.readdirSync(path.join(root, 'content-model', 'course-plans')).filter((name) => name.endsWith('.course-plan.json')).map((name) => readJson(`content-model/course-plans/${name}`));
const w46Ids = new Set(w46.articles.filter((item) => item.publicationReady).map((item) => item.articleId));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(report.milestone === 'W47' && report.policy.deliveryModel === 'ordered-wiki-path' && report.policy.guideLessonsAllowed === false, 'W47 policy mismatch');
assert(report.totals.before === 8 && report.totals.added === 8 && report.totals.after === 16, 'W47 course totals mismatch');
assert(report.totals.steps === 192 && report.totals.existingArticleRefs === 152 && report.totals.w46ArticleRefs === 40, 'W47 step totals mismatch');
assert(pathFiles.length >= 16, `W47 baseline requires at least 16 paths, got ${pathFiles.length}`);
const newIds = new Set(newPlans.map((plan) => plan.id));
assert(newIds.size === 8, 'W47 professional course IDs must be unique');
let w46Refs = 0;

for (const plan of newPlans) {
  const course = readJson(`content-model/paths/${plan.id}.path.json`);
  assert(validate(course), `${plan.id}: ${ajv.errorsText(validate.errors)}`);
  assert(course.title === plan.title.ko && course.audience === plan.audience, `${plan.id}: plan metadata drift`);
  const expectedRefs = plan.phases.flatMap((phase) => phase.steps).map((step) => step.refType === 'existing' ? step.articleId : step.candidateId);
  const currentRefs = course.steps.map((step) => step.ref);
  const baselinePositions = expectedRefs.map((ref) => currentRefs.indexOf(ref));
  assert(course.steps.length >= 24, `${plan.id}: W47 baseline steps were removed`);
  assert(baselinePositions.every((position) => position >= 0), `${plan.id}: W47 baseline reference missing`);
  assert(baselinePositions.every((position, index) => index === 0 || position > baselinePositions[index - 1]), `${plan.id}: W47 recommendation order changed`);
  assert(expectedRefs.every((ref) => course.steps.find((step) => step.ref === ref)?.required), `${plan.id}: W47 required step became optional`);
  assert(course.steps.every((step) => articleIds.has(step.ref)), `${plan.id}: unresolved article reference`);
  assert(!/Guide|가이드|레슨|lesson/i.test(JSON.stringify(course)), `${plan.id}: guide-style wording remains`);
  w46Refs += course.steps.filter((step) => w46Ids.has(step.ref)).length;
}

assert(w46Refs === 40, `W47 expected 40 W46 course refs, got ${w46Refs}`);
assert(report.courses.every((item) => newIds.has(item.courseId) && item.steps === 24), 'W47 activation report mismatch');
console.log('W47 professional courses: 8 new ordered-wiki paths, 192 steps and all 40 course-blocking W46 articles OK');

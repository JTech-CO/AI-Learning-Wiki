import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plansDir = path.join(root, 'content-model', 'course-plans');
const schema = JSON.parse(fs.readFileSync(path.join(root, 'content-model', 'schema.course-plan-v2.json'), 'utf8'));
const validate = new Ajv2020({ allErrors: true }).compile(schema);
const planFiles = fs.readdirSync(plansDir).filter((name) => name.endsWith('.course-plan.json')).sort();
const plans = planFiles.map((name) => JSON.parse(fs.readFileSync(path.join(plansDir, name), 'utf8')));
const currentCourseIds = new Set(['ai-start', 'ai-intro', 'ai-work', 'ai-builder', 'ai-engineer', 'automation', 'ai-finance', 'ai-trends']);
const articleIds = new Set(fs.readdirSync(path.join(root, 'content-model', 'articles')).filter((name) => name.endsWith('.article.json')).map((name) => name.replace('.article.json', '')));

const assert = (condition, message) => { if (!condition) throw new Error(message); };
assert(plans.length === 8, `W41 expected 8 plans, got ${plans.length}`);
assert(new Set(plans.map((plan) => plan.id)).size === 8, 'W41 course IDs must be unique');
assert(new Set(plans.map((plan) => plan.order)).size === 8, 'W41 course orders must be unique');

let existingRefs = 0;
let plannedRefs = 0;
const candidateIds = new Set();
for (const plan of plans) {
  assert(validate(plan), `${plan.id}: ${JSON.stringify(validate.errors)}`);
  assert(plan.status === 'planned' && plan.publicationGate.articleCandidatesReady === false, `${plan.id}: premature activation`);
  assert(plan.prerequisites.every((id) => currentCourseIds.has(id)), `${plan.id}: unknown prerequisite`);
  const steps = plan.phases.flatMap((phase) => phase.steps);
  assert(steps.length === 24, `${plan.id}: expected 24 steps`);
  assert(steps.every((step, index) => step.order === index + 1), `${plan.id}: step order is not contiguous`);
  assert(steps.filter((step) => step.refType === 'existing').length === 19, `${plan.id}: expected 19 existing refs`);
  assert(steps.filter((step) => step.refType === 'planned').length === 5, `${plan.id}: expected 5 planned refs`);
  for (const step of steps) {
    assert(!('body' in step) && !('lesson' in step) && !('module' in step), `${plan.id}: guide-style content is forbidden`);
    if (step.refType === 'existing') {
      assert(articleIds.has(step.articleId), `${plan.id}: missing article ${step.articleId}`);
      existingRefs += 1;
    } else {
      assert(!articleIds.has(step.candidateId), `${plan.id}: planned ID already exists ${step.candidateId}`);
      assert(!candidateIds.has(step.candidateId), `${plan.id}: duplicate candidate ${step.candidateId}`);
      candidateIds.add(step.candidateId);
      plannedRefs += 1;
    }
  }
}

assert(existingRefs === 152 && plannedRefs === 40, `W41 ref totals mismatch: ${existingRefs}/${plannedRefs}`);
console.log(`W41 course plans: ${plans.length} plans, ${existingRefs} existing article refs, ${plannedRefs} W42 candidate refs OK`);

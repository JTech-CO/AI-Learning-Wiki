import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const articleIds = new Set(fs.readdirSync(path.join(root, 'content-model/articles'))
  .filter((file) => file.endsWith('.article.json'))
  .map((file) => file.replace('.article.json', '')));
const pathFiles = fs.readdirSync(path.join(root, 'content-model/paths')).filter((file) => file.endsWith('.path.json')).sort();
const courses = pathFiles.map((file) => readJson(`content-model/paths/${file}`));
const coursesById = new Map(courses.map((course) => [course.id, course]));
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(readJson('content-model/schema.path.json'));
const expectedNewIds = [
  'ai-mathematics-statistics',
  'neural-model-architectures',
  'transformer-architecture',
  'efficient-long-context-transformers',
  'ai-serving-systems',
  'model-service-ecosystem',
  'production-ai-api-systems',
  'data-training-pipelines',
];
const levelValues = new Set(['entry', 'intermediate', 'advanced', 'professional']);
const allLinkedIds = new Set();
let totalSteps = 0;

assert.ok(courses.length >= 24, 'P0 requires at least 24 canonical course paths');
assert.equal(coursesById.size, courses.length, 'course IDs must be unique');

for (const course of courses) {
  assert.equal(validate(course), true, `${course.id}: ${ajv.errorsText(validate.errors)}`);
  const refs = course.steps.map((step) => step.ref);
  assert.equal(new Set(refs).size, refs.length, `${course.id}: duplicate article step`);
  for (const ref of refs) {
    assert.ok(articleIds.has(ref), `${course.id}: unresolved article reference ${ref}`);
    allLinkedIds.add(ref);
  }
  totalSteps += refs.length;
}

for (const id of expectedNewIds) {
  const course = coursesById.get(id);
  assert.ok(course, `missing P0 course: ${id}`);
  assert.ok(course.steps.length >= 30 && course.steps.length <= 50, `${id}: expected 30-50 ordered steps`);
  assert.ok(levelValues.has(course.level), `${id}: level is required`);
  assert.ok(Array.isArray(course.prerequisiteCourses), `${id}: prerequisiteCourses is required`);
  for (const prerequisiteId of course.prerequisiteCourses) {
    assert.ok(coursesById.has(prerequisiteId), `${id}: unresolved prerequisite course ${prerequisiteId}`);
    assert.notEqual(prerequisiteId, id, `${id}: self prerequisite`);
  }
  assert.doesNotMatch(JSON.stringify(course), /Guide|가이드|레슨|lesson/iu, `${id}: guide-style wording remains`);
}

for (let index = 0; index < expectedNewIds.length; index += 1) {
  const left = coursesById.get(expectedNewIds[index]);
  const leftRefs = new Set(left.steps.map((step) => step.ref));
  for (let cursor = index + 1; cursor < expectedNewIds.length; cursor += 1) {
    const right = coursesById.get(expectedNewIds[cursor]);
    const overlap = right.steps.map((step) => step.ref).filter((ref) => leftRefs.has(ref));
    assert.ok(overlap.length <= 1, `${left.id}/${right.id}: excessive overlap (${overlap.join(', ')})`);
  }
}

assert.ok(allLinkedIds.size >= 600, 'P0 linked article coverage must stay above 600');
console.log(`P0 course expansion: ${courses.length} paths, ${totalSteps} ordered steps, ${allLinkedIds.size} unique linked articles and 0 missing references OK`);

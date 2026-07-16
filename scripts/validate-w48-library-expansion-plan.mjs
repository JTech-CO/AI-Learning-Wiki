import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const base = readJson('content-model/migration/w48-base-library.json');
const migration = readJson('content-model/migration/w40-library-migration.json');
const plan = readJson('content-model/research/w48-library-expansion-plan.json');
const policy = readJson('content-model/library-policy-v2.json');
const sum = (object) => Object.values(object).reduce((total, value) => total + value, 0);

assert.equal(base.milestone, 'W48');
assert.deepEqual(base.counts, { prompts: 1142, artifacts: 25 });
assert.equal(base.promptIds.length, 1142);
assert.equal(base.artifactIds.length, 25);
assert.equal(new Set(base.promptIds).size, 1142);
assert.equal(new Set(base.artifactIds).size, 25);
assert.equal(sha256(base.promptIds.join('\n')), migration.compatibility.publicPromptIdsSha256);
assert.equal(sha256(base.artifactIds.join('\n')), migration.compatibility.publicArtifactIdsSha256);
assert.equal(base.hashes.promptIdsSha256, migration.compatibility.publicPromptIdsSha256);
assert.equal(base.hashes.artifactIdsSha256, migration.compatibility.publicArtifactIdsSha256);

assert.equal(plan.milestone, 'W48');
assert.deepEqual(plan.targets, policy.targetCounts);
assert.deepEqual(plan.final, { prompts: 1500, artifacts: 120, courses: 16, articles: 1600 });
assert.equal(plan.baseline.prompts + plan.additions.prompts, plan.final.prompts);
assert.equal(plan.baseline.artifacts + plan.additions.artifacts, plan.final.artifacts);
assert.equal(sum(plan.promptKindQuotas), 358);
assert.equal(sum(plan.promptDifficultyQuotas), 358);
assert.equal(sum(plan.artifactTypeQuotas), 95);
assert.equal(plan.exampleEnrichmentPromptIds.length, 28);
assert.equal(new Set(plan.exampleEnrichmentPromptIds).size, 28);
assert.equal(plan.courses.length, 8);
assert.equal(sum(Object.fromEntries(plan.courses.map((course) => [course.courseId, course.promptQuota]))), 358);
assert.equal(sum(Object.fromEntries(plan.courses.map((course) => [course.courseId, course.artifactQuota]))), 95);

for (const course of plan.courses) {
  const activePath = readJson(`content-model/paths/${course.courseId}.path.json`);
  assert.equal(course.title, activePath.title, `${course.courseId}: title drift`);
  assert.equal(course.sourceSteps.length, 24, `${course.courseId}: expected 24 source steps`);
  assert.deepEqual(course.sourceSteps.map((step) => step.wikiSlug), activePath.steps.map((step) => step.ref), `${course.courseId}: step order drift`);
}

for (const id of plan.exampleEnrichmentPromptIds) {
  const prompt = readJson(`content-model/library/prompts/${id}.prompt.json`);
  assert.equal(prompt.examples.length, 0, `${id}: enrichment target already has examples`);
}

assert.equal(plan.qualityTargets.targetLongFormPrompts, 300);
assert.equal(plan.qualityTargets.targetMarkdownPrompts, 200);
assert.equal(plan.qualityTargets.targetSchemaPrompts, 120);
assert.equal(plan.qualityTargets.targetPromptsWithExamples, 500);
console.log('W48 expansion plan: frozen 1142/25 baseline, exact 358/95 quotas and 28 example enrichments OK');

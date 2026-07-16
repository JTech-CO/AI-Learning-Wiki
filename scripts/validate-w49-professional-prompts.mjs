import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { loadLibraryV2Validators, ajvMessage } from './library-v2-lib.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plan = readJson('content-model/research/w48-library-expansion-plan.json');
const manifest = readJson('content-model/staging/w49-prompt-manifest.json');
const enrichments = readJson('content-model/staging/w49-prompt-example-enrichments.json');
const controlledTags = new Set(readJson('content-model/prompt-library-policy.json').controlledTags.map((tag) => tag.label));
const { validatePrompt } = await loadLibraryV2Validators();
const files = fs.readdirSync('content-model/staging/w49-prompts').filter((name) => name.endsWith('.prompt.json')).sort();
const prompts = files.map((name) => readJson(`content-model/staging/w49-prompts/${name}`));
const canonicalIds = new Set(fs.readdirSync('content-model/library/prompts').filter((name) => name.endsWith('.prompt.json')).map((name) => readJson(`content-model/library/prompts/${name}`).id));
const countBy = (items, key) => Object.fromEntries([...new Set(items.map((item) => item[key]))].sort().map((value) => [value, items.filter((item) => item[key] === value).length]));

assert.equal(manifest.milestone, 'W49');
assert.deepEqual(manifest.counts, { prompts: 358, exampleEnrichments: 28 });
assert.equal(prompts.length, 358);
assert.equal(new Set(prompts.map((prompt) => prompt.id)).size, 358);
assert.equal(new Set(prompts.map((prompt) => prompt.title)).size, 358);
assert.deepEqual(countBy(prompts, 'kind'), Object.fromEntries(Object.entries(plan.promptKindQuotas).sort()));
assert.deepEqual(countBy(prompts, 'difficulty'), Object.fromEntries(Object.entries(plan.promptDifficultyQuotas).sort()));

for (const course of plan.courses) {
  assert.equal(prompts.filter((prompt) => prompt.courseIds.includes(course.courseId)).length, course.promptQuota, `${course.courseId}: quota mismatch`);
}

for (const prompt of prompts) {
  assert.equal(validatePrompt(prompt), true, `${prompt.id}: ${ajvMessage(validatePrompt)}`);
  assert.equal(prompt.status, 'draft');
  assert.ok(prompt.template.length >= plan.editorialRules.minimumTemplateCharacters, `${prompt.id}: short template`);
  assert.ok(prompt.examples.length > 0 && prompt.examples[0].output.length > 0, `${prompt.id}: example missing`);
  assert.ok(prompt.tags.every((tag) => controlledTags.has(tag)), `${prompt.id}: uncontrolled tag`);
  assert.ok(!canonicalIds.has(prompt.id), `${prompt.id}: canonical collision`);
  assert.ok(fs.existsSync(`content-model/articles/${prompt.relatedWikiSlugs[0]}.article.json`), `${prompt.id}: wiki link missing`);
  assert.doesNotMatch(JSON.stringify(prompt), /EduVerse|에듀버스|가장 먼저 쓰세요|지금 바로|클릭하세요/iu, `${prompt.id}: forbidden source or CTA marker`);
}

const templateHashes = prompts.map((prompt) => createHash('sha256').update(prompt.template).digest('hex'));
assert.equal(new Set(templateHashes).size, 358, 'exact duplicate templates found');
assert.equal(enrichments.enrichments.length, 28);
for (const patch of enrichments.enrichments) {
  const target = readJson(`content-model/library/prompts/${patch.id}.prompt.json`);
  assert.equal(target.examples.length, 0, `${patch.id}: target changed before promotion`);
  assert.ok(patch.example.input.length >= 2 && patch.example.output.length >= 2, `${patch.id}: invalid example patch`);
}
assert.deepEqual(manifest.staged.map((item) => item.id).sort(), prompts.map((prompt) => prompt.id).sort());
console.log('W49 professional prompt staging: 358 unique long-form prompts, exact format quotas and 28 enrichment patches OK');

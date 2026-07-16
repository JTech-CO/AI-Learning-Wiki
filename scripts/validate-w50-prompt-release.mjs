import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPromptLibrary } from './canonical-library.mjs';
import { ajvMessage, loadLibraryV2Validators, readLibraryEntries } from './library-v2-lib.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const policy = readJson('content-model/library-policy-v2.json');
const base = readJson('content-model/migration/w48-base-library.json');
const report = readJson('content-model/quality/w50-prompt-release.json');
const staged = readJson('content-model/staging/w49-prompt-manifest.json');
const publicData = readJson('public/data/prompts.json');
const entries = await readLibraryEntries('content-model/library/prompts', '.prompt.json');
const { validatePrompt } = await loadLibraryV2Validators();
const built = await buildPromptLibrary(process.cwd());
const prompts = entries.map((entry) => entry.value);
const ids = prompts.map((prompt) => prompt.id);

assert.equal(report.milestone, 'W50');
assert.equal(entries.length, policy.targetCounts.prompts);
assert.equal(entries.length, 1500);
assert.equal(new Set(ids).size, 1500);
assert.ok(base.promptIds.every((id) => ids.includes(id)), 'a frozen W40 prompt ID was lost');
assert.equal(sha256([...base.promptIds].sort().join('\n')), base.hashes.promptIdsSha256);
assert.ok(staged.staged.every((item) => ids.includes(item.id)), 'a W49 staged prompt was not promoted');
assert.ok(prompts.every((prompt) => prompt.status === 'reviewed'), 'draft prompt remains canonical');
for (const { file, value } of entries) assert.equal(validatePrompt(value), true, `${file}: ${ajvMessage(validatePrompt)}`);

const longForm = prompts.filter((prompt) => prompt.template.length >= policy.promptQuality.longFormThresholdCharacters).length;
const markdown = prompts.filter((prompt) => prompt.kind === 'markdown').length;
const schemas = prompts.filter((prompt) => ['json-schema', 'yaml', 'xml'].includes(prompt.kind)).length;
const withExamples = prompts.filter((prompt) => prompt.examples.length > 0).length;
assert.ok(longForm >= policy.promptQuality.targetLongFormPrompts, `long-form target: ${longForm}`);
assert.ok(markdown >= policy.promptQuality.targetMarkdownPrompts, `Markdown target: ${markdown}`);
assert.ok(schemas >= policy.promptQuality.targetSchemaPrompts, `schema target: ${schemas}`);
assert.ok(withExamples >= policy.promptQuality.targetPromptsWithExamples, `example target: ${withExamples}`);
assert.deepEqual(report.counts, {
  canonicalPrompts: 1500, addedPrompts: 358, enrichedExistingPrompts: 28,
  longFormPrompts: longForm, markdownPrompts: markdown, schemaPrompts: schemas, promptsWithExamples: withExamples,
});
assert.equal(publicData.prompts.length, 1500);
assert.equal(publicData.counts.canonicalPrompts, 1500);
assert.equal(built.counts.canonicalPrompts, 1500);
assert.deepEqual(publicData.prompts.map((prompt) => prompt.id).sort(), [...ids].sort());
assert.ok(report.courseCoverage['prompt-systems'] >= 48 && report.courseCoverage['ai-security-redteam'] >= 43);
const newPromptIds = new Set(staged.staged.map((item) => item.id));
assert.doesNotMatch(JSON.stringify(prompts.filter((prompt) => newPromptIds.has(prompt.id))), /EduVerse|에듀버스|가장 먼저 쓰세요|지금 바로|클릭하세요/iu);
console.log(`W50 prompt release: 1500 canonical prompts, ${longForm} long-form, ${markdown} Markdown, ${schemas} schema and ${withExamples} example-backed OK`);

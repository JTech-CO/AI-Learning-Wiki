import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const stagingDir = path.join(root, 'content-model/staging/w49-prompts');
const canonicalDir = path.join(root, 'content-model/library/prompts');
const stagedFiles = fs.readdirSync(stagingDir).filter((name) => name.endsWith('.prompt.json')).sort();
const enrichments = readJson('content-model/staging/w49-prompt-example-enrichments.json').enrichments;

for (const name of stagedFiles) {
  const prompt = readJson(`content-model/staging/w49-prompts/${name}`);
  prompt.status = 'reviewed';
  prompt.reviewedAt = '2026-07-16';
  writeJson(`content-model/library/prompts/${name}`, prompt);
}

for (const patch of enrichments) {
  const file = `content-model/library/prompts/${patch.id}.prompt.json`;
  const prompt = readJson(file);
  if (prompt.examples.length === 0) prompt.examples.push(patch.example);
  else if (!prompt.examples.some((example) => JSON.stringify(example) === JSON.stringify(patch.example))) {
    throw new Error(`${patch.id}: example target changed independently`);
  }
  prompt.version += prompt.version === 1 ? 1 : 0;
  prompt.reviewedAt = '2026-07-16';
  writeJson(file, prompt);
}

const prompts = fs.readdirSync(canonicalDir).filter((name) => name.endsWith('.prompt.json')).map((name) => readJson(`content-model/library/prompts/${name}`));
const countsBy = (key) => Object.fromEntries([...new Set(prompts.map((prompt) => prompt[key]))].sort().map((value) => [value, prompts.filter((prompt) => prompt[key] === value).length]));
const report = {
  schemaVersion: '1.0', milestone: 'W50', promotedAt: '2026-07-16',
  counts: {
    canonicalPrompts: prompts.length,
    addedPrompts: stagedFiles.length,
    enrichedExistingPrompts: enrichments.length,
    longFormPrompts: prompts.filter((prompt) => prompt.template.length >= 500).length,
    markdownPrompts: prompts.filter((prompt) => prompt.kind === 'markdown').length,
    schemaPrompts: prompts.filter((prompt) => ['json-schema', 'yaml', 'xml'].includes(prompt.kind)).length,
    promptsWithExamples: prompts.filter((prompt) => prompt.examples.length > 0).length,
  },
  kinds: countsBy('kind'),
  difficulties: countsBy('difficulty'),
  courseCoverage: Object.fromEntries([...new Set(prompts.flatMap((prompt) => prompt.courseIds))].sort().map((courseId) => [courseId, prompts.filter((prompt) => prompt.courseIds.includes(courseId)).length])),
};
fs.mkdirSync(path.join(root, 'content-model/quality'), { recursive: true });
writeJson('content-model/quality/w50-prompt-release.json', report);
console.log(`W50 promotion: ${report.counts.canonicalPrompts} canonical prompts; ${report.counts.promptsWithExamples} with examples`);

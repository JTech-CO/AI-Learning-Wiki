import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { buildPromptLibrary } from './prompt-library.mjs';

const [built, publicPrompts, publicSnippets, component, snippetComponent] = await Promise.all([
  buildPromptLibrary(process.cwd()),
  readFile('public/data/prompts.json', 'utf8').then(JSON.parse),
  readFile('public/data/snippets.json', 'utf8').then(JSON.parse),
  readFile('src/components/PromptExplorer.astro', 'utf8'),
  readFile('src/components/SnippetExplorer.astro', 'utf8'),
]);

assert.equal(built.counts.sourceModules, 305, 'source module count changed');
assert.equal(built.counts.sourcePrompts, 1173, 'source prompt audit baseline changed');
assert.equal(built.policy.duplicateMerges.length, 38, 'duplicate merge policy changed');
assert.equal(built.counts.exactDuplicateMerges, 35, 'exact duplicate audit changed');
assert.equal(built.counts.reviewedNearDuplicateMerges, 3, 'reviewed near-duplicate audit changed');
assert.equal(built.policy.snippetEntries.length, 25, 'snippet split policy changed');
assert.equal(Object.keys(built.policy.idOverrides).length, 2, 'ID collision repair policy changed');
assert.equal(Object.keys(built.policy.titleOverrides).length, 12, 'ambiguous-title repair policy changed');
assert.equal(built.policy.controlledTags.length, 55, 'controlled vocabulary must stay within the approved 40–60 range');
assert.equal(built.additions.prompts.length, 32, 'new coverage additions changed');
assert.equal(publicPrompts.prompts.length, 1142, 'canonical prompt library count changed');
assert.equal(publicSnippets.snippets.length, 25, 'snippet library count changed');
assert.equal(publicPrompts.policyVersion, built.policy.version);
assert.equal(publicSnippets.policyVersion, built.policy.version);

const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s\p{P}\p{S}]+/gu, '');
const unique = (items, keyOf, label) => {
  const seen = new Set();
  for (const item of items) {
    const key = keyOf(item);
    assert.ok(!seen.has(key), `${label}: ${key}`);
    seen.add(key);
  }
};

unique(publicPrompts.prompts, (item) => item.id, 'duplicate public prompt id');
unique(publicPrompts.prompts, (item) => normalize(item.title), 'duplicate public prompt title');
unique(publicPrompts.prompts, (item) => normalize(item.template), 'duplicate public prompt template');
unique(publicSnippets.snippets, (item) => item.id, 'duplicate snippet id');

const promptTemplates = new Set(publicPrompts.prompts.map((item) => normalize(item.template)));
assert.ok(publicSnippets.snippets.every((item) => !promptTemplates.has(normalize(item.content))), 'snippet content remains in the prompt library');
assert.deepEqual(new Set(publicSnippets.snippets.map((item) => item.type)), new Set(['code', 'config', 'query', 'payload', 'template']));

const allowedTags = new Set(built.policy.controlledTags.map((item) => item.label));
const usedTags = new Set(publicPrompts.prompts.flatMap((item) => item.tags));
assert.equal(usedTags.size, 55, 'not all controlled tags are represented');
assert.ok(publicPrompts.prompts.every((item) => item.tags.length >= 1 && item.tags.length <= 6 && item.tags.every((tag) => allowedTags.has(tag))), 'uncontrolled prompt tag remains');
assert.ok(publicSnippets.snippets.every((item) => item.tags.length >= 1 && item.tags.length <= 6 && item.tags.every((tag) => allowedTags.has(tag))), 'uncontrolled snippet tag remains');
assert.ok(publicPrompts.prompts.every((item) => !(item.tags ?? []).some((tag) => /eduverse/i.test(tag))), 'source-specific tag remains public');

const withExamples = publicPrompts.prompts.filter((item) => item.examples.length).length;
const withNotes = publicPrompts.prompts.filter((item) => item.notes).length;
assert.equal(withExamples, 114, `core example audit changed: ${withExamples}`);
assert.equal(withNotes, 116, `usage-note audit changed: ${withNotes}`);
assert.ok(built.additions.prompts.every((addition) => publicPrompts.prompts.some((item) => item.id === addition.id && item.examples.length && item.notes)), 'new prompt missing example or note');

const coverageCounts = built.additions.prompts.reduce((counts, item) => {
  counts[item.coverageArea] = (counts[item.coverageArea] ?? 0) + 1;
  return counts;
}, {});
assert.deepEqual(coverageCounts, Object.fromEntries(built.additions.coveragePlan.map((item) => [item.id, item.count])), 'new prompt coverage plan changed');

assert.ok(publicPrompts.prompts.some((item) => item.id === 'mcp-tool-integration-example'));
assert.ok(publicPrompts.prompts.some((item) => item.id === 'ops-kpi-report-example'));
assert.match(component, /prompt\.notes/, 'prompt usage notes are not rendered');
assert.match(component, /example\.output/, 'prompt example outputs are not rendered');
assert.match(snippetComponent, /data-snippets-url="\.\.\/data\/snippets\.json"/);
assert.match(snippetComponent, /const PAGE_SIZE = 20;/);
assert.match(snippetComponent, /navigator\.clipboard\.writeText\(snippet\.content\)/);

for (const addition of built.additions.prompts) {
  await readdir(path.join('src', 'content', 'docs', 'wiki')).then((files) => assert.ok(files.includes(`${addition.relatedWikiSlug}.md`), `missing related wiki article: ${addition.id} -> ${addition.relatedWikiSlug}`));
}

console.log(`W33 prompt library: 1173 source - 38 merged - 25 snippets + 32 additions = 1142 prompts; ${withExamples} examples, ${withNotes} notes, 55 controlled tags`);

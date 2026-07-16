import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readIds = (directory, suffix) => fs.readdirSync(path.join(root, directory))
  .filter((name) => name.endsWith(suffix))
  .map((name) => readJson(`${directory}/${name}`).id)
  .sort();
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const promptIds = readIds('content-model/library/prompts', '.prompt.json');
const artifactIds = readIds('content-model/library/artifacts', '.artifact.json');
const migration = readJson('content-model/migration/w40-library-migration.json');
const policy = readJson('content-model/library-policy-v2.json');

if (promptIds.length !== migration.counts.prompts || artifactIds.length !== migration.counts.artifacts) {
  throw new Error('W48 baseline must be captured before the library is expanded');
}
if (sha256(promptIds.join('\n')) !== migration.compatibility.publicPromptIdsSha256
  || sha256(artifactIds.join('\n')) !== migration.compatibility.publicArtifactIdsSha256) {
  throw new Error('W40 compatibility hashes changed before W48 baseline capture');
}

const baseManifest = {
  schemaVersion: '1.0',
  milestone: 'W48',
  capturedAt: '2026-07-16',
  purpose: 'Freeze the W40 canonical migration set so later additions do not weaken ID-preservation checks.',
  counts: { prompts: promptIds.length, artifacts: artifactIds.length },
  hashes: {
    promptIdsSha256: sha256(promptIds.join('\n')),
    artifactIdsSha256: sha256(artifactIds.join('\n')),
  },
  promptIds,
  artifactIds,
};

const courseQuotas = {
  'prompt-systems': { prompts: 48, artifacts: 12 },
  'llm-evaluation': { prompts: 46, artifacts: 12 },
  'llmops-production': { prompts: 45, artifacts: 12 },
  'advanced-rag': { prompts: 45, artifacts: 12 },
  'production-agents': { prompts: 45, artifacts: 12 },
  'post-training-alignment': { prompts: 43, artifacts: 12 },
  'ai-security-redteam': { prompts: 43, artifacts: 12 },
  'multimodal-systems': { prompts: 43, artifacts: 11 },
};

const noExamplePromptIds = fs.readdirSync(path.join(root, 'content-model/library/prompts'))
  .filter((name) => name.endsWith('.prompt.json'))
  .map((name) => readJson(`content-model/library/prompts/${name}`))
  .filter((prompt) => prompt.examples.length === 0)
  .map((prompt) => prompt.id)
  .sort()
  .slice(0, 28);

const courses = Object.entries(courseQuotas).map(([courseId, quota]) => {
  const course = readJson(`content-model/paths/${courseId}.path.json`);
  return {
    courseId,
    title: course.title,
    promptQuota: quota.prompts,
    artifactQuota: quota.artifacts,
    sourceSteps: course.steps.map((step, index) => ({ order: index + 1, wikiSlug: step.ref })),
  };
});

const plan = {
  schemaVersion: '1.0',
  milestone: 'W48',
  plannedAt: '2026-07-16',
  objective: 'Expand the independent professional library without importing former-site prose, CTA wording, or guide layouts.',
  targets: policy.targetCounts,
  baseline: { prompts: promptIds.length, artifacts: artifactIds.length },
  additions: { prompts: 358, artifacts: 95, existingPromptExamples: 28 },
  final: { prompts: 1500, artifacts: 120, courses: 16, articles: 1600 },
  qualityTargets: policy.promptQuality,
  promptKindQuotas: {
    markdown: 130,
    'json-schema': 80,
    yaml: 40,
    xml: 20,
    'multi-message': 40,
    'evaluation-rubric': 30,
    plain: 18,
  },
  promptDifficultyQuotas: { professional: 280, advanced: 78 },
  artifactTypeQuotas: { code: 20, config: 15, query: 10, payload: 10, schema: 15, workflow: 15, template: 10 },
  editorialRules: {
    minimumTemplateCharacters: 500,
    exampleRequiredForEveryNewPrompt: true,
    controlledTagsOnly: true,
    providerNeutralByDefault: true,
    courseAndWikiLinksRequired: true,
    ctaLanguageForbidden: true,
    formerSiteMarkersForbidden: true,
    secretsForbidden: true,
  },
  exampleEnrichmentPromptIds: noExamplePromptIds,
  courses,
};

fs.mkdirSync(path.join(root, 'content-model/migration'), { recursive: true });
fs.mkdirSync(path.join(root, 'content-model/research'), { recursive: true });
fs.writeFileSync(path.join(root, 'content-model/migration/w48-base-library.json'), `${JSON.stringify(baseManifest, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'content-model/research/w48-library-expansion-plan.json'), `${JSON.stringify(plan, null, 2)}\n`);
console.log(`W48 plan: ${promptIds.length}+358 prompts, ${artifactIds.length}+95 artifacts, ${courses.length} professional courses`);

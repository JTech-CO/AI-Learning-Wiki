import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_EDITOR_QUALITY_MANIFEST = 'content-model/quality/editor-quality-manifest.json';

export const readText = (file) => fs.readFileSync(file, 'utf8');
export const readJson = (file) => JSON.parse(readText(file));
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const calendarDatePattern = /^\d{4}-\d{2}-\d{2}$/u;

export const assertCalendarDate = (value, label = 'date') => {
  if (!calendarDatePattern.test(value)) throw new Error(`${label} must use YYYY-MM-DD: ${value}`);
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} is not a valid calendar date: ${value}`);
  }
  return value;
};

const namedArgument = (argv, name) => {
  const inlinePrefix = `${name}=`;
  const inline = argv.find((argument) => argument.startsWith(inlinePrefix));
  if (inline) return inline.slice(inlinePrefix.length);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};

const dateInTimeZone = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${valueByType.year}-${valueByType.month}-${valueByType.day}`;
};

export const resolveBuildClock = ({
  argv = process.argv.slice(2),
  env = process.env,
  now = new Date(),
  manifest,
} = {}) => {
  if (!manifest) throw new Error('editor quality manifest is required');
  const explicitAsOf = namedArgument(argv, '--as-of');
  const configuredAsOf = env[manifest.clock.asOfEnvironmentVariable];
  const sourceDateEpoch = env[manifest.clock.sourceDateEpochEnvironmentVariable];

  let clock = now;
  let source = 'system-clock';
  let asOf = explicitAsOf ?? configuredAsOf;
  if (explicitAsOf) source = 'cli';
  else if (configuredAsOf) source = 'environment';
  else if (sourceDateEpoch !== undefined && sourceDateEpoch !== '') {
    const epochSeconds = Number(sourceDateEpoch);
    if (!Number.isFinite(epochSeconds)) throw new Error(`SOURCE_DATE_EPOCH is invalid: ${sourceDateEpoch}`);
    clock = new Date(epochSeconds * 1000);
    if (Number.isNaN(clock.getTime())) throw new Error(`SOURCE_DATE_EPOCH is invalid: ${sourceDateEpoch}`);
    source = 'source-date-epoch';
  }

  if (!asOf) asOf = dateInTimeZone(clock, manifest.clock.timeZone);
  assertCalendarDate(asOf, 'editor quality as-of date');
  return { asOf, generatedAt: clock.toISOString(), source };
};

export const loadEditorQualityManifest = (file = DEFAULT_EDITOR_QUALITY_MANIFEST) => {
  const manifest = readJson(file);
  if (manifest.schemaVersion !== '1.0') throw new Error(`unsupported editor quality manifest: ${manifest.schemaVersion}`);
  for (const key of ['canonical', 'public', 'release']) {
    if (typeof manifest.outputs?.[key] !== 'string' || manifest.outputs[key].length === 0) {
      throw new Error(`editor quality manifest output is missing: ${key}`);
    }
  }
  const mutableOutputs = new Set(Object.values(manifest.outputs).map((filePath) => path.normalize(filePath)));
  for (const baseline of manifest.frozenBaselines ?? []) {
    if (mutableOutputs.has(path.normalize(baseline.path))) {
      throw new Error(`frozen baseline cannot be a mutable output: ${baseline.path}`);
    }
  }
  return manifest;
};

export const deriveArticleQualityContract = (articleSchema, policy) => ({
  publicationStatus: policy.publicationState === 'reviewed-only' ? 'reviewed' : null,
  minimumSectionCount: articleSchema.properties.sections.minItems,
  recommendedSectionCount: {
    min: policy.structure.recommendedSectionCount.min,
    max: policy.structure.recommendedSectionCount.max,
  },
  minimumIndependentSourceFamilies: policy.evidence.minimumIndependentSourceFamilies,
  sourceRefsRequiredForEveryFactualSection: policy.evidence.sourceRefsRequiredForEveryFactualSection,
});

export const verifyFrozenBaselines = (manifest) => (manifest.frozenBaselines ?? []).map((baseline) => {
  const actualSha256 = sha256(readText(baseline.path));
  return {
    ...baseline,
    actualSha256,
    intact: actualSha256 === baseline.sha256,
  };
});

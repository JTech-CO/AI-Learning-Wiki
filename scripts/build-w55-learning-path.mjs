import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildLearningPath } from '../src/lib/learning-path.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (file) => path.join(root, file);
const readText = (file) => fs.readFileSync(resolve(file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const registry = readJson('content-model/labs/registry.json');
const wiki = readJson('public/data/wiki-index.json');
const fixtureSet = readJson('content-model/labs/fixtures/w55-learning-path.json');
const tool = registry.tools.find(({ id }) => id === 'learning-path');

const implementationFiles = [
  'src/lib/learning-path.mjs',
  'src/components/lab/LearningPathBuilder.astro',
  'src/components/lab/LabDirectory.astro',
  'src/content/docs/lab/index.mdx',
  'src/content/docs/lab/learning-path.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w55-learning-path.json',
];

const stableResult = (result) => ({
  goalId: result.goalId,
  level: result.level,
  focus: result.focus,
  includeMathematics: result.includeMathematics,
  maxDocuments: result.maxDocuments,
  path: result.path.map(({ id, distance, requiredById, courseIds }) => ({
    id,
    distance,
    requiredById,
    courseIds,
  })),
  nextArticles: result.nextArticles.map(({ id }) => id),
  prerequisiteCoverage: result.prerequisiteCoverage,
  eligiblePrerequisiteCount: result.eligiblePrerequisiteCount,
  selectedPrerequisiteCount: result.selectedPrerequisiteCount,
  omittedByAssumptionCount: result.omittedByAssumptionCount,
  warningCodes: result.warnings.map(({ code }) => code).sort(),
  assumptions: result.assumptions.map(({ id, sourceIds }) => ({ id, sourceIds })),
});

const fixtureResults = fixtureSet.fixtures.map((fixture) => {
  const result = buildLearningPath({
    articles: wiki.articles,
    courses: wiki.courses,
    ...fixture,
  });
  const stable = stableResult(result);

  return {
    id: fixture.id,
    goalId: fixture.goalId,
    pathLength: result.path.length,
    prerequisiteCoverage: result.prerequisiteCoverage,
    warningCodes: stable.warningCodes,
    expectedWarningCodes: [...fixture.expectedWarningCodes].sort(),
    targetIsLast: result.path.at(-1)?.id === fixture.goalId,
    uniquePath: new Set(result.path.map(({ id }) => id)).size === result.path.length,
    sha256: sha256(JSON.stringify(stable)),
  };
});

const withPrerequisites = wiki.articles.filter((article) => article.prerequisites.length > 0).length;
const report = {
  schemaVersion: '1.0',
  milestone: 'W55',
  releasedAt: registry.updatedAt,
  tool: {
    id: tool.id,
    title: tool.title,
    route: tool.route,
    status: tool.status,
    formulaVersion: tool.evidence.formulaVersion,
    execution: tool.execution,
  },
  publicSurface: {
    hubRoute: registry.hub.route,
    hubPage: 'src/content/docs/lab/index.mdx',
    toolPage: 'src/content/docs/lab/learning-path.mdx',
    globalNavigation: 'src/components/wiki/WikiSidebar.astro',
    homeNavigation: 'src/components/wiki/WikiHome.astro',
    shareableParameters: ['goal', 'level', 'limit', 'focus', 'math'],
  },
  implementation: Object.fromEntries(implementationFiles.map((file) => [
    file,
    {
      bytes: Buffer.byteLength(readText(file)),
      sha256: sha256(readText(file)),
    },
  ])),
  dataSnapshot: {
    wikiGeneratedAt: wiki.generatedAt,
    articles: wiki.articles.length,
    categories: wiki.categories.length,
    courses: wiki.courses.length,
    articlesWithPrerequisites: withPrerequisites,
    prerequisiteCoveragePercent: Number((withPrerequisites / wiki.articles.length * 100).toFixed(1)),
  },
  deterministicFixtures: {
    source: 'content-model/labs/fixtures/w55-learning-path.json',
    count: fixtureResults.length,
    requiredCount: tool.releaseGate.deterministicFixtureCount,
    results: fixtureResults,
  },
  releaseGates: {
    clientOnly: tool.execution.mode === 'client-only',
    noInputTransmission: tool.execution.transmitsUserInput === false,
    noPersistentStorage: tool.execution.persistentStorage === 'none',
    assumptionsVisible: tool.releaseGate.disclosesAssumptions,
    keyboardAccessible: tool.releaseGate.keyboardAccessible,
    mobileLayout: tool.releaseGate.mobileLayout,
    linksToWiki: tool.releaseGate.linksToWiki,
    shareableState: tool.releaseGate.shareableState,
    allFixturesDeterministic: fixtureResults.every(({ targetIsLast, uniquePath }) => targetIsLast && uniquePath),
    allExpectedWarningsMatched: fixtureResults.every(
      ({ warningCodes, expectedWarningCodes }) =>
        JSON.stringify(warningCodes) === JSON.stringify(expectedWarningCodes),
    ),
  },
};

fs.mkdirSync(resolve('content-model/quality'), { recursive: true });
fs.writeFileSync(
  resolve('content-model/quality/w55-learning-path.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(
  `W55 learning path: ${fixtureResults.length} deterministic fixtures, `
  + `${wiki.articles.length} articles, ${tool.status} tool at ${tool.route}`,
);

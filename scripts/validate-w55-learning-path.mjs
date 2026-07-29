import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
  buildLearningPath,
  resolveArticleQuery,
} from '../src/lib/learning-path.mjs';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const validationMessage = (validate) =>
  validate.errors
    ?.map((error) => `${error.instancePath || '/'} ${error.message}`)
    .join('; ')
  ?? 'unknown validation error';

const registry = readJson('content-model/labs/registry.json');
const wiki = readJson('public/data/wiki-index.json');
const fixtureSet = readJson('content-model/labs/fixtures/w55-learning-path.json');
const report = readJson('content-model/quality/w55-learning-path.json');
const sessionSchema = readJson('content-model/schema.lab-session-v1.json');
const tool = registry.tools.find(({ id }) => id === 'learning-path');
const wikiIds = new Set(wiki.articles.map(({ id }) => id));
const courseIds = new Set(wiki.courses.map(({ id }) => id));

assert.ok(tool, 'learning-path tool manifest is missing');
assert.equal(tool.status, 'active');
assert.equal(tool.plannedMilestone, 'W55');
assert.equal(tool.route, '/lab/learning-path/');
assert.equal(tool.execution.mode, 'client-only');
assert.equal(tool.execution.networkAccess, 'same-origin-data');
assert.equal(tool.execution.transmitsUserInput, false);
assert.equal(tool.execution.persistentStorage, 'none');
assert.equal(tool.releaseGate.shareableState, true);
assert.deepEqual(
  tool.contracts.warningDefinitions.map(({ code }) => code),
  ['GRAPH_CYCLE', 'PATH_TRUNCATED', 'MATH_FILTERED'],
);

const requiredFiles = [
  'src/lib/learning-path.mjs',
  'src/components/lab/LearningPathBuilder.astro',
  'src/components/lab/LabDirectory.astro',
  'src/content/docs/lab/index.mdx',
  'src/content/docs/lab/learning-path.mdx',
  'src/styles/wiki-lab.css',
  'content-model/labs/fixtures/w55-learning-path.json',
];
for (const file of requiredFiles) assert.ok(fs.existsSync(file), `missing W55 file: ${file}`);

const componentSource = readText('src/components/lab/LearningPathBuilder.astro');
const hubSource = readText('src/components/lab/LabDirectory.astro');
const sidebarSource = readText('src/components/wiki/WikiSidebar.astro');
const homeSource = readText('src/components/wiki/WikiHome.astro');
const styleSource = readText('src/styles/wiki-lab.css');
assert.match(componentSource, /data-learning-path-builder/);
assert.match(componentSource, /aria-live="polite"/);
assert.match(componentSource, /history\.replaceState/);
assert.match(componentSource, /navigator\.clipboard/);
assert.match(componentSource, /fetch\(builder\.dataset\.wikiIndexUrl\)/);
assert.doesNotMatch(componentSource, /localStorage|sessionStorage/);
assert.doesNotMatch(componentSource, /fetch\(['"]https?:\/\//);
assert.match(hubSource, /tool\.status === 'active'/);
assert.match(sidebarSource, /href="\/lab\/"/);
assert.match(sidebarSource, /href="\/lab\/learning-path\/"/);
assert.match(homeSource, /맞춤 학습 경로 만들기/);
assert.match(styleSource, /@media \(max-width: 50rem\)/);
assert.match(styleSource, /focus-visible/);

assert.equal(resolveArticleQuery(wiki.articles, '검색 증강 생성')?.id, 'rag');
assert.equal(resolveArticleQuery(wiki.articles, 'Large Language Model')?.id, 'large-language-model');
assert.equal(resolveArticleQuery(wiki.articles, 'not-a-real-article'), null);

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validateSession = ajv.compile(sessionSchema);

const stableResult = (result) => ({
  goalId: result.goalId,
  path: result.path.map(({ id, distance, requiredById, courseIds: linkedCourses }) => ({
    id,
    distance,
    requiredById,
    linkedCourses,
  })),
  nextArticles: result.nextArticles.map(({ id }) => id),
  prerequisiteCoverage: result.prerequisiteCoverage,
  eligiblePrerequisiteCount: result.eligiblePrerequisiteCount,
  selectedPrerequisiteCount: result.selectedPrerequisiteCount,
  warnings: result.warnings.map(({ code }) => code).sort(),
  assumptions: result.assumptions,
});

assert.equal(fixtureSet.milestone, 'W55');
assert.equal(fixtureSet.toolId, 'learning-path');
assert.equal(fixtureSet.fixtures.length, tool.releaseGate.deterministicFixtureCount);
assert.equal(new Set(fixtureSet.fixtures.map(({ id }) => id)).size, fixtureSet.fixtures.length);

for (const fixture of fixtureSet.fixtures) {
  assert.ok(wikiIds.has(fixture.goalId), `${fixture.id}: unknown goal`);
  const first = buildLearningPath({
    articles: wiki.articles,
    courses: wiki.courses,
    ...fixture,
  });
  const second = buildLearningPath({
    articles: wiki.articles,
    courses: wiki.courses,
    ...fixture,
  });
  const firstStable = stableResult(first);
  const secondStable = stableResult(second);

  assert.deepEqual(firstStable, secondStable, `${fixture.id}: result is not deterministic`);
  assert.equal(first.path.at(-1)?.id, fixture.goalId, `${fixture.id}: target must be last`);
  assert.ok(first.path.length >= 1 && first.path.length <= fixture.maxDocuments);
  assert.equal(new Set(first.path.map(({ id }) => id)).size, first.path.length);
  assert.ok(first.prerequisiteCoverage >= 0 && first.prerequisiteCoverage <= 100);
  assert.deepEqual(
    first.warnings.map(({ code }) => code).sort(),
    [...fixture.expectedWarningCodes].sort(),
    `${fixture.id}: warning contract changed`,
  );

  for (const article of first.path) {
    assert.ok(wikiIds.has(article.id), `${fixture.id}: unknown path article ${article.id}`);
    assert.ok(article.url.startsWith('/wiki/'), `${fixture.id}: invalid article URL ${article.url}`);
    for (const courseId of article.courseIds) {
      assert.ok(courseIds.has(courseId), `${fixture.id}: unknown course ${courseId}`);
    }
    if (!fixture.includeMathematics && article.id !== fixture.goalId) {
      assert.equal(article.categories.includes('mathematics'), false);
    }
  }

  const session = {
    schemaVersion: '1.0',
    toolId: 'learning-path',
    toolVersion: '1.0.0',
    locale: 'ko-KR',
    resultStatus: first.warnings.length > 0 ? 'warning' : 'ok',
    inputs: {
      goalArticleId: fixture.goalId,
      level: fixture.level,
      maxDocuments: fixture.maxDocuments,
      focus: fixture.focus,
      includeMathematics: fixture.includeMathematics,
    },
    outputs: {
      orderedArticles: first.path.map(({ id }) => id),
      prerequisiteCoverage: first.prerequisiteCoverage,
      pathRationale: first.path.map(({ id, rationale }) => ({ id, rationale })),
    },
    warnings: first.warnings,
    assumptions: first.assumptions,
    wikiLinks: first.path.map(({ id }) => id),
    provenance: {
      formulaVersion: first.formulaVersion,
      sourceVersions: [
        { id: 'wiki-index', version: 'W55 release' },
        { id: 'course-paths', version: 'W53 baseline' },
      ],
      calculatedAt: first.generatedAt,
    },
    privacy: {
      execution: 'client-only',
      networkAccess: 'same-origin-data',
      transmitted: false,
      persisted: 'none',
    },
  };
  assert.equal(validateSession(session), true, `${fixture.id}: ${validationMessage(validateSession)}`);
}

assert.throws(
  () => buildLearningPath({
    articles: wiki.articles,
    courses: wiki.courses,
    goalId: 'not-a-real-article',
  }),
  /찾을 수 없다/,
);

assert.equal(report.milestone, 'W55');
assert.equal(report.tool.id, 'learning-path');
assert.equal(report.tool.status, 'active');
assert.equal(report.publicSurface.hubRoute, '/lab/');
assert.equal(report.publicSurface.toolPage, 'src/content/docs/lab/learning-path.mdx');
assert.deepEqual(report.publicSurface.shareableParameters, ['goal', 'level', 'limit', 'focus', 'math']);
assert.equal(report.dataSnapshot.articles, wiki.articles.length);
assert.equal(report.dataSnapshot.courses, wiki.courses.length);
assert.equal(report.deterministicFixtures.count, fixtureSet.fixtures.length);
assert.equal(report.deterministicFixtures.requiredCount, tool.releaseGate.deterministicFixtureCount);
assert.equal(report.releaseGates.clientOnly, true);
assert.equal(report.releaseGates.noInputTransmission, true);
assert.equal(report.releaseGates.noPersistentStorage, true);
assert.equal(report.releaseGates.allFixturesDeterministic, true);
assert.equal(report.releaseGates.allExpectedWarningsMatched, true);

for (const [file, metadata] of Object.entries(report.implementation)) {
  assert.equal(metadata.bytes, Buffer.byteLength(readText(file)), `${file}: byte count changed`);
  assert.equal(metadata.sha256, sha256(readText(file)), `${file}: hash changed`);
}

console.log(
  `W55 learning path: ${fixtureSet.fixtures.length} deterministic fixtures, `
  + `${wiki.articles.length} searchable goals, shared-state and private client execution OK`,
);

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const validationMessage = (validate) => validate.errors?.map((error) => `${error.instancePath || '/'} ${error.message}`).join('; ') ?? 'unknown validation error';

const registryPath = 'content-model/labs/registry.json';
const registrySchemaPath = 'content-model/schema.lab-registry-v1.json';
const toolSchemaPath = 'content-model/schema.lab-tool-v1.json';
const sessionSchemaPath = 'content-model/schema.lab-session-v1.json';
const registry = readJson(registryPath);
const registrySchema = readJson(registrySchemaPath);
const toolSchema = readJson(toolSchemaPath);
const sessionSchema = readJson(sessionSchemaPath);
const report = readJson('content-model/quality/w54-lab-architecture.json');
const wiki = readJson('public/data/wiki-index.json');

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(toolSchema);
ajv.addSchema(sessionSchema);
const validateRegistry = ajv.compile(registrySchema);
const validateSession = ajv.getSchema(sessionSchema.$id);

assert.equal(ajv.validateSchema(toolSchema), true, ajv.errorsText(ajv.errors));
assert.equal(ajv.validateSchema(sessionSchema), true, ajv.errorsText(ajv.errors));
assert.equal(ajv.validateSchema(registrySchema), true, ajv.errorsText(ajv.errors));
assert.equal(validateRegistry(registry), true, validationMessage(validateRegistry));
assert.equal(registry.milestone, 'W54');
assert.equal(registry.hub.route, '/lab/');
assert.equal(registry.hub.activation, 'with-first-active-tool');
assert.equal(registry.releasePolicy.emptyHubForbidden, true);

const sectionIds = registry.sections.map((section) => section.id);
const sectionOrders = registry.sections.map((section) => section.order);
assert.deepEqual(sectionIds, ['learning', 'measurement', 'validation', 'operations']);
assert.deepEqual(sectionOrders, [1, 2, 3, 4]);
assert.equal(new Set(sectionIds).size, sectionIds.length);

const expectedToolIds = ['learning-path', 'evaluation-metrics', 'model-memory', 'prompt-schema', 'token-context', 'rag-evaluation'];
const toolIds = registry.tools.map((tool) => tool.id);
const toolRoutes = registry.tools.map((tool) => tool.route);
assert.deepEqual(toolIds, expectedToolIds);
assert.deepEqual(registry.tools.map((tool) => tool.order), [1, 2, 3, 4, 5, 6]);
assert.equal(new Set(toolIds).size, toolIds.length);
assert.equal(new Set(toolRoutes).size, toolRoutes.length);
assert.equal(registry.tools.filter((tool) => tool.status === 'active').length, 0);
assert.deepEqual(
  Object.fromEntries(registry.tools.map((tool) => [tool.id, tool.plannedMilestone])),
  {
    'learning-path': 'W55',
    'evaluation-metrics': 'W56',
    'model-memory': 'W57',
    'prompt-schema': 'W58',
    'token-context': 'backlog',
    'rag-evaluation': 'backlog',
  },
);

const wikiIds = new Set(wiki.articles.map((article) => article.id));
const courseIds = new Set(wiki.courses.map((course) => course.id));
for (const tool of registry.tools) {
  assert.equal(tool.route, `/lab/${tool.id}/`, `${tool.id}: route must follow the common pattern`);
  assert.equal(tool.execution.mode, 'client-only', `${tool.id}: W54 tools must default to client-only execution`);
  assert.notEqual(tool.execution.networkAccess, 'external-api', `${tool.id}: external API is outside the W54 baseline`);
  assert.equal(tool.execution.transmitsUserInput, false, `${tool.id}: user input transmission is forbidden`);
  assert.equal(tool.execution.persistentStorage, 'none', `${tool.id}: user input persistence is forbidden`);
  assert.equal(tool.releaseGate.noServerData, true);
  assert.ok(tool.releaseGate.deterministicFixtureCount >= 3);

  const inputIds = tool.contracts.inputFields.map((field) => field.id);
  const outputIds = tool.contracts.outputFields.map((field) => field.id);
  const warningCodes = tool.contracts.warningDefinitions.map((warning) => warning.code);
  assert.equal(new Set(inputIds).size, inputIds.length, `${tool.id}: duplicate input field`);
  assert.equal(new Set(outputIds).size, outputIds.length, `${tool.id}: duplicate output field`);
  assert.equal(new Set(warningCodes).size, warningCodes.length, `${tool.id}: duplicate warning code`);

  for (const slug of tool.contentLinks.wikiSlugs) assert.ok(wikiIds.has(slug), `${tool.id}: missing wiki link ${slug}`);
  for (const courseId of tool.contentLinks.courseIds) assert.ok(courseIds.has(courseId), `${tool.id}: missing course link ${courseId}`);
  for (const field of [...tool.contracts.inputFields, ...tool.contracts.outputFields]) {
    for (const slug of field.wikiSlugs) assert.ok(wikiIds.has(slug), `${tool.id}.${field.id}: missing wiki link ${slug}`);
  }
  for (const source of tool.evidence.sources) {
    if (!source.locator.startsWith('https://') && !source.locator.includes('*')) {
      assert.ok(fs.existsSync(source.locator), `${tool.id}: internal source does not exist: ${source.locator}`);
    }
  }
}

const validSession = {
  schemaVersion: '1.0',
  toolId: 'learning-path',
  toolVersion: '0.1.0',
  locale: 'ko-KR',
  resultStatus: 'ok',
  inputs: {
    goalArticleId: 'rag',
    level: 'intermediate',
    maxDocuments: 10,
    focus: 'balanced',
    includeMathematics: true
  },
  outputs: {
    orderedArticles: ['artificial-intelligence', 'machine-learning', 'rag'],
    prerequisiteCoverage: 100
  },
  warnings: [],
  assumptions: [
    {
      id: 'relationship-baseline',
      text: '문서의 선수 관계와 관련 문서 연결이 현재 공개 색인과 동일하다고 가정한다.',
      sourceIds: ['wiki-index']
    }
  ],
  wikiLinks: ['rag', 'machine-learning'],
  provenance: {
    formulaVersion: 'graph-path-v1',
    sourceVersions: [
      { id: 'wiki-index', version: 'W54 baseline' }
    ],
    calculatedAt: '2026-07-29T00:00:00.000Z'
  },
  privacy: {
    execution: 'client-only',
    networkAccess: 'same-origin-data',
    transmitted: false,
    persisted: 'none'
  }
};
assert.equal(validateSession(validSession), true, validationMessage(validateSession));
assert.equal(validateSession({ ...validSession, privacy: { ...validSession.privacy, transmitted: true } }), false, 'transmitted user data must fail');
assert.equal(validateSession({ ...validSession, unexpected: true }), false, 'unknown session fields must fail');

const withPrerequisites = wiki.articles.filter((article) => article.prerequisites.length > 0).length;
const withRelated = wiki.articles.filter((article) => article.related.length > 0).length;
const uniqueCourseArticles = new Set(wiki.courses.flatMap((course) => course.steps.map((step) => step.ref))).size;
assert.equal(report.milestone, 'W54');
assert.equal(report.toolPlan.total, registry.tools.length);
assert.equal(report.toolPlan.active, 0);
assert.equal(report.toolPlan.allClientOnly, true);
assert.equal(report.toolPlan.allInputsPrivate, true);
assert.equal(report.relationshipReadiness.articles, wiki.articles.length);
assert.equal(report.relationshipReadiness.withPrerequisites, withPrerequisites);
assert.ok(report.relationshipReadiness.prerequisiteCoveragePercent >= 95);
assert.equal(report.relationshipReadiness.withRelated, withRelated);
assert.equal(report.relationshipReadiness.relatedCoveragePercent, 100);
assert.equal(report.relationshipReadiness.uniqueCourseArticles, uniqueCourseArticles);
assert.equal(report.publicSurface.publicPageCreatedInW54, false);
assert.equal(report.publicSurface.publicToolRoutesCreatedInW54, 0);
assert.equal(fs.existsSync('src/content/docs/lab.mdx'), false, 'empty public lab hub must not be created in W54');
assert.equal(fs.existsSync('src/pages/lab'), false, 'empty public lab routes must not be created in W54');

assert.equal(report.contracts.registry.sha256, sha256(readText(registrySchemaPath)));
assert.equal(report.contracts.toolManifest.sha256, sha256(readText(toolSchemaPath)));
assert.equal(report.contracts.runtimeSession.sha256, sha256(readText(sessionSchemaPath)));
assert.equal(report.contracts.registryData.sha256, sha256(readText(registryPath)));
assert.equal(report.nextMilestone.id, 'W55');
assert.equal(report.nextMilestone.toolId, 'learning-path');

console.log(`W54 lab architecture: ${registry.tools.length} tool manifests, 3 schemas, ${report.relationshipReadiness.prerequisiteCoveragePercent}% prerequisite coverage, private client-side baseline OK`);

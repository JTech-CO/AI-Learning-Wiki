import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resolve = (file) => path.join(root, file);
const readText = (file) => fs.readFileSync(resolve(file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const registryPath = 'content-model/labs/registry.json';
const registrySchemaPath = 'content-model/schema.lab-registry-v1.json';
const toolSchemaPath = 'content-model/schema.lab-tool-v1.json';
const sessionSchemaPath = 'content-model/schema.lab-session-v1.json';
const registry = readJson(registryPath);
const registrySchema = readJson(registrySchemaPath);
const toolSchema = readJson(toolSchemaPath);
const sessionSchema = readJson(sessionSchemaPath);
const wiki = readJson('public/data/wiki-index.json');

const courseStepRefs = wiki.courses.flatMap((course) => course.steps.map((step) => step.ref));
const uniqueCourseStepRefs = new Set(courseStepRefs);
const withPrerequisites = wiki.articles.filter((article) => article.prerequisites.length > 0).length;
const withRelated = wiki.articles.filter((article) => article.related.length > 0).length;
const bySection = Object.fromEntries(registry.sections.map((section) => [
  section.id,
  registry.tools.filter((tool) => tool.section === section.id).length,
]));
const byMilestone = Object.fromEntries(
  [...new Set(registry.tools.map((tool) => tool.plannedMilestone))]
    .sort((a, b) => a === 'backlog' ? 1 : b === 'backlog' ? -1 : Number(a.slice(1)) - Number(b.slice(1)))
    .map((milestone) => [milestone, registry.tools.filter((tool) => tool.plannedMilestone === milestone).map((tool) => tool.id)]),
);
const toolContentPath = (tool) => `src/content/docs${tool.route.slice(0, -1)}.mdx`;
const publicToolRoutes = registry.tools
  .filter((tool) => fs.existsSync(resolve(toolContentPath(tool))))
  .map((tool) => tool.route);

const report = {
  schemaVersion: '1.0',
  milestone: 'W54',
  designedAt: registry.updatedAt,
  contracts: {
    registry: { path: registrySchemaPath, id: registrySchema.$id, sha256: sha256(readText(registrySchemaPath)) },
    toolManifest: { path: toolSchemaPath, id: toolSchema.$id, sha256: sha256(readText(toolSchemaPath)) },
    runtimeSession: { path: sessionSchemaPath, id: sessionSchema.$id, sha256: sha256(readText(sessionSchemaPath)) },
    registryData: { path: registryPath, sha256: sha256(readText(registryPath)) },
  },
  informationArchitecture: {
    hub: registry.hub,
    navigation: registry.navigation,
    sectionOrder: registry.sections.map((section) => section.id),
    sourceOfTruth: registry.sourceOfTruth,
    releasePolicy: registry.releasePolicy,
  },
  toolPlan: {
    total: registry.tools.length,
    active: registry.tools.filter((tool) => tool.status === 'active').length,
    planned: registry.tools.filter((tool) => tool.status === 'planned').length,
    ids: registry.tools.map((tool) => tool.id),
    bySection,
    byMilestone,
    allClientOnly: registry.tools.every((tool) => tool.execution.mode === 'client-only'),
    allInputsPrivate: registry.tools.every((tool) => !tool.execution.transmitsUserInput && tool.execution.persistentStorage === 'none'),
    allEvidenceLinked: registry.tools.every((tool) => tool.evidence.sources.length > 0),
    allWikiLinked: registry.tools.every((tool) => tool.contentLinks.wikiSlugs.length >= 3),
  },
  relationshipReadiness: {
    articles: wiki.articles.length,
    withPrerequisites,
    prerequisiteCoveragePercent: Number((withPrerequisites / wiki.articles.length * 100).toFixed(1)),
    withRelated,
    relatedCoveragePercent: Number((withRelated / wiki.articles.length * 100).toFixed(1)),
    courseSteps: courseStepRefs.length,
    uniqueCourseArticles: uniqueCourseStepRefs.size,
    courseArticleCoveragePercent: Number((uniqueCourseStepRefs.size / wiki.articles.length * 100).toFixed(1)),
  },
  publicSurface: {
    hubRouteReserved: registry.hub.route,
    hubActivation: registry.hub.activation,
    emptyHubForbidden: registry.releasePolicy.emptyHubForbidden,
    publicHubAvailable: fs.existsSync(resolve('src/content/docs/lab/index.mdx')),
    publicToolRoutes,
    publicToolRouteCount: publicToolRoutes.length,
  },
  nextMilestone: {
    id: 'W55',
    toolId: 'learning-path',
    entryCriteria: [
      'W54 registry and schemas validate',
      'article prerequisite coverage remains at least 95 percent',
      'no user input leaves the browser',
      'the hub activates together with the first working tool'
    ]
  }
};

fs.mkdirSync(resolve('content-model/quality'), { recursive: true });
fs.writeFileSync(resolve('content-model/quality/w54-lab-architecture.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`W54 lab architecture: ${report.toolPlan.total} tools registered, ${report.toolPlan.active} active, ${report.relationshipReadiness.prerequisiteCoveragePercent}% prerequisite coverage`);

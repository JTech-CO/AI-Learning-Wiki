import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const countFiles = (directory, suffix) => fs.readdirSync(path.join(root, directory)).filter((name) => name.endsWith(suffix)).length;
function walk(directory, predicate) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(full, predicate));
    else if (predicate(full)) result.push(full);
  }
  return result;
}

const policy = readJson('content-model/library-policy-v2.json');
const prompts = readJson('public/data/prompts.json');
const snippets = readJson('public/data/snippets.json');
const wiki = readJson('public/data/wiki-index.json');
const promptEntries = fs.readdirSync(path.join(root, 'content-model/library/prompts')).filter((name) => name.endsWith('.prompt.json')).map((name) => readJson(`content-model/library/prompts/${name}`));
const artifactEntries = fs.readdirSync(path.join(root, 'content-model/library/artifacts')).filter((name) => name.endsWith('.artifact.json')).map((name) => readJson(`content-model/library/artifacts/${name}`));
const courseIds = fs.readdirSync(path.join(root, 'content-model/paths')).filter((name) => name.endsWith('.path.json')).map((name) => name.replace('.path.json', '')).sort();
const professionalIds = readJson('content-model/research/w48-library-expansion-plan.json').courses.map((course) => course.courseId);
const htmlFiles = walk(path.join(root, 'dist'), (file) => file.endsWith('.html'));
const requiredRoutes = ['index.html', 'paths/index.html', 'prompt-explorer/index.html', 'snippet-explorer/index.html', 'search/index.html', 'special/all-pages/index.html'];

const courseCoverage = Object.fromEntries(courseIds.map((courseId) => [courseId, {
  wikiSteps: readJson(`content-model/paths/${courseId}.path.json`).steps.length,
  prompts: promptEntries.filter((prompt) => prompt.courseIds.includes(courseId)).length,
  artifacts: artifactEntries.filter((artifact) => artifact.courseIds.includes(courseId)).length,
}]));

const report = {
  schemaVersion: '1.0', milestone: 'W53', releasedAt: '2026-07-16',
  targetCounts: policy.targetCounts,
  canonicalCounts: {
    articles: countFiles('content-model/articles', '.article.json'),
    courses: countFiles('content-model/paths', '.path.json'),
    prompts: promptEntries.length,
    artifacts: artifactEntries.length,
  },
  publicCounts: {
    articles: wiki.articles.length,
    courses: wiki.courses.length,
    prompts: prompts.prompts.length,
    artifacts: snippets.snippets.length,
    unifiedSearchRecords: wiki.articles.length + prompts.prompts.length + snippets.snippets.length,
  },
  promptQuality: {
    longForm: promptEntries.filter((prompt) => prompt.template.length >= policy.promptQuality.longFormThresholdCharacters).length,
    markdown: promptEntries.filter((prompt) => prompt.kind === 'markdown').length,
    schema: promptEntries.filter((prompt) => ['json-schema', 'yaml', 'xml'].includes(prompt.kind)).length,
    withExamples: promptEntries.filter((prompt) => prompt.examples.length > 0).length,
  },
  artifactQuality: {
    types: [...new Set(artifactEntries.map((artifact) => artifact.type))].sort(),
    withRuntime: artifactEntries.filter((artifact) => artifact.runtime).length,
    withValidation: artifactEntries.filter((artifact) => artifact.validation?.expectedResult).length,
    withSecurityNotes: artifactEntries.filter((artifact) => artifact.securityNotes.length > 0).length,
  },
  courseCoverage,
  professionalCourses: professionalIds,
  build: {
    htmlPages: htmlFiles.length,
    requiredRoutes: Object.fromEntries(requiredRoutes.map((route) => [route, fs.existsSync(path.join(root, 'dist', route))])),
    promptDataBytes: fs.statSync(path.join(root, 'dist/data/prompts.json')).size,
    artifactDataBytes: fs.statSync(path.join(root, 'dist/data/snippets.json')).size,
  },
};
fs.writeFileSync(path.join(root, 'content-model/quality/w53-integrated-release.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`W53 release report: ${report.canonicalCounts.articles} articles, ${report.canonicalCounts.courses} courses, ${report.canonicalCounts.prompts} prompts, ${report.canonicalCounts.artifacts} artifacts, ${report.build.htmlPages} pages`);

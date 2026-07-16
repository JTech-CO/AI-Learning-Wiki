import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const report = readJson('content-model/quality/w53-integrated-release.json');
const base = readJson('content-model/migration/w48-base-library.json');
const promptIds = fs.readdirSync('content-model/library/prompts').filter((name) => name.endsWith('.prompt.json')).map((name) => readJson(`content-model/library/prompts/${name}`).id).sort();
const artifactIds = fs.readdirSync('content-model/library/artifacts').filter((name) => name.endsWith('.artifact.json')).map((name) => readJson(`content-model/library/artifacts/${name}`).id).sort();
const readme = fs.readFileSync('README.md', 'utf8');
const homeSource = fs.readFileSync('src/components/wiki/WikiHome.astro', 'utf8');
const promptPage = fs.readFileSync('src/content/docs/prompt-explorer.mdx', 'utf8');
const pathsPage = fs.readFileSync('src/content/docs/paths.mdx', 'utf8');
const termsPage = fs.readFileSync('src/content/docs/terms-of-use.mdx', 'utf8');

assert.equal(report.milestone, 'W53');
assert.deepEqual(report.targetCounts, { prompts: 1500, artifacts: 120, courses: 16, articles: 1600 });
assert.deepEqual(report.canonicalCounts, { articles: 1600, courses: 16, prompts: 1500, artifacts: 120 });
assert.deepEqual({
  articles: report.publicCounts.articles, courses: report.publicCounts.courses,
  prompts: report.publicCounts.prompts, artifacts: report.publicCounts.artifacts,
}, report.canonicalCounts);
assert.equal(report.publicCounts.unifiedSearchRecords, 3220);
assert.ok(report.promptQuality.longForm >= 300);
assert.ok(report.promptQuality.markdown >= 200);
assert.ok(report.promptQuality.schema >= 120);
assert.ok(report.promptQuality.withExamples >= 500);
assert.deepEqual(report.artifactQuality.types, ['code', 'config', 'payload', 'query', 'schema', 'template', 'workflow']);
assert.deepEqual({ withRuntime: report.artifactQuality.withRuntime, withValidation: report.artifactQuality.withValidation, withSecurityNotes: report.artifactQuality.withSecurityNotes }, { withRuntime: 120, withValidation: 120, withSecurityNotes: 120 });
assert.equal(Object.keys(report.courseCoverage).length, 16);
assert.equal(report.professionalCourses.length, 8);
for (const courseId of report.professionalCourses) {
  const coverage = report.courseCoverage[courseId];
  assert.equal(coverage.wikiSteps, 24, `${courseId}: wiki path incomplete`);
  assert.ok(coverage.prompts >= 43, `${courseId}: prompt coverage incomplete`);
  assert.ok(coverage.artifacts >= 11, `${courseId}: artifact coverage incomplete`);
}
assert.ok(Object.values(report.build.requiredRoutes).every(Boolean), 'required release route missing');
assert.ok(report.build.htmlPages >= 1642, `unexpected page count: ${report.build.htmlPages}`);
assert.ok(report.build.promptDataBytes > 1_000_000 && report.build.artifactDataBytes > 100_000, 'release data looks truncated');
assert.ok(base.promptIds.every((id) => promptIds.includes(id)) && base.artifactIds.every((id) => artifactIds.includes(id)), 'frozen canonical ID lost');
assert.equal(sha256(promptIds.filter((id) => base.promptIds.includes(id)).join('\n')), base.hashes.promptIdsSha256);
assert.equal(sha256(artifactIds.filter((id) => base.artifactIds.includes(id)).join('\n')), base.hashes.artifactIdsSha256);
assert.match(readme, /1,600개/u);
assert.match(readme, /16개 추천 코스/u);
assert.match(readme, /1,500개 프롬프트와 120개 코드·설정 자료/u);
assert.doesNotMatch(readme, /1,142개 프롬프트|8개 추천 코스|1,400개 백과 문서/u);
assert.match(homeSource, /formatCount\(wiki\.counts\.articles\)/u);
assert.match(promptPage, /1,500개 프롬프트/u);
assert.match(promptPage, /16개 학습 코스/u);
assert.doesNotMatch(promptPage + pathsPage, /1,142|8개 (?:학습 코스|과정)|150개 핵심/u);
assert.match(pathsPage, /16개 과정/u);
assert.match(termsPage, /프롬프트 및 코드·설정 자료/u);
console.log('W53 integrated release: 1600 articles + 16 courses + 1500 prompts + 120 artifacts, professional coverage and GitHub Pages routes OK');

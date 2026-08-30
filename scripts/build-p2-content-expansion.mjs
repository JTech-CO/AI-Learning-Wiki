import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = (value) => createHash('sha256').update(String(value).replace(/\r\n?/g, '\n')).digest('hex');
const catalogFile = 'content-model/research/p2-content-catalog.json';
const evidenceFile = 'content-model/evidence/p2-claim-ledger.json';
const reportFile = 'content-model/quality/p2-content-expansion.json';
const catalogText = fs.readFileSync(catalogFile, 'utf8');
const catalog = JSON.parse(catalogText);
const categoryCounts = {};
const sourceDomains = new Set();
const evidenceArticles = [];
const groupReports = [];

for (const group of catalog.groups) {
  const course = readJson(`content-model/paths/${group.courseId}.path.json`);
  let bodyCharacters = 0;
  let sources = 0;

  for (const articleId of group.articleIds) {
    const articleFile = `content-model/articles/${articleId}.article.json`;
    const raw = fs.readFileSync(articleFile, 'utf8');
    const article = JSON.parse(raw);
    const articleBodyCharacters = article.sections.reduce((sum, section) => sum + section.body.length, 0);
    bodyCharacters += articleBodyCharacters;
    sources += article.sources.length;
    for (const category of article.categories) categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;
    for (const source of article.sources) sourceDomains.add(new URL(source.url).hostname.toLowerCase());
    evidenceArticles.push({
      articleId,
      groupId: group.id,
      courseId: group.courseId,
      publicationReady: true,
      articleSha256: sha256(raw),
      articleBodySha256: sha256(article.sections.map((section) => section.body).join('\n')),
      bodyCharacters: articleBodyCharacters,
      sourceCount: article.sources.length,
      sourceDomains: [...new Set(article.sources.map((source) => new URL(source.url).hostname.toLowerCase()))].sort(),
      sections: article.sections.map((section) => ({
        sectionId: section.id,
        textSha256: sha256(section.body),
        sourceRefs: section.sourceRefs ?? [],
      })),
    });
  }

  groupReports.push({
    id: group.id,
    milestone: group.milestone,
    courseId: group.courseId,
    articleCount: group.articleIds.length,
    courseSteps: course.steps.length,
    bodyCharacters,
    sources,
  });
}

const articleCount = fs.readdirSync('content-model/articles').filter((file) => file.endsWith('.article.json')).length;
const courseCount = fs.readdirSync('content-model/paths').filter((file) => file.endsWith('.path.json')).length;
const totalSources = evidenceArticles.reduce((sum, article) => sum + article.sourceCount, 0);
const totalSections = evidenceArticles.reduce((sum, article) => sum + article.sections.length, 0);
const totalBodyCharacters = evidenceArticles.reduce((sum, article) => sum + article.bodyCharacters, 0);

const ledger = {
  schemaVersion: 1,
  release: catalog.release,
  version: catalog.version,
  reviewedAt: catalog.reviewedAt,
  catalogSha256: sha256(catalogText),
  totals: {
    articles: evidenceArticles.length,
    sections: totalSections,
    sources: totalSources,
    sourceDomains: sourceDomains.size,
    bodyCharacters: totalBodyCharacters,
  },
  articles: evidenceArticles,
};

const report = {
  schemaVersion: 1,
  release: catalog.release,
  version: catalog.version,
  reviewedAt: catalog.reviewedAt,
  baseline: catalog.baseline,
  target: catalog.target,
  current: { articles: articleCount, courses: courseCount },
  totals: ledger.totals,
  categories: Object.fromEntries(Object.entries(categoryCounts).sort(([left], [right]) => left.localeCompare(right))),
  groups: groupReports,
  releaseGates: {
    exactArticleGrowth: articleCount === catalog.target.articles,
    exactCourseGrowth: courseCount === catalog.target.courses,
    everyArticleAssignedToCourse: catalog.groups.every((group) => {
      const course = readJson(`content-model/paths/${group.courseId}.path.json`);
      const refs = new Set(course.steps.map((step) => step.ref));
      return group.articleIds.every((articleId) => refs.has(articleId));
    }),
    primarySourcesOnly: catalog.groups.flatMap((group) => group.articleIds).every((articleId) =>
      readJson(`content-model/articles/${articleId}.article.json`).sources.every((source) => source.type !== 'encyclopedia')),
  },
};

fs.mkdirSync(path.dirname(evidenceFile), { recursive: true });
fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(evidenceFile, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`P2 content report: ${evidenceArticles.length} articles, ${catalog.groups.length} courses, ${totalSections} sections and ${totalSources} primary sources`);

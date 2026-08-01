import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const canonicalText = (value) => value.replace(/\r\n?/g, '\n');
const sha256 = (value) => createHash('sha256').update(canonicalText(value)).digest('hex');
const countHtml = (directory) => fs.existsSync(directory)
  ? fs.readdirSync(directory, { withFileTypes: true }).reduce(
    (sum, entry) => sum + (
      entry.isDirectory()
        ? countHtml(path.join(directory, entry.name))
        : Number(entry.name.endsWith('.html'))
    ),
    0,
  )
  : 0;

const catalog = readJson('content-model/research/w59-term-catalog.json');
const publication = readJson('content-model/research/w59-publication-report.json');
const ledger = readJson('content-model/evidence/w59-claim-ledger.json');
const registry = readJson('content-model/labs/registry.json');
const wiki = readJson('public/data/wiki-index.json');
const articleFiles = fs.readdirSync('content-model/articles')
  .filter((file) => file.endsWith('.article.json'));
const termsById = new Map(catalog.terms.map((term) => [term.id, term]));
const toolsById = new Map(registry.tools.map((tool) => [tool.id, tool]));
const courseIds = [...new Set(catalog.terms.map((term) => term.courseId))].sort();
const toolIds = [...new Set(catalog.terms.map((term) => term.toolId))].sort();
const coursesById = new Map(courseIds.map((id) => [
  id,
  readJson('content-model/paths/' + id + '.path.json'),
]));
const articlesById = new Map(catalog.terms.map((term) => [
  term.id,
  readJson('content-model/articles/' + term.id + '.article.json'),
]));
const publicIds = new Set(wiki.articles.map((article) => article.id));

const groupCounts = (field) => Object.fromEntries(
  [...new Set(catalog.terms.map((term) => term[field]))]
    .sort()
    .map((value) => [
      value,
      catalog.terms.filter((term) => term[field] === value).length,
    ]),
);

const connections = catalog.terms.map((term) => {
  const course = coursesById.get(term.courseId);
  const tool = toolsById.get(term.toolId);
  return {
    articleId: term.id,
    category: term.category,
    courseId: term.courseId,
    toolId: term.toolId,
    courseLinked: course.steps.some((step) => step.ref === term.id),
    toolLinked: tool.contentLinks.wikiSlugs.includes(term.id),
    publicIndexed: publicIds.has(term.id),
    articleRoute: '/wiki/' + term.id + '/',
    courseRoute: '/course/' + term.courseId + '/',
    toolRoute: tool.route,
  };
});

const implementationFiles = [
  'content-model/research/w59-term-catalog.json',
  'content-model/research/w59-publication-report.json',
  'content-model/evidence/w59-claim-ledger.json',
  'content-model/labs/registry.json',
  'scripts/build-w59-term-expansion.mjs',
  'scripts/connect-w59-terms.mjs',
  ...courseIds.map((id) => 'content-model/paths/' + id + '.path.json'),
  ...toolIds.map((id) => 'src/content/docs/lab/' + id + '.mdx'),
];

const w59Articles = [...articlesById.values()];
const bodyLengths = w59Articles.map((article) =>
  article.sections.reduce((sum, section) => sum + section.body.length, 0));
const requiredFiles = [
  ...catalog.terms.map((term) => 'dist/wiki/' + term.id + '/index.html'),
  ...courseIds.map((id) => 'dist/course/' + id + '/index.html'),
  ...toolIds.map((id) => 'dist/lab/' + id + '/index.html'),
];

const report = {
  schemaVersion: '1.0',
  milestone: 'W59',
  releasedAt: catalog.reviewedAt,
  corpus: {
    baselineArticles: catalog.baselineArticleCount,
    addedArticles: catalog.terms.length,
    expectedArticles: catalog.baselineArticleCount + catalog.terms.length,
    canonicalArticles: articleFiles.length,
    publicArticles: wiki.articles.length,
  },
  evidence: {
    catalogTerms: catalog.terms.length,
    reviewedArticles: w59Articles.filter(
      (article) => article.status === 'reviewed' && article.reviewedAt === catalog.reviewedAt,
    ).length,
    sectionClaims: ledger.totals.claimUnits,
    sourceReferences: ledger.totals.sources,
    minimumBodyCharacters: Math.min(...bodyLengths),
    maximumBodyCharacters: Math.max(...bodyLengths),
    catalogSha256: sha256(readText('content-model/research/w59-term-catalog.json')),
  },
  coverage: {
    categories: groupCounts('category'),
    courses: groupCounts('courseId'),
    tools: groupCounts('toolId'),
  },
  connections,
  publicSurface: {
    htmlPages: countHtml('dist'),
    requiredFiles: Object.fromEntries(requiredFiles.map((file) => [file, fs.existsSync(file)])),
    allArticlesIndexed: catalog.terms.every((term) => publicIds.has(term.id)),
  },
  implementation: Object.fromEntries(implementationFiles.map((file) => {
    const text = canonicalText(readText(file));
    return [
      file,
      {
        bytes: Buffer.byteLength(text),
        sha256: sha256(text),
      },
    ];
  })),
  releaseGates: {
    exactCatalogSize: catalog.terms.length === 24,
    exactCorpusSize: articleFiles.length === catalog.baselineArticleCount + catalog.terms.length,
    publicationMatches: publication.after.articles === articleFiles.length,
    ledgerMatches: ledger.totals.articles === catalog.terms.length,
    allConnectionsResolved: connections.every(
      ({ courseLinked, toolLinked, publicIndexed }) =>
        courseLinked && toolLinked && publicIndexed,
    ),
    sixTermsPerCategory: Object.values(groupCounts('category')).every((count) => count === 6),
    sixTermsPerCourse: Object.values(groupCounts('courseId')).every((count) => count === 6),
    sixTermsPerTool: Object.values(groupCounts('toolId')).every((count) => count === 6),
    allRoutesRendered: requiredFiles.every((file) => fs.existsSync(file)),
  },
};

fs.mkdirSync('content-model/quality', { recursive: true });
fs.writeFileSync(
  'content-model/quality/w59-term-integration.json',
  JSON.stringify(report, null, 2) + '\n',
);

console.log(
  'W59 term integration: ' + report.corpus.canonicalArticles + ' articles, '
  + report.evidence.sectionClaims + ' locked section claims, '
  + report.evidence.sourceReferences + ' source references, '
  + connections.length + ' course/tool links',
);

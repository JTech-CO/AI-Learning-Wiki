import fs from 'node:fs';

if (fs.readFileSync('README.md', 'utf8').includes('총 1,624개 검토 완료 백과 문서')) {
  console.log('W59 growth guards: already applied');
  process.exit(0);
}

const replaceOnce = (file, pattern, replacement, label) => {
  const source = fs.readFileSync(file, 'utf8');
  if (!pattern.test(source)) {
    throw new Error(file + ': replacement target missing (' + label + ')');
  }
  fs.writeFileSync(file, source.replace(pattern, replacement));
};

replaceOnce(
  'scripts/validate-w32-search-pagination.mjs',
  /assert\.equal\(wiki\.articles\.length, 1600, 'wiki search corpus changed'\);/u,
  "assert.ok(wiki.articles.length >= 1600, 'wiki search corpus dropped below the W53 baseline');",
  'W32 article baseline',
);

replaceOnce(
  'scripts/validate-w34-content.mjs',
  /assert\.equal\(wikiFiles\.length, 1600, 'wiki article count changed'\);/u,
  "assert.ok(wikiFiles.length >= 1600, 'wiki article count dropped below the W53 baseline');",
  'W34 article baseline',
);
replaceOnce(
  'scripts/validate-w34-content.mjs',
  /console\.log\([^\r\n]*W34 content:[^\r\n]+\);/u,
  "console.log('W34 content: direct random navigation, article-only TOC, canonical prompt titles remain source-neutral, ' + wikiFiles.length + ' wiki documents free of W labels');",
  'W34 dynamic summary',
);

replaceOnce(
  'scripts/validate-w35-toc.mjs',
  /assert\.equal\(generatedFiles\.length, 1600, 'wiki article count changed'\);/u,
  "assert.ok(generatedFiles.length >= 1600, 'wiki article count dropped below the W53 baseline');",
  'W35 article baseline',
);

replaceOnce(
  'scripts/validate-w36-language.mjs',
  /assert\.equal\(articleFiles\.length, 1600, 'wiki article source count changed'\);/u,
  "assert.ok(articleFiles.length >= 1600, 'wiki article source count dropped below the W53 baseline');",
  'W36 article baseline',
);

replaceOnce(
  'scripts/validate-w37-terminology.mjs',
  /assert\.equal\(articleFiles\.length, 1600, 'wiki article source count changed'\);/u,
  "assert.ok(articleFiles.length >= 1600, 'wiki article source count dropped below the W53 baseline');",
  'W37 article baseline',
);
replaceOnce(
  'scripts/validate-w37-terminology.mjs',
  /assert\.equal\(automatedAudit\.auditedArticles, 1600\);/u,
  'assert.equal(automatedAudit.auditedArticles, articleFiles.length);',
  'W37 dynamic terminology audit',
);

replaceOnce(
  'scripts/validate-w46-published-articles.mjs',
  /assert\(articleFiles\.length === 1600,[^\r\n]+\);/u,
  "assert(articleFiles.length >= report.after.articles, 'W46 published baseline was reduced');",
  'W46 frozen baseline',
);
replaceOnce(
  'scripts/validate-w46-published-articles.mjs',
  /console\.log\('W46 published articles: 1600 total, 200 newly reviewed, 2000 locked section claims and 800 sources OK'\);/u,
  "console.log('W46 published baseline retained: 1600 articles, 200 newly reviewed, 2000 locked section claims and 800 sources OK; current total ' + articleFiles.length);",
  'W46 dynamic summary',
);

replaceOnce(
  'scripts/validate-w53-integrated-release.mjs',
  /assert\.deepEqual\(report\.canonicalCounts, \{ articles: 1600, courses: 16, prompts: 1500, artifacts: 120 \}\);/u,
  "assert.ok(report.canonicalCounts.articles >= report.targetCounts.articles, 'article count dropped below the W53 release baseline');\nassert.deepEqual({ courses: report.canonicalCounts.courses, prompts: report.canonicalCounts.prompts, artifacts: report.canonicalCounts.artifacts }, { courses: 16, prompts: 1500, artifacts: 120 });",
  'W53 growing article count',
);
replaceOnce(
  'scripts/validate-w53-integrated-release.mjs',
  /assert\.equal\(report\.publicCounts\.unifiedSearchRecords, 3220\);/u,
  'assert.equal(report.publicCounts.unifiedSearchRecords, report.canonicalCounts.articles + 1500 + 120);',
  'W53 dynamic search count',
);
replaceOnce(
  'scripts/validate-w53-integrated-release.mjs',
  /assert\.equal\(coverage\.wikiSteps, 24,[^\r\n]+\);/u,
  "assert.ok(coverage.wikiSteps >= 24, courseId + ': wiki path incomplete');",
  'W53 expandable professional courses',
);
replaceOnce(
  'scripts/validate-w53-integrated-release.mjs',
  /assert\.match\(readme, \/1,600개\/u\);/u,
  "assert.ok(readme.includes(report.canonicalCounts.articles.toLocaleString('en-US') + '개'), 'README article count is stale');",
  'W53 dynamic README count',
);
replaceOnce(
  'scripts/validate-w53-integrated-release.mjs',
  /console\.log\('W53 integrated release: 1600 articles \+ 16 courses \+ 1500 prompts \+ 120 artifacts, professional coverage and GitHub Pages routes OK'\);/u,
  "console.log('W53 integrated release baseline retained; current corpus ' + report.canonicalCounts.articles + ' articles + 16 courses + 1500 prompts + 120 artifacts');",
  'W53 dynamic summary',
);

replaceOnce(
  'scripts/validate-wiki.mjs',
  /const expansionById = new Map\(expansionQueue\.candidates\.map\(\(topic\) => \[topic\.id, topic\]\)\);\r?\n/u,
  "const expansionById = new Map(expansionQueue.candidates.map((topic) => [topic.id, topic]));\nconst w59Catalog = await readJson('content-model/research/w59-term-catalog.json');\nconst w59ById = new Map(w59Catalog.terms.map((term) => [term.id, term]));\n",
  'register W59 catalog',
);
replaceOnce(
  'scripts/validate-wiki.mjs',
  /if \(articles\.length < 150 \|\| articles\.length > 1600\)[^\r\n]+/u,
  "if (articles.length < 1600) errors.push('expected at least the 1600-article W53 baseline, found ' + articles.length);",
  'unbounded article growth',
);
replaceOnce(
  'scripts/validate-wiki.mjs',
  /  const expansion = expansionById\.get\(article\.id\);[\s\S]*?  if \(expansion\.title\.ko !== article\.title[^\r\n]+\r?\n\}/u,
  "  const expansion = expansionById.get(article.id);\n  if (expansion) {\n    if (expansion.title.ko !== article.title || expansion.title.en !== article.englishTitle || !article.categories.includes(expansion.category)) errors.push(article.id + ': title/category differs from the W42 queue');\n    continue;\n  }\n  const w59Term = w59ById.get(article.id);\n  if (!w59Term) {\n    errors.push(article.id + ': not registered in W0, W42, or W59');\n    continue;\n  }\n  if (w59Term.title !== article.title || w59Term.englishTitle !== article.englishTitle || !article.categories.includes(w59Term.category)) errors.push(article.id + ': title/category differs from the W59 catalog');\n}",
  'validate W59 registrations',
);

for (const [file, pattern, replacement, label] of [
  ['README.md', /총 1,600개 검토 완료 백과 문서/u, '총 1,624개 검토 완료 백과 문서', 'README feature count'],
  ['README.md', /현재 콘텐츠 현황 \(2026-07-30\)/u, '현재 콘텐츠 현황 (2026-08-01)', 'README date'],
  ['README.md', /\| 검토 완료 백과 문서 \| 1,600개 \|/u, '| 검토 완료 백과 문서 | 1,624개 |', 'README table count'],
  ['README.md', /# 1,600개 백과 문서 원본/u, '# 1,624개 백과 문서 원본', 'README tree count'],
]) {
  replaceOnce(file, pattern, replacement, label);
}

console.log('W59 growth guards: historical 1600 baseline preserved; current 1624 corpus enabled');

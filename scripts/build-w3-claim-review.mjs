import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const manifest = await readJson('content-model/evidence/w3-claim-map.json');
let mappedSections = 0;
let referenceLinks = 0;

for (const entry of manifest.articles) {
  const file = path.join('content-model', 'articles', `${entry.articleId}.article.json`);
  const article = await readJson(file);
  for (const section of article.sections) {
    const refs = entry.sectionRefs[section.id];
    if (refs) {
      section.sourceRefs = refs;
      mappedSections += 1;
      referenceLinks += refs.length;
    } else {
      delete section.sourceRefs;
    }
  }
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

const summary = {
  version: manifest.version,
  generatedAt: new Date().toISOString(),
  pilotArticles: manifest.articles.length,
  mappedFactualSections: mappedSections,
  sectionReferenceLinks: referenceLinks,
  sourceCoverageReview: manifest.policy.sourceCoverageReview,
  claimVerification: manifest.policy.claimVerification,
  publicationReadyArticles: 0,
  nextGate: '문장 단위 주장-원문 범위 대조와 편집자 승인'
};
await writeFile('content-model/evidence/w3-summary.json', `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(`W3 claim mapping: ${summary.pilotArticles} articles, ${mappedSections} factual sections, ${referenceLinks} section-reference links`);

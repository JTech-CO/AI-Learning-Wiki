import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const rulesText = await readFile('content-model/evidence/w4-review-rules.json', 'utf8');
const rules = JSON.parse(rulesText);
const articles = [];

for (const rule of rules.articles) {
  const article = await readJson(path.join('content-model', 'articles', `${rule.articleId}.article.json`));
  const factualSections = article.sections.filter((section) => !rules.policy.sectionClassifications[section.id] ? false : true);
  const sections = factualSections.map((section) => {
    const classification = rules.policy.sectionClassifications[section.id];
    const evidenceSet = rules.policy.evidenceSetBySection[section.id];
    const evidence = rule.evidenceSets[evidenceSet];
    const claims = claimsOf(section.body).map((claim, index) => ({
      claimId: `${article.id}-${section.id}-${String(index + 1).padStart(2, '0')}`,
      textSha256: sha(claim),
      decision: 'accepted',
      evidence
    }));
    return { sectionId: section.id, classification, claims };
  });
  articles.push({
    articleId: article.id,
    reviewedAt: rules.reviewedAt,
    reviewer: rules.reviewer,
    reviewNote: rule.reviewNote,
    articleBodySha256: sha(factualSections.map((section) => `${section.id}\n${section.body}`).join('\n\n')),
    publicationReady: true,
    sections
  });
}

const ledger = {
  version: rules.version,
  generatedAt: new Date().toISOString(),
  rulesSha256: sha(rulesText),
  articles
};
const claims = articles.flatMap((article) => article.sections.flatMap((section) => section.claims));
const summary = {
  version: rules.version,
  generatedAt: ledger.generatedAt,
  reviewedArticles: articles.length,
  reviewedSections: articles.reduce((sum, article) => sum + article.sections.length, 0),
  reviewedClaimUnits: claims.length,
  acceptedClaimUnits: claims.filter((claim) => claim.decision === 'accepted').length,
  publicationReadyArticles: articles.filter((article) => article.publicationReady).length,
  bodyHashLocked: true,
  nextGate: 'W5에서 검토 완료 문서 묶음을 분야별로 확대'
};
await writeFile('content-model/evidence/w4-claim-ledger.json', `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
await writeFile('content-model/evidence/w4-summary.json', `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(`W4 claim ledger: ${articles.length} articles, ${summary.reviewedSections} sections, ${claims.length} sentence claims locked`);

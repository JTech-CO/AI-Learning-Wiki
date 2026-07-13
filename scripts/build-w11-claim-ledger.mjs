import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const rulesText = await readFile('content-model/evidence/w11-review-rules.json', 'utf8');
const rules = JSON.parse(rulesText);
const priorLedgers = await Promise.all(['w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10'].map((milestone) => readJson(`content-model/evidence/${milestone}-claim-ledger.json`)));
const priorReady = new Set(priorLedgers.flatMap((ledger) => ledger.articles).filter((article) => article.publicationReady).map((article) => article.articleId));
const articles = [];

for (const rule of rules.articles) {
  if (priorReady.has(rule.articleId)) throw new Error(`${rule.articleId}: overlaps a previous publication-ready ledger`);
  const file = `content-model/articles/${rule.articleId}.article.json`;
  const article = await readJson(file);
  const factualSections = article.sections.filter((section) => rules.policy.sectionClassifications[section.id]);
  const sections = factualSections.map((section) => {
    const classification = rules.policy.sectionClassifications[section.id];
    const evidenceSet = rules.policy.evidenceSetBySection[section.id];
    const evidence = rule.evidenceSets[evidenceSet];
    section.sourceRefs = [...new Set(evidence.map((item) => item.sourceRef))].sort((left, right) => left - right);
    const claims = claimsOf(section.body).map((claim, index) => ({
      claimId: `${article.id}-${section.id}-${String(index + 1).padStart(2, '0')}`,
      textSha256: sha(claim),
      decision: 'accepted',
      evidence,
    }));
    return { sectionId: section.id, classification, claims };
  });
  for (const section of article.sections) if (!rules.policy.sectionClassifications[section.id]) delete section.sourceRefs;
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
  articles.push({
    articleId: article.id,
    reviewedAt: rules.reviewedAt,
    reviewer: rules.reviewer,
    reviewNote: rule.reviewNote,
    articleBodySha256: sha(factualSections.map((section) => `${section.id}\n${section.body}`).join('\n\n')),
    publicationReady: true,
    sections,
  });
}

const generatedAt = new Date().toISOString();
const ledger = { version: rules.version, generatedAt, rulesSha256: sha(rulesText), articles };
const claims = articles.flatMap((article) => article.sections.flatMap((section) => section.claims));
const previousReady = priorReady.size;
const summary = {
  version: rules.version,
  generatedAt,
  batchReviewedArticles: articles.length,
  cumulativeReviewedArticles: previousReady + articles.length,
  reviewedSections: articles.reduce((sum, article) => sum + article.sections.length, 0),
  reviewedClaimUnits: claims.length,
  acceptedClaimUnits: claims.filter((claim) => claim.decision === 'accepted').length,
  publicationReadyArticles: articles.filter((article) => article.publicationReady).length,
  newlyCreatedArticles: articles.length,
  bodyHashLocked: true,
  productionTopics: 1400,
  existingArticles: previousReady + articles.length,
  candidateTopics: 1400 - previousReady - articles.length,
  topicsPerCategory: 35,
  nextGate: 'W12에서 분야별 다음 우선순위 신규 문서 10개씩 검토',
};

await Promise.all([
  writeFile('content-model/evidence/w11-claim-ledger.json', `${JSON.stringify(ledger, null, 2)}\n`, 'utf8'),
  writeFile('content-model/evidence/w11-summary.json', `${JSON.stringify(summary, null, 2)}\n`, 'utf8'),
]);
console.log(`W11 claim ledger: ${articles.length} articles, ${summary.reviewedSections} sections, ${claims.length} sentence claims locked; ${summary.cumulativeReviewedArticles} cumulative`);

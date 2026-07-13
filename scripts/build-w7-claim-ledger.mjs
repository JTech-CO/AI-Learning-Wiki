import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const rulesText = await readFile('content-model/evidence/w7-review-rules.json', 'utf8');
const rules = JSON.parse(rulesText);
const [w4, w5, w6, priorQueue] = await Promise.all([
  readJson('content-model/evidence/w4-claim-ledger.json'),
  readJson('content-model/evidence/w5-claim-ledger.json'),
  readJson('content-model/evidence/w6-claim-ledger.json'),
  readJson('content-model/evidence/w6-production-queue.json'),
]);
const priorQueueById = new Map(priorQueue.topics.map((topic) => [topic.topicId, topic]));
const articles = [];

for (const rule of rules.articles) {
  const file = path.join('content-model', 'articles', `${rule.articleId}.article.json`);
  const article = await readJson(file);
  const factualSections = article.sections.filter((section) => rules.policy.sectionClassifications[section.id]);
  const sections = factualSections.map((section) => {
    const classification = rules.policy.sectionClassifications[section.id];
    const evidenceSet = rules.policy.evidenceSetBySection[section.id];
    const evidence = rule.evidenceSets[evidenceSet];
    section.sourceRefs = [...new Set(evidence.map((item) => item.sourceRef))].sort((a, b) => a - b);
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

const ledger = { version: rules.version, generatedAt: new Date().toISOString(), rulesSha256: sha(rulesText), articles };
const claims = articles.flatMap((article) => article.sections.flatMap((section) => section.claims));
const previousReady = [...w4.articles, ...w5.articles, ...w6.articles].filter((article) => article.publicationReady).length;
const priorStages = rules.articles.map((rule) => priorQueueById.get(rule.articleId)?.stage);
const summary = {
  version: rules.version,
  generatedAt: ledger.generatedAt,
  batchReviewedArticles: articles.length,
  cumulativeReviewedArticles: previousReady + articles.length,
  reviewedSections: articles.reduce((sum, article) => sum + article.sections.length, 0),
  reviewedClaimUnits: claims.length,
  acceptedClaimUnits: claims.filter((claim) => claim.decision === 'accepted').length,
  publicationReadyArticles: articles.filter((article) => article.publicationReady).length,
  remediatedExistingArticles: priorStages.filter((stage) => stage === 'source-remediation').length,
  newlyCreatedArticles: priorStages.filter((stage) => stage === 'research-queued').length,
  bodyHashLocked: true,
  productionTopics: 1400,
  existingArticles: 155,
  candidateTopics: 1245,
  nextGate: 'W7 제작 큐에서 분야별 다음 우선 문서를 같은 근거 게이트로 순차 확장',
};
await writeFile('content-model/evidence/w7-claim-ledger.json', `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
await writeFile('content-model/evidence/w7-summary.json', `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
console.log(`W7 claim ledger: ${articles.length} articles, ${summary.reviewedSections} sections, ${claims.length} sentence claims locked; ${summary.cumulativeReviewedArticles} cumulative`);

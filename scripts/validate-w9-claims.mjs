import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { sourceFamily } from './w9-batch-lib.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const [schema, ledger, rules, summary, manifest, w2, priorQueue, categories, ...priorLedgers] = await Promise.all([
  readJson('content-model/schema.claim-ledger.json'),
  readJson('content-model/evidence/w9-claim-ledger.json'),
  readJson('content-model/evidence/w9-review-rules.json'),
  readJson('content-model/evidence/w9-summary.json'),
  readJson('content-model/evidence/w9-batch-manifest.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/evidence/w8-production-queue.json'),
  readJson('content-model/taxonomy/categories.json'),
  ...['w4', 'w5', 'w6', 'w7', 'w8'].map((milestone) => readJson(`content-model/evidence/${milestone}-claim-ledger.json`)),
]);
const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(ledger)) errors.push(ajv.errorsText(validate.errors));
const rulesText = await readFile('content-model/evidence/w9-review-rules.json', 'utf8');
if (ledger.rulesSha256 !== sha(rulesText)) errors.push('rulesSha256 differs from W9 review rules');
const w2ById = new Map(w2.articles.map((article) => [article.articleId, article]));
const priorById = new Map(priorQueue.topics.map((topic) => [topic.topicId, topic]));
const manifestById = new Map(manifest.topics.map((topic) => [topic.topicId, topic]));
const priorReady = new Set(priorLedgers.flatMap((item) => item.articles).filter((article) => article.publicationReady).map((article) => article.articleId));
const reviewedIds = new Set();
const reviewedCategories = new Map();
let claimCount = 0;

for (const reviewed of ledger.articles) {
  const article = await readJson(`content-model/articles/${reviewed.articleId}.article.json`);
  const rule = rules.articles.find((item) => item.articleId === article.id);
  const manifestItem = manifestById.get(article.id);
  const prior = priorById.get(article.id);
  reviewedIds.add(article.id);
  reviewedCategories.set(rule?.categoryId, (reviewedCategories.get(rule?.categoryId) ?? 0) + 1);
  if (!rule || !manifestItem || !prior) errors.push(`${article.id}: W9 rule, manifest or prior queue item missing`);
  if (priorReady.has(article.id)) errors.push(`${article.id}: overlaps prior publication-ready ledgers`);
  if (prior?.stage !== rule?.priorStage || prior?.stage !== manifestItem?.previousStage) errors.push(`${article.id}: prior production stage differs`);
  if (!w2ById.get(article.id)?.audit.readyForManualClaimReview) errors.push(`${article.id}: W2 evidence gate not met`);
  if (article.reviewedAt !== rules.reviewedAt) errors.push(`${article.id}: reviewedAt differs from W9 rules`);
  const minimum = { core: 6000, standard: 3500, brief: 2000 }[manifestItem?.tier];
  const bodyChars = article.sections.map((section) => section.body).join('').length;
  if (bodyChars < minimum) errors.push(`${article.id}: ${bodyChars} body characters below ${manifestItem?.tier} minimum ${minimum}`);
  const families = new Set(article.sources.map((source) => sourceFamily(source.url, source.type)));
  if (families.size < 3) errors.push(`${article.id}: fewer than three independent source families`);
  if (!article.sources.some((source) => ['paper', 'standard', 'specification', 'documentation'].includes(source.type))) errors.push(`${article.id}: primary or official source missing`);
  if (!article.sources.some((source) => source.type === 'encyclopedia')) errors.push(`${article.id}: encyclopedia source missing`);
  const sectionById = new Map(article.sections.map((section) => [section.id, section]));
  const factualSections = reviewed.sections.map((section) => sectionById.get(section.sectionId));
  if (factualSections.some((section) => !section)) errors.push(`${article.id}: reviewed factual section missing`);
  const bodyDigest = sha(factualSections.filter(Boolean).map((section) => `${section.id}\n${section.body}`).join('\n\n'));
  if (bodyDigest !== reviewed.articleBodySha256) errors.push(`${article.id}: reviewed body changed`);
  for (const reviewedSection of reviewed.sections) {
    const section = sectionById.get(reviewedSection.sectionId);
    if (!section) continue;
    const currentClaims = claimsOf(section.body);
    if (currentClaims.length !== reviewedSection.claims.length) errors.push(`${article.id}/${section.id}: claim count changed`);
    reviewedSection.claims.forEach((claim, index) => {
      claimCount += 1;
      if (claim.textSha256 !== sha(currentClaims[index] ?? '')) errors.push(`${claim.claimId}: sentence text changed`);
      if (claim.decision !== 'accepted') errors.push(`${claim.claimId}: claim is not accepted`);
      for (const evidence of claim.evidence) {
        const source = article.sources[evidence.sourceRef - 1];
        if (!source) errors.push(`${claim.claimId}: invalid sourceRef ${evidence.sourceRef}`);
        if (!section.sourceRefs?.includes(evidence.sourceRef)) errors.push(`${claim.claimId}: sourceRef not shown in section`);
        if (reviewedSection.classification === 'source-supported' && source?.type === 'encyclopedia') errors.push(`${claim.claimId}: core claim relies on encyclopedia`);
      }
    });
  }
}

const articleCount = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json')).length;
if (articleCount !== 210) errors.push(`expected 210 article files after W9, found ${articleCount}`);
if (ledger.articles.length !== 140 || rules.articles.length !== 140 || manifest.topics.length !== 140) errors.push('W9 must contain exactly 140 articles');
if (reviewedIds.size !== 140) errors.push('W9 reviewed article IDs are not unique');
for (const category of categories.categories) if (reviewedCategories.get(category.id) !== 10) errors.push(`${category.id}: expected 10 W9 articles`);
if (manifest.totals.remediatedExisting !== 93 || manifest.totals.newlyCreated !== 47 || manifest.slices.length !== 10 || manifest.slices.some((slice) => slice.topics.length !== 14)) errors.push('W9 batch manifest totals are invalid');
if (summary.batchReviewedArticles !== 140 || summary.cumulativeReviewedArticles !== 210 || summary.publicationReadyArticles !== 140 || summary.remediatedExistingArticles !== 93 || summary.newlyCreatedArticles !== 47 || summary.existingArticles !== 210 || summary.candidateTopics !== 1190 || summary.topicsPerCategory !== 15 || !summary.bodyHashLocked) errors.push('W9 summary is incomplete');
if (summary.reviewedClaimUnits !== claimCount || summary.acceptedClaimUnits !== claimCount) errors.push('W9 summary claim counts differ from ledger');
if (errors.length) {
  console.error(`W9 claim validation: ${errors.length} error(s)\n${errors.slice(0, 160).join('\n')}`);
  process.exit(1);
}
console.log(`W9 claim validation: 140 articles, ${claimCount} locked claims, 210 publication-ready cumulatively`);

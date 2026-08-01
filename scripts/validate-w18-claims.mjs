import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { familyForW18 } from './w18-content-lib.mjs';
import { topicFacts } from './w18-topic-facts.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const priorMilestones = ['w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12', 'w13', 'w14', 'w15', 'w16', 'w17'];
const [schema, ledger, rules, summary, manifest, w2, verification, categories, ...priorLedgers] = await Promise.all([
  readJson('content-model/schema.claim-ledger.json'),
  readJson('content-model/evidence/w18-claim-ledger.json'),
  readJson('content-model/evidence/w18-review-rules.json'),
  readJson('content-model/evidence/w18-summary.json'),
  readJson('content-model/evidence/w18-batch-manifest.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/evidence/source-verification.json'),
  readJson('content-model/taxonomy/categories.json'),
  ...priorMilestones.map((milestone) => readJson(`content-model/evidence/${milestone}-claim-ledger.json`)),
]);

const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(ledger)) errors.push(ajv.errorsText(validate.errors));
const rulesText = await readFile('content-model/evidence/w18-review-rules.json', 'utf8');
if (ledger.rulesSha256 !== sha(rulesText)) errors.push('rulesSha256 differs from W18 review rules');
const w2ById = new Map(w2.articles.map((article) => [article.articleId, article]));
const verificationByUrl = new Map(verification.sources.map((source) => [source.url, source]));
const manifestById = new Map(manifest.topics.map((topic) => [topic.topicId, topic]));
const priorReady = new Set(priorLedgers.flatMap((item) => item.articles).filter((article) => article.publicationReady).map((article) => article.articleId));
const reviewedIds = new Set();
const reviewedCategories = new Map();
let claimCount = 0;

for (const reviewed of ledger.articles) {
  const article = await readJson(`content-model/articles/${reviewed.articleId}.article.json`);
  const rule = rules.articles.find((item) => item.articleId === article.id);
  const manifestItem = manifestById.get(article.id);
  reviewedIds.add(article.id);
  reviewedCategories.set(rule?.categoryId, (reviewedCategories.get(rule?.categoryId) ?? 0) + 1);
  if (!rule || !manifestItem) errors.push(`${article.id}: W18 rule or manifest item missing`);
  if (!topicFacts[article.id]) errors.push(`${article.id}: curated fact profile missing`);
  if (priorReady.has(article.id)) errors.push(`${article.id}: overlaps prior publication-ready ledgers`);
  if (rule?.priorStage !== 'research-queued' || manifestItem?.previousStage !== 'research-queued' || manifestItem?.previousState !== 'candidate') errors.push(`${article.id}: did not enter W18 from the candidate research gate`);
  if (!w2ById.get(article.id)?.audit.readyForManualClaimReview) errors.push(`${article.id}: W2 evidence gate not met`);
  if (article.reviewedAt < rules.reviewedAt || article.status !== 'reviewed') errors.push(`${article.id}: review metadata predates W18 rules`);
  if (article.title !== manifestItem?.titleKo || article.englishTitle !== manifestItem?.titleEn) errors.push(`${article.id}: title metadata differs from taxonomy`);
  if (/[�]/u.test(JSON.stringify(article)) || /[🌀-🫿]/u.test(JSON.stringify(article))) errors.push(`${article.id}: replacement character or emoji detected`);
  const minimum = { core: 6000, standard: 4000, brief: 2500 }[manifestItem?.tier];
  const bodyChars = article.sections.map((section) => section.body).join('').length;
  if (bodyChars < minimum) errors.push(`${article.id}: ${bodyChars} body characters below ${manifestItem?.tier} minimum ${minimum}`);
  for (const section of article.sections.filter((item) => rules.policy.sectionClassifications[item.id])) {
    if (section.body.length < rules.policy.minimumSectionCharacters) errors.push(`${article.id}/${section.id}: ${section.body.length} characters below section minimum`);
  }
  const factualParagraphs = article.sections.filter((item) => rules.policy.sectionClassifications[item.id]).flatMap((section) => section.body.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter((paragraph) => paragraph.length >= 80));
  if (new Set(factualParagraphs).size !== factualParagraphs.length) errors.push(`${article.id}: duplicate explanatory paragraph detected`);
  const families = new Set(article.sources.map(familyForW18));
  if (families.size < rules.policy.minimumIndependentSourceFamilies) errors.push(`${article.id}: fewer than three independent source families`);
  if (!article.sources.some((source) => ['paper', 'standard', 'documentation', 'book'].includes(source.type))) errors.push(`${article.id}: primary or official source missing`);
  if (!article.sources.some((source) => source.type === 'encyclopedia')) errors.push(`${article.id}: encyclopedia source missing`);
  for (const source of article.sources) if (verificationByUrl.get(source.url)?.state !== 'reachable') errors.push(`${article.id}: source is not reachable: ${source.url}`);

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
if (articleCount < 1400) errors.push(`expected at least 1400 article files after W18, found ${articleCount}`);
if (ledger.articles.length !== 70 || rules.articles.length !== 70 || manifest.topics.length !== 70) errors.push('W18 must contain exactly 70 new articles');
if (reviewedIds.size !== 70) errors.push('W18 reviewed article IDs are not unique');
for (const category of categories.categories) if (reviewedCategories.get(category.id) !== 5) errors.push(`${category.id}: expected 5 W18 articles`);
if (manifest.totals.newlyCreated !== 70 || manifest.totals.cumulativeArticles !== 1400 || manifest.slices.length !== 5 || manifest.slices.some((slice) => slice.topics.length !== 14)) errors.push('W18 batch manifest totals are invalid');
if (summary.batchReviewedArticles !== 70 || summary.cumulativeReviewedArticles !== 1400 || summary.publicationReadyArticles !== 70 || summary.newlyCreatedArticles !== 70 || summary.existingArticles !== 1400 || summary.candidateTopics !== 0 || summary.topicsPerCategory !== 100 || !summary.bodyHashLocked) errors.push('W18 summary is incomplete');
if (summary.reviewedClaimUnits !== claimCount || summary.acceptedClaimUnits !== claimCount) errors.push('W18 summary claim counts differ from ledger');
if (verification.totals.unavailable !== 0) errors.push('source verification contains unavailable URLs');

if (errors.length) {
  console.error(`W18 claim validation: ${errors.length} error(s)\n${errors.slice(0, 200).join('\n')}`);
  process.exit(1);
}
console.log(`W18 claim validation: 70 new articles, ${claimCount} locked claims, 1400 publication-ready cumulatively`);

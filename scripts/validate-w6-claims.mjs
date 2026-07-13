import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const familyFor = (url, type) => {
  const host = new URL(url).hostname.replace(/^www\./, '');
  if (host.endsWith('wikipedia.org')) return 'wikimedia';
  if (host === 'arxiv.org') return 'research-paper';
  if (host === 'deeplearningbook.org') return 'academic-book';
  if (host.endsWith('nist.gov')) return 'government-standard';
  if (host === 'developer.mozilla.org') return 'web-reference';
  if (host === 'opensource.org') return 'open-source-standard';
  if (host.endsWith('modelcontextprotocol.io')) return 'protocol-standard';
  if (host.endsWith('w3.org')) return 'web-standard';
  if (type === 'paper') return 'research-paper';
  if (type === 'book') return 'academic-book';
  if (type === 'standard') return 'technical-standard';
  if (type === 'documentation') return 'official-documentation';
  return host.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const [schema, ledger, rules, summary, w2, w4, w5, categories] = await Promise.all([
  readJson('content-model/schema.claim-ledger.json'),
  readJson('content-model/evidence/w6-claim-ledger.json'),
  readJson('content-model/evidence/w6-review-rules.json'),
  readJson('content-model/evidence/w6-summary.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/evidence/w4-claim-ledger.json'),
  readJson('content-model/evidence/w5-claim-ledger.json'),
  readJson('content-model/taxonomy/categories.json'),
]);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const errors = [];
if (!validate(ledger)) errors.push(ajv.errorsText(validate.errors));
const rulesText = await readFile('content-model/evidence/w6-review-rules.json', 'utf8');
if (ledger.rulesSha256 !== sha(rulesText)) errors.push('rulesSha256 differs from the reviewed rule file');
const w2ById = new Map(w2.articles.map((item) => [item.articleId, item]));
const priorIds = new Set([...w4.articles, ...w5.articles].filter((item) => item.publicationReady).map((item) => item.articleId));
const ruleById = new Map(rules.articles.map((item) => [item.articleId, item]));
const expectedCategories = new Set(categories.categories.map((item) => item.id));
const reviewedCategories = new Set(rules.articles.map((item) => item.categoryId));
let claimCount = 0;

for (const reviewed of ledger.articles) {
  const article = await readJson(path.join('content-model', 'articles', `${reviewed.articleId}.article.json`));
  const rule = ruleById.get(article.id);
  const sectionById = new Map(article.sections.map((section) => [section.id, section]));
  const factualSections = reviewed.sections.map((section) => sectionById.get(section.sectionId));
  const bodyDigest = sha(factualSections.map((section) => `${section.id}\n${section.body}`).join('\n\n'));
  if (bodyDigest !== reviewed.articleBodySha256) errors.push(`${article.id}: reviewed body changed; refresh is forbidden without re-review`);
  if (!w2ById.get(article.id)?.audit.readyForManualClaimReview) errors.push(`${article.id}: W2 evidence gate was not met`);
  if (priorIds.has(article.id)) errors.push(`${article.id}: W6 batch overlaps W4 or W5`);
  if (!rule || !article.categories.includes(rule.categoryId)) errors.push(`${article.id}: category assignment differs from W6 rules`);
  if (article.reviewedAt !== rules.reviewedAt) errors.push(`${article.id}: reviewedAt differs from W6 review date`);
  const families = new Set(article.sources.map((source) => familyFor(source.url, source.type)));
  if (families.size < rules.policy.minimumIndependentSourceFamilies) errors.push(`${article.id}: fewer than three independent source families`);
  if (!article.sources.some((source) => ['paper', 'standard', 'documentation'].includes(source.type))) errors.push(`${article.id}: primary or official source is missing`);
  if (!article.sources.some((source) => source.type === 'encyclopedia')) errors.push(`${article.id}: encyclopedia source is missing`);
  for (const reviewedSection of reviewed.sections) {
    const section = sectionById.get(reviewedSection.sectionId);
    if (!section) { errors.push(`${article.id}: missing section ${reviewedSection.sectionId}`); continue; }
    const currentClaims = claimsOf(section.body);
    if (currentClaims.length !== reviewedSection.claims.length) errors.push(`${article.id}/${section.id}: claim count changed`);
    reviewedSection.claims.forEach((claim, index) => {
      claimCount += 1;
      if (claim.textSha256 !== sha(currentClaims[index] ?? '')) errors.push(`${claim.claimId}: sentence text changed`);
      if (claim.decision !== 'accepted') errors.push(`${claim.claimId}: claim is not accepted`);
      for (const evidence of claim.evidence) {
        const source = article.sources[evidence.sourceRef - 1];
        if (!source) errors.push(`${claim.claimId}: invalid sourceRef ${evidence.sourceRef}`);
        if (!section.sourceRefs?.includes(evidence.sourceRef)) errors.push(`${claim.claimId}: sourceRef ${evidence.sourceRef} is not displayed for the section`);
        if (reviewedSection.classification === 'source-supported' && source?.type === 'encyclopedia') errors.push(`${claim.claimId}: core claim relies on encyclopedia evidence`);
      }
    });
  }
}

if (ledger.articles.length !== 14 || rules.articles.length !== 14) errors.push(`expected 14 W6 articles, found ${ledger.articles.length}`);
if (reviewedCategories.size !== 14 || [...expectedCategories].some((id) => !reviewedCategories.has(id))) errors.push('W6 batch must contain exactly one article from every category');
if (summary.batchReviewedArticles !== 14 || summary.cumulativeReviewedArticles !== 42 || summary.reviewedSections !== 126 || summary.publicationReadyArticles !== 14 || summary.productionTopics !== 1400 || !summary.bodyHashLocked) errors.push('W6 publication gate summary is incomplete');
if (summary.reviewedClaimUnits !== claimCount || summary.acceptedClaimUnits !== claimCount) errors.push('W6 summary counts differ from the locked ledger');

if (errors.length) {
  console.error(`W6 claim validation: ${errors.length} error(s)\n${errors.slice(0, 100).join('\n')}`);
  process.exit(1);
}
console.log(`W6 claim validation: 14 production-gate articles, 126 sections, ${claimCount} locked sentence claims; 42 publication-ready cumulatively`);

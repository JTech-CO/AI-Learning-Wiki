import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const sha = (value) => createHash('sha256').update(value).digest('hex');
const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const claimsOf = (body) => [...segmenter.segment(body)].map(({ segment }) => segment.trim()).filter(Boolean);
const [schema, ledger, rules, summary, w2, w3] = await Promise.all([
  readJson('content-model/schema.claim-ledger.json'),
  readJson('content-model/evidence/w4-claim-ledger.json'),
  readJson('content-model/evidence/w4-review-rules.json'),
  readJson('content-model/evidence/w4-summary.json'),
  readJson('content-model/evidence/evidence-packs.json'),
  readJson('content-model/evidence/w3-claim-map.json')
]);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const errors = [];
if (!validate(ledger)) errors.push(ajv.errorsText(validate.errors));
const rulesText = await readFile('content-model/evidence/w4-review-rules.json', 'utf8');
if (ledger.rulesSha256 !== sha(rulesText)) errors.push('rulesSha256 differs from the reviewed rule file');
const w2ById = new Map(w2.articles.map((item) => [item.articleId, item]));
const w3Ids = new Set(w3.articles.map((item) => item.articleId));
let claimCount = 0;

for (const reviewed of ledger.articles) {
  const article = await readJson(path.join('content-model', 'articles', `${reviewed.articleId}.article.json`));
  const sectionById = new Map(article.sections.map((section) => [section.id, section]));
  const factualSections = reviewed.sections.map((section) => sectionById.get(section.sectionId));
  const bodyDigest = sha(factualSections.map((section) => `${section.id}\n${section.body}`).join('\n\n'));
  if (bodyDigest !== reviewed.articleBodySha256) errors.push(`${article.id}: reviewed body changed; refresh is forbidden without re-review`);
  if (!w2ById.get(article.id)?.audit.readyForManualClaimReview) errors.push(`${article.id}: W2 evidence gate was not met`);
  if (!w3Ids.has(article.id)) errors.push(`${article.id}: W3 section mapping is missing`);
  for (const reviewedSection of reviewed.sections) {
    const section = sectionById.get(reviewedSection.sectionId);
    if (!section) { errors.push(`${article.id}: missing section ${reviewedSection.sectionId}`); continue; }
    const currentClaims = claimsOf(section.body);
    if (currentClaims.length !== reviewedSection.claims.length) errors.push(`${article.id}/${section.id}: claim count changed`);
    reviewedSection.claims.forEach((claim, index) => {
      claimCount += 1;
      if (claim.textSha256 !== sha(currentClaims[index] ?? '')) errors.push(`${claim.claimId}: sentence text changed`);
      for (const evidence of claim.evidence) {
        const source = article.sources[evidence.sourceRef - 1];
        if (!source) errors.push(`${claim.claimId}: invalid sourceRef ${evidence.sourceRef}`);
        if (!section.sourceRefs?.includes(evidence.sourceRef)) errors.push(`${claim.claimId}: sourceRef ${evidence.sourceRef} is not displayed for the section`);
        if (reviewedSection.classification === 'source-supported' && source?.type === 'encyclopedia') errors.push(`${claim.claimId}: core claim relies on encyclopedia evidence`);
      }
    });
  }
}

if (ledger.articles.length !== 14) errors.push(`expected 14 W4 articles, found ${ledger.articles.length}`);
if (summary.reviewedArticles !== ledger.articles.length || summary.reviewedClaimUnits !== claimCount || summary.acceptedClaimUnits !== claimCount) errors.push('W4 summary counts differ from the locked ledger');
if (summary.reviewedSections !== 126 || summary.publicationReadyArticles !== 14 || !summary.bodyHashLocked) errors.push('W4 publication gate summary is incomplete');

if (errors.length) {
  console.error(`W4 claim validation: ${errors.length} error(s)\n${errors.slice(0, 60).join('\n')}`);
  process.exit(1);
}
console.log(`W4 claim validation: 14 publication-ready pilots, 126 sections, ${claimCount} locked sentence claims`);

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const [articles, topicLedger, w0Summary, w1Evidence, verification, qualityPolicy] = await Promise.all([
  Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file)))),
  readJson('content-model/taxonomy/topic-ledger.json'),
  readJson('content-model/taxonomy/w0-summary.json'),
  readJson('content-model/evidence/evidence-ledger.json'),
  readJson('content-model/evidence/source-verification.json'),
  readJson('content-model/taxonomy/quality-policy.json'),
]);

const topicById = new Map(topicLedger.topics.map((topic) => [topic.id, topic]));
const researchById = new Map(w1Evidence.topics.map((topic) => [topic.topicId, topic]));
const verificationByUrl = new Map(verification.sources.map((source) => [source.url, source]));
const sourceId = (url) => `src-${createHash('sha256').update(url).digest('hex').slice(0, 12)}`;

function familyFor(url, type) {
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
}

const primaryTypes = new Set(['paper', 'standard', 'documentation']);
const factualSection = (section) => section.id !== 'check';
const conceptualSections = new Set(['overview', 'scope', 'distinctions']);

function addDays(date, days) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString();
}

const packs = articles.sort((a, b) => a.id.localeCompare(b.id)).map((article) => {
  const topic = topicById.get(article.id);
  const research = researchById.get(article.id);
  const sourcesByUrl = new Map();

  for (const source of article.sources) {
    const verified = verificationByUrl.get(source.url);
    sourcesByUrl.set(source.url, {
      id: sourceId(source.url),
      title: source.title,
      url: source.url,
      type: source.type,
      family: familyFor(source.url, source.type),
      origin: 'article',
      primaryCandidate: primaryTypes.has(source.type),
      encyclopedia: source.type === 'encyclopedia' || new URL(source.url).hostname.endsWith('wikipedia.org'),
      reachability: verified?.state === 'reachable' ? 'verified' : verified?.state === 'restricted' ? 'restricted' : 'unavailable',
      relevanceStatus: 'editor-linked',
      checkedAt: verified?.checkedAt ?? verification.checkedAt,
    });
  }

  for (const language of ['ko', 'en']) {
    const reference = research.wikimedia[language];
    if (!reference || sourcesByUrl.has(reference.canonicalUrl)) continue;
    sourcesByUrl.set(reference.canonicalUrl, {
      id: sourceId(reference.canonicalUrl),
      title: `${reference.title} — ${language === 'ko' ? '한국어 위키백과' : 'Wikipedia'}`,
      url: reference.canonicalUrl,
      type: 'encyclopedia',
      family: 'wikimedia',
      origin: 'wikimedia',
      primaryCandidate: false,
      encyclopedia: true,
      reachability: 'wikimedia-api',
      relevanceStatus: 'metadata-only',
      checkedAt: reference.accessedAt,
    });
  }

  const sources = [...sourcesByUrl.values()].sort((a, b) => a.id.localeCompare(b.id));
  const editorLinkedSources = sources.filter((source) => source.relevanceStatus === 'editor-linked');
  const conceptual = editorLinkedSources.filter((source) => ['encyclopedia', 'book', 'paper', 'standard'].includes(source.type));
  const technical = editorLinkedSources.filter((source) => ['paper', 'book', 'standard', 'documentation'].includes(source.type));
  const sections = article.sections.map((section) => {
    if (!factualSection(section)) return { sectionId: section.id, sectionTitle: section.title, factual: false, candidateSourceIds: [], assignmentStatus: 'not-factual' };
    const preferred = conceptualSections.has(section.id) ? conceptual : technical;
    const candidates = (preferred.length ? preferred : editorLinkedSources).map((source) => source.id);
    return {
      sectionId: section.id,
      sectionTitle: section.title,
      factual: true,
      candidateSourceIds: candidates,
      assignmentStatus: candidates.length ? 'review-required' : 'missing',
    };
  });

  const independentFamilies = new Set(editorLinkedSources.map((source) => source.family)).size;
  const primaryCandidates = editorLinkedSources.filter((source) => source.primaryCandidate).length;
  const encyclopediaFamilies = new Set(editorLinkedSources.filter((source) => source.encyclopedia).map((source) => source.family)).size;
  const reachableSources = editorLinkedSources.filter((source) => ['verified', 'restricted'].includes(source.reachability)).length;
  const factualSections = sections.filter((section) => section.factual).length;
  const sectionsWithCandidates = sections.filter((section) => section.factual && section.candidateSourceIds.length).length;
  const gaps = [];
  if (independentFamilies < qualityPolicy.evidence.minimumIndependentSourceFamilies) gaps.push('source-diversity');
  if (primaryCandidates < qualityPolicy.evidence.minimumPrimarySources) gaps.push('primary-source');
  if (encyclopediaFamilies < 1) gaps.push('encyclopedia-source');
  if (sources.some((source) => source.origin === 'article' && source.reachability === 'unavailable')) gaps.push('unavailable-editor-source');
  if (sectionsWithCandidates < factualSections) gaps.push('unmapped-factual-section');
  gaps.push('manual-claim-review');
  const readyForManualClaimReview = !gaps.some((gap) => gap !== 'manual-claim-review');
  const reviewDays = qualityPolicy.review[`${article.volatility.replace('-', '')}ReviewDays`] ?? qualityPolicy.review.evergreenReviewDays;
  const dayMap = {
    evergreen: qualityPolicy.review.evergreenReviewDays,
    periodic: qualityPolicy.review.periodicReviewDays,
    'fast-changing': qualityPolicy.review.fastChangingReviewDays,
  };

  return {
    articleId: article.id,
    titleKo: article.title,
    titleEn: article.englishTitle,
    categoryId: topic.primaryCategory,
    tier: topic.tier,
    volatility: article.volatility,
    reviewedAt: article.reviewedAt,
    reviewDueAt: addDays(article.reviewedAt, dayMap[article.volatility] ?? reviewDays),
    manualReviewRequired: true,
    researchAnchorIds: research.authoritativeAnchorIds,
    sources,
    sections,
    audit: {
      independentFamilies,
      primaryCandidates,
      encyclopediaFamilies,
      reachableSources,
      factualSections,
      sectionsWithCandidates,
      readyForManualClaimReview,
      publicationReady: false,
      gaps,
    },
  };
});

const tierPriority = { core: 0, standard: 1, brief: 2 };
const remediationQueue = packs.map((pack) => ({
  articleId: pack.articleId,
  categoryId: pack.categoryId,
  tier: pack.tier,
  gaps: pack.audit.gaps,
  independentFamilies: pack.audit.independentFamilies,
  primaryCandidates: pack.audit.primaryCandidates,
  encyclopediaFamilies: pack.audit.encyclopediaFamilies,
  readyForManualClaimReview: pack.audit.readyForManualClaimReview,
  reviewDueAt: pack.reviewDueAt,
})).sort((a, b) => Number(a.readyForManualClaimReview) - Number(b.readyForManualClaimReview) || tierPriority[a.tier] - tierPriority[b.tier] || a.articleId.localeCompare(b.articleId));

const gapCounts = {};
for (const pack of packs) for (const gap of pack.audit.gaps) gapCounts[gap] = (gapCounts[gap] ?? 0) + 1;
const summary = {
  version: 'W2-2026-07-13',
  generatedAt: verification.checkedAt,
  totals: {
    articles: packs.length,
    sources: packs.reduce((sum, pack) => sum + pack.sources.length, 0),
    uniqueVerifiedUrls: verification.totals.uniqueUrls,
    readyForManualClaimReview: packs.filter((pack) => pack.audit.readyForManualClaimReview).length,
    publicationReady: 0,
    remediationQueue: remediationQueue.length,
  },
  reachability: verification.totals,
  gapCounts,
};

await Promise.all([
  writeFile('content-model/evidence/evidence-packs.json', `${JSON.stringify({ version: 'W2-2026-07-13', generatedAt: verification.checkedAt, topicCatalogSha256: w0Summary.catalogSha256, articles: packs }, null, 2)}\n`),
  writeFile('content-model/evidence/w2-remediation-queue.json', `${JSON.stringify({ version: 'W2-2026-07-13', generatedAt: verification.checkedAt, queue: remediationQueue }, null, 2)}\n`),
  writeFile('content-model/evidence/w2-summary.json', `${JSON.stringify(summary, null, 2)}\n`),
]);
console.log(`W2 evidence packs: ${packs.length} articles; ${summary.totals.readyForManualClaimReview} ready for manual claim review, ${summary.totals.publicationReady} publication-ready`);

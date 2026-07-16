import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const W19_VERSION = 'W19-2026-07-15';
export const W19_SNAPSHOT_DATE = '2026-07-15';
export const ARTICLE_DIR = 'content-model/articles';
export const PRIMARY_SOURCE_TYPES = new Set(['paper', 'standard', 'documentation', 'book']);
export const REUSE_DOCUMENT_THRESHOLD = 14;
export const CITATION_COVERAGE_TARGET = 0.8;

const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });
const genericPhrases = [
  '도입 판단에는 기준선이 필요하다',
  '재현 가능한 검토를 위해',
  '문서의 용어는 제품 이름이나 특정 인터페이스와 분리한다',
  '정의에 포함되지 않은 성질을 이름만으로 추정하지 않고',
  '평균값만으로 결론을 내리지 않고',
  '관련 자료를 읽을 때 표준 문서와 논문은',
  '이름이 비슷해도',
  '한 번에 하나의 조건만 바꾸어 원인을 좁힌다',
  '설명은 정의를 외우는 데서 끝나지 않는다',
  '용어의 일부가 겹쳐도 서로 대체 가능한지 여부는',
];

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const round = (value, digits = 3) => Number(value.toFixed(digits));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const occurrences = (text, needle) => needle ? text.split(needle).length - 1 : 0;
const escapeRegExp = (value) => [...value].map((char) => '\\^$.*+?()[]{}'.includes(char) ? '\\' + char : char).join('');
const hasBatchim = (value) => {
  const chars = [...String(value).trim()];
  const code = chars.at(-1)?.charCodeAt(0) ?? 0;
  return code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 !== 0 : false;
};
const normalizeDomain = (url) => {
  try {
    const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    return hostname.endsWith('.wikipedia.org') ? 'wikipedia.org' : hostname;
  } catch {
    return 'invalid-url';
  }
};
const replaceTopic = (value, article) => {
  let result = value;
  for (const label of [article.englishTitle, article.title].filter(Boolean).sort((a, b) => b.length - a.length)) {
    result = result.replace(new RegExp(escapeRegExp(label), 'gi'), '<topic>');
  }
  return result;
};
const normalizeSentence = (value, article) => replaceTopic(value, article)
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '<link>')
  .replace(/https?:\/\/\S+/g, '<url>')
  .replace(/\d+(?:[.,]\d+)*/g, '<n>')
  .replace(/[“”‘’"'\x60*_~]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();
export const normalizeParagraph = (value, article) => normalizeSentence(value, article).replace(/[.!?。]+$/g, '');
const sentencesOf = (article) => article.sections
  .flatMap((section) => [...segmenter.segment(section.body)].map(({ segment }) => segment.trim()))
  .filter((sentence) => sentence.replace(/\s+/g, '').length >= 35);
const paragraphsOf = (article) => article.sections
  .flatMap((section) => section.body.split(/\n\s*\n/))
  .map((paragraph) => paragraph.trim())
  .filter((paragraph) => paragraph.length >= 60);
const wrongParticleCount = (article, body) => {
  const batchim = hasBatchim(article.title);
  const labels = article.title === article.englishTitle
    ? [`‘${article.title}’`, article.title]
    : [`‘${article.title}(${article.englishTitle})’`, `${article.title}(${article.englishTitle})`, `‘${article.title}’`];
  const wrongParticles = batchim ? ['를', '는', '가'] : ['을', '은', '이'];
  return labels.reduce((sum, label) => sum + wrongParticles.reduce((count, particle) => count + occurrences(body, `${label}${particle}`), 0), 0);
};
const scoreBand = (score) => score >= 85 ? 'excellent' : score >= 75 ? 'good' : score >= 60 ? 'needs-work' : 'critical';
const priorityRank = { P0: 0, P1: 1, P2: 2 };

export async function loadW19Inputs() {
  const [files, taxonomy] = await Promise.all([
    readdir(ARTICLE_DIR),
    readFile('content-model/taxonomy/topic-ledger.json', 'utf8').then(JSON.parse),
  ]);
  const baselineIds = new Set(taxonomy.topics.map((topic) => topic.id));
  const articleFiles = files.filter((file) => file.endsWith('.article.json') && baselineIds.has(file.replace('.article.json', ''))).sort();
  const loaded = await Promise.all(articleFiles.map(async (file) => {
    const raw = await readFile(path.join(ARTICLE_DIR, file), 'utf8');
    return { file, raw, article: JSON.parse(raw) };
  }));
  return { loaded, taxonomy };
}

export function buildW19Artifacts({ loaded, taxonomy }, options = {}) {
  const particleIssueCounter = options.particleIssueCounter ?? ((article, body) => wrongParticleCount(article, body));
  const tierById = new Map(taxonomy.topics.map((topic) => [topic.id, topic.tier]));
  const categoryById = new Map(taxonomy.topics.map((topic) => [topic.id, topic.primaryCategory]));
  const sentenceDocumentFrequency = new Map();

  for (const { article } of loaded) {
    const normalized = new Set(sentencesOf(article).map((sentence) => normalizeSentence(sentence, article)).filter((sentence) => sentence.length >= 25));
    for (const sentence of normalized) sentenceDocumentFrequency.set(sentence, (sentenceDocumentFrequency.get(sentence) ?? 0) + 1);
  }

  const metrics = loaded.map(({ article, raw }) => {
    const body = article.sections.map((section) => section.body).join('\n\n');
    const bodyCharacters = article.sections.reduce((sum, section) => sum + section.body.length, 0);
    const sentences = sentencesOf(article);
    const normalizedSentences = sentences.map((sentence) => normalizeSentence(sentence, article)).filter((sentence) => sentence.length >= 25);
    const distinctSentences = new Set(normalizedSentences);
    const reusedSentences = [...distinctSentences].filter((sentence) => (sentenceDocumentFrequency.get(sentence) ?? 0) >= REUSE_DOCUMENT_THRESHOLD);
    const uniqueSentences = [...distinctSentences].filter((sentence) => sentenceDocumentFrequency.get(sentence) === 1);
    const paragraphs = paragraphsOf(article);
    const normalizedParagraphs = paragraphs.map((paragraph) => normalizeParagraph(paragraph, article));
    const duplicateParagraphCount = normalizedParagraphs.length - new Set(normalizedParagraphs).size;
    const citableSections = article.sections.filter((section) => section.id !== 'check');
    const backedSections = citableSections.filter((section) => section.sourceRefs?.length);
    const referencedSourceRefs = new Set(article.sections.flatMap((section) => section.sourceRefs ?? []));
    const sourceDomains = new Set(article.sources.map((source) => normalizeDomain(source.url)));
    const primarySourceCount = article.sources.filter((source) => PRIMARY_SOURCE_TYPES.has(source.type)).length;
    const genericPhraseHits = genericPhrases.reduce((sum, phrase) => sum + occurrences(body, phrase), 0);
    const contextualParticleErrors = particleIssueCounter(article, body);
    const summaryOccurrences = occurrences(body, article.summary);
    const hangulLetters = (body.match(/[가-힣]/g) ?? []).length;
    const latinLetters = (body.match(/[A-Za-z]/g) ?? []).length;
    const koreanCharacterRatio = hangulLetters + latinLetters ? hangulLetters / (hangulLetters + latinLetters) : 0;
    const crossArticleReuseRatio = distinctSentences.size ? reusedSentences.length / distinctSentences.size : 1;
    const uniqueSentenceRatio = distinctSentences.size ? uniqueSentences.length / distinctSentences.size : 0;
    const citationCoverage = citableSections.length ? backedSections.length / citableSections.length : 0;
    const tier = tierById.get(article.id) ?? 'brief';
    const depthTarget = { core: 6000, standard: 4000, brief: 2500 }[tier] ?? 2500;

    const depthScore = 15 * clamp(bodyCharacters / depthTarget, 0, 1)
      + 5 * clamp(article.sections.length / 10, 0, 1)
      + 5 * clamp(paragraphs.length / 24, 0, 1);
    const evidenceScore = 5 * clamp(article.sources.length / 6, 0, 1)
      + 7 * clamp(primarySourceCount / 3, 0, 1)
      + 5 * clamp(sourceDomains.size / 4, 0, 1)
      + 8 * citationCoverage;
    const originalityScore = 20 * (1 - clamp(crossArticleReuseRatio / 0.7, 0, 1))
      + 10 * clamp(uniqueSentenceRatio / 0.35, 0, 1)
      + 5 * (duplicateParagraphCount === 0 ? 1 : clamp(1 - duplicateParagraphCount / 4, 0, 1));
    const languageScore = 8 * clamp(koreanCharacterRatio / 0.85, 0, 1)
      + clamp(4 - contextualParticleErrors * 2, 0, 4)
      + clamp(3 - Math.max(0, genericPhraseHits - 2) * 0.3, 0, 3);
    const score = Math.round(clamp(depthScore + evidenceScore + originalityScore + languageScore, 0, 100));

    const issueCodes = [];
    if (bodyCharacters < depthTarget) issueCodes.push('body-below-tier-target');
    if (primarySourceCount === 0) issueCodes.push('missing-primary-source');
    if (sourceDomains.size < 3) issueCodes.push('insufficient-independent-domains');
    if (citationCoverage < CITATION_COVERAGE_TARGET) issueCodes.push('low-section-citation-coverage');
    if (crossArticleReuseRatio >= 0.3) issueCodes.push('high-cross-article-reuse');
    if (duplicateParagraphCount > 0) issueCodes.push('duplicate-paragraph');
    if (summaryOccurrences > 2) issueCodes.push('summary-over-reuse');
    if (genericPhraseHits >= 5) issueCodes.push('generic-editorial-language');
    if (contextualParticleErrors > 0) issueCodes.push('contextual-particle');
    if (/[�占]/u.test(raw)) issueCodes.push('mojibake-or-replacement-character');

    const criticalIssue = issueCodes.some((code) => ['missing-primary-source', 'duplicate-paragraph', 'contextual-particle', 'mojibake-or-replacement-character'].includes(code));
    const priority = score < 60 || criticalIssue ? 'P0'
      : score < 75 || issueCodes.some((code) => ['low-section-citation-coverage', 'high-cross-article-reuse', 'summary-over-reuse'].includes(code)) ? 'P1'
      : 'P2';

    return {
      articleId: article.id,
      title: article.title,
      categoryId: categoryById.get(article.id) ?? article.categories[0],
      tier,
      score,
      scoreBand: scoreBand(score),
      priority,
      issueCodes,
      bodyCharacters,
      sectionCount: article.sections.length,
      paragraphCount: paragraphs.length,
      sentenceCount: sentences.length,
      distinctSentenceCount: distinctSentences.size,
      reusedSentenceCount: reusedSentences.length,
      crossArticleReuseRatio: round(crossArticleReuseRatio),
      uniqueSentenceRatio: round(uniqueSentenceRatio),
      duplicateParagraphCount,
      summaryOccurrences,
      genericPhraseHits,
      contextualParticleErrors,
      sourceCount: article.sources.length,
      primarySourceCount,
      independentSourceDomains: sourceDomains.size,
      referencedSourceCount: referencedSourceRefs.size,
      citationCoverage: round(citationCoverage),
      koreanCharacterRatio: round(koreanCharacterRatio),
      contentSha256: sha256(raw),
    };
  }).sort((a, b) => a.articleId.localeCompare(b.articleId));

  const categoryIds = [...new Set(metrics.map((item) => item.categoryId))].sort();
  const priorityTotals = Object.fromEntries(['P0', 'P1', 'P2'].map((priority) => [priority, metrics.filter((item) => item.priority === priority).length]));
  const bandTotals = Object.fromEntries(['excellent', 'good', 'needs-work', 'critical'].map((band) => [band, metrics.filter((item) => item.scoreBand === band).length]));
  const average = (items, field) => items.length ? round(items.reduce((sum, item) => sum + item[field], 0) / items.length, 2) : 0;
  const categorySummary = Object.fromEntries(categoryIds.map((categoryId) => {
    const members = metrics.filter((item) => item.categoryId === categoryId);
    return [categoryId, {
      articles: members.length,
      averageScore: average(members, 'score'),
      averageBodyCharacters: average(members, 'bodyCharacters'),
      averageCitationCoverage: average(members, 'citationCoverage'),
      averageCrossArticleReuseRatio: average(members, 'crossArticleReuseRatio'),
      priorities: Object.fromEntries(['P0', 'P1', 'P2'].map((priority) => [priority, members.filter((item) => item.priority === priority).length])),
    }];
  }));
  const corpusSha256 = sha256(metrics.map((item) => `${item.articleId}:${item.contentSha256}`).join('\n'));
  const allIssues = [...new Set(metrics.flatMap((item) => item.issueCodes))].sort();
  const issueTotals = Object.fromEntries(allIssues.map((code) => [code, metrics.filter((item) => item.issueCodes.includes(code)).length]));

  const audit = {
    version: W19_VERSION,
    snapshotDate: W19_SNAPSHOT_DATE,
    policy: {
      purpose: 'baseline-only',
      scoreRange: [0, 100],
      priorityOrder: ['P0', 'P1', 'P2'],
      primarySourceTypes: [...PRIMARY_SOURCE_TYPES],
      crossArticleReuseDocumentThreshold: REUSE_DOCUMENT_THRESHOLD,
      citationCoverageTarget: CITATION_COVERAGE_TARGET,
      tierBodyCharacterTargets: { core: 6000, standard: 4000, brief: 2500 },
    },
    corpus: { sha256: corpusSha256, articles: metrics.length, categories: categoryIds.length },
    totals: {
      averageScore: average(metrics, 'score'),
      averageBodyCharacters: average(metrics, 'bodyCharacters'),
      averageCitationCoverage: average(metrics, 'citationCoverage'),
      averageCrossArticleReuseRatio: average(metrics, 'crossArticleReuseRatio'),
      priorities: priorityTotals,
      scoreBands: bandTotals,
      issues: issueTotals,
    },
    categorySummary,
    articles: metrics,
  };

  const queueItems = [...metrics].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || a.score - b.score || a.articleId.localeCompare(b.articleId)).map((item, index) => ({
    rank: index + 1,
    articleId: item.articleId,
    title: item.title,
    categoryId: item.categoryId,
    tier: item.tier,
    priority: item.priority,
    score: item.score,
    issueCodes: item.issueCodes,
    measures: {
      bodyCharacters: item.bodyCharacters,
      citationCoverage: item.citationCoverage,
      crossArticleReuseRatio: item.crossArticleReuseRatio,
      genericPhraseHits: item.genericPhraseHits,
      contextualParticleErrors: item.contextualParticleErrors,
      primarySourceCount: item.primarySourceCount,
      independentSourceDomains: item.independentSourceDomains,
    },
  }));
  const queue = {
    version: W19_VERSION,
    snapshotDate: W19_SNAPSHOT_DATE,
    corpusSha256,
    policy: {
      order: ['P0', 'P1', 'P2'],
      P0: 'critical score or correctness/integrity issue',
      P1: 'substantial evidence, originality, or depth remediation',
      P2: 'editorial polish after higher-priority work',
    },
    totals: { queued: queueItems.length, priorities: priorityTotals, byCategory: Object.fromEntries(categoryIds.map((categoryId) => [categoryId, queueItems.filter((item) => item.categoryId === categoryId).length])) },
    items: queueItems,
  };
  return { audit, queue };
}

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const queue = readJson('content-model/research/w42-topic-candidates.json');
const packs = readJson('content-model/research/w42-source-packs.json');
const articles = new Map(fs.readdirSync(path.join(root, 'content-model', 'articles')).filter((name) => name.endsWith('.article.json')).map((name) => {
  const article = readJson(`content-model/articles/${name}`);
  return [article.id, article];
}));
const liveCheckedUrls = new Set([
  'https://arxiv.org/abs/2211.09110',
  'https://www.rfc-editor.org/rfc/rfc9110.html',
  'https://modelcontextprotocol.io/specification/2025-11-25',
  'https://arxiv.org/abs/2309.06180',
  'https://www.nist.gov/itl/ai-risk-management-framework',
  'https://arxiv.org/abs/2005.11401'
]);
const packById = new Map(packs.packs.map((pack) => [pack.id, pack]));
const primaryTypes = new Set(['paper', 'standard', 'documentation']);

const records = queue.candidates.map((candidate) => {
  const pack = packById.get(candidate.sourcePackId);
  const sources = pack.seedSources.map((source, index) => {
    const parsed = new URL(source.url);
    const inheritedArticle = source.inheritedFrom ? articles.get(source.inheritedFrom) : null;
    const inheritedSource = inheritedArticle?.sources.find((item) => item.url === source.url);
    return {
      ordinal: index + 1,
      title: source.title,
      url: source.url,
      hostname: parsed.hostname.toLowerCase(),
      type: source.type,
      role: source.type === 'standard' ? 'normative-boundary' : source.type === 'documentation' ? 'implementation-context' : 'theory-or-empirical-background',
      provenance: source.inheritedFrom ? {
        kind: 'reviewed-article-inheritance',
        articleId: source.inheritedFrom,
        exactUrlMatch: Boolean(inheritedSource),
        articleStatus: inheritedArticle?.status ?? null
      } : { kind: 'curated-category-fallback', articleId: null, exactUrlMatch: true, articleStatus: null },
      checks: {
        https: parsed.protocol === 'https:',
        titlePresent: source.title.trim().length > 0,
        recognizedType: primaryTypes.has(source.type),
        liveAvailability: liveCheckedUrls.has(source.url) ? 'representative-checked-2026-07-16' : 'not-rechecked-in-w43'
      },
      applicability: 'category-foundation-requires-claim-mapping'
    };
  });
  return {
    candidateId: candidate.id,
    category: candidate.category,
    terminologyStatus: 'operational-synthesis',
    verificationLevel: 'identity-and-provenance',
    sources,
    gates: {
      sourceIdentityReviewed: sources.every((source) => source.checks.https && source.checks.titlePresent && source.checks.recognizedType),
      provenanceReviewed: sources.every((source) => source.provenance.exactUrlMatch),
      candidateClaimSupportReviewed: false,
      readyForClaimMapping: true
    }
  };
});

const uniqueUrls = new Set(records.flatMap((record) => record.sources.map((source) => source.url)));
const liveCheckedUniqueUrls = new Set(records.flatMap((record) => record.sources.filter((source) => source.checks.liveAvailability.startsWith('representative-checked')).map((source) => source.url)));
const output = {
  schemaVersion: '1.0',
  milestone: 'W43',
  reviewedAt: '2026-07-16',
  policy: {
    verifies: ['source identity', 'HTTPS URL structure', 'source type', 'inheritance provenance'],
    doesNotImply: ['candidate-specific claim support', 'full-text extraction', 'live availability of every URL'],
    terminologyDefault: 'operational-synthesis'
  },
  totals: {
    candidates: records.length,
    sourceInstances: records.reduce((sum, record) => sum + record.sources.length, 0),
    uniqueUrls: uniqueUrls.size,
    representativeLiveCheckedUrls: liveCheckedUniqueUrls.size,
    readyForClaimMapping: records.filter((record) => record.gates.readyForClaimMapping).length
  },
  records
};

fs.writeFileSync(path.join(root, 'content-model', 'research', 'w43-source-verification.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`W43 source verification: ${output.totals.candidates} candidates, ${output.totals.sourceInstances} source instances, ${output.totals.uniqueUrls} unique URLs`);

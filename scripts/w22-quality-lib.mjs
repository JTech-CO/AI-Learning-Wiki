import { readFile, writeFile } from 'node:fs/promises';
import { buildW19Artifacts, loadW19Inputs } from './w19-quality-lib.mjs';
import { countParticleIssues } from './w20-korean-lib.mjs';
import { sha256 } from './w21-duplicate-lib.mjs';

export const W22_VERSION = 'W22-2026-07-15';
export const W22_SNAPSHOT_DATE = '2026-07-15';

export function buildW22QualityArtifacts(inputs, baselineAudit) {
  const current = buildW19Artifacts(inputs, { particleIssueCounter: (article) => countParticleIssues(article).core });
  current.audit.version = W22_VERSION;
  current.audit.snapshotDate = W22_SNAPSHOT_DATE;
  current.audit.baselineCorpusSha256 = baselineAudit.corpus.sha256;
  current.audit.policy = { ...current.audit.policy, purpose: 'first-balanced-core-depth-expansion' };
  current.queue.version = W22_VERSION;
  current.queue.snapshotDate = W22_SNAPSHOT_DATE;
  current.queue.baselineCorpusSha256 = baselineAudit.corpus.sha256;
  return current;
}

export function buildW22DepthRemediation(audit, baselineDepth) {
  const targets = audit.policy.tierBodyCharacterTargets;
  const originById = new Map(baselineDepth.items.map((item) => [item.articleId, item.origin]));
  const items = audit.articles
    .filter((item) => item.issueCodes.includes('body-below-tier-target'))
    .map((item) => ({
      articleId: item.articleId,
      title: item.title,
      categoryId: item.categoryId,
      tier: item.tier,
      bodyCharacters: item.bodyCharacters,
      targetCharacters: targets[item.tier],
      deficitCharacters: targets[item.tier] - item.bodyCharacters,
      origin: originById.get(item.articleId) ?? 'post-W21-new',
    }))
    .sort((a, b) => b.deficitCharacters - a.deficitCharacters || a.articleId.localeCompare(b.articleId));
  return {
    version: W22_VERSION,
    snapshotDate: W22_SNAPSHOT_DATE,
    corpusSha256: audit.corpus.sha256,
    baselineCorpusSha256: baselineDepth.corpusSha256,
    policy: {
      purpose: 'remaining depth-restoration queue after the first balanced category batch',
      nextMilestone: 'W23',
      automaticFillerAllowed: false,
      categoryBalanceRequired: true,
    },
    totals: {
      queued: items.length,
      remediated: baselineDepth.totals.queued - items.length,
      deduplicationRevealed: items.filter((item) => item.origin === 'deduplication-revealed').length,
      preExisting: items.filter((item) => item.origin === 'pre-existing').length,
      totalDeficitCharacters: items.reduce((sum, item) => sum + item.deficitCharacters, 0),
    },
    byCategory: Object.fromEntries([...new Set(audit.articles.map((item) => item.categoryId))].sort().map((categoryId) => [
      categoryId,
      items.filter((item) => item.categoryId === categoryId).length,
    ])),
    items,
  };
}

export async function writeW22Artifacts(report) {
  const [inputs, baselineAudit, baselineDepth] = await Promise.all([
    loadW19Inputs(),
    readFile('content-model/quality/w21-quality-audit.json', 'utf8').then(JSON.parse),
    readFile('content-model/quality/w21-depth-remediation.json', 'utf8').then(JSON.parse),
  ]);
  const { audit, queue } = buildW22QualityArtifacts(inputs, baselineAudit);
  const depth = buildW22DepthRemediation(audit, baselineDepth);
  const hashById = new Map(inputs.loaded.map(({ article, raw }) => [article.id, sha256(raw)]));
  report.currentCorpusSha256 = audit.corpus.sha256;
  report.totals.postQualityAverage = audit.totals.averageScore;
  report.totals.postP0 = audit.totals.priorities.P0;
  report.totals.postP1 = audit.totals.priorities.P1;
  report.totals.postP2 = audit.totals.priorities.P2;
  report.totals.remainingDepthArticles = depth.totals.queued;
  for (const change of report.changes) change.afterHash = hashById.get(change.articleId);
  await Promise.all([
    writeFile('content-model/quality/w22-depth-report.json', `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w22-quality-audit.json', `${JSON.stringify(audit, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w22-remediation-queue.json', `${JSON.stringify(queue, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w22-depth-remediation.json', `${JSON.stringify(depth, null, 2)}\n`, 'utf8'),
  ]);
  return { audit, queue, depth, report };
}


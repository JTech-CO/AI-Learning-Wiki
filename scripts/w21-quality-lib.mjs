import { readFile, writeFile } from 'node:fs/promises';
import { buildW19Artifacts, loadW19Inputs } from './w19-quality-lib.mjs';
import { countParticleIssues } from './w20-korean-lib.mjs';
import { sha256, W21_SNAPSHOT_DATE, W21_VERSION } from './w21-duplicate-lib.mjs';

export function buildW21QualityArtifacts(inputs, baselineAudit) {
  const current = buildW19Artifacts(inputs, { particleIssueCounter: (article) => countParticleIssues(article).core });
  current.audit.version = W21_VERSION;
  current.audit.snapshotDate = W21_SNAPSHOT_DATE;
  current.audit.baselineCorpusSha256 = baselineAudit.corpus.sha256;
  current.audit.policy = { ...current.audit.policy, purpose: 'post-internal-deduplication' };
  current.queue.version = W21_VERSION;
  current.queue.snapshotDate = W21_SNAPSHOT_DATE;
  current.queue.baselineCorpusSha256 = baselineAudit.corpus.sha256;
  return current;
}

export function buildW21DepthRemediation(audit, report) {
  const targets = audit.policy.tierBodyCharacterTargets;
  const changedIds = new Set(report.changes.map((item) => item.articleId));
  const items = audit.articles.filter((item) => item.issueCodes.includes('body-below-tier-target')).map((item) => ({
    articleId: item.articleId,
    title: item.title,
    categoryId: item.categoryId,
    tier: item.tier,
    bodyCharacters: item.bodyCharacters,
    targetCharacters: targets[item.tier],
    deficitCharacters: targets[item.tier] - item.bodyCharacters,
    origin: changedIds.has(item.articleId) ? 'deduplication-revealed' : 'pre-existing',
  })).sort((a, b) => b.deficitCharacters - a.deficitCharacters || a.articleId.localeCompare(b.articleId));
  return {
    version: W21_VERSION,
    snapshotDate: W21_SNAPSHOT_DATE,
    corpusSha256: audit.corpus.sha256,
    policy: { purpose: 'explicit depth-restoration queue after inflated duplicate text removal', nextMilestone: 'W22', automaticFillerAllowed: false },
    totals: {
      queued: items.length,
      deduplicationRevealed: items.filter((item) => item.origin === 'deduplication-revealed').length,
      preExisting: items.filter((item) => item.origin === 'pre-existing').length,
      totalDeficitCharacters: items.reduce((sum, item) => sum + item.deficitCharacters, 0),
    },
    items,
  };
}

export async function writeW21Artifacts(report) {
  const [inputs, baselineAudit] = await Promise.all([
    loadW19Inputs(),
    readFile('content-model/quality/w20-quality-audit.json', 'utf8').then(JSON.parse),
  ]);
  const { audit, queue } = buildW21QualityArtifacts(inputs, baselineAudit);
  const hashById = new Map(inputs.loaded.map(({ article, raw }) => [article.id, sha256(raw)]));
  report.currentCorpusSha256 = audit.corpus.sha256;
  report.totals.postQualityAverage = audit.totals.averageScore;
  report.totals.postP0 = audit.totals.priorities.P0;
  report.totals.postP1 = audit.totals.priorities.P1;
  report.totals.postP2 = audit.totals.priorities.P2;
  for (const change of report.changes) change.afterHash = hashById.get(change.articleId);
  const depthRemediation = buildW21DepthRemediation(audit, report);
  report.totals.depthRemediationArticles = depthRemediation.totals.queued;
  report.totals.deduplicationRevealedDepthArticles = depthRemediation.totals.deduplicationRevealed;
  report.totals.preExistingDepthArticles = depthRemediation.totals.preExisting;
  await Promise.all([
    writeFile('content-model/quality/w21-deduplication-report.json', `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w21-quality-audit.json', `${JSON.stringify(audit, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w21-remediation-queue.json', `${JSON.stringify(queue, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w21-depth-remediation.json', `${JSON.stringify(depthRemediation, null, 2)}\n`, 'utf8'),
  ]);
  return { audit, queue, depthRemediation, report };
}

import { readFile, writeFile } from 'node:fs/promises';
import { buildW19Artifacts, loadW19Inputs } from './w19-quality-lib.mjs';
import { countParticleIssues, sha256, W20_SNAPSHOT_DATE, W20_VERSION } from './w20-korean-lib.mjs';

export function buildW20QualityArtifacts(inputs, baselineAudit) {
  const current = buildW19Artifacts(inputs, { particleIssueCounter: (article) => countParticleIssues(article).core });
  current.audit.version = W20_VERSION;
  current.audit.snapshotDate = W20_SNAPSHOT_DATE;
  current.audit.baselineCorpusSha256 = baselineAudit.corpus.sha256;
  current.audit.policy = { ...current.audit.policy, purpose: 'post-language-normalization' };
  current.queue.version = W20_VERSION;
  current.queue.snapshotDate = W20_SNAPSHOT_DATE;
  current.queue.baselineCorpusSha256 = baselineAudit.corpus.sha256;
  return current;
}

export async function writeW20Artifacts(report) {
  const [inputs, baselineAudit] = await Promise.all([
    loadW19Inputs(),
    readFile('content-model/quality/w19-quality-audit.json', 'utf8').then(JSON.parse),
  ]);
  const { audit, queue } = buildW20QualityArtifacts(inputs, baselineAudit);
  const hashById = new Map(inputs.loaded.map(({ article, raw }) => [article.id, sha256(raw)]));
  report.currentCorpusSha256 = audit.corpus.sha256;
  report.totals.postQualityAverage = audit.totals.averageScore;
  report.totals.postP0 = audit.totals.priorities.P0;
  report.totals.postP1 = audit.totals.priorities.P1;
  report.totals.postP2 = audit.totals.priorities.P2;
  for (const change of report.changes) change.afterHash = hashById.get(change.articleId);
  await Promise.all([
    writeFile('content-model/quality/w20-language-normalization.json', `${JSON.stringify(report, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w20-quality-audit.json', `${JSON.stringify(audit, null, 2)}\n`, 'utf8'),
    writeFile('content-model/quality/w20-remediation-queue.json', `${JSON.stringify(queue, null, 2)}\n`, 'utf8'),
  ]);
  return { audit, queue, report };
}

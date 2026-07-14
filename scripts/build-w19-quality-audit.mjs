import { mkdir, writeFile } from 'node:fs/promises';
import { buildW19Artifacts, loadW19Inputs } from './w19-quality-lib.mjs';

const inputs = await loadW19Inputs();
const { audit, queue } = buildW19Artifacts(inputs);
await mkdir('content-model/quality', { recursive: true });
await Promise.all([
  writeFile('content-model/quality/w19-quality-audit.json', `${JSON.stringify(audit, null, 2)}\n`, 'utf8'),
  writeFile('content-model/quality/w19-remediation-queue.json', `${JSON.stringify(queue, null, 2)}\n`, 'utf8'),
]);
console.log(`W19 quality audit: ${audit.corpus.articles} articles, average ${audit.totals.averageScore}/100; P0 ${audit.totals.priorities.P0}, P1 ${audit.totals.priorities.P1}, P2 ${audit.totals.priorities.P2}`);

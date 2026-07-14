import { readFile } from 'node:fs/promises';
import { writeW23Artifacts } from './w23-quality-lib.mjs';
const report = JSON.parse(await readFile('content-model/quality/w23-restoration-report.json', 'utf8'));
const { audit, depth } = await writeW23Artifacts(report);
console.log(`W23 quality audit rebuilt: ${audit.corpus.articles} articles; average ${audit.totals.averageScore}/100; remaining ${depth.totals.queued}`);


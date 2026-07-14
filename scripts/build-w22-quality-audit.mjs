import { readFile } from 'node:fs/promises';
import { writeW22Artifacts } from './w22-quality-lib.mjs';

const report = JSON.parse(await readFile('content-model/quality/w22-depth-report.json', 'utf8'));
const { audit, depth } = await writeW22Artifacts(report);
console.log(`W22 quality audit rebuilt: ${audit.corpus.articles} articles; average ${audit.totals.averageScore}/100; remaining depth queue ${depth.totals.queued}`);


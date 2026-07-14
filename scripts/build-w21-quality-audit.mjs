import { readFile } from 'node:fs/promises';
import { writeW21Artifacts } from './w21-quality-lib.mjs';

const report = JSON.parse(await readFile('content-model/quality/w21-deduplication-report.json', 'utf8'));
const { audit } = await writeW21Artifacts(report);
console.log(`W21 quality audit rebuilt: ${audit.corpus.articles} articles; average ${audit.totals.averageScore}/100; P0 ${audit.totals.priorities.P0}, P1 ${audit.totals.priorities.P1}, P2 ${audit.totals.priorities.P2}`);

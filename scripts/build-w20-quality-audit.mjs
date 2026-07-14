import { readFile } from 'node:fs/promises';
import { writeW20Artifacts } from './w20-quality-lib.mjs';

const report = JSON.parse(await readFile('content-model/quality/w20-language-normalization.json', 'utf8'));
const { audit } = await writeW20Artifacts(report);
console.log(`W20 quality audit rebuilt: ${audit.corpus.articles} articles; average ${audit.totals.averageScore}/100; P0 ${audit.totals.priorities.P0}, P1 ${audit.totals.priorities.P1}, P2 ${audit.totals.priorities.P2}`);

import { readFile, writeFile } from 'node:fs/promises';
import { writeW21Artifacts } from './w21-quality-lib.mjs';

const milestones = ['w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12', 'w13', 'w14', 'w15', 'w16', 'w17', 'w18'];
const timestamps = new Map();
for (const milestone of milestones) {
  const ledgerFile = `content-model/evidence/${milestone}-claim-ledger.json`;
  const summaryFile = `content-model/evidence/${milestone}-summary.json`;
  const [ledger, summary] = await Promise.all([readFile(ledgerFile, 'utf8').then(JSON.parse), readFile(summaryFile, 'utf8').then(JSON.parse)]);
  timestamps.set(milestone, { ledger: ledger.generatedAt, summary: summary.generatedAt });
}
for (const milestone of milestones) await import(new URL(`./build-${milestone}-claim-ledger.mjs?w21`, import.meta.url));
for (const milestone of milestones) {
  const ledgerFile = `content-model/evidence/${milestone}-claim-ledger.json`;
  const summaryFile = `content-model/evidence/${milestone}-summary.json`;
  const [ledger, summary] = await Promise.all([readFile(ledgerFile, 'utf8').then(JSON.parse), readFile(summaryFile, 'utf8').then(JSON.parse)]);
  ledger.generatedAt = timestamps.get(milestone).ledger;
  summary.generatedAt = timestamps.get(milestone).summary;
  await Promise.all([writeFile(ledgerFile, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8'), writeFile(summaryFile, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')]);
}
const report = JSON.parse(await readFile('content-model/quality/w21-deduplication-report.json', 'utf8'));
const result = await writeW21Artifacts(report);
console.log(`W21 claim ledgers refreshed: W4-W18, ${result.report.totals.articlesChanged} deduplicated articles tracked`);

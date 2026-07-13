import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ledgers = await Promise.all(['w4', 'w5', 'w6'].map(async (milestone) => JSON.parse(await readFile(`content-model/evidence/${milestone}-claim-ledger.json`, 'utf8'))));
const ready = new Set(ledgers.flatMap((ledger) => ledger.articles).filter((article) => article.publicationReady).map((article) => article.articleId));
const errors = [];
const articleDirs = await readdir(path.join('dist', 'wiki'));
let readyPages = 0;

for (const articleId of articleDirs) {
  const file = path.join('dist', 'wiki', articleId, 'index.html');
  let html;
  try { html = await readFile(file, 'utf8'); } catch { continue; }
  const hasReadyStatus = html.includes('문장 단위 근거 검토 완료');
  if (ready.has(articleId)) {
    readyPages += 1;
    if (!hasReadyStatus) errors.push(`${articleId}: publication-ready status missing from rendered page`);
  } else if (hasReadyStatus) errors.push(`${articleId}: unreviewed page shows publication-ready status`);
}

if (readyPages !== 42) errors.push(`expected 42 rendered publication-ready pages, found ${readyPages}`);
if (errors.length) {
  console.error(`W6 rendered status check: ${errors.length} error(s)\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('W6 rendered status check: exactly 42 publication-ready pages are labeled');

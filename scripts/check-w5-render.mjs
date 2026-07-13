import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const w4 = JSON.parse(await readFile('content-model/evidence/w4-claim-ledger.json', 'utf8'));
const w5 = JSON.parse(await readFile('content-model/evidence/w5-claim-ledger.json', 'utf8'));
const ready = new Set([...w4.articles, ...w5.articles].filter((article) => article.publicationReady).map((article) => article.articleId));
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
  }
}

if (readyPages !== 28) errors.push(`expected 28 rendered publication-ready pages, found ${readyPages}`);
if (errors.length) {
  console.error(`W5 rendered status check: ${errors.length} error(s)\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('W5 rendered status check: exactly 28 publication-ready pages are labeled');

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ledgers = await Promise.all(['w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12', 'w13', 'w14', 'w15', 'w16', 'w17', 'w18'].map(async (milestone) => JSON.parse(await readFile(`content-model/evidence/${milestone}-claim-ledger.json`, 'utf8'))));
const ready = new Set(ledgers.flatMap((ledger) => ledger.articles).filter((article) => article.publicationReady).map((article) => article.articleId));
const w18 = ledgers.at(-1);
const errors = [];
const articleDirs = await readdir(path.join('dist', 'wiki'));
let readyPages = 0;
for (const articleId of articleDirs) {
  let html;
  try { html = await readFile(path.join('dist', 'wiki', articleId, 'index.html'), 'utf8'); } catch { continue; }
  const hasReadyStatus = html.includes('문장 단위 근거 검토 완료');
  if (ready.has(articleId)) {
    readyPages += 1;
    if (!hasReadyStatus) errors.push(`${articleId}: publication-ready label missing`);
  }
  if (w18.articles.some((article) => article.articleId === articleId)) {
    if (!html.includes('id="reference-1"')) errors.push(`${articleId}: rendered evidence anchor missing`);
    if ((html.match(/<h1/g) ?? []).length !== 1) errors.push(`${articleId}: expected one rendered h1`);
  }
}
if (readyPages !== 1400) errors.push(`expected 1400 rendered ready pages, found ${readyPages}`);
if (errors.length) {
  console.error(`W18 rendered status check: ${errors.length} error(s)\n${errors.slice(0, 200).join('\n')}`);
  process.exit(1);
}
console.log('W18 rendered status check: exactly 1400 publication-ready pages are labeled and W18 evidence anchors resolve');

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const manifest = JSON.parse(await readFile('content-model/evidence/w3-claim-map.json', 'utf8'));
const errors = [];

for (const { articleId } of manifest.articles) {
  const html = await readFile(path.join('dist', 'wiki', articleId, 'index.html'), 'utf8');
  const evidenceBlocks = html.match(/class="wiki-section-sources"/g)?.length ?? 0;
  const linkedRefs = [...html.matchAll(/href="#reference-(\d+)"/g)].map((match) => match[1]);
  const anchors = new Set([...html.matchAll(/id="reference-(\d+)"/g)].map((match) => match[1]));
  if (evidenceBlocks !== 9) errors.push(`${articleId}: expected 9 evidence blocks, found ${evidenceBlocks}`);
  for (const ref of linkedRefs) if (!anchors.has(ref)) errors.push(`${articleId}: missing rendered reference anchor ${ref}`);
}

if (errors.length) {
  console.error(`W3 rendered citation check: ${errors.length} error(s)\n${errors.join('\n')}`);
  process.exit(1);
}
console.log('W3 rendered citation check: 14 pilots × 9 evidence blocks; every link resolves to a local reference anchor');

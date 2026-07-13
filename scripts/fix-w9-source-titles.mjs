import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('content-model/evidence/w9-batch-manifest.json', 'utf8'));
for (const target of manifest.topics) {
  const file = `content-model/articles/${target.topicId}.article.json`;
  const article = JSON.parse(await readFile(file, 'utf8'));
  for (const source of article.sources) source.title = source.title.replace(/\bUser Guide\b/gi, '공식 사용자 문서').replace(/\bGuide\b/gi, '공식 문서');
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

const packageFile = 'package.json';
const pkg = JSON.parse(await readFile(packageFile, 'utf8'));
if (!pkg.scripts['wiki:w9:prepare'].includes('fix-w9-source-titles.mjs')) pkg.scripts['wiki:w9:prepare'] += ' && node scripts/fix-w9-source-titles.mjs';
await writeFile(packageFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
console.log(`W9 source title cleanup: ${manifest.topics.length} articles checked`);

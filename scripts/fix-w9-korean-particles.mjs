import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('content-model/evidence/w9-batch-manifest.json', 'utf8'));
const lastHangul = (text) => [...text].reverse().find((char) => /[가-힣]/.test(char));
const hasBatchim = (char) => char ? (char.codePointAt(0) - 0xac00) % 28 !== 0 : null;

for (const target of manifest.topics) {
  const file = `content-model/articles/${target.topicId}.article.json`;
  const article = JSON.parse(await readFile(file, 'utf8'));
  const last = [...article.title].at(-1);
  const koreanEnding = /[가-힣]/.test(last) ? hasBatchim(lastHangul(article.title)) : null;
  for (const section of article.sections) {
    if (koreanEnding === true) {
      section.body = section.body
        .replaceAll(`${article.title}를 `, `${article.title}을 `)
        .replaceAll(`${article.title}가 `, `${article.title}이 `)
        .replaceAll(`${article.title}는 `, `${article.title}은 `);
    } else if (koreanEnding === false) {
      section.body = section.body
        .replaceAll(`${article.title}을 `, `${article.title}를 `)
        .replaceAll(`${article.title}이 `, `${article.title}가 `)
        .replaceAll(`${article.title}은 `, `${article.title}는 `);
    } else {
      section.body = section.body
        .replaceAll(`${article.title}을 `, '이 표제어를 ')
        .replaceAll(`${article.title}를 `, '이 표제어를 ')
        .replaceAll(`${article.title}이 `, '이 표제어가 ')
        .replaceAll(`${article.title}가 `, '이 표제어가 ')
        .replaceAll(`${article.title}은 `, '이 표제어는 ')
        .replaceAll(`${article.title}는 `, '이 표제어는 ');
    }
  }
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

const packageFile = 'package.json';
const pkg = JSON.parse(await readFile(packageFile, 'utf8'));
if (!pkg.scripts['wiki:w9:prepare'].includes('fix-w9-korean-particles.mjs')) pkg.scripts['wiki:w9:prepare'] += ' && node scripts/fix-w9-korean-particles.mjs';
await writeFile(packageFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
console.log(`W9 Korean particle check: ${manifest.topics.length} articles normalized and prepare pipeline wired`);

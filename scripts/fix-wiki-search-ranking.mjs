import { readFile, writeFile } from 'node:fs/promises';

for (const file of ['scripts/test-wiki.mjs', 'src/components/wiki/WikiSearch.astro']) {
  let source = await readFile(file, 'utf8');
  source = source.replace(
    "const names = [article.title, article.englishTitle, ...article.aliases].join(' ').toLowerCase();\n    return { id: article.id, score: names === needle ? 0 : names.startsWith(needle) ? 1 : names.includes(needle) ? 2 : article.summary.toLowerCase().includes(needle) ? 3 : 99 };",
    "const nameList = [article.title, article.englishTitle, ...article.aliases].map((value) => value.toLowerCase());\n    const names = nameList.join(' ');\n    return { id: article.id, score: nameList.includes(needle) ? 0 : nameList.some((value) => value.startsWith(needle)) ? 1 : names.includes(needle) ? 2 : article.summary.toLowerCase().includes(needle) ? 3 : 99 };"
  );
  source = source.replace(
    "const names = [item.title, item.englishTitle, ...(item.aliases ?? [])].join(' ').toLowerCase();\n      const text = `${names} ${item.summary ?? ''} ${(item.tags ?? []).join(' ')}`.toLowerCase();\n      const score = names === needle ? 0 : names.startsWith(needle) ? 1 : names.includes(needle) ? 2 : text.includes(needle) ? 3 : 99;",
    "const nameList = [item.title, item.englishTitle, ...(item.aliases ?? [])].filter(Boolean).map((value) => value.toLowerCase());\n      const names = nameList.join(' ');\n      const text = `${names} ${item.summary ?? ''} ${(item.tags ?? []).join(' ')}`.toLowerCase();\n      const score = nameList.includes(needle) ? 0 : nameList.some((value) => value.startsWith(needle)) ? 1 : names.includes(needle) ? 2 : text.includes(needle) ? 3 : 99;"
  );
  await writeFile(file, source, 'utf8');
}
console.log('wiki search exact aliases now rank first');

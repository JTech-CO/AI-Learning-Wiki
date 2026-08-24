import { readFile } from 'node:fs/promises';

const wiki = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8'));
const failures = [];
const byId = new Map(wiki.articles.map((article) => [article.id, article]));
const search = (query) => {
  const needle = query.toLowerCase();
  return wiki.articles.map((article) => {
    const nameList = [article.title, article.englishTitle, ...article.aliases].map((value) => value.toLowerCase());
    const names = nameList.join(' ');
    return { id: article.id, score: nameList.includes(needle) ? 0 : nameList.some((value) => value.startsWith(needle)) ? 1 : names.includes(needle) ? 2 : article.summary.toLowerCase().includes(needle) ? 3 : 99 };
  }).filter((item) => item.score < 99).sort((a, b) => a.score - b.score)[0]?.id;
};

for (const article of wiki.articles) {
  if (!article.related.length && !article.prerequisites.length && !article.backlinks.length) failures.push(`orphan: ${article.id}`);
  for (const ref of [...article.related, ...article.prerequisites, ...article.backlinks]) if (!byId.has(ref)) failures.push(`broken graph: ${article.id} -> ${ref}`);
  const markdown = await readFile(`src/content/docs/wiki/${article.id}.md`, 'utf8');
  const referenceBlock = markdown.match(/### 참고 문헌\n\n([\s\S]*?)\n\n### 코스에서 계속 읽기/)?.[1] ?? '';
  const referenceLines = referenceBlock.split('\n').filter(Boolean);
  if (!referenceLines.length) failures.push(`references missing: ${article.id}`);
  referenceLines.forEach((line, index) => {
    if (!line.startsWith(`${index + 1}. `)) failures.push(`reference list formatting: ${article.id} line ${index + 1}`);
    if (line.includes('—')) failures.push(`reference em dash: ${article.id} line ${index + 1}`);
    if (!/ - (?:book|documentation|encyclopedia|paper|specification|standard)$/u.test(line)) failures.push(`reference separator: ${article.id} line ${index + 1}`);
  });
}
const cases = { LLM: 'large-language-model', RAG: 'rag', API: 'api', 트랜스포머: 'transformer', 토큰: 'token', '프롬프트 인젝션': 'prompt-injection', MCP: 'mcp' };
for (const [query, expected] of Object.entries(cases)) if (search(query) !== expected) failures.push(`search ${query}: ${search(query)} != ${expected}`);
for (const course of wiki.courses) {
  if (course.steps.some((step) => !byId.has(step.ref))) failures.push(`course reference: ${course.id}`);
  if (course.steps.some((step) => step.url.startsWith('/courses/'))) failures.push(`legacy guide in wiki course: ${course.id}`);
}

if (failures.length) { console.error(`wiki tests: ${failures.length} failure(s)\n${failures.join('\n')}`); process.exit(1); }
console.log(`wiki tests: ${wiki.articles.length} connected articles and reference lists, ${Object.keys(cases).length} search cases, ${wiki.courses.length} guide-free courses OK`);

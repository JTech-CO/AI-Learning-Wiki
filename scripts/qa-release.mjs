import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const catalog = JSON.parse(await readFile('public/data/catalog.json', 'utf8'));
const prompts = JSON.parse(await readFile('public/data/prompts.json', 'utf8'));
const progress = JSON.parse(await readFile('content-model/progress.json', 'utf8'));
const failures = [];

const expect = (condition, message) => { if (!condition) failures.push(message); };
const fileExists = async (file) => { try { return (await stat(file)).isFile(); } catch { return false; } };

expect(catalog.modules.length === 305, `catalog modules: ${catalog.modules.length}`);
expect(prompts.prompts.length === 1173, `prompts: ${prompts.prompts.length}`);
expect(progress.totals?.complete === 305, `progress completed: ${progress.totals?.complete}`);
expect(new Set(catalog.modules.map((item) => item.url)).size === 305, 'module URLs are not unique');
expect(catalog.modules.every((item) => item.url.startsWith('/courses/') && item.title && item.summary), 'catalog has incomplete module entries');
expect(prompts.prompts.every((item) => item.template && Array.isArray(item.examples)), 'prompt schema is incomplete');

for (const route of ['index.html', 'paths/index.html', 'explore/index.html', 'prompt-explorer/index.html', 'search/index.html']) {
  expect(await fileExists(path.join('dist', route)), `missing dist/${route}`);
}
for (const locale of ['en', 'es', 'ja', 'zh']) {
  expect(!(await fileExists(path.join('dist', locale, 'index.html'))), `stale locale route: ${locale}`);
}

const home = await readFile('dist/index.html', 'utf8');
const courseProgress = await readFile('public/wiki-course-progress.js', 'utf8');
expect(home.includes('AI와 대규모 언어 모델'), 'wiki home introduction missing');
expect(home.includes('분야별 백과 탐색'), 'wiki category navigation missing');
expect(courseProgress.includes('aiwiki-course-v2'), 'wiki course progress storage missing');

if (failures.length) {
  console.error(`release QA: ${failures.length} failure(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
const wiki = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8'));
expect(wiki.articles.length === 150, `wiki articles: ${wiki.articles.length}`);
expect(wiki.courses.length === 8, `wiki courses: ${wiki.courses.length}`);
expect(wiki.courses.every((course) => course.steps.every((step) => step.url.startsWith('/wiki/'))), 'legacy guide found in wiki course');
expect(wiki.articles.every((article) => article.related.length || article.prerequisites.length || article.backlinks.length), 'orphan wiki article found');
if (failures.length) { console.error(`release QA: ${failures.length} failure(s)\n- ${failures.join('\n- ')}`); process.exit(1); }
console.log(`release QA: 150 wiki articles, 8 wiki courses, 305 archived guides, 1173 prompts OK`);

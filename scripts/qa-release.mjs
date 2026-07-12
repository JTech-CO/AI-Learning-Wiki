import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const catalog = JSON.parse(await readFile('public/data/catalog.json', 'utf8'));
const prompts = JSON.parse(await readFile('public/data/prompts.json', 'utf8'));
const progress = JSON.parse(await readFile('content-model/progress.json', 'utf8'));
const wiki = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8'));
const failures = [];

const expect = (condition, message) => { if (!condition) failures.push(message); };
const fileExists = async (file) => { try { return (await stat(file)).isFile(); } catch { return false; } };

expect(catalog.modules.length === 305, `catalog modules: ${catalog.modules.length}`);
expect(prompts.prompts.length === 1173, `prompts: ${prompts.prompts.length}`);
expect(progress.totals?.complete === 305, `progress completed: ${progress.totals?.complete}`);
expect(new Set(catalog.modules.map((item) => item.url)).size === 305, 'module URLs are not unique');
expect(catalog.modules.every((item) => item.url.startsWith('/courses/') && item.title && item.summary), 'catalog has incomplete module entries');
expect(prompts.prompts.every((item) => item.template && Array.isArray(item.examples)), 'prompt schema is incomplete');
expect(prompts.prompts.every((item) => !/온도 (낮춤|높임)/.test(item.title)), 'context-free temperature label remains');
const wikiCourseIds = new Set(wiki.courses.map((course) => course.id));
expect(prompts.prompts.every((item) => wikiCourseIds.has(item.course)), 'prompt has an unknown Wiki course');
expect(new Set(prompts.prompts.map((item) => item.course)).size === wikiCourseIds.size, 'not every Wiki course has prompts');
expect(prompts.prompts.every((item) => item.courseUrl === `/course/${item.course}/`), 'prompt Wiki course URL mismatch');
expect(prompts.prompts.every((item) => item.url.startsWith('/wiki/') && item.relatedWikiUrl === item.url), 'prompt does not link to a Wiki article');
expect(prompts.prompts.every((item) => item.sourceUrl.startsWith('/courses/')), 'prompt source provenance missing');

for (const route of ['index.html', 'paths/index.html', 'explore/index.html', 'prompt-explorer/index.html', 'search/index.html']) {
  expect(await fileExists(path.join('dist', route)), `missing dist/${route}`);
}
for (const locale of ['en', 'es', 'ja', 'zh']) {
  expect(!(await fileExists(path.join('dist', locale, 'index.html'))), `stale locale route: ${locale}`);
}

const home = await readFile('dist/index.html', 'utf8');
const promptExplorer = await readFile('dist/prompt-explorer/index.html', 'utf8');
const courseProgress = await readFile('public/wiki-course-progress.js', 'utf8');
expect(home.includes('AI와 대규모 언어 모델'), 'wiki home introduction missing');
expect(home.includes('분야별 백과 탐색'), 'wiki category navigation missing');
expect(courseProgress.includes('aiwiki-course-v2'), 'wiki course progress storage missing');
expect(promptExplorer.includes('관련 Wiki 문서'), 'prompt explorer Wiki link missing');
expect(!promptExplorer.includes('레슨 보기 →'), 'legacy lesson link remains in prompt explorer');

if (failures.length) {
  console.error(`release QA: ${failures.length} failure(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
expect(wiki.articles.length === 150, `wiki articles: ${wiki.articles.length}`);
expect(wiki.courses.length === 8, `wiki courses: ${wiki.courses.length}`);
expect(wiki.courses.every((course) => course.steps.every((step) => step.url.startsWith('/wiki/'))), 'legacy guide found in wiki course');
expect(wiki.articles.every((article) => article.related.length || article.prerequisites.length || article.backlinks.length), 'orphan wiki article found');
if (failures.length) { console.error(`release QA: ${failures.length} failure(s)\n- ${failures.join('\n- ')}`); process.exit(1); }
console.log(`release QA: 150 wiki articles, 8 unified Wiki courses, 305 archived guides, 1173 Wiki-linked prompts OK`);

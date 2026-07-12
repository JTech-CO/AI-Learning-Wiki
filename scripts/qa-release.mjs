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

const profiles = {
  beginner: ['ai-start', 'ai-intro'],
  engineer: ['ai-intro', 'ai-engineer'],
  business: ['ai-start', 'ai-intro', 'ai-finance'],
};
const firstRoutes = Object.fromEntries(Object.entries(profiles).map(([name, courses]) => [
  name,
  catalog.modules.find((item) => courses.includes(item.course))?.url,
]));
expect(new Set(Object.values(firstRoutes)).size >= 2, 'profile recommendations do not diverge');

for (const route of ['index.html', 'paths/index.html', 'explore/index.html', 'prompt-explorer/index.html', 'pagefind/pagefind.js']) {
  expect(await fileExists(path.join('dist', route)), `missing dist/${route}`);
}
for (const locale of ['en', 'es', 'ja', 'zh']) {
  expect(!(await fileExists(path.join('dist', locale, 'index.html'))), `stale locale route: ${locale}`);
}

const home = await readFile('dist/index.html', 'utf8');
const dashboard = await readFile('src/components/LearningDashboard.astro', 'utf8');
const progressScript = await readFile('public/progress.js', 'utf8');
expect(home.includes('305개 AI 학습'), 'home hero text missing');
expect(dashboard.includes('aiwiki-profile-v1') && dashboard.includes('aiwiki-progress-v1'), 'local profile/progress storage missing');
expect(progressScript.includes('aiwiki-progress-v1'), 'module completion control missing');
expect(dashboard.includes('브라우저에만 저장'), 'local data privacy notice missing');

if (failures.length) {
  console.error(`release QA: ${failures.length} failure(s)\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`release QA: 305 modules, 1173 prompts, ${Object.keys(firstRoutes).length} profiles, required routes OK`);

import { readFile, writeFile } from 'node:fs/promises';
const file = 'scripts/qa-release.mjs';
let source = await readFile(file, 'utf8');
source = source.replace("expect(home.includes('305개 AI 학습'), 'home hero text missing');", "expect(home.includes('AI와 대규모 언어 모델'), 'wiki home introduction missing');\nexpect(home.includes('분야별 백과 탐색'), 'wiki category navigation missing');");
source = source.replace("console.log(`release QA: 305 modules, 1173 prompts, ${Object.keys(firstRoutes).length} profiles, required routes OK`);", "const wiki = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8'));\nexpect(wiki.articles.length === 150, `wiki articles: ${wiki.articles.length}`);\nexpect(wiki.courses.length === 8, `wiki courses: ${wiki.courses.length}`);\nif (failures.length) { console.error(`release QA: ${failures.length} failure(s)\\n- ${failures.join('\\n- ')}`); process.exit(1); }\nconsole.log(`release QA: 150 wiki articles, 8 wiki courses, 305 archived guides, 1173 prompts OK`);");
await writeFile(file, source, 'utf8');
console.log('release QA upgraded for wiki architecture');

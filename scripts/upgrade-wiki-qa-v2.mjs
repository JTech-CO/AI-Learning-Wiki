import { readFile, writeFile } from 'node:fs/promises';
const file = 'scripts/qa-release.mjs';
let source = await readFile(file, 'utf8');
source = source.replace("const dashboard = await readFile('src/components/LearningDashboard.astro', 'utf8');\nconst progressScript = await readFile('public/progress.js', 'utf8');", "const courseProgress = await readFile('public/wiki-course-progress.js', 'utf8');");
source = source.replace(/expect\(dashboard\.includes\([\s\S]*?expect\(dashboard\.includes\([^\n]+\n/, "expect(courseProgress.includes('aiwiki-course-v2'), 'wiki course progress storage missing');\n");
await writeFile(file, source, 'utf8');
console.log('release QA moved from guide profile to wiki course progress');

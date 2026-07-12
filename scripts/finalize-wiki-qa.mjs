import { readFile, writeFile } from 'node:fs/promises';
const file = 'scripts/qa-release.mjs';
let source = await readFile(file, 'utf8');
source = source.replace(/const profiles = \{[\s\S]*?expect\(new Set\(Object\.values\(firstRoutes\)\)\.size >= 2, 'profile recommendations do not diverge'\);\n\n/, '');
source = source.replace("expect(wiki.courses.length === 8, `wiki courses: ${wiki.courses.length}`);", "expect(wiki.courses.length === 8, `wiki courses: ${wiki.courses.length}`);\nexpect(wiki.courses.every((course) => course.steps.every((step) => step.url.startsWith('/wiki/'))), 'legacy guide found in wiki course');\nexpect(wiki.articles.every((article) => article.related.length || article.prerequisites.length || article.backlinks.length), 'orphan wiki article found');");
await writeFile(file, source, 'utf8');
console.log('release QA finalized for encyclopedia-first courses');

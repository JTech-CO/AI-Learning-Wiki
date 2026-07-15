import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const prompts = JSON.parse(await readFile('public/data/prompts.json', 'utf8'));
const snippets = JSON.parse(await readFile('public/data/snippets.json', 'utf8'));
const progress = JSON.parse(await readFile('content-model/progress.json', 'utf8'));
const wiki = JSON.parse(await readFile('public/data/wiki-index.json', 'utf8'));
const ledger = JSON.parse(await readFile('content-model/taxonomy/topic-ledger.json', 'utf8'));
const expectedArticleCount = ledger.topics.filter((topic) => topic.state === 'existing').length;
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const fileExists = async (file) => { try { return (await stat(file)).isFile(); } catch { return false; } };
const readDist = (route) => readFile(path.join('dist', route), 'utf8');
const configuredBase = process.env.BASE_PATH ?? '/AI-Learning-Wiki';
const basePath = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
const withBase = (url) => url.startsWith('/') ? `${basePath}${url}` : url;

expect(prompts.prompts.length === 1142, 'prompt count: ' + prompts.prompts.length);
expect(snippets.snippets.length === 25, 'snippet count: ' + snippets.snippets.length);
expect(progress.totals?.complete === 305, 'source extraction coverage: ' + progress.totals?.complete);
expect(wiki.articles.length === expectedArticleCount, 'wiki articles: expected ' + expectedArticleCount + ', found ' + wiki.articles.length);
expect(wiki.courses.length === 8, 'wiki courses: ' + wiki.courses.length);
expect(prompts.prompts.every((item) => item.template && Array.isArray(item.examples)), 'prompt schema is incomplete');
expect(prompts.prompts.every((item) => !('sourceUrl' in item) && !('sourceCourse' in item) && !('moduleId' in item) && !('moduleTitle' in item)), 'legacy lesson provenance remains public');
expect(prompts.prompts.every((item) => !(item.tags ?? []).some((tag) => /eduverse/i.test(tag))), 'source-specific prompt tag remains');
expect(prompts.prompts.every((item) => item.courseUrl === '/course/' + item.course + '/'), 'prompt course URL mismatch');
expect(prompts.prompts.every((item) => item.url.startsWith('/wiki/') && item.relatedWikiUrl === item.url), 'prompt Wiki link mismatch');

for (const route of ['index.html', 'paths/index.html', 'prompt-explorer/index.html', 'snippet-explorer/index.html', 'search/index.html']) {
  expect(await fileExists(path.join('dist', route)), 'missing dist/' + route);
}
expect(!(await fileExists('dist/explore/index.html')), 'legacy explore route remains');
expect(!(await fileExists('dist/data/catalog.json')), 'legacy catalog remains');

const oneTitleRoutes = [
  'paths/index.html', 'prompt-explorer/index.html', 'snippet-explorer/index.html', 'search/index.html', 'glossary/index.html',
  'special/all-pages/index.html', 'special/recent/index.html', 'special/random/index.html',
  ...wiki.categories.map((item) => 'category/' + item.id + '/index.html'),
  ...wiki.courses.map((item) => 'course/' + item.id + '/index.html'),
  ...wiki.articles.map((item) => 'wiki/' + item.id + '/index.html'),
];
for (const route of oneTitleRoutes) {
  const html = await readDist(route);
  expect((html.match(/<h1\b/g) ?? []).length === 1, 'expected one H1: ' + route);
}

for (const course of wiki.courses) {
  const courseHtml = await readDist('course/' + course.id + '/index.html');
  let cursor = -1;
  for (const step of course.steps) {
    const position = courseHtml.indexOf('href="' + withBase(step.url) + '"');
    expect(position > cursor, 'course order mismatch: ' + course.id + ' -> ' + step.ref);
    cursor = position;
  }
  expect(!/wiki-course-check|필수|선택/.test(courseHtml), 'course progress decoration remains: ' + course.id);
  for (let index = 0; index < course.steps.length - 1; index += 1) {
    const current = course.steps[index];
    const next = course.steps[index + 1];
    const articleHtml = await readDist('wiki/' + current.ref + '/index.html');
    expect(articleHtml.includes('코스에서 계속 읽기') && articleHtml.includes('href="' + withBase(next.url) + '"'), 'next course article missing: ' + course.id + ' -> ' + current.ref);
  }
}

const htmlFiles = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
await walk('dist');
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const visibleText = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  expect(!/(?:에듀버스|eduverse|기존 실습|\bGuide\b)/i.test(visibleText), 'legacy source wording in ' + path.relative('dist', file));
  expect(!/href=["']\/courses\//i.test(html), 'legacy lesson link in ' + path.relative('dist', file));
}

if (failures.length) {
  console.error('release QA: ' + failures.length + ' failure(s)\n- ' + failures.slice(0, 80).join('\n- '));
  process.exit(1);
}
console.log(`release QA: ${expectedArticleCount} articles, 8 sequential courses, ${prompts.prompts.length} prompts, ${snippets.snippets.length} snippets, no legacy lesson routes OK`);

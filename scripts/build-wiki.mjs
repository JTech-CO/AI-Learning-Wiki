import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CATEGORY_META } from './wiki-core-data.mjs';

const docs = path.resolve('src/content/docs');
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const pathFiles = (await readdir('content-model/paths')).filter((file) => file.endsWith('.path.json'));
const articles = (await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))))).sort((a, b) => a.title.localeCompare(b.title, 'ko'));
const courses = (await Promise.all(pathFiles.map((file) => readJson(path.join('content-model/paths', file))))).sort((a, b) => a.title.localeCompare(b.title, 'ko'));
const [w4Ledger, w5Ledger, w6Ledger, w7Ledger, w8Ledger, w9Ledger, w10Ledger, w11Ledger, w12Ledger, w13Ledger, w14Ledger, w15Ledger, w16Ledger, w17Ledger, w18Ledger] = await Promise.all([
  readJson('content-model/evidence/w4-claim-ledger.json'),
  readJson('content-model/evidence/w5-claim-ledger.json'),
  readJson('content-model/evidence/w6-claim-ledger.json'),
  readJson('content-model/evidence/w7-claim-ledger.json'),
  readJson('content-model/evidence/w8-claim-ledger.json'),
  readJson('content-model/evidence/w9-claim-ledger.json'),
  readJson('content-model/evidence/w10-claim-ledger.json'),
  readJson('content-model/evidence/w11-claim-ledger.json'),
  readJson('content-model/evidence/w12-claim-ledger.json'),
  readJson('content-model/evidence/w13-claim-ledger.json'),
  readJson('content-model/evidence/w14-claim-ledger.json'),
  readJson('content-model/evidence/w15-claim-ledger.json'),
  readJson('content-model/evidence/w16-claim-ledger.json'),
  readJson('content-model/evidence/w17-claim-ledger.json'),
  readJson('content-model/evidence/w18-claim-ledger.json')
]);
const publicationReady = new Set([...w4Ledger.articles, ...w5Ledger.articles, ...w6Ledger.articles, ...w7Ledger.articles, ...w8Ledger.articles, ...w9Ledger.articles, ...w10Ledger.articles, ...w11Ledger.articles, ...w12Ledger.articles, ...w13Ledger.articles, ...w14Ledger.articles, ...w15Ledger.articles, ...w16Ledger.articles, ...w17Ledger.articles, ...w18Ledger.articles].filter((article) => article.publicationReady).map((article) => article.articleId));
const byId = new Map(articles.map((article) => [article.id, article]));
const backlinks = new Map(articles.map((article) => [article.id, []]));
const courseMap = new Map(articles.map((article) => [article.id, []]));

for (const article of articles) for (const ref of [...article.prerequisites, ...article.related]) backlinks.get(ref)?.push(article.id);
for (const course of courses) for (const step of course.steps) courseMap.get(step.ref)?.push(course.id);

for (const dir of ['wiki', 'category', 'course', 'special']) {
  const target = path.join(docs, dir);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
}

const q = (value) => JSON.stringify(value);
const list = (refs) => refs.length ? refs.map((ref) => `- [${byId.get(ref)?.title ?? ref}](/wiki/${ref}/)`).join('\n') : '_해당 문서가 없습니다._';
const sectionEvidence = (section) => section.sourceRefs?.length ? `\n\n<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> ${section.sourceRefs.map((ref) => `<a href="#reference-${ref}">[${ref}]</a>`).join(' ')}</div>` : '';
const courseContinuation = (article) => courseMap.get(article.id).map((courseId) => {
  const course = courses.find((item) => item.id === courseId);
  const index = course.steps.findIndex((step) => step.ref === article.id);
  const nextStep = course.steps[index + 1];
  if (nextStep) return `- **${course.title}:** [다음 문서 — ${byId.get(nextStep.ref).title}](/wiki/${nextStep.ref}/)`;
  return `- **${course.title}:** [코스 목록으로 돌아가기](/course/${course.id}/)`;
}).join('\n') || '_이 문서에서 이어지는 코스가 없습니다._';

for (const article of articles) {
  const hasSectionEvidence = article.sections.some((section) => section.sourceRefs?.length);
  const hasDistinctEnglishTitle = article.englishTitle && article.englishTitle.localeCompare(article.title, undefined, { sensitivity: 'accent' }) !== 0;
  const displayTitle = hasDistinctEnglishTitle ? `${article.title} ${article.englishTitle}` : article.title;
  const aliases = article.aliases.filter((value, index, values) => value && value !== article.title && value !== article.englishTitle && values.indexOf(value) === index);
  const aliasBlock = aliases.length ? `<p class="wiki-alias">${aliases.join(' · ')}</p>\n\n` : '';
  const categoryLinks = article.categories.map((category) => `[${CATEGORY_META[category]?.[0] ?? category}](/category/${category}/)`).join(' · ');
  const courseLinks = courseMap.get(article.id).map((id) => `[${courses.find((course) => course.id === id)?.title ?? id}](/course/${id}/)`).join(' · ');
  const body = `---\ntitle: ${q(displayTitle)}\ndescription: ${q(article.summary)}\ntableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }\n---\n\n${aliasBlock}<p class="wiki-lead">${article.summary}</p>\n\n<div class="wiki-document-meta">분류: ${categoryLinks} · 문서 상태: ${publicationReady.has(article.id) ? '문장 단위 근거 검토 완료' : '출처 검토 완료'} · 최근 검토: ${article.reviewedAt}</div>\n\n${article.sections.map((section) => `## ${section.title}\n\n${section.body}${sectionEvidence(section)}`).join('\n\n')}\n\n## 선행 개념\n\n${list(article.prerequisites)}\n\n## 관련 문서\n\n${list(article.related)}\n\n## 이 문서를 가리키는 문서\n\n${list([...new Set(backlinks.get(article.id))].sort())}\n\n## 이 문서를 포함하는 코스\n\n${courseLinks || '_포함된 코스가 없습니다._'}\n\n<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>\n\n## 참고 문헌\n\n${article.sources.map((source, index) => `${hasSectionEvidence ? `<span id="reference-${index + 1}"></span>` : ''}${index + 1}. [${source.title}](${source.url}) — ${source.type}`).join('\n')}\n\n## 코스에서 계속 읽기\n\n${courseContinuation(article)}\n`;
  await writeFile(path.join(docs, 'wiki', `${article.id}.md`), body, 'utf8');
}

for (const [category, meta] of Object.entries(CATEGORY_META)) {
  const members = articles.filter((article) => article.categories.includes(category));
  const body = `---\ntitle: ${q(meta[0])}\ndescription: ${q(meta[1])}\n---\n\n${meta[1]} 분야의 검토 완료 백과 문서입니다.\n\n${members.map((article) => `- [${article.title}](/wiki/${article.id}/) — ${article.summary}`).join('\n')}\n`;
  await writeFile(path.join(docs, 'category', `${category}.md`), body, 'utf8');
}

for (const course of courses) {
  const body = `---\ntitle: ${q(course.title)}\ndescription: ${q(course.description)}\n---\n\n<p class="wiki-lead">${course.description}</p>\n\n**대상:** ${course.audience}\n\n## 권장 문서 순서\n\n${course.steps.map((step, index) => { const article = byId.get(step.ref); return `${index + 1}. [${article.title}](/wiki/${article.id}/)`; }).join('\n')}\n`;
  await writeFile(path.join(docs, 'course', `${course.id}.md`), body, 'utf8');
}

const glossary = [...articles].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
await writeFile(path.join(docs, 'glossary.md'), `---\ntitle: 용어 색인\ndescription: AI·LLM 백과 문서 가나다 색인\n---\n\n${glossary.map((article) => `- [${article.title}](/wiki/${article.id}/) <span class="wiki-en">${article.englishTitle}</span>`).join('\n')}\n`, 'utf8');
await writeFile(path.join(docs, 'special', 'all-pages.md'), `---\ntitle: 전체 문서\ndescription: 검토 완료 AI·LLM 백과 문서 전체 목록\n---\n\n현재 검토 완료된 백과 문서는 **${articles.length}개**입니다.\n\n${glossary.map((article) => `- [${article.title}](/wiki/${article.id}/) — ${article.summary}`).join('\n')}\n`, 'utf8');
await writeFile(path.join(docs, 'special', 'recent.md'), `---\ntitle: 최근 검토 문서\ndescription: 최근 검토된 AI·LLM 백과 문서\n---\n\n${[...articles].sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt) || a.title.localeCompare(b.title, 'ko')).slice(0, 50).map((article) => `- ${article.reviewedAt} — [${article.title}](/wiki/${article.id}/)`).join('\n')}\n`, 'utf8');

const index = {
  generatedAt: new Date().toISOString(),
  counts: { articles: articles.length, courses: courses.length },
  categories: Object.entries(CATEGORY_META).map(([id, meta]) => ({ id, title: meta[0], description: meta[1], count: articles.filter((article) => article.categories.includes(id)).length })),
  articles: articles.map((article) => ({ id: article.id, title: article.title, englishTitle: article.englishTitle, aliases: article.aliases, summary: article.summary, categories: article.categories, prerequisites: article.prerequisites, related: article.related, backlinks: [...new Set(backlinks.get(article.id))], courses: courseMap.get(article.id), reviewedAt: article.reviewedAt, url: `/wiki/${article.id}/` })),
  courses: courses.map((course) => ({ ...course, url: `/course/${course.id}/`, steps: course.steps.map((step) => ({ ...step, title: byId.get(step.ref).title, url: `/wiki/${step.ref}/` })) }))
};
await mkdir('public/data', { recursive: true });
await writeFile('public/data/wiki-index.json', `${JSON.stringify(index, null, 2)}\n`, 'utf8');
console.log(`wiki pages: ${articles.length} articles, ${Object.keys(CATEGORY_META).length} categories, ${courses.length} courses`);

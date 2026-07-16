import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const articleSchema = await readJson('content-model/schema.article.json');
const ledger = await readJson('content-model/taxonomy/topic-ledger.json');
const topicById = new Map(ledger.topics.map((topic) => [topic.id, topic]));
const expansionQueue = await readJson('content-model/research/w42-topic-candidates.json');
const expansionById = new Map(expansionQueue.candidates.map((topic) => [topic.id, topic]));
const pathSchema = await readJson('content-model/schema.path.json');
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateArticle = ajv.compile(articleSchema);
const validatePath = ajv.compile(pathSchema);
const errors = [];

const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const pathFiles = (await readdir('content-model/paths')).filter((file) => file.endsWith('.path.json'));
const articles = await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))));
const paths = await Promise.all(pathFiles.map((file) => readJson(path.join('content-model/paths', file))));
const ids = new Set(articles.map((article) => article.id));
const aliases = new Map();

for (const article of articles) {
  if (!validateArticle(article)) errors.push(`${article.id}: ${ajv.errorsText(validateArticle.errors)}`);
  const articleChars = article.sections.reduce((sum, section) => sum + section.body.length, 0);
  if (article.sections.length < 10) errors.push(`${article.id}: expected at least 10 sections`);
  if (articleChars < 2400) errors.push(`${article.id}: article body too short (${articleChars})`);
  if (article.sections.some((section) => /트랜스포머은|개인정보 보호을|Temperature은|Temperature을|소프트맥스은/.test(section.body))) errors.push(`${article.id}: contextual Korean particle error`);
  for (const section of article.sections) {
    if (section.sourceRefs && new Set(section.sourceRefs).size !== section.sourceRefs.length) errors.push(`${article.id}/${section.id}: duplicate sourceRefs`);
    for (const ref of section.sourceRefs ?? []) if (!article.sources[ref - 1]) errors.push(`${article.id}/${section.id}: sourceRefs points outside sources (${ref})`);
  }
  if (articleFiles.filter((file) => file === `${article.id}.article.json`).length !== 1) errors.push(`${article.id}: filename mismatch`);
  for (const ref of [...article.prerequisites, ...article.related]) if (!ids.has(ref)) errors.push(`${article.id}: missing article ref ${ref}`);
  for (const alias of [article.title, article.englishTitle, ...article.aliases].map((value) => value.toLowerCase())) {
    if (aliases.has(alias) && aliases.get(alias) !== article.id) errors.push(`alias collision: ${alias}`);
    aliases.set(alias, article.id);
  }
}

for (const course of paths) {
  if (!validatePath(course)) errors.push(`${course.id}: ${ajv.errorsText(validatePath.errors)}`);
  for (const step of course.steps) if (!ids.has(step.ref)) errors.push(`${course.id}: missing course ref ${step.ref}`);
}

if (articles.length < 150 || articles.length > 1600) errors.push(`expected 150–1600 articles, found ${articles.length}`);
for (const article of articles) {
  const topic = topicById.get(article.id);
  if (topic) {
    if (topic.titleKo !== article.title || topic.titleEn !== article.englishTitle || !article.categories.includes(topic.primaryCategory)) errors.push(`${article.id}: title/category differs from the W0 topic ledger`);
    continue;
  }
  const expansion = expansionById.get(article.id);
  if (!expansion) {
    errors.push(`${article.id}: not registered in W0 or W42`);
    continue;
  }
  if (expansion.title.ko !== article.title || expansion.title.en !== article.englishTitle || !article.categories.includes(expansion.category)) errors.push(`${article.id}: title/category differs from the W42 queue`);
}
if (paths.length !== 16) errors.push(`expected 16 wiki courses, found ${paths.length}`);

if (errors.length) {
  console.error(`wiki validation: ${errors.length} error(s)\n${errors.slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log(`wiki validation: ${articles.length} reviewed articles, ${paths.length} wiki courses, ${aliases.size} search names`);

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const articleSchema = await readJson('content-model/schema.article.json');
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

if (articles.length !== 150) errors.push(`expected 150 articles, found ${articles.length}`);
if (paths.length !== 8) errors.push(`expected 8 wiki courses, found ${paths.length}`);

if (errors.length) {
  console.error(`wiki validation: ${errors.length} error(s)\n${errors.slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log(`wiki validation: ${articles.length} reviewed articles, ${paths.length} wiki courses, ${aliases.size} search names`);

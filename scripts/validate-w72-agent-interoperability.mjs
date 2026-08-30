import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const manifest = JSON.parse(await readFile('content-model/quality/w72-agent-interoperability.json', 'utf8'));
const articleSchema = JSON.parse(await readFile('content-model/schema.article.json', 'utf8'));
const pathSchema = JSON.parse(await readFile('content-model/schema.path.json', 'utf8'));
const course = JSON.parse(await readFile('content-model/paths/agent-interoperability.path.json', 'utf8'));
const allowedCategories = new Set([
  'agents', 'api', 'ecosystem', 'evaluation', 'foundations', 'inference', 'llm',
  'mathematics', 'multimodal', 'neural', 'retrieval', 'safety', 'training', 'transformer',
]);
const errors = [];
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateArticleSchema = ajv.compile(articleSchema);
const validatePathSchema = ajv.compile(pathSchema);

if (manifest.milestone !== 'W72') errors.push('manifest milestone이 W72가 아니다.');
if (manifest.articleCount !== 16 || manifest.articleIds?.length !== 16) errors.push('신규 문서는 정확히 16개여야 한다.');
if (new Set(manifest.articleIds).size !== 16) errors.push('manifest에 중복 문서 ID가 있다.');

const allArticleFiles = await readdir('content-model/articles');
const allIds = new Set(allArticleFiles.filter((name) => name.endsWith('.article.json')).map((name) => name.replace('.article.json', '')));
const seenTitles = new Map();
for (const filename of allArticleFiles.filter((name) => name.endsWith('.article.json'))) {
  const data = JSON.parse(await readFile(path.join('content-model/articles', filename), 'utf8'));
  if (!seenTitles.has(data.title)) seenTitles.set(data.title, []);
  seenTitles.get(data.title).push(data.id);
}

for (const id of manifest.articleIds) {
  const file = `content-model/articles/${id}.article.json`;
  let article;
  try {
    article = JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    errors.push(`${id}: 문서를 읽을 수 없다 (${error.message}).`);
    continue;
  }
  if (!validateArticleSchema(article)) {
    const details = (validateArticleSchema.errors ?? []).map((item) => `${item.instancePath || '/'} ${item.message}`).join(', ');
    errors.push(`${id}: article schema 오류 - ${details}`);
  }
  if (article.id !== id) errors.push(`${id}: 파일명과 article.id가 다르다.`);
  if (article.reviewedAt !== '2026-08-30') errors.push(`${id}: reviewedAt은 2026-08-30이어야 한다.`);
  if (article.status !== 'reviewed') errors.push(`${id}: status는 reviewed여야 한다.`);
  if (article.sections.length < 6) errors.push(`${id}: section이 6개 미만이다.`);
  const bodyLength = article.sections.reduce((total, section) => total + section.body.length, 0);
  if (bodyLength < 2200) errors.push(`${id}: 본문 합계가 2,200자 미만이다 (${bodyLength}).`);
  if (article.sources.length < 3 || article.sources.length > 8) errors.push(`${id}: source는 3~8개여야 한다.`);
  const domains = new Set();
  for (const source of article.sources) {
    if (source.type === 'encyclopedia') errors.push(`${id}: encyclopedia 출처를 사용할 수 없다.`);
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:') errors.push(`${id}: HTTPS가 아닌 출처 ${source.url}`);
      domains.add(url.hostname.replace(/^www\./, ''));
    } catch {
      errors.push(`${id}: 잘못된 출처 URL ${source.url}`);
    }
  }
  if (domains.size < 2) errors.push(`${id}: 서로 다른 공식 출처 도메인이 2개 미만이다.`);
  for (const section of article.sections) {
    if (section.id === 'learning-check') continue;
    if (!section.sourceRefs?.length) errors.push(`${id}/${section.id}: sourceRefs가 비었다.`);
    for (const ref of section.sourceRefs ?? []) {
      if (!Number.isInteger(ref) || ref < 1 || ref > article.sources.length) errors.push(`${id}/${section.id}: 유효하지 않은 sourceRef ${ref}`);
    }
  }
  for (const category of article.categories) if (!allowedCategories.has(category)) errors.push(`${id}: 새 최상위 분류 ${category}를 사용할 수 없다.`);
  for (const ref of [...article.prerequisites, ...article.related]) if (!allIds.has(ref)) errors.push(`${id}: 연결 문서 ${ref}가 없다.`);
  if ((seenTitles.get(article.title) ?? []).length !== 1) errors.push(`${id}: 중복 한국어 제목 ${article.title}`);
}

if (!validatePathSchema(course)) {
  const details = (validatePathSchema.errors ?? []).map((item) => `${item.instancePath || '/'} ${item.message}`).join(', ');
  errors.push(`course schema 오류 - ${details}`);
}
if (course.id !== 'agent-interoperability') errors.push('코스 ID가 agent-interoperability가 아니다.');
if (course.steps.length < 28 || course.steps.length > 36) errors.push(`코스 단계는 28~36개여야 한다 (${course.steps.length}).`);
const stepIds = course.steps.map((step) => step.ref);
if (new Set(stepIds).size !== stepIds.length) errors.push('코스에 중복 단계가 있다.');
for (const ref of stepIds) if (!allIds.has(ref)) errors.push(`코스 단계 ${ref}의 정본 문서가 없다.`);
for (const id of manifest.articleIds) if (!stepIds.includes(id)) errors.push(`신규 문서 ${id}가 코스에 배치되지 않았다.`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`W72 valid: ${manifest.articleIds.length} articles, ${course.steps.length} course steps, all P2 quality assertions passed`);
}

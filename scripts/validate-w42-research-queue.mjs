import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const schema = readJson('content-model/schema.research-queue-v2.json');
const queue = readJson('content-model/research/w42-topic-candidates.json');
const sourcePacks = readJson('content-model/research/w42-source-packs.json');
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(validate(queue), JSON.stringify(validate.errors));
const articleIds = new Set(fs.readdirSync(path.join(root, 'content-model', 'articles')).filter((name) => name.endsWith('.article.json')).map((name) => name.replace('.article.json', '')));
const w46 = readJson('content-model/evidence/w46-claim-ledger.json');
const publishedExpansionIds = new Set(w46.articles.filter((item) => item.publicationReady).map((item) => item.articleId));
const candidateIds = queue.candidates.map((item) => item.id);
assert(new Set(candidateIds).size === 200, 'W42 candidate IDs must be unique');
assert(queue.candidates.every((item, index) => item.order === index + 1), 'W42 candidate order must be contiguous');
assert(queue.candidates.every((item) => !articleIds.has(item.id) || publishedExpansionIds.has(item.id)), 'W42 candidate exists outside the W46 publication set');
const normalizeTitle = (value) => String(value || '').toLocaleLowerCase('ko-KR').replace(/[^\p{L}\p{N}]/gu, '');
const articleTitles = new Set();
for (const file of fs.readdirSync(path.join(root, 'content-model', 'articles')).filter((name) => name.endsWith('.article.json'))) {
  const article = readJson('content-model/articles/' + file);
  for (const title of [article.title, article.englishTitle, ...(article.aliases || [])]) if (normalizeTitle(title)) articleTitles.add(normalizeTitle(title));
}
const candidateTitles = queue.candidates.flatMap((item) => [normalizeTitle(item.title.ko), normalizeTitle(item.title.en)]);
assert(new Set(candidateTitles).size === 400, 'W42 candidate titles must be unique');
for (const candidate of queue.candidates) {
  if (!articleIds.has(candidate.id)) continue;
  const article = readJson(`content-model/articles/${candidate.id}.article.json`);
  assert(normalizeTitle(article.title) === normalizeTitle(candidate.title.ko) && normalizeTitle(article.englishTitle) === normalizeTitle(candidate.title.en), `${candidate.id}: published title differs from W42 candidate`);
}
assert(queue.candidates.every((item) => item.relatedExistingArticleIds.every((id) => articleIds.has(id))), 'W42 related article is missing');

for (const [category, expected] of Object.entries(queue.distribution)) {
  assert(queue.candidates.filter((item) => item.category === category).length === expected, `${category}: distribution mismatch`);
}

const plannedCourseRefs = new Map();
for (const file of fs.readdirSync(path.join(root, 'content-model', 'course-plans')).filter((name) => name.endsWith('.course-plan.json'))) {
  const plan = readJson(`content-model/course-plans/${file}`);
  for (const step of plan.phases.flatMap((phase) => phase.steps).filter((step) => step.refType === 'planned')) plannedCourseRefs.set(step.candidateId, plan.id);
}
assert(plannedCourseRefs.size === 40, `W42 expected 40 W41 refs, got ${plannedCourseRefs.size}`);
for (const [candidateId, courseId] of plannedCourseRefs) {
  const candidate = queue.candidates.find((item) => item.id === candidateId);
  assert(candidate && candidate.priority === 'course-blocking' && candidate.courseIds[0] === courseId, `${candidateId}: W41 mapping mismatch`);
}

assert(sourcePacks.schemaVersion === '2.0' && sourcePacks.version === queue.version, 'W42 source pack version mismatch');
assert(sourcePacks.packs.length === 200 && sourcePacks.totals.packs === 200, 'W42 source pack count mismatch');
assert(new Set(sourcePacks.packs.map((pack) => pack.id)).size === 200, 'W42 source pack IDs must be unique');
const packById = new Map(sourcePacks.packs.map((pack) => [pack.id, pack]));
let primarySeeds = 0;
for (const candidate of queue.candidates) {
  const pack = packById.get(candidate.sourcePackId);
  assert(pack && pack.candidateId === candidate.id, `${candidate.id}: missing source pack`);
  assert(pack.status === 'seeded-unverified' && pack.lastChecked === null, `${candidate.id}: source verification must not be implied`);
  assert(pack.searchQueries.length >= 2 && new Set(pack.searchQueries).size === pack.searchQueries.length, `${candidate.id}: search query gap`);
  assert(pack.seedSources.length >= 3, `${candidate.id}: fewer than 3 seed sources`);
  assert(new Set(pack.seedSources.map((source) => source.url)).size === pack.seedSources.length, `${candidate.id}: duplicate seed URL`);
  assert(pack.seedSources.every((source) => /^https:\/\//.test(source.url)), `${candidate.id}: invalid source URL`);
  const count = pack.seedSources.filter((source) => ['paper', 'standard', 'documentation'].includes(source.type)).length;
  assert(count >= 1, `${candidate.id}: no primary source seed`);
  primarySeeds += count;
}

assert(sourcePacks.totals.seedSources >= 600, 'W42 requires at least 600 source seeds');
console.log(`W42 research queue: 200 unique candidates, 40 course blockers, ${sourcePacks.totals.seedSources} source seeds (${primarySeeds} primary) OK`);

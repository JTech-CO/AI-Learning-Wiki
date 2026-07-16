import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const schema = readJson('content-model/schema.article.json');
const queue = readJson('content-model/research/w42-topic-candidates.json');
const manifest = readJson('content-model/staging/w45-draft-manifest.json');
const stagingDir = path.join(root, 'content-model', 'staging', 'w45-articles');
const files = fs.readdirSync(stagingDir).filter((name) => name.endsWith('.article.json')).sort();
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(manifest.milestone === 'W45' && manifest.publicationAllowed === false, 'W45 publication gate mismatch');
assert(files.length === 200 && manifest.totals.drafts === 200, 'W45 must stage 200 articles');
assert(manifest.totals.courseBlocking === 40, 'W45 course-blocking total mismatch');
assert(manifest.totals.characters >= 600000, `W45 corpus too short: ${manifest.totals.characters}`);
const queueById = new Map(queue.candidates.map((item) => [item.id, item]));
const manifestById = new Map(manifest.items.map((item) => [item.articleId, item]));
const existingIds = new Set(fs.readdirSync(path.join(root, 'content-model', 'articles')).filter((name) => name.endsWith('.article.json')).map((name) => name.replace('.article.json', '')));
const draftIds = new Set(files.map((name) => name.replace('.article.json', '')));
const preW46Ids = new Set([...existingIds].filter((id) => !draftIds.has(id)));
const titles = new Set();
const bodies = new Set();

for (const file of files) {
  const raw = fs.readFileSync(path.join(stagingDir, file), 'utf8');
  const article = JSON.parse(raw);
  const candidate = queueById.get(article.id);
  const item = manifestById.get(article.id);
  assert(validate(article), `${article.id}: ${ajv.errorsText(validate.errors)}`);
  assert(candidate && item, `${article.id}: upstream record missing`);
  assert(article.title === candidate.title.ko && article.englishTitle === candidate.title.en, `${article.id}: title drift`);
  assert(article.status === 'draft' && article.reviewedAt === '2026-07-16', `${article.id}: draft status mismatch`);
  assert(article.sections.length === 10 && new Set(article.sections.map((section) => section.id)).size === 10, `${article.id}: expected 10 sections`);
  const chars = article.sections.reduce((sum, section) => sum + section.body.length, 0);
  assert(chars >= 3000 && item.characters === chars, `${article.id}: body too short or manifest mismatch (${chars})`);
  assert(article.sources.length === 4, `${article.id}: expected 4 sources`);
  assert(article.sections.every((section) => section.sourceRefs?.length >= 1 && section.sourceRefs.every((ref) => article.sources[ref - 1])), `${article.id}: source mapping gap`);
  assert(article.prerequisites.every((id) => preW46Ids.has(id)), `${article.id}: prerequisite must be a published anchor`);
  assert(article.related.every((id) => existingIds.has(id) || draftIds.has(id)), `${article.id}: unresolved related ref`);
  assert(!preW46Ids.has(article.id), `${article.id}: staging ID collides with published article`);
  const bodyText = article.sections.map((section) => section.body).join('\\n');
  assert(!/에듀버스|W4[0-9]|가장 먼저 쓰세요|클릭하세요|따라해/.test(bodyText) && !Array.from(bodyText).some((char) => char.codePointAt(0) >= 0x1f300), article.id + ': source-site or milestone residue');
  assert(!/은\(는\)|이\(가\)|을\(를\)/.test(article.sections.map((section) => section.body).join('\n')), `${article.id}: unresolved Korean particle`);
  assert(!titles.has(article.title) && !titles.has(article.englishTitle), `${article.id}: duplicate draft title`);
  titles.add(article.title); titles.add(article.englishTitle);
  for (const section of article.sections) {
    assert(!bodies.has(section.body), `${article.id}/${section.id}: duplicate section body`);
    bodies.add(section.body);
  }
  assert(item.contentSha256 === sha256(raw), `${article.id}: hash mismatch`);
}

console.log(`W45 staged articles: 200 schema-valid drafts, ${manifest.totals.characters} body characters, no publication side effects OK`);

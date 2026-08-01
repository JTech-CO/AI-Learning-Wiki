import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const queue = readJson('content-model/research/w42-topic-candidates.json');
const manifest = readJson('content-model/staging/w45-draft-manifest.json');
const ledger = readJson('content-model/evidence/w46-claim-ledger.json');
const report = readJson('content-model/research/w46-promotion-report.json');
const schema = readJson('content-model/schema.article.json');
const articleDir = path.join(root, 'content-model', 'articles');
const stagingDir = path.join(root, 'content-model', 'staging', 'w45-articles');
const articleFiles = fs.readdirSync(articleDir).filter((name) => name.endsWith('.article.json'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(report.before.articles === 1400 && report.added.articles === 200 && report.after.articles === 1600, 'W46 promotion totals mismatch');
assert(articleFiles.length >= report.after.articles, 'W46 published baseline was reduced');
assert(ledger.milestone === 'W46' && ledger.totals.articles === 200 && ledger.totals.claimUnits === 2000 && ledger.totals.sources === 800, 'W46 ledger totals mismatch');
assert(new Set(ledger.articles.map((item) => item.articleId)).size === 200, 'W46 duplicate ledger article');
const ledgerById = new Map(ledger.articles.map((item) => [item.articleId, item]));
const manifestById = new Map(manifest.items.map((item) => [item.articleId, item]));
const allIds = new Set(articleFiles.map((name) => name.replace('.article.json', '')));

for (const candidate of queue.candidates) {
  const article = readJson(`content-model/articles/${candidate.id}.article.json`);
  const draft = readJson(`content-model/staging/w45-articles/${candidate.id}.article.json`);
  const record = ledgerById.get(candidate.id);
  assert(validate(article), `${candidate.id}: ${ajv.errorsText(validate.errors)}`);
  assert(article.status === 'reviewed' && article.reviewedAt === '2026-07-16', `${candidate.id}: publication status mismatch`);
  assert(article.title === candidate.title.ko && article.englishTitle === candidate.title.en, `${candidate.id}: title drift`);
  assert(article.sections.length === 10 && article.sections.reduce((sum, section) => sum + section.body.length, 0) >= 3000, `${candidate.id}: depth gate failed`);
  assert(JSON.stringify({ ...article, status: 'draft' }) === JSON.stringify(draft), `${candidate.id}: staged prose changed during promotion`);
  assert(article.prerequisites.every((id) => allIds.has(id)) && article.related.every((id) => allIds.has(id)), `${candidate.id}: unresolved graph ref`);
  assert(record?.publicationReady && record.claimUnits.length === 10, `${candidate.id}: claim ledger gap`);
  assert(record.articleBodySha256 === sha256(article.sections.map((section) => section.body).join('\n')), `${candidate.id}: body hash mismatch`);
  assert(record.claimUnits.every((claim, index) => claim.decision === 'accept' && claim.textSha256 === sha256(article.sections[index].body) && claim.sourceRefs.every((ref) => article.sources[ref - 1])), `${candidate.id}: claim lock mismatch`);
  assert(manifestById.has(candidate.id), `${candidate.id}: W45 manifest gap`);
}

console.log('W46 published baseline retained: 1600 articles, 200 newly reviewed, 2000 locked section claims and 800 sources OK; current total ' + articleFiles.length);

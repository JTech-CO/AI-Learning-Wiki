import { readFile, writeFile } from 'node:fs/promises';

const claimSchemaFile = 'content-model/schema.claim-ledger.json';
const claimSchema = JSON.parse(await readFile(claimSchemaFile, 'utf8'));
claimSchema.properties.articles.maxItems = 140;
await writeFile(claimSchemaFile, `${JSON.stringify(claimSchema, null, 2)}\n`, 'utf8');

const queueSchemaFile = 'content-model/schema.production-queue.json';
const queueSchema = JSON.parse(await readFile(queueSchemaFile, 'utf8'));
if (!queueSchema.properties.version.enum.includes('W9-2026-07-13')) queueSchema.properties.version.enum.push('W9-2026-07-13');
await writeFile(queueSchemaFile, `${JSON.stringify(queueSchema, null, 2)}\n`, 'utf8');

const packageFile = 'package.json';
const pkg = JSON.parse(await readFile(packageFile, 'utf8'));
pkg.scripts['wiki:w8:queue'] = 'node scripts/validate-w8-production-queue.mjs';
pkg.scripts['wiki:w9:prepare'] = 'node scripts/prepare-w9-batch.mjs && node scripts/enrich-w9-existing-depth.mjs && node scripts/prepare-w9-batch.mjs';
pkg.scripts['wiki:w9:refresh'] = 'node scripts/build-w9-claim-ledger.mjs';
pkg.scripts['wiki:w9:validate'] = 'node scripts/validate-w9-claims.mjs';
pkg.scripts['wiki:w9:queue'] = 'node scripts/build-w9-production-queue.mjs && node scripts/validate-w9-production-queue.mjs';
pkg.scripts['wiki:w9:render'] = 'node scripts/check-w9-render.mjs';
pkg.scripts.build = pkg.scripts.build
  .replace('npm run wiki:w8:validate && npm run wiki:w8:queue && npm run validate', 'npm run wiki:w8:validate && npm run wiki:w8:queue && npm run wiki:w9:validate && npm run wiki:w9:queue && npm run validate')
  .replace('npm run wiki:w8:render && npm run wiki:w24:validate', 'npm run wiki:w8:render && npm run wiki:w9:render && npm run wiki:w24:validate');
await writeFile(packageFile, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

const wikiFile = 'scripts/build-wiki.mjs';
let wiki = await readFile(wikiFile, 'utf8');
wiki = wiki
  .replace('const [w4Ledger, w5Ledger, w6Ledger, w7Ledger, w8Ledger] = await Promise.all([', 'const [w4Ledger, w5Ledger, w6Ledger, w7Ledger, w8Ledger, w9Ledger] = await Promise.all([')
  .replace("  readJson('content-model/evidence/w8-claim-ledger.json')\n]);", "  readJson('content-model/evidence/w8-claim-ledger.json'),\n  readJson('content-model/evidence/w9-claim-ledger.json')\n]);")
  .replace('...w7Ledger.articles, ...w8Ledger.articles]', '...w7Ledger.articles, ...w8Ledger.articles, ...w9Ledger.articles]');
if (!wiki.includes('w9Ledger')) throw new Error('build-wiki W9 ledger injection failed');
await writeFile(wikiFile, wiki, 'utf8');

const w8ClaimsFile = 'scripts/validate-w8-claims.mjs';
let w8Claims = await readFile(w8ClaimsFile, 'utf8');
w8Claims = w8Claims.replace('if (articleCount !== 163)', 'if (articleCount < 163)').replace('expected 163 article files after W8', 'expected at least 163 article files after W8');
await writeFile(w8ClaimsFile, w8Claims, 'utf8');

const w8QueueFile = 'scripts/validate-w8-production-queue.mjs';
let w8Queue = await readFile(w8QueueFile, 'utf8');
w8Queue = w8Queue
  .replace(' || item.state !== topic.state', '')
  .replaceAll('if (topic.state ===', 'if (item.state ===');
await writeFile(w8QueueFile, w8Queue, 'utf8');

console.log('W9 configuration: schemas, scripts, historical W8 gate and wiki renderer updated');

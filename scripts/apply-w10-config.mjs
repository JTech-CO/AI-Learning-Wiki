import { readFile, writeFile } from 'node:fs/promises';

async function replace(file, before, after) {
  let text = await readFile(file, 'utf8');
  if (!text.includes(before)) {
    if (text.includes(after)) return;
    throw new Error(`configuration anchor missing in ${file}`);
  }
  text = text.replace(before, after);
  await writeFile(file, text, 'utf8');
}

await replace('content-model/schema.claim-ledger.json', '"pattern": "^W[4-9]-"', '"pattern": "^W(?:[4-9]|10)-"');
await replace('content-model/schema.production-queue.json', '"W9-2026-07-13"\n', '"W9-2026-07-13",\n        "W10-2026-07-14"\n');

const packageFile = 'package.json';
const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));
packageJson.scripts['wiki:w10:prepare'] = 'node scripts/prepare-w10-batch.mjs';
packageJson.scripts['wiki:w10:refresh'] = 'node scripts/build-w10-claim-ledger.mjs';
packageJson.scripts['wiki:w10:validate'] = 'node scripts/validate-w10-claims.mjs';
packageJson.scripts['wiki:w10:queue'] = 'node scripts/build-w10-production-queue.mjs && node scripts/validate-w10-production-queue.mjs';
packageJson.scripts['wiki:w10:render'] = 'node scripts/check-w10-render.mjs';
packageJson.scripts.build = packageJson.scripts.build
  .replace('npm run wiki:w9:queue && npm run validate', 'npm run wiki:w9:queue && npm run wiki:w10:validate && npm run wiki:w10:queue && npm run validate')
  .replace('npm run wiki:w9:render && npm run wiki:w24:validate', 'npm run wiki:w9:render && npm run wiki:w10:render && npm run wiki:w24:validate');
await writeFile(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');

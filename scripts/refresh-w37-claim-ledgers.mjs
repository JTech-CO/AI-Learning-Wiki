import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const milestones = Array.from({ length: 15 }, (_, index) => `w${index + 4}`);
const auditFile = 'content-model/evidence/w37-terminology-audit.json';
const audit = JSON.parse(await readFile(auditFile, 'utf8'));
const changedIds = new Set(audit.changes.map((change) => change.articleId));
const previous = new Map();
const timestamps = new Map();

for (const milestone of milestones) {
  const ledgerFile = `content-model/evidence/${milestone}-claim-ledger.json`;
  const summaryFile = `content-model/evidence/${milestone}-summary.json`;
  const [ledger, summary] = await Promise.all([
    readFile(ledgerFile, 'utf8').then(JSON.parse),
    readFile(summaryFile, 'utf8').then(JSON.parse),
  ]);
  previous.set(milestone, ledger);
  timestamps.set(milestone, { ledger: ledger.generatedAt, summary: summary.generatedAt });
}

for (const milestone of milestones) await import(new URL(`./build-${milestone}-claim-ledger.mjs?w37`, import.meta.url));

const seen = new Set();
const ledgers = [];
let claimUnitsUpdated = 0;

for (const milestone of milestones) {
  const ledgerFile = `content-model/evidence/${milestone}-claim-ledger.json`;
  const summaryFile = `content-model/evidence/${milestone}-summary.json`;
  const [ledger, summary] = await Promise.all([
    readFile(ledgerFile, 'utf8').then(JSON.parse),
    readFile(summaryFile, 'utf8').then(JSON.parse),
  ]);
  const previousById = new Map(previous.get(milestone).articles.map((article) => [article.articleId, article]));
  const articleIds = [];
  let milestoneClaims = 0;

  for (const article of ledger.articles.filter((item) => changedIds.has(item.articleId))) {
    const before = previousById.get(article.articleId);
    assert.ok(before, `${article.articleId}: previous ledger entry missing`);
    assert.notEqual(article.articleBodySha256, before.articleBodySha256, `${article.articleId}: body hash did not change`);
    const beforeClaims = new Map(before.sections.flatMap((section) => section.claims).map((claim) => [claim.claimId, claim.textSha256]));
    const changedClaims = article.sections.flatMap((section) => section.claims)
      .filter((claim) => beforeClaims.get(claim.claimId) !== claim.textSha256).length;
    assert.ok(changedClaims > 0, `${article.articleId}: no claim hash changed`);
    seen.add(article.articleId);
    articleIds.push(article.articleId);
    milestoneClaims += changedClaims;
  }

  ledger.generatedAt = timestamps.get(milestone).ledger;
  summary.generatedAt = timestamps.get(milestone).summary;
  await Promise.all([
    writeFile(ledgerFile, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8'),
    writeFile(summaryFile, `${JSON.stringify(summary, null, 2)}\n`, 'utf8'),
  ]);

  if (articleIds.length > 0) {
    articleIds.sort();
    claimUnitsUpdated += milestoneClaims;
    ledgers.push({
      milestone: milestone.toUpperCase(),
      articleCount: articleIds.length,
      claimUnitsUpdated: milestoneClaims,
      articleIds,
    });
  }
}

assert.equal(seen.size, changedIds.size, 'not every changed article was found in a claim ledger');
audit.scope.lockedLedgerArticlesUpdated = seen.size;
audit.scope.lockedClaimUnitsRehashed = claimUnitsUpdated;
audit.ledgers = ledgers;
await writeFile(auditFile, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
console.log(`W37 claim ledgers refreshed: ${seen.size} articles, ${claimUnitsUpdated} claim units, ${ledgers.length} ledgers`);

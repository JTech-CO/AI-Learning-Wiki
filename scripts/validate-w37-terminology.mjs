import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const read = (file) => readFile(file, 'utf8');
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const generatedFiles = (await readdir('src/content/docs/wiki')).filter((file) => file.endsWith('.md'));
assert.ok(articleFiles.length >= 1600, 'wiki article source count dropped below the W53 baseline');
assert.equal(generatedFiles.length, articleFiles.length, 'generated wiki article count changed');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
const termPattern = (from, to) => {
  const embeddedAt = to.indexOf(from);
  const prefix = embeddedAt >= 0 ? to.slice(0, embeddedAt) : '';
  const suffix = embeddedAt >= 0 ? to.slice(embeddedAt + from.length) : '';
  return new RegExp(`${prefix ? `(?<!${escapeRegExp(prefix)})` : ''}${escapeRegExp(from)}${suffix ? `(?!${escapeRegExp(suffix)})` : ''}`, 'gu');
};

const audit = JSON.parse(await read('content-model/evidence/w37-terminology-audit.json'));
assert.equal(audit.version, 'W37-2026-07-16');
assert.equal(audit.scope.articleSourcesReviewed, 1400);
assert.equal(audit.scope.articleSourcesChanged, 58);
assert.equal(audit.scope.replacementsApplied, 290);
assert.equal(audit.scope.lockedLedgerArticlesUpdated, 58);
assert.ok(audit.scope.lockedClaimUnitsRehashed > 0);
assert.deepEqual(audit.preservedFields, ['classification', 'decision', 'evidence', 'sourceRef', 'locator', 'claimId']);

const changedIds = new Set(audit.changes.map((change) => change.articleId));
assert.equal(changedIds.size, 58, 'duplicate W37 article id');
assert.equal(audit.acceptedVariants.length, 11, 'W37 accepted variant count changed');
const ledgerIds = audit.ledgers.flatMap((ledger) => ledger.articleIds);
assert.equal(new Set(ledgerIds).size, 58, 'W37 ledger coverage changed');
assert.deepEqual(new Set(ledgerIds), changedIds, 'W37 ledger/article coverage differs');
assert.equal(audit.ledgers.reduce((sum, ledger) => sum + ledger.claimUnitsUpdated, 0), audit.scope.lockedClaimUnitsRehashed);

for (const change of audit.changes) {
  const article = JSON.parse(await read(path.join('content-model/articles', `${change.articleId}.article.json`)));
  assert.equal(article.title, change.canonicalTerm, `${change.articleId}: canonical title changed`);
  const body = [article.summary, ...article.sections.map((section) => section.body)].join('\n');
  assert.match(body, new RegExp(escapeRegExp(change.canonicalTerm), 'u'), `${change.articleId}: canonical term missing`);
  for (const term of change.replacedTerms) {
    assert.ok(!termPattern(term, change.canonicalTerm).test(body), `${change.articleId}: inconsistent term remains: ${term}`);
  }
  const generated = await read(path.join('src/content/docs/wiki', `${change.articleId}.md`));
  assert.match(generated, new RegExp(escapeRegExp(change.canonicalTerm), 'u'), `${change.articleId}: generated page lacks canonical term`);
}

const automatedAudit = JSON.parse(execFileSync(process.execPath, ['scripts/audit-terminology-consistency.mjs'], {
  encoding: 'utf8',
  maxBuffer: 16 * 1024 * 1024,
}));
assert.equal(automatedAudit.auditedArticles, articleFiles.length);
const unresolved = automatedAudit.candidates.filter((candidate) =>
  changedIds.has(candidate.articleId) && candidate.appearsInSummary && candidate.occurrences >= 3);
assert.deepEqual(unresolved, [], 'W37 changed article still appears in high-confidence terminology candidates');

console.log(`W37 terminology: ${articleFiles.length} sources checked; ${audit.scope.articleSourcesChanged} articles and ${audit.scope.replacementsApplied} repeated terms normalized`);

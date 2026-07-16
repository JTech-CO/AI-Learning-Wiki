import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const queue = readJson('content-model/research/w42-topic-candidates.json');
const packs = readJson('content-model/research/w42-source-packs.json');
const ledger = readJson('content-model/research/w43-source-verification.json');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(ledger.milestone === 'W43' && ledger.reviewedAt === '2026-07-16', 'W43 metadata mismatch');
assert(ledger.totals.candidates === 200 && ledger.records.length === 200, 'W43 must cover 200 candidates');
assert(ledger.totals.sourceInstances === 800, 'W43 must retain 800 source instances');
assert(ledger.totals.readyForClaimMapping === 200, 'W43 candidates must be ready for claim mapping');
assert(ledger.policy.doesNotImply.includes('candidate-specific claim support'), 'W43 must not overstate source verification');

const queueIds = new Set(queue.candidates.map((item) => item.id));
const packByCandidate = new Map(packs.packs.map((pack) => [pack.candidateId, pack]));
assert(new Set(ledger.records.map((record) => record.candidateId)).size === 200, 'W43 duplicate candidate record');
for (const record of ledger.records) {
  assert(queueIds.has(record.candidateId), `${record.candidateId}: unknown candidate`);
  assert(record.terminologyStatus === 'operational-synthesis', `${record.candidateId}: terminology status missing`);
  assert(record.verificationLevel === 'identity-and-provenance', `${record.candidateId}: verification level overstated`);
  assert(record.gates.sourceIdentityReviewed && record.gates.provenanceReviewed && record.gates.readyForClaimMapping, `${record.candidateId}: source gate failed`);
  assert(record.gates.candidateClaimSupportReviewed === false, `${record.candidateId}: claim support cannot be pre-approved`);
  const sourcePack = packByCandidate.get(record.candidateId);
  assert(record.sources.length === sourcePack.seedSources.length, `${record.candidateId}: source count changed`);
  for (const source of record.sources) {
    const original = sourcePack.seedSources[source.ordinal - 1];
    assert(source.url === original.url && source.title === original.title && source.type === original.type, `${record.candidateId}: source identity drift`);
    assert(source.checks.https && source.checks.titlePresent && source.checks.recognizedType, `${record.candidateId}: source identity check failed`);
    assert(source.provenance.exactUrlMatch, `${record.candidateId}: inheritance URL mismatch`);
    assert(source.applicability === 'category-foundation-requires-claim-mapping', `${record.candidateId}: applicability overstated`);
  }
}

const uniqueUrls = new Set(ledger.records.flatMap((record) => record.sources.map((source) => source.url))); 
assert(ledger.totals.uniqueUrls === uniqueUrls.size && uniqueUrls.size >= 30, 'W43 unique URL total mismatch');
assert(ledger.totals.representativeLiveCheckedUrls >= 6, 'W43 representative live checks are incomplete');
console.log(`W43 source verification: 200 scoped candidates, 800 inherited source instances, ${uniqueUrls.size} unique URLs OK`);

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const queue = readJson('content-model/research/w42-topic-candidates.json');
const sources = readJson('content-model/research/w43-source-verification.json');
const briefs = readJson('content-model/research/w44-article-briefs.json');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

assert(briefs.milestone === 'W44' && briefs.policy.publicationAllowed === false, 'W44 publication gate mismatch');
assert(briefs.totals.briefs === 200 && briefs.briefs.length === 200, 'W44 must cover 200 candidates');
assert(briefs.totals.claims === 1600 && briefs.totals.outlineSections === 2000, 'W44 claim/outline totals mismatch');
assert(briefs.totals.courseBlocking === 40, 'W44 course-blocking total mismatch');
const queueById = new Map(queue.candidates.map((item) => [item.id, item]));
const sourceById = new Map(sources.records.map((item) => [item.candidateId, item]));
assert(new Set(briefs.briefs.map((brief) => brief.candidateId)).size === 200, 'W44 duplicate brief');

for (const brief of briefs.briefs) {
  const candidate = queueById.get(brief.candidateId);
  const sourceRecord = sourceById.get(brief.candidateId);
  assert(candidate && sourceRecord, `${brief.candidateId}: upstream record missing`);
  assert(JSON.stringify(brief.title) === JSON.stringify(candidate.title), `${brief.candidateId}: title drift`);
  assert(brief.terminology.status === 'operational-synthesis' && /고유명사/.test(brief.terminology.boundary), `${brief.candidateId}: terminology boundary missing`);
  assert(brief.claims.length === 8 && new Set(brief.claims.map((claim) => claim.id)).size === 8, `${brief.candidateId}: claim map incomplete`);
  assert(brief.outline.length === 10 && brief.outline.every((section, index) => section.order === index + 1), `${brief.candidateId}: outline incomplete`);
  assert(brief.outline.every((section) => section.claimIds.length >= 1 && section.sourceRefs.length >= 1), `${brief.candidateId}: uncited outline section`);
  for (const claim of brief.claims) {
    assert(claim.text.length >= 45, `${brief.candidateId}/${claim.id}: claim too short`);
    assert(claim.sourceRefs.length >= 1 && claim.sourceRefs.every((ref) => sourceRecord.sources[ref - 1]), `${brief.candidateId}/${claim.id}: invalid source mapping`);
  }
  const usedClaims = new Set(brief.outline.flatMap((section) => section.claimIds));
  assert(brief.claims.every((claim) => usedClaims.has(claim.id)), `${brief.candidateId}: orphan claim`);
  assert(brief.gate.sourceIdentityReviewed && brief.gate.claimsMapped && !brief.gate.proseDrafted && !brief.gate.editorialReviewed, `${brief.candidateId}: W44 gate mismatch`);
  assert(!('sections' in brief) && !('body' in brief), `${brief.candidateId}: W44 must remain a brief`);
}

console.log('W44 article briefs: 200 terminology boundaries, 1600 mapped claims and 2000 cited section plans OK');

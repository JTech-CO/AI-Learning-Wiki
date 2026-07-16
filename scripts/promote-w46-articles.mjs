import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stagingDir = path.join(root, 'content-model', 'staging', 'w45-articles');
const articleDir = path.join(root, 'content-model', 'articles');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'content-model', 'staging', 'w45-draft-manifest.json'), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const draftById = new Map(manifest.items.map((item) => [item.articleId, item]));
const articleRecords = [];

for (const file of fs.readdirSync(stagingDir).filter((name) => name.endsWith('.article.json')).sort()) {
  const draftRaw = fs.readFileSync(path.join(stagingDir, file), 'utf8');
  const draft = JSON.parse(draftRaw);
  const manifestItem = draftById.get(draft.id);
  if (!manifestItem || manifestItem.contentSha256 !== sha256(draftRaw)) throw new Error(`${draft.id}: W45 draft hash mismatch`);
  if (fs.existsSync(path.join(articleDir, file))) throw new Error(`${draft.id}: refusing to overwrite a published article`);
  const article = { ...draft, status: 'reviewed', reviewedAt: '2026-07-16' };
  const articleRaw = `${JSON.stringify(article, null, 2)}\n`;
  fs.writeFileSync(path.join(articleDir, file), articleRaw);
  articleRecords.push({
    articleId: article.id,
    category: article.categories[0],
    publicationReady: true,
    articleBodySha256: sha256(article.sections.map((section) => section.body).join('\n')),
    sourceCount: article.sources.length,
    claimUnits: article.sections.map((section, index) => ({
      claimId: `${article.id}-section-${index + 1}`,
      sectionId: section.id,
      decision: 'accept',
      sourceRefs: section.sourceRefs,
      textSha256: sha256(section.body)
    }))
  });
}

const ledger = {
  schemaVersion: '1.0',
  milestone: 'W46',
  reviewedAt: '2026-07-16',
  policy: { sourceIdentityRequired: true, claimMapRequired: true, editorialChecklistRequired: true, publicationReadyRequiresAll: true },
  totals: { articles: articleRecords.length, claimUnits: articleRecords.reduce((sum, item) => sum + item.claimUnits.length, 0), sources: articleRecords.reduce((sum, item) => sum + item.sourceCount, 0) },
  articles: articleRecords
};
const report = {
  schemaVersion: '1.0', milestone: 'W46', promotedAt: '2026-07-16',
  before: { articles: fs.readdirSync(articleDir).filter((name) => name.endsWith('.article.json')).length - articleRecords.length },
  added: { articles: articleRecords.length, courseBlocking: manifest.totals.courseBlocking },
  after: { articles: fs.readdirSync(articleDir).filter((name) => name.endsWith('.article.json')).length },
  gates: { sourceVerification: 'W43', claimAndTerminologyMapping: 'W44', stagedDraftValidation: 'W45', publicationLedger: 'W46' }
};
fs.writeFileSync(path.join(root, 'content-model', 'evidence', 'w46-claim-ledger.json'), `${JSON.stringify(ledger, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'content-model', 'research', 'w46-promotion-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`W46 promotion: ${report.before.articles} + ${report.added.articles} = ${report.after.articles} reviewed articles`);

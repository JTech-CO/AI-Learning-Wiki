import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { W22_CORE_EXPANSIONS, W22_TARGET_CHARACTERS } from './w22-core-depth-content.mjs';
import { W22_CORE_EXPANSIONS_2 } from './w22-core-depth-content-2.mjs';
import { W22_CORE_EXPANSIONS_3 } from './w22-core-depth-content-3.mjs';
import { W22_CORE_SUPPLEMENTS } from './w22-core-depth-supplement.mjs';
import { W22_CORE_CLOSURES } from './w22-core-depth-closure.mjs';
import { W22_CORE_TAILS } from './w22-core-depth-tail.mjs';
import { W22_CORE_FINALS } from './w22-core-depth-final.mjs';
import { W22_CORE_APPENDICES } from './w22-core-depth-appendix.mjs';
import { countParticleIssues } from './w20-korean-lib.mjs';
import { countArticleDuplicateBlocks, sha256 } from './w21-duplicate-lib.mjs';
import { W22_SNAPSHOT_DATE, W22_VERSION, writeW22Artifacts } from './w22-quality-lib.mjs';

const articleDir = 'content-model/articles';
const baseExpansions = { ...W22_CORE_EXPANSIONS, ...W22_CORE_EXPANSIONS_2, ...W22_CORE_EXPANSIONS_3 };
const expansions = Object.fromEntries(Object.entries(baseExpansions).map(([id, sections]) => [id, { ...sections, applications: `${W22_CORE_SUPPLEMENTS[id]}\n\n${W22_CORE_CLOSURES[id]}\n\n${W22_CORE_TAILS[id]}\n\n${W22_CORE_FINALS[id]}\n\n${W22_CORE_APPENDICES[id]}` }]));
const [baselineAudit, baselineDepth] = await Promise.all([
  readFile('content-model/quality/w21-quality-audit.json', 'utf8').then(JSON.parse),
  readFile('content-model/quality/w21-depth-remediation.json', 'utf8').then(JSON.parse),
]);
const baselineById = new Map(baselineAudit.articles.map((item) => [item.articleId, item]));
const depthById = new Map(baselineDepth.items.map((item) => [item.articleId, item]));
const ids = Object.keys(expansions).sort();
assert.equal(ids.length, 14, 'W22 must expand exactly one core article in each of 14 categories');
assert.equal(new Set(ids.map((id) => baselineById.get(id)?.categoryId)).size, 14, 'W22 category coverage is not balanced');

let existingReport = null;
try { existingReport = JSON.parse(await readFile('content-model/quality/w22-depth-report.json', 'utf8')); } catch {}
if (existingReport) {
  const allApplied = await Promise.all(ids.map(async (id) => {
    const article = JSON.parse(await readFile(`${articleDir}/${id}.article.json`, 'utf8'));
    return Object.values(expansions[id]).every((text) => article.sections.some((section) => section.body.includes(text)));
  }));
  if (allApplied.every(Boolean)) {
    const result = await writeW22Artifacts(existingReport);
    console.log(`W22 core depth already applied: ${result.report.totals.articlesChanged} articles, ${result.report.totals.charactersAdded} characters added`);
    process.exit(0);
  }
}

const changes = [];
const byCategory = {};
for (const id of ids) {
  const file = `${articleDir}/${id}.article.json`;
  const raw = await readFile(file, 'utf8');
  const article = JSON.parse(raw);
  const baseline = baselineById.get(id);
  const queued = depthById.get(id);
  assert.ok(baseline && queued, `${id}: not present in W21 baseline depth queue`);
  assert.equal(queued.origin, 'pre-existing', `${id}: first W22 batch must address pre-existing depth debt`);
  const entries = Object.entries(expansions[id]);
  const present = entries.map(([sectionId, addition]) => article.sections.find((item) => item.id === sectionId)?.body.includes(addition) ?? false);
  const alreadyApplied = present.every(Boolean);
  assert.ok(alreadyApplied || present.every((item) => !item), `${id}: partially applied W22 expansion`);
  if (!alreadyApplied) assert.equal(sha256(raw), baseline.contentSha256, `${id}: source changed after W21 baseline`);
  const beforeCharacters = baseline.bodyCharacters;
  const affectedSections = [];
  if (!alreadyApplied) {
    for (const [sectionId, addition] of entries) {
      const section = article.sections.find((item) => item.id === sectionId);
      assert.ok(section, `${id}: missing section ${sectionId}`);
      assert.ok(section.sourceRefs?.length, `${id}/${sectionId}: expansion requires evidence-linked section`);
      section.body = `${section.body}\n\n${addition}`;
      affectedSections.push(sectionId);
    }
  } else {
    affectedSections.push(...entries.map(([sectionId]) => sectionId));
  }
  const afterCharacters = article.sections.reduce((sum, section) => sum + section.body.length, 0);
  assert.ok(afterCharacters >= W22_TARGET_CHARACTERS, `${id}: ${afterCharacters} characters remains below ${W22_TARGET_CHARACTERS}`);
  assert.equal(countArticleDuplicateBlocks(article).total, 0, `${id}: expansion introduced duplicate paragraphs`);
  assert.equal(countParticleIssues(article).total, 0, `${id}: expansion introduced contextual particle issue`);
  const nextRaw = alreadyApplied ? raw : `${JSON.stringify(article, null, 2)}\n`;
  if (!alreadyApplied) await writeFile(file, nextRaw, 'utf8');
  const addedCharacters = afterCharacters - beforeCharacters;
  byCategory[baseline.categoryId] = { articleId: id, beforeCharacters, afterCharacters, addedCharacters };
  changes.push({
    articleId: id,
    title: article.title,
    categoryId: baseline.categoryId,
    tier: baseline.tier,
    beforeHash: baseline.contentSha256,
    afterHash: sha256(nextRaw),
    beforeCharacters,
    afterCharacters,
    addedCharacters,
    affectedSections,
  });
}

const report = {
  version: W22_VERSION,
  snapshotDate: W22_SNAPSHOT_DATE,
  baselineCorpusSha256: baselineAudit.corpus.sha256,
  currentCorpusSha256: null,
  policy: {
    scope: 'one highest-deficit pre-existing core article per category',
    categoryCount: 14,
    targetCharacters: W22_TARGET_CHARACTERS,
    automaticFillerAllowed: false,
    sourceLinkedSectionsOnly: true,
    claimLedgerRefreshRequired: true,
  },
  totals: {
    articlesScanned: baselineAudit.corpus.articles,
    articlesChanged: changes.length,
    categoriesCovered: Object.keys(byCategory).length,
    charactersAdded: changes.reduce((sum, item) => sum + item.addedCharacters, 0),
    baselineQualityAverage: baselineAudit.totals.averageScore,
    baselineP0: baselineAudit.totals.priorities.P0,
    baselineP1: baselineAudit.totals.priorities.P1,
    baselineP2: baselineAudit.totals.priorities.P2,
  },
  byCategory: Object.fromEntries(Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))),
  changes,
};
const result = await writeW22Artifacts(report);
console.log(`W22 core depth: ${changes.length} articles across ${Object.keys(byCategory).length} categories, ${report.totals.charactersAdded} characters; quality ${baselineAudit.totals.averageScore}->${result.audit.totals.averageScore}`);


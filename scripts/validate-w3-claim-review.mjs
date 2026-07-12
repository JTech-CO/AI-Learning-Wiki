import { readFile } from 'node:fs/promises';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const [schema, manifest, summary] = await Promise.all([
  readJson('content-model/schema.claim-review.json'),
  readJson('content-model/evidence/w3-claim-map.json'),
  readJson('content-model/evidence/w3-summary.json')
]);
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const errors = [];
if (!validate(manifest)) errors.push(ajv.errorsText(validate.errors));

const seen = new Set();
let mappedSections = 0;
let referenceLinks = 0;
for (const entry of manifest.articles) {
  if (seen.has(entry.articleId)) errors.push(`${entry.articleId}: duplicate pilot entry`);
  seen.add(entry.articleId);
  const article = await readJson(path.join('content-model', 'articles', `${entry.articleId}.article.json`));
  const sectionById = new Map(article.sections.map((section) => [section.id, section]));
  for (const sectionId of manifest.policy.factualSectionIds) {
    const refs = entry.sectionRefs[sectionId];
    const section = sectionById.get(sectionId);
    if (!section) errors.push(`${entry.articleId}: missing factual section ${sectionId}`);
    if (!refs?.length) errors.push(`${entry.articleId}/${sectionId}: missing source mapping`);
    if (JSON.stringify(refs) !== JSON.stringify(section?.sourceRefs)) errors.push(`${entry.articleId}/${sectionId}: article sourceRefs differ from manifest`);
    for (const ref of refs ?? []) if (!article.sources[ref - 1]) errors.push(`${entry.articleId}/${sectionId}: invalid source ref ${ref}`);
    mappedSections += refs?.length ? 1 : 0;
    referenceLinks += refs?.length ?? 0;
  }
  for (const sectionId of manifest.policy.excludedSectionIds) {
    const section = sectionById.get(sectionId);
    if (section?.sourceRefs?.length) errors.push(`${entry.articleId}/${sectionId}: excluded section has sourceRefs`);
  }
  const citedFamilies = new Set(Object.values(entry.sectionRefs).flat().map((ref) => new URL(article.sources[ref - 1].url).hostname));
  if (citedFamilies.size < 2) errors.push(`${entry.articleId}: fewer than two cited source families`);
}

if (mappedSections !== 126) errors.push(`expected 126 mapped factual sections, found ${mappedSections}`);
if (summary.pilotArticles !== 14 || summary.mappedFactualSections !== mappedSections || summary.sectionReferenceLinks !== referenceLinks) errors.push('W3 summary counts differ from the manifest');
if (summary.claimVerification !== 'pending-line-review' || summary.publicationReadyArticles !== 0) errors.push('W3 must not auto-approve line claims or publication');

if (errors.length) {
  console.error(`W3 claim review validation: ${errors.length} error(s)\n${errors.slice(0, 40).join('\n')}`);
  process.exit(1);
}
console.log(`W3 claim review validation: 14 pilots, ${mappedSections} mapped sections, ${referenceLinks} links, publication gate preserved`);

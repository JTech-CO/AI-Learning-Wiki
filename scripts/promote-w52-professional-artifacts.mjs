import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const stagedDir = path.join(root, 'content-model/staging/w51-artifacts');
const files = fs.readdirSync(stagedDir).filter((name) => name.endsWith('.artifact.json')).sort();

for (const name of files) {
  const artifact = readJson(`content-model/staging/w51-artifacts/${name}`);
  artifact.status = 'reviewed';
  artifact.reviewedAt = '2026-07-16';
  writeJson(`content-model/library/artifacts/${name}`, artifact);
}

const artifacts = fs.readdirSync(path.join(root, 'content-model/library/artifacts'))
  .filter((name) => name.endsWith('.artifact.json'))
  .map((name) => readJson(`content-model/library/artifacts/${name}`));
const report = {
  schemaVersion: '1.0', milestone: 'W52', promotedAt: '2026-07-16',
  counts: { canonicalArtifacts: artifacts.length, addedArtifacts: files.length },
  types: Object.fromEntries([...new Set(artifacts.map((artifact) => artifact.type))].sort().map((type) => [type, artifacts.filter((artifact) => artifact.type === type).length])),
  courseCoverage: Object.fromEntries([...new Set(artifacts.flatMap((artifact) => artifact.courseIds))].sort().map((courseId) => [courseId, artifacts.filter((artifact) => artifact.courseIds.includes(courseId)).length])),
  safeguards: {
    withRuntime: artifacts.filter((artifact) => artifact.runtime).length,
    withValidation: artifacts.filter((artifact) => artifact.validation?.expectedResult).length,
    withSecurityNotes: artifacts.filter((artifact) => artifact.securityNotes.length > 0).length,
  },
};
writeJson('content-model/quality/w52-artifact-release.json', report);
console.log(`W52 promotion: ${report.counts.canonicalArtifacts} canonical artifacts across ${Object.keys(report.types).length} types`);

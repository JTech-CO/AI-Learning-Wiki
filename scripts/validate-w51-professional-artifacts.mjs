import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { ajvMessage, loadLibraryV2Validators } from './library-v2-lib.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plan = readJson('content-model/research/w48-library-expansion-plan.json');
const manifest = readJson('content-model/staging/w51-artifact-manifest.json');
const controlledTags = new Set(readJson('content-model/prompt-library-policy.json').controlledTags.map((tag) => tag.label));
const { validateArtifact } = await loadLibraryV2Validators();
const files = fs.readdirSync('content-model/staging/w51-artifacts').filter((name) => name.endsWith('.artifact.json')).sort();
const artifacts = files.map((name) => readJson(`content-model/staging/w51-artifacts/${name}`));
const canonicalIds = new Set(fs.readdirSync('content-model/library/artifacts').filter((name) => name.endsWith('.artifact.json')).map((name) => readJson(`content-model/library/artifacts/${name}`).id));
const countByType = Object.fromEntries(Object.keys(plan.artifactTypeQuotas).sort().map((type) => [type, artifacts.filter((artifact) => artifact.type === type).length]));

assert.equal(manifest.milestone, 'W51');
assert.equal(manifest.counts.artifacts, 95);
assert.equal(artifacts.length, 95);
assert.equal(new Set(artifacts.map((artifact) => artifact.id)).size, 95);
assert.equal(new Set(artifacts.map((artifact) => artifact.title)).size, 95);
assert.deepEqual(countByType, Object.fromEntries(Object.entries(plan.artifactTypeQuotas).sort()));
for (const course of plan.courses) assert.equal(artifacts.filter((artifact) => artifact.courseIds.includes(course.courseId)).length, course.artifactQuota, `${course.courseId}: quota mismatch`);

for (const artifact of artifacts) {
  assert.equal(validateArtifact(artifact), true, `${artifact.id}: ${ajvMessage(validateArtifact)}`);
  assert.equal(artifact.status, 'draft');
  if (canonicalIds.has(artifact.id)) { const canonical = readJson(`content-model/library/artifacts/${artifact.id}.artifact.json`); assert.deepEqual({ ...canonical, status: `draft` }, artifact, `${artifact.id}: promoted content drift`); }
  assert.ok(artifact.tags.every((tag) => controlledTags.has(tag)), `${artifact.id}: uncontrolled tag`);
  assert.ok(fs.existsSync(`content-model/articles/${artifact.relatedWikiSlugs[0]}.article.json`), `${artifact.id}: wiki link missing`);
  assert.ok(artifact.runInstructions.length >= 3 && artifact.securityNotes.length >= 2, `${artifact.id}: operational metadata incomplete`);
  const content = artifact.files.map((file) => file.content).join('\n');
  assert.doesNotMatch(content, /(?:api[_-]?key|token|password|secret)\s*[:=]\s*["'][^"'{][^"']+["']/iu, `${artifact.id}: literal secret`);
  assert.doesNotMatch(JSON.stringify(artifact), /EduVerse|에듀버스|가장 먼저 쓰세요|지금 바로|클릭하세요/iu, `${artifact.id}: former-site or CTA marker`);
  if (['payload', 'schema'].includes(artifact.type)) assert.doesNotThrow(() => JSON.parse(artifact.files[0].content), `${artifact.id}: invalid JSON`);
  if (artifact.type === 'query') assert.doesNotMatch(content, /\b(?:DROP|DELETE|TRUNCATE|ALTER)\b/iu, `${artifact.id}: destructive SQL`);
  if (artifact.type === 'code') {
    assert.match(content, /def validate_record\(/u);
    assert.match(content, /if __name__ == "__main__":/u);
    assert.equal(artifact.validation.method, 'syntax');
  }
  if (['config', 'workflow'].includes(artifact.type)) assert.match(content, /^[a-z_]+:/mu, `${artifact.id}: YAML structure missing`);
  if (artifact.type === 'template') assert.match(content, /^# .+\n[\s\S]+## /u, `${artifact.id}: Markdown structure missing`);
}
const hashes = artifacts.map((artifact) => createHash('sha256').update(artifact.files.map((file) => file.content).join('\n')).digest('hex'));
assert.equal(new Set(hashes).size, 95, 'exact duplicate artifact content found');
assert.deepEqual(manifest.staged.map((item) => item.id).sort(), artifacts.map((artifact) => artifact.id).sort());
console.log('W51 artifact staging: 95 unique artifacts, exact seven-type quotas, parse/safety/runtime metadata OK');

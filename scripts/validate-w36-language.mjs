import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const read = (file) => readFile(file, 'utf8');
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const generatedFiles = (await readdir('src/content/docs/wiki')).filter((file) => file.endsWith('.md'));
assert.equal(articleFiles.length, 1400, 'wiki article source count changed');
assert.equal(generatedFiles.length, articleFiles.length, 'generated wiki article count changed');

const bannedLiteralTranslations = /판단 문턱|릴리스 문턱|합격 문턱|지연과 비용 문턱|출력 소비자|건조 실행|새 연산을 내|기능의 종료 경로|호환 배포|호출 흔적|무공짜 점심 정리/u;
let normalizedFlowCount = 0;
for (const file of articleFiles) {
  const source = await read(path.join('content-model/articles', file));
  assert.doesNotMatch(source, bannedLiteralTranslations, `${file}: awkward literal translation remains in source data`);
  normalizedFlowCount += source.split('출력이 사용되는 지점').length - 1;
}
assert.equal(normalizedFlowCount, 170, 'security flow terminology baseline changed');

for (const file of generatedFiles) {
  const source = await read(path.join('src/content/docs/wiki', file));
  assert.doesNotMatch(source, bannedLiteralTranslations, `${file}: awkward literal translation remains in generated page`);
}

const audit = JSON.parse(await read('content-model/evidence/w36-language-audit.json'));
assert.equal(audit.version, 'W36-2026-07-16');
assert.equal(audit.scope.articleSourcesReviewed, 1400);
assert.equal(audit.scope.articleSourcesChanged, 94);
assert.equal(audit.scope.lockedLedgerArticlesUpdated, 94);
assert.equal(audit.scope.lockedClaimUnitsRehashed, 199);
assert.equal(audit.ledgers.length, 13);
assert.equal(new Set(audit.ledgers.flatMap((ledger) => ledger.articleIds)).size, 94);
assert.deepEqual(audit.preservedFields, ['classification', 'decision', 'evidence', 'sourceRef', 'locator', 'claimId']);

const api = await read('content-model/articles/api.article.json');
for (const term of ['판단 기준점', '클라이언트', '모의 실행', '지원 종료 절차', '호출 기록', 'API 작업']) {
  assert.match(api, new RegExp(term, 'u'), `API article: expected term missing: ${term}`);
}
assert.equal((api.match(/소비자/gu) ?? []).length, 1, 'API article should retain only the established term 소비자 주도 계약');
assert.match(api, /소비자 주도 계약/u);

console.log(`W36 language: ${articleFiles.length} sources checked; 94 articles normalized, including 170 security-flow phrases and contextual API terminology`);

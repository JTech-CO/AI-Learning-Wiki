import fs from 'node:fs';
import path from 'node:path';

await import('./apply-2026-08-24-content-refresh.mjs');

const ROOT = path.resolve(import.meta.dirname, '..');
const ARTICLE_DIR = path.join(ROOT, 'content-model', 'articles');
const REVIEW_DATE = '2026-08-24';

function articlePath(id) {
  return path.join(ARTICLE_DIR, `${id}.article.json`);
}

function readArticle(id) {
  return JSON.parse(fs.readFileSync(articlePath(id), 'utf8'));
}

function writeArticle(article) {
  fs.writeFileSync(articlePath(article.id), `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

function ensureSource(article, source) {
  const index = article.sources.findIndex((item) => item.url === source.url);
  if (index >= 0) {
    article.sources[index] = source;
    return index + 1;
  }
  article.sources.push(source);
  return article.sources.length;
}

function addSourceRef(target, ref) {
  target.sourceRefs = [...new Set([...(target.sourceRefs ?? []), ref])].sort((a, b) => a - b);
}

const migrationSource = {
  title: 'Gemini 3.7 Flash 마이그레이션 문서',
  url: 'https://ai.google.dev/gemini-api/docs/generate-content/latest-model',
  type: 'documentation',
};

const geminiSource = {
  title: 'Gemini 3.7 Flash',
  url: 'https://ai.google.dev/gemini-api/docs/models/gemini-3.7-flash',
  type: 'documentation',
};

const migrationArticle = readArticle('model-deprecation-migration');
const migrationTarget = migrationArticle.sections.find((item) =>
  ['decision-criteria', 'operations', 'applications', 'overview'].includes(item.id));
if (!migrationTarget) throw new Error('model-deprecation-migration: no suitable section');
const migrationParagraph = 'Gemini 3.7 Flash로 이전할 때는 모델 ID만 바꾸지 않는다. Google의 2026년 8월 마이그레이션 안내는 `temperature`·`top_p`·`top_k` 제거, `thinking_budget`의 `thinking_level` 교체, `candidate_count` 제거, 미리 채운 모델 턴 제거, 마지막 사용자 턴의 비어 있지 않은 텍스트 보장과 함수 응답의 `call_id`·`name` 확인을 요구한다. 모델 교체에는 요청 스키마, 대화 검증과 도구 호출 계약의 회귀 시험이 포함돼야 한다.';
if (!migrationTarget.body.includes(migrationParagraph)) {
  migrationTarget.body = `${migrationTarget.body.trim()}\n\n${migrationParagraph}`;
}
addSourceRef(migrationTarget, ensureSource(migrationArticle, migrationSource));
addSourceRef(migrationTarget, ensureSource(migrationArticle, geminiSource));
migrationArticle.reviewedAt = REVIEW_DATE;
writeArticle(migrationArticle);

const sdkArticle = readArticle('sdk');
for (const item of sdkArticle.sections) {
  item.body = item.body.replace(
    '레거시 Text Completions 및 Messages의 sampling 매개변수를 제거했다.',
    '레거시 Text Completions와 Python SDK v1의 Messages 메서드 표면에서 sampling 매개변수를 제거했다.',
  );
}
writeArticle(sdkArticle);

const auditPath = path.join(ROOT, 'content-model', 'evidence', 'content-freshness-audit-2026-08-24.json');
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
audit.updatedArticleIds = [...new Set([...audit.updatedArticleIds, 'model-deprecation-migration'])]
  .sort((a, b) => a.localeCompare(b, 'en'));
audit.totals.updatedArticles = audit.updatedArticleIds.length;
audit.primarySources = [...new Set([...audit.primarySources, migrationSource.url])].sort();
fs.writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

const packagePath = path.join(ROOT, 'package.json');
let packageText = fs.readFileSync(packagePath, 'utf8');
packageText = packageText.replace('"version": "1.0.1"', '"version": "1.0.2"');
if (!packageText.includes('"refresh:2026-08-24"')) {
  packageText = packageText.replace(
    '"social:images": "node scripts/build-social-images.mjs"',
    '"social:images": "node scripts/build-social-images.mjs",\n    "refresh:2026-08-24": "node scripts/finalize-2026-08-24-content-refresh.mjs"',
  );
}
fs.writeFileSync(packagePath, packageText, 'utf8');

const lockPath = path.join(ROOT, 'package-lock.json');
let lockText = fs.readFileSync(lockPath, 'utf8');
lockText = lockText.replace(
  /("name": "ai-learning-wiki",\r?\n\s+"version": ")1\.0\.1/g,
  '$1' + '1.0.2',
);
fs.writeFileSync(lockPath, lockText, 'utf8');

const readmePath = path.join(ROOT, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(
  '**현재 버전:** v1.0.1 · **최종 콘텐츠 검토:** 2026-08-01 · **최종 기능 업데이트:** 2026-08-01',
  '**현재 버전:** v1.0.2 · **최종 콘텐츠 검토:** 2026-08-24 · **최종 기능 업데이트:** 2026-08-13',
);
readme = readme.replace('**현재 콘텐츠 현황 (2026-08-01)**', '**현재 콘텐츠 현황 (2026-08-24)**');
fs.writeFileSync(readmePath, readme, 'utf8');

const updatesPath = path.join(ROOT, 'UPDATES.md');
let updates = fs.readFileSync(updatesPath, 'utf8');
if (!updates.includes('## v1.0.2')) {
  const entry = `## v1.0.2

### 2026-08-24

- **공식 자료 최신성 검토** - 2026-08-01~08-24 변경을 공급자·프레임워크 1차 자료로 선별 검토
- **백과 문서 갱신** - 모델·API·안전·에이전트·SDK·프레임워크 관련 18개 문서의 내용·출처·검토일 갱신
- **OpenAI API 운영** - 요청별 지역 처리, GPT-5.6 Sol 가격, 캐시 대시보드, GPT Image 2 투명 배경, 종료 모델·Assistants API 이행 반영
- **Gemini 3.7 Flash** - 정식 모델 ID, 멀티모달 입출력·토큰 한도, 안전 평가 비교 조건과 마이그레이션 계약 반영
- **Claude 플랫폼** - 컴퓨터·브라우저 도구, Files API, Python SDK 1.0, 로컬 세션 준수 수집과 워크스페이스 귀속 반영
- **프레임워크 최신화** - Transformers 5.15.1 호환성 변경 반영, PyTorch 2.13.0과 MCP 2026-07-28 최신 상태 재확인
- **보수적 편집 기준** - 제한 미리 보기, PyTorch 2.14 릴리스 브랜치와 NIST 초기 공개 초안은 확정 사실에서 제외
- **최신성 근거 기록** - 변경 18개·내용 변경 없음 13개 문서와 제외 판단을 별도 감사 JSON으로 보존
- **게시 문서 재동기화** - 정본 스키마로 전체 게시 Markdown을 재생성하고 이전 자동 확장용 심화 점검 문구 제거

`;
  updates = updates.replace('## v1.0.1', `${entry}## v1.0.1`);
}
fs.writeFileSync(updatesPath, updates, 'utf8');

console.log(`Finalized v1.0.2 content refresh with ${audit.updatedArticleIds.length} updated articles.`);

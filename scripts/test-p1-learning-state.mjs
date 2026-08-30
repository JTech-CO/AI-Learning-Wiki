import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  LEARNING_STATE_STORAGE_KEY,
  createEmptyLearningState,
  getCourseProgress,
  loadLearningState,
  mergeLearningStates,
  normalizeLearningState,
  parseLearningStateImport,
  recordAssessmentResult,
  recordLearningVisit,
  removeCustomLearningPath,
  saveCustomLearningPath,
  saveLearningState,
  serializeLearningState,
  setLearningRead,
  toggleLearningBookmark,
} from '../src/lib/learning-state.mjs';

const firstTime = new Date('2026-08-01T01:00:00.000Z');
const secondTime = new Date('2026-08-02T01:00:00.000Z');
const article = { kind: 'article', url: '/wiki/transformer/', title: '트랜스포머' };
const nextArticle = { kind: 'article', url: '/wiki/attention/', title: '어텐션' };

let state = createEmptyLearningState(firstTime);
assert.deepEqual(Object.keys(state).sort(), ['assessments', 'bookmarks', 'read', 'recent', 'savedPaths', 'schemaVersion', 'updatedAt']);

state = recordLearningVisit(state, article, firstTime);
state = recordLearningVisit(state, { ...article, title: '트랜스포머 최신 제목' }, secondTime);
assert.equal(state.recent.length, 1, '같은 문서의 최근 기록이 중복된다');
assert.equal(state.recent[0].title, '트랜스포머 최신 제목');

state = toggleLearningBookmark(state, article, true, secondTime);
state = setLearningRead(state, article, true, secondTime);
assert.equal(state.bookmarks.length, 1);
assert.equal(state.read.length, 1);

const course = {
  id: 'sample',
  steps: [article, nextArticle],
};
const progress = getCourseProgress(course, state);
assert.deepEqual(
  { completed: progress.completed, total: progress.total, percent: progress.percent, resume: progress.resumeStep.url },
  { completed: 1, total: 2, percent: 50, resume: nextArticle.url },
);

state = saveCustomLearningPath(state, {
  id: 'transformer:entry:balanced:math:10',
  goalId: 'transformer',
  title: '트랜스포머까지의 추천 학습 경로',
  settings: { level: 'entry', focus: 'balanced', maxDocuments: 10, includeMathematics: true },
  steps: [nextArticle, article],
}, secondTime);
assert.equal(state.savedPaths.length, 1);
assert.equal(getCourseProgress(state.savedPaths[0], state).completed, 1);

state = recordAssessmentResult(state, { articleId: 'transformer', correct: false }, firstTime);
state = recordAssessmentResult(state, { articleId: 'transformer', correct: true }, secondTime);
assert.deepEqual(state.assessments, [{ articleId: 'transformer', correct: true, answeredAt: secondTime.toISOString() }]);

const exported = serializeLearningState(state, secondTime);
const imported = parseLearningStateImport(exported, secondTime);
assert.equal(imported.savedPaths.length, 1);
assert.equal(imported.assessments[0].correct, true);
assert.equal(imported.bookmarks.length, 1);

const merged = mergeLearningStates(createEmptyLearningState(firstTime), imported, secondTime);
assert.equal(merged.recent.length, 1);
assert.equal(merged.savedPaths.length, 1);
assert.equal(merged.assessments.length, 1);
assert.equal(removeCustomLearningPath(merged, merged.savedPaths[0].id, secondTime).savedPaths.length, 0);

const dirty = normalizeLearningState({
  recent: [
    { url: 'https://example.com/', title: '외부 링크', visitedAt: secondTime.toISOString() },
    { url: '/wiki/valid/', title: '<b>문자열로만 표시</b>', visitedAt: secondTime.toISOString() },
  ],
  bookmarks: [{ url: '//evil.example/', title: '잘못된 주소', savedAt: secondTime.toISOString() }],
  read: [],
  savedPaths: [],
  assessments: [{ articleId: '../bad', correct: true, answeredAt: secondTime.toISOString() }],
}, secondTime);
assert.equal(dirty.recent.length, 1, '외부 URL을 가져왔다');
assert.equal(dirty.bookmarks.length, 0, '프로토콜 상대 URL을 가져왔다');
assert.equal(dirty.assessments.length, 0, '잘못된 문서 ID를 가져왔다');

const memory = new Map();
const storage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: (key) => memory.delete(key),
};
saveLearningState(state, storage, secondTime);
assert.ok(memory.has(LEARNING_STATE_STORAGE_KEY));
assert.equal(loadLearningState(storage, secondTime).read.length, 1);

const [header, dashboard, bridge, builder, stylesheet, privacy] = await Promise.all([
  readFile('src/components/wiki/WikiHeader.astro', 'utf8'),
  readFile('src/components/wiki/LearningDashboard.astro', 'utf8'),
  readFile('src/components/wiki/LearningStateBridge.astro', 'utf8'),
  readFile('src/components/lab/LearningPathBuilder.astro', 'utf8'),
  readFile('src/styles/wiki-learning.css', 'utf8'),
  readFile('src/content/docs/privacy-policy.mdx', 'utf8'),
]);
assert.match(header, /<LearningStateBridge \/>/, '전역 학습 상태 브리지가 헤더에 없다');
assert.match(header, /href="\/learning-progress\/">내 학습/, '내 학습 진입 링크가 없다');
assert.match(bridge, /data-learning-bookmark/, '문서 북마크 조작이 없다');
assert.match(bridge, /data-learning-read/, '문서 읽음 조작이 없다');
assert.match(dashboard, /data-learning-import/, 'JSON 가져오기가 없다');
assert.match(dashboard, /serializeLearningState/, 'JSON 내보내기가 없다');
assert.match(dashboard, /wiki-learning-update-label/, '재검토 문서 표시가 없다');
assert.match(dashboard, /data-learning-path-list/, '저장한 맞춤 경로 목록이 없다');
assert.match(builder, /data-save-learning-path/, '맞춤 경로 저장 버튼이 없다');
assert.match(stylesheet, /@media \(max-width: 40rem\)/, '모바일 레이아웃이 없다');
assert.match(privacy, /로컬 저장소|localStorage/i, '개인정보 방침에 로컬 학습 기록 설명이 없다');

console.log('P1 local learning state: recent, bookmarks, read status, course progress, saved paths, assessments, import/export passed');

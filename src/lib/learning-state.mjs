export const LEARNING_STATE_VERSION = 1;
export const LEARNING_STATE_STORAGE_KEY = 'ai-learning-wiki:learning-state:v1';
export const LEARNING_STATE_EXPORT_FORMAT = 'ai-learning-wiki-learning-state';
export const MAX_RECENT_ITEMS = 50;

const VALID_KINDS = new Set(['article', 'course']);

function nowIso(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  return Number.isNaN(date.valueOf()) ? new Date().toISOString() : date.toISOString();
}

function validIso(value, fallback) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return fallback;
  return new Date(value).toISOString();
}

function cleanText(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const text = value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  return text.slice(0, 240) || fallback;
}

export function normalizeLearningUrl(value) {
  if (typeof value !== 'string') return null;
  let url = value.trim();
  if (!url.startsWith('/') || url.startsWith('//')) return null;
  url = url.split(/[?#]/, 1)[0].replace(/\\/g, '/').replace(/\/{2,}/g, '/');
  if (!/^\/(wiki|course)\/[A-Za-z0-9._~!$&'()*+,;=:@%-]+\/$/.test(url)) return null;
  const slug = url.split('/')[2];
  if (!slug || slug === '.' || slug === '..' || /%2f|%5c/i.test(slug)) return null;
  return url;
}

function normalizeKind(value, url) {
  if (VALID_KINDS.has(value)) return value;
  return url.startsWith('/course/') ? 'course' : 'article';
}

function normalizeEntry(raw, dateKey, fallbackDate) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const url = normalizeLearningUrl(raw.url);
  if (!url) return null;
  const title = cleanText(raw.title);
  if (!title) return null;
  return {
    url,
    title,
    kind: normalizeKind(raw.kind, url),
    [dateKey]: validIso(raw[dateKey], fallbackDate),
  };
}

function normalizeAssessment(raw, fallbackDate) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const articleId = cleanText(raw.articleId).toLocaleLowerCase('en-US').slice(0, 120);
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(articleId) || typeof raw.correct !== 'boolean') return null;
  return {
    articleId,
    correct: raw.correct,
    answeredAt: validIso(raw.answeredAt, fallbackDate),
  };
}

function dedupeAssessments(items) {
  const newest = new Map();
  for (const item of items) {
    const previous = newest.get(item.articleId);
    if (!previous || item.answeredAt > previous.answeredAt) newest.set(item.articleId, item);
  }
  return [...newest.values()].sort((a, b) => b.answeredAt.localeCompare(a.answeredAt));
}

function normalizeSavedPath(raw, fallbackDate) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const goalId = cleanText(raw.goalId).toLocaleLowerCase('en-US').slice(0, 120);
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(goalId)) return null;
  const title = cleanText(raw.title);
  const id = cleanText(raw.id || `${goalId}:${raw.settings?.level ?? 'entry'}:${raw.settings?.focus ?? 'balanced'}`)
    .toLocaleLowerCase('en-US')
    .replace(/[^a-z0-9:._-]/g, '')
    .slice(0, 180);
  if (!id || !goalId || !title) return null;
  const steps = (Array.isArray(raw.steps) ? raw.steps : [])
    .map((step) => {
      const url = normalizeLearningUrl(step?.url);
      const stepTitle = cleanText(step?.title);
      return url && stepTitle ? { url, title: stepTitle } : null;
    })
    .filter(Boolean)
    .slice(0, 30);
  if (steps.length === 0) return null;
  const settings = raw.settings && typeof raw.settings === 'object' ? raw.settings : {};
  return {
    id,
    goalId,
    title,
    savedAt: validIso(raw.savedAt, fallbackDate),
    settings: {
      level: ['entry', 'intermediate', 'professional'].includes(settings.level) ? settings.level : 'entry',
      focus: ['balanced', 'theory', 'practice'].includes(settings.focus) ? settings.focus : 'balanced',
      maxDocuments: Math.min(30, Math.max(5, Number(settings.maxDocuments) || steps.length)),
      includeMathematics: settings.includeMathematics !== false,
    },
    steps,
  };
}

function dedupeSavedPaths(items, limit = 20) {
  const newest = new Map();
  for (const item of items) {
    const previous = newest.get(item.id);
    if (!previous || item.savedAt > previous.savedAt) newest.set(item.id, item);
  }
  return [...newest.values()]
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt) || a.title.localeCompare(b.title, 'ko'))
    .slice(0, limit);
}

function dedupeNewest(items, dateKey, limit = Infinity) {
  const newest = new Map();
  for (const item of items) {
    const previous = newest.get(item.url);
    if (!previous || item[dateKey] > previous[dateKey]) newest.set(item.url, item);
  }
  return [...newest.values()]
    .sort((a, b) => b[dateKey].localeCompare(a[dateKey]) || a.title.localeCompare(b.title, 'ko'))
    .slice(0, limit);
}

export function createEmptyLearningState(now = new Date()) {
  const timestamp = nowIso(now);
  return {
    schemaVersion: LEARNING_STATE_VERSION,
    updatedAt: timestamp,
    recent: [],
    bookmarks: [],
    read: [],
    savedPaths: [],
    assessments: [],
  };
}

export function normalizeLearningState(raw, now = new Date()) {
  const timestamp = nowIso(now);
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const normalizeList = (key, dateKey, limit) => dedupeNewest(
    (Array.isArray(source[key]) ? source[key] : [])
      .map((entry) => normalizeEntry(entry, dateKey, timestamp))
      .filter(Boolean),
    dateKey,
    limit,
  );
  return {
    schemaVersion: LEARNING_STATE_VERSION,
    updatedAt: validIso(source.updatedAt, timestamp),
    recent: normalizeList('recent', 'visitedAt', MAX_RECENT_ITEMS),
    bookmarks: normalizeList('bookmarks', 'savedAt'),
    read: normalizeList('read', 'readAt'),
    savedPaths: dedupeSavedPaths((Array.isArray(source.savedPaths) ? source.savedPaths : [])
      .map((path) => normalizeSavedPath(path, timestamp))
      .filter(Boolean)),
    assessments: dedupeAssessments((Array.isArray(source.assessments) ? source.assessments : [])
      .map((result) => normalizeAssessment(result, timestamp))
      .filter(Boolean)),
  };
}

function withUpdate(state, changes, now) {
  return normalizeLearningState({
    ...state,
    ...changes,
    schemaVersion: LEARNING_STATE_VERSION,
    updatedAt: nowIso(now),
  }, now);
}

function normalizeItem(item) {
  const url = normalizeLearningUrl(item?.url);
  const title = cleanText(item?.title);
  if (!url || !title) throw new TypeError('학습 기록 항목의 URL 또는 제목이 올바르지 않다.');
  return { url, title, kind: normalizeKind(item?.kind, url) };
}

export function recordLearningVisit(state, item, now = new Date()) {
  const entry = { ...normalizeItem(item), visitedAt: nowIso(now) };
  const current = normalizeLearningState(state, now);
  return withUpdate(current, { recent: [entry, ...current.recent.filter((value) => value.url !== entry.url)] }, now);
}

export function isBookmarked(state, url) {
  const normalizedUrl = normalizeLearningUrl(url);
  return Boolean(normalizedUrl && normalizeLearningState(state).bookmarks.some((entry) => entry.url === normalizedUrl));
}

export function toggleLearningBookmark(state, item, force, now = new Date()) {
  const entry = { ...normalizeItem(item), savedAt: nowIso(now) };
  const current = normalizeLearningState(state, now);
  const exists = current.bookmarks.some((value) => value.url === entry.url);
  const shouldSave = typeof force === 'boolean' ? force : !exists;
  const bookmarks = shouldSave
    ? [entry, ...current.bookmarks.filter((value) => value.url !== entry.url)]
    : current.bookmarks.filter((value) => value.url !== entry.url);
  return withUpdate(current, { bookmarks }, now);
}

export function isMarkedRead(state, url) {
  const normalizedUrl = normalizeLearningUrl(url);
  return Boolean(normalizedUrl && normalizeLearningState(state).read.some((entry) => entry.url === normalizedUrl));
}

export function setLearningRead(state, item, read = true, now = new Date()) {
  const entry = { ...normalizeItem(item), kind: 'article', readAt: nowIso(now) };
  const current = normalizeLearningState(state, now);
  const entries = read
    ? [entry, ...current.read.filter((value) => value.url !== entry.url)]
    : current.read.filter((value) => value.url !== entry.url);
  return withUpdate(current, { read: entries }, now);
}

export function recordAssessmentResult(state, result, now = new Date()) {
  const current = normalizeLearningState(state, now);
  const entry = normalizeAssessment({ ...result, answeredAt: result?.answeredAt ?? nowIso(now) }, nowIso(now));
  if (!entry) throw new TypeError('저장할 학습 확인 결과가 올바르지 않다.');
  return withUpdate(current, {
    assessments: [entry, ...current.assessments.filter((value) => value.articleId !== entry.articleId)],
  }, now);
}

export function saveCustomLearningPath(state, path, now = new Date()) {
  const current = normalizeLearningState(state, now);
  const entry = normalizeSavedPath({ ...path, savedAt: nowIso(now) }, nowIso(now));
  if (!entry) throw new TypeError('저장할 맞춤 학습 경로가 올바르지 않다.');
  return withUpdate(current, {
    savedPaths: [entry, ...current.savedPaths.filter((value) => value.id !== entry.id)],
  }, now);
}

export function removeCustomLearningPath(state, pathId, now = new Date()) {
  const current = normalizeLearningState(state, now);
  return withUpdate(current, {
    savedPaths: current.savedPaths.filter((value) => value.id !== pathId),
  }, now);
}

export function mergeLearningStates(base, incoming, now = new Date()) {
  const left = normalizeLearningState(base, now);
  const right = normalizeLearningState(incoming, now);
  return withUpdate(left, {
    recent: [...left.recent, ...right.recent],
    bookmarks: [...left.bookmarks, ...right.bookmarks],
    read: [...left.read, ...right.read],
    savedPaths: [...left.savedPaths, ...right.savedPaths],
    assessments: [...left.assessments, ...right.assessments],
  }, now);
}

export function serializeLearningState(state, now = new Date()) {
  return JSON.stringify({
    format: LEARNING_STATE_EXPORT_FORMAT,
    version: LEARNING_STATE_VERSION,
    exportedAt: nowIso(now),
    state: normalizeLearningState(state, now),
  }, null, 2);
}

export function parseLearningStateImport(text, now = new Date()) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new TypeError('올바른 JSON 파일이 아니다.');
  }
  const source = parsed?.format === LEARNING_STATE_EXPORT_FORMAT ? parsed.state : parsed;
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    throw new TypeError('AI Learning Wiki 학습 기록 형식이 아니다.');
  }
  if (parsed?.format && Number(parsed.version) > LEARNING_STATE_VERSION) {
    throw new RangeError('현재 사이트보다 새로운 학습 기록 형식이다.');
  }
  return normalizeLearningState(source, now);
}

export function loadLearningState(storage = globalThis.localStorage, now = new Date()) {
  if (!storage?.getItem) return createEmptyLearningState(now);
  try {
    const raw = storage.getItem(LEARNING_STATE_STORAGE_KEY);
    return raw ? normalizeLearningState(JSON.parse(raw), now) : createEmptyLearningState(now);
  } catch {
    return createEmptyLearningState(now);
  }
}

export function saveLearningState(state, storage = globalThis.localStorage, now = new Date()) {
  const normalized = normalizeLearningState({ ...state, updatedAt: nowIso(now) }, now);
  if (storage?.setItem) storage.setItem(LEARNING_STATE_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearLearningState(storage = globalThis.localStorage) {
  storage?.removeItem?.(LEARNING_STATE_STORAGE_KEY);
}

export function getCourseProgress(course, state) {
  const steps = Array.isArray(course?.steps)
    ? course.steps.map((step) => ({ ...step, url: normalizeLearningUrl(step?.url) })).filter((step) => step.url)
    : [];
  const current = normalizeLearningState(state);
  const readUrls = new Set(current.read.map((entry) => entry.url));
  const completed = steps.filter((step) => readUrls.has(step.url)).length;
  const recentIndex = current.recent
    .map((entry) => steps.findIndex((step) => step.url === entry.url))
    .find((index) => index >= 0);
  let resumeIndex = recentIndex ?? -1;
  if (resumeIndex >= 0 && readUrls.has(steps[resumeIndex].url)) {
    const laterUnread = steps.findIndex((step, index) => index > resumeIndex && !readUrls.has(step.url));
    resumeIndex = laterUnread >= 0 ? laterUnread : steps.findIndex((step) => !readUrls.has(step.url));
  }
  if (resumeIndex < 0) resumeIndex = steps.findIndex((step) => !readUrls.has(step.url));
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;
  return {
    total: steps.length,
    completed,
    percent,
    complete: steps.length > 0 && completed === steps.length,
    started: completed > 0 || recentIndex !== undefined,
    resumeStep: resumeIndex >= 0 ? steps[resumeIndex] : null,
  };
}

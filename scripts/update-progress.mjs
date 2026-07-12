import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CM = path.join(ROOT, 'content-model');
const DATA = path.join(CM, 'data');
const progressFile = path.join(CM, 'progress.json');
const readJSON = async (file) => JSON.parse(await readFile(file, 'utf8'));

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const [courses, previous, files] = await Promise.all([
  readJSON(path.join(CM, 'courses.json')),
  readJSON(progressFile),
  walk(DATA),
]);
const modules = await Promise.all(files.map(readJSON));
const byCourse = new Map(courses.map((course) => [course.id, modules.filter((mod) => mod.course === course.id)]));

const courseProgress = {};
for (const course of courses) {
  const items = byCourse.get(course.id).sort((a, b) => a.order - b.order);
  const orders = new Set(items.map((item) => item.order));
  let through = 0;
  while (orders.has(through + 1)) through += 1;
  const complete = items.length;
  const old = previous.courses?.[course.id] ?? {};
  courseProgress[course.id] = {
    expected: course.moduleCount,
    complete,
    completedThrough: through,
    status: complete === course.moduleCount ? 'complete' : complete ? 'in_progress' : 'pending',
    ...(items.length ? { lastModuleId: items.at(-1).id } : {}),
    ...(complete < course.moduleCount ? { nextOrder: through + 1, nextTitle: old.nextTitle ?? null } : {}),
    ...(course.autoUpdated ? { rollingSnapshot: true } : {}),
  };
}

const expected = courses.reduce((sum, course) => sum + course.moduleCount, 0);
const complete = modules.length;
const active = courses.find((course) => courseProgress[course.id].complete < course.moduleCount);
const next = active ? courseProgress[active.id].nextOrder : null;
const progress = {
  version: previous.version ?? 1,
  updatedAt: new Date().toISOString(),
  sourceOfTruth: previous.sourceOfTruth,
  totals: { expected, complete, remaining: expected - complete },
  courses: courseProgress,
  resume: active ? {
    course: active.id,
    nextOrder: next,
    instruction: `라이브 코스 목록에서 ${next}번 제목을 대조한 뒤 raw 저장부터 시작한다.`,
  } : null,
};

await writeFile(progressFile, `${JSON.stringify(progress, null, 2)}\n`, 'utf8');
console.log(`progress updated: ${complete}/${expected}; next ${active?.id ?? 'none'} ${next ?? ''}`.trim());


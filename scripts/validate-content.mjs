import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CM = path.join(ROOT, 'content-model');
const DATA = path.join(CM, 'data');
const DOCS = path.join(ROOT, 'src', 'content', 'docs');
const requireComplete = process.argv.includes('--complete');
const checkGenerated = process.argv.includes('--generated');

const errors = [];
const warnings = [];
const error = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const readJSON = async (file) => JSON.parse(await readFile(file, 'utf8'));

async function walk(dir, suffix) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full, suffix));
    else if (entry.name.endsWith(suffix)) files.push(full);
  }
  return files;
}

function moduleSlug(mod) {
  const tail = mod.id.split('/').slice(1).join('-') || mod.id;
  const n = String(mod.order ?? 0).padStart(2, '0');
  return tail.startsWith(n) ? tail : `${n}-${tail}`;
}

function nonEmptyI18n(value) {
  return value && typeof value === 'object' && typeof value.ko === 'string' && value.ko.trim().length > 0;
}

const [moduleSchema, courseSchema, courses, progress] = await Promise.all([
  readJSON(path.join(CM, 'schema.module.json')),
  readJSON(path.join(CM, 'schema.course.json')),
  readJSON(path.join(CM, 'courses.json')),
  readJSON(path.join(CM, 'progress.json')),
]);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(moduleSchema);
const validateModule = ajv.getSchema(moduleSchema.$id);
const validateCourse = ajv.compile(courseSchema);

for (const course of courses) {
  if (!validateCourse(course)) {
    error(`course schema: ${course.id ?? '(unknown)'} ${ajv.errorsText(validateCourse.errors)}`);
  }
}

const courseById = new Map(courses.map((course) => [course.id, course]));
const files = await walk(DATA, '.module.json');
const modules = [];

for (const file of files) {
  let mod;
  try {
    mod = await readJSON(file);
  } catch (cause) {
    error(`invalid JSON: ${path.relative(ROOT, file)} (${cause.message})`);
    continue;
  }

  modules.push({ file, mod });
  if (!validateModule(mod)) {
    error(`module schema: ${mod.id ?? path.basename(file)} ${ajv.errorsText(validateModule.errors)}`);
  }

  const rel = path.relative(DATA, file).replaceAll('\\', '/');
  const directory = rel.split('/')[0];
  if (directory !== mod.course) error(`directory/course mismatch: ${rel} -> ${mod.course}`);
  if (!courseById.has(mod.course)) error(`unknown course: ${mod.id} -> ${mod.course}`);
  if (!mod.id?.startsWith(`${mod.course}/`)) error(`id/course mismatch: ${mod.id} -> ${mod.course}`);
  if (!nonEmptyI18n(mod.title)) error(`empty Korean title: ${mod.id}`);
  if (!nonEmptyI18n(mod.body)) error(`empty Korean body: ${mod.id}`);
  if (!Array.isArray(mod.prompts) || mod.prompts.length === 0) error(`missing prompts: ${mod.id}`);
  if (!nonEmptyI18n(mod.mission)) error(`missing mission: ${mod.id}`);
  if (!Array.isArray(mod.rubric) || mod.rubric.length === 0) error(`missing rubric: ${mod.id}`);

  for (const [index, prompt] of (mod.prompts ?? []).entries()) {
    const value = prompt.template ?? prompt.text;
    if (!nonEmptyI18n(prompt.title)) error(`empty prompt title: ${mod.id}#${index + 1}`);
    if (!nonEmptyI18n(value)) error(`empty prompt template: ${mod.id}#${index + 1}`);
    if (prompt.examples !== undefined && !Array.isArray(prompt.examples)) {
      error(`prompt examples must be an array: ${mod.id}#${index + 1}`);
    }
  }

  for (const concept of mod.concepts ?? []) {
    if (!/^[a-z0-9-]+$/.test(concept)) error(`invalid concept slug: ${mod.id} -> ${concept}`);
  }

  if (!mod.source?.method) warn(`source method missing: ${mod.id}`);
  if (!mod.source?.url) warn(`source URL missing: ${mod.id}`);
  if (!mod.source?.capturedAt) warn(`capture time missing: ${mod.id}`);

}

if (checkGenerated) {
  for (const legacy of ['courses', 'concepts']) {
    try {
      const entries = await readdir(path.join(DOCS, legacy));
      if (entries.length) error('legacy generated directory remains: ' + legacy);
    } catch (cause) { if (cause.code !== 'ENOENT') throw cause; }
  }
  try { await access(path.join(DOCS, 'prompts.md')); error('legacy static prompt page remains'); }
  catch (cause) { if (cause.code !== 'ENOENT') throw cause; }
}

for (const grouped of [
  ['id', ({ mod }) => mod.id],
  ['course/order', ({ mod }) => `${mod.course}/${mod.order}`],
]) {
  const [label, keyOf] = grouped;
  const seen = new Map();
  for (const item of modules) {
    const key = keyOf(item);
    if (seen.has(key)) error(`duplicate ${label}: ${key}`);
    seen.set(key, item.file);
  }
}

const counts = {};
for (const course of courses) {
  const courseModules = modules.filter(({ mod }) => mod.course === course.id).map(({ mod }) => mod);
  const orders = new Set(courseModules.map((mod) => mod.order));
  const missing = [];
  for (let order = 1; order <= course.moduleCount; order += 1) {
    if (!orders.has(order)) missing.push(order);
  }
  const outside = [...orders].filter((order) => !Number.isInteger(order) || order < 1 || order > course.moduleCount);
  if (outside.length) error(`out-of-range order ${course.id}: ${outside.join(', ')}`);
  if (missing.length) {
    const message = `incomplete ${course.id}: ${courseModules.length}/${course.moduleCount}; missing ${missing.join(', ')}`;
    requireComplete ? error(message) : warn(message);
  }
  counts[course.id] = courseModules.length;
}

const expectedTotal = courses.reduce((sum, course) => sum + course.moduleCount, 0);
if (progress.totals.expected !== expectedTotal) error(`progress expected drift: ${progress.totals.expected} != ${expectedTotal}`);
if (progress.totals.complete !== modules.length) error(`progress complete drift: ${progress.totals.complete} != ${modules.length}`);
if (progress.totals.remaining !== expectedTotal - modules.length) error(`progress remaining drift: ${progress.totals.remaining} != ${expectedTotal - modules.length}`);
for (const course of courses) {
  const saved = progress.courses?.[course.id];
  if (!saved) error(`progress course missing: ${course.id}`);
  else {
    if (saved.expected !== course.moduleCount) error(`progress expected drift ${course.id}: ${saved.expected} != ${course.moduleCount}`);
    if (saved.complete !== counts[course.id]) error(`progress complete drift ${course.id}: ${saved.complete} != ${counts[course.id]}`);
  }
}

const promptCount = modules.reduce((sum, { mod }) => sum + (mod.prompts?.length ?? 0), 0);
console.log(`content: ${modules.length}/${expectedTotal} modules, ${promptCount} prompts, ${courses.length} courses`);
console.log(`mode: ${requireComplete ? 'release-complete' : 'work-in-progress'}${checkGenerated ? ' + generated pages' : ''}`);
for (const message of warnings) console.warn(`WARN ${message}`);
for (const message of errors) console.error(`ERROR ${message}`);
console.log(`result: ${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length) process.exit(1);


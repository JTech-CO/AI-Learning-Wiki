import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const RAW = path.join(ROOT, 'content-model', 'raw');
const DATA = path.join(ROOT, 'content-model', 'data');

async function walk(dir, suffix) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full, suffix));
    else if (entry.name.endsWith(suffix)) files.push(full);
  }
  return files;
}

const readJSON = async (file) => JSON.parse(await readFile(file, 'utf8'));
const rawFiles = await walk(RAW, '.json');
const existingFiles = await walk(DATA, '.module.json');
const existing = await Promise.all(existingFiles.map(readJSON));
const occupied = new Set(existing.map((mod) => `${mod.course}/${mod.order}`));
const ids = new Set(existing.map((mod) => mod.id));

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/^(engineerx|builderx|introx|workx|moneyx|money|aut|awti|trend|eng|noco|pbl|dev|db|ac|ai)_/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'module';
}

function i18n(value) {
  return { ko: String(value ?? '').trim() };
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  return [value];
}

function text(value) {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return JSON.stringify(value, null, 2);
}

function code(value) {
  const content = text(value);
  if (!content) return '';
  const fence = content.includes('```') ? '````' : '```';
  return `${fence}text\n${content}\n${fence}`;
}

function renderWorkedExample(example) {
  if (!example || typeof example !== 'object') return '';
  const out = ['## 👀 따라하기 예시'];
  if (example.scenario) out.push(text(example.scenario));
  for (const [index, item] of list(example.walkthrough).entries()) {
    out.push(`### ${index + 1}. ${text(item.move ?? item.title ?? '진행')}`);
    if (item.actual_output) out.push(`**실제 결과**\n\n${code(item.actual_output)}`);
    if (item.why) out.push(`> ${text(item.why)}`);
  }
  if (example.final_artifact) out.push(`### 완성 결과\n\n${text(example.final_artifact)}`);
  return out.join('\n\n');
}

function renderSteps(steps) {
  const out = ['## 단계별 따라하기'];
  for (const [index, step] of list(steps).entries()) {
    if (typeof step === 'string') {
      out.push(`${index + 1}. ${step}`);
      continue;
    }
    out.push(`### ${text(step.title ?? `${index + 1}단계`)}`);
    if (step.detail) out.push(text(step.detail));
    if (step.example) out.push(`**복사·실행 예시**\n\n${code(step.example)}`);
  }
  return out.join('\n\n');
}

function renderMistakes(items) {
  if (!list(items).length) return '';
  const out = ['## 흔한 실수와 교정'];
  for (const item of list(items)) {
    if (typeof item === 'string') out.push(`- ${item}`);
    else out.push(`- **실수:** ${text(item.mistake ?? item.problem)}\n  - **교정:** ${text(item.fix ?? item.solution)}`);
  }
  return out.join('\n');
}

function renderSimpleList(title, items) {
  const values = list(items).map(text).filter(Boolean);
  return values.length ? `## ${title}\n\n${values.map((item) => `- ${item}`).join('\n')}` : '';
}

function difficulty(band) {
  if (band <= 0) return 'intro';
  if (band === 1) return 'basic';
  if (band === 2) return 'intermediate';
  if (band === 3) return 'advanced';
  return 'pro';
}

let created = 0;
let skippedExisting = 0;
const metadataOnly = [];

for (const file of rawFiles.sort()) {
  const raw = await readJSON(file);
  if (occupied.has(`${raw.course}/${raw.order}`)) {
    skippedExisting += 1;
    continue;
  }
  if (!raw.lesson) {
    metadataOnly.push({ course: raw.course, order: raw.order, nodeKey: raw.nodeKey, title: raw.node?.title });
    continue;
  }

  const { node, lesson } = raw;
  let slug = slugify(node.key);
  if (ids.has(`${raw.course}/${slug}`)) slug = `${String(raw.order).padStart(2, '0')}-${slug}`;
  const id = `${raw.course}/${slug}`;
  ids.add(id);
  occupied.add(`${raw.course}/${raw.order}`);

  const practice = lesson.practice && typeof lesson.practice === 'object' ? lesson.practice : {};
  const body = [
    lesson.hook ? `> ${text(lesson.hook)}` : '',
    lesson.outcome ? `## 이 레슨에서 만드는 것\n\n${text(lesson.outcome)}` : '',
    lesson.concept ? `## 핵심 개념\n\n${text(lesson.concept)}` : '',
    lesson.why_it_works ? `### 왜 작동하는가\n\n${text(lesson.why_it_works)}` : '',
    renderWorkedExample(lesson.worked_example),
    renderSteps(lesson.steps),
    renderMistakes(lesson.mistakes),
    renderSimpleList('완료 체크리스트', lesson.checklist),
    renderSimpleList('도구', lesson.tools),
    practice.model_answer ? `## 참고 답안\n\n${text(practice.model_answer)}` : '',
  ].filter(Boolean).join('\n\n');

  const prompts = list(lesson.templates).map((item, index) => {
    const template = typeof item === 'string' ? item : item.prompt ?? item.template ?? '';
    const example = typeof item === 'object' ? item.example : null;
    return {
      id: `${slug}-p${index + 1}`,
      title: i18n(typeof item === 'string' ? `프롬프트 ${index + 1}` : item.label ?? `프롬프트 ${index + 1}`),
      template: i18n(template),
      examples: example ? [{ label: i18n('작성 예시'), input: i18n(example) }] : [],
      tags: ['eduverse', slug],
    };
  }).filter((prompt) => prompt.template.ko);

  const rubricValues = list(practice.self_rubric).map(text).filter(Boolean);
  const competencies = list(node.competency_keys).map(slugify).filter(Boolean);
  const concepts = [...new Set([
    ...competencies,
    ...slugify(node.key).split('-').filter((token) => token.length >= 3),
  ])].slice(0, 12);
  const tags = [...new Set([
    node.domain,
    node.track,
    ...competencies,
  ].map(text).filter(Boolean))];
  const refreshed = lesson.refreshed_at ?? lesson.created_at ?? raw.capturedAt;
  const module = {
    id,
    course: raw.course,
    order: raw.order,
    title: i18n(node.title),
    summary: i18n(node.description ?? lesson.outcome ?? lesson.hook),
    objectives: [lesson.outcome ?? node.description].filter(Boolean).map(i18n),
    body: i18n(body),
    prompts,
    concepts,
    mission: i18n(practice.task ?? lesson.outcome ?? '레슨의 단계별 실습을 직접 완료한다.'),
    rubric: (rubricValues.length ? rubricValues : list(lesson.checklist).map(text).slice(0, 3)).map((criterion) => ({ criterion: i18n(criterion), max: 5 })),
    difficulty: difficulty(Number(node.mastery_band ?? 0)),
    tags,
    estimatedMinutes: Math.max(15, Math.min(90, list(lesson.steps).length * 6 || 20)),
    source: {
      platform: 'eduverse-ai.app',
      url: raw.sourceUrl,
      capturedAt: raw.capturedAt,
      captureTimeBasis: 'observed',
      method: 'api-capture',
      citation: `EduVerse verified lesson; ${lesson.gen_model ?? 'unknown model'}; prompt ${lesson.gen_prompt_version ?? 'unknown'}`,
    },
    updatedAt: new Date(refreshed).toISOString().slice(0, 10),
  };

  const outDir = path.join(DATA, raw.course);
  await mkdir(outDir, { recursive: true });
  const filename = `${String(raw.order).padStart(2, '0')}-${slug}.module.json`;
  await writeFile(path.join(outDir, filename), `${JSON.stringify(module, null, 2)}\n`, 'utf8');
  created += 1;
}

console.log(`normalization complete: ${created} created; ${skippedExisting} existing; ${metadataOnly.length} metadata-only`);
for (const item of metadataOnly) console.warn(`metadata-only ${item.course}/${item.order}: ${item.nodeKey} (${item.title})`);

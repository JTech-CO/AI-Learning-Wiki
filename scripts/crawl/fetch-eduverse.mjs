import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const RAW = path.join(ROOT, 'content-model', 'raw');
const MANIFEST = path.join(ROOT, 'content-model', 'raw-manifest.json');
const PAGE = 'https://eduverse-ai.app/learn';
const COURSE_MAP = {
  intro: 'ai-intro',
  work: 'ai-work',
  builder: 'ai-builder',
  engineer: 'ai-engineer',
  automation: 'automation',
  money: 'ai-finance',
  trends: 'ai-trends',
};

async function getText(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

const html = await getText(PAGE);
const chunkPaths = [...new Set([...html.matchAll(/\/_next\/static\/[^"']+\.js/g)].map((match) => match[0]))];
if (!chunkPaths.length) throw new Error('Next.js chunks not found');
const chunks = await Promise.all(chunkPaths.map(async (chunkPath) => ({
  path: chunkPath,
  text: await getText(new URL(chunkPath, PAGE)),
})));

const combined = chunks.map((chunk) => chunk.text).join('\n');
const projectUrl = combined.match(/https:\/\/[a-z]+\.supabase\.co/)?.[0];
const anonKey = combined.match(/eyJhbGciOiJIUzI1Ni[^"']+/)?.[0];
if (!projectUrl || !anonKey) throw new Error('Public Supabase configuration not found');

const courseChunk = chunks.find((chunk) => chunk.text.includes('AI_COURSES') || chunk.text.includes('engineerx_dev_env_setup'))?.text;
if (!courseChunk) throw new Error('Course node manifest not found');

const liveCourses = [];
const coursePattern = /\{id:"(intro|work|builder|engineer|automation|money|trends)",title:"([^"]+)"[\s\S]*?nodes:\[([^\]]+)\]\}/g;
for (const match of courseChunk.matchAll(coursePattern)) {
  liveCourses.push({
    liveId: match[1],
    course: COURSE_MAP[match[1]],
    title: match[2],
    nodes: [...match[3].matchAll(/"([^"]+)"/g)].map((node) => node[1]),
  });
}
if (liveCourses.length !== 7) throw new Error(`Expected 7 courses, found ${liveCourses.length}`);

const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };
async function rest(table, query) {
  const url = `${projectUrl}/rest/v1/${table}?${query}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response.json();
}

const [nodes, lessons] = await Promise.all([
  rest('eduverse_node', 'select=*&limit=2000'),
  rest('lessons', 'select=*&status=eq.verified&limit=2000'),
]);
const nodeByKey = new Map(nodes.map((node) => [node.key, node]));
const lessonByKey = new Map(lessons.map((lesson) => [lesson.node_key, lesson]));
const capturedAt = new Date().toISOString();
const entries = [];
const metadataOnly = [];

for (const course of liveCourses) {
  const dir = path.join(RAW, course.course);
  await mkdir(dir, { recursive: true });
  for (const [index, nodeKey] of course.nodes.entries()) {
    const node = nodeByKey.get(nodeKey);
    const lesson = lessonByKey.get(nodeKey);
    if (!node) throw new Error(`Node metadata missing: ${nodeKey}`);
    if (!lesson) metadataOnly.push(nodeKey);
    const raw = {
      formatVersion: 1,
      course: course.course,
      liveCourseId: course.liveId,
      order: index + 1,
      nodeKey,
      capturedAt,
      sourceUrl: `${PAGE}?course=${course.liveId}&node=${encodeURIComponent(nodeKey)}`,
      node,
      lesson,
    };
    const json = `${JSON.stringify(raw, null, 2)}\n`;
    const filename = `${String(index + 1).padStart(2, '0')}-${nodeKey}.json`;
    await writeFile(path.join(dir, filename), json, 'utf8');
    entries.push({
      course: course.course,
      order: index + 1,
      nodeKey,
      title: node.title,
      capturedAt,
      sourceUpdatedAt: lesson?.refreshed_at ?? lesson?.created_at ?? null,
      contentAvailable: Boolean(lesson),
      bytes: Buffer.byteLength(json),
      sha256: createHash('sha256').update(json).digest('hex'),
    });
  }
}

const expected = liveCourses.reduce((sum, course) => sum + course.nodes.length, 0);
if (entries.length !== expected) throw new Error(`Raw count mismatch: ${entries.length}/${expected}`);
const manifest = {
  formatVersion: 1,
  capturedAt,
  source: PAGE,
  note: 'Public anon key is discovered at runtime and is never stored in this repository.',
  totals: { courses: liveCourses.length, modules: entries.length },
  courses: Object.fromEntries(liveCourses.map((course) => [course.course, course.nodes.length])),
  entries,
};
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`raw capture complete: ${entries.length} verified lessons across ${liveCourses.length} courses`);
console.log(`metadata rows: ${nodes.length}; verified lesson rows: ${lessons.length}`);
console.log(`metadata-only curriculum entries: ${metadataOnly.length}`);
console.log(`manifest: ${path.relative(ROOT, MANIFEST)}`);

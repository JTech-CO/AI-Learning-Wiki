import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'content-model', 'data');
const OUT = path.join(ROOT, 'public', 'data');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const courses = JSON.parse(await readFile(path.join(ROOT, 'content-model', 'courses.json'), 'utf8'));
const modules = await Promise.all((await walk(DATA)).map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
modules.sort((a, b) => courses.findIndex((course) => course.id === a.course) - courses.findIndex((course) => course.id === b.course) || a.order - b.order);

const route = (mod) => {
  const number = String(mod.order).padStart(2, '0');
  const tail = mod.id.split('/').at(-1);
  const slug = tail.startsWith(number) ? tail : `${number}-${tail}`;
  return `/courses/${mod.course}/${slug}/`;
};
const catalog = modules.map((mod) => ({
  id: mod.id,
  course: mod.course,
  order: mod.order,
  title: mod.title.ko,
  summary: mod.summary?.ko ?? '',
  difficulty: mod.difficulty ?? 'basic',
  tags: mod.tags ?? [],
  concepts: mod.concepts ?? [],
  estimatedMinutes: mod.estimatedMinutes ?? 20,
  url: route(mod),
}));

const prompts = modules.flatMap((mod) => (mod.prompts ?? []).map((prompt, index) => ({
  id: prompt.id ?? `${mod.id}-p${index + 1}`,
  moduleId: mod.id,
  course: mod.course,
  moduleTitle: mod.title.ko,
  title: prompt.title.ko,
  template: prompt.template.ko,
  notes: prompt.notes?.ko ?? '',
  tags: prompt.tags ?? [],
  examples: (prompt.examples ?? []).map((example) => ({
    label: example.label.ko,
    input: example.input.ko,
    output: example.output?.ko ?? '',
  })),
  url: route(mod),
})));

await mkdir(OUT, { recursive: true });
await Promise.all([
  writeFile(path.join(OUT, 'catalog.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), courses, modules: catalog }, null, 2)}\n`, 'utf8'),
  writeFile(path.join(OUT, 'prompts.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), prompts }, null, 2)}\n`, 'utf8'),
]);
console.log(`app data: ${catalog.length} modules, ${prompts.length} prompts`);

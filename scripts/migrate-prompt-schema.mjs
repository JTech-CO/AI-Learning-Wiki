import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'content-model', 'data');
const BUILDER = path.join(ROOT, 'scripts', 'build-pages.mjs');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const files = await walk(DATA);
let modulesChanged = 0;
let promptsSeen = 0;
let legacyCharacters = 0;
let migratedCharacters = 0;

for (const file of files) {
  const original = JSON.parse(await readFile(file, 'utf8'));
  const info = await stat(file);
  let changed = false;
  const prompts = (original.prompts ?? []).map((prompt) => {
    promptsSeen += 1;
    const template = prompt.template ?? prompt.text;
    legacyCharacters += (prompt.text?.ko ?? prompt.template?.ko ?? '').length;
    migratedCharacters += (template?.ko ?? '').length;
    if (prompt.text !== undefined || prompt.examples === undefined) changed = true;
    return {
      ...(prompt.id ? { id: prompt.id } : {}),
      title: prompt.title,
      template,
      examples: prompt.examples ?? [],
      ...(prompt.notes ? { notes: prompt.notes } : {}),
      ...(prompt.model ? { model: prompt.model } : {}),
      ...(prompt.tags ? { tags: prompt.tags } : {}),
    };
  });

  const source = { ...(original.source ?? {}) };
  if (!source.platform) { source.platform = 'eduverse-ai.app'; changed = true; }
  if (!source.url) { source.url = `https://eduverse-ai.app/learn?course=${encodeURIComponent(original.course)}`; changed = true; }
  if (!source.capturedAt) {
    source.capturedAt = info.mtime.toISOString();
    source.captureTimeBasis = 'file-mtime-estimate';
    changed = true;
  }

  if (changed) {
    original.prompts = prompts;
    original.source = source;
    await writeFile(file, `${JSON.stringify(original, null, 2)}\n`, 'utf8');
    modulesChanged += 1;
  }
}

if (legacyCharacters !== migratedCharacters) {
  throw new Error(`prompt text loss detected: ${legacyCharacters} -> ${migratedCharacters}`);
}

let builder = await readFile(BUILDER, 'utf8');
const oldModuleBlock = [
  '      const text = pick(p.text, lang);',
  "      if (text) out.push('\\n```text\\n' + text.trim() + '\\n```\\n');",
  '      const notes = pick(p.notes, lang);',
].join('\n');
const newModuleBlock = [
  '      const template = pick(p.template ?? p.text, lang);',
  "      if (template) out.push('\\n```text\\n' + template.trim() + '\\n```\\n');",
  '      for (const example of p.examples ?? []) {',
  "        out.push(`#### ${pick(example.label, lang) ?? '작성 예시'}`);",
  '        const input = pick(example.input, lang);',
  "        if (input) out.push('\\n**입력**\\n\\n```text\\n' + input.trim() + '\\n```\\n');",
  '        const output = pick(example.output, lang);',
  "        if (output) out.push('**기대 결과**\\n\\n' + output + '\\n');",
  '      }',
  "      if (!(p.examples ?? []).length) out.push('> 확인된 작성 예시 없음\\n');",
  '      const notes = pick(p.notes, lang);',
].join('\n');
if (builder.includes(oldModuleBlock)) builder = builder.replace(oldModuleBlock, newModuleBlock);
else if (!builder.includes('p.template ?? p.text')) throw new Error('module prompt render block not found');

const oldLibrary = '${(pick(prompt.text, lang) ?? \'\').trim()}';
const newLibrary = '${(pick(prompt.template ?? prompt.text, lang) ?? \'\').trim()}';
if (builder.includes(oldLibrary)) builder = builder.replace(oldLibrary, newLibrary);
else if (!builder.includes('prompt.template ?? prompt.text')) throw new Error('prompt library render block not found');

await writeFile(BUILDER, builder, 'utf8');
console.log(`prompt migration: ${modulesChanged} modules, ${promptsSeen} prompts, ${migratedCharacters} Korean characters preserved`);

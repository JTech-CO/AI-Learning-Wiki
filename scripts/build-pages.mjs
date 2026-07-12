// 원본 모듈에서는 프롬프트만 공개 데이터로 사용한다.
// 기존 따라하기 페이지와 개념 역색인은 공개 사이트에서 제거한다.
import { readFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const files = await walk('content-model/data');
const modules = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
const promptCount = modules.reduce((sum, mod) => sum + (mod.prompts?.length ?? 0), 0);
await Promise.all([
  rm('src/content/docs/courses', { recursive: true, force: true }),
  rm('src/content/docs/concepts', { recursive: true, force: true }),
  rm('src/content/docs/prompts.md', { force: true }),
]);
console.log('prompt integration: ' + modules.length + ' source modules -> ' + promptCount + ' prompts; legacy lesson pages removed');

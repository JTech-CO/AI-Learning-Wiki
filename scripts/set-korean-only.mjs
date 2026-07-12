import { readFile, writeFile } from 'node:fs/promises';

const path = new URL('./build-pages.mjs', import.meta.url);
const source = await readFile(path, 'utf8');
const before = "const LOCALES = ['ko', 'en', 'es', 'ja', 'zh'];";
if (!source.includes(before)) {
  throw new Error('build-pages.mjs의 LOCALES 선언을 찾지 못했습니다.');
}
await writeFile(path, source.replace(before, "const LOCALES = ['ko'];"), 'utf8');
console.log('페이지 생성을 한국어 단일 로케일로 변경했습니다.');

import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('./check-links.mjs', import.meta.url);
let source = await readFile(file, 'utf8');
source = source.replace("replace(/^\\/+/, '')", "replace(/^\\/+|\\/+$/g, '')");
await writeFile(file, source, 'utf8');
console.log('내부 링크의 끝 슬래시를 정규화했습니다.');

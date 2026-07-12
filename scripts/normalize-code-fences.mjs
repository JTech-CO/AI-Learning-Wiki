import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../content-model/data/ai-builder/19-schema-design.module.json', import.meta.url);
let source = await readFile(file, 'utf8');
source = source.replaceAll('```dbml', '```text');
await writeFile(file, source, 'utf8');
console.log('지원되지 않는 DBML 코드 펜스를 text로 변경했습니다.');

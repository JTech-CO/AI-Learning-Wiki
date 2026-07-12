import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../content-model/data/ai-builder/20-index-performance.module.json', import.meta.url);
const module = JSON.parse(await readFile(file, 'utf8'));
module.concepts = module.concepts.map((concept) => concept === 'index' ? 'database-index' : concept);
await writeFile(file, `${JSON.stringify(module, null, 2)}\n`, 'utf8');
console.log('예약 경로와 충돌하던 index 개념을 database-index로 변경했습니다.');

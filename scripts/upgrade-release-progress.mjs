import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('./qa-release.mjs', import.meta.url);
let source = await readFile(file, 'utf8');
source = source.replace("progress.completedModules === 305, `progress completed: ${progress.completedModules}`", "progress.totals?.complete === 305, `progress completed: ${progress.totals?.complete}`");
await writeFile(file, source, 'utf8');
console.log('진행률 QA를 totals.complete 구조에 맞췄습니다.');

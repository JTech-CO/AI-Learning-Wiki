import { readFile, writeFile } from 'node:fs/promises';

const config = new URL('../astro.config.mjs', import.meta.url);
let source = await readFile(config, 'utf8');
source = source.replaceAll(/\{ label: ('[^']+'), autogenerate: (\{ directory: '[^']+' \}) \}/g, "{ label: $1, items: [{ autogenerate: $2 }] }");
await writeFile(config, source, 'utf8');
console.log('Starlight 0.39 사이드바 형식으로 변경했습니다.');

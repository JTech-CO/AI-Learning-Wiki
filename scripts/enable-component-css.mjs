import { readFile, writeFile } from 'node:fs/promises';

const config = new URL('../astro.config.mjs', import.meta.url);
let source = await readFile(config, 'utf8');
source = source.replace("customCss: ['./src/styles/custom.css']", "customCss: ['./src/styles/custom.css', './src/styles/components.css']");
await writeFile(config, source, 'utf8');
console.log('컴포넌트 스타일을 연결했습니다.');

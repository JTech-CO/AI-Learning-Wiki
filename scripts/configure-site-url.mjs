import { readFile, writeFile } from 'node:fs/promises';

const config = new URL('../astro.config.mjs', import.meta.url);
let source = await readFile(config, 'utf8');
source = source.replace("site: 'https://ai-learning-wiki.internal',", "site: process.env.SITE_URL,");
await writeFile(config, source, 'utf8');
console.log('SITE_URL 환경 변수로 배포 주소를 주입하도록 변경했습니다.');

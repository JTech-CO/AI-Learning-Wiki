import { readFile, writeFile } from 'node:fs/promises';
const file = 'astro.config.mjs';
let source = await readFile(file, 'utf8');
source = source.replace("customCss: ['./src/styles/wiki.css']", "customCss: ['./src/styles/wiki.css', './src/styles/wiki-library.css']");
source = source.replace("description: 'AI와 LLM을 연결해 설명하는 한국어 백과사전',\n      customCss", "description: 'AI와 LLM을 연결해 설명하는 한국어 백과사전',\n      head: [{ tag: 'script', attrs: { src: '/wiki-course-progress.js', defer: true } }],\n      customCss");
await writeFile(file, source, 'utf8');
console.log('wiki library styles and course progress enabled');

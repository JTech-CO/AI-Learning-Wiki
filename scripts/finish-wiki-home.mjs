import { readFile, writeFile } from 'node:fs/promises';

let index = await readFile('src/content/docs/index.mdx', 'utf8');
index = index.replace('template: splash', 'template: doc');
await writeFile('src/content/docs/index.mdx', index, 'utf8');

let home = await readFile('src/components/wiki/WikiHome.astro', 'utf8');
home = home.replace('<h1>AI Learning Wiki</h1>', '<p class="wiki-home-name">AI Learning Wiki</p>');
await writeFile('src/components/wiki/WikiHome.astro', home, 'utf8');

let css = await readFile('src/styles/wiki.css', 'utf8');
css = css.replace('.wiki-home-intro h1 { margin: 0 0 .55rem; border: 0; padding: 0; }', '.wiki-home-name { margin: 0 0 .55rem; font-family: Georgia, "Noto Serif KR", serif; font-size: 1.5rem; font-weight: 700; }');
await writeFile('src/styles/wiki.css', css, 'utf8');
console.log('wiki home now uses the standard sidebar document layout');

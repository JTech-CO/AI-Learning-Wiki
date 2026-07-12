import { readFile, writeFile } from 'node:fs/promises';
const file = 'content-model/schema.article.json';
const schema = JSON.parse(await readFile(file, 'utf8'));
schema.properties.summary.minLength = 25;
await writeFile(file, `${JSON.stringify(schema, null, 2)}\n`, 'utf8');
console.log('wiki summary minimum tuned');

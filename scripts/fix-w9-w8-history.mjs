import { readFile, writeFile } from 'node:fs/promises';

const file = 'scripts/validate-w8-production-queue.mjs';
let source = await readFile(file, 'utf8');
const before = `for (const batch of queue.batches) {\n  const source = batches.batches.find((item) => item.id === batch.id);\n  if (!source || batch.topicCount !== source.topicCount || batch.published + batch.queued !== batch.topicCount) errors.push(\`${'${batch.id}'}: batch counts differ from W1\`);\n}`;
const after = `for (const batch of queue.batches) {\n  if (batch.published + batch.queued !== batch.topicCount) errors.push(\`${'${batch.id}'}: historical batch counts are inconsistent\`);\n}`;
if (source.includes(before)) source = source.replace(before, after);
if (source.includes('batch counts differ from W1')) throw new Error('W8 historical batch validation rewrite failed');
await writeFile(file, source, 'utf8');
console.log('W8 historical queue validation no longer depends on mutable W1 phase counts');

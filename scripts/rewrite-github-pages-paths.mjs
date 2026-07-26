import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const configuredBase = process.env.BASE_PATH ?? '/';
const BASE_PATH = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;

const prefixPath = (value) => {
  if (!BASE_PATH || typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  let normalized = value;
  while (normalized === `${BASE_PATH}${BASE_PATH}` || normalized.startsWith(`${BASE_PATH}${BASE_PATH}/`)) {
    normalized = normalized.slice(BASE_PATH.length);
  }
  if (normalized === BASE_PATH || normalized.startsWith(`${BASE_PATH}/`)) return normalized;
  return `${BASE_PATH}${normalized}`;
};

function rewriteStructured(value, key = '') {
  if (Array.isArray(value)) return value.map((item) => rewriteStructured(item, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [childKey, rewriteStructured(childValue, childKey)]),
    );
  }
  if (typeof value === 'string' && /^(?:url|href|src|start_url|scope|courseUrl|relatedWikiUrl)$/i.test(key)) {
    return prefixPath(value);
  }
  return value;
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

let htmlCount = 0;
let dataCount = 0;
for (const file of await walk(DIST)) {
  if (file.endsWith('.html')) {
    let source = await readFile(file, 'utf8');
    source = source.replace(
      /(\b(?:href|src|action|poster)=["'])(\/(?!\/)[^"']*)/gi,
      (_, lead, value) => `${lead}${prefixPath(value)}`,
    );
    await writeFile(file, source, 'utf8');
    htmlCount += 1;
    continue;
  }

  if (file.endsWith('.json') || file.endsWith('.webmanifest')) {
    const source = await readFile(file, 'utf8');
    try {
      const data = rewriteStructured(JSON.parse(source));
      await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
      dataCount += 1;
    } catch {
      // Files that are not structured JSON are left unchanged.
    }
  }
}

console.log(`GitHub Pages paths: ${htmlCount} HTML and ${dataCount} data files normalized to ${BASE_PATH || '/'}`);

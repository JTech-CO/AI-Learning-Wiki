import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const argumentValue = (name) => {
  const inline = argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};
const canonicalVerificationPath = 'content-model/evidence/source-verification.json';
const outputPath = argumentValue('--output') ?? canonicalVerificationPath;
const previousPath = argumentValue('--previous') ?? canonicalVerificationPath;
const refreshAll = argv.includes('--refresh');
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const articles = await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))));
const registry = await readJson('content-model/evidence/source-registry.json');
let previous = { sources: [] };
try { previous = await readJson(previousPath); } catch {}
const previousByUrl = new Map(previous.sources.map((source) => [source.url, source]));
const runCheckedAt = new Date().toISOString();
const urlUsage = new Map();

for (const article of articles) {
  for (const source of article.sources) {
    const usage = urlUsage.get(source.url) ?? { articleIds: new Set(), anchorIds: new Set() };
    usage.articleIds.add(article.id);
    urlUsage.set(source.url, usage);
  }
}
for (const source of registry.sources) {
  const usage = urlUsage.get(source.canonicalUrl) ?? { articleIds: new Set(), anchorIds: new Set() };
  usage.anchorIds.add(source.id);
  urlUsage.set(source.canonicalUrl, usage);
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function request(url, method, attempt = 1) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const headers = {
      Accept: 'text/html,application/xhtml+xml,application/json,application/pdf;q=0.8,*/*;q=0.5',
      'User-Agent': 'AI-Learning-Wiki/1.0 source-metadata-audit (https://ai-wiki.kr/)',
    };
    if (method === 'GET') headers.Range = 'bytes=0-0';
    const response = await fetch(url, { method, redirect: 'follow', headers, signal: controller.signal });
    if ([429, 500, 502, 503, 504].includes(response.status) && attempt < 3) {
      await response.body?.cancel();
      await wait(500 * attempt);
      return request(url, method, attempt + 1);
    }
    await response.body?.cancel();
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function verify(url) {
  try {
    let response = await request(url, 'HEAD');
    if ([400, 403, 404, 405].includes(response.status)) response = await request(url, 'GET');
    const restricted = [401, 403, 429].includes(response.status);
    return {
      url,
      finalUrl: response.url || url,
      status: response.status,
      state: response.ok || (response.status >= 300 && response.status < 400)
        ? 'reachable'
        : restricted ? 'restricted' : 'unavailable',
      contentType: response.headers.get('content-type'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      checkedAt: runCheckedAt,
      error: null,
    };
  } catch (error) {
    return {
      url,
      finalUrl: url,
      status: null,
      state: 'unavailable',
      contentType: null,
      etag: null,
      lastModified: null,
      checkedAt: runCheckedAt,
      error: error.name === 'AbortError' ? 'timeout' : String(error.message ?? error).slice(0, 300),
    };
  }
}

const urls = [...urlUsage.keys()].sort();
const results = new Array(urls.length);
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const index = cursor;
    cursor += 1;
    results[index] = !refreshAll && previousByUrl.has(urls[index])
      ? previousByUrl.get(urls[index])
      : await verify(urls[index]);
  }
}
await Promise.all(Array.from({ length: 6 }, worker));

const sources = results.map((result) => {
  const usage = urlUsage.get(result.url);
  return {
    ...result,
    articleIds: [...usage.articleIds].sort(),
    anchorIds: [...usage.anchorIds].sort(),
  };
});
const count = (state) => sources.filter((source) => source.state === state).length;
const checkedTimes = sources.map((source) => Date.parse(source.checkedAt)).filter(Number.isFinite);
const checkedAt = checkedTimes.length > 0
  ? new Date(Math.max(...checkedTimes)).toISOString()
  : runCheckedAt;
const snapshot = {
  version: 'W2-2026-07-13',
  checkedAt,
  policy: {
    metadataOnly: true,
    storedProse: false,
    reachabilityDoesNotProveRelevance: true,
    incrementalChecks: true,
  },
  totals: {
    uniqueUrls: sources.length,
    articleUrls: sources.filter((source) => source.articleIds.length).length,
    anchorUrls: sources.filter((source) => source.anchorIds.length).length,
    reachable: count('reachable'),
    restricted: count('restricted'),
    unavailable: count('unavailable'),
  },
  sources,
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(
  `W2 source verification: ${sources.length} URLs; ${snapshot.totals.reachable} reachable, `
  + `${snapshot.totals.restricted} restricted, ${snapshot.totals.unavailable} unavailable; output ${outputPath}`,
);

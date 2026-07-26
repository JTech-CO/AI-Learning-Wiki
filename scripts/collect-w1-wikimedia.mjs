import { mkdir, readFile, writeFile } from 'node:fs/promises';

const ledger = JSON.parse(await readFile('content-model/taxonomy/topic-ledger.json', 'utf8'));
const outputFile = 'content-model/evidence/wikimedia-metadata.json';
const collectedAt = new Date().toISOString();
const batchSize = 50;
const requestDelayMs = 200;
const languages = [
  { code: 'ko', endpoint: 'https://ko.wikipedia.org/w/api.php', titleField: 'titleKo' },
  { code: 'en', endpoint: 'https://en.wikipedia.org/w/api.php', titleField: 'titleEn' },
];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchJson(url, attempt = 1) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'AI-Learning-Wiki/1.0 (https://ai-wiki.kr/)',
    },
  });
  if (response.ok) return response.json();
  if (attempt < 4 && [429, 500, 502, 503, 504].includes(response.status)) {
    await wait(500 * (2 ** (attempt - 1)));
    return fetchJson(url, attempt + 1);
  }
  throw new Error(`Wikimedia request failed: HTTP ${response.status} ${response.statusText}`);
}

function followTitle(input, redirects) {
  let current = input;
  const visited = new Set();
  while (redirects.has(current) && !visited.has(current)) {
    visited.add(current);
    current = redirects.get(current);
  }
  return current;
}

async function collectLanguage(language) {
  const result = new Map();
  for (let offset = 0; offset < ledger.topics.length; offset += batchSize) {
    const topics = ledger.topics.slice(offset, offset + batchSize);
    const titles = topics.map((topic) => topic[language.titleField]);
    if (titles.some((title) => title.includes('|'))) throw new Error(`${language.code}: a title contains the MediaWiki title delimiter`);
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      redirects: '1',
      maxlag: '5',
      prop: 'info|pageprops|revisions',
      inprop: 'url',
      rvprop: 'ids|timestamp',
      titles: titles.join('|'),
    });
    const payload = await fetchJson(`${language.endpoint}?${params}`);
    if (payload.error) throw new Error(`${language.code}: ${payload.error.code}: ${payload.error.info}`);
    const redirects = new Map();
    for (const item of payload.query?.normalized ?? []) redirects.set(item.from, item.to);
    for (const item of payload.query?.converted ?? []) redirects.set(item.from, item.to);
    for (const item of payload.query?.redirects ?? []) redirects.set(item.from, item.to);
    const pages = new Map((payload.query?.pages ?? []).map((page) => [page.title, page]));

    for (const topic of topics) {
      const queryTitle = topic[language.titleField];
      const resolvedTitle = followTitle(queryTitle, redirects);
      const page = pages.get(resolvedTitle);
      if (!page || page.missing || !Number.isInteger(page.pageid) || page.pageid < 1) {
        result.set(topic.id, null);
        continue;
      }
      const revision = page.revisions?.[0];
      result.set(topic.id, {
        language: language.code,
        queryTitle,
        title: page.title,
        pageId: page.pageid,
        canonicalUrl: page.canonicalurl,
        revisionId: revision?.revid ?? null,
        revisionTimestamp: revision?.timestamp ?? null,
        wikibaseItem: page.pageprops?.wikibase_item ?? null,
        accessedAt: collectedAt,
      });
    }
    if (offset + batchSize < ledger.topics.length) await wait(requestDelayMs);
  }
  return result;
}

const [ko, en] = await Promise.all(languages.map(collectLanguage));
const topics = Object.fromEntries(ledger.topics.map((topic) => [topic.id, { ko: ko.get(topic.id), en: en.get(topic.id) }]));
const count = (language) => Object.values(topics).filter((entry) => entry[language]).length;
const snapshot = {
  version: 'W1-2026-07-13',
  collectedAt,
  collectionMethod: {
    api: 'MediaWiki Action API',
    batchSize,
    metadataOnly: true,
    storedProse: false,
    matching: 'exact-title-or-redirect-only',
  },
  totals: {
    topics: ledger.topics.length,
    koFound: count('ko'),
    enFound: count('en'),
    bothFound: Object.values(topics).filter((entry) => entry.ko && entry.en).length,
    neitherFound: Object.values(topics).filter((entry) => !entry.ko && !entry.en).length,
  },
  topics,
};

await mkdir('content-model/evidence', { recursive: true });
await writeFile(outputFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`W1 Wikimedia metadata: ko ${snapshot.totals.koFound}, en ${snapshot.totals.enFound}, both ${snapshot.totals.bothFound}, neither ${snapshot.totals.neitherFound}`);

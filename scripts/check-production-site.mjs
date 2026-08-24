import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2);
const argumentValue = (name) => {
  const inline = argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
};
const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const configuredBase = argumentValue('--base-url') ?? process.env.SITE_URL ?? 'https://ai-wiki.kr';
const baseUrl = new URL(configuredBase);
baseUrl.pathname = '/';
baseUrl.search = '';
baseUrl.hash = '';
const outputPath = argumentValue('--output') ?? 'artifacts/maintenance/production-probe.json';
const attempts = Number(argumentValue('--attempts') ?? 3);
const timeoutMilliseconds = Number(argumentValue('--timeout-ms') ?? 15000);
const registry = await readJson('content-model/labs/registry.json');
const localCounts = {
  articles: (await readJson('public/data/wiki-index.json')).articles.length,
  prompts: (await readJson('public/data/prompts.json')).prompts.length,
  snippets: (await readJson('public/data/snippets.json')).snippets.length,
};
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const request = async (url, { responseType = 'text' } = {}) => {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'AI-Learning-Wiki/1.0 production-probe (https://ai-wiki.kr/)' },
      });
      const body = responseType === 'json' ? await response.json() : await response.text();
      if (response.ok) return { response, body, attempt };
      lastError = new Error(`HTTP ${response.status}`);
      if (![429, 500, 502, 503, 504].includes(response.status)) break;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
    if (attempt < attempts) await wait(400 * attempt);
  }
  throw lastError ?? new Error(`request failed: ${url}`);
};

const checks = [];
const record = async (id, run) => {
  try {
    const detail = await run();
    checks.push({ id, status: 'pass', ...detail });
  } catch (error) {
    checks.push({ id, status: 'fail', error: String(error.message ?? error).slice(0, 500) });
  }
};
const absolute = (route) => new URL(route, baseUrl).href;

await record('https-redirect', async () => {
  const insecure = new URL(baseUrl);
  insecure.protocol = 'http:';
  const { response, attempt } = await request(insecure.href);
  if (new URL(response.url).protocol !== 'https:') throw new Error(`HTTP did not resolve to HTTPS: ${response.url}`);
  return { requested: insecure.href, resolved: response.url, attempt };
});
await record('home-canonical', async () => {
  const { response, body, attempt } = await request(baseUrl.href);
  const canonical = body.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/iu)
    ?? body.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/iu);
  if (!canonical) throw new Error('home canonical link missing');
  if (new URL(canonical[1], baseUrl).href !== baseUrl.href) throw new Error(`home canonical mismatch: ${canonical[1]}`);
  return { url: response.url, canonical: canonical[1], attempt };
});

const routes = [
  '/',
  '/special/all-pages/',
  '/paths/',
  '/prompt-explorer/',
  '/snippet-explorer/',
  '/search/',
  '/lab/',
  ...registry.tools.filter((tool) => tool.status === 'active').map((tool) => tool.route),
  '/sitemap-index.xml',
];
for (const route of routes) {
  await record(`route:${route}`, async () => {
    const { response, attempt } = await request(absolute(route));
    return { url: response.url, statusCode: response.status, attempt };
  });
}

const dataContracts = [
  { id: 'wiki-index', route: '/data/wiki-index.json', key: 'articles', expected: localCounts.articles },
  { id: 'prompts', route: '/data/prompts.json', key: 'prompts', expected: localCounts.prompts },
  { id: 'snippets', route: '/data/snippets.json', key: 'snippets', expected: localCounts.snippets },
];
for (const contract of dataContracts) {
  await record(`data:${contract.id}`, async () => {
    const { response, body, attempt } = await request(absolute(contract.route), { responseType: 'json' });
    const actual = body?.[contract.key]?.length;
    if (actual !== contract.expected) throw new Error(`count mismatch: expected ${contract.expected}, received ${actual}`);
    return { url: response.url, count: actual, expected: contract.expected, attempt };
  });
}

const report = {
  schemaVersion: '1.0',
  checkedAt: new Date().toISOString(),
  baseUrl: baseUrl.href,
  status: checks.every((check) => check.status === 'pass') ? 'pass' : 'fail',
  localCounts,
  totals: {
    checks: checks.length,
    passed: checks.filter((check) => check.status === 'pass').length,
    failed: checks.filter((check) => check.status === 'fail').length,
  },
  checks,
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Production probe: ${report.totals.passed}/${report.totals.checks} checks passed; output ${outputPath}`);
if (report.status !== 'pass') process.exitCode = 1;

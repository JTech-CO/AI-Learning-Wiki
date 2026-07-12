import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('.');
const ARTICLE_DIR = path.join(ROOT, 'content-model', 'articles');
const OUT_DIR = path.join(ROOT, 'content-model', 'research');
const OUT_FILE = path.join(OUT_DIR, 'encyclopedia-sources.json');
const CACHE_FILE = path.join(OUT_DIR, 'encyclopedia-search-cache.json');
const USER_AGENT = 'AI-Learning-Wiki/0.1 (https://ai-learning-wiki.bryan131.chatgpt.site; educational research)';
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const articles = await Promise.all(
  (await readdir(ARTICLE_DIR)).filter((name) => name.endsWith('.article.json'))
    .map(async (name) => JSON.parse(await readFile(path.join(ARTICLE_DIR, name), 'utf8'))),
);
articles.sort((a, b) => a.id.localeCompare(b.id));

const contexts = {
  foundations: ['artificial intelligence machine learning', '인공지능 머신러닝'],
  mathematics: ['mathematics statistics machine learning', '수학 통계 머신러닝'],
  neural: ['artificial neural network deep learning', '인공 신경망 딥러닝'],
  transformer: ['transformer deep learning language model', '트랜스포머 딥러닝 언어 모델'],
  llm: ['large language model natural language processing', '대규모 언어 모델 자연어 처리'],
  training: ['machine learning model training', '머신러닝 모델 학습'],
  inference: ['machine learning inference computing', '머신러닝 추론 컴퓨팅'],
  retrieval: ['information retrieval machine learning', '정보 검색 머신러닝'],
  api: ['software development API computing', '소프트웨어 개발 API 컴퓨팅'],
  agents: ['artificial intelligence agent system', '인공지능 에이전트 시스템'],
  multimodal: ['multimodal artificial intelligence', '멀티모달 인공지능'],
  safety: ['artificial intelligence safety ethics', '인공지능 안전 윤리'],
  evaluation: ['machine learning evaluation metric', '머신러닝 평가 지표'],
  ecosystem: ['machine learning software open source', '머신러닝 소프트웨어 오픈소스'],
};

const queryOverrides = {
  accuracy: ['accuracy and precision machine learning', '정확도 정밀도 재현율 머신러닝'],
  attention: ['attention machine learning', '어텐션 기계 학습'],
  batch: ['batch machine learning training', '배치 기계 학습'],
  batching: ['batching machine learning inference', '배칭 기계 학습 추론'],
  bias: ['bias machine learning neural network', '편향 항 신경망'],
  completion: ['text generation language model completion', '텍스트 생성 언어 모델'],
  grounding: ['grounding artificial intelligence', '그라운딩 인공지능'],
  guardrail: ['AI guardrail artificial intelligence', '인공지능 가드레일'],
  hallucination: ['hallucination artificial intelligence', '인공지능 환각'],
  layer: ['layer deep learning neural network', '신경망 층 딥러닝'],
  matrix: ['matrix mathematics', '행렬 수학'],
  model: ['machine learning model', '기계 학습 모델'],
  neuron: ['artificial neuron', '인공 뉴런'],
  optimization: ['mathematical optimization machine learning', '수학적 최적화 머신러닝'],
  parameter: ['parameter machine learning', '매개변수 기계 학습'],
  planning: ['automated planning artificial intelligence', '자동 계획 인공지능'],
  prompt: ['prompt engineering artificial intelligence', '프롬프트 엔지니어링 인공지능'],
  temperature: ['temperature language model sampling', '언어 모델 생성 온도 샘플링'],
  token: ['token natural language processing', '토큰 자연어 처리'],
  transformer: ['transformer deep learning', '변환기 딥러닝'],
  vector: ['vector mathematics', '벡터 수학'],
  weight: ['weight artificial neural network', '가중치 인공 신경망'],
};

const decode = (value) => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const normalize = (value) => decode(value).toLowerCase().replace(/[^a-z0-9가-힣]+/g, ' ').trim();
const negative = /film|album|song|television|franchise|character|company|municipality|surname|영화|음반|노래|등장인물|프랜차이즈/;

async function fetchJson(url, attempts = 5) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': USER_AGENT, 'api-user-agent': USER_AGENT }, signal: AbortSignal.timeout(30000) });
      if (response.status === 429) {
        const retry = Math.min(Math.max(Number(response.headers.get('retry-after') ?? 20), 10), 90);
        await wait(retry * 1000);
        continue;
      }
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(1200 * attempt);
    }
  }
  throw lastError ?? new Error('request failed');
}

const score = (needle, page) => {
  const expected = normalize(needle);
  const title = normalize(page.title);
  const text = `${title} ${normalize(page.description)} ${normalize(page.excerpt)}`;
  const words = expected.split(' ').filter((word) => word.length > 1 && !['and', 'model', 'system'].includes(word));
  let value = title === expected ? 70 : title.includes(expected) || expected.includes(title) ? 35 : 0;
  for (const word of words) if (text.includes(word)) value += 7;
  if (/machine learning|artificial intelligence|neural|language model|mathemat|software|comput|기계 학습|인공지능|신경망|언어 모델|수학|소프트웨어/.test(text)) value += 16;
  if (negative.test(text)) value -= 100;
  return value;
};

async function search(lang, query, expected) {
  const url = `https://${lang}.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=8`;
  const data = await fetchJson(url);
  const ranked = (data.pages ?? []).map((page) => ({ ...page, score: score(expected, page) })).sort((a, b) => b.score - a.score);
  const selected = ranked[0];
  return selected ? {
    title: selected.title,
    key: selected.key,
    url: `https://${lang}.wikipedia.org/wiki/${selected.key}`,
    description: decode(selected.description),
    excerpt: decode(selected.excerpt),
    score: selected.score,
    candidates: ranked.slice(0, 3).map((page) => ({ title: page.title, score: page.score })),
  } : null;
}

await mkdir(OUT_DIR, { recursive: true });
let cache = [];
try { cache = JSON.parse(await readFile(CACHE_FILE, 'utf8')); } catch {}
const cached = new Map(cache.map((item) => [item.id, item]));
const matches = [];
for (const [index, article] of articles.entries()) {
  let match = cached.get(article.id);
  if (!match) {
    const context = contexts[article.categories[0]] ?? contexts.foundations;
    const queries = queryOverrides[article.id] ?? [`${article.englishTitle} ${context[0]}`, `${article.title} ${context[1]}`];
    match = {
      id: article.id,
      wikipedia: {
        en: await search('en', queries[0], article.englishTitle),
        ko: await search('ko', queries[1], article.title),
      },
    };
    cache.push(match);
    await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
  }
  matches.push(match);
  if ((index + 1) % 10 === 0) console.log(`Wikipedia REST: ${index + 1}/${articles.length}`);
  await wait(650);
}

const grokipediaRobots = await (await fetch('https://grokipedia.com/robots.txt', { headers: { 'user-agent': USER_AGENT }, signal: AbortSignal.timeout(30000) })).text();
if (!/Disallow:\s*\/api\//i.test(grokipediaRobots)) throw new Error('Unexpected Grokipedia robots policy; review before crawling');

async function grokipediaMetadata(key) {
  if (!key) return null;
  const url = `https://grokipedia.com/page/${encodeURIComponent(key).replace(/%2F/gi, '/')}`;
  try {
    const response = await fetch(url, { headers: { 'user-agent': USER_AGENT }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
    if (!response.ok || !response.url.includes('/page/')) return null;
    const html = await response.text();
    const title = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
    if (!title || /not found|404/i.test(title)) return null;
    const headings = [...html.matchAll(/<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/gi)].map((item) => decode(item[1])).filter(Boolean).slice(0, 16);
    return { title, url: response.url, headings };
  } catch { return null; }
}

const records = [];
for (const [index, article] of articles.entries()) {
  const match = matches[index];
  records.push({ ...match, grokipedia: await grokipediaMetadata(match.wikipedia.en?.key) });
  if ((index + 1) % 15 === 0) console.log(`Grokipedia public pages: ${index + 1}/${articles.length}`);
  await wait(180);
}

const output = {
  fetchedAt: new Date().toISOString(),
  policy: {
    wikipedia: 'Official Wikimedia REST search API. Only short discovery metadata is stored; article prose is not copied into the site.',
    grokipedia: 'Public /page/ title and heading metadata only. /api/ was not accessed because robots.txt disallows it.',
  },
  records,
};
await writeFile(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`source research: ${records.length} records, ${records.filter((item) => item.wikipedia.en).length} enwiki, ${records.filter((item) => item.wikipedia.ko).length} kowiki, ${records.filter((item) => item.grokipedia).length} Grokipedia`);

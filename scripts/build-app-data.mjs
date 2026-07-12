import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'content-model', 'data');
const OUT = path.join(ROOT, 'public', 'data');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const courses = JSON.parse(await readFile(path.join(ROOT, 'content-model', 'courses.json'), 'utf8'));
const modules = await Promise.all((await walk(DATA)).map(async (file) => JSON.parse(await readFile(file, 'utf8'))));
modules.sort((a, b) => courses.findIndex((course) => course.id === a.course) - courses.findIndex((course) => course.id === b.course) || a.order - b.order);

const route = (mod) => {
  const number = String(mod.order).padStart(2, '0');
  const tail = mod.id.split('/').at(-1);
  const slug = tail.startsWith(number) ? tail : `${number}-${tail}`;
  return `/courses/${mod.course}/${slug}/`;
};
const wikiArticleSlugs = new Set(
  (await readdir(path.join(ROOT, 'src', 'content', 'docs', 'wiki')))
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -3)),
);

const wikiCourses = {
  'ai-foundations': { title: 'AI 기초', url: '/course/ai-foundations/' },
  'llm-internals': { title: 'LLM 내부 구조', url: '/course/llm-internals/' },
  'model-training': { title: '모델 학습과 튜닝', url: '/course/model-training/' },
  'rag-search': { title: '임베딩과 RAG', url: '/course/rag-search/' },
  'api-development': { title: 'AI API 개발', url: '/course/api-development/' },
  'agent-systems': { title: 'AI 에이전트', url: '/course/agent-systems/' },
  'responsible-ai': { title: '신뢰할 수 있는 AI', url: '/course/responsible-ai/' },
  'multimodal-ai': { title: '멀티모달 AI', url: '/course/multimodal-ai/' },
};

const courseRules = [
  ['multimodal-ai', /image|이미지|multimodal|video|audio|voice|speech|ocr|vision|canva|gamma|presentation|slide/i],
  ['responsible-ai', /hallucination|verification|fact|citation|bias|safety|privacy|security|compliance|source|검증|보안|환각|편향/i],
  ['agent-systems', /agent|automation|workflow|mcp|tool.call|orchestrat|n8n|zapier|webhook|에이전트|자동화/i],
  ['rag-search', /rag|embedding|vector|retriev|semantic.search|chunk|검색|임베딩/i],
  ['model-training', /training|fine.tun|lora|rlhf|dpo|dataset|evaluation|benchmark|distill|quantiz|학습|튜닝/i],
  ['api-development', /api|sdk|json|http|python|typescript|javascript|database|deploy|hosting|code|github|git|environment|app|개발|코드/i],
  ['llm-internals', /llm|transformer|token|context.window|model|inference|temperature|attention|language.model|모델|토큰/i],
];

const sourceCourseDefaults = {
  'ai-builder': 'api-development',
  'ai-engineer': 'llm-internals',
  automation: 'agent-systems',
  'ai-trends': 'llm-internals',
};

const wikiKeywordRules = [
  ['image-generation', /image|이미지|canva|vision/i],
  ['multimodal-model', /multimodal|video|audio|voice|speech|ocr/i],
  ['hallucination', /hallucination|환각/i],
  ['citation', /citation|출처|인용/i],
  ['privacy', /privacy|개인정보/i],
  ['bias-fairness', /bias|fairness|편향/i],
  ['guardrail', /safety|security|compliance|보안|안전/i],
  ['ai-agent', /agent|에이전트/i],
  ['mcp', /(^|\W)mcp(\W|$)/i],
  ['workflow-orchestration', /automation|workflow|orchestrat|n8n|zapier|자동화/i],
  ['tool-calling', /tool.call|function.call/i],
  ['rag', /(^|\W)rag(\W|$)/i],
  ['embedding', /embedding|임베딩/i],
  ['vector-database', /vector|벡터/i],
  ['semantic-search', /retriev|semantic.search|검색/i],
  ['fine-tuning', /fine.tun|튜닝/i],
  ['lora', /(^|\W)lora(\W|$)/i],
  ['training-data', /training|학습 데이터/i],
  ['dataset', /dataset|데이터셋/i],
  ['evaluation', /evaluation|benchmark|평가/i],
  ['api', /(^|\W)api(\W|$)|sdk|개발/i],
  ['json', /(^|\W)json(\W|$)/i],
  ['http-request', /http|request|요청/i],
  ['webhook', /webhook/i],
  ['large-language-model', /llm|language.model|언어 모델/i],
  ['transformer', /transformer|트랜스포머/i],
  ['token', /token|토큰/i],
  ['context-window', /context.window|컨텍스트 윈도/i],
  ['temperature', /temperature|온도/i],
  ['model', /model|모델/i],
  ['prompt', /prompt|프롬프트/i],
];

const searchableText = (mod, prompt) => [
  mod.title?.ko,
  mod.summary?.ko,
  ...(mod.concepts ?? []),
  ...(mod.tags ?? []),
  prompt.title?.ko,
  prompt.template?.ko,
  ...(prompt.tags ?? []),
].filter(Boolean).join(' ');

const classifyWikiCourse = (mod, prompt) => {
  const text = searchableText(mod, prompt);
  const matched = courseRules.find(([, pattern]) => pattern.test(text));
  const id = matched?.[0] ?? sourceCourseDefaults[mod.course] ?? 'ai-foundations';
  return { id, ...wikiCourses[id] };
};

const normalizeSlug = (value) => String(value).trim().toLowerCase().replace(/[_\s]+/g, '-');
const relatedWikiUrl = (mod, prompt) => {
  const candidates = [...(mod.concepts ?? []), ...(prompt.tags ?? [])].map(normalizeSlug);
  const exact = candidates.find((slug) => slug !== 'prompt' && wikiArticleSlugs.has(slug))
    ?? candidates.find((slug) => wikiArticleSlugs.has(slug));
  if (exact) return `/wiki/${exact}/`;
  const text = searchableText(mod, prompt);
  const keyword = wikiKeywordRules.find(([, pattern]) => pattern.test(text))?.[0] ?? 'prompt';
  return `/wiki/${keyword}/`;
};

const catalog = modules.map((mod) => ({
  id: mod.id,
  course: mod.course,
  order: mod.order,
  title: mod.title.ko,
  summary: mod.summary?.ko ?? '',
  difficulty: mod.difficulty ?? 'basic',
  tags: mod.tags ?? [],
  concepts: mod.concepts ?? [],
  estimatedMinutes: mod.estimatedMinutes ?? 20,
  url: route(mod),
}));

const prompts = modules.flatMap((mod) => (mod.prompts ?? []).map((prompt, index) => {
  const wikiCourse = classifyWikiCourse(mod, prompt);
  const wikiUrl = relatedWikiUrl(mod, prompt);
  return {
    id: prompt.id ?? `${mod.id}-p${index + 1}`,
    moduleId: mod.id,
    sourceCourse: mod.course,
    course: wikiCourse.id,
    courseTitle: wikiCourse.title,
    courseUrl: wikiCourse.url,
    moduleTitle: mod.title.ko,
    title: prompt.title.ko,
    template: prompt.template.ko,
    notes: prompt.notes?.ko ?? '',
    tags: prompt.tags ?? [],
    examples: (prompt.examples ?? []).map((example) => ({
      label: example.label.ko,
      input: example.input.ko,
      output: example.output?.ko ?? '',
    })),
    relatedWikiUrl: wikiUrl,
    sourceUrl: route(mod),
    url: wikiUrl,
  };
}));

await mkdir(OUT, { recursive: true });
await Promise.all([
  writeFile(path.join(OUT, 'catalog.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), courses, modules: catalog }, null, 2)}\n`, 'utf8'),
  writeFile(path.join(OUT, 'prompts.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), prompts }, null, 2)}\n`, 'utf8'),
]);
console.log(`app data: ${catalog.length} modules, ${prompts.length} prompts`);

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'content-model', 'data');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

const rules = [
  [/prompt.*injection|injection.*prompt/, ['prompt-injection', 'security']],
  [/rag/, ['rag']],
  [/agent/, ['agent']],
  [/mcp/, ['mcp']],
  [/prompt/, ['prompt']],
  [/embed/, ['embedding']],
  [/vector/, ['vector-search']],
  [/llm|local-llm|ollama|model/, ['llm']],
  [/python|py-/, ['python']],
  [/api/, ['api']],
  [/database|db-|sql/, ['database']],
  [/webhook/, ['webhook']],
  [/scrap/, ['web-scraping']],
  [/automat|workflow|pipeline/, ['automation']],
  [/security|secret|guard|defense/, ['security']],
  [/cost|pricing|unit-economics|rate/, ['cost-control']],
  [/monitor|logging|tracing|observability/, ['observability']],
  [/deploy|server|production|hosting/, ['deployment']],
  [/github|git-/, ['git']],
  [/marketing|sales|outreach|funnel|seo/, ['marketing']],
  [/finance|income|money|paying|payment|tax|invest/, ['monetization']],
  [/freelance|client|proposal/, ['freelancing']],
  [/saas|mvp|product/, ['product-building']],
  [/image|video|voice|audio/, ['multimodal-ai']],
  [/fine.?tune|lora|distill/, ['fine-tuning']],
  [/eval|benchmark|test/, ['evaluation']],
  [/research|retrieval/, ['research']],
  [/data|json|spreadsheet/, ['data']],
];

let changed = 0;
for (const file of await walk(DATA)) {
  const mod = JSON.parse(await readFile(file, 'utf8'));
  if (mod.source?.method !== 'api-capture') continue;
  const haystack = `${mod.id} ${(mod.tags ?? []).join(' ')}`.toLowerCase();
  const concepts = [];
  for (const [pattern, values] of rules) {
    if (pattern.test(haystack)) concepts.push(...values);
  }
  if (!concepts.length) concepts.push(mod.course === 'ai-finance' ? 'monetization' : mod.course);
  mod.concepts = [...new Set(concepts)].slice(0, 8);
  await writeFile(file, `${JSON.stringify(mod, null, 2)}\n`, 'utf8');
  changed += 1;
}
console.log(`concept tags normalized: ${changed}`);


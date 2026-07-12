import { mkdir, writeFile } from 'node:fs/promises';
import { loadW0Taxonomy } from './w0-taxonomy-lib.mjs';

const { config, topics, errors, digest } = await loadW0Taxonomy();
if (errors.length) {
  console.error(`W0 taxonomy build: ${errors.length} error(s)\n${errors.slice(0, 80).join('\n')}`);
  process.exit(1);
}

const byCategory = Object.fromEntries(config.categories.map((category) => {
  const members = topics.filter((topic) => topic.primaryCategory === category.id);
  return [category.id, {
    title: category.title,
    total: members.length,
    existing: members.filter((topic) => topic.state === 'existing').length,
    candidate: members.filter((topic) => topic.state === 'candidate').length,
    tiers: Object.fromEntries(Object.keys(config.tierQuota).map((tier) => [tier, members.filter((topic) => topic.tier === tier).length])),
    subareas: Object.fromEntries(Object.keys(category.subareas).map((subarea) => [subarea, members.filter((topic) => topic.subarea === subarea).length])),
  }];
}));

const ledger = {
  version: config.version,
  generatedAt: '2026-07-13T00:00:00+09:00',
  target: { categories: config.categories.length, perCategory: config.targetPerCategory, total: topics.length },
  topics,
};
const summary = {
  version: config.version,
  catalogSha256: digest,
  totals: {
    topics: topics.length,
    existing: topics.filter((topic) => topic.state === 'existing').length,
    candidates: topics.filter((topic) => topic.state === 'candidate').length,
    categories: config.categories.length,
  },
  byCategory,
};

await mkdir('content-model/taxonomy', { recursive: true });
await Promise.all([
  writeFile('content-model/taxonomy/topic-ledger.json', `${JSON.stringify(ledger, null, 2)}\n`, 'utf8'),
  writeFile('content-model/taxonomy/w0-summary.json', `${JSON.stringify(summary, null, 2)}\n`, 'utf8'),
]);
console.log(`W0 taxonomy built: ${topics.length} topics (${summary.totals.existing} existing + ${summary.totals.candidates} candidates), ${config.categories.length} categories`);

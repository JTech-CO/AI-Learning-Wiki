import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

export async function loadW0Taxonomy() {
  const config = await readJson('content-model/taxonomy/categories.json');
  const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
  const articles = await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))));
  const articleById = new Map(articles.map((article) => [article.id, article]));
  const errors = [];
  const topics = [];
  const seenIds = new Map();
  const seenEnglishTitles = new Map();

  const seedFiles = (await readdir('content-model/taxonomy/seed')).filter((file) => file.endsWith('.tsv')).sort();
  const expectedFiles = config.categories.map((category) => `${category.id}.tsv`).sort();
  if (JSON.stringify(seedFiles) !== JSON.stringify(expectedFiles)) errors.push(`seed files differ: ${seedFiles.join(', ')}`);

  for (const category of config.categories) {
    const file = `content-model/taxonomy/seed/${category.id}.tsv`;
    const lines = (await readFile(file, 'utf8')).trim().split(/\r?\n/).filter(Boolean);
    const subareaCounts = Object.fromEntries(Object.keys(category.subareas).map((id) => [id, 0]));
    if (lines.length !== config.targetPerCategory) errors.push(`${category.id}: expected ${config.targetPerCategory} topics, found ${lines.length}`);

    for (const [index, line] of lines.entries()) {
      const cells = line.split('\t');
      if (cells.length !== 5) {
        errors.push(`${category.id}:${index + 1}: expected 5 TSV fields, found ${cells.length}`);
        continue;
      }
      const [id, titleKo, titleEn, subarea, volatility] = cells;
      if (!/^[a-z0-9-]+$/.test(id)) errors.push(`${category.id}:${index + 1}: invalid id ${id}`);
      if (!titleKo || !titleEn) errors.push(`${category.id}:${index + 1}: empty title`);
      if (!(subarea in category.subareas)) errors.push(`${category.id}:${index + 1}: unknown subarea ${subarea}`);
      else subareaCounts[subarea] += 1;
      if (!['evergreen', 'periodic', 'fast-changing'].includes(volatility)) errors.push(`${category.id}:${index + 1}: invalid volatility ${volatility}`);
      if (seenIds.has(id)) errors.push(`duplicate topic id ${id}: ${seenIds.get(id)} and ${category.id}`);
      else seenIds.set(id, category.id);
      const normalizedEnglish = titleEn.toLocaleLowerCase('en').replace(/[^a-z0-9]+/g, ' ').trim();
      if (seenEnglishTitles.has(normalizedEnglish)) errors.push(`duplicate English title ${titleEn}: ${seenEnglishTitles.get(normalizedEnglish)} and ${id}`);
      else seenEnglishTitles.set(normalizedEnglish, id);

      const article = articleById.get(id);
      if (article && article.categories[0] !== category.id) errors.push(`${id}: existing primary category ${article.categories[0]} differs from ${category.id}`);
      if (article && (article.title !== titleKo || article.englishTitle !== titleEn)) errors.push(`${id}: existing title differs from taxonomy title`);
      const rank = index + 1;
      const tier = rank <= config.tierQuota.core ? 'core' : rank <= config.tierQuota.core + config.tierQuota.standard ? 'standard' : 'brief';
      topics.push({ id, titleKo, titleEn, primaryCategory: category.id, subarea, rank, tier, state: article ? 'existing' : 'candidate', volatility });
    }

    for (const [subarea, quota] of Object.entries(category.subareas)) {
      if (subareaCounts[subarea] !== quota) errors.push(`${category.id}/${subarea}: expected ${quota}, found ${subareaCounts[subarea]}`);
    }
  }

  for (const article of articles) if (!seenIds.has(article.id)) errors.push(`existing article missing from taxonomy: ${article.id}`);
  if (topics.length !== 1400) errors.push(`expected 1400 topics, found ${topics.length}`);
  if (topics.filter((topic) => topic.state === 'existing').length !== articles.length) errors.push('existing topic count differs from article count');
  if (articles.length < 150 || articles.length > 1400) errors.push(`expected 150–1400 existing articles, found ${articles.length}`);

  const digest = createHash('sha256').update(JSON.stringify(topics)).digest('hex');
  return { config, articles, topics, errors, digest };
}

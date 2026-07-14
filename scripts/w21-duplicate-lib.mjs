import { createHash } from 'node:crypto';
import { normalizeParagraph } from './w19-quality-lib.mjs';

export const W21_VERSION = 'W21-2026-07-15';
export const W21_SNAPSHOT_DATE = '2026-07-15';
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const isPairedHeading = (value) => /^\*\*[^*\n]+\*\*$/.test(value.trim());

export function normalizeArticleDuplicates(article) {
  const seenNormalized = new Set();
  const seenRaw = new Set();
  const removals = { rawExact: 0, normalizedEquivalent: 0, paragraphs: 0, pairedHeadings: 0, total: 0 };
  const affectedSections = new Set();
  const sections = article.sections.map((section) => {
    const parts = section.body.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
    const output = [];
    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index];
      if (part.length >= 60) {
        const rawKey = part.replace(/\s+/g, ' ').trim();
        const normalizedKey = normalizeParagraph(part, article);
        const rawExact = seenRaw.has(rawKey);
        seenRaw.add(rawKey);
        if (seenNormalized.has(normalizedKey)) {
          removals[rawExact ? 'rawExact' : 'normalizedEquivalent'] += 1;
          removals.paragraphs += 1;
          removals.total += 1;
          affectedSections.add(section.id);
          const previous = parts[index - 1];
          if (previous && isPairedHeading(previous) && output.at(-1) === previous) {
            output.pop();
            removals.pairedHeadings += 1;
          }
          continue;
        }
        seenNormalized.add(normalizedKey);
      }
      output.push(part);
    }
    return { ...section, body: output.join('\n\n') };
  });
  return { article: { ...article, sections }, removals, affectedSections: [...affectedSections].sort() };
}

export const countArticleDuplicateBlocks = (article) => normalizeArticleDuplicates(article).removals;

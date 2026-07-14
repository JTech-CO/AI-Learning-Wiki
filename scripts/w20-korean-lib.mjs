import { createHash } from 'node:crypto';

export const W20_VERSION = 'W20-2026-07-15';
export const W20_SNAPSHOT_DATE = '2026-07-15';
export const BANNED_LITERAL_TRANSLATIONS = ['정확·사실형', '온도 낮춤', '(온도 낮춤)', '정확형 모드'];

export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const occurrences = (text, needle) => needle ? text.split(needle).length - 1 : 0;
const endingProfile = (title) => {
  const chars = [...String(title).trim()];
  const code = chars.at(-1)?.charCodeAt(0) ?? 0;
  if (code >= 0xac00 && code <= 0xd7a3) {
    const jong = (code - 0xac00) % 28;
    return { hasBatchim: jong !== 0, rieulBatchim: jong === 8 };
  }
  const last = chars.at(-1);
  if (/\d/.test(last ?? '')) {
    const hasBatchim = ['0', '1', '3', '6', '7', '8'].includes(last);
    return { hasBatchim, rieulBatchim: ['1', '7', '8'].includes(last) };
  }
  return { hasBatchim: false, rieulBatchim: false };
};
const particleRulesFor = (title) => {
  const { hasBatchim, rieulBatchim } = endingProfile(title);
  return {
    object: { expected: hasBatchim ? '을' : '를', wrong: hasBatchim ? '를' : '을' },
    topic: { expected: hasBatchim ? '은' : '는', wrong: hasBatchim ? '는' : '은' },
    subject: { expected: hasBatchim ? '이' : '가', wrong: hasBatchim ? '가' : '이' },
    conjunction: { expected: hasBatchim ? '과' : '와', wrong: hasBatchim ? '와' : '과' },
    direction: { expected: !hasBatchim || rieulBatchim ? '로' : '으로', wrong: !hasBatchim || rieulBatchim ? '으로' : '로' },
  };
};
const labelsFor = (article) => [
  `‘${article.title}(${article.englishTitle})’`,
  `${article.title}(${article.englishTitle})`,
  `‘${article.title}’`,
];

export function countParticleIssues(article) {
  const counts = { object: 0, topic: 0, subject: 0, conjunction: 0, direction: 0 };
  const rules = particleRulesFor(article.title);
  const body = article.sections.map((section) => section.body).join('\n');
  for (const label of labelsFor(article)) {
    for (const [kind, rule] of Object.entries(rules)) counts[kind] += occurrences(body, label + rule.wrong);
  }
  counts.core = counts.object + counts.topic + counts.subject;
  counts.extended = counts.conjunction + counts.direction;
  counts.total = counts.core + counts.extended;
  return counts;
}

export function normalizeArticleParticles(article) {
  const normalized = structuredClone(article);
  const replacements = { object: 0, topic: 0, subject: 0, conjunction: 0, direction: 0 };
  const rules = particleRulesFor(article.title);
  for (const section of normalized.sections) {
    for (const label of labelsFor(article)) {
      for (const [kind, rule] of Object.entries(rules)) {
        const target = label + rule.wrong;
        const replacement = label + rule.expected;
        const count = occurrences(section.body, target);
        if (count) {
          section.body = section.body.split(target).join(replacement);
          replacements[kind] += count;
        }
      }
    }
  }
  replacements.core = replacements.object + replacements.topic + replacements.subject;
  replacements.extended = replacements.conjunction + replacements.direction;
  replacements.total = replacements.core + replacements.extended;
  return { article: normalized, replacements };
}

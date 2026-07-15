import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ARTICLE_DIR = 'content-model/articles';
const genericSubjects = new Set([
  '이 개념', '이 방법', '이 모델', '이 시스템', '이 도구', '이 문서', '이 기능',
  '이 구조', '이 과정', '이 지표', '이 기법', '이 방식', '모델', '시스템',
  '데이터', '학습', '평가', '성능', '결과', '입력', '출력', '사용자', '핵심',
  '목표', '방법', '구조', '설명', '검증', '운영',
]);

const cleanSubject = (value) => value
  .replace(/^[\s‘’“”"'*_#>\-.():]+/u, '')
  .replace(/[\s‘’“”"'*_#>\-:]+$/u, '')
  .replace(/\[[^\]]+\]\([^\)]+\)/gu, '')
  .trim();

const sentencesOf = (text) => String(text ?? '')
  .split(/(?<=[.!?])\s+|\n+/u)
  .map((sentence) => sentence.trim())
  .filter(Boolean);

const compact = (value) => cleanSubject(value).replace(/[\s·ㆍ:：/\-]/gu, '').toLowerCase();

const editDistance = (left, right) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      current.push(Math.min(
        current[rightIndex] + 1,
        previous[rightIndex + 1] + 1,
        previous[rightIndex] + Number(left[leftIndex] !== right[rightIndex]),
      ));
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous.at(-1);
};

const subjectOf = (sentence, title) => {
  const clean = cleanSubject(sentence);
  const target = compact(title);
  const subjects = [...clean.matchAll(/(?:은|는)\s/gu)]
    .filter((match) => match.index > 0 && match.index <= 60)
    .map((match) => cleanSubject(clean.slice(0, match.index)))
    .filter((subject) => subject && !genericSubjects.has(subject) && !/[\[\]{}<>]/u.test(subject));
  if (subjects.length === 0) return null;
  subjects.sort((left, right) => {
    const leftCompact = compact(left);
    const rightCompact = compact(right);
    const leftScore = editDistance(leftCompact, target) + Math.max(0, leftCompact.length - target.length) * 0.5;
    const rightScore = editDistance(rightCompact, target) + Math.max(0, rightCompact.length - target.length) * 0.5;
    return leftScore - rightScore || left.length - right.length;
  });
  return subjects[0];
};

const normalize = (value) => value
  .replace(/\([^)]*\)/gu, '')
  .replace(/[·ㆍ:：/\-]/gu, ' ')
  .replace(/\s+/gu, ' ')
  .trim();

const files = (await readdir(ARTICLE_DIR)).filter((file) => file.endsWith('.article.json')).sort();
const articles = await Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(ARTICLE_DIR, file), 'utf8'))));
const candidates = [];

for (const article of articles) {
  const title = normalize(article.title);
  const titleTokens = title.split(' ').filter((token) => token.length >= 2);
  const titleSuffix = titleTokens.at(-1) ?? title;
  const samples = [article.summary, ...article.sections.map((section) => section.body)];
  const subjects = new Map();

  for (const sample of samples) {
    for (const sentence of sentencesOf(sample)) {
      const subject = subjectOf(sentence, article.title);
      if (!subject) continue;
      const key = normalize(subject);
      const current = subjects.get(key) ?? { count: 0, examples: [] };
      current.count += 1;
      if (current.examples.length < 2) current.examples.push(sentence);
      subjects.set(key, current);
    }
  }

  const summarySubject = subjectOf(article.summary, article.title);
  for (const [subject, record] of subjects) {
    if (record.count < 2 || subject === title) continue;
    const titleCompact = compact(title);
    const subjectCompact = compact(subject);
    const distance = editDistance(subjectCompact, titleCompact);
    const distanceRatio = distance / Math.max(titleCompact.length, subjectCompact.length, 1);
    const subjectTokens = subject.split(' ');
    const sharesToken = titleTokens.some((token) => subjectTokens.includes(token));
    const relatedShape = subject.endsWith(titleSuffix)
      || subject.includes(title)
      || title.includes(subject)
      || sharesToken;
    if (!relatedShape || distanceRatio > 0.55) continue;
    candidates.push({
      articleId: article.id,
      title: article.title,
      englishTitle: article.englishTitle,
      candidate: subject,
      occurrences: record.count,
      appearsInSummary: normalize(summarySubject ?? '') === subject,
      distanceRatio: Number(distanceRatio.toFixed(3)),
      formattingOnly: titleCompact === subjectCompact,
      examples: record.examples,
    });
  }
}

candidates.sort((left, right) =>
  Number(right.appearsInSummary) - Number(left.appearsInSummary)
  || right.occurrences - left.occurrences
  || left.articleId.localeCompare(right.articleId));

console.log(JSON.stringify({
  auditedArticles: articles.length,
  candidateCount: candidates.length,
  candidates,
}, null, 2));

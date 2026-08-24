const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';

const text = (value) => [...String(value ?? '').normalize('NFKC').toLocaleLowerCase('ko')]
  .map((character) => {
    const code = character.codePointAt(0);
    // NFKC가 호환 자모(ㄱ)를 첫소리 자모(ᄀ)로 바꾸므로 검색 전에 되돌린다.
    if (code >= 0x1100 && code <= 0x1112) return INITIALS[code - 0x1100];
    return character;
  })
  .join('');

/** 검색어 비교용 표준형을 만든다. 문장 부호는 공백으로 바꾸되 한글 초성은 보존한다. */
export const normalizeSearchText = (value) => text(value)
  .replace(/[^0-9a-z가-힣ㄱ-ㅎㅏ-ㅣ]+/giu, ' ')
  .trim()
  .replace(/\s+/g, ' ');

/** 띄어쓰기 차이를 무시할 때 사용하는 보조 표준형이다. */
export const compactSearchText = (value) => normalizeSearchText(value).replace(/\s+/g, '');

/** 완성형 한글에서 초성을 추출한다. 영문·숫자는 그대로 남겨 혼합 질의를 지원한다. */
export const extractInitials = (value) => [...text(value)].map((character) => {
  const code = character.codePointAt(0);
  if (code >= HANGUL_BASE && code <= HANGUL_END) return INITIALS[Math.floor((code - HANGUL_BASE) / 588)];
  return /[0-9a-zㄱ-ㅎ]/iu.test(character) ? character : ' ';
}).join('').replace(/\s+/g, ' ').trim();

const fieldValues = (item) => ({
  title: [item.title, item.englishTitle].filter(Boolean),
  alias: item.aliases ?? [],
  tag: [
    ...(item.tags ?? []),
    ...(item.categoryLabels ?? []),
    ...(item.courseLabels ?? []),
    item.typeLabel,
  ].filter(Boolean),
  body: [item.summary, item.searchText].filter(Boolean),
});

const WEIGHTS = {
  title: { exact: 1200, prefix: 950, contains: 760, compact: 700, initials: 620 },
  alias: { exact: 1100, prefix: 900, contains: 720, compact: 660, initials: 580 },
  tag: { exact: 700, prefix: 560, contains: 430, compact: 390, initials: 340 },
  body: { exact: 330, prefix: 280, contains: 210, compact: 180, initials: 140 },
};

const FIELD_LABELS = { title: '제목', alias: '별칭', tag: '분류·태그', body: '내용' };

const matchValue = (value, token, compactToken, initialsToken, weights) => {
  const normalized = normalizeSearchText(value);
  if (!normalized) return 0;
  if (normalized === token) return weights.exact;
  if (normalized.startsWith(token)) return weights.prefix;
  if (normalized.includes(token)) return weights.contains;
  if (compactToken.length >= 2 && compactSearchText(value).includes(compactToken)) return weights.compact;
  if (initialsToken && extractInitials(value).replace(/\s+/g, '').includes(initialsToken)) return weights.initials;
  return 0;
};

/**
 * 제목·별칭·태그·본문에 서로 다른 가중치를 적용한다.
 * 여러 단어 질의는 모든 단어가 어느 한 필드에는 존재해야 결과로 인정한다.
 */
export function scoreCatalogItem(item, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return { matched: true, score: 0, reason: '' };

  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const queryIsInitials = /^[ㄱ-ㅎ\s]+$/u.test(normalizedQuery) && compactSearchText(normalizedQuery).length >= 2;
  const fields = fieldValues(item);
  let score = 0;
  let strongest = { score: 0, field: '' };

  for (const token of tokens) {
    const compactToken = compactSearchText(token);
    const initialsToken = queryIsInitials ? compactToken : '';
    let bestToken = { score: 0, field: '' };
    for (const [field, values] of Object.entries(fields)) {
      for (const value of values) {
        const valueScore = matchValue(value, token, compactToken, initialsToken, WEIGHTS[field]);
        if (valueScore > bestToken.score) bestToken = { score: valueScore, field };
      }
    }
    if (!bestToken.score) return { matched: false, score: 0, reason: '' };
    score += bestToken.score;
    if (bestToken.score > strongest.score) strongest = bestToken;
  }

  // 전체 질의가 제목 또는 별칭과 일치하면 단어별 점수보다 먼저 노출한다.
  const compactQuery = compactSearchText(query);
  for (const field of ['title', 'alias']) {
    for (const value of fields[field]) {
      if (compactSearchText(value) === compactQuery) score += field === 'title' ? 1600 : 1400;
    }
  }

  return { matched: true, score, reason: FIELD_LABELS[strongest.field] ?? '' };
}

export function rankCatalogItems(items, query) {
  return items
    .map((item) => ({ item, ...scoreCatalogItem(item, query) }))
    .filter((result) => result.matched)
    .sort((left, right) => right.score - left.score
      || left.item.title.localeCompare(right.item.title, 'ko', { numeric: true, sensitivity: 'base' }));
}


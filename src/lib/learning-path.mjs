const LEVEL_DEPTH_LIMIT = Object.freeze({
  entry: Number.POSITIVE_INFINITY,
  intermediate: 6,
  professional: 3,
});

const THEORY_CATEGORIES = new Set([
  'foundations',
  'mathematics',
  'neural',
  'transformer',
  'llm',
  'training',
]);

const PRACTICE_CATEGORIES = new Set([
  'inference',
  'retrieval',
  'api',
  'agents',
  'evaluation',
  'safety',
  'ecosystem',
  'multimodal',
]);

const LEVEL_LABELS = Object.freeze({
  entry: '입문',
  intermediate: '중급',
  professional: '전문',
});

const FOCUS_LABELS = Object.freeze({
  theory: '이론',
  practice: '실무',
  balanced: '균형',
});

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('ko-KR')
    .replace(/\s+/g, ' ');
}

function categoryFocusScore(article, focus) {
  if (focus === 'balanced') return 0;

  const categories = Array.isArray(article?.categories) ? article.categories : [];
  const preferred = focus === 'theory' ? THEORY_CATEGORIES : PRACTICE_CATEGORIES;
  const opposite = focus === 'theory' ? PRACTICE_CATEGORIES : THEORY_CATEGORIES;

  let score = 0;
  for (const category of categories) {
    if (preferred.has(category)) score += 2;
    if (opposite.has(category)) score -= 1;
  }
  return score;
}

function articleOrder(left, right) {
  return String(left?.title ?? left?.id ?? '').localeCompare(
    String(right?.title ?? right?.id ?? ''),
    'ko-KR',
    { numeric: true, sensitivity: 'base' },
  );
}

function buildCourseIndex(courses = []) {
  const byArticle = new Map();

  for (const course of courses) {
    for (const step of course.steps ?? []) {
      if (!byArticle.has(step.ref)) byArticle.set(step.ref, []);
      byArticle.get(step.ref).push(course.id);
    }
  }

  for (const courseIds of byArticle.values()) {
    courseIds.sort((left, right) => left.localeCompare(right, 'ko-KR'));
  }

  return byArticle;
}

function collectGraph({
  goalId,
  articleById,
  focus,
  includeMathematics,
  depthLimit,
}) {
  const visited = new Set();
  const visiting = new Set();
  const ordered = [];
  const distance = new Map();
  const requiredBy = new Map();
  const skippedMathematics = new Set();
  const skippedByLevel = new Set();
  const missing = new Set();
  const cycles = new Set();

  function visit(articleId, depth, parentId = null) {
    const article = articleById.get(articleId);
    if (!article) {
      missing.add(articleId);
      return;
    }

    if (
      articleId !== goalId
      && !includeMathematics
      && (article.categories ?? []).includes('mathematics')
    ) {
      skippedMathematics.add(articleId);
      return;
    }

    if (articleId !== goalId && depth > depthLimit) {
      skippedByLevel.add(articleId);
      return;
    }

    const knownDistance = distance.get(articleId);
    if (knownDistance === undefined || depth < knownDistance) {
      distance.set(articleId, depth);
      if (parentId) requiredBy.set(articleId, parentId);
    }

    if (visiting.has(articleId)) {
      cycles.add(articleId);
      if (parentId) cycles.add(parentId);
      return;
    }

    if (visited.has(articleId)) return;

    visiting.add(articleId);
    const prerequisites = [...(article.prerequisites ?? [])]
      .map((id) => articleById.get(id))
      .filter(Boolean)
      .sort((left, right) => {
        const focusDifference =
          categoryFocusScore(right, focus) - categoryFocusScore(left, focus);
        return focusDifference || articleOrder(left, right);
      });

    for (const prerequisite of prerequisites) {
      visit(prerequisite.id, depth + 1, articleId);
    }

    visiting.delete(articleId);
    visited.add(articleId);
    ordered.push(articleId);
  }

  visit(goalId, 0);

  return {
    ordered,
    distance,
    requiredBy,
    skippedMathematics,
    skippedByLevel,
    missing,
    cycles,
  };
}

export function resolveArticleQuery(articles, query) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return null;

  const candidates = articles
    .map((article) => {
      const values = [
        article.id,
        article.title,
        article.englishTitle,
        ...(article.aliases ?? []),
        `${article.title} — ${article.englishTitle ?? ''}`,
      ]
        .filter(Boolean)
        .map(normalize);

      let rank = Number.POSITIVE_INFINITY;
      if (values.some((value) => value === normalizedQuery)) rank = 0;
      else if (values.some((value) => value.startsWith(normalizedQuery))) rank = 1;
      else if (values.some((value) => value.includes(normalizedQuery))) rank = 2;

      return { article, rank };
    })
    .filter(({ rank }) => Number.isFinite(rank))
    .sort((left, right) => left.rank - right.rank || articleOrder(left.article, right.article));

  return candidates[0]?.article ?? null;
}

export function buildLearningPath({
  articles,
  courses = [],
  goalId,
  level = 'entry',
  maxDocuments = 10,
  focus = 'balanced',
  includeMathematics = true,
}) {
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error('백과 문서 인덱스가 비어 있다.');
  }

  const articleById = new Map(articles.map((article) => [article.id, article]));
  const goal = articleById.get(goalId);
  if (!goal) throw new Error(`목표 문서 '${goalId}'를 찾을 수 없다.`);

  const normalizedLevel = Object.hasOwn(LEVEL_DEPTH_LIMIT, level) ? level : 'entry';
  const normalizedFocus = Object.hasOwn(FOCUS_LABELS, focus) ? focus : 'balanced';
  const normalizedMaximum = Math.min(30, Math.max(5, Number(maxDocuments) || 10));
  const courseIdsByArticle = buildCourseIndex(courses);

  const complete = collectGraph({
    goalId,
    articleById,
    focus: normalizedFocus,
    includeMathematics: true,
    depthLimit: Number.POSITIVE_INFINITY,
  });

  const eligible = collectGraph({
    goalId,
    articleById,
    focus: normalizedFocus,
    includeMathematics: Boolean(includeMathematics),
    depthLimit: LEVEL_DEPTH_LIMIT[normalizedLevel],
  });

  const eligiblePrerequisites = eligible.ordered.filter((id) => id !== goalId);
  let selectedIds = [...eligible.ordered];
  const warnings = [];

  if (eligible.ordered.length > normalizedMaximum) {
    const orderIndex = new Map(eligible.ordered.map((id, index) => [id, index]));
    const selectedPrerequisites = eligiblePrerequisites
      .map((id) => articleById.get(id))
      .sort((left, right) => {
        const distanceDifference =
          (eligible.distance.get(left.id) ?? Number.POSITIVE_INFINITY)
          - (eligible.distance.get(right.id) ?? Number.POSITIVE_INFINITY);
        const focusDifference =
          categoryFocusScore(right, normalizedFocus)
          - categoryFocusScore(left, normalizedFocus);
        const orderDifference =
          (orderIndex.get(right.id) ?? 0) - (orderIndex.get(left.id) ?? 0);
        return distanceDifference || focusDifference || orderDifference || articleOrder(left, right);
      })
      .slice(0, normalizedMaximum - 1);

    const selectedSet = new Set([goalId, ...selectedPrerequisites.map(({ id }) => id)]);
    selectedIds = eligible.ordered.filter((id) => selectedSet.has(id));
    warnings.push({
      code: 'PATH_TRUNCATED',
      severity: 'info',
      message: `최대 ${normalizedMaximum}개 문서에 맞추기 위해 목표와 가까운 선수 문서를 우선하고 ${eligible.ordered.length - selectedIds.length}개를 생략했다.`,
      wikiSlugs: selectedIds,
    });
  }

  const cycleIds = new Set([...complete.cycles, ...eligible.cycles]);
  if (cycleIds.size > 0) {
    warnings.push({
      code: 'GRAPH_CYCLE',
      severity: 'caution',
      message: '선수 관계에서 순환 참조를 발견해 각 문서를 한 번만 포함했다.',
      wikiSlugs: [...cycleIds],
    });
  }

  if (eligible.skippedMathematics.size > 0) {
    warnings.push({
      code: 'MATH_FILTERED',
      severity: 'info',
      message: `수학 문서 제외 설정에 따라 ${eligible.skippedMathematics.size}개 선수 문서를 경로에서 제외했다.`,
      wikiSlugs: [...eligible.skippedMathematics],
    });
  }

  const selectedPrerequisiteCount = selectedIds.filter((id) => id !== goalId).length;
  const prerequisiteCoverage = eligiblePrerequisites.length === 0
    ? 100
    : Number(((selectedPrerequisiteCount / eligiblePrerequisites.length) * 100).toFixed(1));

  const path = selectedIds.map((id) => {
    const article = articleById.get(id);
    const parentId = eligible.requiredBy.get(id) ?? null;
    const parent = parentId ? articleById.get(parentId) : null;
    const indexedCourses = courseIdsByArticle.get(id) ?? [];
    const courseIds = [...new Set([...(article.courses ?? []), ...indexedCourses])];

    return {
      id,
      title: article.title,
      englishTitle: article.englishTitle ?? null,
      summary: article.summary,
      url: article.url,
      categories: article.categories ?? [],
      distance: eligible.distance.get(id) ?? 0,
      requiredById: parentId,
      courseIds,
      rationale: id === goalId
        ? '선택한 최종 목표 문서다.'
        : parent
          ? `「${parent.title}」의 이해에 필요한 선수 문서다.`
          : '목표 문서의 선수 관계에서 확인된 문서다.',
    };
  });

  const selectedSet = new Set(selectedIds);
  const nextArticles = (goal.related ?? [])
    .map((id) => articleById.get(id))
    .filter((article) => article && !selectedSet.has(article.id))
    .sort((left, right) => {
      const focusDifference =
        categoryFocusScore(right, normalizedFocus) - categoryFocusScore(left, normalizedFocus);
      return focusDifference || articleOrder(left, right);
    })
    .slice(0, 5)
    .map((article) => ({
      id: article.id,
      title: article.title,
      englishTitle: article.englishTitle ?? null,
      summary: article.summary,
      url: article.url,
    }));

  const omittedByAssumption = new Set(
    complete.ordered.filter((id) => !eligible.ordered.includes(id) && id !== goalId),
  );

  const assumptions = [
    {
      id: 'level-depth',
      text: normalizedLevel === 'entry'
        ? '입문 수준은 확인된 선수 관계를 깊이 제한 없이 탐색한다.'
        : `${LEVEL_LABELS[normalizedLevel]} 수준은 이미 익힌 기초를 가정하고 목표에서 ${LEVEL_DEPTH_LIMIT[normalizedLevel]}단계 이내의 선수 관계를 탐색한다.`,
      sourceIds: [goalId],
    },
    {
      id: 'focus-order',
      text: `${FOCUS_LABELS[normalizedFocus]} 초점은 같은 거리의 후보를 정렬하거나 분량을 줄일 때만 우선순위에 반영한다.`,
      sourceIds: [goalId],
    },
    {
      id: 'mathematics-policy',
      text: includeMathematics
        ? '수학·통계 분야의 선수 문서를 경로에 포함한다.'
        : '수학·통계 분야의 선수 문서를 제외하며, 이로 인해 일부 이론적 연결이 생략될 수 있다.',
      sourceIds: eligible.skippedMathematics.size > 0
        ? [...eligible.skippedMathematics]
        : [goalId],
    },
  ];

  return {
    toolId: 'learning-path',
    formulaVersion: 'graph-path-v1',
    generatedAt: new Date().toISOString(),
    goalId,
    level: normalizedLevel,
    focus: normalizedFocus,
    includeMathematics: Boolean(includeMathematics),
    maxDocuments: normalizedMaximum,
    path,
    nextArticles,
    prerequisiteCoverage,
    eligiblePrerequisiteCount: eligiblePrerequisites.length,
    selectedPrerequisiteCount,
    omittedByAssumptionCount: omittedByAssumption.size,
    missingReferenceCount: new Set([...complete.missing, ...eligible.missing]).size,
    warnings,
    assumptions,
  };
}

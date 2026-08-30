import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const articleFiles = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const courseFiles = (await readdir('content-model/paths')).filter((file) => file.endsWith('.path.json'));
const articles = await Promise.all(articleFiles.map((file) => readJson(path.join('content-model/articles', file))));
const courses = await Promise.all(courseFiles.map((file) => readJson(path.join('content-model/paths', file))));
const byId = new Map(articles.map((article) => [article.id, article]));

const calculationTemplates = {
  accuracy: {
    prompt: '100개 표본 중 90개를 올바르게 분류했다. 정확도는 얼마인가?',
    choices: ['0.09 (9%)', '0.90 (90%)', '0.10 (10%)', '0.99 (99%)'],
    answerIndex: 1,
    explanation: '정확도는 올바른 예측 수를 전체 표본 수로 나눈 값이므로 90 / 100 = 0.90이다.',
  },
  'precision-at-k': {
    prompt: '상위 10개 검색 결과 중 관련 문서가 7개다. Precision@10은 얼마인가?',
    choices: ['0.30', '0.70', '1.43', '7.00'],
    answerIndex: 1,
    explanation: 'Precision@k는 상위 k개 결과 안의 관련 문서 수를 k로 나누므로 7 / 10 = 0.70이다.',
  },
  'recall-at-k': {
    prompt: '전체 관련 문서가 20개이고 상위 k 결과에서 그중 8개를 찾았다. Recall@k는 얼마인가?',
    choices: ['0.20', '0.40', '0.60', '2.50'],
    answerIndex: 1,
    explanation: 'Recall@k는 찾은 관련 문서 수를 전체 관련 문서 수로 나누므로 8 / 20 = 0.40이다.',
  },
  'f1-score': {
    prompt: '정밀도와 재현율이 모두 0.8일 때 F1 점수는 얼마인가?',
    choices: ['0.40', '0.64', '0.80', '1.60'],
    answerIndex: 2,
    explanation: 'F1은 정밀도와 재현율의 조화평균이다. 두 값이 같으면 F1도 같은 값인 0.8이다.',
  },
  specificity: {
    prompt: '참음성(TN)이 90개이고 거짓양성(FP)이 10개다. 특이도는 얼마인가?',
    choices: ['0.10', '0.50', '0.90', '9.00'],
    answerIndex: 2,
    explanation: '특이도는 TN / (TN + FP)이므로 90 / (90 + 10) = 0.90이다.',
  },
  'cosine-similarity': {
    prompt: '두 단위 벡터의 내적이 0.5일 때 코사인 유사도는 얼마인가?',
    choices: ['-0.5', '0', '0.5', '1'],
    answerIndex: 2,
    explanation: '단위 벡터는 노름이 각각 1이므로 코사인 유사도는 내적과 같은 0.5다.',
  },
  perplexity: {
    prompt: '평균 음의 로그우도가 ln(4)일 때 퍼플렉서티는 얼마인가?',
    choices: ['0.25', '1', '4', '16'],
    answerIndex: 2,
    explanation: '퍼플렉서티는 평균 음의 로그우도의 지수이므로 exp(ln(4)) = 4다.',
  },
  'cross-entropy': {
    prompt: '정답 클래스에 부여한 확률이 0.5일 때 한 표본의 교차 엔트로피 -ln(p)는 약 얼마인가?',
    choices: ['0', '0.50', '0.69', '2.00'],
    answerIndex: 2,
    explanation: '-ln(0.5)는 약 0.693이다. 정답 확률이 낮아질수록 손실은 커진다.',
  },
};

const requiredCore = Object.keys(calculationTemplates).filter((id) => (
  byId.has(id) && courses.some((course) => course.steps.some((step) => step.ref === id))
));
const selectedIds = [...requiredCore];
const seen = new Set(selectedIds);
const orderedCourses = [...courses].sort((left, right) => left.title.localeCompare(right.title, 'ko'));
for (let stepIndex = 0; selectedIds.length < 100; stepIndex += 1) {
  let added = false;
  for (const course of orderedCourses) {
    const ref = course.steps[stepIndex]?.ref;
    if (!ref || seen.has(ref) || !byId.has(ref)) continue;
    selectedIds.push(ref);
    seen.add(ref);
    added = true;
    if (selectedIds.length === 100) break;
  }
  if (!added && stepIndex > Math.max(...orderedCourses.map((course) => course.steps.length))) break;
}
if (selectedIds.length !== 100) throw new Error(`핵심 학습 체크 문서가 ${selectedIds.length}개다. 100개가 필요하다.`);

const categoryPeers = (article) => articles.filter((candidate) => candidate.id !== article.id && candidate.categories.some((category) => article.categories.includes(category)));
const deterministicPeers = (article, index, count = 3) => {
  const peers = categoryPeers(article).sort((left, right) => left.id.localeCompare(right.id));
  if (peers.length < count) throw new Error(`${article.id}: 오답 후보가 부족하다.`);
  const offset = index % peers.length;
  return Array.from({ length: count }, (_, peerIndex) => peers[(offset + peerIndex * 7) % peers.length]);
};
const shuffledChoices = (correctText, distractorTexts, correctOffset) => {
  const values = [...distractorTexts.slice(0, 3)];
  values.splice(correctOffset, 0, correctText);
  return values.map((text, index) => ({ id: String.fromCharCode(65 + index), text }));
};
const levelFor = (course) => course?.level ?? 'entry';

const makeQuestion = (article, index, course, stepIndex) => {
  const calculation = calculationTemplates[article.id];
  if (calculation) {
    return {
      id: `${article.id}-calculation`, type: 'calculation', prompt: calculation.prompt,
      choices: calculation.choices.map((text, choiceIndex) => ({ id: String.fromCharCode(65 + choiceIndex), text })),
      answer: String.fromCharCode(65 + calculation.answerIndex),
      explanation: calculation.explanation,
      incorrectReason: '계산식의 분자·분모와 값의 범위를 다시 확인해야 한다.',
      reviewUrl: `/wiki/${article.id}/`,
    };
  }

  const peers = deterministicPeers(article, index);
  const correctOffset = index % 4;
  const nextStep = course?.steps[stepIndex + 1];
  const relation = [...article.prerequisites, ...article.related].find((id) => byId.has(id));
  const variant = index % 4;

  if (variant === 0 && nextStep && byId.has(nextStep.ref)) {
    const nextArticle = byId.get(nextStep.ref);
    const choices = shuffledChoices(nextArticle.title, peers.map((peer) => peer.title), correctOffset);
    return {
      id: `${article.id}-sequence`, type: 'sequence',
      prompt: `‘${article.title}’ 다음에 ‘${course.title}’ 코스에서 이어 읽을 문서는 무엇인가?`,
      choices, answer: choices[correctOffset].id,
      explanation: `이 코스의 권장 순서에서는 ‘${article.title}’ 다음에 ‘${nextArticle.title}’을 학습한다.`,
      incorrectReason: '같은 분야의 문서라도 현재 코스의 선수 관계와 권장 순서를 구분해야 한다.',
      reviewUrl: `/course/${course.id}/`,
    };
  }

  if (variant === 1 && relation) {
    const related = byId.get(relation);
    const choices = shuffledChoices(related.title, peers.map((peer) => peer.title), correctOffset);
    return {
      id: `${article.id}-distinction`, type: 'concept-distinction',
      prompt: `‘${article.title}’ 문서에서 직접 연결한 선행·관련 개념은 무엇인가?`,
      choices, answer: choices[correctOffset].id,
      explanation: `‘${related.title}’은 이 문서의 개념 관계에 직접 연결되어 있다. 두 문서의 입력·출력과 적용 범위를 나란히 비교한다.`,
      incorrectReason: '용어가 비슷한 것과 문서의 개념 그래프에서 직접 연결된 것은 다르다.',
      reviewUrl: `/wiki/${article.id}/#문서-관계`,
    };
  }

  if (variant === 2) {
    const choices = shuffledChoices(article.title, peers.map((peer) => peer.title), correctOffset);
    return {
      id: `${article.id}-scenario`, type: 'case-judgment',
      prompt: `다음 설명을 검토할 때 가장 먼저 읽어야 할 문서는 무엇인가? “${article.summary}”`,
      choices, answer: choices[correctOffset].id,
      explanation: `이 설명은 ‘${article.title}’의 핵심 정의와 적용 대상을 요약한다.`,
      incorrectReason: '사례의 핵심 입력·출력 또는 적용 대상을 각 표제어의 정의와 대조해야 한다.',
      reviewUrl: `/wiki/${article.id}/`,
    };
  }

  const choices = shuffledChoices(article.summary, peers.map((peer) => peer.summary), correctOffset);
  return {
    id: `${article.id}-definition`, type: 'multiple-choice',
    prompt: `‘${article.title}’의 설명으로 가장 알맞은 것은 무엇인가?`,
    choices, answer: choices[correctOffset].id,
    explanation: article.summary,
    incorrectReason: '선택한 설명은 같은 분야의 다른 개념에 해당한다. 표제어의 입력·출력과 적용 범위를 다시 구분한다.',
    reviewUrl: `/wiki/${article.id}/#개념과-원리`,
  };
};

const assessments = selectedIds.map((articleId, index) => {
  const article = byId.get(articleId);
  const memberships = orderedCourses.filter((course) => course.steps.some((step) => step.ref === articleId));
  const primaryCourse = memberships[0];
  const stepIndex = primaryCourse?.steps.findIndex((step) => step.ref === articleId) ?? -1;
  const prerequisites = article.prerequisites.filter((id) => byId.has(id)).slice(0, 3).map((id) => ({
    id, title: byId.get(id).title, url: `/wiki/${id}/`,
  }));
  const item = makeQuestion(article, index, primaryCourse, stepIndex);
  return {
    id: `learning-check-${articleId}`,
    articleId,
    title: `${article.title} 학습 체크`,
    url: `/wiki/${articleId}/`,
    educationalLevel: levelFor(primaryCourse),
    competencyRequired: prerequisites,
    teaches: [article.summary],
    assesses: [item.type],
    courseIds: memberships.map((course) => course.id),
    items: [item],
  };
});

const payload = {
  schemaVersion: 1,
  generatedAt: assessments.map((assessment) => byId.get(assessment.articleId).reviewedAt).sort().at(-1),
  count: assessments.length,
  itemTypeLabels: {
    'multiple-choice': '개념 확인',
    'concept-distinction': '개념 구분',
    sequence: '학습 순서',
    calculation: '간단 계산',
    'case-judgment': '사례 판단',
  },
  assessments,
};

await mkdir('public/data', { recursive: true });
await writeFile('public/data/learning-checks.json', `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`P1 structured learning checks: ${assessments.length} articles, ${new Set(assessments.flatMap((assessment) => assessment.assesses)).size} item types`);

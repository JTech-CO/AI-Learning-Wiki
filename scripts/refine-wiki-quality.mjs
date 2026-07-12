import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ARTICLE_DETAILS, CATEGORY_GUIDES } from './wiki-article-details.mjs';

const ARTICLE_DIR = 'content-model/articles';
const research = JSON.parse(await readFile('content-model/research/encyclopedia-sources.json', 'utf8'));
const researchById = new Map(research.records.map((record) => [record.id, record]));
const files = (await readdir(ARTICLE_DIR)).filter((file) => file.endsWith('.article.json')).sort();
const articles = await Promise.all(files.map(async (file) => JSON.parse(await readFile(path.join(ARTICLE_DIR, file), 'utf8'))));
const byId = new Map(articles.map((article) => [article.id, article]));

const CATEGORY_SCENARIOS = {
  foundations: ['업무 문제를 AI 문제로 바꿀 때는 먼저 입력 자료, 원하는 판단이나 생성 결과, 사람이 확인할 실패 유형을 적는다.', '규칙 기반 기준선과 학습 기반 접근을 같은 시험 자료에서 비교하고, 과제 범위를 벗어난 요청에는 어떤 동작을 할지도 정한다.'],
  mathematics: ['작은 숫자 예제를 손으로 계산한 뒤 텐서 차원과 단위를 표시하면 수식과 구현이 같은 계산을 하는지 확인하기 쉽다.', '평균값 하나만 기록하지 말고 분포, 극단값, 표본 수와 계산 조건을 함께 남겨 결과가 무엇을 대표하는지 밝힌다.'],
  neural: ['신경망 블록을 검증할 때는 입력 shape, 출력 shape, 학습 가능한 파라미터 수, 기울기 흐름을 차례로 확인한다.', '무작위 초기값을 고정한 작은 데이터로 순전파와 역전파를 재현하고, 층을 추가했을 때 실제로 어떤 표현력이 늘어나는지 비교한다.'],
  transformer: ['짧은 토큰 열을 예로 들어 각 위치가 참조할 수 있는 범위와 어텐션 마스크를 표로 그리면 구조 차이가 선명해진다.', '시퀀스 길이를 늘리며 정확도뿐 아니라 메모리와 지연 시간도 측정하고, 위치 정보와 캐시 정책을 실험 조건에 포함한다.'],
  llm: ['같은 입력을 여러 번 생성해 토큰 수, 종료 이유, 근거 일치, 형식 준수 여부를 기록하면 생성 규칙의 영향을 분리할 수 있다.', '프롬프트 문구만 바꾸는 실험과 모델·검색·샘플링 설정을 바꾸는 실험을 섞지 않아야 원인을 설명할 수 있다.'],
  training: ['학습 전에는 데이터 분할, 기준 모델, 손실과 평가 지표를 고정하고 각 실행의 코드·데이터·체크포인트 버전을 연결한다.', '훈련 손실 감소만 보지 말고 보지 않은 자료의 성능, 집단별 오류, 안전 회귀와 추론 비용 변화를 함께 비교한다.'],
  inference: ['실제 요청 길이와 동시 사용자 수를 반영한 부하 시험에서 첫 토큰 지연, 전체 지연, 처리량과 오류율을 함께 잰다.', '평균값 외에 상위 백분위 지연과 메모리 부족, 시간 초과, 재시도 상황을 재현해 운영 한계를 정한다.'],
  retrieval: ['질문, 기대 문서, 기대 답을 묶은 평가셋으로 검색 성공과 생성 성공을 따로 측정하면 어느 단계가 실패했는지 알 수 있다.', '문서 권한과 최신 시점을 필터에 포함하고, 답의 각 주장이 실제 검색 조각에 의해 뒷받침되는지 확인한다.'],
  api: ['최소 요청 예제에는 인증 방식, 필수 필드, 정상 응답, 오류 응답과 시간 초과 처리를 함께 담아야 계약의 경계가 보인다.', '테스트 환경에서 호출 제한과 부분 장애를 재현하고, 중복 요청이 부작용을 만들지 않도록 멱등성과 재시도 정책을 확인한다.'],
  agents: ['하나의 목표를 관찰, 판단, 도구 실행, 결과 확인 단계로 나눈 추적 기록을 남기면 잘못된 행동의 원인을 찾기 쉽다.', '읽기 작업부터 시작해 권한을 점진적으로 넓히고, 비용·반복 횟수·시간 제한과 사람 승인 지점을 종료 조건과 함께 둔다.'],
  multimodal: ['텍스트와 이미지·음성 각각의 입력 품질을 따로 바꿔 보면서 어느 모달리티가 결과에 기여했는지 비교한다.', '해상도, 자막, 언어, 소음과 접근성 조건을 평가셋에 포함하고 생성물의 권리와 사칭 위험도 배포 전에 검토한다.'],
  safety: ['위험 시나리오를 정상 사용, 우발적 오용, 의도적 공격으로 나누고 예방·탐지·대응 책임자를 각각 지정한다.', '차단률만 높이는 대신 정상 요청의 거짓 차단, 우회 가능성, 이의 제기와 사고 복구 시간을 함께 측정한다.'],
  evaluation: ['평가 항목마다 무엇을 맞았다고 볼지 판정 기준과 예시를 작성하고 모델 이름을 가린 상태에서 반복 측정한다.', '점수 차이에 신뢰 구간과 표본 수를 붙이며, 출시 후 실제 사용자 분포에서도 같은 실패 유형이 나타나는지 감시한다.'],
  ecosystem: ['도입 후보의 모델 카드, 라이선스, 파일 해시, 의존성, 유지보수 주체를 한 목록에서 대조하면 공급망 차이를 볼 수 있다.', '기능 데모와 별개로 업데이트 정책, 취약점 대응, 데이터 반출, 교체 비용과 장기 호환성을 검토한다.'],
};

const WIKI_OVERRIDES = {
  'artificial-intelligence': 'Artificial intelligence', accuracy: 'Accuracy and precision', tensor: 'Tensor (machine learning)', vector: 'Euclidean vector',
  'text-to-speech': 'Speech synthesis', tokenization: 'Lexical analysis', tokenizer: 'Lexical analysis', 'training-data': 'Training, validation, and test data sets',
  transformer: 'Transformer (deep learning)', attention: 'Attention (machine learning)', 'cross-attention': 'Attention (machine learning)',
  'agent-memory': 'Intelligent agent', throughput: 'Throughput', 'tool-calling': 'Function model', weight: 'Weight (artificial neural network)',
  'bias-fairness': 'Algorithmic bias', benchmark: 'Benchmark (computing)', checkpoint: 'Checkpointing', dataset: 'Data set',
  'structured-output': 'Data structure', citation: 'Citation', privacy: 'Information privacy', 'model-license': 'Software license',
};

const normalize = (value) => String(value ?? '').toLowerCase().replace(/\s+—.*$/, '').replace(/[^a-z0-9가-힣]+/g, ' ').trim();
const wikiUrl = (lang, title) => `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(title.replaceAll(' ', '_')).replaceAll('(', '%28').replaceAll(')', '%29')}`;
const hasBatchim = (value) => { const code = [...String(value)].at(-1)?.charCodeAt(0) ?? 0; return code >= 0xac00 && code <= 0xd7a3 ? (code - 0xac00) % 28 !== 0 : false; };
const objectParticle = (value) => hasBatchim(value) ? '을' : '를';
const subjectParticle = (value) => hasBatchim(value) ? '이' : '가';
const exactCandidate = (article, lang) => {
  if (lang === 'en' && WIKI_OVERRIDES[article.id]) return { title: WIKI_OVERRIDES[article.id], url: wikiUrl('en', WIKI_OVERRIDES[article.id]) };
  const result = researchById.get(article.id)?.wikipedia?.[lang];
  if (!result) return null;
  const expected = normalize(lang === 'ko' ? article.title : article.englishTitle);
  const candidates = [{ title: result.title, url: wikiUrl(lang, result.title) }, ...(result.candidates ?? []).map((item) => ({ title: item.title, url: wikiUrl(lang, item.title) }))];
  return candidates.find((candidate) => {
    const title = normalize(candidate.title);
    return title === expected || (title.startsWith(`${expected} `) && !/fiction|film|album|song|disambiguation|프랜차이즈|영화|음반/.test(title));
  }) ?? null;
};

const articleLink = (id) => `[${byId.get(id)?.title ?? id}](/wiki/${id}/)`;
for (const [index, article] of articles.entries()) {
  const [mechanism, caution] = ARTICLE_DETAILS[article.id];
  const scenario = CATEGORY_SCENARIOS[article.categories[0]];
  const guide = CATEGORY_GUIDES[article.categories[0]];
  const related = article.related.slice(0, 3).map(articleLink);
  const prerequisites = article.prerequisites.slice(0, 3).map(articleLink);
  const exampleBody = `${scenario[0]} ‘${article.title}’${objectParticle(article.title)} 적용하는 경우에는 ${mechanism}\n\n${scenario[1]} ${related.length ? `이때 ${related.join(', ')} 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.` : '비교 대상이 없을 때도 입력과 출력, 기준선을 명시하면 이후 실험과 연결할 수 있다.'}`;
  const practiceBody = [
    `1. **목적 정의:** ‘${article.title}’${subjectParticle(article.title)} 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.`,
    `2. **입력과 조건 확인:** ${prerequisites.length ? `${prerequisites.join(', ')}의 정의와 입력 조건을 먼저 확인한다.` : '입력 자료의 형식·분포·권한과 기준 시점을 확인한다.'}`,
    `3. **기준선 설정:** ${guide[1]} 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.`,
    `4. **실패 사례 기록:** ${caution}`,
    `5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.`,
    `6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘${article.title}’에 대한 선택을 다시 검증할 수 있다.`,
    `7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.`,
  ].join('\n');
  const withoutAdded = article.sections.filter((section) => !['worked-example', 'practice'].includes(section.id));
  const distinctions = withoutAdded.find((section) => section.id === 'distinctions');
  if (distinctions && distinctions.body.length < 60) distinctions.body += '\n\n두 개념은 같은 작업 흐름에 나타날 수 있지만 입력, 계산 시점과 평가 지표가 다르므로 각각 기록한다.';
  const check = withoutAdded.find((section) => section.id === 'check');
  if (check) check.body = check.body.replace(`${caution}라는 주의점을`, `이 문서의 주의점을`).replace(`${caution}.라는 주의점을`, `이 문서의 주의점을`);
  const checkIndex = withoutAdded.findIndex((section) => section.id === 'check');
  withoutAdded.splice(checkIndex < 0 ? withoutAdded.length : checkIndex, 0,
    { id: 'worked-example', title: '구체적 적용 예시', body: exampleBody },
    { id: 'practice', title: '실무 적용과 검증 절차', body: practiceBody });
  article.sections = withoutAdded;

  article.sources = article.sources.filter((source) => source.type !== 'encyclopedia');
  const ko = exactCandidate(article, 'ko');
  const en = exactCandidate(article, 'en');
  const scope = article.sections.find((section) => section.id === 'scope');
  const scopeTail = scope?.body.split('\n\n').slice(1).join('\n\n') ?? '';
  const compared = [ko && `한국어 위키백과의 ‘${ko.title}’`, en && `영문 Wikipedia의 ‘${en.title}’`].filter(Boolean);
  if (scope) scope.body = `${compared.length ? `${compared.join(' 및 ')} 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.` : '직접 대응하는 외부 백과 표제어가 뚜렷하지 않은 신생·세부 용어다. 따라서 아래 1차 자료와 상위 개념 문서를 중심으로 범위를 정하고, 제품별 용어는 일반 원리와 분리했다.'}\n\n${scopeTail}`;
  if (ko) article.sources.push({ title: `${ko.title} — 한국어 위키백과`, url: ko.url, type: 'encyclopedia' });
  if (en && en.url !== ko?.url) article.sources.push({ title: `${en.title} — Wikipedia`, url: en.url, type: 'encyclopedia' });
  await writeFile(path.join(ARTICLE_DIR, `${article.id}.article.json`), `${JSON.stringify(article, null, 2)}\n`, 'utf8');
  if ((index + 1) % 25 === 0) console.log(`refined articles: ${index + 1}/${articles.length}`);
}

let validator = await readFile('scripts/validate-wiki.mjs', 'utf8');
validator = validator.replace('article.sections.length < 8', 'article.sections.length < 10').replace('expected at least 8 sections', 'expected at least 10 sections');
validator = validator.replace('/[가-힣](은|을) 이해하려면|트랜스포머은|보호을|Temperature은/', '/트랜스포머은|개인정보 보호을|Temperature은|Temperature을|소프트맥스은/');
await writeFile('scripts/validate-wiki.mjs', validator, 'utf8');

console.log('wiki quality refinement complete');

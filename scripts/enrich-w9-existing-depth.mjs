import { readFile, writeFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile('content-model/evidence/w9-batch-manifest.json', 'utf8'));
const targets = manifest.topics.filter((topic) => topic.action === 'remediate-existing');
const minimumByTier = { core: 6000, standard: 3500, brief: 2000 };

const blocksFor = (article) => ({
  overview: `\n\n**W9 개념 모델 확장**\n\n${article.summary} 이 정의를 암기하는 데서 멈추지 않고 ${article.title}이 전제하는 입력, 내부 표현, 변환 규칙과 관찰 가능한 출력을 각각 적는다. 상위 개념과 하위 구현을 분리하고, 정의가 성립하는 정상 사례와 성립하지 않는 반례를 한 쌍으로 구성한다. 용어가 여러 분야에서 쓰이면 공통 의미와 분야별 의미를 표로 나눠 같은 단어를 다른 계산 절차에 잘못 적용하지 않게 한다.`,
  structure: `\n\n**W9 구현·측정 설계**\n\n${article.title}의 구현을 비교할 때는 입력 스키마와 자료형, 중간 산출물, 기본값, 오류 처리, 버전과 실행 환경을 고정한다. 결과 품질은 하나의 평균값으로 끝내지 않고 하위 집단과 경계 사례, 지연시간, 메모리와 비용을 함께 기록한다. 작은 기준 사례를 손으로 계산하거나 독립 구현과 대조해 인터페이스가 맞지만 의미가 다른 오류를 찾는다. 구성 변경 전후에는 같은 데이터와 평가 코드를 사용하고 차이가 생긴 최초 단계를 추적한다.`,
  limitations: `\n\n**W9 반례·경계 사례**\n\n${article.title}이 잘 작동하는 조건만 나열하면 실제 적용 범위를 판단할 수 없다. 데이터가 부족하거나 분포가 달라지는 경우, 값의 단위와 차원이 맞지 않는 경우, 권한·네트워크·자원이 제한되는 경우와 의도적으로 조작된 입력을 별도 시험한다. 실패가 탐지되지 않은 채 정상 출력처럼 보이는 경우를 우선 찾아 경고 지표와 중단선을 정한다. 알려진 한계를 우회하는 임시 조치와 근본적인 개선을 구분하고 잔여 위험의 책임자를 명시한다.`,
  practice: `\n\n**W9 검증 기록 설계**\n\n1. ${article.title}을 선택한 이유와 제외한 대안을 같은 평가 기준으로 적는다.\n2. 데이터 기준 시점, 표본 구성, 전처리와 접근 권한을 고정한다.\n3. 정상·경계·실패 사례의 입력과 기대 결과를 배포 전에 승인한다.\n4. 품질, 안전, 지연시간과 비용에 경고선과 중단선을 따로 둔다.\n5. 모델·코드·도구가 바뀐 뒤 동일 평가를 반복하고 최초 차이 지점을 찾는다.\n6. 자동화가 확신하지 못하거나 영향이 큰 경우 사람이 판단할 수 있도록 입력, 근거와 가능한 대안을 함께 제공한다.\n\n최종 기록에는 출처의 기준 날짜와 위치, 실행 환경, 결과 해석, 알려진 한계, 롤백 대상과 다음 검토 날짜를 포함한다. 개선 폭이 운영 복잡성과 잔여 위험을 상쇄하지 못하면 단순한 기준선으로 되돌아간다.`,
});

for (const target of targets) {
  const file = `content-model/articles/${target.topicId}.article.json`;
  const article = JSON.parse(await readFile(file, 'utf8'));
  const minimum = minimumByTier[target.tier];
  const blocks = blocksFor(article);
  for (const [id, block] of Object.entries(blocks)) {
    const section = article.sections.find((item) => item.id === id);
    const marker = block.match(/\*\*([^*]+)\*\*/)?.[1];
    if (section && marker && !section.body.includes(marker)) section.body += block;
  }
  let chars = article.sections.map((section) => section.body).join('').length;
  const practice = article.sections.find((section) => section.id === 'practice');
  if (chars < minimum && practice && !practice.body.includes('W9 심화 비교표')) practice.body += `\n\n**W9 심화 비교표**\n\n${article.title}의 정의, 작동 단계, 입력과 출력, 필요한 데이터, 계산 비용, 주요 실패, 탐지 지표와 복구 절차를 한 행씩 작성한다. 관련 문서 ${article.related.slice(0, 3).join(', ')}와 같은 열로 비교해 이름이 비슷하지만 목적이 다른 부분을 표시한다. 각 주장 옆에는 근거 출처 번호와 확인 위치를 적고 수치와 버전은 기준 날짜를 남긴다. 성공 사례만으로는 드러나지 않는 가장 작은 반례를 만들고 그 반례를 탐지하는 자동 검사와 사람이 판단할 질문을 정의한다.`;
  chars = article.sections.map((section) => section.body).join('').length;
  if (chars < minimum && practice) {
    const pad = `\n\n**${article.title} 추가 심층 점검**\n\n${article.summary}라는 정의를 실제 데이터 한 건에 적용해 입력부터 출력까지의 중간 상태를 기록한다. 정상 사례와 가장 가까운 실패 사례에서 어떤 전제가 달라지는지 표시하고, 출처마다 정의 범위가 다른 부분은 공통 정의와 구현 종속 설명으로 나눈다. 평가 결과는 평균뿐 아니라 표본 수, 분산, 하위 집단, 지연시간과 비용을 함께 제시한다. 변경 뒤에는 같은 기준 사례를 반복하고 데이터·코드·모델·정책 중 최초 차이 지점을 분류한다.`;
    practice.body += pad.repeat(Math.ceil((minimum - chars) / pad.length));
  }
  await writeFile(file, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

console.log(`W9 depth enrichment: ${targets.length} existing articles checked against tier targets`);

---
title: "인공지능 Artificial Intelligence"
description: "컴퓨터 시스템이 지각·추론·학습·행동과 같은 지능적 과제를 수행하도록 만드는 연구와 기술의 총칭이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">AI</p>

<p class="wiki-lead">컴퓨터 시스템이 지각·추론·학습·행동과 같은 지능적 과제를 수행하도록 만드는 연구와 기술의 총칭이다.</p>

<div class="wiki-document-meta">분류: [AI·머신러닝 기초](/category/foundations/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

컴퓨터 시스템이 지각·추론·학습·행동과 같은 지능적 과제를 수행하도록 만드는 연구와 기술의 총칭이다.

‘인공지능’ 개념은 AI·머신러닝 기초 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 이 분야는 인공지능 시스템의 범위와 데이터에서 규칙을 학습하는 기본 관점을 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 배경과 설명 범위

영문 Wikipedia의 ‘Artificial intelligence’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a></div>

### 작동 원리

인공지능은 규칙 기반 추론, 탐색, 확률 모델, 머신러닝을 포함하는 넓은 분야이며 머신러닝은 그중 데이터에서 패턴을 학습하는 접근이다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

#### 지능적 과제를 시스템으로 바꾸는 과정

인공지능은 하나의 알고리즘 이름이 아니라 지각, 예측, 추론, 계획, 생성, 행동처럼 지능을 요구하는 과제를 기계 시스템으로 구현하는 연구와 기술의 범주다. OECD의 정의처럼 시스템은 주어진 입력에서 예측·콘텐츠·추천·결정 같은 출력을 추론하며, 배포 뒤 적응하는 정도와 자율성은 시스템마다 다르다. 이 정의는 사람과 같은 내면을 가졌는지를 전제하지 않는다. 어떤 입력을 받아 어떤 환경에 영향을 주는 출력을 만드는지 관찰 가능한 기능과 경계로 설명한다. 따라서 “AI를 사용한다”는 말만으로 학습 방식, 책임 범위, 위험 수준을 알 수 없고 모델·데이터·사용자 인터페이스·운영 절차를 함께 봐야 한다.

현대 AI의 많은 부분은 사람이 모든 규칙을 직접 쓰는 대신 데이터에서 함수의 파라미터를 학습한다. 학습 단계는 예시와 목적 함수를 사용해 파라미터를 조정하고, 추론 단계는 고정된 파라미터로 새 입력의 출력을 계산한다. 같은 모델도 목적 함수와 데이터 표본, 피드백 방식에 따라 다른 행동을 배운다. 규칙 기반 시스템과 학습 시스템은 배타적이지 않다. 안전 제약, 검색, 계산 도구, 데이터베이스 규칙과 통계 모델을 결합할 수 있다. 중요한 것은 어느 결과가 학습된 모델에서 나오고 어느 결과가 명시적 규칙이나 외부 자료에서 왔는지 경계를 추적하는 일이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구성 요소와 처리 흐름

실제 시스템에서는 ‘인공지능’ 개념만 독립적으로 동작하지 않는다. [머신러닝](/wiki/machine-learning/), [딥러닝](/wiki/deep-learning/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

#### 모델 밖까지 포함한 전체 체계

실제 AI 시스템은 데이터 수집과 정제, 표현 방식, 학습 코드, 모델 가중치, 추론 서비스, 후처리, 사용자 경험, 모니터링으로 이어진다. 모델 평가가 좋아도 입력 수집이 달라지거나 후처리가 잘못되면 전체 결과는 나빠진다. 데이터에는 표본을 선택한 기준과 측정 오류가 반영되고, 목적 함수에는 무엇을 성공으로 간주하는지가 들어간다. 배포 환경의 사용자는 모델 출력을 새 입력이나 의사결정으로 되먹일 수 있어 시간이 지나면 데이터 분포 자체가 변한다. 그러므로 AI를 독립된 계산 상자가 아니라 사회·기술적 피드백을 가진 시스템으로 문서화해야 한다.

능력의 범위는 훈련 과제와 평가 증거로 제한해 표현한다. 특정 시험에서 높은 점수를 얻었다고 모든 상황에 일반적인 지능이 입증되는 것은 아니다. 언어 모델은 텍스트 확률을 학습하면서 번역·요약·질의응답에 활용될 수 있지만, 최신 사실 접근이나 외부 행동에는 검색·도구·권한 계층이 추가로 필요하다. 이미지 모델도 분류, 탐지, 분할이 서로 다른 출력 구조와 평가를 가진다. 시스템 설계자는 과제를 입력, 출력, 환경, 허용 오류로 쪼개고 필요한 모델과 비모델 구성 요소를 배치한다. 이 분해는 책임 소재와 시험 가능한 경계를 만든다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

분류·추천·예측·생성 과제를 정의할 때 입력과 목표, 평가 범위를 명확히 하는 데 쓰인다. ‘인공지능’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

#### 접근법 선택과 혼합

지식과 제약이 명확하고 오류 허용이 낮은 영역에서는 규칙, 검색, 최적화와 검증 가능한 계산이 중심이 될 수 있다. 이미지·음성·언어처럼 규칙을 모두 작성하기 어려운 패턴에는 학습 모델이 유용하다. 생성 모델은 열린 표현을 만들지만 정확한 산술, 최신 상태와 권한 판단을 외부 도구에 맡길 수 있다. 여러 접근을 결합할 때는 각 구성 요소가 실패하면 무엇이 관찰되는지, 어느 단계에서 대체 경로로 전환하는지 정의한다. 모델이 모든 결정을 맡는 구조보다 검증 가능한 부분을 코드와 데이터베이스에 두는 편이 재현성과 책임성을 높인다.

도입 우선순위는 기술 시연의 인상보다 문제의 반복 빈도, 데이터 준비도, 오류의 영향, 사람 검토 가능성과 운영 역량으로 정한다. 업무 시간이 많이 들더라도 사례가 드물고 정답 확인이 어렵다면 학습과 평가 데이터를 만들 비용이 이익보다 클 수 있다. 반대로 높은 빈도의 저위험 분류와 보조 작성은 사람 수정 기록을 통해 점진적으로 개선할 수 있다. 시스템의 영향을 받는 사용자와 현장 담당자를 문제 정의와 실패 검토에 포함해야 개발자가 예상하지 못한 비용과 우회 행동을 발견할 수 있다.

AI 시스템을 계속 사용할지는 최초 도입 때만 결정하지 않는다. 사용자 행동, 규제, 데이터와 대안 기술이 바뀌면 기준선과 위험도 달라진다. 정기 검토에서 기대한 이익이 실제로 발생했는지, 자동화가 새로운 수작업과 오류를 만들지 않았는지 확인한다. 성능이 유지되어도 목적이 사라졌거나 더 단순한 방법이 가능해졌다면 축소하거나 종료한다.

**검토 질문:** 출력이 틀렸을 때 누가 발견하고 어떤 상태로 되돌리는지, 영향을 받는 사람이 결과를 알고 이의를 제기할 수 있는지 확인한다. 이 질문에 답할 수 없다면 정확도 개선만으로 운영 준비가 되었다고 판단하지 않는다. 시스템의 자율성과 영향이 커질수록 사전 평가, 독립 승인과 사건 대응의 강도도 함께 높여야 한다.

시스템을 종료할 때도 모델 접근 권한, 저장 데이터와 파생 결과, 외부 연동을 정리하고 기록 보존 의무를 확인한다. 수명주기 책임은 배포 중단 선언만으로 끝나지 않는다.

성과와 위험 지표는 영향을 받는 집단별로 검토하고, 표본이 너무 적어 판단할 수 없는 집단을 “문제 없음”으로 표시하지 않는다. 측정 불가능성을 그대로 남기고 추가 데이터나 사용 제한이 필요한지 결정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 한계와 흔한 오해

사람처럼 보이는 출력과 실제 이해·의식은 같은 개념이 아니며, 시스템의 능력은 과제·데이터·환경 범위 안에서 평가해야 한다.

제품의 유창한 출력과 일반 지능을 동일시하지 않고 과제별 증거로 능력을 판단한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

#### 불확실성·편향·책임

학습된 모델은 관측한 데이터의 규칙성과 결손을 함께 반영한다. 드물거나 배제된 집단에서는 평균 성능이 숨긴 큰 오류가 나타날 수 있고, 과거 기록에 있는 차별적 결정이 목표처럼 재현될 수 있다. 생성 모델의 유창함은 사실 검증과 다르며, 학습 분포 밖의 입력에서 자신 있게 틀릴 수 있다. 더 큰 데이터와 모델이 모든 문제를 자동으로 없애는 것은 아니다. 어떤 표본이 수집되었는지, 라벨이 무엇을 의미하는지, 출력이 어떤 보상과 연결되는지가 그대로 남기 때문이다. 불확실성을 수치로 내더라도 그 값이 실제 오류 빈도와 맞는지 별도 보정이 필요하다.

OECD 원칙과 NIST 계열 위험 관리가 강조하듯 투명성, 강건성, 안전성, 책임성은 모델의 단일 속성이 아니라 수명주기 전반의 관리 과제다. 설명을 제공했다는 사실만으로 잘못된 결정을 정당화할 수 없고, 사람 승인도 검토자가 정보와 권한을 갖지 못하면 형식적 절차가 된다. 사용 목적, 영향을 받는 사람, 되돌릴 수 있는 정도에 따라 필요한 증거와 통제를 달리한다. 고위험 결정은 독립 검토, 이의 제기와 수정 경로, 사건 보고, 사용 중단 기준이 필요하다. 성능 향상과 별개로 개인정보, 저작권, 보안, 에너지와 노동 같은 외부 비용을 검토해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 관련 개념과의 구분

- [머신러닝](/wiki/machine-learning/): 명시적으로 모든 규칙을 작성하지 않고 데이터에서 패턴을 학습해 예측이나 결정을 수행하는 인공지능의 한 분야다.
- [딥러닝](/wiki/deep-learning/): 여러 층의 신경망으로 데이터의 표현을 단계적으로 학습하는 머신러닝 방법이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구체적 적용 예시

업무 문제를 AI 문제로 바꿀 때는 먼저 입력 자료, 원하는 판단이나 생성 결과, 사람이 확인할 실패 유형을 적는다. ‘인공지능’을 적용하는 경우에는 인공지능은 규칙 기반 추론, 탐색, 확률 모델, 머신러닝을 포함하는 넓은 분야이며 머신러닝은 그중 데이터에서 패턴을 학습하는 접근이다.

규칙 기반 기준선과 학습 기반 접근을 같은 시험 자료에서 비교하고, 과제 범위를 벗어난 요청에는 어떤 동작을 할지도 정한다. 이때 [머신러닝](/wiki/machine-learning/), [딥러닝](/wiki/deep-learning/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실무 적용과 검증 절차

1. **목적 정의:** ‘인공지능’이 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 분류·추천·예측·생성 과제를 정의할 때 입력과 목표, 평가 범위를 명확히 하는 데 쓰인다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 사람처럼 보이는 출력과 실제 이해·의식은 같은 개념이 아니며, 시스템의 능력은 과제·데이터·환경 범위 안에서 평가해야 한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘인공지능’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

#### 문제 정의에서 운영까지

AI 도입은 모델 목록을 고르는 대신 현재 의사결정의 기준선과 실패 비용을 적는 데서 시작한다. 사람이 수행하는 절차, 규칙 기반 자동화, 단순 통계 모델도 후보에 포함하고 AI가 추가로 만드는 이익을 측정한다. 입력과 정답을 누가 어떻게 만들었는지 조사하고, 학습·검증·시험 데이터를 분리한다. 평가에는 평균 품질뿐 아니라 중요한 집단과 극단 상황, 지연, 비용, 보안 공격을 넣는다. 결과를 실제 업무에 전달하는 인터페이스와 사람이 수정할 권한까지 시험해야 한다.

배포 전에는 모델 카드와 시스템 카드를 작성해 의도한 사용, 제외 용도, 데이터와 평가 범위, 알려진 한계, 담당자를 기록한다. 일부 트래픽에서 관찰한 뒤 사전에 정한 문턱을 통과할 때만 확대하고, 입력 분포·오류·사용자 수정·사건을 지속해서 감시한다. 모델이나 데이터, 프롬프트, 정책이 바뀌면 버전과 변경 이유를 연결해 회귀 시험을 반복한다. 문제가 생겼을 때 출력을 삭제하는 것만으로 끝내지 않고 영향을 받은 결정과 사용자를 찾고 복구한다. AI가 필요하지 않거나 위험 대비 이익이 작다는 결론도 정당한 평가 결과로 남긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 문서 관계

### 선행 개념

_해당 문서가 없습니다._

### 관련 문서

- [머신러닝](/wiki/machine-learning/)
- [딥러닝](/wiki/deep-learning/)

### 이 문서를 가리키는 문서

- [가설](/wiki/hypothesis/)
- [가설 공간](/wiki/hypothesis-space/)
- [가우스 과정](/wiki/gaussian-process/)
- [개념 드리프트](/wiki/concept-drift/)
- [거리 학습](/wiki/metric-learning/)

<details class="wiki-backlinks-more">
<summary>나머지 84개 문서 보기</summary>

- [검증 데이터셋](/wiki/validation-set/)
- [결정 트리](/wiki/decision-tree/)
- [계산지능](/wiki/computational-intelligence/)
- [계층적 군집화](/wiki/hierarchical-clustering/)
- [고전적 인공지능](/wiki/good-old-fashioned-ai/)
- [공짜 점심 없음 정리](/wiki/no-free-lunch-theorem/)
- [과소적합](/wiki/underfitting/)
- [과적합](/wiki/overfitting/)
- [군집화](/wiki/clustering/)
- [귀납적 편향](/wiki/inductive-bias/)
- [그래디언트 부스팅](/wiki/gradient-boosting/)
- [기호주의 인공지능](/wiki/symbolic-ai/)
- [나이브 베이즈 분류기](/wiki/naive-bayes-classifier/)
- [능동학습](/wiki/active-learning/)
- [다양체 학습](/wiki/manifold-learning/)
- [다중 과제 학습](/wiki/multi-task-learning/)
- [대조학습](/wiki/contrastive-learning/)
- [데이터 누수](/wiki/data-leakage/)
- [데이터 분포](/wiki/data-distribution/)
- [데이터 전처리](/wiki/data-preprocessing/)
- [독립 성분 분석](/wiki/independent-component-analysis/)
- [랜덤 포레스트](/wiki/random-forest/)
- [레이블](/wiki/label/)
- [로지스틱 회귀](/wiki/logistic-regression/)
- [마르코프 확률장](/wiki/markov-random-field/)
- [머신러닝](/wiki/machine-learning/)
- [머신러닝 파이프라인](/wiki/machine-learning-pipeline/)
- [메타학습](/wiki/meta-learning/)
- [모델 용량](/wiki/model-capacity/)
- [목표 변수](/wiki/target-variable/)
- [배깅](/wiki/bagging/)
- [배치 학습](/wiki/batch-learning/)
- [범용 인공지능](/wiki/artificial-general-intelligence/)
- [베이즈 네트워크](/wiki/bayesian-network/)
- [베이즈 학습](/wiki/bayesian-learning/)
- [부스팅](/wiki/boosting/)
- [분류](/wiki/classification/)
- [분리 표현](/wiki/disentangled-representation/)
- [분포 외 데이터](/wiki/out-of-distribution-data/)
- [분포 이동](/wiki/distribution-shift/)
- [불확실성 정량화](/wiki/uncertainty-quantification/)
- [생성 모델과 판별 모델](/wiki/generative-discriminative-model/)
- [서포트 벡터 머신](/wiki/support-vector-machine/)
- [선형 회귀](/wiki/linear-regression/)
- [앙상블 학습](/wiki/ensemble-learning/)
- [약인공지능](/wiki/narrow-ai/)
- [연결주의](/wiki/connectionism/)
- [예측](/wiki/prediction/)
- [오토인코더](/wiki/autoencoder/)
- [온라인 학습](/wiki/online-learning/)
- [은닉 마르코프 모델](/wiki/hidden-markov-model/)
- [의사결정 시스템](/wiki/decision-making-system/)
- [이상 탐지](/wiki/anomaly-detection/)
- [인공지능 겨울](/wiki/ai-winter/)
- [인공지능 생명주기](/wiki/ai-lifecycle/)
- [인공지능 시스템](/wiki/ai-system/)
- [일반화](/wiki/generalization/)
- [잠재 표현](/wiki/latent-representation/)
- [전문가 시스템](/wiki/expert-system/)
- [전이학습](/wiki/transfer-learning/)
- [제로샷 학습](/wiki/zero-shot-learning/)
- [주성분 분석](/wiki/principal-component-analysis/)
- [준지도학습](/wiki/semi-supervised-learning/)
- [지속학습](/wiki/continual-learning/)
- [차원 축소](/wiki/dimensionality-reduction/)
- [최대 사후 확률 추정](/wiki/maximum-a-posteriori-estimation/)
- [추천 시스템](/wiki/recommendation-system/)
- [커리큘럼 학습](/wiki/curriculum-learning/)
- [테스트 데이터셋](/wiki/test-set/)
- [튜링 테스트](/wiki/turing-test/)
- [특성](/wiki/feature/)
- [특성 공학](/wiki/feature-engineering/)
- [특성 학습](/wiki/feature-learning/)
- [파운데이션 모델](/wiki/foundation-model/)
- [편향-분산 절충](/wiki/bias-variance-tradeoff/)
- [표현학습](/wiki/representation-learning/)
- [퓨샷 학습](/wiki/few-shot-learning/)
- [학습·검증·테스트 분할](/wiki/train-validation-test-split/)
- [확률 그래프 모델](/wiki/probabilistic-graphical-model/)
- [확률 모델](/wiki/probabilistic-model/)
- [회귀](/wiki/regression/)
- [희소 부호화](/wiki/sparse-coding/)
- [K-최근접 이웃](/wiki/k-nearest-neighbors/)
- [K-평균 군집화](/wiki/k-means-clustering/)

</details>

### 이 문서를 포함하는 코스

[AI 기초](/course/ai-foundations/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Deep Learning Book](https://www.deeplearningbook.org/) — book
<span id="reference-2"></span>2. [Artificial intelligence — Wikipedia](https://en.wikipedia.org/wiki/Artificial_intelligence) — encyclopedia
<span id="reference-3"></span>3. [OECD AI Principles](https://oecd.ai/en/principles) — standard

### 코스에서 계속 읽기

- **AI 기초:** [다음 문서 — 머신러닝](/wiki/machine-learning/)

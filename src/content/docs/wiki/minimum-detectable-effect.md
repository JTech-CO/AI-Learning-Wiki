---
title: "최소 검출 가능 효과 Minimum Detectable Effect"
description: "최소 검출 가능 효과는 정한 유의수준, 검정력, 표본 크기와 변동성에서 실험이 지정된 확률로 검출하도록 설계된 가장 작은 효과 크기다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">MDE · 최소 탐지 가능 효과</p>

<p class="wiki-lead">최소 검출 가능 효과는 정한 유의수준, 검정력, 표본 크기와 변동성에서 실험이 지정된 확률로 검출하도록 설계된 가장 작은 효과 크기다.</p>

<div class="wiki-document-meta">분류: [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 출처 검토 완료 · 최근 검토: 2026-08-01</div>

## 개념과 원리

### 개요와 핵심 정의

최소 검출 가능 효과는 정한 유의수준, 검정력, 표본 크기와 변동성에서 실험이 지정된 확률로 검출하도록 설계된 가장 작은 효과 크기다.

MDE는 관측된 효과의 사후 품질표시가 아니라 실험 전 민감도 설계값이다. 의미 있는 최소 개선, 허용 오류 확률과 확보 가능한 평가 표본을 연결한다.

‘최소 검출 가능 효과(Minimum Detectable Effect)’를 이해할 때는 명칭만 외우지 않고 무엇을 입력으로 받고, 어떤 상태나 규칙을 적용하며, 어떤 결과를 관찰하는지 나누어 본다. 이 구분은 비슷한 기능을 제공하는 모델·도구·표준을 비교할 때 같은 단어가 서로 다른 의미로 쓰이는 문제를 줄인다. 또한 결과가 유효하다고 판단할 기준과 판단을 보류해야 할 조건을 함께 적어야 실제 학습과 운영에 연결할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 배경과 설명 범위

MDE는 관측 결과의 신뢰구간이나 p값이 아니다. 실험 설계가 어느 크기의 실제 차이에 민감하도록 만들었는지를 나타내는 사전 기준이다.

이 문서의 범위는 ‘최소 검출 가능 효과’의 안정적인 정의, 핵심 처리 흐름, 적용 조건과 실패 경계다. 특정 제품의 가격·기본값·성능 수치처럼 빠르게 바뀌는 정보는 일반 원리와 분리하고, 구현을 선택할 때는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

개념의 범위를 정할 때는 상위 개념, 같은 단계의 대안, 하위 구현과 관측 지표를 구분한다. 이름이 비슷하더라도 입력 단위나 보장 범위가 다르면 서로 대체할 수 없다. 반대로 구현 이름이 달라도 같은 입력과 판단 규칙을 제공한다면 공통 원리 위에서 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 작동 원리

귀무가설과 검정 통계량을 정하고 유의수준과 목표 검정력을 고정한다. 기준 분산과 표본 수를 사용해 대립가설에서 검정력이 목표에 도달하는 최소 차이를 역으로 계산한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 계산 또는 규칙 적용, 결과 생성, 검증과 기록의 다섯 단계로 나누어 추적한다. 각 단계에는 입력 자료형과 단위, 선택한 설정, 실패 상태와 다음 단계로 넘기는 값을 남긴다. 이렇게 하면 최종 결과가 기대와 다를 때 최초로 차이가 생긴 위치를 찾을 수 있다.

‘최소 검출 가능 효과(Minimum Detectable Effect)’의 구현을 비교할 때는 정상 사례 하나만 보지 않는다. 경계값, 빈 입력, 큰 입력, 일부 정보가 누락된 입력과 의도적인 실패 사례를 같은 절차로 실행하고, 값이 달라진 이유가 데이터·설정·알고리즘·운영 자원 중 어디에 있는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 구성 요소와 데이터 흐름

‘최소 검출 가능 효과’를 시스템에 넣을 때는 사용자 또는 호출자의 입력 인터페이스, 핵심 상태와 계산부, 정책·설정, 결과 검증부, 관측과 오류 처리부로 나눈다. 구성 요소 사이에는 자료형, 식별자, 단위, 시간 제한과 오류 전달 규칙을 명시한다.

MDE는 관측된 효과의 사후 품질표시가 아니라 실험 전 민감도 설계값이다. 의미 있는 최소 개선, 허용 오류 확률과 확보 가능한 평가 표본을 연결한다. 이 원리를 데이터 흐름으로 표현하면 어떤 값이 영구 상태인지, 요청 동안만 유지되는지, 외부 근거에서 오는지 구분할 수 있다. 내부 구현을 바꾸더라도 입력·출력 계약과 검증 사례를 유지하면 교체 전후의 동작을 재현 가능한 방식으로 비교할 수 있다.

문서·코스·도구 연결에서는 ‘최소 검출 가능 효과’ 문서를 ‘llm-evaluation’ 코스와 ‘evaluation-metrics’ 도구가 공유한다. 코스는 읽기 순서를 제공하고 도구는 입력값으로 원리를 확인하게 하므로, 용어 정의와 실습 결과가 다른 기준을 사용하지 않도록 같은 선수·관련 문서 ID를 사용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

모델 A/B 평가의 표본 수 계획, 작은 품질 개선을 주장할 수 있는지 판단하고 평가 예산을 배분할 때 사용한다. 절대 차이와 상대 차이를 구분해 기록해야 한다.

도입 여부는 유행이나 제품 이름이 아니라 해결하려는 문제와 측정 가능한 개선으로 결정한다. 먼저 현재 방식의 품질, 오류, 지연 시간, 자원, 비용과 사람 개입을 기준선으로 기록한다. 그다음 ‘최소 검출 가능 효과’를 적용한 같은 사례에서 개선된 항목과 악화된 항목을 함께 비교한다.

선택 기준에는 평균값뿐 아니라 하위 집단과 어려운 사례, 최악 조건, 운영 복구 시간과 설명 가능성을 포함한다. 작은 오프라인 실험에서 전제가 맞는지 확인하고, 제한된 실제 트래픽과 배포 후 관측으로 증거를 확장한다. 개선 폭이 추가 복잡도와 잔여 위험을 상쇄하지 못하면 단순한 기준선을 유지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 한계와 실패 조건

분산, 기준 비율과 독립성 가정이 틀리면 계산값도 달라진다. 통계적으로 검출 가능한 최소치와 실제 사용자에게 의미 있는 최소치는 같지 않을 수 있다.

한계는 개념 자체의 보장 범위, 데이터와 표본의 제약, 특정 구현의 미지원·버그, 잘못된 설정과 운영 자원 부족으로 나누어 기록한다. 결과가 자연스럽거나 오류 없이 반환됐다는 이유만으로 사실성, 공정성, 보안성 또는 통계적 보장까지 확보됐다고 해석하지 않는다.

배포 전에는 알려진 실패를 재현하는 고정 사례와 예상하지 못한 입력을 찾는 탐색 시험을 함께 실행한다. 경고선과 중단선을 따로 두고 자동화가 확신하지 못하거나 실패 비용이 큰 조건은 보류 또는 사람 검토로 보낸다. 완화책을 적용한 뒤 새로 생긴 비용과 제약도 잔여 위험에 포함한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 선수 개념과 관련 개념

MDE는 관측 결과의 신뢰구간이나 p값이 아니다. 실험 설계가 어느 크기의 실제 차이에 민감하도록 만들었는지를 나타내는 사전 기준이다.

#### 먼저 읽을 문서

- [가설검정](/wiki/hypothesis-testing/): 이 문서를 이해하기 위한 선수 개념이다.
- [신뢰구간](/wiki/confidence-interval/): 이 문서를 이해하기 위한 선수 개념이다.

#### 함께 비교할 문서

- [통계적 유의성](/wiki/statistical-significance/): 입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.
- [평가 예산 배분](/wiki/evaluation-budget-allocation/): 입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.
- [대응 부트스트랩](/wiki/paired-bootstrap/): 입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.

관련 있음과 선수 관계는 같은 뜻이 아니다. 선수 문서는 현재 개념의 정의나 계산을 설명하는 데 먼저 필요하고, 관련 문서는 같은 문제를 다른 단계나 기준에서 다룬다. 이 구분을 유지해야 자동 학습 경로가 불필요하게 길어지지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 구체적인 적용 예시

정확도 80퍼센트인 기준 모델보다 1퍼센트포인트 개선을 80퍼센트 검정력으로 찾고 싶다면 필요한 표본 수를 먼저 계산하고, 확보할 수 없다면 결론 범위를 줄인다.

이 사례를 검증할 때는 적용 전 입력과 기준선 결과를 보존하고, ‘최소 검출 가능 효과’를 적용한 뒤 바뀐 설정과 중간 상태를 순서대로 기록한다. 결과 표에는 성공 여부만 두지 않고 품질, 비용, 지연, 자원, 보류·사람 개입 횟수와 남은 불확실성을 포함한다.

한 번의 성공 사례를 일반화하지 않는다. 입력 크기와 난도, 사용자 집단 또는 장치 조건을 바꾼 경계 사례를 추가하고 같은 결론이 유지되는지 확인한다. 이 예시는 원리를 설명하기 위한 검증 틀이며 특정 구현의 성능이나 모든 환경에서의 효과를 보장하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목표 정의:** ‘최소 검출 가능 효과’로 바꾸려는 결과와 바꾸지 않을 범위를 각각 한 문장으로 적는다.
2. **선수 확인:** [가설검정](/wiki/hypothesis-testing/), [신뢰구간](/wiki/confidence-interval/)의 정의와 입력 조건을 먼저 확인한다.
3. **계약 고정:** 입력 자료형, 단위, 필수값, 출력과 실패 상태를 명시한다.
4. **기준선 저장:** 현재 방법을 같은 데이터와 예산에서 실행해 비교값을 남긴다.
5. **정상·경계·실패 시험:** 평균 사례뿐 아니라 누락, 극단값, 분포 변화와 중단을 포함한다.
6. **운영 지표 기록:** 품질, 지연 시간, 자원, 비용, 경고와 사람 개입을 함께 측정한다.
7. **재검토 조건 지정:** 데이터, 모델, 표준, 코드나 정책이 바뀌면 같은 시험을 반복한다.

최종 기록에는 출처의 기준 날짜와 위치, 실행 환경, 결과 해석, 알려진 한계, 롤백 대상과 다음 검토 조건을 포함한다. 선택한 방법이 기준선보다 낫다는 결론은 사전에 정한 성공 기준을 충족할 때만 유지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 최소 검출 가능 효과의 입력, 처리 규칙과 출력을 서로 구분해 설명할 수 있는가?
- 가설검정·신뢰구간와 어떤 선후 관계가 있는지 사례로 설명할 수 있는가?
- 다음 한계를 실제 사례에서 찾을 수 있는가? 분산, 기준 비율과 독립성 가정이 틀리면 계산값도 달라진다. 통계적으로 검출 가능한 최소치와 실제 사용자에게 의미 있는 최소치는 같지 않을 수 있다.
- 적용 결과를 판단할 지표와 자동 처리를 중단하거나 사람에게 넘길 조건을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [가설검정](/wiki/hypothesis-testing/)
- [신뢰구간](/wiki/confidence-interval/)

### 관련 문서

- [통계적 유의성](/wiki/statistical-significance/)
- [평가 예산 배분](/wiki/evaluation-budget-allocation/)
- [대응 부트스트랩](/wiki/paired-bootstrap/)

### 이 문서를 가리키는 문서

_해당 문서가 없다._

### 이 문서를 포함하는 코스

[LLM 평가와 관측성](/course/llm-evaluation/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Selective Classification for Deep Neural Networks](https://arxiv.org/abs/1705.08500) — paper
2. <span id="reference-2"></span>[SelectiveNet: A Deep Neural Network with an Integrated Reject Option](https://proceedings.mlr.press/v97/geifman19a.html) — paper
3. <span id="reference-3"></span>[A Gentle Introduction to Conformal Prediction and Distribution-Free Uncertainty Quantification](https://arxiv.org/abs/2107.07511) — paper
4. <span id="reference-4"></span>[Statistical Significance Tests for Machine Translation Evaluation](https://aclanthology.org/W04-3250.pdf) — paper
5. <span id="reference-5"></span>[Minimum Detectable Effects: A Simple Way to Report the Statistical Power of Experimental Designs](https://doi.org/10.1177/0193841X9501900504) — paper

### 코스에서 계속 읽기

- **LLM 평가와 관측성:** [다음 문서 — 참조 기반 평가](/wiki/reference-based-evaluation/)

---
title: "로짓 Logit"
description: "확률로 정규화하기 전 모델이 각 클래스나 토큰 후보에 내놓는 실수 점수이며, 이항 문제에서는 로그 오즈로 해석된다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">확률로 정규화하기 전 모델이 각 클래스나 토큰 후보에 내놓는 실수 점수이며, 이항 문제에서는 로그 오즈로 해석된다.</p>

<div class="wiki-document-meta">분류: [추론·서빙·최적화](/category/inference/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

확률로 정규화하기 전 모델이 각 클래스나 토큰 후보에 내놓는 실수 점수이며, 이항 문제에서는 로그 오즈로 해석된다.

‘로짓’ 개념은 추론·서빙·최적화 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 추론·서빙 분야는 학습된 모델을 실제 요청에 실행할 때의 생성 규칙과 시스템 자원 관리를 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 배경과 설명 범위

직접 대응하는 외부 백과 표제어가 뚜렷하지 않은 신생·세부 용어다. 따라서 아래 1차 자료와 상위 개념 문서를 중심으로 범위를 정하고, 제품별 용어는 일반 원리와 분리했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a></div>

## 작동 원리

다중 클래스 모델에서는 로짓 벡터를 소프트맥스에 넣어 확률 분포로 바꾸며, 공통 상수를 모든 로짓에 더해도 결과 확률은 변하지 않는다. 이항 로지스틱 회귀에서는 확률 p의 로짓을 log(p/(1-p))로 정의한다.

[추론](/wiki/inference/) 개념을 먼저 이해하면 계산 위치와 역할을 구분하기 쉽다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘로짓’ 개념만 독립적으로 동작하지 않는다. [추론](/wiki/inference/), [소프트맥스](/wiki/softmax/), [Temperature](/wiki/temperature/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용 분야와 선택 기준

분류 임계값을 해석하고 생성 모델의 온도·마스킹·후보 선택이 확률 분포에 미치는 영향을 추적하는 데 사용한다. ‘로짓’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 한계와 흔한 오해

로짓 자체는 확률이 아니며 서로 다른 모델·입력의 절대 크기를 바로 비교하면 해석이 틀릴 수 있다.

평균 성능만으로 운영 안정성을 판단하지 말고 부하·꼬리 지연·실패 복구를 포함한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 관련 개념과의 구분

- [추론](/wiki/inference/): 학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.
- [소프트맥스](/wiki/softmax/): 여러 로짓을 합이 1인 확률 분포로 변환하는 함수다.
- [Temperature](/wiki/temperature/): 로짓의 크기를 조정해 생성 확률 분포의 평탄함과 무작위성을 제어하는 값이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구체적 적용 예시

실제 요청 길이와 동시 사용자 수를 반영한 부하 시험에서 첫 토큰 지연, 전체 지연, 처리량과 오류율을 함께 잰다. ‘로짓’을 적용하는 경우에는 로짓은 소프트맥스에 들어가기 전의 정규화되지 않은 점수로, 값의 차이가 클래스나 토큰의 상대 확률을 결정한다.

평균값 외에 상위 백분위 지연과 메모리 부족, 시간 초과, 재시도 상황을 재현해 운영 한계를 정한다. 이때 [추론](/wiki/inference/), [소프트맥스](/wiki/softmax/), [생성 온도](/wiki/temperature/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘로짓’이 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** [추론](/wiki/inference/)의 정의와 입력 조건을 먼저 확인한다.
3. **기준선 설정:** 지연 시간, 처리량, 메모리, 비용과 출력 품질의 균형을 맞추는 데 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 로짓 자체는 확률이 아니며 서로 다른 모델·입력의 절대 크기를 바로 비교하면 해석이 틀릴 수 있다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘로짓’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- [추론](/wiki/inference/)와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

- [추론](/wiki/inference/)

## 관련 문서

- [추론](/wiki/inference/)
- [소프트맥스](/wiki/softmax/)
- [생성 온도](/wiki/temperature/)

## 이 문서를 가리키는 문서

- [추론](/wiki/inference/)
- [소프트맥스](/wiki/softmax/)

## 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [SciPy special.logit](https://docs.scipy.org/doc/scipy/reference/generated/scipy.special.logit.html) — documentation
<span id="reference-2"></span>2. [Logit — Wikipedia](https://en.wikipedia.org/wiki/Logit) — encyclopedia
<span id="reference-3"></span>3. [An Introduction to Statistical Learning](https://www.statlearning.com/) — book

## 코스에서 계속 읽기

- **LLM 내부 구조:** [다음 문서 — 소프트맥스](/wiki/softmax/)

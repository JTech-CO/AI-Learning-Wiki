---
title: "소프트맥스 Softmax"
description: "여러 실수 점수를 지수화하고 합으로 나눠 합이 1인 비율 벡터로 바꾸는 함수다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">Softmax Function · 소프트맥스 함수</p>

<p class="wiki-lead">여러 실수 점수를 지수화하고 합으로 나눠 합이 1인 비율 벡터로 바꾸는 함수다.</p>

<div class="wiki-document-meta">분류: [추론·서빙·최적화](/category/inference/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

여러 실수 점수를 지수화하고 합으로 나눠 합이 1인 비율 벡터로 바꾸는 함수다.

분류 모델과 언어 모델에서 정규화되지 않은 로짓을 클래스나 토큰에 대한 상대적 비율로 변환한다. 출력은 0과 1 사이이며 선택한 축을 따라 합이 1이지만 자동으로 보정된 확률이라는 뜻은 아니다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

함수의 수식, 수치 안정성, 온도 조정, 교차 엔트로피와의 연결을 다룬다. 모델의 확률 보정이나 샘플링 정책 전체와 소프트맥스 연산 자체를 구분한다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

입력 x_i에 대해 exp(x_i)를 모든 입력 지수의 합으로 나눈다. 같은 상수를 모든 로짓에서 빼도 결과가 같으므로 구현은 보통 최댓값을 먼저 빼 지수 오버플로를 줄인다.

[로짓](/wiki/logit/) 및 [확률](/wiki/probability/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

입력 로짓, 정규화할 차원, 선택적 온도가 핵심 요소다. 분류에서는 클래스 축에 적용하고 언어 생성에서는 어휘 축에 적용한 뒤 디코딩 규칙이 실제 토큰을 선택한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

다중 클래스 분류의 출력, 어텐션 가중치, 다음 토큰 분포와 정책 선택에 사용한다. 비교 대상이 상호 배타적인지와 어떤 축을 정규화하는지 먼저 확인해야 한다.

두 클래스 문제도 두 로짓 소프트맥스나 하나의 로짓 시그모이드로 표현할 수 있다. 손실 계산에서는 소프트맥스와 로그를 따로 적용하기보다 수치적으로 안정적인 결합 연산을 사용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

큰 로짓 차이는 매우 뾰족한 분포를 만들고 작은 차이는 평평한 분포를 만든다. 높은 출력값은 학습 데이터 밖에서도 나타날 수 있으므로 신뢰도와 동일시하면 안 된다.

온도나 마스킹을 적용하는 순서, 부동소수점 정밀도, 제외 토큰의 음의 무한대 처리를 시험한다. 생성 품질은 소프트맥스뿐 아니라 top-k·top-p·반복 패널티 등 후속 정책에도 좌우된다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [로짓](/wiki/logit/): 로짓은 정규화 전 점수이고 소프트맥스는 여러 로짓을 상대적 비율로 변환한다.
- [생성 온도](/wiki/temperature/): 온도는 로짓의 상대적 간격을 조정하고 소프트맥스 분포의 뾰족함을 바꾼다.
- [Top-k 샘플링](/wiki/top-k-sampling/): top-k 샘플링은 소프트맥스 뒤 후보 수를 제한하는 선택 정책이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적 적용 예시

로짓 [2, 1, 0]에서 최댓값 2를 빼 [0, -1, -2]로 만든 뒤 지수화하고 합으로 나눈다. 결과는 대략 [0.665, 0.245, 0.090]이며 순서는 유지되지만 차이가 비선형적으로 강조된다. 온도를 높이면 더 평평해지고 낮추면 첫 항목에 더 집중된다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 소프트맥스 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 소프트맥스이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 출력 합, 적용 축, 극단 로짓에서의 유한값, 로그소프트맥스와 결합 손실의 일치 여부를 확인한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

#### 운영 기록 템플릿

- **선택 근거:** 소프트맥스을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [temperature](/wiki/temperature/), [top-k-sampling](/wiki/top-k-sampling/), [next-token-prediction](/wiki/next-token-prediction/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 소프트맥스의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 학습 체크

- 소프트맥스의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [생성 온도](/wiki/temperature/)와 [Top-k 샘플링](/wiki/top-k-sampling/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 문서 관계

### 선행 개념

- [로짓](/wiki/logit/)
- [확률](/wiki/probability/)

### 관련 문서

- [생성 온도](/wiki/temperature/)
- [Top-k 샘플링](/wiki/top-k-sampling/)
- [다음 토큰 예측](/wiki/next-token-prediction/)

### 이 문서를 가리키는 문서

- [다음 토큰 예측](/wiki/next-token-prediction/)
- [로짓](/wiki/logit/)
- [생성 온도](/wiki/temperature/)
- [추론](/wiki/inference/)
- [쿼리·키·값](/wiki/query-key-value/)

<details class="wiki-backlinks-more">
<summary>나머지 2개 문서 보기</summary>

- [행렬 곱셈](/wiki/matrix-multiplication/)
- [Top-k 샘플링](/wiki/top-k-sampling/)

</details>

### 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Deep Learning Book: Numerical Computation and Output Units](https://www.deeplearningbook.org/contents/numerical.html) — book
<span id="reference-2"></span>2. [PyTorch Softmax](https://docs.pytorch.org/docs/stable/generated/torch.nn.Softmax.html) — documentation
<span id="reference-3"></span>3. [Softmax function — Wikipedia](https://en.wikipedia.org/wiki/Softmax_function) — encyclopedia

### 코스에서 계속 읽기

- **LLM 내부 구조:** [다음 문서 — 생성 온도](/wiki/temperature/)

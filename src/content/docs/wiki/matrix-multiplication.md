---
title: "행렬 곱셈 Matrix Multiplication"
description: "첫 행렬의 행과 둘째 행렬의 열을 내적해 새로운 행렬을 만드는 선형대수 연산으로, 신경망의 선형 변환을 구성하는 핵심 계산이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">행렬곱 · Matrix Product</p>

<p class="wiki-lead">첫 행렬의 행과 둘째 행렬의 열을 내적해 새로운 행렬을 만드는 선형대수 연산으로, 신경망의 선형 변환을 구성하는 핵심 계산이다.</p>

<div class="wiki-document-meta">분류: [수학·통계 기초](/category/mathematics/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

첫 행렬의 행과 둘째 행렬의 열을 내적해 새로운 행렬을 만드는 선형대수 연산으로, 신경망의 선형 변환을 구성하는 핵심 계산이다.

A의 크기가 m×n이고 B의 크기가 n×p일 때 곱 AB는 m×p이며, 원소 Cᵢⱼ는 A의 i번째 행과 B의 j번째 열의 대응 원소 곱을 더해 계산한다. 내부 차원 n이 일치해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

행렬 곱셈은 원소별 곱과 다르고 일반적으로 교환법칙 AB=BA가 성립하지 않는다. 결합법칙은 성립하지만 계산 순서에 따라 중간 텐서 크기와 비용이 달라질 수 있다. 배치 행렬 곱에서는 프레임워크의 브로드캐스팅 규칙까지 명세해야 한다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

각 출력 원소는 공통 차원을 축약한 합으로 만들어진다. 신경망의 선형층에서는 입력 배치와 가중치 행렬을 곱하고 편향을 더한다. 어텐션에서는 QKᵀ와 확률 가중치 V 곱처럼 같은 연산이 서로 다른 의미로 반복된다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

입력 shape, 축의 의미, 전치 여부, 자료형, 장치가 인터페이스를 결정한다. 구현은 BLAS나 가속기 커널을 이용하며 메모리 배치와 타일링이 실제 처리량에 영향을 준다. 수학식이 같아도 float16과 float32의 누적 정밀도는 다를 수 있다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

선형층, 임베딩 투영, 어텐션 점수, 주성분 분석, 좌표 변환에 사용된다. 연산을 선택할 때는 축 의미가 맞는지 먼저 확인하고, 큰 배치에서는 정확도뿐 아니라 메모리 사용량과 커널 효율을 함께 측정한다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

차원 불일치와 잘못된 전치, 의도하지 않은 브로드캐스팅은 흔한 오류다. 큰 행렬에서는 O(mnp) 수준의 계산과 메모리 이동이 병목이 되며, 낮은 정밀도에서는 오버플로·언더플로와 누적 오차가 나타날 수 있다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [scalar](/wiki/scalar/): 하나의 값이며 행렬 곱의 축약 결과나 배율로 사용될 수 있다.
- [vector](/wiki/vector/): 한 축을 가진 배열로 행렬-벡터 곱의 피연산자가 된다.
- [tensor](/wiki/tensor/): 행렬을 포함하는 다차원 자료 구조이며 배치 축과 브로드캐스팅 규칙을 추가로 가진다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적인 적용 예시

A=[[1,2],[3,4]], B=[[5,6],[7,8]]이면 AB=[[19,22],[43,50]]이다. 반대로 BA는 다른 값이므로 순서를 API 계약에 포함한다. 코드에서는 작은 손계산 결과, shape, 자료형을 단위 테스트로 고정한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 입력·출력 shape, 축 이름, 전치 여부, 자료형, 허용 오차와 최대 메모리 사용량을 남긴다.
6. **운영 통제:** 자동 중단·롤백 조건과 사람이 검토해야 하는 사건을 지정한다.

검토자는 문서의 출처 번호를 따라 정의와 한계를 다시 확인하고, 구현 버전이 바뀔 때 같은 기준 사례와 실패 시험을 반복한다. 개선 폭이 복잡성과 잔여 위험을 상쇄하지 못하면 단순한 기준선으로 돌아간다.

#### 운영 기록 템플릿

- 선택 근거와 제외한 대안을 함께 적어 나중에 결정 조건을 복원한다.
- 입력 데이터의 기준 시점, 표본 수, 결측 처리와 권한 범위를 고정한다.
- 정상 기준 사례, 경계 사례, 의도적으로 실패시킬 사례의 기대 결과를 배포 전에 승인한다.
- 품질·지연시간·비용과 안전 지표에 경고선과 중단선을 따로 둔다.
- 변경 뒤 동일 평가를 반복하고 결과 차이가 데이터, 코드, 모델 또는 정책 중 어디에서 생겼는지 분류한다.
- 자동화가 확신하지 못하거나 영향이 큰 경우 사람이 판단할 수 있도록 입력과 근거, 가능한 대안을 한 화면에 제공한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 학습 체크

- 행렬 곱셈 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [스칼라](/wiki/scalar/)
- [벡터](/wiki/vector/)

### 관련 문서

- [텐서](/wiki/tensor/)
- [가중치](/wiki/weight/)
- [소프트맥스](/wiki/softmax/)

### 이 문서를 가리키는 문서

_해당 문서가 없다._

### 이 문서를 포함하는 코스

_포함된 코스가 없다._

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Deep Learning Book: Linear Algebra](https://www.deeplearningbook.org/contents/linear_algebra.html) — book
<span id="reference-2"></span>2. [NumPy matmul](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html) — documentation
<span id="reference-3"></span>3. [Matrix multiplication — Wikipedia](https://en.wikipedia.org/wiki/Matrix_multiplication) — encyclopedia

### 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없다._

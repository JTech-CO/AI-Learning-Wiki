---
title: "벡터 Vector"
description: "순서가 있는 수치 목록으로, 모델에서 데이터와 파라미터를 표현하는 기본 단위다. 유클리드 공간에서는 크기와 방향을 가진 대상으로 해석할 수 있다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-lead">순서가 있는 수치 목록으로, 모델에서 데이터와 파라미터를 표현하는 기본 단위다. 유클리드 공간에서는 크기와 방향을 가진 대상으로 해석할 수 있다.</p>

<div class="wiki-document-meta">분류: [수학·통계 기초](/category/mathematics/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-12</div>

## 개념과 원리

### 개요와 핵심 정의

크기와 방향 또는 순서가 있는 수치 목록으로, 모델에서 데이터와 파라미터를 표현하는 기본 단위다.

‘벡터’ 개념은 수학·통계 기초 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 수학·통계 개념은 데이터 표현, 불확실성, 최적화 과정을 정량적으로 설명하는 공통 언어다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 배경과 설명 범위

영문 Wikipedia의 ‘Euclidean vector’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 작동 원리

벡터는 순서가 있는 수의 배열이며 각 원소는 인덱스로 식별된다. 머신러닝에서는 특징·임베딩·기울기를 좌표 배열로 표현하고, 차원과 원소의 의미가 연산 조건을 결정한다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

#### 크기와 방향을 가진 좌표 표현

벡터는 순서가 있는 수의 배열로 표현할 수 있으며, 각 성분은 선택한 좌표계의 축에 대한 값을 나타낸다. 두 벡터의 덧셈은 대응 성분을 더하고 스칼라 곱은 모든 성분에 같은 수를 곱한다. 이 연산은 원점에서의 이동, 특성의 조합, 파라미터 갱신처럼 서로 다른 현상을 같은 대수 구조로 다루게 한다. 좌표 배열과 추상 벡터를 구분하는 것이 중요하다. 기저를 바꾸면 숫자 성분은 달라져도 나타내는 대상은 같을 수 있다. 머신러닝에서는 입력 표본, 모델 가중치, 중간 활성값, 그래디언트를 벡터로 배치해 선형대수 연산으로 계산한다.

내적은 두 벡터의 대응 성분 곱을 더한 값이며 길이와 각도의 관계를 제공한다. 정규화된 벡터의 내적은 코사인 유사도와 연결되어 방향의 유사성을 비교한다. 노름은 벡터의 크기를 재는 함수로 L1과 L2 노름은 서로 다른 기하와 최적화 성질을 가진다. 벡터를 다른 방향 위로 투영하면 그 방향이 설명하는 성분을 분리할 수 있다. 임베딩 검색에서는 쿼리와 문서를 같은 공간의 벡터로 바꾸고 내적·코사인·유클리드 거리 같은 기준으로 가까운 항목을 찾지만, 어떤 거리 기준이 의미 있는지는 학습 목표와 정규화에 달려 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구성 요소와 처리 흐름

실제 시스템에서는 ‘벡터’ 개념만 독립적으로 동작하지 않는다. [행렬](/wiki/matrix/), [텐서](/wiki/tensor/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

#### 형상·축·메모리 배치

코드에서 벡터는 흔히 1차원 배열이지만 행 벡터와 열 벡터를 수식에 쓸 때 곱셈 가능한 형상을 명확히 해야 한다. 벡터 여러 개를 쌓으면 행렬이 되고, 배치·시간·채널 축이 추가되면 고차원 텐서가 된다. 축 이름을 생략하면 같은 숫자 배열을 표본 수, 특성 수, 토큰 수로 잘못 해석할 수 있다. 연산 전후의 형상을 문서화하고 브로드캐스팅이 어느 축을 복제하는지 확인한다. 전치와 reshape는 데이터의 의미와 메모리 순서를 다르게 바꿀 수 있으므로 단순히 오류를 없애기 위해 적용하지 않는다.

NumPy의 ndarray는 자료형, 형상, 스트라이드와 데이터 버퍼로 배열을 표현한다. 슬라이스가 원본 메모리를 공유하는 뷰인지 복사본인지에 따라 한쪽 변경이 다른 값에 영향을 줄 수 있다. 연속되지 않은 뷰는 수학적으로 같은 값을 가져도 일부 커널에서 복사나 느린 접근을 유발한다. 정수와 부동소수점 자료형의 범위, 정밀도, 자동 형 변환은 거리와 누적합 결과를 바꾼다. 큰 벡터 집합에서는 개별 파이썬 반복보다 벡터화된 연산과 블록 처리가 효율적이지만, 중간 배열을 과도하게 만들면 메모리 사용이 늘어난다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

모델의 손실과 거리, 확률, 기울기를 해석하고 구현의 차원·단위를 검증하는 데 쓰인다. ‘벡터’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

#### 표현과 거리의 선택

범주형 값은 임의의 정수 크기로 표현하면 존재하지 않는 순서가 생길 수 있어 원-핫 벡터나 학습 임베딩을 사용한다. 물리량은 단위와 척도를 맞추고, 각도처럼 주기적인 값은 사인·코사인 성분으로 표현할 수 있다. 텍스트의 단어 빈도는 희소 벡터, 의미 검색은 학습된 밀집 벡터가 후보지만 두 표현은 보존하는 정보가 다르다. 희소 검색은 정확한 고유명사와 숫자에 강하고 밀집 검색은 재서술에 강할 수 있어 결합 검색이 유리한 경우가 있다.

차원 축소는 시각화, 노이즈 제거, 계산 절약에 쓰이지만 보존하려는 구조를 명시해야 한다. PCA는 큰 분산 방향을 선형적으로 보존하고 비선형 시각화 기법은 국소 이웃을 강조할 수 있으나 그림의 전역 거리까지 의미 있게 만들지는 않는다. 모델 입력의 벡터 표현을 고를 때는 다운스트림 지표와 자원으로 비교하고, 시각적으로 군집이 예쁘다는 이유만으로 선택하지 않는다. 축을 추가하거나 순서를 바꿀 때 스키마 버전을 올려 학습된 파라미터와 잘못 결합되지 않게 한다.

벡터 표현은 데이터 계약의 일부로 다룬다. 각 성분의 의미가 명시된 특성 벡터와 학습된 임베딩은 문서화 방식이 다르지만, 모두 생성 코드와 버전, 결측값 처리와 호환 범위를 가져야 한다. 저장된 벡터만 남기고 원천과 변환을 잃으면 오류를 수정하거나 새 표현으로 재생성할 수 없으므로 계보를 함께 보존한다.

**계산 사례:** 벡터 x=(3,4)의 L2 노름은 5이고 정규화하면 (0.6,0.8)이 된다. 두 정규화 벡터의 내적은 방향의 코사인과 같지만, 원래 벡터 크기에 있던 정보는 사라진다. 따라서 추천에서 활동량이 벡터 크기에 반영되었다면 무조건 정규화하는 순간 그 신호를 제거하게 된다. 반대로 의미 검색에서 문장 길이에 따른 크기 차이가 불필요하다면 정규화가 비교를 안정화할 수 있다.

배열 코드에서는 x의 형상이 (2,)인지 (1,2)인지에 따라 행렬 곱과 브로드캐스팅 결과가 다르다. 테스트는 값뿐 아니라 기대 형상과 자료형을 함께 단언하고, 빈 배치와 단일 표본에서도 축이 사라지지 않는지 확인한다.

거리나 유사도 임계값은 다른 모델·차원·정규화 설정으로 옮겨 쓸 수 없다. 분포를 새로 측정하고 업무상 허용할 오탐·미탐 비용으로 다시 정한다. 이 설정을 인덱스 버전과 함께 저장한다.

수치 시험은 허용 오차를 자료형과 연산 크기에 맞춰 정한다. 모든 값을 정확히 같다고 비교하거나 지나치게 큰 오차를 허용하지 않는다. 누적 연산과 병렬 순서 차이는 상대·절대 오차를 함께 사용하고 업무 결과에 미치는 영향을 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 한계와 흔한 오해

좌표의 의미와 단위, 정규화가 다르면 거리와 내적 비교가 무의미해질 수 있다.

수식의 조건과 가정을 생략하면 같은 기호도 다른 의미가 되므로 정의역과 집계 방식을 기록한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

#### 고차원과 수치 오차

차원이 커지면 모든 점 사이 거리가 비슷해지는 거리 집중 현상이 나타날 수 있고, 직관적인 가까움의 의미가 약해진다. 관련 없는 차원과 서로 다른 척도의 특성을 그대로 합치면 큰 범위의 성분이 거리를 지배한다. 표준화나 정규화는 목적에 따라 적용하되, 학습 데이터에서 계산한 통계를 시험·운영 데이터에 일관되게 사용한다. 희소한 고차원 벡터는 0을 모두 저장하지 않는 표현이 효율적이며, 밀집 임베딩과 같은 연산 방식을 무조건 적용하면 자원과 의미를 모두 잃을 수 있다.

부동소수점은 실수를 유한한 비트로 근사하므로 덧셈의 순서, 큰 값과 작은 값의 혼합, 정밀도에 따라 결과가 달라진다. 노름이 매우 작을 때 정규화하면 오차가 증폭되고 0으로 나눌 수 있다. 코사인 유사도는 벡터 크기를 무시하므로 크기에 정보가 담긴 모델에는 부적절할 수 있다. 유클리드 거리와 내적 순위는 벡터 정규화 여부에 따라 관계가 달라진다. 양자화된 벡터와 근사 최근접 탐색은 검색 속도와 메모리를 개선하지만 정확한 순위를 보장하지 않으므로 후보 회수율과 최종 업무 품질을 측정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [행렬](/wiki/matrix/): 수치를 행과 열로 배열한 구조로, 신경망의 선형 변환과 배치 계산에 사용된다.
- [텐서](/wiki/tensor/): 스칼라·벡터·행렬을 일반화한 다차원 수치 배열이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 구체적 적용 예시

작은 숫자 예제를 손으로 계산한 뒤 텐서 차원과 단위를 표시하면 수식과 구현이 같은 계산을 하는지 확인하기 쉽다. ‘벡터’를 적용하는 경우에는 벡터는 크기와 방향을 가진 수의 순서쌍으로, 머신러닝에서는 특징·임베딩·기울기를 좌표 배열로 표현한다.

평균값 하나만 기록하지 말고 분포, 극단값, 표본 수와 계산 조건을 함께 남겨 결과가 무엇을 대표하는지 밝힌다. 이때 [행렬](/wiki/matrix/), [텐서](/wiki/tensor/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실무 적용과 검증 절차

1. **목적 정의:** ‘벡터’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 모델의 손실과 거리, 확률, 기울기를 해석하고 구현의 차원·단위를 검증하는 데 쓰인다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 좌표의 의미와 단위, 정규화가 다르면 거리와 내적 비교가 무의미해질 수 있다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘벡터’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

#### 벡터 계산 검증

벡터를 다룰 때 먼저 각 축의 의미, 단위, 자료형과 허용 범위를 표로 적는다. 작은 손계산 예제로 덧셈, 내적, 노름과 투영 결과를 확인하고 라이브러리 계산과 비교한다. 형상 단언을 코드에 넣어 배치 축과 특성 축이 바뀌는 오류를 조기에 잡는다. 정규화 전후의 최솟값·최댓값·평균·노름 분포를 보고 0, 결측값, 무한대가 있는지 검사한다. 같은 연산을 float32와 낮은 정밀도에서 비교해 허용 오차를 정한다.

유사도 검색이라면 실제 관련 쌍과 비관련 쌍의 점수 분포를 보고 임계값을 정하며, 임의로 뽑은 몇 개의 가까운 항목을 사람이 검토한다. 정확 탐색을 작은 표본의 기준선으로 두고 근사 인덱스의 recall@k, 지연과 메모리를 비교한다. 임베딩 모델이나 차원이 바뀌면 기존 벡터와 혼합하지 말고 인덱스 버전을 분리한다. 저장 시 모델 식별자, 정규화 여부, 거리 함수, 자료형을 메타데이터로 남긴다. 계산 오류를 조사할 때 값만 보지 말고 형상, 스트라이드, 장치와 형 변환을 함께 기록하면 재현이 쉬워진다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 문서 관계

### 선행 개념

_해당 문서가 없다._

### 관련 문서

- [행렬](/wiki/matrix/)
- [텐서](/wiki/tensor/)

### 이 문서를 가리키는 문서

- [가설검정](/wiki/hypothesis-testing/)
- [거리 공간](/wiki/metric-space/)
- [결합 엔트로피](/wiki/joint-entropy/)
- [결합확률분포](/wiki/joint-probability-distribution/)
- [고유분해](/wiki/eigendecomposition/)

<details class="wiki-backlinks-more">
<summary>나머지 91개 문서 보기</summary>

- [고윳값과 고유벡터](/wiki/eigenvalue-eigenvector/)
- [고차원 기하학](/wiki/high-dimensional-geometry/)
- [공분산](/wiki/covariance/)
- [교차 엔트로피](/wiki/cross-entropy/)
- [국소 최적점과 전역 최적점](/wiki/local-global-optimum/)
- [근사 오차](/wiki/approximation-error/)
- [기댓값](/wiki/expected-value/)
- [기저 벡터](/wiki/basis-vector/)
- [내적](/wiki/dot-product/)
- [뉴턴 방법](/wiki/newtons-method/)
- [다변수 미적분학](/wiki/multivariable-calculus/)
- [데이터 처리 부등식](/wiki/data-processing-inequality/)
- [라그랑주 승수법](/wiki/lagrange-multiplier/)
- [마르코프 연쇄](/wiki/markov-chain/)
- [마할라노비스 거리](/wiki/mahalanobis-distance/)
- [맨해튼 거리](/wiki/manhattan-distance/)
- [목적 함수](/wiki/objective-function/)
- [몬테카를로 방법](/wiki/monte-carlo-method/)
- [밀집 임베딩](/wiki/dense-embedding/)
- [방향 미분](/wiki/directional-derivative/)
- [베이즈 정리](/wiki/bayes-theorem/)
- [벡터 공간](/wiki/vector-space/)
- [벡터 노름](/wiki/vector-norm/)
- [벡터 사영](/wiki/vector-projection/)
- [볼록 최적화](/wiki/convex-optimization/)
- [볼록 함수](/wiki/convex-function/)
- [부동소수점 연산](/wiki/floating-point-arithmetic/)
- [부트스트랩 방법](/wiki/bootstrap-method/)
- [부호 이론](/wiki/coding-theory/)
- [분산](/wiki/variance/)
- [사전확률](/wiki/prior-probability/)
- [사후확률](/wiki/posterior-probability/)
- [상관관계](/wiki/correlation/)
- [상호정보량](/wiki/mutual-information/)
- [선 탐색](/wiki/line-search/)
- [선형 변환](/wiki/linear-transformation/)
- [소스 부호화](/wiki/source-coding/)
- [수치 안정성](/wiki/numerical-stability/)
- [수치 적분](/wiki/numerical-integration/)
- [수치 정밀도](/wiki/numerical-precision/)
- [스칼라](/wiki/scalar/)
- [신뢰구간](/wiki/confidence-interval/)
- [안장점](/wiki/saddle-point/)
- [야코비 행렬](/wiki/jacobian-matrix/)
- [어텐션](/wiki/attention/)
- [엔트로피](/wiki/entropy/)
- [역행렬](/wiki/matrix-inverse/)
- [연쇄 법칙](/wiki/chain-rule/)
- [오버플로와 언더플로](/wiki/overflow-underflow/)
- [외적곱](/wiki/outer-product/)
- [우도](/wiki/likelihood/)
- [유클리드 거리](/wiki/euclidean-distance/)
- [유한차분법](/wiki/finite-difference-method/)
- [율-왜곡 이론](/wiki/rate-distortion-theory/)
- [인공 뉴런](/wiki/neuron/)
- [임베딩](/wiki/embedding/)
- [자동 미분](/wiki/automatic-differentiation/)
- [전치행렬](/wiki/matrix-transpose/)
- [정보 이득](/wiki/information-gain/)
- [제약 최적화](/wiki/constrained-optimization/)
- [젠슨-섀넌 발산](/wiki/jensen-shannon-divergence/)
- [조건부 엔트로피](/wiki/conditional-entropy/)
- [조건수](/wiki/condition-number/)
- [주변확률](/wiki/marginal-probability/)
- [준뉴턴 방법](/wiki/quasi-newton-method/)
- [중심극한정리](/wiki/central-limit-theorem/)
- [직교성](/wiki/orthogonality/)
- [차원의 저주](/wiki/curse-of-dimensionality/)
- [채널 용량](/wiki/channel-capacity/)
- [최대우도추정](/wiki/maximum-likelihood-estimation/)
- [측도 집중](/wiki/concentration-of-measure/)
- [커널 트릭](/wiki/kernel-trick/)
- [커널 함수](/wiki/kernel-function/)
- [쿨백-라이블러 발산](/wiki/kullback-leibler-divergence/)
- [큰 수의 법칙](/wiki/law-of-large-numbers/)
- [테일러 전개](/wiki/taylor-expansion/)
- [텐서](/wiki/tensor/)
- [통계적 추정량](/wiki/statistical-estimator/)
- [통계적 편향](/wiki/statistical-bias/)
- [통계적 표본추출](/wiki/statistical-sampling/)
- [특잇값 분해](/wiki/singular-value-decomposition/)
- [퍼플렉서티](/wiki/perplexity/)
- [편미분](/wiki/partial-derivative/)
- [행렬](/wiki/matrix/)
- [행렬 곱셈](/wiki/matrix-multiplication/)
- [행렬식](/wiki/determinant/)
- [행렬의 계수](/wiki/matrix-rank/)
- [헤세 행렬](/wiki/hessian-matrix/)
- [확률변수](/wiki/random-variable/)
- [F-발산](/wiki/f-divergence/)
- [P값](/wiki/p-value/)

</details>

### 이 문서를 포함하는 코스

[임베딩과 RAG](/course/rag-search/) · [AI를 위한 수학·통계](/course/ai-mathematics-statistics/) · [LLM 내부 구조](/course/llm-internals/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Deep Learning Book: Linear Algebra](https://www.deeplearningbook.org/contents/linear_algebra.html) - book
2. <span id="reference-2"></span>[Euclidean vector - Wikipedia](https://en.wikipedia.org/wiki/Euclidean_vector) - encyclopedia
3. <span id="reference-3"></span>[numpy.ndarray - NumPy documentation](https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html) - documentation

### 코스에서 계속 읽기

- **임베딩과 RAG:** [다음 문서 — 코사인 유사도](/wiki/cosine-similarity/)
- **AI를 위한 수학·통계:** [다음 문서 — 벡터 공간](/wiki/vector-space/)
- **LLM 내부 구조:** [다음 문서 — 행렬](/wiki/matrix/)

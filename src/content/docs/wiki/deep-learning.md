---
title: "딥러닝 Deep Learning"
description: "여러 처리 층을 가진 신경망이 데이터에서 단계적인 표현을 학습하도록 훈련하는 머신러닝 접근이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">DL</p>

<p class="wiki-lead">여러 처리 층을 가진 신경망이 데이터에서 단계적인 표현을 학습하도록 훈련하는 머신러닝 접근이다.</p>

<div class="wiki-document-meta">분류: [AI·머신러닝 기초](/category/foundations/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

여러 처리 층을 가진 신경망이 데이터에서 단계적인 표현을 학습하도록 훈련하는 머신러닝 접근이다.

딥러닝의 핵심은 단순히 층 수가 많다는 데 있지 않고 여러 비선형 변환을 통해 과제에 필요한 표현을 함께 학습한다는 데 있다. 이미지·음성·언어처럼 원시 입력의 규칙을 사람이 모두 설계하기 어려운 분야에서 널리 쓰인다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

피드포워드·합성곱·순환·어텐션 계열의 공통 학습 원리를 다루며 특정 최신 모델의 성능 순위는 다루지 않는다. 표현 학습, 역전파, 최적화, 일반화라는 안정적인 개념을 중심으로 설명한다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

각 층은 입력을 가중치와 비선형 함수로 변환해 다음 표현을 만든다. 순전파로 예측과 손실을 계산한 뒤 역전파로 각 파라미터의 기울기를 구하고 최적화기가 손실을 줄이는 방향으로 값을 갱신한다.

[머신러닝](/wiki/machine-learning/) 및 [신경망](/wiki/neural-network/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

모델은 입력 표현, 여러 은닉층, 출력층으로 구성된다. 학습 과정에는 데이터 배치, 손실 함수, 최적화기, 정규화와 검증 절차가 함께 필요하며 배포 시에는 전처리와 후처리도 동일하게 재현돼야 한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

시각 인식, 음성 인식, 번역, 추천, 생성 모델과 과학 계산에 활용된다. 충분한 데이터와 계산량이 없는 문제에서는 더 단순한 모델이나 사전학습 모델의 전이가 더 효율적일 수 있다.

딥러닝 도입 전 규칙 기반 또는 전통적 머신러닝 기준선을 만든다. 성능 개선이 데이터·연산·설명 가능성·운영 복잡도의 증가를 정당화하는지 함께 평가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

학습 데이터의 편향과 오류를 흡수하고 분포 밖 입력에서 예측이 불안정할 수 있다. 큰 모델은 많은 연산과 에너지를 요구하며 높은 벤치마크 점수가 사실성이나 안전성을 자동 보장하지 않는다.

훈련·검증·시험 데이터의 누출을 막고 모델 버전과 데이터 계보를 기록한다. 중요한 결정에는 불확실성 평가, 사람 검토, 실패 시 대체 절차를 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [머신러닝](/wiki/machine-learning/): 머신러닝은 데이터에서 규칙을 학습하는 더 넓은 분야이며 딥러닝은 다층 신경망을 사용하는 하위 접근이다.
- [신경망](/wiki/neural-network/): 신경망은 계산 구조를 가리키고 딥러닝은 깊은 신경망을 데이터와 최적화로 학습하는 방법론까지 포함한다.
- [생성형 인공지능](/wiki/generative-ai/): 생성형 AI는 새로운 결과를 만드는 과제 범주이며 모든 딥러닝 모델이 생성 모델인 것은 아니다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적 적용 예시

손글씨 분류에서는 픽셀을 입력하고 여러 층이 가장자리, 획, 숫자 형태에 유용한 표현을 학습한다. 학습에 쓰지 않은 시험 이미지에서 정확도와 클래스별 오류를 측정해야 암기와 일반화를 구분할 수 있다. 밝기나 회전이 달라진 자료도 따로 시험해 실제 환경의 분포 변화를 확인한다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 딥러닝 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 딥러닝이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 학습 곡선, 기준선 대비 개선, 데이터 분할 무결성, 하위 집단 오류와 추론 비용을 함께 검증한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

**운영 기록 템플릿**

- **선택 근거:** 딥러닝을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [activation-function](/wiki/activation-function/), [training-data](/wiki/training-data/), [generative-ai](/wiki/generative-ai/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 딥러닝의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 학습 체크

- 딥러닝의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [활성화 함수](/wiki/activation-function/)와 [학습 데이터](/wiki/training-data/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 선행 개념

- [머신러닝](/wiki/machine-learning/)
- [신경망](/wiki/neural-network/)

## 관련 문서

- [활성화 함수](/wiki/activation-function/)
- [학습 데이터](/wiki/training-data/)
- [생성형 인공지능](/wiki/generative-ai/)

## 이 문서를 가리키는 문서

- [능동학습](/wiki/active-learning/)
- [인공지능 생명주기](/wiki/ai-lifecycle/)
- [인공지능 시스템](/wiki/ai-system/)
- [인공지능 겨울](/wiki/ai-winter/)
- [이상 탐지](/wiki/anomaly-detection/)
- [범용 인공지능](/wiki/artificial-general-intelligence/)
- [인공지능](/wiki/artificial-intelligence/)
- [오토인코더](/wiki/autoencoder/)
- [배깅](/wiki/bagging/)
- [배치 학습](/wiki/batch-learning/)
- [베이즈 학습](/wiki/bayesian-learning/)
- [베이즈 네트워크](/wiki/bayesian-network/)
- [편향-분산 절충](/wiki/bias-variance-tradeoff/)
- [부스팅](/wiki/boosting/)
- [분류](/wiki/classification/)
- [군집화](/wiki/clustering/)
- [계산지능](/wiki/computational-intelligence/)
- [개념 드리프트](/wiki/concept-drift/)
- [연결주의](/wiki/connectionism/)
- [지속학습](/wiki/continual-learning/)
- [대조학습](/wiki/contrastive-learning/)
- [커리큘럼 학습](/wiki/curriculum-learning/)
- [데이터 분포](/wiki/data-distribution/)
- [데이터 누수](/wiki/data-leakage/)
- [데이터 전처리](/wiki/data-preprocessing/)
- [의사결정 시스템](/wiki/decision-making-system/)
- [결정 트리](/wiki/decision-tree/)
- [차원 축소](/wiki/dimensionality-reduction/)
- [분리 표현](/wiki/disentangled-representation/)
- [분포 이동](/wiki/distribution-shift/)
- [앙상블 학습](/wiki/ensemble-learning/)
- [전문가 시스템](/wiki/expert-system/)
- [특성](/wiki/feature/)
- [특성 공학](/wiki/feature-engineering/)
- [특성 학습](/wiki/feature-learning/)
- [퓨샷 학습](/wiki/few-shot-learning/)
- [파운데이션 모델](/wiki/foundation-model/)
- [가우스 과정](/wiki/gaussian-process/)
- [일반화](/wiki/generalization/)
- [생성형 인공지능](/wiki/generative-ai/)
- [생성 모델과 판별 모델](/wiki/generative-discriminative-model/)
- [고전적 인공지능](/wiki/good-old-fashioned-ai/)
- [그래디언트 부스팅](/wiki/gradient-boosting/)
- [은닉 마르코프 모델](/wiki/hidden-markov-model/)
- [계층적 군집화](/wiki/hierarchical-clustering/)
- [가설](/wiki/hypothesis/)
- [가설 공간](/wiki/hypothesis-space/)
- [독립 성분 분석](/wiki/independent-component-analysis/)
- [귀납적 편향](/wiki/inductive-bias/)
- [K-평균 군집화](/wiki/k-means-clustering/)
- [K-최근접 이웃](/wiki/k-nearest-neighbors/)
- [레이블](/wiki/label/)
- [잠재 표현](/wiki/latent-representation/)
- [선형 회귀](/wiki/linear-regression/)
- [로지스틱 회귀](/wiki/logistic-regression/)
- [머신러닝](/wiki/machine-learning/)
- [머신러닝 파이프라인](/wiki/machine-learning-pipeline/)
- [다양체 학습](/wiki/manifold-learning/)
- [마르코프 확률장](/wiki/markov-random-field/)
- [최대 사후 확률 추정](/wiki/maximum-a-posteriori-estimation/)
- [메타학습](/wiki/meta-learning/)
- [거리 학습](/wiki/metric-learning/)
- [모델 용량](/wiki/model-capacity/)
- [다중 과제 학습](/wiki/multi-task-learning/)
- [나이브 베이즈 분류기](/wiki/naive-bayes-classifier/)
- [약인공지능](/wiki/narrow-ai/)
- [공짜 점심 없음 정리](/wiki/no-free-lunch-theorem/)
- [온라인 학습](/wiki/online-learning/)
- [분포 외 데이터](/wiki/out-of-distribution-data/)
- [과적합](/wiki/overfitting/)
- [예측](/wiki/prediction/)
- [주성분 분석](/wiki/principal-component-analysis/)
- [확률 그래프 모델](/wiki/probabilistic-graphical-model/)
- [확률 모델](/wiki/probabilistic-model/)
- [랜덤 포레스트](/wiki/random-forest/)
- [추천 시스템](/wiki/recommendation-system/)
- [회귀](/wiki/regression/)
- [표현학습](/wiki/representation-learning/)
- [준지도학습](/wiki/semi-supervised-learning/)
- [희소 부호화](/wiki/sparse-coding/)
- [지도학습](/wiki/supervised-learning/)
- [서포트 벡터 머신](/wiki/support-vector-machine/)
- [목표 변수](/wiki/target-variable/)
- [테스트 데이터셋](/wiki/test-set/)
- [학습·검증·테스트 분할](/wiki/train-validation-test-split/)
- [전이학습](/wiki/transfer-learning/)
- [튜링 테스트](/wiki/turing-test/)
- [불확실성 정량화](/wiki/uncertainty-quantification/)
- [과소적합](/wiki/underfitting/)
- [검증 데이터셋](/wiki/validation-set/)
- [제로샷 학습](/wiki/zero-shot-learning/)

## 이 문서를 포함하는 코스

[AI 기초](/course/ai-foundations/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Deep Learning Book](https://www.deeplearningbook.org/) — book
<span id="reference-2"></span>2. [Deep learning](https://www.nature.com/articles/nature14539) — paper
<span id="reference-3"></span>3. [Deep learning — Wikipedia](https://en.wikipedia.org/wiki/Deep_learning) — encyclopedia

## 코스에서 계속 읽기

- **AI 기초:** [다음 문서 — 생성형 인공지능](/wiki/generative-ai/)

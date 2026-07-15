---
title: "신경망과 딥러닝"
description: "신경망의 구성 요소와 학습 원리"
---

신경망의 구성 요소와 학습 원리 분야의 검토 완료 백과 문서입니다.

<nav class="wiki-letter-index" aria-label="문서 초성 색인"><a href="#index-ko-g">ㄱ</a><a href="#index-ko-n">ㄴ</a><a href="#index-ko-d">ㄷ</a><a href="#index-ko-r">ㄹ</a><a href="#index-ko-m">ㅁ</a><a href="#index-ko-b">ㅂ</a><a href="#index-ko-s">ㅅ</a><a href="#index-ko-ng">ㅇ</a><a href="#index-ko-j">ㅈ</a><a href="#index-ko-ch">ㅊ</a><a href="#index-ko-k">ㅋ</a><a href="#index-ko-t">ㅌ</a><a href="#index-ko-p">ㅍ</a><a href="#index-ko-h">ㅎ</a><a href="#index-en-a">A</a><a href="#index-en-c">C</a><a href="#index-en-d">D</a><a href="#index-en-l">L</a><a href="#index-en-m">M</a><a href="#index-en-r">R</a><a href="#index-en-s">S</a><a href="#index-en-u">U</a><a href="#index-other">기타</a></nav>

<div class="wiki-index-groups">
<section class="wiki-index-group" data-index-group="ko-g">
<h2 id="index-ko-g">ㄱ</h2>
<ul class="wiki-index-list">
<li data-article-id="weight"><a href="/wiki/weight/">가중치</a><span class="wiki-index-summary">신경망에서 입력 신호의 영향력을 조절하며 학습 과정에서 손실을 줄이는 방향으로 갱신되는 수치형 매개변수다.</span></li>
<li data-article-id="weight-decay"><a href="/wiki/weight-decay/">가중치 감쇠</a><span class="wiki-index-summary">가중치 감쇠는 최적화 갱신에서 가중치 크기를 지속적으로 줄여 지나치게 큰 파라미터를 억제하는 정규화 방식이다.</span></li>
<li data-article-id="concept-activation-vector"><a href="/wiki/concept-activation-vector/">개념 활성화 벡터</a><span class="wiki-index-summary">개념 활성화 벡터는 신경망의 중간 표현 공간에서 사람이 정의한 개념의 방향을 학습해 출력이 그 개념에 얼마나 민감한지 측정하는 도구다.</span></li>
<li data-article-id="validation-loss"><a href="/wiki/validation-loss/">검증 손실</a><span class="wiki-index-summary">검증 손실은 학습에 사용하지 않은 고정 검증 집합에서 현재 모델의 목적 함수 값을 계산한 지표다.</span></li>
<li data-article-id="gated-recurrent-unit"><a href="/wiki/gated-recurrent-unit/">게이트 순환 유닛</a><span class="wiki-index-summary">게이트 순환 유닛은 갱신 게이트와 리셋 게이트로 이전 상태와 새 후보 상태를 혼합하는 순환 신경망 구조다.</span></li>
<li data-article-id="gradient-descent"><a href="/wiki/gradient-descent/">경사하강법</a><span class="wiki-index-summary">손실 함수의 기울기 반대 방향으로 파라미터를 반복 갱신하는 최적화 방법이다.</span></li>
<li data-article-id="computational-graph"><a href="/wiki/computational-graph/">계산 그래프</a><span class="wiki-index-summary">계산을 값과 연산 노드, 의존 관계의 방향성 그래프로 표현한 구조다.</span></li>
<li data-article-id="layer-wise-relevance-propagation"><a href="/wiki/layer-wise-relevance-propagation/">계층별 관련성 전파</a><span class="wiki-index-summary">층별 관련성 전파는 모델 출력 점수를 보존 규칙에 따라 뒤쪽 층에서 입력 특징까지 재분배하는 설명 기법이다.</span></li>
<li data-article-id="gradient-norm"><a href="/wiki/gradient-norm/">그래디언트 노름</a><span class="wiki-index-summary">기울기 노름은 손실 함수의 파라미터 기울기 벡터 크기를 하나의 스칼라로 요약한 값이다.</span></li>
<li data-article-id="gradient-accumulation"><a href="/wiki/gradient-accumulation/">그래디언트 누적</a><span class="wiki-index-summary">그래디언트 누적은 여러 마이크로배치의 그래디언트를 모은 뒤 한 번 매개변수를 갱신해 큰 유효 배치를 구현하는 기법이다.</span></li>
<li data-article-id="vanishing-gradient"><a href="/wiki/vanishing-gradient/">그래디언트 소실</a><span class="wiki-index-summary">그래디언트 소실은 깊거나 반복적인 계산 그래프에서 역전파 신호가 연속 곱셈으로 매우 작아져 앞단 매개변수가 거의 학습되지 않는 현상이다.</span></li>
<li data-article-id="gradient-signal"><a href="/wiki/gradient-signal/">그래디언트 신호</a><span class="wiki-index-summary">그래디언트 신호는 손실이 각 파라미터 변화에 얼마나 민감한지를 나타내며 역전파로 층을 거슬러 전달된다.</span></li>
<li data-article-id="gradient-clipping"><a href="/wiki/gradient-clipping/">그래디언트 클리핑</a><span class="wiki-index-summary">그래디언트 클리핑은 그래디언트 값이나 전체 노름이 임계값을 넘을 때 크기를 제한해 불안정한 갱신을 줄이는 기법이다.</span></li>
<li data-article-id="exploding-gradient"><a href="/wiki/exploding-gradient/">그래디언트 폭주</a><span class="wiki-index-summary">그래디언트 폭주는 역전파 과정의 반복 곱셈으로 그래디언트 크기가 급격히 커져 손실과 매개변수가 불안정해지는 현상이다.</span></li>
<li data-article-id="graph-neural-network"><a href="/wiki/graph-neural-network/">그래프 신경망</a><span class="wiki-index-summary">그래프 신경망은 노드와 간선으로 표현된 비정형 구조에서 이웃 정보를 전달·집계해 표현을 학습하는 신경망이다.</span></li>
<li data-article-id="graph-attention-network"><a href="/wiki/graph-attention-network/">그래프 어텐션 네트워크</a><span class="wiki-index-summary">그래프 어텐션 네트워크는 각 노드가 이웃마다 다른 학습된 중요도를 부여해 정보를 집계하는 그래프 신경망이다.</span></li>
<li data-article-id="graph-convolutional-network"><a href="/wiki/graph-convolutional-network/">그래프 합성곱 신경망</a><span class="wiki-index-summary">그래프 합성곱 신경망은 그래프의 인접 구조와 정규화된 이웃 집계를 사용해 노드 표현을 변환하는 그래프 신경망이다.</span></li>
<li data-article-id="group-normalization"><a href="/wiki/group-normalization/">그룹 정규화</a><span class="wiki-index-summary">그룹 정규화는 한 표본의 채널을 여러 그룹으로 나눠 그룹 내부 통계로 활성값을 정규화하는 방법이다.</span></li>
<li data-article-id="mechanistic-interpretability"><a href="/wiki/mechanistic-interpretability/">기계론적 해석 가능성</a><span class="wiki-index-summary">기계론적 해석 가능성은 신경망 내부의 구성 요소와 계산 경로가 특정 기능과 출력을 어떻게 구현하는지 인과적으로 설명하려는 연구 접근이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-n">
<h2 id="index-ko-n">ㄴ</h2>
<ul class="wiki-index-list">
<li data-article-id="nesterov-accelerated-gradient"><a href="/wiki/nesterov-accelerated-gradient/">네스테로프 가속 경사법</a><span class="wiki-index-summary">네스테로프 가속 경사법은 모멘텀으로 예상한 앞선 위치에서 기울기를 계산해 갱신 방향을 미리 보정하는 최적화법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-d">
<h2 id="index-ko-d">ㄷ</h2>
<ul class="wiki-index-list">
<li data-article-id="multilayer-perceptron"><a href="/wiki/multilayer-perceptron/">다층 퍼셉트론</a><span class="wiki-index-summary">다층 퍼셉트론은 완전연결 선형 변환과 비선형 활성함수를 여러 층 쌓은 순방향 신경망이다.</span></li>
<li data-article-id="dropout"><a href="/wiki/dropout/">드롭아웃</a><span class="wiki-index-summary">드롭아웃은 학습 중 무작위로 일부 활성값을 0으로 만들어 특정 특징의 공동 적응을 줄이는 정규화 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-r">
<h2 id="index-ko-r">ㄹ</h2>
<ul class="wiki-index-list">
<li data-article-id="label-smoothing"><a href="/wiki/label-smoothing/">레이블 스무딩</a><span class="wiki-index-summary">레이블 스무딩은 원-핫 정답분포의 일부 확률 질량을 다른 클래스에 나누어 과도한 확신을 줄이는 정규화 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-m">
<h2 id="index-ko-m">ㅁ</h2>
<ul class="wiki-index-list">
<li data-article-id="memory-network"><a href="/wiki/memory-network/">메모리 네트워크</a><span class="wiki-index-summary">메모리 네트워크는 입력과 분리된 읽기·쓰기 가능한 메모리와 질의 기반 접근을 결합한 신경망 구조다.</span></li>
<li data-article-id="mode-collapse"><a href="/wiki/mode-collapse/">모드 붕괴</a><span class="wiki-index-summary">모드 붕괴는 생성 모델이 데이터 분포의 다양한 모드를 표현하지 못하고 소수의 유사한 출력만 반복하는 실패다.</span></li>
<li data-article-id="momentum-optimizer"><a href="/wiki/momentum-optimizer/">모멘텀 최적화</a><span class="wiki-index-summary">모멘텀 최적화는 과거 기울기의 누적 방향을 속도 변수에 보존해 진동을 줄이고 일관된 방향의 이동을 가속하는 방법이다.</span></li>
<li data-article-id="mini-batch-gradient-descent"><a href="/wiki/mini-batch-gradient-descent/">미니배치 경사하강법</a><span class="wiki-index-summary">미니배치 경사하강법은 여러 사례로 구성된 작은 배치의 평균 기울기를 사용해 신경망 매개변수를 갱신하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-b">
<h2 id="index-ko-b">ㅂ</h2>
<ul class="wiki-index-list">
<li data-article-id="batch"><a href="/wiki/batch/">배치</a><span class="wiki-index-summary">한 번의 순전파와 역전파에서 함께 처리하는 데이터 예시의 묶음이다.</span></li>
<li data-article-id="batch-normalization"><a href="/wiki/batch-normalization/">배치 정규화</a><span class="wiki-index-summary">배치 정규화는 미니배치 통계로 활성값을 표준화한 뒤 학습 가능한 크기와 이동을 적용하는 층이다.</span></li>
<li data-article-id="variational-autoencoder"><a href="/wiki/variational-autoencoder/">변분 오토인코더</a><span class="wiki-index-summary">변분 오토인코더는 잠재 변수의 확률분포를 추론하는 인코더와 데이터를 복원하는 디코더를 함께 학습하는 생성 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-s">
<h2 id="index-ko-s">ㅅ</h2>
<ul class="wiki-index-list">
<li data-article-id="generative-adversarial-network"><a href="/wiki/generative-adversarial-network/">생성적 적대 신경망</a><span class="wiki-index-summary">생성적 적대 신경망은 실제 데이터와 비슷한 표본을 만드는 생성자와 진위를 구분하는 판별자를 경쟁적으로 학습하는 모델이다.</span></li>
<li data-article-id="siamese-network"><a href="/wiki/siamese-network/">샴 신경망</a><span class="wiki-index-summary">샴 신경망은 파라미터를 공유하는 둘 이상의 인코더로 입력 쌍의 유사성이나 차이를 학습하는 구조다.</span></li>
<li data-article-id="linear-layer"><a href="/wiki/linear-layer/">선형층</a><span class="wiki-index-summary">선형층은 입력 벡터에 학습 가능한 행렬과 편향을 적용해 아핀 변환을 수행하는 층이다.</span></li>
<li data-article-id="loss-landscape"><a href="/wiki/loss-landscape/">손실 지형</a><span class="wiki-index-summary">손실 지형은 모델 파라미터 공간의 각 점에 학습 손실을 대응시킨 고차원 함수의 기하학적 모습이다.</span></li>
<li data-article-id="loss-function"><a href="/wiki/loss-function/">손실 함수</a><span class="wiki-index-summary">모델의 예측과 목표 사이 차이를 하나의 수치로 측정하는 함수다.</span></li>
<li data-article-id="receptive-field"><a href="/wiki/receptive-field/">수용 영역</a><span class="wiki-index-summary">수용 영역은 신경망의 특정 유닛 출력에 영향을 줄 수 있는 입력 위치의 범위다.</span></li>
<li data-article-id="forward-pass"><a href="/wiki/forward-pass/">순전파</a><span class="wiki-index-summary">신경망 입력을 첫 층부터 마지막 층까지 순서대로 계산해 예측과 중간 활성화를 얻는 과정이다.</span></li>
<li data-article-id="recurrent-neural-network"><a href="/wiki/recurrent-neural-network/">순환 신경망</a><span class="wiki-index-summary">순환 신경망은 이전 시점의 은닉 상태를 다음 시점 계산에 사용해 시퀀스 의존성을 표현하는 신경망이다.</span></li>
<li data-article-id="spiking-neural-network"><a href="/wiki/spiking-neural-network/">스파이킹 신경망</a><span class="wiki-index-summary">스파이킹 신경망은 뉴런이 연속 활성값 대신 시간에 따른 이산 스파이크를 주고받도록 모델링한 신경망이다.</span></li>
<li data-article-id="spectral-normalization"><a href="/wiki/spectral-normalization/">스펙트럴 정규화</a><span class="wiki-index-summary">스펙트럴 정규화는 가중치 행렬을 가장 큰 특이값으로 나누어 층의 립시츠 상한을 제한하는 정규화 방법이다.</span></li>
<li data-article-id="neural-ordinary-differential-equation"><a href="/wiki/neural-ordinary-differential-equation/">신경 상미분방정식</a><span class="wiki-index-summary">신경 상미분방정식은 은닉 상태의 연속 시간 변화를 신경망으로 매개변수화한 미분방정식으로 표현하는 모델이다.</span></li>
<li data-article-id="neural-turing-machine"><a href="/wiki/neural-turing-machine/">신경 튜링 머신</a><span class="wiki-index-summary">신경 튜링 머신은 신경망 제어기와 주소 지정 가능한 외부 메모리를 결합해 읽기·쓰기 절차를 학습하는 미분 가능한 구조다.</span></li>
<li data-article-id="neural-network"><a href="/wiki/neural-network/">신경망</a><span class="wiki-index-summary">연결된 계산 단위와 가중치를 층으로 쌓아 복잡한 함수를 학습하는 모델이다.</span></li>
<li data-article-id="network-depth"><a href="/wiki/network-depth/">신경망 깊이</a><span class="wiki-index-summary">신경망 깊이는 입력에서 출력까지 거치는 학습 가능한 층이나 변환 단계의 수를 뜻한다.</span></li>
<li data-article-id="network-width"><a href="/wiki/network-width/">신경망 너비</a><span class="wiki-index-summary">신경망 너비는 한 층이 가진 유닛, 채널 또는 은닉 차원의 크기를 뜻한다.</span></li>
<li data-article-id="layer"><a href="/wiki/layer/">신경망 층</a><span class="wiki-index-summary">입력 표현을 정해진 연산과 학습 파라미터로 변환해 다음 표현으로 전달하는 신경망의 구성 단위다.</span></li>
<li data-article-id="deep-belief-network"><a href="/wiki/deep-belief-network/">심층 신뢰 신경망</a><span class="wiki-index-summary">심층 신뢰 신경망은 여러 확률적 잠재층을 쌓아 데이터의 계층적 표현을 학습하는 생성 모형 계열이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ng">
<h2 id="index-ko-ng">ㅇ</h2>
<ul class="wiki-index-list">
<li data-article-id="energy-based-model"><a href="/wiki/energy-based-model/">에너지 기반 모델</a><span class="wiki-index-summary">에너지 기반 모델은 입력과 출력 조합의 적합성을 스칼라 에너지로 표현하고 낮은 에너지 상태를 더 그럴듯하게 보는 모델이다.</span></li>
<li data-article-id="echo-state-network"><a href="/wiki/echo-state-network/">에코 상태 네트워크</a><span class="wiki-index-summary">에코 상태 네트워크는 고정된 희소 순환 저장소가 입력의 시간적 흔적을 만들고 출력층만 학습하는 저장소 컴퓨팅 모형이다.</span></li>
<li data-article-id="epoch"><a href="/wiki/epoch/">에포크</a><span class="wiki-index-summary">학습 알고리즘이 전체 학습 데이터셋을 한 번 처리한 주기다.</span></li>
<li data-article-id="backpropagation"><a href="/wiki/backpropagation/">역전파</a><span class="wiki-index-summary">출력의 손실에서 각 파라미터의 기여도를 연쇄 법칙으로 계산하는 알고리즘이다.</span></li>
<li data-article-id="optimizer-state"><a href="/wiki/optimizer-state/">옵티마이저 상태</a><span class="wiki-index-summary">옵티마이저 상태는 학습 갱신을 계산하기 위해 매개변수 외에 유지하는 모멘트, 누적 그래디언트, 단계 수 등의 값이다.</span></li>
<li data-article-id="dense-layer"><a href="/wiki/dense-layer/">완전연결층</a><span class="wiki-index-summary">완전연결층은 모든 입력 특성과 모든 출력 유닛 사이에 학습 가능한 가중치를 두는 신경망 층이다.</span></li>
<li data-article-id="hidden-state"><a href="/wiki/hidden-state/">은닉 상태</a><span class="wiki-index-summary">은닉 상태는 순환 모델이나 상태 공간 모델이 이전 입력 정보를 요약해 다음 계산으로 전달하는 내부 표현이다.</span></li>
<li data-article-id="hidden-layer"><a href="/wiki/hidden-layer/">은닉층</a><span class="wiki-index-summary">은닉층은 입력과 출력 사이에서 중간 표현을 계산하며 직접 관측되는 목표가 아닌 특징을 학습하는 신경망 층이다.</span></li>
<li data-article-id="neuron"><a href="/wiki/neuron/">인공 뉴런</a><span class="wiki-index-summary">입력의 가중합에 활성화 함수를 적용해 출력을 만드는 신경망의 계산 단위다.</span></li>
<li data-article-id="instance-normalization"><a href="/wiki/instance-normalization/">인스턴스 정규화</a><span class="wiki-index-summary">인스턴스 정규화는 각 표본과 채널별로 공간 위치의 평균과 분산을 사용해 활성값을 정규화하는 방법이다.</span></li>
<li data-article-id="input-layer"><a href="/wiki/input-layer/">입력층</a><span class="wiki-index-summary">신경망이 외부 특징을 처음 받아 내부 텐서 표현으로 전달하는 입력 경계다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-j">
<h2 id="index-ko-j">ㅈ</h2>
<ul class="wiki-index-list">
<li data-article-id="residual-network"><a href="/wiki/residual-network/">잔차 신경망</a><span class="wiki-index-summary">잔차 신경망은 여러 층의 변환 결과에 입력을 지름길 연결로 더해 잔차 함수를 학습하는 심층 신경망이다.</span></li>
<li data-article-id="noise-injection"><a href="/wiki/noise-injection/">잡음 주입</a><span class="wiki-index-summary">잡음 주입은 학습 중 입력, 활성값, 가중치나 기울기에 무작위 교란을 더해 일반화와 강건성을 높이는 기법이다.</span></li>
<li data-article-id="long-short-term-memory"><a href="/wiki/long-short-term-memory/">장단기 메모리</a><span class="wiki-index-summary">장단기 메모리는 입력·망각·출력 게이트와 셀 상태로 장기 의존성 학습을 돕는 순환 신경망 구조다.</span></li>
<li data-article-id="adaptive-gradient-method"><a href="/wiki/adaptive-gradient-method/">적응형 그래디언트 방법</a><span class="wiki-index-summary">적응형 그래디언트 방법은 매개변수별 과거 기울기 통계를 이용해 유효 학습률을 자동으로 조정하는 최적화 방법군이다.</span></li>
<li data-article-id="restricted-boltzmann-machine"><a href="/wiki/restricted-boltzmann-machine/">제한 볼츠만 머신</a><span class="wiki-index-summary">제한 볼츠만 머신은 가시층과 은닉층 사이에만 연결을 둔 에너지 기반 확률 모형이다.</span></li>
<li data-article-id="early-stopping"><a href="/wiki/early-stopping/">조기 종료</a><span class="wiki-index-summary">조기 종료는 검증 성능이 더 이상 개선되지 않거나 악화될 때 학습을 중단해 과적합과 불필요한 계산을 줄이는 절차다.</span></li>
<li data-article-id="dead-neuron"><a href="/wiki/dead-neuron/">죽은 뉴런</a><span class="wiki-index-summary">죽은 뉴런은 관측되는 입력 범위에서 활성값이나 기울기가 거의 항상 0이어서 학습과 출력에 기여하지 않는 신경망 단위다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ch">
<h2 id="index-ko-ch">ㅊ</h2>
<ul class="wiki-index-list">
<li data-article-id="max-norm-regularization"><a href="/wiki/max-norm-regularization/">최대 노름 정규화</a><span class="wiki-index-summary">최대 노름 정규화는 가중치 벡터의 노름이 지정한 상한을 넘지 않도록 제한하는 방법이다.</span></li>
<li data-article-id="output-layer"><a href="/wiki/output-layer/">출력층</a><span class="wiki-index-summary">출력층은 신경망의 마지막 표현을 과제에 필요한 로짓, 확률, 실수값 또는 벡터로 변환하는 층이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-k">
<h2 id="index-ko-k">ㅋ</h2>
<ul class="wiki-index-list">
<li data-article-id="capsule-network"><a href="/wiki/capsule-network/">캡슐 네트워크</a><span class="wiki-index-summary">캡슐 네트워크는 객체 특성의 존재와 자세를 벡터 단위로 표현하고 하위 캡슐의 합의를 상위 캡슐로 라우팅하는 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-t">
<h2 id="index-ko-t">ㅌ</h2>
<ul class="wiki-index-list">
<li data-article-id="integrated-gradients"><a href="/wiki/integrated-gradients/">통합 그래디언트</a><span class="wiki-index-summary">통합 기울기는 기준 입력에서 실제 입력까지의 경로에서 입력 기울기를 적분해 예측 차이를 특징별 기여도로 배분하는 방법이다.</span></li>
<li data-article-id="feature-visualization"><a href="/wiki/feature-visualization/">특성 시각화</a><span class="wiki-index-summary">특징 시각화는 신경망 내부 채널·뉴런·표현이 반응하는 입력 패턴과 데이터 사례를 보여주는 분석 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-p">
<h2 id="index-ko-p">ㅍ</h2>
<ul class="wiki-index-list">
<li data-article-id="parameter-initialization"><a href="/wiki/parameter-initialization/">파라미터 초기화</a><span class="wiki-index-summary">파라미터 초기화는 학습 시작 전에 가중치와 편향의 초기 값을 정해 신호와 기울기가 안정적으로 흐르게 하는 절차다.</span></li>
<li data-article-id="bias"><a href="/wiki/bias/">편향 항</a><span class="wiki-index-summary">선형 변환의 기준점을 이동시키기 위해 더하는 학습 가능한 값이다.</span></li>
<li data-article-id="probing-classifier"><a href="/wiki/probing-classifier/">프로빙 분류기</a><span class="wiki-index-summary">프로빙 분류기는 고정된 모델의 중간 표현에 특정 속성 정보가 선형 또는 단순한 함수로 읽힐 수 있는지 시험하는 보조 예측기다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-h">
<h2 id="index-ko-h">ㅎ</h2>
<ul class="wiki-index-list">
<li data-article-id="learning-curve"><a href="/wiki/learning-curve/">학습 곡선</a><span class="wiki-index-summary">학습 곡선은 학습 단계나 데이터 크기에 따른 훈련·검증 성능의 변화를 나타내는 기록이다.</span></li>
<li data-article-id="training-loss"><a href="/wiki/training-loss/">학습 손실</a><span class="wiki-index-summary">학습 손실은 현재 학습 데이터 배치에서 모델 예측과 목표 사이의 오차를 목적 함수로 계산한 값이다.</span></li>
<li data-article-id="training-convergence"><a href="/wiki/training-convergence/">학습 수렴</a><span class="wiki-index-summary">학습 수렴은 반복 최적화에서 손실·기울기·평가 지표의 변화가 허용 범위 안으로 안정되는 상태다.</span></li>
<li data-article-id="learning-rate"><a href="/wiki/learning-rate/">학습률</a><span class="wiki-index-summary">한 번의 최적화 단계에서 파라미터를 얼마나 크게 변경할지 정하는 값이다.</span></li>
<li data-article-id="learning-rate-schedule"><a href="/wiki/learning-rate-schedule/">학습률 스케줄</a><span class="wiki-index-summary">학습률 스케줄은 학습 단계나 검증 신호에 따라 옵티마이저의 학습률을 바꾸는 규칙이다.</span></li>
<li data-article-id="learning-rate-warmup"><a href="/wiki/learning-rate-warmup/">학습률 워밍업</a><span class="wiki-index-summary">학습률 워밍업은 학습 초기에 작은 학습률에서 시작해 정해진 기간 동안 목표 학습률까지 점진적으로 높이는 기법이다.</span></li>
<li data-article-id="convolutional-neural-network"><a href="/wiki/convolutional-neural-network/">합성곱 신경망</a><span class="wiki-index-summary">합성곱 신경망은 국소 필터의 가중치를 공간 위치에 공유해 격자 데이터의 특징을 학습하는 신경망이다.</span></li>
<li data-article-id="saliency-map"><a href="/wiki/saliency-map/">현저성 지도</a><span class="wiki-index-summary">현저성 지도는 입력의 각 요소 변화가 특정 모델 출력에 미치는 국소 민감도를 시각적 점수로 나타낸 설명이다.</span></li>
<li data-article-id="mixed-precision-training"><a href="/wiki/mixed-precision-training/">혼합 정밀도 학습</a><span class="wiki-index-summary">혼합 정밀도 학습은 신경망 학습의 일부 연산과 저장에 낮은 수치 정밀도를 사용하면서 필요한 부분은 높은 정밀도로 유지하는 기법이다.</span></li>
<li data-article-id="hopfield-network"><a href="/wiki/hopfield-network/">홉필드 네트워크</a><span class="wiki-index-summary">홉필드 네트워크는 대칭 연결과 에너지 함수를 사용해 저장된 패턴을 안정 상태로 회상하는 순환 신경망이다.</span></li>
<li data-article-id="stochastic-gradient-descent"><a href="/wiki/stochastic-gradient-descent/">확률적 경사하강법</a><span class="wiki-index-summary">확률적 경사하강법은 전체 데이터 대신 한 사례 또는 작은 무작위 표본의 손실 기울기로 매개변수를 반복 갱신하는 최적화법이다.</span></li>
<li data-article-id="stochastic-depth"><a href="/wiki/stochastic-depth/">확률적 깊이</a><span class="wiki-index-summary">확률적 깊이는 잔차 신경망 학습 중 일부 잔차 블록을 무작위로 건너뛰어 다양한 유효 깊이를 학습하는 정규화 기법이다.</span></li>
<li data-article-id="activation-maximization"><a href="/wiki/activation-maximization/">활성화 최대화</a><span class="wiki-index-summary">활성 최대화는 선택한 뉴런이나 클래스 점수를 크게 만드는 입력을 경사 상승으로 합성해 선호 패턴을 탐색하는 기법이다.</span></li>
<li data-article-id="activation-function"><a href="/wiki/activation-function/">활성화 함수</a><span class="wiki-index-summary">신경망에 비선형성을 부여해 복잡한 관계를 표현하게 하는 함수다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-a">
<h2 id="index-en-a">A</h2>
<ul class="wiki-index-list">
<li data-article-id="adagrad"><a href="/wiki/adagrad/">AdaGrad</a><span class="wiki-index-summary">AdaGrad는 매개변수별 과거 제곱 기울기를 누적해 자주 갱신된 방향의 유효 학습률을 줄이는 적응형 최적화법이다.</span></li>
<li data-article-id="adam-optimizer"><a href="/wiki/adam-optimizer/">Adam 최적화</a><span class="wiki-index-summary">Adam은 그래디언트의 1차 모멘트와 제곱 그래디언트의 2차 모멘트를 지수이동평균으로 추정하는 적응적 옵티마이저다.</span></li>
<li data-article-id="adamw"><a href="/wiki/adamw/">AdamW</a><span class="wiki-index-summary">AdamW는 Adam의 적응적 그래디언트 갱신과 가중치 감쇠를 분리해 적용하는 옵티마이저다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-c">
<h2 id="index-en-c">C</h2>
<ul class="wiki-index-list">
<li data-article-id="cutmix"><a href="/wiki/cutmix/">CutMix</a><span class="wiki-index-summary">CutMix는 한 이미지의 사각 영역을 다른 이미지 패치로 바꾸고 면적 비율에 따라 레이블을 혼합하는 데이터 증강 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-d">
<h2 id="index-en-d">D</h2>
<ul class="wiki-index-list">
<li data-article-id="densenet"><a href="/wiki/densenet/">DenseNet</a><span class="wiki-index-summary">DenseNet은 각 층의 특징 맵을 이후 모든 층의 입력에 이어 붙이는 조밀 연결 합성곱 신경망이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-l">
<h2 id="index-en-l">L</h2>
<ul class="wiki-index-list">
<li data-article-id="l1-regularization"><a href="/wiki/l1-regularization/">L1 정규화</a><span class="wiki-index-summary">L1 정규화는 모델 파라미터 절댓값의 합을 목적 함수에 벌점으로 더해 희소한 가중치를 유도하는 방법이다.</span></li>
<li data-article-id="l2-regularization"><a href="/wiki/l2-regularization/">L2 정규화</a><span class="wiki-index-summary">L2 정규화는 모델 파라미터 제곱합을 목적 함수에 벌점으로 더해 큰 가중치를 억제하는 방법이다.</span></li>
<li data-article-id="local-interpretable-model-agnostic-explanations"><a href="/wiki/local-interpretable-model-agnostic-explanations/">LIME 설명</a><span class="wiki-index-summary">LIME은 관심 예측 주변에서 원래 모델의 동작을 근사하는 단순한 지역 대리 모델로 특징 중요도를 설명하는 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-m">
<h2 id="index-en-m">M</h2>
<ul class="wiki-index-list">
<li data-article-id="mixup"><a href="/wiki/mixup/">Mixup</a><span class="wiki-index-summary">Mixup은 두 학습 표본과 정답을 같은 비율로 선형 혼합해 가상 표본을 만드는 데이터 증강 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-r">
<h2 id="index-en-r">R</h2>
<ul class="wiki-index-list">
<li data-article-id="rmsprop"><a href="/wiki/rmsprop/">RMSProp</a><span class="wiki-index-summary">RMSProp은 최근 제곱 기울기의 지수이동평균으로 각 매개변수의 학습률을 조정하는 적응형 최적화법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-s">
<h2 id="index-en-s">S</h2>
<ul class="wiki-index-list">
<li data-article-id="shapley-additive-explanations"><a href="/wiki/shapley-additive-explanations/">SHAP 설명</a><span class="wiki-index-summary">SHAP은 협력 게임의 샤플리 값을 이용해 한 예측과 기준값의 차이를 특징별 가산 기여도로 배분하는 설명 방법 계열이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-u">
<h2 id="index-en-u">U</h2>
<ul class="wiki-index-list">
<li data-article-id="u-net"><a href="/wiki/u-net/">U-Net</a><span class="wiki-index-summary">U-Net은 축소 경로와 확대 경로를 대칭으로 구성하고 같은 해상도의 특징을 건너 연결하는 영상 분할 신경망이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="other">
<h2 id="index-other">기타</h2>
<ul class="wiki-index-list">
<li data-article-id="second-order-optimization"><a href="/wiki/second-order-optimization/">2차 최적화</a><span class="wiki-index-summary">2차 최적화는 목적함수의 그래디언트뿐 아니라 헤시안 또는 곡률 근사를 이용해 갱신 방향과 크기를 정하는 방법이다.</span></li>
</ul>
</section>
</div>

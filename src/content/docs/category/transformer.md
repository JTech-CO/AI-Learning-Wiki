---
title: "트랜스포머와 모델 구조"
description: "현대 언어 모델을 이루는 핵심 아키텍처"
---

현대 언어 모델을 이루는 핵심 아키텍처 분야의 검토 완료 백과 문서입니다.

<nav class="wiki-letter-index" aria-label="문서 초성 색인"><a href="#index-ko-g">ㄱ</a><a href="#index-ko-d">ㄷ</a><a href="#index-ko-r">ㄹ</a><a href="#index-ko-m">ㅁ</a><a href="#index-ko-b">ㅂ</a><a href="#index-ko-s">ㅅ</a><a href="#index-ko-ng">ㅇ</a><a href="#index-ko-j">ㅈ</a><a href="#index-ko-ch">ㅊ</a><a href="#index-ko-k">ㅋ</a><a href="#index-ko-t">ㅌ</a><a href="#index-ko-p">ㅍ</a><a href="#index-ko-h">ㅎ</a><a href="#index-en-a">A</a><a href="#index-en-b">B</a><a href="#index-en-c">C</a><a href="#index-en-g">G</a><a href="#index-en-l">L</a><a href="#index-en-n">N</a><a href="#index-en-p">P</a><a href="#index-en-r">R</a><a href="#index-en-s">S</a><a href="#index-en-t">T</a><a href="#index-en-x">X</a><a href="#index-en-y">Y</a></nav>

<div class="wiki-index-groups">
<section class="wiki-index-group" data-index-group="ko-g">
<h2 id="index-ko-g">ㄱ</h2>
<ul class="wiki-index-list">
<li data-article-id="additive-attention"><a href="/wiki/additive-attention/">가산 어텐션</a><span class="wiki-index-summary">가산 어텐션은 질의와 키를 별도 선형 변환한 뒤 비선형 함수와 점수 벡터로 정렬 점수를 계산하는 어텐션 방식이다.</span></li>
<li data-article-id="retrieval-transformer"><a href="/wiki/retrieval-transformer/">검색 결합 트랜스포머</a><span class="wiki-index-summary">검색 결합 트랜스포머는 외부 코퍼스에서 찾은 이웃 문맥을 모델 계산에 통합해 매개변수 밖의 정보를 사용하는 구조다.</span></li>
<li data-article-id="hierarchical-transformer"><a href="/wiki/hierarchical-transformer/">계층형 트랜스포머</a><span class="wiki-index-summary">계층적 트랜스포머는 토큰, 문장, 문서처럼 서로 다른 해상도의 표현을 단계적으로 계산하고 결합하는 구조다.</span></li>
<li data-article-id="graph-transformer"><a href="/wiki/graph-transformer/">그래프 트랜스포머</a><span class="wiki-index-summary">그래프 트랜스포머는 노드와 간선 구조를 어텐션에 반영해 그래프 데이터를 처리하는 트랜스포머 계열 모델이다.</span></li>
<li data-article-id="grouped-query-attention"><a href="/wiki/grouped-query-attention/">그룹 쿼리 어텐션</a><span class="wiki-index-summary">그룹 쿼리 어텐션은 여러 질의 헤드를 그룹으로 나누고 그룹마다 하나의 키·값 헤드를 공유하는 구조다.</span></li>
<li data-article-id="global-attention"><a href="/wiki/global-attention/">글로벌 어텐션</a><span class="wiki-index-summary">글로벌 어텐션은 선택된 토큰이 시퀀스 전체와 상호작용하거나 모든 토큰이 전역 위치를 볼 수 있게 하는 연결 방식이다.</span></li>
<li data-article-id="length-extrapolation"><a href="/wiki/length-extrapolation/">길이 외삽</a><span class="wiki-index-summary">길이 외삽은 모델이 학습에서 본 시퀀스 길이를 넘어선 입력에서도 규칙과 성능을 유지하는 능력이다.</span></li>
<li data-article-id="mixture-of-depths"><a href="/wiki/mixture-of-depths/">깊이 혼합</a><span class="wiki-index-summary">깊이 혼합은 각 트랜스포머 층에서 일부 토큰만 계산 블록을 통과시키고 나머지는 우회시켜 토큰별 계산 깊이를 달리하는 조건부 계산 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-d">
<h2 id="index-ko-d">ㄷ</h2>
<ul class="wiki-index-list">
<li data-article-id="dot-product-attention"><a href="/wiki/dot-product-attention/">닷프로덕트 어텐션</a><span class="wiki-index-summary">닷프로덕트 어텐션은 질의와 키의 내적을 호환도 점수로 사용하고 정규화한 가중치로 값을 결합한다.</span></li>
<li data-article-id="decoder"><a href="/wiki/decoder/">디코더</a><span class="wiki-index-summary">이전 출력과 문맥을 이용해 다음 출력을 순차적으로 생성하는 구성 요소다.</span></li>
<li data-article-id="decoder-only-model"><a href="/wiki/decoder-only-model/">디코더 전용 모델</a><span class="wiki-index-summary">인과적 어텐션을 사용하는 디코더 블록만으로 다음 토큰을 생성하는 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-r">
<h2 id="index-ko-r">ㄹ</h2>
<ul class="wiki-index-list">
<li data-article-id="layer-dropping"><a href="/wiki/layer-dropping/">레이어 드로핑</a><span class="wiki-index-summary">층 드롭은 학습 중 일부 트랜스포머 층을 확률적으로 건너뛰거나 추론 전에 제거해 깊이에 강건한 모델을 만드는 기법이다.</span></li>
<li data-article-id="layer-normalization"><a href="/wiki/layer-normalization/">레이어 정규화</a><span class="wiki-index-summary">한 샘플 내부 특성의 분포를 정규화해 학습과 추론을 안정화하는 연산이다.</span></li>
<li data-article-id="local-attention"><a href="/wiki/local-attention/">로컬 어텐션</a><span class="wiki-index-summary">로컬 어텐션은 각 토큰이 주변의 제한된 창이나 이웃 위치에만 주의를 주도록 연결 범위를 줄인 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-m">
<h2 id="index-ko-m">ㅁ</h2>
<ul class="wiki-index-list">
<li data-article-id="multimodal-transformer"><a href="/wiki/multimodal-transformer/">멀티모달 트랜스포머</a><span class="wiki-index-summary">멀티모달 트랜스포머는 텍스트·이미지·음성 등 서로 다른 양식의 토큰을 어텐션으로 결합해 공동 표현이나 출력을 만드는 모델이다.</span></li>
<li data-article-id="multi-query-attention"><a href="/wiki/multi-query-attention/">멀티쿼리 어텐션</a><span class="wiki-index-summary">멀티쿼리 어텐션은 여러 질의 헤드가 하나의 키·값 헤드 쌍을 공유해 추론 시 KV 캐시 크기와 메모리 대역폭을 줄인다.</span></li>
<li data-article-id="multi-head-attention"><a href="/wiki/multi-head-attention/">멀티헤드 어텐션</a><span class="wiki-index-summary">여러 어텐션 헤드가 서로 다른 관계를 병렬로 학습하도록 구성한 연산이다.</span></li>
<li data-article-id="memory-augmented-transformer"><a href="/wiki/memory-augmented-transformer/">메모리 증강 트랜스포머</a><span class="wiki-index-summary">메모리 증강 트랜스포머는 현재 입력 밖의 과거 상태나 외부 기억 슬롯을 읽고 쓰도록 확장된 트랜스포머 계열이다.</span></li>
<li data-article-id="memory-efficient-attention"><a href="/wiki/memory-efficient-attention/">메모리 효율적 어텐션</a><span class="wiki-index-summary">메모리 효율적 어텐션은 전체 어텐션 행렬을 메모리에 물질화하지 않고 동일하거나 근사한 출력을 계산하는 방법군이다.</span></li>
<li data-article-id="context-length-extension"><a href="/wiki/context-length-extension/">문맥 길이 확장</a><span class="wiki-index-summary">문맥 길이 확장은 모델이 학습 때 사용한 범위보다 더 긴 입력을 안정적으로 처리하도록 위치 표현과 학습·추론 설정을 조정하는 과정이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-b">
<h2 id="index-ko-b">ㅂ</h2>
<ul class="wiki-index-list">
<li data-article-id="block-sparse-attention"><a href="/wiki/block-sparse-attention/">블록 희소 어텐션</a><span class="wiki-index-summary">블록 희소 어텐션은 어텐션 행렬을 블록 단위로 제한해 일부 질의-키 블록만 계산하는 희소 방식이다.</span></li>
<li data-article-id="vision-transformer"><a href="/wiki/vision-transformer/">비전 트랜스포머</a><span class="wiki-index-summary">비전 트랜스포머는 이미지를 고정 크기 패치 토큰 시퀀스로 바꾸어 트랜스포머 인코더로 처리하는 시각 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-s">
<h2 id="index-ko-s">ㅅ</h2>
<ul class="wiki-index-list">
<li data-article-id="sinusoidal-position-encoding"><a href="/wiki/sinusoidal-position-encoding/">사인파 위치 인코딩</a><span class="wiki-index-summary">사인파 위치 인코딩은 서로 다른 주파수의 사인·코사인 함숫값으로 토큰 위치를 나타내는 고정 벡터 방식이다.</span></li>
<li data-article-id="relative-position-encoding"><a href="/wiki/relative-position-encoding/">상대 위치 인코딩</a><span class="wiki-index-summary">상대 위치 인코딩은 두 토큰의 절대 인덱스 대신 서로 떨어진 거리와 방향을 어텐션 계산에 반영하는 방식이다.</span></li>
<li data-article-id="state-space-transformer-hybrid"><a href="/wiki/state-space-transformer-hybrid/">상태 공간-트랜스포머 하이브리드</a><span class="wiki-index-summary">상태공간-트랜스포머 하이브리드는 선형 상태공간 시퀀스 층과 어텐션 층을 한 모델에서 결합한 구조다.</span></li>
<li data-article-id="linear-attention"><a href="/wiki/linear-attention/">선형 어텐션</a><span class="wiki-index-summary">선형 어텐션은 커널 변환이나 연산 순서 변경으로 시퀀스 길이에 대한 어텐션 계산을 선형에 가깝게 줄이는 방법군이다.</span></li>
<li data-article-id="segment-embedding"><a href="/wiki/segment-embedding/">세그먼트 임베딩</a><span class="wiki-index-summary">세그먼트 임베딩은 한 입력 안에서 문장 쌍이나 문서 구간처럼 서로 다른 부분의 소속을 나타내는 학습 벡터다.</span></li>
<li data-article-id="self-attention"><a href="/wiki/self-attention/">셀프 어텐션</a><span class="wiki-index-summary">하나의 시퀀스 안에서 각 위치가 다른 위치의 정보를 참조하는 어텐션이다.</span></li>
<li data-article-id="recurrent-memory-transformer"><a href="/wiki/recurrent-memory-transformer/">순환 메모리 트랜스포머</a><span class="wiki-index-summary">순환 메모리 트랜스포머는 긴 입력을 구간별로 처리하면서 학습 가능한 메모리 토큰을 다음 구간에 반복 전달하는 구조다.</span></li>
<li data-article-id="switch-transformer"><a href="/wiki/switch-transformer/">스위치 트랜스포머</a><span class="wiki-index-summary">Switch Transformer는 각 토큰을 여러 전문가 중 하나에 보내는 희소 혼합전문가 피드포워드 층을 사용한 트랜스포머다.</span></li>
<li data-article-id="scaled-dot-product-attention"><a href="/wiki/scaled-dot-product-attention/">스케일드 닷프로덕트 어텐션</a><span class="wiki-index-summary">스케일드 닷프로덕트 어텐션은 질의와 키의 내적을 키 차원의 제곱근으로 나눈 뒤 소프트맥스를 적용해 값의 가중합을 구한다.</span></li>
<li data-article-id="sliding-window-attention"><a href="/wiki/sliding-window-attention/">슬라이딩 윈도 어텐션</a><span class="wiki-index-summary">슬라이딩 윈도 어텐션은 각 위치가 일정한 앞뒤 또는 이전 토큰 창에만 주의를 주도록 창을 이동시키는 희소 패턴이다.</span></li>
<li data-article-id="sequence-to-sequence-transformer"><a href="/wiki/sequence-to-sequence-transformer/">시퀀스-투-시퀀스 트랜스포머</a><span class="wiki-index-summary">시퀀스-투-시퀀스 트랜스포머는 인코더가 입력 시퀀스를 표현하고 디코더가 이를 참조해 출력 시퀀스를 자동회귀 생성하는 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ng">
<h2 id="index-ko-ng">ㅇ</h2>
<ul class="wiki-index-list">
<li data-article-id="bidirectional-attention"><a href="/wiki/bidirectional-attention/">양방향 어텐션</a><span class="wiki-index-summary">양방향 어텐션은 각 토큰이 시퀀스의 앞과 뒤 모든 허용 위치를 함께 참고하도록 하는 어텐션 패턴이다.</span></li>
<li data-article-id="attention"><a href="/wiki/attention/">어텐션</a><span class="wiki-index-summary">현재 표현을 만들 때 입력의 각 부분에 서로 다른 중요도를 부여해 정보를 결합하는 연산이다.</span></li>
<li data-article-id="attention-complexity"><a href="/wiki/attention-complexity/">어텐션 계산 복잡도</a><span class="wiki-index-summary">어텐션 계산 복잡도는 시퀀스 길이, 헤드 차원과 배치 크기에 따라 어텐션이 요구하는 연산과 메모리의 증가율이다.</span></li>
<li data-article-id="attention-mask"><a href="/wiki/attention-mask/">어텐션 마스크</a><span class="wiki-index-summary">어텐션 마스크는 각 질의 위치가 참조할 수 있는 키 위치를 허용·차단하는 행렬 또는 규칙이다.</span></li>
<li data-article-id="attention-sink"><a href="/wiki/attention-sink/">어텐션 싱크</a><span class="wiki-index-summary">어텐션 싱크는 특별한 의미가 크지 않은 초기 토큰이 여러 후속 토큰의 높은 어텐션을 지속적으로 받는 현상이다.</span></li>
<li data-article-id="attention-score"><a href="/wiki/attention-score/">어텐션 점수</a><span class="wiki-index-summary">어텐션 점수는 질의와 키가 얼마나 관련 있는지를 정규화 전에 나타내는 스칼라 호환도 값이다.</span></li>
<li data-article-id="attention-matrix"><a href="/wiki/attention-matrix/">어텐션 행렬</a><span class="wiki-index-summary">어텐션 행렬은 모든 질의 위치와 키 위치 사이의 어텐션 가중치를 행렬로 모은 표현이다.</span></li>
<li data-article-id="attention-head"><a href="/wiki/attention-head/">어텐션 헤드</a><span class="wiki-index-summary">어텐션 헤드는 독립적인 질의·키·값 투영을 사용해 하나의 관계 패턴을 학습하는 다중 헤드 어텐션의 단위다.</span></li>
<li data-article-id="head-pruning"><a href="/wiki/head-pruning/">어텐션 헤드 가지치기</a><span class="wiki-index-summary">어텐션 헤드 가지치기는 중요도가 낮은 멀티헤드 어텐션 헤드를 제거해 모델 계산과 크기를 줄이는 압축 기법이다.</span></li>
<li data-article-id="language-modeling-head"><a href="/wiki/language-modeling-head/">언어 모델링 헤드</a><span class="wiki-index-summary">언어 모델링 헤드는 은닉 상태에서 각 어휘 토큰의 조건부 점수를 계산하는 언어 모델의 출력 모듈이다.</span></li>
<li data-article-id="position-interpolation"><a href="/wiki/position-interpolation/">위치 보간</a><span class="wiki-index-summary">위치 보간은 사전학습 때보다 긴 문맥을 처리하도록 새 위치 범위를 기존 위치 범위 안으로 압축해 매핑하는 확장 기법이다.</span></li>
<li data-article-id="positional-encoding"><a href="/wiki/positional-encoding/">위치 인코딩</a><span class="wiki-index-summary">어텐션 모델에 토큰의 순서와 상대 위치 정보를 주입하는 표현이다.</span></li>
<li data-article-id="position-id"><a href="/wiki/position-id/">위치 ID</a><span class="wiki-index-summary">위치 ID는 시퀀스 안 각 토큰에 위치 인코딩이나 회전 각도를 할당하기 위한 정수 인덱스다.</span></li>
<li data-article-id="universal-transformer"><a href="/wiki/universal-transformer/">유니버설 트랜스포머</a><span class="wiki-index-summary">유니버설 트랜스포머는 깊이 방향에서 같은 전환 블록을 반복 적용해 위치별 표현을 점진적으로 갱신하는 순환적 트랜스포머다.</span></li>
<li data-article-id="fused-transformer-kernel"><a href="/wiki/fused-transformer-kernel/">융합 트랜스포머 커널</a><span class="wiki-index-summary">융합 트랜스포머 커널은 연속된 여러 텐서 연산을 하나의 가속기 커널로 합쳐 메모리 이동과 실행 오버헤드를 줄인 구현이다.</span></li>
<li data-article-id="causal-mask"><a href="/wiki/causal-mask/">인과 마스크</a><span class="wiki-index-summary">현재 위치가 미래 토큰을 참조하지 못하게 어텐션 점수를 제한하는 마스크다.</span></li>
<li data-article-id="encoder"><a href="/wiki/encoder/">인코더</a><span class="wiki-index-summary">입력 시퀀스를 문맥이 반영된 내부 표현으로 변환하는 구성 요소다.</span></li>
<li data-article-id="encoder-only-transformer"><a href="/wiki/encoder-only-transformer/">인코더 전용 트랜스포머</a><span class="wiki-index-summary">인코더 전용 트랜스포머는 입력 전체의 양방향 문맥을 표현하도록 인코더 블록만 쌓은 구조다.</span></li>
<li data-article-id="encoder-decoder"><a href="/wiki/encoder-decoder/">인코더-디코더</a><span class="wiki-index-summary">입력을 인코딩한 뒤 별도의 디코더가 출력을 생성하는 모델 구조다.</span></li>
<li data-article-id="encoder-decoder-attention"><a href="/wiki/encoder-decoder-attention/">인코더-디코더 어텐션</a><span class="wiki-index-summary">인코더-디코더 어텐션은 디코더의 질의가 인코더 출력의 키와 값을 참고해 입력 정보를 가져오는 교차 어텐션이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-j">
<h2 id="index-ko-j">ㅈ</h2>
<ul class="wiki-index-list">
<li data-article-id="residual-connection"><a href="/wiki/residual-connection/">잔차 연결</a><span class="wiki-index-summary">블록의 입력을 출력에 더해 깊은 신경망의 학습을 안정화하는 연결이다.</span></li>
<li data-article-id="long-context-transformer"><a href="/wiki/long-context-transformer/">장문맥 트랜스포머</a><span class="wiki-index-summary">장문맥 트랜스포머는 일반적인 문맥 창보다 훨씬 긴 시퀀스를 처리하도록 어텐션, 위치 표현과 메모리를 설계한 모델이다.</span></li>
<li data-article-id="low-rank-attention"><a href="/wiki/low-rank-attention/">저랭크 어텐션</a><span class="wiki-index-summary">저랭크 어텐션은 키·값이나 어텐션 행렬이 더 낮은 차원 구조로 근사될 수 있다는 가정을 이용해 계산량을 줄이는 방법이다.</span></li>
<li data-article-id="adaptive-computation-time-transformer"><a href="/wiki/adaptive-computation-time-transformer/">적응형 계산 시간 트랜스포머</a><span class="wiki-index-summary">적응 계산 시간 트랜스포머는 입력 위치나 예제별로 필요한 반복 계산 단계 수를 동적으로 결정하는 구조다.</span></li>
<li data-article-id="absolute-position-encoding"><a href="/wiki/absolute-position-encoding/">절대 위치 인코딩</a><span class="wiki-index-summary">절대 위치 인코딩은 각 토큰의 시퀀스 내 고유 위치를 나타내는 벡터를 내용 표현에 더하거나 결합하는 방식이다.</span></li>
<li data-article-id="normalization-placement"><a href="/wiki/normalization-placement/">정규화 배치</a><span class="wiki-index-summary">정규화 배치는 트랜스포머 하위 계층의 앞이나 뒤 어느 위치에 정규화 연산을 둘지 정하는 구조 선택이다.</span></li>
<li data-article-id="early-exit-transformer"><a href="/wiki/early-exit-transformer/">조기 종료 트랜스포머</a><span class="wiki-index-summary">조기 종료 트랜스포머는 중간 층에 예측 헤드를 두고 충분히 확신하는 입력을 마지막 층 전에 반환하는 적응형 추론 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ch">
<h2 id="index-ko-ch">ㅊ</h2>
<ul class="wiki-index-list">
<li data-article-id="chunked-attention"><a href="/wiki/chunked-attention/">청크 어텐션</a><span class="wiki-index-summary">청크 어텐션은 긴 시퀀스를 여러 구간으로 나누어 구간 내부 또는 제한된 이웃 구간 사이에서 어텐션을 계산하는 방식이다.</span></li>
<li data-article-id="speculative-transformer-block"><a href="/wiki/speculative-transformer-block/">추측형 트랜스포머 블록</a><span class="wiki-index-summary">추측형 트랜스포머 블록은 여러 미래 토큰이나 중간 블록 출력을 병렬로 제안한 뒤 원래 모델이 검증해 순차 계산을 줄이는 구조다.</span></li>
<li data-article-id="output-projection"><a href="/wiki/output-projection/">출력 투영</a><span class="wiki-index-summary">출력 투영은 트랜스포머 은닉 표현을 어휘 로짓이나 과제별 출력 차원으로 선형 변환하는 계층이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-k">
<h2 id="index-ko-k">ㅋ</h2>
<ul class="wiki-index-list">
<li data-article-id="kernelized-attention"><a href="/wiki/kernelized-attention/">커널화 어텐션</a><span class="wiki-index-summary">커널화 어텐션은 소프트맥스 유사도를 특징 맵의 내적으로 표현하거나 근사해 어텐션 계산 순서를 바꾸는 방법이다.</span></li>
<li data-article-id="query-key-value"><a href="/wiki/query-key-value/">쿼리·키·값</a><span class="wiki-index-summary">어텐션에서 무엇을 찾을지 나타내는 쿼리와 비교 기준인 키, 선택된 정보를 전달하는 값으로 입력 표현을 투영한 세 집합이다.</span></li>
<li data-article-id="cross-attention"><a href="/wiki/cross-attention/">크로스 어텐션</a><span class="wiki-index-summary">한 표현의 질의가 다른 표현에서 만든 키와 값을 조회해 두 입력 사이의 관련 정보를 결합하는 어텐션이다.</span></li>
<li data-article-id="key-value-compression"><a href="/wiki/key-value-compression/">키·값 압축</a><span class="wiki-index-summary">키·값 압축은 어텐션의 KV 캐시를 더 적은 토큰, 헤드, 차원이나 비트로 표현해 메모리와 대역폭을 줄이는 기법이다.</span></li>
<li data-article-id="key-value-projection"><a href="/wiki/key-value-projection/">키·값 투영</a><span class="wiki-index-summary">키·값 투영은 트랜스포머 입력 표현을 어텐션의 검색 주소 역할인 키와 전달 내용 역할인 값 벡터로 변환하는 선형 연산이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-t">
<h2 id="index-ko-t">ㅌ</h2>
<ul class="wiki-index-list">
<li data-article-id="token-embedding-layer"><a href="/wiki/token-embedding-layer/">토큰 임베딩층</a><span class="wiki-index-summary">토큰 임베딩층은 이산 토큰 식별자를 학습 가능한 연속 벡터로 변환하는 트랜스포머 입력 계층이다.</span></li>
<li data-article-id="transformer"><a href="/wiki/transformer/">트랜스포머</a><span class="wiki-index-summary">어텐션을 중심으로 시퀀스의 관계를 병렬 계산하는 신경망 아키텍처다.</span></li>
<li data-article-id="transformer-block"><a href="/wiki/transformer-block/">트랜스포머 블록</a><span class="wiki-index-summary">트랜스포머 블록은 어텐션·피드포워드·정규화·잔차 연결을 반복 가능한 단위로 묶은 핵심 계층이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-p">
<h2 id="index-ko-p">ㅍ</h2>
<ul class="wiki-index-list">
<li data-article-id="padding-mask"><a href="/wiki/padding-mask/">패딩 마스크</a><span class="wiki-index-summary">패딩 마스크는 길이가 다른 시퀀스를 한 배치로 맞추기 위해 추가한 패딩 위치가 어텐션과 손실에 영향을 주지 않게 하는 마스크다.</span></li>
<li data-article-id="paged-attention"><a href="/wiki/paged-attention/">페이지드 어텐션</a><span class="wiki-index-summary">페이지드 어텐션은 요청별 KV 캐시를 고정 크기 블록으로 나눠 비연속 메모리에 배치하고 페이지 표로 참조하는 서빙 기법이다.</span></li>
<li data-article-id="post-normalization"><a href="/wiki/post-normalization/">포스트 정규화</a><span class="wiki-index-summary">포스트 정규화는 트랜스포머 하위층 출력과 잔차를 먼저 더한 뒤 층 정규화를 적용하는 배치다.</span></li>
<li data-article-id="pre-normalization"><a href="/wiki/pre-normalization/">프리 정규화</a><span class="wiki-index-summary">프리 정규화는 트랜스포머 하위층에 입력하기 전에 층 정규화를 적용하고 그 결과를 잔차 경로와 결합하는 배치다.</span></li>
<li data-article-id="prefix-language-model"><a href="/wiki/prefix-language-model/">프리픽스 언어 모델</a><span class="wiki-index-summary">프리픽스 언어 모델은 지정된 접두 구간에서는 양방향 문맥을 허용하고 생성 구간에서는 이전 위치만 참조하게 하는 언어 모델이다.</span></li>
<li data-article-id="flash-attention"><a href="/wiki/flash-attention/">플래시 어텐션</a><span class="wiki-index-summary">플래시 어텐션은 정확한 어텐션 결과를 유지하면서 GPU 고대역폭 메모리 왕복을 줄이는 IO 인식 알고리즘이다.</span></li>
<li data-article-id="feed-forward-network"><a href="/wiki/feed-forward-network/">피드포워드 네트워크</a><span class="wiki-index-summary">각 토큰 위치에 독립적으로 적용되는 비선형 완전연결 변환 블록이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-h">
<h2 id="index-ko-h">ㅎ</h2>
<ul class="wiki-index-list">
<li data-article-id="learned-position-embedding"><a href="/wiki/learned-position-embedding/">학습형 위치 임베딩</a><span class="wiki-index-summary">학습형 위치 임베딩은 각 시퀀스 위치에 대응하는 벡터를 모델 파라미터로 두고 데이터에서 학습하는 방식이다.</span></li>
<li data-article-id="diffusion-transformer"><a href="/wiki/diffusion-transformer/">확산 트랜스포머</a><span class="wiki-index-summary">확산 트랜스포머는 잡음이 섞인 잠재 표현이나 데이터를 반복적으로 복원하는 확산 모델의 잡음 예측기를 트랜스포머로 구현한 구조다.</span></li>
<li data-article-id="rotary-position-embedding"><a href="/wiki/rotary-position-embedding/">회전 위치 임베딩</a><span class="wiki-index-summary">회전 위치 임베딩은 위치에 따른 회전 변환을 질의와 키 벡터의 차원 쌍에 적용해 상대 위치가 내적에 나타나게 하는 방식이다.</span></li>
<li data-article-id="sparse-attention"><a href="/wiki/sparse-attention/">희소 어텐션</a><span class="wiki-index-summary">희소 어텐션은 전체 토큰 쌍 중 일부 연결만 계산하도록 고정·학습 패턴을 적용한 어텐션 계열이다.</span></li>
<li data-article-id="sparse-transformer"><a href="/wiki/sparse-transformer/">희소 트랜스포머</a><span class="wiki-index-summary">희소 트랜스포머는 모든 토큰 쌍 대신 미리 정한 일부 위치 쌍에만 어텐션을 계산해 긴 시퀀스의 비용을 줄이는 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-a">
<h2 id="index-en-a">A</h2>
<ul class="wiki-index-list">
<li data-article-id="alibi-position-bias"><a href="/wiki/alibi-position-bias/">ALiBi 위치 편향</a><span class="wiki-index-summary">ALiBi 위치 편향은 학습된 위치 임베딩 없이 토큰 거리에 비례하는 선형 음의 편향을 어텐션 점수에 더하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-b">
<h2 id="index-en-b">B</h2>
<ul class="wiki-index-list">
<li data-article-id="bart-architecture"><a href="/wiki/bart-architecture/">BART 아키텍처</a><span class="wiki-index-summary">BART 아키텍처는 양방향 인코더와 왼쪽에서 오른쪽으로 생성하는 디코더를 결합한 잡음 제거 시퀀스-투-시퀀스 모델이다.</span></li>
<li data-article-id="bert-architecture"><a href="/wiki/bert-architecture/">BERT 아키텍처</a><span class="wiki-index-summary">BERT 아키텍처는 양방향 자기어텐션 인코더를 쌓아 문맥에 따른 토큰 표현을 학습하는 트랜스포머 구조다.</span></li>
<li data-article-id="bigbird"><a href="/wiki/bigbird/">BigBird</a><span class="wiki-index-summary">BigBird는 국소·무작위·전역 연결을 조합한 블록 희소 어텐션으로 긴 시퀀스의 계산량을 줄이는 트랜스포머다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-c">
<h2 id="index-en-c">C</h2>
<ul class="wiki-index-list">
<li data-article-id="conformer-architecture"><a href="/wiki/conformer-architecture/">Conformer 아키텍처</a><span class="wiki-index-summary">Conformer는 음성의 국소 패턴과 장거리 의존성을 함께 모델링하도록 합성곱과 트랜스포머 블록을 결합한 인코더 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-g">
<h2 id="index-en-g">G</h2>
<ul class="wiki-index-list">
<li data-article-id="geglu"><a href="/wiki/geglu/">GEGLU</a><span class="wiki-index-summary">GEGLU는 GELU로 활성화한 선형 분기와 다른 선형 분기를 원소별로 곱하는 게이트 선형 유닛 변형이다.</span></li>
<li data-article-id="gpt-architecture"><a href="/wiki/gpt-architecture/">GPT 아키텍처</a><span class="wiki-index-summary">GPT 아키텍처는 이전 토큰만 볼 수 있는 인과 마스크를 사용해 다음 토큰을 예측하는 디코더 전용 트랜스포머 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-l">
<h2 id="index-en-l">L</h2>
<ul class="wiki-index-list">
<li data-article-id="longformer"><a href="/wiki/longformer/">Longformer</a><span class="wiki-index-summary">Longformer는 각 토큰의 국소 슬라이딩 창 어텐션과 일부 토큰의 전역 어텐션을 결합해 긴 문서를 처리하는 트랜스포머다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-n">
<h2 id="index-en-n">N</h2>
<ul class="wiki-index-list">
<li data-article-id="ntk-aware-scaling"><a href="/wiki/ntk-aware-scaling/">NTK 인식 스케일링</a><span class="wiki-index-summary">NTK 인식 스케일링은 RoPE의 주파수 기반을 조정해 긴 위치에서의 변화율을 완화하고 문맥 범위를 늘리는 기법군이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-p">
<h2 id="index-en-p">P</h2>
<ul class="wiki-index-list">
<li data-article-id="performer"><a href="/wiki/performer/">Performer</a><span class="wiki-index-summary">Performer는 소프트맥스 어텐션을 무작위 특징 기반 커널로 근사해 시퀀스 길이에 선형인 계산을 목표로 하는 트랜스포머 변형이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-r">
<h2 id="index-en-r">R</h2>
<ul class="wiki-index-list">
<li data-article-id="reformer"><a href="/wiki/reformer/">Reformer</a><span class="wiki-index-summary">Reformer는 국소민감해시 어텐션과 가역 잔차 층을 사용해 긴 시퀀스의 메모리와 계산 비용을 줄인 트랜스포머 변형이다.</span></li>
<li data-article-id="rms-normalization"><a href="/wiki/rms-normalization/">RMS 정규화</a><span class="wiki-index-summary">RMS 정규화는 평균을 빼지 않고 특징 값의 제곱평균제곱근으로 크기를 조정하는 정규화 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-s">
<h2 id="index-en-s">S</h2>
<ul class="wiki-index-list">
<li data-article-id="swiglu"><a href="/wiki/swiglu/">SwiGLU</a><span class="wiki-index-summary">SwiGLU는 SiLU로 활성화한 선형 분기와 다른 선형 분기를 원소별로 곱하는 게이트 순방향층 함수다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-t">
<h2 id="index-en-t">T</h2>
<ul class="wiki-index-list">
<li data-article-id="t5-architecture"><a href="/wiki/t5-architecture/">T5 아키텍처</a><span class="wiki-index-summary">T5 아키텍처는 모든 자연어 처리 과제를 텍스트 입력에서 텍스트 출력으로 표현하는 인코더-디코더 트랜스포머다.</span></li>
<li data-article-id="transformer-xl"><a href="/wiki/transformer-xl/">Transformer-XL</a><span class="wiki-index-summary">Transformer-XL은 이전 구간의 은닉 상태를 다음 구간에서 재사용해 고정 길이 문맥을 넘어선 의존성을 모델링하는 트랜스포머다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-x">
<h2 id="index-en-x">X</h2>
<ul class="wiki-index-list">
<li data-article-id="xlnet-architecture"><a href="/wiki/xlnet-architecture/">XLNet 아키텍처</a><span class="wiki-index-summary">XLNet 아키텍처는 토큰 위치의 여러 순열에 대해 자동회귀 예측을 수행해 양방향 문맥을 학습하는 트랜스포머 구조다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-y">
<h2 id="index-en-y">Y</h2>
<ul class="wiki-index-list">
<li data-article-id="yarn-scaling"><a href="/wiki/yarn-scaling/">YaRN 스케일링</a><span class="wiki-index-summary">YaRN 스케일링은 RoPE 주파수 보간과 주의 로짓 크기 보정을 결합해 긴 문맥으로 효율적으로 확장하는 방법이다.</span></li>
</ul>
</section>
</div>

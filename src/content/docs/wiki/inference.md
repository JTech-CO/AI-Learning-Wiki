---
title: "추론 Inference"
description: "학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-lead">학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.</p>

<div class="wiki-document-meta">분류: [추론·서빙·최적화](/category/inference/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-12</div>

## 개념과 원리

### 개요와 핵심 정의

학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.

‘추론’ 개념은 추론·서빙·최적화 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 추론·서빙 분야는 학습된 모델을 실제 요청에 실행할 때의 생성 규칙과 시스템 자원 관리를 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 배경과 설명 범위

영문 Wikipedia의 ‘Inference’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 작동 원리

추론은 학습이 끝난 모델에 새 입력을 넣어 예측이나 생성을 계산하는 단계로, 전처리·모델 실행·후처리를 포함한다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

#### 학습된 파라미터를 출력으로 계산하기

머신러닝 추론은 학습이 끝난 파라미터와 새 입력을 사용해 예측이나 생성 결과를 계산하는 단계다. 분류 모델은 입력을 점수와 확률로 변환해 레이블을 고르고, 자기회귀 언어 모델은 지금까지의 토큰에서 다음 토큰의 로짓을 계산한 뒤 선택 과정을 반복한다. 이때 파라미터가 고정되어 있어도 출력은 전처리, 정밀도, 샘플링 설정과 난수 상태에 따라 달라질 수 있다. “같은 모델”이라는 표현은 가중치뿐 아니라 토크나이저, 실행 코드, 생성 설정을 포함해야 재현 가능하다. 배치 처리와 온라인 처리는 같은 수학적 함수를 계산해도 지연과 자원 이용 목표가 다르다.

Transformer 생성에서는 입력 토큰의 어텐션 키와 값을 이후 단계에서 다시 사용하므로 KV 캐시를 유지한다. 토큰이 하나씩 늘 때 과거 전체를 다시 계산하지 않아 속도가 빨라지지만, 요청 수와 문맥 길이에 비례해 메모리를 많이 차지한다. PagedAttention은 운영체제의 가상 메모리와 비슷하게 캐시를 고정된 블록으로 나누어 불연속 공간에 배치함으로써 내부 단편화와 예약 낭비를 줄인다. vLLM은 이 방식을 이용해 서로 다른 길이의 요청을 연속 배치하고, 접두사가 같은 요청에서 블록을 공유할 수 있다. 이 최적화는 모델 의미를 바꾸지 않지만 스케줄링과 메모리 관리가 처리량에 큰 영향을 준다는 점을 보여 준다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구성 요소와 처리 흐름

실제 시스템에서는 ‘추론’ 개념만 독립적으로 동작하지 않는다. [로짓](/wiki/logit/), [소프트맥스](/wiki/softmax/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

#### 프리필·디코드·스케줄링

언어 모델 서빙은 보통 입력 전체를 병렬 계산하는 프리필과 한 번에 새 토큰을 생성하는 디코드로 나뉜다. 프리필은 계산량이 크고 GPU 연산을 잘 채우는 반면, 디코드는 저장된 KV 캐시를 자주 읽어 메모리 대역폭의 영향을 크게 받는다. 긴 입력과 짧은 대화가 같은 큐에 섞이면 한 요청이 다른 요청의 첫 토큰 지연을 늘릴 수 있다. 스케줄러는 배치에 넣을 토큰 수, 선점과 재개, 우선순위를 정하며, 연속 배치는 요청이 끝나는 즉시 새 요청을 빈 자리에 넣는다. 처리량을 최대화하는 설정과 사용자가 느끼는 응답 속도를 최소화하는 설정은 같지 않다.

모델 병렬화는 가중치가 한 장치에 들어가지 않을 때 텐서, 파이프라인, 데이터 병렬로 나눈다. 장치 간 통신이 늘어 지연이 커질 수 있으므로 모델 크기만 보고 병렬 수를 정하지 않는다. 양자화는 가중치나 활성값, 캐시의 비트 수를 줄여 메모리와 연산을 절약하지만 하드웨어 커널 지원과 품질 변화를 함께 확인해야 한다. 접두사 캐싱, 추측 디코딩, 구조화 출력도 특정 요청 분포에서 이익이 다르다. 최적화 효과를 측정할 때 모델, 입력·출력 길이 분포, 동시성, 하드웨어와 품질 허용치를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

지연 시간, 처리량, 메모리, 비용과 출력 품질의 균형을 맞추는 데 사용한다. ‘추론’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

#### 지연·처리량·비용의 균형

실시간 대화는 첫 토큰 지연과 토큰 간 간격이 중요하고, 야간 문서 처리는 전체 처리량과 단가가 더 중요하다. 같은 모델도 온라인 큐와 오프라인 배치를 분리하면 서로 다른 목표에 맞게 자원을 활용할 수 있다. 출력 길이는 생성 비용과 사용자가 기다리는 시간을 직접 늘리므로 최대 토큰만 크게 잡기보다 과제별 종료 조건을 둔다. 긴 입력을 무조건 모델에 넣지 말고 중복 제거, 검색, 구조화된 상태로 필요한 문맥을 선택한다. 이 과정에서 품질 손실이 없는지는 실제 질의로 측정한다.

하드웨어 선택은 이론 연산량뿐 아니라 가중치와 KV 캐시가 메모리에 들어가는지, 필요한 자료형과 커널이 지원되는지, 장치 간 통신과 운영 가용성을 본다. 소형 모델을 더 많은 복제본으로 제공하는 방식과 대형 모델을 병렬화하는 방식의 비용 구조가 다르다. 요청을 난이도에 따라 라우팅하거나 캐시를 사용하면 평균 비용을 줄일 수 있지만 잘못된 라우팅과 오래된 결과의 위험이 생긴다. 비용 보고에는 유휴 용량, 모델 적재, 재시도와 실패 요청도 포함한다.

용량 계획에는 장애 시 축소 동작도 포함한다. 과부하 때 무제한 대기시키는 대신 새 요청 거부, 최대 출력 축소, 작은 모델 전환 중 서비스 의미에 맞는 방식을 정한다. 사용자에게는 부분 결과와 재시도 가능성을 정확히 알리고, 품질을 조용히 낮추지 않는다. 정상화 뒤에는 버려진 요청과 중복 처리 여부를 추적해 데이터 일관성을 확인한다.

**용량 계산 사례:** 한 요청의 평균만으로 GPU 수를 정하지 말고 입력·출력 길이의 상위 백분위와 동시 도착을 부하에 반영한다. 목표 트래픽을 단계적으로 올리면서 첫 토큰 지연과 완료 지연의 상위 백분위가 허용 기준을 넘는 지점을 찾고, 그보다 여유 있는 용량을 운영 기준으로 둔다. KV 캐시 부족으로 선점과 재계산이 급증하는 구간은 이론상 토큰 처리량이 높아도 안정 용량에서 제외한다.

새 양자화나 추측 디코딩을 적용할 때는 동일 요청 추적을 사용해 출력 품질과 지연을 동시에 비교한다. 짧은 응답에서만 빠르거나 특정 언어의 품질이 떨어질 수 있다. 서버 로그에는 활성 최적화와 모델 아티팩트를 연결해 성능 회귀가 트래픽 변화인지 엔진 변경인지 구분한다.

추론 서비스의 회귀 기준은 트래픽이 없는 합성 시험과 실제 분포 재생을 모두 포함한다. 캐시 적중률처럼 운영 상태에 의존하는 이득은 차가운 시작과 정상 상태를 나눠 보고한다.

모델 서버의 건강 상태는 프로세스가 살아 있는지만 보지 않는다. 작은 고정 입력의 출력, 장치 메모리, 큐 수용 가능성과 의존 토크나이저를 확인한다. 불완전한 인스턴스를 로드밸런서에 넣으면 재시도 폭증으로 전체 장애가 커질 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 한계와 흔한 오해

정확도뿐 아니라 지연 시간, 처리량, 메모리, 비용, 하드웨어 정밀도의 영향을 함께 측정한다.

평균 성능만으로 운영 안정성을 판단하지 말고 부하·꼬리 지연·실패 복구를 포함한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

#### 성능 수치가 달라지는 이유

초당 토큰 수는 측정 범위를 명시하지 않으면 비교하기 어렵다. 단일 요청의 생성 속도, 전체 서버 처리량, 입력 토큰을 포함한 속도가 서로 다른 값이며, 첫 토큰까지의 시간과 이후 토큰 간 시간도 사용자 경험에 미치는 영향이 다르다. 평균만 보면 큐가 길어졌을 때의 상위 백분위 지연을 숨긴다. 벤치마크의 고정 길이 입력이 실제 서비스의 긴 꼬리 분포를 대표하지 않을 수 있고, 캐시가 따뜻한 상태와 처음 모델을 올리는 상태도 구분해야 한다.

메모리 부족은 단순히 가중치 크기만으로 예측되지 않는다. KV 캐시, 활성값, 통신 버퍼, 커널 작업 공간, 메모리 단편화가 함께 공간을 사용한다. 과도한 배치는 처리량을 높이다가 큐 대기와 메모리 압박을 키울 수 있다. 요청 취소가 캐시에서 즉시 회수되는지, 선점된 요청이 재계산되는지에 따라 실제 효율이 달라진다. 최적화된 커널은 특정 GPU 세대, 자료형, 헤드 크기에서만 동작할 수 있다. 품질 측면에서는 낮은 정밀도와 근사 연산이 일부 언어·희귀 토큰·긴 문맥에 더 큰 영향을 줄 수 있으므로 대표적인 회귀 세트를 병행한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 관련 개념과의 구분

- [로짓](/wiki/logit/): 확률 변환 전에 모델이 각 후보 토큰에 부여하는 정규화되지 않은 점수다.
- [소프트맥스](/wiki/softmax/): 여러 로짓을 합이 1인 확률 분포로 변환하는 함수다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 구체적 적용 예시

실제 요청 길이와 동시 사용자 수를 반영한 부하 시험에서 첫 토큰 지연, 전체 지연, 처리량과 오류율을 함께 잰다. ‘추론’을 적용하는 경우에는 추론은 학습이 끝난 모델에 새 입력을 넣어 예측이나 생성을 계산하는 단계로, 전처리·모델 실행·후처리를 포함한다.

평균값 외에 상위 백분위 지연과 메모리 부족, 시간 초과, 재시도 상황을 재현해 운영 한계를 정한다. 이때 [로짓](/wiki/logit/), [소프트맥스](/wiki/softmax/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실무 적용과 검증 절차

1. **목적 정의:** ‘추론’이 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 지연 시간, 처리량, 메모리, 비용과 출력 품질의 균형을 맞추는 데 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 정확도뿐 아니라 지연 시간, 처리량, 메모리, 비용, 하드웨어 정밀도의 영향을 함께 측정한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘추론’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

#### 서빙 용량 계획

먼저 실제 요청에서 입력 길이, 출력 길이, 도착 간격, 동시성의 분포를 수집하고 서비스 수준 목표를 첫 토큰 지연, 토큰 간 지연, 전체 완료 시간, 오류율로 나눈다. 합성 부하는 이 분포와 취소·시간 초과를 재현해야 한다. 기준 모델을 단일 장치에서 측정한 뒤 배치 토큰 한도, 메모리 이용률, 병렬 방식, 양자화를 한 번에 하나씩 바꾼다. 각 실험에서 처리량과 상위 백분위 지연, 메모리 최고점, 품질 회귀를 함께 기록한다. 서버가 거부하거나 대기열을 제한하는 시점도 용량의 일부다.

운영에서는 큐 길이, 프리필·디코드 토큰 수, KV 캐시 사용률과 회수, 선점, 장치 이용률, 시간 초과를 관찰한다. 자동 확장은 모델 적재 시간이 길다는 점을 반영해 미리 용량을 확보하고, 부하가 줄어도 진행 중 요청이 끝나기 전에 인스턴스를 내리지 않는다. 새 엔진이나 커널은 같은 요청 추적을 재생해 결과와 성능을 비교한 뒤 일부 트래픽에 적용한다. 장애 시에는 모델 오류, 입력 검증, 스케줄러, 장치 메모리, 의존 서비스로 원인을 나누고, 안전한 최대 문맥·동시성 설정으로 되돌릴 수 있어야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 문서 관계

### 선행 개념

_해당 문서가 없습니다._

### 관련 문서

- [로짓](/wiki/logit/)
- [소프트맥스](/wiki/softmax/)

### 이 문서를 가리키는 문서

- [가속기 메모리](/wiki/accelerator-memory/)
- [가중치 전용 양자화](/wiki/weight-only-quantization/)
- [결정적 추론](/wiki/deterministic-inference/)
- [고대역폭 메모리](/wiki/high-bandwidth-memory/)
- [그래프 컴파일](/wiki/graph-compilation/)

<details class="wiki-backlinks-more">
<summary>나머지 86개 문서 보기</summary>

- [길이 페널티](/wiki/length-penalty/)
- [꼬리 지연 시간](/wiki/tail-latency/)
- [다양성 빔 탐색](/wiki/diverse-beam-search/)
- [다중 모델 서빙](/wiki/multi-model-serving/)
- [다항 표본추출](/wiki/multinomial-sampling/)
- [대조 탐색](/wiki/contrastive-search/)
- [대체 모델](/wiki/fallback-model/)
- [동적 배칭](/wiki/dynamic-batching/)
- [디코드 단계](/wiki/decode-phase/)
- [로짓](/wiki/logit/)
- [루프라인 모델](/wiki/roofline-model/)
- [메모리 대역폭](/wiki/memory-bandwidth/)
- [메모리 부족 오류](/wiki/out-of-memory-error/)
- [메모리 집약 작업](/wiki/memory-bound-workload/)
- [모델 가용성](/wiki/model-availability/)
- [모델 게이트웨이](/wiki/model-gateway/)
- [모델 복제본](/wiki/model-replica/)
- [모델 서빙](/wiki/model-serving/)
- [반복 페널티](/wiki/repetition-penalty/)
- [배치 추론](/wiki/batch-inference/)
- [백프레셔](/wiki/backpressure/)
- [빈도 페널티](/wiki/frequency-penalty/)
- [사전 컴파일](/wiki/ahead-of-time-compilation/)
- [생성 온도](/wiki/temperature/)
- [서버리스 추론](/wiki/serverless-inference/)
- [서비스 수준 목표](/wiki/service-level-objective/)
- [서킷 브레이커](/wiki/circuit-breaker/)
- [소규모 언어 모델](/wiki/small-language-model/)
- [수락 제어](/wiki/admission-control/)
- [수치 재현성](/wiki/numerical-reproducibility/)
- [스트리밍 생성](/wiki/streaming-generation/)
- [엣지 추론](/wiki/edge-inference/)
- [연산 집약 작업](/wiki/compute-bound-workload/)
- [연산자 융합](/wiki/operator-fusion/)
- [연속 배칭](/wiki/continuous-batching/)
- [온라인 추론](/wiki/online-inference/)
- [요청 대기열](/wiki/request-queue/)
- [요청 스케줄러](/wiki/request-scheduler/)
- [웜 스타트](/wiki/warm-start/)
- [전형성 샘플링](/wiki/typical-sampling/)
- [점진적 성능 저하](/wiki/graceful-degradation/)
- [정적 배칭](/wiki/static-batching/)
- [제약 디코딩](/wiki/constrained-decoding/)
- [존재 페널티](/wiki/presence-penalty/)
- [중지 시퀀스](/wiki/stop-sequence/)
- [지연 시간-처리량 절충](/wiki/latency-throughput-tradeoff/)
- [첫 토큰 시간](/wiki/time-to-first-token/)
- [청크 프리필](/wiki/chunked-prefill/)
- [초안 모델](/wiki/draft-model/)
- [추론 그래프 최적화](/wiki/inference-graph-optimization/)
- [추론 모니터링](/wiki/inference-monitoring/)
- [추론 부하 분산](/wiki/inference-load-balancing/)
- [추론 서버](/wiki/inference-server/)
- [추론 시간 초과](/wiki/inference-timeout/)
- [추론 엔드포인트](/wiki/inference-endpoint/)
- [추론 용량 계획](/wiki/inference-capacity-planning/)
- [추론 자동 확장](/wiki/inference-autoscaling/)
- [추론 재시도](/wiki/inference-retry/)
- [추측 디코딩](/wiki/speculative-decoding/)
- [캐시 오프로딩](/wiki/cache-offloading/)
- [캐시 적중률](/wiki/cache-hit-rate/)
- [캐시 축출](/wiki/cache-eviction/)
- [커널 융합](/wiki/kernel-fusion/)
- [콜드 스타트](/wiki/cold-start/)
- [토큰 간 지연 시간](/wiki/inter-token-latency/)
- [토큰 비용](/wiki/token-cost/)
- [토큰 샘플링](/wiki/token-sampling/)
- [페이지드 KV 캐시](/wiki/paged-kv-cache/)
- [프롬프트 조회 디코딩](/wiki/prompt-lookup-decoding/)
- [프리픽스 캐싱](/wiki/prefix-caching/)
- [프리필 단계](/wiki/prefill-phase/)
- [학습 후 양자화](/wiki/post-training-quantization/)
- [활성값 양자화](/wiki/activation-quantization/)
- [CPU 추론](/wiki/cpu-inference/)
- [FP8 추론](/wiki/fp8-inference/)
- [GGUF 형식](/wiki/gguf-format/)
- [GPU 추론](/wiki/gpu-inference/)
- [INT4 추론](/wiki/int4-inference/)
- [INT8 추론](/wiki/int8-inference/)
- [KV 캐시 양자화](/wiki/kv-cache-quantization/)
- [Min-p 샘플링](/wiki/min-p-sampling/)
- [NPU 추론](/wiki/npu-inference/)
- [ONNX Runtime](/wiki/onnx-runtime/)
- [TensorRT-LLM](/wiki/tensorrt-llm/)
- [TPU 추론](/wiki/tpu-inference/)
- [XLA 컴파일러](/wiki/xla-compiler/)

</details>

### 이 문서를 포함하는 코스

[AI API 개발](/course/api-development/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) — paper
<span id="reference-2"></span>2. [Machine learning: model assessments — Wikipedia](https://en.wikipedia.org/wiki/Machine_learning#Model_assessments) — encyclopedia
<span id="reference-3"></span>3. [vLLM documentation](https://docs.vllm.ai/en/stable/) — documentation

### 코스에서 계속 읽기

- **AI API 개발:** [다음 문서 — 지연 시간](/wiki/latency/)

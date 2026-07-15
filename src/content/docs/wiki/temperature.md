---
title: "생성 온도 Temperature"
description: "생성 시 로짓을 나누어 토큰 확률분포의 집중도를 조절하고 출력의 반복성과 다양성 사이의 균형을 바꾸는 디코딩 매개변수다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">샘플링 온도 · Softmax Temperature</p>

<p class="wiki-lead">생성 시 로짓을 나누어 토큰 확률분포의 집중도를 조절하고 출력의 반복성과 다양성 사이의 균형을 바꾸는 디코딩 매개변수다.</p>

<div class="wiki-document-meta">분류: [추론·서빙·최적화](/category/inference/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

생성 시 로짓을 나누어 토큰 확률분포의 집중도를 조절하고 출력의 반복성과 다양성 사이의 균형을 바꾸는 디코딩 매개변수다.

일반적인 구현은 로짓 z를 양의 온도 T로 나눈 뒤 softmax(z/T)를 계산한다. T가 1보다 작으면 높은 로짓의 상대 확률이 커지고, 1보다 크면 분포가 평평해진다. 온도 0은 수학식에 직접 넣는 값이 아니라 보통 최댓값 선택을 뜻하는 API 관례다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

생성 온도와 모델 보정에 쓰는 temperature scaling은 같은 수식을 공유하지만 목적이 다르다. 제공자마다 허용 범위와 0 처리 방식이 다르며, 표본추출을 끈 상태에서는 온도 값이 무시될 수 있다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

온도는 토큰 순위를 바꾸지 않고 로짓 차이의 효과를 확대하거나 축소한다. 이후 top-k나 top-p가 후보를 자르고 표본을 뽑는다. 따라서 온도 효과는 다른 디코딩 파라미터와 결합해 해석해야 한다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

모델·API 버전, temperature, top-k, top-p, 시드, 반복 패널티와 중단 조건이 하나의 디코딩 구성이다. 같은 프롬프트를 여러 번 실행해 출력 분산과 성공률을 함께 측정해야 한다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

형식이 엄격한 추출·분류에서는 낮은 다양성이 유리할 수 있고 아이디어 탐색에서는 여러 후보를 얻는 설정이 유용할 수 있다. 그러나 특정 업무에 고정된 권장 숫자는 없으며 평가 세트로 선택해야 한다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

낮은 온도가 사실성을 보장하거나 높은 온도가 창의성을 보장하지 않는다. 모델이 가진 오류와 편향은 그대로 남고, 비결정적 실행 환경에서는 같은 설정도 결과가 달라질 수 있다. 온도만 바꾸어 안전 문제를 해결해서는 안 된다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [softmax](/wiki/softmax/): 로짓을 확률분포로 바꾸는 함수이며 온도는 그 입력 스케일을 조절한다.
- [top-k-sampling](/wiki/top-k-sampling/): 확률이 높은 k개 후보만 남기는 후보 제한 정책이다.
- [next-token-prediction](/wiki/next-token-prediction/): 온도가 적용되는 토큰 분포를 만드는 모델의 예측 과정이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적인 적용 예시

로짓 [2,1,0]에 T=0.5를 쓰면 높은 항목에 더 집중되고 T=2를 쓰면 후보 간 차이가 줄어든다. 업무 프롬프트 묶음에서 각 설정을 여러 시드로 실행해 정확도, 형식 준수율, 중복률을 비교한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 모델과 API 버전, 모든 디코딩 값, 시드, 반복 횟수, 과제별 성공 지표와 대표 실패 출력을 기록한다.
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

- 생성 온도 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [소프트맥스](/wiki/softmax/)
- [다음 토큰 예측](/wiki/next-token-prediction/)

### 관련 문서

- [Top-k 샘플링](/wiki/top-k-sampling/)
- [추론](/wiki/inference/)
- [확률](/wiki/probability/)

### 이 문서를 가리키는 문서

- [가속기 메모리](/wiki/accelerator-memory/)
- [가중치 전용 양자화](/wiki/weight-only-quantization/)
- [결정적 추론](/wiki/deterministic-inference/)
- [고대역폭 메모리](/wiki/high-bandwidth-memory/)
- [그래프 컴파일](/wiki/graph-compilation/)

<details class="wiki-backlinks-more">
<summary>나머지 88개 문서 보기</summary>

- [길이 페널티](/wiki/length-penalty/)
- [꼬리 지연 시간](/wiki/tail-latency/)
- [다양성 빔 탐색](/wiki/diverse-beam-search/)
- [다음 토큰 예측](/wiki/next-token-prediction/)
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
- [서버리스 추론](/wiki/serverless-inference/)
- [서비스 수준 목표](/wiki/service-level-objective/)
- [서킷 브레이커](/wiki/circuit-breaker/)
- [소프트맥스](/wiki/softmax/)
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
- [Top-k 샘플링](/wiki/top-k-sampling/)
- [Top-p 샘플링](/wiki/top-p-sampling/)
- [TPU 추론](/wiki/tpu-inference/)
- [XLA 컴파일러](/wiki/xla-compiler/)

</details>

### 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531) — paper
<span id="reference-2"></span>2. [Mistral AI: Temperature](https://docs.mistral.ai/resources/cookbooks/concept-deep-dive-sampling-temperature) — documentation
<span id="reference-3"></span>3. [Softmax function — Wikipedia](https://en.wikipedia.org/wiki/Softmax_function) — encyclopedia

### 코스에서 계속 읽기

- **LLM 내부 구조:** [다음 문서 — Top-k 샘플링](/wiki/top-k-sampling/)

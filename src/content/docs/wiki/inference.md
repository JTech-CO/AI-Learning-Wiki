---
title: "추론 Inference"
description: "학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.</p>

<div class="wiki-document-meta">분류: [추론·서빙·최적화](/category/inference/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-12</div>

## 개요와 핵심 정의

학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.

‘추론’ 개념은 추론·서빙·최적화 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 추론·서빙 분야는 학습된 모델을 실제 요청에 실행할 때의 생성 규칙과 시스템 자원 관리를 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 배경과 설명 범위

영문 Wikipedia의 ‘Inference’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 작동 원리

추론은 학습이 끝난 모델에 새 입력을 넣어 예측이나 생성을 계산하는 단계로, 전처리·모델 실행·후처리를 포함한다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘추론’ 개념만 독립적으로 동작하지 않는다. [로짓](/wiki/logit/), [소프트맥스](/wiki/softmax/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용 분야와 선택 기준

지연 시간, 처리량, 메모리, 비용과 출력 품질의 균형을 맞추는 데 사용한다. ‘추론’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 한계와 흔한 오해

정확도뿐 아니라 지연 시간, 처리량, 메모리, 비용, 하드웨어 정밀도의 영향을 함께 측정한다.

평균 성능만으로 운영 안정성을 판단하지 말고 부하·꼬리 지연·실패 복구를 포함한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 관련 개념과의 구분

- [로짓](/wiki/logit/): 확률 변환 전에 모델이 각 후보 토큰에 부여하는 정규화되지 않은 점수다.
- [소프트맥스](/wiki/softmax/): 여러 로짓을 합이 1인 확률 분포로 변환하는 함수다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 구체적 적용 예시

실제 요청 길이와 동시 사용자 수를 반영한 부하 시험에서 첫 토큰 지연, 전체 지연, 처리량과 오류율을 함께 잰다. ‘추론’을 적용하는 경우에는 추론은 학습이 끝난 모델에 새 입력을 넣어 예측이나 생성을 계산하는 단계로, 전처리·모델 실행·후처리를 포함한다.

평균값 외에 상위 백분위 지연과 메모리 부족, 시간 초과, 재시도 상황을 재현해 운영 한계를 정한다. 이때 [로짓](/wiki/logit/), [소프트맥스](/wiki/softmax/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘추론’이 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 지연 시간, 처리량, 메모리, 비용과 출력 품질의 균형을 맞추는 데 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 정확도뿐 아니라 지연 시간, 처리량, 메모리, 비용, 하드웨어 정밀도의 영향을 함께 측정한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘추론’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

_해당 문서가 없습니다._

## 관련 문서

- [로짓](/wiki/logit/)
- [소프트맥스](/wiki/softmax/)

## 이 문서를 가리키는 문서

- [가속기 메모리](/wiki/accelerator-memory/)
- [활성값 양자화](/wiki/activation-quantization/)
- [수락 제어](/wiki/admission-control/)
- [사전 컴파일](/wiki/ahead-of-time-compilation/)
- [백프레셔](/wiki/backpressure/)
- [배치 추론](/wiki/batch-inference/)
- [캐시 축출](/wiki/cache-eviction/)
- [캐시 적중률](/wiki/cache-hit-rate/)
- [캐시 오프로딩](/wiki/cache-offloading/)
- [청크 프리필](/wiki/chunked-prefill/)
- [서킷 브레이커](/wiki/circuit-breaker/)
- [콜드 스타트](/wiki/cold-start/)
- [연산 집약 작업](/wiki/compute-bound-workload/)
- [제약 디코딩](/wiki/constrained-decoding/)
- [연속 배칭](/wiki/continuous-batching/)
- [대조 탐색](/wiki/contrastive-search/)
- [CPU 추론](/wiki/cpu-inference/)
- [디코드 단계](/wiki/decode-phase/)
- [다양성 빔 탐색](/wiki/diverse-beam-search/)
- [초안 모델](/wiki/draft-model/)
- [동적 배칭](/wiki/dynamic-batching/)
- [엣지 추론](/wiki/edge-inference/)
- [대체 모델](/wiki/fallback-model/)
- [FP8 추론](/wiki/fp8-inference/)
- [빈도 페널티](/wiki/frequency-penalty/)
- [GGUF 형식](/wiki/gguf-format/)
- [GPU 추론](/wiki/gpu-inference/)
- [그래프 컴파일](/wiki/graph-compilation/)
- [고대역폭 메모리](/wiki/high-bandwidth-memory/)
- [추론 자동 확장](/wiki/inference-autoscaling/)
- [추론 용량 계획](/wiki/inference-capacity-planning/)
- [추론 엔드포인트](/wiki/inference-endpoint/)
- [추론 그래프 최적화](/wiki/inference-graph-optimization/)
- [추론 부하 분산](/wiki/inference-load-balancing/)
- [추론 재시도](/wiki/inference-retry/)
- [추론 서버](/wiki/inference-server/)
- [추론 시간 초과](/wiki/inference-timeout/)
- [INT4 추론](/wiki/int4-inference/)
- [INT8 추론](/wiki/int8-inference/)
- [토큰 간 지연 시간](/wiki/inter-token-latency/)
- [커널 융합](/wiki/kernel-fusion/)
- [KV 캐시 양자화](/wiki/kv-cache-quantization/)
- [지연 시간-처리량 절충](/wiki/latency-throughput-tradeoff/)
- [길이 페널티](/wiki/length-penalty/)
- [로짓](/wiki/logit/)
- [메모리 대역폭](/wiki/memory-bandwidth/)
- [메모리 집약 작업](/wiki/memory-bound-workload/)
- [Min-p 샘플링](/wiki/min-p-sampling/)
- [모델 가용성](/wiki/model-availability/)
- [모델 게이트웨이](/wiki/model-gateway/)
- [모델 복제본](/wiki/model-replica/)
- [모델 서빙](/wiki/model-serving/)
- [다중 모델 서빙](/wiki/multi-model-serving/)
- [다항 표본추출](/wiki/multinomial-sampling/)
- [NPU 추론](/wiki/npu-inference/)
- [온라인 추론](/wiki/online-inference/)
- [ONNX Runtime](/wiki/onnx-runtime/)
- [연산자 융합](/wiki/operator-fusion/)
- [페이지드 KV 캐시](/wiki/paged-kv-cache/)
- [학습 후 양자화](/wiki/post-training-quantization/)
- [프리필 단계](/wiki/prefill-phase/)
- [프리픽스 캐싱](/wiki/prefix-caching/)
- [존재 페널티](/wiki/presence-penalty/)
- [프롬프트 조회 디코딩](/wiki/prompt-lookup-decoding/)
- [반복 페널티](/wiki/repetition-penalty/)
- [요청 대기열](/wiki/request-queue/)
- [요청 스케줄러](/wiki/request-scheduler/)
- [루프라인 모델](/wiki/roofline-model/)
- [서버리스 추론](/wiki/serverless-inference/)
- [서비스 수준 목표](/wiki/service-level-objective/)
- [소규모 언어 모델](/wiki/small-language-model/)
- [추측 디코딩](/wiki/speculative-decoding/)
- [정적 배칭](/wiki/static-batching/)
- [중지 시퀀스](/wiki/stop-sequence/)
- [스트리밍 생성](/wiki/streaming-generation/)
- [꼬리 지연 시간](/wiki/tail-latency/)
- [생성 온도](/wiki/temperature/)
- [TensorRT-LLM](/wiki/tensorrt-llm/)
- [첫 토큰 시간](/wiki/time-to-first-token/)
- [토큰 비용](/wiki/token-cost/)
- [토큰 샘플링](/wiki/token-sampling/)
- [TPU 추론](/wiki/tpu-inference/)
- [전형성 샘플링](/wiki/typical-sampling/)
- [웜 스타트](/wiki/warm-start/)
- [가중치 전용 양자화](/wiki/weight-only-quantization/)
- [XLA 컴파일러](/wiki/xla-compiler/)

## 이 문서를 포함하는 코스

[AI API 개발](/course/api-development/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) — paper
<span id="reference-2"></span>2. [Machine learning: model assessments — Wikipedia](https://en.wikipedia.org/wiki/Machine_learning#Model_assessments) — encyclopedia
<span id="reference-3"></span>3. [vLLM documentation](https://docs.vllm.ai/en/stable/) — documentation

## 코스에서 계속 읽기

- **AI API 개발:** [다음 문서 — 지연 시간](/wiki/latency/)

---
title: "트랜스포머 Transformer"
description: "어텐션을 중심으로 시퀀스의 관계를 병렬 계산하는 신경망 아키텍처다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">어텐션을 중심으로 시퀀스의 관계를 병렬 계산하는 신경망 아키텍처다.</p>

<div class="wiki-document-meta">분류: [트랜스포머와 모델 구조](/category/transformer/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-12</div>

## 개요와 핵심 정의

어텐션을 중심으로 시퀀스의 관계를 병렬 계산하는 신경망 아키텍처다.

‘트랜스포머’ 개념은 트랜스포머와 모델 구조 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 트랜스포머 분야는 어텐션으로 시퀀스 위치 사이 정보를 결합하는 현대 모델 구조를 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 배경과 설명 범위

영문 Wikipedia의 ‘Transformer (deep learning)’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 작동 원리

트랜스포머는 토큰 임베딩에 위치 정보를 더하고, 멀티헤드 어텐션과 피드포워드 층을 잔차 연결·정규화와 함께 반복한다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘트랜스포머’ 개념만 독립적으로 동작하지 않는다. [어텐션](/wiki/attention/), [셀프 어텐션](/wiki/self-attention/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용 분야와 선택 기준

언어 모델의 문맥 처리, 번역, 멀티모달 융합과 긴 시퀀스 최적화에 사용한다. ‘트랜스포머’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 한계와 흔한 오해

순환 구조 없이 병렬 학습이 가능하지만 기본 어텐션 비용이 길이의 제곱으로 늘고 위치 표현과 마스크 설계에 민감하다.

구조 이름만으로 성능을 설명하지 말고 마스크·위치 정보·연산 비용을 확인한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [어텐션](/wiki/attention/): 현재 표현을 만들 때 입력의 각 부분에 서로 다른 중요도를 부여해 정보를 결합하는 연산이다.
- [셀프 어텐션](/wiki/self-attention/): 하나의 시퀀스 안에서 각 위치가 다른 위치의 정보를 참조하는 어텐션이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 구체적 적용 예시

짧은 토큰 열을 예로 들어 각 위치가 참조할 수 있는 범위와 어텐션 마스크를 표로 그리면 구조 차이가 선명해진다. ‘트랜스포머’를 적용하는 경우에는 트랜스포머는 토큰 임베딩에 위치 정보를 더하고, 멀티헤드 어텐션과 피드포워드 층을 잔차 연결·정규화와 함께 반복한다.

시퀀스 길이를 늘리며 정확도뿐 아니라 메모리와 지연 시간도 측정하고, 위치 정보와 캐시 정책을 실험 조건에 포함한다. 이때 [어텐션](/wiki/attention/), [셀프 어텐션](/wiki/self-attention/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘트랜스포머’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 언어 모델의 문맥 처리, 번역, 멀티모달 융합과 긴 시퀀스 최적화에 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 순환 구조 없이 병렬 학습이 가능하지만 기본 어텐션 비용이 길이의 제곱으로 늘고 위치 표현과 마스크 설계에 민감하다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘트랜스포머’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

_해당 문서가 없습니다._

## 관련 문서

- [어텐션](/wiki/attention/)
- [셀프 어텐션](/wiki/self-attention/)

## 이 문서를 가리키는 문서

- [절대 위치 인코딩](/wiki/absolute-position-encoding/)
- [적응형 계산 시간 트랜스포머](/wiki/adaptive-computation-time-transformer/)
- [가산 어텐션](/wiki/additive-attention/)
- [ALiBi 위치 편향](/wiki/alibi-position-bias/)
- [어텐션](/wiki/attention/)
- [어텐션 계산 복잡도](/wiki/attention-complexity/)
- [어텐션 헤드](/wiki/attention-head/)
- [어텐션 마스크](/wiki/attention-mask/)
- [어텐션 행렬](/wiki/attention-matrix/)
- [어텐션 점수](/wiki/attention-score/)
- [어텐션 싱크](/wiki/attention-sink/)
- [BART 아키텍처](/wiki/bart-architecture/)
- [BERT 아키텍처](/wiki/bert-architecture/)
- [양방향 어텐션](/wiki/bidirectional-attention/)
- [BigBird](/wiki/bigbird/)
- [블록 희소 어텐션](/wiki/block-sparse-attention/)
- [청크 어텐션](/wiki/chunked-attention/)
- [Conformer 아키텍처](/wiki/conformer-architecture/)
- [문맥 길이 확장](/wiki/context-length-extension/)
- [닷프로덕트 어텐션](/wiki/dot-product-attention/)
- [조기 종료 트랜스포머](/wiki/early-exit-transformer/)
- [인코더-디코더 어텐션](/wiki/encoder-decoder-attention/)
- [인코더 전용 트랜스포머](/wiki/encoder-only-transformer/)
- [플래시 어텐션](/wiki/flash-attention/)
- [융합 트랜스포머 커널](/wiki/fused-transformer-kernel/)
- [GEGLU](/wiki/geglu/)
- [글로벌 어텐션](/wiki/global-attention/)
- [GPT 아키텍처](/wiki/gpt-architecture/)
- [그래프 트랜스포머](/wiki/graph-transformer/)
- [그룹 쿼리 어텐션](/wiki/grouped-query-attention/)
- [어텐션 헤드 가지치기](/wiki/head-pruning/)
- [계층형 트랜스포머](/wiki/hierarchical-transformer/)
- [커널화 어텐션](/wiki/kernelized-attention/)
- [키·값 압축](/wiki/key-value-compression/)
- [키·값 투영](/wiki/key-value-projection/)
- [언어 모델링 헤드](/wiki/language-modeling-head/)
- [레이어 드로핑](/wiki/layer-dropping/)
- [학습형 위치 임베딩](/wiki/learned-position-embedding/)
- [길이 외삽](/wiki/length-extrapolation/)
- [선형 어텐션](/wiki/linear-attention/)
- [로컬 어텐션](/wiki/local-attention/)
- [장문맥 트랜스포머](/wiki/long-context-transformer/)
- [Longformer](/wiki/longformer/)
- [저랭크 어텐션](/wiki/low-rank-attention/)
- [메모리 증강 트랜스포머](/wiki/memory-augmented-transformer/)
- [메모리 효율적 어텐션](/wiki/memory-efficient-attention/)
- [멀티쿼리 어텐션](/wiki/multi-query-attention/)
- [정규화 배치](/wiki/normalization-placement/)
- [NTK 인식 스케일링](/wiki/ntk-aware-scaling/)
- [출력 투영](/wiki/output-projection/)
- [패딩 마스크](/wiki/padding-mask/)
- [페이지드 어텐션](/wiki/paged-attention/)
- [Performer](/wiki/performer/)
- [위치 ID](/wiki/position-id/)
- [위치 보간](/wiki/position-interpolation/)
- [포스트 정규화](/wiki/post-normalization/)
- [프리 정규화](/wiki/pre-normalization/)
- [프리픽스 언어 모델](/wiki/prefix-language-model/)
- [순환 메모리 트랜스포머](/wiki/recurrent-memory-transformer/)
- [Reformer](/wiki/reformer/)
- [상대 위치 인코딩](/wiki/relative-position-encoding/)
- [검색 결합 트랜스포머](/wiki/retrieval-transformer/)
- [RMS 정규화](/wiki/rms-normalization/)
- [회전 위치 임베딩](/wiki/rotary-position-embedding/)
- [스케일드 닷프로덕트 어텐션](/wiki/scaled-dot-product-attention/)
- [세그먼트 임베딩](/wiki/segment-embedding/)
- [시퀀스-투-시퀀스 트랜스포머](/wiki/sequence-to-sequence-transformer/)
- [사인파 위치 인코딩](/wiki/sinusoidal-position-encoding/)
- [슬라이딩 윈도 어텐션](/wiki/sliding-window-attention/)
- [희소 어텐션](/wiki/sparse-attention/)
- [추측형 트랜스포머 블록](/wiki/speculative-transformer-block/)
- [SwiGLU](/wiki/swiglu/)
- [스위치 트랜스포머](/wiki/switch-transformer/)
- [T5 아키텍처](/wiki/t5-architecture/)
- [토큰 임베딩층](/wiki/token-embedding-layer/)
- [트랜스포머 블록](/wiki/transformer-block/)
- [Transformer-XL](/wiki/transformer-xl/)
- [유니버설 트랜스포머](/wiki/universal-transformer/)
- [비전 트랜스포머](/wiki/vision-transformer/)
- [XLNet 아키텍처](/wiki/xlnet-architecture/)
- [YaRN 스케일링](/wiki/yarn-scaling/)

## 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — paper
<span id="reference-2"></span>2. [Transformer (deep learning) — Wikipedia](https://en.wikipedia.org/wiki/Transformer_%28deep_learning%29) — encyclopedia
<span id="reference-3"></span>3. [Transformers documentation](https://huggingface.co/docs/transformers/index) — documentation

## 코스에서 계속 읽기

- **LLM 내부 구조:** [다음 문서 — 어텐션](/wiki/attention/)

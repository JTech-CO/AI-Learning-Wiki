---
title: "프롬프트 Prompt"
description: "모델에 과제·문맥·제약·출력 형식을 전달하는 입력이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">모델에 과제·문맥·제약·출력 형식을 전달하는 입력이다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

모델에 과제·문맥·제약·출력 형식을 전달하는 입력이다.

‘프롬프트’ 개념은 LLM과 토큰 처리 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. LLM 분야는 문자열이 토큰으로 바뀌고 문맥에서 다음 토큰 분포가 생성되는 전 과정을 다룬다.

**W9 개념 모델 확장**

모델에 과제·문맥·제약·출력 형식을 전달하는 입력이다. 이 정의를 암기하는 데서 멈추지 않고 프롬프트가 전제하는 입력, 내부 표현, 변환 규칙과 관찰 가능한 출력을 각각 적는다. 상위 개념과 하위 구현을 분리하고, 정의가 성립하는 정상 사례와 성립하지 않는 반례를 한 쌍으로 구성한다. 용어가 여러 분야에서 쓰이면 공통 의미와 분야별 의미를 표로 나눠 같은 단어를 다른 계산 절차에 잘못 적용하지 않게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

영문 Wikipedia의 ‘Prompt’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a></div>

## 작동 원리

프롬프트는 모델에 제공되는 지시, 문맥, 예시, 데이터, 출력 제약의 묶음으로 모델의 조건부 생성을 유도한다.

[바이트 페어 인코딩](/wiki/byte-pair-encoding/) 및 [컨텍스트 윈도우](/wiki/context-window/) 개념을 먼저 이해하면 계산 위치와 역할을 구분하기 쉽다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

**W9 심층 검토 — 프롬프트**

프롬프트는 토큰화된 입력, 문맥 구성, 확률적 생성과 모델 규모 사이의 관계에서 해석해야 한다. 표면적으로 같은 용어도 모델 학습 단계, 추론 API와 사용자 인터페이스에서 가리키는 범위가 다를 수 있다. 모델 버전과 토크나이저, 문맥 길이, 샘플링 설정을 함께 기록해야 결과를 재현할 수 있다. 이 설명을 기존 정의와 연결해 입력, 처리, 출력, 평가와 실패 조건을 다시 확인한다. 출처마다 표제어의 범위가 다를 수 있으므로 공통된 정의와 구현별 차이를 구분하고, 수치·버전·정책처럼 변할 수 있는 내용은 기준 날짜와 원문 위치를 남긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘프롬프트’ 개념만 독립적으로 동작하지 않는다. [컨텍스트 윈도우](/wiki/context-window/), [컴플리션](/wiki/completion/), [다음 토큰 예측](/wiki/next-token-prediction/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

**W9 구현·측정 설계**

프롬프트의 구현을 비교할 때는 입력 스키마와 자료형, 중간 산출물, 기본값, 오류 처리, 버전과 실행 환경을 고정한다. 결과 품질은 하나의 평균값으로 끝내지 않고 하위 집단과 경계 사례, 지연시간, 메모리와 비용을 함께 기록한다. 작은 기준 사례를 손으로 계산하거나 독립 구현과 대조해 인터페이스가 맞지만 의미가 다른 오류를 찾는다. 구성 변경 전후에는 같은 데이터와 평가 코드를 사용하고 차이가 생긴 최초 단계를 추적한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용 분야와 선택 기준

프롬프트 설계, 문맥 길이, 생성 제어, 비용 계산과 출력 검증의 기초가 된다. ‘프롬프트’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 한계와 흔한 오해

문구만 바꿔 사실성을 보장할 수 없으며 필요한 지식·도구·검증 절차를 애플리케이션 수준에서 제공한다.

언어적 그럴듯함과 사실성·추론 능력·기억을 구분해야 한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

**W9 반례·경계 사례**

프롬프트가 잘 작동하는 조건만 나열하면 실제 적용 범위를 판단할 수 없다. 데이터가 부족하거나 분포가 달라지는 경우, 값의 단위와 차원이 맞지 않는 경우, 권한·네트워크·자원이 제한되는 경우와 의도적으로 조작된 입력을 별도 시험한다. 실패가 탐지되지 않은 채 정상 출력처럼 보이는 경우를 우선 찾아 경고 지표와 중단선을 정한다. 알려진 한계를 우회하는 임시 조치와 근본적인 개선을 구분하고 잔여 위험의 책임자를 명시한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 관련 개념과의 구분

- [컨텍스트 윈도우](/wiki/context-window/): 모델이 한 번의 요청에서 참조할 수 있는 토큰 범위다.
- [컴플리션](/wiki/completion/): 프롬프트와 이전 토큰을 조건으로 모델이 생성한 후속 토큰 시퀀스다.
- [다음 토큰 예측](/wiki/next-token-prediction/): 이전 토큰들이 주어졌을 때 다음 토큰의 확률 분포를 예측하는 학습 목표다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적 적용 예시

같은 입력을 여러 번 생성해 토큰 수, 종료 이유, 근거 일치, 형식 준수 여부를 기록하면 생성 규칙의 영향을 분리할 수 있다. ‘프롬프트’를 적용하는 경우에는 프롬프트는 모델에 제공되는 지시, 문맥, 예시, 데이터, 출력 제약의 묶음으로 모델의 조건부 생성을 유도한다.

프롬프트 문구만 바꾸는 실험과 모델·검색·샘플링 설정을 바꾸는 실험을 섞지 않아야 원인을 설명할 수 있다. 이때 [컨텍스트 윈도우](/wiki/context-window/), [컴플리션](/wiki/completion/), [다음 토큰 예측](/wiki/next-token-prediction/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘프롬프트’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** [바이트 페어 인코딩](/wiki/byte-pair-encoding/), [컨텍스트 윈도우](/wiki/context-window/)의 정의와 입력 조건을 먼저 확인한다.
3. **기준선 설정:** 프롬프트 설계, 문맥 길이, 생성 제어, 비용 계산과 출력 검증의 기초가 된다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 문구만 바꿔 사실성을 보장할 수 없으며 필요한 지식·도구·검증 절차를 애플리케이션 수준에서 제공한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘프롬프트’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

**W9 출처·재현 점검**

- 프롬프트의 정의를 외부 백과와 대조하되 핵심 작동 주장은 논문·표준·공식 문서에서 확인한다.
- 데이터, 모델, 코드와 도구 버전을 고정하고 정상·경계·실패 사례를 같은 조건에서 반복한다.
- 알려진 한계와 잔여 위험, 사람이 검토해야 하는 조건, 다음 검토 날짜를 기록한다.

**W9 검증 기록 설계**

1. 프롬프트를 선택한 이유와 제외한 대안을 같은 평가 기준으로 적는다.
2. 데이터 기준 시점, 표본 구성, 전처리와 접근 권한을 고정한다.
3. 정상·경계·실패 사례의 입력과 기대 결과를 배포 전에 승인한다.
4. 품질, 안전, 지연시간과 비용에 경고선과 중단선을 따로 둔다.
5. 모델·코드·도구가 바뀐 뒤 동일 평가를 반복하고 최초 차이 지점을 찾는다.
6. 자동화가 확신하지 못하거나 영향이 큰 경우 사람이 판단할 수 있도록 입력, 근거와 가능한 대안을 함께 제공한다.

최종 기록에는 출처의 기준 날짜와 위치, 실행 환경, 결과 해석, 알려진 한계, 롤백 대상과 다음 검토 날짜를 포함한다. 개선 폭이 운영 복잡성과 잔여 위험을 상쇄하지 못하면 단순한 기준선으로 되돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- [바이트 페어 인코딩](/wiki/byte-pair-encoding/), [컨텍스트 윈도우](/wiki/context-window/)와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

- [바이트 페어 인코딩](/wiki/byte-pair-encoding/)
- [컨텍스트 윈도우](/wiki/context-window/)

## 관련 문서

- [컨텍스트 윈도우](/wiki/context-window/)
- [컴플리션](/wiki/completion/)
- [다음 토큰 예측](/wiki/next-token-prediction/)

## 이 문서를 가리키는 문서

- [자동 프롬프트 최적화](/wiki/automatic-prompt-optimization/)
- [자기회귀 언어 모델](/wiki/autoregressive-language-model/)
- [시작·종료 토큰](/wiki/beginning-end-token/)
- [바이트 단위 토큰화](/wiki/byte-level-tokenization/)
- [바이트 페어 인코딩](/wiki/byte-pair-encoding/)
- [인과 언어 모델](/wiki/causal-language-model/)
- [사고 과정 프롬프팅](/wiki/chain-of-thought-prompting/)
- [문자 단위 토큰화](/wiki/character-tokenization/)
- [코드 생성](/wiki/code-generation/)
- [코드 언어 모델](/wiki/code-language-model/)
- [컴플리션](/wiki/completion/)
- [계산 최적 학습](/wiki/compute-optimal-training/)
- [조건부 언어 모델](/wiki/conditional-language-model/)
- [문맥 예산](/wiki/context-budget/)
- [컨텍스트 캐싱](/wiki/context-caching/)
- [문맥 오염](/wiki/context-contamination/)
- [컨텍스트 엔지니어링](/wiki/context-engineering/)
- [문맥 길이](/wiki/context-length/)
- [문맥 절단](/wiki/context-truncation/)
- [문맥 활용률](/wiki/context-utilization/)
- [컨텍스트 윈도우](/wiki/context-window/)
- [대화 문맥](/wiki/conversation-context/)
- [시범 예시](/wiki/demonstration-example/)
- [밀집 언어 모델](/wiki/dense-language-model/)
- [창발적 능력](/wiki/emergent-ability/)
- [전문가 용량 계수](/wiki/expert-capacity-factor/)
- [전문가 라우팅](/wiki/expert-routing/)
- [언어 모델 외부 메모리](/wiki/external-language-model-memory/)
- [퓨샷 프롬프팅](/wiki/few-shot-prompting/)
- [문맥 내 학습](/wiki/in-context-learning/)
- [추론 계산량](/wiki/inference-compute/)
- [지시문](/wiki/instruction/)
- [지시 이행](/wiki/instruction-following/)
- [중간 정보 손실 현상](/wiki/lost-in-the-middle/)
- [마스크 언어 모델](/wiki/masked-language-model/)
- [메모리 토큰](/wiki/memory-token/)
- [모델 크기](/wiki/model-size/)
- [다국어 능력](/wiki/multilingual-capability/)
- [다국어 언어 모델](/wiki/multilingual-language-model/)
- [멀티모달 언어 모델](/wiki/multimodal-language-model/)
- [N-그램 언어 모델](/wiki/n-gram-language-model/)
- [신경 언어 모델](/wiki/neural-language-model/)
- [신경망 스케일링 법칙](/wiki/neural-scaling-law/)
- [미등록 토큰](/wiki/out-of-vocabulary-token/)
- [출력 제약](/wiki/output-constraint/)
- [패딩 토큰](/wiki/padding-token/)
- [파라미터 수](/wiki/parameter-count/)
- [프롬프트 캐싱](/wiki/prompt-caching/)
- [프롬프트 체이닝](/wiki/prompt-chaining/)
- [프롬프트 압축](/wiki/prompt-compression/)
- [프롬프트 구분자](/wiki/prompt-delimiter/)
- [프롬프트 엔지니어링](/wiki/prompt-engineering/)
- [프롬프트 인젝션](/wiki/prompt-injection/)
- [프롬프트 민감도](/wiki/prompt-sensitivity/)
- [프롬프트 템플릿](/wiki/prompt-template/)
- [추론 능력](/wiki/reasoning-capability/)
- [순환형 언어 모델 메모리](/wiki/recurrent-language-model-memory/)
- [검색 결합 프롬프트](/wiki/retrieval-prompt/)
- [역할 프롬프팅](/wiki/role-prompting/)
- [스케일링 효율](/wiki/scaling-efficiency/)
- [자기일관성 디코딩](/wiki/self-consistency-decoding/)
- [SentencePiece](/wiki/sentencepiece/)
- [시퀀스 우도](/wiki/sequence-likelihood/)
- [슬라이딩 컨텍스트 윈도우](/wiki/sliding-context-window/)
- [희소 언어 모델](/wiki/sparse-language-model/)
- [특수 토큰](/wiki/special-token/)
- [조향 가능성](/wiki/steerability/)
- [서브워드 토큰](/wiki/subword-token/)
- [시스템 프롬프트](/wiki/system-prompt/)
- [학습 계산량](/wiki/training-compute/)
- [유니그램 언어 모델 토크나이저](/wiki/unigram-language-model-tokenizer/)
- [사용자 프롬프트](/wiki/user-prompt/)
- [WordPiece](/wiki/wordpiece/)
- [제로샷 프롬프팅](/wiki/zero-shot-prompting/)

## 이 문서를 포함하는 코스

[AI 기초](/course/ai-foundations/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) — paper
<span id="reference-2"></span>2. [Prompt — Wikipedia](https://en.wikipedia.org/wiki/Prompt) — encyclopedia
<span id="reference-3"></span>3. [Transformers Documentation](https://huggingface.co/docs/transformers/index) — documentation
<span id="reference-4"></span>4. [Tokenizers Documentation](https://huggingface.co/docs/tokenizers/index) — documentation
<span id="reference-5"></span>5. [Machine Learning Glossary](https://developers.google.com/machine-learning/glossary) — documentation

## 코스에서 계속 읽기

- **AI 기초:** [다음 문서 — 환각](/wiki/hallucination/)

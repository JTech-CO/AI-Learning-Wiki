---
title: "토큰화 Tokenization"
description: "문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-lead">문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다.

‘토큰화’ 개념은 LLM과 토큰 처리 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. LLM 분야는 문자열이 토큰으로 바뀌고 문맥에서 다음 토큰 분포가 생성되는 전 과정을 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 배경과 설명 범위

영문 Wikipedia의 ‘Lexical analysis’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a></div>

### 작동 원리

토큰화는 정규화된 문자열을 어휘의 토큰 ID 시퀀스로 바꾸고 필요하면 다시 문자열로 복원하는 과정이다.

[토큰](/wiki/token/)과 [어휘 집합](/wiki/vocabulary/) 개념을 먼저 이해하면 분할 규칙과 ID 매핑을 구분하기 쉽다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구성 요소와 처리 흐름

실제 시스템에서는 ‘토큰화’ 개념만 독립적으로 동작하지 않는다. [토큰](/wiki/token/), [토크나이저](/wiki/tokenizer/), [어휘 집합](/wiki/vocabulary/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

프롬프트 설계, 문맥 길이, 생성 제어, 비용 계산과 출력 검증의 기초가 된다. ‘토큰화’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 한계와 흔한 오해

공백·유니코드·특수 토큰 처리 차이가 모델 입력과 보안 필터, 길이 계산에 영향을 준다.

언어적 그럴듯함과 사실성·추론 능력·기억을 구분해야 한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 관련 개념과의 구분

- [토큰](/wiki/token/): 언어 모델이 텍스트를 처리하기 위해 나눈 기본 기호 단위다.
- [토크나이저](/wiki/tokenizer/): 텍스트와 토큰 ID 사이의 분할·변환 규칙을 구현한 구성 요소다.
- [어휘 집합](/wiki/vocabulary/): 토크나이저와 모델이 구분해 처리할 수 있는 토큰의 전체 목록이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구체적 적용 예시

같은 입력을 여러 번 생성해 토큰 수, 종료 이유, 근거 일치, 형식 준수 여부를 기록하면 생성 규칙의 영향을 분리할 수 있다. ‘토큰화’를 적용하는 경우에는 토큰화는 정규화된 문자열을 어휘의 토큰 ID 시퀀스로 바꾸고 필요하면 다시 문자열로 복원하는 과정이다.

프롬프트 문구만 바꾸는 실험과 모델·검색·샘플링 설정을 바꾸는 실험을 섞지 않아야 원인을 설명할 수 있다. 이때 [토큰](/wiki/token/), [토크나이저](/wiki/tokenizer/), [어휘 집합](/wiki/vocabulary/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 실무 적용과 검증 절차

1. **목적 정의:** ‘토큰화’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** [토큰](/wiki/token/)과 [어휘 집합](/wiki/vocabulary/)의 정의와 특수 토큰 규칙을 먼저 확인한다.
3. **기준선 설정:** 프롬프트 설계, 문맥 길이, 생성 제어, 비용 계산과 출력 검증의 기초가 된다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 공백·유니코드·특수 토큰 처리 차이가 모델 입력과 보안 필터, 길이 계산에 영향을 준다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘토큰화’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- [하이퍼파라미터](/wiki/hyperparameter/), [토큰](/wiki/token/)와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 문서 관계

### 선행 개념

- [토큰](/wiki/token/)
- [어휘 집합](/wiki/vocabulary/)

### 관련 문서

- [토큰](/wiki/token/)
- [토크나이저](/wiki/tokenizer/)
- [어휘 집합](/wiki/vocabulary/)

### 이 문서를 가리키는 문서

- [어휘 집합](/wiki/vocabulary/)
- [토크나이저](/wiki/tokenizer/)
- [토큰](/wiki/token/)
- [하이퍼파라미터](/wiki/hyperparameter/)

### 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) — paper
<span id="reference-2"></span>2. [Lexical analysis — Wikipedia](https://en.wikipedia.org/wiki/Lexical_analysis) — encyclopedia
<span id="reference-3"></span>3. [Hugging Face Tokenizers Documentation](https://huggingface.co/docs/tokenizers/index) — documentation

### 코스에서 계속 읽기

- **LLM 내부 구조:** [다음 문서 — 어휘 집합](/wiki/vocabulary/)

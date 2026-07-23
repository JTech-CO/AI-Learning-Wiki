---
title: "소규모 언어 모델 Small Language Model"
description: "대규모 언어 모델보다 파라미터·메모리·연산 요구량을 줄여 제한된 환경에서 운용하도록 설계한 언어 모델이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">SLM</p>

<p class="wiki-lead">대규모 언어 모델보다 파라미터·메모리·연산 요구량을 줄여 제한된 환경에서 운용하도록 설계한 언어 모델이다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

대규모 언어 모델보다 파라미터·메모리·연산 요구량을 줄여 제한된 환경에서 운용하도록 설계한 언어 모델이다.

소규모라는 경계는 고정된 숫자가 아니라 같은 시점의 대형 모델과 배포 제약을 기준으로 정해진다. 핵심은 모델 크기 자체보다 목표 과제에서 필요한 품질을 유지하면서 비용·지연·장치 요구량을 줄이는 데 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

텍스트 언어 모델의 크기, 학습 데이터 품질, 증류·양자화, 온디바이스 배포를 다룬다. 작은 멀티모달 모델이나 단순 분류기는 인접 개념이지만 이 문서의 중심은 언어 생성과 이해다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

SLM도 토큰 시퀀스의 조건부 확률을 학습하지만 층 수, 은닉 차원, 파라미터 수를 줄이거나 효율적인 데이터와 학습 방법을 사용한다. 배포 단계에서는 양자화와 런타임 최적화로 메모리와 지연을 더 줄일 수 있다.

[언어 모델](/wiki/language-model/) 및 [파라미터](/wiki/parameter/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

토크나이저, 언어 모델 본체, 추론 런타임, 선택적 검색·도구 계층으로 구성된다. 모델 크기, 문맥 길이, 정밀도, 최대 메모리, 장치별 처리량을 하나의 배포 프로파일로 기록해야 한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

모바일·엣지 장치, 오프라인 처리, 짧은 분류·추출, 대량 요청 라우팅, 개인정보를 장치 밖으로 보내기 어려운 환경에 적합하다. 복잡한 추론은 대형 모델로 승격하는 계층형 구성을 사용할 수 있다.

과제별 평가셋에서 필요한 품질을 먼저 정하고 가장 작은 모델부터 비교한다. 파라미터 수만 보지 말고 토크나이저, 컨텍스트 캐시, 런타임과 하드웨어를 포함한 실제 메모리·지연을 측정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

일반 지식 범위와 복잡한 지시 수행 능력이 제한될 수 있으며 작은 모델도 학습 데이터의 편향과 환각을 가진다. 특정 벤치마크의 높은 점수가 모든 언어와 장치에서 같은 성능을 뜻하지 않는다.

장치 내 실행은 네트워크 전송을 줄이지만 로컬 파일·센서·권한 접근이라는 별도 위험을 만든다. 모델 파일의 출처, 라이선스, 업데이트와 안전 회귀를 관리해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [대규모 언어 모델](/wiki/large-language-model/): 대규모 언어 모델은 보통 더 큰 용량과 범용성을 목표로 하며 SLM은 제한된 자원과 과제 효율을 우선한다.
- [양자화](/wiki/quantization/): 양자화는 수치 정밀도를 낮추는 경량화 기법으로 큰 모델에도 적용되며 SLM과 동일한 개념은 아니다.
- [추론](/wiki/inference/): 추론은 학습된 모델을 실행하는 과정이고 SLM은 그 과정의 자원 요구를 낮추기 위한 모델 선택지다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적 적용 예시

고객 문의 분류에서는 작은 모델이 문의 유형과 긴급도를 장치나 사내 서버에서 판정하고, 확신이 낮거나 복잡한 요청만 대형 모델로 보낼 수 있다. 같은 평가셋에서 정확도, 95백분위 지연, 메모리, 승격률을 함께 측정한다. 비용 절감이 오분류 비용보다 큰지 운영 자료로 확인한다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 소규모 언어 모델 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 소규모 언어 모델이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 대형 기준 모델과의 품질 차이, 장치별 지연·메모리, 긴 입력과 여러 언어의 실패, 양자화 전후 회귀를 검증한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

#### 운영 기록 템플릿

- **선택 근거:** 소규모 언어 모델을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [large-language-model](/wiki/large-language-model/), [quantization](/wiki/quantization/), [inference](/wiki/inference/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 소규모 언어 모델의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 학습 체크

- 소규모 언어 모델의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [대규모 언어 모델](/wiki/large-language-model/)와 [양자화](/wiki/quantization/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 문서 관계

### 선행 개념

- [언어 모델](/wiki/language-model/)
- [파라미터](/wiki/parameter/)

### 관련 문서

- [대규모 언어 모델](/wiki/large-language-model/)
- [양자화](/wiki/quantization/)
- [추론](/wiki/inference/)

### 이 문서를 가리키는 문서

- [대규모 언어 모델](/wiki/large-language-model/)
- [언어 모델](/wiki/language-model/)
- [파라미터](/wiki/parameter/)
- [하이퍼파라미터](/wiki/hyperparameter/)

### 이 문서를 포함하는 코스

_포함된 코스가 없다._

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Phi-3 Technical Report](https://arxiv.org/abs/2404.14219) — paper
2. <span id="reference-2"></span>[Microsoft Research: Phi-3 Technical Report](https://www.microsoft.com/en-us/research/publication/phi-3-technical-report-a-highly-capable-language-model-locally-on-your-phone/) — documentation
3. <span id="reference-3"></span>[Small language model — Wikipedia](https://en.wikipedia.org/wiki/Small_language_model) — encyclopedia

### 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없다._

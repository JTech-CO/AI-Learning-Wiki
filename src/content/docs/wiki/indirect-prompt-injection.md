---
title: "간접 프롬프트 인젝션 Indirect Prompt Injection"
description: "모델이 읽는 웹·문서·메일·도구 결과 같은 외부 데이터에 악성 지시를 숨겨 애플리케이션의 행동을 바꾸려는 공격이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">간접 지시문 주입</p>

<p class="wiki-lead">모델이 읽는 웹·문서·메일·도구 결과 같은 외부 데이터에 악성 지시를 숨겨 애플리케이션의 행동을 바꾸려는 공격이다.</p>

<div class="wiki-document-meta">분류: [안전·보안·윤리](/category/safety/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

모델이 읽는 웹·문서·메일·도구 결과 같은 외부 데이터에 악성 지시를 숨겨 애플리케이션의 행동을 바꾸려는 공격이다.

직접 공격이 사용자의 입력으로 지시를 보내는 것과 달리 간접 공격은 신뢰되지 않은 자료가 정상 업무 데이터처럼 처리될 때 발생한다. 검색·RAG·브라우징·도구 사용 에이전트는 데이터와 명령의 경계가 흐려져 특히 영향을 받는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

공격 경로, 가능한 영향, 시스템 수준 방어를 다룬다. 방어를 우회하는 구체적 공격 문구는 제공하지 않고 위협 모델과 검증 절차에 초점을 둔다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

공격자는 모델이 나중에 검색하거나 읽을 위치에 지시를 삽입한다. 애플리케이션이 그 내용을 상위 지시와 충분히 분리하지 않으면 모델이 데이터 속 문장을 명령으로 해석해 정보 노출, 잘못된 도구 호출, 결과 조작을 일으킬 수 있다.

[프롬프트 인젝션](/wiki/prompt-injection/) 및 [도구 호출](/wiki/tool-calling/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

공격 원천, 수집·검색 계층, 모델 문맥, 도구 권한, 최종 출력이 공격 경로를 이룬다. 위험은 모델이 지시를 따르는 가능성과 실행 가능한 권한·민감 데이터의 범위를 함께 고려해야 한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

웹 요약, 메일 보조, 문서 RAG, 코드 저장소 분석, 브라우저 에이전트의 보안 검토에 적용한다. 외부 콘텐츠는 출처와 상관없이 기본적으로 신뢰되지 않은 데이터로 취급한다.

단일 필터에 의존하지 않고 지시와 데이터 분리, 최소 권한, 도구 인자 검증, 민감 작업의 사람 승인, 출력 검사를 조합한다. 필요한 콘텐츠만 최소한으로 문맥에 넣어 공격 표면을 줄인다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

자연어의 의미를 완벽히 분리하는 탐지기는 없으며 난독화·다국어·이미지 속 텍스트가 필터를 우회할 수 있다. RAG나 미세조정 자체는 이 문제를 제거하지 않는다.

모델이 침해돼도 피해 범위를 제한하도록 읽기와 쓰기 권한을 분리하고 외부 전송·삭제·구매에는 별도 정책 엔진과 승인을 둔다. 검색 원문, 모델 판단, 도구 호출과 승인 이력을 감사 가능하게 남긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [프롬프트 인젝션](/wiki/prompt-injection/): 프롬프트 인젝션은 상위 위험 범주이며 간접 공격은 제3의 데이터 원천을 통해 지시가 들어오는 형태다.
- [탈옥 공격](/wiki/jailbreak/): 탈옥은 모델의 안전 규칙 자체를 우회하려는 시도이고 간접 인젝션은 애플리케이션이 읽는 외부 데이터 경로를 악용한다.
- [검색 증강 생성](/wiki/rag/): RAG는 외부 자료를 문맥에 넣기 때문에 검색 자료의 신뢰 경계와 출처 검증이 간접 공격 방어의 일부가 된다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적 적용 예시

메일 요약 에이전트는 메일 본문의 문장을 업무 데이터로만 다루고 본문에 포함된 새 지시를 실행하지 않아야 한다. 요약 모델에는 메일 전송 권한을 주지 않고 전송은 별도 정책 검사와 사용자 확인 뒤 수행한다. 보안 시험에서는 정상 메일과 악성 지시가 포함된 메일을 함께 넣어 정보 노출과 도구 호출 여부를 확인한다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 간접 프롬프트 인젝션 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 간접 프롬프트 인젝션이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 웹·문서·메일·도구 출력별 공격 표본으로 권한 상승, 데이터 외부 전송, 지시 우선순위 혼동과 감사 로그 누락을 반복 시험한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

#### 운영 기록 템플릿

- **선택 근거:** 간접 프롬프트 인젝션을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [jailbreak](/wiki/jailbreak/), [rag](/wiki/rag/), [human-in-the-loop](/wiki/human-in-the-loop/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 간접 프롬프트 인젝션의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 학습 체크

- 간접 프롬프트 인젝션의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [탈옥 공격](/wiki/jailbreak/)와 [검색 증강 생성](/wiki/rag/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 문서 관계

### 선행 개념

- [프롬프트 인젝션](/wiki/prompt-injection/)
- [도구 호출](/wiki/tool-calling/)

### 관련 문서

- [탈옥 공격](/wiki/jailbreak/)
- [검색 증강 생성](/wiki/rag/)
- [인간 참여형 제어](/wiki/human-in-the-loop/)

### 이 문서를 가리키는 문서

_해당 문서가 없다._

### 이 문서를 포함하는 코스

[AI 보안과 레드팀](/course/ai-security-redteam/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Not what you've signed up for: Indirect Prompt Injection](https://arxiv.org/abs/2302.12173) — paper
2. <span id="reference-2"></span>[OWASP LLM01: Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — documentation
3. <span id="reference-3"></span>[Prompt injection — Wikipedia](https://en.wikipedia.org/wiki/Prompt_injection) — encyclopedia

### 코스에서 계속 읽기

- **AI 보안과 레드팀:** [다음 문서 — 탈옥 공격](/wiki/jailbreak/)

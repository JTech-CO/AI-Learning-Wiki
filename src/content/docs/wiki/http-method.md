---
title: "HTTP 메서드 HTTP Method"
description: "HTTP 요청이 대상 자원에 대해 수행하려는 의미를 나타내며 안전성·멱등성·캐시 가능성 같은 프로토콜 속성을 정의하는 토큰이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">HTTP 요청 메서드 · HTTP Verb</p>

<p class="wiki-lead">HTTP 요청이 대상 자원에 대해 수행하려는 의미를 나타내며 안전성·멱등성·캐시 가능성 같은 프로토콜 속성을 정의하는 토큰이다.</p>

<div class="wiki-document-meta">분류: [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

HTTP 요청이 대상 자원에 대해 수행하려는 의미를 나타내며 안전성·멱등성·캐시 가능성 같은 프로토콜 속성을 정의하는 토큰이다.

GET은 표현 조회, POST는 자원별 처리, PUT은 대상 표현의 생성·교체, DELETE는 연관 제거를 요청한다. 메서드는 단순한 라우트 이름이 아니라 중간 캐시, 재시도, 프록시가 요청을 다루는 의미 계약이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

RFC 9110은 GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE를 정의하고 PATCH 등은 별도 표준에서 확장된다. URI가 자원을 식별하고 메서드가 의도를 표현하므로 동작을 경로 이름에만 숨기지 않는다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

안전한 메서드는 요청된 의미가 서버 상태 변경을 요구하지 않는다. 멱등 메서드는 같은 요청을 여러 번 보내도 의도된 효과가 한 번과 같다. 이는 실제 로그나 부수 효과가 전혀 없다는 뜻이 아니라 자동 재시도 판단을 위한 의미다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

요청 줄의 method, target, HTTP version과 헤더·본문이 메시지를 구성한다. API 계약에는 허용 메서드, 인증, 콘텐츠 유형, 조건부 요청, 성공·오류 상태 코드를 함께 정의해야 한다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

조회에는 GET, 완전 교체에는 PUT, 비멱등 처리에는 POST처럼 의미에 맞게 선택한다. 네트워크 실패 후 재시도 전략은 메서드 속성과 idempotency key 같은 애플리케이션 장치를 함께 고려한다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

메서드 이름만으로 서버 구현이 안전하거나 멱등적이라고 보장되지는 않는다. GET이 상태를 변경하거나 PUT이 매번 다른 부수 효과를 만들면 웹 인프라의 가정이 깨진다. 프록시와 브라우저의 지원 차이도 시험해야 한다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [http-request](/wiki/http-request/): 메서드·대상·헤더·본문을 포함하는 전체 요청 메시지다.
- [http-response](/wiki/http-response/): 요청 처리 결과를 상태 코드·헤더·본문으로 전달한다.
- [api](/wiki/api/): HTTP 외의 규약도 포함하는 소프트웨어 인터페이스의 상위 개념이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적인 적용 예시

문서 조회 GET /docs/7은 재시도 가능하게 설계하고, 결제 생성 POST /payments는 idempotency key로 중복 처리를 막는다. 통합 시험에서 같은 요청을 두 번 보내 상태와 응답을 비교한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 메서드·경로, 안전성·멱등성 의도, 인증, 본문 스키마, 상태 코드, 재시도와 캐시 정책을 기록한다.
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

- HTTP 메서드 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [HTTP 요청](/wiki/http-request/)
- [API](/wiki/api/)

### 관련 문서

- [HTTP 응답](/wiki/http-response/)
- [요청 한도](/wiki/rate-limit/)
- [구조화 출력](/wiki/structured-output/)

### 이 문서를 가리키는 문서

_해당 문서가 없습니다._

### 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — standard
<span id="reference-2"></span>2. [MDN HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods) — documentation
<span id="reference-3"></span>3. [HTTP — Wikipedia](https://en.wikipedia.org/wiki/HTTP) — encyclopedia

### 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

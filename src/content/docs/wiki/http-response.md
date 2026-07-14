---
title: "HTTP 응답 HTTP Response"
description: "서버가 HTTP 요청의 처리 결과를 상태 코드·필드·선택적 콘텐츠로 전달하는 메시지다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">응답 메시지</p>

<p class="wiki-lead">서버가 HTTP 요청의 처리 결과를 상태 코드·필드·선택적 콘텐츠로 전달하는 메시지다.</p>

<div class="wiki-document-meta">분류: [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

서버가 HTTP 요청의 처리 결과를 상태 코드·필드·선택적 콘텐츠로 전달하는 메시지다.

클라이언트는 응답의 상태 코드와 의미를 해석해 성공 처리, 재시도, 인증, 리디렉션 같은 다음 행동을 결정한다. 응답 본문만 읽고 상태와 헤더를 무시하면 오류를 성공 데이터로 처리할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

HTTP 의미론의 응답 구조와 API 클라이언트의 처리 원칙을 다룬다. HTTP/1.1의 전송 문법이나 HTTP/2·3의 프레임 형식보다 버전 공통의 의미에 초점을 둔다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

응답은 상태 코드로 요청 결과의 범주와 구체적 의미를 표시한다. 헤더 필드는 콘텐츠 유형·캐시·인증·위치·재시도 같은 메타데이터를 전달하고 콘텐츠는 요청 메서드와 상태 코드에 따라 표현이나 오류 설명을 담는다.

[HTTP 요청](/wiki/http-request/) 및 [API](/wiki/api/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

1xx는 중간 정보, 2xx는 성공, 3xx는 리디렉션, 4xx는 클라이언트 관련 오류, 5xx는 서버 관련 오류 범주다. 같은 200이라도 GET과 POST의 콘텐츠 의미가 다를 수 있고 204·304처럼 콘텐츠가 없는 응답도 있다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

REST API, 웹 페이지, 파일 전송, 모델 추론 API의 결과 전달에 사용한다. 클라이언트는 예상 상태 코드별 스키마와 오류 형식을 정의하고 알 수 없는 상태도 안전하게 처리해야 한다.

서버는 의미에 맞는 구체적 상태 코드를 선택하고 오류 본문에 기계가 읽을 수 있는 코드와 사람이 이해할 설명을 제공한다. 민감한 내부 정보나 스택 추적은 외부 응답에 포함하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

상태 코드만으로 업무 성공을 완전히 표현할 수 없으며 2xx 응답 안에서도 부분 실패가 존재할 수 있다. 프록시와 캐시는 응답을 저장·변환할 수 있으므로 캐시 지시와 콘텐츠 무결성을 고려해야 한다.

무조건적인 5xx 재시도는 중복 부작용과 부하 폭증을 만들 수 있다. 요청의 멱등성, Retry-After, 지수 백오프, 최대 시도 횟수와 취소를 함께 설계한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [HTTP 요청](/wiki/http-request/): HTTP 요청은 클라이언트의 의도와 대상을 전달하고 응답은 서버의 처리 결과를 전달한다.
- [API](/wiki/api/): API는 시스템 간 계약의 더 넓은 개념이며 HTTP 응답은 그 계약을 운반하는 메시지 형식 중 하나다.
- [요청 한도](/wiki/rate-limit/): 속도 제한은 요청량을 통제하는 정책이고 응답의 429 상태와 관련 헤더로 클라이언트에 알릴 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적 적용 예시

모델 추론 요청이 성공하면 200과 JSON 결과를 반환할 수 있다. 입력 스키마가 틀리면 400, 인증이 없으면 401, 호출량을 넘으면 429와 재시도 정보를 반환한다. 클라이언트는 각 상태에서 서로 다른 오류 스키마를 파싱하고 429나 일시적 5xx만 제한적으로 재시도한다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 HTTP 응답 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** HTTP 응답이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 정상·잘못된 입력·인증 실패·속도 제한·서버 오류에서 상태, 헤더, 콘텐츠 유형과 스키마가 계약과 일치하는지 시험한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

**운영 기록 템플릿**

- **선택 근거:** HTTP 응답을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [rate-limit](/wiki/rate-limit/), [structured-output](/wiki/structured-output/), [streaming-response](/wiki/streaming-response/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 HTTP 응답의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 학습 체크

- HTTP 응답의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [요청 한도](/wiki/rate-limit/)와 [구조화 출력](/wiki/structured-output/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 선행 개념

- [HTTP 요청](/wiki/http-request/)
- [API](/wiki/api/)

## 관련 문서

- [요청 한도](/wiki/rate-limit/)
- [구조화 출력](/wiki/structured-output/)
- [스트리밍 응답](/wiki/streaming-response/)

## 이 문서를 가리키는 문서

- [API 클라이언트](/wiki/api-client/)
- [API 지원 종료](/wiki/api-deprecation/)
- [API 엔드포인트](/wiki/api-endpoint/)
- [API 페이지네이션](/wiki/api-pagination/)
- [API 버전 관리](/wiki/api-versioning/)
- [비동기 API 작업](/wiki/asynchronous-api-job/)
- [비동기 클라이언트](/wiki/asynchronous-client/)
- [오디오 API](/wiki/audio-api/)
- [배치 API](/wiki/batch-api/)
- [채팅 API](/wiki/chat-api/)
- [클라이언트 라이브러리](/wiki/client-library/)
- [클라이언트 미들웨어](/wiki/client-middleware/)
- [컴플리션 API](/wiki/completion-api/)
- [콘텐츠 유형](/wiki/content-type/)
- [도메인 이름 시스템](/wiki/domain-name-system/)
- [임베딩 API](/wiki/embedding-api/)
- [지수 백오프](/wiki/exponential-backoff/)
- [파일 업로드 API](/wiki/file-upload-api/)
- [함수 호출](/wiki/function-calling/)
- [문법 제약 생성](/wiki/grammar-constrained-generation/)
- [HTTP 헤더](/wiki/http-header/)
- [HTTP 메시지 본문](/wiki/http-message-body/)
- [HTTP 메서드](/wiki/http-method/)
- [HTTP 상태 코드](/wiki/http-status-code/)
- [HTTPS](/wiki/https/)
- [이미지 생성 API](/wiki/image-generation-api/)
- [JSON 스키마](/wiki/json-schema/)
- [MIME 유형](/wiki/mime-type/)
- [콘텐츠 조정 API](/wiki/moderation-api/)
- [출력 파서](/wiki/output-parser/)
- [병렬 도구 호출](/wiki/parallel-tool-call/)
- [경로 매개변수](/wiki/path-parameter/)
- [질의 매개변수](/wiki/query-parameter/)
- [실시간 API](/wiki/realtime-api/)
- [요청-응답 패턴](/wiki/request-response-pattern/)
- [응답 검증](/wiki/response-validation/)
- [재시도 정책](/wiki/retry-policy/)
- [스키마 검증](/wiki/schema-validation/)
- [서버 전송 이벤트](/wiki/server-sent-events/)
- [상태 유지 API](/wiki/stateful-api/)
- [무상태 API](/wiki/stateless-api/)
- [동기 API 요청](/wiki/synchronous-api-request/)
- [동기 클라이언트](/wiki/synchronous-client/)
- [도구 인수](/wiki/tool-argument/)
- [도구 선택 제어](/wiki/tool-choice/)
- [도구 정의](/wiki/tool-definition/)
- [도구 오류](/wiki/tool-error/)
- [도구 결과](/wiki/tool-result/)
- [전송 제어 프로토콜](/wiki/transmission-control-protocol/)
- [전송 계층 보안](/wiki/transport-layer-security/)
- [형식 지정 응답](/wiki/typed-response/)
- [통합 응답 API](/wiki/unified-response-api/)
- [통합 자원 식별자](/wiki/uri/)
- [통합 자원 위치 지정자](/wiki/url/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) — standard
<span id="reference-2"></span>2. [MDN: HTTP messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages) — documentation
<span id="reference-3"></span>3. [HTTP — Wikipedia](https://en.wikipedia.org/wiki/HTTP) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

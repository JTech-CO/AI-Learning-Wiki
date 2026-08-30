---
title: "에이전트 카드 Agent Card"
description: "에이전트 카드는 A2A 서버의 정체성, 기술, 인터페이스, 프로토콜 버전과 보안 요구를 기계가 읽을 수 있게 공개하는 JSON 메타데이터 문서다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">AgentCard · A2A Agent Card</p>

<p class="wiki-lead">에이전트 카드는 A2A 서버의 정체성, 기술, 인터페이스, 프로토콜 버전과 보안 요구를 기계가 읽을 수 있게 공개하는 JSON 메타데이터 문서다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

에이전트 카드는 A2A 서버를 호출하기 전에 클라이언트가 읽는 자체 설명 문서다. 이름과 설명 같은 식별 정보뿐 아니라 supportedInterfaces의 URL·바인딩·프로토콜 버전, 기본 입출력 모드, 기능 플래그, 보안 스킴, AgentSkill 목록을 함께 제공한다. 카드는 에이전트가 무엇을 할 수 있다고 주장하는 발견 자료이며 실제 권한이나 결과 품질을 보증하는 인증서가 아니다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

클라이언트는 supportedInterfaces를 선호 순으로 평가하고 자신이 구현한 바인딩과 버전이 겹치는 항목을 고른다. skills 항목의 식별자·설명·태그·예시·입출력 모드는 후보 에이전트를 좁히는 데 쓰지만 자연어 설명만으로 자동 실행을 승인해서는 안 된다. securitySchemes와 security 요구는 OpenAPI Security Scheme과 같은 웹 보안 표현을 재사용하며 비밀 값 자체를 카드에 넣지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

공개 카드는 도메인의 `/.well-known/agent-card.json`에서 가져오거나 신뢰된 레지스트리·직접 설정으로 얻는다. HTTP 캐시의 ETag와 Cache-Control을 따르되 중요한 실행 전에는 만료와 버전을 확인한다. 공개 카드가 민감 기술을 숨긴 경우 인증 후 Get Extended Agent Card 연산으로 확장 카드를 가져오고, 두 카드의 제공자·인터페이스·서명 관계를 대조한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

공격자는 위조 도메인, 오염된 레지스트리, 캐시 포이즈닝이나 카드 설명의 프롬프트 주입으로 클라이언트를 잘못된 엔드포인트로 유도할 수 있다. HTTPS 원본, 허용된 호스트, 카드 크기·스키마, URL 스킴을 검증하고 서명이 있으면 JWS와 신뢰 키를 확인한다. 카드에 내부 호스트, 정적 토큰, 비공개 도구명처럼 공격 표면을 넓히는 정보를 싣지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

검증기는 필수 필드, 절대 HTTPS URL, 고유 skill ID, 지원 바인딩 식별자, 프로토콜 버전 형식과 보안 스킴 참조를 검사해야 한다. 카드 변경 시험에서는 기술 추가·삭제, 인터페이스 우선순위 변경, 키 교체, 구버전 캐시와 인증 확장 카드의 권한 누락을 재현한다. 발견 성공률만 보지 말고 잘못된 에이전트 선택률과 검증 거부 이유도 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

Agent Card는 에이전트 협업을 위한 A2A 메타데이터이고 OpenAPI 문서는 일반 HTTP 연산의 경로·요청·응답을 기술한다. 모델 카드는 학습 데이터와 성능·한계를 사람에게 설명하는 거버넌스 문서이며 호출 인터페이스를 협상하지 않는다. 서비스 레지스트리는 여러 카드를 수집·검색하는 저장소일 수 있지만 카드 자체의 정본성이나 실행 권한을 자동으로 만들지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 카드 해석 예시

문서 검토 에이전트의 카드가 REST 1.0과 gRPC 1.0 인터페이스, text와 application/pdf 입력, streaming 지원, `review.document` 기술과 OAuth2 보안을 선언했다고 가정한다. 브라우저 클라이언트는 gRPC를 구현하지 않았으므로 REST를 고르고, PDF 입력 모드와 요구 scope가 자신의 정책에 맞는지 확인한다. 기술 예시 문장은 사용법 힌트일 뿐 요청 스키마나 권한 근거로 사용하지 않는다. 카드가 pushNotifications를 광고하지 않았다면 장기 연결을 유지하거나 폴링하는 설계를 선택해야 한다. 인증 후 확장 카드에서 내부 문서 분류 기술을 얻더라도 현재 사용자에게 허용된 기술만 목록에 노출한다. 실제 첫 호출 전에 카드 해시와 선택 인터페이스를 실행 기록에 고정한다. 이후 카드가 바뀌면 기존 권한 결정과 협상 캐시를 폐기하고 새 카드 기준으로 다시 검증한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 게시·갱신·폐기 수명 주기

카드는 코드 배포물과 별도로 관리하되 구현 릴리스와 원자적으로 갱신되어야 한다. 새 기술이나 바인딩을 추가할 때는 먼저 적합성 시험을 통과시키고 카드 version을 올린 뒤 ETag를 교체한다. 제거 예정 기술은 폐기 날짜와 대체 기술을 사람용 문서에 알리고, 클라이언트 관측에서 사용량이 남아 있는지 확인한다. 제공자·도메인·서명 키가 바뀌면 단순 캐시 갱신이 아니라 신뢰 재등록 절차를 거친다. 장애 시 오래된 카드로 되돌리더라도 현재 엔드포인트의 실제 기능과 불일치하지 않아야 한다. 레지스트리는 마지막 검증 시각, 카드 해시, 원본 URL, 서명 검증 결과와 폐기 상태를 보존해 검색 결과가 정적 사본으로 굳는 것을 막는다. 카드 게시 파이프라인도 일반 소프트웨어 공급망처럼 변경 승인과 감사 기록을 적용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- Agent Card에서 인터페이스, 기술, 보안 요구를 찾아 호출 계획으로 변환할 수 있는가?
- 공개 카드와 인증 확장 카드에 들어갈 정보를 구분할 수 있는가?
- 카드 위조·오염·캐시 문제를 탐지할 검증 규칙을 설계할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)

### 관련 문서

- [에이전트 발견](/wiki/agent-discovery/)
- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [OpenAPI 명세](/wiki/openapi-specification/)
- [A2A 인증과 권한 위임](/wiki/a2a-authentication-delegation/)

### 이 문서를 가리키는 문서

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)
- [에이전트 발견](/wiki/agent-discovery/)
- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)
- [A2A 인증과 권한 위임](/wiki/a2a-authentication-delegation/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Agent Discovery](https://a2a-protocol.org/latest/topics/agent-discovery/) - documentation
3. <span id="reference-3"></span>[OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html) - standard
4. <span id="reference-4"></span>[RFC 8615: Well-Known Uniform Resource Identifiers](https://www.rfc-editor.org/rfc/rfc8615.html) - standard

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — 에이전트 발견](/wiki/agent-discovery/)

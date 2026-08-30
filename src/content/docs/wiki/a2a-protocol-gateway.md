---
title: "A2A 프로토콜 게이트웨이 A2A Protocol Gateway"
description: "A2A 프로토콜 게이트웨이는 에이전트 호출 경계에서 발견, 바인딩 변환, 인증, 정책, 속도 제한과 관측을 중앙 적용하되 Task 의미를 보존하는 중개 계층이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">Agent Protocol Gateway · A2A Gateway</p>

<p class="wiki-lead">A2A 프로토콜 게이트웨이는 에이전트 호출 경계에서 발견, 바인딩 변환, 인증, 정책, 속도 제한과 관측을 중앙 적용하되 Task 의미를 보존하는 중개 계층이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A 프로토콜 게이트웨이는 여러 클라이언트와 원격 에이전트 사이에 놓여 Agent Card 라우팅, 바인딩·버전 중개, 인증·권한, 할당량, 감사와 장애 격리를 적용하는 운영 구성이다. A2A 표준의 고유 객체가 아니라 표준 연산과 데이터 모델을 보존해 구현하는 API 관리 패턴이므로 제품 기능과 프로토콜 요구를 구분해 문서화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

제어면은 승인 Agent Card, 라우팅·버전·보안 정책과 폐기 정보를 관리하고 데이터면은 Message, Task 조회·취소, 스트림과 푸시 설정을 전달한다. 게이트웨이가 JSON-RPC와 REST 바인딩을 변환해도 taskId, contextId, 오류 유형, 이벤트 순서와 취소 의미가 같아야 한다. 자체 재시도·캐시는 Task 멱등성과 개인정보 정책을 침해하지 않아야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

요청은 카드·테넌트·주체 확인, 인터페이스 선택, 정책 판정, 대상 에이전트 전달, 응답·이벤트 정규화, 관측 기록 순으로 처리한다. 장기 연결은 시간 초과 예산과 백프레셔를 적용하고 연결이 끊겨도 Task 자체를 실패로 단정하지 않는다. 푸시 알림 콜백은 게이트웨이의 공개 주소와 내부 구독자를 분리해 재전달할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

게이트웨이는 강력한 통제점이면서 단일 침해 지점이다. 카드 URL과 Artifact URL의 SSRF, 토큰 로그·재사용, 테넌트 간 taskId 누출, 스트림 자원 고갈과 오류 세부 정보 노출을 막아야 한다. 종단 간 주체·대상·scope가 변환 과정에서 사라지지 않게 하고, 게이트웨이 서비스 계정으로 모든 사용자 권한을 합치지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

## 활용과 검증

### 구현과 검증

적합성 시험은 게이트웨이 경유 전후의 A2A 객체와 상태 전이를 비교한다. 각 바인딩 조합, 스트리밍 청크·취소·푸시 재전달, 버전 불일치, 부분 장애, 속도 제한, 인증 도전과 대용량 Part를 시험한다. 지표는 추가 지연, 변환 오류, 정책 거부, 재시도 증폭, 열린 스트림 수와 원격 에이전트별 회로 차단 상태다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

모델 게이트웨이는 주로 여러 추론 공급자의 요청·응답을 정규화하고, A2A 게이트웨이는 장기 Task와 에이전트 발견·협업 의미를 보존한다. MCP 프록시는 도구·리소스 서버 연결을 중개한다. 일반 API 게이트웨이를 사용할 수 있지만 A2A의 Task 상태, 스트리밍 이벤트와 Agent Card 캐시를 모르면 의미 손실이 생긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 다중 공급자 라우팅 사례

한 조직이 세 문서 처리 에이전트를 쓰는 경우 게이트웨이는 승인된 Agent Card와 데이터 지역, 기술, 비용·지연 정책으로 대상을 선택할 수 있다. 요청을 받은 뒤 사용자 토큰을 대상 제한 토큰으로 교환하고, REST 클라이언트 요청을 내부 gRPC 바인딩으로 변환하더라도 messageId와 Task 의미를 유지한다. 원격 서버가 Task를 반환하면 게이트웨이는 자체 ID로 덮지 않고 공급자·테넌트와 결합한 안전한 매핑을 저장한다. 스트림이 끊기면 Task를 새로 만들지 않고 Get Task 또는 Subscribe로 복구한다. 특정 공급자의 오류율이 임계치를 넘으면 새 작업만 다른 후보로 보내고 진행 중 Task를 임의 이전하지 않는다. 라우팅 이유와 선택 카드 버전을 감사 기록에 남긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 게이트웨이 운영 통제

게이트웨이는 카드 캐시와 라우팅 정책을 변경 승인 대상으로 관리하고 정책 버전을 각 Task 시작 기록에 남긴다. 데이터면은 전체 본문 로깅을 기본 해제하고 mediaType·크기·해시·정책 결과만 수집한다. 테넌트별 연결·Task·토큰·콜백 저장소를 분리하고 관리자 조회도 목적·기간을 제한한다. 바인딩 변환 회귀는 정본 golden vector와 실제 공급자 샌드박스 양쪽에서 시험한다. 장애 훈련에서는 카드 원본 장애, 권한 서버 지연, 절반 열린 스트림, 푸시 폭주, 공급자 완료 응답 유실과 게이트웨이 재시작을 재현한다. 롤백 뒤 진행 중 Task 조회와 취소가 유지되지 않으면 상태 저장 방식부터 수정해야 한다. 정책 우회용 직접 엔드포인트도 네트워크에서 차단한다. 게이트웨이 자체가 장애일 때 허용할 비상 경로는 읽기 전용·저위험 작업으로 제한하고 사후 감사 대상을 표시한다. 원격 에이전트가 반환한 재시도 지시를 그대로 따르지 않고 전체 요청 예산과 회로 차단 정책 안에서 재계산한다. 게이트웨이 운영자와 원격 공급자의 사고 대응 책임, 로그 공유 범위와 Task 복구 연락 경로도 사전에 계약한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

### 학습 체크

- 게이트웨이 제어면과 데이터면의 책임을 구분할 수 있는가?
- 바인딩 변환에서 반드시 보존해야 할 A2A 의미를 열거할 수 있는가?
- 테넌트·토큰·Task 격리를 검증할 시험을 설계할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)
- [모델 게이트웨이](/wiki/model-gateway/)

### 관련 문서

- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)
- [A2A 인증과 권한 위임](/wiki/a2a-authentication-delegation/)
- [A2A 관측성](/wiki/a2a-observability/)
- [MCP와 A2A의 경계](/wiki/mcp-a2a-boundary/)

### 이 문서를 가리키는 문서

- [A2A 관측성](/wiki/a2a-observability/)
- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)
- [MCP와 A2A의 경계](/wiki/mcp-a2a-boundary/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation
3. <span id="reference-3"></span>[A2A Custom Protocol Bindings](https://a2a-protocol.org/latest/topics/custom-protocol-bindings/) - documentation
4. <span id="reference-4"></span>[OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html) - standard
5. <span id="reference-5"></span>[W3C Trace Context](https://www.w3.org/TR/trace-context/) - standard

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — 모델 컨텍스트 프로토콜](/wiki/mcp/)

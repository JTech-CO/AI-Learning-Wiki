---
title: "A2A 푸시 알림 A2A Push Notification"
description: "A2A 푸시 알림은 장기 Task의 상태 변화가 생겼을 때 서버가 등록된 웹훅으로 알림을 보내 연결이 끊긴 클라이언트가 작업을 다시 조회하게 하는 비동기 전달 방식이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Push Notifications · Task Push Notification</p>

<p class="wiki-lead">A2A 푸시 알림은 장기 Task의 상태 변화가 생겼을 때 서버가 등록된 웹훅으로 알림을 보내 연결이 끊긴 클라이언트가 작업을 다시 조회하게 하는 비동기 전달 방식이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A 푸시 알림은 클라이언트가 Task별 콜백 구성과 선택적 인증 정보를 등록하면 서버가 중요한 갱신을 HTTP POST로 전달하는 기능이다. 장시간 스트림을 유지하지 못하는 모바일·배치·기업 경계에 적합하다. 알림은 Task 상태를 대신하는 정본이 아니라 변경 사실과 관련 식별자를 알려 클라이언트가 권한 있는 Get Task로 최신 상태를 확인하게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

구성 연산은 TaskPushNotificationConfig를 생성·조회·나열·삭제하고 웹훅 URL, 식별자와 인증 정보를 관리한다. 서버는 taskId에 연결된 설정으로 전달하며 실패 재시도·중복·순서 보장은 배포 계약에서 명확히 해야 한다. 여러 설정과 테넌트가 있을 때 콜백 소유자와 Task 소유자의 권한 관계를 검증한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

클라이언트는 카드에서 pushNotifications 지원을 확인한 뒤 검증 가능한 HTTPS 콜백을 등록한다. 서버는 Task 갱신 때 서명·타임스탬프·전달 ID를 포함해 알림을 보내고, 수신기는 출처·재생 여부를 검증한 뒤 빠르게 응답하고 비동기 큐에서 Task를 재조회한다. 구성 삭제와 Task 종료 후 잔여 알림을 안전하게 무시한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

임의 콜백 URL 등록은 SSRF와 내부망 스캔, 대량 알림 증폭을 만든다. URL allowlist, DNS·리디렉션 재검증, 등록 소유권 확인, 전자서명·짧은 재생 창, 전달 ID 중복 제거와 속도 제한이 필요하다. 콜백 본문에 민감한 Artifact나 자격 증명을 넣지 않고 Task 조회 권한을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

시험은 정상 전달, 중복·역순·지연, 5xx·시간 초과 재시도, 서명 오류, 콜백 DNS 변경, 구성 삭제 경쟁, Task 종료 직후 알림을 포함한다. 전달 성공률만 아니라 알림에서 최신 Task 조회까지의 지연, 중복 제거율, 영구 실패 큐와 잘못된 테넌트 차단 건수를 측정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

푸시 알림은 서버가 클라이언트 웹훅을 호출하고 스트리밍은 기존 연결로 연속 이벤트를 보낸다. 폴링은 클라이언트가 주기적으로 상태를 조회한다. 세 방식은 함께 사용할 수 있으나 정본 Task 상태와 이벤트 전달의 신뢰 수준을 분리해야 한다. 일반 웹훅 보안 원칙에 A2A taskId 권한 검사를 추가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 비연결 클라이언트 사례

야간 데이터 분석 Task를 시작한 웹 애플리케이션은 브라우저 연결이 종료되므로 백엔드의 HTTPS 콜백을 등록한다. 서버는 완료나 입력 요구 같은 중요한 상태에서 최소 알림을 보내고, 백엔드는 서명·타임스탬프·전달 ID를 확인한 뒤 2xx로 빠르게 응답한다. 실제 상태와 Artifact는 알림 본문을 신뢰하지 않고 사용자 주체의 Task 조회 권한으로 다시 가져온다. 동일 알림이 세 번 와도 전달 ID와 최신 Task 상태로 한 번만 사용자에게 표시한다. 콜백 처리 중 장애가 나면 내구 큐에서 재시도하고, 오래된 working 알림이 completed 뒤 도착해도 상태를 되돌리지 않는다. Task 종료·사용자 철회 시 등록 구성을 삭제한다. 알림 수신 서비스가 장애면 제한된 폴링으로 복구한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 전달 신뢰도 계약

푸시 제공자는 최대 재시도 횟수, 지수 백오프, 전달 만료, 순서 보장 여부, 응답 시간 제한과 영구 실패 통지를 문서화한다. 소비자는 적어도 한 번 전달을 가정해 멱등 처리하고, 전달 성공과 업무 처리 성공을 분리한다. 콜백 인증 키는 Task 데이터와 별도로 회전하며 이전 키의 짧은 검증 기간을 둔다. URL 등록 시 소유권 도전을 수행하고 DNS·인증서·리디렉션 변경을 주기적으로 재검증한다. 운영 지표는 발생 대비 전달, 검증 거부, 중복, 처리 큐 지연, Task 재조회 실패와 폐기된 구성 사용을 포함한다. 장애 시 무한 푸시 대신 폴링·사용자 알림 같은 제한된 대체 경로를 사용한다. 실패 큐의 개인정보 보존도 원본 Task 정책을 따른다. 웹훅 소비자는 공개 인터넷에서 도달 가능하므로 별도 속도 제한과 WAF 규칙을 두고, 인증 실패와 정상 Task 부재를 구분하지 않는 응답으로 정보 노출을 줄인다. 콜백 비밀 교체 중에는 두 키의 허용 창을 짧게 관리하고 만료 키 사용을 경보한다. 전달 실패가 누적되면 구성 소유자에게 알리고 자동으로 임의의 새 URL을 선택하지 않는다. Task를 삭제할 때 콜백 구성과 실패 큐의 참조가 함께 정리되는지 검사한다. 알림 페이로드의 스키마 버전도 기록해 소비자가 변경을 감지하게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- 푸시 알림과 Task 정본 상태의 관계를 설명할 수 있는가?
- 콜백 URL SSRF와 재생 공격을 막는 통제를 설계할 수 있는가?
- 중복·역순 알림에서도 최신 상태를 얻는 소비자 로직을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [A2A 작업 수명 주기](/wiki/a2a-task-lifecycle/)
- [웹훅](/wiki/webhook/)

### 관련 문서

- [스트림 재개 프로토콜](/wiki/stream-resume-protocol/)
- [LLM 웹훅 서명](/wiki/llm-webhook-signature/)
- [LLM 웹훅 재전송 방어](/wiki/llm-webhook-replay-defense/)
- [A2A 관측성](/wiki/a2a-observability/)

### 이 문서를 가리키는 문서

- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [A2A 작업 수명 주기](/wiki/a2a-task-lifecycle/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation
3. <span id="reference-3"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation
4. <span id="reference-4"></span>[OpenAPI Specification 3.2.0](https://spec.openapis.org/oas/v3.2.0.html) - standard

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — 웹훅](/wiki/webhook/)

---
title: "에이전트 간 프로토콜 Agent2Agent Protocol"
description: "에이전트 간 프로토콜(A2A)은 구현이 서로 다른 독립 에이전트가 능력을 발견하고 장기 작업을 협업하도록 데이터 모델과 연산 의미를 표준화한 개방형 규약이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A · A2A Protocol · Agent-to-Agent Protocol</p>

<p class="wiki-lead">에이전트 간 프로토콜(A2A)은 구현이 서로 다른 독립 에이전트가 능력을 발견하고 장기 작업을 협업하도록 데이터 모델과 연산 의미를 표준화한 개방형 규약이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

에이전트 간 프로토콜(A2A)은 A2A 클라이언트가 원격 에이전트의 내부 추론·도구 구현을 알지 못해도 메시지를 보내고 상태 있는 작업과 산출물을 추적하게 하는 응용 계층 계약이다. 핵심은 에이전트를 단순 함수가 아니라 독립적인 서비스 경계로 취급한다는 점이다. 프로토콜은 데이터 모델, 추상 연산, 전송 바인딩을 분리해 같은 작업 의미를 JSON-RPC, gRPC, HTTP+JSON/REST에서 보존한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

A2A의 정본 데이터 모델은 AgentCard, Message, Part, Task, Artifact, Extension으로 이루어진다. 클라이언트는 Agent Card에서 인터페이스·프로토콜 버전·기술·보안 요구를 읽고, Message로 의도를 전달한다. 서버는 즉시 Message를 반환하거나 추적 가능한 Task를 만들며, 실제 결과물은 Artifact로 분리한다. 이 구분 덕분에 대화와 납품물, 전송 연결과 실행 상태를 독립적으로 관리할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

일반 흐름은 Agent Card 획득, 지원 인터페이스 선택, 자격 증명 준비, Send Message 호출, Task 또는 Message 응답 처리, 상태·산출물 갱신 수신, 최종 상태 확인 순서다. 장기 작업은 폴링·스트리밍·푸시 알림 중 서버가 선언한 방식을 사용한다. 클라이언트는 taskId와 contextId를 혼동하지 않고, 종료 상태에 도달한 Task에 새 메시지를 덧붙이지 말아야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

A2A는 원격 에이전트의 출력과 Agent Card를 신뢰된 코드나 정책으로 간주하지 않는다. 외부 카드의 설명·기술·예시는 프롬프트 주입 입력이 될 수 있고, Artifact URL은 서버 측 요청 위조나 악성 파일 전달 경로가 될 수 있다. 인증은 HTTP 계층에서, 작업별 권한은 서버 정책에서, 도구 실행 권한은 원격 에이전트 내부에서 각각 강제해야 하며 서로를 대신하지 못한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

## 활용과 검증

### 구현과 검증

구현 검증은 정본 protobuf에서 생성한 타입과 선택한 바인딩의 직렬화가 일치하는지 확인하는 것부터 시작한다. Message-only와 Task 기반 응답, 입력 요구·인증 요구·완료·실패·취소·거부 상태, 중간 Artifact 청크, 버전 불일치와 지원하지 않는 기능을 모두 계약 시험에 넣는다. 관측 기록에는 A2A 버전, 인터페이스, taskId, contextId, messageId, 오류 유형과 최종 상태를 남기되 본문·자격 증명은 최소화한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

A2A는 에이전트가 다른 자율 에이전트와 협업하는 경계를 표준화한다. MCP는 호스트나 에이전트가 도구·리소스·프롬프트를 사용하는 경계를 표준화하므로 상호 대체 규약이 아니다. OpenAPI는 HTTP API의 표면 계약을 기술할 수 있지만 장기 에이전트 작업의 상태 의미까지 자동으로 제공하지 않는다. 실제 시스템에서는 A2A 바깥 협업, MCP 내부 도구 사용, OpenAPI 서비스 명세를 함께 적용할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 여행 조정 에이전트 사례

여행 조정 에이전트가 항공·숙박 에이전트와 협업하는 상황을 생각할 수 있다. 조정 에이전트는 두 원격 시스템의 Agent Card를 검증하고 일정·예산·환불 가능성을 처리하는 기술과 입출력 모드를 확인한다. 항공 에이전트에는 좌석 후보 조사를, 숙박 에이전트에는 같은 contextId 아래 지역·날짜 후보 조사를 각각 새 Task로 요청한다. 각 서버의 내부 검색 도구와 계획은 공개되지 않아도 되지만 Task 상태, 추가 입력 요구와 Artifact 결과는 A2A 객체로 관찰할 수 있어야 한다. 사용자가 날짜를 바꾸면 완료 Task를 변조하지 않고 이전 taskId를 referenceTaskIds로 가리키는 새 상호작용을 만든다. 결제는 결과 수집과 분리해 사람 승인 뒤 별도 권한으로 실행한다. 원격 에이전트 하나가 지연되더라도 다른 Task를 취소하거나 이미 검증된 Artifact를 잃지 않게 각 작업의 시간 예산과 실패 범위를 따로 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 도입·릴리스 판정 기준

A2A를 도입하기 전에 상대가 실제로 자율적인 장기 협업 주체인지, 단순 도구 호출로 충분한지 판정한다. 릴리스 표에는 지원 protocolVersion과 binding, Message·Task 선택 규칙, 최대 Part 크기, 상태별 시간 제한, 인증 주체, 취소 후 부수 효과 처리와 관측 필드를 명시한다. 호환성 시험은 다른 SDK 두 개 이상과 수행하고, 성공 사례만 아니라 미지원 버전·필수 확장·잘못된 taskId·역순 스트림·중복 알림을 포함한다. 운영 승인은 95번째 백분위 지연, Task 완료율, input-required 체류 시간, 고아 Task, 권한 거부와 Artifact 격리율을 함께 보고 결정한다. 사양·카드·에이전트 구현 버전 중 하나가 바뀌면 교차 적합성 시험을 다시 실행한다. 변경 전후 같은 테스트 벡터에서 상태·오류·결과 의미가 달라진 항목은 마이그레이션 계약 없이는 배포하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

### 학습 체크

- A2A의 데이터 모델, 추상 연산, 바인딩 세 층을 구분할 수 있는가?
- Message 응답과 Task 응답을 선택하는 조건을 설명할 수 있는가?
- 원격 Agent Card와 Artifact를 신뢰하지 않은 입력으로 처리할 통제를 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [AI 에이전트](/wiki/ai-agent/)
- [에이전트 간 통신](/wiki/inter-agent-communication/)

### 관련 문서

- [에이전트 카드](/wiki/agent-card/)
- [A2A 작업 수명 주기](/wiki/a2a-task-lifecycle/)
- [MCP와 A2A의 경계](/wiki/mcp-a2a-boundary/)
- [에이전트 실행 계약](/wiki/agent-run-contract/)

### 이 문서를 가리키는 문서

- [에이전트 카드](/wiki/agent-card/)
- [A2A 메시지](/wiki/a2a-message/)
- [A2A 작업 수명 주기](/wiki/a2a-task-lifecycle/)
- [A2A 적합성 시험](/wiki/a2a-conformance-testing/)
- [A2A 콘텐츠 파트](/wiki/a2a-content-part/)

<details class="wiki-backlinks-more">
<summary>나머지 3개 문서 보기</summary>

- [A2A 프로토콜 게이트웨이](/wiki/a2a-protocol-gateway/)
- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)
- [MCP와 A2A의 경계](/wiki/mcp-a2a-boundary/)

</details>

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation
4. <span id="reference-4"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation
5. <span id="reference-5"></span>[A2A and MCP: Detailed Comparison](https://a2a-protocol.org/latest/topics/a2a-and-mcp/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — 에이전트 카드](/wiki/agent-card/)

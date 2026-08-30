---
title: "A2A 작업 수명 주기 A2A Task Lifecycle"
description: "A2A 작업 수명 주기는 장기 실행을 Task 객체와 명시적 상태 전이로 추적하고 입력 요구, 인증 요구, 완료·취소·실패를 일관되게 처리하는 계약이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Task State Machine</p>

<p class="wiki-lead">A2A 작업 수명 주기는 장기 실행을 Task 객체와 명시적 상태 전이로 추적하고 입력 요구, 인증 요구, 완료·취소·실패를 일관되게 처리하는 계약이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A Task는 즉시 응답으로 끝나지 않는 상태 있는 작업 단위다. 서버가 taskId와 contextId를 부여하고 현재 상태, 선택적 상태 메시지, 생성된 Artifact와 제한된 메시지 이력을 제공한다. 클라이언트는 상태를 임의로 추정하지 않고 서버가 반환한 상태를 기준으로 재입력, 폴링, 구독, 취소 또는 종료 처리를 결정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

주요 진행 상태는 submitted와 working이며, input-required와 auth-required는 외부 조치가 필요한 중단 상태다. completed, failed, canceled, rejected는 터미널 상태이므로 같은 Task에 새 메시지를 보낼 수 없다. 후속 수정은 같은 contextId와 referenceTaskIds를 사용해 새 상호작용으로 시작하며 이전 Task의 불변 기록을 덮어쓰지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

클라이언트가 Message를 보내면 서버는 단순 Message 또는 Task를 반환한다. Task라면 클라이언트는 Get Task, Subscribe to Task, 스트리밍 이벤트나 푸시 알림으로 갱신을 얻는다. input-required에서는 필요한 입력의 의미와 형식을 확인해 후속 Message를 보내고, auth-required에서는 프로토콜 바깥 인증 절차로 자격을 획득한 뒤 재개한다. 취소 요청은 취소 가능성 자체와 최종 canceled 전이를 구분한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

taskId와 contextId는 권한 검사를 대신하지 않는 불투명 식별자다. 다른 사용자의 식별자를 추측하거나 로그에서 얻어 조회할 수 없도록 모든 Task 연산에서 주체·테넌트·범위를 재검증해야 한다. 재시도된 Message가 중복 부작용을 만들 수 있으므로 messageId 기반 중복 제거, 작업별 실행 예산과 취소 후 외부 부작용의 보상 절차가 필요하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

## 활용과 검증

### 구현과 검증

상태 기계 시험은 허용 전이뿐 아니라 working에서 completed 뒤 입력을 보내는 경우, canceled 뒤 늦게 도착한 Artifact 이벤트, 만료된 auth-required 재개, 동시에 발생한 취소와 완료를 포함한다. 이벤트 순서와 최종 스냅샷이 어긋날 수 있으므로 클라이언트는 taskId별 단조 상태 정책과 중복 이벤트 처리를 정의한다. 상태 체류 시간, 중단 원인, 재개 성공률과 고아 Task 수를 운영 지표로 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

Task는 서버가 관리하는 장기 작업이고 Message는 한 번의 의사소통, Artifact는 Task가 낸 결과다. contextId는 관련 Task와 Message를 묶지만 채팅 세션이나 보안 세션으로 해석해서는 안 된다. 내부 워크플로 엔진의 세부 단계는 A2A에 노출되지 않아도 되며, 외부 계약에는 합의된 Task 상태와 결과만 보존하면 된다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 문서 승인 Task 예시

계약서 검토 요청이 submitted에서 working으로 전이된 뒤 서명권자 정보가 없어 input-required가 되었다고 하자. 상태 Message는 필요한 필드와 이유를 설명하지만 클라이언트는 Task 상태 코드와 taskId를 정본으로 저장한다. 사용자가 정보를 보내면 서버는 같은 Task를 working으로 재개하고 수정 제안 Artifact를 청크로 제공한다. 최종 발송 권한이 없으면 auth-required로 다시 멈추며, 클라이언트가 OAuth 절차를 마친 뒤에만 외부 시스템 작업을 계속한다. 검토가 끝나 completed가 되면 후속 수정 요청은 같은 contextId와 이전 taskId 참조를 가진 새 Task로 만든다. 이 방식은 한 Task의 역사와 후속 요구를 섞지 않는다. 실패와 거부는 원인과 복구 가능성이 다르므로 UI와 재시도 정책에서도 별도 상태로 표시한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상태 불변식과 복구

운영 구현은 터미널 상태의 불변성, taskId의 서버 발급, contextId-taskId 소유 관계, 상태 이벤트의 식별 가능성과 Artifact의 Task 귀속을 불변식으로 둔다. working 체류 시간이 예산을 넘으면 감시기가 취소를 요청하거나 사람에게 승격하지만 곧바로 failed를 덮어쓰지 않는다. 네트워크 분할 뒤 클라이언트는 마지막 이벤트만 믿지 않고 Get Task로 정본 스냅샷을 다시 읽는다. 동시에 완료와 취소 응답이 도착하면 서버가 확정한 최종 상태와 외부 부수 효과 기록을 대조한다. auth-required 상태의 토큰이 만료되면 기존 민감 입력을 재사용하지 않고 새 승인 경로를 연다. 고아 Task 정리는 테넌트·보존 정책·법적 보류를 확인한 뒤 수행한다. 상태 전이 코드는 사양 버전별 표로 관리해 구현 조건문이 분산되지 않게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

### 학습 체크

- 진행·중단·터미널 상태와 허용 전이를 설명할 수 있는가?
- input-required와 auth-required를 각각 어떻게 재개하는지 구분할 수 있는가?
- 취소·재시도·지연 이벤트가 겹치는 시험 시나리오를 작성할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)
- [에이전트 상태 기계](/wiki/agent-state-machine/)

### 관련 문서

- [에이전트 실행 계약](/wiki/agent-run-contract/)
- [A2A 메시지](/wiki/a2a-message/)
- [A2A 산출물](/wiki/a2a-artifact/)
- [A2A 푸시 알림](/wiki/a2a-push-notification/)

### 이 문서를 가리키는 문서

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)
- [A2A 관측성](/wiki/a2a-observability/)
- [A2A 메시지](/wiki/a2a-message/)
- [A2A 산출물](/wiki/a2a-artifact/)
- [A2A 푸시 알림](/wiki/a2a-push-notification/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Life of a Task](https://a2a-protocol.org/latest/topics/life-of-a-task/) - documentation
4. <span id="reference-4"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation
5. <span id="reference-5"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — 에이전트 상태 기계](/wiki/agent-state-machine/)

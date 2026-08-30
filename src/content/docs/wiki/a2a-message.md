---
title: "A2A 메시지 A2A Message"
description: "A2A 메시지는 클라이언트와 원격 에이전트 사이의 한 차례 의사소통을 역할, 고유 messageId와 하나 이상의 Part로 표현하는 프로토콜 객체다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Message Object · Message</p>

<p class="wiki-lead">A2A 메시지는 클라이언트와 원격 에이전트 사이의 한 차례 의사소통을 역할, 고유 messageId와 하나 이상의 Part로 표현하는 프로토콜 객체다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A Message는 user 또는 agent 역할을 가진 한 번의 전달 단위이며, 클라이언트가 지정하는 messageId와 하나 이상의 Part를 포함한다. 새 작업의 의도, 진행 중인 Task의 추가 입력, 범위 협상과 상태 설명을 운반한다. Message는 대화 의미를 전달하지만 장기 실행의 정본 상태나 최종 납품물을 대신하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

Message는 contextId로 관련 상호작용에 참여할 수 있고 기존 Task를 계속할 때 taskId를 참조한다. referenceTaskIds는 이전 결과를 바탕으로 새 작업을 정교화한다는 힌트를 제공한다. Part마다 텍스트, 바이트, URL 또는 구조화 데이터를 담으며 mediaType과 filename을 명시해 수신자가 추측에 의존하지 않게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

클라이언트는 고유 messageId와 검증된 Part를 만들어 Send Message 또는 Send Streaming Message로 보낸다. 서버는 즉시 Message로 답하거나 Task를 만들고, Task 상태 메시지로 추가 입력을 요청할 수 있다. 네트워크 오류 뒤 재전송할 때 같은 messageId를 재사용하더라도 서버의 중복 제거 지원이 선택적일 수 있으므로 호출이 멱등하다고 가정하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

Message의 모든 필드는 외부 입력이다. 구조화 data도 스키마와 크기를 검증하고, URL Part는 허용 스킴·호스트·콘텐츠 길이를 제한하며, 텍스트는 실행 지시가 아니라 데이터로 취급한다. 중요한 승인·감사 정보를 일시적인 상태 Message 하나에만 두면 재연결 시 유실될 수 있으므로 Task 상태나 별도 감사 저장소에 보존한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

계약 시험은 빈 Parts, 여러 모달리티, 중복 messageId, 잘못된 role, 존재하지 않는 taskId, taskId-contextId 불일치와 터미널 Task 후속 메시지를 포함한다. 송수신 로그에는 messageId와 Part의 mediaType·크기만 기본 기록하고 실제 본문은 민감도 정책에 따라 해시 또는 표본화한다. 재시도 횟수와 중복 실행률을 함께 측정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

Message는 의사소통을 위한 객체이고 Artifact는 검색·재사용할 수 있는 작업 산출물이다. TaskStatus의 선택적 message는 현재 상태 설명이지만 Task의 상태 코드가 정본이다. 일반 채팅 메시지와 달리 A2A Message는 프로토콜 식별자와 Part 타입을 가지며 바인딩 간에 같은 의미를 보존해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 메시지 구성 예시

고객이 제품 사진과 오류 코드를 진단 에이전트에 보낸다면 Message는 user 역할과 고유 messageId를 가지고, 첫 Part에는 오류 코드의 구조화 data, 둘째에는 image/jpeg URL, 셋째에는 증상 설명 text를 담을 수 있다. URL은 짧은 만료 시간과 읽기 전용 권한을 사용하며 개인정보가 들어간 EXIF는 송신 전에 제거한다. 서버가 모델 번호를 더 요구하면 input-required Task 상태와 설명 Message를 보내고, 클라이언트는 원래 Message를 수정하지 않은 채 새 messageId로 답한다. 진단 보고서가 완성되면 일반 답변 Message가 아니라 Artifact로 제공해 후속 수리 Task가 안정적으로 참조하게 한다. 각 메시지의 taskId와 contextId 관계를 검사해 다른 고객의 진행 중 Task로 입력이 섞이지 않게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 전달·재시도 정책

Message 송신기는 요청 생성과 전송 결과를 분리해 기록하고, 응답을 받지 못한 경우 서버가 처리했을 가능성을 고려한다. 동일 messageId 재전송이 중복 제거 힌트가 될 수 있어도 사양이 모든 서버의 멱등성을 보장하지 않으므로 결제·발송 같은 행동은 별도 업무 키로 보호한다. 큐 기반 전달에서는 오래된 Message가 최신 사용자 취소 뒤 실행되지 않도록 Task 상태와 만료 시각을 재확인한다. 수신기는 role과 Part 수·총 크기·허용 mediaType을 검증하고, 일부 Part 오류 시 전체 거부 또는 부분 처리 정책을 명시한다. 장애 분석에는 messageId, 시도 번호, 선택 인터페이스, HTTP 상태, A2A 오류와 Task 생성 여부를 남겨 중복 실행을 판정한다. 메시지 본문을 재현용으로 저장해야 하면 비식별화·암호화·보존 만료를 함께 적용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- Message, Task, Artifact의 책임을 한 사례에서 구분할 수 있는가?
- 재전송 시 messageId와 멱등성의 한계를 설명할 수 있는가?
- URL·data Part를 안전하게 처리할 검증 규칙을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)

### 관련 문서

- [A2A 콘텐츠 파트](/wiki/a2a-content-part/)
- [A2A 산출물](/wiki/a2a-artifact/)
- [A2A 작업 수명 주기](/wiki/a2a-task-lifecycle/)
- [에이전트 간 통신](/wiki/inter-agent-communication/)

### 이 문서를 가리키는 문서

- [A2A 산출물](/wiki/a2a-artifact/)
- [A2A 작업 수명 주기](/wiki/a2a-task-lifecycle/)
- [A2A 콘텐츠 파트](/wiki/a2a-content-part/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation
4. <span id="reference-4"></span>[A2A Life of a Task](https://a2a-protocol.org/latest/topics/life-of-a-task/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — A2A 콘텐츠 파트](/wiki/a2a-content-part/)

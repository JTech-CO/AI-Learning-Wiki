---
title: "A2A 프로토콜 바인딩 A2A Protocol Binding"
description: "A2A 프로토콜 바인딩은 추상 A2A 연산과 데이터 모델을 JSON-RPC, gRPC, HTTP+JSON/REST 같은 구체적 전송·직렬화 규칙에 매핑하는 계약이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Binding · A2A Transport Binding</p>

<p class="wiki-lead">A2A 프로토콜 바인딩은 추상 A2A 연산과 데이터 모델을 JSON-RPC, gRPC, HTTP+JSON/REST 같은 구체적 전송·직렬화 규칙에 매핑하는 계약이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A 프로토콜 바인딩은 Send Message, Get Task, Cancel Task 같은 추상 연산을 특정 전송의 메서드·경로·헤더·오류·스트림으로 표현한다. 1.0 사양은 JSON-RPC, gRPC, HTTP+JSON/REST 표준 바인딩을 제공하고 Agent Card의 supportedInterfaces에서 엔드포인트와 함께 선언한다. 바인딩을 바꿔도 데이터 모델과 작업 의미는 변하지 않아야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

정본 protobuf 유형은 각 바인딩의 직렬화 모델로 변환된다. JSON은 camelCase 필드, 시간·열거·바이트 매핑을 따라야 하며 오류는 전송 고유 코드와 A2A 오류 의미를 함께 보존한다. 스트리밍은 바인딩별 전달 기법이 달라도 이벤트 순서, 상태·Artifact 갱신과 종료 신호가 동등해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

클라이언트는 Agent Card의 supportedInterfaces를 순서대로 읽어 구현 가능한 protocolBinding과 protocolVersion을 선택한다. 요청마다 A2A-Version 등 서비스 매개변수를 전송 방식에 맞게 전달하고 응답을 공통 객체로 역직렬화한다. 연결 실패를 다른 바인딩으로 전환할 때 중복 Message·Task 생성 가능성을 평가한 뒤 같은 호출을 재실행한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

바인딩 변환기가 인증 헤더, trace context, 테넌트 식별자나 콘텐츠 크기 제한을 누락하면 같은 프로토콜이라도 보안 의미가 달라진다. 커스텀 바인딩은 자격 증명 전달, 오류 노출, 프레이밍, 백프레셔와 재연결 규칙을 명시해야 한다. 암호화되지 않은 대체 전송으로 자동 하향하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

## 활용과 검증

### 구현과 검증

동일 논리 요청을 각 바인딩으로 보내 Task·Message·Artifact와 오류 결과를 비교하는 교차 바인딩 시험을 만든다. 열거값, 빈 선택 필드, 대용량 raw Part, 취소, 스트림 재연결, 알 수 없는 필드와 버전 오류를 포함한다. 커스텀 바인딩은 핵심 연산 전체를 지원하거나 제한을 카드에 명확히 광고해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

바인딩은 같은 A2A 의미를 운반하는 방법이고 Extension은 기존 바인딩 위에서 데이터·연산·상태 의미를 확장한다. 전송 프로토콜만 같다고 바인딩이 호환되는 것은 아니며 직렬화와 오류·스트림 의미까지 맞아야 한다. API 게이트웨이는 여러 바인딩을 중개할 수 있지만 그 자체가 새로운 표준 바인딩은 아니다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### REST와 gRPC 비교 사례

동일 Send Message를 REST와 gRPC로 구현할 때 클라이언트가 보는 Message·Task oneof 결과와 오류 의미는 같아야 한다. REST는 HTTP 경로·메서드·JSON 상태 코드 매핑을 사용하고 gRPC는 서비스 메서드·protobuf와 gRPC 상태를 사용한다. raw Part의 바이트 표현, 타임스탬프, 열거값과 알 수 없는 필드 처리도 정본 protobuf와 일치시킨다. 서버 스트리밍이 중간 Artifact와 상태 갱신을 보내면 두 바인딩 모두 생성 순서를 보존하고 터미널 상태에서 끝나야 한다. REST 프록시가 빈 필드를 제거하거나 gRPC 게이트웨이가 오류 세부를 바꿨다면 객체 모양뿐 아니라 클라이언트 복구 결정이 달라지는지 확인한다. 같은 golden Task로 결과 해시를 비교한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 커스텀 바인딩 검토 항목

WebSocket이나 MQTT 같은 커스텀 바인딩을 제안하려면 모든 추상 연산의 매핑, 데이터 유형·바이트·시간 표현, 서비스 매개변수, 인증 자격 전달, 오류 코드, 순서와 재연결·완료 의미를 명세한다. Agent Card에는 전역 고유 URI의 protocolBinding과 버전, endpoint를 선언하고 표준 바인딩과 의도적인 차이를 공개한다. 구현은 빈 값, 대용량 Part, backpressure, 네트워크 분할, 중복 프레임과 인증 갱신을 시험한다. 공식 URI처럼 보이는 사설 식별자를 만들거나 실험 바인딩을 기본 활성화하지 않는다. 핵심 데이터 모델을 운반하지 못하는 제한은 임의 확장으로 숨기지 말고 상호운용 불가 조건으로 명시한다. 참조 구현과 샘플 캡처를 제공해 제3자가 재현할 수 있게 한다. 바인딩 URI의 버전과 wire 버전, 구현 패키지 버전을 혼용하지 않고 각각 기록한다. 중개 프록시가 헤더나 메타데이터 크기를 제한할 때 서비스 매개변수가 잘려도 조용히 실행되지 않게 오류를 정의한다. 표준 바인딩과 커스텀 바인딩의 지원 범위를 카드에서 별도 항목으로 검증한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

### 학습 체크

- 추상 연산과 전송 바인딩을 구분할 수 있는가?
- 교차 바인딩 적합성 시험에서 비교할 항목을 열거할 수 있는가?
- 커스텀 바인딩이 인증·오류·스트리밍을 정의해야 하는 이유를 설명할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)

### 관련 문서

- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)
- [스트리밍 응답 계약](/wiki/streaming-response-contract/)
- [A2A 프로토콜 게이트웨이](/wiki/a2a-protocol-gateway/)

### 이 문서를 가리키는 문서

- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)
- [A2A 적합성 시험](/wiki/a2a-conformance-testing/)
- [A2A 프로토콜 게이트웨이](/wiki/a2a-protocol-gateway/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Custom Protocol Bindings](https://a2a-protocol.org/latest/topics/custom-protocol-bindings/) - documentation
4. <span id="reference-4"></span>[A2A Extension and Protocol Binding Governance](https://a2a-protocol.org/latest/topics/extension-and-binding-governance/) - documentation
5. <span id="reference-5"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — API 버전 협상](/wiki/api-version-negotiation/)

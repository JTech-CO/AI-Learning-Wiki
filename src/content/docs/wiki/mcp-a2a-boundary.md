---
title: "MCP와 A2A의 경계 MCP and A2A Boundary"
description: "MCP와 A2A의 경계는 도구·리소스 사용 계약과 독립 에이전트 협업 계약을 구분해 각 프로토콜을 올바른 시스템 경계에 배치하는 설계 원칙이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">MCP vs A2A · MCP-A2A Boundary</p>

<p class="wiki-lead">MCP와 A2A의 경계는 도구·리소스 사용 계약과 독립 에이전트 협업 계약을 구분해 각 프로토콜을 올바른 시스템 경계에 배치하는 설계 원칙이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

MCP는 호스트·에이전트가 도구, 리소스, 프롬프트와 상호작용하는 표준이고 A2A는 서로 독립적이며 내부가 불투명할 수 있는 에이전트가 발견·협상·장기 Task를 수행하는 표준이다. 호출 대상이 자율적으로 범위를 조정하고 상태를 오래 유지하며 다른 도구를 조합한다면 A2A 경계가 적합하고, 명확한 스키마의 원자 기능이라면 MCP 도구 경계가 단순하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

전형적인 구성에서 사용자 측 주 에이전트는 A2A로 전문 에이전트와 협업하고, 각 전문 에이전트 내부는 MCP로 데이터베이스·검색·업무 API를 사용한다. 같은 기능을 두 프로토콜로 노출할 수도 있지만 계약을 자동 변환한다고 의미가 같아지지는 않는다. A2A Task의 협상·중단·후속 작업을 단일 MCP tool call로 축소하면 상태와 책임이 사라질 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

경계를 정할 때 대상의 자율성, 입력·출력의 폐쇄성, 실행 시간, 다중 왕복, 사용자 추가 입력, 취소·결과 추적과 신뢰 주체를 표로 비교한다. MCP 도구로 충분하면 최소 표면을 유지하고, 에이전트 협업이 필요하면 Agent Card와 Task 계약을 설계한다. A2A 에이전트가 내부 MCP 도구를 호출할 때 두 계층의 식별자·권한·추적을 연결하되 외부에 내부 도구 세부를 노출하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

A2A 호출자의 사용자 권한을 MCP 서버로 그대로 전달하면 토큰 혼동과 과권한이 생길 수 있다. 각 경계에서 새로운 audience와 최소 scope를 발급하고 에이전트가 정책 결정 책임을 가진다. MCP 도구 결과와 A2A 원격 에이전트 결과 모두 신뢰하지 않은 입력이며, A2A가 내부 추론을 숨긴다는 이유로 안전성 검증을 생략해서는 안 된다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

검증 시나리오는 같은 업무를 잘못된 경계와 올바른 경계로 구현해 상태 손실, 추가 입력, 취소, 오류 복구와 감사 가능성을 비교한다. A2A taskId·contextId와 내부 MCP request ID·tool call ID를 분리해 기록하고 공통 trace에서 부모·자식 관계만 연결한다. 프로토콜 변환기는 완전한 의미 보존이 가능한 좁은 기능에만 사용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

A2A와 MCP는 경쟁 표준이 아니라 다른 상호작용 축을 담당한다. OpenAPI는 둘이 사용하는 HTTP 표면이나 보안 스킴을 기술할 수 있고, 함수 호출은 모델 출력 형식에 가까워 네트워크 발견·수명 주기까지 규정하지 않는다. 무엇을 호출하는지와 누가 결과 책임을 지는지를 기준으로 경계를 선택해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 경계 분해 사례

구매 지원 시스템에서 재고 조회는 입력 SKU와 구조화 출력이 명확한 MCP 도구로 두고, 공급업체와 대체품·납기·계약 조건을 여러 차례 협상하는 기능은 A2A 원격 에이전트로 둘 수 있다. 구매 에이전트는 A2A Task를 소유하며 내부에서 MCP 재고·환율·계약 검색 도구를 호출한다. 외부 클라이언트는 내부 tool name이나 데이터베이스 자격을 알 필요가 없고 최종 견적은 Artifact로 받는다. 단순 재고 조회까지 A2A로 만들면 Task·발견 비용이 불필요하고, 협상 전체를 MCP tool call 하나로 만들면 input-required·취소·부분 결과와 책임 주체가 모호해진다. 업무 단계마다 자율성과 수명 기준으로 경계를 다시 평가한다. 도구를 에이전트처럼 과도하게 포장하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 교차 경계 실행 계약

A2A와 MCP가 만나는 에이전트는 외부 Task의 목표·예산·사용자 권한을 내부 도구 호출 정책으로 변환한다. A2A messageId를 MCP request ID로 재사용하지 않고 trace link와 업무 correlation만 유지한다. MCP 도구 오류를 그대로 외부에 노출하지 않고 A2A Task 상태와 안전한 오류 설명으로 매핑하며, 복구 가능한 도구 실패가 전체 Task 실패인지 정책으로 정한다. 외부 취소가 오면 아직 실행 중인 MCP 호출을 중단하고 이미 발생한 부수 효과는 보상한다. 관측 화면은 원격 에이전트 지연과 내부 도구 지연을 분리해 병목을 찾는다. 권한과 데이터 보존 역시 두 프로토콜 각각의 경계에서 재검증해 내부 결과가 외부 Artifact로 과다 노출되지 않게 한다. 경계 변경은 회귀 시험과 위협 모델을 다시 요구한다. 도구가 장기 상태와 독립적인 책임 주체를 갖게 되었거나 에이전트 기능이 고정된 원자 연산으로 축소되었다면 프로토콜 배치를 재검토하고, 기존 호출자의 마이그레이션 기간을 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- 한 업무를 에이전트 협업과 도구 호출로 나누어 적절한 프로토콜을 선택할 수 있는가?
- A2A를 MCP 단일 도구로 축소할 때 사라지는 상태 의미를 설명할 수 있는가?
- 두 경계 사이 권한과 추적 식별자를 안전하게 연결할 수 있는가?

## 문서 관계

### 선행 개념

- [모델 컨텍스트 프로토콜](/wiki/mcp/)
- [에이전트 간 프로토콜](/wiki/a2a-protocol/)

### 관련 문서

- [MCP 클라이언트](/wiki/mcp-client/)
- [MCP 서버](/wiki/mcp-server/)
- [에이전트 간 통신](/wiki/inter-agent-communication/)
- [A2A 프로토콜 게이트웨이](/wiki/a2a-protocol-gateway/)

### 이 문서를 가리키는 문서

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)
- [A2A 프로토콜 게이트웨이](/wiki/a2a-protocol-gateway/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[A2A and MCP: Detailed Comparison](https://a2a-protocol.org/latest/topics/a2a-and-mcp/) - documentation
2. <span id="reference-2"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
3. <span id="reference-3"></span>[Model Context Protocol Specification 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28) - standard
4. <span id="reference-4"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — 관측성](/wiki/observability/)

---
title: "A2A 버전 협상 A2A Version Negotiation"
description: "A2A 버전 협상은 Agent Card의 인터페이스 버전과 요청의 A2A-Version을 맞춰 기능 의미를 고정하고 호환되지 않는 Major.Minor 조합을 명시적으로 거부하는 절차다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Protocol Versioning · A2A-Version</p>

<p class="wiki-lead">A2A 버전 협상은 Agent Card의 인터페이스 버전과 요청의 A2A-Version을 맞춰 기능 의미를 고정하고 호환되지 않는 Major.Minor 조합을 명시적으로 거부하는 절차다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A 프로토콜 사용 버전은 사양 버전의 Major.Minor로 식별하며 패치 번호는 wire 호환 판정에 쓰지 않는다. Agent Card의 각 supportedInterface가 protocolVersion을 선언하고 클라이언트는 요청마다 A2A-Version을 보내 서버가 적용할 의미를 명확히 한다. 최신 서버에 접속했다는 이유만으로 최신 의미가 자동 적용되지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

서버는 요청된 Major.Minor 의미로 처리하거나 지원하지 않으면 VersionNotSupportedError를 반환한다. 여러 버전을 같은 또는 다른 URL에 노출할 수 있고, 클라이언트 도구는 명시적 버전 고정과 협상을 지원해야 한다. 새 기능이 필요한 클라이언트는 자동 구버전 전환으로 기능이 조용히 사라지지 않게 최소 버전을 선언한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

카드에서 지원 버전 목록을 가져와 클라이언트 지원 집합·정책 최소 버전과 교집합을 계산한다. 선택한 인터페이스 URL과 버전을 실행 계약에 기록하고 모든 요청에 동일한 A2A-Version을 보낸다. 서버 업그레이드나 카드 변경 후에는 캐시를 갱신하고, 진행 중 Task의 버전 의미가 바뀌지 않도록 taskId와 선택 버전을 함께 보존한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

버전 하향은 보안 수정이나 필수 검증 기능을 잃게 할 수 있다. 허용 버전 범위와 폐기 날짜를 클라이언트 정책에 두고, 빈 헤더의 레거시 해석에 의존하지 않는다. 프록시가 A2A-Version을 제거·변조하지 않는지 확인하고 카드가 광고한 버전과 실제 엔드포인트 응답이 반복해서 다르면 공급자 신뢰를 낮춘다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

적합성 시험은 지원 버전, 미지원 버전, 패치 번호 포함, 헤더 누락, 여러 인터페이스 우선순위, 카드 캐시 갱신과 진행 중 Task를 포함한다. 버전별 golden 요청·응답으로 필드와 상태 의미를 비교하고, 클라이언트가 알 수 없는 새 필드를 무시하되 필수 기능 손실을 감추지 않는지 검증한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

A2A 버전 협상은 프로토콜 의미를 고정하고 기능 협상은 같은 버전 안의 바인딩·스트리밍·확장 교집합을 고른다. 에이전트 구현 버전은 Agent Card의 version으로 별도 표시될 수 있으며 A2A 프로토콜 버전과 같지 않다. HTTP나 gRPC 버전 또한 하위 전송의 문제다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 무중단 버전 전환 사례

서버가 0.3과 1.0 인터페이스를 함께 운영하다 1.0으로 전환한다고 하자. Agent Card는 두 supportedInterfaces를 별도 버전과 URL로 게시하고 1.0을 선호 항목으로 둔다. 클라이언트는 자신이 검증한 버전을 명시적으로 선택하며 1.0 기능을 요구하는 요청은 0.3으로 자동 재전송하지 않는다. 진행 중 0.3 Task는 완료·취소 조회를 위해 해당 인터페이스가 폐기 기간 동안 유지되어야 한다. 사용량 관측에서 구버전 요청, VersionNotSupportedError와 기능 차이를 확인한 뒤 폐기 일정을 정한다. 카드 캐시가 갱신되지 않은 클라이언트에는 명확한 오류와 마이그레이션 문서를 제공하고 빈 헤더의 레거시 해석에 기대지 않는다. 롤백 가능 기간과 마지막 지원 날짜를 함께 공지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 호환성 행렬과 회귀

호환성 행렬은 클라이언트 SDK 버전, 요청 A2A-Version, 서버 인터페이스, 바인딩과 선택 확장을 축으로 만든다. 각 셀에서 Send Message, Task 조회·취소, 스트리밍, 푸시와 확장 카드의 예상 동작을 기록한다. 패치 릴리스는 wire 버전을 바꾸지 않더라도 구현 결함 수정으로 결과가 달라질 수 있으므로 SDK·서버 구현 버전도 재현 정보로 보존한다. 새 필드 추가는 구클라이언트가 무시 가능한지, 필드가 없을 때 새서버가 안전한 기본을 쓰는지 시험한다. 버전 오류를 일반 500으로 뭉개지 않고 클라이언트가 재선택할 수 있는 명시적 오류로 반환한다. 지원 종료 후에도 저장된 Task·Artifact의 해석 버전은 감사 기록에서 유지한다. 행렬 결과를 카드 광고와 자동 대조한다. 지원 비율이 낮은 구버전은 즉시 제거하기보다 위험과 유지 비용을 평가해 읽기·조회 전용 기간을 둘 수 있다. 보안 결함이 있는 버전은 사용량과 무관하게 차단하고 오류에서 안전한 대체 버전을 명시하되 자동 재실행은 하지 않는다. 버전별 저장 데이터 마이그레이션은 wire 협상과 분리해 검증하고, 복원 시 원래 해석 규칙을 유지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- 사양 패치 번호와 wire Major.Minor 버전의 차이를 설명할 수 있는가?
- 자동 하향이 기능·보안을 약화시키지 않게 할 정책을 설계할 수 있는가?
- 진행 중 Task와 선택 프로토콜 버전을 어떻게 묶어 기록할지 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)
- [API 버전 협상](/wiki/api-version-negotiation/)

### 관련 문서

- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [에이전트 카드](/wiki/agent-card/)
- [A2A 적합성 시험](/wiki/a2a-conformance-testing/)
- [API 스키마 진화](/wiki/api-schema-evolution/)

### 이 문서를 가리키는 문서

- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [A2A 적합성 시험](/wiki/a2a-conformance-testing/)
- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Custom Protocol Bindings](https://a2a-protocol.org/latest/topics/custom-protocol-bindings/) - documentation
4. <span id="reference-4"></span>[A2A Extension and Protocol Binding Governance](https://a2a-protocol.org/latest/topics/extension-and-binding-governance/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — A2A 프로토콜 게이트웨이](/wiki/a2a-protocol-gateway/)

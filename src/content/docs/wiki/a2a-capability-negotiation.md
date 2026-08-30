---
title: "A2A 기능 협상 A2A Capability Negotiation"
description: "A2A 기능 협상은 Agent Card와 요청 헤더를 대조해 양쪽이 함께 지원하는 바인딩, 버전, 모달리티, 스트리밍·푸시·확장을 선택하는 절차다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">에이전트 기능 협상</p>

<p class="wiki-lead">A2A 기능 협상은 Agent Card와 요청 헤더를 대조해 양쪽이 함께 지원하는 바인딩, 버전, 모달리티, 스트리밍·푸시·확장을 선택하는 절차다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A 기능 협상은 자연어로 능력을 흥정하는 과정이 아니라 Agent Card의 선언과 클라이언트 구현의 교집합을 계산하는 프로토콜 선택 절차다. supportedInterfaces의 순서, protocolBinding·protocolVersion, 기본·기술별 입출력 모드, streaming·pushNotifications·extendedAgentCard 기능과 extension URI를 함께 판단한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

클라이언트는 카드의 첫 인터페이스를 무조건 쓰지 않고 지원 여부와 조직 정책을 확인해 가장 높은 선호 교집합을 선택한다. 확장은 Agent Card에서 URI와 required 여부를 선언하고 요청의 A2A-Extensions 헤더로 사용 의사를 전달한다. 필수 확장을 클라이언트가 지원하지 않으면 조용히 기능을 빼지 말고 명시적 오류로 중단해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

카드 검증 후 후보 인터페이스를 선호 순으로 순회하고 바인딩 구현, Major.Minor 버전, 보안 스킴과 모달리티를 필터링한다. 선택 결과와 이유를 실행 계약에 고정한 뒤 각 요청에 A2A-Version과 선택한 확장을 보낸다. 서버가 VersionNotSupportedError나 ExtensionSupportRequiredError를 반환하면 허용된 대체 경로만 재평가하고 보안·결과 의미가 약해지는 자동 하향은 금지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

공격자가 카드 우선순위를 바꾸어 평문·약한 인증·구버전으로 유도하는 하향 공격을 막아야 한다. 최소 허용 버전, 바인딩, 암호화, 보안 스킴과 필수 확장을 클라이언트 정책으로 별도 고정한다. 기능 플래그가 참이어도 실제 권한과 용량은 호출마다 바뀔 수 있으므로 광고를 승인으로 해석하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

## 활용과 검증

### 구현과 검증

매트릭스 시험은 각 바인딩·버전·모달리티·확장 조합과 교집합이 없는 경우를 포함한다. 카드 우선순위 변경, 필수 확장 미지원, 스트리밍 불가 시 폴링 전환, 최신 버전 기능이 구버전으로 사라지는 경우를 검증한다. 선택된 조합, 대체 횟수, 협상 실패 유형과 자동 하향 차단 건수를 관측한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

기능 협상은 통신 전에 공통 실행 표면을 고르는 과정이고 에이전트 발견은 후보 Agent Card를 찾는 과정이다. 기술 선택은 어떤 업무를 잘하는지의 의미 매칭이며 기능 협상은 그 업무를 어떤 프로토콜 조건으로 호출할지 결정한다. API 버전 협상과 원리는 유사하지만 A2A는 바인딩·Task·모달리티·확장까지 함께 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 협상 행렬 예시

원격 에이전트가 REST 1.0과 gRPC 1.0을 선언하고 streaming·pushNotifications, PDF·JSON 모드를 지원하지만 클라이언트는 REST와 streaming, JSON만 구현했다고 하자. 교집합은 REST 1.0, streaming, JSON이며 PDF 입력이나 푸시는 선택할 수 없다. 요청이 PDF를 반드시 요구하면 파일을 임의로 텍스트 변환해 의미를 바꾸지 않고 다른 에이전트를 발견하거나 명시적 실패를 반환한다. 필수 감사 확장을 서버가 required로 선언했는데 클라이언트가 이해하지 못하면 호출을 중단한다. 반대로 선택 확장은 지원되는 경우에만 A2A-Extensions로 보내고, 응답에 적용된 확장과 버전을 기록해 이후 Artifact 해석이 흔들리지 않게 한다. 선택 결과는 카드 갱신 시 다시 계산한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 협상 정책과 캐시

협상 결과 캐시는 카드 URL·ETag, 클라이언트 구현 버전, 테넌트 정책과 요구 업무 모드를 키로 삼는다. 카드가 바뀌거나 보안 정책이 강화되면 기존 결과를 폐기한다. 정책은 최소 A2A 버전, 금지 바인딩, 허용 인증, 필수 trace·감사 확장, 최대 콘텐츠 크기와 자동 대체 가능 조건을 코드로 관리한다. 폴링 대체는 결과 의미가 같고 지연 예산을 만족할 때만 허용하며, 입력 mediaType이나 보안 스킴의 하향은 사람 승인 없이 수행하지 않는다. 관측에서는 첫 선택 성공률, 카드와 실제 기능 불일치, 대체 후 오류, 협상 시간과 정책 거부 사유를 수집해 공급자 카드 품질과 클라이언트 구현 공백을 구분한다. 실패한 조합도 짧게 캐시해 반복 호출 폭주를 막는다. 업무 필수 기능과 편의 기능을 구분한 정책 표를 두면 선택 기능 하나의 장애가 전체 호출을 막거나, 반대로 필수 안전 기능이 조용히 빠지는 문제를 동시에 줄일 수 있다. 협상 결과는 Task 시작 뒤 임의로 바꾸지 않고 새 조건이 필요하면 명시적인 새 상호작용으로 전환한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-5">[5]</a></div>

### 학습 체크

- Agent Card에서 협상할 기능 축을 빠짐없이 열거할 수 있는가?
- 안전한 대체와 위험한 자동 하향을 구분할 수 있는가?
- 필수 확장 미지원 시 예상되는 오류와 대응을 설명할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 카드](/wiki/agent-card/)

### 관련 문서

- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)
- [A2A 푸시 알림](/wiki/a2a-push-notification/)
- [API 버전 협상](/wiki/api-version-negotiation/)

### 이 문서를 가리키는 문서

- [에이전트 발견](/wiki/agent-discovery/)
- [에이전트 카드](/wiki/agent-card/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)
- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation
4. <span id="reference-4"></span>[A2A Custom Protocol Bindings](https://a2a-protocol.org/latest/topics/custom-protocol-bindings/) - documentation
5. <span id="reference-5"></span>[A2A Extension and Protocol Binding Governance](https://a2a-protocol.org/latest/topics/extension-and-binding-governance/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — OpenAPI 명세](/wiki/openapi-specification/)

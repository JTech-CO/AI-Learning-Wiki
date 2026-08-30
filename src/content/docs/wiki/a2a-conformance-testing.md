---
title: "A2A 적합성 시험 A2A Conformance Testing"
description: "A2A 적합성 시험은 구현이 정본 데이터 모델, 연산, 상태 전이, 오류와 선택한 바인딩의 규범 요구를 같은 의미로 수행하는지 검증하는 계약 시험이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Protocol Conformance · A2A Contract Testing</p>

<p class="wiki-lead">A2A 적합성 시험은 구현이 정본 데이터 모델, 연산, 상태 전이, 오류와 선택한 바인딩의 규범 요구를 같은 의미로 수행하는지 검증하는 계약 시험이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A 적합성 시험은 SDK 함수가 호출된다는 사실이 아니라 관찰 가능한 wire 객체와 상태 의미가 사양의 MUST·MUST NOT 요구를 만족하는지 확인한다. 서버, 클라이언트, 게이트웨이와 커스텀 바인딩을 각각 시험하고, 선택 기능은 Agent Card의 광고와 실제 동작이 일치하는지 추가로 검증한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

시험 묶음은 Agent Card 스키마·발견, Send Message의 Task 또는 Message 응답, Get/List/Cancel/Subscribe Task, 푸시 구성, 확장 카드, 버전·확장 헤더, 오류 유형과 바인딩 직렬화를 다룬다. 필수 핵심과 선택 기능을 분리해 미지원 기능을 실패가 아니라 올바른 UnsupportedOperationError로 반환하는 경우를 구분한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

정본 protobuf와 사양 버전에 맞춘 golden vectors를 만들고 정상·경계·오류 사례를 서버에 실행한다. 클라이언트는 가짜 서버로 역시험해 알 수 없는 필드, 역순·중복 스트림 이벤트, 인증 도전과 버전 오류 처리를 확인한다. 여러 바인딩을 지원하면 같은 논리 사례의 결과 의미를 비교하고 차이를 허용 목록으로 문서화한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

적합성 통과는 안전한 업무 정책을 보장하지 않는다. 공격적 카드·Part·Artifact, SSRF URL, 과대 payload, 잘못된 토큰, 테넌트 간 taskId, 스트림 고갈과 재생 알림을 별도 보안 시험에 포함한다. 시험 자격 증명과 콜백은 격리 환경에서 사용하고 외부 에이전트의 실제 부수 효과를 만들지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-6">[6]</a></div>

## 활용과 검증

### 구현과 검증

릴리스 게이트는 사양 버전·바인딩별 필수 통과율, 알려진 편차, 선택 기능 광고 일치와 회귀 결과를 기록한다. 실패 보고서에는 요청·응답의 민감 값을 제거한 최소 재현, 규범 조항, 구현 버전과 trace ID를 포함한다. 사양 업그레이드 때 구버전 회귀와 새 버전 시험을 동시에 유지해 조용한 의미 변화를 찾는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

스키마 검증은 객체 모양을 확인하고 적합성 시험은 상태 전이·오류·재시도 같은 동작 의미까지 확인한다. 상호운용 시험은 서로 다른 두 구현을 연결해 실제 교집합을 보고, 적합성 시험은 정해진 사양 기준에 대한 판정이다. 품질 평가는 에이전트 결과의 유용성을 측정하므로 프로토콜 적합성과 별도다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 서버 시험 묶음 예시

서버 적합성 묶음은 먼저 well-known Agent Card를 가져와 스키마·인터페이스·버전을 확인하고 선언된 각 바인딩으로 같은 Message를 보낸다. 즉시 응답 기술은 Message oneof만 반환하는지, 장기 기술은 서버 발급 taskId와 유효 상태를 가진 Task를 반환하는지 검사한다. 이어 Get·List·Cancel·Subscribe, input-required 재개, Artifact 청크, 터미널 Task 후속 입력과 미지원 기능 오류를 실행한다. 스트림 이벤트의 taskId·contextId가 최초 Task와 일치하고 최종 종료 표시가 있는지 확인한다. 카드가 푸시를 광고했을 때만 콜백 구성 시험을 활성화하며 광고와 실제 동작이 다르면 적합성 실패로 기록한다. 각 실패를 사양의 규범 문장과 연결한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 릴리스 증거와 편차 관리

시험 결과는 사양 버전, 구현·SDK·바인딩 버전, 테스트 벡터 해시, 실행 환경, 통과·실패와 관련 규범 조항을 포함한 기계 판독 보고서로 남긴다. 허용 편차는 소유자·위험·만료 날짜와 상호운용 영향이 있어야 하며 단순히 실패를 무시하는 목록이 되어서는 안 된다. 공급자별 샌드박스와 로컬 모의 서버를 모두 사용해 네트워크 문제와 구현 의미 오류를 분리한다. 새 사양 후보는 기존 버전 회귀와 병렬 실행하고 프로덕션 카드에 광고하기 전에 다른 언어 SDK와 교차 시험한다. 적합성 통과 뒤에도 업무 정확도, 권한 정책, 악성 입력과 부하 시험을 별도 게이트로 유지한다. 보고서는 재현 가능한 최소 요청과 민감정보 제거 규칙을 포함한다. 시험 도구 자체의 버그가 공급자 실패로 오인되지 않도록 정본 벡터에 대한 자체 검증과 독립 구현 교차 확인을 수행한다. 네트워크 시간 초과는 프로토콜 부적합과 분리해 재시도 후 판정하며, 비결정적인 업무 출력은 객체·상태 계약만 비교한다. 악성 테스트 벡터는 승인된 격리 환경에서만 실행하고 실패 시 외부 부수 효과가 없음을 확인한다. 정기적으로 사양의 규범 문장 목록과 테스트 커버리지를 대조한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-6">[6]</a></div>

### 학습 체크

- A2A 적합성 시험의 필수 영역과 선택 기능 영역을 나눌 수 있는가?
- 스키마 검증만으로 찾지 못하는 동작 오류를 세 가지 제시할 수 있는가?
- 적합성, 상호운용성, 에이전트 품질 평가를 구분할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)
- [API 적합성 테스트 스위트](/wiki/api-conformance-suite/)

### 관련 문서

- [A2A 프로토콜 바인딩](/wiki/a2a-protocol-binding/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)
- [A2A 관측성](/wiki/a2a-observability/)
- [LLM API 계약 테스트](/wiki/llm-api-contract-test/)

### 이 문서를 가리키는 문서

- [A2A 관측성](/wiki/a2a-observability/)
- [A2A 버전 협상](/wiki/a2a-version-negotiation/)

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
6. <span id="reference-6"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [코스 목록으로 돌아가기](/course/agent-interoperability/)

---
title: "에이전트 발견 Agent Discovery"
description: "에이전트 발견은 클라이언트가 작업 후보를 수행할 원격 에이전트의 Agent Card를 찾고 신뢰·기능·접속 조건을 검증하는 절차다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Agent Discovery · 에이전트 디스커버리</p>

<p class="wiki-lead">에이전트 발견은 클라이언트가 작업 후보를 수행할 원격 에이전트의 Agent Card를 찾고 신뢰·기능·접속 조건을 검증하는 절차다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [모델·서비스 생태계](/category/ecosystem/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

에이전트 발견은 이름 검색이 아니라 Agent Card의 위치를 얻고 그 카드가 작업과 보안 정책에 맞는지 판정하는 전 과정이다. A2A는 도메인의 well-known URI, 큐레이션된 레지스트리, 직접 설정이라는 대표 전략을 설명하지만 범용 레지스트리 질의 API는 규정하지 않는다. 따라서 조직은 발견 채널의 신뢰 수준과 갱신 책임을 별도로 정해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

공개 인터넷에서는 도메인 소유권과 `/.well-known/agent-card.json`이 단순한 부트스트랩을 제공한다. 기업 환경에서는 승인된 레지스트리가 기술·지역·데이터 등급·제공자·감사 상태로 카드를 필터링할 수 있다. 폐쇄망과 고정 파트너 연결에서는 직접 설정이 예측 가능하지만 카드 변경과 폐기 정보를 자동으로 따라가기 어렵다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

발견 파이프라인은 후보 원본 확보, HTTPS·호스트 정책 확인, 카드 스키마 검증, 서명·제공자 신뢰 확인, 기술과 입출력 모드 매칭, 보안 스킴·버전·바인딩 선택, 정책 승인 순서로 구성한다. 검색 점수와 실행 권한은 분리하고, 동일 기술을 광고하는 여러 에이전트가 있으면 비용·지연·데이터 위치와 최근 적합성 시험 결과를 함께 비교한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

발견은 공급망 경계이므로 검색 결과의 인기나 자연어 유사도만으로 자동 호출하면 안 된다. 공격자는 같은 이름의 카드, 과장된 skill 설명, 내부 주소를 가리키는 URL, 악성 Artifact 모드를 게시할 수 있다. 레지스트리 제출자 검증, 도메인 허용 목록, 격리된 사전 점검, 카드 해시·버전 기록과 폐기 목록으로 위험을 줄인다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

테스트 세트에는 정상 카드, 만료 카드, 필수 필드 누락, 서명 키 교체, 동일 skill ID 충돌, 지원하지 않는 바인딩, 인증이 필요한 확장 카드, DNS·HTTP 캐시 변경을 포함한다. 품질 지표는 적합 후보 재현율, 부적합 후보 거부율, 카드 신선도, 선택 후 실패율과 발견에서 실행까지의 지연이다. 카드가 바뀌면 저장된 권한 결정을 자동 재사용하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

에이전트 발견은 자율 서비스의 협업 능력과 접속 조건을 찾는다. 도구 발견은 대개 이미 연결된 MCP 서버에서 호출 가능한 원자 기능을 열거하고, 모델 발견은 추론 모델의 기능·가격·배포 조건을 찾는다. 세 과정 모두 메타데이터를 사용하지만 신뢰 주체, 실행 수명, 권한 경계와 실패 비용이 다르다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 기업 레지스트리 사례

기업 내부 분석 에이전트 레지스트리는 Agent Card 원문뿐 아니라 소유 팀, 데이터 등급, 허용 지역, 최근 적합성 결과와 사고 상태를 별도 관리할 수 있다. 사용자가 고객 데이터 요약을 요청하면 검색 계층은 `summarize-records` 기술과 한국 리전 조건을 만족하는 후보를 찾고, 정책 계층은 해당 사용자의 부서·목적·보존 기간을 대조한다. 점수가 가장 높은 후보라도 카드 서명이 만료되거나 보안 검토가 중지된 경우 실행 후보에서 제외한다. 선택 직전에 원본 카드의 ETag를 재검증하고 레지스트리 사본과 달라졌다면 다시 정책 판정을 수행한다. 이 구조는 의미 검색의 편의와 보안 승인 책임을 분리한다. 사용자가 검색 결과를 보더라도 내부 전용 에이전트의 URL과 민감 skill 설명은 권한이 없으면 공개하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 발견 운영 규칙

발견 서비스는 카드 수집기, 스키마·서명 검증기, 정책 인덱스, 검색 API와 폐기 배포기로 나눌 수 있다. 수집기는 외부 URL을 격리 네트워크에서 가져오고 크기·콘텐츠 유형·리디렉션을 제한한다. 검증기는 Agent Card 스키마와 도메인·제공자 신뢰를 판정하며, 검색 인덱스에는 비밀 필드를 싣지 않는다. 폐기 이벤트는 이미 캐시한 클라이언트에도 전달하고 진행 중 Task의 처리 정책을 별도로 정한다. 정기 운영에서는 카드 신선도 분포, 잘못된 기술 매칭, 실행 전 정책 거부, 호출 후 UnsupportedOperationError와 공급자별 장애를 비교한다. 발견 품질이 낮으면 자연어 임베딩보다 통제된 skill ID·입출력 모드·검증 상태의 가중치를 먼저 조정한다. 오탐과 누락은 업무 위험별로 따로 측정해 하나의 검색 점수로 합치지 않는다. 레지스트리 운영자는 후보가 검색되지 않은 사건도 표본 감사해 분류·색인 규칙의 사각지대를 찾고, 폐기된 카드가 다시 수집되지 않도록 원본별 차단 상태를 유지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- well-known, 레지스트리, 직접 설정의 장단점을 배포 환경별로 선택할 수 있는가?
- 검색 적합도와 실행 권한 승인을 분리할 수 있는가?
- 오염된 Agent Card가 자동 호출로 이어지지 않게 할 검증 단계를 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 카드](/wiki/agent-card/)

### 관련 문서

- [도구 발견](/wiki/tool-discovery/)
- [아티팩트 레지스트리](/wiki/artifact-registry/)
- [A2A 기능 협상](/wiki/a2a-capability-negotiation/)
- [모델 탐색](/wiki/model-discovery/)

### 이 문서를 가리키는 문서

- [에이전트 카드](/wiki/agent-card/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[A2A Agent Discovery](https://a2a-protocol.org/latest/topics/agent-discovery/) - documentation
2. <span id="reference-2"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
3. <span id="reference-3"></span>[RFC 8615: Well-Known Uniform Resource Identifiers](https://www.rfc-editor.org/rfc/rfc8615.html) - standard
4. <span id="reference-4"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — A2A 기능 협상](/wiki/a2a-capability-negotiation/)

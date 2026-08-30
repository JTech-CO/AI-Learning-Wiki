---
title: "A2A 콘텐츠 파트 A2A Content Part"
description: "A2A 콘텐츠 파트는 Message와 Artifact 안에서 텍스트, 원시 바이트, URL 또는 구조화 데이터를 하나만 선택해 담는 최소 콘텐츠 컨테이너다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">A2A Part · Part Object</p>

<p class="wiki-lead">A2A 콘텐츠 파트는 Message와 Artifact 안에서 텍스트, 원시 바이트, URL 또는 구조화 데이터를 하나만 선택해 담는 최소 콘텐츠 컨테이너다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 적용 경계

A2A Part는 Message와 Artifact가 공통으로 사용하는 최소 콘텐츠 단위다. `oneof` 의미에 따라 text, raw, url, data 가운데 정확히 하나를 담고 mediaType, filename, metadata를 덧붙일 수 있다. 이 구조는 전송 바인딩과 관계없이 텍스트·파일·구조화 데이터의 의미를 유지해 모달리티 독립적인 협업을 가능하게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프로토콜 객체와 계약

text는 문자열, raw는 인라인 바이트, url은 외부 콘텐츠 참조, data는 기계가 읽는 JSON 값에 적합하다. mediaType은 내용 해석 규칙을 명시하며 filename은 표시나 저장 힌트이지 안전한 경로가 아니다. metadata는 확장 정보를 담지만 핵심 의미나 보안 결정을 임의 키에만 숨기지 않아야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 상호작용 흐름

송신자는 내용 크기와 수신자의 inputModes·outputModes를 보고 인라인과 URL 참조를 선택한다. 수신자는 oneof 위반, 선언 mediaType과 실제 콘텐츠 불일치, 최대 크기, 문자 인코딩과 JSON 스키마를 검사한 뒤 안전한 내부 표현으로 정규화한다. URL은 다운로드 전후 모두 검증하고 리디렉션으로 허용 경계가 바뀌지 않는지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실패·보안 경계

raw와 URL은 악성 파일, SSRF, 과도한 다운로드와 콘텐츠 스니핑 위험이 있다. filename의 경로 요소를 제거하고, URL의 DNS 재바인딩·사설 주소·리디렉션을 통제하며, mediaType만 믿지 않고 파일 시그니처와 스캐너를 사용한다. data 객체의 깊이·키 수·숫자 범위를 제한해 파서 자원 고갈을 막는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

## 활용과 검증

### 구현과 검증

Part 적합성 시험에는 값이 없거나 둘 이상인 oneof, 잘못된 base64, 선언과 다른 MIME, 빈 파일, 매우 깊은 JSON, 순환 리디렉션, 국제화 filename과 알려지지 않은 metadata가 포함된다. 정규화 전 원문 해시와 검증 결과를 남기고, 실패한 Part 하나가 전체 Message·Artifact를 어떻게 실패시키는지 계약으로 정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인접 개념과의 구분

Part는 콘텐츠 운반 단위이고 Message는 의사소통 차례, Artifact는 납품 결과다. HTTP 본문은 특정 바인딩의 전송 컨테이너이고 A2A Part는 바인딩을 넘어 유지되는 논리 객체다. 멀티모달 입력 계약은 모델별 전처리·제약을 다루므로 Part의 mediaType 지원만으로 모델이 실제 콘텐츠를 처리할 수 있다고 보장하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 콘텐츠 표현 선택 사례

작은 설정 객체는 data Part로 보내 스키마 검증과 필드 접근을 쉽게 하고, 수백 메가바이트 영상은 raw 인라인 대신 제한된 HTTPS URL로 전달하는 편이 낫다. 법률 문서의 핵심 문장은 text Part로, 원본 PDF는 별도 URL Part로 두면 에이전트가 요약과 증거 원본을 구분할 수 있다. 송신자는 Agent Card의 inputModes가 지원하는 mediaType을 확인하고, 수신자가 URL을 가져올 권한·네트워크 경로가 있는지 사전에 합의한다. data Part에 바이너리를 문자열로 숨기거나 mediaType 없이 raw를 보내면 바인딩은 통과해도 소비자가 잘못 해석하므로 거부한다. 같은 내용의 중복 Part가 있을 때 우선순위를 추측하지 않고 계약에 따른다. 콘텐츠 변환이 필요하면 원본과 변환본을 별도 Part로 식별한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### Part 검증 파이프라인

검증 파이프라인은 구조 검사, 크기·개수 예산, 콘텐츠 획득, 형식 탐지, 악성 검사, 스키마·업무 규칙, 안전한 저장 순으로 실행한다. URL 다운로드는 사설 주소·링크 로컬·클라우드 메타데이터 대역을 차단하고 DNS 확인과 실제 연결 주소를 모두 검사한다. raw는 압축을 풀기 전후 크기 제한을 적용하고 filename은 표시용으로만 보존한다. data는 JSON 깊이와 속성 수, 문자열 길이를 제한하고 예상 스키마의 additionalProperties 정책을 따른다. 오류는 어느 Part와 어떤 규칙이 실패했는지 기계 코드로 반환하되 내부 경로나 스캐너 세부를 노출하지 않는다. 검증 후 변환된 내용과 원문 해시를 연결해 후속 감사가 가능하게 한다. 검사 시간도 Task 예산에 포함해 악성 입력의 자원 고갈을 방지한다. 수신자가 지원하지 않는 콘텐츠는 무리하게 변환하지 않고 ContentTypeNotSupportedError와 허용 모드를 반환하며, 거부된 원문은 기본적으로 영구 저장하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-4">[4]</a></div>

### 학습 체크

- Part의 oneof 제약과 각 콘텐츠 필드의 선택 기준을 설명할 수 있는가?
- URL·raw·data에서 서로 다른 보안 검증을 설계할 수 있는가?
- Part와 HTTP 본문, 모델 입력 계약을 구분할 수 있는가?

## 문서 관계

### 선행 개념

- [에이전트 간 프로토콜](/wiki/a2a-protocol/)

### 관련 문서

- [A2A 메시지](/wiki/a2a-message/)
- [A2A 산출물](/wiki/a2a-artifact/)
- [멀티모달 입력 계약](/wiki/multimodal-input-contract/)
- [HTTP 메시지 본문](/wiki/http-message-body/)

### 이 문서를 가리키는 문서

- [A2A 메시지](/wiki/a2a-message/)
- [A2A 산출물](/wiki/a2a-artifact/)

### 이 문서를 포함하는 코스

[에이전트 상호운용과 실행 계약](/course/agent-interoperability/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Agent2Agent Protocol Specification 1.0](https://a2a-protocol.org/latest/specification/) - standard
2. <span id="reference-2"></span>[A2A Normative Protocol Buffer Definition](https://github.com/a2aproject/A2A/blob/main/specification/a2a.proto) - specification
3. <span id="reference-3"></span>[A2A Core Concepts](https://a2a-protocol.org/latest/topics/key-concepts/) - documentation
4. <span id="reference-4"></span>[A2A Enterprise Features](https://a2a-protocol.org/latest/topics/enterprise-ready/) - documentation

### 코스에서 계속 읽기

- **에이전트 상호운용과 실행 계약:** [다음 문서 — A2A 산출물](/wiki/a2a-artifact/)

---
title: "미평가 속성 제어 Unevaluated Properties"
description: "미평가 속성 제어는 JSON Schema의 unevaluatedProperties로 성공한 하위 스키마들이 아직 평가하지 않은 객체 속성에 마지막 제약을 적용하는 기능이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">unevaluatedProperties · 미평가 프로퍼티</p>

<p class="wiki-lead">미평가 속성 제어는 JSON Schema의 unevaluatedProperties로 성공한 하위 스키마들이 아직 평가하지 않은 객체 속성에 마지막 제약을 적용하는 기능이다.</p>

<div class="wiki-document-meta">분류: [API·SDK·도구 호출](/category/api/) · 문서 상태: 출처 검토 완료 · 최근 검토: 2026-08-01</div>

## 개념과 원리

### 개요와 핵심 정의

미평가 속성 제어는 JSON Schema의 unevaluatedProperties로 성공한 하위 스키마들이 아직 평가하지 않은 객체 속성에 마지막 제약을 적용하는 기능이다.

additionalProperties는 같은 스키마 객체의 properties와 patternProperties를 기준으로 판단하지만 unevaluatedProperties는 조합과 조건 분기에서 성공적으로 평가된 속성까지 모아 본다.

‘미평가 속성 제어(Unevaluated Properties)’를 이해할 때는 명칭만 외우지 않고 무엇을 입력으로 받고, 어떤 상태나 규칙을 적용하며, 어떤 결과를 관찰하는지 나누어 본다. 이 구분은 비슷한 기능을 제공하는 모델·도구·표준을 비교할 때 같은 단어가 서로 다른 의미로 쓰이는 문제를 줄인다. 또한 결과가 유효하다고 판단할 기준과 판단을 보류해야 할 조건을 함께 적어야 실제 학습과 운영에 연결할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 배경과 설명 범위

additionalProperties는 현재 객체 수준의 선언을 보고, unevaluatedProperties는 적용된 하위 스키마 전체가 이미 다룬 속성을 고려한다. 단순 객체에서는 결과가 같아 보일 수 있다.

이 문서의 범위는 ‘미평가 속성 제어’의 안정적인 정의, 핵심 처리 흐름, 적용 조건과 실패 경계다. 특정 제품의 가격·기본값·성능 수치처럼 빠르게 바뀌는 정보는 일반 원리와 분리하고, 구현을 선택할 때는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

개념의 범위를 정할 때는 상위 개념, 같은 단계의 대안, 하위 구현과 관측 지표를 구분한다. 이름이 비슷하더라도 입력 단위나 보장 범위가 다르면 서로 대체할 수 없다. 반대로 구현 이름이 달라도 같은 입력과 판단 규칙을 제공한다면 공통 원리 위에서 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 작동 원리

평가기는 properties, allOf, if·then 등에서 유효하게 평가된 속성 이름을 주석 결과로 수집한다. 전체 적용이 끝난 뒤 남은 속성마다 unevaluatedProperties의 하위 스키마를 적용한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 계산 또는 규칙 적용, 결과 생성, 검증과 기록의 다섯 단계로 나누어 추적한다. 각 단계에는 입력 자료형과 단위, 선택한 설정, 실패 상태와 다음 단계로 넘기는 값을 남긴다. 이렇게 하면 최종 결과가 기대와 다를 때 최초로 차이가 생긴 위치를 찾을 수 있다.

‘미평가 속성 제어(Unevaluated Properties)’의 구현을 비교할 때는 정상 사례 하나만 보지 않는다. 경계값, 빈 입력, 큰 입력, 일부 정보가 누락된 입력과 의도적인 실패 사례를 같은 절차로 실행하고, 값이 달라진 이유가 데이터·설정·알고리즘·운영 자원 중 어디에 있는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 구성 요소와 데이터 흐름

‘미평가 속성 제어’를 시스템에 넣을 때는 사용자 또는 호출자의 입력 인터페이스, 핵심 상태와 계산부, 정책·설정, 결과 검증부, 관측과 오류 처리부로 나눈다. 구성 요소 사이에는 자료형, 식별자, 단위, 시간 제한과 오류 전달 규칙을 명시한다.

additionalProperties는 같은 스키마 객체의 properties와 patternProperties를 기준으로 판단하지만 unevaluatedProperties는 조합과 조건 분기에서 성공적으로 평가된 속성까지 모아 본다. 이 원리를 데이터 흐름으로 표현하면 어떤 값이 영구 상태인지, 요청 동안만 유지되는지, 외부 근거에서 오는지 구분할 수 있다. 내부 구현을 바꾸더라도 입력·출력 계약과 검증 사례를 유지하면 교체 전후의 동작을 재현 가능한 방식으로 비교할 수 있다.

문서·코스·도구 연결에서는 ‘미평가 속성 제어’ 문서를 ‘prompt-systems’ 코스와 ‘prompt-schema’ 도구가 공유한다. 코스는 읽기 순서를 제공하고 도구는 입력값으로 원리를 확인하게 하므로, 용어 정의와 실습 결과가 다른 기준을 사용하지 않도록 같은 선수·관련 문서 ID를 사용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

allOf로 기본 객체를 확장하면서도 알 수 없는 출력 필드를 금지하거나 조건에 따라 허용 필드가 달라지는 구조화 출력 계약에 사용한다.

도입 여부는 유행이나 제품 이름이 아니라 해결하려는 문제와 측정 가능한 개선으로 결정한다. 먼저 현재 방식의 품질, 오류, 지연 시간, 자원, 비용과 사람 개입을 기준선으로 기록한다. 그다음 ‘미평가 속성 제어’를 적용한 같은 사례에서 개선된 항목과 악화된 항목을 함께 비교한다.

선택 기준에는 평균값뿐 아니라 하위 집단과 어려운 사례, 최악 조건, 운영 복구 시간과 설명 가능성을 포함한다. 작은 오프라인 실험에서 전제가 맞는지 확인하고, 제한된 실제 트래픽과 배포 후 관측으로 증거를 확장한다. 개선 폭이 추가 복잡도와 잔여 위험을 상쇄하지 못하면 단순한 기준선을 유지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 한계와 실패 조건

평가 순서와 성공 분기의 주석 수집을 지원해야 하므로 단순 검증기에서는 구현이 어렵다. false로 닫힌 스키마는 향후 필드 확장을 막으므로 버전 정책과 함께 사용한다.

한계는 개념 자체의 보장 범위, 데이터와 표본의 제약, 특정 구현의 미지원·버그, 잘못된 설정과 운영 자원 부족으로 나누어 기록한다. 결과가 자연스럽거나 오류 없이 반환됐다는 이유만으로 사실성, 공정성, 보안성 또는 통계적 보장까지 확보됐다고 해석하지 않는다.

배포 전에는 알려진 실패를 재현하는 고정 사례와 예상하지 못한 입력을 찾는 탐색 시험을 함께 실행한다. 경고선과 중단선을 따로 두고 자동화가 확신하지 못하거나 실패 비용이 큰 조건은 보류 또는 사람 검토로 보낸다. 완화책을 적용한 뒤 새로 생긴 비용과 제약도 잔여 위험에 포함한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 선수 개념과 관련 개념

additionalProperties는 현재 객체 수준의 선언을 보고, unevaluatedProperties는 적용된 하위 스키마 전체가 이미 다룬 속성을 고려한다. 단순 객체에서는 결과가 같아 보일 수 있다.

#### 먼저 읽을 문서

- [JSON 스키마 단언](/wiki/json-schema-assertion/): 이 문서를 이해하기 위한 선수 개념이다.
- [JSON 스키마 어휘](/wiki/json-schema-vocabulary/): 이 문서를 이해하기 위한 선수 개념이다.

#### 함께 비교할 문서

- [JSON 스키마 방언](/wiki/json-schema-dialect/): 입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.
- [구조화 출력](/wiki/structured-output/): 입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.
- [스키마 검증](/wiki/schema-validation/): 입력·출력·목적 또는 실패 조건을 나란히 비교할 관련 개념이다.

관련 있음과 선수 관계는 같은 뜻이 아니다. 선수 문서는 현재 개념의 정의나 계산을 설명하는 데 먼저 필요하고, 관련 문서는 같은 문제를 다른 단계나 기준에서 다룬다. 이 구분을 유지해야 자동 학습 경로가 불필요하게 길어지지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 구체적인 적용 예시

공통 주소 필드를 allOf로 가져오고 사업자일 때 department를 허용한 뒤 unevaluatedProperties false를 두면 두 분기에서 선언하지 않은 필드만 거절할 수 있다.

이 사례를 검증할 때는 적용 전 입력과 기준선 결과를 보존하고, ‘미평가 속성 제어’를 적용한 뒤 바뀐 설정과 중간 상태를 순서대로 기록한다. 결과 표에는 성공 여부만 두지 않고 품질, 비용, 지연, 자원, 보류·사람 개입 횟수와 남은 불확실성을 포함한다.

한 번의 성공 사례를 일반화하지 않는다. 입력 크기와 난도, 사용자 집단 또는 장치 조건을 바꾼 경계 사례를 추가하고 같은 결론이 유지되는지 확인한다. 이 예시는 원리를 설명하기 위한 검증 틀이며 특정 구현의 성능이나 모든 환경에서의 효과를 보장하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목표 정의:** ‘미평가 속성 제어’로 바꾸려는 결과와 바꾸지 않을 범위를 각각 한 문장으로 적는다.
2. **선수 확인:** [JSON 스키마 단언](/wiki/json-schema-assertion/), [JSON 스키마 어휘](/wiki/json-schema-vocabulary/)의 정의와 입력 조건을 먼저 확인한다.
3. **계약 고정:** 입력 자료형, 단위, 필수값, 출력과 실패 상태를 명시한다.
4. **기준선 저장:** 현재 방법을 같은 데이터와 예산에서 실행해 비교값을 남긴다.
5. **정상·경계·실패 시험:** 평균 사례뿐 아니라 누락, 극단값, 분포 변화와 중단을 포함한다.
6. **운영 지표 기록:** 품질, 지연 시간, 자원, 비용, 경고와 사람 개입을 함께 측정한다.
7. **재검토 조건 지정:** 데이터, 모델, 표준, 코드나 정책이 바뀌면 같은 시험을 반복한다.

최종 기록에는 출처의 기준 날짜와 위치, 실행 환경, 결과 해석, 알려진 한계, 롤백 대상과 다음 검토 조건을 포함한다. 선택한 방법이 기준선보다 낫다는 결론은 사전에 정한 성공 기준을 충족할 때만 유지한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 미평가 속성 제어의 입력, 처리 규칙과 출력을 서로 구분해 설명할 수 있는가?
- JSON 스키마 단언·JSON 스키마 어휘와 어떤 선후 관계가 있는지 사례로 설명할 수 있는가?
- 다음 한계를 실제 사례에서 찾을 수 있는가? 평가 순서와 성공 분기의 주석 수집을 지원해야 하므로 단순 검증기에서는 구현이 어렵다. false로 닫힌 스키마는 향후 필드 확장을 막으므로 버전 정책과 함께 사용한다.
- 적용 결과를 판단할 지표와 자동 처리를 중단하거나 사람에게 넘길 조건을 제시할 수 있는가?

## 문서 관계

### 선행 개념

- [JSON 스키마 단언](/wiki/json-schema-assertion/)
- [JSON 스키마 어휘](/wiki/json-schema-vocabulary/)

### 관련 문서

- [JSON 스키마 방언](/wiki/json-schema-dialect/)
- [구조화 출력](/wiki/structured-output/)
- [스키마 검증](/wiki/schema-validation/)

### 이 문서를 가리키는 문서

_해당 문서가 없다._

### 이 문서를 포함하는 코스

[프롬프트 시스템 설계](/course/prompt-systems/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[JSON Schema Core Specification Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core) — specification
2. <span id="reference-2"></span>[JSON Schema Validation Specification Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-validation) — specification
3. <span id="reference-3"></span>[JSON Schema: Dialect and Vocabulary Declaration](https://json-schema.org/understanding-json-schema/reference/schema) — documentation
4. <span id="reference-4"></span>[JSON Schema Glossary](https://json-schema.org/learn/glossary) — documentation
5. <span id="reference-5"></span>[JSON Schema Annotations](https://json-schema.org/understanding-json-schema/reference/annotations) — documentation
6. <span id="reference-6"></span>[JSON Schema Object and Unevaluated Properties](https://json-schema.org/understanding-json-schema/reference/object) — documentation

### 코스에서 계속 읽기

- **프롬프트 시스템 설계:** [다음 문서 — 스키마 검증](/wiki/schema-validation/)

---
title: "EU 고위험 AI 기록보존 EU High-Risk AI Record-Keeping"
description: "EU 고위험 AI 기록보존은 시스템이 수명주기 사건을 자동 기록하고 책임 주체가 요구 기간 동안 추적 가능한 증거를 유지하게 하는 요구사항이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">AI Act Record-Keeping · 자동 로그 기록</p>

<p class="wiki-lead">EU 고위험 AI 기록보존은 시스템이 수명주기 사건을 자동 기록하고 책임 주체가 요구 기간 동안 추적 가능한 증거를 유지하게 하는 요구사항이다.</p>

<div class="wiki-document-meta">분류: [안전·보안·윤리](/category/safety/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 개요와 핵심 정의

EU 고위험 AI 기록보존은 시스템이 수명주기 사건을 자동 기록하고 책임 주체가 요구 기간 동안 추적 가능한 증거를 유지하게 하는 요구사항이다.

EU AI Act Article 12와 제공자·배포자별 보존 조항을 기준으로 하며 분야별 법률과 개인정보 규칙이 추가될 수 있다. 어떤 로그를 누가 얼마 동안 보관하는지는 시스템 역할과 통제권을 구분해 정한다.

‘EU 고위험 AI 기록보존(EU High-Risk AI Record-Keeping)’를 검토할 때는 먼저 관할, 적용 시점, 규율 대상과 조직의 역할을 고정한다. 법률 본문, 시행령·위임 규정, 감독기관 지침은 법적 효력과 갱신 주기가 다르므로 한 문장에 섞지 않는다. 이 문서는 2026년 8월 30일 현재의 공식 자료를 바탕으로 한 학습 정보이며 개별 사건의 법률 의견을 대신하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 적용 범위와 판단 경계

자동 기록 기능은 위험 상황, 중대한 변경, 운영 기간, 입력·참조 데이터와 인간 개입을 재구성할 수 있어야 한다. 모든 원문을 영구 저장하는 것이 아니라 규정 목적에 필요한 사건과 식별자를 최소한으로 설계한다.

EU AI Act Article 12와 제공자·배포자별 보존 조항을 기준으로 하며 분야별 법률과 개인정보 규칙이 추가될 수 있다. 어떤 로그를 누가 얼마 동안 보관하는지는 시스템 역할과 통제권을 구분해 정한다.

판정표에는 시스템 또는 모델의 의도된 목적, 시장과 이용자 위치, 제공자·개발자·배포자·이용사업자의 실제 행위, 영향받는 사람과 적용 예외를 각각 적는다. 이름이나 계약상 호칭만으로 역할을 정하지 않고 누가 설계·출시·통제·사용하는지 증거로 확인한다. 적용 제외 결론에도 근거 조문, 사실 전제, 검토자와 재검토 조건을 남긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 의무와 준수 절차

위험·감사 질문에서 필요한 사건 스키마를 역설계하고 시간, 버전, 행위자, 입력 출처, 결정·출력, 감독·오류 상태를 구조화한다. 위변조 방지, 시각 동기화, 접근 통제, 보유·삭제와 내보내기 시험을 구현한다.

실행 가능한 준수 계획은 요구사항, 책임자, 기술·조직 통제, 산출 증거, 승인자, 완료 기한과 잔여 위험을 한 행에 연결한다. 공급망에서 필요한 정보가 다른 조직에 있으면 계약과 인터페이스에 제공 시점·형식·정확성·변경 통지를 명시한다. 출시 게이트는 문서 존재만 확인하지 않고 정상·경계·실패 사례에서 통제가 실제로 작동하는지 시험한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 증거와 기록 관리

로그 스키마, 생성 코드와 설정, 샘플 사건, 무결성 검증, 접근·조회 이력, 보유·삭제 시험과 조사 재현 결과를 보존한다. 공급자와 배포자 사이 로그 식별자를 연결할 계약도 필요하다.

증거에는 생성 시점, 대상 버전, 소유자, 출처, 승인 상태와 보존 기간을 붙인다. 법률·지침 버전, 제품 요구사항, 데이터·모델 계보, 시험 결과, 사람 검토와 예외를 연결하면 감독기관 질의나 사고 조사에서 당시 판단을 재구성할 수 있다. 개인정보와 영업비밀은 최소 수집·권한 분리·만료 정책을 적용하되, 삭제가 법정 보존이나 조사 의무와 충돌하는 경우 승인 절차를 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 한계와 흔한 오해

기술 로그가 많다고 설명 가능성이나 합법성이 보장되지는 않는다. 민감 입력을 그대로 저장하면 새로운 침해가 발생하고, 설명용 텍스트만 남기면 실제 실행을 재현하지 못할 수 있다.

동일한 기능도 관할, 의도된 목적, 영향의 중대성, 조직 역할과 시행 시점에 따라 결론이 달라질 수 있다. 자가진단 도구, 국제 표준, 자발적 강령과 인증은 유용한 증거지만 최신 법률의 모든 요건을 자동 충족시키는 면책 수단이 아니다. 불명확한 경우에는 가장 보수적인 임시 통제를 적용하고 공식 확인이나 전문 검토가 끝날 때까지 고위험 기능을 확대하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 감사와 재검토

정상·오류·사람 개입·모델 변경 사례를 실행해 요구 사건이 모두 남고 권한 없는 사용자가 읽거나 수정하지 못하는지 확인한다. 보존 만료와 법적 보류가 충돌할 때 승인 절차가 작동하는지도 시험한다.

1. **기준 고정:** 관할, 통합 조문·지침 버전과 적용 날짜를 기록한다.
2. **역할·범위 판정:** 시스템 목적, 시장, 이용자, 공급망 행위와 예외를 매핑한다.
3. **통제 연결:** 의무별 책임자, 기술·조직 조치, 시험과 증거를 지정한다.
4. **반례 시험:** 금지·경계·오용·사고 시나리오에서 통제와 에스컬레이션을 실행한다.
5. **운영 확인:** 실제 로그·민원·변경·사고가 평가 가정과 일치하는지 표본 추적한다.
6. **변경 관리:** 법령, 목적, 데이터, 모델, 조직 역할 또는 시장이 바뀌면 판정을 다시 승인한다.

감사 결과는 통과·실패만 기록하지 않고 확인하지 못한 정보, 임시 가정, 잔여 위험과 다음 검토 날짜를 포함한다. 긴급 조치는 서비스 제한·사람 승인·롤백 중 무엇을 언제 실행할지 미리 정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 선수 개념과 관련 개념

#### 먼저 읽을 문서

- [EU 고위험 AI 시스템](/wiki/eu-high-risk-ai-system/): 법적 범위와 통제를 이해하기 위한 선수 개념이다.
- [학습 감사 로그](/wiki/training-audit-log/): 법적 범위와 통제를 이해하기 위한 선수 개념이다.

#### 함께 비교할 문서

- [API 감사 로그](/wiki/api-audit-log/): 관할·역할·수명주기 단계가 다른 인접 개념이다.
- [AI 책임성](/wiki/ai-accountability/): 관할·역할·수명주기 단계가 다른 인접 개념이다.
- [EU 고위험 AI 사후시장 모니터링](/wiki/eu-high-risk-post-market-monitoring/): 관할·역할·수명주기 단계가 다른 인접 개념이다.

선수 관계는 개념 이해의 순서이고 관련 관계는 같은 사례를 다른 규칙이나 통제에서 보는 연결이다. 한국의 고영향 인공지능과 EU의 고위험 AI, GPAI 모델 의무와 특정 시스템 의무처럼 번역이 비슷해도 구성요건과 적용 대상이 다른 개념은 별도 문서로 대조한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 학습 체크

- EU 고위험 AI 기록보존의 관할, 적용 시점, 대상 주체와 대상 시스템을 구분해 설명할 수 있는가?
- 적용 또는 제외 결론에 필요한 사실과 공식 근거를 세 가지 이상 제시할 수 있는가?
- 요구사항을 통제, 증거, 책임자와 재검토 조건으로 바꿀 수 있는가?
- 기술 로그가 많다고 설명 가능성이나 합법성이 보장되지는 않는다. 민감 입력을 그대로 저장하면 새로운 침해가 발생하고, 설명용 텍스트만 남기면 실제 실행을 재현하지 못할 수 있다.

## 문서 관계

### 선행 개념

- [EU 고위험 AI 시스템](/wiki/eu-high-risk-ai-system/)
- [학습 감사 로그](/wiki/training-audit-log/)

### 관련 문서

- [API 감사 로그](/wiki/api-audit-log/)
- [AI 책임성](/wiki/ai-accountability/)
- [EU 고위험 AI 사후시장 모니터링](/wiki/eu-high-risk-post-market-monitoring/)

### 이 문서를 가리키는 문서

_해당 문서가 없다._

### 이 문서를 포함하는 코스

[AI 규제와 리터러시](/course/ai-regulation-literacy/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Regulation (EU) 2024/1689 - Artificial Intelligence Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) - standard
2. <span id="reference-2"></span>[Guidelines for providers and deployers of AI high-risk systems - European Commission](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-high-risk-systems) - documentation
3. <span id="reference-3"></span>[Navigating the AI Act - European Commission](https://digital-strategy.ec.europa.eu/en/faqs/navigating-ai-act) - documentation
4. <span id="reference-4"></span>[Standardisation of the AI Act - European Commission](https://digital-strategy.ec.europa.eu/en/policies/ai-act-standardisation) - documentation

### 코스에서 계속 읽기

- **AI 규제와 리터러시:** [다음 문서 — EU 고위험 AI 적합성 평가](/wiki/eu-high-risk-conformity-assessment/)

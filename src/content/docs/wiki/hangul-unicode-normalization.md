---
title: "한글 유니코드 정규화 Hangul Unicode Normalization"
description: "한글 유니코드 정규화는 완성형 음절과 조합 자모처럼 정준적으로 동등한 표현을 NFC·NFD 규칙에 따라 일관된 코드 포인트열로 바꾸는 절차다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한글 NFC·NFD 정규화 · Hangul Normalization</p>

<p class="wiki-lead">한글 유니코드 정규화는 완성형 음절과 조합 자모처럼 정준적으로 동등한 표현을 NFC·NFD 규칙에 따라 일관된 코드 포인트열로 바꾸는 절차다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 동등한 한글 표현

현대 한글 음절은 하나의 완성형 코드 포인트 또는 초성 L·중성 V·선택적 종성 T 자모열로 표현할 수 있다. 두 문자열은 화면에서 같아 보여도 바이트열과 길이가 다를 수 있다. NFC는 정준 분해 뒤 가능한 문자를 합성하고 NFD는 정준 분해 상태를 유지한다. NFKC·NFKD는 호환 문자를 추가로 접기 때문에 식별자와 원문 보존에서는 별도의 정책 판단이 필요하다.

자료 계약과 범위를 고정할 때에는 UTF-8, Unicode 버전, 허용 입력 형식과 저장·표시·검색용 문자열을 분리한 계약을 사용한다. 이 항목을 명시하지 않으면 한글 유니코드 정규화 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한글 분해와 합성

Unicode 정규화 알고리즘은 데이터베이스의 분해 매핑과 한글 전용 산술 규칙을 사용한다. 완성형 음절 인덱스에서 L·V·T를 계산해 분해하고, 합성할 때에는 L+V와 LV+T 순서를 모두 처리한다. 텍스트 분할 규칙은 자모열을 사용자 인식 문자 단위인 grapheme cluster로 묶으므로 코드 포인트 수와 화면 글자 수를 같은 값으로 가정해서는 안 된다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 L·V·T 인덱스 산술 분해와 L+V·LV+T 합성을 표준 적합성 테스트로 재현한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한글 유니코드 정규화 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 정합성 시험

Unicode가 제공하는 정규화 적합성 테스트를 통과하는지 확인하고 NFC 적용의 멱등성, 정준 동등 문자열의 동등 결과, 정규화 뒤 토큰 ID 안정성을 검사한다. 완성형·분해 자모·호환 자모·옛한글·채움 문자·결합 부호가 섞인 표본을 포함한다. 검색 키에는 정규화형을 사용하더라도 표시·감사 목적 원문은 그대로 보존하는지 시험한다.

평가표에서는 NFC 멱등성, 정준 동등쌍, 옛한글·호환 자모·채움 문자와 토큰 ID 안정성을 검사한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 호환 접기와 데이터 손실

NFKC는 폭·모양 차이를 접어 검색에는 유용할 수 있지만 원문에 의미 있는 호환 문자 정보를 잃을 수 있다. 잘못된 자모 순서나 비표준 입력은 NFC만으로 정상 음절이 되지 않으며, 입력기 전용 재해석을 Unicode 정규화의 보장으로 오해해서도 안 된다. 시스템 일부만 정규화하면 캐시 키, 서명, 중복 판정과 오프셋이 계층마다 달라진다.

안전한 실패 경계를 만들기 위해 NFKC 호환 접기로 의미 있는 문자가 합쳐지거나 일부 계층만 정규화해 키가 달라지는 조건을 차단한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 파이프라인 계약

수집 경계에서 원문 인코딩과 정규화 형식을 기록하고, 검색·중복 제거·토큰화가 어떤 형식을 요구하는지 명시한다. 정규화 전후 코드 포인트와 바이트 길이, grapheme 경계를 회귀 데이터로 남긴다. 해시나 전자서명 전에 문자열을 임의로 정규화하지 않으며 외부 시스템과 키를 교환할 때에는 양쪽이 같은 버전과 형식을 사용하는지 확인한다.

운영 환경에서는 데이터베이스·검색·캐시·모델 전처리의 정규화 버전과 키 충돌·길이 변화를 관측한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 문자 분할과의 구분

정규화는 정준적으로 동등한 코드 포인트열을 선택하는 변환이고 텍스트 분할은 그 결과에서 문자·단어·문장 경계를 정하는 알고리즘이다. 바이트 단위 토큰화는 어떤 문자열도 표현할 수 있지만 정규화가 다르면 다른 바이트열을 만든다. 한국어 토큰화는 이 차이를 모델 어휘와 시퀀스 길이 문제로 이어서 다룬다.

학습 확인에서는 완성형 음절을 자모로 분해·합성하고 NFC와 NFKC, grapheme과 코드 포인트 차이를 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [문자 단위 토큰화](/wiki/character-tokenization/)

### 관련 문서

- [한국어 토큰화](/wiki/korean-tokenization/)
- [한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)
- [바이트 단위 토큰화](/wiki/byte-level-tokenization/)

### 이 문서를 가리키는 문서

- [한국어 문장 분할](/wiki/korean-sentence-segmentation/)
- [한국어 언어 식별](/wiki/korean-language-identification/)
- [한국어 토큰화](/wiki/korean-tokenization/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Unicode Standard Annex #15: Unicode Normalization Forms](https://www.unicode.org/reports/tr15/) - standard
2. <span id="reference-2"></span>[Unicode Standard Annex #29: Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) - standard
3. <span id="reference-3"></span>[Unicode Technical Report #47: Korean Processing Forms](https://www.unicode.org/L2/L2009/09052-tr47.html) - standard
4. <span id="reference-4"></span>[한국어 어문 규범](https://www.korean.go.kr/kornorms/main/main.do) - documentation

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 문장 분할](/wiki/sentence-segmentation/)

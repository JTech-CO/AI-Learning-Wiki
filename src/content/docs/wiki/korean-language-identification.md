---
title: "한국어 언어 식별 Korean Language Identification"
description: "한국어 언어 식별은 문서·문장·토큰이 한국어인지, 또는 다른 언어와 혼용되었는지를 문자와 문맥 단서로 판정하는 과제다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 식별 · Korean Language ID</p>

<p class="wiki-lead">한국어 언어 식별은 문서·문장·토큰이 한국어인지, 또는 다른 언어와 혼용되었는지를 문자와 문맥 단서로 판정하는 과제다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 문서와 토큰 수준 식별

문서 수준 식별은 대표 언어 하나를 반환하지만 코드 스위칭 입력은 토큰·구간마다 언어 라벨이 필요하다. 한글 포함 여부는 강한 단서지만 숫자·URL·이모티콘만 있는 메시지, 로마자로 적은 한국어, 한자와 공통 고유명사는 문자 집합만으로 판정할 수 없다. 결과에는 언어 코드와 신뢰도, 판정 단위를 함께 제공해야 한다.

자료 계약과 범위를 고정할 때에는 언어 코드, 문자 범위, 판정 단위, 신뢰도와 unknown·mixed 상태를 반환하고 대표 언어 강제를 피한다. 이 항목을 명시하지 않으면 한국어 언어 식별 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 문자·n-gram·문맥 모델

가벼운 식별기는 문자 n-gram 분포를 학습하고 짧은 입력에서는 주변 메시지와 사용자 언어 설정을 보조 단서로 쓴다. 코드 혼용 모델은 각 토큰의 문자 형태와 양방향 문맥을 결합해 세밀한 언어 라벨을 예측한다. 한국어는 한글 음절·자모를 정규화하고 외래어·라틴 약어를 별도 범주로 처리해야 과도한 언어 전환을 줄일 수 있다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 문자 n-gram과 문맥을 결합하되 프로필 국적이 아닌 현재 요청·사용자 명시 언어를 보조 단서로 쓴다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어 언어 식별 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 길이·혼용별 성능

언어별 정밀도·재현율과 혼동 행렬을 보고하고 입력 길이, 문자 비율, 코드 스위칭 수준별 결과를 나눈다. 단일 단어·제품명·주소·숫자만 있는 경계 사례와 한글 자모가 분해된 입력을 포함한다. 문서 수준 정확도만 높아도 토큰 경계가 틀리면 번역·검색·출력 언어 선택이 실패할 수 있으므로 구간 F1도 평가한다.

평가표에서는 길이·한글 비율·숫자·URL·고유명사·자모·혼용 수준별 macro F1과 구간 F1을 측정한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 짧은 입력과 문자 공유

“AI”, “OK”, 사람 이름처럼 여러 언어에서 같은 문자열은 본문만으로 식별 불가능할 수 있다. 외래어가 많은 한국어를 영어로, 로마자 한국어를 영어로, 옛한글·방언 표기를 미지원 언어로 오인할 수 있다. 신뢰도가 낮은데 하나의 언어를 강제로 고르면 잘못된 번역과 안전 정책을 적용할 위험이 있다.

안전한 실패 경계를 만들기 위해 짧은 공통 문자열, 로마자 한국어와 미지원 언어를 가장 가까운 언어로 강제 분류하는 실패를 보류한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 라우팅과 보류

식별 결과를 번역기·검색 인덱스·모델 라우팅에 사용할 때에는 최소 신뢰도와 다중 언어 반환 규칙을 둔다. 사용자가 지정한 언어를 강한 단서로 존중하되 실제 내용과 충돌하면 확인 질문을 제공한다. 새 도메인 로그에서 낮은 확신과 언어 전환 사례를 익명 표본화해 회귀 세트를 갱신하고 라우팅 오류의 하류 비용을 함께 측정한다.

운영 환경에서는 예측 코드·신뢰도·라우팅·사용자 수정만 최소 집계하고 번역·검색 하류 오류 비용을 추적한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 출력 언어 결정과의 구분

언어 식별은 입력에 어떤 언어가 나타났는지 추정하고 출력 언어 정렬은 사용자가 어떤 언어의 답을 기대하는지 추론한다. 두 값은 코드 스위칭에서 다를 수 있다. Unicode 정규화는 문자 표현을 안정화하고 다국어 능력은 선택된 언어에서 과제를 수행하는 품질을 다룬다.

학습 확인에서는 한영 혼용 입력을 구간 표지하고 unknown 임곗값 변화가 오분류와 보류율에 주는 영향을 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [다국어 언어 모델](/wiki/multilingual-language-model/)

### 관련 문서

- [한국어·영어 코드 스위칭](/wiki/korean-english-code-switching/)
- [한글 유니코드 정규화](/wiki/hangul-unicode-normalization/)
- [다국어 능력](/wiki/multilingual-capability/)

### 이 문서를 가리키는 문서

- [한국어 방언 강건성](/wiki/korean-dialect-robustness/)
- [한국어 출력 언어 정렬](/wiki/korean-output-language-alignment/)
- [한국어·영어 코드 스위칭](/wiki/korean-english-code-switching/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[A Fast, Compact, Accurate Model for Language Identification of Codemixed Text](https://aclanthology.org/D18-1030/) - paper
2. <span id="reference-2"></span>[OLA: Output Language Alignment in Code-Switched LLM Interactions](https://aclanthology.org/2026.acl-long.2162/) - paper
3. <span id="reference-3"></span>[Unicode Standard Annex #29: Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) - standard

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 다국어 토큰 분절률](/wiki/multilingual-token-fertility/)

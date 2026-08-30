---
title: "한국어 형태소 분석 Korean Morphological Analysis"
description: "한국어 형태소 분석은 어절을 어간·어미·조사·접사 같은 최소 기능 단위로 나누고 각 단위의 품사와 문법 정보를 판정하는 처리다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 형태 분석 · Korean Morpheme Analysis</p>

<p class="wiki-lead">한국어 형태소 분석은 어절을 어간·어미·조사·접사 같은 최소 기능 단위로 나누고 각 단위의 품사와 문법 정보를 판정하는 처리다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 정의와 분석 단위

한국어는 하나의 어절에 체언과 조사, 용언 어간과 여러 어미가 결합할 수 있는 교착어적 성격이 강하다. 형태소 분석기는 공백으로 나뉜 어절을 그대로 단어로 간주하지 않고 가능한 분해와 품사열을 만든 뒤 문맥에 맞는 해석을 고른다. 예를 들어 “갔었다”는 표면 문자열 하나지만 어간과 과거·회상 계열 선어말 어미, 종결 어미를 구분해야 검색·구문 분석·생성 평가에서 같은 기능을 비교할 수 있다.

자료 계약과 범위를 고정할 때에는 원문 어절 범위, 형태소 표면형·원형, 품사 체계, 후보 순위와 미등록 상태를 별도 필드로 보존한다. 이 항목을 명시하지 않으면 한국어 형태소 분석 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 후보 생성과 문맥 판정

사전 기반 분석은 어휘와 결합 제약으로 후보를 열거하고 통계·신경망 기반 분석은 음절·자모·부분어 표현에서 경계와 품사를 함께 예측한다. 불규칙 활용과 축약은 표면형을 원형으로 복원하는 규칙이 필요하며, 신조어·고유명사는 미등록어 경로로 처리한다. 최근 언어 모델 파이프라인에서는 형태소 분석을 부분어 토큰화의 전처리로 쓰거나 품사 특징을 별도 입력으로 결합하기도 한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 사전 후보 생성, 불규칙 활용 복원, 문맥 판정과 n-best 반환을 단계별로 추적한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어 형태소 분석 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 평가와 오류 분석

평가는 형태소 경계, 원형 복원, 품사 태그를 각각 측정해야 한다. 전체 정확도만 보면 조사·어미처럼 빈도가 높은 범주가 고유명사와 복합어의 실패를 가릴 수 있으므로 품사별 F1, 미등록어 재현율, 어절 완전 일치율을 함께 본다. 띄어쓰기 오류가 있는 원문과 규범 표기 원문을 분리하고 뉴스·대화·민원·전문 문서처럼 장르별 결과도 보고해야 한다.

평가표에서는 경계·품사·원형 복원 오류를 분리하고 규범문·구어·고유명사·띄어쓰기 오류 집단을 각각 측정한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 실패 양상과 해석 경계

동형이의 형태, 생략된 성분, 구어 축약, 이모티콘과 영문 혼용은 후보 수를 늘리고 문맥 판정을 어렵게 한다. 분석기마다 품사 체계와 복원 정책이 달라 같은 문장을 다른 단위로 반환할 수 있으므로 출력 개수만 비교해서는 안 된다. 형태소 분석 결과는 언어학적 유일한 정답이라기보다 특정 태그셋과 응용 목적에 따른 해석이며, 생성 모델의 의미 이해를 자동으로 보장하지 않는다.

안전한 실패 경계를 만들기 위해 동형이의 형태와 신조어에서 단일 분석을 강제하지 않고 하류 과제에 불확실성을 전달한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 실무 적용과 검증

도입 전에 태그셋, 원형 복원 여부, 공백 보존 방식과 미등록어 표기를 데이터 계약으로 고정한다. 실제 입력에서 규범 문장뿐 아니라 붙여쓰기·띄어쓰기 변이, 사람 이름, 제품명, 숫자·단위, 한국어·영어 혼용 표본을 층화해 회귀 세트를 만든다. 검색 색인이나 개체명 인식에 연결할 때에는 원문 오프셋으로 역매핑할 수 있는지 확인하고 분석기 버전 변경 전후의 경계 이동을 추적한다.

운영 환경에서는 미등록어율, 평균 후보 수, 원문 오프셋 복원 실패와 하류 NER·검색 성능을 함께 관측한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 토큰화와의 구분

형태소 분석은 문법 기능과 원형을 추론하는 언어 분석이고, 부분어 토큰화는 고정 어휘로 문자열을 모델 식별자에 매핑하는 계산 절차다. 형태소 경계를 먼저 찾은 뒤 BPE를 적용할 수 있지만 두 결과가 항상 일치하는 것은 아니다. 문장 분할은 더 큰 경계를, 띄어쓰기 정규화는 입력 표면을 다루므로 처리 순서와 오류 전파를 별도로 기록해야 한다.

학습 확인에서는 같은 어절의 형태소열과 부분어열을 비교하고 분석 후보가 둘일 때 필요한 문맥 증거를 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [토큰화](/wiki/tokenization/)
- [한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)

### 관련 문서

- [한국어 토큰화](/wiki/korean-tokenization/)
- [한국어 문장 분할](/wiki/korean-sentence-segmentation/)
- [KLUE](/wiki/klue/)

### 이 문서를 가리키는 문서

- [한국어 개인정보 탐지](/wiki/korean-pii-detection/)
- [한국어 개체명 인식](/wiki/korean-named-entity-recognition/)
- [한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)
- [한국어 문장 분할](/wiki/korean-sentence-segmentation/)
- [한국어 토큰화](/wiki/korean-tokenization/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[An Empirical Study of Tokenization Strategies for Various Korean NLP Tasks](https://arxiv.org/abs/2010.02534) - paper
2. <span id="reference-2"></span>[Korean Language Modeling via Syntactic Guide](https://aclanthology.org/2022.lrec-1.304/) - paper
3. <span id="reference-3"></span>[KLUE: Korean Language Understanding Evaluation](https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/98dce83da57b0395e163467c9dae521b-Abstract-round2.html) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 한국어 토큰화](/wiki/korean-tokenization/)

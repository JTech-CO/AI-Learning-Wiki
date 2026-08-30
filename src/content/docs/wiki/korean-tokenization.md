---
title: "한국어 토큰화 Korean Tokenization"
description: "한국어 토큰화는 한글 음절·자모·어절·형태소와 부분어 어휘 사이의 경계를 정해 한국어 문자열을 모델 토큰열로 바꾸는 절차다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 부분어 토큰화 · Korean Subword Tokenization</p>

<p class="wiki-lead">한국어 토큰화는 한글 음절·자모·어절·형태소와 부분어 어휘 사이의 경계를 정해 한국어 문자열을 모델 토큰열로 바꾸는 절차다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 한국어 토큰화의 선택지

한국어 텍스트는 공백 어절, 형태소, 완성형 음절, 자모, UTF-8 바이트 중 어느 단위를 먼저 보느냐에 따라 토큰열이 크게 달라진다. 모델 어휘는 이 단위에 BPE·유니그램 같은 부분어 학습을 결합해 만들어진다. 토크나이저의 목적은 단순히 문자열을 자르는 것이 아니라 미등록 문자열을 안정적으로 표현하면서 문법적 경계, 어휘 크기, 시퀀스 길이와 복원 가능성 사이의 균형을 잡는 것이다.

자료 계약과 범위를 고정할 때에는 Unicode 형식, 공백 보존, 형태소 사전 분절, 부분어 알고리즘, 어휘 크기와 토크나이저 해시를 고정한다. 이 항목을 명시하지 않으면 한국어 토큰화 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 전처리와 부분어 학습

한국어 전용 설계는 공백과 문장부호를 보존한 채 형태소 분석 결과를 사전 분절로 넣거나, 완성형 음절·자모를 정규화한 뒤 부분어 병합을 학습한다. 다국어 모델은 모든 언어가 공유하는 어휘에서 빈도 기반으로 토큰을 배분하므로 한국어 말뭉치 비율이 낮으면 같은 의미가 더 긴 토큰열이 될 수 있다. 추론에서는 학습 때와 동일한 정규화·사전 분절·특수 토큰 규칙을 적용해야 한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 형태소+BPE, 음절·자모, 바이트 경로에서 원문이 ID열로 바뀌고 다시 복원되는 단계를 기록한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어 토큰화 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 효율과 과제 성능 평가

평균 토큰 수만 비교하지 말고 어절당 토큰 수인 fertility, 계속 조각 비율, 미등록 바이트 비율, 역복원 정확도와 최대 길이 초과율을 측정한다. 형태소 태깅·개체명 인식·기계독해·생성 과제별 성능도 같이 봐야 한다. KLUE 연구처럼 형태소 수준 사전 분절이 일부 태깅·탐지 과제에 유리할 수 있지만, 다른 과제와 모델 규모에서 같은 결론을 가정해서는 안 된다.

평가표에서는 fertility, p95 길이, 역복원 오류, 문맥 초과율과 형태 태깅·기계독해 성능을 같은 표에서 비교한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 경계 손실과 분포 편향

정규화 형식이 섞이면 시각적으로 같은 한글이 다른 토큰열이 되고, 드문 고유명사나 신조어는 과도하게 잘릴 수 있다. 형태소 분석기 의존 설계는 분석 오류와 사전 갱신 비용을 상속하며, 공백을 제거하는 전처리는 원문 오프셋 복원을 어렵게 한다. 영어 중심 공유 어휘는 한국어에 토큰 비용과 문맥 창 손실을 불균등하게 부과할 수 있다.

안전한 실패 경계를 만들기 위해 드문 이름·방언·한영 혼용이 과분절되거나 정규화 차이로 다른 ID가 되는 조건을 중단 사례로 둔다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 토크나이저 선정 절차

후보 토크나이저를 동일한 한국어 표본과 모델 입력 형식에서 실행해 길이 분포를 비교한다. 표본은 규범 문장, 구어체, 방언, 코드 스위칭, 이름·주소·숫자, 자모 입력과 오탈자를 포함해야 한다. 학습·평가·서빙에서 토크나이저 파일과 정규화 설정의 해시를 고정하고, 교체 시 임베딩 크기와 체크포인트 호환성뿐 아니라 기존 프롬프트의 토큰 예산 변화도 회귀 시험한다.

운영 환경에서는 서빙의 언어별 토큰 비용과 문맥 잘림을 관측하고 토크나이저 교체는 체크포인트와 함께 버전 배포한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 일반 토큰화와의 관계

일반 토큰화 문서는 문자열과 토큰 식별자의 공통 계약을 설명한다. 한국어 토큰화는 그 계약에 교착 형태, 띄어쓰기 변이, 한글 조합과 언어별 어휘 배분 문제를 추가한다. 형태소 분석은 의미 있는 경계를 제안하지만 모델 토큰 ID를 직접 정의하지 않으며, 다국어 token fertility는 선택 결과가 언어 간 비용과 성능에 어떤 차이를 만드는지 측정하는 지표다.

학습 확인에서는 같은 문장을 세 방식으로 분절하고 토큰 수가 적어도 과제 품질을 보장하지 않는 반례를 제시한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [토큰화](/wiki/tokenization/)
- [한국어 형태소 분석](/wiki/korean-morphological-analysis/)

### 관련 문서

- [바이트 페어 인코딩](/wiki/byte-pair-encoding/)
- [다국어 토큰 분절률](/wiki/multilingual-token-fertility/)
- [한글 유니코드 정규화](/wiki/hangul-unicode-normalization/)

### 이 문서를 가리키는 문서

- [다국어 토큰 분절률](/wiki/multilingual-token-fertility/)
- [한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)
- [한국어 방언 강건성](/wiki/korean-dialect-robustness/)
- [한국어 형태소 분석](/wiki/korean-morphological-analysis/)
- [한국어·영어 코드 스위칭](/wiki/korean-english-code-switching/)

<details class="wiki-backlinks-more">
<summary>나머지 1개 문서 보기</summary>

- [한글 유니코드 정규화](/wiki/hangul-unicode-normalization/)

</details>

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[An Empirical Study of Tokenization Strategies for Various Korean NLP Tasks](https://arxiv.org/abs/2010.02534) - paper
2. <span id="reference-2"></span>[Morpheme Matters: Morpheme-Based Subword Tokenization for Korean Language Models](https://aclanthology.org/2026.eacl-short.22/) - paper
3. <span id="reference-3"></span>[KLUE: Korean Language Understanding Evaluation](https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/98dce83da57b0395e163467c9dae521b-Abstract-round2.html) - paper
4. <span id="reference-4"></span>[Korean Language Modeling via Syntactic Guide](https://aclanthology.org/2022.lrec-1.304/) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 학습 말뭉치](/wiki/training-corpus/)

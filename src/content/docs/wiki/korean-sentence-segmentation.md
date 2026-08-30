---
title: "한국어 문장 분할 Korean Sentence Segmentation"
description: "한국어 문장 분할은 종결 어미·문장부호·인용·대화 문맥을 이용해 한국어 연속 텍스트에서 문장 경계를 판정하는 처리다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 문장 경계 탐지 · Korean Sentence Boundary Detection</p>

<p class="wiki-lead">한국어 문장 분할은 종결 어미·문장부호·인용·대화 문맥을 이용해 한국어 연속 텍스트에서 문장 경계를 판정하는 처리다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 문장 경계의 한국어 단서

한국어 문장은 마침표만으로 끝나지 않고 “-다”, “-요”, “-까” 같은 종결 어미, 줄바꿈, 따옴표와 대화 차례가 경계 단서가 된다. 반대로 마침표는 소수점·약어·목록 번호·URL 안에서도 나타난다. 문장 분할기는 표면 문장부호와 형태·구문 단서를 결합해 뒤 문맥이 새 문장의 시작인지 판단해야 한다.

자료 계약과 범위를 고정할 때에는 문장 문자열뿐 아니라 원문 시작·끝, 경계 신호, 신뢰도, HTML·표·대화 턴의 구조 위치를 반환한다. 이 항목을 명시하지 않으면 한국어 문장 분할 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 규칙과 학습 기반 분할

규칙 기반 분할은 종결 문자, 괄호·따옴표 균형과 예외 목록을 순서대로 적용한다. 학습 기반 분할은 각 문자나 어절 경계에 문장 종료 확률을 예측하고 주변 형태소와 품사 정보를 특징으로 쓸 수 있다. 대화에서는 화자 변경과 메시지 경계를 별도 신호로 두며, 문서 구조가 있는 HTML·마크다운에서는 제목·목록·표 셀을 평문과 같은 규칙으로 합치지 않는다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 종결 어미·문장부호·인용 균형·화자 전환을 결합하고 형태 분석 실패 때에도 경계 후보를 보존한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어 문장 분할 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 경계 단위 평가

정답 경계의 정밀도·재현율·F1과 문서 단위 완전 일치를 측정한다. 뉴스, 메신저, 민원, 구어 전사, 목록과 표를 나눠 결과를 보고하고 경계 누락과 과분할을 구분한다. RAG 청크나 번역 단위로 쓸 경우에는 분할 점수뿐 아니라 답 근거 회수율, 번역 누락률과 문맥 길이 변화까지 하류 지표로 확인한다.

평가표에서는 경계 F1과 문서 완전 일치, 장르별 과분할·미분할, RAG 근거 회수율을 분리해 측정한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 인용·생략·비정형 문장

따옴표 안 질문 뒤에 서술이 이어지거나 주어·서술어가 생략된 짧은 대화에서는 국소 문장부호만으로 경계를 판정하기 어렵다. 이모티콘, 반복 부호, 줄바꿈 없는 음성 인식 결과와 마침표 없는 제목도 오류를 만든다. 과분할은 대명사와 생략된 논항의 문맥을 끊고, 미분할은 검색 청크와 모델 입력을 불필요하게 키운다.

안전한 실패 경계를 만들기 위해 URL·소수·목록의 마침표와 줄바꿈 없는 ASR, PDF 줄바꿈을 문장 종료로 오인하는 조건을 시험한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 도메인별 분할 정책

문서 종류별로 허용할 경계 신호와 예외를 선언하고 원문 문자 오프셋을 보존한다. 인용·괄호·소수·URL·목록·메신저 말풍선·ASR 전사를 포함한 고정 회귀 세트를 만든다. 모델 기반 분할의 확률이 애매한 구간은 임의로 삭제하지 말고 경계 후보로 남기며, 하류 청킹에서 문맥 중첩으로 위험을 완화한다.

운영 환경에서는 평균·p99 문장 길이, 청크 수, 인용·괄호 실패 표본을 관측하고 입력 형식 변경 때 회귀한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 일반 문장 분할과의 관계

일반 문장 분할은 언어 독립적인 문장부호와 Unicode 기본 경계를 제공한다. 한국어 문장 분할은 종결 어미와 어절·형태소 분석, 대화 관습을 추가한다. 화행 분류는 분할된 발화가 질문·요청·진술 중 무엇인지 다루므로 경계 탐지와 목적이 다르지만 오류가 서로 전파될 수 있다.

학습 확인에서는 인용과 보고 구문이 이어지는 문장을 분할하고 일반 경계와 한국어 종결 단서의 우선순위를 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [문장 분할](/wiki/sentence-segmentation/)
- [한글 유니코드 정규화](/wiki/hangul-unicode-normalization/)

### 관련 문서

- [한국어 형태소 분석](/wiki/korean-morphological-analysis/)
- [한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)
- [한국어 높임말과 화행](/wiki/korean-honorifics-and-speech-acts/)

### 이 문서를 가리키는 문서

- [한국어 높임말과 화행](/wiki/korean-honorifics-and-speech-acts/)
- [한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)
- [한국어 형태소 분석](/wiki/korean-morphological-analysis/)
- [KorQuAD](/wiki/korquad/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Unicode Standard Annex #29: Unicode Text Segmentation](https://www.unicode.org/reports/tr29/) - standard
2. <span id="reference-2"></span>[KLUE: Korean Language Understanding Evaluation](https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/98dce83da57b0395e163467c9dae521b-Abstract-round2.html) - paper
3. <span id="reference-3"></span>[Korean Language Modeling via Syntactic Guide](https://aclanthology.org/2022.lrec-1.304/) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 한국어 띄어쓰기 변이](/wiki/korean-word-spacing-variation/)

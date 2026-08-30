---
title: "KLUE Korean Language Understanding Evaluation"
description: "KLUE는 한국어 자연어 이해를 주제 분류·문장 유사도·추론·개체명·관계·의존 구문·기계독해·대화 상태 추적의 여덟 과제로 평가하는 벤치마크다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 언어 이해 평가 · KLUE 벤치마크</p>

<p class="wiki-lead">KLUE는 한국어 자연어 이해를 주제 분류·문장 유사도·추론·개체명·관계·의존 구문·기계독해·대화 상태 추적의 여덟 과제로 평가하는 벤치마크다.</p>

<div class="wiki-document-meta">분류: [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 구성과 목적

KLUE는 한국어 NLU의 서로 다른 능력을 하나의 점수만으로 축약하지 않고 여덟 과제로 나눈다. 과제는 주제 분류, 의미 유사도, 자연어 추론, 개체명 인식, 관계 추출, 의존 구문 분석, 기계독해와 대화 상태 추적이다. 저작권과 개인정보·유해성 문제를 고려한 데이터 구축, 과제별 주석 지침과 재현 가능한 기준 모델을 함께 제공하는 것이 핵심이다.

자료 계약과 범위를 고정할 때에는 여덟 과제의 원천·라벨·분할·라이선스와 데이터·평가 스크립트·체크포인트 리비전을 각각 고정한다. 이 항목을 명시하지 않으면 KLUE 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 데이터와 과제별 학습

각 데이터셋은 서로 다른 원천 말뭉치와 출력 형식을 사용하므로 모델은 공통 사전학습 표현 위에 과제별 헤드를 미세조정한다. 개체명·구문 과제는 토큰 또는 형태소 경계 정렬이 중요하고 기계독해는 문맥에서 답 범위를 찾는다. 연구는 KLUE-BERT와 KLUE-RoBERTa 기준 모델과 토크나이저 조합을 공개해 과제별 재현을 지원한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 토큰 과제와 문장 과제의 헤드·손실·길이·마스크가 다름을 반영해 공통 인코더와 과제별 처리를 분리한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 KLUE 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 과제별 지표 읽기

분류 정확도·F1, 유사도 상관, 개체 범위 F1, 기계독해 EM·F1처럼 과제마다 지표가 다르다. 종합 결과를 만들더라도 원점수의 척도와 불확실성을 숨기지 말고 과제별 결과를 먼저 보고한다. 데이터 버전, 전처리, 최대 길이, 토크나이저와 미세조정 시드를 고정해야 기준 모델과 비교할 수 있다.

평가표에서는 과제별 원 지표·표본 수·시드 평균과 편차를 보고하고 종합점수 정규화·가중치를 공개한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 범위와 오염 위험

KLUE의 높은 점수는 한국어 생성, 사실성, 장문 추론, 방언과 최신 지식을 모두 보장하지 않는다. 공개 데이터는 사전학습이나 지시학습에 섞여 시험 오염이 생길 수 있고, 비슷한 원천 문서가 분할 사이에 남으면 일반화가 과대평가된다. 여덟 과제의 평균이 특정 도메인의 낮은 성능을 가릴 수 있다.

안전한 실패 경계를 만들기 위해 공개 시험 오염, 원천·주석 편향과 여덟 과제 밖 생성·최신지식·방언 능력의 부재를 해석 한계로 둔다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 재현 가능한 사용

공식 저장소의 데이터·평가 스크립트 버전을 기록하고 훈련·개발·시험 사용 규칙을 지킨다. 목표 서비스가 요구하는 과제와 KLUE 과제의 출력 계약을 먼저 매핑하고, 부족한 방언·구어·전문 문서·생성 안전 평가는 별도 데이터로 보완한다. 결과 표에는 모델·토크나이저·프롬프트·미세조정 설정과 시험 오염 점검을 포함한다.

운영 환경에서는 서비스 요구를 KLUE 과제에 매핑하고 대응하지 않는 안전·근거성 요구는 별도 비공개 시험으로 보완한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### KMMLU·KorQuAD와의 구분

KLUE는 다양한 한국어 NLU 과제를 묶은 평가군이고 KMMLU는 전문 분야의 객관식 지식·문제 해결, KorQuAD는 문서에서 답 범위를 찾는 기계독해에 집중한다. KLUE 안에도 기계독해 과제가 있지만 데이터 원천과 지침, 평가 스크립트가 다르므로 점수를 직접 대체할 수 없다.

학습 확인에서는 세 과제의 입력·출력·지표를 구분하고 공개 데이터 오염을 의심할 신호와 완화 설계를 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [벤치마크](/wiki/benchmark/)
- [다국어 평가 프로토콜](/wiki/multilingual-evaluation-protocol/)

### 관련 문서

- [한국어 개체명 인식](/wiki/korean-named-entity-recognition/)
- [KorQuAD](/wiki/korquad/)
- [KMMLU](/wiki/kmmlu/)

### 이 문서를 가리키는 문서

- [한국어 개인정보 탐지](/wiki/korean-pii-detection/)
- [한국어 개체명 인식](/wiki/korean-named-entity-recognition/)
- [한국어 형태소 분석](/wiki/korean-morphological-analysis/)
- [KMMLU](/wiki/kmmlu/)
- [Ko-H5 벤치마크](/wiki/ko-h5-benchmark/)

<details class="wiki-backlinks-more">
<summary>나머지 1개 문서 보기</summary>

- [KorQuAD](/wiki/korquad/)

</details>

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[KLUE: Korean Language Understanding Evaluation](https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/98dce83da57b0395e163467c9dae521b-Abstract-round2.html) - paper
2. <span id="reference-2"></span>[KLUE: Korean Language Understanding Evaluation (arXiv)](https://arxiv.org/abs/2105.09680) - paper
3. <span id="reference-3"></span>[KLUE Benchmark Repository](https://github.com/KLUE-benchmark/KLUE) - documentation

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — KorQuAD](/wiki/korquad/)

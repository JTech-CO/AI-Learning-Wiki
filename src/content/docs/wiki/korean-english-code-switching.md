---
title: "한국어·영어 코드 스위칭 Korean-English Code-Switching"
description: "한국어·영어 코드 스위칭은 한 발화나 대화 안에서 두 언어가 단어·구·문장 단위로 번갈아 나타나는 사용 양상과 처리 문제다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한영 코드 스위칭 · Korean-English Code Mixing</p>

<p class="wiki-lead">한국어·영어 코드 스위칭은 한 발화나 대화 안에서 두 언어가 단어·구·문장 단위로 번갈아 나타나는 사용 양상과 처리 문제다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 혼용 수준과 기능

코드 스위칭은 “이 API 응답 너무 slow해”처럼 문장 안에서 섞이는 경우, 구·문장 경계에서 바뀌는 경우와 대화 턴마다 언어가 바뀌는 경우를 포함한다. 차용어와 고정된 외래어, 단순 번역 오류와 구분해야 한다. 화자는 주제, 전문 용어, 정체성, 상대방과의 관계에 따라 언어를 선택하므로 입력의 다수 문자만으로 의도한 답변 언어를 결정하기 어렵다.

자료 계약과 범위를 고정할 때에는 전환 단위, 구간 언어, 차용어 여부, 대화 역할과 기대 출력 언어를 함께 주석한다. 이 항목을 명시하지 않으면 한국어·영어 코드 스위칭 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 표현과 언어 단서

처리기는 문자·부분어·단어 단위 언어 식별을 수행하고 양쪽 언어의 문맥 표현을 같은 추론에 결합한다. 음성에서는 한 발화의 언어 전환 위치와 차용어를 함께 표지한다. 생성 모델은 지시문 언어, 질문의 핵심 내용, 대화 이력과 명시적 선호를 바탕으로 출력 언어를 선택해야 하며 필요하면 전문 용어만 원어로 유지한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 문자·토큰 언어 식별과 지시·본문·인용·코드 역할을 결합해 혼용 문맥 표현을 만든다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어·영어 코드 스위칭 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 계층별 평가

단어·구·문장 수준 전환을 나눠 언어 식별 F1, 의미 이해 정확도, 출력 언어 준수율과 중간 응답 언어 전환율을 측정한다. 단일 언어 입력과 같은 내용을 섞어 쓴 입력을 짝지어 지식 접근과 답 품질 차이를 비교한다. 음성은 일반 단어 오류율만으로 부족하므로 전환 수준과 차용어별 오류를 별도로 보고한다.

평가표에서는 단일 언어 대조쌍과 단어·구·문장 전환에서 의미 정확도, 언어 준수, 중간 전환과 토큰 비용을 측정한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 언어 혼동과 지식 편향

모델은 지시문의 짧은 영어 단어에 과도하게 반응하거나 질문 내용 언어만 따라 사용자가 기대하지 않은 언어로 답할 수 있다. 응답 도중 언어가 바뀌거나 한국어 문장에 불필요한 영어를 삽입하는 현상도 발생한다. 영어 표현이 포함되었다는 이유만으로 영어권 지식을 우선하면 한국 맥락의 사실과 관습을 놓칠 수 있다.

안전한 실패 경계를 만들기 위해 영어 한 단어에 과민 반응하거나 한국 맥락 지식을 잃고 전문 용어를 불필요하게 번역하는 실패를 시험한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 혼용 입력 계약

서비스는 출력 언어 기본값과 원어 용어 유지 규칙을 명시하고 사용자가 선택을 덮어쓸 수 있게 한다. 실제 한영 혼용 패턴을 단어·구·문장 수준으로 층화해 평가하며 전문 분야별 약어와 고유명사를 포함한다. 언어 선택 신뢰도가 낮으면 질문 내용을 바꾸지 말고 선호 언어를 확인하고, 번역이나 정규화 전 원문을 보존한다.

운영 환경에서는 출력 언어 오류·지식 오류·중간 전환을 분리 집계하고 언어 선택이 개인 특성 추정으로 이어지지 않게 한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 다국어 능력과의 차이

다국어 능력은 여러 언어에서 과제를 수행하는 넓은 역량이고 코드 스위칭 처리는 한 입력 안의 전환과 화용 단서를 다룬다. 언어 식별은 각 구간의 언어를 표지하지만 어떤 언어로 답해야 하는지는 출력 언어 정렬 문제다. 토큰화는 혼용 문자열의 비용과 경계 안정성에 영향을 주지만 의도를 직접 결정하지 않는다.

학습 확인에서는 혼용 질문을 구간 표지하고 명시 요청과 다수 언어가 충돌할 때의 우선순위와 확인 질문을 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [다국어 언어 모델](/wiki/multilingual-language-model/)
- [한국어 언어 식별](/wiki/korean-language-identification/)

### 관련 문서

- [한국어 출력 언어 정렬](/wiki/korean-output-language-alignment/)
- [다국어 능력](/wiki/multilingual-capability/)
- [한국어 토큰화](/wiki/korean-tokenization/)

### 이 문서를 가리키는 문서

- [한국어 언어 식별](/wiki/korean-language-identification/)
- [한국어 출력 언어 정렬](/wiki/korean-output-language-alignment/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[OLA: Output Language Alignment in Code-Switched LLM Interactions](https://aclanthology.org/2026.acl-long.2162/) - paper
2. <span id="reference-2"></span>[HiKE: Hierarchical Evaluation Framework for Korean-English Code-Switching Speech Recognition](https://aclanthology.org/2026.findings-eacl.33/) - paper
3. <span id="reference-3"></span>[Can Code-Switched Texts Activate a Knowledge Switch in LLMs?](https://aclanthology.org/2025.findings-emnlp.1215/) - paper
4. <span id="reference-4"></span>[A Fast, Compact, Accurate Model for Language Identification of Codemixed Text](https://aclanthology.org/D18-1030/) - paper
5. <span id="reference-5"></span>[mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer](https://arxiv.org/abs/2010.11934) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 한국어 출력 언어 정렬](/wiki/korean-output-language-alignment/)

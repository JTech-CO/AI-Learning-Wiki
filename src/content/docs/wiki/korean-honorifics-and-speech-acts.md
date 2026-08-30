---
title: "한국어 높임말과 화행 Korean Honorifics and Speech Acts"
description: "한국어 높임말과 화행은 주체·객체·청자에 대한 높임 표현과 진술·질문·요청 같은 발화 의도를 사회적 관계와 문맥에서 함께 해석하는 문제다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 높임법과 화행 · Korean Politeness and Speech Acts</p>

<p class="wiki-lead">한국어 높임말과 화행은 주체·객체·청자에 대한 높임 표현과 진술·질문·요청 같은 발화 의도를 사회적 관계와 문맥에서 함께 해석하는 문제다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 높임 체계와 발화 의도

한국어의 높임은 선어말 어미, 조사, 특수 어휘와 종결 표현에 분산되어 나타난다. 같은 명제라도 상대 높임 등급과 상황에 따라 요청·제안·명령의 힘이 달라질 수 있다. 화행은 문장 형식만이 아니라 화자·청자 관계, 대화 목적과 앞선 발화로 판정하므로 “-까요?”를 항상 질문 하나로 분류해서는 안 된다.

자료 계약과 범위를 고정할 때에는 화행 다중 라벨, 상대·주체·객체 높임, 참여자 역할과 문체를 구분하며 민감 속성으로 관계를 추정하지 않는다. 이 항목을 명시하지 않으면 한국어 높임말과 화행 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 문맥 표현과 분류

모델은 형태소·종결 어미, 존대 어휘, 호칭과 대화 이력을 결합해 높임 수준과 화행을 예측한다. 다중 과제 학습으로 문장 유형, 화행, 높임 수준을 함께 학습할 수 있지만 각 라벨의 정의와 중첩 허용 여부가 명확해야 한다. 생성에서는 사용자 관계와 업무 맥락을 입력 계약으로 주고 내용 의미를 유지한 채 종결 표현과 어휘를 일관되게 바꾼다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 종결 어미·존대 어휘·대화 이력을 결합해 질문 형식의 요청과 반어 같은 문맥 의존 기능을 판정한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어 높임말과 화행 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 일치도와 적절성 평가

라벨별 F1뿐 아니라 주석자 간 일치도, 도메인 간 전이와 대화 턴별 일관성을 평가한다. 일상 메신저에서 학습한 화행 분류기가 청원·고객 지원·공문에서 같은 기준을 유지하는지 별도 시험한다. 생성 평가는 문법성, 의미 보존, 높임 적절성, 과도한 비굴함이나 반말 침범을 한국어 화자가 쌍대 비교하도록 설계한다.

평가표에서는 라벨 F1, 주석자 일치도, 도메인 전이, 의미 보존·사회적 적절성과 대화 턴 일관성을 평가한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 도메인 이동과 고정관념

높임말 선택은 나이·직급만으로 결정되지 않고 친밀도, 제도, 역할과 개인 선호에 따라 달라진다. 모델이 이름이나 직업에서 관계를 추정하면 사회적 고정관념을 강화할 수 있다. 표면적으로 공손한 표현도 책임 회피나 압박의 화행을 가질 수 있고, 문장 하나만 보면 반어·농담·수사 질문을 오분류하기 쉽다.

안전한 실패 경계를 만들기 위해 형식상 공손하지만 책임을 흐리거나 직급·나이 고정관념에서 호칭을 선택하는 출력을 차단한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 서비스 문체 계약

서비스가 지원할 높임 수준과 금지 표현을 예문과 반례로 정의하고 사용자가 원하는 호칭·문체를 직접 지정할 수 있게 한다. 민감 속성으로 관계를 추정하지 않으며 불명확할 때는 중립적인 해요체 같은 기본값이나 확인 질문을 사용한다. 문체 변환 전후에 날짜·수치·의무와 부정 표현이 유지되는지 자동 검사하고 한국어 화자 검토 표본을 정기적으로 갱신한다.

운영 환경에서는 허용 종결형과 호칭의 예·반례를 문체 계약으로 두고 부정·수치·기한이 변하지 않았는지 관측한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 문체와 의미의 구분

높임 표현은 단순한 격식 스타일이 아니라 참여자 관계를 표시하는 문법·화용 체계다. 화행은 발화가 수행하는 기능이며 감정 분석이나 문장 유형과 동일하지 않다. 출력 언어 정렬은 어떤 언어로 답할지를 다루고, 높임말과 화행은 선택한 한국어 안에서 어떤 관계와 의도를 표현할지를 다룬다.

학습 확인에서는 같은 거절 내용을 두 높임 등급으로 바꾸고 사실·화행 보존과 관계를 추정하지 말아야 할 조건을 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [언어 모델](/wiki/language-model/)

### 관련 문서

- [한국어 문장 분할](/wiki/korean-sentence-segmentation/)
- [한국어 출력 언어 정렬](/wiki/korean-output-language-alignment/)
- [Ko-H5 벤치마크](/wiki/ko-h5-benchmark/)

### 이 문서를 가리키는 문서

- [한국어 문장 분할](/wiki/korean-sentence-segmentation/)
- [한국어 방언 강건성](/wiki/korean-dialect-robustness/)
- [한국어 출력 언어 정렬](/wiki/korean-output-language-alignment/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Study on the Domain Adaption of Korean Speech Act using Daily Conversation Dataset and Petition Corpus](https://aclanthology.org/2023.nlp4dh-1.26/) - paper
2. <span id="reference-2"></span>[KoDialogBench: Evaluating Conversational Understanding of Language Models with Korean Dialogue Benchmark](https://aclanthology.org/2024.lrec-main.865/) - paper
3. <span id="reference-3"></span>[한국어 어문 규범](https://www.korean.go.kr/kornorms/main/main.do) - documentation

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 한국어 개체명 인식](/wiki/korean-named-entity-recognition/)

---
title: "다국어 토큰 분절률 Multilingual Token Fertility"
description: "다국어 토큰 분절률은 같은 언어 단위가 평균 몇 개의 모델 토큰으로 나뉘는지 측정해 언어별 토큰화 효율과 비용 격차를 드러내는 지표다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">토큰 fertility · 다국어 토큰 비옥도</p>

<p class="wiki-lead">다국어 토큰 분절률은 같은 언어 단위가 평균 몇 개의 모델 토큰으로 나뉘는지 측정해 언어별 토큰화 효율과 비용 격차를 드러내는 지표다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 분절률의 분모와 분자

token fertility는 보통 단어·어절 하나가 평균 몇 토큰으로 표현되는지 계산한다. 한국어에서는 공백 어절, 형태소, 음절 중 어떤 단위를 분모로 쓰는지에 따라 값이 달라지므로 지표 이름만 보고 비교하면 안 된다. 토큰 수가 길어지면 같은 내용이 문맥 창을 더 많이 차지하고 토큰 단위 과금·지연·학습 배치 구성에 영향을 준다.

자료 계약과 범위를 고정할 때에는 분모 단위, 정규화, 공백·특수 토큰 처리와 토크나이저 버전을 명시해 언어별 수치를 비교 가능하게 한다. 이 항목을 명시하지 않으면 다국어 토큰 분절률 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 공유 어휘 배분의 영향

다국어 토크나이저는 언어별 말뭉치 빈도와 문자 체계를 바탕으로 제한된 어휘를 나눈다. 고자원 언어의 자주 쓰는 조각이 많은 슬롯을 차지하면 다른 언어 단어는 더 작은 부분어나 바이트로 분해된다. 형태소 인식 사전 분절과 목표 언어 어휘 확장은 분절률을 줄일 수 있지만 기존 임베딩·체크포인트 호환성과 다른 언어 성능을 다시 검증해야 한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 공유 어휘 배분과 어휘 확장이 언어별 조각 사용 빈도·임베딩 학습량·다른 언어 토큰에 주는 영향을 추적한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 다국어 토큰 분절률 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 공정한 비교 설계

의미가 대응하는 병렬 문장과 언어별 자연 문장을 모두 사용하고, 동일한 정규화와 특수 토큰 처리에서 fertility 분포를 계산한다. 평균뿐 아니라 상위 백분위, 문서 길이 초과율, 문자·단어당 토큰 수를 함께 보고한다. 낮은 분절률이 과제 정확도 향상을 자동 보장하지 않으므로 언어별 정확도, 처리량, 메모리와 비용을 같이 측정한다.

평가표에서는 평균·중앙값·p95 fertility, 문자당 토큰, 문맥 초과율과 과제 정확도·지연·비용을 함께 측정한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 단일 수치의 함정

단어 경계가 불명확하거나 교착 형태가 풍부한 언어에서 영어식 공백 단어를 분모로 쓰면 지표가 왜곡된다. 정규화·띄어쓰기 차이와 채팅 템플릿 특수 토큰을 섞으면 토크나이저 자체의 효과를 분리하기 어렵다. 어떤 언어의 fertility를 낮추려고 어휘를 재배분하면 다른 언어와 코드·숫자의 분해가 악화될 수 있다.

안전한 실패 경계를 만들기 위해 공백 단어가 맞지 않는 언어의 분모 왜곡과 토큰 수 감소가 의미 경계·일반화를 악화시키는 조건을 시험한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 언어별 비용 감사

실제 업무 문장을 언어·도메인·길이로 층화하고 토크나이저 버전별 분절률과 입력 한도 초과율을 저장한다. 한국어는 규범·구어·띄어쓰기 변이와 한영 혼용을 별도 집단으로 둔다. 모델 교체 시 동일 요청의 토큰 수, 응답 품질, 지연과 비용 변화를 보고하고 특정 언어의 비용 격차가 서비스 정책에 불리하게 반영되지 않는지 검토한다.

운영 환경에서는 동일 내용의 언어별 실제 청구 토큰과 문맥 잘림을 관측해 비용·접근성 격차를 감사한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 압축률과 과제 품질

분절률은 토크나이저의 표현 효율 지표이며 언어 이해 점수 자체가 아니다. byte fertility, 문자당 토큰 수와 압축률은 분모가 달라 직접 비교할 수 없다. 한국어 토큰화 문서는 형태·자모 경계를 설계하는 방법을, 다국어 평가 프로토콜은 이 지표를 다른 품질·비용 지표와 함께 보고하는 방법을 다룬다.

학습 확인에서는 병렬 문장의 두 fertility 정의를 계산하고 효율 개선과 정확도 저하가 충돌할 때의 선택 기준을 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [토큰화](/wiki/tokenization/)
- [다국어 언어 모델](/wiki/multilingual-language-model/)

### 관련 문서

- [한국어 토큰화](/wiki/korean-tokenization/)
- [바이트 단위 토큰화](/wiki/byte-level-tokenization/)
- [다국어 평가 프로토콜](/wiki/multilingual-evaluation-protocol/)

### 이 문서를 가리키는 문서

- [한국어 토큰화](/wiki/korean-tokenization/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[The Token Tax: Systematic Bias in Multilingual Tokenization](https://aclanthology.org/2026.africanlp-main.10/) - paper
2. <span id="reference-2"></span>[An Empirical Study of Tokenization Strategies for Various Korean NLP Tasks](https://arxiv.org/abs/2010.02534) - paper
3. <span id="reference-3"></span>[Morpheme Matters: Morpheme-Based Subword Tokenization for Korean Language Models](https://aclanthology.org/2026.eacl-short.22/) - paper
4. <span id="reference-4"></span>[mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer](https://arxiv.org/abs/2010.11934) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 한국어 높임말과 화행](/wiki/korean-honorifics-and-speech-acts/)

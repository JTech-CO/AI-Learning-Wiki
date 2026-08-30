---
title: "교차언어 전이 Cross-Lingual Transfer"
description: "교차언어 전이는 한 언어에서 학습한 표현이나 과제 지식을 다른 언어의 데이터가 적은 상황에 재사용하는 학습 전략이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">교차 언어 전이학습 · Cross-Lingual Transfer Learning</p>

<p class="wiki-lead">교차언어 전이는 한 언어에서 학습한 표현이나 과제 지식을 다른 언어의 데이터가 적은 상황에 재사용하는 학습 전략이다.</p>

<div class="wiki-document-meta">분류: [학습과 사후학습](/category/training/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 전이 설정

교차언어 전이는 원천 언어의 라벨 데이터로 학습한 모델을 목표 언어에 그대로 적용하는 zero-shot, 적은 목표 언어 데이터로 보정하는 few-shot, 번역·주석 투영으로 목표 데이터를 만드는 방식으로 나뉜다. 성공 여부는 언어 수가 아니라 표현 공간, 토크나이저, 과제 라벨과 문화적 전제가 얼마나 공유되는지에 달려 있다.

자료 계약과 범위를 고정할 때에는 원천·목표 언어, 감독 데이터, 공유 매개변수, 번역·정렬 사용과 목표 라벨 수를 실험 계약으로 둔다. 이 항목을 명시하지 않으면 교차언어 전이 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 공유 표현과 정렬

다국어 사전학습은 여러 언어의 텍스트를 같은 매개변수와 부분어 어휘로 학습해 문맥 표현을 간접 정렬한다. 병렬 문장·대조 학습·교차언어 임베딩은 의미가 같은 표현을 가깝게 만들고, 번역 기반 방식은 라벨을 목표 언어 문장에 옮긴다. 이후 목표 과제 헤드를 학습하거나 전체 모델을 조정하되 언어별 데이터 비율과 업데이트 간섭을 관리한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 다국어 사전학습·대조 정렬·주석 투영과 목표 언어 미세조정의 데이터 흐름과 그래디언트 간섭을 추적한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 교차언어 전이 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### zero-shot 격차 측정

원천 언어, 목표 언어와 병렬 번역 시험 세트를 분리하고 언어별 과제 점수와 원천 대비 전이 격차를 보고한다. 번역투 문장만 사용하면 실제 목표 언어의 어휘·화용을 과소평가하므로 원어민이 작성한 데이터가 필요하다. 언어 간 데이터 중복과 시험 오염을 확인하고 언어·문자·도메인별 최악 집단 성능을 함께 본다.

평가표에서는 단일 언어, zero-shot, 번역 증강, few-shot 기준선을 원문·번역투 시험과 최악 언어 신뢰구간에서 비교한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 음의 전이와 문화 누락

형태·어순·표기 체계가 다르거나 라벨 개념이 문화에 따라 달라지면 공유 표현이 오히려 목표 언어 성능을 낮출 수 있다. 번역 주석은 개체 범위와 화행을 바꾸고, 영어 중심 데이터의 편향을 목표 언어로 옮길 수 있다. 평균 다국어 점수는 한국어 같은 개별 언어의 큰 실패를 가릴 수 있다.

안전한 실패 경계를 만들기 위해 라벨 개념의 문화 차이, 번역에 의한 개체 범위 손실과 영어 편향의 음의 전이를 실패로 분리한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 목표 언어 검증

단일 언어 기준선, zero-shot, 번역 학습, 소량 목표 언어 미세조정을 같은 모델·예산에서 비교한다. 한국어 표본은 형태소, 띄어쓰기, 높임말, 방언과 문화 지식의 대표성을 점검한다. 전이로 절약한 라벨 비용과 추가된 오류 유형을 함께 기록하고 고위험 과제는 목표 언어 전문가의 승인 세트를 통과해야 배포한다.

운영 환경에서는 목표 언어 낮은 확신과 원천 대비 격차를 관측하고 고위험 과제는 전문가 승인과 사람 경로를 둔다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 다국어 학습과의 구분

다국어 모델은 여러 언어를 한 모델에 담는 구조이고 교차언어 전이는 한 언어의 감독 신호가 다른 언어 성능에 기여하는 학습 효과다. 교차언어 임베딩은 정렬된 표현 공간을 제공하는 한 방법이며 번역은 데이터 변환 경로다. 전이가 가능하다는 사실과 목표 언어에서 동등한 품질·안전성을 갖는다는 결론은 다르다.

학습 확인에서는 한국어 NER로 전이하는 네 경로와 필요한 데이터를 비교하고 zero-shot 점수만으로 배포할 수 없는 이유를 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [전이학습](/wiki/transfer-learning/)
- [다국어 언어 모델](/wiki/multilingual-language-model/)

### 관련 문서

- [교차언어 임베딩](/wiki/cross-lingual-embedding/)
- [다국어 평가 프로토콜](/wiki/multilingual-evaluation-protocol/)
- [한국어 개체명 인식](/wiki/korean-named-entity-recognition/)

### 이 문서를 가리키는 문서

_해당 문서가 없다._

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Unsupervised Cross-lingual Representation Learning at Scale](https://arxiv.org/abs/1911.02116) - paper
2. <span id="reference-2"></span>[XTREME: A Massively Multilingual Multi-task Benchmark for Evaluating Cross-lingual Generalization](https://arxiv.org/abs/2003.11080) - paper
3. <span id="reference-3"></span>[mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer](https://arxiv.org/abs/2010.11934) - paper
4. <span id="reference-4"></span>[Sources of Transfer in Multilingual Named Entity Recognition](https://aclanthology.org/2020.acl-main.720/) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 한국어 언어 식별](/wiki/korean-language-identification/)

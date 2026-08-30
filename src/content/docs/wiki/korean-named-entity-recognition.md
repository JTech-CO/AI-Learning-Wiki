---
title: "한국어 개체명 인식 Korean Named Entity Recognition"
description: "한국어 개체명 인식은 한국어 문장에서 사람·기관·장소·날짜 등 지정 범주의 문자열 범위와 유형을 찾아내는 순차 표지 과제다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 NER · Korean NER</p>

<p class="wiki-lead">한국어 개체명 인식은 한국어 문장에서 사람·기관·장소·날짜 등 지정 범주의 문자열 범위와 유형을 찾아내는 순차 표지 과제다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 범위와 유형 체계

개체명 인식은 원문에서 개체가 차지하는 시작·끝 범위와 PERSON·ORGANIZATION·LOCATION 같은 유형을 반환한다. 한국어에서는 조사와 접사가 이름 뒤에 붙고 띄어쓰기가 불안정해 어절 경계와 개체 경계가 다를 수 있다. “서울대에서”에서 기관명과 조사를 분리할지 같은 규칙은 태그셋에 명시해야 하며, 개체명 인식과 지식베이스 식별자인 개체 연결을 구분한다.

자료 계약과 범위를 고정할 때에는 유형 정의, 중첩·불연속 허용, 조사·직함 포함, Unicode 오프셋 단위를 주석 계약으로 고정한다. 이 항목을 명시하지 않으면 한국어 개체명 인식 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 순차 표지와 문맥 표현

BIO·BIOES 태그는 토큰이 개체의 시작·내부·외부인지 나타내며 인코더와 선형 분류기 또는 CRF가 문맥 일관성을 학습한다. 문자·음절·형태소와 부분어 표현을 결합하면 미등록 이름을 다룰 수 있고, 사전은 도메인 고유 개체를 보완한다. 부분어 예측은 반드시 원문 문자 범위로 병합해 하류 개인정보 제거와 검색이 같은 오프셋을 쓰게 해야 한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 부분어 BIO 점수를 유효한 원문 범위로 병합하고 사전·문맥 모델의 충돌과 신뢰도를 보존한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 한국어 개체명 인식 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 범위 일치 평가

엄격 평가는 시작·끝과 유형이 모두 맞을 때만 정답으로 계산하고, 부분 일치 평가는 경계 오류를 별도로 분석한다. 유형별 정밀도·재현율·F1, 미등록 개체 성능, 문서·도메인별 결과를 보고한다. 같은 이름이 사람·제품·기관으로 쓰이는 모호성, 중첩 개체와 조사 부착 사례를 고정 시험에 포함한다.

평가표에서는 엄격·부분 F1, 유형 혼동, 미등록 이름, 도메인과 시점별 결과를 문서·개체 단위 분할에서 측정한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 새 이름과 도메인 이동

훈련 이후 생긴 조직·제품명, 표기 변형과 오탈자는 사전과 모델 모두에서 누락되기 쉽다. 뉴스에서 높은 점수를 얻은 모델이 의료·법률·채팅의 약어와 중첩 개체에 실패할 수 있다. 다국어 전이는 표기 유사성을 이용하지만 한국어 조사·어순과 라벨 지침 차이 때문에 단순히 데이터 양을 합치면 단일 언어 모델보다 나빠질 수 있다.

안전한 실패 경계를 만들기 위해 새 조직·제품명, 약칭, 조사 부착과 뉴스에서 전문 도메인으로 이동할 때의 누락을 회귀 사례로 둔다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 주석·배포 검증

업무 목적에 필요한 유형만 정의하고 포함·제외 경계를 예문으로 고정한다. 주석자 불일치가 큰 유형은 합치거나 2단계 검토를 두며 데이터 분할은 같은 문서와 개체 별칭이 훈련·시험에 동시에 들어가지 않게 한다. 배포 후 새 개체 누락, 오탐 사전, 유형 혼동을 수집하고 사전 갱신과 모델 재학습의 효과를 분리해 측정한다.

운영 환경에서는 모델과 개체 사전 버전을 분리해 관측하고 개인정보 후속 조치 전 범위·유형·신뢰도 합의를 확인한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 개인정보 탐지와의 관계

개체명 인식은 언어적 범주를 찾는 일반 과제이고 개인정보 탐지는 재식별 위험과 처리 목적에 따라 민감 범위를 찾는 통제 과제다. 사람 이름이 항상 개인정보인 것은 아니며 계정·연락처·조합 정보는 전통적 NER 유형 밖에 있을 수 있다. 개체 연결은 탐지한 표현을 동일 실체로 해소하는 다음 단계다.

학습 확인에서는 사람·기관이 문맥에 따라 바뀌는 문자열을 태그하고 조사 포함 정책이 엄격 F1에 주는 영향을 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [한국어 형태소 분석](/wiki/korean-morphological-analysis/)
- [토큰화](/wiki/tokenization/)

### 관련 문서

- [개체 연결](/wiki/entity-linking/)
- [한국어 개인정보 탐지](/wiki/korean-pii-detection/)
- [KLUE](/wiki/klue/)

### 이 문서를 가리키는 문서

- [교차언어 전이](/wiki/cross-lingual-transfer/)
- [한국어 개인정보 탐지](/wiki/korean-pii-detection/)
- [KLUE](/wiki/klue/)
- [KorQuAD](/wiki/korquad/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[KLUE: Korean Language Understanding Evaluation](https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/98dce83da57b0395e163467c9dae521b-Abstract-round2.html) - paper
2. <span id="reference-2"></span>[Sources of Transfer in Multilingual Named Entity Recognition](https://aclanthology.org/2020.acl-main.720/) - paper
3. <span id="reference-3"></span>[Dynamic Gazetteer Integration in Multilingual Models for Cross-Lingual and Cross-Domain Named Entity Recognition](https://aclanthology.org/2022.naacl-main.200/) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — 개인 식별 정보](/wiki/personally-identifiable-information/)

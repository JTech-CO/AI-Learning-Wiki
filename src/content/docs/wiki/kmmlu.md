---
title: "KMMLU Korean Massive Multitask Language Understanding"
description: "KMMLU는 한국어로 원래 작성된 시험 문제를 바탕으로 인문·사회·과학·공학·전문 직무 등 45개 분야의 객관식 문제 해결 능력을 평가하는 벤치마크다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">한국어 대규모 다과제 언어 이해 · KMMLU 벤치마크</p>

<p class="wiki-lead">KMMLU는 한국어로 원래 작성된 시험 문제를 바탕으로 인문·사회·과학·공학·전문 직무 등 45개 분야의 객관식 문제 해결 능력을 평가하는 벤치마크다.</p>

<div class="wiki-document-meta">분류: [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-08-30</div>

## 개념과 원리

### 한국어 원문 기반 다과제 평가

KMMLU는 번역된 영어 문제가 아니라 한국의 시험과 자격 문항에서 수집한 한국어 원문을 사용해 언어·문화·제도 맥락을 보존하려는 평가다. 45개 과목의 35,030개 객관식 문항으로 구성되며 전문 지식과 문제 해결을 함께 요구한다. MMLU 형식을 계승하지만 과목 구성과 출처가 다르므로 영어 MMLU 점수의 단순 번역판으로 보아서는 안 된다.

자료 계약과 범위를 고정할 때에는 과목·출처 시기·정답·선택지·시점 의존성을 기록해 법·정책 문항의 평가 기준 날짜를 보존한다. 이 항목을 명시하지 않으면 KMMLU 결과가 달라져도 데이터·전처리·모델 중 어느 변화가 원인인지 재현할 수 없다. 원문과 파생값, 자동 판단과 사람 결정을 구분해 저장하고 기준 날짜와 적용 범위를 함께 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 프롬프트와 채점

평가는 문제와 선택지를 정해진 템플릿으로 모델에 제공하고 선택한 답을 정답 키와 비교한다. zero-shot·few-shot, 생성 답 파싱과 선택지 로그확률 방식은 결과를 바꿀 수 있으므로 공식 설정을 따른다. 과목별 표본 수와 난도가 다르기 때문에 전체 정확도뿐 아니라 과목·분야별 점수와 무응답·형식 오류를 보고한다.

처리 흐름은 입력 수집, 전제 검사, 핵심 변환, 결과 복원과 검증으로 나눈다. 이 문서에서는 특히 생성 파싱과 선택지 로그확률, zero/few-shot 프롬프트를 구분하고 공식 하네스와 변형 실험을 분리한다. 각 단계의 입력·출력 자료형과 실패 상태를 남기면 KMMLU 구현을 바꾸더라도 같은 사례에서 최초 차이가 생긴 위치를 찾을 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 비교 가능한 실행

공식 데이터 버전과 평가 하네스, 프롬프트, 샷 수, 모델 체크포인트와 디코딩 설정을 고정한다. 동일 모델을 여러 언어에서 비교할 때에는 문제 내용이 대응하지 않음을 명시하고 한국어 토큰 비용과 출력 파싱 오류도 기록한다. 신뢰구간과 문항별 결과를 통해 작은 점수 차이가 통계적으로 안정적인지 확인한다.

평가표에서는 과목별 정확도·macro 평균·무작위 기준선·신뢰구간과 선택지 순열 민감도를 보고한다. 평균값 하나로 결론 내리지 않고 정상·경계·실패 사례와 하위 집단을 나누며, 데이터 버전·토크나이저·모델·실행 설정을 고정한다. 차이가 작을 때에는 반복 실행과 신뢰구간으로 우연한 변동인지 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 지식과 능력의 과대해석

객관식 정답률은 자유 서술, 근거 제시, 최신 정보와 실제 업무 수행을 직접 측정하지 않는다. 공개 문항이 학습 데이터에 포함되면 암기와 일반화가 섞이고, 자격 시험의 시대·정책 변화로 정답이 낡을 수 있다. 선택지 위치 편향과 프롬프트 형식 민감도도 모델 간 비교를 왜곡한다.

안전한 실패 경계를 만들기 위해 정답 오류·모호한 선택지·공개 뒤 오염과 반복 프롬프트 튜닝을 모델 능력과 분리한다. 결과가 자연스럽게 보이거나 오류 없이 반환됐다는 이유만으로 정확성·공정성·개인정보 보호까지 확보됐다고 해석하지 않는다. 피해가 크거나 근거가 부족한 사례는 자동 보정하지 않고 보류·사람 검토로 보낸다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 벤치마크 감사

평가 전에 중복·정답 오류·시점 의존 문항과 라이선스를 점검하고 변경한 문항은 원본과 분리한다. 전체 점수 아래에 과목별 표본 수, 정확도, 신뢰구간과 실패 예시를 공개한다. 제품 판단에는 KMMLU를 하나의 증거로만 사용하고 실제 도메인의 자유 응답·안전·근거성 평가와 사람 검토를 결합한다.

운영 환경에서는 업무 관련 과목 아래 자유 응답·근거·안전 평가를 추가하고 모델·프롬프트·시점별 선택 변화를 관측한다. 기준선을 먼저 저장하고 제한된 트래픽에서 변경 효과를 관측한 뒤 확대한다. 데이터·표준·모델·코드 중 하나가 바뀌면 같은 회귀 세트를 다시 실행하고, 개선 폭이 추가 비용과 잔여 위험을 상쇄하지 못하면 롤백한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### MMLU와 한국어 평가군

KMMLU는 MMLU의 다과제 객관식 틀을 참고하지만 한국어 원문과 한국 맥락 과목을 사용한다. KLUE는 언어 이해 과제의 처리 능력을, Ko-H5는 여러 한국어 벤치마크를 묶은 리더보드 평가를 제공한다. 서로 다른 데이터와 지표를 하나의 순위처럼 직접 비교하지 않는다.

학습 확인에서는 한국어 원문과 번역 MMLU의 차이, 종합점수가 같아도 과목별 분포로 선택이 달라지는 이유를 설명한다. 정의를 외우는 데서 멈추지 않고 입력·처리·출력, 비교 기준과 중단 조건을 사례로 제시해야 한다. 관련 문서와의 차이를 설명하고 한 번의 성공 사례를 전체 한국어·다국어 입력으로 일반화하지 않는 이유까지 답할 수 있어야 한다. 답안에는 사용한 근거의 날짜와 적용 범위, 정상·경계·실패 반례, 사람이 다시 검토할 조건과 결과를 재현하는 데 필요한 설정을 함께 적는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 문서 관계

### 선행 개념

- [벤치마크](/wiki/benchmark/)
- [KLUE](/wiki/klue/)

### 관련 문서

- [Ko-H5 벤치마크](/wiki/ko-h5-benchmark/)
- [벤치마크 오염](/wiki/benchmark-contamination/)
- [다국어 능력](/wiki/multilingual-capability/)

### 이 문서를 가리키는 문서

- [KLUE](/wiki/klue/)
- [Ko-H5 벤치마크](/wiki/ko-h5-benchmark/)

### 이 문서를 포함하는 코스

[한국어·다국어 AI](/course/korean-multilingual-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[KMMLU: Measuring Massive Multitask Language Understanding in Korean](https://arxiv.org/abs/2402.11548) - paper
2. <span id="reference-2"></span>[HAERAE-HUB KMMLU Dataset](https://huggingface.co/datasets/HAERAE-HUB/KMMLU) - documentation
3. <span id="reference-3"></span>[Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300) - paper

### 코스에서 계속 읽기

- **한국어·다국어 AI:** [다음 문서 — Ko-H5 벤치마크](/wiki/ko-h5-benchmark/)

---
title: "정밀도와 재현율 Precision and Recall"
description: "정밀도는 양성으로 예측한 항목의 적중 비율이고 재현율은 실제 양성 가운데 찾아낸 비율이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">Precision · Recall · 정밀도 · 재현율</p>

<p class="wiki-lead">정밀도는 양성으로 예측한 항목의 적중 비율이고 재현율은 실제 양성 가운데 찾아낸 비율이다.</p>

<div class="wiki-document-meta">분류: [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

정밀도는 양성으로 예측한 항목의 적중 비율이고 재현율은 실제 양성 가운데 찾아낸 비율이다.

두 지표는 같은 혼동행렬에서 계산되지만 서로 다른 실패 비용을 본다. 거짓 양성을 줄이는 것이 중요하면 정밀도를, 놓치는 양성을 줄이는 것이 중요하면 재현율을 우선한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

이진 분류의 정의를 출발점으로 다중 클래스·다중 레이블에서의 평균 방식과 검색·생성 평가에서의 해석까지 다룬다. 지표 이름만 제시하지 않고 양성 클래스, 임계값, 평균 방식을 함께 기록해야 한다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

정밀도는 TP/(TP+FP), 재현율은 TP/(TP+FN)으로 계산한다. 모델 점수의 판정 임계값을 바꾸면 양성 예측 수가 달라져 두 값이 함께 변하므로 정밀도-재현율 곡선으로 여러 임계값을 비교한다.

[평가 지표](/wiki/metric/) 및 [정확도](/wiki/accuracy/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

평가에는 정답 레이블, 모델 점수 또는 예측, 양성 클래스 정의, 임계값이 필요하다. 다중 클래스에서는 클래스별 값을 계산한 뒤 macro·micro·weighted 방식 중 목적에 맞는 집계를 선택한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

스팸 차단, 질병 선별, 검색 결과, 안전 위반 탐지처럼 거짓 양성과 거짓 음성의 비용이 다른 문제에 사용한다. 운영 임계값은 단일 최고 점수가 아니라 허용 가능한 실패 비용과 처리 용량을 기준으로 정한다.

양성 비율이 낮으면 정확도가 높아도 유용한 모델이 아닐 수 있으므로 정밀도와 재현율을 함께 본다. 두 값을 하나로 요약해야 할 때 F 점수를 쓰되 가중치와 평균 방식을 공개한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

데이터의 양성 비율, 레이블 품질, 표본 추출 방식이 바뀌면 같은 모델의 값도 달라진다. 특히 테스트셋에서 임계값을 반복 조정하면 평가 결과가 낙관적으로 편향된다.

집단별 성능 차이를 전체 평균이 가릴 수 있으므로 중요한 하위 집단과 오류 유형을 분리한다. 분모가 0인 경우의 처리 규칙도 구현마다 다를 수 있어 명시해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [정확도](/wiki/accuracy/): 정확도는 전체 예측 중 맞은 비율이라 클래스 불균형에서 소수 양성의 실패를 가릴 수 있다.
- [평가 지표](/wiki/metric/): 평가 지표는 측정값의 상위 개념이고 정밀도와 재현율은 분류 오류를 보는 구체적 지표다.
- [관측성](/wiki/observability/): 관측성은 운영 중 입력과 오류 변화를 추적하며 정밀도·재현율 저하의 원인을 찾는 데 필요한 기록을 제공한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적 적용 예시

실제 위험 문서가 20개인 100개 자료에서 모델이 10개를 위험으로 표시했고 그중 8개가 맞았다면 정밀도는 8/10=0.8이다. 실제 위험 20개 중 8개를 찾았으므로 재현율은 8/20=0.4다. 이 결과는 경보의 신뢰도는 높지만 많은 위험을 놓친다는 뜻이다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 정밀도와 재현율 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 정밀도와 재현율이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 혼동행렬의 네 값을 직접 확인하고 임계값별 곡선, 클래스별 결과, 신뢰구간을 함께 검토한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

#### 운영 기록 템플릿

- **선택 근거:** 정밀도와 재현율을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [accuracy](/wiki/accuracy/), [observability](/wiki/observability/), [llm-as-a-judge](/wiki/llm-as-a-judge/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 정밀도와 재현율의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 학습 체크

- 정밀도와 재현율의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [정확도](/wiki/accuracy/)와 [관측성](/wiki/observability/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 문서 관계

### 선행 개념

- [평가 지표](/wiki/metric/)
- [정확도](/wiki/accuracy/)

### 관련 문서

- [정확도](/wiki/accuracy/)
- [관측성](/wiki/observability/)
- [LLM 심사자](/wiki/llm-as-a-judge/)

### 이 문서를 가리키는 문서

- [개별 LLM 심사](/wiki/pointwise-llm-judge/)
- [검색 평가](/wiki/retrieval-evaluation/)
- [계획 평가](/wiki/planning-evaluation/)
- [곡선 아래 면적](/wiki/area-under-curve/)
- [과제 벤치마크](/wiki/task-benchmark/)

<details class="wiki-backlinks-more">
<summary>나머지 91개 문서 보기</summary>

- [과제 완료율](/wiki/task-completion-rate/)
- [관측성](/wiki/observability/)
- [근거 충실도](/wiki/groundedness/)
- [기대 보정 오차](/wiki/expected-calibration-error/)
- [능력 벤치마크](/wiki/capability-benchmark/)
- [답변 관련성](/wiki/answer-relevance/)
- [데이터 주석](/wiki/data-annotation/)
- [도구 사용 평가](/wiki/tool-use-evaluation/)
- [동적 벤치마크](/wiki/dynamic-benchmark/)
- [로그 손실](/wiki/log-loss/)
- [루브릭 기반 심사](/wiki/rubric-based-judge/)
- [리더보드](/wiki/leaderboard/)
- [리커트 척도](/wiki/likert-scale/)
- [맹검 평가](/wiki/blind-evaluation/)
- [모델 드리프트 모니터링](/wiki/model-drift-monitoring/)
- [모델 텔레메트리](/wiki/model-telemetry/)
- [문맥 관련성](/wiki/context-relevance/)
- [벤치마크 데이터셋](/wiki/benchmark-dataset/)
- [벤치마크 모음](/wiki/benchmark-suite/)
- [벤치마크 타당도](/wiki/benchmark-validity/)
- [벤치마크 포화](/wiki/benchmark-saturation/)
- [부트스트랩 신뢰구간](/wiki/bootstrap-confidence-interval/)
- [브라이어 점수](/wiki/brier-score/)
- [비용 모니터링](/wiki/cost-monitoring/)
- [사용자 피드백 수집](/wiki/user-feedback-collection/)
- [생성 평가](/wiki/generation-evaluation/)
- [승률](/wiki/win-rate/)
- [시뮬레이션 기반 평가](/wiki/simulation-based-evaluation/)
- [심사 모델](/wiki/judge-model/)
- [심사 모델 메타평가](/wiki/judge-meta-evaluation/)
- [심사 모델 보정](/wiki/judge-calibration/)
- [심사 모델 앙상블](/wiki/judge-ensemble/)
- [심사 모델 합의도](/wiki/judge-agreement/)
- [심사 위치 편향](/wiki/position-bias-in-judging/)
- [쌍대 비교](/wiki/pairwise-comparison/)
- [쌍대 LLM 심사](/wiki/pairwise-llm-judge/)
- [안전 벤치마크](/wiki/safety-benchmark/)
- [에이전트 평가](/wiki/agent-evaluation/)
- [완전 일치](/wiki/exact-match/)
- [인간 평가](/wiki/human-evaluation/)
- [인용 정확성](/wiki/citation-correctness/)
- [자기 선호 편향](/wiki/self-preference-bias/)
- [자동 평가자](/wiki/automatic-rater/)
- [장황성 편향](/wiki/verbosity-bias/)
- [재현 가능한 평가](/wiki/reproducible-evaluation/)
- [전문가 평가](/wiki/expert-evaluation/)
- [정밀도-재현율 곡선](/wiki/precision-recall-curve/)
- [정성 평가](/wiki/qualitative-evaluation/)
- [정확도](/wiki/accuracy/)
- [종단간 성공률](/wiki/end-to-end-success-rate/)
- [주석 판정](/wiki/annotation-adjudication/)
- [주석자 편향](/wiki/annotator-bias/)
- [주석자 피로](/wiki/annotator-fatigue/)
- [주석자 합의도](/wiki/annotator-agreement/)
- [지연 시간 모니터링](/wiki/latency-monitoring/)
- [참조 기반 평가](/wiki/reference-based-evaluation/)
- [참조 없는 평가](/wiki/reference-free-evaluation/)
- [충실성](/wiki/faithfulness/)
- [크라우드소싱 평가](/wiki/crowdsourced-evaluation/)
- [토큰 사용량 모니터링](/wiki/token-usage-monitoring/)
- [통계적 유의성](/wiki/statistical-significance/)
- [특이도](/wiki/specificity/)
- [평가 루브릭](/wiki/evaluation-rubric/)
- [평가 불확실성](/wiki/evaluation-uncertainty/)
- [평가 지표](/wiki/metric/)
- [평가 표본추출](/wiki/evaluation-sampling/)
- [평가자 간 신뢰도](/wiki/inter-rater-reliability/)
- [프로덕션 평가](/wiki/production-evaluation/)
- [프롬프트 추적](/wiki/prompt-trace/)
- [혼동 행렬](/wiki/confusion-matrix/)
- [회귀 테스트형 평가](/wiki/regression-evaluation/)
- [효과 크기](/wiki/effect-size/)
- [BEIR 벤치마크](/wiki/beir-benchmark/)
- [BERTScore](/wiki/bertscore/)
- [BIG-bench](/wiki/big-bench/)
- [BLEU 점수](/wiki/bleu-score/)
- [F1 점수](/wiki/f1-score/)
- [GPQA](/wiki/gpqa/)
- [HELM 벤치마크](/wiki/helm-benchmark/)
- [HumanEval](/wiki/humaneval/)
- [ImageNet](/wiki/imagenet/)
- [LLM 심사자](/wiki/llm-as-a-judge/)
- [METEOR 점수](/wiki/meteor-score/)
- [MLPerf](/wiki/mlperf/)
- [MMLU](/wiki/mmlu/)
- [MTEB](/wiki/mteb/)
- [Pass@K](/wiki/pass-at-k/)
- [RAG 평가](/wiki/rag-evaluation/)
- [ROC 곡선](/wiki/roc-curve/)
- [ROUGE 점수](/wiki/rouge-score/)
- [SWE-bench](/wiki/swe-bench/)

</details>

### 이 문서를 포함하는 코스

[신뢰할 수 있는 AI](/course/responsible-ai/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) - paper
2. <span id="reference-2"></span>[Scikit-learn: Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html) - documentation
3. <span id="reference-3"></span>[Precision and recall - Wikipedia](https://en.wikipedia.org/wiki/Precision_and_recall) - encyclopedia

### 코스에서 계속 읽기

- **신뢰할 수 있는 AI:** [다음 문서 — LLM 심사자](/wiki/llm-as-a-judge/)

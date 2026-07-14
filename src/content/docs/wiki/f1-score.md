---
title: "F1 점수 F1 Score"
description: "정밀도와 재현율의 조화평균으로 두 지표가 모두 높을 때만 큰 값을 갖는 분류·검색 성능 지표다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">F1 스코어 · F-measure</p>

<p class="wiki-lead">정밀도와 재현율의 조화평균으로 두 지표가 모두 높을 때만 큰 값을 갖는 분류·검색 성능 지표다.</p>

<div class="wiki-document-meta">분류: [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

정밀도와 재현율의 조화평균으로 두 지표가 모두 높을 때만 큰 값을 갖는 분류·검색 성능 지표다.

F1=2PR/(P+R)이며 혼동 행렬로 쓰면 2TP/(2TP+FP+FN)이다. 한 지표가 매우 낮으면 산술평균보다 크게 벌점을 주므로 거짓 양성과 거짓 음성을 함께 고려하려는 상황에 사용한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

이진 분류에서는 양성 클래스 정의가 먼저다. 다중 클래스·다중 라벨에서는 클래스별 F1을 구한 뒤 micro, macro, weighted, samples 방식으로 평균할 수 있으며 각 방식의 의미가 다르다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

예측 점수에 임계값을 적용해 TP·FP·FN을 만들고 정밀도와 재현율을 계산한다. 임계값이 바뀌면 F1도 바뀌므로 시험 집합에서 임계값을 튜닝하면 낙관 편향이 생긴다. 검증 집합에서 선택하고 시험 집합에는 한 번 적용한다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

양성 클래스, 평균 방식, 임계값, 표본 가중치, 0으로 나누는 경우의 처리와 신뢰구간이 보고 계약이다. 단일 숫자와 함께 클래스별 support와 혼동 행렬을 제공해야 해석할 수 있다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

양성 사례가 드물고 정밀도와 재현율을 동시에 관리해야 하는 검색·탐지·문서 분류에 널리 쓰인다. 두 오류 비용이 크게 다르면 Fβ나 비용 기반 지표를 선택하고 운영 임계값을 별도로 정한다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

참음성 TN을 식에 사용하지 않으므로 전체 음성 판별 성능을 숨길 수 있다. macro F1은 희귀 클래스를 동등하게 보지만 표본 수 불확실성이 크고, weighted F1은 다수 클래스에 지배될 수 있다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [precision-recall](/wiki/precision-recall/): F1을 구성하는 두 지표이며 반드시 각각도 함께 보고해야 한다.
- [accuracy](/wiki/accuracy/): 전체 정답 비율로 클래스 불균형에서 다수 클래스 성능에 치우칠 수 있다.
- [evaluation](/wiki/evaluation/): 지표 선택, 데이터 분할, 통계 해석을 포함하는 상위 평가 과정이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적인 적용 예시

TP=40, FP=10, FN=20이면 정밀도 0.8, 재현율 약 0.667, F1은 약 0.727이다. 임계값 후보별 F1과 비용을 검증 세트에서 비교하고 고정된 시험 세트로 최종 보고한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 데이터 분할·라벨 버전, 양성 클래스, 평균 방식, 임계값 선택 절차, 클래스별 support·F1과 신뢰구간을 기록한다.
6. **운영 통제:** 자동 중단·롤백 조건과 사람이 검토해야 하는 사건을 지정한다.

검토자는 문서의 출처 번호를 따라 정의와 한계를 다시 확인하고, 구현 버전이 바뀔 때 같은 기준 사례와 실패 시험을 반복한다. 개선 폭이 복잡성과 잔여 위험을 상쇄하지 못하면 단순한 기준선으로 돌아간다.

**운영 기록 템플릿**

- 선택 근거와 제외한 대안을 함께 적어 나중에 결정 조건을 복원한다.
- 입력 데이터의 기준 시점, 표본 수, 결측 처리와 권한 범위를 고정한다.
- 정상 기준 사례, 경계 사례, 의도적으로 실패시킬 사례의 기대 결과를 배포 전에 승인한다.
- 품질·지연시간·비용과 안전 지표에 경고선과 중단선을 따로 둔다.
- 변경 뒤 동일 평가를 반복하고 결과 차이가 데이터, 코드, 모델 또는 정책 중 어디에서 생겼는지 분류한다.
- 자동화가 확신하지 못하거나 영향이 큰 경우 사람이 판단할 수 있도록 입력과 근거, 가능한 대안을 한 화면에 제공한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 학습 체크

- F1 점수 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 선행 개념

- [정밀도와 재현율](/wiki/precision-recall/)
- [모델 평가](/wiki/evaluation/)

## 관련 문서

- [정확도](/wiki/accuracy/)
- [벤치마크](/wiki/benchmark/)
- [데이터셋](/wiki/dataset/)

## 이 문서를 가리키는 문서

- [에이전트 평가](/wiki/agent-evaluation/)
- [주석 판정](/wiki/annotation-adjudication/)
- [주석자 합의도](/wiki/annotator-agreement/)
- [주석자 편향](/wiki/annotator-bias/)
- [주석자 피로](/wiki/annotator-fatigue/)
- [답변 관련성](/wiki/answer-relevance/)
- [곡선 아래 면적](/wiki/area-under-curve/)
- [자동 평가자](/wiki/automatic-rater/)
- [BEIR 벤치마크](/wiki/beir-benchmark/)
- [벤치마크 데이터셋](/wiki/benchmark-dataset/)
- [벤치마크 포화](/wiki/benchmark-saturation/)
- [벤치마크 모음](/wiki/benchmark-suite/)
- [벤치마크 타당도](/wiki/benchmark-validity/)
- [BERTScore](/wiki/bertscore/)
- [BIG-bench](/wiki/big-bench/)
- [BLEU 점수](/wiki/bleu-score/)
- [맹검 평가](/wiki/blind-evaluation/)
- [부트스트랩 신뢰구간](/wiki/bootstrap-confidence-interval/)
- [브라이어 점수](/wiki/brier-score/)
- [능력 벤치마크](/wiki/capability-benchmark/)
- [인용 정확성](/wiki/citation-correctness/)
- [혼동 행렬](/wiki/confusion-matrix/)
- [문맥 관련성](/wiki/context-relevance/)
- [비용 모니터링](/wiki/cost-monitoring/)
- [크라우드소싱 평가](/wiki/crowdsourced-evaluation/)
- [데이터 주석](/wiki/data-annotation/)
- [동적 벤치마크](/wiki/dynamic-benchmark/)
- [효과 크기](/wiki/effect-size/)
- [종단간 성공률](/wiki/end-to-end-success-rate/)
- [평가 루브릭](/wiki/evaluation-rubric/)
- [평가 표본추출](/wiki/evaluation-sampling/)
- [평가 불확실성](/wiki/evaluation-uncertainty/)
- [완전 일치](/wiki/exact-match/)
- [기대 보정 오차](/wiki/expected-calibration-error/)
- [전문가 평가](/wiki/expert-evaluation/)
- [충실성](/wiki/faithfulness/)
- [생성 평가](/wiki/generation-evaluation/)
- [GPQA](/wiki/gpqa/)
- [근거 충실도](/wiki/groundedness/)
- [HELM 벤치마크](/wiki/helm-benchmark/)
- [인간 평가](/wiki/human-evaluation/)
- [HumanEval](/wiki/humaneval/)
- [ImageNet](/wiki/imagenet/)
- [평가자 간 신뢰도](/wiki/inter-rater-reliability/)
- [심사 모델 합의도](/wiki/judge-agreement/)
- [심사 모델 보정](/wiki/judge-calibration/)
- [심사 모델 앙상블](/wiki/judge-ensemble/)
- [심사 모델 메타평가](/wiki/judge-meta-evaluation/)
- [심사 모델](/wiki/judge-model/)
- [지연 시간 모니터링](/wiki/latency-monitoring/)
- [리더보드](/wiki/leaderboard/)
- [리커트 척도](/wiki/likert-scale/)
- [로그 손실](/wiki/log-loss/)
- [METEOR 점수](/wiki/meteor-score/)
- [MLPerf](/wiki/mlperf/)
- [MMLU](/wiki/mmlu/)
- [모델 드리프트 모니터링](/wiki/model-drift-monitoring/)
- [모델 텔레메트리](/wiki/model-telemetry/)
- [MTEB](/wiki/mteb/)
- [쌍대 비교](/wiki/pairwise-comparison/)
- [쌍대 LLM 심사](/wiki/pairwise-llm-judge/)
- [Pass@K](/wiki/pass-at-k/)
- [계획 평가](/wiki/planning-evaluation/)
- [개별 LLM 심사](/wiki/pointwise-llm-judge/)
- [심사 위치 편향](/wiki/position-bias-in-judging/)
- [정밀도-재현율 곡선](/wiki/precision-recall-curve/)
- [프로덕션 평가](/wiki/production-evaluation/)
- [프롬프트 추적](/wiki/prompt-trace/)
- [정성 평가](/wiki/qualitative-evaluation/)
- [RAG 평가](/wiki/rag-evaluation/)
- [참조 기반 평가](/wiki/reference-based-evaluation/)
- [참조 없는 평가](/wiki/reference-free-evaluation/)
- [회귀 테스트형 평가](/wiki/regression-evaluation/)
- [재현 가능한 평가](/wiki/reproducible-evaluation/)
- [검색 평가](/wiki/retrieval-evaluation/)
- [ROC 곡선](/wiki/roc-curve/)
- [ROUGE 점수](/wiki/rouge-score/)
- [루브릭 기반 심사](/wiki/rubric-based-judge/)
- [안전 벤치마크](/wiki/safety-benchmark/)
- [자기 선호 편향](/wiki/self-preference-bias/)
- [시뮬레이션 기반 평가](/wiki/simulation-based-evaluation/)
- [특이도](/wiki/specificity/)
- [통계적 유의성](/wiki/statistical-significance/)
- [SWE-bench](/wiki/swe-bench/)
- [과제 벤치마크](/wiki/task-benchmark/)
- [과제 완료율](/wiki/task-completion-rate/)
- [토큰 사용량 모니터링](/wiki/token-usage-monitoring/)
- [도구 사용 평가](/wiki/tool-use-evaluation/)
- [사용자 피드백 수집](/wiki/user-feedback-collection/)
- [장황성 편향](/wiki/verbosity-bias/)
- [승률](/wiki/win-rate/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [A Systematic Analysis of Performance Measures for Classification Tasks](https://atour.iro.umontreal.ca/rali/sites/default/files/publis/SokolovaLapalme-JIPM09.pdf) — paper
<span id="reference-2"></span>2. [TorchMetrics F-1 Score](https://lightning.ai/docs/torchmetrics/stable/classification/f1_score.html) — documentation
<span id="reference-3"></span>3. [F-score — Wikipedia](https://en.wikipedia.org/wiki/F-score) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

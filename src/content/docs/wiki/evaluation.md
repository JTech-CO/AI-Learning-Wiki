---
title: "모델 평가 Model Evaluation"
description: "정해진 데이터·기준·절차로 모델이나 시스템의 품질과 위험을 측정하는 과정이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-lead">정해진 데이터·기준·절차로 모델이나 시스템의 품질과 위험을 측정하는 과정이다.</p>

<div class="wiki-document-meta">분류: [평가·관측성·벤치마크](/category/evaluation/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-12</div>

## 개념과 원리

### 개요와 핵심 정의

정해진 데이터·기준·절차로 모델이나 시스템의 품질과 위험을 측정하는 과정이다.

‘모델 평가’ 개념은 평가·관측성·벤치마크 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 평가 분야는 모델의 품질·안전·비용을 재현 가능한 데이터와 지표로 비교하는 방법을 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 배경과 설명 범위

직접 대응하는 외부 백과 표제어가 뚜렷하지 않은 신생·세부 용어다. 따라서 아래 1차 자료와 상위 개념 문서를 중심으로 범위를 정하고, 제품별 용어는 일반 원리와 분리했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 작동 원리

모델 평가는 과제 정의, 데이터 분할, 지표, 기준선, 통계적 불확실성을 묶어 모델이 요구 조건을 만족하는지 측정한다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

#### 측정 대상과 관측 절차

모델 평가는 추상적인 “좋음”을 관측 가능한 과제, 데이터, 지표와 판정 규칙으로 바꾸는 과정이다. 같은 출력도 사용 목적에 따라 정답 일치, 순위, 사실 근거, 유해성, 지연 시간 중 다른 기준으로 판단된다. 먼저 평가하려는 능력과 실제 의사결정을 명시한 뒤 그 능력을 드러내는 표본을 설계해야 한다. 이미 있는 벤치마크를 선택하고 나서 설명 가능한 목표를 끼워 맞추면 점수는 높아져도 제품 실패를 예측하지 못한다. HELM처럼 시나리오와 지표를 여러 축으로 공개하는 접근은 하나의 종합 점수에 가려지는 정확성·강건성·공정성·효율성의 상충 관계를 드러내는 데 도움이 된다.

평가값은 모델만의 속성이 아니라 모델 버전, 프롬프트, 디코딩 설정, 도구, 데이터 시점과 채점기의 함수다. 생성 과제에서는 동일 입력도 표본 추출에 따라 출력이 달라지므로 반복 실행과 신뢰 구간이 필요하다. 자동 채점기는 빠르지만 참조 답안의 표현과 다른 유효한 답을 놓치거나, 채점 모델의 편향을 가져올 수 있다. 사람 평가는 복잡한 품질을 다루지만 기준 해석과 순서 효과에 흔들린다. 평정 지침, 예시, 무작위 배치, 다수 평가자와 합의 절차를 갖추고 평가자 간 일치도를 보고해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 구성 요소와 처리 흐름

실제 시스템에서는 ‘모델 평가’ 개념만 독립적으로 동작하지 않는다. [벤치마크](/wiki/benchmark/), [평가 지표](/wiki/metric/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

#### 데이터 분할과 비교 설계

학습, 검증, 시험 데이터는 서로 다른 결정을 위해 분리한다. 검증 세트로 모델과 프롬프트를 반복 선택하면 그 세트에 과적합되므로 최종 시험 세트는 선택이 끝날 때까지 격리한다. 공개 벤치마크는 학습 데이터에 포함되었거나 인터넷을 통해 간접 노출되었을 수 있어 오염 점검이 필요하다. 문장 중복만 찾는 것으로 충분하지 않고 번역, 재서술, 풀이 설명처럼 의미가 같은 표본도 고려한다. 운영 데이터는 시간에 따라 변하므로 고정 회귀 세트와 최근 분포를 반영한 순환 세트를 함께 유지한다.

비교 실험에서는 한 번에 바뀌는 요인을 제한한다. 모델 비교라면 프롬프트, 생성 설정, 도구와 평가 코드를 동일하게 고정하고, 시스템 전체 비교라면 어떤 구성까지 묶어 비교하는지 적는다. 표본별 짝 비교는 같은 문제에서 두 시스템의 차이를 직접 계산해 분산을 줄일 수 있다. 평균 점수 외에 범주별 결과와 최악 집단, 실패 유형을 본다. 표본 수가 작은 차이는 우연일 수 있으므로 부트스트랩이나 적절한 통계 검정으로 불확실성을 제시하고, 여러 지표를 반복 탐색했다면 선택 편향을 경계한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

모델 선택, 회귀 테스트, 출시 기준, 운영 모니터링에 사용한다. ‘모델 평가’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

#### 평가 방법을 과제에 맞추기

정답이 하나인 분류·추출은 정확 일치와 클래스별 지표가 유용하지만, 자유 형식 생성은 핵심 사실, 근거, 형식, 유해성을 별도 기준으로 나누는 편이 낫다. 검색 시스템은 최종 답변만 보면 검색 실패와 생성 실패를 구분할 수 없으므로 후보 회수율, 재순위와 근거 사용을 단계별로 측정한다. 에이전트는 최종 상태뿐 아니라 도구 호출의 유효성, 불필요한 행동, 승인 우회와 복구 능력을 본다. 코드 생성은 테스트 통과에 더해 보안, 성능, 기존 동작 회귀를 확인한다.

온라인 A/B 시험은 실제 사용 결과를 보여 주지만 사용자에게 위험을 노출할 수 있고 계절성·학습 효과·트래픽 구성의 영향을 받는다. 오프라인 평가로 명백한 퇴행과 안전 문제를 먼저 제거하고, 작은 트래픽과 중단 조건으로 온라인 증거를 보완한다. 클릭과 체류 시간은 만족이나 정확성의 완전한 대리 지표가 아니므로 사용자 수정, 업무 완료, 불만과 장기 효과를 함께 본다. 고위험 영역에서는 온라인 실험보다 시뮬레이션, 전문가 검토와 관찰 전용 배포를 우선한다.

평가 결과는 숫자 표와 함께 대표 실패 사례를 제공해야 의사결정자가 개선의 의미를 이해할 수 있다. 단, 사례는 결과를 극적으로 보이게 고르는 대신 미리 정한 표본 규칙으로 추출한다. 평가 코드와 데이터 접근이 제한되면 재현 가능한 범위와 제한 이유를 적고, 외부 점수를 내부 점수와 섞어 하나의 순위처럼 표시하지 않는다.

**결과 해석 사례:** 두 모델의 전체 정확도가 각각 82.1%와 82.6%라 해도 곧바로 두 번째 모델을 선택하지 않는다. 표본별 짝 차이의 불확실성을 계산하고, 중요한 희귀 범주에서 재현율이 떨어졌는지, 지연과 비용의 허용 기준을 넘었는지 본다. 차이가 평가 오차 범위 안이라면 더 단순하거나 저렴한 모델을 택할 수 있다.

사람 평가에서 두 모델의 응답을 비교한다면 모델 이름과 순서를 가리고, 동점과 둘 다 부적합을 허용한다. 평가자가 고른 이유를 기준 항목으로 남겨 단순 승률과 함께 분석한다. 의견 불일치가 큰 항목은 무조건 다수결로 없애지 않고 지침이 모호한지, 과제 자체에 여러 유효 답이 있는지 검토한다.

평가 문서의 결론은 “더 좋다”보다 어떤 조건에서 어떤 지표가 얼마나 달라졌고 어떤 실패가 남았는지 적는다. 이 형식은 후속 모델이 다른 설정에서 얻은 점수와 잘못 비교되는 일을 막는다.

릴리스 뒤 발견된 실패를 무작정 시험 세트에 추가하면 세트가 개발 과정에 다시 노출된다. 회귀용 공개 세트와 최종 판정용 보류 세트를 분리하고, 보류 세트의 사용 횟수와 접근자를 기록해 과적합 가능성을 관리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 한계와 흔한 오해

오프라인 점수가 실제 사용자 가치와 안전을 완전히 대변하지 않으므로 배포 후 모니터링과 사람 평가를 보완한다.

벤치마크 오염과 지표 편향, 사람 평가 불일치를 함께 기록한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

#### 벤치마크 포화와 대리 지표

평가 지표는 실제 목표의 대리 변수다. 정확도를 높이는 최적화가 사용자의 시간 절약이나 안전 개선으로 이어지지 않을 수 있으며, 모델이 지표의 허점을 이용하면 점수와 품질이 분리된다. 객관식 정답률은 추론 과정의 신뢰성을 보장하지 않고, 문자열 겹침 지표는 사실을 뒤집은 문장에도 높은 점수를 줄 수 있다. 모델 기반 채점은 장문, 특정 문체, 자기 계열 모델을 선호할 수 있다. 중요한 의사결정에서는 서로 다른 원리의 지표와 사람 검토, 실제 업무 결과를 삼각 측량한다.

순위표는 좁은 점수 차이를 과도하게 강조하기 쉽다. 평가 데이터와 설정이 다르면 숫자를 직접 비교할 수 없고, 비공개 전처리나 재시도 정책도 결과를 바꾼다. 최고 점수만 보고 모델을 선택하면 비용·지연·메모리·안전성의 제약을 놓친다. 평균이 좋아도 특정 언어, 집단, 긴 문맥, 최신 사건에서 심각한 실패가 남을 수 있다. 평가 보고서는 성능을 입증한 범위와 아직 측정하지 않은 범위를 구분하고, 실패가 큰 범주와 표본 수를 함께 공개해야 한다. 평가 세트가 널리 사용될수록 선택 과정에 흡수되므로 주기적인 비공개 표본 갱신이 필요하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [벤치마크](/wiki/benchmark/): 여러 모델이나 시스템을 비교하기 위해 고정한 과제·데이터·평가 지표의 묶음이다.
- [평가 지표](/wiki/metric/): 성능이나 품질의 특정 측면을 수치로 요약하는 측정 기준이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

### 구체적 적용 예시

평가 항목마다 무엇을 맞았다고 볼지 판정 기준과 예시를 작성하고 모델 이름을 가린 상태에서 반복 측정한다. ‘모델 평가’를 적용하는 경우에는 모델 평가는 과제 정의, 데이터 분할, 지표, 기준선, 통계적 불확실성을 묶어 모델이 요구 조건을 만족하는지 측정한다.

점수 차이에 신뢰 구간과 표본 수를 붙이며, 출시 후 실제 사용자 분포에서도 같은 실패 유형이 나타나는지 감시한다. 이때 [벤치마크](/wiki/benchmark/), [평가 지표](/wiki/metric/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실무 적용과 검증 절차

1. **목적 정의:** ‘모델 평가’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 모델 선택, 회귀 테스트, 출시 기준, 운영 모니터링에 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 오프라인 점수가 실제 사용자 가치와 안전을 완전히 대변하지 않으므로 배포 후 모니터링과 사람 평가를 보완한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘모델 평가’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

#### 평가 카드와 출시 기준

평가를 시작할 때 목적, 이해관계자, 실패 비용, 모델을 바꿀 의사결정 기준을 한 장의 평가 카드로 작성한다. 표본 출처와 포함·제외 규칙, 기준 시점, 프롬프트와 생성 설정, 채점 코드 버전, 사람 평가 지침을 고정한다. 전체 결과를 보기 전에 합격 기준과 중요한 하위 집단의 최소 성능을 정하면 결과에 맞춰 기준을 바꾸는 일을 줄일 수 있다. 기준 모델과 후보 모델의 표본별 출력, 채점 근거와 오류 분류를 보존해 재검토가 가능하게 한다.

출시 여부를 판단할 때는 핵심 품질, 안전성, 지연, 비용에 각각 별도 기준을 둔다. 한 지표의 큰 개선으로 다른 지표의 치명적 퇴행을 상쇄하지 않는다. 회귀가 발생하면 단순 평균 대신 어떤 범주와 입력 특성에서 바뀌었는지 분석하고, 수정 뒤 같은 표본과 새로운 확인 표본을 모두 시험한다. 배포 후에는 오프라인 점수와 실제 사용자 결과의 상관을 관찰하고 예상하지 못한 실패를 회귀 세트에 편입한다. 데이터나 채점 기준을 수정할 때는 이전 버전과 점수를 혼합하지 말고 평가 버전을 올린다. 이렇게 해야 시간이 지나도 점수 변화가 모델 개선인지 평가 절차 변경인지 구분할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 문서 관계

### 선행 개념

_해당 문서가 없다._

### 관련 문서

- [벤치마크](/wiki/benchmark/)
- [평가 지표](/wiki/metric/)

### 이 문서를 가리키는 문서

- [개별 채점 평가 설계](/wiki/pointwise-evaluation-design/)
- [개별 LLM 심사](/wiki/pointwise-llm-judge/)
- [검색 평가](/wiki/retrieval-evaluation/)
- [견고성 평가 그리드](/wiki/robustness-evaluation-grid/)
- [계획 평가](/wiki/planning-evaluation/)

<details class="wiki-backlinks-more">
<summary>나머지 123개 문서 보기</summary>

- [곡선 아래 면적](/wiki/area-under-curve/)
- [골든 세트 거버넌스](/wiki/golden-set-governance/)
- [과제 벤치마크](/wiki/task-benchmark/)
- [과제 완료율](/wiki/task-completion-rate/)
- [근거 충실도](/wiki/groundedness/)
- [기대 보정 오차](/wiki/expected-calibration-error/)
- [능력 벤치마크](/wiki/capability-benchmark/)
- [다국어 평가 프로토콜](/wiki/multilingual-evaluation-protocol/)
- [답변 관련성](/wiki/answer-relevance/)
- [데이터 주석](/wiki/data-annotation/)
- [데이터 증강](/wiki/data-augmentation/)
- [도구 사용 평가](/wiki/tool-use-evaluation/)
- [도메인 전문가 평가](/wiki/domain-expert-evaluation/)
- [동적 벤치마크](/wiki/dynamic-benchmark/)
- [로그 손실](/wiki/log-loss/)
- [루브릭 기반 심사](/wiki/rubric-based-judge/)
- [루브릭 신뢰도](/wiki/rubric-reliability/)
- [리더보드](/wiki/leaderboard/)
- [리커트 척도](/wiki/likert-scale/)
- [맹검 평가](/wiki/blind-evaluation/)
- [모델 드리프트 모니터링](/wiki/model-drift-monitoring/)
- [모델 버전](/wiki/model-version/)
- [모델 텔레메트리](/wiki/model-telemetry/)
- [문맥 관련성](/wiki/context-relevance/)
- [반사실 평가](/wiki/counterfactual-evaluation/)
- [벤치마크](/wiki/benchmark/)
- [벤치마크 갱신 정책](/wiki/benchmark-refresh-policy/)
- [벤치마크 데이터셋](/wiki/benchmark-dataset/)
- [벤치마크 모음](/wiki/benchmark-suite/)
- [벤치마크 타당도](/wiki/benchmark-validity/)
- [벤치마크 폐기](/wiki/benchmark-retirement/)
- [벤치마크 포화](/wiki/benchmark-saturation/)
- [부트스트랩 신뢰구간](/wiki/bootstrap-confidence-interval/)
- [브라이어 점수](/wiki/brier-score/)
- [비용 모니터링](/wiki/cost-monitoring/)
- [사용자 피드백 수집](/wiki/user-feedback-collection/)
- [생성 평가](/wiki/generation-evaluation/)
- [순차 평가](/wiki/sequential-evaluation/)
- [쉐도 평가](/wiki/shadow-evaluation/)
- [슬라이스 기반 릴리스 게이트](/wiki/slice-based-release-gate/)
- [승률](/wiki/win-rate/)
- [시뮬레이션 기반 평가](/wiki/simulation-based-evaluation/)
- [심사 모델](/wiki/judge-model/)
- [심사 모델 메타평가](/wiki/judge-meta-evaluation/)
- [심사 모델 보정](/wiki/judge-calibration/)
- [심사 모델 앙상블](/wiki/judge-ensemble/)
- [심사 모델 합의도](/wiki/judge-agreement/)
- [심사 위치 편향](/wiki/position-bias-in-judging/)
- [쌍대 비교](/wiki/pairwise-comparison/)
- [쌍대 비교 평가 설계](/wiki/pairwise-evaluation-design/)
- [쌍대 LLM 심사](/wiki/pairwise-llm-judge/)
- [안전 벤치마크](/wiki/safety-benchmark/)
- [에이전트 평가](/wiki/agent-evaluation/)
- [역량 회귀](/wiki/capability-regression/)
- [온라인 평가 드리프트](/wiki/online-evaluation-drift/)
- [완전 일치](/wiki/exact-match/)
- [이미지 분류](/wiki/image-classification/)
- [인간 평가](/wiki/human-evaluation/)
- [인용 정확성](/wiki/citation-correctness/)
- [자기 선호 편향](/wiki/self-preference-bias/)
- [자동 평가자](/wiki/automatic-rater/)
- [장황성 편향](/wiki/verbosity-bias/)
- [재현 가능한 평가](/wiki/reproducible-evaluation/)
- [전문가 평가](/wiki/expert-evaluation/)
- [정밀도-재현율 곡선](/wiki/precision-recall-curve/)
- [정성 평가](/wiki/qualitative-evaluation/)
- [종단간 성공률](/wiki/end-to-end-success-rate/)
- [주석 판정](/wiki/annotation-adjudication/)
- [주석자 편향](/wiki/annotator-bias/)
- [주석자 피로](/wiki/annotator-fatigue/)
- [주석자 합의도](/wiki/annotator-agreement/)
- [지연 시간 모니터링](/wiki/latency-monitoring/)
- [참조 기반 평가](/wiki/reference-based-evaluation/)
- [참조 없는 평가](/wiki/reference-free-evaluation/)
- [충실성](/wiki/faithfulness/)
- [카나리 평가](/wiki/canary-evaluation/)
- [크라우드소싱 평가](/wiki/crowdsourced-evaluation/)
- [토큰 사용량 모니터링](/wiki/token-usage-monitoring/)
- [통계적 유의성](/wiki/statistical-significance/)
- [특이도](/wiki/specificity/)
- [판정 길이 편향 통제](/wiki/judge-length-bias-control/)
- [판정 모델 교정 곡선](/wiki/judge-calibration-curve/)
- [판정 위치 무작위화](/wiki/judge-position-randomization/)
- [평가 데이터셋 계보](/wiki/evaluation-dataset-lineage/)
- [평가 루브릭](/wiki/evaluation-rubric/)
- [평가 불확실성](/wiki/evaluation-uncertainty/)
- [평가 슬라이스](/wiki/evaluation-slice/)
- [평가 신뢰구간](/wiki/evaluation-confidence-interval/)
- [평가 예산 배분](/wiki/evaluation-budget-allocation/)
- [평가 오류 분류 체계](/wiki/evaluation-error-taxonomy/)
- [평가 오염 감사](/wiki/evaluation-contamination-audit/)
- [평가 의사결정 로그](/wiki/evaluation-decision-log/)
- [평가 지표](/wiki/metric/)
- [평가 표본추출](/wiki/evaluation-sampling/)
- [평가자 간 신뢰도](/wiki/inter-rater-reliability/)
- [프로덕션 평가](/wiki/production-evaluation/)
- [프롬프트 추적](/wiki/prompt-trace/)
- [합성 데이터](/wiki/synthetic-data/)
- [행동 회귀](/wiki/behavioral-regression/)
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
- [LLM 판정 앙상블](/wiki/llm-judge-ensemble/)
- [LLM 평가 계약](/wiki/llm-evaluation-contract/)
- [LLM 평가자 간 일치도](/wiki/inter-rater-agreement-for-llm/)
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

[멀티모달 AI](/course/multimodal-ai/) · [신뢰할 수 있는 AI](/course/responsible-ai/) · [LLM 평가와 관측성](/course/llm-evaluation/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110) — paper
<span id="reference-2"></span>2. [Machine learning: model assessments — Wikipedia](https://en.wikipedia.org/wiki/Machine_learning#Model_assessments) — encyclopedia
<span id="reference-3"></span>3. [MLCommons Benchmarks](https://mlcommons.org/benchmarks/) — documentation

### 코스에서 계속 읽기

- **멀티모달 AI:** [다음 문서 — 모델 라이선스](/wiki/model-license/)
- **신뢰할 수 있는 AI:** [다음 문서 — 벤치마크](/wiki/benchmark/)
- **LLM 평가와 관측성:** [다음 문서 — 평가 지표](/wiki/metric/)

---
title: "평가·관측성·벤치마크"
description: "모델과 시스템의 품질을 측정하는 방법"
---

모델과 시스템의 품질을 측정하는 방법 분야의 검토 완료 백과 문서다.

<nav class="wiki-letter-index" aria-label="문서 초성 색인"><a href="#index-ko-g">ㄱ</a><a href="#index-ko-n">ㄴ</a><a href="#index-ko-d">ㄷ</a><a href="#index-ko-r">ㄹ</a><a href="#index-ko-m">ㅁ</a><a href="#index-ko-b">ㅂ</a><a href="#index-ko-s">ㅅ</a><a href="#index-ko-ss">ㅆ</a><a href="#index-ko-ng">ㅇ</a><a href="#index-ko-j">ㅈ</a><a href="#index-ko-ch">ㅊ</a><a href="#index-ko-k">ㅋ</a><a href="#index-ko-t">ㅌ</a><a href="#index-ko-p">ㅍ</a><a href="#index-ko-h">ㅎ</a><a href="#index-en-b">B</a><a href="#index-en-f">F</a><a href="#index-en-g">G</a><a href="#index-en-h">H</a><a href="#index-en-i">I</a><a href="#index-en-l">L</a><a href="#index-en-m">M</a><a href="#index-en-p">P</a><a href="#index-en-r">R</a><a href="#index-en-s">S</a></nav>

<div class="wiki-index-groups">
<section class="wiki-index-group" data-index-group="ko-g">
<h2 id="index-ko-g">ㄱ</h2>
<ul class="wiki-index-list">
<li data-article-id="pointwise-evaluation-design"><a href="/wiki/pointwise-evaluation-design/">개별 채점 평가 설계</a><span class="wiki-index-summary">개별 채점 평가 설계는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="pointwise-llm-judge"><a href="/wiki/pointwise-llm-judge/">개별 LLM 심사</a><span class="wiki-index-summary">개별 LLM 심사은 평가 모델이 한 응답을 독립적으로 보고 절대 등급이나 수치 점수를 부여하는 방식이다.</span></li>
<li data-article-id="retrieval-evaluation"><a href="/wiki/retrieval-evaluation/">검색 평가</a><span class="wiki-index-summary">검색 평가는 질의에 대해 관련 문서가 결과 목록의 적절한 위치에 나타나는지를 측정하는 과정이다.</span></li>
<li data-article-id="robustness-evaluation-grid"><a href="/wiki/robustness-evaluation-grid/">견고성 평가 그리드</a><span class="wiki-index-summary">견고성 평가 그리드는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="planning-evaluation"><a href="/wiki/planning-evaluation/">계획 평가</a><span class="wiki-index-summary">계획 평가는 목표를 달성하기 위해 만든 행동 순서가 타당하고 효율적이며 제약을 지키는지를 측정한다.</span></li>
<li data-article-id="area-under-curve"><a href="/wiki/area-under-curve/">곡선 아래 면적</a><span class="wiki-index-summary">성능 곡선 아래의 면적을 하나의 수로 요약한 값이며 어떤 곡선과 적분 규칙을 사용했는지 함께 명시해야 한다.</span></li>
<li data-article-id="golden-set-governance"><a href="/wiki/golden-set-governance/">골든 세트 거버넌스</a><span class="wiki-index-summary">골든 세트 거버넌스는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="task-benchmark"><a href="/wiki/task-benchmark/">과제 벤치마크</a><span class="wiki-index-summary">과제 벤치마크는 번역·분류·코드 생성처럼 명시된 한 과제의 성능을 비교하기 위한 데이터와 채점 규칙이다.</span></li>
<li data-article-id="task-completion-rate"><a href="/wiki/task-completion-rate/">과제 완료율</a><span class="wiki-index-summary">과제 완료율은 할당된 작업 중 명시한 완료 조건에 도달한 작업의 비율이다.</span></li>
<li data-article-id="observability"><a href="/wiki/observability/">관측성</a><span class="wiki-index-summary">로그·메트릭·추적 정보로 시스템 내부 상태와 실패 원인을 이해할 수 있는 정도다.</span></li>
<li data-article-id="groundedness"><a href="/wiki/groundedness/">근거 충실도</a><span class="wiki-index-summary">근거 충실도는 시스템 출력이 주어진 자료나 관측 가능한 사실에 기반하고 근거 밖 내용을 단정하지 않는 성질이다.</span></li>
<li data-article-id="expected-calibration-error"><a href="/wiki/expected-calibration-error/">기대 보정 오차</a><span class="wiki-index-summary">기대 보정 오차(ECE)는 비슷한 신뢰도의 예측을 구간으로 묶고 각 구간의 평균 신뢰도와 실제 정확도 차이를 가중 평균한 값이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-n">
<h2 id="index-ko-n">ㄴ</h2>
<ul class="wiki-index-list">
<li data-article-id="capability-benchmark"><a href="/wiki/capability-benchmark/">능력 벤치마크</a><span class="wiki-index-summary">능력 벤치마크는 지식, 추론, 계획처럼 여러 과제에 걸친 상위 능력을 조작적으로 정의해 측정하는 평가다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-d">
<h2 id="index-ko-d">ㄷ</h2>
<ul class="wiki-index-list">
<li data-article-id="multilingual-evaluation-protocol"><a href="/wiki/multilingual-evaluation-protocol/">다국어 평가 프로토콜</a><span class="wiki-index-summary">다국어 평가 프로토콜은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="answer-relevance"><a href="/wiki/answer-relevance/">답변 관련성</a><span class="wiki-index-summary">답변 관련성은 생성된 답이 사용자의 질문 의도와 필요한 정보에 얼마나 직접 대응하는지를 나타낸다.</span></li>
<li data-article-id="paired-bootstrap"><a href="/wiki/paired-bootstrap/">대응 부트스트랩</a><span class="wiki-index-summary">대응 부트스트랩은 같은 평가 사례에 대한 두 시스템의 결과 쌍을 함께 재표집해 지표 차이의 불확실성을 추정하는 방법이다.</span></li>
<li data-article-id="data-annotation"><a href="/wiki/data-annotation/">데이터 주석</a><span class="wiki-index-summary">데이터 주석은 원시 데이터에 범주, 경계, 관계, 선호나 설명을 부여해 학습·평가에 사용할 참조 정보를 만드는 과정이다.</span></li>
<li data-article-id="tool-use-evaluation"><a href="/wiki/tool-use-evaluation/">도구 사용 평가</a><span class="wiki-index-summary">도구 사용 평가는 에이전트가 적절한 도구를 선택하고 올바른 인수로 호출하며 결과와 오류를 정확히 처리하는지를 측정한다.</span></li>
<li data-article-id="domain-expert-evaluation"><a href="/wiki/domain-expert-evaluation/">도메인 전문가 평가</a><span class="wiki-index-summary">도메인 전문가 평가는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="dynamic-benchmark"><a href="/wiki/dynamic-benchmark/">동적 벤치마크</a><span class="wiki-index-summary">동적 벤치마크는 모델 성능과 실패 양상에 맞추어 평가 사례를 지속적으로 수집·갱신하는 벤치마크다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-r">
<h2 id="index-ko-r">ㄹ</h2>
<ul class="wiki-index-list">
<li data-article-id="log-loss"><a href="/wiki/log-loss/">로그 손실</a><span class="wiki-index-summary">모델이 실제 클래스에 부여한 확률의 음의 로그를 평균한 확률적 분류 손실이다.</span></li>
<li data-article-id="rubric-based-judge"><a href="/wiki/rubric-based-judge/">루브릭 기반 심사</a><span class="wiki-index-summary">루브릭 기반 심사은 명시된 평가 차원, 등급 설명과 감점 조건에 따라 후보 응답을 채점하는 방식이다.</span></li>
<li data-article-id="rubric-reliability"><a href="/wiki/rubric-reliability/">루브릭 신뢰도</a><span class="wiki-index-summary">루브릭 신뢰도는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="leaderboard"><a href="/wiki/leaderboard/">리더보드</a><span class="wiki-index-summary">리더보드는 동일한 평가 규칙으로 측정한 모델이나 시스템의 성능을 순위와 함께 공개하는 표다.</span></li>
<li data-article-id="likert-scale"><a href="/wiki/likert-scale/">리커트 척도</a><span class="wiki-index-summary">리커트 척도는 응답자가 진술에 대한 동의나 평가 정도를 순서가 있는 여러 범주 중 하나로 표시하는 척도다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-m">
<h2 id="index-ko-m">ㅁ</h2>
<ul class="wiki-index-list">
<li data-article-id="blind-evaluation"><a href="/wiki/blind-evaluation/">맹검 평가</a><span class="wiki-index-summary">맹검 평가는 평가자가 후보의 제작자·모델명·실험 조건 중 판단에 불필요한 정보를 모른 채 결과를 판정하는 절차다.</span></li>
<li data-article-id="model-drift-monitoring"><a href="/wiki/model-drift-monitoring/">모델 드리프트 모니터링</a><span class="wiki-index-summary">모델 드리프트 모니터링은 운영 입력, 예측과 성능의 통계적 관계가 기준 기간에서 변하는지 지속 확인하는 과정이다.</span></li>
<li data-article-id="model-telemetry"><a href="/wiki/model-telemetry/">모델 텔레메트리</a><span class="wiki-index-summary">모델 텔레메트리는 운영 중 모델 요청, 출력, 자원 사용과 품질 신호를 관찰 가능하도록 수집한 로그·지표·추적 데이터다.</span></li>
<li data-article-id="evaluation"><a href="/wiki/evaluation/">모델 평가</a><span class="wiki-index-summary">정해진 데이터·기준·절차로 모델이나 시스템의 품질과 위험을 측정하는 과정이다.</span></li>
<li data-article-id="context-relevance"><a href="/wiki/context-relevance/">문맥 관련성</a><span class="wiki-index-summary">문맥 관련성은 검색해 제공한 구절이 질의와 답변 작성에 필요한 정보를 얼마나 포함하는지를 나타낸다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-b">
<h2 id="index-ko-b">ㅂ</h2>
<ul class="wiki-index-list">
<li data-article-id="counterfactual-evaluation"><a href="/wiki/counterfactual-evaluation/">반사실 평가</a><span class="wiki-index-summary">반사실 평가는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="benchmark"><a href="/wiki/benchmark/">벤치마크</a><span class="wiki-index-summary">여러 모델이나 시스템을 비교하기 위해 고정한 과제·데이터·평가 지표의 묶음이다.</span></li>
<li data-article-id="benchmark-refresh-policy"><a href="/wiki/benchmark-refresh-policy/">벤치마크 갱신 정책</a><span class="wiki-index-summary">벤치마크 갱신 정책은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="benchmark-dataset"><a href="/wiki/benchmark-dataset/">벤치마크 데이터셋</a><span class="wiki-index-summary">벤치마크 데이터셋은 모델이나 방법을 같은 입력과 정답 기준에서 비교하도록 고정한 평가용 데이터 모음이다.</span></li>
<li data-article-id="benchmark-suite"><a href="/wiki/benchmark-suite/">벤치마크 모음</a><span class="wiki-index-summary">벤치마크 모음은 여러 과제·데이터셋·지표를 하나의 평가 프로토콜로 묶어 시스템의 다양한 능력을 측정하는 구성이다.</span></li>
<li data-article-id="benchmark-validity"><a href="/wiki/benchmark-validity/">벤치마크 타당도</a><span class="wiki-index-summary">벤치마크 타당도는 평가 점수가 측정하려는 실제 능력이나 사용 목표를 얼마나 제대로 대표하는지를 뜻한다.</span></li>
<li data-article-id="benchmark-retirement"><a href="/wiki/benchmark-retirement/">벤치마크 폐기</a><span class="wiki-index-summary">벤치마크 폐기는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="benchmark-saturation"><a href="/wiki/benchmark-saturation/">벤치마크 포화</a><span class="wiki-index-summary">벤치마크 포화는 많은 시스템이 평가 상한에 가까워져 점수 차이가 실제 능력 차이를 충분히 구분하지 못하는 상태다.</span></li>
<li data-article-id="bootstrap-confidence-interval"><a href="/wiki/bootstrap-confidence-interval/">부트스트랩 신뢰구간</a><span class="wiki-index-summary">부트스트랩 신뢰구간은 관측 표본을 복원 추출해 통계량의 경험적 표집분포를 만들고 그 분위수 등으로 구한 불확실성 구간이다.</span></li>
<li data-article-id="brier-score"><a href="/wiki/brier-score/">브라이어 점수</a><span class="wiki-index-summary">브라이어 점수는 확률 예측과 실제 이진 결과 사이의 제곱 오차 평균으로 확률 예측의 정확성을 평가한다.</span></li>
<li data-article-id="cost-monitoring"><a href="/wiki/cost-monitoring/">비용 모니터링</a><span class="wiki-index-summary">비용 모니터링은 AI 서비스의 사용량과 가격을 지속 결합해 실제 지출, 단위 비용과 예산 소진을 관찰하는 활동이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-s">
<h2 id="index-ko-s">ㅅ</h2>
<ul class="wiki-index-list">
<li data-article-id="user-feedback-collection"><a href="/wiki/user-feedback-collection/">사용자 피드백 수집</a><span class="wiki-index-summary">사용자 피드백 수집은 실제 이용자가 AI 결과의 유용성·정확성·안전성에 제공한 명시적·암묵적 신호를 구조화해 기록하는 과정이다.</span></li>
<li data-article-id="generation-evaluation"><a href="/wiki/generation-evaluation/">생성 평가</a><span class="wiki-index-summary">생성 평가는 모델 출력의 정확성, 관련성, 유창성, 다양성, 안전성과 과제 제약 준수를 측정하는 과정이다.</span></li>
<li data-article-id="selective-prediction"><a href="/wiki/selective-prediction/">선택적 예측</a><span class="wiki-index-summary">선택적 예측은 모델이 모든 입력에 답하지 않고 신뢰 기준을 만족하는 일부 입력에만 예측을 내도록 하는 의사결정 방식이다.</span></li>
<li data-article-id="sequential-evaluation"><a href="/wiki/sequential-evaluation/">순차 평가</a><span class="wiki-index-summary">순차 평가는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="shadow-evaluation"><a href="/wiki/shadow-evaluation/">쉐도 평가</a><span class="wiki-index-summary">쉐도 평가는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="slice-based-release-gate"><a href="/wiki/slice-based-release-gate/">슬라이스 기반 릴리스 게이트</a><span class="wiki-index-summary">슬라이스 기반 릴리스 게이트는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="win-rate"><a href="/wiki/win-rate/">승률</a><span class="wiki-index-summary">승률은 두 모델이나 방법을 쌍대 비교했을 때 한쪽이 더 낫다고 판정된 비율이다.</span></li>
<li data-article-id="simulation-based-evaluation"><a href="/wiki/simulation-based-evaluation/">시뮬레이션 기반 평가</a><span class="wiki-index-summary">시뮬레이션 기반 평가는 실제 환경을 모사한 상태 전이와 사용자·도구 모델 안에서 AI 시스템의 행동을 반복 시험하는 방법이다.</span></li>
<li data-article-id="judge-model"><a href="/wiki/judge-model/">심사 모델</a><span class="wiki-index-summary">심사 모델은 하나 이상의 후보 응답을 평가 기준에 따라 채점하거나 비교하도록 지시된 언어 모델이다.</span></li>
<li data-article-id="judge-meta-evaluation"><a href="/wiki/judge-meta-evaluation/">심사 모델 메타평가</a><span class="wiki-index-summary">심사 모델 메타평가는 자동 판정자 자체의 정확성, 일관성, 편향과 강건성을 평가하는 절차다.</span></li>
<li data-article-id="judge-calibration"><a href="/wiki/judge-calibration/">심사 모델 보정</a><span class="wiki-index-summary">심사 모델 보정은 판정 모델이 내는 점수나 확률이 실제 품질 수준 또는 사람 판단 빈도와 맞도록 조정하는 과정이다.</span></li>
<li data-article-id="judge-ensemble"><a href="/wiki/judge-ensemble/">심사 모델 앙상블</a><span class="wiki-index-summary">심사 모델 앙상블은 서로 다른 판정 모델이나 판정 설정의 결과를 결합해 단일 판정자의 변동과 편향을 줄이는 방법이다.</span></li>
<li data-article-id="judge-agreement"><a href="/wiki/judge-agreement/">심사 모델 합의도</a><span class="wiki-index-summary">심사 모델 합의도는 여러 판정자 또는 반복 판정이 같은 항목에 얼마나 일관된 등급이나 선호를 부여하는지 나타내는 성질이다.</span></li>
<li data-article-id="position-bias-in-judging"><a href="/wiki/position-bias-in-judging/">심사 위치 편향</a><span class="wiki-index-summary">심사 위치 편향은 내용이 같아도 후보가 제시된 순서나 좌우 위치에 따라 판정 결과가 체계적으로 달라지는 현상이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ss">
<h2 id="index-ko-ss">ㅆ</h2>
<ul class="wiki-index-list">
<li data-article-id="pairwise-comparison"><a href="/wiki/pairwise-comparison/">쌍대 비교</a><span class="wiki-index-summary">쌍대 비교는 두 후보를 동시에 제시하고 어느 쪽이 기준에 더 부합하는지 선택하게 하는 평가 방식이다.</span></li>
<li data-article-id="pairwise-evaluation-design"><a href="/wiki/pairwise-evaluation-design/">쌍대 비교 평가 설계</a><span class="wiki-index-summary">쌍대 비교 평가 설계는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="pairwise-llm-judge"><a href="/wiki/pairwise-llm-judge/">쌍대 LLM 심사</a><span class="wiki-index-summary">쌍대 LLM 심사은 평가 모델이 두 후보 응답을 나란히 비교해 더 나은 쪽이나 동률을 선택하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ng">
<h2 id="index-ko-ng">ㅇ</h2>
<ul class="wiki-index-list">
<li data-article-id="safety-benchmark"><a href="/wiki/safety-benchmark/">안전 벤치마크</a><span class="wiki-index-summary">안전 벤치마크는 유해 출력, 편향, 보안 취약성이나 거부 행동 등 모델의 위험 관련 특성을 측정하는 평가다.</span></li>
<li data-article-id="agent-evaluation"><a href="/wiki/agent-evaluation/">에이전트 평가</a><span class="wiki-index-summary">에이전트 평가는 자율 시스템의 최종 결과뿐 아니라 계획, 도구 사용, 상태 관리, 복구와 안전한 중단 능력을 측정하는 과정이다.</span></li>
<li data-article-id="capability-regression"><a href="/wiki/capability-regression/">역량 회귀</a><span class="wiki-index-summary">역량 회귀는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="abstention-mechanism"><a href="/wiki/abstention-mechanism/">예측 보류 메커니즘</a><span class="wiki-index-summary">예측 보류 메커니즘은 불확실하거나 위험한 입력에 대해 모델이 답을 확정하지 않고 사람 검토나 다른 처리 경로로 넘기게 하는 규칙이다.</span></li>
<li data-article-id="online-evaluation-drift"><a href="/wiki/online-evaluation-drift/">온라인 평가 드리프트</a><span class="wiki-index-summary">온라인 평가 드리프트는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="exact-match"><a href="/wiki/exact-match/">완전 일치</a><span class="wiki-index-summary">완전 일치는 예측 문자열이나 구조가 정답과 사전에 정한 정규화 뒤 정확히 같은지를 세는 평가 지표다.</span></li>
<li data-article-id="risk-coverage-curve"><a href="/wiki/risk-coverage-curve/">위험도-포괄률 곡선</a><span class="wiki-index-summary">위험도-포괄률 곡선은 선택적 예측의 수락 임곗값을 바꾸며 자동 처리 비율과 선택된 표본의 오류를 함께 나타내는 평가 곡선이다.</span></li>
<li data-article-id="human-evaluation"><a href="/wiki/human-evaluation/">인간 평가</a><span class="wiki-index-summary">인간 평가는 사람이 정의된 기준에 따라 모델 출력의 품질·선호·안전성 등을 직접 판단하는 평가 방식이다.</span></li>
<li data-article-id="citation-correctness"><a href="/wiki/citation-correctness/">인용 정확성</a><span class="wiki-index-summary">인용 정확성은 답변에 붙은 인용이 해당 주장과 올바른 출처를 실제로 연결하는 정도다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-j">
<h2 id="index-ko-j">ㅈ</h2>
<ul class="wiki-index-list">
<li data-article-id="self-preference-bias"><a href="/wiki/self-preference-bias/">자기 선호 편향</a><span class="wiki-index-summary">자기 선호 편향은 평가 모델이 자신이나 같은 계열 모델이 생성한 답변을 다른 모델의 답변보다 더 높게 평가하는 경향이다.</span></li>
<li data-article-id="automatic-rater"><a href="/wiki/automatic-rater/">자동 평가자</a><span class="wiki-index-summary">자동 평가자는 규칙, 통계 모델 또는 언어 모델을 사용해 시스템 출력을 사람의 개별 판정 없이 점수화하는 평가 구성 요소다.</span></li>
<li data-article-id="verbosity-bias"><a href="/wiki/verbosity-bias/">장황성 편향</a><span class="wiki-index-summary">장황성 편향은 평가자가 동일한 핵심 품질에서도 더 길고 자세한 답변을 부당하게 높게 평가하는 경향이다.</span></li>
<li data-article-id="reproducible-evaluation"><a href="/wiki/reproducible-evaluation/">재현 가능한 평가</a><span class="wiki-index-summary">재현 가능한 평가는 동일한 데이터·모델·평가기·환경을 사용한 독립 실행에서 허용 오차 안의 결과를 얻을 수 있는 평가 절차다.</span></li>
<li data-article-id="expert-evaluation"><a href="/wiki/expert-evaluation/">전문가 평가</a><span class="wiki-index-summary">전문가 평가는 해당 분야의 지식과 실무 경험을 가진 평가자가 전문 기준으로 결과의 정확성·유용성·위험을 판정하는 방식이다.</span></li>
<li data-article-id="precision-recall-curve"><a href="/wiki/precision-recall-curve/">정밀도-재현율 곡선</a><span class="wiki-index-summary">분류 임계값을 변화시키며 재현율에 대한 정밀도를 그려 양성 탐지와 오탐의 교환 관계를 보여 주는 곡선이다.</span></li>
<li data-article-id="precision-recall"><a href="/wiki/precision-recall/">정밀도와 재현율</a><span class="wiki-index-summary">정밀도는 양성으로 예측한 항목의 적중 비율이고 재현율은 실제 양성 가운데 찾아낸 비율이다.</span></li>
<li data-article-id="qualitative-evaluation"><a href="/wiki/qualitative-evaluation/">정성 평가</a><span class="wiki-index-summary">정성 평가는 수치 점수만으로 드러나지 않는 출력의 특성, 오류 양상과 사용 경험을 서술적 근거로 분석하는 방법이다.</span></li>
<li data-article-id="accuracy"><a href="/wiki/accuracy/">정확도</a><span class="wiki-index-summary">전체 평가 예시 중 모델이 정답을 맞힌 비율이다.</span></li>
<li data-article-id="end-to-end-success-rate"><a href="/wiki/end-to-end-success-rate/">종단간 성공률</a><span class="wiki-index-summary">종단간 성공률은 시스템의 모든 단계를 거친 전체 요청 중 최종 성공 기준을 충족한 비율이다.</span></li>
<li data-article-id="annotation-adjudication"><a href="/wiki/annotation-adjudication/">주석 판정</a><span class="wiki-index-summary">주석 판정은 주석자 사이의 불일치를 지침과 증거에 따라 검토해 최종 참조 레이블을 결정하는 절차다.</span></li>
<li data-article-id="annotator-bias"><a href="/wiki/annotator-bias/">주석자 편향</a><span class="wiki-index-summary">주석자 편향은 평가자의 배경, 기대, 선호 또는 제시 방식이 정답과 무관하게 라벨이나 점수에 체계적으로 영향을 주는 현상이다.</span></li>
<li data-article-id="annotator-fatigue"><a href="/wiki/annotator-fatigue/">주석자 피로</a><span class="wiki-index-summary">주석자 피로는 반복적이거나 긴 평가 작업으로 주의력과 판단 일관성이 시간에 따라 떨어지는 현상이다.</span></li>
<li data-article-id="annotator-agreement"><a href="/wiki/annotator-agreement/">주석자 합의도</a><span class="wiki-index-summary">주석자 합의도는 같은 사례를 독립적으로 판정한 주석자들이 얼마나 일치하는지 나타내는 품질 정보다.</span></li>
<li data-article-id="latency-monitoring"><a href="/wiki/latency-monitoring/">지연 시간 모니터링</a><span class="wiki-index-summary">지연 시간 모니터링은 요청 시작부터 첫 토큰과 완료까지 걸린 시간을 단계별 분포로 추적하는 활동이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ch">
<h2 id="index-ko-ch">ㅊ</h2>
<ul class="wiki-index-list">
<li data-article-id="reference-based-evaluation"><a href="/wiki/reference-based-evaluation/">참조 기반 평가</a><span class="wiki-index-summary">참조 기반 평가는 모델 출력과 사람이 작성했거나 검증된 정답을 비교해 품질을 측정하는 방식이다.</span></li>
<li data-article-id="reference-free-evaluation"><a href="/wiki/reference-free-evaluation/">참조 없는 평가</a><span class="wiki-index-summary">참조 없는 평가는 정답 문장 없이 입력, 출력, 평가 기준만으로 응답의 품질을 판단하는 방식이다.</span></li>
<li data-article-id="minimum-detectable-effect"><a href="/wiki/minimum-detectable-effect/">최소 검출 가능 효과</a><span class="wiki-index-summary">최소 검출 가능 효과는 정한 유의수준, 검정력, 표본 크기와 변동성에서 실험이 지정된 확률로 검출하도록 설계된 가장 작은 효과 크기다.</span></li>
<li data-article-id="tracing"><a href="/wiki/tracing/">추적</a><span class="wiki-index-summary">한 요청이 여러 모델·도구·단계를 거치는 실행 흐름과 시간을 기록하는 방법이다.</span></li>
<li data-article-id="faithfulness"><a href="/wiki/faithfulness/">충실성</a><span class="wiki-index-summary">충실성은 생성 답변의 사실 주장과 추론이 제공된 근거 문맥에서 실제로 지지되는 정도다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-k">
<h2 id="index-ko-k">ㅋ</h2>
<ul class="wiki-index-list">
<li data-article-id="canary-evaluation"><a href="/wiki/canary-evaluation/">카나리 평가</a><span class="wiki-index-summary">카나리 평가는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="conformal-prediction"><a href="/wiki/conformal-prediction/">컨포멀 예측</a><span class="wiki-index-summary">컨포멀 예측은 교환 가능성 가정 아래 보정 데이터의 비적합도 점수를 사용해 유한 표본 포괄률을 목표로 하는 예측 집합이나 구간을 만드는 방법이다.</span></li>
<li data-article-id="crowdsourced-evaluation"><a href="/wiki/crowdsourced-evaluation/">크라우드소싱 평가</a><span class="wiki-index-summary">크라우드소싱 평가는 온라인 참여자 집단에 작은 평가 과제를 분배해 대규모 판단 데이터를 수집하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-t">
<h2 id="index-ko-t">ㅌ</h2>
<ul class="wiki-index-list">
<li data-article-id="token-usage-monitoring"><a href="/wiki/token-usage-monitoring/">토큰 사용량 모니터링</a><span class="wiki-index-summary">토큰 사용량 모니터링은 모델 요청의 입력·출력·캐시·추론 토큰 수를 지속 측정해 비용과 문맥 사용을 관찰하는 활동이다.</span></li>
<li data-article-id="statistical-significance"><a href="/wiki/statistical-significance/">통계적 유의성</a><span class="wiki-index-summary">통계적 유의성은 귀무가설 아래 관측된 차이 이상이 우연히 나타날 확률이 정한 기준보다 작은지를 나타내는 판단이다.</span></li>
<li data-article-id="specificity"><a href="/wiki/specificity/">특이도</a><span class="wiki-index-summary">실제 음성 사례 가운데 모델이 음성으로 올바르게 판정한 비율이며 TN을 TN과 FP의 합으로 나눈다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-p">
<h2 id="index-ko-p">ㅍ</h2>
<ul class="wiki-index-list">
<li data-article-id="judge-length-bias-control"><a href="/wiki/judge-length-bias-control/">판정 길이 편향 통제</a><span class="wiki-index-summary">판정 길이 편향 통제는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="judge-calibration-curve"><a href="/wiki/judge-calibration-curve/">판정 모델 교정 곡선</a><span class="wiki-index-summary">판정 모델 교정 곡선은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="judge-position-randomization"><a href="/wiki/judge-position-randomization/">판정 위치 무작위화</a><span class="wiki-index-summary">판정 위치 무작위화는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-dataset-lineage"><a href="/wiki/evaluation-dataset-lineage/">평가 데이터셋 계보</a><span class="wiki-index-summary">평가 데이터셋 계보는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-rubric"><a href="/wiki/evaluation-rubric/">평가 루브릭</a><span class="wiki-index-summary">평가 루브릭은 결과를 판단할 기준과 수준별 설명, 배점 규칙을 명시한 채점 도구다.</span></li>
<li data-article-id="evaluation-uncertainty"><a href="/wiki/evaluation-uncertainty/">평가 불확실성</a><span class="wiki-index-summary">평가 불확실성은 제한된 표본·평가자·무작위 실행·측정 오류 때문에 보고된 모델 성능이 참 성능과 다를 수 있는 정도다.</span></li>
<li data-article-id="evaluation-slice"><a href="/wiki/evaluation-slice/">평가 슬라이스</a><span class="wiki-index-summary">평가 슬라이스는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-confidence-interval"><a href="/wiki/evaluation-confidence-interval/">평가 신뢰구간</a><span class="wiki-index-summary">평가 신뢰구간은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-budget-allocation"><a href="/wiki/evaluation-budget-allocation/">평가 예산 배분</a><span class="wiki-index-summary">평가 예산 배분은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-error-taxonomy"><a href="/wiki/evaluation-error-taxonomy/">평가 오류 분류 체계</a><span class="wiki-index-summary">평가 오류 분류 체계는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-contamination-audit"><a href="/wiki/evaluation-contamination-audit/">평가 오염 감사</a><span class="wiki-index-summary">평가 오염 감사는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="evaluation-decision-log"><a href="/wiki/evaluation-decision-log/">평가 의사결정 로그</a><span class="wiki-index-summary">평가 의사결정 로그는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="metric"><a href="/wiki/metric/">평가 지표</a><span class="wiki-index-summary">성능이나 품질의 특정 측면을 수치로 요약하는 측정 기준이다.</span></li>
<li data-article-id="evaluation-sampling"><a href="/wiki/evaluation-sampling/">평가 표본추출</a><span class="wiki-index-summary">평가 표본추출은 전체 가능한 입력 중 평가에 사용할 사례를 규칙에 따라 선택하는 과정이다.</span></li>
<li data-article-id="inter-rater-reliability"><a href="/wiki/inter-rater-reliability/">평가자 간 신뢰도</a><span class="wiki-index-summary">평가자 간 신뢰도는 여러 평가자의 점수가 평가 대상의 차이를 일관되게 반영하는 정도를 통계적으로 측정한 값이다.</span></li>
<li data-article-id="production-evaluation"><a href="/wiki/production-evaluation/">프로덕션 평가</a><span class="wiki-index-summary">프로덕션 평가는 실제 트래픽과 운영 제약에서 AI 시스템의 품질·안전·비용을 지속 측정하는 평가 체계다.</span></li>
<li data-article-id="prompt-trace"><a href="/wiki/prompt-trace/">프롬프트 추적</a><span class="wiki-index-summary">프롬프트 추적은 한 생성 요청에 사용된 시스템·사용자 메시지, 검색 문맥, 도구 결과와 모델 응답의 계보를 연결한 실행 기록이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-h">
<h2 id="index-ko-h">ㅎ</h2>
<ul class="wiki-index-list">
<li data-article-id="behavioral-regression"><a href="/wiki/behavioral-regression/">행동 회귀</a><span class="wiki-index-summary">행동 회귀는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="confusion-matrix"><a href="/wiki/confusion-matrix/">혼동 행렬</a><span class="wiki-index-summary">분류 모델의 실제 클래스와 예측 클래스를 교차표로 집계해 어떤 종류의 정답과 오류가 발생했는지 보여 주는 행렬이다.</span></li>
<li data-article-id="regression-evaluation"><a href="/wiki/regression-evaluation/">회귀 테스트형 평가</a><span class="wiki-index-summary">회귀 테스트형 평가는 모델·프롬프트·데이터 변경 뒤 이전에 통과하던 사례와 핵심 지표가 나빠지지 않았는지 확인하는 반복 시험이다.</span></li>
<li data-article-id="effect-size"><a href="/wiki/effect-size/">효과 크기</a><span class="wiki-index-summary">효과 크기는 두 조건의 차이나 변수 관계의 크기를 표본 수와 분리해 정량화한 값이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-b">
<h2 id="index-en-b">B</h2>
<ul class="wiki-index-list">
<li data-article-id="beir-benchmark"><a href="/wiki/beir-benchmark/">BEIR 벤치마크</a><span class="wiki-index-summary">BEIR 벤치마크는 여러 도메인의 정보 검색 데이터셋에서 검색 모델의 제로샷 일반화 성능을 비교하는 평가 모음이다.</span></li>
<li data-article-id="bertscore"><a href="/wiki/bertscore/">BERTScore</a><span class="wiki-index-summary">BERTScore는 문맥 임베딩 사이의 코사인 유사도로 후보와 참조 토큰을 대응시켜 정밀도, 재현율과 F1을 계산한다.</span></li>
<li data-article-id="big-bench"><a href="/wiki/big-bench/">BIG-bench</a><span class="wiki-index-summary">BIG-bench는 다양한 연구자가 제안한 광범위한 과제로 대규모 언어 모델의 능력과 한계를 탐색하는 협업 벤치마크다.</span></li>
<li data-article-id="bleu-score"><a href="/wiki/bleu-score/">BLEU 점수</a><span class="wiki-index-summary">BLEU 점수는 기계 번역 후보와 하나 이상의 참조 문장 사이의 수정된 n-그램 정밀도와 길이 패널티를 결합한 말뭉치 수준 지표다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-f">
<h2 id="index-en-f">F</h2>
<ul class="wiki-index-list">
<li data-article-id="f1-score"><a href="/wiki/f1-score/">F1 점수</a><span class="wiki-index-summary">정밀도와 재현율의 조화평균으로 두 지표가 모두 높을 때만 큰 값을 갖는 분류·검색 성능 지표다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-g">
<h2 id="index-en-g">G</h2>
<ul class="wiki-index-list">
<li data-article-id="gpqa"><a href="/wiki/gpqa/">GPQA</a><span class="wiki-index-summary">GPQA는 전문 지식이 없는 검색만으로 풀기 어려운 대학원 수준 과학 객관식 문제로 추론 능력을 평가하는 벤치마크다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-h">
<h2 id="index-en-h">H</h2>
<ul class="wiki-index-list">
<li data-article-id="helm-benchmark"><a href="/wiki/helm-benchmark/">HELM 벤치마크</a><span class="wiki-index-summary">HELM은 시나리오, 적응 방식과 여러 지표를 명시해 언어 모델을 투명하고 다면적으로 비교하는 평가 체계다.</span></li>
<li data-article-id="humaneval"><a href="/wiki/humaneval/">HumanEval</a><span class="wiki-index-summary">HumanEval은 함수 설명과 테스트를 이용해 코드 생성 모델이 올바른 프로그램을 작성하는지 평가하는 벤치마크다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-i">
<h2 id="index-en-i">I</h2>
<ul class="wiki-index-list">
<li data-article-id="imagenet"><a href="/wiki/imagenet/">ImageNet</a><span class="wiki-index-summary">ImageNet은 대규모 계층형 이미지 범주와 주석으로 구성되어 이미지 분류와 시각 표현 학습 연구에 널리 쓰인 데이터셋이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-l">
<h2 id="index-en-l">L</h2>
<ul class="wiki-index-list">
<li data-article-id="llm-as-a-judge"><a href="/wiki/llm-as-a-judge/">LLM 심사자</a><span class="wiki-index-summary">언어 모델을 사용해 다른 모델 출력의 품질을 판정하거나 비교하는 평가 방식이다.</span></li>
<li data-article-id="llm-judge-ensemble"><a href="/wiki/llm-judge-ensemble/">LLM 판정 앙상블</a><span class="wiki-index-summary">LLM 판정 앙상블은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-evaluation-contract"><a href="/wiki/llm-evaluation-contract/">LLM 평가 계약</a><span class="wiki-index-summary">LLM 평가 계약은 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inter-rater-agreement-for-llm"><a href="/wiki/inter-rater-agreement-for-llm/">LLM 평가자 간 일치도</a><span class="wiki-index-summary">LLM 평가자 간 일치도는 모델과 LLM 시스템의 품질 측정·비교·배포 판정 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-m">
<h2 id="index-en-m">M</h2>
<ul class="wiki-index-list">
<li data-article-id="meteor-score"><a href="/wiki/meteor-score/">METEOR 점수</a><span class="wiki-index-summary">METEOR는 후보와 참조의 단어 정렬을 바탕으로 정밀도·재현율 조화평균과 어순 단절 패널티를 계산하는 생성 평가 지표다.</span></li>
<li data-article-id="mlperf"><a href="/wiki/mlperf/">MLPerf</a><span class="wiki-index-summary">MLPerf는 합의된 모델·데이터·품질 목표와 실행 규칙으로 AI 학습 및 추론 시스템의 성능을 비교하는 벤치마크 제품군이다.</span></li>
<li data-article-id="mmlu"><a href="/wiki/mmlu/">MMLU</a><span class="wiki-index-summary">MMLU는 초등 수준부터 전문 영역까지 여러 선택형 과목을 이용해 언어 모델의 지식과 문제 해결 능력을 평가하는 벤치마크다.</span></li>
<li data-article-id="mteb"><a href="/wiki/mteb/">MTEB</a><span class="wiki-index-summary">MTEB는 분류·검색·군집·유사도 등 다양한 과제에서 텍스트 임베딩 모델을 공통 절차로 비교하는 평가 묶음이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-p">
<h2 id="index-en-p">P</h2>
<ul class="wiki-index-list">
<li data-article-id="pass-at-k"><a href="/wiki/pass-at-k/">Pass@K</a><span class="wiki-index-summary">Pass@K는 코드 생성처럼 여러 후보를 만들 때 k개 후보 중 적어도 하나가 테스트를 통과할 확률을 추정하는 지표다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-r">
<h2 id="index-en-r">R</h2>
<ul class="wiki-index-list">
<li data-article-id="rag-evaluation"><a href="/wiki/rag-evaluation/">RAG 평가</a><span class="wiki-index-summary">RAG 평가는 검색 증강 생성 시스템의 검색 품질, 근거 사용과 최종 답변 품질을 연결해 측정하는 절차다.</span></li>
<li data-article-id="roc-curve"><a href="/wiki/roc-curve/">ROC 곡선</a><span class="wiki-index-summary">분류 임계값을 변화시키며 거짓양성률에 대한 참양성률을 그린 곡선이다.</span></li>
<li data-article-id="rouge-score"><a href="/wiki/rouge-score/">ROUGE 점수</a><span class="wiki-index-summary">ROUGE는 생성 요약과 참조 요약이 공유하는 n-그램, 최장 공통 부분수열 등의 재현율 중심 중복을 측정하는 지표군이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-s">
<h2 id="index-en-s">S</h2>
<ul class="wiki-index-list">
<li data-article-id="swe-bench"><a href="/wiki/swe-bench/">SWE-bench</a><span class="wiki-index-summary">SWE-bench는 실제 오픈소스 저장소의 이슈와 코드 상태를 사용해 시스템이 결함을 수정하고 테스트를 통과시키는 능력을 평가하는 벤치마크다.</span></li>
</ul>
</section>
</div>

---
title: "사전학습 Pretraining"
description: "대규모 데이터로 일반적인 표현과 패턴을 먼저 학습하는 단계다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">대규모 데이터로 일반적인 표현과 패턴을 먼저 학습하는 단계다.</p>

<div class="wiki-document-meta">분류: [학습과 사후학습](/category/training/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

대규모 데이터로 일반적인 표현과 패턴을 먼저 학습하는 단계다.

‘사전학습’ 개념은 학습과 사후학습 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 학습 분야는 데이터와 손실, 최적화 신호로 모델 파라미터를 만들고 후속 과제에 적응시키는 과정을 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 배경과 설명 범위

직접 대응하는 외부 백과 표제어가 뚜렷하지 않은 신생·세부 용어다. 따라서 아래 1차 자료와 상위 개념 문서를 중심으로 범위를 정하고, 제품별 용어는 일반 원리와 분리했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a></div>

## 작동 원리

사전학습은 대규모 데이터에서 자기지도 목적을 풀며 일반적인 표현과 언어 패턴을 먼저 학습하는 단계다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

**대규모 데이터에서 표현을 먼저 학습하기**

사전학습은 특정 소규모 과제를 풀기 전에 대규모 데이터와 자기지도 또는 비지도 목표로 일반적인 표현과 파라미터 초기값을 학습하는 단계다. 언어 모델은 다음 토큰 예측, 가려진 토큰 복원, 손상된 입력 복원 같은 목표를 사용할 수 있다. BERT는 양방향 문맥에서 가려진 토큰을 예측해 표현을 학습하고, 과제별 출력층을 추가해 비교적 적은 변경으로 여러 자연어 처리 과제에 미세조정했다. 자기회귀 모델은 왼쪽 문맥에서 다음 토큰을 예측하며 생성에 자연스럽게 연결된다. 목표가 다르면 같은 데이터에서도 표현되는 정보와 추론 방식이 달라진다.

사전학습의 이점은 여러 과제에서 공유되는 통계 구조를 큰 데이터로 학습하고 적은 라벨 데이터로 이전할 수 있다는 점이다. 표현 학습 관점에서는 원시 입력의 유용한 변동 요인을 분리하고 이후 과제가 선형 또는 간단한 함수로 읽을 수 있게 만드는 것을 기대한다. 그러나 모든 정보를 보존하는 것과 특정 과제에 유리한 불변성을 만드는 것은 상충할 수 있다. 사전학습 분포와 목표 과제가 멀거나 잘못된 편향을 강하게 배운 경우 미세조정에 도움이 되지 않거나 해를 줄 수도 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘사전학습’ 개념만 독립적으로 동작하지 않는다. [미세조정](/wiki/fine-tuning/), [지도 미세조정](/wiki/supervised-fine-tuning/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

**데이터·목표·규모의 파이프라인**

파이프라인은 원천 수집, 라이선스와 정책 검토, 언어·형식 식별, 품질 필터링, 개인정보와 중복 처리, 토큰화, 샤딩, 학습과 체크포인트 평가로 이어진다. 필터는 노이즈를 줄이지만 특정 방언·문체·집단을 과도하게 제거할 수 있으므로 제거율과 표본을 범주별로 감사한다. 중복 데이터는 자주 반복된 문장을 과도하게 학습시키고 벤치마크 오염과 암기 위험을 높인다. 문서 단위와 근접 중복을 함께 다루며, 데이터 계보와 필터 버전을 보존해야 나중에 특정 출처의 영향을 조사할 수 있다.

학습 계산은 데이터 양, 파라미터 수, 토큰 수와 하드웨어 효율의 균형을 가진다. 분산 학습은 데이터·텐서·파이프라인 병렬화를 조합하고 통신과 장애 복구를 관리한다. 체크포인트에는 모델, 최적화기, 학습률 일정과 데이터 진행 위치가 필요하다. 학습 손실이 감소해도 능력과 안전이 같은 속도로 개선되는 것은 아니므로 중간 체크포인트를 고정 평가에 비교한다. 토크나이저와 문맥 길이는 학습 시작 뒤 바꾸기 어렵고 언어별 효율에 큰 영향을 주므로 데이터 분석 단계에서 결정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용 분야와 선택 기준

사전학습, 미세조정, 선호 최적화, 경량화 방법을 선택하고 실험을 재현하는 데 사용한다. ‘사전학습’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

**사전학습과 다른 적응 방식 비교**

처음부터 사전학습하는 것은 데이터와 계산, 전문 운영 인력이 많이 필요해 대부분의 조직에는 기존 기반 모델을 활용하는 편이 현실적이다. 도메인 적응 사전학습은 관련 비라벨 텍스트로 학습 목표를 이어 가며 용어와 문체를 익히지만, 데이터 혼합과 학습률이 잘못되면 일반 능력이 퇴행할 수 있다. 지도 미세조정은 입력·정답 쌍으로 원하는 과제를 직접 가르치고, 검색 증강은 가중치를 바꾸지 않고 최신·사내 지식을 제공한다. 프롬프트와 도구 연결도 더 낮은 비용의 기준선이다.

선택은 지식의 변경 빈도, 라벨 가용성, 행동 형식과 배포 제약으로 결정한다. 자주 바뀌는 사실을 파라미터에 넣기보다 검색하는 편이 갱신과 출처 추적에 유리하다. 반복되는 전문 언어와 패턴이 방대한 비라벨 데이터에 있고 여러 과제에 공유된다면 도메인 사전학습의 가치가 커질 수 있다. 제한된 출력 형식과 업무 규칙은 지도 데이터나 구조화된 검증이 더 직접적이다. 각 단계의 추가 이익을 같은 보류 세트에서 측정하고, 비용과 안전 퇴행을 함께 비교한다.

사전학습 프로젝트의 중단 기준도 시작 전에 정한다. 데이터 감사에서 권리나 대표성 문제를 해결할 수 없거나 파일럿의 추가 이익이 비용과 위험을 정당화하지 못하면 규모 확대를 멈춘다. 이미 쓴 계산을 이유로 계속하지 않으며, 실패한 실험의 데이터 혼합과 평가 결과를 보존해 이후 프로젝트가 같은 가정을 반복하지 않게 한다.

**파일럿 사례:** 전문 문서로 계속 사전학습하기 전에 기존 모델, 검색 증강, 지도 미세조정을 같은 업무 세트에서 비교한다. 도메인 용어의 다음 토큰 손실이 줄었더라도 질의응답 근거성과 일반 안전 평가가 퇴행할 수 있다. 여러 중간 체크포인트를 평가해 이득이 정점에 이른 시점과 파국적 망각이 시작되는 지점을 찾는다.

데이터 혼합 비율을 바꿀 때는 전체 토큰 수까지 함께 기록한다. 전문 데이터의 비율과 절대 반복 횟수가 모두 행동에 영향을 준다. 작은 코퍼스를 여러 번 반복하면 특정 문장 암기와 개인정보 노출 위험이 커질 수 있어 근접 중복과 추출 공격 평가를 추가한다.

체크포인트를 장기 보관할 때는 데이터 정책상 유지할 수 있는지와 암호화·접근 기록을 검토한다. 모든 중간 모델을 무기한 저장하면 비용뿐 아니라 취약한 초기 모델의 오용 가능성도 늘어난다.

대규모 실행 전 복구 훈련을 실시해 체크포인트 손상, 노드 이탈과 데이터 샤드 오류에서 재개되는지 확인한다. 재개 뒤 같은 데이터가 과도하게 반복되거나 건너뛰지 않았는지 처리 위치와 토큰 통계로 검증한다. 계산 사용량이 커질수록 뒤늦은 파이프라인 오류의 비용이 커지므로 작은 규모에서 전체 경로를 먼저 통과시킨다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 한계와 흔한 오해

학습 데이터의 시점·품질·중복·권리가 모델 행동에 남으며 이후 튜닝만으로 모든 문제를 제거하기 어렵다.

훈련 점수만 보지 말고 데이터 계보·과적합·망각·안전성 변화를 측정한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

**데이터 불투명성과 이전의 한계**

웹 규모 말뭉치는 출처, 정확성, 동의와 권리 상태가 불균일하다. 필터를 거쳐도 개인정보, 저작물, 유해한 표현과 잘못된 사실이 남을 수 있다. 데이터 목록을 완전히 공개하기 어렵더라도 범주, 시점, 수집·제외 정책과 알려진 결손을 문서화해야 한다. 삭제 요청이나 법적 변경에 대응하려면 어떤 데이터 버전이 어떤 체크포인트에 사용되었는지 계보가 필요하다. 이미 학습된 파라미터에서 특정 자료의 영향을 완전히 제거하는 일은 단순 파일 삭제와 다르다.

사전학습 손실과 다운스트림 품질의 관계는 과제별로 다르며 규모 확대가 모든 언어와 집단에 같은 이득을 주지 않는다. 공개 벤치마크가 말뭉치에 들어가면 실제 일반화보다 높은 점수가 나올 수 있다. 대규모 계산에는 비용과 에너지, 하드웨어 집중의 문제가 있고 재현 가능한 독립 검토가 어려워진다. 미세조정이 사전학습의 편향과 암기를 완전히 지우지 못하며 새로운 과제에서 파국적 망각이 생길 수 있다. 모델을 공개하거나 배포할 때 가중치 접근 수준, 사용 제한과 위험 완화의 실효성을 따로 평가한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 관련 개념과의 구분

- [미세조정](/wiki/fine-tuning/): 사전학습 모델을 특정 데이터와 목적에 맞게 추가 학습하는 과정이다.
- [지도 미세조정](/wiki/supervised-fine-tuning/): 지시와 모범 응답 쌍으로 모델이 원하는 응답 형식을 따르도록 학습하는 단계다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구체적 적용 예시

학습 전에는 데이터 분할, 기준 모델, 손실과 평가 지표를 고정하고 각 실행의 코드·데이터·체크포인트 버전을 연결한다. ‘사전학습’을 적용하는 경우에는 사전학습은 대규모 데이터에서 자기지도 목적을 풀며 일반적인 표현과 언어 패턴을 먼저 학습하는 단계다.

훈련 손실 감소만 보지 말고 보지 않은 자료의 성능, 집단별 오류, 안전 회귀와 추론 비용 변화를 함께 비교한다. 이때 [미세조정](/wiki/fine-tuning/), [지도 미세조정](/wiki/supervised-fine-tuning/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘사전학습’이 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 사전학습, 미세조정, 선호 최적화, 경량화 방법을 선택하고 실험을 재현하는 데 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 학습 데이터의 시점·품질·중복·권리가 모델 행동에 남으며 이후 튜닝만으로 모든 문제를 제거하기 어렵다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘사전학습’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

**데이터와 체크포인트 감사**

학습 전에 목표 능력과 제외할 사용을 정하고 데이터 출처별 허용 근거, 기간, 언어, 품질과 민감도를 기록한다. 원본과 변환본의 해시, 필터 코드와 통계를 보존하고 각 단계에서 남고 제거된 표본을 층화 추출해 사람이 검토한다. 개인정보 탐지, 중복 제거, 벤치마크 오염 검사는 서로 다른 도구로 수행하며 완벽한 제거를 주장하지 않는다. 작은 규모의 파일럿 학습으로 토크나이저 효율, 손실 안정성, 데이터 혼합 비율과 평가 신호를 확인한 뒤 규모를 늘린다.

훈련 중에는 손실, 그래디언트, 처리 토큰, 하드웨어 오류와 데이터 샤드 위치를 관찰하고 일정 간격으로 불변 체크포인트를 만든다. 고정된 능력·안전 평가와 오염 가능성이 낮은 보류 세트를 함께 실행한다. 최종 선택은 학습 손실이 가장 낮은 시점이 아니라 여러 과제, 위험, 비용의 문턱으로 결정한다. 공개 문서에는 데이터와 계산, 아키텍처, 평가 설정, 알려진 제한을 남기고 후속 미세조정이 어떤 기반 체크포인트에서 시작했는지 연결한다. 데이터나 코드 변경 뒤에는 같은 이름을 덮어쓰지 않고 새 버전으로 추적한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

- [모델](/wiki/model/)
- [학습 데이터](/wiki/training-data/)

## 관련 문서

- [미세조정](/wiki/fine-tuning/)
- [지도 미세조정](/wiki/supervised-fine-tuning/)
- [지시 튜닝](/wiki/instruction-tuning/)

## 이 문서를 가리키는 문서

- [가치 함수 손실](/wiki/value-function-loss/)
- [개인정보 보호 학습](/wiki/privacy-preserving-training/)
- [결과 보상 모델](/wiki/outcome-reward-model/)
- [과정 보상 모델](/wiki/process-reward-model/)
- [과제 벡터](/wiki/task-vector/)

<details class="wiki-backlinks-more">
<summary>나머지 82개 문서 보기</summary>

- [과제 적응](/wiki/task-adaptation/)
- [교사 강요](/wiki/teacher-forcing/)
- [구간 손상 복원](/wiki/span-corruption/)
- [그래디언트 체크포인팅](/wiki/gradient-checkpointing/)
- [기각 표본추출](/wiki/rejection-sampling/)
- [다음 문장 예측](/wiki/next-sentence-prediction/)
- [다중 과제 목적 함수](/wiki/multi-task-objective/)
- [다중 과제 지시 튜닝](/wiki/multi-task-instruction-tuning/)
- [대조 목적 함수](/wiki/contrastive-objective/)
- [데이터 문서화](/wiki/data-documentation/)
- [데이터 병렬화](/wiki/data-parallelism/)
- [데이터 커리큘럼](/wiki/data-curriculum/)
- [데이터 혼합](/wiki/data-mixture/)
- [데이터셋 라이선스](/wiki/dataset-license/)
- [데이터셋 중복 제거](/wiki/dataset-deduplication/)
- [도메인 적응](/wiki/domain-adaptation/)
- [마스크 언어 모델링 목표](/wiki/masked-language-modeling-objective/)
- [머신 언러닝](/wiki/machine-unlearning/)
- [모델 가지치기](/wiki/model-pruning/)
- [모델 병렬화](/wiki/model-parallelism/)
- [모델 병합](/wiki/model-merging/)
- [모델 희소성](/wiki/model-sparsity/)
- [문서 패킹](/wiki/document-packing/)
- [문장 순서 예측](/wiki/sentence-order-prediction/)
- [미세조정](/wiki/fine-tuning/)
- [벤치마크 오염](/wiki/benchmark-contamination/)
- [보상 해킹](/wiki/reward-hacking/)
- [보조 손실](/wiki/auxiliary-loss/)
- [복원 손실](/wiki/reconstruction-loss/)
- [분산 옵티마이저](/wiki/distributed-optimizer/)
- [브래들리-테리 모형](/wiki/bradley-terry-model/)
- [사전학습 파이프라인](/wiki/pretraining-pipeline/)
- [선호 데이터](/wiki/preference-data/)
- [선호 손실](/wiki/preference-loss/)
- [시퀀스 분류 미세조정](/wiki/sequence-classification-fine-tuning/)
- [시퀀스 패킹](/wiki/sequence-packing/)
- [쌍대 선호 순위화](/wiki/pairwise-preference-ranking/)
- [양자화 인식 학습](/wiki/quantization-aware-training/)
- [어댑터 층](/wiki/adapter-layer/)
- [연속 사전학습](/wiki/continued-pretraining/)
- [연합학습](/wiki/federated-learning/)
- [오프라인 선호 학습](/wiki/offline-preference-learning/)
- [온라인 선호 학습](/wiki/online-preference-learning/)
- [완전 샤딩 데이터 병렬화](/wiki/fully-sharded-data-parallel/)
- [웹 규모 학습 데이터](/wiki/web-scale-training-data/)
- [응답 형식 튜닝](/wiki/response-format-tuning/)
- [인과 언어 모델링 목표](/wiki/causal-language-modeling-objective/)
- [잡음 제거 목표](/wiki/denoising-objective/)
- [전문가 병렬화](/wiki/expert-parallelism/)
- [전체 파라미터 미세조정](/wiki/full-parameter-fine-tuning/)
- [정책 모델](/wiki/policy-model/)
- [정책 목적 함수](/wiki/policy-objective/)
- [증류 손실](/wiki/distillation-loss/)
- [지도 미세조정](/wiki/supervised-fine-tuning/)
- [지시 데이터 혼합](/wiki/instruction-mixture/)
- [지시 데이터셋](/wiki/instruction-dataset/)
- [차등 개인정보 보호 학습](/wiki/differentially-private-training/)
- [참조 모델](/wiki/reference-model/)
- [채팅 템플릿](/wiki/chat-template/)
- [텐서 병렬화](/wiki/tensor-parallelism/)
- [파이프라인 병렬화](/wiki/pipeline-parallelism/)
- [프롬프트 튜닝](/wiki/prompt-tuning/)
- [프리픽스 튜닝](/wiki/prefix-tuning/)
- [학습 감사 로그](/wiki/training-audit-log/)
- [학습 데이터 동의](/wiki/training-data-consent/)
- [학습 데이터 저작권](/wiki/training-data-copyright/)
- [학습 데이터 출처 추적](/wiki/training-data-provenance/)
- [학습 데이터 필터링](/wiki/training-data-filtering/)
- [학습 데이터 형식화](/wiki/training-data-formatting/)
- [학습 말뭉치](/wiki/training-corpus/)
- [학습 재현성](/wiki/training-reproducibility/)
- [헌법적 AI](/wiki/constitutional-ai/)
- [확산 학습 목표](/wiki/diffusion-training-objective/)
- [AI 피드백 기반 강화학습](/wiki/reinforcement-learning-from-ai-feedback/)
- [All-Reduce](/wiki/all-reduce/)
- [Best-of-N 표본추출](/wiki/best-of-n-sampling/)
- [DoRA](/wiki/dora/)
- [IA3](/wiki/ia3/)
- [KL 페널티](/wiki/kl-penalty/)
- [LLM용 근접 정책 최적화](/wiki/proximal-policy-optimization-for-llm/)
- [QLoRA](/wiki/qlora/)
- [ZeRO 옵티마이저](/wiki/zero-redundancy-optimizer/)

</details>

## 이 문서를 포함하는 코스

[모델 학습과 튜닝](/course/model-training/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://arxiv.org/abs/1810.04805) — paper
<span id="reference-2"></span>2. [Transfer learning — Wikipedia](https://en.wikipedia.org/wiki/Transfer_learning) — encyclopedia
<span id="reference-3"></span>3. [Deep Learning Book: Representation Learning](https://www.deeplearningbook.org/contents/representation.html) — book

## 코스에서 계속 읽기

- **모델 학습과 튜닝:** [다음 문서 — 미세조정](/wiki/fine-tuning/)

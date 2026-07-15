---
title: "학습과 사후학습"
description: "사전학습부터 정렬·경량화까지의 방법"
---

사전학습부터 정렬·경량화까지의 방법 분야의 검토 완료 백과 문서입니다.

<nav class="wiki-letter-index" aria-label="문서 초성 색인"><a href="#index-ko-g">ㄱ</a><a href="#index-ko-d">ㄷ</a><a href="#index-ko-m">ㅁ</a><a href="#index-ko-b">ㅂ</a><a href="#index-ko-s">ㅅ</a><a href="#index-ko-ss">ㅆ</a><a href="#index-ko-ng">ㅇ</a><a href="#index-ko-j">ㅈ</a><a href="#index-ko-ch">ㅊ</a><a href="#index-ko-t">ㅌ</a><a href="#index-ko-p">ㅍ</a><a href="#index-ko-h">ㅎ</a><a href="#index-en-a">A</a><a href="#index-en-b">B</a><a href="#index-en-d">D</a><a href="#index-en-i">I</a><a href="#index-en-k">K</a><a href="#index-en-l">L</a><a href="#index-en-q">Q</a><a href="#index-en-z">Z</a></nav>

<div class="wiki-index-groups">
<section class="wiki-index-group" data-index-group="ko-g">
<h2 id="index-ko-g">ㄱ</h2>
<ul class="wiki-index-list">
<li data-article-id="value-function-loss"><a href="/wiki/value-function-loss/">가치 함수 손실</a><span class="wiki-index-summary">가치 함수 손실은 상태나 상태-행동의 예상 누적 보상 예측과 목표 반환값 사이의 오차를 측정하는 손실이다.</span></li>
<li data-article-id="privacy-preserving-training"><a href="/wiki/privacy-preserving-training/">개인정보 보호 학습</a><span class="wiki-index-summary">개인정보 보호 학습은 모델 효용을 유지하면서 개별 학습 사례의 노출과 추론 위험을 줄이는 학습 방법군이다.</span></li>
<li data-article-id="outcome-reward-model"><a href="/wiki/outcome-reward-model/">결과 보상 모델</a><span class="wiki-index-summary">결과 보상 모델은 생성 과정 전체보다 최종 산출물의 정확성이나 선호도를 입력으로 평가하는 모델이다.</span></li>
<li data-article-id="process-reward-model"><a href="/wiki/process-reward-model/">과정 보상 모델</a><span class="wiki-index-summary">과정 보상 모델은 최종 답뿐 아니라 문제 해결의 각 중간 단계가 올바른지를 평가해 점수를 주는 모델이다.</span></li>
<li data-article-id="task-vector"><a href="/wiki/task-vector/">과제 벡터</a><span class="wiki-index-summary">과제 벡터는 미세조정 모델과 기반 모델의 가중치 차이로 표현한 과제별 파라미터 업데이트다.</span></li>
<li data-article-id="task-adaptation"><a href="/wiki/task-adaptation/">과제 적응</a><span class="wiki-index-summary">과제 적응은 범용 또는 다른 과제로 학습된 모델을 새로운 목표 과제의 입출력과 평가 기준에 맞게 조정하는 과정이다.</span></li>
<li data-article-id="teacher-forcing"><a href="/wiki/teacher-forcing/">교사 강요</a><span class="wiki-index-summary">교사 강요는 순차 모델 학습에서 이전 시점의 모델 예측 대신 실제 정답 토큰을 다음 입력으로 제공하는 방법이다.</span></li>
<li data-article-id="span-corruption"><a href="/wiki/span-corruption/">구간 손상 복원</a><span class="wiki-index-summary">구간 손상 복원은 연속된 여러 토큰 구간을 특수 표식으로 바꾸고 누락된 구간을 생성하도록 하는 잡음 제거 학습 방식이다.</span></li>
<li data-article-id="gradient-checkpointing"><a href="/wiki/gradient-checkpointing/">그래디언트 체크포인팅</a><span class="wiki-index-summary">기울기 체크포인팅은 순전파 활성값 일부만 저장하고 역전파 때 누락된 구간을 다시 계산해 메모리를 줄이는 기법이다.</span></li>
<li data-article-id="rejection-sampling"><a href="/wiki/rejection-sampling/">기각 표본추출</a><span class="wiki-index-summary">거부 표집은 제안 분포에서 후보를 생성한 뒤 목표 기준에 따른 수용 확률이나 임계값으로 일부만 채택하는 표집 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-d">
<h2 id="index-ko-d">ㄷ</h2>
<ul class="wiki-index-list">
<li data-article-id="next-sentence-prediction"><a href="/wiki/next-sentence-prediction/">다음 문장 예측</a><span class="wiki-index-summary">다음 문장 예측은 두 텍스트 구간이 원문에서 연속해 나타났는지 분류하도록 하는 사전학습 과제다.</span></li>
<li data-article-id="multi-task-objective"><a href="/wiki/multi-task-objective/">다중 과제 목적 함수</a><span class="wiki-index-summary">다중 과제 목적 함수는 하나의 모델이 여러 과제의 손실을 함께 최적화하도록 결합한 학습 목표다.</span></li>
<li data-article-id="multi-task-instruction-tuning"><a href="/wiki/multi-task-instruction-tuning/">다중 과제 지시 튜닝</a><span class="wiki-index-summary">다중 과제 지시 튜닝은 서로 다른 과제를 자연어 지시 형식으로 통합해 하나의 모델을 동시에 미세조정하는 방법이다.</span></li>
<li data-article-id="contrastive-objective"><a href="/wiki/contrastive-objective/">대조 목적 함수</a><span class="wiki-index-summary">대조 목적 함수는 관련 있는 표본 표현은 가깝게, 관련 없는 표본 표현은 멀게 배치하도록 학습하는 목적 함수다.</span></li>
<li data-article-id="data-documentation"><a href="/wiki/data-documentation/">데이터 문서화</a><span class="wiki-index-summary">데이터 문서화는 데이터셋의 목적·출처·구성·수집·처리·권장 용도·한계를 구조화해 기록하는 활동이다.</span></li>
<li data-article-id="data-parallelism"><a href="/wiki/data-parallelism/">데이터 병렬화</a><span class="wiki-index-summary">데이터 병렬화는 같은 모델 복제본에 서로 다른 미니배치를 처리하게 하고 기울기를 동기화하는 분산 학습 방식이다.</span></li>
<li data-article-id="data-augmentation"><a href="/wiki/data-augmentation/">데이터 증강</a><span class="wiki-index-summary">과제의 정답 의미를 보존하는 변환이나 합성으로 학습 표본의 다양성을 늘려 모델의 일반화와 견고성을 높이는 기법이다.</span></li>
<li data-article-id="data-curriculum"><a href="/wiki/data-curriculum/">데이터 커리큘럼</a><span class="wiki-index-summary">데이터 커리큘럼은 학습 중 데이터의 난이도, 길이, 품질 또는 영역별 제시 순서를 계획한 전략이다.</span></li>
<li data-article-id="data-mixture"><a href="/wiki/data-mixture/">데이터 혼합</a><span class="wiki-index-summary">데이터 혼합은 여러 출처, 언어와 과제의 학습 데이터를 어떤 비율과 샘플링 규칙으로 결합할지 정한 구성이다.</span></li>
<li data-article-id="dataset-license"><a href="/wiki/dataset-license/">데이터셋 라이선스</a><span class="wiki-index-summary">데이터셋 라이선스는 데이터의 복제·수정·배포·상업적 이용과 귀속 조건을 정한 법적 허가 조건이다.</span></li>
<li data-article-id="dataset-deduplication"><a href="/wiki/dataset-deduplication/">데이터셋 중복 제거</a><span class="wiki-index-summary">데이터셋 중복 제거는 동일하거나 매우 유사한 문서와 구간을 찾아 학습 데이터에서 반복을 줄이는 절차다.</span></li>
<li data-article-id="domain-adaptation"><a href="/wiki/domain-adaptation/">도메인 적응</a><span class="wiki-index-summary">도메인 적응은 학습 데이터와 운영 데이터의 분포가 다를 때 목표 도메인 성능을 높이도록 표현이나 모델을 조정하는 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-m">
<h2 id="index-ko-m">ㅁ</h2>
<ul class="wiki-index-list">
<li data-article-id="masked-language-modeling-objective"><a href="/wiki/masked-language-modeling-objective/">마스크 언어 모델링 목표</a><span class="wiki-index-summary">마스크 언어 모델링 목표는 입력 토큰 일부를 숨기거나 바꾼 뒤 주변 문맥으로 원래 토큰을 예측하도록 학습하는 목적 함수다.</span></li>
<li data-article-id="machine-unlearning"><a href="/wiki/machine-unlearning/">머신 언러닝</a><span class="wiki-index-summary">기계 언러닝은 특정 학습 데이터의 영향을 모델에서 제거해 해당 데이터를 제외하고 다시 학습한 모델에 가까운 상태를 만드는 절차다.</span></li>
<li data-article-id="model-pruning"><a href="/wiki/model-pruning/">모델 가지치기</a><span class="wiki-index-summary">모델 가지치기는 성능에 미치는 영향이 작은 가중치, 채널, 헤드나 층을 제거해 모델 크기와 계산량을 줄이는 기법이다.</span></li>
<li data-article-id="model-parallelism"><a href="/wiki/model-parallelism/">모델 병렬화</a><span class="wiki-index-summary">모델 병렬화는 하나의 모델 파라미터와 계산을 여러 장치에 나누어 단일 장치 용량을 넘는 모델을 실행하는 방식이다.</span></li>
<li data-article-id="model-merging"><a href="/wiki/model-merging/">모델 병합</a><span class="wiki-index-summary">모델 병합은 같은 기반에서 학습된 여러 모델의 가중치나 업데이트를 결합해 하나의 모델을 만드는 방법이다.</span></li>
<li data-article-id="model-sparsity"><a href="/wiki/model-sparsity/">모델 희소성</a><span class="wiki-index-summary">모델 희소성은 가중치나 활성값 중 0 또는 사용되지 않는 요소의 비율과 구조를 나타내는 성질이다.</span></li>
<li data-article-id="document-packing"><a href="/wiki/document-packing/">문서 패킹</a><span class="wiki-index-summary">문서 패킹은 여러 짧은 문서를 하나의 고정 길이 학습 예시에 채워 패딩 낭비를 줄이는 데이터 구성 방식이다.</span></li>
<li data-article-id="sentence-order-prediction"><a href="/wiki/sentence-order-prediction/">문장 순서 예측</a><span class="wiki-index-summary">문장 순서 예측은 두 연속 구간의 순서가 원래 순서인지 뒤바뀌었는지 판별하도록 하는 사전학습 과제다.</span></li>
<li data-article-id="fine-tuning"><a href="/wiki/fine-tuning/">미세조정</a><span class="wiki-index-summary">사전학습 모델을 특정 데이터와 목적에 맞게 추가 학습하는 과정이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-b">
<h2 id="index-ko-b">ㅂ</h2>
<ul class="wiki-index-list">
<li data-article-id="benchmark-contamination"><a href="/wiki/benchmark-contamination/">벤치마크 오염</a><span class="wiki-index-summary">벤치마크 오염은 평가 문제나 그 변형이 학습 데이터에 포함되어 모델이 일반화 대신 기억으로 높은 점수를 얻는 현상이다.</span></li>
<li data-article-id="reward-model"><a href="/wiki/reward-model/">보상 모델</a><span class="wiki-index-summary">여러 모델 출력 중 사람의 선호에 가까운 출력을 점수화하도록 학습된 모델이다.</span></li>
<li data-article-id="reward-hacking"><a href="/wiki/reward-hacking/">보상 해킹</a><span class="wiki-index-summary">보상 해킹은 에이전트가 설계자의 실제 의도 대신 보상 함수의 허점이나 대리 지표를 이용해 높은 점수를 얻는 현상이다.</span></li>
<li data-article-id="auxiliary-loss"><a href="/wiki/auxiliary-loss/">보조 손실</a><span class="wiki-index-summary">보조 손실은 주 과제 학습을 돕기 위해 중간 표현이나 추가 예측에 부과하는 부수적 목적 함수다.</span></li>
<li data-article-id="reconstruction-loss"><a href="/wiki/reconstruction-loss/">복원 손실</a><span class="wiki-index-summary">복원 손실은 인코딩·손상·압축된 입력에서 원본 또는 목표 신호를 얼마나 정확히 재구성했는지 측정하는 손실이다.</span></li>
<li data-article-id="distributed-optimizer"><a href="/wiki/distributed-optimizer/">분산 옵티마이저</a><span class="wiki-index-summary">분산 옵티마이저는 대규모 학습에서 옵티마이저 상태와 파라미터 갱신 계산을 여러 장치에 분배하는 최적화 구성이다.</span></li>
<li data-article-id="bradley-terry-model"><a href="/wiki/bradley-terry-model/">브래들리-테리 모형</a><span class="wiki-index-summary">Bradley–Terry 모형은 두 항목의 양의 능력값 또는 점수 차이로 한 항목이 다른 항목을 이길 확률을 나타내는 쌍대 비교 모형이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-s">
<h2 id="index-ko-s">ㅅ</h2>
<ul class="wiki-index-list">
<li data-article-id="pretraining"><a href="/wiki/pretraining/">사전학습</a><span class="wiki-index-summary">대규모 데이터로 일반적인 표현과 패턴을 먼저 학습하는 단계다.</span></li>
<li data-article-id="pretraining-pipeline"><a href="/wiki/pretraining-pipeline/">사전학습 파이프라인</a><span class="wiki-index-summary">사전학습 파이프라인은 데이터 수집·정제·토큰화·혼합부터 분산 학습, 체크포인트와 평가까지 이어지는 생산 체계다.</span></li>
<li data-article-id="preference-data"><a href="/wiki/preference-data/">선호 데이터</a><span class="wiki-index-summary">선호 데이터는 동일하거나 관련된 입력에 대한 여러 출력의 비교, 순위 또는 점수로 어떤 응답이 더 나은지 기록한 자료다.</span></li>
<li data-article-id="preference-loss"><a href="/wiki/preference-loss/">선호 손실</a><span class="wiki-index-summary">선호 손실은 같은 입력에 대한 선호 출력과 비선호 출력의 상대 점수를 학습하도록 구성한 목적 함수다.</span></li>
<li data-article-id="sequence-classification-fine-tuning"><a href="/wiki/sequence-classification-fine-tuning/">시퀀스 분류 미세조정</a><span class="wiki-index-summary">시퀀스 분류 미세조정은 사전학습 모델의 문장·문서 표현에 분류기를 연결해 범주 예측 과제에 맞게 매개변수를 갱신하는 과정이다.</span></li>
<li data-article-id="sequence-packing"><a href="/wiki/sequence-packing/">시퀀스 패킹</a><span class="wiki-index-summary">시퀀스 패킹은 길이가 다른 토큰 시퀀스를 제한된 컨텍스트 블록에 효율적으로 배치해 연산 활용률을 높이는 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ss">
<h2 id="index-ko-ss">ㅆ</h2>
<ul class="wiki-index-list">
<li data-article-id="pairwise-preference-ranking"><a href="/wiki/pairwise-preference-ranking/">쌍대 선호 순위화</a><span class="wiki-index-summary">쌍대 선호 순위화는 두 후보 중 선호되는 항목을 관측해 전체 후보의 상대적 품질이나 보상 함수를 학습하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ng">
<h2 id="index-ko-ng">ㅇ</h2>
<ul class="wiki-index-list">
<li data-article-id="quantization"><a href="/wiki/quantization/">양자화</a><span class="wiki-index-summary">가중치와 활성값을 낮은 정밀도로 표현해 메모리와 계산 비용을 줄이는 기법이다.</span></li>
<li data-article-id="quantization-aware-training"><a href="/wiki/quantization-aware-training/">양자화 인식 학습</a><span class="wiki-index-summary">양자화 인식 학습은 학습 중 낮은 비트 양자화의 반올림과 범위를 모사해 양자화 후 정확도 저하를 줄이는 방법이다.</span></li>
<li data-article-id="adapter-layer"><a href="/wiki/adapter-layer/">어댑터 층</a><span class="wiki-index-summary">어댑터 층은 사전학습 모델의 본체를 대부분 고정한 채 층 사이에 삽입해 과제별로 학습하는 작은 병목 모듈이다.</span></li>
<li data-article-id="continued-pretraining"><a href="/wiki/continued-pretraining/">연속 사전학습</a><span class="wiki-index-summary">연속 사전학습은 이미 사전학습된 모델을 추가 말뭉치와 자기지도 목표로 더 학습해 도메인·언어·최신 지식을 반영하는 단계다.</span></li>
<li data-article-id="federated-learning"><a href="/wiki/federated-learning/">연합학습</a><span class="wiki-index-summary">연합학습은 원시 데이터를 중앙에 모으지 않고 여러 참여자가 로컬에서 모델을 학습해 갱신값만 집계하는 분산 학습 방식이다.</span></li>
<li data-article-id="offline-preference-learning"><a href="/wiki/offline-preference-learning/">오프라인 선호 학습</a><span class="wiki-index-summary">오프라인 선호 학습은 미리 수집해 고정한 비교·순위 데이터만으로 정책 또는 보상 모델을 최적화하는 방식이다.</span></li>
<li data-article-id="online-preference-learning"><a href="/wiki/online-preference-learning/">온라인 선호 학습</a><span class="wiki-index-summary">온라인 선호 학습은 현재 정책이 새 후보를 생성하고 그에 대한 최신 선호 피드백을 받아 반복적으로 정책을 갱신하는 방식이다.</span></li>
<li data-article-id="fully-sharded-data-parallel"><a href="/wiki/fully-sharded-data-parallel/">완전 샤딩 데이터 병렬화</a><span class="wiki-index-summary">완전 샤딩 데이터 병렬은 모델 파라미터·기울기·옵티마이저 상태를 데이터 병렬 작업자에 분할해 메모리 중복을 줄이는 학습 방식이다.</span></li>
<li data-article-id="web-scale-training-data"><a href="/wiki/web-scale-training-data/">웹 규모 학습 데이터</a><span class="wiki-index-summary">웹 규모 학습 데이터는 공개 웹에서 대량 수집한 문서와 미디어를 정제해 구성한 대규모 사전학습 자료다.</span></li>
<li data-article-id="response-format-tuning"><a href="/wiki/response-format-tuning/">응답 형식 튜닝</a><span class="wiki-index-summary">응답 형식 튜닝은 모델이 지정된 구조, 문체, 길이 또는 스키마에 맞춰 답하도록 예시 데이터로 미세조정하는 과정이다.</span></li>
<li data-article-id="rlhf"><a href="/wiki/rlhf/">인간 피드백 기반 강화학습</a><span class="wiki-index-summary">사람의 선호 신호를 이용해 모델 응답 정책을 조정하는 사후학습 방법이다.</span></li>
<li data-article-id="causal-language-modeling-objective"><a href="/wiki/causal-language-modeling-objective/">인과 언어 모델링 목표</a><span class="wiki-index-summary">인과 언어 모델링 목표는 이전 토큰들만 조건으로 다음 토큰의 확률을 높이도록 모델을 학습하는 목적 함수다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-j">
<h2 id="index-ko-j">ㅈ</h2>
<ul class="wiki-index-list">
<li data-article-id="denoising-objective"><a href="/wiki/denoising-objective/">잡음 제거 목표</a><span class="wiki-index-summary">잡음 제거 목표는 원본 데이터에 손상을 가한 입력으로부터 손상 전 데이터나 필요한 부분을 복원하도록 학습하는 목적 함수다.</span></li>
<li data-article-id="expert-parallelism"><a href="/wiki/expert-parallelism/">전문가 병렬화</a><span class="wiki-index-summary">전문가 병렬화는 혼합 전문가 모델의 여러 전문가 네트워크를 장치에 나누어 배치하는 분산 실행 방식이다.</span></li>
<li data-article-id="full-parameter-fine-tuning"><a href="/wiki/full-parameter-fine-tuning/">전체 파라미터 미세조정</a><span class="wiki-index-summary">전체 파라미터 미세조정은 사전학습 모델의 모든 학습 가능한 가중치를 목표 데이터에 맞게 갱신하는 적응 방식이다.</span></li>
<li data-article-id="policy-model"><a href="/wiki/policy-model/">정책 모델</a><span class="wiki-index-summary">정책 모델은 주어진 입력에서 다음 토큰이나 응답을 선택하는 확률분포를 나타내며 선호 신호로 직접 갱신되는 모델이다.</span></li>
<li data-article-id="policy-objective"><a href="/wiki/policy-objective/">정책 목적 함수</a><span class="wiki-index-summary">정책 목적 함수는 상태에서 행동을 선택하는 정책이 기대 누적 보상을 높이도록 최적화하는 목표다.</span></li>
<li data-article-id="distillation-loss"><a href="/wiki/distillation-loss/">증류 손실</a><span class="wiki-index-summary">증류 손실은 학생 모델이 교사 모델의 출력 분포나 중간 표현을 모방하도록 차이를 측정하는 학습 목적 함수다.</span></li>
<li data-article-id="supervised-fine-tuning"><a href="/wiki/supervised-fine-tuning/">지도 미세조정</a><span class="wiki-index-summary">지시와 모범 응답 쌍으로 모델이 원하는 응답 형식을 따르도록 학습하는 단계다.</span></li>
<li data-article-id="instruction-mixture"><a href="/wiki/instruction-mixture/">지시 데이터 혼합</a><span class="wiki-index-summary">지시 데이터 혼합은 지시 튜닝에 사용할 여러 과제·출처·형식 데이터의 구성과 표본 비율을 정한 집합이다.</span></li>
<li data-article-id="instruction-dataset"><a href="/wiki/instruction-dataset/">지시 데이터셋</a><span class="wiki-index-summary">지시 데이터셋은 자연어 지시, 선택적 입력과 기대 응답을 짝지어 모델의 과제 수행과 지시 따르기를 학습시키는 데이터 모음이다.</span></li>
<li data-article-id="instruction-tuning"><a href="/wiki/instruction-tuning/">지시 튜닝</a><span class="wiki-index-summary">다양한 자연어 지시 데이터로 여러 과제를 지시 형식에 맞게 수행하도록 만드는 학습이다.</span></li>
<li data-article-id="knowledge-distillation"><a href="/wiki/knowledge-distillation/">지식 증류</a><span class="wiki-index-summary">큰 교사 모델의 출력이나 표현을 작은 학생 모델이 모방하도록 학습하는 방법이다.</span></li>
<li data-article-id="dpo"><a href="/wiki/dpo/">직접 선호 최적화</a><span class="wiki-index-summary">별도 강화학습 루프 없이 선호 응답과 비선호 응답으로 정책을 직접 최적화하는 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ch">
<h2 id="index-ko-ch">ㅊ</h2>
<ul class="wiki-index-list">
<li data-article-id="differentially-private-training"><a href="/wiki/differentially-private-training/">차등 개인정보 보호 학습</a><span class="wiki-index-summary">차등 개인정보보호 학습은 한 개인의 학습 레코드 포함 여부가 모델 출력 분포에 미치는 영향을 수학적으로 제한하는 학습 방식이다.</span></li>
<li data-article-id="reference-model"><a href="/wiki/reference-model/">참조 모델</a><span class="wiki-index-summary">기준 모델은 선호 최적화 중 새 정책의 변화량을 측정하거나 비교 확률을 계산하기 위해 고정해 두는 이전 모델이다.</span></li>
<li data-article-id="chat-template"><a href="/wiki/chat-template/">채팅 템플릿</a><span class="wiki-index-summary">채팅 템플릿은 역할이 있는 대화 메시지를 모델이 학습한 특수 토큰과 구분자 순서의 단일 토큰열로 변환하는 규칙이다.</span></li>
<li data-article-id="checkpoint"><a href="/wiki/checkpoint/">체크포인트</a><span class="wiki-index-summary">특정 학습 시점의 모델 가중치와 최적화 상태를 저장한 파일 집합이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-t">
<h2 id="index-ko-t">ㅌ</h2>
<ul class="wiki-index-list">
<li data-article-id="tensor-parallelism"><a href="/wiki/tensor-parallelism/">텐서 병렬화</a><span class="wiki-index-summary">텐서 병렬화는 한 층의 큰 가중치 텐서와 행렬 연산을 여러 장치에 분할하는 모델 병렬 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-p">
<h2 id="index-ko-p">ㅍ</h2>
<ul class="wiki-index-list">
<li data-article-id="peft"><a href="/wiki/peft/">파라미터 효율적 미세조정</a><span class="wiki-index-summary">전체 가중치 대신 일부 작은 파라미터만 학습해 비용을 줄이는 기법들의 총칭이다.</span></li>
<li data-article-id="pipeline-parallelism"><a href="/wiki/pipeline-parallelism/">파이프라인 병렬화</a><span class="wiki-index-summary">파이프라인 병렬화는 모델의 연속된 층 구간을 여러 장치에 배치하고 미니배치를 마이크로배치로 흘려보내는 방식이다.</span></li>
<li data-article-id="prompt-tuning"><a href="/wiki/prompt-tuning/">프롬프트 튜닝</a><span class="wiki-index-summary">프롬프트 튜닝은 입력 임베딩 앞에 학습 가능한 연속 프롬프트 벡터를 붙이고 기반 모델은 고정하는 미세조정 방법이다.</span></li>
<li data-article-id="prefix-tuning"><a href="/wiki/prefix-tuning/">프리픽스 튜닝</a><span class="wiki-index-summary">프리픽스 튜닝은 각 트랜스포머 층의 어텐션에 학습 가능한 연속 키·값 접두사를 추가하는 매개변수 효율적 미세조정 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-h">
<h2 id="index-ko-h">ㅎ</h2>
<ul class="wiki-index-list">
<li data-article-id="training-audit-log"><a href="/wiki/training-audit-log/">학습 감사 로그</a><span class="wiki-index-summary">학습 감사 로그는 모델 학습 과정의 입력 버전·설정·실행 주체·변경·산출물과 승인 사건을 변조 탐지 가능한 형태로 남긴 기록이다.</span></li>
<li data-article-id="training-data-consent"><a href="/wiki/training-data-consent/">학습 데이터 동의</a><span class="wiki-index-summary">학습 데이터 동의는 개인이나 권리자가 자신의 데이터가 모델 학습에 사용되는 범위와 목적을 알고 허용한 상태다.</span></li>
<li data-article-id="training-data-copyright"><a href="/wiki/training-data-copyright/">학습 데이터 저작권</a><span class="wiki-index-summary">학습 데이터 저작권은 학습 자료의 보호되는 표현을 수집·복제·변환·배포할 때 적용되는 권리와 예외 문제다.</span></li>
<li data-article-id="training-data-provenance"><a href="/wiki/training-data-provenance/">학습 데이터 출처 추적</a><span class="wiki-index-summary">학습 데이터 출처 추적은 각 학습 예시가 어디서 언제 어떤 조건으로 수집·변환됐는지 계보를 기록하는 관리 절차다.</span></li>
<li data-article-id="training-data-filtering"><a href="/wiki/training-data-filtering/">학습 데이터 필터링</a><span class="wiki-index-summary">학습 데이터 필터링은 품질, 언어, 안전, 개인정보와 라이선스 기준으로 원시 데이터를 선택하거나 제외하는 절차다.</span></li>
<li data-article-id="training-data-formatting"><a href="/wiki/training-data-formatting/">학습 데이터 형식화</a><span class="wiki-index-summary">학습 데이터 형식화는 원시 사례를 모델이 읽을 입력·목표 토큰, 역할, 마스크와 메타데이터 구조로 변환하는 과정이다.</span></li>
<li data-article-id="training-corpus"><a href="/wiki/training-corpus/">학습 말뭉치</a><span class="wiki-index-summary">학습 말뭉치는 언어 모델이나 다른 학습 시스템의 파라미터를 최적화하는 데 사용하는 문서와 토큰의 조직화된 집합이다.</span></li>
<li data-article-id="training-reproducibility"><a href="/wiki/training-reproducibility/">학습 재현성</a><span class="wiki-index-summary">학습 재현성은 같은 데이터·코드·환경·설정을 사용했을 때 허용 오차 안에서 동일한 모델 특성과 결과를 다시 얻을 수 있는 정도다.</span></li>
<li data-article-id="synthetic-data"><a href="/wiki/synthetic-data/">합성 데이터</a><span class="wiki-index-summary">실제 관측값을 그대로 복제하지 않고 규칙·시뮬레이션·통계 또는 생성 모델로 만든 데이터다.</span></li>
<li data-article-id="constitutional-ai"><a href="/wiki/constitutional-ai/">헌법적 AI</a><span class="wiki-index-summary">헌법적 AI는 자연어 원칙 집합을 사용해 모델이 자신의 응답을 비평·수정하고 선호 학습 신호를 만드는 정렬 방법이다.</span></li>
<li data-article-id="diffusion-training-objective"><a href="/wiki/diffusion-training-objective/">확산 학습 목표</a><span class="wiki-index-summary">확산 학습 목표는 단계별로 노이즈가 추가된 데이터에서 노이즈·원본·점수 중 하나를 예측하도록 모델을 학습하는 목적이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-a">
<h2 id="index-en-a">A</h2>
<ul class="wiki-index-list">
<li data-article-id="alignment"><a href="/wiki/alignment/">AI 정렬</a><span class="wiki-index-summary">모델의 행동이 사람의 의도·가치·안전 제약과 일치하도록 만드는 연구와 과정이다.</span></li>
<li data-article-id="reinforcement-learning-from-ai-feedback"><a href="/wiki/reinforcement-learning-from-ai-feedback/">AI 피드백 기반 강화학습</a><span class="wiki-index-summary">AI 피드백 기반 강화학습은 사람 대신 또는 사람과 함께 다른 모델의 비평·선호·규칙 판정을 보상 신호로 사용해 정책을 조정하는 방식이다.</span></li>
<li data-article-id="all-reduce"><a href="/wiki/all-reduce/">All-Reduce</a><span class="wiki-index-summary">올리듀스는 여러 작업자의 같은 크기 텐서를 합·최대 같은 연산으로 결합하고 결과를 모든 작업자에게 배포하는 집단 통신이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-b">
<h2 id="index-en-b">B</h2>
<ul class="wiki-index-list">
<li data-article-id="best-of-n-sampling"><a href="/wiki/best-of-n-sampling/">Best-of-N 표본추출</a><span class="wiki-index-summary">Best-of-N 표집은 같은 입력에서 N개의 응답을 생성하고 보상 모델이나 평가 기준의 점수가 가장 높은 응답을 선택하는 추론·데이터 생성 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-d">
<h2 id="index-en-d">D</h2>
<ul class="wiki-index-list">
<li data-article-id="dora"><a href="/wiki/dora/">DoRA</a><span class="wiki-index-summary">DoRA는 가중치 행렬을 크기와 방향으로 분해하고 방향 변화는 저계수 어댑터로, 크기는 별도 파라미터로 학습하는 미세조정 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-i">
<h2 id="index-en-i">I</h2>
<ul class="wiki-index-list">
<li data-article-id="ia3"><a href="/wiki/ia3/">IA3</a><span class="wiki-index-summary">IA3는 어텐션과 순방향 신경망의 내부 활성값을 학습 가능한 벡터로 곱해 조정하는 매개변수 효율적 미세조정 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-k">
<h2 id="index-en-k">K</h2>
<ul class="wiki-index-list">
<li data-article-id="kl-penalty"><a href="/wiki/kl-penalty/">KL 페널티</a><span class="wiki-index-summary">KL 패널티는 새 정책의 출력 분포가 기준 정책에서 지나치게 멀어지는 것을 억제하기 위해 KL 발산을 목적함수에 더하는 항이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-l">
<h2 id="index-en-l">L</h2>
<ul class="wiki-index-list">
<li data-article-id="proximal-policy-optimization-for-llm"><a href="/wiki/proximal-policy-optimization-for-llm/">LLM용 근접 정책 최적화</a><span class="wiki-index-summary">LLM용 근접 정책 최적화는 보상 신호를 높이되 새 언어 모델 정책이 기준 정책에서 한 번에 너무 멀어지지 않도록 갱신하는 강화학습 방법이다.</span></li>
<li data-article-id="lora"><a href="/wiki/lora/">LoRA</a><span class="wiki-index-summary">기존 가중치를 고정하고 저랭크 행렬만 학습하는 파라미터 효율적 미세조정 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-q">
<h2 id="index-en-q">Q</h2>
<ul class="wiki-index-list">
<li data-article-id="qlora"><a href="/wiki/qlora/">QLoRA</a><span class="wiki-index-summary">QLoRA는 사전학습 모델 가중치를 저비트로 양자화해 고정하고 저계수 어댑터만 학습하는 메모리 효율적 미세조정 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-z">
<h2 id="index-en-z">Z</h2>
<ul class="wiki-index-list">
<li data-article-id="zero-redundancy-optimizer"><a href="/wiki/zero-redundancy-optimizer/">ZeRO 옵티마이저</a><span class="wiki-index-summary">제로 중복 옵티마이저는 데이터 병렬 학습에서 옵티마이저 상태·기울기·파라미터의 중복 복사본을 단계적으로 분할하는 메모리 최적화다.</span></li>
</ul>
</section>
</div>

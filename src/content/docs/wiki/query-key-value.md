---
title: "쿼리·키·값 Query, Key, Value"
description: "어텐션에서 무엇을 찾을지 나타내는 쿼리와 비교 기준인 키, 선택된 정보를 전달하는 값으로 입력 표현을 투영한 세 집합이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">Query, Key, and Value · QKV · Query-Key-Value</p>

<p class="wiki-lead">어텐션에서 무엇을 찾을지 나타내는 쿼리와 비교 기준인 키, 선택된 정보를 전달하는 값으로 입력 표현을 투영한 세 집합이다.</p>

<div class="wiki-document-meta">분류: [트랜스포머와 모델 구조](/category/transformer/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

어텐션에서 무엇을 찾을지 나타내는 쿼리와 비교 기준인 키, 선택된 정보를 전달하는 값으로 입력 표현을 투영한 세 집합이다.

어텐션 함수는 쿼리와 키의 유사도로 가중치를 만들고 그 가중치로 값 벡터를 합성한다. 이름은 검색 시스템의 질의·색인·내용 관계를 비유하지만 실제로는 학습된 선형 투영 결과다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

셀프 어텐션에서는 Q·K·V가 같은 입력에서 만들어지고, 크로스 어텐션에서는 쿼리와 키·값의 원천이 다르다. 멀티헤드 어텐션은 표현 차원을 여러 헤드로 나누어 각기 다른 투영과 관계를 학습한다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

scaled dot-product attention은 softmax(QKᵀ/√dₖ)V로 표현된다. √dₖ로 나누는 과정은 차원이 커질 때 내적 크기가 지나치게 커지는 현상을 완화한다. 마스크는 특정 키 위치가 가중치 계산에 참여하지 못하게 한다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

핵심 계약은 배치, 시퀀스 길이, 헤드 수, 헤드 차원과 마스크 shape다. 추론에서는 이전 토큰의 K·V를 캐시에 보관해 다시 계산하지 않는다. 멀티쿼리·그룹드쿼리 어텐션은 K·V 헤드를 공유해 캐시 비용을 줄인다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

텍스트 생성, 번역, 검색 결합 생성, 이미지-텍스트 결합에 사용된다. 분석할 때는 어텐션 가중치를 곧바로 설명 가능성으로 간주하지 말고, 마스킹과 투영, 잔차 연결까지 포함한 전체 경로를 본다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

시퀀스 길이에 따른 점수 행렬 비용, 마스크 오류, 헤드 차원 불일치가 주요 문제다. 어텐션 가중치가 높다는 사실만으로 해당 입력이 최종 출력의 원인이라고 단정할 수 없으며 대체 입력 실험이 필요하다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [attention](/wiki/attention/): Q·K·V를 이용해 관련 정보를 모으는 상위 계산 원리다.
- [self-attention](/wiki/self-attention/): 세 집합이 같은 시퀀스에서 유도되는 어텐션 형태다.
- [cross-attention](/wiki/cross-attention/): 쿼리와 키·값이 서로 다른 입력 표현에서 만들어지는 형태다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적인 적용 예시

질문 토큰을 쿼리로, 검색 문서 토큰을 키와 값으로 두면 질문과 유사한 키가 큰 점수를 받고 대응 값이 출력에 더 많이 반영된다. 테스트에서는 마스크 전후의 shape, 가중치 합, 패딩 위치의 기여도를 확인한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** Q·K·V 원천, 투영 차원, 헤드 수, 마스크 규칙, 캐시 자료형과 최대 시퀀스 길이를 기록한다.
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

- 쿼리·키·값 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 선행 개념

- [어텐션](/wiki/attention/)
- [소프트맥스](/wiki/softmax/)

## 관련 문서

- [셀프 어텐션](/wiki/self-attention/)
- [크로스 어텐션](/wiki/cross-attention/)
- [멀티헤드 어텐션](/wiki/multi-head-attention/)

## 이 문서를 가리키는 문서

- [크로스 어텐션](/wiki/cross-attention/)
- [멀티헤드 어텐션](/wiki/multi-head-attention/)
- [위치 인코딩](/wiki/positional-encoding/)
- [셀프 어텐션](/wiki/self-attention/)

## 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — paper
<span id="reference-2"></span>2. [PyTorch MultiheadAttention](https://docs.pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html) — documentation
<span id="reference-3"></span>3. [Attention (machine learning) — Wikipedia](https://en.wikipedia.org/wiki/Attention_%28machine_learning%29) — encyclopedia

## 코스에서 계속 읽기

- **LLM 내부 구조:** [다음 문서 — 위치 인코딩](/wiki/positional-encoding/)

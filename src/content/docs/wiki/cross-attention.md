---
title: "크로스 어텐션 Cross-Attention"
description: "한 표현의 질의가 다른 표현에서 만든 키와 값을 조회해 두 입력 사이의 관련 정보를 결합하는 어텐션이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">Encoder-Decoder Attention</p>

<p class="wiki-lead">한 표현의 질의가 다른 표현에서 만든 키와 값을 조회해 두 입력 사이의 관련 정보를 결합하는 어텐션이다.</p>

<div class="wiki-document-meta">분류: [트랜스포머와 모델 구조](/category/transformer/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

한 표현의 질의가 다른 표현에서 만든 키와 값을 조회해 두 입력 사이의 관련 정보를 결합하는 어텐션이다.

셀프 어텐션이 한 시퀀스 내부 관계를 계산한다면 크로스 어텐션은 출처가 다른 두 표현을 연결한다. 인코더-디코더 번역, 텍스트 조건 이미지 생성, 멀티모달 융합에서 조건 정보를 전달하는 핵심 연산이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

쿼리·키·값의 출처, 마스크, shape와 계산 비용을 다룬다. 특정 모델의 전체 구조와 크로스 어텐션 한 층의 역할을 구분한다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

목표 시퀀스에서 질의 Q를 만들고 원천 시퀀스에서 키 K와 값 V를 만든다. QK 전치의 유사도를 스케일링하고 마스크와 소프트맥스를 적용한 가중치로 V를 합산한다.

[어텐션](/wiki/attention/) 및 [쿼리·키·값](/wiki/query-key-value/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

질의 길이와 원천 길이가 다를 수 있으며 출력 길이는 질의 쪽을 따른다. 멀티헤드 구성은 여러 투영 공간에서 대응 관계를 병렬로 계산한 뒤 결과를 결합한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

번역 디코더가 원문 표현을 참조하거나 이미지 생성기가 텍스트 조건을 반영하고, 시각-언어 모델이 이미지와 텍스트 특징을 결합할 때 사용한다. 어떤 입력이 Q이고 어떤 입력이 K·V인지 문서화해야 한다.

단순 결합이나 풀링으로 충분한지 기준선을 만들고 크로스 어텐션이 품질 개선을 주는지 확인한다. 원천 길이가 길면 메모리와 지연이 질의 길이×원천 길이에 비례해 커질 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

높은 어텐션 가중치를 인과적 설명이나 인간의 주의와 동일시할 수 없다. 잘못된 마스크, 패딩 처리, 축 순서는 조용히 품질을 떨어뜨릴 수 있다.

조건 입력에 악성 또는 무관한 정보가 들어오면 다른 모달리티 출력에 영향을 줄 수 있다. 입력 권한, 마스크, 길이 제한과 중간 표현의 검증이 필요하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [셀프 어텐션](/wiki/self-attention/): 셀프 어텐션은 Q·K·V가 같은 입력에서 나오고 크로스 어텐션은 질의와 키·값의 출처가 다르다.
- [쿼리·키·값](/wiki/query-key-value/): 쿼리·키·값은 어텐션의 계산 표현이고 크로스 어텐션은 이 표현들의 입력 출처를 다르게 구성한 방식이다.
- [인코더-디코더](/wiki/encoder-decoder/): 인코더-디코더는 전체 모델 구조이며 크로스 어텐션은 두 부분을 연결하는 한 연산이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적 적용 예시

번역에서 디코더의 현재 토큰 표현이 질의가 되고 인코더가 만든 원문 토큰 표현이 키와 값이 된다. 각 출력 위치는 원문 전체를 조회하되 패딩 위치는 마스크한다. 배치, 헤드, 목표 길이, 원천 길이의 축을 출력 전후로 확인하면 구현 오류를 줄일 수 있다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 크로스 어텐션 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 크로스 어텐션이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** Q·K·V 출처와 shape, 패딩·인과 마스크, 어텐션 가중치 합, 길이 증가에 따른 메모리와 지연을 검사한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

**운영 기록 템플릿**

- **선택 근거:** 크로스 어텐션을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [self-attention](/wiki/self-attention/), [encoder-decoder](/wiki/encoder-decoder/), [multimodal-model](/wiki/multimodal-model/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 크로스 어텐션의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 학습 체크

- 크로스 어텐션의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [셀프 어텐션](/wiki/self-attention/)와 [인코더-디코더](/wiki/encoder-decoder/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 선행 개념

- [어텐션](/wiki/attention/)
- [쿼리·키·값](/wiki/query-key-value/)

## 관련 문서

- [셀프 어텐션](/wiki/self-attention/)
- [인코더-디코더](/wiki/encoder-decoder/)
- [멀티모달 모델](/wiki/multimodal-model/)

## 이 문서를 가리키는 문서

- [어텐션](/wiki/attention/)
- [멀티헤드 어텐션](/wiki/multi-head-attention/)
- [쿼리·키·값](/wiki/query-key-value/)
- [셀프 어텐션](/wiki/self-attention/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — paper
<span id="reference-2"></span>2. [PyTorch MultiheadAttention](https://docs.pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html) — documentation
<span id="reference-3"></span>3. [Attention (machine learning) — Wikipedia](https://en.wikipedia.org/wiki/Attention_%28machine_learning%29) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

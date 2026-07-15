---
title: "다음 토큰 예측 Next-Token Prediction"
description: "앞선 토큰 문맥을 조건으로 바로 다음 토큰의 확률분포를 예측하도록 언어 모델을 학습하고 생성하는 방식이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">자동회귀 언어 모델링 · Causal Language Modeling</p>

<p class="wiki-lead">앞선 토큰 문맥을 조건으로 바로 다음 토큰의 확률분포를 예측하도록 언어 모델을 학습하고 생성하는 방식이다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

앞선 토큰 문맥을 조건으로 바로 다음 토큰의 확률분포를 예측하도록 언어 모델을 학습하고 생성하는 방식이다.

문장 전체의 확률을 각 위치에서 이전 토큰을 조건으로 한 확률의 곱으로 분해한다. 학습에서는 정답 시퀀스를 한 칸 이동해 모든 위치의 다음 토큰 손실을 병렬로 계산하고, 생성에서는 예측한 토큰을 다시 입력에 붙인다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

인과적 언어 모델은 미래 토큰을 볼 수 없도록 마스크를 사용한다. 마스크드 언어 모델처럼 문장 중간의 가려진 토큰을 양방향 문맥으로 맞히는 목적과 구분해야 한다. 다음 토큰 목적은 사전학습 방식이지 사실성이나 지시 준수를 직접 보장하는 목적 함수가 아니다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

모델은 각 위치의 은닉 상태를 어휘 크기의 로짓으로 투영하고 소프트맥스로 분포를 만든다. 교차 엔트로피가 정답 토큰의 음의 로그 확률을 줄인다. 추론 시에는 greedy, temperature, top-k, top-p 같은 정책으로 분포에서 토큰을 고른다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

토크나이저, 문맥 창, 인과 마스크, 출력 헤드, 손실 마스킹이 핵심 구성이다. 패딩 토큰과 프롬프트 구간을 손실에서 제외할지 명시해야 한다. 평가에서는 토큰 평균 손실과 퍼플렉서티의 토크나이저 의존성을 함께 기록한다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

텍스트 완성, 대화, 코드 생성, 번역과 구조화 출력의 기반이다. 실무에서는 생성 목적에 맞게 디코딩 정책과 중단 토큰, 최대 길이를 별도로 설계하고 결과 수준의 평가를 수행한다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

한 단계의 국소 예측이 장기 계획, 진실성, 안전성을 보장하지 않는다. 생성 중 작은 오류가 다음 문맥에 들어가 누적될 수 있고, 높은 확률의 상투적 문장과 낮은 확률의 오류 사이를 디코딩 정책이 바꾼다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [language-model](/wiki/language-model/): 토큰 시퀀스의 확률을 모델링하는 상위 개념이다.
- [token](/wiki/token/): 예측의 기본 단위이며 토크나이저에 따라 단어와 일치하지 않을 수 있다.
- [temperature](/wiki/temperature/): 예측 분포에서 표본을 고를 때 분포의 평탄도를 조절한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적인 적용 예시

“인공지능은” 뒤에서 여러 토큰의 로짓을 계산하고 정규화한 뒤 하나를 선택한다. 같은 모델이라도 greedy와 확률 표본추출의 출력이 다르므로 고정 프롬프트, 시드, 디코딩 설정으로 회귀 시험을 수행한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 모델·토크나이저 버전, 문맥 길이, 손실 마스크, 디코딩 파라미터, 시드와 중단 조건을 기록한다.
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

- 다음 토큰 예측 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 선행 개념

- [토큰](/wiki/token/)
- [언어 모델](/wiki/language-model/)

## 관련 문서

- [소프트맥스](/wiki/softmax/)
- [생성 온도](/wiki/temperature/)
- [Top-k 샘플링](/wiki/top-k-sampling/)

## 이 문서를 가리키는 문서

- [빔 탐색](/wiki/beam-search/)
- [생성 온도](/wiki/temperature/)
- [소프트맥스](/wiki/softmax/)
- [언어 모델](/wiki/language-model/)
- [전문가 혼합](/wiki/mixture-of-experts/)

<details class="wiki-backlinks-more">
<summary>나머지 2개 문서 보기</summary>

- [컴플리션](/wiki/completion/)
- [프롬프트](/wiki/prompt/)

</details>

## 이 문서를 포함하는 코스

[AI 기초](/course/ai-foundations/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) — paper
<span id="reference-2"></span>2. [Hugging Face Causal Language Modeling](https://huggingface.co/docs/transformers/main/tasks/language_modeling) — documentation
<span id="reference-3"></span>3. [Language model — Wikipedia](https://en.wikipedia.org/wiki/Language_model) — encyclopedia

## 코스에서 계속 읽기

- **AI 기초:** [다음 문서 — 프롬프트](/wiki/prompt/)

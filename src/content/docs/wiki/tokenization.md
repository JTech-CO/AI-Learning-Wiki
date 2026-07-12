---
title: "토큰화"
description: "문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">Tokenization</p>

<p class="wiki-lead">문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다.</p>

<div class="wiki-document-meta">분류: [LLM과 토큰 처리](/category/llm/) · 문서 상태: 검토 완료 · 최근 검토: 2026-07-12</div>

## 개요

문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다. 이 개념은 LLM과 토큰 처리 분야에서 시스템의 구성 요소와 선택 기준을 설명하는 데 쓰인다. 용어의 이름뿐 아니라 입력, 처리 과정, 출력, 적용 조건을 함께 확인해야 서로 다른 구현에서 같은 표현이 어떻게 달라지는지 이해할 수 있다.

## 핵심 원리

토큰화을 이해하려면 먼저 [하이퍼파라미터](/wiki/hyperparameter/), [토큰](/wiki/token/)의 역할을 구분해야 한다. 이 선행 개념들이 데이터와 계산의 기본 단위를 제공하고, 토큰화은 이를 특정 목적에 맞게 결합하거나 제어한다. 실제 결과는 모델 구조, 데이터 분포, 파라미터 설정에 따라 달라진다.

## 관련 개념과 활용

토큰화은 [토큰](/wiki/token/), [토크나이저](/wiki/tokenizer/), [어휘 집합](/wiki/vocabulary/)와 함께 사용된다. 이 관계를 알면 모델을 설계하거나 API를 선택하고, 품질·비용·안전 문제를 진단할 때 어느 계층의 문제인지 구분할 수 있다. 관련 문서의 정의와 선행 관계를 따라가면 단일 제품의 기능명에 종속되지 않는 지식 구조를 만들 수 있다.

## 주의점

토큰화의 세부 동작과 성능은 구현 버전, 데이터, 실행 환경에 따라 달라진다. 하나의 수치나 사례를 모든 시스템에 일반화하지 말아야 하며, 안정적인 원리와 빠르게 변하는 제품 정보를 구분해야 한다. 중요한 판단에서는 아래 1차 자료와 실제 사용하는 구현의 최신 문서를 함께 확인한다.

## 선행 개념

- [하이퍼파라미터](/wiki/hyperparameter/)
- [토큰](/wiki/token/)

## 관련 문서

- [토큰](/wiki/token/)
- [토크나이저](/wiki/tokenizer/)
- [어휘 집합](/wiki/vocabulary/)

## 이 문서를 가리키는 문서

- [하이퍼파라미터](/wiki/hyperparameter/)
- [토큰](/wiki/token/)
- [토크나이저](/wiki/tokenizer/)
- [어휘 집합](/wiki/vocabulary/)

## 이 문서를 포함하는 코스

[LLM 내부 구조](/course/llm-internals/)

## 참고 문헌

1. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) — paper

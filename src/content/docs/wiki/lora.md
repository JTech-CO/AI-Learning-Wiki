---
title: "LoRA"
description: "기존 가중치를 고정하고 저랭크 행렬만 학습하는 파라미터 효율적 미세조정 기법이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">Low-Rank Adaptation</p>

<p class="wiki-lead">기존 가중치를 고정하고 저랭크 행렬만 학습하는 파라미터 효율적 미세조정 기법이다.</p>

<div class="wiki-document-meta">분류: [학습과 사후학습](/category/training/) · 문서 상태: 검토 완료 · 최근 검토: 2026-07-12</div>

## 개요

기존 가중치를 고정하고 저랭크 행렬만 학습하는 파라미터 효율적 미세조정 기법이다. 이 개념은 학습과 사후학습 분야에서 시스템의 구성 요소와 선택 기준을 설명하는 데 쓰인다. 용어의 이름뿐 아니라 입력, 처리 과정, 출력, 적용 조건을 함께 확인해야 서로 다른 구현에서 같은 표현이 어떻게 달라지는지 이해할 수 있다.

## 핵심 원리

LoRA을 이해하려면 먼저 [보상 모델](/wiki/reward-model/), [직접 선호 최적화](/wiki/dpo/)의 역할을 구분해야 한다. 이 선행 개념들이 데이터와 계산의 기본 단위를 제공하고, LoRA은 이를 특정 목적에 맞게 결합하거나 제어한다. 실제 결과는 모델 구조, 데이터 분포, 파라미터 설정에 따라 달라진다.

## 관련 개념과 활용

LoRA은 [직접 선호 최적화](/wiki/dpo/), [파라미터 효율적 미세조정](/wiki/peft/), [지식 증류](/wiki/knowledge-distillation/)와 함께 사용된다. 이 관계를 알면 모델을 설계하거나 API를 선택하고, 품질·비용·안전 문제를 진단할 때 어느 계층의 문제인지 구분할 수 있다. 관련 문서의 정의와 선행 관계를 따라가면 단일 제품의 기능명에 종속되지 않는 지식 구조를 만들 수 있다.

## 주의점

LoRA의 세부 동작과 성능은 구현 버전, 데이터, 실행 환경에 따라 달라진다. 하나의 수치나 사례를 모든 시스템에 일반화하지 말아야 하며, 안정적인 원리와 빠르게 변하는 제품 정보를 구분해야 한다. 중요한 판단에서는 아래 1차 자료와 실제 사용하는 구현의 최신 문서를 함께 확인한다.

## 선행 개념

- [보상 모델](/wiki/reward-model/)
- [직접 선호 최적화](/wiki/dpo/)

## 관련 문서

- [직접 선호 최적화](/wiki/dpo/)
- [파라미터 효율적 미세조정](/wiki/peft/)
- [지식 증류](/wiki/knowledge-distillation/)

## 이 문서를 가리키는 문서

- [직접 선호 최적화](/wiki/dpo/)
- [지식 증류](/wiki/knowledge-distillation/)
- [파라미터 효율적 미세조정](/wiki/peft/)
- [보상 모델](/wiki/reward-model/)

## 이 문서를 포함하는 코스

[모델 학습과 튜닝](/course/model-training/)

## 참고 문헌

1. [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155) — paper

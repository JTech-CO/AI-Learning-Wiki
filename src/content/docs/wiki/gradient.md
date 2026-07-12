---
title: "기울기"
description: "여러 변수에 대한 함수 변화율을 모은 벡터로, 손실을 줄이는 방향을 알려준다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">Gradient</p>

<p class="wiki-lead">여러 변수에 대한 함수 변화율을 모은 벡터로, 손실을 줄이는 방향을 알려준다.</p>

<div class="wiki-document-meta">분류: [수학·통계 기초](/category/mathematics/) · 문서 상태: 검토 완료 · 최근 검토: 2026-07-12</div>

## 개요

여러 변수에 대한 함수 변화율을 모은 벡터로, 손실을 줄이는 방향을 알려준다. 이 개념은 수학·통계 기초 분야에서 시스템의 구성 요소와 선택 기준을 설명하는 데 쓰인다. 용어의 이름뿐 아니라 입력, 처리 과정, 출력, 적용 조건을 함께 확인해야 서로 다른 구현에서 같은 표현이 어떻게 달라지는지 이해할 수 있다.

## 핵심 원리

기울기을 이해하려면 먼저 [확률분포](/wiki/probability-distribution/), [조건부확률](/wiki/conditional-probability/)의 역할을 구분해야 한다. 이 선행 개념들이 데이터와 계산의 기본 단위를 제공하고, 기울기은 이를 특정 목적에 맞게 결합하거나 제어한다. 실제 결과는 모델 구조, 데이터 분포, 파라미터 설정에 따라 달라진다.

## 관련 개념과 활용

기울기은 [조건부확률](/wiki/conditional-probability/), [미분](/wiki/derivative/), [최적화](/wiki/optimization/)와 함께 사용된다. 이 관계를 알면 모델을 설계하거나 API를 선택하고, 품질·비용·안전 문제를 진단할 때 어느 계층의 문제인지 구분할 수 있다. 관련 문서의 정의와 선행 관계를 따라가면 단일 제품의 기능명에 종속되지 않는 지식 구조를 만들 수 있다.

## 주의점

기울기의 세부 동작과 성능은 구현 버전, 데이터, 실행 환경에 따라 달라진다. 하나의 수치나 사례를 모든 시스템에 일반화하지 말아야 하며, 안정적인 원리와 빠르게 변하는 제품 정보를 구분해야 한다. 중요한 판단에서는 아래 1차 자료와 실제 사용하는 구현의 최신 문서를 함께 확인한다.

## 선행 개념

- [확률분포](/wiki/probability-distribution/)
- [조건부확률](/wiki/conditional-probability/)

## 관련 문서

- [조건부확률](/wiki/conditional-probability/)
- [미분](/wiki/derivative/)
- [최적화](/wiki/optimization/)

## 이 문서를 가리키는 문서

- [조건부확률](/wiki/conditional-probability/)
- [미분](/wiki/derivative/)
- [최적화](/wiki/optimization/)
- [확률분포](/wiki/probability-distribution/)

## 이 문서를 포함하는 코스

[모델 학습과 튜닝](/course/model-training/)

## 참고 문헌

1. [Deep Learning Book: Linear Algebra](https://www.deeplearningbook.org/contents/linear_algebra.html) — book

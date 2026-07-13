---
title: "컴퓨터 비전 Computer Vision"
description: "이미지와 영상에서 대상·장면·공간 구조를 추정하고 유용한 정보를 계산하는 인공지능 분야다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">CV · 컴퓨터 시각</p>

<p class="wiki-lead">이미지와 영상에서 대상·장면·공간 구조를 추정하고 유용한 정보를 계산하는 인공지능 분야다.</p>

<div class="wiki-document-meta">분류: [멀티모달 AI](/category/multimodal/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

이미지와 영상에서 대상·장면·공간 구조를 추정하고 유용한 정보를 계산하는 인공지능 분야다.

컴퓨터 비전은 픽셀을 단순 표시하는 것을 넘어 무엇이 어디에 있고 시간에 따라 어떻게 변하는지 추론한다. 영상 처리와 기하학, 머신러닝을 결합하며 결과는 분류 레이블, 위치, 마스크, 깊이, 움직임 등으로 나타난다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

이미지 분류·검출·분할·추적·3차원 복원의 공통 입력과 평가를 다룬다. 이미지 생성은 시각 데이터를 만드는 인접 분야지만 관측한 장면을 해석하는 비전 과제와 구분한다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

전통적 방법은 특징과 기하 관계를 명시적으로 계산하고 현대 학습 기반 방법은 합성곱이나 비전 트랜스포머로 표현을 학습한다. 학습된 표현 위에서 과제별 헤드가 클래스, 경계 상자, 픽셀 마스크 같은 출력을 만든다.

[머신러닝](/wiki/machine-learning/) 및 [신경망](/wiki/neural-network/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

카메라·파일 입력, 디코딩과 전처리, 특징 추출기, 과제별 예측기, 후처리로 이어진다. 좌표계, 해상도, 색 공간, 프레임률과 촬영 조건을 데이터 계약에 포함해야 한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

문서 OCR, 제조 검사, 의료 영상, 자율 시스템, 접근성, 검색과 콘텐츠 관리에 사용한다. 실제 환경의 조명·각도·장치·대상 다양성을 반영한 자료로 평가한다.

과제 출력이 이미지 전체인지 객체 단위인지 픽셀 단위인지 먼저 정한다. 필요한 정확도와 처리 속도, 주석 비용, 장치 제약을 기준으로 모델과 해상도를 비교한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

가림, 조명 변화, 모션 블러, 새로운 카메라와 분포 밖 대상에서 성능이 급격히 떨어질 수 있다. 벤치마크의 평균 점수가 안전에 중요한 희귀 상황의 성능을 보장하지 않는다.

얼굴·차량 번호 같은 민감 정보와 감시 용도를 고려해 수집 근거, 보존 기간, 접근 권한을 관리한다. 자동 판단이 사람에게 영향을 줄 때는 집단별 오류와 이의 제기 절차를 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [광학 문자 인식](/wiki/ocr/): OCR은 이미지에서 문자와 문서 구조를 읽는 컴퓨터 비전의 구체적 응용이다.
- [멀티모달 모델](/wiki/multimodal-model/): 멀티모달 모델은 시각과 언어 등 여러 양식을 결합하며 컴퓨터 비전은 시각 정보 처리 자체에 초점을 둔다.
- [이미지 생성](/wiki/image-generation/): 이미지 생성은 새로운 시각 데이터를 합성하고 컴퓨터 비전은 주로 관측 이미지에서 정보를 추정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적 적용 예시

불량 검출 시스템은 제품 이미지를 받아 결함 위치의 마스크와 유형을 출력할 수 있다. 정상 제품이 대부분이면 전체 정확도보다 결함 재현율과 정상 오탐을 함께 본다. 생산 라인의 조명과 카메라가 바뀐 뒤 같은 시험을 반복해 분포 변화를 확인한다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 컴퓨터 비전 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 컴퓨터 비전이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 촬영 조건과 하위 집단별 데이터 분할, 과제별 지표, 좌표 변환, 지연 시간, 분포 밖 입력과 개인정보 처리를 시험한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

**운영 기록 템플릿**

- **선택 근거:** 컴퓨터 비전을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [ocr](/wiki/ocr/), [multimodal-model](/wiki/multimodal-model/), [image-generation](/wiki/image-generation/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 컴퓨터 비전의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 학습 체크

- 컴퓨터 비전의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [광학 문자 인식](/wiki/ocr/)와 [멀티모달 모델](/wiki/multimodal-model/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 선행 개념

- [머신러닝](/wiki/machine-learning/)
- [신경망](/wiki/neural-network/)

## 관련 문서

- [광학 문자 인식](/wiki/ocr/)
- [멀티모달 모델](/wiki/multimodal-model/)
- [이미지 생성](/wiki/image-generation/)

## 이 문서를 가리키는 문서

- [데이터 증강](/wiki/data-augmentation/)
- [이미지 캡셔닝](/wiki/image-captioning/)
- [이미지 분류](/wiki/image-classification/)
- [이미지 분할](/wiki/image-segmentation/)
- [객체 탐지](/wiki/object-detection/)
- [시각 근거화](/wiki/visual-grounding/)
- [시각 질의응답](/wiki/visual-question-answering/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Computer Vision: Algorithms and Applications](https://szeliski.org/Book/) — book
<span id="reference-2"></span>2. [OpenCV Introduction](https://docs.opencv.org/4.x/d1/dfb/intro.html) — documentation
<span id="reference-3"></span>3. [Computer vision — Wikipedia](https://en.wikipedia.org/wiki/Computer_vision) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

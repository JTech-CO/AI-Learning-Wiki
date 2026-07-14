---
title: "이미지 분류 Image Classification"
description: "입력 이미지 전체를 하나 이상의 사전 정의된 범주나 확률분포에 매핑하는 컴퓨터 비전 과제다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">영상 분류 · Image Recognition Classification</p>

<p class="wiki-lead">입력 이미지 전체를 하나 이상의 사전 정의된 범주나 확률분포에 매핑하는 컴퓨터 비전 과제다.</p>

<div class="wiki-document-meta">분류: [멀티모달 AI](/category/multimodal/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

입력 이미지 전체를 하나 이상의 사전 정의된 범주나 확률분포에 매핑하는 컴퓨터 비전 과제다.

모델은 픽셀이나 패치 표현에서 특징을 추출하고 분류 헤드로 클래스 로짓을 만든다. 단일 라벨 분류는 한 범주를, 다중 라벨 분류는 여러 독립 범주의 존재를 예측하므로 출력 함수와 손실이 다르다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

객체의 위치까지 찾는 탐지, 픽셀별 범주를 예측하는 분할과 구분된다. 제로샷 이미지 분류는 텍스트 라벨과 이미지 표현을 비교하지만, 고정 클래스 지도학습과 평가 조건이 다르다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

합성곱 신경망이나 비전 트랜스포머가 계층적 표현을 만들고 마지막 층이 클래스 점수를 출력한다. 학습은 보통 교차 엔트로피로 정답 클래스 확률을 높인다. 전처리 크기와 정규화가 사전학습 가중치의 계약과 맞아야 한다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

클래스 목록과 ID, 이미지 디코딩, 크기 조정·자르기·정규화, 모델 가중치, 임계값과 후처리가 파이프라인이다. 학습·평가 분할은 같은 대상이나 연속 촬영 장면이 양쪽에 섞이지 않게 구성한다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

제품 검사, 문서 유형 분류, 의료 영상 보조, 콘텐츠 정리에 사용된다. 클래스별 비용이 다르면 전체 정확도 대신 재현율, 정밀도, 보정과 거부 옵션을 함께 설계한다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

배경·조명·카메라와 클래스 분포가 바뀌면 성능이 크게 떨어질 수 있다. 학습 데이터의 지름길 특징을 사용할 수 있고, 닫힌 클래스 밖 입력에도 높은 확률을 낼 수 있다. 사람 집단과 촬영 조건별 오류 분석이 필요하다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [computer-vision](/wiki/computer-vision/): 이미지 이해 전반을 다루는 상위 분야다.
- [image-generation](/wiki/image-generation/): 라벨을 예측하는 대신 새로운 이미지를 합성한다.
- [ocr](/wiki/ocr/): 이미지 속 문자 영역과 문자열을 인식하는 특화 과제다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적인 적용 예시

불량 제품 분류에서 정상·긁힘·균열 클래스를 정의하고 촬영 일자별로 분할한다. 클래스별 혼동 행렬과 macro F1, 미확신 표본의 거부율을 측정하고 새로운 카메라 데이터로 외부 검증한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 데이터·클래스 사전 버전, 분할 기준, 전처리, 가중치 해시, 임계값, 클래스별 지표와 실패 이미지를 기록한다.
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

- 이미지 분류 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 선행 개념

- [컴퓨터 비전](/wiki/computer-vision/)
- [신경망](/wiki/neural-network/)

## 관련 문서

- [데이터 증강](/wiki/data-augmentation/)
- [모델 평가](/wiki/evaluation/)
- [이미지 생성](/wiki/image-generation/)

## 이 문서를 가리키는 문서

- [행동 인식](/wiki/action-recognition/)
- [오디오 캡셔닝](/wiki/audio-captioning/)
- [오디오 임베딩](/wiki/audio-embedding/)
- [오디오 모델](/wiki/audio-model/)
- [오디오 토큰](/wiki/audio-token/)
- [대조 언어-이미지 사전학습](/wiki/contrastive-language-image-pretraining/)
- [교차모달 정렬](/wiki/cross-modal-alignment/)
- [교차모달 어텐션](/wiki/cross-modal-attention/)
- [초기 융합](/wiki/early-fusion/)
- [특성 피라미드 네트워크](/wiki/feature-pyramid-network/)
- [프레임 샘플링](/wiki/frame-sampling/)
- [이미지 캡셔닝](/wiki/image-captioning/)
- [이미지 임베딩](/wiki/image-embedding/)
- [이미지 패치](/wiki/image-patch/)
- [이미지 검색](/wiki/image-retrieval/)
- [이미지 분할](/wiki/image-segmentation/)
- [이미지 토큰](/wiki/image-token/)
- [교차 배열 멀티모달 데이터](/wiki/interleaved-multimodal-data/)
- [공동 임베딩 공간](/wiki/joint-embedding-space/)
- [후기 융합](/wiki/late-fusion/)
- [잠재 확산 모델](/wiki/latent-diffusion-model/)
- [독순술 인식](/wiki/lip-reading/)
- [장시간 비디오 이해](/wiki/long-video-understanding/)
- [멜 스펙트로그램](/wiki/mel-spectrogram/)
- [모달리티](/wiki/modality/)
- [모달리티 어댑터](/wiki/modality-adapter/)
- [모달리티 격차](/wiki/modality-gap/)
- [모달리티 투영](/wiki/modality-projection/)
- [멀티모달 대조 사전학습](/wiki/multimodal-contrastive-pretraining/)
- [멀티모달 융합](/wiki/multimodal-fusion/)
- [멀티모달 지시 튜닝](/wiki/multimodal-instruction-tuning/)
- [멀티모달 토크나이저](/wiki/multimodal-tokenizer/)
- [신경 보코더](/wiki/neural-vocoder/)
- [객체 탐지](/wiki/object-detection/)
- [개방형 어휘 객체 탐지](/wiki/open-vocabulary-detection/)
- [광학 흐름](/wiki/optical-flow/)
- [Perceiver 리샘플러](/wiki/perceiver-resampler/)
- [픽셀 표현](/wiki/pixel-representation/)
- [Q-Former](/wiki/q-former/)
- [영역 제안 네트워크](/wiki/region-proposal-network/)
- [공간 추론](/wiki/spatial-reasoning/)
- [화자 분리](/wiki/speaker-diarization/)
- [화자 인식](/wiki/speaker-recognition/)
- [스펙트로그램](/wiki/spectrogram/)
- [음성 언어 모델](/wiki/speech-language-model/)
- [음성-텍스트 변환](/wiki/speech-to-text/)
- [음성 번역](/wiki/speech-translation/)
- [시간 어텐션](/wiki/temporal-attention/)
- [시간적 모델링](/wiki/temporal-modeling/)
- [텍스트-오디오 모델](/wiki/text-audio-model/)
- [텍스트-이미지 생성](/wiki/text-to-image-generation/)
- [비디오 캡셔닝](/wiki/video-captioning/)
- [비디오 분류](/wiki/video-classification/)
- [비디오 확산](/wiki/video-diffusion/)
- [비디오 생성](/wiki/video-generation/)
- [비디오 질의응답](/wiki/video-question-answering/)
- [비디오 토큰화](/wiki/video-tokenization/)
- [비디오 이해](/wiki/video-understanding/)
- [시각 인코더](/wiki/visual-encoder/)
- [시각 근거화](/wiki/visual-grounding/)
- [시각 질의응답](/wiki/visual-question-answering/)
- [시각 추론](/wiki/visual-reasoning/)
- [음성 활동 탐지](/wiki/voice-activity-detection/)
- [세계 시뮬레이션 모델](/wiki/world-simulation-model/)
- [제로샷 이미지 분류](/wiki/zero-shot-image-classification/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [ImageNet Classification with Deep Convolutional Neural Networks](https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html) — paper
<span id="reference-2"></span>2. [Torchvision Models and Pre-trained Weights](https://docs.pytorch.org/vision/stable/models.html) — documentation
<span id="reference-3"></span>3. [Image classification — Wikipedia](https://en.wikipedia.org/wiki/Image_classification) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

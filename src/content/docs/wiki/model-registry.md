---
title: "모델 레지스트리 Model Registry"
description: "학습된 모델 버전과 메타데이터·검증 상태·배포 참조를 중앙에서 추적하고 관리하는 수명주기 시스템이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-alias">모델 등록소</p>

<p class="wiki-lead">학습된 모델 버전과 메타데이터·검증 상태·배포 참조를 중앙에서 추적하고 관리하는 수명주기 시스템이다.</p>

<div class="wiki-document-meta">분류: [모델·서비스 생태계](/category/ecosystem/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

학습된 모델 버전과 메타데이터·검증 상태·배포 참조를 중앙에서 추적하고 관리하는 수명주기 시스템이다.

모델 레지스트리는 파일 저장소를 넘어 어떤 실행과 데이터에서 모델이 만들어졌고 어떤 버전이 승인·배포됐는지 연결한다. 개발 환경의 실험 산출물을 운영 환경의 명시적 모델 버전으로 전달하는 통제 지점이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

등록 모델, 버전, 별칭, 태그, 계보, 승인과 배포 연계를 다룬다. 공개 모델을 탐색·공유하는 모델 허브와 조직 내부 수명주기를 통제하는 레지스트리의 역할을 구분한다.

외부 백과는 표제어의 일반적 범위와 역사적 용례를 대조하는 데 사용했다. 본문은 백과 문장을 복제하지 않고 아래 1차 자료·공식 문서와 내부 개념 관계를 기준으로 다시 구성했다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

### 작동 원리

학습 실행이 모델 산출물과 서명·메트릭·데이터 참조를 기록하고 레지스트리에 새 버전으로 등록한다. 검증 절차가 결과를 승인하면 운영 코드는 고정 버전이나 관리되는 별칭을 통해 모델을 불러온다.

[모델](/wiki/model/) 및 [모델 허브](/wiki/model-hub/)를 먼저 보면 입력과 출력의 위치를 구분하기 쉽다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

모델 이름, 불변 버전, 산출물 위치, 입력·출력 서명, 실행·데이터 계보, 평가 결과, 태그·별칭, 승인 이력과 접근 정책이 핵심 요소다. 저장소와 메타데이터 데이터베이스의 일관성을 유지해야 한다.

구현을 비교할 때는 입력 형식, 기본값, 실패 조건, 출력 스키마와 관측 가능한 상태를 함께 기록한다. 같은 이름의 기능도 라이브러리와 서비스에 따라 경계와 기본 동작이 다를 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

실험에서 운영으로의 승격, 롤백, 여러 환경의 모델 추적, 감사와 협업, 지속 학습 파이프라인에 사용한다. 배포 시스템이 가리키는 모델을 해시나 불변 버전으로 재현할 수 있어야 한다.

팀 규모가 작아도 운영 모델이 둘 이상이거나 규제·롤백 요구가 있으면 명시적 레지스트리가 유용하다. 모델 파일뿐 아니라 전처리 코드, 의존성, 데이터와 평가 근거를 연결할 수 있는지 비교한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 한계와 흔한 오해

등록됐다는 사실은 모델의 품질·안전·라이선스를 보증하지 않는다. 별칭이 새 버전으로 이동하면 같은 이름이 다른 동작을 가리킬 수 있으므로 변경 관리와 배포 기록이 필요하다.

레지스트리는 공급망의 신뢰 중심이므로 쓰기 권한, 서명, 악성 파일 검사와 감사 로그를 강화한다. 삭제와 별칭 변경, 교차 환경 복제에 승인과 복구 절차를 둔다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 관련 개념과의 구분

- [모델 허브](/wiki/model-hub/): 모델 허브는 발견·공유·협업 기능이 중심이고 레지스트리는 조직의 버전·승인·배포 계보 통제가 중심이다.
- [체크포인트](/wiki/checkpoint/): 체크포인트는 학습 시점의 파일 집합이고 레지스트리는 선택된 산출물과 메타데이터의 수명주기를 관리한다.
- [모델 라이선스](/wiki/model-license/): 모델 라이선스는 사용·배포 권리를 규정하며 레지스트리는 각 버전에 해당 라이선스와 검토 상태를 연결해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적 적용 예시

사기 탐지 모델의 학습 실행이 모델 파일, 입력 스키마, 실제 시험셋 지표를 버전 12로 등록한다. 검토자는 기준선과 하위 집단 오류를 확인한 뒤 champion 별칭을 버전 12로 이동한다. 문제가 생기면 이전 버전 11로 별칭을 되돌리고 어떤 요청이 어느 버전을 사용했는지 로그로 확인한다.

이 예시를 재현할 때는 성공 사례만 고르지 않고 실패하기 쉬운 입력을 먼저 목록화한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 보존한다. 이렇게 하면 모델 레지스트리 자체의 한계와 데이터·주변 시스템에서 생긴 문제를 분리해 수정할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 실무 적용과 검증 절차

1. **목적과 경계 정의:** 모델 레지스트리이 해결해야 할 문제와 하지 않아야 할 행동을 한 문장씩 적는다.
2. **입력·출력 명세:** 입력 형식, 단위, shape 또는 스키마와 기대 출력을 고정한다.
3. **기준선 비교:** 가장 단순한 방법과 품질·지연·비용·안전 지표를 같은 자료에서 비교한다.
4. **실패 조건 시험:** 산출물 해시, 입력·출력 서명, 계보, 평가·승인 이력, 별칭 변경 권한, 배포와 롤백 재현성을 시험한다.
5. **버전과 근거 보존:** 데이터·코드·모델·문서 버전과 판단 근거를 연결해 변경 뒤 같은 시험을 반복한다.
6. **운영 통제:** 권한, 예산, 중단·롤백 조건과 사람 검토가 필요한 지점을 지정한다.

#### 운영 기록 템플릿

- **선택 근거:** 모델 레지스트리을 사용한 이유와 사용하지 않은 대안을 함께 적는다.
- **재현 조건:** 입력 자료의 시점과 범위, 코드·모델·라이브러리 버전, 핵심 파라미터와 실행 환경을 기록한다.
- **품질 기준:** 평균값 하나만 남기지 않고 성공 조건, 허용할 수 없는 실패, 하위 집단과 경계 사례의 결과를 분리한다.
- **변경 감지:** 데이터 분포, 인터페이스, 권한, 비용 또는 정책이 바뀌면 기존 결론을 자동 승계하지 않고 같은 평가를 반복한다.
- **관련 검토:** [model-license](/wiki/model-license/), [checkpoint](/wiki/checkpoint/), [workflow-orchestration](/wiki/workflow-orchestration/) 문서의 역할과 경계를 함께 확인해 인접 단계의 오류를 모델 레지스트리의 문제로 잘못 진단하지 않는다.
- **종료 판단:** 개선 폭이 기준선의 복잡도와 운영 위험을 상쇄하지 못하면 더 단순한 방법으로 돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

### 학습 체크

- 모델 레지스트리의 입력과 출력 또는 적용 대상을 한 문장으로 설명할 수 있는가?
- [모델 라이선스](/wiki/model-license/)와 [체크포인트](/wiki/checkpoint/)의 차이를 실제 사례로 구분할 수 있는가?
- 이 문서의 실패 조건을 평가 자료와 운영 로그에서 확인할 수 있는가?

## 문서 관계

### 선행 개념

- [모델](/wiki/model/)
- [모델 허브](/wiki/model-hub/)

### 관련 문서

- [모델 라이선스](/wiki/model-license/)
- [체크포인트](/wiki/checkpoint/)
- [워크플로 오케스트레이션](/wiki/workflow-orchestration/)

### 이 문서를 가리키는 문서

- [가속기 메모리 계층](/wiki/accelerator-memory-hierarchy/)
- [가속기 인터커넥트](/wiki/accelerator-interconnect/)
- [개방형 신경망 교환 형식](/wiki/open-neural-network-exchange/)
- [계산 비용](/wiki/compute-cost/)
- [관리형 추론 플랫폼](/wiki/managed-inference-platform/)

<details class="wiki-backlinks-more">
<summary>나머지 91개 문서 보기</summary>

- [그래픽 처리 장치](/wiki/graphics-processing-unit/)
- [대화형 노트북](/wiki/interactive-notebook/)
- [대화형 모델 데모](/wiki/interactive-model-demo/)
- [데이터 버전 관리](/wiki/data-version-control/)
- [데이터셋 라이브러리](/wiki/dataset-library/)
- [데이터셋 이용 조건](/wiki/dataset-terms-of-use/)
- [데이터셋 허브](/wiki/dataset-hub/)
- [라이선스 호환성](/wiki/license-compatibility/)
- [머신러닝 프레임워크](/wiki/machine-learning-framework/)
- [모델 가중치 파일](/wiki/model-weights/)
- [모델 검색](/wiki/model-search/)
- [모델 계보](/wiki/model-lineage/)
- [모델 롤백](/wiki/model-rollback/)
- [모델 메타데이터](/wiki/model-metadata/)
- [모델 모니터링 플랫폼](/wiki/model-monitoring-platform/)
- [모델 배포](/wiki/model-deployment/)
- [모델 버전](/wiki/model-version/)
- [모델 범용재화화](/wiki/model-commoditization/)
- [모델 서빙 플랫폼](/wiki/model-serving-platform/)
- [모델 아티팩트 형식](/wiki/model-artifact-format/)
- [모델 업데이트](/wiki/model-update/)
- [모델 저장소](/wiki/model-repository/)
- [모델 출시](/wiki/model-release/)
- [모델 카탈로그](/wiki/model-catalog/)
- [모델 컬렉션](/wiki/model-collection/)
- [모델 탐색](/wiki/model-discovery/)
- [모델 패키지](/wiki/model-package/)
- [모델 평가 보고서](/wiki/model-evaluation-report/)
- [모델 폐기](/wiki/model-retirement/)
- [모바일 모델 배포](/wiki/mobile-model-deployment/)
- [벤치마크 레지스트리](/wiki/benchmark-registry/)
- [상업적 이용 제한](/wiki/commercial-use-restriction/)
- [소스 공개 모델](/wiki/source-available-model/)
- [소프트웨어·데이터·모델 라이선스 구분](/wiki/software-data-model-license/)
- [신경망 처리 장치](/wiki/neural-processing-unit/)
- [실험 대시보드](/wiki/experiment-dashboard/)
- [실험 추적](/wiki/experiment-tracking/)
- [아티팩트 레지스트리](/wiki/artifact-registry/)
- [엣지 모델 배포](/wiki/edge-model-deployment/)
- [엣지 AI](/wiki/edge-ai/)
- [연구 전용 라이선스](/wiki/research-only-license/)
- [오픈 웨이트 모델](/wiki/open-weight-model/)
- [오픈소스 AI 정의](/wiki/open-source-ai-definition/)
- [온프레미스 AI](/wiki/on-premises-ai/)
- [재현 가능한 모델 빌드](/wiki/reproducible-model-build/)
- [저작자 표시 의무](/wiki/attribution-requirement/)
- [책임 있는 AI 라이선스](/wiki/responsible-ai-license/)
- [추론 경제성](/wiki/inference-economics/)
- [카피레프트 라이선스](/wiki/copyleft-license/)
- [컨테이너화 모델](/wiki/containerized-model/)
- [컴퓨트 클러스터](/wiki/compute-cluster/)
- [클라우드 AI 서비스](/wiki/cloud-ai-service/)
- [텐서 라이브러리](/wiki/tensor-library/)
- [텐서 처리 장치](/wiki/tensor-processing-unit/)
- [특성 저장소](/wiki/feature-store/)
- [파생 모델](/wiki/derivative-model/)
- [패키지 레지스트리](/wiki/package-registry/)
- [학습 비용](/wiki/training-cost/)
- [허용적 라이선스](/wiki/permissive-license/)
- [AI 가속기](/wiki/ai-accelerator/)
- [AI 공급망](/wiki/ai-supply-chain/)
- [AI 데이터센터](/wiki/ai-datacenter/)
- [AI 물 발자국](/wiki/ai-water-footprint/)
- [AI 상호운용성 표준](/wiki/ai-interoperability-standard/)
- [AI 에너지 소비](/wiki/ai-energy-consumption/)
- [AI 총소유비용](/wiki/total-cost-of-ownership-for-ai/)
- [AI 칩 가용성](/wiki/ai-chip-availability/)
- [AI 탄소 발자국](/wiki/ai-carbon-footprint/)
- [AI용 쿠버네티스](/wiki/kubernetes-for-ai/)
- [CUDA](/wiki/cuda/)
- [IEEE AI 표준](/wiki/ieee-ai-standards/)
- [InfiniBand](/wiki/infiniband/)
- [ISO/IEC JTC 1/SC 42](/wiki/iso-iec-jtc1-sc42/)
- [JAX](/wiki/jax/)
- [Keras](/wiki/keras/)
- [Linux Foundation AI & Data](/wiki/linux-foundation-ai-data/)
- [LLMOps](/wiki/llmops/)
- [ML 파이프라인 오케스트레이터](/wiki/ml-pipeline-orchestrator/)
- [MLCommons](/wiki/mlcommons/)
- [MLflow](/wiki/mlflow/)
- [MLOps](/wiki/mlops/)
- [NIST AI 프로그램](/wiki/nist-ai-program/)
- [NVLink](/wiki/nvlink/)
- [OECD AI 원칙](/wiki/oecd-ai-principles/)
- [Partnership on AI](/wiki/partnership-on-ai/)
- [PyTorch](/wiki/pytorch/)
- [ROCm](/wiki/rocm/)
- [SafeTensors](/wiki/safetensors/)
- [TensorFlow](/wiki/tensorflow/)
- [Transformers 라이브러리](/wiki/transformers-library/)
- [W3C 웹 머신러닝](/wiki/w3c-web-machine-learning/)

</details>

### 이 문서를 포함하는 코스

_포함된 코스가 없다._

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았다.</div>

### 참고 문헌

1. <span id="reference-1"></span>[TFX: A TensorFlow-Based Production-Scale Machine Learning Platform](https://research.google/pubs/tfx-a-tensorflow-based-production-scale-machine-learning-platform/) — paper
2. <span id="reference-2"></span>[MLflow Model Registry Workflows](https://mlflow.org/docs/latest/ml/model-registry/workflow/) — documentation
3. <span id="reference-3"></span>[MLOps — Wikipedia](https://en.wikipedia.org/wiki/MLOps) — encyclopedia

### 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없다._

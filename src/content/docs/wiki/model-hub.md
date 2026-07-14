---
title: "모델 허브 Model Hub"
description: "모델·데이터셋·데모·평가 정보를 검색하고 배포하는 공유 플랫폼이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">모델·데이터셋·데모·평가 정보를 검색하고 배포하는 공유 플랫폼이다.</p>

<div class="wiki-document-meta">분류: [모델·서비스 생태계](/category/ecosystem/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

모델·데이터셋·데모·평가 정보를 검색하고 배포하는 공유 플랫폼이다.

‘모델 허브’ 개념은 모델·서비스 생태계 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. 생태계 분야는 모델의 배포·공유·라이선스·도구 호환성을 둘러싼 운영 기반을 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 배경과 설명 범위

직접 대응하는 외부 백과 표제어가 뚜렷하지 않은 신생·세부 용어다. 따라서 아래 1차 자료와 상위 개념 문서를 중심으로 범위를 정하고, 제품별 용어는 일반 원리와 분리했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

모델 허브는 체크포인트, 설정, 토크나이저, 모델 카드, 버전 기록을 배포하고 재사용하게 하는 저장소다.

[모델](/wiki/model/) 및 [모델 라이선스](/wiki/model-license/) 개념을 먼저 이해하면 저장된 산출물과 실제 사용 권리를 구분하기 쉽다. 모델 허브에는 공개·비공개 저장소와 서로 다른 라이선스의 산출물이 함께 존재할 수 있다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

**아티팩트와 메타데이터의 결합**

모델 허브는 가중치 파일을 내려받는 저장소에 그치지 않고 모델을 재사용하기 위한 식별자, 버전, 구성, 토크나이저, 전처리기, 문서와 평가 정보를 함께 관리한다. 같은 모델 이름도 커밋이나 태그가 다르면 파일과 동작이 달라질 수 있으므로 재현 가능한 사용에는 정확한 리비전과 파일 해시가 필요하다. 대용량 파일은 일반 소스 코드와 다른 저장·전송 방식을 사용하며, 필요한 파일만 가져오거나 로컬 캐시를 재사용해 비용을 줄인다. 라이브러리가 편의상 “최신” 버전을 자동 선택하면 시간이 지난 뒤 같은 코드가 다른 아티팩트를 받을 수 있으므로 실험과 배포에서는 불변 식별자를 고정한다.

검색과 발견 기능은 태스크, 언어, 라이선스, 프레임워크, 데이터셋 같은 구조화된 메타데이터에 의존한다. 태그가 누락되거나 잘못되면 성능이 좋은 모델도 필요한 사용자에게 발견되지 않으며, 반대로 이름이 비슷하다는 이유로 목적에 맞지 않는 모델을 선택할 수 있다. 다운로드 수와 좋아요 수는 사용 관심의 신호일 뿐 품질·안전·법적 적합성을 증명하지 않는다. 후보를 찾은 다음에는 모델 카드의 용도와 한계, 평가 조건, 학습 데이터 설명을 읽고 자신의 데이터와 기준선으로 다시 시험해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘모델 허브’ 개념만 독립적으로 동작하지 않는다. [모델 라이선스](/wiki/model-license/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

**리포지터리·카드·계보**

모델 리포지터리에는 실행에 필요한 구성 파일, 직렬화된 가중치, 토크나이저 어휘와 규칙, 추론 예제, 라이선스와 모델 카드가 들어갈 수 있다. 파일 이름만으로 역할을 추측하지 말고 라이브러리와 모델 버전이 기대하는 구성을 확인한다. 가중치 형식은 동일해 보여도 아키텍처 설정이나 사용자 정의 코드가 필요할 수 있으며, 원격 코드를 실행하는 옵션은 공급망 위험을 동반한다. 샌드박스나 격리된 검토 환경에서 파일 구조와 코드를 먼저 조사하고, 신뢰한 리비전만 운영 환경으로 승격한다.

모델 카드는 의도한 사용, 제외할 사용, 학습·평가 데이터, 측정값, 윤리적 고려와 한계를 전달하는 문서다. 표준 양식은 비교를 돕지만 작성자의 주장과 독립 검증 결과를 구분해야 한다. 파인튜닝·양자화·병합처럼 파생 모델을 만들 때는 기반 모델, 사용한 데이터와 코드, 변경 파라미터를 연결해 계보를 남긴다. 모델 하나가 데이터셋과 데모에 연결되는 그래프는 재사용 경로를 보여 주지만, 링크가 존재한다고 해서 모든 라이선스 조건이 양립하는 것은 아니다. 조직 내부에서는 외부 허브의 리비전을 승인 목록에 등록하고, 검사된 아티팩트를 별도 레지스트리로 복제하는 흐름을 둘 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

모델 선택, 공급망 관리, 재현 가능한 배포와 협업에 사용한다. ‘모델 허브’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

**공개 허브와 내부 레지스트리의 역할**

공개 허브는 폭넓은 후보 발견, 연구 결과 공유와 생태계 도구 연결에 강점이 있다. 내부 레지스트리는 조직이 검토한 리비전, 접근 권한, 배포 이력과 규제 증거를 통제하는 데 유리하다. 둘 중 하나만 선택할 필요는 없다. 외부 후보를 격리된 수집 단계에서 가져와 파일·라이선스·행동 평가를 거친 뒤, 승인된 불변 아티팩트만 내부 레지스트리로 승격하는 구조가 가능하다. 운영 서비스가 외부의 이동하는 기본 브랜치를 직접 참조하지 않으면 삭제·변조·네트워크 장애에 대한 의존도도 줄어든다.

모델 공유의 가치는 재현 가능한 맥락이 있을 때 커진다. 가중치만 올리고 토크나이저, 전처리, 평가 코드와 학습 기반을 누락하면 다른 사용자가 같은 결과를 만들 수 없다. 반대로 모든 원천 데이터를 공개할 수 없는 경우에는 공개할 수 없는 이유, 데이터 범주와 시점, 제외 정책과 알려진 결손을 구체적으로 설명한다. 조직은 다운로드 인기보다 카드 완결성, 불변 리비전, 안전한 직렬화, 재현된 평가와 지원 가능한 실행 환경에 가중치를 두어 후보를 순위화할 수 있다.

선택 기록에는 제외한 후보와 이유도 남긴다. 인기 모델을 나중에 다시 검토할 때 당시의 라이선스 부적합, 전처리 누락, 재현되지 않은 점수를 알 수 있어야 같은 조사를 반복하지 않는다. 모델 허브의 메타데이터가 바뀌어도 내부 승인 근거는 불변 보고서로 보존하고, 만료 시점에는 최신 카드와 보안 공지를 다시 대조한다.

**조직 도입 사례:** 고객 문의 분류 모델을 고른다면 한국어와 사내 용어 성능, 입력 길이, 라이선스, CPU 지연을 먼저 조건으로 둔다. 후보 리비전을 고정해 내부 보류 데이터로 재평가하고, 직렬화 형식과 원격 코드를 검사한다. 기준을 통과한 파일은 체크섬과 카드 사본, 평가 보고서와 함께 내부 레지스트리에 넣는다. 이후 서비스는 공개 허브 주소가 아니라 승인된 내부 식별자를 참조한다.

새 버전이 공개되면 자동 교체하지 않고 기존 실패 사례를 포함한 같은 시험을 재생한다. 품질 이득이 작지만 메모리나 라이선스 조건이 나빠졌다면 유지할 수 있다. 반대로 보안 공지나 데이터 문제로 기존 리비전을 철회해야 하면 영향받는 배포를 계보에서 찾아 이전 승인 버전이나 대체 모델로 전환한다.

허브에서 받은 데모 코드는 기능 확인용일 수 있으므로 운영 보안·예외 처리의 기준으로 그대로 사용하지 않는다. 네트워크 접근, 캐시 위치와 원격 코드 옵션을 조직 정책에 맞춰 다시 설정한다.

내부 카탈로그에는 사용 중인 서비스와 담당자를 역방향으로 연결한다. 취약점이나 라이선스 변경이 발견되면 어떤 모델이 존재하는지만 찾는 것이 아니라 어느 사용자 결과와 의사결정에 영향을 주었는지 추적할 수 있어야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

다운로드 전 라이선스·작성자·파일 무결성·원격 코드 실행 여부를 확인하고 버전을 고정한다.

공개 여부와 사용 권리, 신뢰성, 보안성을 서로 다른 기준으로 검토한다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

**신뢰·라이선스·공급망 위험**

공개 허브의 아티팩트는 게시자가 제공한 것이므로 파일 무결성과 게시자 신원을 확인하더라도 모델의 행동까지 안전하다고 단정할 수 없다. 악성 직렬화 형식, 의존 패키지 설치 스크립트, 임의 원격 코드는 모델을 불러오는 과정에서 실행될 수 있다. 가능하면 데이터 전용 형식을 사용하고, 바이러스·비밀 값·위험 코드 검사를 거치며, 네트워크와 파일 권한이 제한된 환경에서 로드한다. 삭제되거나 교체된 리비전에 대응하려면 승인한 파일의 해시와 원본 위치, 가져온 시점을 기록한다.

라이선스는 코드, 모델 가중치, 학습 데이터, 생성 결과에 서로 다른 조건을 적용할 수 있다. 허브의 단일 라이선스 태그만 보고 상업 이용이나 재배포 가능 여부를 결론 내리지 말고 원문과 파생 관계를 검토한다. 모델 카드에 공개되지 않은 학습 데이터는 개인정보·저작권·편향 위험을 평가하기 어렵게 만든다. 평가 점수도 데이터 오염, 다른 프롬프트, 비공개 후처리, 하드웨어 차이의 영향을 받는다. 따라서 허브는 후보 발견과 배포물 운반을 돕는 기반 시설이지, 모델 선택 책임이나 위험 평가를 대신하는 보증 기관이 아니다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [모델 라이선스](/wiki/model-license/): 모델 가중치와 출력의 사용·수정·재배포 조건을 정한 법적 약정이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 구체적 적용 예시

도입 후보의 모델 카드, 라이선스, 파일 해시, 의존성, 유지보수 주체를 한 목록에서 대조하면 공급망 차이를 볼 수 있다. ‘모델 허브’를 적용하는 경우에는 모델 허브는 체크포인트, 설정, 토크나이저, 모델 카드, 버전 기록을 배포하고 재사용하게 하는 저장소다.

기능 데모와 별개로 업데이트 정책, 취약점 대응, 데이터 반출, 교체 비용과 장기 호환성을 검토한다. 이때 [모델 라이선스](/wiki/model-license/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘모델 허브’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** [모델](/wiki/model/), [모델 라이선스](/wiki/model-license/)의 정의와 입력 조건을 먼저 확인한다.
3. **기준선 설정:** 모델 선택, 공급망 관리, 재현 가능한 배포와 협업에 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 다운로드 전 라이선스·작성자·파일 무결성·원격 코드 실행 여부를 확인하고 버전을 고정한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘모델 허브’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

**선정에서 승격까지**

먼저 업무, 입력 언어와 형식, 허용 지연·메모리·라이선스 조건을 필터로 정하고 후보 목록을 만든다. 각 후보의 기반 모델, 리비전, 파라미터 규모, 문맥 길이, 전처리 요구, 모델 카드의 제외 용도를 표로 비교한다. 그다음 동일한 평가 데이터, 프롬프트, 생성 설정으로 품질과 실패 유형을 측정하고 실제 배포 하드웨어에서 처리량과 메모리를 확인한다. 벤치마크 숫자는 평가 코드와 표본을 재현할 수 있을 때만 비교 근거로 사용한다. 공개 평가에 포함되었을 가능성이 있는 문제는 별도의 비공개 세트로 보완한다.

승격된 모델에는 허브 주소만 저장하지 않고 리비전 해시, 가져온 파일의 체크섬, 라이브러리와 실행 환경, 평가 보고서, 승인자와 만료일을 연결한다. 운영 배포는 이 승인 기록에 있는 아티팩트만 사용하도록 제한한다. 새 리비전은 자동으로 교체하지 않고 변경 파일과 카드 내용을 비교한 뒤 동일한 회귀 시험을 거친다. 게시가 필요한 경우 카드의 빈칸을 숨기지 말고 확인되지 않은 데이터와 한계를 명시한다. 철회 절차에는 문제가 된 리비전을 차단하고 이전 승인 버전으로 되돌리며, 영향을 받은 서비스와 결과물을 찾는 과정이 포함되어야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- [모델](/wiki/model/), [모델 라이선스](/wiki/model-license/)와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

- [모델](/wiki/model/)
- [모델 라이선스](/wiki/model-license/)

## 관련 문서

- [오픈소스 모델](/wiki/open-source-model/)
- [모델 라이선스](/wiki/model-license/)

## 이 문서를 가리키는 문서

- [가속기 인터커넥트](/wiki/accelerator-interconnect/)
- [가속기 메모리 계층](/wiki/accelerator-memory-hierarchy/)
- [AI 가속기](/wiki/ai-accelerator/)
- [AI 탄소 발자국](/wiki/ai-carbon-footprint/)
- [AI 칩 가용성](/wiki/ai-chip-availability/)
- [AI 데이터센터](/wiki/ai-datacenter/)
- [AI 에너지 소비](/wiki/ai-energy-consumption/)
- [AI 상호운용성 표준](/wiki/ai-interoperability-standard/)
- [AI 공급망](/wiki/ai-supply-chain/)
- [AI 물 발자국](/wiki/ai-water-footprint/)
- [아티팩트 레지스트리](/wiki/artifact-registry/)
- [저작자 표시 의무](/wiki/attribution-requirement/)
- [벤치마크 레지스트리](/wiki/benchmark-registry/)
- [클라우드 AI 서비스](/wiki/cloud-ai-service/)
- [상업적 이용 제한](/wiki/commercial-use-restriction/)
- [컴퓨트 클러스터](/wiki/compute-cluster/)
- [계산 비용](/wiki/compute-cost/)
- [컨테이너화 모델](/wiki/containerized-model/)
- [카피레프트 라이선스](/wiki/copyleft-license/)
- [CUDA](/wiki/cuda/)
- [데이터 버전 관리](/wiki/data-version-control/)
- [데이터셋 허브](/wiki/dataset-hub/)
- [데이터셋 라이브러리](/wiki/dataset-library/)
- [데이터셋 이용 조건](/wiki/dataset-terms-of-use/)
- [파생 모델](/wiki/derivative-model/)
- [엣지 AI](/wiki/edge-ai/)
- [엣지 모델 배포](/wiki/edge-model-deployment/)
- [실험 대시보드](/wiki/experiment-dashboard/)
- [실험 추적](/wiki/experiment-tracking/)
- [특성 저장소](/wiki/feature-store/)
- [그래픽 처리 장치](/wiki/graphics-processing-unit/)
- [IEEE AI 표준](/wiki/ieee-ai-standards/)
- [추론 경제성](/wiki/inference-economics/)
- [InfiniBand](/wiki/infiniband/)
- [대화형 모델 데모](/wiki/interactive-model-demo/)
- [대화형 노트북](/wiki/interactive-notebook/)
- [ISO/IEC JTC 1/SC 42](/wiki/iso-iec-jtc1-sc42/)
- [JAX](/wiki/jax/)
- [Keras](/wiki/keras/)
- [AI용 쿠버네티스](/wiki/kubernetes-for-ai/)
- [라이선스 호환성](/wiki/license-compatibility/)
- [Linux Foundation AI & Data](/wiki/linux-foundation-ai-data/)
- [LLMOps](/wiki/llmops/)
- [머신러닝 프레임워크](/wiki/machine-learning-framework/)
- [관리형 추론 플랫폼](/wiki/managed-inference-platform/)
- [ML 파이프라인 오케스트레이터](/wiki/ml-pipeline-orchestrator/)
- [MLCommons](/wiki/mlcommons/)
- [MLflow](/wiki/mlflow/)
- [MLOps](/wiki/mlops/)
- [모바일 모델 배포](/wiki/mobile-model-deployment/)
- [모델 아티팩트 형식](/wiki/model-artifact-format/)
- [모델 카탈로그](/wiki/model-catalog/)
- [모델 컬렉션](/wiki/model-collection/)
- [모델 범용재화화](/wiki/model-commoditization/)
- [모델 배포](/wiki/model-deployment/)
- [모델 탐색](/wiki/model-discovery/)
- [모델 평가 보고서](/wiki/model-evaluation-report/)
- [모델 라이선스](/wiki/model-license/)
- [모델 계보](/wiki/model-lineage/)
- [모델 메타데이터](/wiki/model-metadata/)
- [모델 모니터링 플랫폼](/wiki/model-monitoring-platform/)
- [모델 패키지](/wiki/model-package/)
- [모델 레지스트리](/wiki/model-registry/)
- [모델 출시](/wiki/model-release/)
- [모델 저장소](/wiki/model-repository/)
- [모델 폐기](/wiki/model-retirement/)
- [모델 롤백](/wiki/model-rollback/)
- [모델 검색](/wiki/model-search/)
- [모델 서빙 플랫폼](/wiki/model-serving-platform/)
- [모델 업데이트](/wiki/model-update/)
- [모델 버전](/wiki/model-version/)
- [모델 가중치 파일](/wiki/model-weights/)
- [신경망 처리 장치](/wiki/neural-processing-unit/)
- [NIST AI 프로그램](/wiki/nist-ai-program/)
- [NVLink](/wiki/nvlink/)
- [OECD AI 원칙](/wiki/oecd-ai-principles/)
- [온프레미스 AI](/wiki/on-premises-ai/)
- [개방형 신경망 교환 형식](/wiki/open-neural-network-exchange/)
- [오픈소스 AI 정의](/wiki/open-source-ai-definition/)
- [오픈소스 모델](/wiki/open-source-model/)
- [오픈 웨이트 모델](/wiki/open-weight-model/)
- [패키지 레지스트리](/wiki/package-registry/)
- [Partnership on AI](/wiki/partnership-on-ai/)
- [허용적 라이선스](/wiki/permissive-license/)
- [PyTorch](/wiki/pytorch/)
- [재현 가능한 모델 빌드](/wiki/reproducible-model-build/)
- [연구 전용 라이선스](/wiki/research-only-license/)
- [책임 있는 AI 라이선스](/wiki/responsible-ai-license/)
- [ROCm](/wiki/rocm/)
- [SafeTensors](/wiki/safetensors/)
- [소프트웨어·데이터·모델 라이선스 구분](/wiki/software-data-model-license/)
- [소스 공개 모델](/wiki/source-available-model/)
- [텐서 라이브러리](/wiki/tensor-library/)
- [텐서 처리 장치](/wiki/tensor-processing-unit/)
- [TensorFlow](/wiki/tensorflow/)
- [AI 총소유비용](/wiki/total-cost-of-ownership-for-ai/)
- [학습 비용](/wiki/training-cost/)
- [Transformers 라이브러리](/wiki/transformers-library/)
- [W3C 웹 머신러닝](/wiki/w3c-web-machine-learning/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [Hugging Face Hub documentation](https://huggingface.co/docs/hub/index) — documentation
<span id="reference-2"></span>2. [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) — paper
<span id="reference-3"></span>3. [Hugging Face — Wikipedia](https://en.wikipedia.org/wiki/Hugging_Face) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

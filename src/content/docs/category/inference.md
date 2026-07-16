---
title: "추론·서빙·최적화"
description: "학습된 모델이 출력을 생성하고 서비스되는 방식"
---

학습된 모델이 출력을 생성하고 서비스되는 방식 분야의 검토 완료 백과 문서입니다.

<nav class="wiki-letter-index" aria-label="문서 초성 색인"><a href="#index-ko-g">ㄱ</a><a href="#index-ko-gg">ㄲ</a><a href="#index-ko-d">ㄷ</a><a href="#index-ko-r">ㄹ</a><a href="#index-ko-m">ㅁ</a><a href="#index-ko-b">ㅂ</a><a href="#index-ko-s">ㅅ</a><a href="#index-ko-ng">ㅇ</a><a href="#index-ko-j">ㅈ</a><a href="#index-ko-ch">ㅊ</a><a href="#index-ko-k">ㅋ</a><a href="#index-ko-t">ㅌ</a><a href="#index-ko-p">ㅍ</a><a href="#index-ko-h">ㅎ</a><a href="#index-en-c">C</a><a href="#index-en-f">F</a><a href="#index-en-g">G</a><a href="#index-en-i">I</a><a href="#index-en-k">K</a><a href="#index-en-l">L</a><a href="#index-en-m">M</a><a href="#index-en-n">N</a><a href="#index-en-o">O</a><a href="#index-en-t">T</a><a href="#index-en-x">X</a></nav>

<div class="wiki-index-groups">
<section class="wiki-index-group" data-index-group="ko-g">
<h2 id="index-ko-g">ㄱ</h2>
<ul class="wiki-index-list">
<li data-article-id="accelerator-memory"><a href="/wiki/accelerator-memory/">가속기 메모리</a><span class="wiki-index-summary">가속기 메모리는 GPU·TPU·NPU가 모델 가중치, 활성값과 캐시를 저장하고 계산 장치에 공급하는 메모리 계층이다.</span></li>
<li data-article-id="weight-only-quantization"><a href="/wiki/weight-only-quantization/">가중치 전용 양자화</a><span class="wiki-index-summary">가중치 전용 양자화는 모델 가중치만 낮은 비트로 저장·계산하고 활성값은 상대적으로 높은 정밀도로 유지하는 방식이다.</span></li>
<li data-article-id="deterministic-inference"><a href="/wiki/deterministic-inference/">결정적 추론</a><span class="wiki-index-summary">결정적 추론은 같은 모델·입력·설정·실행 환경에서 반복할 때 같은 출력을 산출하도록 통제된 추론 방식이다.</span></li>
<li data-article-id="high-bandwidth-memory"><a href="/wiki/high-bandwidth-memory/">고대역폭 메모리</a><span class="wiki-index-summary">고대역폭 메모리는 넓은 인터페이스와 적층 구조로 가속기에 높은 데이터 전송률을 제공하는 메모리 기술이다.</span></li>
<li data-article-id="graph-compilation"><a href="/wiki/graph-compilation/">그래프 컴파일</a><span class="wiki-index-summary">그래프 컴파일은 모델의 연산과 데이터 의존성을 그래프로 표현해 대상 하드웨어용 실행 계획으로 변환하는 과정이다.</span></li>
<li data-article-id="greedy-decoding"><a href="/wiki/greedy-decoding/">그리디 디코딩</a><span class="wiki-index-summary">매 단계에서 확률이 가장 높은 토큰을 선택하는 결정적 생성 방식이다.</span></li>
<li data-article-id="length-penalty"><a href="/wiki/length-penalty/">길이 페널티</a><span class="wiki-index-summary">길이 페널티는 후보 시퀀스 점수를 길이에 따라 보정해 빔 탐색이 지나치게 짧거나 긴 출력을 선호하지 않게 하는 규칙이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-gg">
<h2 id="index-ko-gg">ㄲ</h2>
<ul class="wiki-index-list">
<li data-article-id="tail-latency"><a href="/wiki/tail-latency/">꼬리 지연 시간</a><span class="wiki-index-summary">꼬리 지연 시간은 요청 지연시간 분포의 높은 백분위에서 관찰되는 느린 응답 시간이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-d">
<h2 id="index-ko-d">ㄷ</h2>
<ul class="wiki-index-list">
<li data-article-id="diverse-beam-search"><a href="/wiki/diverse-beam-search/">다양성 빔 탐색</a><span class="wiki-index-summary">다양성 빔 탐색은 빔을 여러 그룹으로 나누고 앞선 그룹과 유사한 후보에 패널티를 주어 서로 다른 시퀀스를 찾는 방법이다.</span></li>
<li data-article-id="multi-model-serving"><a href="/wiki/multi-model-serving/">다중 모델 서빙</a><span class="wiki-index-summary">다중 모델 서빙은 하나의 서빙 플랫폼이나 자원 풀에서 여러 모델과 버전을 동시에 운영하는 방식이다.</span></li>
<li data-article-id="multinomial-sampling"><a href="/wiki/multinomial-sampling/">다항 표본추출</a><span class="wiki-index-summary">각 토큰의 확률을 범주형 분포로 보고 그 분포에서 다음 토큰 하나를 무작위로 추출하는 생성 방법이다.</span></li>
<li data-article-id="contrastive-search"><a href="/wiki/contrastive-search/">대조 탐색</a><span class="wiki-index-summary">대조 탐색은 높은 언어 모델 확률과 이전 은닉 표현에 대한 낮은 퇴화를 함께 고려해 다음 토큰을 선택하는 디코딩 방법이다.</span></li>
<li data-article-id="fallback-model"><a href="/wiki/fallback-model/">대체 모델</a><span class="wiki-index-summary">대체 모델은 기본 모델이 실패·과부하·정책 부적합일 때 요청을 처리하도록 준비한 다른 모델이나 규칙 기반 경로다.</span></li>
<li data-article-id="dynamic-batching"><a href="/wiki/dynamic-batching/">동적 배칭</a><span class="wiki-index-summary">동적 배칭은 도착 시간이 다른 추론 요청을 짧은 대기 창에서 묶어 실행 시점마다 배치 크기를 구성하는 서빙 방식이다.</span></li>
<li data-article-id="decode-phase"><a href="/wiki/decode-phase/">디코드 단계</a><span class="wiki-index-summary">디코드 단계는 이전 출력과 키·값 캐시를 사용해 다음 토큰을 한 단계씩 생성하는 자기회귀 추론 단계다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-r">
<h2 id="index-ko-r">ㄹ</h2>
<ul class="wiki-index-list">
<li data-article-id="logit"><a href="/wiki/logit/">로짓</a><span class="wiki-index-summary">확률로 정규화하기 전 모델이 각 클래스나 토큰 후보에 내놓는 실수 점수이며, 이항 문제에서는 로그 오즈로 해석된다.</span></li>
<li data-article-id="roofline-model"><a href="/wiki/roofline-model/">루프라인 모델</a><span class="wiki-index-summary">루프라인 모델은 하드웨어의 최대 계산 성능과 메모리 대역폭을 연산 강도에 따라 결합해 커널 성능 상한을 보여 주는 분석 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-m">
<h2 id="index-ko-m">ㅁ</h2>
<ul class="wiki-index-list">
<li data-article-id="multi-lora-serving"><a href="/wiki/multi-lora-serving/">멀티 LoRA 서빙</a><span class="wiki-index-summary">멀티 LoRA 서빙은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="memory-bandwidth"><a href="/wiki/memory-bandwidth/">메모리 대역폭</a><span class="wiki-index-summary">메모리 대역폭은 단위 시간에 메모리와 계산 장치 사이에서 전달할 수 있는 데이터 양이다.</span></li>
<li data-article-id="out-of-memory-error"><a href="/wiki/out-of-memory-error/">메모리 부족 오류</a><span class="wiki-index-summary">메모리 부족 오류는 모델 추론에 필요한 장치 또는 호스트 메모리 할당이 사용 가능한 용량을 넘어 실패한 상태다.</span></li>
<li data-article-id="memory-bound-workload"><a href="/wiki/memory-bound-workload/">메모리 집약 작업</a><span class="wiki-index-summary">메모리 집약 작업은 계산 장치보다 메모리에서 데이터를 읽고 쓰는 속도가 실행 시간을 제한하는 작업이다.</span></li>
<li data-article-id="model-availability"><a href="/wiki/model-availability/">모델 가용성</a><span class="wiki-index-summary">모델 가용성은 사용자가 요구한 시점에 모델 서비스가 유효한 응답을 제공할 수 있는 비율이다.</span></li>
<li data-article-id="model-gateway"><a href="/wiki/model-gateway/">모델 게이트웨이</a><span class="wiki-index-summary">모델 게이트웨이는 여러 모델 제공자와 내부 모델 앞에서 공통 인증, 라우팅, 정책과 관측 기능을 제공하는 진입 계층이다.</span></li>
<li data-article-id="model-loading-latency"><a href="/wiki/model-loading-latency/">모델 로딩 지연 시간</a><span class="wiki-index-summary">모델 로딩 지연 시간은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-replica"><a href="/wiki/model-replica/">모델 복제본</a><span class="wiki-index-summary">모델 복제본은 같은 모델 버전과 설정을 독립 프로세스나 장치에 적재한 추론 서비스 인스턴스다.</span></li>
<li data-article-id="model-serving"><a href="/wiki/model-serving/">모델 서빙</a><span class="wiki-index-summary">모델 서빙은 학습된 모델을 요청 가능한 서비스로 배치해 입력 전처리, 추론, 출력 후처리와 운영 관측을 제공하는 체계다.</span></li>
<li data-article-id="model-fleet-routing"><a href="/wiki/model-fleet-routing/">모델 플릿 라우팅</a><span class="wiki-index-summary">모델 플릿 라우팅은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-b">
<h2 id="index-ko-b">ㅂ</h2>
<ul class="wiki-index-list">
<li data-article-id="repetition-penalty"><a href="/wiki/repetition-penalty/">반복 페널티</a><span class="wiki-index-summary">반복 페널티는 이미 생성된 토큰의 다음 단계 점수를 조정해 동일 표현의 과도한 반복을 줄이는 디코딩 제어다.</span></li>
<li data-article-id="batch-inference"><a href="/wiki/batch-inference/">배치 추론</a><span class="wiki-index-summary">배치 추론은 대량의 저장된 입력을 묶어 일정이나 작업 단위로 처리하고 결과를 파일·테이블에 기록하는 방식이다.</span></li>
<li data-article-id="batching"><a href="/wiki/batching/">배칭</a><span class="wiki-index-summary">여러 추론 요청을 묶어 하드웨어 사용률과 처리량을 높이는 기법이다.</span></li>
<li data-article-id="backpressure"><a href="/wiki/backpressure/">백프레셔</a><span class="wiki-index-summary">역압은 하류 처리 속도가 입력 속도를 따라가지 못할 때 상류가 요청 생성이나 전달을 늦추도록 하는 흐름 제어다.</span></li>
<li data-article-id="frequency-penalty"><a href="/wiki/frequency-penalty/">빈도 페널티</a><span class="wiki-index-summary">빈도 페널티는 지금까지 등장한 횟수에 비례해 해당 토큰의 로짓을 낮추는 생성 제어 방식이다.</span></li>
<li data-article-id="beam-search"><a href="/wiki/beam-search/">빔 탐색</a><span class="wiki-index-summary">여러 후보 시퀀스를 동시에 유지하며 전체 점수가 높은 출력을 찾는 탐색 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-s">
<h2 id="index-ko-s">ㅅ</h2>
<ul class="wiki-index-list">
<li data-article-id="ahead-of-time-compilation"><a href="/wiki/ahead-of-time-compilation/">사전 컴파일</a><span class="wiki-index-summary">사전 컴파일은 모델 실행 전에 전체 또는 정해진 입력 범위의 코드를 미리 기계어·중간 표현으로 변환하는 방식이다.</span></li>
<li data-article-id="temperature"><a href="/wiki/temperature/">생성 온도</a><span class="wiki-index-summary">생성 시 로짓을 나누어 토큰 확률분포의 집중도를 조절하고 출력의 반복성과 다양성 사이의 균형을 바꾸는 디코딩 매개변수다.</span></li>
<li data-article-id="serverless-inference"><a href="/wiki/serverless-inference/">서버리스 추론</a><span class="wiki-index-summary">서버리스 추론은 사용자가 서버를 상시 관리하지 않고 요청이나 작업량에 따라 자동 할당되는 실행 환경에서 모델을 제공하는 방식이다.</span></li>
<li data-article-id="service-level-objective"><a href="/wiki/service-level-objective/">서비스 수준 목표</a><span class="wiki-index-summary">서비스 수준 목표는 지연시간, 가용성이나 오류율 같은 서비스 지표가 일정 기간 충족해야 할 수치 목표다.</span></li>
<li data-article-id="circuit-breaker"><a href="/wiki/circuit-breaker/">서킷 브레이커</a><span class="wiki-index-summary">회로 차단기는 하류 서비스의 반복 실패가 일정 기준을 넘으면 새 호출을 빠르게 차단해 연쇄 장애를 막는 패턴이다.</span></li>
<li data-article-id="softmax"><a href="/wiki/softmax/">소프트맥스</a><span class="wiki-index-summary">여러 실수 점수를 지수화하고 합으로 나눠 합이 1인 비율 벡터로 바꾸는 함수다.</span></li>
<li data-article-id="admission-control"><a href="/wiki/admission-control/">수락 제어</a><span class="wiki-index-summary">수락 제어는 시스템 용량과 서비스 목표를 지키기 위해 새 요청의 실행 허용 여부를 결정하는 메커니즘이다.</span></li>
<li data-article-id="numerical-reproducibility"><a href="/wiki/numerical-reproducibility/">수치 재현성</a><span class="wiki-index-summary">수치 재현성은 서로 다른 실행이나 환경에서 계산 결과가 정의한 수치 허용 오차 안에 다시 나타나는 성질이다.</span></li>
<li data-article-id="streaming-generation"><a href="/wiki/streaming-generation/">스트리밍 생성</a><span class="wiki-index-summary">스트리밍 생성은 모델이 전체 응답을 완성하기 전에 생성된 토큰이나 조각을 순차적으로 클라이언트에 전달하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ng">
<h2 id="index-ko-ng">ㅇ</h2>
<ul class="wiki-index-list">
<li data-article-id="adapter-serving"><a href="/wiki/adapter-serving/">어댑터 서빙</a><span class="wiki-index-summary">어댑터 서빙은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="edge-inference"><a href="/wiki/edge-inference/">엣지 추론</a><span class="wiki-index-summary">엣지 추론은 센서·모바일·현장 장치처럼 데이터 생성 지점 가까이에서 모델 예측을 수행하는 방식이다.</span></li>
<li data-article-id="compute-bound-workload"><a href="/wiki/compute-bound-workload/">연산 집약 작업</a><span class="wiki-index-summary">연산 집약 작업은 실행 시간이 메모리 전송보다 계산 처리량에 주로 제한되는 작업이다.</span></li>
<li data-article-id="operator-fusion"><a href="/wiki/operator-fusion/">연산자 융합</a><span class="wiki-index-summary">연산자 융합은 연속된 여러 고수준 연산을 하나의 실행 단위로 결합해 중간 메모리 이동과 실행 오버헤드를 줄이는 최적화다.</span></li>
<li data-article-id="continuous-batching"><a href="/wiki/continuous-batching/">연속 배칭</a><span class="wiki-index-summary">연속 배칭은 실행 중인 추론 배치에 완료된 요청을 제거하고 새 요청을 단계별로 투입해 장치 활용률을 높이는 스케줄링 방식이다.</span></li>
<li data-article-id="continuous-batching-fairness"><a href="/wiki/continuous-batching-fairness/">연속 배칭 공정성</a><span class="wiki-index-summary">연속 배칭 공정성은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="continuous-batching-policy"><a href="/wiki/continuous-batching-policy/">연속 배칭 정책</a><span class="wiki-index-summary">연속 배칭 정책은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="online-inference"><a href="/wiki/online-inference/">온라인 추론</a><span class="wiki-index-summary">온라인 추론은 사용자나 시스템의 개별 요청에 대해 짧은 지연 시간 안에 즉시 예측을 반환하는 처리 방식이다.</span></li>
<li data-article-id="request-queue"><a href="/wiki/request-queue/">요청 대기열</a><span class="wiki-index-summary">요청 대기열은 즉시 실행할 자원이 없는 추론 요청을 도착 순서와 우선순위 정보와 함께 보관하는 구조다.</span></li>
<li data-article-id="request-preemption"><a href="/wiki/request-preemption/">요청 선점</a><span class="wiki-index-summary">요청 선점은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="request-scheduler"><a href="/wiki/request-scheduler/">요청 스케줄러</a><span class="wiki-index-summary">요청 스케줄러는 동시 추론 요청의 우선순위, 배치 구성과 실행 순서를 결정하는 구성 요소다.</span></li>
<li data-article-id="warm-start"><a href="/wiki/warm-start/">웜 스타트</a><span class="wiki-index-summary">웜 스타트는 이미 로드되었거나 이전 상태를 재사용할 수 있는 인스턴스에서 요청이나 학습을 시작해 초기화 비용을 줄이는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-j">
<h2 id="index-ko-j">ㅈ</h2>
<ul class="wiki-index-list">
<li data-article-id="typical-sampling"><a href="/wiki/typical-sampling/">전형성 샘플링</a><span class="wiki-index-summary">현재 분포의 엔트로피에 가까운 정보량을 가진 토큰을 우선 남겨 전형적인 확률 영역에서 표본을 추출하는 디코딩 방법이다.</span></li>
<li data-article-id="graceful-degradation"><a href="/wiki/graceful-degradation/">점진적 성능 저하</a><span class="wiki-index-summary">점진적 성능 저하는 과부하나 일부 구성 요소 장애에서도 핵심 기능을 유지하도록 품질·기능·속도를 통제된 방식으로 낮추는 운영 전략이다.</span></li>
<li data-article-id="static-batching"><a href="/wiki/static-batching/">정적 배칭</a><span class="wiki-index-summary">정적 배칭은 미리 정한 개수나 고정된 입력 묶음을 하나의 텐서로 구성해 함께 추론하는 방식이다.</span></li>
<li data-article-id="constrained-decoding"><a href="/wiki/constrained-decoding/">제약 디코딩</a><span class="wiki-index-summary">제약 디코딩은 문법, 스키마, 어휘 집합이나 필수 구문을 만족하는 토큰만 다음 후보로 허용하는 생성 방법이다.</span></li>
<li data-article-id="presence-penalty"><a href="/wiki/presence-penalty/">존재 페널티</a><span class="wiki-index-summary">존재 페널티는 토큰이 한 번이라도 등장했는지를 기준으로 고정된 패널티를 적용하는 생성 제어 방식이다.</span></li>
<li data-article-id="stop-sequence"><a href="/wiki/stop-sequence/">중지 시퀀스</a><span class="wiki-index-summary">중지 시퀀스는 생성 결과에서 지정한 토큰 또는 문자열 패턴이 나타나면 디코딩을 종료하도록 하는 조건이다.</span></li>
<li data-article-id="latency"><a href="/wiki/latency/">지연 시간</a><span class="wiki-index-summary">요청을 보낸 뒤 첫 토큰 또는 전체 응답을 받을 때까지 걸리는 시간이다.</span></li>
<li data-article-id="latency-throughput-tradeoff"><a href="/wiki/latency-throughput-tradeoff/">지연 시간-처리량 절충</a><span class="wiki-index-summary">지연 시간-처리량 절충은 요청 하나의 응답 시간을 줄이는 목표와 단위 시간당 처리량을 높이는 목표가 배치·큐잉에서 충돌하는 관계다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ch">
<h2 id="index-ko-ch">ㅊ</h2>
<ul class="wiki-index-list">
<li data-article-id="throughput"><a href="/wiki/throughput/">처리량</a><span class="wiki-index-summary">단위 시간에 시스템이 처리하거나 생성할 수 있는 요청 또는 토큰 수다.</span></li>
<li data-article-id="time-to-first-token"><a href="/wiki/time-to-first-token/">첫 토큰 시간</a><span class="wiki-index-summary">첫 토큰 시간은 요청이 서버에 도착한 시점부터 첫 생성 토큰이 사용자에게 전달될 때까지의 지연 시간이다.</span></li>
<li data-article-id="chunked-prefill"><a href="/wiki/chunked-prefill/">청크 프리필</a><span class="wiki-index-summary">청크 프리필은 긴 입력 프롬프트의 사전 계산을 여러 토큰 구간으로 나누어 디코딩 요청과 번갈아 실행하는 스케줄링 기법이다.</span></li>
<li data-article-id="draft-model"><a href="/wiki/draft-model/">초안 모델</a><span class="wiki-index-summary">초안 모델은 추측 디코딩에서 목표 모델보다 빠르게 다음 토큰 후보 묶음을 제안하는 보조 모델이다.</span></li>
<li data-article-id="inference"><a href="/wiki/inference/">추론</a><span class="wiki-index-summary">학습된 모델이 새 입력을 받아 예측이나 생성을 수행하는 과정이다.</span></li>
<li data-article-id="inference-overload-control"><a href="/wiki/inference-overload-control/">추론 과부하 제어</a><span class="wiki-index-summary">추론 과부하 제어는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-graph-optimization"><a href="/wiki/inference-graph-optimization/">추론 그래프 최적화</a><span class="wiki-index-summary">추론 그래프 최적화는 학습이 끝난 모델 그래프를 같은 출력 의미를 유지하면서 더 빠르고 작게 실행되도록 변환하는 과정이다.</span></li>
<li data-article-id="inference-tail-latency-debugging"><a href="/wiki/inference-tail-latency-debugging/">추론 꼬리 지연 디버깅</a><span class="wiki-index-summary">추론 꼬리 지연 디버깅은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-monitoring"><a href="/wiki/inference-monitoring/">추론 모니터링</a><span class="wiki-index-summary">추론 모니터링은 운영 중 모델 요청의 품질·지연·오류·자원·안전 신호를 지속 수집하고 이상을 탐지하는 활동이다.</span></li>
<li data-article-id="inference-load-balancing"><a href="/wiki/inference-load-balancing/">추론 부하 분산</a><span class="wiki-index-summary">추론 부하 분산은 여러 모델 복제본에 요청을 나눠 처리량과 가용성을 유지하는 방법이다.</span></li>
<li data-article-id="inference-server"><a href="/wiki/inference-server/">추론 서버</a><span class="wiki-index-summary">추론 서버는 학습된 모델을 메모리에 적재하고 네트워크 요청을 받아 예측 결과를 반환하는 실행 서비스다.</span></li>
<li data-article-id="inference-timeout"><a href="/wiki/inference-timeout/">추론 시간 초과</a><span class="wiki-index-summary">추론 시간 초과는 모델 요청이 정해진 기한 안에 완료되지 않으면 기다림을 중단하고 실패로 처리하는 제어다.</span></li>
<li data-article-id="inference-energy-efficiency"><a href="/wiki/inference-energy-efficiency/">추론 에너지 효율</a><span class="wiki-index-summary">추론 에너지 효율은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-endpoint"><a href="/wiki/inference-endpoint/">추론 엔드포인트</a><span class="wiki-index-summary">추론 엔드포인트는 특정 모델 또는 모델 집합에 예측 요청을 보낼 수 있도록 공개된 네트워크 주소와 계약이다.</span></li>
<li data-article-id="inference-backpressure"><a href="/wiki/inference-backpressure/">추론 역압</a><span class="wiki-index-summary">추론 역압은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-capacity-planning"><a href="/wiki/inference-capacity-planning/">추론 용량 계획</a><span class="wiki-index-summary">추론 용량 계획은 예상 트래픽과 서비스 목표를 만족하도록 모델 복제본, 가속기, 메모리와 큐 용량을 산정하는 과정이다.</span></li>
<li data-article-id="inference-capacity-headroom"><a href="/wiki/inference-capacity-headroom/">추론 용량 여유분</a><span class="wiki-index-summary">추론 용량 여유분은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-workload-shaping"><a href="/wiki/inference-workload-shaping/">추론 워크로드 형상화</a><span class="wiki-index-summary">추론 워크로드 형상화는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-warm-pool"><a href="/wiki/inference-warm-pool/">추론 웜 풀</a><span class="wiki-index-summary">추론 웜 풀은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-autoscaling"><a href="/wiki/inference-autoscaling/">추론 자동 확장</a><span class="wiki-index-summary">추론 자동 확장은 요청량과 자원 지표에 따라 모델 복제본 수를 자동으로 늘리거나 줄이는 운영 방식이다.</span></li>
<li data-article-id="inference-retry"><a href="/wiki/inference-retry/">추론 재시도</a><span class="wiki-index-summary">추론 재시도는 일시적 오류나 제한 응답 뒤 같은 논리 요청을 다시 수행하는 복구 전략이다.</span></li>
<li data-article-id="inference-queue-discipline"><a href="/wiki/inference-queue-discipline/">추론 큐 규칙</a><span class="wiki-index-summary">추론 큐 규칙은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-carbon-accounting"><a href="/wiki/inference-carbon-accounting/">추론 탄소 회계</a><span class="wiki-index-summary">추론 탄소 회계는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="inference-slo-error-budget"><a href="/wiki/inference-slo-error-budget/">추론 SLO 오류 예산</a><span class="wiki-index-summary">추론 SLO 오류 예산은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="speculative-decoding"><a href="/wiki/speculative-decoding/">추측 디코딩</a><span class="wiki-index-summary">추측 디코딩은 작은 초안 모델이 여러 토큰 후보를 먼저 만들고 큰 목표 모델이 한 번에 검증해 자동회귀 생성 속도를 높이는 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-k">
<h2 id="index-ko-k">ㅋ</h2>
<ul class="wiki-index-list">
<li data-article-id="cache-offloading"><a href="/wiki/cache-offloading/">캐시 오프로딩</a><span class="wiki-index-summary">캐시 오프로딩은 장치 메모리의 KV나 모델 상태 일부를 호스트 메모리 또는 저장장치로 옮겨 가속기 용량을 확보하는 방식이다.</span></li>
<li data-article-id="cache-hit-rate"><a href="/wiki/cache-hit-rate/">캐시 적중률</a><span class="wiki-index-summary">캐시 적중률은 전체 조회 중 요청한 데이터가 캐시에 있어 원본 계산이나 저장소 접근을 피한 비율이다.</span></li>
<li data-article-id="cache-eviction"><a href="/wiki/cache-eviction/">캐시 축출</a><span class="wiki-index-summary">캐시 축출은 제한된 KV 또는 접두사 캐시에서 보존 가치가 낮은 항목을 제거해 새 요청 공간을 확보하는 정책이다.</span></li>
<li data-article-id="kernel-fusion"><a href="/wiki/kernel-fusion/">커널 융합</a><span class="wiki-index-summary">커널 융합은 장치에서 따로 실행될 여러 계산 커널을 단일 커널로 합쳐 전역 메모리 왕복과 실행 시작 비용을 줄이는 기법이다.</span></li>
<li data-article-id="cold-start"><a href="/wiki/cold-start/">콜드 스타트</a><span class="wiki-index-summary">콜드 스타트는 모델 인스턴스가 없는 상태에서 런타임·가중치·캐시를 준비해 첫 요청을 처리할 때 생기는 초기화 지연이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-t">
<h2 id="index-ko-t">ㅌ</h2>
<ul class="wiki-index-list">
<li data-article-id="inter-token-latency"><a href="/wiki/inter-token-latency/">토큰 간 지연 시간</a><span class="wiki-index-summary">토큰 간 지연 시간은 스트리밍 응답에서 연속한 출력 토큰 사이에 걸리는 시간이다.</span></li>
<li data-article-id="token-cost"><a href="/wiki/token-cost/">토큰 비용</a><span class="wiki-index-summary">토큰 비용은 언어 모델이 처리하거나 생성한 토큰 수에 모델별 단가를 적용한 요청 비용이다.</span></li>
<li data-article-id="token-sampling"><a href="/wiki/token-sampling/">토큰 샘플링</a><span class="wiki-index-summary">토큰 샘플링은 다음 토큰 확률분포에서 난수로 토큰을 뽑아 생성 시퀀스를 이어가는 디코딩 방식이다.</span></li>
<li data-article-id="token-scheduler"><a href="/wiki/token-scheduler/">토큰 스케줄러</a><span class="wiki-index-summary">토큰 스케줄러는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="token-budget-admission-control"><a href="/wiki/token-budget-admission-control/">토큰 예산 수용 제어</a><span class="wiki-index-summary">토큰 예산 수용 제어는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-p">
<h2 id="index-ko-p">ㅍ</h2>
<ul class="wiki-index-list">
<li data-article-id="paged-kv-cache"><a href="/wiki/paged-kv-cache/">페이지드 KV 캐시</a><span class="wiki-index-summary">페이지드 KV 캐시는 시퀀스의 어텐션 키·값을 고정 크기 블록으로 나누어 비연속 장치 메모리에 배치하는 관리 방식이다.</span></li>
<li data-article-id="prompt-lookup-decoding"><a href="/wiki/prompt-lookup-decoding/">프롬프트 조회 디코딩</a><span class="wiki-index-summary">프롬프트 조회 디코딩은 입력 문맥에 이미 나타난 토큰 연속열을 초안 후보로 찾아 여러 토큰을 한 번에 검증하는 추론 가속 방식이다.</span></li>
<li data-article-id="prefix-caching"><a href="/wiki/prefix-caching/">프리픽스 캐싱</a><span class="wiki-index-summary">프리픽스 캐싱은 여러 요청이 공유하는 프롬프트 접두사의 KV 상태를 저장해 같은 구간의 프리필 계산을 재사용하는 기법이다.</span></li>
<li data-article-id="prefill-phase"><a href="/wiki/prefill-phase/">프리필 단계</a><span class="wiki-index-summary">프리필 단계는 입력 토큰 전체를 병렬 처리해 첫 출력 예측과 이후 디코딩에 사용할 키·값 캐시를 만드는 추론 단계다.</span></li>
<li data-article-id="prefill-decode-disaggregation"><a href="/wiki/prefill-decode-disaggregation/">프리필·디코드 분리</a><span class="wiki-index-summary">프리필·디코드 분리는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-h">
<h2 id="index-ko-h">ㅎ</h2>
<ul class="wiki-index-list">
<li data-article-id="post-training-quantization"><a href="/wiki/post-training-quantization/">학습 후 양자화</a><span class="wiki-index-summary">학습 후 양자화는 추가 전체 학습 없이 이미 학습된 모델의 가중치나 활성값을 낮은 비트 표현으로 변환하는 기법이다.</span></li>
<li data-article-id="activation-quantization"><a href="/wiki/activation-quantization/">활성값 양자화</a><span class="wiki-index-summary">활성값 양자화는 계층 사이에서 생성되는 중간 텐서를 낮은 정밀도 범위로 표현하는 기법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-c">
<h2 id="index-en-c">C</h2>
<ul class="wiki-index-list">
<li data-article-id="cpu-inference"><a href="/wiki/cpu-inference/">CPU 추론</a><span class="wiki-index-summary">CPU 추론은 범용 중앙처리장치의 벡터 명령과 다중 코어에서 모델 순전파를 실행하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-f">
<h2 id="index-en-f">F</h2>
<ul class="wiki-index-list">
<li data-article-id="fp8-inference"><a href="/wiki/fp8-inference/">FP8 추론</a><span class="wiki-index-summary">FP8 추론은 지수와 가수 비트가 적은 8비트 부동소수 형식을 사용해 가속기 처리량과 메모리 효율을 높이는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-g">
<h2 id="index-en-g">G</h2>
<ul class="wiki-index-list">
<li data-article-id="gguf-format"><a href="/wiki/gguf-format/">GGUF 형식</a><span class="wiki-index-summary">GGUF는 llama.cpp 계열 런타임에서 모델 텐서와 토크나이저·설정 메타데이터를 함께 저장하는 단일 파일 형식이다.</span></li>
<li data-article-id="gpu-inference"><a href="/wiki/gpu-inference/">GPU 추론</a><span class="wiki-index-summary">GPU 추론은 다수의 병렬 연산 장치를 가진 GPU에서 모델의 순전파와 생성 연산을 실행하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-i">
<h2 id="index-en-i">I</h2>
<ul class="wiki-index-list">
<li data-article-id="int4-inference"><a href="/wiki/int4-inference/">INT4 추론</a><span class="wiki-index-summary">INT4 추론은 주로 가중치를 4비트 정수로 압축해 메모리 사용량과 대역폭을 크게 줄이는 모델 실행 방식이다.</span></li>
<li data-article-id="int8-inference"><a href="/wiki/int8-inference/">INT8 추론</a><span class="wiki-index-summary">INT8 추론은 모델의 일부 또는 대부분의 행렬 연산을 8비트 정수 표현과 누산기로 수행하는 실행 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-k">
<h2 id="index-en-k">K</h2>
<ul class="wiki-index-list">
<li data-article-id="kv-cache"><a href="/wiki/kv-cache/">KV 캐시</a><span class="wiki-index-summary">이전 토큰의 어텐션 키와 값을 저장해 자동회귀 생성의 중복 계산을 줄이는 캐시다.</span></li>
<li data-article-id="kv-cache-isolation"><a href="/wiki/kv-cache-isolation/">KV 캐시 격리</a><span class="wiki-index-summary">KV 캐시 격리는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="kv-cache-admission"><a href="/wiki/kv-cache-admission/">KV 캐시 수용 제어</a><span class="wiki-index-summary">KV 캐시 수용 제어는 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="kv-cache-quantization"><a href="/wiki/kv-cache-quantization/">KV 캐시 양자화</a><span class="wiki-index-summary">KV 캐시 양자화는 어텐션 키와 값을 더 낮은 비트 표현으로 저장해 생성 중 메모리 사용량을 줄이는 기법이다.</span></li>
<li data-article-id="kv-cache-capacity-planning"><a href="/wiki/kv-cache-capacity-planning/">KV 캐시 용량 계획</a><span class="wiki-index-summary">KV 캐시 용량 계획은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-l">
<h2 id="index-en-l">L</h2>
<ul class="wiki-index-list">
<li data-article-id="llm-cost-attribution"><a href="/wiki/llm-cost-attribution/">LLM 비용 귀속</a><span class="wiki-index-summary">LLM 비용 귀속은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-serving-slo"><a href="/wiki/llm-serving-slo/">LLM 서빙 SLO</a><span class="wiki-index-summary">LLM 서빙 SLO은 모델 로딩·스케줄링·KV 캐시·토큰 생성을 다루는 추론 서빙 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-m">
<h2 id="index-en-m">M</h2>
<ul class="wiki-index-list">
<li data-article-id="min-p-sampling"><a href="/wiki/min-p-sampling/">Min-p 샘플링</a><span class="wiki-index-summary">최고 확률 토큰의 확률에 비례한 최소 임계값보다 낮은 토큰을 제거한 뒤 남은 분포에서 추출하는 디코딩 방법이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-n">
<h2 id="index-en-n">N</h2>
<ul class="wiki-index-list">
<li data-article-id="npu-inference"><a href="/wiki/npu-inference/">NPU 추론</a><span class="wiki-index-summary">NPU 추론은 신경망 연산에 특화된 프로세서에서 모델의 순전파를 실행하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-o">
<h2 id="index-en-o">O</h2>
<ul class="wiki-index-list">
<li data-article-id="onnx-runtime"><a href="/wiki/onnx-runtime/">ONNX Runtime</a><span class="wiki-index-summary">ONNX Runtime은 ONNX 계산 그래프를 여러 하드웨어 실행 공급자에서 최적화하고 실행하는 추론 엔진이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-t">
<h2 id="index-en-t">T</h2>
<ul class="wiki-index-list">
<li data-article-id="tensorrt-llm"><a href="/wiki/tensorrt-llm/">TensorRT-LLM</a><span class="wiki-index-summary">TensorRT-LLM은 NVIDIA GPU에서 대규모 언어 모델 추론을 최적화하기 위한 오픈소스 라이브러리와 런타임이다.</span></li>
<li data-article-id="top-k-sampling"><a href="/wiki/top-k-sampling/">Top-k 샘플링</a><span class="wiki-index-summary">확률이 높은 상위 k개 후보만 남겨 다음 토큰을 선택하는 방법이다.</span></li>
<li data-article-id="top-p-sampling"><a href="/wiki/top-p-sampling/">Top-p 샘플링</a><span class="wiki-index-summary">누적 확률이 p에 도달하는 최소 후보 집합에서 다음 토큰을 선택하는 방법이다.</span></li>
<li data-article-id="tpu-inference"><a href="/wiki/tpu-inference/">TPU 추론</a><span class="wiki-index-summary">TPU 추론은 텐서 연산에 특화된 Google의 TPU 가속기에서 학습된 모델을 실행하는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-x">
<h2 id="index-en-x">X</h2>
<ul class="wiki-index-list">
<li data-article-id="xla-compiler"><a href="/wiki/xla-compiler/">XLA 컴파일러</a><span class="wiki-index-summary">XLA 컴파일러는 선형대수 중심 계산을 중간 표현으로 받아 CPU, GPU와 가속기용 코드로 최적화하는 도메인 특화 컴파일러다.</span></li>
</ul>
</section>
</div>

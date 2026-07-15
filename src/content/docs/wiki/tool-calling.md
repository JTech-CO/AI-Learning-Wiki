---
title: "도구 호출 Tool Calling"
description: "모델이 정해진 함수 스키마를 선택하고 인수를 생성해 외부 기능 실행을 요청하는 방식이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 }
---

<p class="wiki-lead">모델이 정해진 함수 스키마를 선택하고 인수를 생성해 외부 기능 실행을 요청하는 방식이다.</p>

<div class="wiki-document-meta">분류: [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개념과 원리

### 개요와 핵심 정의

모델이 정해진 함수 스키마를 선택하고 인수를 생성해 외부 기능 실행을 요청하는 방식이다.

‘도구 호출’ 개념은 API·SDK·도구 호출 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. API 분야는 모델과 데이터, 도구를 소프트웨어 계약으로 안전하게 연결하는 방법을 다룬다.

#### 개념 모델 확장

모델이 정해진 함수 스키마를 선택하고 인수를 생성해 외부 기능 실행을 요청하는 방식이다. 이 정의를 암기하는 데서 멈추지 않고 도구 호출이 전제하는 입력, 내부 표현, 변환 규칙과 관찰 가능한 출력을 각각 적는다. 상위 개념과 하위 구현을 분리하고, 정의가 성립하는 정상 사례와 성립하지 않는 반례를 한 쌍으로 구성한다. 용어가 여러 분야에서 쓰이면 공통 의미와 분야별 의미를 표로 나눠 같은 단어를 다른 계산 절차에 잘못 적용하지 않게 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 배경과 설명 범위

영문 Wikipedia의 ‘Function model’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-2">[2]</a></div>

### 작동 원리

도구 호출은 모델이 자연어 답 대신 함수 이름과 구조화 인자를 제안하고 애플리케이션이 검증 후 실제 함수를 실행하는 패턴이다.

[스트리밍 응답](/wiki/streaming-response/) 및 [구조화 출력](/wiki/structured-output/) 개념을 먼저 이해하면 계산 위치와 역할을 구분하기 쉽다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

#### 심층 검토 — 도구 호출

도구 호출을 API 관점에서 검토할 때는 메시지 의미와 전송 방식, 애플리케이션 계약을 구분한다. 요청과 응답의 필드 이름만 맞아도 상태 코드, 헤더, 본문 인코딩과 재시도 규칙이 다르면 상호 운용성이 깨질 수 있다. 정상 사례와 함께 누락값, 중복 요청, 시간 초과, 부분 실패와 버전 불일치 사례를 계약 시험으로 고정한다. 이 설명을 기존 정의와 연결해 입력, 처리, 출력, 평가와 실패 조건을 다시 확인한다. 출처마다 표제어의 범위가 다를 수 있으므로 공통된 정의와 구현별 차이를 구분하고, 수치·버전·정책처럼 변할 수 있는 내용은 기준 날짜와 원문 위치를 남긴다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구성 요소와 처리 흐름

실제 시스템에서는 ‘도구 호출’ 개념만 독립적으로 동작하지 않는다. [구조화 출력](/wiki/structured-output/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

#### 구현·측정 설계

도구 호출의 구현을 비교할 때는 입력 스키마와 자료형, 중간 산출물, 기본값, 오류 처리, 버전과 실행 환경을 고정한다. 결과 품질은 하나의 평균값으로 끝내지 않고 하위 집단과 경계 사례, 지연시간, 메모리와 비용을 함께 기록한다. 작은 기준 사례를 손으로 계산하거나 독립 구현과 대조해 인터페이스가 맞지만 의미가 다른 오류를 찾는다. 구성 변경 전후에는 같은 데이터와 평가 코드를 사용하고 차이가 생긴 최초 단계를 추적한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용과 검증

### 활용 분야와 선택 기준

웹 서비스, 자동화, 구조화 출력, 이벤트 연동과 클라이언트 라이브러리 구현에 사용한다. ‘도구 호출’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 한계와 흔한 오해

모델 제안은 신뢰할 수 없는 입력으로 취급해 권한·스키마·범위·사용자 승인을 검사한다.

인증·버전·오류·호출 제한·비밀 관리가 빠진 예제 코드를 운영 환경에 그대로 쓰지 않는다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

#### 반례·경계 사례

도구 호출이 잘 작동하는 조건만 나열하면 실제 적용 범위를 판단할 수 없다. 데이터가 부족하거나 분포가 달라지는 경우, 값의 단위와 차원이 맞지 않는 경우, 권한·네트워크·자원이 제한되는 경우와 의도적으로 조작된 입력을 별도 시험한다. 실패가 탐지되지 않은 채 정상 출력처럼 보이는 경우를 우선 찾아 경고 지표와 중단선을 정한다. 알려진 한계를 우회하는 임시 조치와 근본적인 개선을 구분하고 잔여 위험의 책임자를 명시한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 관련 개념과의 구분

- [구조화 출력](/wiki/structured-output/): 모델 출력을 미리 정의한 JSON 스키마나 데이터 구조에 맞추는 기능이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

### 구체적 적용 예시

최소 요청 예제에는 인증 방식, 필수 필드, 정상 응답, 오류 응답과 시간 초과 처리를 함께 담아야 계약의 경계가 보인다. ‘도구 호출’을 적용하는 경우에는 도구 호출은 모델이 자연어 답 대신 함수 이름과 구조화 인자를 제안하고 애플리케이션이 검증 후 실제 함수를 실행하는 패턴이다.

테스트 환경에서 호출 제한과 부분 장애를 재현하고, 중복 요청이 부작용을 만들지 않도록 멱등성과 재시도 정책을 확인한다. 이때 [구조화 출력](/wiki/structured-output/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 실무 적용과 검증 절차

1. **목적 정의:** ‘도구 호출’이 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** [스트리밍 응답](/wiki/streaming-response/), [구조화 출력](/wiki/structured-output/)의 정의와 입력 조건을 먼저 확인한다.
3. **기준선 설정:** 웹 서비스, 자동화, 구조화 출력, 이벤트 연동과 클라이언트 라이브러리 구현에 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 모델 제안은 신뢰할 수 없는 입력으로 취급해 권한·스키마·범위·사용자 승인을 검사한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘도구 호출’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

#### 출처·재현 점검

- 도구 호출의 정의를 외부 백과와 대조하되 핵심 작동 주장은 논문·표준·공식 문서에서 확인한다.
- 데이터, 모델, 코드와 도구 버전을 고정하고 정상·경계·실패 사례를 같은 조건에서 반복한다.
- 알려진 한계와 잔여 위험, 사람이 검토해야 하는 조건, 다음 검토 날짜를 기록한다.

#### 검증 기록 설계

1. 도구 호출을 선택한 이유와 제외한 대안을 같은 평가 기준으로 적는다.
2. 데이터 기준 시점, 표본 구성, 전처리와 접근 권한을 고정한다.
3. 정상·경계·실패 사례의 입력과 기대 결과를 배포 전에 승인한다.
4. 품질, 안전, 지연시간과 비용에 경고선과 중단선을 따로 둔다.
5. 모델·코드·도구가 바뀐 뒤 동일 평가를 반복하고 최초 차이 지점을 찾는다.
6. 자동화가 확신하지 못하거나 영향이 큰 경우 사람이 판단할 수 있도록 입력, 근거와 가능한 대안을 함께 제공한다.

최종 기록에는 출처의 기준 날짜와 위치, 실행 환경, 결과 해석, 알려진 한계, 롤백 대상과 다음 검토 날짜를 포함한다. 개선 폭이 운영 복잡성과 잔여 위험을 상쇄하지 못하면 단순한 기준선으로 되돌아간다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

### 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- [스트리밍 응답](/wiki/streaming-response/), [구조화 출력](/wiki/structured-output/)와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 문서 관계

### 선행 개념

- [스트리밍 응답](/wiki/streaming-response/)
- [구조화 출력](/wiki/structured-output/)

### 관련 문서

- [구조화 출력](/wiki/structured-output/)

### 이 문서를 가리키는 문서

- [간접 프롬프트 인젝션](/wiki/indirect-prompt-injection/)
- [감독 에이전트](/wiki/supervisor-agent/)
- [감지-사고-행동 순환](/wiki/sense-think-act-cycle/)
- [검증 에이전트](/wiki/verifier-agent/)
- [계층적 과제 네트워크](/wiki/hierarchical-task-network/)

<details class="wiki-backlinks-more">
<summary>나머지 91개 문서 보기</summary>

- [계획 검증](/wiki/plan-verification/)
- [계획 후 실행](/wiki/plan-and-execute/)
- [계획자 에이전트](/wiki/planner-agent/)
- [공유 에이전트 메모리](/wiki/shared-agent-memory/)
- [구조화 출력](/wiki/structured-output/)
- [기억 망각](/wiki/memory-forgetting/)
- [기억 통합](/wiki/memory-consolidation/)
- [다중 에이전트 갈등 해결](/wiki/multi-agent-conflict-resolution/)
- [다중 에이전트 토론](/wiki/multi-agent-debate/)
- [다중 에이전트 합의](/wiki/multi-agent-consensus/)
- [대화 메모리](/wiki/conversation-memory/)
- [도구 결과 처리](/wiki/tool-result-handling/)
- [도구 권한](/wiki/tool-permission/)
- [도구 레지스트리](/wiki/tool-registry/)
- [도구 발견](/wiki/tool-discovery/)
- [도구 부작용](/wiki/tool-side-effect/)
- [도구 선택](/wiki/tool-selection/)
- [도구 실행](/wiki/tool-invocation/)
- [라우터 에이전트](/wiki/router-agent/)
- [모델 기반 계획](/wiki/model-based-planning/)
- [벡터 메모리](/wiki/vector-memory/)
- [브라우저 사용 에이전트](/wiki/browser-use-agent/)
- [블랙보드 아키텍처](/wiki/blackboard-architecture/)
- [비평 에이전트](/wiki/critic-agent/)
- [빔 계획](/wiki/beam-planning/)
- [생각의 그래프](/wiki/graph-of-thoughts/)
- [생각의 나무](/wiki/tree-of-thoughts/)
- [성찰 루프](/wiki/reflection-loop/)
- [세션 상태](/wiki/session-state/)
- [스트리밍 응답](/wiki/streaming-response/)
- [에이전트 가드레일](/wiki/agent-guardrail/)
- [에이전트 간 통신](/wiki/inter-agent-communication/)
- [에이전트 계획 품질](/wiki/agent-plan-quality/)
- [에이전트 과제 분해](/wiki/agent-task-decomposition/)
- [에이전트 과제 성공률](/wiki/agent-task-success/)
- [에이전트 궤적 평가](/wiki/agent-trajectory-evaluation/)
- [에이전트 단기 기억](/wiki/short-term-agent-memory/)
- [에이전트 도구](/wiki/agent-tool/)
- [에이전트 도구 정확도](/wiki/agent-tool-accuracy/)
- [에이전트 런타임](/wiki/agent-runtime/)
- [에이전트 목표](/wiki/agent-goal/)
- [에이전트 벤치마크](/wiki/agent-benchmark/)
- [에이전트 보안](/wiki/agent-security/)
- [에이전트 샌드박스](/wiki/agent-sandbox/)
- [에이전트 성찰](/wiki/agent-reflection/)
- [에이전트 숙고](/wiki/agent-deliberation/)
- [에이전트 스웜](/wiki/agent-swarm/)
- [에이전트 스크래치패드](/wiki/agent-scratchpad/)
- [에이전트 실행기](/wiki/agent-executor/)
- [에이전트 역할](/wiki/agent-role/)
- [에이전트 위임](/wiki/agent-delegation/)
- [에이전트 의미 기억](/wiki/semantic-agent-memory/)
- [에이전트 일화 기억](/wiki/episodic-agent-memory/)
- [에이전트 자기 교정](/wiki/agent-self-correction/)
- [에이전트 자율성 수준](/wiki/agent-autonomy-level/)
- [에이전트 장기 기억](/wiki/long-term-agent-memory/)
- [에이전트 재계획](/wiki/agent-replanning/)
- [에이전트 절차 기억](/wiki/procedural-agent-memory/)
- [에이전트 제어 루프](/wiki/agent-control-loop/)
- [에이전트 조정](/wiki/agent-coordination/)
- [에이전트 종료 조건](/wiki/agent-termination-condition/)
- [에이전트 추적 평가](/wiki/agent-trace-evaluation/)
- [에이전트 하네스](/wiki/agent-harness/)
- [에이전트 핸드오프](/wiki/agent-handoff/)
- [에이전트 협업](/wiki/agent-collaboration/)
- [오케스트레이터 에이전트](/wiki/orchestrator-agent/)
- [워크플로 오케스트레이션](/wiki/workflow-orchestration/)
- [인간 승인 게이트](/wiki/human-approval-gate/)
- [인식-계획-행동 순환](/wiki/perceive-plan-act-cycle/)
- [작업 기억](/wiki/working-memory/)
- [작업자 에이전트](/wiki/worker-agent/)
- [지속성 에이전트 상태](/wiki/persistent-agent-state/)
- [추론-행동 교차 수행](/wiki/reasoning-action-interleaving/)
- [컴퓨터 사용 에이전트](/wiki/computer-use-agent/)
- [코드 실행 도구](/wiki/code-execution-tool/)
- [탐색 기반 계획](/wiki/search-based-planning/)
- [통제 이탈 에이전트](/wiki/runaway-agent/)
- [프롬프트 인젝션](/wiki/prompt-injection/)
- [피어투피어 에이전트](/wiki/peer-to-peer-agents/)
- [AI 에이전트](/wiki/ai-agent/)
- [API 행동 도구](/wiki/api-action-tool/)
- [MCP 도구](/wiki/mcp-tools/)
- [MCP 리소스](/wiki/mcp-resources/)
- [MCP 사용자 정보 요청](/wiki/mcp-elicitation/)
- [MCP 샘플링](/wiki/mcp-sampling/)
- [MCP 서버](/wiki/mcp-server/)
- [MCP 전송 계층](/wiki/mcp-transport/)
- [MCP 클라이언트](/wiki/mcp-client/)
- [MCP 프롬프트](/wiki/mcp-prompts/)
- [MCP 호스트](/wiki/mcp-host/)
- [ReAct 에이전트](/wiki/react-agent/)

</details>

### 이 문서를 포함하는 코스

[AI 에이전트 시스템](/course/agent-systems/) · [AI API 개발](/course/api-development/)

## 참고와 다음 학습

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

### 참고 문헌

<span id="reference-1"></span>1. [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) — documentation
<span id="reference-2"></span>2. [Function model — Wikipedia](https://en.wikipedia.org/wiki/Function_model) — encyclopedia
<span id="reference-3"></span>3. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) — standard
<span id="reference-4"></span>4. [HTTP Semantics RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) — standard
<span id="reference-5"></span>5. [HTTP — Wikipedia](https://en.wikipedia.org/wiki/HTTP) — encyclopedia

### 코스에서 계속 읽기

- **AI 에이전트 시스템:** [다음 문서 — AI 에이전트](/wiki/ai-agent/)
- **AI API 개발:** [다음 문서 — 추론](/wiki/inference/)

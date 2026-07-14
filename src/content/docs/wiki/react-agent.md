---
title: "ReAct 에이전트 ReAct Agent"
description: "언어 모델이 추론 메모와 외부 행동, 관찰을 번갈아 생성하며 계획을 수정하고 도구를 사용하는 에이전트 패턴이다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-alias">Reasoning and Acting Agent · ReAct 패턴</p>

<p class="wiki-lead">언어 모델이 추론 메모와 외부 행동, 관찰을 번갈아 생성하며 계획을 수정하고 도구를 사용하는 에이전트 패턴이다.</p>

<div class="wiki-document-meta">분류: [에이전트·자동화·MCP](/category/agents/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-13</div>

## 개요와 핵심 정의

언어 모델이 추론 메모와 외부 행동, 관찰을 번갈아 생성하며 계획을 수정하고 도구를 사용하는 에이전트 패턴이다.

ReAct는 reasoning과 acting을 결합한 이름이다. 모델은 현재 상황을 해석하고 행동을 선택하며, 검색이나 환경에서 얻은 관찰을 다음 판단에 반영한다. 단일 답변을 바로 생성하는 방식보다 외부 정보와 상호작용하는 궤적을 만든다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 배경과 설명 범위

원 논문은 질의응답·사실 검증과 상호작용 환경에서 추론과 행동을 교차시켰다. 오늘날 도구 호출 에이전트의 넓은 구현을 모두 ReAct라고 부르기도 하지만, 계획 전용·반성 전용·워크플로 기반 패턴과 구분해 궤적 형식을 명시해야 한다.

이 문서는 표제어의 일반적 범위와 인접 개념을 외부 백과로 대조하되, 핵심 정의와 기술적 주장은 논문·표준·공식 문서를 기준으로 재서술한다. 제품별 구현 차이는 보편 정의와 분리해 기록한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 작동 원리

일반적인 루프는 상태와 목표를 읽고 생각 또는 계획을 만든 뒤 도구 행동을 호출하고 관찰을 수집하는 순서다. 관찰이 목표를 충족하면 최종 답을 내고 아니면 다음 행동을 선택한다. 최대 단계와 중단 조건이 무한 루프를 막는다.

원리를 검증할 때는 입력, 중간 상태, 출력과 실패 조건을 분리한다. 결과값 하나만 확인하지 않고 어떤 가정과 변환을 거쳤는지 관찰 가능한 기록으로 남겨야 다른 구현과 비교할 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구성 요소와 처리 흐름

프롬프트, 도구 스키마, 실행기, 관찰 직렬화, 메모리, 중단 정책과 최종 응답기가 구성 요소다. 추론 전문을 저장하거나 노출하는 대신 행동 근거의 요약과 도구 입출력, 정책 판정을 감사 로그로 남기는 설계가 가능하다.

구현 비교에서는 기본값에 기대지 않고 인터페이스, 자료형 또는 스키마, 버전과 오류 처리 방식을 명시한다. 같은 명칭의 기능도 라이브러리와 서비스에 따라 경계 조건이 다를 수 있으므로 작은 기준 사례를 고정한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 활용 분야와 선택 기준

검색 기반 조사, 데이터 조회, 다단계 업무 자동화처럼 중간 관찰이 필요한 과제에 적합하다. 결정적 절차가 중요한 업무는 자유형 루프보다 허용된 단계와 도구를 제한한 워크플로가 더 안전할 수 있다.

도입 여부는 정확도만이 아니라 지연시간, 비용, 설명 가능성, 데이터 요구량과 실패 시 피해를 함께 비교해 결정한다. 단순한 기준선과 실제 업무 데이터에서의 검증 결과가 복잡한 구성을 정당화해야 한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 한계와 흔한 오해

도구 오류와 악성 관찰이 다음 판단을 오염시키고, 긴 궤적에서 비용과 오류가 누적될 수 있다. 그럴듯한 추론 문장이 행동의 정확성을 보장하지 않는다. 권한 분리, 입력 격리, 단계 제한과 사람 승인이 필요하다.

평균 성능만 보고 한계를 숨기지 않도록 하위 집단, 경계 입력, 분포 변화와 악의적 입력을 별도로 시험한다. 알려진 실패를 탐지하는 모니터링과 안전한 대체 경로가 없으면 운영 준비가 끝난 것으로 보지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 관련 개념과의 구분

- [agent-loop](/wiki/agent-loop/): 관찰·판단·행동을 반복하는 일반 구조이며 ReAct는 그 구체 패턴이다.
- [tool-calling](/wiki/tool-calling/): 모델이 구조화된 도구 요청을 만드는 기능으로 ReAct의 행동 단계에 사용될 수 있다.
- [workflow-orchestration](/wiki/workflow-orchestration/): 실행 순서와 재시도·상태를 시스템이 명시적으로 관리하는 운영 계층이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a></div>

## 구체적인 적용 예시

“최근 규정의 시행일을 찾아 요약” 과제에서 검색 행동, 문서 열기, 날짜 확인, 출처 비교를 순서대로 수행한다. 허용 도메인 밖 접근과 쓰기 도구는 차단하고, 출처가 두 개 미만이면 완료하지 않게 한다.

예시는 성공 사례뿐 아니라 실패하기 쉬운 입력을 포함한다. 실행 전 기대 결과와 허용 오차를 적고, 실행 뒤에는 결과뿐 아니라 중간 상태와 선택 이유를 비교해 문제가 데이터·구성·구현 중 어디에서 생겼는지 분리한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 실무 적용과 검증 절차

1. **목적과 경계 정의:** 이 개념이 해결할 업무와 해결하지 않을 업무를 한 문장씩 적는다.
2. **입력·출력 계약:** 자료 형식, 단위, 스키마와 오류 응답을 고정한다.
3. **기준선 비교:** 더 단순한 방법과 동일한 평가 자료에서 품질·비용·지연시간을 비교한다.
4. **실패 시험:** 결측값, 극단값, 분포 변화, 권한 오류와 악의적 입력을 포함한다.
5. **재현 기록:** 목표, 프롬프트·모델 버전, 허용 도구와 권한, 단계별 호출·관찰, 최대 단계, 중단 사유와 승인자를 기록한다.
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

- ReAct 에이전트 개념의 입력, 처리와 출력을 한 문장씩 설명할 수 있는가?
- 관련 문서 세 개와의 차이를 실제 사례로 구분할 수 있는가?
- 운영 기록과 실패 시험에서 반드시 남겨야 할 항목을 제시할 수 있는가?

## 선행 개념

- [에이전트 루프](/wiki/agent-loop/)
- [도구 호출](/wiki/tool-calling/)

## 관련 문서

- [워크플로 오케스트레이션](/wiki/workflow-orchestration/)
- [프롬프트 인젝션](/wiki/prompt-injection/)
- [인간 참여형 제어](/wiki/human-in-the-loop/)

## 이 문서를 가리키는 문서

- [에이전트 자율성 수준](/wiki/agent-autonomy-level/)
- [에이전트 벤치마크](/wiki/agent-benchmark/)
- [에이전트 협업](/wiki/agent-collaboration/)
- [에이전트 제어 루프](/wiki/agent-control-loop/)
- [에이전트 조정](/wiki/agent-coordination/)
- [에이전트 위임](/wiki/agent-delegation/)
- [에이전트 숙고](/wiki/agent-deliberation/)
- [에이전트 실행기](/wiki/agent-executor/)
- [에이전트 목표](/wiki/agent-goal/)
- [에이전트 핸드오프](/wiki/agent-handoff/)
- [에이전트 하네스](/wiki/agent-harness/)
- [에이전트 성찰](/wiki/agent-reflection/)
- [에이전트 재계획](/wiki/agent-replanning/)
- [에이전트 역할](/wiki/agent-role/)
- [에이전트 런타임](/wiki/agent-runtime/)
- [에이전트 샌드박스](/wiki/agent-sandbox/)
- [에이전트 스크래치패드](/wiki/agent-scratchpad/)
- [에이전트 자기 교정](/wiki/agent-self-correction/)
- [에이전트 스웜](/wiki/agent-swarm/)
- [에이전트 과제 분해](/wiki/agent-task-decomposition/)
- [에이전트 과제 성공률](/wiki/agent-task-success/)
- [에이전트 종료 조건](/wiki/agent-termination-condition/)
- [에이전트 도구](/wiki/agent-tool/)
- [에이전트 도구 정확도](/wiki/agent-tool-accuracy/)
- [에이전트 궤적 평가](/wiki/agent-trajectory-evaluation/)
- [API 행동 도구](/wiki/api-action-tool/)
- [빔 계획](/wiki/beam-planning/)
- [블랙보드 아키텍처](/wiki/blackboard-architecture/)
- [브라우저 사용 에이전트](/wiki/browser-use-agent/)
- [코드 실행 도구](/wiki/code-execution-tool/)
- [컴퓨터 사용 에이전트](/wiki/computer-use-agent/)
- [대화 메모리](/wiki/conversation-memory/)
- [비평 에이전트](/wiki/critic-agent/)
- [에이전트 일화 기억](/wiki/episodic-agent-memory/)
- [생각의 그래프](/wiki/graph-of-thoughts/)
- [계층적 과제 네트워크](/wiki/hierarchical-task-network/)
- [인간 승인 게이트](/wiki/human-approval-gate/)
- [에이전트 간 통신](/wiki/inter-agent-communication/)
- [에이전트 장기 기억](/wiki/long-term-agent-memory/)
- [MCP 클라이언트](/wiki/mcp-client/)
- [MCP 사용자 정보 요청](/wiki/mcp-elicitation/)
- [MCP 호스트](/wiki/mcp-host/)
- [MCP 프롬프트](/wiki/mcp-prompts/)
- [MCP 리소스](/wiki/mcp-resources/)
- [MCP 샘플링](/wiki/mcp-sampling/)
- [MCP 서버](/wiki/mcp-server/)
- [MCP 도구](/wiki/mcp-tools/)
- [MCP 전송 계층](/wiki/mcp-transport/)
- [기억 통합](/wiki/memory-consolidation/)
- [기억 망각](/wiki/memory-forgetting/)
- [모델 기반 계획](/wiki/model-based-planning/)
- [다중 에이전트 갈등 해결](/wiki/multi-agent-conflict-resolution/)
- [다중 에이전트 합의](/wiki/multi-agent-consensus/)
- [다중 에이전트 토론](/wiki/multi-agent-debate/)
- [오케스트레이터 에이전트](/wiki/orchestrator-agent/)
- [피어투피어 에이전트](/wiki/peer-to-peer-agents/)
- [인식-계획-행동 순환](/wiki/perceive-plan-act-cycle/)
- [지속성 에이전트 상태](/wiki/persistent-agent-state/)
- [계획 후 실행](/wiki/plan-and-execute/)
- [계획 검증](/wiki/plan-verification/)
- [계획자 에이전트](/wiki/planner-agent/)
- [에이전트 절차 기억](/wiki/procedural-agent-memory/)
- [추론-행동 교차 수행](/wiki/reasoning-action-interleaving/)
- [성찰 루프](/wiki/reflection-loop/)
- [라우터 에이전트](/wiki/router-agent/)
- [탐색 기반 계획](/wiki/search-based-planning/)
- [에이전트 의미 기억](/wiki/semantic-agent-memory/)
- [감지-사고-행동 순환](/wiki/sense-think-act-cycle/)
- [세션 상태](/wiki/session-state/)
- [공유 에이전트 메모리](/wiki/shared-agent-memory/)
- [에이전트 단기 기억](/wiki/short-term-agent-memory/)
- [감독 에이전트](/wiki/supervisor-agent/)
- [도구 발견](/wiki/tool-discovery/)
- [도구 실행](/wiki/tool-invocation/)
- [도구 권한](/wiki/tool-permission/)
- [도구 레지스트리](/wiki/tool-registry/)
- [도구 결과 처리](/wiki/tool-result-handling/)
- [도구 선택](/wiki/tool-selection/)
- [도구 부작용](/wiki/tool-side-effect/)
- [생각의 나무](/wiki/tree-of-thoughts/)
- [벡터 메모리](/wiki/vector-memory/)
- [검증 에이전트](/wiki/verifier-agent/)
- [작업자 에이전트](/wiki/worker-agent/)
- [작업 기억](/wiki/working-memory/)

## 이 문서를 포함하는 코스

_포함된 코스가 없습니다._

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — paper
<span id="reference-2"></span>2. [ReAct Project Site](https://react-lm.github.io/) — documentation
<span id="reference-3"></span>3. [Large language model — Wikipedia](https://en.wikipedia.org/wiki/Large_language_model) — encyclopedia

## 코스에서 계속 읽기

_이 문서에서 이어지는 코스가 없습니다._

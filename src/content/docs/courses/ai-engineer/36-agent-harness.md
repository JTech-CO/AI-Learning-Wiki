---
title: "에이전트 하네스 구축 — 프레임워크로 도구·메모리·루프"
description: "LangGraph·CrewAI·OpenAI Agents SDK·Claude Agent SDK로 에이전트의 도구 등록·메모리·계획-실행 루프·휴먼 승인 게이트를 직접 짠다. 데모를 넘어 실제로 도는 에이전트의 뼈대."
sidebar:
  order: 36
---
_LangGraph·CrewAI·OpenAI Agents SDK·Claude Agent SDK로 에이전트의 도구 등록·메모리·계획-실행 루프·휴먼 승인 게이트를 직접 짠다. 데모를 넘어 실제로 도는 에이전트의 뼈대._

:::note[학습 목표]
- 내 컴퓨터에서 실제로 도는 AI 에이전트 1개를 완성한다. 사용자가 '서울 날씨 알려줘'라고 하면, 에이전트가 스스로 '날씨 도구'를 골라 호출하고, 결과를 받아 사람 말로 정리해 답하며, 위험한 작업 전에는 사람에게 물어보고(승인 게이트) 멈춘다. Anthropic 공식 파이썬 SDK(pip install anthropic) 기준 약 40줄.
:::

> 챗봇은 답만 하지만, '에이전트'는 스스로 도구를 쓰고 여러 번 시도해 일을 끝까지 해낸다. 이 골격을 한 번만 짜두면 '검색→정리→파일저장'처럼 손 가는 일을 코드 30줄짜리 자동 일꾼에게 통째로 맡길 수 있다.

## 이 레슨에서 만드는 것

내 컴퓨터에서 실제로 도는 AI 에이전트 1개를 완성한다. 사용자가 '서울 날씨 알려줘'라고 하면, 에이전트가 스스로 '날씨 도구'를 골라 호출하고, 결과를 받아 사람 말로 정리해 답하며, 위험한 작업 전에는 사람에게 물어보고(승인 게이트) 멈춘다. Anthropic 공식 파이썬 SDK(pip install anthropic) 기준 약 40줄.

## 핵심 개념

에이전트는 '생각하는 AI'에 '손발(도구)'과 '기억(메모리)'을 달고, 일이 끝날 때까지 '생각→행동→결과 보기'를 반복하게 만든 것이다. 비유하면, 똑똑하지만 손이 없는 사람에게 계산기·전화기·메모장을 쥐여주고 '다 될 때까지 알아서 해'라고 시키는 것. '하네스(harness)'는 이 손발과 반복 루프를 묶어주는 '마구(말 안장끈)' 같은 틀이다. '도구(tool)'는 AI가 호출할 수 있는 함수(예: 날씨 조회)이고, '루프(loop)'는 답이 나올 때까지 반복하는 것, '승인 게이트(human-in-the-loop)'는 위험한 행동 직전에 사람한테 '해도 돼요?'라고 멈춰 묻는 관문이다. 이 레슨에서는 Anthropic 공식 파이썬 SDK(pip install anthropic)로 while True 루프를 직접 짜는 저수준(low-level) 방식을 배운다. 루프를 직접 짜면 동작 원리가 투명하게 보인다는 장점이 있다. 한편 LangGraph·CrewAI·Claude Agent SDK(pip install claude-agent-sdk) 같은 고수준 프레임워크를 쓰면 이 반복 루프를 직접 안 짜도 된다. 특히 Claude Agent SDK는 Claude Code CLI를 감싼 래퍼로, anthropic 패키지와는 별개의 패키지다. 어느 프레임워크를 쓰든 저수준 원리를 먼저 이해해 두면 디버깅이 훨씬 쉬워진다.

### 왜 작동하는가

보통 챗봇은 질문 한 번에 답 한 번으로 끝나지만, 에이전트는 "생각→도구 호출→결과 확인→다시 생각"을 답이 나올 때까지 반복한다. 마치 손 없는 똑똑한 사람에게 계산기와 전화기를 쥐여주고 "다 될 때까지 알아서 해"라고 시키는 것과 같다. 그래서 당신은 도구(함수) 몇 개와 반복 루프만 짜두면, 나머지 "어떤 도구를 언제 쓸지" 판단은 AI가 대신 해준다.

## 👀 따라하기 예시

사용자가 에이전트에게 "서울 날씨 알려줘"라고 물어보는 상황. 제가 먼저 이 에이전트를 처음부터 끝까지 만들어볼게요, 눈으로 따라오세요.

### 1. ① 도구(손발) 만들기 — get_weather 함수와 설명서를 준비

**실제 결과**

```text
def get_weather(city): return f"{city}: 맑음, 21도"\n도구 등록: {"name":"get_weather","description":"도시 이름을 받아 현재 날씨를 알려준다"}
```

> AI는 description 한 줄만 보고 "이 도구를 언제 쓸지" 판단한다. 설명이 또렷할수록 AI가 헷갈리지 않는다.

### 2. ② 클로드에게 질문 던지기 — "서울 날씨 알려줘"를 messages에 담아 API 호출

**실제 결과**

```text
r = client.messages.create(model="claude-haiku-4-5", tools=tools, messages=[{"role":"user","content":"서울 날씨 알려줘"}])\nr.stop_reason == "tool_use"
```

> 클로드가 "이건 내가 직접 모르는 정보니 도구를 써야겠다"고 스스로 판단해 tool_use를 돌려준 것 — 이게 아하 포인트다.

### 3. ③ 승인 게이트에서 사람에게 확인 — 실행 직전 멈춰서 물어봄

**실제 결과**

```text
[get_weather] 실행할까요? y/n: y
```

> 에이전트가 아무 도구나 마음대로 실행하면 위험할 수 있다. 실행 직전 사람이 "네" 해야 진행되는 안전장치가 하네스의 핵심이다.

### 4. ④ 도구 결과를 다시 넣고 루프 재실행 — tool_result를 messages에 추가

**실제 결과**

```text
messages.append({"role":"user","content":[{"type":"tool_result","tool_use_id":block.id,"content":"서울: 맑음, 21도"}]})\n→ 다시 API 호출 → stop_reason == "end_turn"\n최종 답: "서울은 현재 맑고 기온은 21도입니다. 나들이 좋은 날씨예요!"
```

> 도구 결과를 messages에 안 넣으면 AI는 다음 생각을 못한다. 결과를 넣고 한 번 더 돌려야 사람 말로 정리된 답이 나온다.

### 완성 결과

실제로 도는 agent.py 약 40줄 — "질문→도구 스스로 선택→승인 게이트→실행→결과 정리 답변"까지 도는 에이전트. 좋은 결과의 기준: (1) tool_use가 뜨면 반드시 승인 게이트를 거친다, (2) tool_result를 넣은 뒤 재호출해 자연스러운 문장으로 답한다, (3) 무한 반복 없이 end_turn에서 멈춘다.

## 단계별 따라하기

### 파이썬과 폴더 준비

에이전트는 코드로 돈다. 먼저 컴퓨터에 파이썬이 있어야 한다. 윈도우는 검색창에 'cmd' 입력→명령 프롬프트 열기, 맥은 'terminal' 검색→터미널 열기. 검은 창에 python --version 입력 후 엔터. 'Python 3.10' 이상 숫자가 나오면 OK. 안 나오면 python.org 접속→노란 'Download Python' 버튼 클릭→설치 시 'Add Python to PATH' 체크박스 꼭 켜기. 그다음 바탕화면에 작업 폴더를 만든다: mkdir my-agent 엔터, cd my-agent 엔터.

**복사·실행 예시**

```text
C:\Users\나> python --version
Python 3.11.5
C:\Users\나> mkdir my-agent
C:\Users\나> cd my-agent
```

### API 키 발급 (에이전트의 두뇌 연결)

에이전트의 '생각'은 클로드 모델이 한다. 그러려면 열쇠(API 키)가 필요하다. console.anthropic.com 접속→로그인(없으면 Sign up)→왼쪽 메뉴 'API Keys' 클릭→오른쪽 위 'Create Key' 버튼 클릭→이름 'my-agent' 입력→Create. 화면에 sk-ant-... 로 시작하는 긴 문자열이 딱 한 번 보인다. 메모장에 즉시 복사해 둔다(다시 못 봄). 주의: 이 키는 비밀번호다. 절대 남에게 보내거나 인터넷에 올리지 말 것. 결제 등록이 필요하면 'Billing' 메뉴에서 소액 충전($5).

**복사·실행 예시**

```text
발급된 키 예시(형태만): sk-ant-api03-xxxxxxxxxxxxxxxx
```

### SDK 설치

Anthropic 공식 파이썬 SDK를 설치한다. 이 패키지(anthropic)는 Claude API와 통신하는 저수준 클라이언트로, 도구 호출 루프는 직접 작성해야 한다. 아까 그 검은 창(my-agent 폴더 안)에 pip install anthropic 입력 후 엔터. 줄이 주르륵 내려가고 'Successfully installed' 가 보이면 끝. 에러가 나면 pip 대신 python -m pip install anthropic 으로 다시. 설치된 버전은 환경마다 다를 수 있으며 0.40.0보다 훨씬 높은 버전이 표시되는 것이 정상이다(2026년 6월 기준 최신은 0.111.0대). 버전 숫자가 다르더라도 이 레슨 코드는 그대로 동작한다.

**복사·실행 예시**

```text
C:\Users\나\my-agent> pip install anthropic
Successfully installed anthropic-0.111.0
```

### 도구(손발) 정의하기

에이전트가 호출할 함수를 만든다. 메모장이나 VS Code로 agent.py 파일을 폴더 안에 새로 만든다. 아래 코드에서 get_weather가 바로 '도구'다. 지금은 진짜 날씨 API 대신 가짜 값(맑음, 21도)을 돌려준다 — 작동을 먼저 확인하기 위해서다. tools 목록에 'name(도구 이름)·description(언제 쓰는지 설명)·input_schema(받을 입력)'을 적어 클로드에게 '이런 손발이 있다'고 알려준다. description을 또렷이 써야 AI가 도구를 제대로 고른다.

**복사·실행 예시**

```text
def get_weather(city):
    return f"{city}: 맑음, 21도"

tools = [{
  "name": "get_weather",
  "description": "도시 이름을 받아 현재 날씨를 알려준다",
  "input_schema": {"type": "object",
    "properties": {"city": {"type": "string"}},
    "required": ["city"]}
}]
```

### 실행 루프 + 승인 게이트 짜기

이게 '하네스'의 심장이다. while True 무한 반복 안에서 (1) 클로드에게 메시지를 보내고 (2) 클로드가 '도구 써줘(tool_use)'라고 하면 (3) 위험 점검 후 함수를 실제 실행해 결과를 다시 넣어준다. (4) 클로드가 더 도구가 필요 없으면(stop_reason='end_turn') 루프를 끝낸다. 승인 게이트는 도구 실행 직전 input()으로 사람에게 'y' 입력을 받는 부분이다 — 진짜로 돈을 쓰거나 파일을 지우는 도구라면 여기서 사람이 막을 수 있다.

【모델 선택 가이드】 예제는 claude-haiku-4-5를 기본으로 쓴다. Haiku는 가장 저렴하고 빠르므로 실습·프로토타입에 적합하다(2026년 6월 기준 입력 $1/백만 토큰). 복잡한 추론이 필요하면 claude-sonnet-4-6($3/백만 토큰), 최고 수준의 에이전트 작업에는 claude-opus-4-8($5/백만 토큰)로 바꾼다. 배우는 단계에서는 Haiku로 시작해 비용을 아끼는 것을 추천한다.

**복사·실행 예시**

```text
import anthropic
client = anthropic.Anthropic(api_key="sk-ant-...여기에붙여넣기")
messages = [{"role":"user","content":"서울 날씨 알려줘"}]
# 실습에는 claude-haiku-4-5 (저비용·빠름)로 시작 권장
# 복잡한 작업: claude-sonnet-4-6 / 최고 성능: claude-opus-4-8
while True:
    r = client.messages.create(model="claude-haiku-4-5",
        max_tokens=1024, tools=tools, messages=messages)
    if r.stop_reason != "tool_use":
        print(r.content[0].text); break
    messages.append({"role":"assistant","content":r.content})
    for block in r.content:
        if block.type == "tool_use":
            ok = input(f"[{block.name}] 실행할까요? y/n: ")
            out = get_weather(**block.input) if ok=="y" else "사용자가 거부함"
            messages.append({"role":"user","content":[{
                "type":"tool_result","tool_use_id":block.id,"content":out}]})
```

### 실행하고 결과 보기

저장(Ctrl+S) 후 검은 창에 python agent.py 입력→엔터. 화면에 '[get_weather] 실행할까요? y/n:' 이 뜬다 — 바로 승인 게이트다. y 입력 후 엔터. 그러면 에이전트가 도구 결과를 받아 '서울은 현재 맑고 21도입니다' 같은 자연스러운 문장으로 답하고 끝난다. 이게 '요청→스스로 도구 선택→실행→정리 답변'이 도는 진짜 에이전트다.

**복사·실행 예시**

```text
C:\Users\나\my-agent> python agent.py
[get_weather] 실행할까요? y/n: y
서울은 현재 맑고 기온은 21도입니다. 나들이 좋은 날씨예요!
```

### 막히면 이렇게 (자주 나오는 에러)

에러 메시지 첫 줄을 그대로 읽어보면 대부분 원인이 보인다. authentication_error: API 키가 틀렸거나 안 붙여넣어진 것 → 2단계 키를 다시 복사. credit balance / 400 billing: 잔액 부족 → Console의 Billing에서 충전. ModuleNotFoundError: No module named 'anthropic': 설치 안 됨 → 3단계 pip install 다시. 그래도 막히면 전체 에러 텍스트를 복사해 claude.ai 채팅에 붙이고 '이 에러 고쳐줘'라고 물으면 된다.

**복사·실행 예시**

```text
에러: anthropic.AuthenticationError: invalid x-api-key
→ 해결: api_key="..." 안에 진짜 키를 넣었는지 확인 (sk-ant-로 시작)
```

## 흔한 실수와 교정
- **실수:** API 키를 코드에 적어 그대로 깃허브·블로그에 올림
  - **교정:** 키는 비밀번호다. 공개 저장소에 올리면 남이 내 돈으로 쓴다. 환경변수(.env 파일)에 넣고 코드엔 직접 안 적기. 노출됐으면 Console에서 즉시 'Delete' 후 새 키 발급.
- **실수:** 도구 description을 대충 써서 AI가 도구를 안 부르거나 엉뚱하게 부름
  - **교정:** description은 AI가 도구 고르는 유일한 단서다. '언제·무엇을 위해 쓰는지'를 한 문장으로 또렷이. 예: '도시 이름을 받아 현재 날씨를 반환'.
- **실수:** tool_use가 나왔는데 결과(tool_result)를 다시 안 넣고 끝냄
  - **교정:** 에이전트는 도구 결과를 받아야 다음 생각을 한다. 반드시 messages에 assistant의 tool_use와 사용자의 tool_result를 둘 다 추가하고 루프를 다시 돌려야 한다.
- **실수:** 무한 루프로 같은 도구를 끝없이 호출(요금 폭탄)
  - **교정:** 최대 반복 횟수(예: 10회)를 정해 그 이상 돌면 강제 종료. while문에 카운터를 둬서 안전장치를 건다.

## 완료 체크리스트

- python --version에서 3.10 이상이 나온다
- console.anthropic.com에서 sk-ant-로 시작하는 키를 발급해 안전하게 보관했다
- pip install anthropic가 'Successfully installed'로 끝났다
- python agent.py 실행 시 승인 게이트(y/n)가 뜨고, y 입력 후 자연어 답이 나온다
- 도구를 1개 더 추가해 봤거나, 최대 반복 횟수 안전장치를 넣었다

## 도구

- anthropic 파이썬 패키지 (pip install anthropic) — Anthropic 공식 저수준 클라이언트. 도구 호출 루프를 직접 작성해야 하므로 동작 원리가 그대로 보인다. 이 레슨에서 사용하는 패키지.
- Claude Agent SDK (pip install claude-agent-sdk) — Claude Code CLI를 감싼 고수준 래퍼. 루프·도구 실행을 SDK가 대신 처리한다. anthropic 패키지와 별개이며, 저수준 루프가 불필요할 때 선택.
- LangGraph — 복잡한 분기·상태 흐름을 그래프로 설계할 때
- CrewAI — 여러 AI가 역할 나눠 협업하는 멀티 에이전트
- OpenAI Agents SDK — GPT 기반으로 같은 골격을 짤 때

## 참고 답안

def get_exchange_rate(from_currency, to_currency): return f"{from_currency}→{to_currency}: 1,350"\ntools = [{"name":"get_exchange_rate","description":"두 통화 코드를 받아 환율을 알려준다","input_schema":{"type":"object","properties":{"from_currency":{"type":"string"},"to_currency":{"type":"string"}},"required":["from_currency","to_currency"]}}]\n→ messages=[{"role":"user","content":"달러를 원화로 바꾸면 얼마야?"}]로 실행하면 클로드가 tool_use로 get_exchange_rate를 호출 → 승인 게이트에서 y → 결과를 messages에 넣고 재호출 → "1달러는 약 1,350원입니다" 같은 답이 나온다.

## 실전 프롬프트

### 도구 정의(스키마) 자동 생성

```text
나는 Anthropic 파이썬 SDK(pip install anthropic)로 저수준 tool-loop 에이전트를 만든다. [예: 도시별 환율을 조회하는] 도구를 추가하고 싶다. 이 도구의 tools 스키마(name, description, input_schema)와 실제 파이썬 함수를 함께 써줘. description은 AI가 언제 이 도구를 골라야 하는지 명확히 적어줘.
```

> 확인된 작성 예시 없음

`eduverse` `agent-harness`

### 에러 디버깅

```text
anthropic 파이썬 SDK로 에이전트를 돌리다 아래 에러가 났다. 원인과 한 줄씩 고치는 법을 초보도 알게 쉽게 알려줘.
--- 에러 전문 붙여넣기 ---
[에러 메시지 전체 복붙]
```

> 확인된 작성 예시 없음

`eduverse` `agent-harness`

### 프레임워크 비교 추천

```text
나는 [예: 여러 AI가 역할 나눠 협업하는 / 단일 AI가 도구만 쓰는] 에이전트를 만들고 싶다. LangGraph, CrewAI, OpenAI Agents SDK, Claude Agent SDK(claude-agent-sdk), anthropic 저수준 SDK 중 내 목적에 가장 쉬운 것 1개를 이유와 함께 골라주고, 그걸로 시작하는 10줄 예제를 줘. 참고로 claude-agent-sdk는 Claude Code CLI 기반 고수준 래퍼이고, anthropic 패키지는 루프를 직접 짜는 저수준 클라이언트다.
```

> 확인된 작성 예시 없음

`eduverse` `agent-harness`

### 승인 게이트 추가

```text
내 에이전트의 [예: 파일 삭제 / 이메일 전송] 도구는 위험하다. 이 도구를 실행하기 직전에 사람에게 확인받는 human-in-the-loop 승인 게이트 코드를 내 실행 루프에 끼워넣는 법을 보여줘.
```

> 확인된 작성 예시 없음

`eduverse` `agent-harness`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! get_weather 대신 get_exchange_rate(from_currency, to_currency) 도구를 만들어 보세요. 지금은 진짜 API 없이 "USD→KRW: 1,350원" 같은 가짜 값을 돌려줘도 됩니다. tools 목록에 description을 또렷하게 적고, "달러를 원화로 바꾸면 얼마야?"라는 질문을 넣어 루프가 도는지 확인하세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| description만 보고 AI가 도구를 스스로 잘 골랐는가? | 5 |
| tool_use 뒤에 tool_result를 messages에 제대로 넣고 루프를 다시 돌렸는가? | 5 |
| 승인 게이트(y/n)를 실행 직전에 넣어 위험한 실행을 사람이 막을 수 있게 했는가? | 5 |

## 관련 개념

- [Agent](/concepts/agent/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=engineer&node=awti_agent_harness) · 방식: api-capture</sub>
---
title: "에이전트 루프(ReAct) 직접 짜기"
description: "관찰→사고→행동(ReAct) 루프를 직접 코딩해 모델이 도구를 반복 호출하며 목표를 달성하는 최소 에이전트를 만든다."
sidebar:
  order: 33
---
_관찰→사고→행동(ReAct) 루프를 직접 코딩해 모델이 도구를 반복 호출하며 목표를 달성하는 최소 에이전트를 만든다._

:::note[학습 목표]
- 이 레슨이 끝나면, 관찰→사고→행동을 반복하며 도구(계산기·검색)를 스스로 호출해 목표를 달성하는 50줄짜리 최소 에이전트를 직접 돌려볼 수 있습니다.
:::

> "AI에게 계산기 좀 써봐"라고 말만 하는 게 아니라, AI가 스스로 도구를 골라 반복 호출하며 답을 찾아가게 만들 수 있다면? 그게 바로 요즘 모두가 말하는 '에이전트'의 심장, ReAct 루프입니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 관찰→사고→행동을 반복하며 도구(계산기·검색)를 스스로 호출해 목표를 달성하는 50줄짜리 최소 에이전트를 직접 돌려볼 수 있습니다.

## 핵심 개념

ReAct는 Reasoning(추론) + Acting(행동)의 합성어로, 모델이 한 번에 답하지 않고 "생각(Thought) → 행동(Action) → 관찰(Observation)"을 여러 번 반복하게 하는 방식입니다. 핵심은 모델이 매 턴 텍스트로 '나는 지금 계산기를 써야겠다'고 말하면, 여러분의 코드가 그 텍스트를 파싱해 실제 함수(도구)를 실행하고, 그 결과를 다시 모델에게 돌려주는 것입니다. 마치 사람이 문제를 풀 때 "일단 이 숫자를 계산기에 넣어보고, 결과를 보고 다음을 정하자"라고 하는 과정과 똑같습니다. 모델 자체는 도구를 실행할 수 없기 때문에, 이 '루프를 돌리는 코드'가 바로 에이전트의 본체입니다. 오늘은 이 루프를 여러분 손으로 짜서, 마법처럼 보이던 에이전트가 실은 while 반복문 하나라는 걸 체감합니다.

### 왜 작동하는가

AI는 스스로 계산기를 두드리거나 인터넷을 검색할 손이 없어요. 그래서 "이제 계산기를 써야겠다"는 생각을 텍스트로만 말하게 하고, 여러분의 코드가 그 말을 알아듣고 대신 실행한 뒤 결과를 다시 넣어주는 거예요. 이 "말하기 → 대신 실행 → 결과 되돌려주기"를 반복하는 while문 한 줄이, 그 신비로워 보이는 '에이전트'의 전부입니다.

## 👀 따라하기 예시

"한국 인구를 검색하고, 그 수에 1.05를 곱한 값을 계산해줘" — 제가 먼저 이 ReAct 루프를 처음부터 끝까지 돌려볼게요. 눈으로 따라오세요.

### 1. ① 시스템 프롬프트로 형식부터 못박기

**실제 결과**

```text
"너는 Thought / Action / Action Input 순서로만 답해. 절대 Observation은 네가 쓰지 마. 다 풀리면 Final Answer:로 끝내." 라고 모델에게 미리 선언
```

> 형식이 정해져 있어야 코드가 문자열을 정확히 파싱할 수 있어요 — 자유 서술이면 파싱이 무너집니다.

### 2. ② 1턴째, 모델이 검색을 요청

**실제 결과**

```text
Thought: 인구수를 모르니 먼저 검색해야겠다\nAction: search\nAction Input: 한국 인구
```

> 모델은 실행 버튼이 없어서, "이걸 눌러줘"라는 말만 텍스트로 남깁니다. 이게 Action 파싱의 재료예요.

### 3. ③ 코드가 대신 실행하고 결과를 주입

**실제 결과**

```text
TOOLS["search"]("한국 인구") 실행 → "약 5,100만 명입니다" → 대화기록에 Observation: 약 5,100만 명입니다 추가 후 모델 재호출
```

> 모델은 절대 검색 결과를 지어내지 않아요. 진짜 함수가 실행된 값만 다시 넣어줘야 신뢰할 수 있는 루프가 됩니다.

### 4. ④ 2턴째, 계산기 호출 후 Final Answer

**실제 결과**

```text
Thought: 이제 5100만에 1.05를 곱하면 된다\nAction: calculator\nAction Input: 51000000*1.05\n→ Observation: 53550000.0\nFinal Answer: 한국 인구 약 5,355만 명입니다
```

> "Final Answer:"라는 신호를 코드가 감지해 break 하는 순간, 루프가 스스로 멈춥니다 — 이게 없으면 영원히 돕니다.

### 완성 결과

터미널에 Thought→Action→Observation이 2번 반복되다 Final Answer로 끝나는 로그가 남는 50줄짜리 파이썬 스크립트. 좋은 결과의 기준: (1) 모델이 Observation을 직접 지어내지 않고 매번 코드가 채워준 값만 사용, (2) 최대 턴 수(6턴) 안에 반드시 종료, (3) 없는 도구를 부르거나 형식이 깨져도 에러로 죽지 않고 "그런 도구는 없습니다" 같은 메시지로 버팀.

## 단계별 따라하기

### 1단계 — 실행 환경 준비하기 (5분)

Python 3.10 이상이 깔린 컴퓨터에서 터미널을 열고, 무료로 쓸 수 있는 모델 API를 준비합니다. 여기서는 OpenAI 호환이면서 무료 크레딧을 주는 서비스를 예로 듭니다. 없다면 Groq(무료)나 로컬 Ollama도 됩니다. 🙋나

**복사·실행 예시**

```text
터미널에 'pip install openai' 입력 후 엔터. 그리고 API 키를 발급받아 'export MODEL_API_KEY=sk-...' 로 환경변수에 저장 (Groq이면 https://console.groq.com 에서 무료 키 발급).
```

### 2단계 — 도구 2개를 파이썬 함수로 정의하기 (7분)

에이전트가 호출할 '도구'는 그냥 파이썬 함수입니다. 계산기 함수와 가짜 검색 함수, 딱 2개만 만듭니다. 딕셔너리에 이름→함수로 등록해 두면 나중에 이름으로 골라 실행할 수 있습니다. 🙋나

**복사·실행 예시**

```text
def calculator(expr): return str(eval(expr))
def search(q): return f"'{q}'는 인구 약 3억3천만의 나라입니다"
TOOLS = {"calculator": calculator, "search": search}
```

### 3단계 — 시스템 프롬프트로 ReAct 형식 강제하기 (7분)

모델이 매 턴 정해진 형식으로만 답하도록 시스템 프롬프트를 씁니다. Thought / Action / Action Input / (그리고 코드가 채워줄) Observation 형식과, 다 풀리면 'Final Answer:'로 끝내라고 지시합니다. 이 형식 약속이 파싱의 열쇠입니다. 🤝함께 (아래 템플릿1을 그대로 복붙)

**복사·실행 예시**

```text
SYSTEM = 아래 templates의 '1. ReAct 시스템 프롬프트'를 그대로 복사해 문자열 변수로 넣기. 사용 가능한 도구 목록에 calculator, search 명시.
```

### 4단계 — 루프(while) 짜서 파싱·실행·재주입하기 (12분)

핵심입니다. while 반복문 안에서 (1) 모델을 호출하고 (2) 응답에서 'Action:'과 'Action Input:' 줄을 문자열로 뽑아내고 (3) TOOLS에서 해당 함수를 실행하고 (4) 그 결과를 'Observation: ...'로 대화 기록에 붙여 다시 모델에 넣습니다. 'Final Answer:'가 나오면 break. 무한루프 방지로 max 6턴 제한을 겁니다. 🙋나 (막히면 🤖A에게 '이 파싱 코드 디버깅해줘')

**복사·실행 예시**

```text
for step in range(6):
    resp = call_model(messages)
    if "Final Answer:" in resp: print(resp); break
    action = resp.split("Action:")[1].split("\n")[0].strip()
    arg = resp.split("Action Input:")[1].split("\n")[0].strip()
    obs = TOOLS[action](arg)
    messages.append({"role":"assistant","content":resp})
    messages.append({"role":"user","content":f"Observation: {obs}"})
```

### 5단계 — 도구가 필요한 질문으로 실제 돌려보기 (7분)

모델이 절대 암산 못 할 만한 질문을 던져 루프가 진짜 도구를 호출하는지 확인합니다. 터미널 출력에서 Thought→Action→Observation이 2~3번 반복되다 Final Answer로 끝나는지 눈으로 봅니다. 🙋나

**복사·실행 예시**

```text
질문: '한국 인구를 검색하고, 그 수에 1.05를 곱한 값을 계산해줘.' → search 호출 후 calculator 호출 두 단계를 거쳐 Final Answer가 나오면 성공.
```

### 6단계 — 실패 케이스로 견고함 테스트하기 (7분)

모델이 형식을 안 지키거나 없는 도구를 부를 때 코드가 죽지 않게 방어합니다. Action 이름이 TOOLS에 없으면 'Observation: 그런 도구는 없습니다'를 돌려주도록 try/except와 조건문을 추가합니다. 🤝함께 (🤖A에게 예외처리 코드 보강 요청)

**복사·실행 예시**

```text
if action not in TOOLS:
    obs = f"오류: '{action}' 도구는 없습니다. 사용 가능: {list(TOOLS)}"
else:
    try: obs = TOOLS[action](arg)
    except Exception as e: obs = f"실행 오류: {e}"
```

## 흔한 실수와 교정
- **실수:** 모델이 'Observation:'까지 스스로 지어내서 도구를 실제로 호출하지 않는데도 답이 나온 것처럼 보인다.
  - **교정:** 시스템 프롬프트에 'Observation은 절대 직접 쓰지 말라'고 명시하고, 코드에서 모델 응답에 Observation이 들어오면 그 뒷부분을 잘라버린 뒤 실제 도구 결과만 주입한다.
- **실수:** while 루프에 종료 조건이 없거나 max 턴 제한이 없어 API를 무한 호출하고 요금·시간이 폭발한다.
  - **교정:** for step in range(6)처럼 최대 반복 횟수를 걸고, 'Final Answer:'가 나오면 즉시 break한다. 6턴 안에 못 끝내면 강제 종료 메시지를 출력한다.
- **실수:** calculator를 eval()로 만들어 두고 사용자 입력을 그대로 넣어, 위험한 코드가 실행될 수 있다.
  - **교정:** 학습용 데모까지는 eval도 되지만, 조금이라도 공개할 거면 숫자·연산자만 허용하는 화이트리스트 검사나 ast.literal_eval / 전용 수식 라이브러리로 바꾼다.

## 완료 체크리스트

- 도구 2개(calculator, search)를 파이썬 함수로 만들고 딕셔너리에 등록했다
- ReAct 형식(Thought/Action/Action Input/Observation)을 강제하는 시스템 프롬프트를 넣었다
- while 루프에서 Action을 파싱해 실제 함수를 실행하고 Observation을 재주입했다
- 도구가 2번 이상 연속 호출되는 질문으로 Final Answer까지 도달하는 걸 확인했다
- 없는 도구·형식 이탈·max 턴 초과 3가지 실패 케이스에서 코드가 죽지 않게 방어했다

## 도구

- Python 3.10+ (https://python.org) — 에이전트 루프를 짜고 실행하는 언어
- Groq Cloud (https://console.groq.com) — 무료 크레딧으로 빠른 LLM 호출, OpenAI 호환 API
- Ollama (https://ollama.com) — 인터넷 없이 로컬에서 무료로 모델 돌리기(선택)
- openai 파이썬 SDK (https://pypi.org/project/openai) — Groq 등 호환 엔드포인트로 모델 호출

## 참고 답안

TOOLS 딕셔너리에 unit_convert 함수를 추가 → 시스템 프롬프트의 "사용 가능한 도구" 목록에 unit_convert 이름과 사용법을 한 줄 추가 → 실행 시 1턴에서 search로 인구를 얻고, 2턴에서 unit_convert로 단위를 바꾼 뒤, 3턴에서 Final Answer로 마무리되는 로그가 나오면 성공.

## 실전 프롬프트

### 1. ReAct 시스템 프롬프트 (가장 먼저 복붙)

```text
당신은 도구를 사용해 문제를 푸는 에이전트입니다. 반드시 아래 형식만 사용하세요.

Thought: (지금 무엇을 할지 한국어로 한 줄 생각)
Action: (사용할 도구 이름 - calculator 또는 search 중 하나만)
Action Input: (그 도구에 넣을 입력)

그러면 시스템이 다음 줄에 'Observation: 결과'를 줄 것입니다. 필요한 만큼 Thought/Action/Action Input을 반복하세요. 답을 확정할 수 있으면 다음 형식으로 끝내세요.

Final Answer: (최종 답)

도구 설명:
- calculator: 수식 문자열을 계산. 예 Action Input: 330000000*1.05
- search: 짧은 검색어로 사실 조회. 예 Action Input: 한국 인구

한 번에 Action은 하나만. Observation을 직접 상상해서 쓰지 마세요.
```

> 확인된 작성 예시 없음

`eduverse` `agent-loop-basics`

### 2. 파싱 코드 디버깅 요청

```text
파이썬으로 ReAct 에이전트 루프를 만들고 있는데, 모델 응답에서 Action과 Action Input을 뽑아내는 이 파싱 코드가 [증상: 예를 들어 IndexError가 남 / 엉뚱한 값이 잡힘]. 아래 코드를 견고하게 고쳐줘. 여러 줄 입력이나 형식 이탈에도 안 죽게 정규식(re) 기반으로 바꿔줘.

[여기에 내 파싱 코드 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `agent-loop-basics`

### 3. 도구 추가 아이디어 요청

```text
내 최소 ReAct 에이전트에 calculator와 search 도구가 있어. 초보가 15분 안에 파이썬 함수로 직접 구현할 수 있으면서 데모가 인상적인 세 번째 도구를 3개 추천하고, 각각의 함수 시그니처(입력/출력)와 5줄 이내 예시 구현을 한국어 주석과 함께 줘. 외부 유료 API 없이 되는 걸로.
```

> 확인된 작성 예시 없음

`eduverse` `agent-loop-basics`

### 4. 내 루프 코드 안전성 리뷰

```text
아래는 내가 짠 ReAct 에이전트 while 루프야. (1) 무한루프 위험 (2) 없는 도구 호출 (3) eval 보안 위험 (4) 대화 기록이 너무 길어지는 문제, 이 4가지 관점에서 위험한 줄을 지적하고 각각 고친 코드를 한국어로 설명해줘.

[여기에 내 루프 코드 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `agent-loop-basics`

## 직접 만들기 (미션)

:::tip
이번엔 도구를 하나 더 늘려 직접 돌려보세요: search·calculator에 더해 "unit_convert(value, from, to)" 같은 간단한 단위변환 함수를 TOOLS에 추가하고, "서울 인구를 검색해서 만 단위로 환산해줘" 같은 질문으로 루프를 실행해 Thought→Action→Observation이 최소 2번 반복되는지 확인하세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 내 코드는 모델이 Observation을 직접 지어내면 그 뒷부분을 잘라내고 있는가? | 5 |
| 최대 턴 수 제한(예: 6턴)이 걸려 있어서 무한루프로 API 요금이 폭발할 위험이 없는가? | 5 |
| 없는 도구 이름이 오거나 Action Input 파싱이 실패해도 프로그램이 죽지 않고 에러 메시지를 Observation으로 돌려주는가? | 5 |

## 관련 개념

- [Agent](/concepts/agent/)
- [Loop](/concepts/loop/)
- [Basics](/concepts/basics/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=engineer&node=engineerx_agent_loop_basics) · 방식: api-capture</sub>
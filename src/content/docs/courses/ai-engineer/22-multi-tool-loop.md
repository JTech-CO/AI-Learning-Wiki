---
title: "다중 도구와 도구 루프"
description: "여러 도구를 등록하고 도구 실행 결과(tool_result)를 다시 모델에 되먹이는 루프를 돌려, '검색해줘' 한마디에 검색→계산→저장까지 스스로 이어붙이는 미니 에이전트를 만든다."
sidebar:
  order: 22
---
_여러 도구를 등록하고 도구 실행 결과(tool_result)를 다시 모델에 되먹이는 루프를 돌려, '검색해줘' 한마디에 검색→계산→저장까지 스스로 이어붙이는 미니 에이전트를 만든다._

:::note[학습 목표]
- 도구 요청→실행→되먹임을 stop_reason이 tool_use가 아닐 때까지 반복하는 '도구 루프'를 직접 코딩한다
- 여러 도구를 name·description·input_schema로 등록하고 name→실제 함수 디스패처를 만든다
- 최대 반복 가드와 스텝 로그를 넣어 다단계 작업이 자동으로 완수되는 미니 에이전트를 완성한다
:::

## 핵심 개념

도구 호출(tool use)의 핵심은 **한 번에 끝나지 않는다는 것**이에요. 모델이 "이 도구를 이 인자로 불러줘"라고 요청하면, 우리 코드가 실제로 실행하고 그 결과(`tool_result`)를 대화에 다시 넣어 모델을 재호출합니다. 이 **요청→실행→되먹임**을 `stop_reason`이 `tool_use`가 아닐 때까지 반복하는 것이 바로 **'도구 루프(agentic loop)'**예요. 요리사(모델)에게 냉장고·저울·오븐(도구들)을 쥐여주고, 재료를 꺼내 보고 무게를 잰 뒤 다음 행동을 스스로 정하게 하는 것과 같아요. 도구가 여러 개면 모델이 상황에 맞는 도구를 골라 여러 단계를 스스로 이어붙입니다.

### 흐름

> 입력 → 도구A → 도구B → 최종 답

한 번의 도구로는 안 끝나는 2~3단계 작업을, 모델이 도구를 순서대로 골라 쓰며 끝까지 밀고 갑니다.

### 왜 이게 될까?

AI는 수많은 "도구 요청 → 결과 받음 → 다음 행동 결정" 대화 패턴을 **이미 학습**했어요. 그래서 `tool_result`만 착실히 되먹여주면 AI가 스스로 "다음엔 이 도구가 필요하다"고 판단해 여러 단계를 이어붙입니다. **당신은 도구를 등록하고 실행 함수만 만들면, 순서를 짜는 건 AI가 대신**해줘요.

## 👀 따라하기 예시 — "도쿄 날씨를 화씨로 알려줘"를 `get_weather` + `calculate` 두 도구로

**① 모델에 첫 질문 전달** → `stop_reason` `"tool_use"`, `content [{type:"tool_use", name:"get_weather", input:{city:"Tokyo"}}]`
> 💡 화씨로 바꾸려면 먼저 섭씨 기온이 있어야 하니, 모델이 알아서 `get_weather`부터 골라요.

**② 우리 코드가 도구 실행 후 결과를 되먹임** → `runTool` 결과 `{temp_c:26}` → `messages`에 `{type:"tool_result", tool_use_id:"toolu_01", content:"{\"temp_c\":26}"}` 추가 후 재호출
> 💡 모델은 실행을 못 해요. 결과를 직접 넣어줘야 다음 판단을 합니다.

**③ 모델이 두 번째 도구 호출** → `stop_reason` `"tool_use"`, `content [{type:"tool_use", name:"calculate", input:{expr:"26*9/5+32"}}]`
> 💡 섭씨 값을 받자마자 화씨 변환식이 필요하다고 스스로 이어붙여요. 이게 도구 루프의 힘.

**④ 계산 결과 되먹인 뒤 최종 응답** → `stop_reason` `"end_turn"` → "도쿄는 지금 26도, 화씨로는 78.8도예요."
> 💡 필요한 정보가 다 모이면 모델이 스스로 루프를 끝내고 자연어로 정리해요.

좋은 결과의 기준: (1) 모든 `tool_use_id`가 짝이 맞음 (2) 8회 반복 가드 안에서 `end_turn`으로 정상 종료 (3) 최종 답이 자연어로 매끄럽게.

## 단계별 따라하기

1. **무엇을 자동화할지 다단계 시나리오 정하기** — 한 번의 도구로는 안 끝나는 2~3단계 작업을 고른다. `입력 → 도구A → 도구B → 최종 답` 형태로 흐름을 적는다.
   > 예) 도시명 → `get_weather(도시)`로 기온 → `calculate(화씨 변환)` → '서울은 지금 22도, 화씨 71.6도예요'
2. **도구 2개를 JSON 스키마로 등록** — 각 도구를 `name`·`description`·`input_schema`(JSON Schema)로 정의해 `tools` 배열에 넣는다. `description`은 모델이 언제 쓸지 판단하는 **유일한 단서**이니 구체적으로.
   ```js
   tools=[
     {name:'get_weather', description:'도시의 현재 섭씨 기온을 반환',
      input_schema:{type:'object', properties:{city:{type:'string'}}, required:['city']}},
     {name:'calculate', description:'수식 문자열을 계산해 숫자 반환',
      input_schema:{type:'object', properties:{expr:{type:'string'}}, required:['expr']}}
   ]
   ```
3. **각 도구의 실제 실행 함수 만들기** — 모델은 도구를 '부를' 뿐, 실행은 우리 코드가 한다. `name`→실제 함수 디스패처. 지금은 진짜 API 없이 mock 반환.
   ```js
   function runTool(name, input){
     if(name==='get_weather') return {temp_c: 22};
     if(name==='calculate') return {result: eval(input.expr)}; // eval은 학습용, 실서비스에선 안전한 계산기
   }
   ```
4. **도구 루프 while문 작성** — `messages`에 user 입력을 넣고 모델 호출. `stop_reason`이 `'tool_use'`인 동안 (1)assistant 응답을 `messages`에 추가 (2)`tool_use` 블록마다 `runTool` 실행 (3)결과를 `role:user` + `type:'tool_result'` + `tool_use_id`로 추가 (4)다시 모델 호출.
   ```js
   while(res.stop_reason==='tool_use'){
     messages.push({role:'assistant',content:res.content});
     const results = res.content.filter(b=>b.type==='tool_use')
       .map(b=>({type:'tool_result',tool_use_id:b.id,content:JSON.stringify(runTool(b.name,b.input))}));
     messages.push({role:'user',content:results});
     res = await callModel(messages,tools);
   }
   ```
5. **무한루프 방지 가드 넣기** — 최대 반복 횟수(예: 8회)를 두고 초과 시 강제 종료. 각 반복마다 어떤 도구를 무슨 인자로 불렀는지 콘솔 로그.
   ```js
   let steps=0;
   while(res.stop_reason==='tool_use' && steps++ < 8){
     console.log('STEP',steps, res.content.filter(b=>b.type==='tool_use').map(b=>b.name+':'+JSON.stringify(b.input)));
     // ...
   }
   ```
6. **실행하고 다단계 자동 완수 확인** — '파리 날씨를 화씨로 알려줘' 입력. 로그에 `get_weather` → `calculate` 두 도구가 순서대로 찍히고, 마지막에 `stop_reason`이 `'end_turn'`으로 바뀌며 자연어 최종 답이 나오면 성공.
   > 입력 '파리 날씨를 화씨로' → STEP1 `get_weather:{city:'Paris'}` → STEP2 `calculate:{expr:'18*9/5+32'}` → '파리는 지금 18도, 화씨로는 64.4도예요.'

## 흔한 실수 → 교정

- ✗ `tool_result`를 안 돌려주고 그냥 다음 user 메시지로 대화를 이어감 → 모델은 도구 결과를 못 받아 헤매거나 API가 에러. **`tool_use` 응답 바로 다음 턴은 반드시 `role:user` + `type:'tool_result'` + 해당 `tool_use_id`로 결과를 넣고 다시 호출한다. id가 짝이 맞아야 한다.**
- ✗ assistant의 `tool_use` 응답을 `messages`에 다시 추가하지 않고 결과만 넣음 → 대화 이력이 깨져 모델이 자기가 뭘 요청했는지 잊음. **루프 안에서 항상 (1)assistant 응답 push → (2)`tool_result` push 순서. 두 개가 짝을 이뤄야 한다.**
- ✗ 종료 조건 없이 `while(true)`로 돌려 모델이 도구를 무한 호출 → 요금·시간 폭주. **최대 반복 횟수(예: 8) 가드를 넣고 초과 시 `break`. `stop_reason==='end_turn'`이면 정상 종료로 루프를 빠져나온다.**

## 도구

- 🛠 **Anthropic Messages API** (docs.anthropic.com/en/docs/build-with-claude/tool-use) — 도구 등록·`tool_use`/`tool_result` 루프 표준.
- 🛠 **Node.js** (nodejs.org) — 로컬에서 루프 코드 실행.
- 🛠 **JSON Schema** (json-schema.org) — `input_schema` 작성 문법.
- 🛠 **Claude·ChatGPT** — 도구 스키마·루프 코드 초안 생성과 버그 진단.

## 실전 프롬프트

### 도구 2개 + 루프 코드 생성 (가장 유용)

```text
나는 [Node.js]로 Anthropic 메시지 API를 써서 미니 에이전트를 만들고 있어. 도구 두 개를 등록하고 stop_reason이 tool_use가 아닐 때까지 도는 도구 루프를 완성해줘. 도구1: [get_weather - 도시명을 받아 섭씨 기온 반환], 도구2: [calculate - 수식 문자열을 계산]. 요구사항: (1) tools 배열을 JSON Schema로 정의 (2) name→실제 함수 디스패처(mock) (3) while 루프에서 tool_result를 tool_use_id와 함께 되먹임 (4) 최대 반복 8회 가드 (5) 각 스텝 콘솔 로그. 전체 실행 가능한 코드로.
```

`도구 루프` `코드 생성` `에이전트`

### 도구 description 다듬기

```text
아래 도구 정의에서 description이 모호해서 모델이 언제 써야 할지 헷갈릴 것 같아. 모델이 정확히 이 도구를 고르도록 description과 input_schema를 더 구체적으로. 각 파라미터가 무엇이고 언제 쓰는지 한 줄씩 포함: [내 도구 JSON]
```

`description` `도구 스키마`

### 루프가 안 멈추는 버그 진단

```text
내 도구 루프가 같은 도구를 계속 반복 호출하며 멈추지 않아. 아래 코드를 보고 원인을 짚어줘. 특히 (1) tool_result를 제대로 되먹이고 있는지 (2) tool_use_id가 매칭되는지 (3) assistant 응답을 messages에 다시 넣고 있는지 (4) 종료 조건이 맞는지 점검하고 수정본을: [내 루프 코드]
```

`디버깅` `무한루프` `도구 루프`

### 새 도구 하나 추가하기

```text
지금 내 에이전트에 도구 [get_weather, calculate]가 있어. 여기에 [save_note - 텍스트를 메모로 저장]라는 세 번째 도구를 추가하고 싶어. tools 배열 정의, 디스패처 분기, 그리고 이 도구가 마지막 단계에서 호출되도록 유도하는 시스템 프롬프트 한 줄을 함께.
```

`도구 추가` `다중 도구`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! "서울 날씨를 켈빈(K)으로 알려줘"를 같은 get_weather + calculate 도구로 처리해보세요. input과 expr만 바뀔 뿐 루프 구조는 그대로입니다. 도구 루프를 실제로 돌려 STEP 로그와 end_turn 최종 답까지 확인해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| tool_use마다 매번 assistant 응답과 tool_result를 순서대로 짝지어 push했는가 | 5 |
| 최대 반복 횟수 가드를 넣어 무한루프를 막았는가 | 5 |
| 최종 답이 end_turn에서 자연어 한 문장으로 깔끔하게 마무리됐는가 | 5 |

## 관련 개념

- [Multi Tool](/concepts/multi-tool/)
- [Agentic Loop](/concepts/agentic-loop/)
- [Tool Loop](/concepts/tool-loop/)
- [Tool Result](/concepts/tool-result/)
- [Stop Reason](/concepts/stop-reason/)
- [Max Iterations](/concepts/max-iterations/)

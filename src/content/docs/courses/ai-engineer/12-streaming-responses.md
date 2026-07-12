---
title: "스트리밍 응답으로 실시간 출력"
description: "LLM API에서 토큰을 실시간으로 받아 한 글자씩 타이핑되는 화면을 만들고, 도착한 delta 청크를 이어 붙여 최종 텍스트를 조립하는 미니 챗 UI를 완성한다. ChatGPT처럼 답이 즉시 흐르게 해 체감 속도를 확 끌어올린다."
sidebar:
  order: 12
---
_LLM API에서 토큰을 실시간으로 받아 한 글자씩 타이핑되는 화면을 만들고, 도착한 delta 청크를 이어 붙여 최종 텍스트를 조립하는 미니 챗 UI를 완성한다. ChatGPT처럼 답이 즉시 흐르게 해 체감 속도를 확 끌어올린다._

:::note[학습 목표]
- LLM API에서 토큰을 실시간으로 수신해 타이핑 효과로 화면에 뿌린다
- 도착 청크를 파싱해 delta를 추출하고 += 로 누적해 최종 텍스트를 조립한다
- AbortController로 중지 버튼과 에러 처리를 붙여 견고한 미니 챗 UI를 만든다
:::

## 핵심 개념

LLM은 답을 통째로 만든 뒤 건네주는 게 아니라 **토큰(단어 조각)을 하나씩** 생성해요. 스트리밍을 켜면 서버가 그 조각들을 **SSE(Server-Sent Events)** 형식으로 즉시 흘려보내고, 클라이언트는 도착하는 대로 화면에 이어 붙입니다. 전체 생성 시간은 같아도 사용자는 첫 글자를 0.5초 만에 보게 되어 **체감 속도가 극적으로 빨라져요**. 수도꼭지에서 물이 한 방울씩 컵에 차오르는 것과 같아요.

**핵심 3동작:** (1) 스트림 요청 → (2) 도착 청크를 파싱해 delta 텍스트 추출 → (3) 그 delta를 기존 문자열에 누적하며 UI 갱신.

### 왜 이게 될까?

LLM은 답을 통째로 만드는 게 아니라 토큰을 한 조각씩 뱉어냅니다. 스트리밍은 그 조각이 나오는 즉시 SSE로 흘려보내고, 화면은 도착한 delta만 이어 붙이면 돼요. 그래서 **'delta 꺼내서 `+=` 로 누적'** 이 한 동작만 하면, 나머지 실시간 타이핑 연출은 서버와 브라우저가 알아서 해줍니다.

## 👀 따라하기 예시 — 미니 챗 UI에 '스트리밍을 3문장으로 설명해줘' 보내기

한 글자씩 타이핑되는 화면을 만드는 4단계예요.

**① 먼저 `stream:true`로 요청부터**

```js
const res = await fetch(url, { method:'POST', headers, body: JSON.stringify({ model, messages, stream: true }) });
const reader = res.body.getReader();
```

> 💡 `stream:true` 하나만 켜면 서버가 답을 청크 단위로 흘려보내기 시작 — 이게 전부예요.

**② 받은 바이트를 문자열로 바꾸고 줄 단위로 자르기**

```js
for (const line of chunk.split('\n')) {
  if (!line.startsWith('data: ')) continue;
  const payload = line.slice(6);
  if (payload === '[DONE]') break;
}
```

> 💡 TCP는 줄 중간에서 끊어 보낼 수 있어서, 완전한 줄만 골라내는 이 필터가 없으면 파싱이 깨져요.

**③ delta만 꺼내서 full에 누적**

```js
let full = '';
const delta = json.choices?.[0]?.delta?.content || '';
full += delta;
process.stdout.write(delta);
```

> 💡 청크는 '새로 생긴 조각'만 담고 있어요. `full = delta`로 덮어쓰면 이전 글자가 사라지니 반드시 `+=` 로 누적하세요.

**④ 화면에 커서 깜빡임까지 붙여 진짜 챗봇처럼**

```js
outEl.textContent = full + '▍';
outEl.scrollTop = outEl.scrollHeight;
// 스트림 끝나면:
outEl.textContent = full;
```

> 💡 끝에 ▍ 커서를 붙였다 완료 시 떼면 ChatGPT처럼 '지금 답하고 있다'는 느낌이 나요.

좋은 결과의 기준: (1) 텍스트 중복이나 깨짐 없이 매끄럽게 이어 붙는다 (2) 첫 글자가 1초 안에 보인다 (3) `[DONE]` 신호에서 커서가 자연스럽게 사라진다.

## 단계별 따라하기

1. **스트리밍을 눈으로 확인** — OpenAI Playground(또는 Claude/ChatGPT)에 아무 질문이나 던져 답이 '한 글자씩' 흐르는지 관찰. 개발자도구(F12) Network 탭을 열고 같은 요청을 보내면 응답이 `Content-Type: text/event-stream`으로 뜨고 `data: {...}` 줄이 계속 추가되는 걸 확인한다.
2. **스트림 요청 코드 뼈대 받기** — AI에게 첫 템플릿을 붙여 Node.js fetch 기반 최소 예제를 받는다. `stream:true` 옵션과 `res.body`를 `ReadableStream`으로 읽는 부분(`const reader = res.body.getReader();`)이 포함돼야 한다.
3. **청크를 줄 단위로 자르고 `data:` 파싱** — 받은 바이트를 `TextDecoder`로 문자열로 바꾼 뒤 줄바꿈(`\n`)으로 나누고, `'data: '`로 시작하는 줄만 골라 뒤의 JSON을 파싱. `'[DONE]'` 문자열이 오면 종료 신호다.
4. **delta 추출 후 문자열 누적** — 파싱한 JSON에서 새 글자(delta)를 꺼내 `full` 변수에 `+=` 로 이어 붙이고 매번 콘솔이나 화면에 다시 그린다. OpenAI는 `choices[0].delta.content`, Anthropic 스트림은 `delta.text`로 위치가 다르니 확인.
5. **브라우저 타이핑 UI로 옮기기** — 두 번째 템플릿으로 같은 로직을 브라우저용으로 받아, delta가 올 때마다 `<div>`의 `textContent`에 append하고 스크롤을 맨 아래로. 커서 깜빡임(▍)을 끝에 붙였다 완료되면 제거하면 진짜 챗봇 느낌.
6. **중단·에러 처리로 마무리** — `AbortController`를 붙여 '중지' 버튼으로 스트림을 끊고, 네트워크가 끊겨도 지금까지 누적된 `full`은 살아남도록 `try/catch`로 감싼다.

## 흔한 실수 → 교정

- ✗ 청크가 항상 완전한 한 줄로 온다고 가정 → **TCP 조각화 때문에 `data: {"cho`처럼 줄 중간에서 끊겨 올 수 있다.** 디코딩한 조각을 `buffer` 변수에 계속 이어 붙이고, 완전한 줄(`\n` 포함)만 잘라 파싱한 뒤 나머지는 `buffer`에 남겨둔다.
- ✗ delta가 아니라 전체 메시지를 매번 다시 붙여 텍스트가 중복 → **스트림 청크는 '이번에 새로 생긴 조각'만 준다.** `full = delta`가 아니라 `full += delta`로 누적하고, 전체 문자열을 주는 필드와 delta 필드를 혼동하지 말 것.
- ✗ `JSON.parse`를 try 없이 호출해 `[DONE]`이나 빈 줄에서 앱이 죽음 → **`'data: '` 접두어를 확인하고, 값이 `[DONE]`이거나 빈 문자열이면 parse하지 말고 skip/break.** 파싱은 `try/catch`로 감싸 깨진 조각 하나가 전체를 멈추지 않게 한다.

## 도구

- 🛠 **OpenAI Playground** (platform.openai.com/playground) — 스트리밍 응답을 눈으로 관찰.
- 🛠 **브라우저 개발자도구 Network 탭** (F12) — `event-stream` 청크를 실시간 확인.
- 🛠 **Node.js 18+** (nodejs.org) — `fetch` 내장, 스트리밍 실행 환경.
- 🛠 **OpenRouter** (openrouter.ai) — 여러 모델 스트리밍을 한 API로 테스트.

## 실전 프롬프트

### 스트리밍 최소 예제(Node.js)

```text
Node.js 18+ 환경에서 [OpenAI 또는 Anthropic] 채팅 API를 stream:true로 호출하는 최소 스트리밍 예제를. 요구사항: (1) fetch로 요청 (2) res.body의 ReadableStream을 reader로 읽기 (3) TextDecoder로 디코딩 (4) 'data: ' 줄만 파싱해 delta를 process.stdout.write로 실시간 출력 (5) '[DONE]'에서 종료 (6) 마지막에 누적된 full 문자열을 콘솔 출력. 주석을 한국어로. 모델은 [모델명], 질문은 [스트리밍을 설명해줘].
```

> 확인된 작성 예시 없음

`프롬프트` `스트리밍` `Node.js`

### 브라우저 타이핑 UI

```text
바닐라 HTML+JS 한 파일로 LLM 스트리밍 챗 UI를 만들어줘. 입력창+전송버튼+출력 div. delta가 올 때마다 출력 div에 append하고 끝에 커서 '▍'를 붙였다가 완료되면 제거. 스크롤은 항상 맨 아래. API는 [내 백엔드 /api/chat 엔드포인트]가 event-stream을 반환한다고 가정. 코드에 한국어 주석.
```

> 확인된 작성 예시 없음

`프롬프트` `스트리밍` `UI`

### 중단·에러 견고화

```text
아래 내 스트리밍 코드에 AbortController 기반 '중지' 버튼과 에러 처리를 추가해줘. 요구사항: 중지 시 지금까지 받은 텍스트는 화면에 유지, 네트워크 에러 시 사용자에게 '연결이 끊겼어요' 메시지 표시하되 누적 full은 보존, 재시도 버튼 제공. 내 코드: [코드]
```

> 확인된 작성 예시 없음

`프롬프트` `에러처리` `AbortController`

### provider별 delta 위치 확인

```text
[OpenAI Chat Completions / Anthropic Messages / OpenRouter] 스트리밍 응답에서 실제 새 텍스트 조각(delta)이 JSON의 어느 경로에 들어있는지, 종료 신호는 무엇인지 표로. 각 provider의 예시 청크 JSON도 하나씩.
```

> 확인된 작성 예시 없음

`프롬프트` `delta` `provider`

## 직접 만들기 (미션)

:::tip
질문을 '스트리밍을 3문장으로 설명해줘' 대신 '오늘 저녁 메뉴 추천해줘'로 바꿔서 위와 똑같은 4단계(요청→줄 파싱→delta 누적→화면 그리기)로 타이핑 효과 미니 챗을 완성하세요. 이번엔 AbortController로 '중지' 버튼도 추가해 스트림 도중에 끊어보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| delta를 full에 덮어쓰지 않고 += 로 제대로 누적했나 | 5 |
| 중지 버튼을 눌러도 에러 없이 지금까지의 답이 화면에 남아있나 | 5 |
| [DONE] 신호가 와도 JSON.parse가 죽지 않고 깔끔히 멈추나 | 5 |

## 관련 개념

- [Streaming](/concepts/streaming/)
- [Sse](/concepts/sse/)
- [Server Sent Events](/concepts/server-sent-events/)
- [Delta](/concepts/delta/)
- [Typing Effect](/concepts/typing-effect/)
- [Abort Controller](/concepts/abort-controller/)
- [Chunk Parsing](/concepts/chunk-parsing/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-engineer) · 방식: authenticated-crawl</sub>
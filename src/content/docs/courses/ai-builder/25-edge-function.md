---
title: "Edge Function으로 서버 로직"
description: "클라이언트에 두면 F12 한 번에 털리는 비밀 키를 Supabase Edge Function 서버 함수로 옮겨 Secrets에 숨기고, 브라우저는 함수 주소만 호출하게 만들어 API를 안전하게 실행한다."
sidebar:
  order: 25
---
_클라이언트에 두면 F12 한 번에 털리는 비밀 키를 Supabase Edge Function 서버 함수로 옮겨 Secrets에 숨기고, 브라우저는 함수 주소만 호출하게 만들어 API를 안전하게 실행한다._

:::note[학습 목표]
- 비밀 키를 브라우저에 노출하지 않고 Supabase Edge Function의 Secrets에 안전하게 숨긴다
- 질문을 받아 OpenAI를 호출하고 답만 반환하는 Edge Function을 직접 배포한다
- 앱에서 supabase.functions.invoke로 그 함수를 불러 결과를 화면에 표시한다
:::

## 핵심 개념

브라우저에서 실행되는 프론트엔드 코드는 **F12 개발자도구나 네트워크 탭에서 누구나 그 안의 값을 볼 수 있는 유리 상자**예요. 그래서 OpenAI 키, 결제 시크릿, DB 관리자 권한 같은 비밀은 **절대 클라이언트에 두면 안 됩니다**. Edge Function은 Supabase가 전 세계 서버에서 대신 돌려주는 작은 서버 함수로, 비밀 키는 서버의 환경변수(Secrets)에 숨겨두고 브라우저는 그 함수의 **주소만** 호출해요. 식당에서 손님이 주방에 직접 들어가지 않고 주문서만 넘기면 요리가 나오는 것과 같아요. 무거운 처리(AI 호출, 이미지 변환, 외부 결제)도 서버로 옮기면 키도 숨고 브라우저도 가벼워집니다.

### 왜 이게 될까?

브라우저 코드는 F12만 누르면 누구나 열어볼 수 있는 유리 상자예요. 비밀 키는 그 안에 두면 안 되고, 대신 Supabase가 대신 돌려주는 작은 서버(Edge Function)의 **잠긴 서랍(Secrets)**에 넣어둡니다. 브라우저는 그 서버의 주소만 부르고, 진짜 열쇠는 서버 안에서만 조용히 쓰여요. "무엇을 물어볼지"만 정하면 키를 안전하게 지키는 일은 Edge Function이 대신 해줍니다.

## 👀 따라하기 예시 — AI 질문 앱의 OpenAI 키를 Edge Function으로 옮기기

**① F12 → Sources 탭에서 sk- 검색** `sk-proj-abc123...F9x` 문자열이 코드에 그대로 노출됨을 확인
> 💡 문제를 눈으로 직접 봐야 왜 옮기는지 체감돼요.

**② AI에게 함수 요청** "ask-ai라는 이름으로 질문 받아 OpenAI 호출하고 답만 돌려주는 Deno Edge Function 짜줘"

```ts
serve(async (req) => {
  const { question } = await req.json();
  const key = Deno.env.get("OPENAI_API_KEY");
  // ...
  return new Response(JSON.stringify({ answer }));
});
```
> 💡 코드 안 어디에도 진짜 키 문자열이 없다는 게 핵심이에요.

**③ 대시보드 Manage secrets에 등록** Secrets 목록에 `OPENAI_API_KEY = ●●●●●●●●` 항목 추가(값은 화면에 다시 안 보임)
> 💡 키가 코드가 아니라 서버 설정에만 존재해요.

**④ 배포하고 프론트에서 호출** `supabase functions deploy ask-ai` 실행 후 `supabase.functions.invoke("ask-ai", {body:{question}})` 호출 → Logs 탭에 200 OK, 실행시간 320ms, 응답 `{ answer: "..." }` 기록
> 💡 브라우저 Network 탭을 다시 봐도 이번엔 키가 전혀 안 보여요.

좋은 결과의 기준: (1) F12로 아무리 뒤져도 API 키 문자열이 안 보인다 (2) Logs에 정상 200 응답이 찍힌다 (3) 잘못된 입력(빈 값, 너무 긴 텍스트)은 400으로 거절된다.

## 단계별 따라하기

1. **왜 서버로 옮겨야 하는지 5초 만에 증명하기** — 웹앱을 브라우저에서 열고 F12 → Network 탭 → 아무 요청이나 클릭 → Headers/Response. 프론트 코드에 API 키를 하드코딩했다면 Sources 탭에서 Ctrl+F로 키가 그대로 보이는지 확인. (`sk-` 검색 → `sk-proj-abc123...`)
2. **Edge Function 뼈대 만들기** — 대시보드 → Edge Functions → Deploy a new function을 누르고 이름을 지음. 또는 로컬에서 CLI로 `supabase functions new 이름`. 뭘 만들지 애매하면 AI에게 목적을 설명하고 Deno 기반 Edge Function 코드를 요청. (함수명: `ask-ai`)
3. **비밀 키를 Secrets에 숨기기** — 대시보드 → Edge Functions → Manage secrets(또는 Project Settings의 Edge Functions Secrets)에서 키를 등록. CLI라면 `supabase secrets set OPENAI_API_KEY=sk-...`. 코드 안에는 절대 키를 쓰지 말고 `Deno.env.get`으로만 읽음. (`const key = Deno.env.get("OPENAI_API_KEY")`)
4. **배포하고 브라우저 대신 서버가 키를 쓰게 하기** — `supabase functions deploy ask-ai`를 실행하거나 대시보드에서 Deploy. 배포되면 함수 URL이 나옴. 함수 안에서 `fetch`로 OpenAI 등 외부 API를 호출하고, 응답에서 필요한 부분만 골라 클라이언트로. (서버가 OpenAI를 부르고 `{ answer: "..." }`만 반환 → 브라우저는 키를 영원히 못 봄)
5. **앱에서 함수 호출하기** — 프론트엔드에서 `supabase.functions.invoke("함수명", { body: {...} })`로. anon 키는 공개돼도 되는 값이므로 클라이언트에 남겨도 안전. 응답을 받아 화면에 뿌림. (`const { data } = await supabase.functions.invoke("ask-ai", { body: { question: "..." } });` → `data.answer`)
6. **남용 막고 로그로 검증하기** — 함수 안에서 요청 검증(빈 입력 거부, 길이 제한)과 필요하면 사용자 인증 체크. 배포 후 대시보드 → Edge Functions → Logs에서 실제 호출 로그와 에러를 확인. (`if (!question || question.length > 500) return new Response("bad request", { status: 400 });`)

## 흔한 실수 → 교정

- ✗ "env에 넣었으니 안전하겠지" 하고 .env 파일의 키를 프론트엔드 빌드(`NEXT_PUBLIC_`, `VITE_` 접두사 등)에 넣음 → **`NEXT_PUBLIC_`/`VITE_` 접두사가 붙은 값은 브라우저 번들에 그대로 들어가 노출됩니다.** 비밀 키는 접두사 없이 Edge Function의 Secrets에만 저장하고 `Deno.env.get`으로 서버에서만 읽어요.
- ✗ CORS 헤더를 빼먹어서 브라우저에서 호출하면 'blocked by CORS policy' 에러 → **함수에 `Access-Control-Allow-Origin` 헤더를 넣고, OPTIONS(preflight) 요청에 200으로 응답하는 분기를 추가.** `supabase.functions.invoke`를 쓰면 상당 부분 자동 처리되지만 직접 `fetch`할 땐 반드시 넣어야 해요.
- ✗ 입력 검증 없이 함수를 열어둬 누군가 무한정 호출하고, AI 호출 비용이 폭발 → **입력 길이/형식 검증을 넣고, 로그인 사용자만 쓰게 JWT를 확인하거나 요청 빈도를 제한.** Logs에서 이상 호출을 주기적으로 확인해요.

## 도구

- 🛠 **Supabase Edge Functions** (supabase.com/docs/guides/functions) — 서버 함수 배포·Secrets·Logs.
- 🛠 **Supabase CLI** (supabase.com/docs/guides/cli) — `functions new`/`deploy`, `secrets set` 명령.
- 🛠 **Deno Deploy 문서** (docs.deno.com) — Edge Function 런타임(`Deno.env`, `serve`) 이해.
- 🛠 **ChatGPT·Claude** (claude.ai) — 함수 코드 생성·키 노출 점검·에러 디버깅.

## 실전 프롬프트

### Edge Function 코드 생성(가장 먼저)

```text
Supabase Edge Function(Deno, TypeScript)을 작성해줘. 목적: [무엇을 하는 함수인지, 예: 사용자 질문을 받아 OpenAI에 물어보고 답만 반환]. 요구사항: (1)비밀 키는 코드에 넣지 말고 Deno.env.get("[환경변수명]")으로 읽기 (2)CORS 헤더 포함해 브라우저에서 호출 가능하게 (3)잘못된 입력은 400으로 거부 (4)외부 API 응답에서 [필요한 필드]만 골라 JSON으로 반환. 전체 코드와 배포 명령어까지.
```

> 확인된 작성 예시 없음

`Edge Function` `코드 생성` `Deno`

### 키 노출 위험 점검

```text
내 프론트엔드 코드를 붙여넣을게. 브라우저에 노출되면 안 되는 비밀 키/시크릿이 하드코딩돼 있는지 찾아주고, 각각을 Supabase Edge Function으로 옮기는 방법을 우선순위 순으로. 코드: [붙여넣기]
```

> 확인된 작성 예시 없음

`보안` `키 노출` `점검`

### 함수 호출 코드 만들기

```text
Supabase JS 클라이언트로 [함수명] Edge Function을 호출하는 프론트엔드 코드를. body로 [보낼 데이터]를 넘기고, 응답의 [필드]를 받아 화면에 표시. 로딩 상태와 에러 처리도. 프레임워크는 [React/바닐라JS 등].
```

> 확인된 작성 예시 없음

`함수 호출` `프론트엔드` `invoke`

### 에러 디버깅

```text
Supabase Edge Function을 호출했더니 다음 에러가 났어: [에러 메시지]. Logs에 찍힌 내용은: [로그]. 원인과 수정 방법을 단계별로. CORS, 환경변수 누락, 인증 문제 중 무엇인지도.
```

> 확인된 작성 예시 없음

`디버깅` `에러` `CORS`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! '질문 답변'이 아니라 '입력한 문장을 요약해주는' Edge Function을 직접 만들어보세요. 이름은 `summarize-text`로 짓고, 위 4단계(뼈대 만들기 → Secrets 등록 → 배포 → 앱에서 호출)를 그대로 따라가면 됩니다.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| F12 Sources에서 검색해도 API 키가 안 보이는가? | 5 |
| Logs 탭에서 실제 호출이 200으로 찍히는가? | 5 |
| 빈 텍스트나 너무 긴 텍스트를 넣으면 400으로 거절되는가? | 5 |

## 관련 개념

- [Edge Function](/concepts/edge-function/)
- [Serverless](/concepts/serverless/)
- [Secrets](/concepts/secrets/)
- [Api Key Security](/concepts/api-key-security/)
- [Deno](/concepts/deno/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
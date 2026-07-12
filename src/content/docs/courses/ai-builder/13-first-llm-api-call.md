---
title: "LLM API 첫 호출하기"
description: "API 키를 발급받아 코드에서 Claude 모델에 요청을 보내고 응답을 화면에 출력하는 20줄짜리 최소 예제를 만든다. ChatGPT 화면에 타이핑하는 대신 내 코드가 직접 AI에게 말을 걸고 대답을 받아온다."
sidebar:
  order: 13
---
_API 키를 발급받아 코드에서 Claude 모델에 요청을 보내고 응답을 화면에 출력하는 20줄짜리 최소 예제를 만든다. ChatGPT 화면에 타이핑하는 대신 내 코드가 직접 AI에게 말을 걸고 대답을 받아온다._

:::note[학습 목표]
- API 키로 Claude 모델에 요청을 보내고 그 응답을 화면에 출력하는 20줄짜리 프로그램을 직접 실행한다
- API 키를 .env에 안전하게 저장하고 코드에서는 환경변수로 읽어 노출을 막는다
- 코드의 질문(content)과 max_tokens를 바꿔 나만의 요청으로 확장한다
:::

## 핵심 개념

LLM API는 '내 프로그램이 AI에게 전화를 거는 전화선'이에요. 우리가 웹에서 ChatGPT에 질문하는 것과 똑같은 일을, 사람이 아니라 코드가 대신 합니다. 원리는 단순해요 — 요청(내 질문 + API 키)을 인터넷 주소로 보내면 서버가 모델을 돌려 답(응답)을 JSON으로 돌려줘요. **API 키는 '이 요청은 내 계정이 보낸 것'임을 증명하는 비밀번호**라 절대 남에게 보이면 안 됩니다. 이 최소 예제 하나를 손에 넣으면 챗봇·자동요약·번역기 등 앞으로 만들 모든 AI 앱이 이 한 조각의 확장일 뿐임을 알게 돼요.

### 왜 이게 될까?

AI 모델은 인터넷 저편의 거대한 컴퓨터 안에 있고, API는 그 컴퓨터로 통하는 전화선이에요. `client.messages.create()`를 호출하면 '질문 + API 키'가 인터넷을 타고 서버로 가고, 서버는 모델을 돌려 답을 JSON으로 돌려줘요. **'무엇을 물을지'만 코드로 적으면 '어떻게 대답할지'는 전부 AI가** 알아서 합니다.

## 👀 따라하기 예시 — .env에 키를 넣고 app.mjs를 만든 뒤 실행해 첫 응답 받기

**① 터미널에 `node app.mjs` 입력** → 아직 아무것도 안 뜸, 몇 초 대기 중.
> 💡 코드가 실행되면 먼저 인터넷으로 요청부터 보내요. 이 몇 초가 바로 API가 실제로 통신하는 순간.

**② dotenv가 .env의 키를 읽어 client 생성** → 에러 없이 조용히 통과(성공하면 원래 티가 안 남).
> 💡 키가 틀리면 여기서 401 에러가 바로 떠요. 조용히 넘어갔다는 건 '내 계정 확인 완료' 도장을 받은 것.

**③ messages.create가 질문을 서버로 전송** → content: '초등학생도 이해하게 API가 뭔지 3문장으로 설명해줘'.
> 💡 우리가 보낸 건 딱 이 한 줄. 나머지 문법은 다 '봉투 포장'일 뿐, 진짜 알맹이는 이 질문 한 문장.

**④ `console.log(res.content[0].text)` 실행** → 화면에 답 출력.
> 💡 바로 이 순간! 화면에 글자가 뜨는 게 '내 코드가 진짜로 AI와 대화했다'는 증거 — ChatGPT 창을 거치지 않고.

좋은 결과의 기준: (1) 에러 없이 답이 뜬다 (2) 내가 보낸 질문과 맥락이 맞는 답이다 (3) 키가 코드에 안 보이고 .env에만 있다.

## 단계별 따라하기

1. **준비물 확인** — 컴퓨터에 Node.js가 깔려 있는지 확인. 터미널(맥은 터미널, 윈도우는 PowerShell)에서 `node -v`를 입력해 v18 이상 버전이 나오면 OK. 안 나오면 nodejs.org에서 LTS 설치.
2. **API 키 발급받기** — console.anthropic.com 가입/로그인 → 왼쪽 메뉴 API Keys → Create Key → 이름(예: my-first-app) 입력 후 생성. `sk-ant-`로 시작하는 문자열을 복사해 메모장에 잠깐 둔다. 이 키는 생성 직후에만 전체가 보이니 꼭 복사. (실제 키는 절대 캡처·공유 금지)
3. **프로젝트 폴더 만들고 키를 안전하게 저장** — 바탕화면에 `first-ai` 폴더를 만들고 터미널에서 그 폴더로 이동한 뒤, 키를 코드에 직접 쓰지 말고 환경변수 파일 `.env`에 저장. `npm init -y`와 `npm install @anthropic-ai/sdk dotenv`로 SDK 설치.

```
# .env (한 줄)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

4. **20줄짜리 첫 호출 코드 작성** — `app.mjs` 파일을 만들고 예제를 그대로 붙여넣는다. 모델 이름·질문 내용만 이해하고 나머지는 뼈대로 둔다.

```javascript
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const res = await client.messages.create({
  model: 'claude-3-5-haiku-latest',
  max_tokens: 300,
  messages: [
    { role: 'user', content: '초등학생도 이해하게 API가 뭔지 3문장으로 설명해줘' }
  ]
});
console.log(res.content[0].text);
```

5. **실행하고 응답을 눈으로 확인** — `node app.mjs`. 몇 초 뒤 AI가 만든 문장이 화면(콘솔)에 출력되면 첫 API 호출 성공. 에러가 나면 아래 흔한 실수부터 확인.
6. **질문을 바꿔 나만의 것으로** — `messages` 안의 `content` 문장을 내가 궁금한 다른 질문으로 바꾸고 다시 실행. `max_tokens` 숫자를 늘리면 더 긴 답, 줄이면 더 짧은 답. '질문을 코드로 바꿔 보내는' 감각이 앞으로 만들 모든 AI 앱의 핵심.

## 흔한 실수 → 교정

- ✗ API 키를 코드(app.mjs)에 직접 문자열로 박아넣고 깃허브에 올려버림 → **키는 반드시 .env 파일에 넣고 코드에서는 환경변수로 읽는다. .gitignore에 .env를 추가.** 이미 노출됐다면 콘솔에서 그 키를 즉시 삭제(revoke)하고 새로 발급.
- ✗ 401 authentication_error가 떠서 코드가 잘못된 줄 앎 → **대부분 키 문제.** .env의 키에 공백·따옴표·줄바꿈이 섞였는지, 변수명이 정확히 `ANTHROPIC_API_KEY`인지 확인. 코드 맨 위에 `import 'dotenv/config'`가 있어야 .env가 읽힘.
- ✗ model 이름을 대충 적거나 옛 이름을 써서 not_found_error → **모델 이름은 오타에 민감.** 예제의 `claude-3-5-haiku-latest`처럼 최신 문서에 나온 정확한 ID를 복사. 확실치 않으면 콘솔 문서의 Models 페이지에서 현재 유효한 이름을 확인.

## 도구

- 🛠 **Node.js** (nodejs.org) — 코드를 실행하는 런타임(LTS 설치).
- 🛠 **Anthropic Console** (console.anthropic.com) — API 키 발급·사용량 확인.
- 🛠 **Anthropic SDK** (@anthropic-ai/sdk, npm) — 몇 줄로 API를 호출하게 해주는 공식 라이브러리.
- 🛠 **VS Code** (code.visualstudio.com) — .env·app.mjs 편집용 코드 에디터.

## 실전 프롬프트

### 예시 질문(그대로 보내보기)

```text
초등학생도 이해하게 API가 뭔지 3문장으로 설명해줘
```

> 확인된 작성 예시 없음

`프롬프트` `예시`

### 실행 에러 붙여넣고 해결받기

```text
나는 Node.js로 Anthropic Claude API를 처음 호출하는 중이야. 아래는 내 app.mjs 코드와 터미널에 뜬 에러 전문이야. 초보자가 이해할 수 있게 원인 한 줄 요약 + 정확히 어디를 어떻게 고칠지 단계로 알려줘. [내 코드 붙여넣기] [에러 메시지 붙여넣기]
```

> 확인된 작성 예시 없음

`프롬프트` `에러` `디버깅`

### 내 언어/프레임워크로 예제 변환

```text
아래 Node.js Anthropic Claude API 최소 호출 예제를 [Python / 내가 쓰는 언어]로 똑같이 동작하게 바꿔줘. API 키는 코드에 직접 쓰지 말고 환경변수에서 읽도록 하고, 설치 명령어와 실행 명령어도 함께 알려줘. [예제 코드 붙여넣기]
```

> 확인된 작성 예시 없음

`프롬프트` `변환` `언어`

### 응답 JSON 구조 설명받기

```text
Anthropic messages.create가 돌려주는 응답 객체의 구조를 초보자용으로 설명해줘. 특히 res.content[0].text가 왜 그렇게 접근하는지, content가 배열인 이유가 뭔지, 답 텍스트만 안전하게 꺼내는 코드도 알려줘.
```

> 확인된 작성 예시 없음

`프롬프트` `JSON` `응답`

### 다음 단계로 확장 아이디어

```text
나는 방금 Claude API 첫 호출(질문 보내고 답 출력)에 성공했어. 이 20줄 예제를 조금씩 키워서 만들 수 있는 작은 프로젝트 5개를 난이도 순으로 추천하고, 각각 무엇을 추가로 배우면 되는지 한 줄씩 알려줘.
```

> 확인된 작성 예시 없음

`프롬프트` `확장` `프로젝트`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! app.mjs를 열어 messages의 content를 '요즘 초등학생 사이에서 유행하는 놀이 3가지 추천해줘'처럼 완전히 다른 질문으로 바꾸고, max_tokens도 300에서 500으로 늘린 뒤 다시 node app.mjs로 실행해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 내가 바꾼 질문에 맞는 답이 나왔나 | 5 |
| max_tokens를 늘렸을 때 답이 실제로 더 길어졌나 | 5 |
| .env 파일을 안 건드리고도 새 질문에 답을 받을 수 있었나 | 5 |

## 관련 개념

- [Llm Api](/concepts/llm-api/)
- [Api Key](/concepts/api-key/)
- [Anthropic Sdk](/concepts/anthropic-sdk/)
- [Environment Variable](/concepts/environment-variable/)
- [Json Response](/concepts/json-response/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
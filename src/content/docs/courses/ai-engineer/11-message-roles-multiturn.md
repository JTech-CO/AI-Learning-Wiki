---
title: "메시지 역할과 멀티턴 대화"
description: "system·user·assistant 세 역할과 messages 배열로 대화 맥락을 쌓고 유지해, 바로 앞 대화를 기억하는 멀티턴 챗봇의 뼈대를 만든다. \"방금 뭐라고 했지?\"를 기억하는 정체가 바로 이 messages 배열이다."
sidebar:
  order: 11
---
_system·user·assistant 세 역할과 messages 배열로 대화 맥락을 쌓고 유지해, 바로 앞 대화를 기억하는 멀티턴 챗봇의 뼈대를 만든다. "방금 뭐라고 했지?"를 기억하는 정체가 바로 이 messages 배열이다._

:::note[학습 목표]
- system·user·assistant 세 역할로 messages 배열을 직접 쌓아 이전 대화를 기억하는 멀티턴 챗봇을 만든다
- role은 system/user/assistant 세 가지뿐이며, 새 메시지는 언제나 배열 "끝"에 append함을 이해한다
- system 프롬프트로 AI의 성격·규칙을 정하고, system만 바꿔 대화 전체 톤이 달라지는 것을 실험한다
:::

## 핵심 개념

LLM은 사실 **기억력이 없어요.** 매번 요청할 때마다 지금까지의 대화 전체를 **messages 배열**로 통째로 다시 보내줘야 맥락을 이어갑니다. 이 배열의 각 항목은 **role(역할)**과 **content(내용)**를 가지며, role은 딱 세 가지예요: **system**(앱의 성격·규칙을 정하는 감독), **user**(사람의 말), **assistant**(AI의 답). 대화가 한 번 오갈 때마다 user 메시지와 assistant 답변을 배열 끝에 계속 append 하면, AI는 "방금 전 맥락"을 그대로 유지합니다. 카톡 대화창을 통째로 복사해서 매번 다시 보여주는 것과 똑같은 원리예요.

### 흐름

메모장에 배열 하나를 열어 **system 1개**로 시작 → 사용자가 말하면 **user**를 배열 끝에 붙이고 → AI가 답하면 **assistant**를 또 끝에 붙인다 → 다음 턴에는 이 배열 **전체**를 다시 보낸다. 이 append의 반복이 곧 대화형 앱의 뼈대예요.

### 왜 이게 될까?

AI는 사실 매번 "리셋"되는 금붕어예요. 그런데 왜 대화를 기억하는 것처럼 보일까요? 앱이 지금까지 나눈 대화 전체를 messages 배열에 차곡차곡 담아서 **매 요청마다 통째로 다시 보내주기 때문**이에요. AI 입장에서는 "새로 받은 긴 편지"를 읽는 것뿐인데, 우리 눈에는 "기억력 좋은 친구"처럼 보이는 거죠.

## 👀 따라하기 예시 — 힌트만 주는 초등 수학 튜터 챗봇

**① 감독(system)부터 배열에 넣기**

```json
[{"role":"system","content":"너는 친절한 초등 수학 튜터야. 답을 바로 주지 말고 힌트부터 줘."}]
```

> 💡 system은 대화 시작 전에 딱 1번, AI의 성격·규칙을 정하는 자리. 여기가 흔들리면 대화 전체 톤이 무너져요.

**② 사용자 질문(user)을 배열 끝에 append**

```json
[...system, {"role":"user","content":"1/2 더하기 1/3이 뭐야?"}]
```

> 💡 user는 사람이 한 말. 새 메시지는 항상 배열 "맨 끝"에 붙여요 — 순서가 곧 대화 흐름.

**③ AI 답(assistant)도 똑같이 append**

```json
[..., {"role":"assistant","content":"바로 답하기 전에, 분모를 6으로 맞추면 어떻게 될까?"}]
```

> 💡 AI 답변도 배열에 저장해야 다음 턴에서 "방금 그 얘기" 맥락을 이어갈 수 있어요. 이게 기억의 정체.

**④ 두 번째 턴 이어붙이고 통째로 재전송**

```json
[system, user1, assistant1, {"role":"user","content":"그럼 3/6 더하기 2/6이니까 5/6?"}]
```

→ AI: "정답이야, 5/6!"

> 💡 4개짜리 배열 전체를 다시 보냈기 때문에, AI가 "분모 6으로 맞추자"고 했던 자기 말을 참고해 정답을 확인해요.

좋은 결과의 기준: (1) role이 system/user/assistant 세 가지만 정확히 쓰였다 (2) system은 맨 앞에 딱 1개뿐이다 (3) 새 메시지는 항상 배열 끝에 추가되어 순서가 실제 대화 흐름과 일치한다.

## 단계별 따라하기

1. **세 역할을 손으로 써보기** — 메모장을 열고 messages 배열을 JSON으로 직접 타이핑. system 1개, user 1개로 시작. role과 content 키만 있으면 된다. (예: `[{"role":"system","content":"너는 친절한 초등 수학 튜터야. 답을 바로 주지 말고 힌트부터 줘."}, {"role":"user","content":"7 곱하기 8이 뭐야?"}]`)
2. **assistant 답을 배열에 붙이기** — AI의 답변을 받았다고 상상하고 그 답을 role이 assistant인 항목으로 배열 맨 끝에 추가. 이게 바로 '기억 저장'. (`{"role":"assistant","content":"바로 답하기 전에, 7을 8번 더하면 될까? 7+7은 얼마일까?"}`)
3. **두 번째 턴 이어붙이기** — 사용자가 다시 말한 내용을 user 항목으로 또 배열 끝에 추가. 배열이 system→user→assistant→user 순서로 4개. 이 순서가 곧 대화 흐름. (`{"role":"user","content":"14! 그럼 답이 56이야?"}` → 이제 AI는 앞의 힌트 맥락을 알고 "맞아, 56이야!")
4. **실제로 호출해보기** — OpenAI Playground(무료 체험) 또는 Google AI Studio에 접속해 Chat 모드로, System 칸에 감독 지시를 넣고 대화를 몇 번 주고받는다. '이전 답을 기억하나?' 테스트 질문으로 확인. (System: '너는 한 단어로만 답하는 로봇이야.' / User: '가장 큰 행성은?' → '목성.' / User: '방금 뭐라고 했어?' → '목성.')
5. **system 프롬프트로 성격 바꾸기** — 같은 대화 내용에서 system만 바꿔가며 AI 성격이 어떻게 달라지는지 실험. system이 전체 대화의 톤·규칙을 지배함을 눈으로 확인. (system을 '너는 반말하는 무뚝뚝한 삼촌이야'로 바꾸면 같은 질문에도 답투가 확 달라진다.)
6. **대화가 길어질 때 대비** — 배열이 계속 길어지면 토큰 한도를 넘는다. 오래된 메시지를 잘라내거나 요약해 앞쪽에 넣는 전략. system은 항상 유지하는 게 핵심. (20턴이 넘으면: system 유지 + 최근 6개 메시지만 남기고, 그 앞 대화는 '지금까지 사용자는 분수 나눗셈을 배우는 중'처럼 한 줄 요약으로 압축.)

## 흔한 실수 → 교정

- ✗ 매 요청마다 이전 대화를 안 보내고 새 질문만 보냄 → **LLM은 기억이 없다. 지금까지의 messages 배열 전체를 매번 다시 보내야 맥락이 이어진다.** 앱에서 배열을 변수에 계속 쌓아두고 통째로 전송.
- ✗ role 이름을 'ai', 'bot', '사용자'처럼 마음대로 씀 → **role은 정확히 system·user·assistant 세 가지뿐.** 오타나 다른 이름을 쓰면 API가 거부. content에만 자유롭게 쓰고 role 값은 규격을 지켜라.
- ✗ system 프롬프트를 대화 중간에 넣거나 여러 개 넣음 → **system은 보통 배열 맨 앞에 1개만.** 규칙을 바꾸고 싶으면 새 system을 끼우지 말고 기존 system 내용을 수정하거나 user 메시지로 지시.

## 도구

- 🛠 **OpenAI Playground** (platform.openai.com/playground) — Chat 모드로 messages 배열·system 실험.
- 🛠 **Google AI Studio** (aistudio.google.com) — 무료로 멀티턴 대화·system 지시 테스트.
- 🛠 **JSON Formatter** (jsonformatter.org) — 내 배열 JSON 문법 오류 점검.
- 🛠 **ChatGPT · Claude** (claude.ai) — 배열 설계·검토·요약 압축 도우미.

## 실전 프롬프트

### 멀티턴 대화 배열 만들기(가장 유용)

```text
아래 상황으로 LLM API에 보낼 messages 배열을 JSON으로 만들어줘. system 1개 + user/assistant가 번갈아 3턴. 각 role의 역할을 주석으로 짧게.
- 앱 종류: [여행 일정 도우미]
- AI 성격/규칙: [존댓말, 항상 예산을 먼저 물어봄]
- 사용자 첫 질문: [질문]
```

> 확인된 작성 예시 없음

`프롬프트` `messages 배열` `멀티턴`

### 내 배열 검토받기

```text
내가 만든 messages 배열이야. role 순서나 구조에 문제가 있는지, 멀티턴 맥락이 제대로 이어지는지 점검하고 고칠 점을 알려줘.
[내 JSON 배열]
```

> 확인된 작성 예시 없음

`프롬프트` `점검`

### system 프롬프트 3버전 비교

```text
[앱 목적]을 위한 챗봇의 system 프롬프트를 성격이 뚜렷이 다른 3가지 버전으로(예: 엄격한/친근한/유머러스한) 만들어줘. 각 버전이 같은 사용자 질문 "[질문]"에 어떻게 답할지 예시 답변도 하나씩.
```

> 확인된 작성 예시 없음

`프롬프트` `system 프롬프트` `비교`

### 긴 대화 요약 압축

```text
아래는 길어진 messages 배열이야. 토큰을 아끼기 위해 오래된 앞부분을 "핵심 맥락 한두 줄"로 요약해서 system 다음에 넣을 요약 메시지를 만들어줘. 최근 6개 메시지는 그대로.
[긴 배열]
```

> 확인된 작성 예시 없음

`프롬프트` `요약` `토큰`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! "영어 단어를 퀴즈로 내주는 챗봇"의 messages 배열을 처음부터 손으로 만들어보세요. system 1개(성격 지정) → user 1개(퀴즈 요청) → assistant 1개(퀴즈 출제) → user 1개(정답 시도) 순서로 4개 항목을 JSON으로 직접 작성합니다.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| system이 배열 맨 앞에 딱 1개만 있나? | 5 |
| role 값이 system/user/assistant 세 가지 철자를 정확히 지켰나(ai, bot 같은 오타 없이)? | 5 |
| 새 메시지를 배열 앞이 아니라 반드시 "끝"에 추가했나? | 5 |

## 관련 개념

- [Messages Array](/concepts/messages-array/)
- [System Prompt](/concepts/system-prompt/)
- [User Role](/concepts/user-role/)
- [Assistant Role](/concepts/assistant-role/)
- [Multi Turn](/concepts/multi-turn/)
- [Conversation Context](/concepts/conversation-context/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-engineer) · 방식: authenticated-crawl</sub>
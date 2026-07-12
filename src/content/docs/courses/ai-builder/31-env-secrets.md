---
title: "환경변수와 시크릿 관리"
description: "API 키를 코드에 박지 않고 .env 파일과 배포 환경변수로 분리해, 코드를 깃허브에 올려도 비밀값이 새지 않게 안전하게 다루는 법을 익힌다."
sidebar:
  order: 31
---
_API 키를 코드에 박지 않고 .env 파일과 배포 환경변수로 분리해, 코드를 깃허브에 올려도 비밀값이 새지 않게 안전하게 다루는 법을 익힌다._

:::note[학습 목표]
- API 키를 코드에서 완전히 분리해 .env 파일과 배포 환경변수로 관리한다
- .gitignore로 .env를 깃허브에서 차단해 실수로 올려도 키가 새지 않게 만든다
- 코드는 process.env로 이름만 불러오게 바꿔 공개해도 안전한 상태로 만든다
:::

## 핵심 개념

API 키는 '내 신용카드 비밀번호'와 같아요. 코드 안에 `sk-abc123...`처럼 직접 적어두면(하드코딩), 그 코드를 공유하거나 깃허브에 올리는 순간 전 세계에 비밀번호를 공개하는 셈이에요. 그래서 개발자들은 키 같은 비밀값을 코드가 아니라 **`.env`라는 별도 파일**이나 배포 서버의 **'환경변수'**에 넣어두고, 코드는 그 값을 **이름으로만** 불러와요(예: `process.env.OPENAI_API_KEY`). 이렇게 하면 코드는 공개해도 되고, 실제 비밀값은 내 컴퓨터와 서버에만 남아요. 핵심 규칙 하나: **`.env` 파일은 절대 깃허브에 올리지 않는다.**

### 왜 이게 될까?

`.env`는 자물쇠, `.gitignore`는 그 자물쇠를 아무도 못 보게 가리는 커튼이에요. 코드는 "이름"만 부르고(`process.env.KEY`) 진짜 값은 항상 파일 안에만 있으니, 코드를 통째로 공개해도 열쇠는 절대 딸려 나가지 않아요. 코드 짜는 데만 집중하면 키 보안은 이 구조가 대신 해줘요.

## 👀 따라하기 예시 — 하드코딩된 키를 깃허브에 올리기 전에 정리

`app.js` 안에 `const apiKey = "sk-proj-8Xf2...";` 이렇게 키가 그대로 박힌 걸 올리기 전에 정리하는 과정이에요.

**① "sk-" 검색으로 위치 확인** 에디터에서 Ctrl+Shift+F로 `sk-` 검색 → `app.js:12 const apiKey = "sk-proj-8Xf2...";` (1 result in 1 file)
> 💡 하드코딩된 키가 딱 하나, 정확히 어디 있는지부터 눈으로 확인해야 놓치지 않아요.

**② .env 파일로 값 이동** 프로젝트 최상위에 `.env` 파일을 만들고 값을 옮김 → `OPENAI_API_KEY=sk-proj-8Xf2...`
> 💡 비밀값을 코드 파일에서 완전히 뽑아내 별도 파일로 격리하는 게 핵심이에요.

**③ .gitignore에 .env 추가** `.gitignore` 맨 아래에 `.env` 한 줄 추가 후 `git status` → `nothing to commit, working tree clean` (.env가 목록에 안 보임)
> 💡 이 한 줄이 없으면 방금 격리한 키가 다음 커밋에 그대로 다시 올라가요. 실제로 안 올라가는지 눈으로 검증하는 게 아하 포인트.

**④ 코드를 이름 참조로 교체** 변경 전 `const apiKey = "sk-proj-8Xf2...";` → 변경 후 `require('dotenv').config(); const apiKey = process.env.OPENAI_API_KEY;`
> 💡 이제 코드만 봐서는 실제 키 값을 알 수 없어요 — "공개해도 안전한 코드".

좋은 결과의 기준: (1) `git status`에 `.env`가 안 보인다 (2) 코드 어디에도 실제 키 문자열이 없다 (3) 앱을 실행하면 여전히 정상 작동한다(`process.env`로 잘 읽힘).

## 단계별 따라하기

1. **내 코드에 박힌 키부터 찾기** — 프로젝트 폴더에서 에디터 검색(Ctrl+Shift+F)으로 `sk-`, `api`, `key`, `secret`, `token`을 검색해 하드코딩된 비밀값이 있는지 전부 확인한다. 있으면 나중에 지울 목록으로 메모.
2. **`.env` 파일 만들기** — 프로젝트 최상위 폴더(`package.json`이 있는 곳)에 `.env` 파일을 새로 만든다. 앞에 점(`.`)이 꼭 있어야 한다. 안에는 `KEY이름=값` 형태로 한 줄씩, 따옴표 없이 적는다. (`OPENAI_API_KEY=sk-proj-8Xf2...` / `DATABASE_URL=postgresql://...`)
3. **`.gitignore`로 `.env`를 깃허브에서 차단** — 같은 폴더의 `.gitignore`를 열고(없으면 새로 만들고) 맨 아래에 `.env` 한 줄을 넣는다. 이 한 줄이 `.env`가 실수로도 올라가지 않게 막는 방패다. 저장 후 `git status`를 쳐서 `.env`가 목록에 안 보이면 성공. (`node_modules/` / `.env` / `.env.local`)
4. **코드에서 이름으로 불러오게 바꾸기** — 1단계에서 찾은 하드코딩 키를 지우고 환경변수를 읽는 코드로 바꾼다. Node.js면 먼저 `npm install dotenv` 후 파일 맨 위에 `require('dotenv').config()`를 넣고, 키 쓰던 자리를 `process.env.KEY이름`으로 교체. (변경 후: `const apiKey = process.env.OPENAI_API_KEY;`)
5. **배포 서버에 환경변수 등록** — `.env`는 내 컴퓨터에만 있으므로, 배포하는 곳(Vercel/Railway/Render 등) 대시보드의 'Environment Variables' 메뉴를 찾아 `.env`와 똑같은 이름·값을 하나씩 등록하고 재배포한다. (Vercel: Settings → Environment Variables → Name: `OPENAI_API_KEY`, Value: `sk-proj-8Xf2...` → Save → Redeploy)
6. **이미 노출됐다면 즉시 키 재발급** — 예전에 키를 한 번이라도 깃허브에 올렸다면, 파일만 지워도 커밋 기록에 남아 위험하다. 반드시 발급처(OpenAI 등) 대시보드에서 그 키를 'Revoke(폐기)'하고 새 키를 발급받아 `.env`에 교체한다. 커밋 기록을 지우는 것보다 키를 죽이는 게 100배 확실하다. (OpenAI: platform.openai.com → API keys → 노출된 키 옆 휴지통 → Create new secret key → `.env` 값 교체)

## 흔한 실수 → 교정

- ✗ 키를 `.env`로 옮긴 뒤에도 `.gitignore`에 `.env`를 추가하지 않아, 결국 `.env`가 통째로 깃허브에 올라감 → **가장 먼저 `.gitignore`에 `.env`를 추가한다.** `git status`에 `.env`가 안 뜨는지 반드시 확인하고 커밋. 이미 올라갔다면 키를 재발급.
- ✗ `.env` 값 앞뒤에 따옴표를 붙이거나(`KEY="abc"`), 등호 주변에 띄어쓰기를 넣어(`KEY = abc`) 값이 깨져 로딩이 안 됨 → **따옴표 없이 `KEY=값` 형태로, 등호 주변 공백 없이 한 줄에 하나씩.** 값 안에 특수문자가 있을 때만 따옴표.
- ✗ 노출된 키를 깃허브에서 파일만 지우면 안전하다고 착각. 커밋 기록에는 그대로 남아 누구나 볼 수 있음 → **파일 삭제로 끝내지 말고 발급처에서 그 키를 반드시 폐기(Revoke)하고 새로 발급.** 키를 죽이는 것이 유일하게 확실한 조치.

## 도구

- 🛠 **dotenv** (npmjs.com/package/dotenv) — Node.js에서 `.env` 파일을 코드로 읽어오는 필수 라이브러리.
- 🛠 **Vercel** (vercel.com) — 배포 대시보드에서 환경변수를 안전하게 등록·관리.
- 🛠 **git-secrets** (github.com/awslabs/git-secrets) — 커밋 전에 키가 섞여 있는지 자동으로 잡아주는 검사 도구.
- 🛠 **GitGuardian** (gitguardian.com) — 내 저장소에 노출된 비밀값을 스캔·알림.

## 실전 프롬프트

### 하드코딩 키 → 환경변수 자동 변환

```text
아래 코드에 API 키나 비밀번호가 코드에 직접 박혀 있습니다. 이걸 .env 파일과 process.env 방식으로 안전하게 분리해 주세요. 1)수정된 코드 2).env 파일에 넣을 내용 3).gitignore에 추가할 줄을 각각 나눠서 보여주세요. 실제 키 값은 절대 출력에 그대로 쓰지 말고 placeholder로 표시해 주세요. [내 코드]
```

> 확인된 작성 예시 없음

`환경변수` `리팩터링` `보안`

### 내 프로젝트에 맞는 .env 세팅법 물어보기

```text
저는 [프레임워크: Next.js / Node.js / Python Flask]로 프로젝트를 만들고 있고, [배포처: Vercel / Railway]에 배포할 예정입니다. 환경변수를 .env 파일과 배포 대시보드에 등록하는 정확한 단계를, 초보자가 따라 할 수 있게 명령어 포함해서 순서대로 알려주세요.
```

> 확인된 작성 예시 없음

`환경변수` `세팅` `배포`

### 노출 사고 대응 체크

```text
제 API 키 [OpenAI / Supabase / 기타]가 실수로 깃허브 공개 저장소에 올라간 것 같습니다. 지금 당장 해야 할 조치를 위험도 순으로 정리해 주세요. 키 폐기 방법, 새 키 발급, 커밋 기록 처리, 앞으로 재발 방지책까지 단계별로 알려주세요.
```

> 확인된 작성 예시 없음

`보안` `사고대응` `키 폐기`

### .env 값 팀원과 안전하게 공유하기

```text
.env 파일은 깃허브에 못 올린다는데, 그럼 팀원에게는 환경변수 값을 어떻게 전달해야 하나요? .env.example 방식과 안전한 공유 방법을 초보자용으로 설명하고, .env.example 예시 파일도 만들어 주세요.
```

> 확인된 작성 예시 없음

`환경변수` `협업` `공유`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! API 키가 아니라 DATABASE_URL(예: `postgresql://user:pw@host:5432/mydb`)이 코드에 하드코딩되어 있다고 가정하고, 위 4단계(검색 → .env 생성 → .gitignore 추가 → 코드 교체)를 직접 그대로 해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| git status를 쳤을 때 .env가 목록에 안 보이나요? | 5 |
| .env 파일에 등호 주변 공백이나 따옴표 없이 KEY=값 형태로 정확히 적었나요? | 5 |
| 코드를 통째로 화면 공유해도 실제 비밀값이 하나도 안 보이나요? | 5 |

## 관련 개념

- [Environment Variable](/concepts/environment-variable/)
- [Dotenv](/concepts/dotenv/)
- [Gitignore](/concepts/gitignore/)
- [Secret Management](/concepts/secret-management/)
- [Api Key Security](/concepts/api-key-security/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
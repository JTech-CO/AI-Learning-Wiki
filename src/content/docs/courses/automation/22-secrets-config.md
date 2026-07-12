---
title: "비밀키·설정 안전하게 — .env"
description: "API 키·비밀번호를 코드에서 분리하고 .env·환경변수로 안전하게 관리."
sidebar:
  order: 22
---
_API 키·비밀번호를 코드에서 분리하고 .env·환경변수로 안전하게 관리._

:::note[학습 목표]
- "이 레슨이 끝나면, API 키·비밀번호를 코드에서 완전히 분리해 .env 파일과 환경변수로 안전하게 관리하고, 실수로 GitHub에 올리는 사고를 막을 수 있습니다."
:::

> "방금 만든 코드를 GitHub에 올렸더니, 10분 뒤 낯선 사람이 내 API 키로 결제를 긁고 있다면? 실제로 매일 수천 개의 키가 이렇게 털립니다."

## 이 레슨에서 만드는 것

"이 레슨이 끝나면, API 키·비밀번호를 코드에서 완전히 분리해 .env 파일과 환경변수로 안전하게 관리하고, 실수로 GitHub에 올리는 사고를 막을 수 있습니다."

## 핵심 개념

"비밀키(secret)는 API 키, DB 비밀번호, 토큰처럼 '남이 알면 안 되는 값'입니다. 초보자가 가장 많이 하는 실수는 이 값을 코드 안에 그대로 적어두는 것(하드코딩)인데, 코드를 GitHub에 올리는 순간 전 세계에 공개됩니다. 봇들이 GitHub를 24시간 훑으며 노출된 키를 자동으로 주워 남의 계정으로 요금을 태웁니다. 해결책은 간단합니다 — 비밀값은 코드가 아니라 .env 라는 별도 파일이나 배포 서버의 '환경변수'에 넣고, 그 파일은 절대 업로드하지 않는 것입니다. 이렇게 하면 코드는 공개해도 열쇠는 내 손에 남습니다."

### 왜 작동하는가

코드는 텍스트라서, GitHub에 올라가는 순간 전 세계 누구나 읽을 수 있어요. 반면 .env 파일과 서버의 환경변수는 코드 저장소 밖에 따로 놓인 금고 같은 곳이라, .gitignore로 업로드 대상에서 빼두면 아예 인터넷에 나가지 않습니다. 그래서 코드는 자랑스럽게 공개해도, 열쇠(키)만은 내 컴퓨터·서버 안에 남길 수 있는 거예요.

## 👀 따라하기 예시

방금 만든 OpenAI 챗봇 프로젝트를 GitHub에 올리기 직전 상황이에요. 코드 안에 API 키가 그대로 박혀 있네요. 제가 먼저 안전하게 정리하는 과정을 처음부터 끝까지 보여드릴게요, 눈으로 따라오세요.

### 1. ① 코드에서 위험한 줄 찾기 — Ctrl+F로 'key' 검색

**실제 결과**

```text
const apiKey = "sk-proj-abc123xyz789..."  ← 이 줄 발견!
```

> sk-, key, password 같은 단어로 검색하면 숨어있는 비밀값을 놓치지 않아요.

### 2. ② .env 파일 만들어서 값 옮기기

**실제 결과**

```text
.env 파일 내용:\nOPENAI_API_KEY=sk-proj-abc123xyz789
```

> 값을 코드에서 완전히 분리하면, 코드 자체는 공개돼도 진짜 키는 노출되지 않아요.

### 3. ③ 코드는 환경변수를 불러오는 코드로 교체

**실제 결과**

```text
require('dotenv').config();\nconst apiKey = process.env.OPENAI_API_KEY;
```

> 이제 코드만 봐서는 실제 키 값을 절대 알 수 없어요 — 이게 바로 아하 포인트!

### 4. ④ .gitignore에 .env 한 줄 추가

**실제 결과**

```text
.gitignore 파일:\n.env
```

> 이 한 줄이 .env를 영원히 Git 업로드 대상에서 제외시켜줘요. 없으면 앞의 3단계가 다 무용지물!

### 완성 결과

완성물은 "코드에는 키가 전혀 안 보이고, .env는 .gitignore에 걸려 업로드되지 않는 프로젝트"예요. 좋은 결과의 기준: (1) 코드 파일 어디에도 실제 키 문자열이 없다 (2) git status에 .env가 아예 안 뜬다 (3) 앱은 여전히 정상 작동한다.

## 단계별 따라하기

### 1단계 — 코드 속 숨은 비밀키 찾아내기 (5분) 🙋나

내 프로젝트 폴더에서 API 키나 비밀번호가 코드에 직접 박혀 있는 곳을 눈으로 찾습니다. sk-, key, password, token, secret 같은 단어가 들어간 줄을 훑어보세요. 검색 기능(Ctrl+F)으로 'key'를 검색하면 빠릅니다.

**복사·실행 예시**

```text
발견 예시: const apiKey = "sk-proj-abc123xyz789..." ← 이렇게 코드에 그대로 적힌 줄이 위험한 부분입니다.
```

### 2단계 — .env 파일 만들기 (3분) 🙋나

프로젝트 최상위 폴더에 .env 라는 이름의 파일을 새로 만듭니다. 이름 맨 앞의 점(.)을 꼭 포함하세요. 그 안에 KEY=값 형식으로 한 줄씩 비밀값을 적습니다. 따옴표·공백 없이 등호(=) 양옆을 붙여 씁니다.

**복사·실행 예시**

```text
.env 파일 내용:
OPENAI_API_KEY=sk-proj-abc123xyz789
DB_PASSWORD=mySecret1234
```

### 3단계 — 코드에서 .env 값 불러 쓰기 (5분) 🤝함께

코드에 박아둔 실제 키를 지우고, 대신 환경변수를 읽는 코드로 바꿉니다. 방법이 헷갈리면 AI에게 내 언어(파이썬/자바스크립트 등)를 알려주고 물어보세요. 파이썬은 python-dotenv, Node.js는 dotenv 패키지를 씁니다.

**복사·실행 예시**

```text
Node.js 예: require('dotenv').config(); const apiKey = process.env.OPENAI_API_KEY;
파이썬 예: import os; api_key = os.environ['OPENAI_API_KEY']
```

### 4단계 — .gitignore로 .env 업로드 차단 (2분) 🙋나

프로젝트 폴더의 .gitignore 파일을 열어(없으면 새로 만들어) 맨 아래에 .env 한 줄을 추가합니다. 이 한 줄이 .env 파일을 Git 업로드 대상에서 영구히 제외합니다. 이미 올린 적 있다면 5단계도 필수입니다.

**복사·실행 예시**

```text
.gitignore 파일에 추가:
.env
.env.local
```

### 5단계 — 실수로 올린 키는 반드시 폐기·재발급 (5분) 🙋나

이미 GitHub에 키가 한 번이라도 올라갔다면, .gitignore로 지워도 소용없습니다(과거 기록에 남음). 해당 서비스(OpenAI 등) 대시보드에서 그 키를 삭제(revoke)하고 새 키를 발급받아 .env에만 넣으세요. '노출된 키는 죽은 키'로 취급하는 게 원칙입니다.

**복사·실행 예시**

```text
OpenAI: platform.openai.com → API keys → 노출된 키 옆 휴지통 클릭 → 삭제 → Create new secret key로 새 키 발급
```

### 6단계 — 팀·미래의 나를 위한 .env.example 만들기 (3분) 🤖A

실제 값은 뺀 빈 껍데기 .env.example 파일을 만들어 '어떤 키가 필요한지'만 공유합니다. 이건 안전하니 GitHub에 올려도 됩니다. AI에게 내 .env 구조를 주고 example 버전을 만들어달라고 하면 빠릅니다.

**복사·실행 예시**

```text
.env.example 내용:
OPENAI_API_KEY=여기에_본인_키_입력
DB_PASSWORD=여기에_DB_비밀번호_입력
```

## 흔한 실수와 교정
- **실수:** .env 파일만 만들면 안전하다고 생각한다.
  - **교정:** .env를 만들어도 .gitignore에 등록하지 않으면 그대로 GitHub에 올라갑니다. .env 생성과 .gitignore 등록은 항상 세트로 하세요.
- **실수:** 이미 올라간 키를 .gitignore로 지웠으니 괜찮다고 여긴다.
  - **교정:** Git은 과거 커밋 기록에 키를 영구 보관합니다. 파일을 지워도 기록엔 남으므로, 노출된 키는 무조건 서비스에서 폐기(revoke)하고 새로 발급받아야 합니다.
- **실수:** .env에 값을 KEY = "값" 처럼 따옴표·공백을 넣어 적는다.
  - **교정:** 대부분의 .env 로더는 KEY=값 형식(등호 양옆 공백 없이, 따옴표 없이)을 기대합니다. 불필요한 공백·따옴표는 값에 섞여 들어가 버그를 만듭니다.

## 완료 체크리스트

- 코드에 하드코딩된 비밀키를 모두 찾아 목록으로 정리했다
- 비밀값을 .env 파일로 옮기고 코드는 환경변수로 읽게 바꿨다
- .gitignore에 .env를 추가해 업로드를 차단했다
- 과거에 노출된 적 있는 키는 폐기하고 새로 발급받았다
- 실제 값을 뺀 .env.example을 만들어 공유용으로 준비했다

## 도구

- python-dotenv / dotenv (npmjs.com/package/dotenv) — .env 파일을 코드에서 읽어오는 라이브러리
- gitignore.io (toptal.com/developers/gitignore) — 내 언어에 맞는 .gitignore 자동 생성
- GitHub Secret Scanning (docs.github.com/code-security/secret-scanning) — 노출된 키 자동 탐지·알림
- Railway / Vercel 환경변수 설정 (railway.app) — 배포 서버에 .env 없이 비밀값 주입

## 참고 답안

.env에 DB_PASSWORD=mySecret1234 추가 → 코드는 process.env.DB_PASSWORD (또는 os.environ) 로 교체 → .gitignore에 .env 추가 → git status 실행 시 .env가 목록에 보이지 않으면 성공.

## 실전 프롬프트

### 내 코드에서 노출된 비밀키 전부 찾아줘

```text
아래는 내 [파이썬/자바스크립트/기타] 코드야. API 키, 비밀번호, 토큰처럼 코드에 직접 박혀 있으면 위험한 비밀값을 전부 찾아서, 각각 몇 번째 줄인지와 왜 위험한지 알려줘. 그리고 각 값을 환경변수로 바꾸려면 어떻게 수정해야 하는지 before/after 코드로 보여줘.

[여기에 내 코드 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `secrets-config`

### .env 값을 코드에서 불러오게 바꿔줘

```text
나는 [언어/프레임워크: 예 Node.js Express]로 개발 중이야. 지금 코드에 이렇게 API 키가 하드코딩돼 있어:
[하드코딩된 줄 붙여넣기]

이걸 .env 파일에서 환경변수로 읽어오도록 바꾸고 싶어. 1) 설치해야 할 패키지, 2) .env에 넣을 내용, 3) 코드에서 불러오는 방법을 초보자도 따라 할 수 있게 단계별로 알려줘.
```

> 확인된 작성 예시 없음

`eduverse` `secrets-config`

### .env.example 껍데기 만들어줘

```text
내 .env 파일 내용이 아래와 같아. 실제 비밀값은 전부 '여기에_입력' 같은 안내 문구로 바꾼 .env.example 버전을 만들어줘. 각 변수 위에 그 값을 어디서 발급받는지 한 줄 주석도 달아줘.

[여기에 .env 내용 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `secrets-config`

### 실수로 올린 키 대처법 알려줘

```text
실수로 [OpenAI/Supabase/기타] API 키를 GitHub 공개 저장소에 올려버렸어. 지금 당장 뭘 해야 하는지 우선순위 순서대로 알려줘. 특히 키를 폐기·재발급하는 구체적 위치와, Git 기록에서 지우는 방법을 초보자용으로 설명해줘.
```

> 확인된 작성 예시 없음

`eduverse` `secrets-config`

## 직접 만들기 (미션)

:::tip
이번엔 당신 차례예요! 자신의 프로젝트(또는 연습용 코드)에서 DB_PASSWORD 하나를 골라, .env로 옮기고 .gitignore에 등록한 다음, git status로 .env가 추적되지 않는지 확인해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 코드 파일을 열어 실제 비밀값 문자열이 하나도 안 보이나요? | 5 |
| .gitignore에 .env를 추가하기 전에 실수로 커밋한 적은 없나요? (있다면 revoke 필요) | 5 |
| git status를 실행했을 때 .env 파일이 "추적 대상"으로 뜨지 않나요? | 5 |

## 관련 개념

- [Secrets](/concepts/secrets/)
- [Config](/concepts/config/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_secrets_config) · 방식: api-capture</sub>
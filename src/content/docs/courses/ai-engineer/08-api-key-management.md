---
title: "API 키와 환경변수 안전 관리"
description: "API 키 발급 절차를 익히고, .env 파일·환경변수로 키를 코드 밖에 보관해 코드나 깃 저장소에 절대 노출하지 않는 안전 습관을 몸에 익힌다."
sidebar:
  order: 8
---
_API 키 발급 절차를 익히고, .env 파일·환경변수로 키를 코드 밖에 보관해 코드나 깃 저장소에 절대 노출하지 않는 안전 습관을 몸에 익힌다._

:::note[학습 목표]
- API 키를 .env 파일과 환경변수로 분리해 코드·깃에 노출되지 않게 보관한다
- .gitignore로 .env를 깃 추적에서 제외하고 git status로 확인한다
- 키가 노출되면 즉시 폐기(revoke)하고 재발급하는 대응 절차를 익힌다
:::

## 핵심 개념

API 키는 **"너 대신 결제하고 접근할 수 있는 비밀번호"**예요. 코드에 직접 적어두면(하드코딩) 그 코드를 보는 모든 사람이 내 계정을 쓸 수 있게 됩니다. 그래서 키는 코드 밖 **.env 파일**에 따로 보관하고, 프로그램이 실행될 때 **환경변수**로 읽어오도록 분리해요. 핵심 습관은 세 가지 — **(1) 키는 코드에 절대 안 쓴다 (2) .env는 .gitignore로 깃에서 제외한다 (3) 노출되면 즉시 폐기(revoke)하고 새로 발급한다.** 깃허브 봇은 공개 저장소를 초 단위로 스캔하기 때문에 "잠깐만 올렸다"도 이미 늦어요.

> 💡 "OpenAI 키를 코드에 붙여넣고 GitHub에 올렸더니 30분 만에 누가 내 요금으로 수십만 원을 써버렸다" — 매일 벌어지는 사고예요. 키 하나 잘못 두면 통장이 뚫립니다.

### 왜 이게 될까?

컴퓨터는 코드 파일과 "그 순간 실행 환경"을 분리해서 다뤄요. .env는 코드 밖에 있는 별도 서랍이고, 환경변수는 프로그램이 실행될 때만 그 서랍을 슬쩍 열어보는 방식이에요. 그래서 코드 자체(깃에 올라가는 부분)에는 비밀번호가 한 글자도 안 남고, 실행할 때만 필요한 키를 조용히 불러다 씁니다.

## 👀 따라하기 예시 — 토이 프로젝트에 OpenAI 키 물려서 실행

**① .env 파일 생성** — 터미널에서 파일을 만들고 키를 한 줄 넣어요.
```bash
$ touch .env
$ echo "OPENAI_API_KEY=sk-proj-abc123..." >> .env
```
> 💡 키를 코드가 아니라 별도 파일에 두는 순간, 코드를 누가 보든 키는 안 보여요.

**② .gitignore에 .env 추가 후 확인**
```bash
$ echo ".env" >> .gitignore
$ git status   # Untracked files에 package.json, README.md만 뜨고 .env는 없음
```
> 💡 git status에 .env가 안 뜨면 "이 파일은 깃이 아예 모른다"는 뜻 — 실수로 커밋될 위험이 사라졌다는 신호예요.

**③ 코드에서 dotenv로 불러오기**
```python
from dotenv import load_dotenv
import os
load_dotenv()
key = os.getenv("OPENAI_API_KEY")
print(key[:8] + "...")   # sk-proj-...
```
> 💡 코드에는 `os.getenv(이름)`만 있고 실제 값은 안 적혀 있어요. 그래서 이 파일을 그대로 공개해도 안전해요.

**④ 팀 공유용 .env.example 생성**
```bash
$ cp .env .env.example
$ sed -i "s/=.*/=/" .env.example
$ cat .env.example   # OPENAI_API_KEY=
```
> 💡 값은 비우고 "어떤 키가 필요한지"만 남겨서, 이 파일은 깃에 올려도 되는 안전한 안내문이 돼요.

좋은 결과의 기준: (1) git status에 .env가 절대 안 뜬다 (2) 코드 파일 어디에도 실제 키 값이 없다 (3) 새 팀원이 .env.example만 보고도 뭘 채워야 하는지 안다.

## 단계별 따라하기

1. **API 키 발급받기** — 쓰려는 서비스(예: OpenAI) 대시보드의 API Keys 메뉴 → 'Create new secret key'. 만들 때 한 번만 전체가 보이므로 그 자리에서 복사하고, 이름은 용도가 드러나게. (OpenAI → platform.openai.com/api-keys → Create → 이름 'eduverse-test' → `sk-proj-abc123...` 복사)
2. **.env 파일 만들기** — 프로젝트 폴더 최상단에 확장자 없는 '.env' 파일을 만들고, 안에 `KEY이름=값` 형식으로 한 줄씩. 값에는 따옴표를 붙이지 않는다. (`OPENAI_API_KEY=sk-proj-abc123...`)
3. **.gitignore에 .env 넣기** — 같은 폴더의 .gitignore 파일을 열고(없으면 만들고) 한 줄에 '.env'를 추가. 이러면 git이 .env를 아예 추적하지 않아 깃에 올라가지 않아요. 저장 후 `git status`로 .env가 목록에 안 뜨는지 확인.
4. **코드에서 환경변수로 불러오기** — 코드에 키를 직접 쓰지 말고 환경변수를 읽는 코드로. Python이면 python-dotenv, Node면 dotenv 라이브러리를 설치해 .env를 로드한 뒤 변수로 꺼낸다. ((Python) `pip install python-dotenv` → `from dotenv import load_dotenv; import os; load_dotenv(); key=os.getenv('OPENAI_API_KEY')`)
5. **팀·배포용 .env.example 만들기** — .env를 복사해 .env.example로 만들고 값 부분만 지워 빈 껍데기로. 이 파일은 깃에 올려도 안전하며 '어떤 키가 필요한지'를 팀에게 알려줘요. 실제 배포(Railway·Vercel 등)에서는 대시보드의 환경변수 설정에 값을 직접 넣는다.
6. **노출 대응 리허설** — 키가 깃·채팅·스크린샷에 노출됐다고 가정하고, 대시보드에서 해당 키를 'Revoke(폐기)'하고 새 키를 발급해 .env만 교체하는 흐름을 한 번 실습. 폐기가 핵심이지 파일 지우기는 소용없어요.

## 흔한 실수 → 교정

- ✗ 노출된 키를 git 히스토리에서 지우면 안전하다고 생각 → **히스토리 삭제는 소용없다.** 봇이 이미 긁어갔다고 가정하고, 대시보드에서 그 키를 즉시 Revoke하고 새 키를 발급하는 것만이 진짜 대응.
- ✗ .env 파일을 만들었지만 .gitignore에 안 넣어 그대로 커밋 → **먼저 .gitignore에 '.env'를 넣고 `git status`로 .env가 안 뜨는지 확인한 뒤에 커밋.** 이미 커밋했다면 키부터 폐기·재발급.
- ✗ 키를 ChatGPT·블로그·스크린샷에 무심코 붙여넣음 → **키는 어디에도 원문을 붙이지 않는다.** AI에게 코드를 물어볼 땐 키 자리를 'sk-...'처럼 가리고, 캡처 전에 값을 마스킹.

## 도구

- 🛠 **OpenAI Platform** (platform.openai.com/api-keys) — API 키 발급·폐기.
- 🛠 **python-dotenv / dotenv** (pypi.org/project/python-dotenv) — .env 파일을 코드로 로드.
- 🛠 **GitHub .gitignore** (github.com/github/gitignore) — 언어별 .gitignore 템플릿.
- 🛠 **git-secrets** (github.com/awslabs/git-secrets) — 커밋 전 키 노출 자동 차단.

## 실전 프롬프트

### 내 프로젝트 키 분리 점검(가장 유용)

```text
나는 [Python / Node.js] 프로젝트에서 [OpenAI] API 키를 쓰고 있어. 지금 코드에 키가 하드코딩돼 있는데 이걸 .env 파일 + 환경변수로 안전하게 분리하고 싶어. (1) .env 파일 예시 (2) .gitignore에 추가할 내용 (3) 코드에서 환경변수로 불러오는 최소 코드 (4) 확인 방법을 순서대로 알려줘.
```

`API 키` `환경변수` `.env` `분리`

### 내 코드에 키가 노출됐는지 검사

```text
아래 코드를 검사해서 API 키·비밀번호·토큰 같은 민감정보가 하드코딩돼 있는지 찾아줘. 있으면 어느 줄인지, 어떻게 환경변수로 바꿔야 하는지 알려줘. [내 코드]
```

`API 키` `보안` `검사`

### 키 노출 사고 긴급 대응

```text
방금 [GitHub / 채팅 / 스크린샷]에 [OpenAI] API 키를 실수로 노출했어. 지금 당장 해야 할 조치를 우선순위 순서대로 알려줘. 키 폐기(revoke) 방법과, git 히스토리에서 지워도 왜 재발급이 필수인지도 설명해줘.
```

`API 키` `노출` `폐기`

### .env.example 자동 생성

```text
아래 내 .env 파일 내용을 보고 값은 모두 비운 안전한 .env.example 파일을 만들어줘. 각 키가 무슨 용도인지 주석도 한 줄씩 달아줘. [.env 내용]
```

`환경변수` `.env.example` `팀 공유`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! 다른 서비스로 연습해보세요. 날씨 API(예: OpenWeatherMap) 키를 발급받아 `WEATHER_API_KEY`라는 이름으로 .env에 넣고 → .gitignore에 등록 → `git status`로 제외됨 확인 → 코드에서 `os.getenv`로 불러오기 → 값 비운 .env.example까지 만들어보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| git status를 쳤을 때 .env가 목록에 안 뜨나? | 5 |
| 내 코드 파일 어디를 봐도 실제 키 문자열이 안 보이나? | 5 |
| .env.example만 보고 다른 사람이 '무슨 키를 채워야 하는지' 알 수 있나? | 5 |

## 관련 개념

- [Api Key](/concepts/api-key/)
- [Environment Variable](/concepts/environment-variable/)
- [Dotenv](/concepts/dotenv/)
- [Gitignore](/concepts/gitignore/)
- [Secret Management](/concepts/secret-management/)
- [Key Revocation](/concepts/key-revocation/)

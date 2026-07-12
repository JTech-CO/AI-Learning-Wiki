---
title: "GitHub Actions로 무료 상시 실행"
description: "서버 없이 GitHub Actions로 스케줄·이벤트 자동화를 무료로 돌리기."
sidebar:
  order: 30
---
_서버 없이 GitHub Actions로 스케줄·이벤트 자동화를 무료로 돌리기._

:::note[학습 목표]
- 이 레슨이 끝나면, 내 GitHub 저장소에서 정해진 시각(예: 매일 아침 9시)에 스크립트를 자동 실행하는 GitHub Actions 워크플로를 직접 만들어 돌릴 수 있습니다.
:::

> "매일 아침 9시에 환율을 긁어서 나한테 알림 보내는 봇, 서버 빌려야 하나?" 아니요. GitHub 저장소 하나만 있으면 컴퓨터를 꺼놔도 GitHub의 서버가 대신 돌려줍니다. 그것도 공짜로.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 내 GitHub 저장소에서 정해진 시각(예: 매일 아침 9시)에 스크립트를 자동 실행하는 GitHub Actions 워크플로를 직접 만들어 돌릴 수 있습니다.

## 핵심 개념

GitHub Actions는 GitHub가 무료로 제공하는 자동화 실행기입니다. 저장소 안에 .github/workflows 폴더를 만들고 YAML 파일 하나만 넣으면, 코드를 푸시할 때(이벤트)나 매일 정해진 시각(스케줄)에 GitHub의 클라우드 컴퓨터가 내 명령을 대신 실행합니다. 내 노트북을 켜둘 필요도, 서버를 빌릴 필요도 없습니다. 공개 저장소는 실행 시간이 사실상 무제한 무료이고, 비공개 저장소도 매달 넉넉한 무료 분량이 주어집니다. 크론(cron) 문법으로 "언제"를, 워크플로 스텝으로 "무엇을" 정의하는 것이 전부입니다.

### 왜 작동하는가

깃허브 액션은 "저장소 하나당 무료 컴퓨터 한 대"를 빌려주는 셈이에요. 여러분이 잠들어 있어도, GitHub의 서버가 정해진 시각에 알아서 여러분의 스크립트를 대신 켜고 실행하고 꺼줍니다. 그래서 여러분은 ".github/workflows 폴더에 YAML 한 장"만 써두면, 그 뒤로는 스케줄과 실행은 전부 AI(GitHub)가 대신합니다.

## 👀 따라하기 예시

"매일 아침 9시에 환율을 긁어서 저한테 알림 보내는 봇을 만들고 싶어요" — 제가 먼저 처음부터 끝까지 만들어볼게요, 눈으로 따라오세요.

### 1. ① AI에게 목적만 한 줄로 알려주기: "매일 KST 9시에 환율 가져와서 로그로 남기는 GitHub Actions YAML 짜줘"

**실제 결과**

```text
on:\n  schedule:\n    - cron: '0 0 * * *'\n  workflow_dispatch:\njobs:\n  run:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: python main.py
```

> KST 9시는 UTC로 0시라서 cron 시 자리는 0. workflow_dispatch를 같이 넣은 건 나중에 수동 실행 버튼이 필요해서예요 — AI가 이걸 알아서 챙겨줍니다.

### 2. ② 저장소에 main.py 하나 추가

**실제 결과**

```text
import requests\nres = requests.get("https://api.exchangerate-api.com/v4/latest/USD")\nprint("USD/KRW:", res.json()["rates"]["KRW"])
```

> 스크립트는 "무엇을 할지"만 담당하고, YAML은 "언제 실행할지"만 담당 — 역할을 나누면 나중에 스크립트만 바꿔도 스케줄은 그대로 재사용됩니다.

### 3. ③ 커밋 후 Actions 탭 → Run workflow로 즉시 수동 실행

**실제 결과**

```text
✅ run.yml #1 성공 (12초)\nUSD/KRW: 1391.2
```

> 스케줄이 돌아올 때까지 몇 시간 기다릴 필요 없이, 방금 만든 워크플로가 제대로 도는지 그 자리에서 확인하는 게 핵심 아하 포인트예요.

### 4. ④ 알림용 Webhook URL은 코드에 안 쓰고 Secrets에 등록 후 ${{ secrets.SLACK_WEBHOOK }}으로 참조

**실제 결과**

```text
env:\n  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

> 공개 저장소에 비밀값이 그대로 노출되는 사고를 막는 습관 — 처음부터 이렇게 하면 나중에 후회할 일이 없어요.

### 완성 결과

완성물: 매일 아침 9시(KST)에 자동으로 환율을 가져와 로그를 남기는 GitHub Actions 워크플로 1개. 좋은 결과의 기준: (1) Run workflow 버튼으로 지금 눌러도 성공(초록 체크)한다 (2) 크론 시각이 UTC 기준으로 정확히 변환돼 있다 (3) 비밀값이 YAML 안에 그대로 보이지 않는다.

## 단계별 따라하기

### 1단계 — 자동화할 일을 한 줄로 정하기 (5분) 🙋나

서버 없이 반복 실행하고 싶은 작업 하나를 고른다. '무엇을 / 언제' 두 가지만 정하면 된다. 처음이면 결과가 눈에 보이는 단순한 걸로 시작한다.

**복사·실행 예시**

```text
작업: '매일 아침 9시에 오늘 날짜를 로그에 찍는다' → 성공하면 '환율 크롤링 후 알림'으로 확장
```

### 2단계 — GitHub 저장소 만들고 실행 스크립트 넣기 (10분) 🙋나

github.com에서 New repository로 저장소를 만든다(공개 권장, 무료 시간 무제한). 저장소 루트에 실행할 스크립트를 하나 추가한다. 파이썬이면 main.py, 셸이면 run.sh.

**복사·실행 예시**

```text
main.py 내용: import datetime; print('실행됨:', datetime.datetime.now())
```

### 3단계 — 워크플로 YAML을 AI에게 만들어 달라기 (10분) 🤖A

저장소 웹에서 Add file → Create new file을 누르고 파일명에 정확히 '.github/workflows/run.yml'을 입력한다(폴더가 자동 생성됨). 내용은 아래 templates의 첫 프롬프트를 AI에 붙여 만든 YAML을 그대로 붙여넣는다. on: 아래에 schedule(cron)과 workflow_dispatch(수동 실행 버튼)를 함께 넣는 게 핵심.

**복사·실행 예시**

```text
핵심 줄: on:\n  schedule:\n    - cron: '0 0 * * *'   # UTC 0시 = 한국 오전 9시\n  workflow_dispatch:
```

### 4단계 — 커밋하고 Actions 탭에서 수동 실행해 보기 (5분) 🙋나

파일을 커밋(Commit changes)하면 저장소 상단 Actions 탭에 워크플로가 나타난다. 스케줄이 오기까지 기다리지 말고, 워크플로를 클릭 → 'Run workflow' 버튼으로 지금 즉시 돌려 로그를 확인한다. 초록 체크가 뜨면 성공.

**복사·실행 예시**

```text
Actions 탭 → run.yml 클릭 → 오른쪽 'Run workflow' 드롭다운 → Run workflow → 몇 초 뒤 로그에서 '실행됨: 2026-07-03...' 확인
```

### 5단계 — 비밀값(API 키)은 Secrets에 숨기기 (7분) 🤝함께

알림용 API 키나 토큰을 코드에 직접 쓰면 안 된다. 저장소 Settings → Secrets and variables → Actions → New repository secret에 등록하고, YAML에서 ${{ secrets.이름 }}으로 꺼내 env로 넘긴다.

**복사·실행 예시**

```text
Secret 이름 SLACK_WEBHOOK 등록 후 YAML: env:\n  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

### 6단계 — 실제 크론 시각 맞추고 실패 알림 붙이기 (8분) 🤝함께

cron은 UTC 기준이라 한국시간(KST)에서 9시간을 빼서 적는다(KST 09:00 = UTC 00:00). 스케줄이 몇 분 늦게 돌 수 있음을 감안한다. 실패를 놓치지 않으려면 실패 시 알림 스텝을 추가하거나, GitHub 설정에서 실패 이메일 알림을 켜둔다.

**복사·실행 예시**

```text
KST 오후 6시 실행 → 18-9=9 → cron: '0 9 * * *'. 요일 지정은 마지막 자리(0=일요일)
```

## 흔한 실수와 교정
- **실수:** cron 시각을 한국시간(KST)으로 그대로 적어서 9시간 어긋나게 실행된다.
  - **교정:** cron은 무조건 UTC 기준. 원하는 KST 시각에서 9를 뺀 값을 시(hour) 자리에 넣는다. KST 09:00이면 cron 시 자리는 0.
- **실수:** 스케줄만 넣고 workflow_dispatch를 빼서, 테스트하려고 다음 실행 시각까지 몇 시간을 기다린다.
  - **교정:** on: 아래에 workflow_dispatch를 항상 같이 넣어 Actions 탭의 'Run workflow' 버튼으로 즉시 수동 실행해 검증한다.
- **실수:** API 키를 YAML이나 코드에 그대로 써서 공개 저장소에 비밀값이 노출된다.
  - **교정:** 키는 Settings → Secrets and variables → Actions에 등록하고 ${{ secrets.이름 }}으로만 참조한다. 이미 노출됐다면 즉시 키를 폐기·재발급한다.

## 완료 체크리스트

- 자동화할 작업의 '무엇을/언제'를 한 줄로 정했다
- .github/workflows/run.yml 파일을 만들고 커밋했다
- on:에 schedule(cron)과 workflow_dispatch를 둘 다 넣었다
- Actions 탭에서 'Run workflow'로 수동 실행해 초록 체크를 확인했다
- API 키 등 비밀값을 Secrets에 넣고 코드에는 남기지 않았다

## 도구

- GitHub Actions (https://github.com/features/actions) — 스케줄·이벤트 자동화 무료 실행기
- crontab.guru (https://crontab.guru) — cron 표현식을 사람 말로 확인·검증
- GitHub Docs: Workflow syntax (https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions) — YAML 문법 공식 레퍼런스
- GitHub Secrets (https://docs.github.com/actions/security-guides/encrypted-secrets) — API 키 안전 보관

## 참고 답안

1) main.py: print(f"오늘은 {날짜}, 화이팅!") 2) AI 프롬프트: "매일 KST 18시에 실행되는 GitHub Actions YAML 짜줘, workflow_dispatch도 포함" 3) cron 계산: 18-9=9 → cron: '0 9 * * *' 4) .github/workflows/run.yml로 커밋 → Actions 탭에서 Run workflow → 로그 확인.

## 실전 프롬프트

### 워크플로 YAML 생성

```text
GitHub Actions 워크플로 YAML 파일을 만들어줘. 요구사항: (1) 매일 [한국시간 오전 9시]에 자동 실행되도록 cron을 UTC 기준으로 변환해서 넣기, (2) 손으로도 즉시 돌릴 수 있게 workflow_dispatch 포함, (3) 저장소 루트의 [main.py]를 [Python 3.12]로 실행, (4) 필요한 패키지는 [requests]를 pip install, (5) 비밀값 [API_KEY]는 ${{ secrets.API_KEY }}로 env에 주입. 각 줄에 한국어 주석을 달고, 파일 경로가 .github/workflows/run.yml임을 알려줘.
```

> 확인된 작성 예시 없음

`eduverse` `github-actions`

### cron 시각 변환

```text
내가 원하는 실행 시각은 한국시간(KST) 기준 [매주 월/수/금 오후 7시]야. GitHub Actions는 UTC를 쓰니까, 이걸 cron 표현식으로 정확히 변환해줘. 변환 과정(KST-9시간)과 최종 cron 문자열, 그리고 자리별 의미(분 시 일 월 요일)를 표로 설명해줘.
```

> 확인된 작성 예시 없음

`eduverse` `github-actions`

### 실패 시 Slack 알림 스텝

```text
GitHub Actions 워크플로에서 이전 스텝이 실패했을 때만 Slack으로 알림을 보내는 스텝을 만들어줘. if: failure() 조건을 쓰고, Webhook URL은 ${{ secrets.SLACK_WEBHOOK }}에서 가져오고, curl로 '[워크플로 이름] 실행 실패'라는 메시지를 보내도록 해줘.
```

> 확인된 작성 예시 없음

`eduverse` `github-actions`

### 실행 안 됨 디버깅

```text
내 GitHub Actions 워크플로가 스케줄 시각에 실행되지 않았어. 아래 YAML을 보고 흔한 원인(cron UTC 착각, 기본 브랜치 문제, 60일 비활동으로 스케줄 비활성화, 들여쓰기 오류 등)을 하나씩 점검해줘. YAML: [여기에 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `github-actions`

## 직접 만들기 (미션)

:::tip
이번엔 환율 대신 "매일 저녁 6시(KST)에 오늘 날짜와 랜덤 한마디를 로그로 남기는" 워크플로를 직접 만들어보세요. AI에게 목적 한 줄만 알려주고 YAML을 받아, 저장소에 커밋하고 Run workflow로 지금 바로 실행해서 초록 체크를 확인하세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| cron 시각을 KST에서 9시간 뺀 UTC로 정확히 계산했나요? | 5 |
| workflow_dispatch를 넣어서 스케줄을 기다리지 않고 지금 바로 테스트했나요? | 5 |
| 혹시 비밀값(API 키·Webhook)이 있다면 YAML에 직접 쓰지 않고 Secrets에 등록했나요? | 5 |

## 관련 개념

- [Github](/concepts/github/)
- [Actions](/concepts/actions/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_github_actions) · 방식: api-capture</sub>
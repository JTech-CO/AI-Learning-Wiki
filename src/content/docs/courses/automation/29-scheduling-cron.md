---
title: "cron·스케줄러로 정기 실행"
description: "정해진 시각·주기로 자동 실행(cron, schedule 라이브러리)."
sidebar:
  order: 29
---
_정해진 시각·주기로 자동 실행(cron, schedule 라이브러리)._

:::note[학습 목표]
- 내가 만든 파이썬 프로그램(뉴스 수집, 이메일 발송 등)을 정해진 시각·주기로 사람 손 없이 자동 실행할 수 있다. 예: 매일 오전 8시 날씨 알림, 10분마다 웹사이트 점검.
:::

> 매번 손으로 프로그램을 실행하는 건 알람 없이 매일 정해진 시간에 스스로 일어나려는 것과 같다. 잊어버리기 쉽고 귀찮다. 컴퓨터에게 '매일 아침 9시에 이 일을 해줘'라고 시켜두면 내가 자는 사이에도 자동으로 돌아간다.

## 이 레슨에서 만드는 것

내가 만든 파이썬 프로그램(뉴스 수집, 이메일 발송 등)을 정해진 시각·주기로 사람 손 없이 자동 실행할 수 있다. 예: 매일 오전 8시 날씨 알림, 10분마다 웹사이트 점검.

## 핵심 개념

cron(크론)과 schedule(스케줄) 라이브러리는 컴퓨터의 '자동 알람 시계'다. '언제(시간)'와 '무엇을(실행할 프로그램)'만 정해두면, 그 시각이 될 때마다 컴퓨터가 스스로 프로그램을 실행한다. cron은 리눅스·맥에 원래 들어있는 기능이고, schedule은 파이썬 코드 안에서 쉬운 우리말처럼 시간 예약을 적는 도구다. 마치 '매일 아침 7시에 커피 내려줘'라고 예약해둔 커피머신처럼, 시간이 되면 알아서 작동한다.

### 왜 작동하는가

컴퓨터는 사람과 달리 "지금 몇 시인지"를 1초도 잊지 않고 확인할 수 있다. schedule 라이브러리는 이 능력을 빌려서, while 반복문 안에서 매 순간 시계를 들여다보다가 예약한 시각이 되면 정해둔 함수를 딱 눌러 실행해준다. 그래서 당신은 "무엇을, 언제"만 한 줄로 적어두면, 그 뒤로 지켜보는 일은 AI 자동화 코드가 대신 해준다.

## 👀 따라하기 예시

매일 아침 8시에 날씨 알림 메시지를 자동으로 출력하는 job.py를 만드는 상황. 제가 먼저 처음부터 끝까지 만들어볼게요, 눈으로 따라오세요.

### 1. ① 할 일 함수부터 정의

**실제 결과**

```text
def check_weather():
    print("오늘 8시 날씨 알림: 맑음, 최고 24도")
```

> 예약은 나중에 하고, "무엇을 할지"부터 확실히 만들어두는 거예요 — 순서가 헷갈리면 실행이 안 돼요

### 2. ② schedule 설치 확인

**실제 결과**

```text
pip install schedule
→ Successfully installed schedule-1.2.1
```

> 설치 문구를 눈으로 확인해야 다음 단계에서 import 에러가 안 나요

### 3. ③ 예약 코드 작성

**실제 결과**

```text
import schedule, time
schedule.every().day.at("08:00").do(check_weather)
while True:
    schedule.run_pending()
    time.sleep(1)
```

> while True가 없으면 딱 한 번 시각만 등록하고 프로그램이 끝나버려요 — 계속 지켜봐야 하니까 반드시 필요해요

### 4. ④ 실행 후 대기 확인

**실제 결과**

```text
python scheduler.py
→ (화면에 아무것도 안 뜨고 커서만 깜빡임, 08:00 되면 "오늘 8시 날씨 알림: 맑음, 최고 24도" 출력)
```

> 조용히 대기 중인 게 정상이에요 — 창을 닫지만 않으면 시각이 될 때 알아서 튀어나와요

### 완성 결과

창을 열어두면 매일 08:00에 자동으로 알림 문구가 출력되는 scheduler.py. 좋은 결과의 기준: (1) 24시간제 시각 문자열("08:00")을 정확히 썼다, (2) while True + run_pending()이 빠짐없이 들어있다, (3) 창을 닫지 않고 켜둔 상태에서 실제로 지정 시각에 출력이 뜬다.

## 단계별 따라하기

### 실행할 프로그램 먼저 준비

자동으로 돌릴 파이썬 파일을 만든다. 메모장이나 VS Code에서 작성 후 job.py로 저장. 이 파일이 '해야 할 일' 그 자체다.

**복사·실행 예시**

```text
job.py 안에: print('할 일 실행됨!') 이나 이메일 보내는 코드
```

### schedule 라이브러리 설치

윈도우는 명령프롬프트(cmd), 맥은 터미널을 연다. pip install schedule 을 입력하고 엔터. '설치 완료(Successfully installed)' 문구가 나오면 성공.

**복사·실행 예시**

```text
pip install schedule
```

### schedule로 예약 코드 작성

scheduler.py 파일을 만들고 아래 템플릿을 붙여넣는다. every().day.at() 안에 원하는 시각을 24시간제로 적는다. import time과 while True 반복이 있어야 계속 대기한다.

**복사·실행 예시**

```text
schedule.every().day.at('09:00').do(내함수) → 매일 9시 실행
```

### 스케줄러 실행하고 켜두기

터미널에서 python scheduler.py 입력. 창을 닫지 말고 그대로 둔다. 컴퓨터가 켜져 있고 이 창이 열려 있는 동안 예약된 시각마다 자동 실행된다.

**복사·실행 예시**

```text
python scheduler.py → 화면에 '대기 중...' 계속 표시
```

### 컴퓨터 껐다 켜도 유지하려면(선택)

schedule은 창을 닫으면 멈춘다. 24시간 켜두려면 맥·리눅스는 cron(crontab -e 입력 후 시각 규칙 등록), 윈도우는 '작업 스케줄러' 앱을 쓴다. 처음엔 schedule로 충분하다.

**복사·실행 예시**

```text
crontab: 0 9 * * * python3 /경로/job.py → 매일 9시
```

## 흔한 실수와 교정
- **실수:** schedule 프로그램 창을 닫아버려서 자동 실행이 안 됨
  - **교정:** schedule은 창이 열려 있어야만 작동한다. 창을 닫지 말 것. 항상 켜두고 싶으면 cron이나 윈도우 작업 스케줄러로 옮긴다.
- **실수:** 시각을 '9시'처럼 쓰거나 오후를 헷갈림
  - **교정:** 반드시 24시간제 문자열로: 오전 9시는 '09:00', 오후 3시는 '15:00'. 따옴표와 콜론(:)을 정확히.
- **실수:** while True 반복문을 빼먹어서 한 번도 실행 안 됨
  - **교정:** schedule은 계속 시간을 확인해야 한다. while True 안에 run_pending()과 time.sleep()이 꼭 있어야 한다.
- **실수:** cron에서 python이라 적었는데 안 돌아감
  - **교정:** cron은 전체 경로를 모른다. python3 대신 which python3로 확인한 전체 경로(예 /usr/bin/python3)와 파일의 전체 경로를 모두 적는다.
- **실수:** 컴퓨터가 꺼지거나 절전되면 실행 안 됨
  - **교정:** 내 PC는 꺼지면 멈춘다. 24시간 안정 운영이 필요하면 클라우드 서버나 절전 안 되는 설정을 쓴다.

## 완료 체크리스트

- 실행할 job.py 프로그램이 손으로 돌려봐도 정상 작동하는가
- pip install schedule 설치가 완료됐는가
- at() 안 시각이 24시간제 '00:00' 형식인가
- while True + run_pending() + sleep 세 가지가 다 있는가
- python scheduler.py 실행 후 창을 열어뒀는가
- 24시간 필요하면 cron/작업 스케줄러로 옮길 계획이 있는가

## 도구

- schedule (파이썬 라이브러리) — 코드 안에서 쉬운 예약 작성
- cron / crontab (맥·리눅스 기본) — OS 차원 정기 실행
- 윈도우 작업 스케줄러 — 윈도우에서 프로그램 예약 실행
- VS Code — 파이썬 코드 작성·편집
- 터미널/명령프롬프트 — 설치와 실행 명령 입력

## 참고 답안

def study_reminder():
    print("공부 시작해야 할 시간이에요!")

import schedule, time
schedule.every().day.at("15:00").do(study_reminder)
while True:
    schedule.run_pending()
    time.sleep(1)

## 실전 프롬프트

### schedule 매일 지정시각 실행

```text
import schedule
import time

def 할일():
    print('[할 일 내용] 실행됨!')

schedule.every().day.at('[09:00]').do(할일)

while True:
    schedule.run_pending()
    time.sleep(60)
```

> 확인된 작성 예시 없음

`eduverse` `scheduling-cron`

### schedule N분마다 반복

```text
import schedule
import time

def 할일():
    print('점검 실행!')

schedule.every([10]).minutes.do(할일)

while True:
    schedule.run_pending()
    time.sleep(1)
```

> 확인된 작성 예시 없음

`eduverse` `scheduling-cron`

### cron 규칙(맥/리눅스, crontab -e 안에)

```text
# 분 시 일 월 요일  실행명령
[0] [9] * * *  python3 /전체/경로/job.py
```

> 확인된 작성 예시 없음

`eduverse` `scheduling-cron`

### AI에게 스케줄 코드 요청

```text
파이썬 schedule 라이브러리로 [매일 오전 8시]에 [날씨 정보를 이메일로 보내는] 자동 실행 코드를 만들어줘. 초보자용으로 주석을 한국어로 달고, 실행 방법도 알려줘.
```

> 확인된 작성 예시 없음

`eduverse` `scheduling-cron`

## 직접 만들기 (미션)

:::tip
이번엔 날씨 대신 "공부 시작해야 할 시간이에요!"라는 문구를 매일 오후 3시(15:00)에 자동으로 출력하도록 scheduler.py를 고쳐서 실행해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 시각을 24시간제("15:00")로 정확히 썼나요, 오후 3시를 "3시"라고 쓰지는 않았나요? | 5 |
| while True 안에 run_pending()과 time.sleep()이 둘 다 들어있나요? | 5 |
| 창을 닫지 않고 켜둔 채로 실제 지정 시각까지 기다려서 출력을 확인했나요? | 5 |

## 관련 개념

- [Scheduling](/concepts/scheduling/)
- [Cron](/concepts/cron/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_scheduling_cron) · 방식: api-capture</sub>
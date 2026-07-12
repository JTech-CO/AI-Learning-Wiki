---
title: "로깅 — 자동화가 한 일 남기기"
description: "logging으로 실행 기록을 남겨 문제를 추적하고 신뢰성 확보."
sidebar:
  order: 24
---
_logging으로 실행 기록을 남겨 문제를 추적하고 신뢰성 확보._

:::note[학습 목표]
- 파이썬 코드나 자동화에 logging을 붙여 '언제, 무엇이, 성공했는지 실패했는지'를 파일로 남기고, 문제가 생겼을 때 그 기록을 열어 원인을 찾을 수 있다.
:::

> 자동화가 새벽에 혼자 돌다가 어제 갑자기 멈췄다. 그런데 '언제·왜' 멈췄는지 아무 흔적이 없다면? 로깅은 자동화가 남기는 CCTV 녹화 같은 것이다.

## 이 레슨에서 만드는 것

파이썬 코드나 자동화에 logging을 붙여 '언제, 무엇이, 성공했는지 실패했는지'를 파일로 남기고, 문제가 생겼을 때 그 기록을 열어 원인을 찾을 수 있다.

## 핵심 개념

로깅(logging)은 프로그램이 일하면서 '나 지금 이거 했어요'라고 일기장에 적는 것이다. print로 화면에 찍는 것과 비슷하지만, print는 화면 끄면 사라지는 낙서라면, 로깅은 시간·중요도까지 붙여 파일에 차곡차곡 저장되는 정식 일기다. 중요도는 등급으로 나뉜다: INFO(그냥 알림), WARNING(좀 이상함), ERROR(문제 터짐). 비유하자면 자동화 로봇이 목에 건 블랙박스다. 나중에 사고가 나면 그 녹화를 돌려보며 '아, 여기서 파일을 못 찾았구나' 하고 범인을 잡을 수 있다.

### 왜 작동하는가

파이썬의 logging 모듈은 이미 수많은 개발자가 써온 "시간+등급+메시지"를 자동으로 파일에 적어주는 기록 장치예요. 그래서 당신은 logging.info('무슨 일')처럼 한 줄만 심으면, 시간 도장·등급 분류·파일 저장은 전부 파이썬이 알아서 해줍니다. 사고가 나도 print처럼 사라지지 않고 app.log 안에 증거로 남아있어요.

## 👀 따라하기 예시

매일 새벽 3시에 폴더에서 엑셀 파일을 읽어 정리하는 자동화가 있어요. 어젯밤에 멈췄는데 왜 멈췄는지 모르는 상황. 제가 먼저 로깅을 붙여볼게요, 눈으로 따라오세요.

### 1. ① 코드 맨 위에 로깅 설정 한 줄 추가

**실제 결과**

```text
import logging
logging.basicConfig(filename='app.log', level=logging.INFO, encoding='utf-8')
```

> filename을 정해줘야 화면이 아니라 파일에 쌓여요. 이 한 줄이 CCTV를 다는 것과 같아요.

### 2. ② 각 단계 시작할 때 info 기록

**실제 결과**

```text
logging.info('엑셀 파일 읽기 시작')
logging.info('정리 완료, 12개 행 처리')
```

> 평소엔 아무 일 없다는 걸 보여주는 "정상 알림"이에요. 나중에 "여기까진 잘 됐구나"를 확인하는 기준점이 됩니다.

### 3. ③ 위험한 부분은 try/except로 감싸고 실패를 error로 기록

**실제 결과**

```text
try:
    open('data.xlsx')
except Exception as e:
    logging.error(f'파일 못 찾음: {e}')
```

> 에러가 나도 프로그램이 조용히 죽어버리면 원인을 못 찾아요. except 안에 error를 심어야 "범인의 몽타주"가 남습니다.

### 4. ④ 실행 후 app.log 열어서 확인

**실제 결과**

```text
2024-06-01 03:00:01 INFO 엑셀 파일 읽기 시작
2024-06-01 03:00:02 ERROR 파일 못 찾음: [Errno 2] No such file
```

> 바로 이거예요! "새벽 3시에 파일이 없어서 멈췄구나"를 1초 만에 알 수 있어요.

### 완성 결과

실행할 때마다 시간·등급·메시지가 쌓이는 app.log 파일. 좋은 결과의 기준: (1) 각 주요 단계마다 info가 최소 1줄 있다 (2) try/except로 감싼 위험 구간에 error 기록이 있다 (3) 로그만 보고도 무슨 일이 있었는지 남이 알 수 있다.

## 단계별 따라하기

### 파이썬 준비 확인

컴퓨터에 파이썬이 깔려 있어야 한다. 시작 메뉴에서 'cmd'(명령 프롬프트)를 열고 'python --version'을 입력해 버전이 나오면 OK. 없으면 python.org에서 다운로드 후 설치할 때 'Add Python to PATH' 체크박스를 꼭 켠다.

**복사·실행 예시**

```text
입력: python --version → 출력: Python 3.12.0
```

### 코드 파일 만들기

메모장이나 VS Code를 열고 아래 템플릿을 붙여넣는다. 파일을 바탕화면에 'auto.py'라는 이름으로 저장한다(저장할 때 파일 형식을 '모든 파일'로 바꿔 .txt가 안 붙게 한다).

**복사·실행 예시**

```text
바탕화면/auto.py 파일 생성
```

### 로깅 기본 설정 넣기

코드 맨 위에 logging을 불러오고 basicConfig로 '어디에 저장할지(filename), 어느 등급부터 남길지(level)'를 정한다. filename='app.log'로 하면 같은 폴더에 app.log 파일이 생긴다.

**복사·실행 예시**

```text
logging.basicConfig(filename='app.log', level=logging.INFO)
```

### 기록 문장 심기

자동화가 하는 각 단계마다 logging.info('시작함') 같은 문장을 넣는다. 문제가 날 만한 곳은 try/except로 감싸고 except 안에 logging.error()를 넣어 실패도 기록한다.

**복사·실행 예시**

```text
logging.info('파일 읽기 시작') / except: logging.error('파일 못 찾음')
```

### 실행하고 로그 열어보기

cmd에서 'cd Desktop'으로 바탕화면 폴더로 이동한 뒤 'python auto.py'를 입력해 실행한다. 끝나면 같은 폴더에 생긴 app.log 파일을 메모장으로 열어 시간·등급·메시지가 적혔는지 확인한다.

**복사·실행 예시**

```text
app.log 안: 2024-06-01 09:00:01 INFO 파일 읽기 시작
```

## 흔한 실수와 교정
- **실수:** print만 쓰고 로그 파일이 없다
  - **교정:** print는 화면 껐다 켜면 사라진다. logging.basicConfig에 filename='app.log'를 넣어 파일로 저장하게 바꾼다.
- **실수:** 한글 로그가 깨져서 ???로 보인다
  - **교정:** basicConfig에 encoding='utf-8'을 추가한다. 메모장 말고 VS Code로 열면 더 잘 보인다.
- **실수:** 모든 걸 error로만 남긴다
  - **교정:** 평범한 진행은 info, 좀 수상하면 warning, 진짜 문제만 error로 등급을 나눠야 나중에 진짜 사고를 빨리 찾는다.
- **실수:** 에러가 나도 로그에 안 남는다
  - **교정:** 위험한 코드를 try/except로 감싸고 except 블록 안에 logging.error(f'실패: {e}')를 넣어야 실패도 기록된다.
- **실수:** 로그가 계속 쌓여 파일이 거대해진다
  - **교정:** 당장은 괜찮지만, 커지면 logging.handlers의 RotatingFileHandler로 '용량 넘으면 새 파일'로 자동 교체하게 바꾼다.

## 완료 체크리스트

- 코드 맨 위에 import logging이 있다
- basicConfig에 filename과 level이 설정됐다
- encoding='utf-8'로 한글 안 깨지게 했다
- 주요 단계마다 logging.info가 들어갔다
- 위험한 부분은 try/except + logging.error로 감쌌다
- 실행 후 app.log 파일이 실제로 생겼고 시간·메시지가 적혔다

## 도구

- 파이썬 logging 모듈 — 코드 설치 없이 기본 내장, 기록 남기기
- VS Code — 코드 작성·로그 파일 열어보기
- 메모장 — 간단히 app.log 확인
- cmd(명령 프롬프트) — 코드 실행
- ChatGPT/Claude — 기존 코드에 로깅 자동 추가 요청

## 참고 답안

import logging
logging.basicConfig(filename='photo.log', level=logging.INFO, encoding='utf-8')
logging.info('사진 세기 시작')
try:
    import os
    files = os.listdir('photos')
    logging.info(f'사진 {len(files)}장 발견')
except Exception as e:
    logging.error(f'폴더 못 찾음: {e}')

## 실전 프롬프트

### 로깅 기본 틀(복붙용)

```text
import logging

logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    encoding='utf-8'
)

logging.info('[작업이름] 시작')
try:
    # 여기에 자동화가 할 일 작성
    logging.info('[단계1 설명] 완료')
except Exception as e:
    logging.error(f'[단계1 설명] 실패: {e}')

logging.info('[작업이름] 끝')
```

> 확인된 작성 예시 없음

`eduverse` `logging`

### AI에게 로깅 추가 요청

```text
아래 파이썬 코드에 logging을 추가해줘. 각 주요 단계마다 logging.info로 진행 상황을 남기고, 에러가 날 수 있는 부분은 try/except로 감싸 logging.error로 실패를 기록해줘. 로그는 'app.log' 파일에 시간·등급·메시지 형식으로 한글이 깨지지 않게 저장되게 해줘.

[여기에 내 코드 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `logging`

## 직접 만들기 (미션)

:::tip
이번엔 "폴더 안 사진 파일 개수를 세는 자동화"라고 가정하고 로깅을 붙여보세요. (1) basicConfig로 photo.log 파일 설정 (2) 시작할 때 info로 "사진 세기 시작" 기록 (3) 폴더가 없을 경우를 대비해 try/except로 감싸고 실패 시 error 기록 (4) 실행 후 로그 파일을 열어 확인.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| app.log(또는 photo.log) 파일이 실제로 생겼고 그 안에 시간이 찍혀 있나요? | 5 |
| info와 error가 등급별로 구분돼 적혀 있나요, 아니면 전부 한 등급으로만 남았나요? | 5 |
| 일부러 폴더 이름을 틀리게 넣어봤을 때 error 로그가 제대로 남나요? | 5 |

## 관련 개념

- [Logging](/concepts/logging/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_logging) · 방식: api-capture</sub>
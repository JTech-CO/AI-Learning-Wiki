---
title: "에이전트를 API 서비스로 배포"
description: "FastAPI로 에이전트를 REST 엔드포인트로 감싸 배포하고 키·비용·동시성·타임아웃을 다루는 서비스화를 실습한다."
sidebar:
  order: 44
---
_FastAPI로 에이전트를 REST 엔드포인트로 감싸 배포하고 키·비용·동시성·타임아웃을 다루는 서비스화를 실습한다._

:::note[학습 목표]
- 이 레슨이 끝나면, 내 AI 에이전트를 curl 한 줄로 호출되는 REST API로 배포하고 키·비용·타임아웃·동시성을 안전하게 관리할 수 있습니다.
:::

> 내 노트북에서만 도는 에이전트는 나 혼자만 쓸 수 있는 장난감입니다. FastAPI로 감싸 URL 하나만 던져주면, 친구도 앱도 그 에이전트를 진짜 서비스로 부를 수 있습니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 내 AI 에이전트를 curl 한 줄로 호출되는 REST API로 배포하고 키·비용·타임아웃·동시성을 안전하게 관리할 수 있습니다.

## 핵심 개념

에이전트를 '서비스화'한다는 건, 파이썬 함수 하나를 HTTP 주소(엔드포인트)로 바꿔 누구나 요청을 보내면 응답을 받게 만드는 일입니다. FastAPI는 이걸 20줄 안팎으로 해결해 주는 파이썬 웹 프레임워크로, 함수 위에 @app.post 한 줄만 붙이면 REST API가 됩니다. 하지만 남에게 열어주는 순간 4가지 현실 문제가 생깁니다 — API 키를 코드에 박으면 털리고(키), LLM 호출은 요청당 돈이 나가며(비용), 여러 명이 동시에 부르면 서버가 막히고(동시성), 모델이 30초씩 안 끝나면 요청이 멈춥니다(타임아웃). 배달앱 주문 창구를 여는 것과 같아서, 문을 여는 것보다 '누가 몇 개를 얼마나 오래 시킬 수 있는가'를 정하는 게 진짜 일입니다.

### 왜 작동하는가

FastAPI는 파이썬 함수 위에 데코레이터 한 줄만 얹으면 그 함수를 HTTP 주소로 바꿔줍니다. 요청이 들어오면 Pydantic이 형식을 자동 검사하고, uvicorn이 실제 요청을 함수 실행으로 연결해주는 것뿐이라 여러분은 로직만 짜면 됩니다. 그래서 '내 컴퓨터에서만 돌던 코드'가 '전 세계 누구나 curl 한 줄로 부르는 서비스'로 바뀌는 겁니다.

## 👀 따라하기 예시

제가 방금 만든 요약 에이전트를 실제로 배포까지 해볼게요. 눈으로 따라오세요 — 코드 3줄이 서비스가 되는 순간입니다.

### 1. ① run_agent 함수를 그대로 두고 위에 @app.post('/ask')만 얹기

**실제 결과**

```text
POST /ask 라는 주소가 생김. 서버 켜면 http://localhost:8000/docs 에 자동으로 테스트 화면까지 생성됨
```

> 함수를 고치는 게 아니라 '포장'만 하는 거라서 기존 로직이 깨질 위험이 없어요

### 2. ② X-API-Key 헤더 검사 의존성 추가

**실제 결과**

```text
키 없이 호출하면 401 Unauthorized, 맞는 키로 호출하면 200 OK + 답변 JSON
```

> 문을 열자마자 자물쇠부터 — 안 그러면 남이 내 OpenAI 비용을 태워요

### 3. ③ timeout=25, Semaphore(5) 걸고 로컬 curl 두 번(정상/키없음) 테스트

**실제 결과**

```text
정상 요청은 2~3초 안에 답변 도착, 키 틀리면 즉시 401 — 응답이 멈추지 않고 항상 뭔가 돌아옴
```

> '언젠가 터질 문제'를 배포 전에 curl로 미리 터뜨려 확인하는 거예요

### 4. ④ Railway에 GitHub 연결 → 환경변수 대시보드 입력 → Deploy 클릭

**실제 결과**

```text
2분 뒤 https://my-agent.up.railway.app 같은 공개 URL 발급, 그 URL로 curl 하면 로컬과 똑같이 응답
```

> 코드엔 키가 한 글자도 없는데 서비스는 완벽히 동작 — 이게 '환경변수 분리'의 힘이에요

### 완성 결과

누구나 curl 한 줄로 호출 가능한 공개 API URL. 좋은 결과의 기준: (1) 키 없이 부르면 401이 뜬다 (2) 응답이 25초 안에 반드시 온다(멈추지 않는다) (3) 코드 저장소 어디에도 실제 키 문자열이 없다.

## 단계별 따라하기

### 1단계 — 에이전트 함수를 하나로 정리 (5분)

기존에 만든 에이전트 로직을 run_agent(question: str) -> str 형태의 단일 함수로 묶습니다. 아직 웹 코드는 없습니다. 로컬에서 print로 정상 동작만 확인하세요. 🙋나

**복사·실행 예시**

```text
def run_agent(question: str) -> str:
    resp = client.chat.completions.create(model='gpt-4o-mini', messages=[{'role':'user','content':question}])
    return resp.choices[0].message.content
```

### 2단계 — FastAPI로 엔드포인트 감싸기 (8분)

pip install fastapi uvicorn 후 main.py에서 POST /ask 엔드포인트를 만듭니다. 요청 바디는 Pydantic 모델로 받아 자동 검증되게 합니다. 뼈대는 AI에게 시키고 함수 연결은 내가 확인하세요. 🤝함께

**복사·실행 예시**

```text
from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
class Ask(BaseModel):
    question: str
@app.post('/ask')
def ask(body: Ask):
    return {'answer': run_agent(body.question)}
```

### 3단계 — 키를 환경변수로 빼고 API 키 인증 걸기 (7분)

OpenAI 키는 os.environ['OPENAI_API_KEY']로 읽어 코드에서 제거합니다. 그리고 내 서비스 자체도 아무나 못 부르게 X-API-Key 헤더를 검사하는 의존성을 추가하세요. 🙋나

**복사·실행 예시**

```text
import os
from fastapi import Header, HTTPException
SERVICE_KEY = os.environ['MY_SERVICE_KEY']
def auth(x_api_key: str = Header(...)):
    if x_api_key != SERVICE_KEY:
        raise HTTPException(401, 'bad key')
# @app.post('/ask', dependencies=[Depends(auth)])
```

### 4단계 — 타임아웃·동시성·비용 가드 넣기 (10분)

LLM 호출에 timeout=25를 걸고, asyncio.Semaphore로 동시 요청 수를 제한하며, 요청당 max_tokens 상한과 입력 길이 제한으로 비용 폭주를 막습니다. 설계는 AI와 상의하고 숫자는 내가 정하세요. 🤝함께

**복사·실행 예시**

```text
sem = asyncio.Semaphore(5)  # 동시 5건까지
if len(body.question) > 2000:
    raise HTTPException(413, 'too long')
client = OpenAI(timeout=25.0)
# max_tokens=500 로 응답 상한
```

### 5단계 — 로컬 실행 후 curl로 호출 테스트 (5분)

uvicorn main:app --reload 로 띄우고, curl로 정상 요청과 키 없는 요청 두 가지를 모두 테스트해 401이 제대로 나는지 확인하세요. 🙋나

**복사·실행 예시**

```text
curl -X POST localhost:8000/ask -H 'X-API-Key: mysecret' -H 'Content-Type: application/json' -d '{"question":"파이썬이 뭐야?"}'
```

### 6단계 — Railway/Render에 배포하고 공개 URL 받기 (10분)

requirements.txt를 만들고 GitHub에 올린 뒤 Railway에서 배포합니다. 환경변수(OPENAI_API_KEY, MY_SERVICE_KEY)는 코드가 아니라 대시보드에 넣으세요. 배포 후 공개 URL로 다시 curl 테스트합니다. 🤝함께

**복사·실행 예시**

```text
# requirements.txt
fastapi
uvicorn
openai
# Railway Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

## 흔한 실수와 교정
- **실수:** OpenAI API 키를 main.py 코드에 그대로 적고 GitHub에 push한다.
  - **교정:** 키는 반드시 os.environ 에서 읽고, 실제 값은 Railway/Render 대시보드의 환경변수에 넣는다. .gitignore에 .env를 추가하고, 이미 올렸다면 즉시 키를 폐기·재발급한다.
- **실수:** 인증 없이 /ask를 공개해 아무나 호출 → 남이 내 OpenAI 비용을 태운다.
  - **교정:** X-API-Key 헤더 검사 의존성을 모든 유료 엔드포인트에 붙이고, 입력 길이·max_tokens 상한과 동시 요청 제한으로 비용 상한을 강제한다.
- **실수:** 타임아웃을 안 걸어 모델이 느릴 때 요청이 무한정 매달리고 서버가 먹통이 된다.
  - **교정:** LLM 클라이언트에 timeout(예: 25초)을 명시하고, Semaphore로 동시 처리 수를 제한해 한 요청이 전체를 막지 않게 한다.

## 완료 체크리스트

- run_agent 함수가 로컬에서 단독으로 동작하는 걸 확인했다
- POST /ask 엔드포인트가 Pydantic 모델로 입력을 검증한다
- OpenAI 키와 서비스 키를 코드가 아닌 환경변수로 뺐다
- 타임아웃·동시성 제한·입력 길이·max_tokens 가드를 넣었다
- 배포된 공개 URL로 정상 요청(200)과 키 없는 요청(401)을 모두 curl 테스트했다

## 도구

- FastAPI (https://fastapi.tiangolo.com) — 파이썬 함수를 REST API로 감싸는 웹 프레임워크
- Uvicorn (https://www.uvicorn.org) — FastAPI 앱을 실행하는 ASGI 서버
- Railway (https://railway.app) — GitHub 연동 원클릭 배포·환경변수 관리
- curl (https://curl.se) — 터미널에서 엔드포인트를 호출·검증하는 도구

## 참고 답안

@app.post('/summarize', dependencies=[Depends(auth)])\ndef summarize(body: Summarize):\n    if len(body.text) > 3000:\n        raise HTTPException(413, 'too long')\n    resp = client.chat.completions.create(model='gpt-4o-mini', timeout=25, max_tokens=300, messages=[{'role':'user','content':f'3문장으로 요약: {body.text}'}])\n    return {'summary': resp.choices[0].message.content}

## 실전 프롬프트

### FastAPI 에이전트 서버 뼈대 생성

```text
파이썬 함수 run_agent(question: str) -> str 를 FastAPI로 감싸는 main.py 전체 코드를 만들어줘. 요구사항: (1) POST /ask 엔드포인트, Pydantic 모델로 question 받기 (2) X-API-Key 헤더로 서비스 인증, 틀리면 401 (3) OpenAI 키와 서비스 키는 os.environ 에서 읽기 (4) LLM 호출 timeout 25초 (5) 입력 길이 2000자 초과 시 413. 주석은 한국어로.
```

> 확인된 작성 예시 없음

`eduverse` `deploy-api-service`

### 동시성·비용 가드 추가

```text
아래 FastAPI 코드에 동시 요청 제한(asyncio.Semaphore 5건)과 요청당 max_tokens 상한, 그리고 요청별 처리 시간·토큰을 로깅하는 코드를 추가해줘. 초과 시 429를 반환하도록 해. 코드:
[내 main.py 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `deploy-api-service`

### 배포 파일 세트 생성

```text
이 FastAPI 앱을 Railway에 배포하려고 해. requirements.txt, .gitignore, 그리고 Railway Start Command를 알려줘. 환경변수는 OPENAI_API_KEY 와 MY_SERVICE_KEY 두 개야. 파이썬 버전은 3.11 기준으로.
```

> 확인된 작성 예시 없음

`eduverse` `deploy-api-service`

### curl 테스트 시나리오 만들기

```text
내 배포된 엔드포인트 [https://내주소/ask]를 검증할 curl 명령 5개를 만들어줘: (1) 정상 요청 (2) 키 없는 요청 401 (3) 잘못된 키 401 (4) 2000자 초과 413 (5) 빈 question. 각각 기대 응답도 적어줘.
```

> 확인된 작성 예시 없음

`eduverse` `deploy-api-service`

## 직접 만들기 (미션)

:::tip
이번엔 여러분 차례입니다. 방금 만든 /ask 엔드포인트에 '/summarize' 엔드포인트를 하나 더 추가해보세요. 입력은 최대 3000자 텍스트, 출력은 3문장 요약. 인증·타임아웃·길이제한을 모두 그대로 적용해야 합니다.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 키 없이 /summarize를 호출하면 401이 뜨나요? | 5 |
| 3000자 넘는 텍스트를 넣으면 413 에러로 바로 막히나요? | 5 |
| timeout과 max_tokens를 걸어서 요청이 절대 무한정 매달리지 않게 했나요? | 5 |

## 관련 개념

- [Deploy](/concepts/deploy/)
- [Api](/concepts/api/)
- [Service](/concepts/service/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=engineer&node=engineerx_deploy_api_service) · 방식: api-capture</sub>
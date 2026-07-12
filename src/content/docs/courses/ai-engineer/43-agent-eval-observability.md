---
title: "에이전트 평가·관측 — eval·트레이싱·디버깅"
description: "에이전트가 \"왜 그렇게 했는지\" 트레이싱(LangSmith·Langfuse)으로 들여다보고, eval 셋으로 성능·회귀를 측정하며, 실패를 디버깅해 신뢰할 수 있게 만든다."
sidebar:
  order: 43
---
_에이전트가 "왜 그렇게 했는지" 트레이싱(LangSmith·Langfuse)으로 들여다보고, eval 셋으로 성능·회귀를 측정하며, 실패를 디버깅해 신뢰할 수 있게 만든다._

:::note[학습 목표]
- Langfuse라는 무료 도구에 내 AI 호출을 연결해서, (1) AI가 무슨 질문을 받고 무슨 답을 했는지 화면으로 보고, (2) '정답표'를 만들어 AI 답을 자동 채점하고, (3) 답이 나빠진 순간을 찾아내 고칠 수 있게 된다.
:::

> 내가 만든 AI가 가끔 엉뚱한 답을 하는데 '왜 그랬는지' 모르면, 매번 운에 맡기는 셈이다. 이 레슨은 AI의 머릿속을 'CCTV'처럼 들여다보고, 점수를 매겨 실수를 잡아내는 법을 알려준다.

## 이 레슨에서 만드는 것

Langfuse라는 무료 도구에 내 AI 호출을 연결해서, (1) AI가 무슨 질문을 받고 무슨 답을 했는지 화면으로 보고, (2) '정답표'를 만들어 AI 답을 자동 채점하고, (3) 답이 나빠진 순간을 찾아내 고칠 수 있게 된다.

## 핵심 개념

AI(특히 여러 단계를 스스로 처리하는 '에이전트')는 속이 깜깜한 상자 같다. 답만 보이고 과정이 안 보인다. '트레이싱(tracing)'은 그 상자에 유리창을 다는 것이다 — AI가 받은 질문, 거친 단계, 내놓은 답을 하나하나 기록한다. 마치 택배 추적처럼 'AI 생각의 이동 경로'를 보는 것이다. '평가(eval)'는 시험 채점과 같다. 미리 만든 '정답표(질문+모범답안 모음)'로 AI 답에 점수를 매긴다. '관측(observability)'은 이 둘을 합쳐, 평소에 AI가 잘 돌고 있는지 계기판처럼 지켜보는 것이다. 핵심: 안 보이면 못 고친다. 보이게 만들면 고칠 수 있다.

### 왜 작동하는가

AI 호출에 @observe() 딱 한 줄을 붙이면, Langfuse가 질문·답·걸린 시간·비용을 자동으로 다 받아 적어줍니다. 그래서 당신은 코드에 그 한 줄만 넣으면, 나머지 "무슨 일이 있었는지 기록하기"는 Langfuse가 대신 해줘요. 안 보이던 AI의 속마음이 갑자기 CCTV 화면처럼 보이는 거죠.

## 👀 따라하기 예시

초등학생용 수학 퀴즈 AI를 만들었는데, 어떤 날은 잘 풀고 어떤 날은 이상한 답을 합니다. 제가 먼저 Langfuse를 연결해서 원인을 찾는 과정을 처음부터 끝까지 보여드릴게요. 눈으로 따라오세요.

### 1. ① app.py에 @observe() 한 줄을 함수 위에 붙이고 python app.py 실행

**실제 결과**

```text
터미널: "한글(훈민정음)입니다" 출력, 에러 없음
```

> 코드는 한 줄만 바꿨는데, 이 순간부터 모든 AI 호출이 자동으로 기록되기 시작해요 — 이게 트레이싱의 시작점이에요.

### 2. ② Langfuse 화면 Tracing → Traces 클릭

**실제 결과**

```text
방금 실행한 질문이 한 줄로 리스트에 뜸: "세종대왕이 만든 글자 이름은?" / Latency 0.8s / Cost $0.00002
```

> 내가 짠 코드가 실제로 뭘 주고받았는지, 추측이 아니라 눈으로 확인할 수 있어요.

### 3. ③ Datasets에 수학 문제 10개 + 정답을 넣고 Evaluators에서 Correctness 템플릿 적용

**실제 결과**

```text
대시보드에 평균 점수 0.92로 표시됨
```

> 한 문제 잘 맞혔다고 안심하면 안 돼요. 여러 문제를 한꺼번에 채점해야 진짜 실력을 알 수 있어요.

### 4. ④ Dashboards에서 날짜별 점수 그래프 확인

**실제 결과**

```text
6/20에 점수가 0.9에서 0.4로 뚝 떨어진 지점 발견 → 그 트레이스 열어보니 프롬프트에서 "단계별로 풀어라" 문장이 빠져있었음
```

> 추측 대신 그래프가 "언제부터 나빠졌는지" 정확히 짚어주니, 원인을 바로 찾아 고칠 수 있어요.

### 완성 결과

Langfuse 대시보드에 연결된 AI 프로그램 + 채점용 데이터셋. 좋은 결과의 기준: (1) Traces 화면에서 모든 호출의 Input/Output/비용이 하나도 빠짐없이 보인다 (2) 데이터셋 평균 점수가 숫자로 나온다 (3) 점수가 떨어진 날짜와 원인을 트레이스만 보고 바로 설명할 수 있다.

## 단계별 따라하기

### 1. 무엇을 만들지 정하고 준비물 챙기기

우리는 'OpenAI 또는 Claude를 부르는 작은 파이썬 프로그램'에 관측 기능을 붙인다. 준비물 3가지: (1) 컴퓨터에 파이썬 설치(python.org 접속 → 'Download' 노란 버튼 → 설치 시 'Add Python to PATH' 체크 필수), (2) AI 호출용 API 키 1개(OpenAI는 platform.openai.com, Claude는 console.anthropic.com에서 가입 후 'API Keys' 메뉴 → 'Create' 클릭 → sk-로 시작하는 긴 문자열 복사), (3) 인터넷. 막히면: 'python --version'을 터미널(윈도우는 cmd, 맥은 터미널 앱)에 쳐서 버전 숫자가 나오면 설치 성공.

**복사·실행 예시**

```text
터미널에 입력: python --version  →  화면에 'Python 3.12.1' 같은 줄이 보이면 OK
```

### 2. Langfuse 무료 계정 만들기 (AI용 CCTV)

브라우저에서 cloud.langfuse.com 접속 → 'Sign up' 클릭 → 이메일/구글로 가입(무료, 카드 불필요). 로그인되면 'Create Organization' → 이름 아무거나(예: my-test) → 'Create Project' → 이름(예: first-agent). 프로젝트가 생기면 왼쪽 톱니바퀴(Settings) → 'API Keys' → 'Create new API key' 클릭. 화면에 'Public Key(pk-로 시작)'와 'Secret Key(sk-로 시작)' 두 개가 뜬다. Secret은 한 번만 보이니 메모장에 바로 복사. 막히면: 키가 안 보이면 'Create new API key'를 다시 누르면 새로 생성된다.

**복사·실행 예시**

```text
복사해 둘 3개: LANGFUSE_PUBLIC_KEY=pk-lf-xxxx / LANGFUSE_SECRET_KEY=sk-lf-xxxx / LANGFUSE_HOST=https://cloud.langfuse.com
```

### 3. 파이썬 도구 설치하고 키 넣기

터미널을 열고 아래 한 줄을 붙여넣어 Enter(필요한 프로그램을 한 번에 받아온다). 그다음 작업 폴더에 '.env'라는 이름의 메모장 파일을 만들어 키 4개를 적는다(파일 이름 앞에 점이 꼭 있어야 함). 막히면: 'pip가 없다'고 나오면 'python -m pip install ...'처럼 앞에 'python -m'을 붙인다.

**복사·실행 예시**

```text
설치: pip install langfuse openai python-dotenv
.env 파일 내용:
OPENAI_API_KEY=sk-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

### 4. AI 호출에 '유리창' 달기 (트레이싱)

메모장이나 VS Code로 'app.py' 파일을 만들고 아래 코드를 붙여넣는다. 핵심은 단 한 줄 @observe() — 이 표시를 함수 위에 붙이면 그 안의 AI 호출이 전부 Langfuse에 자동 기록된다. 터미널에서 'python app.py' 실행 → 답이 출력되면 성공. 막히면: 'ModuleNotFoundError'가 나오면 3단계 설치를 안 한 것이니 다시.

**복사·실행 예시**

```text
from langfuse.openai import openai
from langfuse import observe
from dotenv import load_dotenv
load_dotenv()

@observe()
def ask(q):
    r = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":q}])
    return r.choices[0].message.content

print(ask("세종대왕이 만든 글자 이름은?"))
```

### 5. Langfuse 화면에서 '생각의 경로' 들여다보기

cloud.langfuse.com으로 돌아가 왼쪽 메뉴 'Tracing' → 'Traces' 클릭. 방금 실행한 질문이 한 줄로 떠 있다. 그 줄을 클릭하면 오른쪽에 상세가 펼쳐진다: Input(보낸 질문), Output(받은 답), 걸린 시간(Latency), 사용 토큰 수, 비용(원/달러)까지 보인다. 이게 'AI CCTV'다. 막히면: 트레이스가 안 보이면 1분 기다렸다 새로고침(F5). 그래도 없으면 .env의 키 4개 오타 확인.

**복사·실행 예시**

```text
화면 예: Input '세종대왕이 만든 글자 이름은?' / Output '한글(훈민정음)입니다' / Latency 0.8s / Tokens 32 / Cost $0.00002
```

### 6. '정답표' 만들고 자동 채점하기 (eval)

Langfuse 왼쪽 메뉴 'Datasets' → 'New dataset' → 이름(예: math-quiz). 들어가서 'Add item'으로 질문과 모범답안을 몇 개 넣는다(input에 질문, expected_output에 정답). 그다음 'Evaluators'(또는 LLM-as-a-Judge) 메뉴에서 'Set up evaluator' → 'Correctness(정확성)' 템플릿 선택 → 어떤 데이터에 적용할지 고르고 'Save'. 이러면 AI 답이 모범답안과 얼마나 맞는지 AI 심판이 0~1점으로 자동 채점한다. 막히면: Judge가 OpenAI 키를 또 물으면 Settings에서 같은 키를 한 번 등록.

**복사·실행 예시**

```text
데이터셋 항목: input '2+3은?' / expected_output '5'  →  AI가 '5'라 답하면 점수 1.0, '6'이라 답하면 0.0
```

### 7. 점수 떨어진 순간 찾아 고치기 (디버깅 + 회귀 감시)

'Dashboards' 또는 'Scores' 화면에서 시간에 따른 평균 점수 그래프를 본다. 어느 날 점수가 뚝 떨어졌다면(=회귀, 잘되던 게 나빠짐) 그 구간의 낮은 점수 트레이스를 클릭해 Input/Output을 직접 읽는다. 보통 '프롬프트를 바꿨더니' 또는 '모델을 바꿨더니' 나빠진 게 보인다. 원인을 고친 뒤 같은 데이터셋으로 다시 돌려 점수가 오르는지 확인한다. 막히면: 무엇이 바뀌었는지 모르면 트레이스의 'Metadata'에서 모델 이름·프롬프트 버전을 비교.

**복사·실행 예시**

```text
그래프에서 6/20에 0.9 → 0.4로 급락 발견 → 그날 트레이스 열어보니 프롬프트에서 '단계별로 풀어라' 문장이 빠짐 → 다시 넣고 재실행 → 점수 0.9 복구
```

## 흔한 실수와 교정
- **실수:** 키를 코드에 그대로 적어 깃허브에 올려 유출됨
  - **교정:** 키는 반드시 .env 파일에 넣고, 코드에는 load_dotenv()로 불러온다. .gitignore에 '.env' 한 줄을 추가해 업로드를 막는다.
- **실수:** 트레이스가 안 보이는데 코드만 계속 고침
  - **교정:** 9할은 .env 키 오타이거나 LANGFUSE_HOST가 빠진 것이다. 키 4개를 다시 복사하고, 보낸 뒤 1분쯤 기다렸다 새로고침한다.
- **실수:** 한 번 잘 나온 답만 보고 '다 됐다'고 끝냄
  - **교정:** AI는 같은 질문에도 답이 흔들린다. 반드시 정답표(데이터셋)로 여러 문항을 채점해 평균 점수로 판단한다. 1개 통과 ≠ 신뢰.
- **실수:** 점수가 떨어졌는데 원인 추측만 함
  - **교정:** 추측 대신 낮은 점수 트레이스를 직접 열어 Input/Output/Metadata를 읽는다. 무엇이 언제 바뀌었는지 데이터가 답을 알려준다.

## 완료 체크리스트

- Langfuse 프로젝트를 만들고 API 키 3개를 .env에 넣었다
- app.py를 실행해 Langfuse 'Traces'에서 내 질문·답·비용이 보인다
- 질문+모범답안으로 데이터셋(정답표)을 1개 이상 만들었다
- Evaluator(LLM 심판)를 켜서 AI 답이 0~1점으로 자동 채점된다
- 점수 그래프에서 떨어진 구간을 찾아 트레이스로 원인을 확인할 수 있다

## 도구

- Langfuse — AI 호출을 기록·채점·관측하는 무료 오픈소스 도구(이 레슨의 주인공)
- LangSmith — Langfuse와 같은 역할의 대안(LangChain 사용 시 궁합 좋음)
- OpenAI / Anthropic API — 채점할 대상이 되는 실제 AI 호출
- VS Code — app.py와 .env 파일을 편하게 편집하는 무료 에디터

## 참고 답안

1) python --version으로 파이썬 확인 → 2) pip install langfuse openai python-dotenv → 3) .env에 키 4개 저장 → 4) @observe() 붙인 ask() 함수로 상식 질문 실행 → 5) Langfuse Traces에서 결과 확인 → 6) Datasets에 문제 5개 넣고 Evaluators로 채점 → 7) 평균 점수 확인

## 실전 프롬프트

### LLM 심판용 채점 프롬프트(정확성)

```text
너는 엄격한 채점관이다. 아래 [질문]에 대한 [AI답]이 [모범답]과 의미상 일치하는지 판단하라.
- 완전히 맞으면 1, 부분만 맞으면 0.5, 틀리면 0으로 점수만 매겨라.
- 표현이 달라도 핵심 사실이 같으면 정답으로 본다.
[질문]: [여기에 질문]
[모범답]: [여기에 정답]
[AI답]: [여기에 AI가 낸 답]
점수와 한 줄 이유를 출력하라.
```

> 확인된 작성 예시 없음

`eduverse` `agent-eval-observability`

### 실패 트레이스 원인 분석

```text
다음은 점수가 낮게 나온 AI 호출 기록이다. 왜 답이 틀렸는지 가장 가능성 높은 원인 3가지를 짚고, 각각 어떻게 고칠지 한 줄씩 제안하라.
질문: [Input 붙여넣기]
AI 답: [Output 붙여넣기]
기대한 답: [정답 붙여넣기]
사용 모델/프롬프트: [Metadata 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `agent-eval-observability`

### 테스트용 정답표 자동 생성

```text
[주제: 초등 분수 덧셈]에 대해 난이도가 골고루 섞인 평가용 질문-정답 쌍 10개를 만들어라. 형식은 JSON 배열로 input과 expected_output 키만 사용하라. 답은 짧고 명확하게.
```

> 확인된 작성 예시 없음

`eduverse` `agent-eval-observability`

## 직접 만들기 (미션)

:::tip
이번엔 수학 퀴즈 대신 "오늘의 상식 퀴즈 AI"를 만들어보세요. app.py에 @observe()를 붙이고, Langfuse Datasets에 상식 문제 5개+정답을 넣어 Correctness 평가를 돌려보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| Langfuse Traces 화면에 내가 실행한 질문이 실제로 떠 있나요? | 5 |
| 데이터셋 평균 점수가 숫자(0~1)로 나왔나요? | 5 |
| 점수가 낮은 문제가 있다면, 그 트레이스를 열어 Input/Output만 보고 왜 틀렸는지 설명할 수 있나요? | 5 |

## 관련 개념

- [Agent](/concepts/agent/)
- [Observability](/concepts/observability/)
- [Evaluation](/concepts/evaluation/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=engineer&node=awti_agent_eval_observability) · 방식: api-capture</sub>
---
title: "헤르메스 — 자가성장 AI 에이전트 (MCP·메모리·자율루프)"
description: "Nous Research의 오픈소스 자가성장 에이전트 Hermes를 설치·구동하고, MCP로 외부 도구를 연결하며, 영속 메모리로 스스로 재사용 스킬을 쌓는 자율 루프를 운영한다. 오픈소스 LLM을 두뇌로 쓰고 Claude로 주기적으로 업그레이드하는 조합까지 다룬다."
sidebar:
  order: 9
---
_Nous Research의 오픈소스 자가성장 에이전트 Hermes를 설치·구동하고, MCP로 외부 도구를 연결하며, 영속 메모리로 스스로 재사용 스킬을 쌓는 자율 루프를 운영한다. 오픈소스 LLM을 두뇌로 쓰고 Claude로 주기적으로 업그레이드하는 조합까지 다룬다._

:::note[학습 목표]
- 내 컴퓨터에 오픈소스 자가성장 에이전트 헤르메스를 설치·구동하고, MCP로 파일·웹 같은 외부 도구를 연결하며, 영속 메모리로 스킬을 쌓는 자율 루프를 직접 운영할 수 있다.
:::

> AI한테 매번 똑같은 설명을 반복하는 게 지겹지 않나요? 헤르메스는 한 번 가르친 일을 '스킬'로 저장해 다음엔 알아서 처리하는, 스스로 자라는 AI 비서입니다.

## 이 레슨에서 만드는 것

내 컴퓨터에 오픈소스 자가성장 에이전트 헤르메스를 설치·구동하고, MCP로 파일·웹 같은 외부 도구를 연결하며, 영속 메모리로 스킬을 쌓는 자율 루프를 직접 운영할 수 있다.

## 핵심 개념

헤르메스는 Nous Research가 만든 무료 오픈소스 'AI 직원'입니다. 보통 챗봇은 대화창을 끄면 다 잊어버리지만, 헤르메스는 '메모리'라는 노트에 배운 걸 적어두고 다음에 꺼내 씁니다. MCP(Model Context Protocol·모델이 외부 도구와 대화하는 약속)는 헤르메스에게 손발을 달아주는 USB 포트 같은 거예요. 한 번 꽂으면 파일을 읽고, 웹을 검색하고, 명령을 실행합니다. 두뇌는 무료 오픈소스 LLM을 쓰다가, 어려운 일이 생기면 똑똑한 Claude로 잠깐 바꿔 끼울 수도 있죠. 마치 신입사원이 매일 업무일지를 쓰며 점점 베테랑이 되는 것과 같습니다.

### 왜 작동하는가

헤르메스는 대화가 끝나도 "memory" 폴더에 방금 한 일을 노트처럼 적어 남깁니다. 그래서 다음번엔 처음부터 설명 안 해도 그 노트를 꺼내 보고 바로 처리하죠. 여기에 MCP라는 공용 USB 포트를 꽂으면, 헤르메스는 내 파일도 읽고 웹도 검색할 수 있는 손발까지 얻습니다. 결국 당신은 "이거 해줘" 한 번만 말하면, 그 다음부턴 헤르메스가 알아서 더 빨라집니다.

## 👀 따라하기 예시

컴퓨터에 헤르메스를 처음 설치해서, "매일 아침 문서 폴더의 보고서를 요약해줘"라는 작업을 시키고 스킬로 저장시키는 상황이에요. 제가 먼저 처음부터 끝까지 해볼게요, 눈으로 따라오세요.

### 1. ① 터미널에 python --version, git --version 확인

**실제 결과**

```text
Python 3.11.5 / git version 2.42.0
```

> 두 버전이 안 뜨면 그 다음 단계는 다 헛수고라서, 제일 먼저 문 앞을 확인하는 거예요.

### 2. ② git clone으로 헤르메스 폴더 통째로 받기

**실제 결과**

```text
Cloning into 'hermes-agent'... Receiving objects: 100% done.
```

> 코드를 한 줄씩 받는 게 아니라 폴더째 복사하는 거라, clone 한 번이면 끝이에요.

### 3. ③ .env 파일에 두뇌 연결 정보 적기

**실제 결과**

```text
MODEL_PROVIDER=ollama\nMODEL_NAME=hermes3
```

> 등호 옆에 공백·따옴표 없이! 이거 하나 어기면 인식을 못 해요. 여기가 실수 1순위예요.

### 4. ④ python main.py 실행 후 작업 지시

**실제 결과**

```text
헤르메스: "무엇을 도와드릴까요?" → 나: "문서 폴더 보고서 요약하고 이 방법 스킬로 저장해" → 헤르메스: "요약 완료. skills/summarize_report.json 저장했습니다."
```

> "스킬로 저장해"를 직접 말해줘야 헤르메스가 메모리에 남겨요. 이 한마디가 아하 포인트예요.

### 완성 결과

완성물은 memory/skills 폴더 안에 생긴 summarize_report.json 파일이에요. 좋은 결과의 기준: (1) 파일이 실제로 생성됨 (2) 같은 요청을 또 시켰을 때 헤르메스가 더 빠르고 알아서 처리함 (3) .env에 키가 안전하게(공백·따옴표 없이) 들어있음.

## 단계별 따라하기

### 준비물 확인 (Python·Git)

헤르메스는 Python으로 돌아갑니다. python.org에서 Python 3.10 이상을 설치하고, git-scm.com에서 Git을 설치하세요. 설치 후 터미널(윈도우=명령프롬프트/cmd, 맥=터미널)에 'python --version'과 'git --version'을 쳐서 버전이 나오면 OK.

**복사·실행 예시**

```text
터미널에 python --version → 'Python 3.11.5'가 보이면 성공
```

### 헤르메스 코드 내려받기

Nous Research 깃허브(github.com에서 'Nous Research Hermes agent' 검색, 또는 nousresearch.com 공식 링크)로 가서 초록색 'Code' 버튼 → 'Copy URL'을 누릅니다. 터미널에서 'git clone [복사한주소]'를 치면 폴더가 통째로 다운됩니다. 그 폴더로 'cd 폴더이름' 명령으로 들어가세요.

**복사·실행 예시**

```text
git clone https://github.com/NousResearch/hermes-agent → cd hermes-agent
```

### 필요한 부품 설치

헤르메스 폴더 안에서 'pip install -r requirements.txt'를 칩니다. requirements.txt는 '필요한 부품 목록표'예요. 인터넷에서 부품들을 자동으로 깔아줍니다. 빨간 에러가 뜨면 거의 인터넷 끊김이거나 Python 버전 문제이니 step 1을 다시 확인하세요.

**복사·실행 예시**

```text
pip install -r requirements.txt → 'Successfully installed...' 가 마지막에 뜨면 완료
```

### 두뇌(LLM) 연결하기

헤르메스에게 생각할 두뇌를 줘야 합니다. 무료로 쓰려면 Ollama(ollama.com 설치 후 터미널에 'ollama pull hermes3' 입력)로 내 컴퓨터에서 오픈소스 모델을 돌립니다. 폴더 안 '.env' 파일(메모장으로 열기)에 모델 주소와 키를 적습니다. Claude를 쓰려면 console.anthropic.com에서 API 키를 발급받아 같은 .env에 ANTHROPIC_API_KEY=값 형태로 붙여넣으세요.

**복사·실행 예시**

```text
.env 파일에: MODEL_PROVIDER=ollama / MODEL_NAME=hermes3  (또는 ANTHROPIC_API_KEY=sk-ant-...)
```

### MCP로 외부 도구 꽂기

MCP는 헤르메스의 손발입니다. 설정 파일(보통 mcp_config.json 또는 .env 안)에 쓰고 싶은 도구를 적습니다. 가장 쉬운 건 '파일시스템 MCP'(내 폴더 읽기/쓰기)와 '웹검색 MCP'예요. modelcontextprotocol.io 문서에서 서버 이름을 복사해 config에 한 줄씩 추가하면 됩니다.

**복사·실행 예시**

```text
{"servers": [{"name":"filesystem","path":"/내문서폴더"}, {"name":"web-search"}]}
```

### 에이전트 실행 & 자율 루프 켜기

폴더에서 'python main.py' (또는 README에 적힌 실행 명령)를 칩니다. 헤르메스가 깨어나 '무엇을 도와드릴까요?'라고 묻습니다. 목표를 주면 → 도구를 호출하고 → 결과를 보고 → 메모리에 저장하는 루프가 자동으로 돕니다. 종료는 Ctrl+C.

**복사·실행 예시**

```text
python main.py → '내 문서 폴더에서 보고서.txt 찾아 요약하고, 이 방법을 스킬로 저장해' 입력
```

### 메모리·스킬 쌓이는지 확인

헤르메스 폴더 안 'memory' 또는 'skills' 폴더를 열어보세요. 앞에서 시킨 작업이 파일로 저장돼 있습니다. 같은 종류의 일을 또 시키면 헤르메스가 '전에 했던 방법'을 꺼내 더 빠르게 처리합니다. 이게 '자가성장'의 핵심입니다.

**복사·실행 예시**

```text
memory/skills/summarize_report.json 파일이 생겼다면 스킬 저장 성공
```

## 흔한 실수와 교정
- **실수:** Python 버전이 낮아서 설치 명령이 빨간 에러로 멈춤
  - **교정:** python --version으로 확인 후 3.10 미만이면 python.org에서 최신 버전 재설치. 'python' 대신 'python3'를 쳐야 하는 맥/리눅스도 있음.
- **실수:** .env 파일에 API 키를 따옴표나 공백과 함께 넣어 인식 안 됨
  - **교정:** KEY=값 형식으로 등호 양옆에 공백 없이, 따옴표 없이 한 줄에 입력. 파일명은 정확히 '.env'(앞에 점)여야 함.
- **실수:** MCP 도구가 연결 안 돼 헤르메스가 '도구를 찾을 수 없음'이라고 함
  - **교정:** mcp_config의 서버 이름 철자와 폴더 경로가 실제와 맞는지 확인. 경로는 절대경로(처음부터 끝까지 전체 주소)로 적기. 해당 MCP 서버가 설치됐는지도 점검.
- **실수:** 메모리가 안 쌓여서 매번 처음부터 다시 시킴
  - **교정:** 작업 끝에 '이 방법을 스킬로 저장해줘'를 명시. 그래도 안 되면 memory 폴더에 쓰기 권한이 있는지, 실행할 때 같은 폴더에서 켰는지 확인.
- **실수:** 무료 로컬 모델이 너무 느리거나 멍청한 답을 함
  - **교정:** 내 컴퓨터 사양이 낮으면 작은 모델(예: hermes3:8b)을 쓰거나, 중요한 작업만 Claude API로 잠깐 전환. 일상 작업은 로컬, 어려운 작업만 Claude 조합이 가성비 최고.

## 완료 체크리스트

- python --version과 git --version이 정상 출력된다
- 헤르메스 폴더를 git clone으로 받고 pip install이 성공으로 끝났다
- .env에 두뇌(Ollama 또는 Claude 키)를 정확히 설정했다
- mcp_config에 파일/웹 도구를 최소 1개 연결했다
- python main.py로 헤르메스가 깨어나 인사한다
- 작업을 시키고 'memory/skills' 폴더에 스킬 파일이 생겼다
- 같은 작업을 두 번째 시켰을 때 저장된 스킬을 재사용한다

## 도구

- Nous Research Hermes (깃허브) — 자가성장 에이전트 본체
- Python 3.10+ — 헤르메스 실행 언어
- Git — 코드 내려받기
- Ollama — 무료 오픈소스 LLM 두뇌(로컬 구동)
- Claude API (Anthropic Console) — 어려운 작업용 업그레이드 두뇌
- MCP (modelcontextprotocol.io) — 파일·웹 등 외부 도구 연결 규약

## 참고 답안

1) mcp_config에 filesystem MCP가 내 문서 폴더 경로로 연결돼 있는지 먼저 확인 → 2) python main.py 실행 → 3) "문서 폴더에서 새 파일 이름만 목록으로 정리하고, 이 방법을 스킬로 저장해"라고 지시 → 4) memory/skills 폴더에 새 json 파일이 생겼는지 확인.

## 실전 프롬프트

### 첫 작업 + 스킬 저장

```text
[내 문서 폴더] 안에서 [파일이름 또는 조건]을 찾아서 [요약/정리/이름변경] 해줘. 그리고 이 작업 방법을 '[스킬이름]'이라는 이름으로 메모리에 저장해서 다음에 또 쓸 수 있게 해줘.
```

> 확인된 작성 예시 없음

`eduverse` `hermes-self-improving-agent`

### 저장된 스킬 재사용

```text
전에 저장한 '[스킬이름]' 스킬을 사용해서 이번엔 [새로운 대상]에 같은 작업을 해줘. 더 나은 방법이 있으면 스킬을 업데이트해줘.
```

> 확인된 작성 예시 없음

`eduverse` `hermes-self-improving-agent`

### Claude로 어려운 일 처리

```text
이번 작업은 복잡하니까 두뇌를 Claude로 바꿔서 처리해줘. 목표: [복잡한 작업 설명]. 끝나면 결과와 핵심 단계를 메모리에 정리해두고, 평소 작업용 모델로 다시 돌아와줘.
```

> 확인된 작성 예시 없음

`eduverse` `hermes-self-improving-agent`

### 자율 루프 점검

```text
지금까지 너의 메모리에 저장된 스킬 목록을 보여줘. 각 스킬이 무슨 일을 하는지 한 줄씩 설명하고, 중복되거나 안 쓰는 스킬이 있으면 정리 제안을 해줘.
```

> 확인된 작성 예시 없음

`eduverse` `hermes-self-improving-agent`

## 직접 만들기 (미션)

:::tip
이번엔 요약 대신, "매주 내 문서 폴더에서 새로 생긴 파일 이름만 골라 목록으로 정리해줘"를 헤르메스에게 시켜보고, 이 방법도 스킬로 저장시켜 보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| memory/skills 폴더에 새 스킬 파일이 실제로 생겼나요? | 5 |
| 같은 요청을 다시 시켰을 때 헤르메스가 이전 방법을 기억해서 더 빠르게 답했나요? | 5 |
| .env나 mcp_config 경로에 오타·공백 없이 정확히 적었나요? | 5 |

## 관련 개념

- [Agent](/concepts/agent/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=trends&node=awti_hermes_self_improving_agent) · 방식: api-capture</sub>
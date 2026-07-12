---
title: "JSON 다루기: LLM 응답 파싱"
description: "json.loads/dumps로 문자열과 딕셔너리를 오가고 중첩 JSON에서 원하는 값을 안전하게 꺼내는 법을 익혀, LLM이 돌려준 JSON 응답을 코드에서 바로 다루는 작은 파서를 만든다."
sidebar:
  order: 5
---
_json.loads/dumps로 문자열과 딕셔너리를 오가고 중첩 JSON에서 원하는 값을 안전하게 꺼내는 법을 익혀, LLM이 돌려준 JSON 응답을 코드에서 바로 다루는 작은 파서를 만든다._

:::note[학습 목표]
- LLM이 돌려준 JSON 응답을 json.loads로 파이썬 딕셔너리로 바꿔 값을 꺼낸다
- json.dumps(ensure_ascii=False)로 딕셔너리를 한글이 안 깨지는 문자열로 포장한다
- 중첩 JSON에서 대괄호를 이어 붙여 깊은 값을 꺼내고, 없는 키는 data.get으로 에러 없이 처리한다
:::

## 핵심 개념

JSON은 **"키-값" 짝으로 데이터를 표현하는 약속된 글자 형식**이고, 파이썬의 딕셔너리와 모양이 거의 똑같아요. 다만 컴퓨터가 주고받을 때는 항상 **'문자열(글자)' 상태**라서 그대로는 값을 꺼낼 수 없고, 먼저 딕셔너리로 '풀어야' 해요. 이때 문자열을 딕셔너리로 푸는 게 `json.loads`, 반대로 딕셔너리를 문자열로 포장하는 게 `json.dumps`예요. LLM은 답을 텍스트로 주기 때문에 그 텍스트를 `loads`로 풀어야 코드에서 `name`, `score` 같은 값을 다룰 수 있어요. **택배 상자(문자열)를 뜯어야(loads) 안에 든 물건(값)을 꺼낼 수 있는** 것과 같아요.

### 왜 이게 될까?

LLM은 답을 항상 '글자 문자열'로 돌려줘요. 택배 상자를 닫아서 보내는 셈이죠. `json.loads`는 그 상자를 뜯어서 파이썬 딕셔너리로 바꿔주고, 그러면 `data["키"]`처럼 대괄호로 원하는 값만 쏙 꺼낼 수 있어요. AI가 상자를 포장해서 주면 당신은 `loads` 한 줄로 뜯기만 하면 돼요.

## 👀 따라하기 예시 — 학생 퀴즈 결과에서 영어 점수만 뽑기

문자열 `'{"name": "지민", "scores": {"math": 88, "eng": 95}, "passed": true}'`에서 영어 점수만 꺼내볼게요.

**① 문자열을 변수에 담기**

```python
text = '{"name": "지민", "scores": {"math": 88, "eng": 95}, "passed": true}'
```

> 💡 아직은 그냥 글자 덩어리라서 대괄호로 값을 못 꺼내요. 상자가 아직 닫혀 있는 상태예요.

**② json.loads로 상자 뜯기**

```python
data = json.loads(text)
print(type(data))  # <class 'dict'>
```

> 💡 이제 진짜 파이썬 딕셔너리가 됐어요. 여기서부터 대괄호 접근이 가능해요.

**③ 중첩된 값 꺼내기**

```python
print(data["scores"]["eng"])  # 95
```

> 💡 scores 안에 또 딕셔너리가 있어서 대괄호를 두 번 이어 붙였어요. 딕셔너리 안의 딕셔너리는 계속 파고들면 돼요.

**④ 없는 키는 안전하게 대비**

```python
print(data.get("attendance", "정보 없음"))  # 정보 없음
```

> 💡 실제 LLM 응답엔 가끔 키가 빠져요. `get`을 쓰면 에러 대신 기본값이 나와서 프로그램이 안 죽어요.

좋은 결과의 기준: (1) `loads`로 먼저 딕셔너리로 바꿨는가 (2) 중첩 값을 대괄호로 정확히 짚었는가 (3) 없는 키에도 에러 없이 기본값이 나오는가.

## 단계별 따라하기

1. **파이썬 준비하고 json 불러오기** — 브라우저에서 Google Colab에 접속해 새 노트를 만들고 첫 셀에 `import json`을 입력한 뒤 Shift+Enter. 에러가 안 나면 준비 완료.

   ```python
   import json
   print('준비 완료')
   ```

2. **문자열을 딕셔너리로 풀기 (loads)** — LLM이 준 것처럼 생긴 JSON '문자열'을 변수에 담고 `json.loads`로 딕셔너리로 바꾼 뒤 대괄호로 값을 꺼낸다. 문자열은 반드시 홑따옴표 밖, JSON 안은 겹따옴표.

   ```python
   text = '{"name": "민수", "score": 92}'
   data = json.loads(text)
   print(data["name"], data["score"])  # 민수 92
   ```

3. **딕셔너리를 문자열로 포장하기 (dumps)** — 반대로 파이썬 딕셔너리를 만들고 `json.dumps`로 문자열로. 한글이 `\uXXXX`로 깨져 보이면 `ensure_ascii=False` 옵션을 넣어 사람이 읽게.

   ```python
   d = {"과목": "수학", "점수": 92}
   print(json.dumps(d, ensure_ascii=False))  # {"과목": "수학", "점수": 92}
   ```

4. **중첩 JSON에서 깊은 값 꺼내기** — LLM 응답은 보통 리스트와 딕셔너리가 겹겹이 들어 있음. 대괄호를 이어 붙여 안쪽 값까지 파고든다. 리스트는 `[0]`처럼 순서 번호로, 딕셔너리는 `["키"]`로.

   ```python
   text = '{"result": {"items": [{"q": "1+1", "a": 2}]}}'
   data = json.loads(text)
   print(data["result"]["items"][0]["a"])  # 2
   ```

5. **없는 키에도 안 죽는 안전한 꺼내기** — 실제 LLM 응답은 가끔 키가 빠짐. `data["키"]` 대신 `data.get("키", 기본값)`을 쓰면 키가 없어도 에러 대신 기본값. AI에게 '이 코드가 왜 KeyError를 냈는지'를 물어 원리를 확인.

   ```python
   data = json.loads('{"name": "민수"}')
   print(data.get("score", 0))    # 0
   print(data.get("name", "없음"))  # 민수
   ```

6. **진짜 LLM 응답으로 테스트하기** — ChatGPT나 Claude에 첫 템플릿을 붙여 JSON만 받아온 뒤 그 문자열을 그대로 `text` 변수에 넣고 `loads`로 풀어 값을 꺼낸다. 앞뒤에 설명 글이 붙어 오면 `{`부터 `}`까지만 잘라 넣는다.

   ```python
   text = '''<AI가 준 JSON>'''
   data = json.loads(text)
   print(data.get("summary", "요약 없음"))
   ```

## 흔한 실수 → 교정

- ✗ JSON 문자열 안에서 홑따옴표를 씀 (예: `'{'name': '민수'}'`) → json.loads가 거부 → **JSON 규칙상 키와 문자열 값은 반드시 겹따옴표(").** 바깥 파이썬 문자열은 홑따옴표, 안쪽 JSON은 겹따옴표로 감싼다.
- ✗ loads 없이 문자열에 바로 `["키"]`로 접근해 글자 한 개만 나오거나 에러 → **문자열은 아직 상자 그대로.** 반드시 `data = json.loads(text)`로 먼저 딕셔너리로 푼 뒤에 값을 꺼낸다.
- ✗ LLM이 준 텍스트 앞뒤에 붙은 설명이나 백틱(\`\`\`)째로 loads에 넣어 파싱 실패 → **응답에서 `{`로 시작해 `}`로 끝나는 부분만 남기고 자른다.** 애초에 프롬프트에서 'JSON만, 설명 없이'라고 못 박으면 크게 줄어든다.

## 도구

- 🛠 **Google Colab** (colab.research.google.com) — 설치 없이 브라우저에서 파이썬 실행.
- 🛠 **ChatGPT** (chat.openai.com) — JSON 형식 응답을 받아 실습 재료 만들기.
- 🛠 **Claude** (claude.ai) — JSON 파싱 에러 원인을 물어보고 코드 고치기.
- 🛠 **JSONLint** (jsonlint.com) — 붙여넣은 JSON이 유효한지 문법 검사.

## 실전 프롬프트

### 오직 JSON만 받아내기(제일 유용)

```text
아래 주제를 요약해서 반드시 유효한 JSON '하나'만 출력해줘. 코드블록 표시(백틱)나 설명 문장은 절대 넣지 말고 { 로 시작해 } 로 끝나야 해. 형식: {"title": "제목", "summary": "한 문장 요약", "tags": ["태그1", "태그2"]}. 주제: [요약할 내용]
```

> 확인된 작성 예시 없음

> 💡 실습 재료를 만드는 가장 유용한 템플릿. 앞뒤 설명 없이 순수 JSON만 받아오면 loads로 바로 풀 수 있다.

`JSON` `출력형식` `LLM 응답`

### 내 JSON 파싱 에러 고치기

```text
파이썬 초보야. 아래 코드가 [에러 메시지] 에러를 내는데 json.loads 관점에서 원인이 뭔지 한 문장으로 알려주고 고친 코드를. 코드: [내 코드]
```

> 확인된 작성 예시 없음

`JSON` `디버깅` `json.loads`

### 중첩 구조에서 값 꺼내는 코드 만들기

```text
아래 JSON 문자열에서 [원하는 값 설명, 예: 첫 번째 문제의 정답]을 꺼내는 파이썬 코드를 data.get을 써서 키가 없어도 안 죽게. JSON: [JSON 문자열]
```

> 확인된 작성 예시 없음

`JSON` `중첩 JSON` `dict.get`

### 이 JSON 구조 그림으로 설명해줘

```text
아래 JSON의 구조를 초보자용으로 들여쓰기 트리 그림으로 그려주고, 각 값을 파이썬에서 꺼낼 때 써야 할 대괄호 경로(예: data["a"][0])를 옆에 붙여줘. JSON: [JSON]
```

> 확인된 작성 예시 없음

`JSON` `구조 이해` `학습`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! LLM에게 "책 추천을 JSON으로만 답해줘, 제목/저자/이유 세 필드로"라고 프롬프트를 넣어 응답을 받은 뒤, 그 문자열을 loads로 풀어서 제목과 이유만 출력하는 코드를 작성해보세요. 만약 저자 필드가 빠져 있어도 프로그램이 안 죽게 get으로 처리하세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 값을 꺼내기 전에 json.loads를 먼저 호출해 문자열을 딕셔너리로 풀었나 | 5 |
| 키가 없을 때 에러 대신 기본값이 나오게 get을 썼나 | 5 |
| LLM 응답 앞뒤에 설명 글이나 백틱이 섞여 있을 때 { }만 잘라냈나 | 5 |

## 관련 개념

- [Json](/concepts/json/)
- [Json Loads](/concepts/json-loads/)
- [Json Dumps](/concepts/json-dumps/)
- [Llm Response Parsing](/concepts/llm-response-parsing/)
- [Nested Json](/concepts/nested-json/)
- [Dict Get](/concepts/dict-get/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-engineer) · 방식: authenticated-crawl</sub>
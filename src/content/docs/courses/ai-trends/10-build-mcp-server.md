---
title: "🔌 나만의 MCP 서버 만들기 — AI 에이전트에 사내 도구·API 직접 연결"
description: "Model Context Protocol SDK(Python·TypeScript)로 커스텀 MCP 서버를 처음부터 제작하고, Claude/Cursor 등 AI 에이전트가 사내 DB·API·파일시스템을 직접 호출하게 연결한다. stdio·Streamable HTTP 두 트랜스포트를 비교하고, 1,000개 이상의 공개 MCP 서버 생태계에서 필요한 서버를 고르는 기준도 익힌다."
sidebar:
  order: 10
---
_Model Context Protocol SDK(Python·TypeScript)로 커스텀 MCP 서버를 처음부터 제작하고, Claude/Cursor 등 AI 에이전트가 사내 DB·API·파일시스템을 직접 호출하게 연결한다. stdio·Streamable HTTP 두 트랜스포트를 비교하고, 1,000개 이상의 공개 MCP 서버 생태계에서 필요한 서버를 고르는 기준도 익힌다._

:::note[학습 목표]
- Python이나 TypeScript로 나만의 MCP 서버를 만들어, Claude Desktop이나 Cursor가 우리 DB·API·파일을 직접 읽고 호출하게 연결할 수 있다. stdio와 HTTP 방식을 골라 쓸 수 있고, 1000개 넘는 공개 서버 중 필요한 걸 고를 수 있다.
:::

> AI 에이전트(Claude·Cursor 등)는 똑똑하지만, 너희 회사 DB나 사내 API는 모른다. MCP 서버를 만들면 'AI에게 우리 회사 도구를 쥐어주는' 일을 직접 할 수 있다.

## 이 레슨에서 만드는 것

Python이나 TypeScript로 나만의 MCP 서버를 만들어, Claude Desktop이나 Cursor가 우리 DB·API·파일을 직접 읽고 호출하게 연결할 수 있다. stdio와 HTTP 방식을 골라 쓸 수 있고, 1000개 넘는 공개 서버 중 필요한 걸 고를 수 있다.

## 핵심 개념

MCP(Model Context Protocol)는 'AI와 도구를 연결하는 공용 USB 단자' 같은 것이다. 옛날엔 휴대폰마다 충전 단자가 달라서 케이블이 제각각이었는데, USB-C가 나오면서 하나로 통일됐다. MCP도 마찬가지다. AI마다 도구 붙이는 방법이 다 다르면 힘든데, MCP라는 약속을 지키면 어떤 AI든 똑같이 도구를 꽂아 쓸 수 있다. MCP 서버는 '도구 상자'다. 안에 '날씨 검색', 'DB 조회' 같은 도구(tool)를 넣어두면, AI가 필요할 때 꺼내 쓴다. 우리는 그 도구 상자를 직접 만드는 것이다.

### 왜 작동하는가

AI 에이전트는 '도구 설명서(docstring)'를 읽고 언제 뭘 쓸지 스스로 판단합니다. 그래서 함수 하나에 @mcp.tool()만 붙이고 설명만 잘 써주면, 그 순간부터 AI가 우리 회사 DB·API를 마치 원래 자기 능력인 것처럼 자유자재로 호출합니다. 즉 우리는 '사용법'만 적어주고, 실제 판단과 호출은 AI가 대신합니다.

## 👀 따라하기 예시

사내 매출 DB를 Claude가 직접 조회하게 만들고 싶은 상황. 제가 먼저 처음부터 끝까지 만들어볼게요, 눈으로 따라오세요.

### 1. ① server.py에 FastMCP로 도구 등록

**실제 결과**

```text
from mcp.server.fastmcp import FastMCP
mcp = FastMCP('매출봇')

@mcp.tool()
def 매출조회(월: str) -> str:
    """특정 월의 매출을 조회한다"""
    row = db.query(f"SELECT sum(amount) FROM sales WHERE month='{월}'")
    return f'{월} 매출: {row}원'
```

> 함수 설명(docstring) 한 줄이 AI에게는 사용설명서 전체입니다 — 이게 없으면 AI는 이 도구가 있는지도 모릅니다.

### 2. ② claude_desktop_config.json에 등록

**실제 결과**

```text
{"mcpServers":{"매출봇":{"command":"python","args":["/Users/me/server.py"]}}}
```

> AI 프로그램은 설정 파일을 켤 때 딱 한 번만 읽으므로, 여기 적어둬야 다음 실행부터 이 도구를 인식합니다.

### 3. ③ Claude Desktop 완전 재시작

**실제 결과**

```text
트레이/독에서 앱을 완전 종료 → 재실행 → 🔨 도구 아이콘 1개 표시됨
```

> 새로고침이 아니라 완전 재시작이어야 새 서버 설정을 다시 읽습니다 — 여기서 다들 한 번씩 막힙니다.

### 4. ④ Claude에게 실제로 물어보기

**실제 결과**

```text
나: "6월 매출 얼마야?" → Claude: (매출조회 도구 자동 호출) → "6월 매출: 42,300,000원입니다"
```

> 내가 SQL을 직접 안 짜도, AI가 도구 설명만 보고 알아서 맞는 도구·맞는 인자를 골라 호출합니다. 이게 아하 포인트!

### 완성 결과

실행 가능한 나만의 MCP 서버 1개(server.py + config 등록 완료). 좋은 결과의 기준: (1) docstring만 봐도 도구 용도가 이해된다 (2) 비밀번호·API키가 코드에 하드코딩되어 있지 않다 (3) Claude에게 자연어로 물었을 때 올바른 도구가 자동 호출된다.

## 단계별 따라하기

### 개발 환경과 SDK 설치

Python이면 터미널에서 'pip install mcp' 입력. (mcp는 모델이 도구를 쓰게 해주는 공식 라이브러리). TypeScript면 'npm install @modelcontextprotocol/sdk' 입력. Python 3.10 이상, Node.js 18 이상이 필요하다. 먼저 'python --version'으로 버전부터 확인.

**복사·실행 예시**

```text
터미널 입력: pip install mcp 'uv' 패키지 매니저를 쓰면 더 빠르다: uv add mcp
```

### 가장 단순한 도구 1개 만들기

server.py 파일을 만들고 FastMCP를 불러온다. @mcp.tool() 데코레이터(함수 위에 붙이는 표시)를 함수에 붙이면, 그 함수가 자동으로 AI가 쓸 수 있는 도구가 된다. 함수 설명(docstring)을 꼭 써라 — AI는 이 설명을 읽고 언제 이 도구를 쓸지 판단한다.

**복사·실행 예시**

```text
from mcp.server.fastmcp import FastMCP
mcp = FastMCP('내서버')
@mcp.tool()
def add(a: int, b: int) -> int:
    '''두 숫자를 더한다'''
    return a + b
if __name__=='__main__':
    mcp.run()
```

### 트랜스포트(연결 방식) 정하기

트랜스포트는 'AI와 서버가 대화하는 통로'다. stdio는 같은 컴퓨터 안에서 직접 연결(빠르고 간단, 내 PC용). Streamable HTTP는 웹주소로 연결(원격 서버·여러 사람이 쓸 때). 개인 도구라면 stdio, 사내 공용 서버라면 HTTP를 고른다. mcp.run(transport='stdio') 또는 transport='streamable-http'로 지정.

**복사·실행 예시**

```text
내 노트북에서 Claude에 붙일 때 → stdio / 회사 서버에 올려 팀 전체가 쓸 때 → streamable-http
```

### 실제 사내 DB·API 연결 도구 추가

단순 더하기 말고 진짜 쓸모 있는 도구를 넣는다. 예: 사내 매출 DB를 조회하는 함수, 또는 사내 API를 requests로 호출하는 함수. 함수 안에서 SQL 실행이나 API 호출을 하고 결과를 return하면 끝. 비밀번호·API키는 코드에 직접 쓰지 말고 환경변수(os.environ)로 불러온다.

**복사·실행 예시**

```text
@mcp.tool()
def 매출조회(월: str) -> str:
    '''특정 월의 매출을 조회한다'''
    row = db.query(f"SELECT sum(amount) FROM sales WHERE month='{월}'")
    return f'{월} 매출: {row}원'
```

### Claude Desktop·Cursor에 등록하고 테스트

Claude Desktop이면 설정파일(claude_desktop_config.json)에 서버를 등록한다. mcpServers 항목에 이름과 실행명령(command: python, args: [server.py 경로])을 적는다. 저장 후 Claude를 완전히 껐다 켠다. 도구 아이콘(🔨)이 보이면 성공. 'add 도구로 3 더하기 5 해줘'라고 물어 테스트.

**복사·실행 예시**

```text
claude_desktop_config.json:
{"mcpServers":{"내서버":{"command":"python","args":["/경로/server.py"]}}}
```

### 공개 MCP 서버 생태계 활용

직접 안 만들어도 되는 도구는 이미 만들어진 걸 쓴다. github.com/modelcontextprotocol/servers나 mcp.so 같은 디렉토리에서 1000개 넘는 서버를 검색. 고르는 기준: ①공식·인기(별 많음) ②최근 업데이트됨 ③권한이 과하지 않음. GitHub·Slack·Postgres 등 유명 서버는 설정만 하면 바로 쓴다.

**복사·실행 예시**

```text
GitHub 이슈를 AI가 읽게 하고 싶다 → mcp.so에서 'github' 검색 → 공식 서버 config 복사해 등록
```

## 흔한 실수와 교정
- **실수:** docstring(함수 설명)을 안 적어서 AI가 도구를 언제 쓸지 모름
  - **교정:** 모든 도구 함수에 '무엇을 하는 도구인지' 한 줄 설명을 꼭 쓴다. 이게 AI의 사용 설명서다.
- **실수:** 설정 등록 후 Claude를 새로고침만 하고 도구가 안 보인다고 함
  - **교정:** Claude Desktop을 완전히 종료(트레이/독에서도 종료) 후 재실행해야 서버가 로드된다.
- **실수:** API키·DB 비밀번호를 코드에 그대로 적음
  - **교정:** os.environ['KEY']처럼 환경변수로 불러오고, 코드는 키 없이 공유 가능하게 유지한다.
- **실수:** 개인 PC용인데 streamable-http로 만들어 연결이 복잡해짐
  - **교정:** 내 컴퓨터에서 Claude에 붙일 거면 stdio가 가장 쉽다. HTTP는 원격·공용일 때만.
- **실수:** 공개 서버를 권한 확인 없이 설치해 과도한 접근 허용
  - **교정:** 별·업데이트일·요구 권한 3가지를 확인하고, 파일 전체 접근 같은 과한 권한은 피한다.

## 완료 체크리스트

- Python 3.10+ 또는 Node 18+ 설치 확인했다
- pip install mcp(또는 npm SDK) 설치 완료
- 도구 함수마다 docstring을 적었다
- stdio/HTTP 중 용도에 맞게 골랐다
- 비밀키는 환경변수로 처리했다
- Claude/Cursor 설정파일에 등록하고 완전 재시작했다
- 도구 아이콘 확인 후 실제 질문으로 테스트했다

## 도구

- MCP Python SDK(mcp) — Python으로 서버 제작
- @modelcontextprotocol/sdk — TypeScript로 서버 제작
- Claude Desktop — 만든 서버를 붙여 테스트
- Cursor — 코딩 에이전트에 MCP 연결
- mcp.so / github의 servers 저장소 — 공개 서버 검색
- uv — 빠른 Python 패키지·실행 관리

## 참고 답안

@mcp.tool()
def 재고조회(상품명: str) -> str:
    """특정 상품의 재고 수량을 조회한다"""
    재고 = {"노트북": 12, "마우스": 87}
    return f'{상품명} 재고: {재고.get(상품명, "정보없음")}개'

## 실전 프롬프트

### 기본 MCP 서버 뼈대

```text
Python FastMCP로 MCP 서버를 만들어줘. 도구는 [도구이름]이고, [입력값들]을 받아서 [하는 일]을 수행하고 [결과]를 반환해. 각 도구에 AI가 이해할 docstring을 붙이고, transport는 [stdio 또는 streamable-http]로 설정해줘.
```

> 확인된 작성 예시 없음

`eduverse` `build-mcp-server`

### 사내 API 연결 도구

```text
우리 사내 API([API 주소])를 호출하는 MCP 도구를 만들어줘. API키는 환경변수 [환경변수명]에서 읽고, 입력은 [파라미터], 응답에서 [필요한 필드]만 골라 보기 좋게 정리해 반환해. 에러가 나면 사용자가 이해할 메시지를 돌려줘.
```

> 확인된 작성 예시 없음

`eduverse` `build-mcp-server`

### Claude Desktop 등록 도움

```text
내 MCP 서버 파일 경로는 [경로]이고 Python으로 실행해. Claude Desktop의 claude_desktop_config.json에 등록할 정확한 JSON과, 설정파일 위치(Mac/Windows별)를 알려줘.
```

> 확인된 작성 예시 없음

`eduverse` `build-mcp-server`

### 공개 서버 고르기

```text
[하고 싶은 일]을 위해 쓸 만한 공개 MCP 서버를 추천해줘. 공식 여부·인기도·업데이트 최근성·요구 권한을 기준으로 비교하고, 등록 방법까지 단계로 정리해줘.
```

> 확인된 작성 예시 없음

`eduverse` `build-mcp-server`

## 직접 만들기 (미션)

:::tip
이번엔 매출 대신 "재고조회(상품명: str)" 도구를 직접 만들어보세요. @mcp.tool() 데코레이터를 쓰고, docstring을 한 줄 쓰고, 임시로는 DB 대신 더미 딕셔너리를 조회해서 return 하면 됩니다.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 함수 위에 @mcp.tool()을 빠뜨리지 않고 붙였나요? | 5 |
| docstring만 읽고도 이 도구가 뭘 하는지 남이 알 수 있나요? | 5 |
| 비밀값(API키·비밀번호)을 코드에 직접 적지 않고 환경변수로 뺐나요? | 5 |

## 관련 개념

- [Mcp](/concepts/mcp/)
- [Deployment](/concepts/deployment/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=trends&node=awti_build_mcp_server) · 방식: api-capture</sub>
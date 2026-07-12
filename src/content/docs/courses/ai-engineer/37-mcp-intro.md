---
title: "MCP로 외부 도구 표준 연결"
description: "MCP(Model Context Protocol)로 외부 도구·데이터 소스를 표준 방식으로 에이전트에 연결하는 개념과 서버 연동을 실습한다."
sidebar:
  order: 37
---
_MCP(Model Context Protocol)로 외부 도구·데이터 소스를 표준 방식으로 에이전트에 연결하는 개념과 서버 연동을 실습한다._

:::note[학습 목표]
- 이 레슨이 끝나면, 로컬 파일시스템 MCP 서버를 Claude Desktop에 직접 연결해서 AI가 실제 내 폴더의 파일을 읽고 쓰게 만들 수 있습니다.
:::

> AI에게 "내 파일 좀 읽어봐", "우리 DB에서 찾아봐"라고 해도 못 하는 이유는 도구가 없어서입니다. MCP는 그 '연결 단자'를 표준으로 만들어, 한 번 꽂으면 어떤 AI든 같은 방식으로 외부 도구를 쓰게 합니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 로컬 파일시스템 MCP 서버를 Claude Desktop에 직접 연결해서 AI가 실제 내 폴더의 파일을 읽고 쓰게 만들 수 있습니다.

## 핵심 개념

MCP(Model Context Protocol)는 2024년 Anthropic이 공개한 개방형 표준으로, AI 모델과 외부 도구·데이터 소스를 연결하는 'USB-C 단자' 같은 역할을 합니다. 예전에는 AI마다, 도구마다 따로 연동 코드를 짜야 했지만(N×M 문제), MCP는 서버(도구 제공자)와 클라이언트(AI 앱)가 공통 규약으로 대화하게 해서 한 번 만든 서버를 어디서나 재사용합니다. 서버는 Tools(실행 가능한 동작), Resources(읽을 수 있는 데이터), Prompts(재사용 템플릿) 세 가지를 노출하고, 클라이언트는 JSON-RPC 메시지로 이를 호출합니다. 즉 파일시스템·GitHub·구글드라이브·DB 같은 것을 각각 MCP 서버로 만들어 두면, Claude든 Cursor든 같은 서버를 그대로 꽂아 쓸 수 있습니다.

### 왜 작동하는가

AI는 원래 훈련 데이터 안의 지식만 알고, 내 컴퓨터 속 파일은 전혀 못 봅니다. MCP는 "이 서버를 이렇게 부르면 이런 도구를 쓸 수 있다"는 공통 규약이라, filesystem 서버 하나만 꽂아두면 Claude가 진짜 내 폴더를 열어 파일을 읽고 씁니다. 그래서 당신은 config 파일에 경로 한 줄만 적어주면, 파일 읽기·쓰기는 AI가 대신 해줍니다.

## 👀 따라하기 예시

Desktop 폴더 안에 강의노트.txt, 회의록.txt, 아이디어.txt 세 개가 흩어져 있어서, Claude가 이걸 직접 읽고 요약해주면 좋겠다고 가정해볼게요. 제가 먼저 처음부터 끝까지 해볼게요, 눈으로 따라오세요.

### 1. ① claude_desktop_config.json 열기

**실제 결과**

```text
설정 → 개발자 → "설정 편집" 클릭 → 빈 파일 또는 { "mcpServers": {} } 정도의 내용이 담긴 JSON 파일이 열림
```

> 이 파일이 Claude가 부팅할 때 읽는 유일한 "연결 명단"이라서, 여기 안 적으면 아예 존재하지 않는 서버예요.

### 2. ② filesystem 서버를 mcpServers에 등록

**실제 결과**

```text
{ "mcpServers": { "filesystem": { "command": "npx", "args": ["-y","@modelcontextprotocol/server-filesystem","/Users/내이름/Desktop"] } } }
```

> args의 마지막이 "허용 폴더"예요. 딱 이 폴더 안에서만 Claude가 움직이게 안전 울타리를 치는 거죠.

### 3. ③ Claude Desktop 완전 재시작

**실제 결과**

```text
Cmd+Q로 종료 후 재실행 → 채팅창 옆 망치(도구) 아이콘 클릭 → 목록에 list_directory, read_file, write_file 표시됨
```

> config는 앱이 켜지는 그 순간에만 읽혀서, 저장만 하고 재시작을 안 하면 방금 등록한 서버가 없는 셈이에요.

### 4. ④ 실제 파일 요약 시키기

**실제 결과**

```text
"Desktop의 .txt 파일을 모두 읽고 한 줄씩 요약해줘" 입력 → 허용(Allow) 클릭 → "강의노트.txt: MCP 3층 구조 정리 / 회의록.txt: 다음 주 배포 일정 확정 / 아이디어.txt: 알림 기능 추가 제안" 출력
```

> 바로 이 순간이 아하 포인트예요 — Claude가 "제 생각엔"이 아니라 실제 그 파일을 열어서 답한 거예요.

### 완성 결과

내 실제 폴더에 연결된 Claude Desktop 하나. 좋은 결과의 기준: (1) 도구 목록에 서버 이름이 뜬다 (2) 허용 안 한 폴더는 절대 못 건드린다 (3) 재시작 없이도 다음 대화부터 계속 그 폴더를 쓸 수 있다.

## 단계별 따라하기

### 1단계 — MCP가 뭔지 30초로 이해하기 (5분)

AI 혼자서는 훈련 데이터 안의 지식만 압니다. 실제 내 파일, 실시간 DB, 사내 API에 닿으려면 '손'이 필요한데 그게 MCP 서버입니다. 클라이언트(AI 앱) ↔ 서버(도구) 구조를 그림으로 떠올려 보세요. 🙋나

**복사·실행 예시**

```text
클라이언트=Claude Desktop, 서버=filesystem 서버 → Claude가 내 ~/Documents 폴더를 읽음
```

### 2단계 — Claude Desktop 설치하고 설정 파일 열기 (5분)

claude.ai/download에서 Claude Desktop을 설치합니다. 메뉴 → 설정(Settings) → 개발자(Developer) → '설정 편집(Edit Config)'을 누르면 claude_desktop_config.json 파일 위치가 열립니다. 이 파일에 MCP 서버를 등록합니다. 🙋나

**복사·실행 예시**

```text
macOS 경로: ~/Library/Application Support/Claude/claude_desktop_config.json
```

### 3단계 — Node.js 준비하고 filesystem 서버 등록하기 (10분)

터미널에서 node -v로 Node.js(18 이상)가 있는지 확인하고 없으면 nodejs.org에서 설치합니다. config 파일에 아래 templates의 '파일시스템 서버 config'를 붙여넣되, 경로를 내 실제 폴더로 바꿉니다. npx가 서버 패키지를 자동으로 내려받아 실행합니다. 🤝함께

**복사·실행 예시**

```text
허용 폴더를 /Users/내이름/Desktop 로 지정 → Claude는 그 폴더 안만 접근 가능(안전 경계)
```

### 4단계 — Claude 재시작하고 연결 확인하기 (5분)

Claude Desktop을 완전히 종료 후 다시 엽니다. 채팅 입력창 근처의 도구(슬라이더/망치) 아이콘을 눌러 filesystem 서버의 Tools 목록(read_file, write_file, list_directory 등)이 보이는지 확인합니다. 🙋나

**복사·실행 예시**

```text
도구 목록에 'list_directory', 'read_file'이 뜨면 연결 성공
```

### 5단계 — AI에게 실제 파일 작업 시키기 (10분)

채팅에 아래 templates의 '파일 요약 프롬프트'를 붙여넣습니다. Claude가 도구 사용 허가를 물으면 승인(Allow)을 누르세요. AI가 진짜로 내 폴더를 읽어 요약해 주는 것을 확인합니다. 🤖A

**복사·실행 예시**

```text
'Desktop 폴더의 .txt 파일을 모두 읽고 각각 한 줄로 요약해줘' → 실제 파일 3개 요약 출력
```

### 6단계 — 서버 하나 더 추가하고 조합해보기 (10분)

같은 config에 두 번째 서버(예: 메모리/브레이브 서치 등 공식 서버)를 추가 등록해, 여러 서버를 동시에 쓰는 경험을 합니다. 서버는 콤마로 이어 붙이면 됩니다. 재시작 후 두 서버가 다 뜨는지 확인. 🤝함께

**복사·실행 예시**

```text
filesystem + '@modelcontextprotocol/server-sequential-thinking' 두 개를 mcpServers에 나란히 등록
```

## 흔한 실수와 교정
- **실수:** config를 저장하고도 Claude Desktop을 재시작하지 않아 서버가 안 뜬다.
  - **교정:** 설정 변경 후에는 앱을 완전히 종료(Cmd+Q / 트레이 종료) 후 다시 열어야 config가 다시 로드됩니다.
- **실수:** 허용 폴더 경로를 상대경로나 물결(~)로 적어 서버가 폴더를 못 찾는다.
  - **교정:** args에는 반드시 절대경로를 씁니다. macOS는 /Users/이름/Desktop, Windows는 C:\\Users\\이름\\Desktop 형식으로 적으세요.
- **실수:** JSON 문법 실수(콤마 빠짐, 따옴표 오류)로 config 전체가 무시된다.
  - **교정:** 저장 전 jsonlint.com 같은 검사기에 붙여넣어 유효성을 확인하고, 마지막 항목 뒤에 콤마를 남기지 마세요.

## 완료 체크리스트

- Claude Desktop을 설치하고 claude_desktop_config.json 위치를 찾았다
- node -v로 Node.js 18 이상이 설치된 것을 확인했다
- filesystem 서버를 절대경로로 config에 등록했다
- 재시작 후 도구 목록에서 read_file 등 Tools가 보이는 것을 확인했다
- AI에게 실제 폴더의 파일을 읽고 요약하게 시켜 결과를 받았다

## 도구

- Claude Desktop (claude.ai/download) — MCP 서버를 꽂아 쓰는 클라이언트 앱
- Node.js / npx (nodejs.org) — MCP 서버 패키지 실행 런타임
- MCP 공식 문서·서버 목록 (modelcontextprotocol.io) — 개념 학습과 공식 서버 카탈로그
- JSONLint (jsonlint.com) — config JSON 문법 검증기

## 참고 답안

1) config의 args 경로를 "/Users/내이름/Documents"로 수정 → 2) 완전 종료 후 재실행 → 3) 도구 아이콘에서 list_directory 확인 → 4) "Documents 폴더에 뭐가 있는지 보여줘" → Claude가 실제 파일 목록을 나열

## 실전 프롬프트

### 파일시스템 서버 config (가장 먼저 쓰기)

```text
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "[내_허용_폴더_절대경로]"
      ]
    }
  }
}
```

> 확인된 작성 예시 없음

`eduverse` `mcp-intro`

### 파일 요약 프롬프트

```text
[허용한 폴더 이름] 폴더 안의 파일 목록을 먼저 보여주고, 그중 텍스트/마크다운 파일을 각각 열어 한 줄씩 핵심을 요약해줘. 접근이 필요하면 어떤 도구를 쓸지 먼저 말해줘.
```

> 확인된 작성 예시 없음

`eduverse` `mcp-intro`

### MCP 개념 점검 질문

```text
나는 MCP 초보야. MCP의 클라이언트/서버 구조와 Tools·Resources·Prompts 세 가지 개념을, 내가 방금 연결한 filesystem 서버를 예로 들어 초등학생도 이해하게 3문장으로 설명해줘.
```

> 확인된 작성 예시 없음

`eduverse` `mcp-intro`

### 내 도구용 MCP 서버 아이디어 브레인스토밍

```text
내 업무는 [업무 설명]이야. 내가 자주 여는 도구/데이터는 [예: 노션, 사내 API, CSV 파일]이야. 이걸 MCP 서버로 만들면 AI가 뭘 자동화해줄 수 있을지 활용 시나리오 5개를 우선순위와 함께 제안해줘.
```

> 확인된 작성 예시 없음

`eduverse` `mcp-intro`

## 직접 만들기 (미션)

:::tip
이번엔 당신 차례! Desktop 대신 Documents(또는 본인이 정한 다른 폴더)를 허용 경로로 바꿔서 filesystem 서버를 새로 등록하고, 재시작 후 그 폴더 안 파일 아무거나 하나를 Claude에게 읽어달라고 시켜보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 경로를 절대경로(물결~ 아님)로 정확히 적었나? | 5 |
| JSON에 콤마·따옴표 오류 없이 저장했나(jsonlint 확인)? | 5 |
| 재시작 후 도구 목록에 새 서버가 실제로 떴나? | 5 |

## 관련 개념

- [Mcp](/wiki/mcp/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=engineer&node=engineerx_mcp_intro) · 방식: api-capture</sub>
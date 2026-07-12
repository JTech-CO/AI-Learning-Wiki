---
title: "데이터 저장 — SQLite·Supabase"
description: "자동화가 모은 데이터를 DB에 저장·조회(상태 유지의 핵심)."
sidebar:
  order: 28
---
_자동화가 모은 데이터를 DB에 저장·조회(상태 유지의 핵심)._

:::note[학습 목표]
- SQLite로 내 컴퓨터에 데이터를 저장/조회하고, Supabase로 웹에서 접근 가능한 온라인 DB를 만들어 자동화 결과를 영구 보관할 수 있다.
:::

> 자동화가 열심히 데이터를 모아도 저장 안 하면 창 닫는 순간 다 사라진다. DB는 자동화의 '기억 장치'다.

## 이 레슨에서 만드는 것

SQLite로 내 컴퓨터에 데이터를 저장/조회하고, Supabase로 웹에서 접근 가능한 온라인 DB를 만들어 자동화 결과를 영구 보관할 수 있다.

## 핵심 개념

DB(데이터베이스)는 '엑셀 표를 아주 튼튼하게 만든 창고'다. 표에 줄(행)을 계속 쌓고, 원하는 조건으로 순식간에 찾아낼 수 있다. SQLite는 파일 하나짜리 개인 창고(내 컴퓨터 안), Supabase는 인터넷에 있는 공용 창고(어디서든 접근)다. '상태 유지'란 어제 저장한 걸 오늘도 기억한다는 뜻. 예를 들어 매일 뉴스를 모으는 자동화가 있으면, DB에 쌓아야 '이미 저장한 건 건너뛰기' 같은 똑똑한 판단이 가능해진다.

### 왜 작동하는가

DB는 엑셀 표를 아주 튼튼하게 만든 창고예요. 자동화가 모은 값을 행(줄)으로 계속 쌓아두면, 나중에 SQL 한 줄로 원하는 조건만 순식간에 찾아낼 수 있어요. 그래서 자동화가 '어제 뭘 저장했는지'를 기억하고, 중복 없이 새 데이터만 골라 처리할 수 있는 거예요.

## 👀 따라하기 예시

매일 아침 뉴스 3개를 자동으로 모으는 자동화를 만들었다고 해볼게요. 저장을 안 하면 브라우저 창을 닫는 순간 오늘 모은 게 다 사라져요. 제가 먼저 처음부터 끝까지 Supabase에 저장하는 과정을 보여드릴게요, 눈으로 따라오세요.

### 1. ① sqliteonline.com에서 표 모양부터 연습

**실제 결과**

```text
CREATE TABLE news (id INTEGER PRIMARY KEY, title TEXT, link TEXT, date TEXT); → 실행 후 왼쪽에 news 테이블 생성됨
```

> 실전 전에 무료 연습장에서 표 구조를 눈으로 확인하면 실수를 줄여요.

### 2. ② Supabase에서 진짜 온라인 창고 만들기

**실제 결과**

```text
Table Editor → New table → 이름 news, 열 title/link/date 추가 → Save 클릭하면 즉시 빈 표가 생성됨
```

> 코드 한 줄 없이 버튼만으로 인터넷 어디서든 접근 가능한 DB가 만들어져요.

### 3. ③ n8n 자동화에 Supabase 노드 연결

**실제 결과**

```text
n8n: HTTP 노드로 뉴스 3개 수집 → Supabase 노드 추가 → Insert Row 선택 → title/link/date를 각 열에 매핑
```

> 이 연결 하나로 자동화가 실행될 때마다 결과가 자동으로 DB에 쌓여요.

### 4. ④ 중복 방지 걸어두기

**실제 결과**

```text
link 열에 UNIQUE 제약 추가 → 같은 링크가 다시 들어오면 자동으로 거부됨
```

> 이걸 안 하면 자동화를 돌릴 때마다 같은 뉴스가 계속 중복 저장돼요.

### 완성 결과

자동화가 실행될 때마다 새 뉴스만 골라 쌓이는 Supabase 온라인 표. 좋은 결과의 기준: 1) 중복 없이 쌓인다 2) 날짜/제목으로 바로 검색된다 3) 브라우저를 꺼도 데이터가 남아있다.

## 단계별 따라하기

### 먼저 개념부터: 표 하나 그려보기

DB의 기본 단위는 '테이블(표)'. 세로 항목(열)을 정하고, 데이터를 가로줄(행)로 쌓는다. 종이에 먼저 그려두면 헷갈리지 않는다.

**복사·실행 예시**

```text
뉴스 테이블: 열=[id, 제목, 링크, 저장날짜]. 행1=[1, 'AI뉴스', 'http...', '2024-06-01']
```

### SQLite 온라인 연습장 열기

검색창에 'sqliteonline.com' 입력해 접속. 설치 없이 브라우저에서 바로 SQL(DB에게 시키는 명령어)을 연습할 수 있다. 왼쪽 상단 'SQLite' 선택 확인.

**복사·실행 예시**

```text
sqliteonline.com 접속 → 가운데 명령어 입력칸 확인
```

### 테이블 만들기(CREATE)

명령어 입력칸에 CREATE TABLE 문을 넣고 실행(Run) 버튼 클릭. '이런 모양의 표를 만들어라'는 뜻.

**복사·실행 예시**

```text
CREATE TABLE news (id INTEGER PRIMARY KEY, title TEXT, link TEXT, date TEXT);
```

### 데이터 저장하기(INSERT)

INSERT 문으로 한 줄씩 데이터를 넣고 Run. 자동화가 모은 결과를 이 형태로 저장한다고 생각하면 된다.

**복사·실행 예시**

```text
INSERT INTO news (title, link, date) VALUES ('AI뉴스', 'http://a.com', '2024-06-01');
```

### 데이터 조회하기(SELECT)

SELECT 문으로 저장된 걸 꺼내본다. WHERE로 조건 검색, ORDER BY로 정렬. 표 형태로 결과가 아래 뜬다.

**복사·실행 예시**

```text
SELECT * FROM news WHERE date='2024-06-01' ORDER BY id DESC;
```

### 실전은 Supabase로 이사

supabase.com 가입(무료) → 'New Project' 클릭 → 왼쪽 메뉴 'Table Editor'에서 버튼 클릭만으로 표 생성. 코드 없이 열 추가 가능. n8n·Make 등 자동화 도구가 Supabase에 바로 연결된다.

**복사·실행 예시**

```text
Table Editor → 'New table' → 이름 news, 열 title/link/date 추가
```

### 자동화와 연결하기

n8n/Make에서 'Supabase' 노드 추가 → API 키(Supabase 설정의 Project API keys) 입력 → 'Insert Row' 동작 선택 → 자동화가 모은 값을 각 열에 매핑. 이제 실행할 때마다 자동 저장된다.

**복사·실행 예시**

```text
n8n: HTTP로 뉴스 수집 → Supabase 'Insert' 노드로 title/link 저장
```

## 흔한 실수와 교정
- **실수:** 저장은 되는데 매번 똑같은 데이터가 중복으로 쌓인다
  - **교정:** UNIQUE 제약이나 '이미 있으면 저장 안 함' 로직을 추가. 예: link 열에 UNIQUE 설정, 자동화에서 저장 전에 SELECT로 존재 여부 확인.
- **실수:** SQLite로 만들었는데 웹 자동화에서 연결이 안 된다
  - **교정:** SQLite는 내 PC 파일이라 웹에서 못 읽는다. 실전 자동화 연결은 Supabase 같은 온라인 DB로 옮겨야 한다.
- **실수:** 날짜/숫자를 전부 TEXT로 저장해 정렬·계산이 이상하다
  - **교정:** 열 타입을 목적에 맞게 지정. 날짜는 'YYYY-MM-DD' 형식 TEXT 또는 DATE, 숫자는 INTEGER로.
- **실수:** Supabase API 키를 코드에 그대로 노출해 유출
  - **교정:** 공개 저장소나 화면 공유 시 키를 가리기. 자동화 도구의 'Credentials(자격증명)' 기능에 넣어 안전하게 관리.

## 완료 체크리스트

- 종이에 테이블(열 이름) 먼저 그려봤다
- sqliteonline.com에서 CREATE/INSERT/SELECT를 직접 실행해봤다
- 조건 검색(WHERE)과 정렬(ORDER BY)을 써봤다
- Supabase 프로젝트를 만들고 Table Editor로 표를 생성했다
- 중복 저장 방지 방법(UNIQUE)을 적용했다
- 자동화 도구에서 Supabase에 실제로 1건 저장 성공했다

## 도구

- sqliteonline.com — 설치 없이 SQL 연습
- DB Browser for SQLite — SQLite 파일을 눈으로 편집
- Supabase — 무료 온라인 DB(웹 접근)
- n8n/Make — 자동화 결과를 DB에 자동 저장
- ChatGPT/Claude — SQL 명령어·표 설계 도우미

## 참고 답안

Table Editor → New table → 이름 books → 열 추가: title(text), author(text), finished_date(text) → Save → Insert row 클릭 → 값 입력 (예: title='아몬드', author='손원평', finished_date='2026-07-01') → Save

## 실전 프롬프트

### 표 설계 도우미

```text
나는 [수집할 데이터: 예-매일 뉴스 제목과 링크]를 저장하려고 해. SQLite/Supabase 테이블을 만들 건데, 어떤 열(컬럼)들이 필요할지 이름과 데이터 타입(TEXT/INTEGER/DATE)을 표로 제안해줘. 중복 저장을 막을 방법도 알려줘.
```

> 확인된 작성 예시 없음

`eduverse` `database`

### SQL 명령어 생성

```text
다음 조건으로 SQLite 명령어를 만들어줘. 테이블명: [news]. 열: [id, 제목, 링크, 날짜]. 작업: [1) 테이블 생성 2) 예시 데이터 2줄 삽입 3) 오늘 날짜만 조회]. 각 명령어에 한글 주석도 붙여줘.
```

> 확인된 작성 예시 없음

`eduverse` `database`

### 자동화 연결 안내

```text
[n8n 또는 Make]에서 [Supabase]에 데이터를 저장하려고 해. 초보자용으로 API 키 얻는 위치, 노드 추가 순서, 값 매핑 방법을 클릭 순서대로 알려줘. 막히기 쉬운 지점도 미리 경고해줘.
```

> 확인된 작성 예시 없음

`eduverse` `database`

## 직접 만들기 (미션)

:::tip
뉴스 대신 '읽은 책' 목록을 저장하는 표를 직접 만들어보세요. Supabase Table Editor에서 books 테이블을 만들고 열(title, author, finished_date)을 추가한 다음, 아무 책 1권을 New table의 Insert row 기능으로 직접 입력해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 열 이름과 타입이 목적에 맞게 정해졌나요? (날짜를 숫자 타입으로 잘못 넣지는 않았나요?) | 5 |
| 표에 최소 1개 행이 실제로 저장되어 화면에 보이나요? | 5 |
| 나중에 이 책이 중복 입력되지 않게 막으려면 어떤 열에 UNIQUE를 걸어야 할지 말할 수 있나요? | 5 |

## 관련 개념

- [Database](/concepts/database/)
- [Automation](/concepts/automation/)
- [Data](/concepts/data/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_database) · 방식: api-capture</sub>
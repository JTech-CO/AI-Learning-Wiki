---
title: "SELECT와 조건 필터"
description: "특정 컬럼만 골라 SELECT하고 WHERE로 조건을 건 뒤, ORDER BY·LIMIT으로 정렬하고 상위 N개를 뽑는 조회의 기본을 실습한다. 엑셀 10만 줄에서 '서울 사는 VIP 상위 20명'을 찾던 삽질이 SQL이면 세 줄로 끝난다."
sidebar:
  order: 16
---
_특정 컬럼만 골라 SELECT하고 WHERE로 조건을 건 뒤, ORDER BY·LIMIT으로 정렬하고 상위 N개를 뽑는 조회의 기본을 실습한다. 엑셀 10만 줄에서 '서울 사는 VIP 상위 20명'을 찾던 삽질이 SQL이면 세 줄로 끝난다._

:::note[학습 목표]
- 필요한 컬럼만 골라 SELECT하는 조회 쿼리를 스스로 작성한다
- WHERE와 AND로 여러 조건을 걸어 원하는 행만 걸러낸다
- ORDER BY로 정렬하고 LIMIT으로 상위 N개를 뽑는다
:::

## 핵심 개념

**SELECT**는 데이터베이스에게 "이 표에서 이런 걸 보여줘"라고 말하는 문장이에요. 필요한 컬럼만 콕 집어 `SELECT`하고, `WHERE`로 '조건에 맞는 행만' 거르고, `ORDER BY`로 '이 기준으로 정렬', `LIMIT`으로 '위에서 몇 개만'. 엑셀의 **필터·정렬·상단 N행 보기**를 한 문장으로 압축한 거예요. 원본 데이터는 절대 바뀌지 않고 '보기(조회)'만 하는 안전한 작업이라 마음껏 실험해도 됩니다.

### 흐름

필요한 컬럼 고르기(`SELECT`) → 조건으로 행 거르기(`WHERE`) → 기준대로 정렬(`ORDER BY`) → 위에서 몇 개만 자르기(`LIMIT`). 이 순서가 곧 '무엇을, 어떤 것 중에서, 어떤 순서로, 몇 개'라는 질문의 순서예요.

### 왜 이게 될까?

SQL은 컴퓨터가 수억 번 반복해 온 '표에서 조건에 맞는 줄만 골라내기'를 사람 말에 가깝게 정리해둔 규칙일 뿐이에요. '무엇을 보고 싶은지'만 정확히 말하면 수만 줄을 뒤지는 힘든 일은 SQL이 눈 깜짝할 사이에 해줍니다. 엑셀 필터 버튼을 누르는 것과 똑같은데 훨씬 빠르고 정확해요.

## 👀 따라하기 예시 — 고객 표 `customers`에서 '서울에 사는 VIP 고객 중 결제액 상위 2명'

**① 전체 컬럼 말고 필요한 것만 SELECT** — `SELECT name, city, grade, spent FROM customers;` → 4개 컬럼만 깔끔하게(id는 안 보여줘도 됨).
> 💡 필요 없는 컬럼까지 다 보면 눈만 아파요. 볼 것만 딱 골라 물어보는 게 첫 단추.

**② WHERE로 '서울 + VIP'만 거르기** — `WHERE city = '서울' AND grade = 'VIP'` → 김서준(480000), 박도윤(310000) 두 명만.
> 💡 `AND`는 두 조건을 동시에 만족하는 행만 남겨요. 조건은 많아질수록 정확해져요.

**③ ORDER BY로 결제액 높은 순 정렬** — `ORDER BY spent DESC` → 김서준(480000)이 맨 위, 박도윤(310000)이 아래로.
> 💡 `DESC`(내림차순)를 안 붙이면 순서가 뒤죽박죽. '높은 순'이라는 말은 반드시 `ORDER BY`로 명시하세요.

**④ LIMIT으로 상위 2명만 자르기** — `ORDER BY spent DESC LIMIT 2` → 정확히 김서준, 박도윤 2명만.
> 💡 `LIMIT`은 정렬된 결과의 맨 위에서 자르는 거예요! 정렬 없이 `LIMIT`만 쓰면 엉뚱한 2명이 나올 수 있어요 — 오늘의 아하 포인트.

완성된 쿼리:

```sql
SELECT name, city, spent FROM customers
WHERE city = '서울' AND grade = 'VIP'
ORDER BY spent DESC LIMIT 2;
```

좋은 결과의 기준: (1) 필요한 컬럼만 보이는가 (2) 조건에 안 맞는 행이 하나도 안 섞였는가 (3) 정렬 기준이 명확해서 '상위 N개'가 실제로 맞는가.

## 단계별 따라하기

1. **실습용 무료 SQL 놀이터 열기** — `sqliteonline.com`에 접속하고 왼쪽 상단에서 'SQLite'가 선택돼 있는지 확인. 설치·회원가입 없이 바로 실행돼요. 가운데 에디터에 SQL을 쓰고 오른쪽 위 'Run' 버튼(▶)을 누르면 아래에 결과 표가 나와요.
2. **연습용 표 만들고 데이터 넣기** — 아래 `CREATE TABLE` + `INSERT` 문을 에디터에 붙여넣고 Run. `customers` 고객 표가 생겨요.

```sql
CREATE TABLE customers (id INTEGER, name TEXT, city TEXT, grade TEXT, spent INTEGER);
INSERT INTO customers VALUES
  (1,'김서준','서울','VIP',480000),
  (2,'이하은','부산','일반',52000),
  (3,'박도윤','서울','VIP',310000),
  (4,'최지우','서울','일반',77000);
```

3. **필요한 컬럼만 SELECT 하기** — 전체(`*`) 말고 `name`과 `spent` 컬럼만 골라서 조회. `SELECT` 뒤에 원하는 컬럼 이름을 콤마로 나열해요.

```sql
SELECT name, spent FROM customers;
```

4. **WHERE로 원하는 행만 거르기** — `WHERE` 뒤에 조건을 붙여 '서울에 사는 VIP'만. 문자열은 작은따옴표로 감싸고, 조건 두 개는 `AND`로 이어요.

```sql
SELECT name, city, spent FROM customers WHERE city = '서울' AND grade = 'VIP';
```

5. **ORDER BY와 LIMIT으로 정렬·상위 N개** — 결제액(`spent`) 높은 순으로 정렬하려면 `ORDER BY spent DESC`, 위에서 2명만 보려면 `LIMIT 2`를 맨 뒤에. `DESC`=내림차순, `ASC`(기본)=오름차순.

```sql
SELECT name, spent FROM customers WHERE city = '서울' ORDER BY spent DESC LIMIT 2;
```

6. **AI로 내 실제 질문을 쿼리로 번역하기** — '자연어→SQL 변환' 프롬프트에 내가 진짜 궁금한 질문(예: '가장 안 쓰는 고객은?')을 넣어 SQL을 받고, 놀이터에서 Run 해 결과가 말이 되는지 눈으로 확인해요.

```sql
-- 질문: '가장 적게 쓴 고객 1명'
SELECT name, spent FROM customers ORDER BY spent ASC LIMIT 1;
```

## 흔한 실수 → 교정

- ✗ 문자열 조건에 따옴표를 안 붙여 `WHERE city = 서울`처럼 써서 오류 → **문자(텍스트) 값은 반드시 작은따옴표로:** `WHERE city = '서울'`. 숫자는 따옴표 없이 `spent > 100000`.
- ✗ 같음 비교에 `=` 대신 `==`를 헷갈려 쓰거나, 조건을 이을 때 `AND`/`OR`를 빠뜨림 → **SQL의 같음 비교는 등호 하나(`=`).** 조건 두 개를 동시에 만족하려면 `AND`, 둘 중 하나면 `OR`로.
- ✗ `ORDER BY` 없이 `LIMIT`만 써놓고 '상위 3명'이라 믿음 → **`LIMIT`은 정렬된 결과의 앞에서 자르는 것일 뿐**이라 `ORDER BY`가 없으면 순서가 보장되지 않아요. 반드시 `ORDER BY spent DESC` 같은 정렬을 먼저.

## 도구

- 🛠 **SQLite Online** (sqliteonline.com) — 설치 없이 브라우저에서 SQL 실습.
- 🛠 **DB Fiddle** (db-fiddle.com) — 여러 DB 엔진으로 쿼리 테스트·공유.
- 🛠 **ChatGPT · Claude** (chat.openai.com, claude.ai) — 자연어를 SQL로 변환·검토.
- 🛠 **SQLBolt** (sqlbolt.com) — SELECT·WHERE 인터랙티브 무료 연습.

## 실전 프롬프트

### 연습 테이블 만들기 (제일 먼저 실행)

```text
SQLite에서 실습할 예제 데이터를 만들어줘. 컬럼은 id(정수), name(이름), city(도시), grade(등급 VIP/일반), spent(누적결제액 정수)로 하고, 한국어 이름과 서울·부산·대구가 섞인 고객 8명을 CREATE TABLE 한 개와 INSERT 문으로 바로 복붙 실행되게. 설명 없이 SQL만.
```

> 확인된 작성 예시 없음

`SQL` `예제데이터` `CREATE TABLE`

### 자연어 → SQL 변환

```text
아래 테이블 구조를 기준으로 SQLite 쿼리를 만들어줘. 테이블 customers(id, name, city, grade, spent). 내가 알고 싶은 것: [서울에 사는 VIP 중 결제액 상위 3명]. SELECT/WHERE/ORDER BY/LIMIT을 써서 한 문장으로. SQL만 주고 각 줄이 무슨 뜻인지 한 줄 주석도.
```

> 확인된 작성 예시 없음

`SQL` `자연어변환` `쿼리작성`

### 내 쿼리 점검받기

```text
내가 쓴 SQLite 쿼리를 검토해줘. 문법 오류, 문자열 따옴표, WHERE 조건, 정렬 방향(ASC/DESC)이 내 의도와 맞는지. 내 의도: [의도] 내 쿼리: [쿼리]. 틀린 부분만 고쳐서 최종 쿼리를.
```

> 확인된 작성 예시 없음

`SQL` `점검` `디버깅`

### WHERE 조건 확장 연습

```text
SQLite customers(id, name, city, grade, spent) 테이블로 WHERE 연습 문제 5개를 난이도 순으로. 각 문제는 한국어 질문 + 정답 쿼리 + 왜 그런지 한 줄 설명. AND/OR, 부등호(>, <), 그리고 IN 을 골고루.
```

> 확인된 작성 예시 없음

`SQL` `WHERE` `연습문제`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! 같은 customers 표에서 '일반 등급 고객 중 결제액이 가장 적은 1명'을 찾는 쿼리를 직접 작성해보세요. (힌트: WHERE 조건, ORDER BY 방향, LIMIT 숫자를 바꿔야 해요.)
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| WHERE 조건의 문자열 값('일반')에 작은따옴표를 제대로 감쌌나 | 5 |
| '가장 적은'에 맞춰 ORDER BY를 DESC가 아니라 ASC로 바꿨나 | 5 |
| LIMIT 앞에 ORDER BY가 먼저 있어서 '진짜 1등'이 나오는 게 보장되나 | 5 |

## 관련 개념

- [Select](/concepts/select/)
- [Where](/concepts/where/)
- [Order By](/concepts/order-by/)
- [Limit](/concepts/limit/)
- [Query](/concepts/query/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
---
title: "JOIN으로 표 연결하기"
description: "고객 표에는 이름만, 주문 표에는 고객번호만 있을 때 두 표를 공통 키로 이어 붙이는 INNER·LEFT JOIN을 익혀, '누가 뭘 샀는지'를 한 번의 쿼리로 조회하고 주문이 없는 고객까지 골라낸다."
sidebar:
  order: 17
---
_고객 표에는 이름만, 주문 표에는 고객번호만 있을 때 두 표를 공통 키로 이어 붙이는 INNER·LEFT JOIN을 익혀, '누가 뭘 샀는지'를 한 번의 쿼리로 조회하고 주문이 없는 고객까지 골라낸다._

:::note[학습 목표]
- 두 테이블(고객+주문)을 공통 키로 INNER JOIN·LEFT JOIN 해 '누가 무엇을 언제 샀는지'를 한 번의 쿼리로 조회한다
- LEFT JOIN + IS NULL로 주문이 없는(짝이 없는) 고객까지 골라낸다
- INNER JOIN과 LEFT JOIN의 차이를 이해하고 상황에 맞게 고른다
:::

## 핵심 개념

관계형 데이터베이스는 중복을 줄이려고 정보를 여러 테이블에 나눠 담아요. **customers 테이블은 고객 정보만, orders 테이블은 주문 정보만** 갖고, 두 표는 `customer_id` 같은 **공통 키**로 연결됩니다. **JOIN**은 이 공통 키가 일치하는 행끼리 옆으로 붙여 하나의 결과표로 만드는 명령이에요.

- **INNER JOIN**은 양쪽에 다 있는(매칭되는) 행만 남깁니다.
- **LEFT JOIN**은 왼쪽 표의 모든 행을 남기되, 오른쪽에 짝이 없으면 NULL로 채웁니다.

이 차이 하나로 '주문한 고객만' 볼지 '주문 안 한 고객까지' 볼지가 갈려요.

### 왜 이게 될까?

두 표가 따로 노는 이유는 중복을 줄이기 위해서예요. `customers.id` 와 `orders.customer_id` 처럼 **공통 키**만 있으면, 데이터베이스는 그 값이 같은 행끼리 순식간에 옆으로 이어 붙여줍니다. '어떤 컬럼이 서로를 가리키는지'만 찾아주면, 표 두 개를 손으로 대조할 필요 없이 **JOIN 한 줄**이 전부 연결해줘요.

## 👀 따라하기 예시 — 편집숍: '아직 한 번도 안 산 사람이 누군지, 산 사람은 얼마나 썼는지 한 화면에'

**① 두 표를 각각 `SELECT *` 로 열어 공통 키부터 찾기** — customers.id → 1,2,3 / orders.customer_id → 1,1,2 → 같은 값이 겹치는 걸 확인.
> 💡 JOIN은 마법이 아니라 '같은 값을 가진 컬럼끼리 연결'하는 것이라, 이 키를 못 찾으면 시작을 못 해요.

**② LEFT JOIN으로 고객 표를 기준 삼아 주문 표 붙이기**

```sql
SELECT c.name, o.item, o.amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
```

→ 박도윤 행에 item/amount가 NULL로 채워져 살아남음.
> 💡 INNER JOIN을 썼다면 주문 없는 고객은 조용히 사라졌을 거예요. '왼쪽 표는 무조건 다 보고 싶다'는 요구엔 LEFT가 정답.

**③ `WHERE o.customer_id IS NULL` 로 '안 산 고객'만 걸러내기** → 박도윤 한 명만 출력.
> 💡 LEFT JOIN이 만들어준 NULL 자체가 '짝이 없다'는 표시라서, 그걸 필터 조건으로 바로 재활용해요.

**④ GROUP BY로 고객별 총구매액까지 집계** (문법이 헷갈리면 AI에게)

```sql
SELECT c.name, COUNT(o.id) AS 주문건수, SUM(o.amount) AS 총구매액
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;
```

→ 김민준 2건 153만원 / 이서연 1건 8만원 / 박도윤 0건 NULL.
> 💡 JOIN으로 표를 붙이고 나면, 그 다음은 그냥 '한 표'처럼 GROUP BY·SUM을 얹으면 돼요.

좋은 결과의 기준: (1) 주문 없는 고객도 0건으로 빠짐없이 보인다 (2) 합계 숫자가 원본 orders 표와 손으로 대조해도 맞는다 (3) ambiguous column 에러 없이 실행됐다.

## 단계별 따라하기

1. **연습 DB 준비하고 두 테이블 확인** — sqliteonline.com 같은 무설치 SQL 놀이터에 접속해 새 SQLite DB를 만들고, 예제 CREATE/INSERT를 붙여넣어 `customers`·`orders` 두 테이블을 만든다.

```sql
CREATE TABLE customers(id INTEGER, name TEXT);
INSERT INTO customers VALUES (1,'김민준'),(2,'이서연'),(3,'박도윤');
CREATE TABLE orders(id INTEGER, customer_id INTEGER, item TEXT, amount INTEGER);
INSERT INTO orders VALUES (101,1,'노트북',1500000),(102,1,'마우스',30000),(103,2,'키보드',80000);
```

2. **공통 키 찾기** — 두 테이블을 각각 `SELECT *` 로 조회해 눈으로 비교하고, 어떤 컬럼이 서로를 가리키는지 찾는다. `customers.id` 와 `orders.customer_id` 가 같은 값. 이 '연결 고리'가 JOIN의 `ON` 조건이다.
3. **INNER JOIN으로 '주문한 고객' 조회** — `ON` 조건으로 두 표를 붙여 이름과 산 물건을 한 줄로. 테이블에 별칭(c, o)을 붙이면 컬럼 출처가 명확해진다. 실행하면 주문이 있는 고객(김민준·이서연)만 나오고 박도윤은 빠진다.

```sql
SELECT c.name, o.item, o.amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
```

4. **LEFT JOIN으로 '주문 안 한 고객까지' 조회** — `INNER` 를 `LEFT` 로만 바꿔 다시 실행. 왼쪽 표(customers)의 모든 행이 남고, 짝이 없는 박도윤은 item/amount 자리가 NULL이 된다.

```sql
SELECT c.name, o.item, o.amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
```

5. **LEFT JOIN + IS NULL로 '한 번도 안 산 고객' 뽑기** — LEFT JOIN 결과에서 `WHERE o.customer_id IS NULL` 을 걸면 짝이 없어 NULL이 된 행만 남는다. 마케팅에서 '휴면 고객 리스트'를 뽑는 실전 패턴이다.

```sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.customer_id IS NULL;
```

6. **집계까지 붙여 '고객별 총 구매액' 만들기** — JOIN 결과를 `GROUP BY` 로 묶어 고객별 합계를 낸다. 문법이 헷갈리면 AI에게 '이 두 테이블 스키마로 고객별 총 구매액과 주문 건수를 뽑는 쿼리'를 요청하고, 받은 쿼리를 붙여넣어 실행·검증한다.

```sql
SELECT c.name, COUNT(o.id) AS 주문건수, SUM(o.amount) AS 총구매액
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name;
```

## 흔한 실수 → 교정

- ✗ `ON` 조건(공통 키)을 빼먹고 그냥 `FROM a, b` 로 두 테이블을 나열해서 모든 행이 서로 곱해진 엄청 많은 결과(카테시안 곱)가 나옴 → **반드시 `JOIN ... ON 왼쪽키 = 오른쪽키` 를 써서 연결 고리를 명시.** 결과 행 수가 비정상적으로 많으면 `ON`을 빠뜨렸는지 먼저 의심한다.
- ✗ 주문 안 한 고객까지 보고 싶은데 INNER JOIN을 써서 짝 없는 고객이 조용히 사라진 걸 모름 → **'왼쪽 표는 전부 남기고 싶다'면 LEFT JOIN.** 짝 없는 행은 오른쪽 컬럼이 NULL로 채워져 그대로 남는다.
- ✗ 양쪽 테이블에 같은 이름 컬럼(예: id)이 있는데 그냥 `SELECT id` 라고 써서 'ambiguous column' 에러 → **컬럼 앞에 테이블 별칭을 붙인다(`c.id`, `o.id`).** `FROM customers c` 처럼 별칭을 정해두면 어느 표의 컬럼인지 항상 명확하다.

## 도구

- 🛠 **SQLite Online** (sqliteonline.com) — 무설치 브라우저 SQL 연습장, 붙여넣고 바로 실행.
- 🛠 **DB Fiddle** (db-fiddle.com) — 스키마+쿼리를 링크로 공유하며 JOIN 실험.
- 🛠 **ChatGPT·Claude** (chat.openai.com / claude.ai) — JOIN 쿼리 생성·차이 설명·디버깅.
- 🛠 **SQLBolt** (sqlbolt.com) — JOIN 대화형 무료 튜토리얼로 반복 연습.

## 실전 프롬프트

### 내 두 테이블 JOIN 쿼리 짜주기(가장 유용)

```text
나는 SQL 초보야. 아래 두 테이블을 [공통 키: __ = __]로 연결해서 [보고 싶은 결과: 고객 이름별 주문 목록]를 뽑는 SQLite 쿼리를 써줘. INNER JOIN과 LEFT JOIN 두 버전을 각각 주고, 결과가 어떻게 달라지는지 한 줄로 설명해줘.
테이블1 스키마: [CREATE TABLE]
테이블2 스키마: [CREATE TABLE]
```

`JOIN` `쿼리생성` `SQL`

### INNER vs LEFT 차이를 내 데이터로 설명

```text
아래 두 테이블 예시 데이터를 보고, 같은 JOIN을 INNER JOIN으로 했을 때와 LEFT JOIN으로 했을 때 결과 행이 어떻게 달라지는지 표로 비교해줘. 왜 그렇게 되는지 초보도 이해하게 설명해줘.
[테이블1 데이터]
[테이블2 데이터]
```

`JOIN` `INNER-LEFT` `비교`

### 내 JOIN 쿼리 디버깅

```text
이 JOIN 쿼리를 실행했더니 [문제: 행이 너무 많이 나옴 / 원하는 고객이 안 나옴 / NULL이 이상함]이 발생해. 원인이 뭔지, 어떻게 고치면 되는지 알려줘.
쿼리: [내 SQL]
각 테이블 스키마: [스키마]
```

`JOIN` `디버깅`

### 세 개 이상 테이블 연결로 확장

```text
지금 customers와 orders를 JOIN하고 있는데, 여기에 [세 번째 테이블: products]를 [공통 키: __]로 더 붙이고 싶어. 세 테이블을 이어 붙이는 SQLite 쿼리를 써주고, JOIN을 여러 번 이어 쓰는 원리를 설명해줘.
```

`JOIN` `다중테이블` `확장`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! '수강생(students)'과 '수강신청(enrollments)' 두 표가 있어요. students(id, name), enrollments(id, student_id, course). 목표: (1) 강의를 하나라도 신청한 학생 이름+강의명 조회 (2) 한 강의도 신청 안 한 학생만 골라내기. 막히면 AI에게 스키마를 알려주고 쿼리를 요청한 뒤, 왜 그렇게 짜였는지 설명까지 받아보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| ON 조건에 두 표의 공통 키를 정확히 명시했는가? | 5 |
| (1)에서는 신청한 학생만, (2)에서는 신청 안 한 학생만 나오도록 INNER/LEFT를 올바르게 골랐는가? | 5 |
| 컬럼명이 겹칠 때 s., e. 같은 별칭을 붙여 ambiguous 에러를 피했는가? | 5 |

## 관련 개념

- [Join](/concepts/join/)
- [Inner Join](/concepts/inner-join/)
- [Left Join](/concepts/left-join/)
- [Foreign Key](/concepts/foreign-key/)
- [Relational](/concepts/relational/)

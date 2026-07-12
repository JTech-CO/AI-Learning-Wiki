---
title: "인덱스와 성능"
description: "10만 건 테이블에서 느린 조회를 EXPLAIN ANALYZE로 진단하고, 올바른 컬럼에 인덱스를 걸어 실행 시간이 자릿수 단위로 줄어드는 것을 직접 수치로 확인한다."
sidebar:
  order: 20
---
_10만 건 테이블에서 느린 조회를 EXPLAIN ANALYZE로 진단하고, 올바른 컬럼에 인덱스를 걸어 실행 시간이 자릿수 단위로 줄어드는 것을 직접 수치로 확인한다._

:::note[학습 목표]
- 느린 조회를 EXPLAIN ANALYZE로 진단해 Seq Scan과 Execution Time으로 개선 전 기준선을 잡는다
- WHERE·JOIN·ORDER BY에 자주 쓰이고 값이 다양한 컬럼을 골라 인덱스를 걸고, 실행 시간이 줄어드는 것을 수치로 증명한다
- 값 종류가 적은 컬럼처럼 인덱스가 무용지물이 되는 경우를 구분해, "무조건 인덱스=빠름"이 거짓임을 설명한다
:::

## 핵심 개념

데이터베이스는 인덱스가 없으면 조건에 맞는 행을 찾으려고 **테이블 전체를 처음부터 끝까지 훑어요**(Full Scan, 흔히 Seq Scan). 책 뒤의 '찾아보기'(색인) 없이 500쪽짜리 책에서 특정 단어를 찾으려고 1쪽부터 넘기는 것과 같아요. **인덱스**는 특정 컬럼값을 미리 정렬해 둔 '찾아보기'라서, `WHERE`·`JOIN`·`ORDER BY`에서 자주 쓰는 컬럼에 걸어두면 DB가 바로 해당 위치로 점프해요(Index Scan).

다만 인덱스는 공짜가 아니에요. **저장 공간을 쓰고 `INSERT`/`UPDATE`를 조금 느리게** 만들죠. 그래서 '자주 조건으로 걸리면서 값의 종류가 다양한 컬럼'에만 **선별해서** 거는 것이 핵심이에요.

### 흐름

느린 조회 발견 → `EXPLAIN ANALYZE`로 기준선(Seq Scan · Execution Time) 확보 → 올바른 컬럼에 인덱스 → 같은 쿼리 재측정 → 두 숫자의 대비로 개선 증명.

### 왜 이게 될까?

인덱스는 책 뒷장의 찾아보기와 같아요. 색인이 없으면 500쪽을 처음부터 넘겨야 하지만(Seq Scan), 색인이 있으면 원하는 페이지로 바로 점프해요(Index Scan). Postgres는 **조건에 맞는 행이 전체의 일부일 때만** 이 지름길을 선택하기 때문에, '자주 조건으로 걸리고 값이 다양한 컬럼'에 인덱스를 걸어야 진짜 효과가 나요.

## 👀 따라하기 예시 — demo_orders 10만 건에서 `user_id = 1234` 조회가 느림

**① 인덱스 없는 상태로 먼저 측정** `EXPLAIN ANALYZE`를 실행 → `Seq Scan on demo_orders ... Execution Time: 18.2 ms`
> 💡 고치기 전에 반드시 기준선(느린 증거)부터 숫자로 남겨야 나중에 개선을 증명할 수 있어요.

**② EXPLAIN 결과를 AI에게 그대로 보여주고 어느 컬럼에 걸지 물어보기** → "`WHERE` 절에 쓰인 `user_id` 컬럼에 인덱스가 없어서 Seq Scan이 발생. `user_id`에 B-tree 인덱스를 추가하면 Index Scan으로 바뀔 가능성이 높습니다."
> 💡 AI 진단을 그대로 믿기보다 "WHERE에 실제로 쓴 컬럼이 맞나?"를 스스로 한 번 더 확인하는 게 핵심 습관이에요.

**③ 진단받은 컬럼에 인덱스 생성**

```sql
CREATE INDEX idx_orders_user ON demo_orders (user_id);
```

> 💡 조건절 컬럼에만 선별해서 걸어야 저장 공간과 쓰기 속도 손해를 최소화해요.

**④ 같은 쿼리를 재측정해서 숫자로 비교** → `Index Scan using idx_orders_user ... Execution Time: 0.09 ms`
> 💡 18.2ms → 0.09ms, 이 두 숫자의 대비가 바로 인덱스가 "됐다"는 증거예요 — 감이 아니라 수치로.

좋은 결과의 기준: (1) Seq Scan → Index Scan으로 바뀌었는가 (2) Execution Time이 눈에 띄게(자릿수 단위로) 줄었는가 (3) 왜 그 컬럼을 골랐는지 한 줄로 설명할 수 있는가.

## 단계별 따라하기

1. **실습용 대용량 테이블 만들기** — Supabase 대시보드의 SQL Editor(무료)를 열고, 실습 테이블을 만든 뒤 `generate_series`로 가짜 데이터 10만 건을 한 번에 넣어요. **인덱스가 없는 순수 상태에서 시작**하는 게 핵심.

```sql
CREATE TABLE demo_orders (
  id bigserial primary key,
  user_id int,
  status text,
  created_at timestamptz
);
INSERT INTO demo_orders (user_id, status, created_at)
SELECT (random()*5000)::int,
       (ARRAY['paid','pending','cancelled'])[(random()*2+1)::int],
       now() - (random()*365 || ' days')::interval
FROM generate_series(1,100000);
```

2. **느린 조회의 증거 확보하기** — 인덱스가 없는 상태에서 특정 `user_id`를 찾는 쿼리를 `EXPLAIN ANALYZE`로 실행. 결과에서 `Seq Scan`(전체 훑기)이라는 단어와 `Execution Time` 숫자를 찾아 메모해요. 이게 개선 전 기준선.

```sql
EXPLAIN ANALYZE SELECT * FROM demo_orders WHERE user_id = 1234;
-- Seq Scan ... Execution Time: 18.2 ms
```

3. **어느 컬럼에 걸지 AI에게 진단받기** — 방금 나온 EXPLAIN 결과 전체를 복사해 AI에게 붙여넣고 '어느 컬럼에 인덱스를 걸어야 하는지, 그 이유'를 물어봐요. AI가 근거를 말하면 그대로 믿지 말고 **'WHERE에 쓴 컬럼이 맞나?'를 스스로 재확인**.

4. **인덱스를 걸고 다시 측정하기** — `WHERE` 조건으로 쓰는 `user_id` 컬럼에 인덱스를 생성하고, 2단계와 똑같은 쿼리를 다시 `EXPLAIN ANALYZE`로 실행해 `Index Scan`으로 바뀌었는지, Execution Time이 얼마나 줄었는지 두 숫자를 비교.

```sql
CREATE INDEX idx_orders_user ON demo_orders (user_id);
-- Index Scan ... Execution Time: 0.09 ms
```

5. **헛다리 인덱스로 반례 체험하기** — 값의 종류가 적은 컬럼(`status`는 3종류뿐)에 인덱스를 걸어보고 `status = 'paid'` 조회를 `EXPLAIN ANALYZE`. 전체의 1/3이 대상이라 DB가 인덱스를 무시하고 Seq Scan을 택하는 경우가 많아요. **'무조건 걸면 빨라진다'가 거짓임을 눈으로** 확인.

```sql
CREATE INDEX idx_orders_status ON demo_orders (status);
-- 여전히 Seq Scan이면 선택도(cardinality)가 낮아 인덱스가 무용지물
```

6. **복합 인덱스와 실무 판단 정리하기** — 자주 함께 쓰는 조건(`user_id` + `created_at` 정렬)을 위한 복합 인덱스를 만들어 정렬 쿼리를 측정. 마지막으로 '거는 기준 3가지'를 한 줄로 정리해요.

```sql
CREATE INDEX idx_orders_user_time ON demo_orders (user_id, created_at DESC);
-- 기준: (1) WHERE/JOIN/ORDER BY에 자주 쓰이고 (2) 값이 다양하고 (3) 읽기가 쓰기보다 많은 컬럼
```

## 흔한 실수 → 교정

- ✗ EXPLAIN 없이 '느린 것 같아서' 감으로 인덱스를 마구 검 → **먼저 `EXPLAIN ANALYZE`로 Seq Scan과 Execution Time을 확인해 기준선을 잡고, 인덱스 후 같은 쿼리를 재측정해 숫자로 개선을 증명.**
- ✗ 모든 컬럼에 인덱스를 걸면 무조건 빨라진다고 생각 → **값 종류가 적은 컬럼(`status` 등)이나 거의 조건으로 안 쓰는 컬럼은 인덱스가 무용지물이거나 오히려 `INSERT`/`UPDATE`를 느리게.** `WHERE`·`JOIN`·`ORDER BY`에 자주 쓰이고 값이 다양한 컬럼만 선별.
- ✗ 인덱스를 걸었는데도 `WHERE`에 함수나 형변환을 써서 인덱스가 안 먹음 → **`WHERE date(created_at)=...`처럼 컬럼을 가공하면 인덱스를 못 써요.** `created_at >= ... AND created_at < ...`처럼 컬럼을 원본 그대로 비교하거나, 필요하면 표현식 인덱스.

## 도구

- 🛠 **Supabase SQL Editor** (supabase.com) — 무료로 PostgreSQL에 `EXPLAIN ANALYZE`를 실행.
- 🛠 **PostgreSQL EXPLAIN 문서** (postgresql.org/docs/current/using-explain.html) — Seq/Index Scan 읽는 법.
- 🛠 **ChatGPT / Claude** (chat.openai.com / claude.ai) — EXPLAIN 결과 진단·인덱스 컬럼 추천.
- 🛠 **DB Fiddle** (dbfiddle.uk) — 설치 없이 브라우저에서 인덱스 실험.

## 실전 프롬프트

### EXPLAIN 결과 진단

```text
나는 PostgreSQL을 쓰고 있어. 아래는 느린 쿼리와 EXPLAIN ANALYZE 결과야. (1) 왜 느린지 (2) 어느 컬럼에 인덱스를 걸어야 하는지 (3) 그 인덱스 생성 SQL을 알려줘. 쿼리: [SQL] / 결과: [EXPLAIN 결과]
```

> 확인된 작성 예시 없음

`프롬프트` `EXPLAIN` `진단`

### 인덱스 필요성 사전 판단

```text
내 테이블 스키마는 다음과 같아: [CREATE TABLE]. 이 앱에서 가장 자주 실행되는 조회는 [특정 user_id의 최근 주문 20개]야. 어느 컬럼(또는 복합 인덱스)에 인덱스를 걸면 좋을지, 걸면 안 되는 컬럼은 무엇인지 이유와 함께 알려줘.
```

> 확인된 작성 예시 없음

`프롬프트` `인덱스` `설계`

### 복합 인덱스 순서 결정

```text
PostgreSQL에서 WHERE [컬럼A] = ? AND [컬럼B] > ? ORDER BY [컬럼C] 형태 쿼리를 자주 써. 복합 인덱스를 만든다면 컬럼 순서를 어떻게 해야 하고 그 이유는 뭔지, DESC 정렬도 고려해서 CREATE INDEX 문으로 알려줘.
```

> 확인된 작성 예시 없음

`프롬프트` `복합 인덱스` `정렬`

### 불필요한 인덱스 정리

```text
내 PostgreSQL 테이블에 인덱스가 여러 개 있어: [인덱스 목록]. 쓰기 성능을 갉아먹는 중복·저효율 인덱스가 있는지 판단하고, 지워도 되는 것과 그 근거를 알려줘.
```

> 확인된 작성 예시 없음

`프롬프트` `인덱스` `정리`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! demo_orders 대신 products(id, category, price, created_at) 테이블이 있고, WHERE category = '전자제품' 조회가 느리다는 신고가 들어왔어요. EXPLAIN ANALYZE를 먼저 돌려보고(실제 테이블이 없으면 예상 결과를 적어도 OK), category 컬럼에 인덱스를 걸지 말지를 스스로 판단해 이유와 함께 결론을 내려보세요. 힌트: category 값의 종류가 몇 개나 되는지부터 확인하세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 이 컬럼의 값 종류(카디널리티)가 몇 개인지 먼저 확인했나? | 5 |
| EXPLAIN ANALYZE로 Seq Scan인지 Index Scan인지 실제 근거를 봤나(또는 근거를 남길 계획을 세웠나)? | 5 |
| "무조건 인덱스=빠름"이 아니라 언제 인덱스가 무용지물인지 내 언어로 설명할 수 있나? | 5 |

## 관련 개념

- [Index](/concepts/index/)
- [Performance](/concepts/performance/)
- [Explain Analyze](/concepts/explain-analyze/)
- [Seq Scan](/concepts/seq-scan/)
- [Cardinality](/concepts/cardinality/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
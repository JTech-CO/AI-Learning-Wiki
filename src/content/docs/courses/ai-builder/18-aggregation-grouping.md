---
title: "집계와 그룹화"
description: "COUNT·SUM·AVG와 GROUP BY·HAVING으로 원본 데이터를 SQL 한 쿼리로 요약해, '카테고리별 매출 TOP 5' 같은 통계·리포트를 뽑아낸다. 엑셀 수식과 30분 씨름하던 집계를 3초로 줄인다."
sidebar:
  order: 18
---
_COUNT·SUM·AVG와 GROUP BY·HAVING으로 원본 데이터를 SQL 한 쿼리로 요약해, '카테고리별 매출 TOP 5' 같은 통계·리포트를 뽑아낸다. 엑셀 수식과 30분 씨름하던 집계를 3초로 줄인다._

:::note[학습 목표]
- COUNT·SUM·AVG와 GROUP BY·HAVING을 조합해 요약 리포트를 SQL 한 쿼리로 뽑는다
- WHERE(집계 전 개별 행)와 HAVING(집계 후 그룹)의 차이를 구분해 조건을 올바른 위치에 넣는다
- ORDER BY·LIMIT을 붙여 '카테고리별 매출 TOP N' 같은 바로 쓸 수 있는 리포트를 완성한다
:::

## 핵심 개념

집계(aggregation)는 **수많은 행을 하나의 숫자로 압축하는 일**이에요. 영수증 1만 장을 "총매출 3,200만 원, 평균 객단가 3,200원"으로 요약하는 계산기라고 생각하면 됩니다. **COUNT는 행 개수, SUM은 합계, AVG는 평균**을 냅니다.

여기에 **GROUP BY**를 붙이면 "카테고리별로", "월별로"처럼 기준을 나눠 각 그룹마다 따로 집계하게 만들고, **HAVING**은 그렇게 나온 그룹 중 "매출 100만 원 넘는 것만" 같은 조건으로 걸러냅니다.

> 💡 **WHERE는 집계 전 개별 행을 거르고, HAVING은 집계 후 그룹을 거른다** — 이 차이만 기억하면 90%는 끝이에요.

### 왜 이게 될까?

SQL 엔진은 수백만 행을 훑으면서 같은 값끼리 묶고 더하는 일을 초 단위로 처리하도록 설계돼 있어요. 당신은 **"무엇을 기준으로 묶고(GROUP BY), 무엇을 걸러낼지(HAVING)"만 정하면** 실제로 세고 더하고 나누는 계산은 전부 AI와 SQL 엔진이 대신합니다.

## 👀 따라하기 예시 — 카페 "이번 달 카테고리별로 어디서 돈을 제일 많이 벌었나"

**① 먼저 전체를 한 줄로 요약**
```sql
SELECT COUNT(*) AS 건수, SUM(amount) AS 총매출 FROM sales;
```
→ 건수 5 | 총매출 23800
> 💡 세부로 들어가기 전에 "전체 그림"부터 찍어두면, 나중에 숫자가 틀렸을 때 바로 알아챌 수 있어요.

**② category로 GROUP BY해서 쪼개기**
```sql
SELECT category, SUM(amount) FROM sales GROUP BY category;
```
→ 음료 14000 / 베이커리 9800
> 💡 GROUP BY는 "카테고리별로 따로 계산해줘"라는 뜻. **SELECT에 쓴 일반 컬럼(category)은 반드시 GROUP BY에도 있어야 한다**는 게 핵심 규칙이에요.

**③ HAVING으로 매출 기준 미달 그룹 제거**
```sql
... HAVING SUM(amount) >= 10000;
```
→ 음료 14000만 남고 베이커리(9800)는 빠짐
> 💡 WHERE는 개별 행을, HAVING은 이미 묶인 그룹을 거른다는 차이 — 이게 '아하 포인트'예요.

**④ ORDER BY + LIMIT으로 TOP N 리포트 완성**
```sql
... ORDER BY 매출 DESC LIMIT 5;
```
→ 최종 리포트: 음료 14000 (조건을 통과한 1건만)
> 💡 정렬과 개수 제한을 마지막에 붙이면 "카테고리별 매출 TOP 5" 같은 완성된 리포트가 한 쿼리로 나와요.

좋은 결과의 기준: (1) GROUP BY 기준 컬럼이 SELECT와 정확히 일치한다 (2) HAVING과 WHERE를 헷갈리지 않았다 (3) 실행했을 때 sqliteonline에서 에러 없이 숫자가 바로 나온다.

## 단계별 따라하기

1. **연습용 테이블 준비하기** — sqliteonline.com에 접속해 언어를 SQLite로 두고, 아래 CREATE TABLE·INSERT 문을 붙여넣어 Run.
```sql
CREATE TABLE sales (id INTEGER, category TEXT, product TEXT, amount INTEGER, sold_at TEXT);
INSERT INTO sales VALUES
  (1,'음료','아메리카노',4500,'2026-06-01'),
  (2,'음료','라떼',5000,'2026-06-01'),
  (3,'베이커리','크루아상',3800,'2026-06-02'),
  (4,'음료','아메리카노',4500,'2026-06-02'),
  (5,'베이커리','식빵',6000,'2026-06-03');
```
2. **전체를 한 줄로 요약하기** — GROUP BY 없이 COUNT·SUM·AVG를 먼저 써서 전체 합계를 낸다. `AS`로 결과 컬럼에 한글 별칭을 붙이면 리포트가 읽기 쉬워진다.
```sql
SELECT COUNT(*) AS 건수, SUM(amount) AS 총매출, AVG(amount) AS 평균단가 FROM sales;
```
3. **GROUP BY로 기준별로 쪼개기** — SELECT에 나눌 기준 컬럼(category)을 쓰고 맨 아래 `GROUP BY category`. 규칙: SELECT에 있는 일반 컬럼은 반드시 GROUP BY에도 넣는다.
```sql
SELECT category AS 카테고리, COUNT(*) AS 건수, SUM(amount) AS 매출 FROM sales GROUP BY category;
```
4. **HAVING으로 그룹 걸러내기** — 집계 결과가 조건을 넘는 그룹만 남긴다. WHERE가 아니라 HAVING을 GROUP BY 뒤에. 집계 함수 조건(`SUM > ...`)은 무조건 HAVING.
```sql
SELECT category AS 카테고리, SUM(amount) AS 매출 FROM sales GROUP BY category HAVING SUM(amount) >= 10000;
```
5. **정렬·상위 N개로 리포트 완성** — `ORDER BY ... DESC`로 매출 높은 순 정렬, `LIMIT`으로 TOP N만. WHERE(개별 행 필터) → GROUP BY → HAVING → ORDER BY → LIMIT 순서를 이대로 외운다.
```sql
SELECT category AS 카테고리, SUM(amount) AS 매출 FROM sales WHERE sold_at >= '2026-06-01' GROUP BY category HAVING SUM(amount) >= 10000 ORDER BY 매출 DESC LIMIT 5;
```
6. **AI에게 실무 리포트 쿼리 시키기** — 내 실제 테이블 컬럼명을 알려주고 원하는 리포트를 말로 설명하면 AI가 쿼리를 만들어준다. 받은 쿼리는 sqliteonline에서 바로 돌려 검증한다. 예: `"sales(category, amount, sold_at) 테이블에서 6월 카테고리별 매출 합계를 높은 순으로 상위 3개 뽑는 SQLite 쿼리 줘"`

## 흔한 실수 → 교정

- ✗ 집계 조건을 WHERE에 넣어 `misuse of aggregate` 에러 (예: `WHERE SUM(amount) > 10000`) → **집계 함수(SUM·COUNT·AVG) 조건은 WHERE가 아니라 GROUP BY 뒤의 HAVING.** WHERE는 개별 행, HAVING은 그룹 대상.
- ✗ SELECT에 category와 SUM(amount)를 같이 썼는데 `GROUP BY category`를 빠뜨려 결과가 한 줄로 뭉개지거나 엉뚱하게 나옴 → **SELECT에 집계 함수가 아닌 일반 컬럼이 있으면 그 컬럼을 전부 GROUP BY에 똑같이 넣는다.**
- ✗ `COUNT(*)`와 `COUNT(컬럼)`을 같은 걸로 착각 → NULL이 있는 컬럼에서 개수가 달라 통계가 틀림. **전체 행 수는 `COUNT(*)`, 값이 있는 행만 세려면 `COUNT(컬럼)`, 중복 없는 값 개수는 `COUNT(DISTINCT 컬럼)`.**

## 도구

- 🛠 **SQLite Online** (sqliteonline.com) — 설치 없이 브라우저에서 SQL을 즉시 실행.
- 🛠 **DB Fiddle** (db-fiddle.com) — 여러 DB 방언으로 쿼리 테스트·공유.
- 🛠 **ChatGPT** (chat.openai.com) — 자연어로 집계 쿼리 생성·에러 디버깅.
- 🛠 **SQLBolt** (sqlbolt.com) — GROUP BY·집계를 인터랙티브하게 무료로 연습.

## 실전 프롬프트

### 내 데이터로 집계 쿼리 생성

```text
나는 SQLite를 쓰고 있어. 테이블 [테이블명]에는 컬럼이 [컬럼1, 컬럼2, 컬럼3]이 있어. 나는 [원하는 리포트: 카테고리별 월매출 상위 5개]를 만들고 싶어. GROUP BY와 필요하면 HAVING·ORDER BY·LIMIT을 써서 바로 실행 가능한 쿼리 하나만 주고, 각 줄이 무슨 역할인지 한 줄씩 한국어 주석으로 달아줘.
```

> 확인된 작성 예시 없음

`집계` `쿼리생성` `GROUP BY`

### WHERE vs HAVING 판별

```text
내가 만든 이 SQL을 봐줘: [쿼리]. 이 조건 [조건 설명]을 넣어야 하는데 WHERE에 넣어야 하는지 HAVING에 넣어야 하는지 이유와 함께 알려주고, 고친 최종 쿼리를 줘.
```

> 확인된 작성 예시 없음

`WHERE` `HAVING` `디버깅`

### 에러 메시지 해결

```text
SQLite에서 이 쿼리를 돌렸더니 [에러 메시지]가 나왔어. 쿼리는 [쿼리]야. 원인을 초보자도 알게 설명하고, GROUP BY 규칙을 지킨 올바른 쿼리로 고쳐줘.
```

> 확인된 작성 예시 없음

`에러` `디버깅` `GROUP BY`

### 결과 검산 요청

```text
이 집계 쿼리 결과 [결과]가 맞는지 확인하고 싶어. 원본 데이터는 [샘플 몇 행]이야. SUM·COUNT·AVG가 논리적으로 맞는지 수동으로 검산해서 틀린 부분이 있으면 알려줘.
```

> 확인된 작성 예시 없음

`검산` `집계`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! 예시의 category 대신 sold_at(날짜)로 기준을 바꿔보세요. "날짜별 매출 합계를 구하고, 매출이 5000원 넘는 날짜만, 매출 높은 순으로" 정렬하는 쿼리를 sqliteonline에서 직접 작성해 실행해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| SELECT에 쓴 일반 컬럼(sold_at)을 GROUP BY에도 똑같이 넣었나 | 5 |
| 금액 조건(5000 초과)을 WHERE가 아니라 HAVING에 넣었나 | 5 |
| 실행했을 때 misuse of aggregate 같은 에러 없이 결과가 바로 나왔나 | 5 |

## 관련 개념

- [Aggregation](/concepts/aggregation/)
- [Group By](/concepts/group-by/)
- [Having](/concepts/having/)
- [Count Sum Avg](/concepts/count-sum-avg/)
- [Where Vs Having](/concepts/where-vs-having/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
---
title: "RLS로 데이터 지키기"
description: "Row Level Security 정책으로 각 사용자가 자기 데이터만 읽고 쓰게 제한하는 보안 규칙을 작성한다. RLS를 안 켜면 anon key를 아는 누구나 브라우저 콘솔 한 줄로 남의 주문·메모·개인정보를 통째로 긁어갈 수 있다."
sidebar:
  order: 23
---
_Row Level Security 정책으로 각 사용자가 자기 데이터만 읽고 쓰게 제한하는 보안 규칙을 작성한다. RLS를 안 켜면 anon key를 아는 누구나 브라우저 콘솔 한 줄로 남의 주문·메모·개인정보를 통째로 긁어갈 수 있다._

:::note[학습 목표]
- 내 테이블에 RLS를 켜고 "각자 자기 데이터만 읽고 쓰게" 하는 정책을 직접 작성한다
- auth.uid() = user_id 조건으로 SELECT·INSERT·UPDATE·DELETE 정책을 만들고 to authenticated로 대상을 제한한다
- 두 계정(또는 set_config 가장)으로 남의 데이터가 새지 않는지 직접 검증한다
:::

## 핵심 개념

Supabase의 모든 테이블은 인터넷에 그대로 노출된 API(**anon key**)로 접근돼요. RLS(Row Level Security)를 켜지 않으면 그 키를 아는 누구나 브라우저 콘솔 한 줄로 테이블 **전체 행을 SELECT/UPDATE/DELETE** 할 수 있어요. RLS는 "이 행을 이 사용자가 봐도/바꿔도 되는가?"를 **한 줄의 조건식(policy)**으로 데이터베이스가 매 요청마다 검사하게 만드는 **문지기**예요.

핵심 열쇠는 로그인한 사용자의 ID를 돌려주는 **`auth.uid()`** 함수예요. 보통 테이블에 `user_id` 컬럼을 두고 `auth.uid() = user_id`로 "내 것만" 걸러냅니다. 정책을 켜지 않으면 대문이 활짝 열린 것이고, **켜기만 하고 정책을 안 만들면** 반대로 아무도 못 들어오는 잠긴 문이 돼요.

### 왜 이게 될까?

Supabase는 anon key만 있으면 누구나 테이블에 SQL 요청을 던질 수 있는 구조예요. RLS는 그 요청이 들어올 때마다 데이터베이스가 "이 행, 이 사람 것 맞아?"를 자동으로 검사하게 만듭니다. `auth.uid() = user_id`라는 조건 한 줄만 정하면 그 뒤로는 DB가 알아서 매 요청을 걸러줘요.

## 👀 따라하기 예시 — notes 테이블(id, user_id, body), 방패 아이콘이 회색(RLS 꺼짐)

**① RLS부터 켠다**

```sql
alter table public.notes enable row level security;
```

실행 후 앱을 새로고침하면 노트 목록이 전부 사라져요(빈 화면).
> 💡 정책이 하나도 없으면 안전하게 "전부 잠금"부터 — 뚫린 채로 있는 것보다 백배 낫습니다.

**② 조회 정책: 내 것만 보이게**

```sql
create policy "내 노트만 조회" on public.notes
  for select to authenticated
  using ( auth.uid() = user_id );
```

로그인한 사람의 노트만 떠요.
> 💡 `using` 조건이 "이 행을 보여줘도 되나?"를 매 SELECT마다 자동으로 체크해요.

**③ 쓰기 정책: 위조 방지까지**

```sql
create policy "내 노트만 추가" on public.notes
  for insert to authenticated
  with check ( auth.uid() = user_id );
```

남의 `user_id`를 넣어 INSERT하려 하면 정책 위반으로 거부돼요.
> 💡 `with check`는 "저장되는 값"을 검사해서 로그인한 사람이 남의 ID로 행을 심는 위조를 막아요.

**④ 두 계정으로 직접 침투 테스트**

```sql
select set_config('request.jwt.claims',
  json_build_object('sub','계정B_uuid')::text, true);
select count(*) from public.notes;
```

결과 0건 — 계정 B에게 A의 노트는 안 보여요.
> 💡 말로만 "안전하다"가 아니라 실제로 남의 데이터가 0건으로 막히는 걸 눈으로 확인해야 진짜 끝이에요.

좋은 결과의 기준: (1) Advisors > Security에 "RLS disabled" 경고가 0건 (2) 계정 B로 조회했을 때 A의 행이 절대 안 보임 (3) INSERT/UPDATE에 `with check`가 반드시 포함.

## 단계별 따라하기

1. **위험한 테이블부터 찾기** — Table Editor에서 사용자 데이터가 든 테이블(주문·메모·프로필 등)을 연다. 방패 아이콘이 회색(꺼짐)인 테이블이 곧 구멍. `user_id` 컬럼이 있는지 확인하고, 없으면 먼저 `uuid` 타입 `user_id` 컬럼을 추가한다.
2. **RLS 스위치 켜기** — SQL Editor에서 `alter table public.notes enable row level security;`. 이 순간부터 정책이 하나도 없으면 anon은 아무 행도 못 본다(안전하게 잠김). 앱이 갑자기 빈 화면이 돼도 정상.
3. **읽기 정책 만들기 (내 것만 보기)** — SELECT용 정책. `using` 절에 `auth.uid() = user_id`를 넣어 로그인 사용자의 행만 통과시킨다. 정책 이름은 무슨 일을 하는지 알아보게 짓는다. 조건이 헷갈리면 AI에게 스키마를 주고 정책 문장을 뽑아달라고 한다.
4. **쓰기 정책 만들기 (남의 것으로 위조 방지)** — INSERT는 `with check`로, UPDATE/DELETE는 `using`으로 소유권을 검사한다. INSERT의 `with check ( auth.uid() = user_id )`는 로그인한 사람이 자기 `user_id`를 넣을 때만 허용해 남의 ID로 행을 심는 위조를 막는다. UPDATE는 `using`과 `with check`를 둘 다 걸어 대상 행과 수정 후 값을 모두 검사한다.
5. **두 계정으로 실제 침투 테스트** — 계정 A로 로그인해 노트 1개를 만들고, 계정 B로 로그인(또는 다른 브라우저)해 목록을 불러온다. B에게 A의 노트가 안 보이면 성공. 앱이 없으면 SQL Editor에서 트랜잭션 안에서 `request.jwt.claims`의 `sub`를 B의 id로 설정한 뒤 select 해보고 A의 행이 0건이면 통과.

```sql
begin;
select set_config('request.jwt.claims',
  json_build_object('sub','<계정B_uuid>')::text, true);
select count(*) from public.notes;
rollback;
```

6. **Advisor로 빠진 구멍 스캔** — 대시보드 > Advisors > Security를 열어 'RLS disabled in public' 경고가 남았는지 확인. 남아 있으면 그 테이블은 아직 공개 상태다. 경고가 0이 될 때까지 2~4단계를 반복. AI에게 경고 목록을 붙여넣고 각 테이블에 맞는 정책을 한꺼번에 생성해달라고 하면 빠르다.

## 흔한 실수 → 교정

- ✗ **RLS를 켜지 않은 채로 배포** — anon key는 프론트엔드 코드에 그대로 박혀 있어 누구나 테이블 전체를 조회할 수 있는데 '앱이 잘 돌아가니 안전하다'고 착각 → **모든 public 테이블에 `enable row level security`를 켜고, Advisors > Security에서 'RLS disabled' 경고가 0건인지 확인한다.** 켜는 것이 기본값이어야 한다.
- ✗ **INSERT/UPDATE 정책에 `with check`를 빼먹음** — 로그인한 사용자가 `user_id`에 남의 ID를 넣어 행을 위조하거나, 수정하면서 소유권을 남에게 넘길 수 있다 → **INSERT는 `with check ( auth.uid() = user_id )`, UPDATE는 `using`과 `with check`를 모두 건다.** `using`은 '어떤 행을 건드릴 수 있나', `with check`는 '바뀐 값이 규칙에 맞나'를 검사한다.
- ✗ **정책을 `to authenticated`로 제한하지 않음** — anon(비로그인)에게도 규칙이 적용되며 `auth.uid()`가 null이라 예상과 다르게 동작 → **사용자별 데이터 정책은 항상 `to authenticated`로 대상을 지정한다.** 비로그인 공개 데이터가 필요하면 별도의 안전한 SELECT 정책을 명시적으로 따로 만든다.

## 도구

- 🛠 **Supabase Dashboard** (supabase.com/dashboard) — Table Editor·SQL Editor·Advisors에서 RLS를 켜고 정책을 작성.
- 🛠 **Supabase Advisors > Security** (대시보드 내) — RLS 꺼진 테이블·취약 정책을 자동 스캔.
- 🛠 **Supabase RLS 공식 문서** (supabase.com/docs/guides/database/postgres/row-level-security) — `auth.uid()`·`using`/`with check` 레퍼런스.
- 🛠 **ChatGPT · Claude** (claude.ai) — 스키마를 붙여넣고 정책 생성·보안 감사.

## 실전 프롬프트

### 테이블 스키마 → RLS 정책 4종 생성

```text
너는 Supabase 보안 전문가야. 아래 테이블에 대해 로그인한 사용자가 '자기 데이터만' 읽고/쓰게 하는 RLS 정책을 SELECT, INSERT, UPDATE, DELETE 4개로 만들어줘. authenticated 롤 대상이고, 소유권 컬럼은 [user_id]야. enable row level security 문장도 포함하고, 각 정책 위에 한국어 주석을 달아줘. 테이블 정의: [CREATE TABLE 문 또는 컬럼 목록]
```

> 확인된 작성 예시 없음

`RLS` `정책 생성` `Supabase`

### 내 RLS 정책이 안전한지 감사

```text
아래는 내 Supabase 테이블의 RLS 정책들이야. 보안 허점을 찾아줘: (1) INSERT에 with check가 빠져 남의 user_id로 위조 가능한지 (2) UPDATE에 with check가 없어 수정 후 소유권이 바뀔 수 있는지 (3) using에 true나 과도한 조건이 있는지 (4) anon 롤에 실수로 권한이 열렸는지. 문제마다 위험도와 수정 SQL을 표로 정리해줘. [create policy 문들]
```

> 확인된 작성 예시 없음

`RLS` `보안 감사` `with-check`

### 정책 테스트 SQL 만들기

```text
아래 RLS 정책이 실제로 '남의 데이터를 못 본다'를 증명하는 테스트 SQL을 만들어줘. set_config로 request.jwt.claims의 sub를 특정 유저로 가장한 뒤, 그 유저가 (a) 자기 행만 보이는지 (b) 남의 행은 0건인지 (c) 남의 user_id로 insert가 거부되는지 확인하는 begin/rollback 블록으로. 테이블: [notes], 소유권 컬럼: [user_id]
```

> 확인된 작성 예시 없음

`RLS` `테스트` `set-config`

### RLS 켠 뒤 앱이 빈 화면일 때 진단

```text
Supabase에서 RLS를 켰더니 앱에서 데이터가 하나도 안 나와. 원인 후보를 체크리스트로 정리해줘: 정책이 아예 없는지, authenticated 대신 anon으로 요청하는지, auth.uid()가 null인지(로그인 안 됨), user_id가 안 채워졌는지. 각 후보를 확인하는 SQL이나 확인 방법도 함께 알려줘.
```

> 확인된 작성 예시 없음

`RLS` `디버깅` `auth-uid`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! orders 테이블(id, user_id, item, price)에 똑같이 적용해보세요. RLS를 켜고, "내 주문만 조회/추가/수정/삭제" 정책 4개를 직접 SQL로 작성한 다음, 계정 B로 가장해서 A의 주문이 안 보이는지 확인하세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| INSERT와 UPDATE 정책에 with check를 빠뜨리지 않았나 | 5 |
| 정책을 to authenticated로 제한했나(anon에게도 열려버리지 않았나) | 5 |
| Advisors > Security에서 orders 테이블의 RLS 경고가 실제로 사라졌나 | 5 |

## 관련 개념

- [Rls](/concepts/rls/)
- [Row Level Security](/concepts/row-level-security/)
- [Auth Uid](/concepts/auth-uid/)
- [Policy](/concepts/policy/)
- [Security](/concepts/security/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
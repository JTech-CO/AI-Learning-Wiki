---
title: "초보용 백엔드·DB — Supabase로 회원·데이터 저장"
description: "코드 거의 없이 회원가입·로그인·데이터 저장을 대신 해주는 Supabase로 앱의 뒷단을 만들고, 클릭 몇 번과 짧은 코드로 '할 일(todo)'을 저장·조회하는 작은 앱을 30분 만에 직접 동작시킨다."
sidebar:
  order: 21
---
_코드 거의 없이 회원가입·로그인·데이터 저장을 대신 해주는 Supabase로 앱의 뒷단을 만들고, 클릭 몇 번과 짧은 코드로 '할 일(todo)'을 저장·조회하는 작은 앱을 30분 만에 직접 동작시킨다._

:::note[학습 목표]
- Supabase에 무료 프로젝트를 만들어 회원가입·DB·API가 자동으로 세팅되는 '뒷단'의 원리를 이해한다
- '할 일(todo)' 데이터를 저장하는 표(테이블)를 만들고 열을 직접 정의한다
- 공개 키만으로 웹 화면과 표를 양방향 연결해 데이터를 추가하고 목록을 불러온다
:::

## 핵심 개념

앱은 **앞단(화면)**과 **뒷단(데이터 보관소)**으로 나뉘어요. 뒷단은 손님 눈에 안 보이는 **식당 주방** 같은 곳이에요. 보통 이 주방을 직접 짓는 건 어렵고 오래 걸리는데, **Supabase**는 '이미 다 지어진 주방'을 무료로 빌려주는 서비스예요. 데이터를 칸칸이 저장하는 **표(테이블)**와 회원가입·로그인 기능이 처음부터 들어 있죠. 표는 엑셀 시트와 똑같아요 — 가로줄(행)이 데이터 1개, 세로줄(열)이 항목이에요. 우리는 화면에서 **API**(앱끼리 주고받는 연결 통로)로 이 표에 글을 적고 읽기만 하면 돼요.

### 데이터 흐름

💻 웹 화면(사용자 입력) → 🔑 API 키(연결 통로) → 🗄 Supabase(무료 주방) → 📊 테이블 저장(엑셀처럼 칸칸) → ✅ 목록 표시(다시 화면에).

### 왜 이게 될까?

Supabase가 이미 수만 명이 쓰는 검증된 '주방'(회원가입·표·API)을 통째로 빌려주기 때문이에요. 당신은 표(테이블) 이름과 열만 정하면 되고, 저장·불러오기·보안 코드는 Supabase가 이미 다 짜놨어요. 며칠 걸릴 뒷단 개발이 클릭 몇 번 + 짧은 코드 한 줄로 끝나요.

## 👀 따라하기 예시 — 할 일(todo) 저장 앱

**① 새 프로젝트 만들기** — Name: `my-todo`, Region: Seoul → 1~2분 뒤 대시보드로. 왼쪽에 Table Editor, Authentication, API 메뉴가 이미 준비돼 있어요.
> 💡 회원가입·DB·API가 이 순간 자동으로 다 세팅됐어요 — 아무 코드도 안 짰는데도요.

**② todos 표 생성** — Table Editor에서 열 `task`(text)를 추가하고 RLS 해제 → `id`, `created_at`, `task` 3개 열. 아직 행은 0개.
> 💡 열 이름 하나하나가 나중에 코드에서 그대로 쓰는 '이름표'예요.

**③ 손으로 데이터 넣기** — Insert row로 `task: '우유 사기'`를 직접 입력 → 표에 새 줄 1개(id:1, created_at:자동, task:'우유 사기').
> 💡 화면(코드) 없이도 데이터가 저장된다는 걸 눈으로 확인 — 이게 '뒷단'의 역할이에요.

**④ 화면과 연결** — todo.html에 URL·공개 키를 넣고 열어서 '운동하기' 추가 → 화면 목록에 '운동하기'가 뜨고, Table Editor를 새로고침하면 그 줄도 보여요.
> 💡 화면 → API → 표, 표 → API → 화면. 양방향이 다 통해야 연결 성공이에요.

좋은 결과의 기준: (1) 화면에서 추가한 항목이 표에도 보인다 (2) 표에서 직접 넣은 항목이 새로고침 후 화면에도 보인다 (3) secret key/service_role 키는 코드 어디에도 없다.

## 단계별 따라하기

1. **Supabase 무료 계정 만들기** — supabase.com → 'Start your project' → 'Continue with GitHub' 또는 'Sign up with email'. 가입 무료, 카드 등록 불필요. 인증 메일이 안 오면 스팸함을 확인.
2. **새 프로젝트 생성** — 'New project' → Name `my-todo` → 'Database Password'에 비밀번호(메모장에 꼭 붙여넣기) → Region 'Northeast Asia (Seoul)' → 'Create new project'. 1~2분 대기.
   > 💡 무료 플랜은 DB에 7일간 쿼리가 없으면 프로젝트가 자동 일시정지(paused)돼요. 데이터는 보존되지만 앱이 멈추니, 대시보드 'Restore project'로 약 30초 만에 재개하면 돼요.
3. **데이터를 담을 표(테이블) 만들기** — 'Table Editor' → 'Create a new table' → Name `todos` → 'Enable Row Level Security'는 연습용이니 **체크 해제** → id, created_at 기본 + '+ Add column'으로 Name=`task`, Type=`text` → 'Save'.
4. **손으로 데이터 1개 넣어보기** — `todos` 표 클릭 → '+ Insert' → 'Insert row' → task 칸에 '우유 사기'(id, created_at은 자동이니 비워둠) → 'Save'. 표에 가로줄 1개가 생기면 성공.
5. **연결 열쇠(API 키·주소) 복사하기** — 'Project Settings'(톱니바퀴) → 'API Keys' 탭 → 'Project URL' 복사.
   > 💡 키 체계 변경(2025년 11월부터): 2025년 11월 이후 신규 프로젝트는 'Publishable key'(`sb_publishable_...`로 시작)를 복사(anon public 키는 제공되지 않음). 2025년 11월 이전 기존 프로젝트는 'anon public' 키(`eyJ...`로 시작)를 'Reveal' 눌러 복사(2026년 말 폐지 예정, 나중에 마이그레이션 필요). 두 방식 모두 화면(클라이언트)에서 안전하게 쓸 수 있는 공개용 키예요. **주의: 'secret key'(`sb_secret_...`) 또는 구형 'service_role' 키는 절대 화면 코드에 넣지 말 것** — 모든 데이터를 우회 접근할 수 있는 서버 전용 마스터키예요.
6. **한 페이지 웹 화면으로 연결하기** — 메모장/텍스트편집기에 'HTML 한 페이지 앱' 코드를 붙여넣고, 코드 안 `SUPABASE_URL`과 `SUPABASE_KEY` 두 곳을 5단계에서 복사한 내 URL·공개 키로 바꿈 → 'todo.html'로 저장('파일 형식: 모든 파일') → 더블클릭. 입력칸에 '운동하기'를 적고 '추가'를 누르면 목록에 뜨고, Table Editor를 새로고침하면 표에도 보여요. 목록이 비면 F12 콘솔의 빨간 에러를 확인 — 대개 키 오타거나 3단계에서 RLS 체크를 안 끈 경우예요.
7. **잘 되는지 최종 확인** — 화면에서 할 일 2~3개 더 추가 → Table Editor 새로고침(F5)하면 줄이 늘어남. 반대로 Supabase에서 'Insert row'로 직접 넣은 데이터도 화면 새로고침하면 목록에. 양방향이 다 되면 백엔드 연결 성공.

## 흔한 실수 → 교정

- ✗ 3단계에서 'Row Level Security(RLS)'를 켠 채로 두고 코드를 돌려 목록이 안 뜸 → **연습 단계에선 테이블 만들 때 RLS 체크를 해제.** 이미 만들었다면 Authentication > Policies에서 끄거나, 실서비스라면 '읽기/쓰기 허용' 정책을 추가.
- ✗ secret key(신규) 또는 service_role 키(기존)를 화면 코드(HTML)에 붙여 넣음 → **화면 코드에는 반드시 '공개 키'만.** 신규는 'Publishable key'(`sb_publishable_...`), 기존은 'anon public'. 'secret key'/'service_role'은 모든 데이터를 우회 접근할 수 있는 서버 전용 마스터키이므로 절대 HTML 코드에 넣거나 공개 저장소에 올리지 말 것.
- ✗ URL이나 키를 복사할 때 앞뒤 공백·따옴표를 같이 붙여 넣음 → **따옴표(') 안에 키만 정확히, 공백 없이.** 한 글자만 틀려도 연결 안 됨.
- ✗ 테이블 열 이름(task)과 코드 속 이름(`insert({task:v})`)이 서로 다름 → **Supabase 표의 열 이름과 코드의 키 이름은 글자까지 똑같아야.** 대소문자도 구분.
- ✗ 무료 플랜 프로젝트가 7일 비활성으로 자동 일시정지되어 앱이 갑자기 작동하지 않음 → **무료 플랜에서는 7일간 쿼리가 없으면 자동 일시정지.** 대시보드 'Restore project'로 재개. 데이터는 삭제 안 됨.

## 도구

- 🛠 **Supabase** (supabase.com) — 무료 백엔드(회원·DB·API)를 클릭으로 만들어 주는 서비스.
- 🛠 **ChatGPT·Claude** — 코드 수정·에러 해결을 한국어로 물어보는 도우미.
- 🛠 **브라우저(크롬)** — todo.html을 실행하고 F12 콘솔로 에러를 확인.

## 완료 체크리스트

- ☐ Supabase 무료 프로젝트 'my-todo'가 생성됨
- ☐ 'todos' 테이블에 task(text) 열이 있음
- ☐ Project URL과 공개 키(Publishable key 또는 anon public 키)를 메모장에 복사(2025년 11월 이후 신규 프로젝트라면 `sb_publishable_...`로 시작하는 Publishable key)
- ☐ todo.html을 열어 화면에서 할 일을 추가하면 목록에 뜸
- ☐ Supabase Table Editor에서 그 데이터 행이 실제로 보임

## 실전 프롬프트

### HTML 한 페이지 todo 앱 (그대로 복붙, 두 곳만 교체)

```text
아래 HTML을 그대로 복사한 뒤, 코드 안 `SUPABASE_URL`과 `SUPABASE_KEY` 두 곳만 내 값으로 교체해서 `todo.html`로 저장하고 더블클릭하세요.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <title>내 할일</title>
</head>
<body>
  <h2>내 할 일</h2>
  <input id='t' placeholder='할 일 입력'>
  <button onclick='add()'>추가</button>
  <ul id='list'></ul>
  <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script>
  <script>
    const SUPABASE_URL='[내_Project_URL]';
    const SUPABASE_KEY='[내_Publishable_key_또는_anon_public_키]';
    const db=supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
    async function load(){
      const{data}=await db.from('todos').select('*').order('id');
      document.getElementById('list').innerHTML=data.map(r=>'<li>'+r.task+'</li>').join('');
    }
    async function add(){
      const v=document.getElementById('t').value;
      if(!v)return;
      await db.from('todos').insert({task:v});
      document.getElementById('t').value='';
      load();
    }
    load();
  </script>
</body>
</html>
```

키: 2025년 11월 이후 프로젝트 → Publishable key `sb_publishable_...`, 그 이전 → anon public `eyJ...`.
```

`Supabase` `HTML` `복붙` `todo`

### AI에게 코드 수정 부탁하기

```text
나는 Supabase로 todo 앱을 만들고 있어. 테이블 이름은 'todos'이고 열은 id, created_at, task야. 아래 HTML 코드에 [원하는 기능: 완료 체크박스, 삭제 버튼]을 추가해서 전체 코드를 다시 줘. 초보라서 그대로 복붙할 수 있게 한 파일로. [내 todo.html 코드]
```

`Supabase` `코드수정` `기능추가`

### 에러 해결을 AI에게 물어보기

```text
Supabase + 자바스크립트로 todo 앱을 만드는데 목록이 화면에 안 떠. 브라우저 F12 콘솔에 이런 빨간 에러가 떠: [에러 문구]. 초보가 이해할 수 있게 원인과 해결 순서를 알려줘.
```

`Supabase` `에러해결` `디버깅`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! 'todo' 대신 'memo'(한 줄 메모)를 저장하는 앱을 직접 만들어보세요. 표 이름은 `memos`, 열은 `content`(text) 하나로 하고, 위 단계별 따라하기처럼 HTML 화면과 연결해서 메모를 추가·조회해봅니다. 화면에서 넣은 메모가 Table Editor의 표에도 보이고, 표에 직접 넣은 메모가 화면 새로고침 후 목록에 뜨면 성공이에요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 표 이름과 열 이름이 코드 속 이름과 글자 하나까지 똑같은가? | 5 |
| RLS를 껐는지, 공개 키(secret key 아님)만 코드에 넣었는지 확인했는가? | 5 |
| 화면에서 추가 → 표 반영, 표에서 추가 → 화면 반영, 양방향을 모두 테스트했는가? | 5 |

## 관련 개념

- [Supabase](/concepts/supabase/)
- [Backend](/concepts/backend/)
- [Database](/concepts/database/)
- [Api Key](/concepts/api-key/)
- [Publishable Key](/concepts/publishable-key/)
- [Row Level Security](/concepts/row-level-security/)

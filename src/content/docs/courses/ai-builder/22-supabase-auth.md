---
title: "Supabase 회원가입·로그인"
description: "이메일·소셜 로그인을 붙여 사용자 세션을 만들고, 로그인 여부에 따라 화면을 나누는 인증을 구현한다. 서버·비밀번호 암호화·세션 관리를 직접 짜지 않고 Supabase Auth 함수 몇 줄로 끝낸다."
sidebar:
  order: 22
---
_이메일·소셜 로그인을 붙여 사용자 세션을 만들고, 로그인 여부에 따라 화면을 나누는 인증을 구현한다. 서버·비밀번호 암호화·세션 관리를 직접 짜지 않고 Supabase Auth 함수 몇 줄로 끝낸다._

:::note[학습 목표]
- 이메일과 구글 로그인이 되는 앱을 만들고 로그인 여부에 따라 다른 화면을 보여준다
- Supabase 클라이언트를 anon 키로 초기화하고 signUp·signInWithPassword·signInWithOAuth 함수를 붙인다
- getSession과 onAuthStateChange로 세션 유무를 감지해 로그인 화면과 대시보드를 갈라준다
:::

## 핵심 개념

인증(Authentication)은 **"이 사람이 누구인가"를 확인하는 일**이에요. "로그인하세요" 버튼 하나 붙이려고 서버·비밀번호 암호화·세션 관리를 직접 짜다 포기한 적 있나요? **Supabase Auth**는 회원가입·비밀번호 암호화·세션 토큰 발급·구글/카카오 같은 소셜 로그인을 대신 처리해 주는 서비스라, 우리는 `supabase.auth.signUp()` 같은 함수만 호출하면 돼요. 로그인에 성공하면 브라우저에 **세션(session)**이 저장되고, 이 세션이 있으면 "로그인된 사용자", 없으면 "손님"으로 구분해요. 은행 창구에서 신분증을 한 번 보여주면 번호표(세션)를 주고, 그 번호표로 이후 업무를 처리하는 것과 같아요. 우리가 할 일은 **로그인 화면을 붙이고, 세션 유무에 따라 화면을 갈라주는 것**뿐이에요.

### 왜 이게 될까?

Supabase Auth는 이미 수백만 명이 쓰는 로그인 시스템을 통째로 대신 돌려주는 서비스예요. 비밀번호 암호화나 세션 관리 같은 어려운 부분을 직접 짜지 않고, `supabase.auth.signUp()` 같은 함수 호출 한 줄이면 돼요. 은행 창구 직원이 신분 확인과 번호표 발급을 대신 해주는 것과 같은 원리예요.

## 👀 따라하기 예시 — "공부방" 앱에 이메일 회원가입과 구글 로그인

**① Supabase 대시보드에서 Auth 켜기** — Authentication > Providers에서 Email 활성화를 확인하고, Google 토글을 ON. Project URL·anon key 복사.
> 💡 로그인 기능은 스위치를 켜는 것부터 시작 — 코드보다 설정이 먼저예요.

**② 클라이언트 연결 코드를 AI에게 요청**

```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(URL, ANON_KEY)
```

> 💡 이 한 줄만 있으면 앱 어디서든 `supabase.auth.*` 함수를 쓸 수 있어요.

**③ 로그인 함수 호출해보기**

```js
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
if (error) alert(error.message)
```

> 💡 성공하면 세션이 자동 저장돼요. 실패하면 `error.message`로 이유를 바로 알 수 있어요.

**④ 세션 유무로 화면 나누기**

```js
supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
// user ? <Dashboard/> : <LoginForm/>
```

> 💡 번호표(세션)가 있으면 대시보드, 없으면 로그인 화면 — 이 한 줄이 앱의 문지기예요.

좋은 결과의 기준: (1) 로그아웃 후 로그인 화면으로 정확히 돌아간다 (2) Supabase Users 목록에 내 계정이 보인다 (3) anon 키만 코드에 있고 service_role 키는 절대 없다.

## 단계별 따라하기

1. **Supabase 프로젝트에서 Auth 켜기** — supabase.com에서 프로젝트를 연 뒤 Authentication > Providers로. Email 항목이 켜져 있는지 확인하고, Google 토글을 켠다. Project Settings > API에서 **Project URL**과 **anon public 키**를 복사한다.
2. **클라이언트 연결 코드 만들기** — `@supabase/supabase-js`를 설치(`npm install @supabase/supabase-js`)하고, `supabaseClient.js` 파일을 만들어 `createClient`에 URL과 anon 키를 넣는다. 예: `export const supabase = createClient('https://xxxx.supabase.co', 'eyJhbGciOi...')`.
3. **이메일 회원가입·로그인 함수 붙이기** — 입력창 2개(이메일, 비밀번호)와 버튼 2개(가입, 로그인)를 둔다. 가입은 `supabase.auth.signUp({email,password})`, 로그인은 `supabase.auth.signInWithPassword({email,password})`. 에러가 나면 `alert`로 `error.message`를 보여준다.
4. **구글 소셜 로그인 버튼 붙이기** — '구글로 로그인' 버튼을 만들고 클릭 시 `supabase.auth.signInWithOAuth({ provider: 'google' })`. 클릭하면 구글 동의 화면으로 갔다가 앱으로 돌아온다. redirect가 안 되면 Supabase의 URL Configuration에 앱 주소를 등록했는지 확인한다. (`options: { redirectTo: 'http://localhost:5173' }`)
5. **로그인 여부로 화면 나누기** — `supabase.auth.getSession()`으로 현재 세션을 읽고, `onAuthStateChange`로 로그인/로그아웃 변화를 구독한다. 세션이 있으면 대시보드(+로그아웃 버튼), 없으면 로그인 화면. 로그아웃은 `supabase.auth.signOut()`.
6. **새로고침·다른 탭에서 테스트** — 로그인 후 페이지를 새로고침해도 로그인이 유지되는지, 로그아웃 버튼을 누르면 로그인 화면으로 돌아가는지, 새 탭에서도 로그인 상태인지 확인한다. Supabase 대시보드 Authentication > Users에 내 계정이 생겼는지도 확인한다.

## 흔한 실수 → 교정

- ✗ anon 키가 아니라 service_role 키를 코드에 넣음 → **클라이언트(브라우저) 코드에는 반드시 'anon public' 키만.** service_role 키는 모든 보안을 무시하는 마스터 키라 노출되면 데이터 전체가 털린다. Settings > API에서 anon 키를 다시 복사한다.
- ✗ 회원가입 후 로그인이 안 된다며 당황 → **기본 설정에서는 이메일 인증(확인 메일 클릭)이 켜져 있다.** 개발 중에는 Authentication > Providers > Email에서 'Confirm email'을 잠시 끄거나, 받은 확인 메일의 링크를 눌러 인증을 완료한다.
- ✗ getSession으로 한 번만 읽고 로그인 상태가 안 바뀐다고 함 → **`getSession`은 '지금 이 순간'만 읽는다.** 로그인/로그아웃 변화를 실시간 반영하려면 `onAuthStateChange`로 구독해서 세션 변화가 있을 때마다 화면을 다시 그리게 한다.

## 도구

- 🛠 **Supabase** (supabase.com) — 인증·DB·세션 관리 백엔드.
- 🛠 **@supabase/supabase-js** — 자바스크립트 클라이언트 라이브러리.
- 🛠 **Supabase Auth 문서** (supabase.com/docs/guides/auth) — 로그인·소셜·세션 공식 가이드.
- 🛠 **Google Cloud Console** (console.cloud.google.com) — 구글 OAuth 클라이언트 발급.

## 실전 프롬프트

### Supabase 로그인 화면 전체 코드 생성

```text
나는 [React / 순수 HTML+JS] 로 만든 앱에 Supabase Auth를 붙이려고 해. 다음을 포함한 완성 코드를 파일 단위로 줘: 1)supabaseClient 초기화 (URL=[내 Project URL], anon key=[내 anon key]) 2)이메일 회원가입·로그인 폼 3)구글 소셜 로그인 버튼 4)세션 유무에 따라 로그인 화면과 대시보드를 나누는 로직 5)로그아웃 버튼. 초보자가 복붙해서 바로 돌아가게 주석도 한국어로.
```

`Supabase` `인증` `전체코드` `로그인화면`

### 로그인 에러 메시지 해석

```text
Supabase Auth로 로그인하는데 이런 에러가 떠: [에러 메시지]. 이게 무슨 뜻인지, 코드/설정 중 어디를 고쳐야 하는지 초보자도 알게 단계별로 설명해줘. 내 현재 코드는: [코드]
```

`Supabase` `에러해석` `디버깅`

### 구글 OAuth 설정 점검

```text
Supabase에서 구글 로그인을 붙였는데 [증상: redirect가 안 됨 / provider is not enabled 등]. Google Cloud OAuth 클라이언트와 Supabase Authentication 설정에서 확인해야 할 항목들을 체크리스트로 줘. redirect URL은 [내 앱 주소].
```

`Supabase` `구글` `OAuth` `설정점검`

### 로그인한 사용자만 접근 가능한 화면 만들기

```text
Supabase 세션이 있는 사용자만 [페이지 이름] 을 볼 수 있게 하고, 세션이 없으면 로그인 화면으로 보내는 보호 로직을 [React / 순수 JS] 로 만들어줘. getSession과 onAuthStateChange를 사용해줘.
```

`Supabase` `세션` `보호라우트`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! "구글 로그인 버튼"만 따로 떼서, 클릭 시 로딩 스피너를 보여주고 로그인에 성공하면 사용자 이메일을 화면 상단에 띄우는 기능을 직접 만들어보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 버튼 클릭 후 구글 동의 화면으로 실제로 넘어갔나 | 5 |
| 로그인 성공 후 화면 상단에 내 이메일이 정확히 보이나 | 5 |
| redirectTo 주소를 Supabase URL Configuration에 등록했나 | 5 |

## 관련 개념

- [Authentication](/concepts/authentication/)
- [Supabase Auth](/concepts/supabase-auth/)
- [Session](/concepts/session/)
- [Oauth](/concepts/oauth/)
- [Social Login](/concepts/social-login/)

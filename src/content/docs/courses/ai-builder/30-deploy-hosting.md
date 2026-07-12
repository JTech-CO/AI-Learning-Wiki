---
title: "배포·호스팅 관리 — Vercel·Railway로 인터넷에 올리기"
description: "AI가 만들어준 사이트·앱을 GitHub에 올려 Vercel·Railway·Netlify로 '진짜 인터넷 주소'를 발급받고, 도메인·환경변수·로그·자동 재배포를 관리한다. 어떤 도구가 진짜 무료이고 어디서 과금되는지까지 정확히 짚는다."
sidebar:
  order: 30
---
_AI가 만들어준 사이트·앱을 GitHub에 올려 Vercel·Railway·Netlify로 '진짜 인터넷 주소'를 발급받고, 도메인·환경변수·로그·자동 재배포를 관리한다. 어떤 도구가 진짜 무료이고 어디서 과금되는지까지 정확히 짚는다._

:::note[학습 목표]
- 내 코드(또는 AI가 짜준 코드)를 GitHub에 올리고 Vercel로 인터넷 주소(예: my-app.vercel.app)를 발급받아 누구나 접속하게 만든다
- API 키 같은 비밀값을 코드에 노출하지 않고 환경변수로 안전하게 넣고, 코드를 고치면 자동으로 재배포되게 한다
- Vercel·Netlify·Railway 중 어디가 진짜 무료이고 어디서 과금되는지 구분해 알맞은 서비스를 고른다
:::

## 핵심 개념

**'배포(deploy)'**는 내 컴퓨터에만 있던 사이트를 인터넷이라는 공용 건물에 입주시키는 것이에요. 집(내 노트북)에서 혼자 보던 그림을 **'미술관 벽(서버)'**에 걸어 누구나 보게 하는 일이죠. **'호스팅(hosting)'**은 그 미술관 벽을 빌려주는 서비스예요.

- **Vercel·Netlify** — '화면이 보이는 웹사이트'를 거는 미술관 (개인 프로젝트는 무료).
- **Railway** — '계속 돌아가는 프로그램(서버·DB)'을 두는 창고.

단, **무료의 범위가 서로 다릅니다.** Vercel·Netlify의 개인 무료 플랜은 카드 없이 계속 쓸 수 있고, Railway의 Trial(체험) 가입도 카드 없이 시작할 수 있어요. 유료 플랜으로 업그레이드할 때에만 카드 등록이 필요합니다. Railway 가입 후 첫 30일은 $5 체험 크레딧(30일 또는 $5 소진 시 종료), 이후 Free 플랜은 매달 $1어치 크레딧만 줍니다. 사실상 24시간 서버를 유지하려면 Hobby 유료 플랜($5/월)이 필요해요.

코드는 보통 **'GitHub'라는 사물함**에 먼저 보관하고, Vercel이 그 사물함을 보고 알아서 벽에 걸어줍니다. **'환경변수(environment variable)'**는 코드에 직접 적으면 안 되는 비밀번호 쪽지를 따로 봉투에 넣어 미술관에만 건네는 것이고요.

### 흐름

💻 내 코드(노트북 안) → 📦 GitHub(코드 사물함) → 🏛 Vercel / Netlify(자동 배포·무료) → 🌐 인터넷 주소(vercel.app) → ✅ 누구나 접속.

### 왜 이게 될까?

깃허브에 코드를 올려두면, Vercel 같은 서비스는 그 저장소를 계속 지켜보고 있다가 변화가 생기면 자동으로 새 건물(서버)에 옮겨 지어요. **'커밋' 버튼만 누르면** 나머지 빌드·배포·주소 발급은 전부 AI 인프라가 알아서 합니다.

## 👀 따라하기 예시 — AI가 만들어준 포트폴리오 사이트를 인터넷에 올리기

AI가 만들어준 포트폴리오 사이트 폴더(index.html 포함)를 인터넷에 올려볼게요.

**① GitHub에 새 저장소(my-first-site) 만들고 파일 드래그 업로드** → 'Commit changes' 클릭 → 파일 12개 업로드.
> 💡 node_modules는 손으로 빼고 올려야 용량 초과를 막아요 — 드래그 업로드는 .gitignore가 안 먹힌다는 게 '아하 포인트'.

**② Vercel에서 'Continue with GitHub'로 로그인 후 저장소 Import** → 'Import Git Repository' 목록에 my-first-site가 바로 보임 → Import.
> 💡 따로 계정·비번을 안 만들어도 되는 이유는 GitHub 인증을 그대로 빌려 쓰기 때문이에요.

**③ 설정 화면 그대로 두고 검은 'Deploy' 버튼만 클릭** → '🎉 Congratulations! Your project has been deployed.'
> 💡 99%는 기본 설정이 이미 맞기 때문에 손댈 게 없어요 — '한 번 클릭 배포'의 핵심.

**④ 'Visit' 버튼 클릭해서 실제 주소 확인** → https://my-first-site.vercel.app 페이지가 그대로.
> 💡 이 순간부터 카톡 링크 하나로 전 세계 누구나 접속 가능해요.

좋은 결과의 기준: (1) 링크를 다른 기기에서 열어도 똑같이 보인다 (2) 코드를 고치고 커밋하면 1~2분 안에 자동으로 새 버전이 반영된다 (3) API 키 같은 비밀값은 코드에 안 보이고 환경변수에만 있다.

## 단계별 따라하기

1. **올릴 코드 준비 + GitHub 계정 만들기** — 인터넷에 올릴 폴더에 index.html이 있거나(또는 Next.js·React 프로젝트면 package.json). github.com → 'Sign up' → 이메일·비밀번호·아이디(영문) → 인증번호. 가입 무료. (AI에게 'README.md와 .gitignore 파일을 만들어줘. node_modules 폴더는 .gitignore에 넣어줘.'로 준비하면 깔끔.)
2. **코드를 GitHub에 업로드(가장 쉬운 방법)** — github.com에서 '+' → 'New repository' → 영문 이름(예: my-first-site) → 'Public' → 'Create repository'. 다음 화면에서 'uploading an existing file' 링크 → 내 폴더 안 파일들을 드래그 → 'Commit changes'. ⚠️ 중요: 이 드래그 업로드 방식에서는 .gitignore가 작동하지 않음(.gitignore는 git 명령어 CLI로 올릴 때만 자동 제외). 드래그할 때 node_modules 폴더는 내가 직접 빼고, .env 같은 비밀키 파일도 올리지 말 것.
3. **Vercel 가입 + GitHub 연결** — vercel.com → 'Sign Up' → 'Continue with GitHub' → 'Authorize Vercel'. 'Hobby'(개인·무료) 플랜(카드 등록 불필요·계속 무료. 상업용은 규정상 Pro 유료). 'Import Git Repository' 목록에 my-first-site가 보이면 연결 성공.
4. **한 번 클릭으로 배포하기** — 'Add New...' → 'Project' → 저장소 옆 'Import'. 설정 화면은 99%는 손댈 것 없이 'Deploy' 검은 버튼만. '🎉 Congratulations'가 뜨면 성공. 'Visit' 버튼으로 진짜 인터넷 주소(예: https://my-first-site.vercel.app).
5. **(대안) HTML·CSS만 있는 정적 사이트면 Netlify 드래그 한 방** — app.netlify.com 가입(무료 Free 플랜, 카드 불필요) → 'Sites' 탭 점선 네모 안에 내 사이트 폴더를 통째로 드래그&드롭 → 몇 초 만에 주소. GitHub 연결 자동 재배포는 'Add new site → Import an existing project → GitHub'. ※ Netlify는 2025년 9월부터 크레딧 기반 요금제로 전환, 구 'Starter' 플랜명 폐지. 현재 무료 플랜은 'Free', 월 300크레딧 한도(프로덕션 배포 1회=15크레딧). 한도 초과 시 추가 과금 없이 그달 배포만 제한(다음 달 초기화).
6. **비밀키(API 키)를 안전하게 넣기 — 환경변수** — 키를 코드에 직접 쓰면 GitHub에서 남이 훔쳐 씀. Vercel 프로젝트 → 'Settings' 탭 → 'Environment Variables' → Key(예: OPENAI_API_KEY), Value(진짜 키) → 'Save'. 그 다음 'Deployments' 탭 → '...' → 'Redeploy'로 다시 배포해야 키가 적용. (Netlify는 Site configuration → Environment variables, Railway는 Variables 탭.) 코드 안에서는 `process.env.OPENAI_API_KEY`처럼 '이름'으로만.
7. **계속 돌아가는 서버·DB가 필요하면 Railway(요금 주의)** — railway.com → 'Login with GitHub'. Trial(체험) 가입에는 신용카드 불필요. 첫 30일 $5 체험 크레딧(30일 또는 $5 소진 시 종료), 카드는 유료 플랜 업그레이드 시에만. 이후 Free 플랜은 매달 $1어치 크레딧뿐이라 24시간 서버는 며칠이면 소진. 계속 켜두려면 Hobby 유료 플랜($5/월 구독료 + $5 사용 크레딧). 'New Project' → 'Deploy from GitHub repo' → 저장소 선택. 환경변수는 'Variables' 탭. Railway는 'Settings → Networking → Generate Domain'을 눌러야 인터넷 주소(예: my-bot.up.railway.app)가 생김. 연습만 할 거라면 $5 체험 크레딧 끝나기 전에 프로젝트 삭제. 카드 미보유 시 대안: 항상 켜둘 필요 없는 API 서버는 Vercel의 Serverless Functions(카드 불필요·무료).
8. **코드 고치고 자동 재배포 + 로그로 문제 찾기** — GitHub에서 파일을 수정(연필 편집 후 Commit)하면 Vercel(또는 연결된 Netlify)이 1~2분 안에 새 버전을 다시 올림. 에러가 나면 Vercel 'Deployments' 탭에서 빨간 'Error' 배포 클릭 → 'Build Logs' 또는 'Runtime Logs'에서 빨간 글씨 → 그대로 복사해 AI에게 '이 에러 어떻게 고쳐?'. 흔한 'Module not found' → 필요한 부품(라이브러리)을 안 적은 것.

## 흔한 실수 → 교정

- ✗ API 키를 코드 파일에 그대로 적고 GitHub에 올림 → **절대 금지.** 코드에는 이름(`process.env.MY_KEY`)만 쓰고, 진짜 값은 Vercel·Netlify·Railway의 Environment Variables에만. 이미 올렸다면 그 키는 폐기하고 새로 발급.
- ✗ node_modules 폴더까지 GitHub에 통째로 업로드해 용량 초과·실패 → git 명령어로 올릴 때는 .gitignore 파일에 'node_modules'를 적어 제외. 단, **GitHub 웹사이트 드래그 업로드에서는 .gitignore가 작동하지 않으므로** 드래그할 때 손으로 빼고. 이 폴더는 Vercel이 알아서 다시 설치.
- ✗ 환경변수를 넣고도 사이트에 반영 안 돼 당황 → 환경변수는 추가 후 **'Redeploy(재배포)'를 해야 적용.** Vercel은 Deployments 탭 → '...' → Redeploy.
- ✗ Railway가 '카드 없이 무료로 쓸 수 있는 서비스'인 줄 알고 가입을 시도 → Railway Trial(체험) 가입에는 신용카드 불필요. 카드 없이 무료로 시작할 수 있으며, 유료 플랜(Hobby 등) 업그레이드 시에만 카드 등록 필요. 또한 **영구 무료가 아니며,** $5 체험 크레딧(30일) 이후 Free 플랜은 월 $1 크레딧뿐. 과금이 부담되면 Vercel Serverless Functions(무료)로 대체.
- ✗ Railway에 올렸는데 주소로 접속이 안 됨 → Railway는 자동으로 외부 주소를 안 만듦. **Settings → Networking → 'Generate Domain'**을 직접 눌러 인터넷 주소를 만듦.

## 도구

- 🛠 **GitHub** — 코드를 보관하는 무료 사물함(저장소).
- 🛠 **Vercel** — 앱을 한 번 클릭으로 인터넷에 올리는 호스팅(개인 Hobby 플랜 무료·카드 불필요, 상업용은 Pro $20/월).
- 🛠 **Netlify** — 정적 사이트용 Vercel 대안, 드래그&드롭 또는 GitHub 연결(무료 Free 플랜·월 300크레딧 한도·카드 불필요, 2025년 9월 크레딧 요금제 전환, 프로덕션 배포 1회=15크레딧, 한도 초과 시 추가 과금 없이 배포만 제한).
- 🛠 **Railway** — 24시간 도는 서버·DB용, Trial 가입 카드 불필요·유료 업그레이드 시에만 카드, 첫 30일 $5 체험 크레딧 후 Free는 월 $1 크레딧뿐이라 사실상 Hobby $5/월 필요, 영구 무료 아님.

## 실전 프롬프트

### 배포 준비 정리시키기

```text
내 프로젝트 폴더를 Vercel에 배포하려고 해. 지금 폴더 구조는 [파일 목록]이야. 1)Vercel 배포에 필요 없는 파일·폴더를 .gitignore에 넣어줘. 2)GitHub 웹사이트에 드래그&드롭으로 올릴 거라면, 드래그할 때 손으로 빼야 하는 폴더·파일이 뭔지 콕 짚어줘. 3)빠진 설정 파일(package.json 등)이 있으면 만들어줘. 4)비밀키로 빼야 할 부분이 있으면 환경변수로. 초보자도 따라 하게 단계별로.
```

`배포` `준비` `gitignore`

### 배포 에러 해결

```text
Vercel(또는 Netlify·Railway)에서 배포가 실패했어. Build Log에 나온 에러 메시지는: [로그 빨간 글씨 그대로]. 이 에러가 왜 났는지 초등학생도 알 만큼 쉽게 설명하고, 정확히 어느 파일의 어느 줄을 어떻게 고쳐야 하는지 복붙할 코드로 알려줘.
```

`배포` `에러` `로그`

### 환경변수 목록 뽑기

```text
다음은 내 코드야: [코드]. 이 코드에서 외부에 노출되면 안 되는 비밀값(API 키, 비밀번호, DB 주소 등)을 전부 찾아서, Vercel Environment Variables에 넣을 'Key 이름 = 설명' 표로 만들어줘. 그리고 코드에서 그 값을 환경변수로 불러오게 수정한 버전도.
```

`환경변수` `보안` `API키`

### Vercel vs Netlify vs Railway 어디에 올릴지 판단

```text
내가 만든 건 [무엇인지 한 줄로: AI 챗봇 웹사이트 / HTML만 있는 정적 포트폴리오 / 24시간 도는 텔레그램 봇 / DB가 필요한 가계부 앱]야. Vercel·Netlify·Railway 중 어디에 올리는 게 맞는지 이유와 함께 추천하고, 각 서비스가 진짜 무료인지(개인용 무료냐, Railway처럼 체험 크레딧만이냐)도 알려줘. 추천한 서비스의 배포 순서를 1~5단계로.
```

`배포` `도구선택` `무료플랜`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! 자기소개 한 페이지짜리 index.html을 직접(또는 AI에게) 만들어 GitHub에 올리고, Vercel로 배포해 실제 링크를 받아보세요. 그다음 한 줄만 문구를 고쳐서 커밋하고, 자동 재배포가 되는지 확인해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 내 링크를 다른 사람 폰에서 열어도 똑같이 보이는가 | 5 |
| node_modules 같은 불필요한 폴더 없이 깔끔하게 올렸는가 | 5 |
| 코드 수정 후 별도 클릭 없이 자동으로 재배포되었는가 | 5 |

## 관련 개념

- [Deployment](/concepts/deployment/)
- [Hosting](/concepts/hosting/)
- [Vercel](/concepts/vercel/)
- [Netlify](/concepts/netlify/)
- [Railway](/concepts/railway/)
- [Environment Variable](/concepts/environment-variable/)
- [Github](/concepts/github/)
- [Continuous Deployment](/concepts/continuous-deployment/)

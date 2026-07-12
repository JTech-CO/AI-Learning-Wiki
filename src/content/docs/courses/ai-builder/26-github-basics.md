---
title: "GitHub 실전 — 저장·버전·협업"
description: "GitHub를 '인터넷에 자동 백업되는 작업 서랍'으로 익혀, 브라우저만으로 저장소를 만들고 커밋·브랜치·PR·이슈까지 혼자 끝낸다. 노트북 고장 하나로 코드·문서·AI 결과물을 통째로 잃는 일을 없앤다."
sidebar:
  order: 26
---
_GitHub를 '인터넷에 자동 백업되는 작업 서랍'으로 익혀, 브라우저만으로 저장소를 만들고 커밋·브랜치·PR·이슈까지 혼자 끝낸다. 노트북 고장 하나로 코드·문서·AI 결과물을 통째로 잃는 일을 없앤다._

:::note[학습 목표]
- GitHub 계정과 내 저장소(레포)를 만들고 파일을 올려 커밋(세이브)한다
- 실험용 브랜치를 만들어 main을 안전하게 둔 채 실험하고, PR로 변경을 합친다
- 이슈로 할 일을 적고, 좋은 커밋 메시지·PR·README를 쓴다
:::

## 핵심 개념

GitHub는 **코드와 파일을 인터넷에 저장하고, 누가 언제 뭘 바꿨는지 다 기록해주는 창고**예요. 게임의 '세이브 슬롯'과 똑같아요. **저장(커밋)할 때마다 그 순간이 통째로 보관돼서** 나중에 망쳐도 옛날 슬롯으로 돌아갈 수 있어요. 용어는 딱 넷만 기억하면 돼요 — **저장소(레포)**는 프로젝트 하나가 들어가는 폴더, **커밋**은 '지금 상태를 세이브', **브랜치**는 '본편을 안 건드리고 따로 실험하는 복사본 세계', **PR(풀 리퀘스트)**은 '내 실험 결과를 본편에 합쳐도 될까요?' 하는 합치기 요청서. 혼자 써도 백업 도구로 최고고, 여럿이 쓰면 서로 안 부딪히며 같이 일하는 협업 도구가 돼요.

### 기본 흐름

📁 저장소 만들기(프로젝트 폴더) → ⬆️ 파일 올리기(업로드) → 💾 커밋(세이브, 변경 기록) → 🌿 브랜치(실험용 복사본) → 🔀 PR로 합치기(합치기 요청).

### 왜 이게 될까?

커밋할 때마다 GitHub는 그 순간의 파일 전체를 사진 찍듯 통째로 저장해요. 그래서 브랜치로 딴 세상을 만들어 마음껏 실험해도 main은 늘 그대로고, 망치면 그냥 그 브랜치만 버리면 돼요. '고치기'만 내가 하면 '기록하고 되돌리기'는 GitHub가 대신 해줘요.

## 👀 따라하기 예시 — 개인 블로그 소개 페이지(README.md)를 처음 올리고 문구 바꿔보기

**① 저장소 만들기** `my-first-repo`를 만들고 'Add a README file'을 체크한 뒤 Create repository → 파일 목록 화면에 README.md 1개, 커밋 기록 'Initial commit' 1개 자동 생성.
> 💡 빈 저장소로 시작하면 뭘 눌러야 할지 막막해지니 처음부터 파일 1개를 깔고 시작해요.

**② 커밋(세이브)** README.md 연필 아이콘 클릭 → '안녕하세요, 제 첫 블로그입니다' 한 줄 추가 → 커밋 메시지 '소개 문구 추가' → Commit changes → Commits 탭에 'Initial commit' 아래로 '소개 문구 추가' 커밋이 새로 생김(세이브 슬롯 2개째).
> 💡 저장(커밋)마다 그 순간이 통째로 보관되니 나중에 문구를 또 망쳐도 이 슬롯으로 돌아올 수 있어요.

**③ 브랜치** 🌿main 버튼 클릭 → 'test-tone' 입력 → Create branch: test-tone from main → 브랜치 선택 드롭다운에 main, test-tone 두 개가 뜨고 지금은 test-tone.
> 💡 본편을 안 건드리는 복사본 세계 — 여기서 뭘 바꿔도 main은 100% 안전해요.

**④ PR로 합치기** test-tone에서 README.md를 새 문구로 바꿔 커밋 → Pull requests 탭 → New pull request → base: main ← compare: test-tone → Create pull request → Merge pull request → Confirm merge → main의 README.md가 새 문구로 바뀌고 'Merged' 표시.
> 💡 실험이 마음에 들면 '합쳐도 될까요?' 요청서 한 번으로 본편에 정식 반영돼요.

좋은 결과의 기준: (1) main이 한 번도 직접 망가진 적 없이 항상 정상 상태였는가 (2) 커밋 메시지만 읽어도 뭘 바꿨는지 알 수 있는가 (3) 브랜치→PR→머지 흐름을 한 번이라도 스스로 완주했는가.

## 단계별 따라하기

1. **GitHub 계정 만들기** — github.com → 'Sign up' → 이메일 → 비밀번호 → 사용자 이름(영어, 띄어쓰기 X. 예: minsu-kim). 가입 메일이 오면 숫자 코드를 입력해 인증. 사용자 이름이 '이미 사용 중'이면 뒤에 숫자를 붙인다. 무료 플랜으로 충분.
2. **새 저장소(레포) 만들기** — 초록색 'New' 버튼(또는 + → New repository) → 'Repository name'을 영어로(예: my-first-repo) → 'Public'(누구나 봄)과 'Private'(나만 봄) 중 연습은 Private 추천 → 'Add a README file' 체크박스를 꼭 켜기(빈 저장소 피하려고) → 'Create repository'. 이름에 한글·띄어쓰기를 넣으면 자동으로 `-`로 바뀌니 처음부터 영어-소문자로.
3. **파일 올리기(업로드)** — 'Add file' → 'Upload files' → 내 컴퓨터의 파일을 점선 박스 안으로 드래그하거나 'choose your files' → 아래로 내려 'Commit changes' 박스에 '첫 파일 업로드'처럼 적고 'Commit changes'. 파일이 너무 크면(100MB 초과) 거부되니 작은 파일로.
4. **파일 고치고 커밋(세이브)하기** — README.md 클릭 → 연필 아이콘(✏️ 'Edit this file') → 아무 줄이나 추가 → 'Commit changes...' → 메시지 적기 → 'Commit changes'. 이 한 번이 '세이브 슬롯 1개'. 'Commits'(시계 아이콘)로 세이브 기록 확인.
5. **브랜치(실험용 복사본) 만들기** — 파일 목록 화면 왼쪽 위 'main'이라 적힌 가지 모양 버튼(🌿) → 새 가지 이름(예: test-idea) → 'Create branch: test-idea from main'. 본편(main)을 건드리지 않은 복사본 세계라, 여기서 4번처럼 파일을 마음껏 고쳐도 main은 안전.
6. **PR(합치기 요청) 만들고 합치기** — test-idea 브랜치에서 파일을 한 번 고쳐 커밋 → 'Pull requests' 탭 → 'New pull request' → 'base: main' ← 'compare: test-idea' 확인 → 'Create pull request' → 제목·설명 적고 다시 'Create pull request' → 혼자라면 'Merge pull request' → 'Confirm merge'. 'compare'에 test-idea가 안 보이면 그 브랜치에서 커밋을 1번 이상 했는지 확인.
7. **이슈(할 일·메모) 적기** — 'Issues' 탭 → 'New issue' → 제목에 할 일(예: '대문 사진 추가하기'), 설명칸에 자세히 → 'Submit new issue'. 이슈는 '이 프로젝트에서 해야 할 일·고칠 점' 메모판이고, 다 하면 'Close issue'로 닫는다. 혼자 써도 to-do 리스트로 유용.

## 흔한 실수 → 교정

- ✗ 저장소를 만들 때 README 체크를 안 해 텅 빈 화면이 나오고 뭘 눌러야 할지 막막 → **'Add a README file'를 꼭 켠다.** 이미 비었다면 'Add file' → 'Create new file'로 README.md를 직접 만든다.
- ✗ 본편(main)에서 바로 막 고치다가 망침 → **큰 변경은 항상 새 브랜치를 만들어 거기서.** 잘되면 PR로 합치고, 망치면 그 브랜치만 버리면 main은 멀쩡.
- ✗ 커밋 메시지에 'ㅁㄴㅇㄹ', 'asdf', 'update'만 적어 나중에 무슨 변경인지 못 알아봄 → **'무엇을 + 어떻게 바꿨다'를 한 줄로.** 예: 'README에 설치법 추가'.
- ✗ 비밀번호·API 키 같은 민감 정보를 파일에 그대로 올림(특히 Public 저장소) → **키·비밀번호는 절대 올리지 말 것.** 실수로 올렸다면 그 키를 즉시 폐기(재발급)하고, 파일에서 지운 뒤 새로 커밋.

## 도구

- 🛠 **GitHub** (github.com) — 코드·파일을 인터넷에 저장하고 변경 이력·협업을 관리하는 창고.
- 🛠 **ChatGPT / Claude** — README나 커밋 메시지 문구를 대신 깔끔하게 써주는 글쓰기 도우미.

## 실전 프롬프트

### 좋은 커밋 메시지 양식(한 줄)

```text
[무엇을] [어떻게 바꿈]
예: 'README에 [프로젝트 소개] 추가' / '[로그인 버튼] 색 [파란색]으로 변경'
```

`GitHub` `커밋` `커밋 메시지`

### PR 설명 양식(복붙)

```text
## 무엇을 바꿨나
- [바꾼 내용 1]
- [바꾼 내용 2]

## 왜 바꿨나
- [이유]

## 확인할 점
- [ ] [확인 항목]
```

`GitHub` `PR` `풀 리퀘스트`

### 이슈(할 일) 양식(복붙)

```text
## 하고 싶은 것
[원하는 결과 한 줄]

## 해야 할 일
- [ ] [작은 단계 1]
- [ ] [작은 단계 2]

## 참고
[관련 링크나 메모]
```

`GitHub` `이슈` `할 일`

### AI에게 README 대신 써달라고 시키기

```text
내 GitHub 프로젝트의 README를 마크다운으로 써줘. 프로젝트 이름: [이름]. 무엇을 하는 프로젝트인지: [한 줄 설명]. 사용법: [어떻게 쓰는지]. 초보자도 알아보게 제목·목록·코드블록을 써서 짧게.
```

`GitHub` `README` `AI 글쓰기`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! my-first-repo(또는 새 저장소)에서 다음을 직접 해보세요: (1) README.md에 좋아하는 것 3가지를 목록으로 추가해 커밋 (2) 'add-hobby'라는 브랜치를 새로 만들어 그 안에서 취미 하나를 더 추가한 뒤 커밋 (3) PR을 만들어 main에 머지 (4) '사진 추가하기'라는 이슈를 하나 등록.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 커밋 메시지만 보고도 내가 뭘 바꿨는지 한눈에 알 수 있나 | 5 |
| add-hobby 브랜치에서 작업하는 동안 main의 내용은 그대로였나 | 5 |
| PR을 머지한 뒤 main에 들어가서 취미 목록이 실제로 반영됐는지 직접 확인했나 | 5 |

## 관련 개념

- [Github](/concepts/github/)
- [Repository](/concepts/repository/)
- [Commit](/concepts/commit/)
- [Branch](/concepts/branch/)
- [Pull Request](/concepts/pull-request/)
- [Issue](/concepts/issue/)
- [Version Control](/concepts/version-control/)

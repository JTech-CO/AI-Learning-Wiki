---
title: "파일 업로드·저장"
description: "Supabase Storage 버킷에 이미지·파일을 올리고 공개(Public)/비공개(Private) 접근을 설정해, 공개 URL이나 서명된 임시 URL로 앱에서 불러오는 법을 실습한다."
sidebar:
  order: 24
---
_Supabase Storage 버킷에 이미지·파일을 올리고 공개(Public)/비공개(Private) 접근을 설정해, 공개 URL이나 서명된 임시 URL로 앱에서 불러오는 법을 실습한다._

:::note[학습 목표]
- Supabase Storage에 이미지를 업로드하고 공개 URL로 웹페이지에 띄운다
- 비공개 파일을 서명된 임시 URL로 로그인한 사용자에게만 보여준다
- Public/Private 버킷과 RLS 정책으로 누가 파일에 접근할지 제어한다
:::

## 핵심 개념

Storage는 이미지·PDF·동영상 같은 **'파일'을 담는 창고**예요. 데이터베이스(표)에는 파일 자체가 아니라 **'파일이 어디 있는지 주소(경로)'만** 저장하고, 실제 파일은 Storage **버킷(bucket)** 이라는 폴더에 넣습니다. 버킷은 두 종류예요. **Public 버킷**은 주소만 알면 누구나 열 수 있어 프로필 사진·상품 이미지에 쓰고, **Private 버킷**은 서명된 임시 URL이나 로그인한 사용자만 접근할 수 있어 계약서·개인 문서에 씁니다. 스마트폰 사진첩에 비유하면 **공유앨범 링크(Public)** 와 **나만 보는 잠긴 앨범(Private)** 의 차이예요.

### 왜 이게 될까?

Supabase Storage는 파일을 통째로 인터넷에 열어놓은 창고칸이에요. 버킷마다 문에 **자물쇠 규칙(RLS 정책)** 을 걸어두면, AI에게 규칙만 말해줘도 "누가 열 수 있는지"는 창고가 알아서 지킵니다. 그래서 당신은 "어떤 파일을 누구에게 보여줄지"만 정하면 되고, 실제 차단·허용은 AI가 짜준 정책이 해줘요.

## 👀 따라하기 예시 — 동아리 회원 프로필 사진을 avatars 버킷에 올리고, 본인만 자기 사진을 바꾸기

**① 버킷부터 만들고 AI에게 상황 설명하기** — "avatars라는 Public 버킷을 만들었고, 로그인한 사용자가 자기 폴더에만 업로드하게 하고 싶어"
> 💡 버킷 이름과 공개 여부를 먼저 정해야 AI가 정확한 정책을 짜줘요.

**② AI가 준 업로드 정책 SQL 그대로 붙여넣기**

```sql
CREATE POLICY "user uploads own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```
> 💡 "내 id 폴더"라는 조건 하나로 남의 폴더에 업로드하는 걸 막아요.

**③ 코드로 업로드 요청 보내기**

```js
const path = `${user.id}/${Date.now()}_profile.png`;
const { data, error } = await supabase.storage.from('avatars').upload(path, file);
```
> 💡 파일명 앞에 내 id를 붙이면 정책의 "내 폴더" 조건과 정확히 맞아떨어져요.

**④ 업로드된 파일의 공개 URL 뽑아 화면에 띄우기**

```js
const { data } = supabase.storage.from('avatars').getPublicUrl(path);
// → https://.../storage/v1/object/public/avatars/.../profile.png
```
> 💡 Public 버킷은 이 주소 하나만 있으면 누구든 이미지를 볼 수 있어 `<img>` 태그에 바로 넣어요.

좋은 결과의 기준: (1) 남의 폴더에는 업로드가 401로 막힌다 (2) 올린 사진이 새로고침 후에도 그대로 보인다 (3) URL을 남에게 공유해도 사진이 열린다(Public 의도대로).

## 단계별 따라하기

1. **버킷 만들기** — Supabase 대시보드 왼쪽 메뉴에서 Storage를 클릭하고 'New bucket' 버튼. 이름을 정하고, 프로필 사진처럼 공개할 파일이면 'Public bucket' 토글을 켠다. 계약서 같은 비공개 파일이면 토글을 끈다. (버킷 이름: avatars, Public bucket = ON)
2. **파일 직접 올려보기** — 방금 만든 avatars 버킷을 클릭한 뒤 'Upload file' 버튼으로 내 컴퓨터의 이미지 하나를 끌어다 놓는다. 올라간 파일을 클릭하면 오른쪽에 미리보기와 함께 'Copy URL' 버튼. (cat.png 업로드 → Copy URL → https://.../public/avatars/cat.png)
3. **공개 URL을 웹페이지에 띄우기** — 복사한 URL을 그대로 `<img>` 태그에 붙여 브라우저에서 열어본다. 코드가 막히면 AI에게 붙여넣어 HTML을 받는다. (`<img src="https://.../public/avatars/cat.png" width="200" />`)
4. **코드로 업로드하기** — 앱에서 사용자가 파일을 고르면 `supabase.storage.from('버킷').upload('경로', file)`로 올린다. 파일명 충돌을 막으려면 앞에 시간값이나 사용자 id를 붙인다. (경로를 `${user.id}/${Date.now()}_${file.name}` 형태로 만들어 `upload(path, file)` 호출)
5. **올린 파일 불러와 화면에 쓰기** — Public 버킷이면 `getPublicUrl('경로')`로 주소를 얻어 img src에 넣는다. Private 버킷이면 `createSignedUrl('경로', 60)`로 60초짜리 임시 링크를 만든다. (`const { data } = supabase.storage.from('avatars').getPublicUrl(path); img.src = data.publicUrl`)
6. **접근 규칙(RLS) 점검하기** — Storage > Policies에서 누가 업로드/조회할 수 있는지 정책을 확인한다. 기본은 막혀 있어 업로드가 401로 실패할 수 있으니 '로그인 사용자는 자기 폴더에만 업로드' 같은 정책을 AI에게 SQL로 받아 추가한다. (`bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text`)

## 흔한 실수 → 교정

- ✗ 파일을 데이터베이스 테이블 컬럼에 직접(base64 등으로) 저장해 DB가 무거워지고 느려짐 → **파일 실체는 Storage에 올리고, 테이블에는 경로(path)나 URL 문자열만 저장한다.**
- ✗ 업로드가 계속 401/403으로 실패하는데 코드만 붙잡고 있음 → **대부분 코드가 아니라 Storage Policies(RLS)가 막은 것.** Storage > Policies에서 업로드 허용 정책을 먼저 추가한다.
- ✗ 모든 파일을 Public 버킷에 넣어 계약서·개인정보가 URL만 알면 노출됨 → **공개해도 되는 것만 Public, 민감한 파일은 Private 버킷 + createSignedUrl(만료시간)으로 임시 접근.**

## 도구

- 🛠 **Supabase** (supabase.com) — Storage 버킷·업로드·정책 관리 대시보드.
- 🛠 **Supabase Storage 문서** (supabase.com/docs/guides/storage) — upload/getPublicUrl/createSignedUrl 사용법.
- 🛠 **ChatGPT / Claude** (claude.ai) — 업로드 코드·RLS SQL·에러 진단 생성.
- 🛠 **Squoosh** (squoosh.app) — 업로드 전 이미지 용량 줄이기.

## 실전 프롬프트

### 업로드+표시 코드 통째로 받기

```text
나는 Supabase Storage를 처음 써. [avatars]라는 [Public] 버킷에 사용자가 고른 이미지를 업로드하고, 업로드가 끝나면 그 이미지를 화면에 바로 보여주는 코드를 [React / 순수 자바스크립트] 기준으로 만들어줘. 파일명 충돌을 막는 방법과 각 줄 주석도 함께.
```

> 확인된 작성 예시 없음

`Storage` `업로드` `코드`

### Storage 접근 정책(RLS) SQL 받기

```text
Supabase Storage의 [avatars] 버킷에 대해 다음 규칙의 RLS 정책 SQL을 만들어줘: 1) 로그인한 사용자는 자기 user id 폴더 안에만 업로드 가능 2) 조회는 누구나 가능(공개). storage.foldername 함수를 사용하고, 대시보드 SQL Editor에 붙여넣을 수 있게 완성된 SQL로.
```

> 확인된 작성 예시 없음

`Storage` `RLS` `SQL`

### 비공개 파일 서명 URL 만들기

```text
Supabase의 [contracts]라는 Private 버킷에 있는 [user123/계약서.pdf] 파일을, 로그인한 본인에게만 [60]초 동안 열 수 있는 임시 링크(signed URL)로 보여주는 코드를 만들어줘. 만료됐을 때의 처리도 함께.
```

> 확인된 작성 예시 없음

`Storage` `서명 URL` `Private`

### 업로드 오류 진단

```text
Supabase Storage에 파일을 업로드하는데 [에러 메시지] 오류가 나. 버킷 이름은 [avatars], Public 여부는 [ON/OFF], 로그인 상태는 [로그인함/익명]이야. 원인 후보와 확인 순서를 알려줘.
```

> 확인된 작성 예시 없음

`Storage` `오류` `디버깅`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! "비공개 계약서 PDF"를 다루는 documents 버킷을 만들어보세요. Private로 만들고, 본인 것만 60초짜리 임시 링크(signed URL)로 열어보게 AI에게 요청해 코드를 받아 실행해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 내 계약서 URL을 다른 계정으로 열면 막히나요? | 5 |
| 60초가 지난 서명 URL을 다시 열면 정말 열리지 않나요? | 5 |
| 테이블에는 파일 자체가 아니라 경로 문자열만 저장했나요? | 5 |

## 관련 개념

- [Storage](/concepts/storage/)
- [File Upload](/concepts/file-upload/)
- [Bucket](/concepts/bucket/)
- [Public Private](/concepts/public-private/)
- [Signed Url](/concepts/signed-url/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-builder) · 방식: authenticated-crawl</sub>
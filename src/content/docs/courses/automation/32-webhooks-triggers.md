---
title: "웹훅 — 이벤트 기반 자동화"
description: "폴링 대신 이벤트가 오면 즉시 실행되는 웹훅 트리거 설계."
sidebar:
  order: 32
---
_폴링 대신 이벤트가 오면 즉시 실행되는 웹훅 트리거 설계._

:::note[학습 목표]
- 이 레슨이 끝나면, 새 구글폼 응답이 들어오는 즉시(폴링 없이) 슬랙/디스코드로 알림이 날아가는 웹훅 자동화를 직접 만들 수 있습니다.
:::

> "5분마다 확인해줘"라고 로봇에게 시키면 하루 288번 헛수고를 시킵니다. 웹훅은 "일 생기면 나한테 톡 해"라고 바꾸는 스위치입니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 새 구글폼 응답이 들어오는 즉시(폴링 없이) 슬랙/디스코드로 알림이 날아가는 웹훅 자동화를 직접 만들 수 있습니다.

## 핵심 개념

폴링(polling)은 내가 계속 "새 거 있어? 새 거 있어?"라고 물어보는 방식이고, 웹훅(webhook)은 상대방이 "새 거 생겼어!"라고 먼저 알려주는 방식입니다. 웹훅의 핵심은 '내가 만든 URL(수신함 주소)'을 이벤트를 발생시키는 서비스에 등록해두는 것입니다. 그러면 그 서비스는 이벤트가 생길 때마다 그 URL로 데이터(JSON)를 담은 HTTP POST 요청을 쏴줍니다. 택배로 비유하면, 폴링은 매시간 우체국에 전화해 "제 택배 왔나요?"라고 묻는 것이고, 웹훅은 택배가 도착하면 기사님이 우리집 초인종을 눌러주는 것입니다. 그래서 웹훅은 지연이 거의 없고, 서버 자원도 훨씬 덜 씁니다.

### 왜 작동하는가

웹훅이 되는 이유는 간단해요. 이벤트를 만드는 서비스(구글폼) 쪽에서 '이 URL로 알려줘'라는 약속(트리거)을 미리 걸어두기 때문이에요. 그래서 당신이 할 일은 수신함 주소(URL)를 만들고 등록하는 것 뿐, '언제 새 응답이 왔는지 확인하는 일'은 서비스가 알아서 대신 해줍니다.

## 👀 따라하기 예시

동아리 신청 구글폼을 만들었고, 새 신청이 들어올 때마다 디스코드 채널로 바로 알림이 뜨게 하고 싶은 상황이에요. 제가 먼저 처음부터 끝까지 해볼게요, 눈으로 따라오세요.

### 1. ① webhook.site 접속해서 테스트용 수신 URL 확보

**실제 결과**

```text
https://webhook.site/8a1f-...(나만의 고유 주소 자동 생성)
```

> 목적지 없이 코드부터 짜면 어디로 보낼지 몰라 막혀요. 수신함부터 만드는 게 순서예요.

### 2. ② 구글폼 → 확장 프로그램 → Apps Script에서 onFormSubmit 코드 작성

**실제 결과**

```text
function onFormSubmit(e){ UrlFetchApp.fetch('https://webhook.site/8a1f...', {method:'post', contentType:'application/json', payload: JSON.stringify(e.namedValues)}); }
```

> e.namedValues에 방금 제출된 답변이 통째로 들어있어서, 이걸 그대로 JSON으로 포장해 보내면 끝이에요.

### 3. ③ 트리거(시계 아이콘) 메뉴에서 '양식 제출 시'로 저장

**실제 결과**

```text
트리거 1개 등록됨: onFormSubmit / 양식에서 / 양식 제출 시
```

> 코드만 있고 트리거를 안 걸면 아무 일도 안 일어나요. 이 한 번의 저장이 스위치를 켜는 순간이에요.

### 4. ④ 진짜 폼에 테스트 응답 제출 → webhook.site 새로고침 없이 확인

**실제 결과**

```text
{ "이름":["홍길동"], "연락처":["010-1234"] } 가 즉시 도착
```

> 실제로 도착하는 걸 눈으로 봐야 '살아있는' 자동화라고 확신할 수 있어요. 이게 바로 아하 모먼트예요.

### 5. ⑤ 테스트 URL을 디스코드 웹후크 URL로 교체

**실제 결과**

```text
payload: JSON.stringify({content:'새 신청: '+e.namedValues['이름']})
```

> 테스트가 통과된 코드는 URL 한 줄만 바꾸면 그대로 실전에 쓸 수 있어요.

### 완성 결과

완성물은 '구글폼 제출 → 디스코드 채널 즉시 알림' 자동화예요. 좋은 결과의 기준은: (1) 폼 제출 후 몇 초 안에 알림이 뜬다, (2) 알림 내용에 실제 응답값(이름 등)이 정확히 들어있다, (3) 실패해도 조용히 사라지지 않고 나에게 알려준다(try/catch).

## 단계별 따라하기

### 1단계 — 웹훅 수신 URL 1개 만들기 (5분)

webhook.site에 접속하면 아무것도 안 해도 나만의 고유 URL이 자동으로 하나 생깁니다. 화면 상단의 'Your unique URL'을 통째로 복사해 메모장에 붙여둡니다. 이게 앞으로 '이벤트를 받는 수신함 주소'입니다. 🙋나

**복사·실행 예시**

```text
https://webhook.site/8a1f...(뒤에 붙는 랜덤 문자열이 나만의 주소)
```

### 2단계 — 이벤트 소스에 그 URL 등록하기 (7분)

구글폼을 하나 만들고 → 응답 탭 → 점 3개 메뉴 → '스크립트 편집기'가 아니라, 확장 프로그램(Extensions) → Apps Script로 들어갑니다. onFormSubmit 트리거를 코드로 걸고, 1단계 URL로 UrlFetchApp.fetch를 호출하게 합니다. 코드는 아래 첫 번째 템플릿을 AI에게 주고 받아 붙여넣습니다. 🤝함께

**복사·실행 예시**

```text
function onFormSubmit(e){ UrlFetchApp.fetch('https://webhook.site/8a1f...', {method:'post', contentType:'application/json', payload: JSON.stringify(e.namedValues)}); }
```

### 3단계 — 트리거 실제로 연결하기 (5분)

Apps Script 왼쪽 '트리거(시계 아이콘)' → '트리거 추가' → 실행할 함수 onFormSubmit, 이벤트 소스 '양식에서', 이벤트 유형 '양식 제출 시'로 저장합니다. 권한 승인 팝업이 뜨면 내 계정으로 허용합니다. 🙋나

**복사·실행 예시**

```text
트리거 1개: onFormSubmit / 양식에서 / 양식 제출 시
```

### 4단계 — 폼에 직접 응답을 넣어 발화 테스트 (4분)

내가 만든 구글폼을 실제로 열어 아무 답이나 채우고 제출합니다. 그 즉시 webhook.site 화면으로 돌아가면(새로고침 없이) 방금 제출한 응답이 JSON으로 도착해 있는지 확인합니다. 도착했다면 웹훅이 '살아있다'는 뜻입니다. 🙋나

**복사·실행 예시**

```text
webhook.site에 { "이름":["홍길동"], "연락처":["010-1234"] } 형태로 즉시 도착
```

### 5단계 — 수신함을 슬랙/디스코드로 바꾸기 (6분)

이제 테스트용 webhook.site 대신 진짜 목적지로 교체합니다. 슬랙이면 'Incoming Webhooks' 앱에서, 디스코드면 채널 설정 → 연동 → 웹후크에서 URL을 발급받아, 2단계 코드의 URL만 그 주소로 바꿉니다. payload 형식은 슬랙/디스코드가 요구하는 {text:...} 형태로 AI에게 변환을 시킵니다. 🤖A

**복사·실행 예시**

```text
디스코드: payload: JSON.stringify({content:'새 폼 응답: '+e.namedValues['이름']})
```

### 6단계 — 실패에 대비한 재시도/검증 한 줄 넣기 (5분)

웹훅은 상대 서버가 잠깐 죽으면 요청이 유실됩니다. try/catch로 감싸고, 실패 시 내 지메일로 알리도록 한 줄 추가합니다. 또 아무나 내 수신 URL로 가짜 POST를 못 쏘게, 약속한 비밀 토큰을 헤더에 넣고 수신 측에서 확인하는 개념을 이해합니다. 🤖A

**복사·실행 예시**

```text
try{ UrlFetchApp.fetch(url, opt) }catch(err){ MailApp.sendEmail('나@gmail.com','웹훅 실패',String(err)); }
```

## 흔한 실수와 교정
- **실수:** 수신 URL을 안 만들고 코드부터 짠다. 어디로 보낼지 모르니 계속 막힌다.
  - **교정:** 항상 순서는 '수신함(URL) 먼저 → 발신(등록) 나중'. webhook.site로 URL을 먼저 확보하고 테스트가 통과한 뒤에 진짜 목적지로 교체한다.
- **실수:** 트리거를 저장 안 하고 코드만 붙여넣어 놓고 '왜 안 오지?' 한다. 코드가 있어도 트리거가 없으면 아무 일도 안 일어난다.
  - **교정:** Apps Script의 트리거(시계 아이콘) 메뉴에서 '양식 제출 시'를 명시적으로 추가·저장한다. 실제 폼에 응답을 넣어 발화까지 확인한다.
- **실수:** 실패 처리 없이 fetch 한 줄만 두어, 상대 서버가 잠깐 죽으면 이벤트가 조용히 사라진다.
  - **교정:** try/catch로 감싸 실패 시 메일/재큐잉으로 알린다. 중요한 이벤트는 수신 즉시 DB에 원본을 저장(로그)해두고 나중에 처리한다.

## 완료 체크리스트

- webhook.site에서 나만의 수신 URL을 만들어 복사했다
- 이벤트 소스(구글폼 등)에 그 URL을 등록하는 코드를 붙여넣었다
- '양식 제출 시' 트리거를 실제로 추가·저장했다
- 폼에 직접 응답을 넣어 webhook.site로 즉시 도착하는 것을 눈으로 확인했다
- 수신함을 슬랙/디스코드 등 진짜 목적지로 교체하고 try/catch 실패 처리를 넣었다

## 도구

- webhook.site (https://webhook.site) — 웹훅 수신 URL 즉석 발급·페이로드 확인
- Google Apps Script (https://script.google.com) — 구글폼/시트 이벤트에서 웹훅 발신
- Discord Webhooks (채널 설정→연동→웹후크) — 무료 목적지, URL 발급 즉시 사용
- Zapier/Make (https://make.com) — 코드 없이 웹훅 트리거 연결이 필요할 때

## 참고 답안

1) webhook.site에서 테스트 URL 확보 → 2) Apps Script onFormSubmit에 UrlFetchApp.fetch로 테스트 URL 연결 → 3) 트리거에 '양식 제출 시' 등록·저장 → 4) 실제 폼 제출로 webhook.site 도착 확인 → 5) 슬랙 Incoming Webhooks에서 발급받은 URL로 교체, payload를 {text:'새 문의: '+e.namedValues['내용']} 형태로 변환 → 6) try/catch로 감싸 실패 시 내 이메일로 알림

## 실전 프롬프트

### ① 구글폼→웹훅 Apps Script 코드 생성 (가장 유용)

```text
구글폼 응답이 제출될 때마다 지정한 웹훅 URL로 JSON을 POST하는 Google Apps Script 코드를 만들어줘. 요구사항: 1) 함수명 onFormSubmit, 2) e.namedValues 전체를 JSON.stringify해서 보냄, 3) contentType은 application/json, 4) try/catch로 감싸고 실패하면 [내이메일]로 MailApp.sendEmail 알림. 웹훅 URL은 [여기에_내_URL]. 주석은 한국어로.
```

> 확인된 작성 예시 없음

`eduverse` `webhooks-triggers`

### ② webhook.site 페이로드를 슬랙/디스코드 형식으로 변환

```text
아래는 내 웹훅에 도착한 실제 JSON 페이로드야. 이걸 [디스코드 또는 슬랙] 웹훅이 받아들이는 메시지 형식으로 바꾸는 Apps Script payload 코드 한 조각을 만들어줘. 사람이 읽기 좋은 한 줄 요약으로. 도착한 JSON: [붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `webhooks-triggers`

### ③ 폴링 vs 웹훅 어느 쪽이 맞는지 판단

```text
내 상황은 이래: [예: 5분마다 특정 사이트 재고를 확인하고 싶다 / 결제가 완료되면 즉시 처리하고 싶다]. 이 경우 폴링과 웹훅 중 무엇이 적합한지, 상대 서비스가 웹훅을 지원하는지 확인하는 방법, 웹훅이 없다면 대안을 표로 정리해줘.
```

> 확인된 작성 예시 없음

`eduverse` `webhooks-triggers`

### ④ 웹훅 보안 토큰 검증 로직 만들기

```text
내 웹훅 수신 엔드포인트로 아무나 가짜 요청을 못 보내게 하고 싶어. 보내는 쪽 헤더에 비밀 토큰 X-Webhook-Token: [내토큰]을 넣고, 받는 쪽([Supabase Edge Function 또는 Apps Script doPost])에서 이 토큰이 일치할 때만 처리하는 코드를 만들어줘. 불일치면 401 반환.
```

> 확인된 작성 예시 없음

`eduverse` `webhooks-triggers`

## 직접 만들기 (미션)

:::tip
이번엔 구글폼이 아니라 '문의하기 폼'이라고 가정하고, 새 문의가 들어오면 슬랙 채널로 알림이 가는 웹훅을 직접 설계해보세요. webhook.site 테스트부터 슬랙 URL 교체까지 순서대로 적어보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 수신 URL(webhook.site)을 먼저 만들고 나서 코드를 짰나요, 아니면 순서가 뒤바뀌었나요? | 5 |
| 트리거(시계 아이콘)에 '양식 제출 시'를 실제로 저장했고, 진짜 폼 제출로 발화 테스트까지 했나요? | 5 |
| 슬랙/디스코드가 요구하는 payload 형식({text:...} 또는 {content:...})에 맞춰 변환했고, 실패 시 대비(try/catch)도 넣었나요? | 5 |

## 관련 개념

- [Webhook](/wiki/webhook/)
- [Automation](/concepts/automation/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_webhooks_triggers) · 방식: api-capture</sub>
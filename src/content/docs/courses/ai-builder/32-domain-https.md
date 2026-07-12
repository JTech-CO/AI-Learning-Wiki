---
title: "도메인 연결과 HTTPS"
description: "구매한 도메인을 배포한 앱에 연결하고 SSL 인증서로 https 주소를 완성하는 절차를 실습한다. vercel.app 주소 대신 자물쇠(🔒) 붙은 진짜 주소로 세상에 공개해본다."
sidebar:
  order: 32
---
_구매한 도메인을 배포한 앱에 연결하고 SSL 인증서로 https 주소를 완성하는 절차를 실습한다. vercel.app 주소 대신 자물쇠(🔒) 붙은 진짜 주소로 세상에 공개해본다._

:::note[학습 목표]
- 내가 구매한 도메인을 Vercel에 배포한 앱에 DNS 레코드로 연결한다
- 루트(@)는 A 레코드, www는 CNAME으로 타입을 구분해 등록업체에 입력한다
- https 자물쇠가 켜진 진짜 주소를 완성하고 전파·리다이렉트까지 정리한다
:::

## 핵심 개념

도메인 연결은 한마디로 **"이름표 붙이기"**예요. 내 앱은 이미 Vercel 같은 곳에 배포되어 `vercel.app` 주소를 가지고 있는데, 여기에 내가 산 예쁜 이름(`mycafe.com`)을 가리키도록 **표지판(DNS 레코드)**을 세우는 일이에요. DNS는 인터넷의 전화번호부라서, "이 도메인으로 오면 저 서버로 가라"는 안내를 **A 레코드**나 **CNAME**으로 적어둡니다. **HTTPS**는 그 위에 자물쇠를 채워 주고받는 데이터를 암호화하는 것인데, 요즘은 Vercel이 Let's Encrypt 인증서를 자동으로 발급·갱신해 줘서 우리는 클릭 몇 번만 하면 돼요. 딱 하나 기억할 점은 **DNS 변경은 즉시가 아니라 전파(propagation)에 몇 분~수 시간이 걸린다**는 것.

### 왜 이게 될까?

DNS는 인터넷의 전화번호부라서, 도메인 이름 하나에 "이 주소로 오면 Vercel 서버로 가라"는 표지판(A/CNAME 레코드)만 세워주면 됩니다. 등록업체 화면에 값 두 줄만 입력하면 되고, 서버를 찾아가는 나머지 일은 전 세계 DNS망이 알아서 해줘요. HTTPS 인증서도 Vercel이 Let's Encrypt와 자동으로 주고받아 발급·갱신하기 때문에 버튼 한 번으로 자물쇠(🔒)가 켜집니다.

## 👀 따라하기 예시 — 가비아에서 산 mycafe.com을 Vercel 앱에 연결

(가비아에서 `mycafe.com`을 구매하고, Vercel에는 `my-cafe-app.vercel.app` 앱이 이미 배포된 상황)

**① Vercel에 도메인 추가** Vercel 프로젝트 → Settings → Domains에서 `mycafe.com` 입력 후 Add → 안내창에 "Set A record: @ → 76.76.21.21" / "Set CNAME: www → cname.vercel-dns.com"가 뜸.
> 💡 도메인을 추가하면 Vercel이 어떤 DNS 값을 어디에 넣어야 하는지 정확히 알려주기 때문에 추측할 필요가 없어요.

**② 등록업체에 DNS 레코드 등록** 가비아 DNS 관리 화면을 열어 A 레코드와 CNAME 레코드를 각각 등록: 호스트 `@` / A / `76.76.21.21`, 호스트 `www` / CNAME / `cname.vercel-dns.com`.
> 💡 루트(@)는 IP를 가리키는 A, 서브도메인(www)은 주소를 가리키는 CNAME — 타입을 맞추는 게 핵심이에요.

**③ 전파 상태 확인** dnschecker.org에 `mycafe.com`을 조회해 전파 상태 확인: 전 세계 지역 중 18/20 곳에서 `76.76.21.21` 초록 체크, 2곳은 아직 회색(전파 중).
> 💡 DNS는 즉시 반영이 아니라 퍼져나가는 데 시간이 걸린다는 걸 눈으로 확인해요. 아직 덜 퍼졌어도 정상이에요.

**④ HTTPS 자물쇠 확인** Vercel Domains 화면 재확인 → https 접속 테스트: `mycafe.com` → "Valid Configuration ✓"(SSL 인증서 자동 발급 완료), `https://mycafe.com` 접속 → 주소창에 🔒, 앱 화면 정상.
> 💡 Valid Configuration이 뜨는 순간이 바로 "이름표+자물쇠"가 완성된 아하 포인트예요. 아무 인증서 파일도 직접 만들지 않았는데 자동으로 끝나요.

좋은 결과의 기준: (1) 주소창에 회색 자물쇠가 보인다 (2) www로 접속해도 대표 주소로 자동 이동한다 (3) Vercel Domains 화면에 "Valid Configuration" 표시가 남아있다.

## 단계별 따라하기

1. **도메인과 배포 앱 준비 확인** — 도메인 등록업체(가비아, Cloudflare, Namecheap 등)에 로그인해 도메인을 소유 중인지 확인하고, 연결할 앱이 Vercel에 배포되어 `vercel.app` 주소로 열리는지 브라우저로 실제 접속해본다.
2. **Vercel에 도메인 추가하기** — Vercel 대시보드 → 해당 프로젝트 → Settings → Domains → 입력창에 내 도메인을 그대로 입력하고 Add. 그러면 Vercel이 설정에 필요한 DNS 값을 화면에 보여준다. (A 레코드 `76.76.21.21` / www는 CNAME `cname.vercel-dns.com`)
3. **등록업체에서 DNS 레코드 입력** — 도메인 등록업체의 DNS 관리(레코드 설정) 화면을 열고, Vercel이 알려준 값 그대로 레코드를 추가한다. 루트 도메인은 A 레코드, www 서브도메인은 CNAME. 헷갈리면 등록업체 화면을 캡처해 AI에게 물어본다. (호스트 `@` / 타입 A / 값 `76.76.21.21`, 호스트 `www` / 타입 CNAME / 값 `cname.vercel-dns.com`)
4. **DNS 전파 대기와 확인** — 저장 후 5~30분 기다린 뒤 dnschecker.org에 내 도메인을 넣어 세계 여러 지역에서 Vercel IP가 보이는지 확인한다. 아직 안 보이면 조금 더 기다린다.
5. **HTTPS 인증서 자동 발급 확인** — Vercel Domains 화면으로 돌아가 도메인 옆 상태가 Valid Configuration이 되고 Vercel이 SSL 인증서를 자동 발급했는지 확인한다. 발급이 끝나면 `https://내도메인`으로 접속해 주소창 자물쇠(🔒)를 확인한다.
6. **www ↔ 루트 리다이렉트 정리** — Vercel Domains에서 대표 도메인 하나를 정하고(예: `mycafe.com`), 나머지(`www.mycafe.com`)는 Redirect to로 대표 주소로 넘어가게 설정해 방문자가 어느 쪽으로 와도 한 주소로 모이게 한다. (`www.mycafe.com` → Redirect to `mycafe.com` (308))

## 흔한 실수 → 교정

- ✗ DNS 레코드를 바꾸자마자 안 된다고 판단하고 값을 계속 지웠다 다시 넣음 → **DNS는 전파에 5분~수 시간이 걸린다.** 값을 올바르게 넣었다면 만지지 말고 dnschecker.org로 전파 상태를 보며 기다린다.
- ✗ 루트 도메인(@)에 CNAME을 넣거나 www에 A 레코드를 넣어 타입을 뒤바꿈 → **루트(@)는 A 레코드(IP), www 같은 서브도메인은 CNAME(주소)로** 넣는 것이 기본. Vercel이 화면에 알려준 타입 그대로 넣는다.
- ✗ 기존에 등록업체가 넣어둔 주차(파킹) A 레코드나 다른 레코드를 안 지우고 새 값만 추가해 충돌 → **같은 호스트(@)에 이전 A 레코드가 있으면 삭제하고 Vercel 값 하나만 남긴다.** 중복 레코드는 엉뚱한 곳으로 연결된다.

## 도구

- 🛠 **Vercel** (vercel.com) — 앱 배포 및 도메인·SSL 자동 연결.
- 🛠 **가비아·Cloudflare·Namecheap** — 도메인 구매 및 DNS 레코드 관리.
- 🛠 **dnschecker.org** — 전 세계 DNS 전파 상태 확인.
- 🛠 **SSL Labs** (ssllabs.com/ssltest) — HTTPS 인증서 정상 여부 점검.

## 실전 프롬프트

### DNS 레코드 설정 도우미

```text
나는 [가비아]에서 산 도메인 [mycafe.com]을 Vercel에 배포한 앱에 연결하려고 해. Vercel이 알려준 값은 루트는 A 레코드 [76.76.21.21], www는 CNAME [cname.vercel-dns.com]이야. [가비아] DNS 관리 화면에서 호스트/타입/값을 각각 어디에 어떻게 입력하는지 초보자용으로 단계별로 알려줘. 스크린샷 대신 글로.
```

`DNS` `도메인 연결` `설정`

### DNS 문제 진단

```text
도메인 [mycafe.com]을 Vercel에 연결했는데 [30분]이 지나도 접속이 안 되고 Vercel에 [Invalid Configuration]이라고 떠. 내가 넣은 레코드는 [A @ 76.76.21.21]이야. 원인으로 의심되는 것 3가지와 각각 확인·해결 방법을 순서대로 알려줘.
```

`DNS` `문제 진단` `디버깅`

### HTTPS/SSL 개념 설명

```text
내 앱 주소가 http에서 https로 바뀌면 자물쇠가 생기는데, SSL 인증서와 Let's Encrypt가 정확히 무슨 역할을 하는지 비전공자에게 비유로 3문장 안에 설명해줘. 그리고 Vercel에서 자동으로 처리되는 부분과 내가 직접 해야 하는 부분을 구분해줘.
```

`HTTPS` `SSL` `개념 설명`

### 연결 후 최종 점검

```text
내 도메인 [mycafe.com]을 앱에 연결하고 https까지 완료했어. 실제 서비스 공개 전에 도메인·SSL·리다이렉트 관점에서 반드시 확인해야 할 체크리스트를 실행 순서대로 알려줘.
```

`체크리스트` `배포` `점검`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! 이미 등록업체에서 소유 중인 도메인이 있다면 그걸로, 없다면 가상의 도메인(myshop.com)을 가정하고 Vercel Domains에 추가하는 단계부터 https 자물쇠가 켜지는 단계까지 순서대로 진행해보세요. 실제 등록업체 DNS 화면 캡처를 찍어 AI에게 값이 맞는지 물어봐도 좋아요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 루트(@)에는 A, www에는 CNAME으로 타입을 정확히 구분했나요? | 5 |
| DNS 전파를 기다리지 않고 값을 지웠다 다시 넣는 실수를 하지 않았나요? | 5 |
| https 접속 시 주소창에 자물쇠(🔒)가 실제로 보이는지 눈으로 확인했나요? | 5 |

## 관련 개념

- [Domain](/concepts/domain/)
- [Dns](/concepts/dns/)
- [Https](/concepts/https/)
- [Ssl](/concepts/ssl/)
- [A Record Cname](/concepts/a-record-cname/)

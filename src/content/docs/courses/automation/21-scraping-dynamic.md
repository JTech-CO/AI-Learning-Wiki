---
title: "동적 페이지·브라우저 자동화 — Playwright"
description: "JS로 렌더되는 페이지 스크래핑, 로그인·클릭·폼 입력까지 브라우저 자동 조작."
sidebar:
  order: 21
---
_JS로 렌더되는 페이지 스크래핑, 로그인·클릭·폼 입력까지 브라우저 자동 조작._

:::note[학습 목표]
- 이 레슨이 끝나면, 로그인·클릭·스크롤이 필요한 JavaScript 렌더링 페이지에서 Playwright로 원하는 데이터를 자동으로 뽑아 CSV로 저장할 수 있습니다.
:::

> "이 가격 복사하려는데 소스 보기를 눌러도 숫자가 안 보여요" — 요즘 사이트 절반이 그렇습니다. 화면엔 보이는데 HTML엔 없죠. 브라우저를 로봇처럼 직접 조종하면 그 벽이 사라집니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 로그인·클릭·스크롤이 필요한 JavaScript 렌더링 페이지에서 Playwright로 원하는 데이터를 자동으로 뽑아 CSV로 저장할 수 있습니다.

## 핵심 개념

requests·BeautifulSoup 같은 정적 스크래퍼는 서버가 처음 보내준 HTML만 봅니다. 그런데 요즘 사이트(쿠팡·인스타·대시보드)는 빈 껍데기 HTML을 받은 뒤 JavaScript가 실행되면서 데이터를 그려 넣습니다. 그래서 정적 스크래퍼 눈엔 내용이 텅 비어 보입니다. Playwright는 진짜 크롬 브라우저를 코드로 조종해서 JS 실행이 끝난 '화면에 보이는 그대로'를 읽고, 사람처럼 버튼을 클릭하고 로그인 폼을 채웁니다. 즉 '사람이 브라우저로 하는 모든 행동'을 코드로 재생하는 도구입니다.

### 왜 작동하는가

정적 스크래퍼는 서버가 처음 보낸 빈 껍데기 HTML만 보지만, Playwright는 진짜 크롬 브라우저를 코드로 조종해서 JS가 다 실행된 '화면에 보이는 그대로'를 읽습니다. 그래서 당신은 어떤 요소를 기다리고 어떤 버튼을 누를지만 정하면, 클릭·로그인·스크롤 같은 사람 손동작은 Playwright가 그대로 재생해줍니다.

## 👀 따라하기 예시

쿠팡 스타일 쇼핑몰에서 무한 스크롤로 나오는 상품명과 가격을 CSV로 뽑는 상황 — 제가 먼저 처음부터 끝까지 해볼게요, 눈으로 따라오세요.

### 1. ① 브라우저부터 눈으로 띄운다 (headless=False)

**실제 결과**

```text
p.chromium.launch(headless=False) 실행 → 진짜 크롬 창이 뜨고 페이지가 그려지는 게 보임
```

> 안 될 때 어디서 막혔는지 눈으로 봐야 고칠 수 있으니까요, 완성 후에 headless로 바꿔도 늦지 않아요.

### 2. ② 데이터가 그려질 때까지 명시적으로 기다린다

**실제 결과**

```text
page.wait_for_selector('.item') → 상품 카드들이 화면에 나타난 다음에야 코드가 다음 줄로 넘어감
```

> goto 직후엔 아직 JS가 안 돌아서 데이터가 텅 비어 있거든요. sleep 찍고 기다리는 것보다 훨씬 빠르고 정확해요.

### 3. ③ F12로 가격 요소를 뽑아 AI에게 셀렉터를 물어본다

**실제 결과**

```text
<span class="price-value">29,900원</span> 복사 → AI 답: page.query_selector('.price-value').inner_text()
```

> CSS 셀렉터 문법을 외울 필요가 없어요. AI는 HTML 구조만 보면 바로 어디를 찍어야 하는지 알아냅니다.

### 4. ④ 스크롤을 반복하며 상품을 계속 모은다

**실제 결과**

```text
for _ in range(5): page.mouse.wheel(0,3000); time.sleep(1) → 실행할 때마다 items 개수가 20개→45개→68개로 늘어남
```

> 무한 스크롤 사이트는 화면을 내려야 새 데이터가 로드되니, 사람이 스크롤하듯 코드로 반복해주는 거예요.

### 완성 결과

result.csv 파일 하나 — 좋은 결과의 기준은 (1) 엑셀에서 열었을 때 한글이 안 깨지는지(utf-8-sig), (2) 상품명·가격 행 개수가 스크롤한 만큼 늘어나 있는지, (3) 빈 값이나 중복 행이 없는지 입니다.

## 단계별 따라하기

### 1단계 — 설치하고 브라우저 눈으로 확인 (10분)

터미널에서 파이썬 Playwright를 설치하고, 브라우저 엔진까지 내려받습니다. 처음엔 headless=False로 실행해 실제 크롬 창이 뜨는지 눈으로 확인하세요. 🙋나

**복사·실행 예시**

```text
pip install playwright
playwright install chromium
# 확인 코드
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=False)
    page = b.new_page()
    page.goto('https://quotes.toscrape.com/js/')
    print(page.title())
    b.close()
```

### 2단계 — 렌더링이 끝날 때까지 기다리기 (10분)

goto 직후 바로 읽으면 아직 JS가 안 돌아 데이터가 없습니다. wait_for_selector로 '이 요소가 뜨면 준비 완료'라고 명시적으로 기다리세요. time.sleep 대신 셀렉터 대기가 정석입니다. 🙋나

**복사·실행 예시**

```text
page.goto('https://quotes.toscrape.com/js/')
page.wait_for_selector('.quote')  # 이 클래스가 나타날 때까지 대기
quotes = page.query_selector_all('.quote .text')
for q in quotes:
    print(q.inner_text())
```

### 3단계 — 셀렉터를 AI에게 뽑게 하기 (10분)

크롬에서 F12 → 원하는 요소 우클릭 → 검사로 HTML 조각을 복사한 뒤, AI에게 붙여 넣고 Playwright 셀렉터를 요청하세요. 직접 CSS 문법 외울 필요 없습니다. 🤖A

**복사·실행 예시**

```text
F12로 가격 요소 HTML 복사:
<span class="price-value" data-id="33">29,900원</span>
→ AI가 준 셀렉터: page.query_selector('.price-value').inner_text()
```

### 4단계 — 로그인·클릭·폼 입력 자동화 (15분)

fill로 아이디·비밀번호를 채우고 click으로 버튼을 누릅니다. 로그인 후 페이지 이동이 끝날 때까지 wait_for_load_state로 기다린 뒤 데이터를 읽으세요. 본인 계정·본인 데이터에만 쓰세요. 🤝함께

**복사·실행 예시**

```text
page.fill('#username', 'my_id')
page.fill('#password', 'my_pw')
page.click('button[type=submit]')
page.wait_for_load_state('networkidle')
print(page.url)  # 로그인 후 URL 확인
```

### 5단계 — 무한 스크롤·다음 페이지 반복 처리 (15분)

스크롤로 콘텐츠가 로드되는 사이트는 mouse.wheel 또는 evaluate로 끝까지 내린 뒤 수집합니다. 다음 버튼이 있으면 반복문으로 클릭하세요. 🤖A

**복사·실행 예시**

```text
import time
for _ in range(5):
    page.mouse.wheel(0, 3000)
    time.sleep(1)  # 새 항목 로드 대기
items = page.query_selector_all('.item')
print(len(items), '개 수집')
```

### 6단계 — CSV로 저장하고 재사용 (10분)

수집한 리스트를 csv 모듈로 파일에 저장하면 엑셀에서 바로 열립니다. AI에게 '이 리스트를 CSV로 저장하는 코드'를 요청해 마무리하세요. 🤖A

**복사·실행 예시**

```text
import csv
rows = [q.inner_text() for q in quotes]
with open('result.csv','w',newline='',encoding='utf-8-sig') as f:
    w = csv.writer(f)
    for r in rows: w.writerow([r])
# utf-8-sig = 엑셀 한글 안 깨짐
```

## 흔한 실수와 교정
- **실수:** goto 직후 바로 데이터를 읽어 빈 결과가 나온다.
  - **교정:** wait_for_selector('원하는요소') 또는 wait_for_load_state('networkidle')로 JS 렌더링이 끝날 때까지 명시적으로 기다린 뒤 읽는다.
- **실수:** time.sleep(5)로 무작정 기다려 느리거나 불안정하다.
  - **교정:** 고정 sleep 대신 '이 요소가 뜰 때까지' 조건 대기(wait_for_selector)를 쓴다. 빠르고 안정적이다.
- **실수:** headless=True로 돌리다 왜 안 되는지 못 본다.
  - **교정:** 개발·디버깅 중엔 headless=False로 실제 창을 띄워 클릭·이동이 어디서 막히는지 눈으로 확인한 뒤, 완성되면 headless로 바꾼다.

## 완료 체크리스트

- Playwright와 chromium을 설치하고 실제 크롬 창을 띄워봤다
- wait_for_selector로 렌더링 대기를 넣었다
- F12로 셀렉터를 찾고 AI로 추출 코드를 만들었다
- fill·click으로 로그인/폼 입력을 자동화해봤다
- 수집 결과를 utf-8-sig CSV로 저장해 엑셀에서 열어봤다

## 도구

- Playwright (https://playwright.dev/python/) — 브라우저 자동 조작·동적 스크래핑
- Chrome DevTools (F12) — 요소 검사로 셀렉터 확보
- ChatGPT/Claude (https://chat.openai.com) — 셀렉터·코드 생성 및 에러 디버깅
- quotes.toscrape.com (https://quotes.toscrape.com/js/) — JS 렌더링 연습용 사이트

## 참고 답안

page.goto(로그인 URL) → page.fill('#username','tomsmith') → page.fill('#password','SuperSecretPassword!') → page.click('button[type=submit]') → page.wait_for_load_state('networkidle') → page.query_selector('.flash').inner_text() 로 성공 메시지 출력

## 실전 프롬프트

### 셀렉터 뽑기 (가장 유용)

```text
아래는 크롬 검사(F12)로 복사한 HTML 조각이야. 여기서 [가격 / 제목 / 링크]를 Playwright(파이썬 sync API)로 추출하는 query_selector 코드를 만들어줘. 여러 개면 query_selector_all로. HTML: [여기에 HTML 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `scraping-dynamic`

### 로그인 자동화 코드

```text
Playwright(파이썬 sync API)로 [사이트 URL] 로그인을 자동화하는 코드를 만들어줘. 아이디 입력칸 셀렉터=[#username], 비번=[#password], 로그인 버튼=[button[type=submit]]. 로그인 성공 후 [수집할 데이터]를 읽고 싶어. 명시적 wait을 꼭 넣어줘.
```

> 확인된 작성 예시 없음

`eduverse` `scraping-dynamic`

### 무한 스크롤 수집

```text
Playwright(파이썬)로 [URL] 페이지를 끝까지 스크롤하며 [.item] 요소를 모두 수집하는 코드를 만들어줘. 새 항목이 더 안 늘어나면 멈추도록 로직을 넣고, 결과를 리스트로 반환해줘.
```

> 확인된 작성 예시 없음

`eduverse` `scraping-dynamic`

### 에러 디버깅

```text
이 Playwright 코드가 [에러 메시지 또는 빈 결과]가 나와. 원인이 렌더링 대기 문제인지 셀렉터 문제인지 알려주고 고쳐줘. 코드: [코드 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `scraping-dynamic`

## 직접 만들기 (미션)

:::tip
이번엔 quotes.toscrape.com/js/ 대신, 로그인이 필요한 연습 사이트(예: the-internet.herokuapp.com/login, id: tomsmith / pw: SuperSecretPassword!)에 들어가서 로그인 버튼을 누른 뒤, 로그인 성공 메시지 텍스트를 Playwright로 읽어와 출력해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 로그인 버튼 클릭 후 wait_for_load_state나 wait_for_selector로 다음 페이지 로딩을 기다렸나요? | 5 |
| headless=False로 실제 화면을 보면서 어디서 멈추는지 확인했나요? | 5 |
| 고정 time.sleep()이 아니라 조건 대기(wait_for_selector)를 썼나요? | 5 |

## 관련 개념

- [Api](/concepts/api/)
- [Web Scraping](/concepts/web-scraping/)
- [Automation](/concepts/automation/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_scraping_dynamic) · 방식: api-capture</sub>
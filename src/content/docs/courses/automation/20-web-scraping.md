---
title: "웹 스크래핑 — BeautifulSoup"
description: "정적 웹페이지에서 원하는 데이터를 골라 추출·저장."
sidebar:
  order: 20
---
_정적 웹페이지에서 원하는 데이터를 골라 추출·저장._

:::note[학습 목표]
- 이 레슨이 끝나면, 정적 웹페이지에서 원하는 값(제목·가격·링크)을 골라 뽑아 CSV 파일로 저장하는 스크래퍼를 직접 만들 수 있습니다.
:::

> 매일 아침 열 개 쇼핑몰 가격을 손으로 복사·붙여넣기 하고 있나요? 파이썬 20줄이면 그 일을 컴퓨터가 3초 만에 끝냅니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 정적 웹페이지에서 원하는 값(제목·가격·링크)을 골라 뽑아 CSV 파일로 저장하는 스크래퍼를 직접 만들 수 있습니다.

## 핵심 개념

웹 스크래핑은 브라우저가 화면에 그리는 HTML을 사람 대신 프로그램이 읽어 원하는 조각만 뽑아내는 일입니다. 웹페이지는 사실 <div>, <span>, <a> 같은 태그가 겹겹이 쌓인 구조(HTML 트리)이고, 각 데이터는 태그 이름·class·id라는 '주소'를 갖고 있습니다. requests로 페이지의 HTML 원문을 받아오고, BeautifulSoup으로 그 트리를 파싱해 '이 class를 가진 태그를 다 찾아줘'라고 지시하면 됩니다. 핵심은 브라우저 개발자도구(F12)로 원하는 값의 '주소'를 먼저 찾는 것이고, 이것만 익히면 뉴스 헤드라인·부동산 매물·환율표 무엇이든 같은 방식으로 긁을 수 있습니다. 단, 로그인·무한스크롤처럼 자바스크립트가 나중에 채우는 값은 이 방법으로 안 잡히니 정적 페이지부터 연습합니다.

### 왜 작동하는가

웹페이지는 사실 태그로 쌓인 나무 구조예요. AI는 이 나무를 수억 번 훑어봐서 '이 class 안에 제목이 있다'는 패턴을 이미 압니다. 그래서 당신은 F12로 주소만 찾아주면, 나머지 파싱·반복·저장 코드는 AI가 눈 깜짝할 새 짜줍니다.

## 👀 따라하기 예시

books.toscrape.com에서 책 제목과 가격을 뽑아 CSV로 저장하는 상황 — 제가 먼저 해볼게요, 눈으로 따라오세요.

### 1. ① F12로 책 제목이 <article class="product_pod"> 안 <h3><a title="..."> 에 있다고 확인하고, AI에게 '이 구조에서 제목·가격 뽑는 코드 짜줘'라고 요청

**실제 결과**

```text
import requests\nfrom bs4 import BeautifulSoup\nr = requests.get('http://books.toscrape.com')\nsoup = BeautifulSoup(r.text, 'html.parser')\nprint(soup.title.text)  # All products | Books to Scrape
```

> 먼저 연결부터 확인해야 이후 코드가 진짜 데이터 위에서 도는지 확신할 수 있어요

### 2. ② soup.select로 반복 추출 요청

**실제 결과**

```text
for pod in soup.select('article.product_pod'):\n    title = pod.h3.a['title']\n    price = pod.select_one('p.price_color').text\n    print(title, price)\n# A Light in the Attic £51.77
```

> select_one은 하나, select는 여러 개 — 반복문 돌릴 땐 무조건 select

### 3. ③ CSV로 저장해달라고 요청

**실제 결과**

```text
import csv\nwith open('books.csv','w',newline='',encoding='utf-8-sig') as f:\n    w = csv.writer(f); w.writerow(['제목','가격'])\n    for pod in soup.select('article.product_pod'):\n        w.writerow([pod.h3.a['title'], pod.select_one('p.price_color').text])
```

> 엑셀·구글시트로 바로 열어 눈으로 검증할 수 있어야 진짜 완성

### 4. ④ 예의 지키기 — sleep과 robots.txt 확인 요청

**실제 결과**

```text
import time\nfor n in range(1,4):\n    url = f'http://books.toscrape.com/catalogue/page-{n}.html'\n    r = requests.get(url); time.sleep(1)
```

> 1초씩 쉬어야 IP 차단 없이 여러 페이지를 안전하게 돈다

### 완성 결과

책 제목·가격이 담긴 books.csv 파일. 좋은 결과의 기준: (1) 엑셀로 열었을 때 빈 칸 없이 값이 들어있다 (2) 여러 페이지를 돌아도 중복·누락이 없다 (3) 서버에 과부하 없이 sleep을 지켰다.

## 단계별 따라하기

### 1단계 — 도구 설치하고 실습 대상 정하기 (5분)

터미널(또는 Google Colab)에서 pip install requests beautifulsoup4 를 실행해 두 라이브러리를 깔고, 연습용으로 스크래핑이 허용된 books.toscrape.com 을 실습 대상으로 정합니다. 이 사이트는 학습용으로 공개된 가짜 서점이라 마음껏 긁어도 됩니다.

**복사·실행 예시**

```text
터미널: pip install requests beautifulsoup4 → 브라우저에서 http://books.toscrape.com 접속 확인 🙋나
```

### 2단계 — 개발자도구로 데이터 주소 찾기 (7분)

목표 페이지에서 뽑고 싶은 값(책 제목) 위에 마우스를 올리고 F12(개발자도구)를 눌러 Elements 탭에서 그 값을 감싼 태그와 class를 확인합니다. 어떤 태그·class인지 메모해 두면 다음 단계 코드의 재료가 됩니다.

**복사·실행 예시**

```text
책 제목은 <article class="product_pod"> 안의 <h3><a title="..."> 에 들어 있음을 F12로 확인 🙋나
```

### 3단계 — HTML 받아와 파싱하기 (8분)

requests.get(url)로 페이지 HTML을 통째로 받고, BeautifulSoup(html, 'html.parser')로 파싱 객체를 만듭니다. print(soup.title) 로 제목 태그가 찍히면 연결 성공입니다. 막히면 아래 첫 번째 템플릿을 AI에 붙여넣어 코드를 받으세요.

**복사·실행 예시**

```text
import requests
from bs4 import BeautifulSoup
r = requests.get('http://books.toscrape.com')
soup = BeautifulSoup(r.text, 'html.parser')
print(soup.title.text)  # → All products | Books to Scrape 🤝함께
```

### 4단계 — 원하는 값 여러 개 뽑기 (8분)

soup.select() 에 2단계에서 찾은 CSS 선택자를 넣어 항목 전체를 리스트로 가져오고, for 반복문으로 각 항목에서 제목·가격을 꺼냅니다. 선택자가 헷갈리면 두 번째 템플릿을 사용하세요.

**복사·실행 예시**

```text
for pod in soup.select('article.product_pod'):
    title = pod.h3.a['title']
    price = pod.select_one('p.price_color').text
    print(title, price)  # → A Light in the Attic £51.77 🙋나
```

### 5단계 — CSV 파일로 저장하기 (5분)

csv 모듈로 파일을 열고, 헤더 행을 쓴 뒤 각 항목을 writerow로 한 줄씩 기록합니다. 저장 후 엑셀·구글시트로 열어 값이 제대로 들어갔는지 눈으로 확인합니다.

**복사·실행 예시**

```text
import csv
with open('books.csv','w',newline='',encoding='utf-8-sig') as f:
    w = csv.writer(f); w.writerow(['제목','가격'])
    for pod in soup.select('article.product_pod'):
        w.writerow([pod.h3.a['title'], pod.select_one('p.price_color').text]) 🙋나
```

### 6단계 — 예의 지키고 다음 페이지로 확장 (7분)

요청 사이에 time.sleep(1)을 넣어 서버에 부담을 주지 않고, 그 사이트의 robots.txt(예: 도메인/robots.txt)와 이용약관에서 스크래핑 허용 여부를 확인합니다. 여러 페이지를 긁을 땐 page-2.html 처럼 URL 규칙을 찾아 반복문으로 돌립니다.

**복사·실행 예시**

```text
import time
for n in range(1,4):
    url = f'http://books.toscrape.com/catalogue/page-{n}.html'
    r = requests.get(url); time.sleep(1)  # 페이지마다 1초 쉬기 🙋나
```

## 흔한 실수와 교정
- **실수:** soup.find로 하나만 뽑아놓고 왜 전부 안 나오냐고 함
  - **교정:** 하나만 찾을 땐 find/select_one, 여러 개를 리스트로 받을 땐 find_all/select를 씁니다. 반복 처리하려면 select를 쓰세요.
- **실수:** 코드는 맞는데 값이 비어 있음 — 사실 자바스크립트로 나중에 채워지는 페이지
  - **교정:** requests가 받은 r.text에 그 값이 실제로 들어 있는지 먼저 확인합니다. 없으면 정적 페이지가 아니므로 Selenium/Playwright 또는 그 사이트의 공개 API를 써야 합니다.
- **실수:** 쉬는 시간 없이 수백 번 요청해 IP가 차단됨
  - **교정:** 요청 사이에 time.sleep(1) 이상을 넣고, robots.txt를 존중하며, 한 번 받은 페이지는 저장해 재요청을 줄입니다.

## 완료 체크리스트

- books.toscrape.com 같은 실습 허용 사이트로 연습했다
- F12로 뽑을 값의 태그·class를 확인했다
- requests.get 후 soup.title이 정상 출력됐다
- select 반복문으로 값을 여러 개 뽑았다
- CSV로 저장해 엑셀에서 값이 맞는지 확인했다

## 도구

- Python (https://www.python.org) — 스크래퍼를 돌리는 언어
- BeautifulSoup4 (https://pypi.org/project/beautifulsoup4) — HTML 파싱
- requests (https://pypi.org/project/requests) — 페이지 HTML 받아오기
- Google Colab (https://colab.research.google.com) — 설치 없이 브라우저에서 파이썬 실행

## 참고 답안

import requests, csv\nfrom bs4 import BeautifulSoup\nr = requests.get('http://quotes.toscrape.com')\nsoup = BeautifulSoup(r.text, 'html.parser')\nwith open('quotes.csv','w',newline='',encoding='utf-8-sig') as f:\n    w = csv.writer(f); w.writerow(['명언','저자'])\n    for q in soup.select('div.quote'):\n        text = q.select_one('span.text').text\n        author = q.select_one('small.author').text\n        w.writerow([text, author])

## 실전 프롬프트

### 스크래퍼 코드 통째로 받기

```text
파이썬 requests와 BeautifulSoup으로 [http://books.toscrape.com] 페이지에서 [책 제목과 가격]을 뽑아 books.csv로 저장하는 코드를 20줄 이내로 써줘. 각 줄에 한국어 주석을 달고, 초보자가 그대로 복붙해서 실행할 수 있게 해줘.
```

> 확인된 작성 예시 없음

`eduverse` `web-scraping`

### CSS 선택자 찾기

```text
아래 HTML 조각에서 [책 제목]과 [가격]을 뽑으려면 BeautifulSoup의 select() 또는 select_one()에 넣을 CSS 선택자가 뭐야? 선택자만 알려주지 말고 왜 그렇게 되는지도 한 줄로 설명해줘.

[여기에 F12로 복사한 HTML 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `web-scraping`

### 에러 해결

```text
이 파이썬 스크래핑 코드를 실행했더니 아래 에러가 났어. 원인과 수정한 전체 코드를 한국어로 알려줘.

코드:
[내 코드 붙여넣기]

에러:
[에러 메시지 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `web-scraping`

### 합법 여부 점검

```text
내가 [사이트 URL]에서 [어떤 데이터]를 스크래핑하려고 해. 이 사이트의 robots.txt와 이용약관 기준으로 주의할 점과, 서버에 부담 안 주는 요청 간격·User-Agent 설정을 초보자용으로 정리해줘.
```

> 확인된 작성 예시 없음

`eduverse` `web-scraping`

## 직접 만들기 (미션)

:::tip
이번엔 quotes.toscrape.com(명언 사이트)에서 명언(quote)과 저자(author)를 뽑아 quotes.csv로 저장해보세요. 구조는 <div class="quote"> 안에 <span class="text">와 <small class="author">가 있습니다.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| F12로 span.text, small.author 위치를 직접 확인했나요? | 5 |
| CSV를 열어봤을 때 명언과 저자가 한 줄씩 짝지어 들어있나요? | 5 |
| 요청 사이에 sleep을 넣거나 robots.txt를 확인했나요? | 5 |

## 관련 개념

- [Api](/wiki/api/)
- [Web Scraping](/concepts/web-scraping/)
- [Automation](/concepts/automation/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_web_scraping) · 방식: api-capture</sub>
---
title: "함수·모듈로 코드 조직하기"
description: "반복되는 코드를 인자·기본값·반환값을 갖춘 함수로 묶고, 관련 함수를 별도 모듈(.py)로 나눠 import해 재사용하는 법을 익힌다. 같은 코드를 세 번째 복붙하는 순간 버그도 세 개가 되지만, 함수 하나면 고칠 곳도 하나로 줄어든다."
sidebar:
  order: 4
---
_반복되는 코드를 인자·기본값·반환값을 갖춘 함수로 묶고, 관련 함수를 별도 모듈(.py)로 나눠 import해 재사용하는 법을 익힌다. 같은 코드를 세 번째 복붙하는 순간 버그도 세 개가 되지만, 함수 하나면 고칠 곳도 하나로 줄어든다._

:::note[학습 목표]
- 반복되는 코드를 인자·기본값·반환값을 갖춘 함수로 묶는다
- 관련 함수들을 여러 파일(모듈)로 나눠 import해서 재사용한다
- '한 함수는 한 가지 일만' 원칙으로 이름만 봐도 역할이 보이게 만든다
:::

## 핵심 개념

함수는 **'이름 붙인 작업 상자'**예요. 입력(**인자**)을 넣으면 정해진 일을 하고 결과(**반환값**)를 돌려줘요. 마치 커피 머신에 원두를 넣으면(인자) 커피가 나오는(반환값) 것처럼요. **기본값**을 주면 인자를 생략해도 알아서 동작하고, 관련된 함수들을 별도 `.py` 파일(**모듈**)로 모아 `import`하면 main 코드는 짧고 읽기 좋아져요. 핵심은 **'한 함수는 한 가지 일만'** 하고, 이름만 봐도 무슨 일을 하는지 알게 만드는 것.

### 왜 이게 될까?

함수는 '이름 붙인 작업 상자'라서 한 번 만들어두면 AI든 당신이든 그 이름만 부르면 돼요. 그래서 AI에게 긴 코드를 보여주면 "이 부분은 반복되니 함수로, 이 부분은 역할이 다르니 따로" 하고 경계선을 대신 그어줘요. 당신은 **'무슨 일을 하는 함수인지'**만 정하면, 쪼개고 이름 붙이는 초안은 AI가 잡아줘요.

## 👀 따라하기 예시 — 40줄짜리 `process_order()` 쪼개기

주문 데이터를 받아 부가세 계산 → 영수증 생성 → 출력까지 다 하는 40줄짜리 `process_order()`를 쪼개볼게요.

**① 긴 함수를 붙여넣고 쪼개 달라고 요청** — AI에게 "한 가지 일만 하는 함수들로 쪼개줘, 이름도 지어줘"라고 요청하면 `calc_vat(price, rate=0.1)`, `build_receipt(name, total)`, `print_receipt(text)` 3개로 분리해줘요. 각 함수 위에 한 줄 docstring도 포함.
> 💡 AI는 '역할 하나 = 함수 하나' 원칙으로 코드 덩어리를 자동으로 갈라줘요 — 아하 포인트.

**② 계산 함수에 기본값 인자 확인** — `def calc_vat(price, rate=0.1): return price * (1 + rate)`. 세율이 대부분 10%라 `rate`를 생략하고 호출할 수 있어요.
> 💡 기본값을 주면 자주 쓰는 값은 매번 안 적어도 되고, 특수 케이스만 `rate=0.2`처럼 넘기면 돼요.

**③ 화면 출력과 계산 분리 점검** — `build_receipt`은 `return`으로 문자열만 돌려주고, `print_receipt`만 실제 출력을 담당해요. 계산 결과를 재사용할 수 있게 됨.
> 💡 `print`만 하고 `return`이 없으면 그 값을 다른 곳에서 못 써요. 분리해야 재사용돼요.

**④ 모듈로 옮기고 `__main__` 가드 추가** — 세 함수를 `order_utils.py`로 옮기고(함수 3개 + docstring), `main.py`에서 `from order_utils import calc_vat, build_receipt`. 테스트 코드는 `if __name__ == "__main__":` 안으로 이동.
> 💡 이렇게 하면 다른 파일에서 import할 때 테스트 코드가 같이 실행되지 않아 안전해요.

좋은 결과의 기준: (1) 함수 하나가 한 가지 일만 한다 (2) 이름만 봐도 무슨 일을 하는지 안다 (3) import해도 테스트 코드가 실행되지 않는다.

## 단계별 따라하기

1. **반복되는 코드 찾아 함수로 묶기** — 거의 똑같이 두 번 이상 나타나는 줄들을 찾아 `def 이름(인자):`로 감싸고, 매번 달라지는 값만 인자로 빼내요. 계산 결과는 `print`가 아니라 `return`으로.
   ```python
   # 전
   price1 = 10000; total1 = price1 * 1.1
   price2 = 20000; total2 = price2 * 1.1
   # 후
   def add_vat(price): return price * 1.1
   total1 = add_vat(10000)
   ```
2. **인자에 기본값 주기** — 대부분 같은 값을 쓴다면 `def 함수(인자=기본값)` 형태로. 호출할 때 그 인자를 생략할 수 있고 필요할 때만 다른 값을 넘겨요. 기본값 인자는 반드시 일반 인자보다 **뒤에**.
   ```python
   def add_vat(price, rate=0.1): return price * (1 + rate)
   add_vat(10000)       # 11000.0
   add_vat(10000, 0.2)  # 12000.0
   ```
3. **이름 있는 인자로 호출해 가독성 높이기** — 인자가 3개 이상이면 `rate=0.2`처럼 키워드로 넘겨요. 순서를 외울 필요 없고, 나중에 코드를 읽는 사람이 각 숫자가 뭔지 바로 알아요.
   ```python
   def make_receipt(name, price, rate=0.1, currency="KRW"):
       return f"{name}: {price*(1+rate)} {currency}"
   make_receipt(name="책", price=15000, currency="USD")
   ```
4. **함수를 모듈(`.py` 파일)로 분리하기** — 관련 함수들을 `utils.py` 같은 새 파일에 모으고, `main.py`에서 `from utils import add_vat`로 가져다 써요. 파일이 커지면 폴더를 만들고 그 안에 빈 `__init__.py`를 두면 '패키지'가 돼요.
   ```python
   # utils.py
   def add_vat(price, rate=0.1): return price * (1 + rate)
   # main.py
   from utils import add_vat
   print(add_vat(10000))
   ```
5. **`__main__` 가드로 재사용 안전하게 만들기** — 모듈 맨 아래 테스트 코드는 `if __name__ == "__main__":` 안에. 그래야 다른 파일에서 import할 때 그 테스트가 실행되지 않아요. 각 함수 첫 줄에는 한 줄짜리 docstring으로 무슨 일을 하는지 적어요.
   ```python
   def add_vat(price, rate=0.1):
       """가격에 부가세를 더해 반환한다."""
       return price * (1 + rate)
   if __name__ == "__main__":
       print(add_vat(10000))
   ```
6. **AI로 함수 쪼개기·이름 개선 리뷰 받기** — 아래 첫 번째 프롬프트에 당신의 긴 함수를 붙여 '한 가지 일만 하도록' 쪼개 달라고 요청해요. AI가 준 이름과 구조를 보고 어색한 함수명은 당신 도메인 용어로 바꿔요. (긴 `process()` 함수 하나 → `load_data()`, `clean_data()`, `save_report()` 세 개로 분리하고 각 20줄 이하로)

## 흔한 실수 → 교정

- ✗ 함수 안에서 `print`만 하고 `return`을 안 해서 그 결과를 다른 계산에 못 씀 → **화면 출력과 값 계산을 분리.** 함수는 `return`으로 값을 돌려주고, 출력은 함수 밖에서 `print(add_vat(10000))`처럼 따로.
- ✗ 기본값으로 빈 리스트 `[]`나 `{}` 같은 가변 객체를 써서 호출할 때마다 이전 값이 쌓이는 버그 → **기본값은 `def f(items=None):`으로 두고**, 함수 첫 줄에서 `if items is None: items = []`로 새로 만듦.
- ✗ 모듈을 import했더니 파일 아래 테스트 코드가 같이 실행돼 버림 → **직접 실행할 코드는 `if __name__ == "__main__":` 블록 안에** 넣어 import 시에는 함수 정의만 로드되게.

## 도구

- 🛠 **Python** (python.org) — 함수·모듈을 실행하는 언어.
- 🛠 **VS Code** (code.visualstudio.com) — 함수 정의·모듈 편집 에디터.
- 🛠 **Google Colab** (colab.research.google.com) — 설치 없이 브라우저에서 함수 실습.
- 🛠 **ChatGPT** (chat.openai.com) — 함수 쪼개기·이름 리뷰 도우미.

## 실전 프롬프트

### 긴 함수 쪼개기 리뷰

```text
아래 파이썬 함수를 '한 함수는 한 가지 일만' 원칙으로 리팩터링해줘. 각 함수에 명확한 이름, 인자 기본값, 반환값(return), 한 줄 docstring을 넣고 왜 그렇게 나눴는지 짧게 설명. 원본 동작은 절대 바꾸지 마. [내 함수 코드]
```

> 확인된 작성 예시 없음

`함수` `리팩터링` `쪼개기`

### 모듈 구조 설계

```text
내 파이썬 스크립트가 하는 일은 [프로그램 설명]이야. 이 코드를 어떤 .py 파일들(모듈)로 나누면 좋을지, 각 파일에 어떤 함수를 넣을지 폴더 트리로 제안. import 경로 예시와 __init__.py가 필요한지도.
```

> 확인된 작성 예시 없음

`모듈` `패키지` `구조 설계`

### 함수 이름·인자 점검

```text
아래 함수들의 이름과 인자를 검토해줘. 이름만 보고 무슨 일을 하는지 알 수 있는지, 기본값을 줄 만한 인자가 있는지, 키워드 인자로 바꾸면 좋을 곳이 있는지 지적하고 개선안을 표로. [함수들]
```

> 확인된 작성 예시 없음

`함수` `이름` `인자`

### docstring 자동 작성

```text
아래 파이썬 함수들에 한국어 한 줄 docstring과 인자·반환값을 설명하는 표준 docstring을 추가해줘. 코드 로직은 바꾸지 말고 docstring만 붙여서 전체 코드를 다시 출력. [함수]
```

> 확인된 작성 예시 없음

`docstring` `문서화`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! 당신이 최근 짠 코드 중 `print`와 계산이 뒤섞인 함수(또는 10줄 넘게 복붙한 코드)를 하나 골라, AI에게 "반환값 있는 함수로 쪼개고 기본값 인자까지 정리해줘"라고 요청해 `utils.py`로 분리해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 내 함수는 정말 한 가지 일만 하는가? | 5 |
| 함수 이름만 보고 무슨 일을 하는지 남이 알 수 있는가? | 5 |
| import했을 때 원치 않는 코드가 같이 실행되지 않는가? | 5 |

## 관련 개념

- [Function](/concepts/function/)
- [Argument](/concepts/argument/)
- [Default Value](/concepts/default-value/)
- [Return Value](/concepts/return-value/)
- [Module](/concepts/module/)
- [Import](/concepts/import/)
- [Main Guard](/concepts/main-guard/)
- [Refactoring](/concepts/refactoring/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-engineer) · 방식: authenticated-crawl</sub>
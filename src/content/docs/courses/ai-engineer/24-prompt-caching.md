---
title: "컨텍스트·프롬프트 캐싱 — 비용·속도 최적화"
description: "긴 고정 문맥(설명서·문서·예시)을 cache_control로 캐시에 묶어 두 번째 호출부터 입력 비용을 최대 90% 아끼고 응답을 빠르게 만드는 법을 익힌다. usage 응답으로 캐시 적중을 숫자로 검증하고 모델별 최소 토큰 기준까지 확인한다."
sidebar:
  order: 24
---
_긴 고정 문맥(설명서·문서·예시)을 cache_control로 캐시에 묶어 두 번째 호출부터 입력 비용을 최대 90% 아끼고 응답을 빠르게 만드는 법을 익힌다. usage 응답으로 캐시 적중을 숫자로 검증하고 모델별 최소 토큰 기준까지 확인한다._

:::note[학습 목표]
- Claude API 호출에서 '고정된 긴 부분'을 캐시로 묶어 두 번째 호출부터 입력 비용을 최대 90% 아끼는 코드를 작성한다
- usage 응답의 cache_creation_input_tokens·cache_read_input_tokens로 캐시가 실제로 적중했는지 숫자로 검증한다
- 모델별 최소 토큰 기준(Opus·Haiku4.5=4,096 / Sonnet4.6=2,048 / Sonnet4.5=1,024)을 지키고, 1시간 캐시는 베타 헤더+ttl을 함께 넣는다
:::

## 핵심 개념

프롬프트 캐싱은 **'AI에게 매번 똑같이 보내는 긴 앞부분'을 한 번만 저장(write)해 두고, 다음부터는 그 저장본을 싸게 꺼내 쓰는(read)** 방식이에요. 매번 똑같은 육수를 처음부터 끓이는 대신, 어제 끓여 둔 육수를 데워 쓰는 것과 같아요.

- **처음 끓일 때(캐시 쓰기)** 는 평소보다 살짝 비싸요(**1.25배**).
- **데워 쓸 때(캐시 읽기)** 는 아주 싸요(**0.1배 = 10%**).

단, 앞부분이 **글자 하나라도 다르면 '다른 육수'로 취급**돼 캐시가 안 돼요(100% 똑같아야 함). 그래서 **안 바뀌는 부분은 앞에, 매번 바뀌는 부분(사용자 질문)은 뒤에** 두는 게 핵심이에요.

★ 캐시가 되려면 묶는 앞부분이 **'모델별 최소 토큰'** 을 넘어야 해요. 이보다 짧으면 **에러 없이 그냥 캐시가 안 됩니다.**

| 모델 | 최소 토큰 |
| --- | --- |
| Opus 4.5·4.6·4.7·4.8, Haiku 4.5 | 4,096 토큰 |
| Sonnet 4.6 | 2,048 토큰 |
| Sonnet 4.5 (및 이전 4·3.7) | 1,024 토큰 |

캐시는 기본 **5분간 유지**되고, 그 안에 또 부르면 무료로 5분 연장돼요.

### 흐름

> 긴 고정 문맥(설명서·문서) → `cache_control`로 캐시 표시 → 최소길이 충족(Opus·Haiku4.5=4,096 / Sonnet4.6=2,048) → **1번째: 저장 1.25배** → **2번째~: 읽기 0.1배 = 90%↓** → 비용·지연 급감

### 왜 이게 될까?

캐시는 AI 서버 안에 "어제 끓여둔 육수"를 잠깐 보관해두는 것이에요. `system` 리스트에서 `cache_control`이 붙은 블록만 따로 저장(write)해두면, 다음 호출 때 처음부터 다시 계산하지 않고 저장본을 그대로 꺼내(read) 써요. 똑같은 문서를 반복해서 보낼수록 두 번째 호출부터 그 부분 비용이 10%로 뚝 떨어지고 응답도 빨라집니다. 단, 앞부분 글자가 하나라도 바뀌면 "다른 육수" 취급이라 캐시가 깨져요.

## 👀 따라하기 예시 — 사내 규정집(4,096토큰 넘는 긴 문서)을 매번 첨부해 질문

**① system을 리스트로 바꿔 첫 호출** `system`을 리스트로 바꾸고 긴 문서 블록에 `cache_control:{"type":"ephemeral"}`을 붙여 첫 호출 → `Usage(input_tokens=20, cache_creation_input_tokens=4800, cache_read_input_tokens=0, output_tokens=120)`
> 💡 `cache_creation_input_tokens`가 0보다 크다 = 문서가 방금 캐시에 "저장"됐다는 증거. 첫 호출이라 살짝 더 비싼(1.25배) 대신 저장돼요.

**② 5분 안에 똑같이 다시 호출** 코드를 전혀 안 바꾸고 5분 안에 똑같은 질문으로 다시 호출 → `Usage(..., cache_creation_input_tokens=0, cache_read_input_tokens=4800, ...)`
> 💡 `cache_read_input_tokens`에 숫자가 찍힘 = 저장해둔 육수를 데워서 쓴 것(0.1배). 캐시 "적중" 아하 포인트예요.

**③ 바뀌는 값은 messages 쪽에** 오늘 날짜처럼 매번 바뀌는 값은 `system` 말고 `messages`(사용자 메시지) 쪽에 → 두 번째 호출에서도 `cache_read_input_tokens=4800` 그대로 유지
> 💡 캐시 블록은 100% 고정 텍스트여야 해요. 바뀌는 값을 섞으면 매번 "다른 앞부분"이라 적중률이 0%가 돼요.

**④ 30분 간격이면 1시간 캐시로** 30분 간격 호출이면 `extra_headers`에 `anthropic-beta` 헤더 + `ttl:"1h"`를 추가해 1시간 캐시로 → `cache_read_input_tokens`가 30분 뒤에도 4800 유지(기본 5분이었다면 0이었을 것)
> 💡 `ttl`만 넣으면 작동 안 하고, 베타 헤더까지 같이 넣어야 진짜 1시간 캐시예요. 핵심 함정 회피!

**좋은 결과의 기준:** (1) 첫 호출에 `cache_creation_input_tokens > 0` (2) 이후 호출에 `cache_read_input_tokens > 0`이고 `cache_creation`은 0 (3) 매번 바뀌는 값은 캐시 블록 밖에 있어 적중률이 계속 유지된다.

## 단계별 따라하기

1. **API 키 발급** — 캐싱은 채팅창이 아니라 'API 호출'에서 해요. `console.anthropic.com` → 로그인 → Settings → API keys → Create Key → 이름 입력 → Add. `sk-ant-...` 키가 **한 번만** 보이니 메모장에 복사해두세요. 무료 크레딧으로 충분해요(호출당 몇 원).
2. **무료 온라인 코드 실행 환경(설치 0)** — (A) **Google Colab(권장·안전)**: `colab.research.google.com` → '새 노트'(내 드라이브에 비공개 저장, 키 노출 위험 적음). (B) **Replit**: `replit.com` → 'Create Repl' → 'Python'(빠르지만 무료 Repl은 기본 공개). 처음이면 Colab 추천.
3. **라이브러리 설치 + 키 안전하게 넣기** — 키를 코드에 직접 쓰지 말고 '비밀 저장소'에 넣어요. (A) **Colab**: 왼쪽 🔑(Secrets) → 이름 `ANTHROPIC_API_KEY`, 값 붙여넣기 → '노트북 액세스' 켜기. 첫 셀에 `!pip install anthropic`. (B) **Replit**: 왼쪽 자물쇠 Secrets → key `ANTHROPIC_API_KEY`, value `sk-ant-...`.
4. **캐싱 켠 첫 호출 작성(저장이 일어나는 순간)** — `system`을 '리스트'로 만들고 안 바뀌는 긴 텍스트 블록에 `cache_control: {'type':'ephemeral'}`를 붙여요. ★긴 텍스트는 모델 최소 토큰 이상이어야 해요(Opus 4.8은 4,096토큰 ≈ 한글 6,000~8,000자, 영어 약 16,000자). 너무 짧으면 에러 없이 그냥 캐시가 안 돼요.

```python
import anthropic
from google.colab import userdata

client = anthropic.Anthropic(api_key=userdata.get('ANTHROPIC_API_KEY'))
LONG_DOC = "여기에 안 바뀌는 긴 문서를 넣으세요. " * 1200

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=300,
    system=[
        {"type": "text", "text": "너는 친절한 문서 도우미야."},
        {"type": "text", "text": LONG_DOC, "cache_control": {"type": "ephemeral"}},
    ],
    messages=[{"role": "user", "content": "이 문서의 핵심을 3줄로 요약해줘."}],
)
print(resp.content[0].text)
print("usage:", resp.usage)
```

5. **캐시가 실제로 저장됐는지 숫자로 확인** — `usage`의 `cache_creation_input_tokens`가 0보다 큰 값이어야 해요. 0이면 텍스트가 모델 최소 토큰보다 짧은 것 → `LONG_DOC`의 `* 1200` 숫자를 더 키우세요. (정상: `Usage(input_tokens=20, cache_creation_input_tokens=4800, cache_read_input_tokens=0, output_tokens=120)`)
6. **똑같이 한 번 더 실행 → 캐시 적중(read) 확인** — 코드를 바꾸지 말고 다시 실행(5분 안에). `system`의 긴 부분은 글자 하나도 바꾸면 안 돼요. `usage`에서 `cache_read_input_tokens`가 큰 값으로, `cache_creation`은 0으로 바뀌면 성공. 응답 속도도 보통 더 빨라져요. (2번째 정상: `Usage(..., cache_creation_input_tokens=0, cache_read_input_tokens=4800, ...)`)
7. **비용 절감 체감 + 1시간 캐시 옵션(베타 헤더 필수)** — 캐시 읽기는 일반 입력의 **10% 가격**(예: Opus 4.8 입력 100만토큰당 $5 → 캐시 읽기 $0.50). 5분보다 드물게(예: 30분마다) 같은 문맥을 쓴다면 1시간 캐시. ★중요: 1시간 캐시는 `ttl`만 추가하는 걸로는 작동 안 해요. 반드시 (1) `extra_headers={"anthropic-beta":"extended-cache-ttl-2025-04-11"}` 추가하고 (2) 캐시 블록에 `"ttl":"1h"` 넣기. 헤더 없이 `ttl`만 넣으면 기본 5분으로 처리돼요. 1시간 캐시는 저장 비용이 2배지만 더 오래 유지돼요.

## 흔한 실수 → 교정

- ✗ 캐시 표시할 부분이 **모델 최소 토큰보다 짧은데** 에러도 안 떠서 됐다고 착각 → **내 모델의 최소 토큰을 채운다.** Opus 4.5·4.6·4.7·4.8·Haiku 4.5는 4,096, Sonnet 4.6은 2,048, Sonnet 4.5는 1,024. `usage`의 `cache_creation_input_tokens`가 0이면 캐시가 안 된 것.
- ✗ 모델별 최소 토큰을 헷갈려 '왜 캐시가 안 되지?' 헤맴 → **기준은 모델군마다 다르다.** 문서를 기준 이상으로 늘리거나, 더 작은 기준의 모델(예: Sonnet)을 쓴다.
- ✗ 1시간 캐시를 켜려고 `ttl:'1h'`만 추가했는데 여전히 5분 만에 만료 → **`ttl`만으로는 안 켜진다.** `extra_headers={'anthropic-beta':'extended-cache-ttl-2025-04-11'}`를 반드시 함께(헤더 + ttl 둘 다).
- ✗ 매번 바뀌는 값(오늘 날짜·타임스탬프·사용자 이름)을 **캐시한 `system` 안쪽에** 넣음 → 매번 '다른 앞부분'이라 적중 0%. **캐시할 블록은 100% 고정 텍스트만.** 바뀌는 값은 `cache_control` 없는 `messages` 쪽으로.
- ✗ `system`을 그냥 문자열로 두고 `cache_control`을 못 붙임(문자열에는 못 붙음) → **`system`을 `[{...},{...}]` 리스트로** 만들고 캐시할 `text` 블록에만 `cache_control`을 추가한다.
- ✗ 5분이 지난 뒤(혹은 1시간 캐시인데 1시간 뒤) 호출하고 '왜 `cache_read`가 0이냐' 당황 → **기본 캐시 수명은 5분.** 더 띄엄띄엄 쓰면 베타 헤더 + `ttl:'1h'`로 1시간 캐시를 켜거나, 자주 호출되도록 묶는다.

## 도구

- 🛠 **Anthropic Claude API** (console.anthropic.com) — `cache_control`로 프롬프트 캐싱. 모델별 최소 캐시 토큰: Opus 4.5·4.6·4.7·4.8·Haiku 4.5 = 4,096 / Sonnet 4.6 = 2,048 / Sonnet 4.5 = 1,024. 현행 최신 모델 ID 예: `claude-opus-4-8`. 1시간 캐시는 베타 헤더 `extended-cache-ttl-2025-04-11` + `ttl:'1h'` 필요.
- 🛠 **Google Colab** (colab.research.google.com) — 설치 없이 브라우저에서 Python 실행, 노트북이 내 구글 계정에 비공개 저장(권장). 왼쪽 🔑(Secrets)에 `ANTHROPIC_API_KEY`.
- 🛠 **Replit** (replit.com) — 설치 없이 Python 실행. 무료 Repl은 기본 공개라 키 노출 위험(연습용 키를 쓰고 삭제).
- 🛠 **anthropic 파이썬 라이브러리** — `messages.create`로 호출, `usage`(`cache_creation_input_tokens`·`cache_read_input_tokens`)로 캐시 적중을 확인.

## 실전 프롬프트

### 긴 문서/매뉴얼을 캐시로 묶어 반복 질문

```text
긴 문서/매뉴얼을 캐시로 묶어 반복 질문할 때:

```python
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=300,
    system=[
        {"type": "text", "text": "너는 [사내 규정 안내 봇]이야. 아래 문서만 근거로 답하고 문서에 없으면 '문서에 없음'."},
        {"type": "text", "text": """[안 바뀌는 긴 문서 전문 — Opus·Haiku4.5는 4,096토큰↑, Sonnet4.6은 2,048토큰↑]""", "cache_control": {"type": "ephemeral"}},
    ],
    messages=[{"role": "user", "content": "[매번 바뀌는 질문]"}],
)
```
```

> 확인된 작성 예시 없음

`프롬프트 캐싱` `cache_control` `문서 Q&A`

### 여러 예시(few-shot)를 캐시해 분류 작업 싸게 반복

```text
여러 예시(few-shot)를 캐시해 분류 작업을 싸게 반복할 때:

```python
system=[
    {"type": "text", "text": "너는 문의를 카테고리로 분류해. 아래 예시 규칙을 따라."},
    {"type": "text", "text": """예시1: 입력=[...] 정답=[...] ... (예시를 충분히 길게)""", "cache_control": {"type": "ephemeral"}},
]
messages=[{"role": "user", "content": "분류할 새 문의: [내용]"}]
```
```

> 확인된 작성 예시 없음

`프롬프트 캐싱` `few-shot` `분류`

### 1시간 캐시(베타 헤더 필수)

```text
1시간 캐시(베타 헤더 필수) — ttl만으로는 안 되고 베타 헤더 + ttl 둘 다:

```python
# ttl만으로는 안 됨. 베타 헤더 + ttl 둘 다
resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=300,
    extra_headers={"anthropic-beta": "extended-cache-ttl-2025-04-11"},
    system=[
        {"type": "text", "text": "너는 문서 도우미야."},
        {"type": "text", "text": """[긴 고정 문서]""", "cache_control": {"type": "ephemeral", "ttl": "1h"}},
    ],
    messages=[{"role": "user", "content": "[질문]"}],
)
```
```

> 확인된 작성 예시 없음

`프롬프트 캐싱` `ttl` `베타 헤더`

### 캐시 적중 여부 자동 점검

```text
캐시 적중 여부 자동 점검:

```python
u = resp.usage
print("저장(write):", u.cache_creation_input_tokens)
print("읽기(read):", u.cache_read_input_tokens)
if u.cache_read_input_tokens > 0:
    print("✅ 캐시 적중! 비용 90% 절감 중")
elif u.cache_creation_input_tokens > 0:
    print("💾 첫 저장 완료")
else:
    print("⚠️ 캐시 안 됨 — 문맥이 최소 토큰보다 짧음")
```
```

> 확인된 작성 예시 없음

`프롬프트 캐싱` `usage` `검증`

## 직접 만들기 (미션)

:::tip
✍️ 이제 당신 차례! "긴 사용설명서"나 "회사 FAQ 문서" 하나를 4,096토큰(대략 한글 6,000자) 이상으로 준비하고, `system` 리스트의 마지막 블록에 `cache_control:{"type":"ephemeral"}`을 붙여 호출해보세요. 그다음 5분 안에 똑같은 질문을 다시 호출해 `usage`를 비교해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 첫 호출 usage에 cache_creation_input_tokens가 0보다 크게 찍혔나?(0이면 문서가 모델 최소 토큰보다 짧음) | 5 |
| 두 번째 호출에서 cache_read_input_tokens가 찍히고 cache_creation은 0이 됐나? | 5 |
| 매번 바뀌는 값(날짜·이름 등)을 캐시 블록이 아닌 messages 쪽에 뒀나? | 5 |

## 관련 개념

- [Prompt Caching](/concepts/prompt-caching/)
- [Cache Control](/concepts/cache-control/)
- [Ephemeral](/concepts/ephemeral/)
- [Context Window](/concepts/context-window/)
- [Cache Hit](/concepts/cache-hit/)
- [Ttl](/concepts/ttl/)
- [Cost Optimization](/concepts/cost-optimization/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=ai-engineer) · 방식: authenticated-crawl</sub>
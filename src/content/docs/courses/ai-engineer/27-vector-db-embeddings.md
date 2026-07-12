---
title: "벡터DB·임베딩 실습 — 의미검색 직접 구현"
description: "RAG의 엔진인 임베딩과 벡터DB(pgvector·Pinecone)로 \"뜻이 비슷한 것\"을 찾는 의미검색을 직접 만들어 본다."
sidebar:
  order: 27
---
_RAG의 엔진인 임베딩과 벡터DB(pgvector·Pinecone)로 "뜻이 비슷한 것"을 찾는 의미검색을 직접 만들어 본다._

:::note[학습 목표]
- 내 문서 몇 개를 임베딩으로 바꿔 벡터DB(Supabase pgvector)에 넣고, "환불 어떻게 해요?" 같은 질문에 단어가 하나도 안 겹쳐도 가장 뜻이 가까운 문장을 찾아내는 의미검색을 직접 돌려본다. 코드는 다 복붙으로 제공된다. (실습 비용: OpenAI에 최소 5달러 선충전 1회면 수천 번 검색 가능 — 임베딩 단가가 매우 낮다.)
:::

> 내가 만든 챗봇이 "우리 회사 규정"을 물어보면 엉뚱한 소리를 한다. 이유는 단순하다 — AI에게 내 문서를 "뜻으로 찾아 읽는" 능력이 없어서다. 오늘 그걸 30분 만에 직접 만든다.

## 이 레슨에서 만드는 것

내 문서 몇 개를 임베딩으로 바꿔 벡터DB(Supabase pgvector)에 넣고, "환불 어떻게 해요?" 같은 질문에 단어가 하나도 안 겹쳐도 가장 뜻이 가까운 문장을 찾아내는 의미검색을 직접 돌려본다. 코드는 다 복붙으로 제공된다. (실습 비용: OpenAI에 최소 5달러 선충전 1회면 수천 번 검색 가능 — 임베딩 단가가 매우 낮다.)

## 핵심 개념

컴퓨터는 글자를 그냥 "모양"으로만 본다. 그래서 '환불'과 '돈 돌려받기'가 같은 뜻인 걸 모른다. 임베딩(embedding)은 문장을 그 "뜻"을 나타내는 숫자 좌표(예: [0.12, -0.8, ...] 같은 1536개의 숫자)로 바꿔주는 기술이다. 비유하면 모든 문장을 거대한 지도 위의 한 점으로 찍는 것이다 — 뜻이 비슷한 문장은 지도에서 가까운 곳에 모인다. 벡터DB(vector DB)는 이 점들을 저장해두고 "이 질문 점과 가장 가까운 점들"을 순식간에 찾아주는 특수 창고다. 즉 키워드가 아니라 뜻으로 검색하는 것. 이게 바로 챗봇이 내 자료를 보고 답하는 RAG의 심장이다.

### 왜 작동하는가

AI는 수억 개 문장을 학습하면서 '뜻이 비슷한 문장은 숫자로도 비슷하게 찍힌다'는 감각을 익혔어요. 그래서 문장을 임베딩(숫자 좌표)으로만 바꿔주면, '환불'과 '돈 돌려받기'처럼 단어가 하나도 안 겹쳐도 지도 위에서 서로 가까운 점으로 나타나요. 당신은 문장을 넣기만 하면, 뜻으로 가까운 걸 찾아내는 계산은 AI와 pgvector가 대신해줍니다.

## 👀 따라하기 예시

쇼핑몰 FAQ 문장 4개(환불·배송·교환·할인쿠폰)를 벡터DB에 넣고, "돈 돌려받고 싶어요"라고 물었을 때 '환불' 문장을 찾아낼 수 있는지 — 제가 먼저 처음부터 끝까지 해볼게요, 눈으로 따라오세요.

### 1. ① Supabase에 vector 기능 켜고 documents 표 + match_docs 검색 함수 생성

**실제 결과**

```text
Success. No rows returned
```

> 뜻 좌표를 저장하고 비교할 그릇을 먼저 만드는 거예요 — 창고 없이 물건부터 사면 안 되니까요.

### 2. ② ingest.js 실행 — 문장 4개를 OpenAI로 임베딩해서 DB에 저장

**실제 결과**

```text
저장 완료!
```

> '환불은 7일 이내 가능합니다'라는 글자가 [0.12, -0.8, ...] 같은 1536개 숫자로 바뀌어 documents 표에 들어간 순간이에요. 이제 이 문장은 지도 위의 한 점이 됐어요.

### 3. ③ search.js 실행 — "돈 돌려받고 싶어요"를 임베딩해서 match_docs 호출

**실제 결과**

```text
[\n  { content: '환불은 구매 후 7일 이내 영수증 지참 시 전액 가능합니다.', similarity: 0.87 },\n  { content: '교환은 미개봉 상품만 받습니다.', similarity: 0.61 },\n  { content: '배송은 평일 기준 2~3일 걸립니다.', similarity: 0.55 }\n]
```

> 질문에는 '환불'이라는 글자가 단 한 글자도 없는데 1등으로 나왔죠? 단어 매칭이 아니라 뜻 좌표끼리의 거리로 찾았기 때문이에요. 이게 바로 아하 포인트!

### 4. ④ similarity 숫자 확인 — 1등과 나머지 차이 보기

**실제 결과**

```text
1등 0.87 vs 2등 0.61 → 확실한 차이로 '환불'이 가장 가까운 뜻
```

> 숫자가 클수록(1에 가까울수록) 뜻이 더 가깝다는 것만 기억하면, 검색 결과가 맞는지 스스로 감을 잡을 수 있어요.

### 완성 결과

documents 표 안에 뜻 좌표로 저장된 문장 4개와, 질문 한 마디만 던지면 가장 가까운 뜻의 문장 top3를 돌려주는 match_docs 검색기. 좋은 결과의 기준: (1) 질문과 단어가 안 겹쳐도 정답이 1등으로 나온다 (2) 1등 similarity가 나머지보다 확실히 높다 (3) 문서를 늘려도 코드 수정 없이 그대로 작동한다.

## 단계별 따라하기

### 1. 무료 Supabase 프로젝트 만들기 (계정부터)

브라우저에서 supabase.com 접속 → 오른쪽 위 초록색 'Start your project' 버튼 클릭 → GitHub 계정으로 로그인(없으면 즉석에서 무료 가입). 로그인되면 'New project' 버튼 클릭. Name 칸에 'my-search' 입력, Database Password 칸에 비밀번호 아무거나 적고 메모장에 복사해둔다(보관용). Region은 'Northeast Asia (Seoul)' 선택 → 'Create new project' 클릭. 1~2분 로딩되면 완료. 무료 Free 플랜은 카드 없이 가입된다. 막히면: 카드 등록 화면이 떠도 'Free' 플랜이 선택돼 있으면 그대로 진행해도 과금되지 않는다.

[꼭 알아둘 무료 플랜의 한계 — 미리 알면 안 당황한다] ① DB 용량 500MB까지(이번 실습 문장 몇 개는 0.1MB도 안 되니 충분). ② 프로젝트를 1주일(7일) 동안 한 번도 안 쓰면 자동으로 '일시정지(pause)'된다 — 며칠 뒤 다시 접속했는데 연결이 안 되면 당황 말고 대시보드에서 'Restore'(복구) 버튼을 누르면 1~2분 뒤 되살아난다. 데이터는 그대로 보존된다. ③ 무료 프로젝트는 동시에 2개까지만 활성 가능.

**복사·실행 예시**

```text
프로젝트 이름: my-search / Region: Northeast Asia (Seoul) / Plan: Free (DB 500MB·7일 미사용 시 자동 일시정지·복구 가능)
```

### 2. 벡터 기능(pgvector) 켜기

프로젝트 화면이 뜨면 왼쪽 세로 메뉴에서 'SQL Editor' 아이콘(터미널 모양) 클릭 → 가운데 빈 칸이 나오면 거기에 아래 example 코드를 그대로 붙여넣고 오른쪽 아래 초록색 'Run' 버튼 클릭. 'Success. No rows returned'가 뜨면 성공. 이건 '뜻 좌표를 다루는 능력'을 DB에 설치하는 한 줄이다. 막히면: 빨간 에러가 나면 코드에 한글·공백이 섞였는지 확인하고 다시 붙여넣기.

**복사·실행 예시**

```text
create extension if not exists vector;
```

### 3. 문서를 담을 표(table)와 검색 함수 만들기

같은 SQL Editor 화면에서 기존 코드를 지우고 아래 example 전체를 붙여넣은 뒤 'Run' 클릭. documents 표(내용 content + 좌표 embedding 저장)와 match_docs 함수(질문 좌표를 받아 가까운 문장 top N을 돌려주는 검색기)가 한 번에 만들어진다. 'Success'가 뜨면 됨. 주의: vector(1536)의 1536은 4단계에서 쓸 text-embedding-3-small 모델의 좌표 개수와 정확히 같아야 한다.

**복사·실행 예시**

```text
create table documents (
  id bigserial primary key,
  content text,
  embedding vector(1536)
);

create or replace function match_docs(query_embedding vector(1536), match_count int)
returns table(content text, similarity float)
language sql stable as $$
  select content, 1 - (embedding <=> query_embedding) as similarity
  from documents
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### 4. OpenAI 임베딩 키 발급 + 결제수단 등록 (문장→숫자 변환기)

새 탭에서 platform.openai.com 접속 → 로그인/무료가입. [중요·먼저 할 일] 2025년부터 신규 OpenAI 계정에는 무료 크레딧이 제공되지 않는다. 그래서 API를 쓰려면 먼저 결제수단을 등록하고 최소 5달러를 선충전해야 한다 — 왼쪽 메뉴 'Settings → Billing' → 'Add payment method'로 카드 등록 → 'Add to credit balance'에서 5달러 충전(이게 임베딩 비용으로 조금씩 차감된다). 그다음 'API keys' → 'Create new secret key' 클릭 → 이름 'search' 입력 → 'Create' → 화면에 뜬 sk-로 시작하는 긴 키를 즉시 복사해 메모장에 저장(이 창 닫으면 다시 못 봄). 안심되는 점: 임베딩은 단가가 매우 낮다 — text-embedding-3-small은 100만 토큰(대략 한국어 수십만 문장 분량)당 약 0.02달러라, 충전한 5달러로 이 실습은 수천~수만 번 돌려도 거의 안 줄어든다. 막히면: 'You exceeded your quota'나 키가 안 먹으면 십중팔구 결제수단 미등록 또는 잔액 0달러다 → Billing에서 5달러 충전하면 해결.

**복사·실행 예시**

```text
발급된 키 예시: sk-proj-AbC123...(길게 이어짐) — 절대 남에게 보이지 말 것 / 선충전: Billing에서 최소 $5 (무료 크레딧 없음)
```

### 5. 내 문서를 임베딩해서 DB에 넣기 (코드 복붙 실행)

컴퓨터에 Node.js가 없으면 nodejs.org에서 LTS 버전 설치. 바탕화면에 'search'라는 폴더를 만들고 그 안에서 명령창(Mac은 터미널, 윈도우는 PowerShell)을 연다. 폴더로 이동한 뒤 'npm init -y' 입력 후 Enter, 이어서 'npm install openai @supabase/supabase-js' 입력 후 Enter.

[★꼭 필요한 한 단계 — 안 하면 즉시 에러] 아래 코드는 최신 import 문법(ESM)을 쓴다. 그런데 'npm init -y'로 만들어진 package.json은 기본이 옛 문법(CommonJS)이라, 그대로 'node ingest.js'를 실행하면 'SyntaxError: Cannot use import statement outside a module' 에러가 난다. 막으려면 방금 만들어진 package.json 파일을 열어 맨 위 { 바로 아래에 한 줄 "type": "module", 을 추가하고 저장한다(아래 example 마지막의 package.json 예시 참고). 이 한 줄이 'import 문법을 쓰겠다'는 선언이다.

그다음 그 폴더에 ingest.js 파일을 만들어 아래 example 코드를 붙여넣고, 맨 위 세 칸(SUPABASE_URL·SUPABASE_KEY·OPENAI_KEY)을 내 값으로 채운다. SUPABASE_URL과 KEY는 Supabase 화면 왼쪽 'Project Settings → API Keys'에서 복사한다 — URL과, 클라이언트용 공개키(2026년 신규 프로젝트는 'Publishable key'(sb_publishable_...)로 표기되고, 예전 프로젝트는 'anon public' 키로 표기된다. 둘 중 보이는 것을 쓰면 된다). 저장 후 명령창에 'node ingest.js' 입력. '저장 완료!'가 뜨면 성공.

**복사·실행 예시**

```text
// === ingest.js ===
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
const openai = new OpenAI({ apiKey: 'OPENAI_KEY' });
const db = createClient('SUPABASE_URL', 'SUPABASE_KEY');
const docs = [
  '환불은 구매 후 7일 이내 영수증 지참 시 전액 가능합니다.',
  '배송은 평일 기준 2~3일 걸립니다.',
  '교환은 미개봉 상품만 받습니다.',
  '회원 가입 시 첫 구매 10% 할인 쿠폰을 드립니다.'
];
for (const content of docs) {
  const r = await openai.embeddings.create({ model: 'text-embedding-3-small', input: content });
  await db.from('documents').insert({ content, embedding: r.data[0].embedding });
}
console.log('저장 완료!');

// === package.json 에 추가할 한 줄 (★빠뜨리면 import 에러) ===
// {
//   "type": "module",   <- 이 줄을 추가
//   "name": "search", ...
// }
```

### 6. 의미로 검색해보기 (단어가 안 겹쳐도 찾는지 확인)

같은 폴더에 search.js 파일을 만들고 아래 example을 붙여넣어 키 세 칸을 똑같이 채운 뒤 저장(package.json의 "type": "module"은 이미 5단계에서 넣었으니 그대로 적용된다). 명령창에 'node search.js' 입력. '돈 돌려받고 싶어요'라고 물었는데 문서엔 '환불'만 있는데도 환불 문장이 1등으로 나오면 의미검색 성공! 질문 문구(query 변수)를 바꿔가며 여러 번 시험해본다. 막히면: 결과가 비면 5단계 ingest가 실제로 들어갔는지 Supabase의 'Table Editor → documents'에서 행 4개가 보이는지 확인. (며칠 만에 다시 켰는데 연결 오류가 나면 1단계에서 설명한 무료 플랜 자동 일시정지 — 대시보드 'Restore'로 복구.)

**복사·실행 예시**

```text
// === search.js ===
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
const openai = new OpenAI({ apiKey: 'OPENAI_KEY' });
const db = createClient('SUPABASE_URL', 'SUPABASE_KEY');
const query = '돈 돌려받고 싶어요';
const r = await openai.embeddings.create({ model: 'text-embedding-3-small', input: query });
const { data } = await db.rpc('match_docs', { query_embedding: r.data[0].embedding, match_count: 3 });
console.log(data);
```

### 7. (보너스) 언제 더 큰 벡터DB로 갈아탈지 알기

지금은 Supabase pgvector로 충분하다. 단, 무료 플랜은 DB 500MB까지이고(임베딩 1536차원 1개가 약 6KB라, 대략 수만~십수만 문장이면 500MB에 근접하니 그쯤이 무료의 한계 가늠선이다), 7일 미사용 시 자동 일시정지된다는 점만 기억하자. 더 키우려면 두 갈래다. ① 같은 Supabase에서 Pro 플랜($25/월)으로 올리면 용량이 커지고 일시정지가 사라진다(코드 변경 0). ② 문서가 수백만 개로 커지거나 초고속 검색이 필요하면 전용 벡터DB(pinecone.io 등)로 옮긴다 — 개념과 흐름(임베딩→저장→검색)은 똑같고 db.from('documents') 부분만 그 SDK로 바뀐다. 처음엔 갈아탈 필요 없으니 pgvector로 충분히 연습부터.

**복사·실행 예시**

```text
판단 기준: 문서 수만 개·취미/MVP → pgvector 무료(단 500MB·7일 일시정지) / 용량·상시가동 필요 → Supabase Pro $25월 / 수백만 개·초고속 → Pinecone 등 전용 벡터DB
```

## 흔한 실수와 교정
- **실수:** node ingest.js 실행하자마자 'SyntaxError: Cannot use import statement outside a module' 에러가 난다
  - **교정:** npm init -y로 만든 package.json은 기본이 옛 문법(CommonJS)이라 import 문법을 못 읽는다. package.json을 열어 맨 위에 "type": "module", 한 줄을 추가하고 저장한 뒤 다시 실행하라. (한 줄 추가가 싫으면 코드의 import를 const X = require('...')로, export를 module.exports로 바꿔도 된다.)
- **실수:** OpenAI 키를 발급했는데 'You exceeded your quota'가 뜨며 임베딩이 안 된다
  - **교정:** 2025년부터 신규 계정엔 무료 크레딧이 없다. platform.openai.com의 Settings → Billing에서 결제수단을 등록하고 최소 5달러를 선충전해야 API가 작동한다. 임베딩 단가는 매우 낮아(100만 토큰당 약 0.02달러) 5달러로 이 실습은 거의 안 줄어든다.
- **실수:** 임베딩 차원과 표의 vector(숫자)가 안 맞아 에러가 난다
  - **교정:** text-embedding-3-small은 1536차원이다. 3단계에서 만든 표도 vector(1536)이어야 한다. 다른 모델을 쓰면 그 차원에 맞춰 표를 다시 만든다.
- **실수:** 며칠 뒤 다시 켰더니 Supabase 연결이 안 된다
  - **교정:** 무료 플랜은 7일 미사용 시 프로젝트가 자동 일시정지된다. 데이터는 그대로니 당황 말고 Supabase 대시보드에서 'Restore'(복구)를 눌러 1~2분 기다리면 되살아난다. 상시 가동이 필요하면 Pro($25/월)로 올리면 일시정지가 사라진다.
- **실수:** 키워드가 겹치는데도 결과가 이상해서 '의미검색이 안 되네' 한다
  - **교정:** 문서를 통째로 한 덩어리에 넣으면 뜻이 흐려진다. 템플릿1로 한 주제씩 짧게 쪼개 넣어라. 덩어리가 짧고 명확할수록 검색이 정확해진다.
- **실수:** API 키(sk-...)를 코드에 적은 채 GitHub에 올려 키가 새어나간다
  - **교정:** 연습은 괜찮지만 실제 배포 땐 키를 .env 파일에 넣고 코드엔 process.env로 불러라. 키가 노출되면 OpenAI 화면에서 즉시 'Revoke' 후 재발급.
- **실수:** 문서를 한 번 더 실행해 같은 내용이 중복 저장된다
  - **교정:** ingest를 다시 돌리기 전 Supabase 'Table Editor → documents'에서 기존 행을 비우거나, 코드 맨 앞에 await db.from('documents').delete().neq('id', 0)로 비우고 시작하라.

## 완료 체크리스트

- Supabase에서 'create extension vector'가 Success로 떴다
- documents 표와 match_docs 함수가 만들어졌다(Table Editor에서 확인)
- OpenAI에 결제수단을 등록하고 최소 5달러를 충전한 뒤 sk- 키를 메모장에 보관했다
- package.json에 "type": "module"을 추가해 import 에러 없이 node ingest.js가 실행됐다
- node ingest.js 실행 후 documents 표에 문장 행들이 채워졌다
- '돈 돌려받기'로 검색했을 때 단어 안 겹치는 '환불' 문장이 1등으로 나왔다

## 도구

- Supabase (pgvector) — 벡터DB. 문서 좌표 저장과 가까운 점 검색. 무료 플랜은 DB 500MB·7일 미사용 시 자동 일시정지(복구 가능), 상시 가동은 Pro $25/월
- OpenAI Embeddings (text-embedding-3-small, 1536차원) — 문장을 뜻 좌표로 변환. 신규 계정 무료 크레딧 없음(결제수단+최소 $5 선충전 필요), 단가 100만 토큰당 약 $0.02로 매우 저렴
- Node.js (LTS) — 복붙 코드를 내 컴퓨터에서 실행. import 문법을 쓰려면 package.json에 "type": "module" 필요
- Pinecone 등 전용 벡터DB — 문서가 수백만 개로 커지거나 초고속 검색이 필요할 때 갈아탈 선택지(흐름 동일)

## 참고 답안

예: 문장에 '요가는 유연성과 호흡을 함께 훈련합니다'를 넣고, 질문은 '숨쉬기 운동도 되나요?'처럼 완전히 다른 단어로 물어봅니다. ingest.js 실행 → search.js 실행 → 결과 배열의 1등이 요가 문장이면 성공. similarity 0.7 이상이면 꽤 확실한 매칭이에요.

## 실전 프롬프트

### 내 자료를 검색용 문장으로 쪼개는 프롬프트 (ChatGPT/Claude에 붙여넣기)

```text
아래 [내 문서 내용]을 의미검색용으로 잘게 나눠줘. 규칙: ① 한 덩어리는 한 가지 주제만 담는다 ② 각 덩어리는 2~4문장, 그 자체로 뜻이 통하게 ③ 결과는 한 줄에 하나씩, 따옴표로 감싸 JavaScript 배열 형태로 출력 ④ 불필요한 설명·제목·번호는 빼고 배열만.

[내 문서 내용]:
[여기에 규정·FAQ·매뉴얼 텍스트 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `vector-db-embeddings`

### 검색 결과로 진짜 답변까지 만드는 RAG 프롬프트

```text
너는 우리 회사 안내 챗봇이다. 아래 [검색된 근거]만 사용해 [질문]에 한국어로 친절히 답해라. 근거에 없는 내용은 지어내지 말고 '해당 정보는 확인되지 않습니다'라고 말해라.

[질문]: [사용자 질문]
[검색된 근거]: [6단계 search.js 결과의 content들을 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `vector-db-embeddings`

### 임베딩 모델·비용이 헷갈릴 때 물어보는 프롬프트

```text
나는 [한국어 문서 약 N개]를 의미검색하려 한다. OpenAI의 text-embedding-3-small(1536차원, 100만 토큰당 약 $0.02)과 text-embedding-3-large(3072차원, 약 $0.13) 중 비용·정확도 면에서 뭘 쓰는 게 좋을지, 모델을 바꾸면 Supabase 표의 vector(차원) 숫자를 어떻게 맞춰야 하는지 표로 비교해서 알려줘.
```

> 확인된 작성 예시 없음

`eduverse` `vector-db-embeddings`

## 직접 만들기 (미션)

:::tip
이번엔 FAQ 말고 당신의 관심사(취미·업무·좋아하는 게임 등)로 문장 4~5개를 직접 골라 ingest.js의 docs 배열을 바꿔 넣고, 그 단어를 하나도 안 쓴 질문으로 search.js를 돌려서 원하는 문장이 1등으로 나오는지 확인해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 질문 문장에 정답 문서와 겹치는 단어가 하나도 없는데도 1등으로 나왔나? | 5 |
| 1등 similarity와 2등 이하의 차이가 눈에 띄게 크게 벌어졌나? | 5 |
| 문서를 2~3개 더 추가해도 코드 한 줄 안 고치고 그대로 잘 작동했나? | 5 |

## 관련 개념

- [Embedding](/wiki/embedding/)
- [Vector Search](/concepts/vector-search/)
- [Database](/concepts/database/)
- [Data](/concepts/data/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=engineer&node=awti_vector_db_embeddings) · 방식: api-capture</sub>
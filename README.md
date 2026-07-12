# AI Learning Wiki

AI와 대규모 언어 모델의 원리, 용어, 기술을 하이퍼링크로 연결해 설명하는 한국어 백과사전입니다. 검색과 분야별 탐색으로 자유롭게 읽거나, 백과 문서의 선행 관계로 새로 구성한 학습 코스를 순서대로 따라갈 수 있습니다.

## 현재 구성

- 검토 완료 핵심 백과 문서 150개
- 백과 문서 검색 이름·별칭 320개
- AI·LLM 대분류 14개
- 백과 문서만 참조하는 Wiki 학습 코스 8개
- 보존된 기존 실습 자료 305개
- 프롬프트 자료 1,173개
- 전체·최근·무작위 문서와 가나다·영문 용어 색인
- 선행 개념, 관련 문서, 역링크, 포함 코스, 참고 문헌
- 백과·실습·프롬프트 통합 검색

Wiki 학습 코스는 기존 Guide 순서를 사용하지 않습니다. `content-model/paths`의 각 과정은 `content-model/articles`에 있는 백과 문서만 참조합니다. 기존 Guide는 `/explore/`의 자료실로 분리되어 있습니다.

## 시작하기

Node.js 24를 사용합니다.

```bash
npm ci
npm run dev
```

전체 검증과 정적 빌드:

```bash
npm run build
```

## 콘텐츠 구조

- `content-model/articles/`: 독립 백과 문서 원본
- `content-model/paths/`: Wiki 학습 코스 원본
- `content-model/data/`: 기존 305개 실습 자료 원본
- `scripts/build-wiki.mjs`: 백과·분류·코스·색인 생성
- `scripts/validate-wiki.mjs`: 백과 스키마와 참조 검증
- `scripts/test-wiki.mjs`: 검색·그래프·Guide 미참조 검사
- `public/data/wiki-index.json`: 통합 검색과 대문용 색인
- `docs/WIKI_REDESIGN_PLAN.md`: 정보 구조와 단계별 기획
- `docs/WIKI_CONTENT_GUIDE.md`: 백과 문서 작성·검토 기준

## 주요 URL

- `/`: 위키 대문
- `/wiki/{slug}/`: 백과 문서
- `/category/{slug}/`: 분야별 문서
- `/course/{id}/`: Wiki 학습 코스
- `/search/`: 통합 검색
- `/glossary/`: 용어 색인
- `/special/all-pages/`: 전체 문서
- `/special/recent/`: 최근 검토 문서
- `/special/random/`: 무작위 문서
- `/explore/`: 기존 실습 자료실
- `/prompt-explorer/`: 프롬프트 자료실

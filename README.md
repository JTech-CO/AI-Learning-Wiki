# AI Learning Wiki

EduVerse에서 운영 측과 합의된 공개 학습 데이터를 정규화하고 자체 제작 콘텐츠를 결합해, 학습자의 목표와 수준에 맞는 다음 학습을 제안하는 한국어 AI 학습 위키입니다.

## 현재 상태

- 전체 305개 모듈 수집·정규화 완료
- 1,173개 프롬프트 템플릿과 예시 상태 추적
- 537개 핵심 개념 페이지 자동 생성
- 목표·수준·주당 시간 기반 학습 추천
- 로그인 없는 브라우저 로컬 진도 저장
- 학습·프롬프트 검색과 필터
- 스키마, 생성물, 내부 링크, 핵심 경로를 포함한 릴리스 검증
- Node.js 24 GitHub Actions CI

## 시작하기

```bash
npm ci
npm run dev
```

릴리스 가능한 상태를 검증하려면 Node.js 24에서 실행합니다.

```bash
npm run build
```

## 주요 경로

- `content-model/data/`: 정규화된 단일 콘텐츠 원본
- `scripts/crawl/`: 공개 데이터 수집과 정규화
- `scripts/build-pages.mjs`: 문서·개념 페이지 생성
- `scripts/build-app-data.mjs`: 검색·추천용 JSON 생성
- `src/components/`: 학습 추천 및 탐색 UI
- `docs/BUILD.md`: 빌드와 데이터 갱신 방법
- `docs/OPERATIONS.md`: 운영 인수와 배포 체크리스트
- `docs/DATA_SCOPE.md`: 데이터 범위와 출처 원칙

파싱 원본 응답은 `content-model/raw/`에 로컬로만 보관하며 Git에 커밋하지 않습니다. 공개 키와 비밀값도 저장소에 저장하지 않습니다.

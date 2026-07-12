# AI Learning Wiki

EduVerse의 AI 교육 콘텐츠와 자체 제작 데이터를 정규화해, 검색 가능한 AI 지식 위키와 학습자 맞춤 로드맵으로 제공하는 프로젝트입니다.

> 데이터 수집과 이용은 EduVerse 운영 측과 협의된 범위에서 진행합니다. 현재 공개 범위는 확정 전이며, 기본 운영 원칙은 팀/그룹 내부용입니다.

## 현재 상태

- 기준일: 2026-07-12
- 공식 로컬 매니페스트: 시작 코스 8개 + 메인 코스 297개 = 305개
- 정규화 완료: 170개(55.7%)
- 마지막 완료: AI 엔지니어 26번 `임베딩과 코사인 유사도`
- 다음 수집: AI 엔지니어 27번
- 남은 수집: 135개
- 프런트엔드: Astro + Starlight + Pagefind
- 지원 언어: 현재 한국어 원문만 검증됨

세부 진척은 [`content-model/progress.json`](content-model/progress.json), 전체 이관 계획은 [`docs/CODEX_HANDOFF_PLAN.md`](docs/CODEX_HANDOFF_PLAN.md)를 기준으로 합니다.

## 구조

```text
content-model/
  courses.json             코스 매니페스트
  progress.json            기계 판독 가능한 수집 체크포인트
  schema.module.json       모듈 정규 스키마
  schema.course.json       코스 정규 스키마
  data/                    정규화된 모듈 JSON
  raw/                     원문 캡처(기본적으로 Git 제외)
docs/
  ARCHITECTURE.md          시스템 구조
  DATA_SCOPE.md            데이터 이용·수집 범위
  EXTRACTION.md            수집 방식과 정찰 기록
  CODEX_HANDOFF_PLAN.md    0~6단계 완성 계획
scripts/
  build-pages.mjs          정규 JSON → Starlight 문서 생성
  crawl/                   수집 보조 도구와 체크포인트 지침
src/                       Astro/Starlight 애플리케이션
```

## 파이프라인

```text
원문 캡처 → 정규화 JSON → 검증 → 위키 페이지 생성 → Astro 빌드 → 링크·검색 QA
```

원문, 정규 데이터, 생성 페이지, 빌드 산출물은 서로 다른 계층입니다. `src/content/docs/courses`, `concepts`, `prompts.md`는 생성물이므로 직접 편집하지 않습니다.

## 명령

```bash
npm run validate
npm run gen
npm run build
npm run dev
```

## 재개 규칙

1. `content-model/progress.json`을 읽습니다.
2. 해당 코스의 라이브 목록에서 다음 순번과 제목을 대조합니다.
3. 원문을 raw에 저장한 뒤 정규 JSON을 만듭니다.
4. 검증에 통과한 경우에만 progress를 갱신합니다.
5. 한 코스 또는 안전한 작업 묶음마다 커밋합니다.


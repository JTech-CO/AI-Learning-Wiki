# 아키텍처

## 목표

EduVerse의 AI 교육 콘텐츠(입문→실무→빌더→엔지니어→자동화→금융→트렌드, 총 ~297개 모듈)와
프롬프트·로드맵·직무 경로를 한데 모아, **위키피디아/나무위키식으로 "AI에 관한 무엇이든 찾아볼 수 있는"
내부 지식베이스**를 만든다. (현 단계에서 사용자별 문서 편집 기능은 제외.)

## 3계층 구조

```
┌─ 1. 수집(Ingestion) ─────────────────────────────┐
│  운영자 export / 인증 크롤 / API 캡처            │   → docs/EXTRACTION.md
│  scripts/import.mjs 가 원본 → 정규 스키마로 변환  │
└──────────────────────────────────────────────────┘
             │  content-model/*.json (정규 계약)
             ▼
┌─ 2. 콘텐츠 저장소(Content Store) ─────────────────┐
│  코스/모듈/프롬프트/개념(용어집)을 구조화 JSON으로 │
│  버전관리(git). 다국어(ko/en/es/ja/zh).           │
└──────────────────────────────────────────────────┘
             │  scripts/build-pages.mjs
             ▼
┌─ 3. 위키 프론트엔드(Presentation) ────────────────┐
│  Astro Starlight (기본 선택)                      │
│  · 사이드바 로드맵 네비게이션                     │
│  · 전문 검색(Pagefind, 오프라인/내부망 동작)      │
│  · 다국어 i18n 내장                               │
│  · 개념 간 양방향 링크(위키식 backlink)           │
│  · 프롬프트 라이브러리(태그·복사 버튼)            │
└──────────────────────────────────────────────────┘
```

## 스택 선택 근거 (기본값 — 변경 가능)

**Astro Starlight**을 기본으로 제안한다. 내부 지식베이스 요건과 정확히 맞물린다:

| 요건 | Starlight 제공 |
|------|----------------|
| 로드맵식 사이드바 네비 | 자동 사이드바(카테고리=코스, 항목=모듈) |
| 검색 | Pagefind 전문 검색 내장(서버 불필요, 내부망 OK) |
| 다국어(ko/en/es/ja/zh) | i18n 1급 지원 |
| 위키식 문서 | MDX + 컴포넌트, 개념 링크 |
| 내부 배포 | 정적 빌드 → 어디든 호스팅(사내 서버/사설) |
| 편집 진입장벽 낮음 | 콘텐츠는 그냥 파일 → 나중에 편집 기능 확장 용이 |

대안: Docusaurus(유사, React 기반), Next.js(직접 구축, 유연하나 공수 큼), MkDocs Material(파이썬 기반).
확정 전이라 아직 의존성은 설치하지 않았다.

## 콘텐츠 모델

원자 단위는 **모듈**([schema.module.json](../content-model/schema.module.json)). 코스는 컨테이너([schema.course.json](../content-model/schema.course.json)).
위키성(navigability)을 위해 모듈은 `concepts[]`로 용어집 개념과 연결되고, 이것이 문서 간 상호 링크를 만든다.

## 현재 상태

- [x] 대상 사이트 정찰 및 추출 아키텍처 확정
- [x] 정규 콘텐츠 스키마 설계(module/course) + 예시
- [x] 코스 매니페스트(7개 코스)
- [x] 콘텐츠 접근 방식 결정 → **방식 B(인증 크롤)** 채택
- [x] Starlight 사이트 구축 + 페이지 생성기(`scripts/build-pages.mjs`) + 다국어/검색/사이드바 — **빌드 통과(66페이지)**, 예시 데이터로 렌더 검증 완료
- [ ] **브라우저 연결 + eduverse 로그인** ← 현재 blocker (방식 B 전제)
- [ ] API 엔드포인트 recon → `scripts/normalize.mjs` 작성 (`scripts/crawl/PLAN.md`)
- [ ] 전체 콘텐츠 수집 → 정규화 → 빌드

## 렌더 파이프라인 (검증됨)

```
content-model/data/**/*.module.json  ─┐
content-model/courses.json           ─┼─▶ scripts/build-pages.mjs ─▶ src/content/docs/** (MD, 다국어)
                                       │                              └─▶ astro build ─▶ dist/ (검색 포함 정적 사이트)
```
데이터가 없으면 `content-model/examples/` 로 대체해 스캐폴드를 검증한다(현재 상태).
미리보기: `npm run dev` → http://localhost:4321

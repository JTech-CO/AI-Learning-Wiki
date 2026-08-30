# AI Learning Wiki

> **AI와 LLM의 개념·기술·용어를 근거 중심 문서와 학습 경로로 연결한 한국어 백과사전**

**현재 버전:** v1.3.0 · **최종 콘텐츠 검토:** 2026-08-30 · **최종 기능 업데이트:** 2026-08-30 · [업데이트 기록](UPDATES.md)

## 1. 소개 (Introduction)

AI Learning Wiki는 인공지능과 대규모 언어 모델을 처음 접하는 학습자부터 실무자까지 필요한 개념을 직접 검색하고, 연결 문서를 따라가며, 목적별 학습 코스로 익힐 수 있도록 만든 정적 웹 위키다.

각 문서는 독립적인 백과 항목으로 열람할 수 있으며, 관련 개념·상위 및 하위 문서·권장 학습 순서·참고 출처를 하이퍼링크로 연결한다. 특정 코스를 선택하지 않아도 전체 문서, 분야별 분류, 전체 문서(색인)와 통합 검색을 통해 자유롭게 탐색할 수 있다.

**주요 기능**

- AI·LLM 14개 핵심 분야를 포함한 총 1,676개 검토 완료 백과 문서 제공
- 문서 간 관련 개념과 선후 학습 관계를 연결한 위키형 탐색
- 학습 목적과 난이도에 따라 문서를 순서대로 안내하는 27개 추천 코스
- 띄어쓰기·초성·약어·별칭을 지원하고 분야·코스·작성 예시로 좁히는 통합 검색
- 55개 통제 태그로 정리한 1,500개 프롬프트와 120개 코드·설정 자료 검색
- 학습 경로, 분류·RAG 평가, 모델·KV 캐시, 토큰·문맥 예산과 프롬프트·JSON Schema를 다루는 6개 AI 실험실
- 전체 문서(색인), 최근 검토 문서와 무작위 문서 제공
- 최근 문서·북마크·읽음·코스 진도·이어보기를 브라우저에만 저장하는 내 학습 기능
- 변수 입력·완성본 비교·로컬 테스트·Markdown·JSON Schema·YAML 검증을 제공하는 프롬프트 워크벤치
- 핵심 100개 문서의 개념·순서·계산·사례형 구조화 학습 체크
- 문서별 참고 자료와 근거 링크, 자동 스키마·링크·렌더링 검증
- 검토 주기, 근거 도달성, 연결 무결성과 정적 빌드를 한 화면에서 확인하는 편집 품질 대시보드
- 주간 최신성·출처·프로덕션 경로 상태를 기록하는 유지보수 보고서

**현재 콘텐츠 현황 (2026-08-30)**

| 구분 | 수량 |
|---|---:|
| 검토 완료 백과 문서 | 1,676개 |
| 학습 코스 | 27개 |
| 프롬프트 | 1,500개 |
| 코드·설정 자료 | 120개 |

## 2. 기술 스택 (Tech Stack)

- **Frontend:** Astro 7, Starlight 0.41, MDX, JavaScript, CSS
- **Content / Data:** Markdown·MDX, JSON, JSON Schema, Ajv
- **Backend:** 별도 서버 없음 — 정적 사이트 생성 방식
- **State Management:** 서버 계정 없음 - 검색은 정적 데이터, 개인 학습 상태와 워크벤치는 브라우저 `localStorage` 사용
- **Validation:** Node.js 기반 콘텐츠·출처·내부 링크·렌더링 검증 스크립트
- **Deployment:** GitHub Pages, GitHub Actions

## 3. 설치 및 실행 (Installation & Usage)

### 요구 사항

- Node.js 22.12 이상 25 미만 — Node.js 24 권장
- npm

### 1. 설치 (Installation)

```bash
git clone https://github.com/JTech-CO/AI-Learning-Wiki.git
cd AI-Learning-Wiki
npm ci
```

필수 환경 변수는 없다. 배포 주소를 바꾸는 경우 origin은 `SITE_URL`, 하위 경로는 `BASE_PATH`로 지정한다. 기본 프로덕션 값은 사용자 지정 도메인 `https://ai-wiki.kr`와 루트 경로 `/`다.

### 2. 개발 서버 실행 (Run)

```bash
npm run dev
```

기본 주소는 [http://localhost:4321](http://localhost:4321)이다.

### 3. 전체 검증 및 프로덕션 빌드 (Build)

```bash
npm run build
```

콘텐츠, 분류 체계, 출처, 내부 링크, 렌더링 결과를 검증한 뒤 정적 결과물을 `dist/`에 생성한다.

## 4. 폴더 구조 (Project Structure)

```text
AI-Learning-Wiki/
├─ content-model/
│  ├─ articles/          # 1,676개 백과 문서 원본
│  ├─ paths/             # 추천 학습 코스 정의
│  ├─ labs/              # AI 실험실 도구 계약과 고정 입력
│  └─ data/              # 프롬프트·보조 콘텐츠 데이터
├─ public/
│  ├─ data/              # 브라우저용 검색·색인 데이터
│  └─ logo.png           # 사이트 로고·파비콘
├─ scripts/              # 생성·검증·품질 점검 자동화
├─ src/
│  ├─ components/wiki/   # 위키 헤더·사이드바·푸터
│  ├─ components/learning/ # 구조화 학습 체크
│  ├─ content/docs/      # 빌드된 페이지와 정책 문서
│  └─ styles/            # 위키 UI 스타일
├─ astro.config.mjs
└─ package.json
```

## 5. 정보 (Information)

- **Service:** [AI Learning Wiki](https://ai-wiki.kr/)
- **Privacy:** [개인정보 처리방침](https://ai-wiki.kr/privacy-policy/)
- **Terms:** [이용약관](https://ai-wiki.kr/terms-of-use/)
- **Updates:** [업데이트 기록](UPDATES.md)
- **License:** 별도 오픈소스 라이선스가 지정되지 않았으며, 저작권은 각 권리자에게 있다.
- **Contact:** [GitHub Issues](https://github.com/JTech-CO/AI-Learning-Wiki/issues)

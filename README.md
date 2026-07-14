# AI Learning Wiki

> **AI와 LLM의 개념·기술·용어를 근거 중심 문서와 학습 경로로 연결한 한국어 백과사전**

## 1. 소개 (Introduction)

AI Learning Wiki는 인공지능과 대규모 언어 모델을 처음 접하는 학습자부터 실무자까지 필요한 개념을 직접 검색하고, 연결 문서를 따라가며, 목적별 학습 코스로 익힐 수 있도록 만든 정적 웹 위키입니다.

각 문서는 독립적인 백과 항목으로 열람할 수 있으며, 관련 개념·상위 및 하위 문서·권장 학습 순서·참고 출처를 하이퍼링크로 연결합니다. 특정 코스를 선택하지 않아도 전체 문서, 분야별 분류, 용어 색인과 통합 검색을 통해 자유롭게 탐색할 수 있습니다.

**주요 기능**

- AI·LLM 14개 분야, 분야별 100개씩 총 1,400개 백과 문서 제공
- 문서 간 관련 개념과 선후 학습 관계를 연결한 위키형 탐색
- 학습 목적에 따라 문서를 순서대로 안내하는 8개 추천 코스
- 1,173개 실전 프롬프트를 검색·분류할 수 있는 프롬프트 자료실
- 전체 문서, 최근 검토 문서, 무작위 문서, 용어 색인 제공
- 문서별 참고 자료와 근거 링크, 자동 스키마·링크·렌더링 검증

## 2. 기술 스택 (Tech Stack)

- **Frontend:** Astro 7, Starlight 0.41, MDX, JavaScript, CSS
- **Content / Data:** Markdown·MDX, JSON, JSON Schema, Ajv
- **Backend:** 별도 서버 없음 — 정적 사이트 생성 방식
- **State Management:** 별도 상태 관리 라이브러리 없음 — 브라우저 내 정적 검색 데이터 사용
- **Validation:** Node.js 기반 콘텐츠·출처·내부 링크·렌더링 검증 스크립트
- **Deployment:** OpenAI Sites, GitHub

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

필수 환경 변수는 없습니다. 배포 환경의 canonical URL을 바꾸려면 선택적으로 `SITE_URL`을 지정할 수 있습니다.

### 2. 개발 서버 실행 (Run)

```bash
npm run dev
```

기본 주소는 [http://localhost:4321](http://localhost:4321)입니다.

### 3. 전체 검증 및 프로덕션 빌드 (Build)

```bash
npm run build
```

콘텐츠, 분류 체계, 출처, 내부 링크, 렌더링 결과를 검증한 뒤 정적 결과물을 `dist/`에 생성합니다.

## 4. 폴더 구조 (Project Structure)

```text
AI-Learning-Wiki/
├─ content-model/
│  ├─ articles/          # 1,400개 백과 문서 원본
│  ├─ paths/             # 추천 학습 코스 정의
│  └─ data/              # 프롬프트·보조 콘텐츠 데이터
├─ public/
│  ├─ data/              # 브라우저용 검색·색인 데이터
│  └─ logo.png           # 사이트 로고·파비콘
├─ scripts/              # 생성·검증·품질 점검 자동화
├─ src/
│  ├─ components/wiki/   # 위키 헤더·사이드바·푸터
│  ├─ content/docs/      # 빌드된 페이지와 정책 문서
│  └─ styles/            # 위키 UI 스타일
├─ astro.config.mjs
└─ package.json
```

## 5. 정보 (Information)

- **Service:** [AI Learning Wiki](https://ai-learning-wiki.bryan131.chatgpt.site/)
- **Privacy:** [개인정보 처리방침](https://ai-learning-wiki.bryan131.chatgpt.site/privacy-policy/)
- **Terms:** [이용약관](https://ai-learning-wiki.bryan131.chatgpt.site/terms-of-use/)
- **License:** 별도 오픈소스 라이선스가 지정되지 않았으며, 저작권은 각 권리자에게 있습니다.
- **Contact:** [GitHub Issues](https://github.com/JTech-CO/AI-Learning-Wiki/issues)

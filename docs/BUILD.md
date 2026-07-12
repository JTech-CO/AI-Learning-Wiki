# 빌드와 검증

## 지원 환경

- Node.js 24 LTS (`.node-version`, `.nvmrc` 포함)
- npm 11 이상
- Node.js 25는 현재 Astro 도구 체인과 호환 대상이 아니므로 사용하지 않는다.

## 로컬 실행

```bash
npm ci
npm run dev
```

전체 릴리스 검증은 다음 한 명령으로 실행한다.

```bash
npm run build
```

이 명령은 콘텐츠 스키마 검증, 탐색용 JSON 생성, Markdown 페이지 생성, 생성 결과 검증, Astro 정적 빌드, 필수 경로 스모크 테스트, 내부 링크 검사, 릴리스 QA를 순서대로 수행한다.

실제 배포 URL을 sitemap과 canonical URL에 반영하려면 빌드 시 `SITE_URL`을 지정한다.

```bash
SITE_URL=https://wiki.example.com npm run build
```

## 데이터 갱신

운영 측과 합의된 공개 데이터만 수집한다. 런타임에서 공개 설정을 찾으며 인증 키를 저장소에 기록하지 않는다.

```bash
npm run fetch:eduverse
npm run normalize:eduverse
npm run validate:complete
npm run build
```

원본 응답은 `content-model/raw/`에 보관되며 Git에서 제외된다. 추적 가능한 해시와 수량은 `content-model/raw-manifest.json`에 기록한다.

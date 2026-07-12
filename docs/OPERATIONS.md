# 운영 인수 가이드

## 콘텐츠의 기준점

`content-model/data/**/*.module.json`이 단일 원본이다. `src/content/docs/courses`, `src/content/docs/concepts`, `public/data`는 생성물이며 직접 편집하지 않는다.

현재 기준 수량은 다음과 같다.

- 과정 8개
- 모듈 305개
- 프롬프트 1,173개
- 개념 537개

## 갱신 절차

1. `npm run fetch:eduverse`로 합의된 공개 데이터를 갱신한다.
2. `npm run normalize:eduverse`로 신규 레슨을 모듈 스키마로 변환한다.
3. 사람이 제목, 요약, 개념, 출처, 프롬프트 예시를 검토한다.
4. `npm run validate:complete`로 305개 완결 조건을 확인한다.
5. `npm run build`로 전체 사이트와 링크를 검증한다.
6. `content-model/raw-manifest.json`의 시각, 수량, 해시를 검토하고 커밋한다.

## 개인화 데이터

로그인 서버는 없다. 목표와 진도는 브라우저 `localStorage`의 `aiwiki-profile-v1`, `aiwiki-progress-v1`에만 저장된다. 키 구조를 변경할 때는 이전 버전을 읽는 마이그레이션을 먼저 추가한다.

## 배포 전 확인

- Node.js 24에서 `npm ci && npm run build` 성공
- CI 통과
- `SITE_URL`이 실제 공개 주소로 설정됨
- 운영 측 파싱 범위와 이용 조건에 변화가 없음
- 최신 동향 2개 모듈의 공식 출처와 날짜가 여전히 유효함

호스팅 제공자와 공개 도메인이 정해지기 전에는 자동 배포하지 않는다. 정해진 뒤 `SITE_URL`을 환경 변수로 넣고 `dist/`를 정적 호스팅에 배포한다.

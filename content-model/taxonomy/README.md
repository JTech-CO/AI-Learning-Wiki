# W0 분류·표제어 원장

이 디렉터리는 AI Learning Wiki의 문서 확장 범위를 고정한다.

- `categories.json`: 14개 주 분류와 하위 영역별 100개 할당량
- `seed/*.tsv`: 분야별 표제어 후보 원본. `id`, 한국어 표제어, 영어 표제어, 하위 영역, 변동성 순서다.
- `topic-ledger.json`: 생성·검증된 1,400개 통합 원장
- `terminology.json`: 한국어 표기와 번역 원칙
- `source-policy.json`: 외부 자료원별 허용 용도와 라이선스 처리
- `quality-policy.json`: 문서 등급과 검토 기준

표제어는 한 개의 `primaryCategory`에서만 수량에 포함된다. 다른 분야와의 관계는 실제 문서 작성 단계에서 보조 분류와 내부 링크로 표현한다.

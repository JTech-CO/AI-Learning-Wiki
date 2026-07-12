# AI Learning Wiki 확장 정책 — W0

## 목표와 계산 방식

기존 14개 주 분류마다 `primaryCategory` 기준으로 문서 100개를 확보한다. 한 문서는 주 분류 한 곳에서만 수량에 포함되며, 다른 분야와의 관계는 보조 분류와 내부 링크로 표현한다. 목표는 총 1,400개이고 기존 150개를 포함하므로 신규 후보는 1,250개다.

각 분야는 핵심 20개, 표준 50개, 보조 30개로 나눈다. 핵심 문서는 6,000~12,000자, 표준 문서는 3,500~7,000자, 보조 문서는 2,000~4,000자의 한국어 본문을 목표로 한다. 분량만 채우는 공통 문구를 금지하며, 분야별로 필요한 5~8개 구획을 선택한다.

## 표제어 선정

표제어는 정의 가능한 개념, 방법, 구조, 지표, 표준 또는 기술사적으로 중요한 체계여야 한다. 제품·회사·모델명을 문서 수를 채우기 위해 추가하지 않는다. 고유 구현이 분야의 표준 용어가 되었거나 후속 연구에 지속적으로 인용되는 경우에만 독립 표제어로 둔다.

별칭과 번역 차이는 새 문서로 세지 않는다. 한국어 제목은 `terminology.json`을 따르고, 페이지 제목은 한국어 표제어 뒤에 영어 표제어를 이어 쓴다.

## 출처 원칙

문서 작성 전에 독립 자료원 계열 3개 이상과 1차 자료 1개 이상을 묶는다. 위키백과와 영문 Wikipedia는 합쳐서 한 자료원 계열로 계산한다. Wikimedia 자료는 화면 파싱 대신 공식 MediaWiki API를 사용하고 페이지 ID와 판 ID를 기록한다.

Wikipedia 문장을 기본 본문으로 복제하거나 근접 번역하지 않는다. 내용을 직접 각색해야 하는 경우에는 CC BY-SA 4.0의 저작자 표시와 동일조건을 준수한다.

Grokipedia는 xAI Community License가 적용되고 일부 문서만 CC BY-SA 4.0일 수 있으므로 본문 자동 수집 대상에서 제외한다. 누락된 표제어나 상반된 관점을 발견하는 보조 자료로만 사용하고 모든 주장은 별도 1차 자료로 다시 확인한다.

논문은 원 논문과 버전을 인용한다. arXiv는 메타데이터 API로 사용하고 논문별 라이선스를 별도로 확인한다. ACL Anthology는 2016년 이후 ACL 자료의 CC BY 4.0과 이전 자료의 CC BY-NC-SA 3.0을 구분한다. Semantic Scholar와 OpenReview 같은 학술 색인은 후보 발견에만 쓰며 독립 근거로 계산하지 않는다.

표준·공식 명세·공식 문서는 버전 고정 주소를 우선한다. 제품 문서는 해당 제품의 동작을 설명하는 근거로만 사용하고, 마케팅 주장을 독립적인 성능 근거로 사용하지 않는다.

## 문서 검토 기준

모든 사실 구획은 출처 참조를 가져야 한다. 수치, 날짜, 벤치마크 결과, 법률, 제품 사양과 버전별 동작은 문장 단위로 출처를 연결한다. 문서마다 관련 문서 3개 이상을 연결하고, 루트 개념이 아닌 경우 선행 개념을 지정한다.

안전·법률·빠르게 변하는 문서는 전수 수동 검토한다. 그 밖의 배치는 최소 10%를 수동 표본 검토한다. 검토 주기는 evergreen 730일, periodic 180일, fast-changing 60일이다. 스키마, 출처 다양성, 인용 범위, 용어, 문구 중복, 내부·외부 링크 검사를 모두 통과한 `reviewed` 문서만 공개한다.

## 기준 자료

- Wikimedia 이용 약관: https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use/en
- MediaWiki Action API: https://www.mediawiki.org/wiki/API:Quick_start_guide
- xAI 이용 약관의 Grokipedia License: https://x.ai/legal/terms-of-service
- arXiv API: https://info.arxiv.org/help/api/index.html
- ACL Anthology 저작권: https://aclanthology.org/faq/copyright/
- NIST AI RMF: https://www.nist.gov/itl/ai-risk-management-framework
- OWASP GenAI Security Project: https://genai.owasp.org/
- Model Context Protocol 최신 명세: https://modelcontextprotocol.io/specification/2025-11-25

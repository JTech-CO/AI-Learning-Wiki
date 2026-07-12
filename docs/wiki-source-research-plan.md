# AI Learning Wiki 출처 조사 계획 — W1

W1은 1,400개 표제어마다 실제 문서를 쓰기 전에 필요한 출처 발견 경로와 검토 단위를 고정한다. 외부 백과나 논문의 본문을 저장하거나 자동 번역하지 않는다. 저장 대상은 표제어, 정규 URL, 페이지·리비전 식별자, 발행처, 접근 시각, 라이선스 메모와 조사 상태다.

## 조사 카드

모든 표제어에는 한국어·영어 Wikipedia 검색 경로, Wikidata 검색 경로, arXiv·Crossref·OpenAlex 논문 검색 경로, 분야별 권위 출처 앵커가 배치된다. 권위 출처 앵커는 조사 시작점이며 그 자체로 해당 표제어의 근거로 간주하지 않는다. 작성자는 표제어와 직접 관계된 페이지·논문·명세를 열어 주장별로 검증해야 한다.

Wikimedia 메타데이터는 공식 MediaWiki Action API로만 수집한다. 정확히 일치하거나 리다이렉트된 페이지에 한해 페이지 ID, 리비전 ID, 리비전 시각, 정규 URL, Wikidata 항목 ID를 기록한다. 일치하지 않는 표제어는 누락으로 남기고 검색 결과를 임의로 채택하지 않는다.

## 제작 순서

조사 작업은 56개 배치로 나눈다. 각 14개 분야에서 기존 150개 문서 보강, 핵심 후보, 표준 후보, 간략 후보 순으로 진행한다. 안전 분야와 빠르게 변하는 표제어는 전수 수동 검토하며, 나머지는 배치마다 최소 10%를 수동 표본 검토한다.

최종 문서의 근거 기준은 W0 정책을 그대로 적용한다. 독립 출처 계열 3개 이상, 1차 자료 1개 이상, 백과 계열 1개 이상이 필요하다. Wikipedia의 한국어판과 영어판은 하나의 출처 계열로 계산하고, Grokipedia는 누락·논쟁점 발견에만 사용하며 근거 수에는 포함하지 않는다.

## 공식 조사 인터페이스

- MediaWiki Action API: https://www.mediawiki.org/wiki/API:Action_API
- Wikidata 데이터 접근: https://www.wikidata.org/wiki/Help:Data_access
- arXiv API: https://info.arxiv.org/help/api/index.html
- Crossref REST API: https://www.crossref.org/documentation/retrieve-metadata/rest-api/
- OpenAlex API: https://developers.openalex.org/

W1 산출물은 문서 본문이 아니라 재현 가능한 조사 원장이다. 이후 단계에서 실제 근거가 확정되면 출처 후보를 검증 완료 상태로 승격하고, 주장·구획 단위 인용과 연결한다.

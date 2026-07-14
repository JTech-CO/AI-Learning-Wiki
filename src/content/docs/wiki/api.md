---
title: "API Application Programming Interface"
description: "소프트웨어 구성 요소가 정해진 규약으로 기능과 데이터를 요청·교환하는 인터페이스다."
tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 }
---

<p class="wiki-lead">소프트웨어 구성 요소가 정해진 규약으로 기능과 데이터를 요청·교환하는 인터페이스다.</p>

<div class="wiki-document-meta">분류: [API·SDK·도구 호출](/category/api/) · 문서 상태: 문장 단위 근거 검토 완료 · 최근 검토: 2026-07-12</div>

## 개요와 핵심 정의

소프트웨어 구성 요소가 정해진 규약으로 기능과 데이터를 요청·교환하는 인터페이스다.

‘API’ 개념은 API·SDK·도구 호출 영역에서 무엇을 계산하거나 통제하는지 설명하는 표제어다. 이름을 외우는 데서 멈추지 않고 입력, 변환 과정, 출력, 적용 조건을 분리해 보면 제품과 논문마다 다른 표현을 같은 원리 위에서 비교할 수 있다. API 분야는 모델과 데이터, 도구를 소프트웨어 계약으로 안전하게 연결하는 방법을 다룬다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 배경과 설명 범위

한국어 위키백과의 ‘API’ 표제어를 대조해 용어의 일반적 범위와 인접 개념을 확인했다. 외부 백과의 문장을 복제하지 않고, 아래 1차 자료와 내부 개념 그래프를 기준으로 한국어 설명을 다시 구성했다.

이 문서에서 다루는 범위는 안정적인 개념과 구현 원리다. 최신 모델명·가격·한도처럼 자주 바뀌는 정보는 포함하지 않으며, 실제 사용 시점에는 연결된 공식 문서와 배포 환경의 버전을 다시 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a></div>

## 작동 원리

API는 요청 형식과 엔드포인트, 인증, 응답 스키마, 오류 규칙을 계약으로 정의해 서로 다른 소프트웨어가 기능을 호출하게 한다.

직접 요구되는 선행 문서는 없지만, 정의와 입력·출력 범위를 먼저 확인한다. 이 선행 관계를 기준으로 어느 단계에서 값이 만들어지고 다음 구성 요소로 어떻게 전달되는지 추적하면, 비슷한 용어를 기능 이름만으로 혼동하는 일을 줄일 수 있다.

**HTTP 계약으로서의 API**

웹 API에서 요청은 메서드, 주소, 헤더, 본문으로 구성되고 응답은 상태 코드, 헤더, 본문으로 돌아온다. 메서드는 단순한 동사 이름이 아니라 안전성과 멱등성 같은 기대를 전달한다. 조회 요청은 외부 상태를 바꾸지 않는다는 전제 아래 캐시와 재시도를 설계할 수 있고, 멱등한 변경 요청은 같은 호출이 반복되어도 의도한 최종 상태가 같아야 한다. 네트워크 시간 초과가 발생하면 서버가 요청을 처리했는지 클라이언트가 알 수 없는 경우가 있으므로, 결제나 작업 생성에는 요청 식별자와 중복 방지 규칙이 필요하다. 성공 응답 본문만 정의하고 오류 상태를 생략하면 실제 통합에서 가장 중요한 복구 동작을 결정할 수 없다.

OpenAPI 문서는 경로별 연산, 매개변수 위치, 요청 본문 스키마, 가능한 응답과 보안 방식을 기계가 읽을 수 있게 기술한다. 이 계약에서 클라이언트 코드, 입력 검증, 문서, 모의 서버를 만들 수 있지만 명세가 실제 서버와 일치한다는 보장은 없다. 배포 파이프라인에서 구현과 명세의 차이를 시험하고, 호환성을 깨는 변경을 감지해야 한다. 스키마는 값의 자료형만이 아니라 필수 여부, 허용 범위, 열거형, 포맷과 추가 필드 처리 정책을 포함한다. 생성형 AI가 API를 도구로 사용할 때도 모델에게 자유 형식 설명만 주는 것보다 이 구조를 축약해 제공하고 실행 전에 독립 검증하는 편이 안전하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 구성 요소와 처리 흐름

실제 시스템에서는 ‘API’ 개념만 독립적으로 동작하지 않는다. [REST API](/wiki/rest-api/), [SDK](/wiki/sdk/) 문서와 이어서 보면 데이터 준비, 모델 계산, 출력 제어, 운영 검증 중 어느 위치에 놓이는지 확인할 수 있다.

처리 흐름을 문서화할 때는 입력 형식, 파라미터와 기본값, 실패 조건, 출력 스키마, 관측 가능한 지표를 함께 적는다. 이렇게 해야 같은 이름을 쓰는 서로 다른 라이브러리와 서비스의 동작 차이를 재현 가능한 방식으로 비교할 수 있다.

**자원·버전·오류 모델**

경로는 내부 함수 이름보다 사용자가 다루는 자원을 중심으로 설계한다. 식별 가능한 자원, 자원의 목록, 하위 관계를 일관되게 표현하면 클라이언트가 주소만 보고도 범위를 예측할 수 있다. 페이지네이션은 오프셋 방식과 커서 방식의 정렬 안정성이 다르며, 필터와 정렬 기준이 바뀌면 같은 페이지를 다시 읽거나 항목을 건너뛸 수 있다. 응답에는 다음 페이지를 요청할 정보와 정렬 기준을 명시한다. 장시간 작업은 연결을 오래 유지하기보다 작업 자원을 만들고 상태를 조회하거나 콜백을 받는 형태로 분리할 수 있다.

버전 관리는 주소에 숫자를 붙이는 일보다 기존 소비자가 기대하는 계약을 지키는 일이다. 선택 필드 추가는 대체로 호환 가능하지만, 필수 필드 추가·자료형 변경·열거형 축소·의미 변경은 기존 코드를 깨뜨릴 수 있다. 폐기 예정 기능에는 공지, 사용량 관찰, 병행 운영 기간과 종료 기준이 필요하다. 오류 응답은 사람이 읽는 메시지 외에 안정적인 오류 코드, 관련 필드, 재시도 가능 여부, 추적 식별자를 포함한다. 서버 내부 예외나 비밀 값은 노출하지 않으면서도 운영자가 같은 사건을 찾을 수 있어야 한다. 인증 실패, 권한 부족, 자원 부재, 충돌, 속도 제한을 하나의 일반 오류로 합치면 클라이언트가 안전한 대응을 고를 수 없다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 활용 분야와 선택 기준

웹 서비스, 자동화, 구조화 출력, 이벤트 연동과 클라이언트 라이브러리 구현에 사용한다. ‘API’ 개념을 도입할 때는 기대 효과를 품질, 지연 시간, 처리량, 메모리, 비용, 안전성 중 측정 가능한 항목으로 바꾼다. 그다음 단순한 기준선과 비교해 개선 폭과 추가 복잡도를 함께 기록한다.

선택 기준은 “널리 쓰인다”가 아니라 현재 데이터와 사용자의 실패 비용을 얼마나 줄이는가이다. 오프라인 실험, 작은 실제 트래픽, 배포 후 모니터링 순으로 증거를 쌓는 편이 안전하다.

**API 형식 선택 기준**

동기식 요청·응답은 결과가 빠르게 끝나고 호출자가 연결을 유지할 수 있을 때 단순하다. 시간이 오래 걸리거나 재처리가 필요한 작업은 작업 식별자를 반환한 뒤 상태를 조회하는 비동기 패턴이 적합하다. 서버가 사건을 밀어줘야 하면 웹훅, 서버 전송 이벤트, 웹소켓을 고려하지만 전달 보장과 재연결, 순서, 서명 검증을 별도로 설계한다. 대량 데이터는 수천 번의 작은 호출보다 배치나 스트리밍이 효율적일 수 있다. 형식은 유행이 아니라 데이터 크기, 지연 요구, 실패 복구와 소비자 환경으로 결정한다.

조직 내부 API도 외부 API와 같은 계약 규율이 필요하다. 네트워크 경계가 내부라고 호출자가 동시에 배포되거나 신뢰할 수 있다는 뜻은 아니다. 공용 스키마와 SDK가 편리해도 특정 언어 구현에 서버 의미가 묶이지 않게 하고, 원시 HTTP 계약을 확인할 수 있어야 한다. 생성형 AI 모델을 소비자로 연결할 때는 작은 목적별 연산, 명확한 필드 설명, 제한된 열거형과 건조 실행 기능이 도구 선택 오류를 줄인다. 하나의 거대한 “모든 작업” 엔드포인트는 권한과 부작용을 구분하기 어렵게 만든다.

API의 품질은 문서의 보기 좋은 정도보다 소비자가 예측하고 복구할 수 있는지로 판단한다. 새 연산을 내기 전에 시간 초과, 중복 요청, 부분 성공과 버전 불일치를 시험하고, 사용이 끝난 기능의 종료 경로도 설계한다. 계약과 관측 지표가 함께 있어야 장애 때 서버와 소비자 중 어느 경계에서 기대가 어긋났는지 찾을 수 있다.

**판단 문턱:** 소비자가 명세로부터 생성한 요청이 실제 서버에서 같은 결과를 얻고, 모든 문서화된 오류가 안정적인 코드와 추적 식별자를 반환해야 한다. 네트워크 단절 뒤 재시도 시험에서 중복 상태가 생기거나 이전 소비자가 새 버전에서 실패하면 호환 배포로 승인하지 않는다.

API 변경 검토자는 서버 코드뿐 아니라 실제 소비자 목록과 호출 흔적을 확인한다. 사용량이 없다는 추정만으로 제거하지 않고 관측 기간과 소유자 확인을 거친다.

문서에는 성공 예제뿐 아니라 권한 거부, 유효성 오류, 속도 제한과 비동기 작업 실패 예제를 둔다. 소비자가 오류 코드를 분기해 재시도·수정·중단 중 올바른 행동을 선택하는지 SDK 통합 시험에서 확인한다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 한계와 흔한 오해

버전 변경, 호출 제한, 시간 초과, 부분 실패를 전제로 재시도와 호환성 정책을 설계해야 한다.

인증·버전·오류·호출 제한·비밀 관리가 빠진 예제 코드를 운영 환경에 그대로 쓰지 않는다. 하나의 수치나 데모를 모든 환경에 일반화하지 말고, 데이터 분포·모델 버전·하드웨어·기본 파라미터·평가 방식이 같은지 확인한다. 특히 생성 결과가 자연스럽다는 이유만으로 사실성, 공정성, 보안성까지 확보되었다고 판단하지 않는다.

**분산 시스템에서의 한계**

API 호출은 함수 호출처럼 보여도 네트워크, 프록시, 인증 서버, 데이터 저장소를 거치는 분산 작업이다. 지연과 부분 실패는 정상적인 운영 조건이며, “응답이 없었다”와 “처리되지 않았다”는 같은 뜻이 아니다. 재시도에는 지수 백오프와 무작위 지연을 두고, 서버가 제공하는 재시도 시점을 존중해야 동시 장애 때 부하가 폭증하지 않는다. 회로 차단기와 동시성 제한은 실패한 의존 서비스로 요청이 계속 몰리는 것을 막는다. 시간 제한은 클라이언트와 서버의 각 단계에 배분하고, 전체 요청 기한이 지나면 하위 작업도 취소할 수 있도록 전달한다.

보안은 API 키를 붙이는 것으로 끝나지 않는다. 주체를 확인하는 인증과 어떤 자원·행동을 허용할지 정하는 권한 부여를 분리하고, 최소 권한과 짧은 유효 기간을 적용한다. 입력 검증은 스키마에 맞는지뿐 아니라 사용자가 해당 식별자에 접근할 수 있는지까지 확인한다. 로그에는 토큰, 개인정보, 프롬프트 원문이 무심코 남지 않도록 필드별 정책을 둔다. 브라우저용 API는 출처 정책과 위조 요청 방어를 고려하고, 서버 간 API는 비밀 회전과 호출 주체 추적이 필요하다. 사용량 제한은 서비스 보호 장치이면서 소비자가 예측 가능한 방식으로 복구하도록 남은 한도와 초기화 정보를 제공하는 계약이기도 하다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 관련 개념과의 구분

- [REST API](/wiki/rest-api/): HTTP 자원과 메서드를 중심으로 상태를 주고받도록 설계한 웹 API 방식이다.
- [SDK](/wiki/sdk/): 특정 플랫폼이나 API를 쉽게 사용하도록 제공하는 라이브러리·도구·문서의 묶음이다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-2">[2]</a> <a href="#reference-3">[3]</a></div>

## 구체적 적용 예시

최소 요청 예제에는 인증 방식, 필수 필드, 정상 응답, 오류 응답과 시간 초과 처리를 함께 담아야 계약의 경계가 보인다. ‘API’를 적용하는 경우에는 API는 요청 형식과 엔드포인트, 인증, 응답 스키마, 오류 규칙을 계약으로 정의해 서로 다른 소프트웨어가 기능을 호출하게 한다.

테스트 환경에서 호출 제한과 부분 장애를 재현하고, 중복 요청이 부작용을 만들지 않도록 멱등성과 재시도 정책을 확인한다. 이때 [REST API](/wiki/rest-api/), [SDK](/wiki/sdk/) 문서의 역할을 나란히 비교하면 서로 다른 단계의 설정을 한 원인처럼 해석하는 오류를 줄일 수 있다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-1">[1]</a> <a href="#reference-3">[3]</a></div>

## 실무 적용과 검증 절차

1. **목적 정의:** ‘API’가 해결해야 할 문제와 해결하지 않아도 되는 범위를 한 문장씩 적는다.
2. **입력과 조건 확인:** 입력 자료의 형식·분포·권한과 기준 시점을 확인한다.
3. **기준선 설정:** 웹 서비스, 자동화, 구조화 출력, 이벤트 연동과 클라이언트 라이브러리 구현에 사용한다. 가장 단순한 방법과 비교할 품질·비용·지연 지표를 고정한다.
4. **실패 사례 기록:** 버전 변경, 호출 제한, 시간 초과, 부분 실패를 전제로 재시도와 호환성 정책을 설계해야 한다.
5. **운영 검증:** 버전, 기본값, 데이터 시점과 평가 결과를 기록하고 변경 뒤 같은 시험을 반복한다.
6. **판단 근거 보존:** 성공 사례만 남기지 말고 실패 입력과 원인 가설, 수정 전후 수치를 함께 저장한다. 그래야 담당자가 바뀌거나 모델이 교체되어도 ‘API’에 대한 선택을 다시 검증할 수 있다.
7. **재검토 조건 지정:** 데이터 분포, 모델 버전, 비용 구조 또는 정책이 바뀌면 이전 결론을 그대로 재사용하지 않고 같은 기준으로 다시 평가한다.

**계약 시험과 관측성**

API 검증은 정상 예제 하나를 호출하는 수준을 넘어야 한다. 명세의 모든 연산과 응답 코드가 구현에 존재하는지 확인하는 계약 시험, 경계값과 잘못된 형식을 넣는 입력 시험, 권한별 접근 시험, 의존 서비스 지연과 실패를 주입하는 복원력 시험을 분리한다. 소비자 주도 계약을 사용하면 서버 변경이 특정 클라이언트의 실제 기대를 깨는지 배포 전에 알 수 있다. 쓰기 요청은 동일한 식별자로 반복 호출해 멱등성을 확인하고, 페이지네이션은 항목이 동시에 추가·삭제되는 상황에서 누락과 중복을 측정한다.

운영 지표는 요청량, 오류율, 지연 시간만 보지 않고 연산·상태 코드·소비자·버전별로 나눈다. 평균 지연은 긴 꼬리를 숨기므로 상위 백분위와 시간 초과 비율을 함께 본다. 각 요청에 추적 식별자를 부여하고 하위 서비스로 전달하면 한 호출의 병목을 찾을 수 있다. 변경 전에는 현재 트래픽에서 사용하는 필드와 버전을 확인하고, 일부 소비자에게 먼저 배포한 뒤 오류 예산을 넘으면 자동 중단한다. 문서 예제도 실제 계약 시험에서 실행해 낡은 샘플이 남지 않게 한다. AI 도구 연결에서는 모델이 만든 인자, 검증 결과, 실행 응답을 구분해 기록해야 잘못된 생성과 서버 오류를 혼동하지 않는다.

<div class="wiki-section-sources" aria-label="이 구획의 근거"><span>근거</span> <a href="#reference-3">[3]</a></div>

## 학습 체크

- 이 개념의 입력과 출력 또는 적용 대상을 한 문장으로 구분할 수 있는가?
- 기본 정의와 어떤 선후 관계가 있는지 설명할 수 있는가?
- 이 문서의 주의점을 실제 모델·데이터·API 선택에 적용할 수 있는가?

## 선행 개념

_해당 문서가 없습니다._

## 관련 문서

- [REST API](/wiki/rest-api/)
- [SDK](/wiki/sdk/)

## 이 문서를 가리키는 문서

- [API 감사 로그](/wiki/api-audit-log/)
- [API 클라이언트](/wiki/api-client/)
- [API 비용 추적](/wiki/api-cost-tracking/)
- [API 지원 종료](/wiki/api-deprecation/)
- [API 엔드포인트](/wiki/api-endpoint/)
- [API 오류 모델](/wiki/api-error-model/)
- [API 로깅](/wiki/api-logging/)
- [API 페이지네이션](/wiki/api-pagination/)
- [API 할당량](/wiki/api-quota/)
- [API 형식 생성](/wiki/api-type-generation/)
- [API 버전 고정](/wiki/api-version-pinning/)
- [API 버전 관리](/wiki/api-versioning/)
- [API 래퍼](/wiki/api-wrapper/)
- [비동기 API 작업](/wiki/asynchronous-api-job/)
- [비동기 클라이언트](/wiki/asynchronous-client/)
- [오디오 API](/wiki/audio-api/)
- [배치 API](/wiki/batch-api/)
- [베어러 토큰](/wiki/bearer-token/)
- [채팅 API](/wiki/chat-api/)
- [클라이언트 라이브러리](/wiki/client-library/)
- [클라이언트 미들웨어](/wiki/client-middleware/)
- [명령줄 API 클라이언트](/wiki/command-line-api-client/)
- [컴플리션 API](/wiki/completion-api/)
- [동시성 한도](/wiki/concurrency-limit/)
- [콘텐츠 유형](/wiki/content-type/)
- [자격 증명 순환](/wiki/credential-rotation/)
- [교차 출처 자원 공유](/wiki/cross-origin-resource-sharing/)
- [교차 사이트 요청 위조](/wiki/cross-site-request-forgery/)
- [역직렬화](/wiki/deserialization/)
- [도메인 이름 시스템](/wiki/domain-name-system/)
- [임베딩 API](/wiki/embedding-api/)
- [환경 변수 비밀정보](/wiki/environment-variable-secret/)
- [지수 백오프](/wiki/exponential-backoff/)
- [파일 업로드 API](/wiki/file-upload-api/)
- [함수 호출](/wiki/function-calling/)
- [문법 제약 생성](/wiki/grammar-constrained-generation/)
- [HMAC 인증](/wiki/hmac-authentication/)
- [HTTP 429](/wiki/http-429/)
- [HTTP 헤더](/wiki/http-header/)
- [HTTP 메시지 본문](/wiki/http-message-body/)
- [HTTP 메서드](/wiki/http-method/)
- [HTTP 요청](/wiki/http-request/)
- [HTTP 응답](/wiki/http-response/)
- [HTTP 상태 코드](/wiki/http-status-code/)
- [HTTPS](/wiki/https/)
- [멱등성 키](/wiki/idempotency-key/)
- [이미지 생성 API](/wiki/image-generation-api/)
- [JSON 스키마](/wiki/json-schema/)
- [JSON 웹 토큰](/wiki/json-web-token/)
- [리키 버킷](/wiki/leaky-bucket/)
- [최소 권한](/wiki/least-privilege/)
- [MIME 유형](/wiki/mime-type/)
- [콘텐츠 조정 API](/wiki/moderation-api/)
- [상호 TLS](/wiki/mutual-tls/)
- [OAuth](/wiki/oauth/)
- [OAuth 범위](/wiki/oauth-scope/)
- [OpenAPI 명세](/wiki/openapi-specification/)
- [출력 파서](/wiki/output-parser/)
- [병렬 도구 호출](/wiki/parallel-tool-call/)
- [경로 매개변수](/wiki/path-parameter/)
- [질의 매개변수](/wiki/query-parameter/)
- [실시간 API](/wiki/realtime-api/)
- [요청 인터셉터](/wiki/request-interceptor/)
- [요청-응답 패턴](/wiki/request-response-pattern/)
- [요청 서명](/wiki/request-signing/)
- [요청 조절](/wiki/request-throttling/)
- [응답 검증](/wiki/response-validation/)
- [REST API](/wiki/rest-api/)
- [재시도 정책](/wiki/retry-policy/)
- [스키마 검증](/wiki/schema-validation/)
- [SDK](/wiki/sdk/)
- [비밀정보 관리](/wiki/secret-management/)
- [직렬화](/wiki/serialization/)
- [서버 전송 이벤트](/wiki/server-sent-events/)
- [서버 측 요청 위조](/wiki/server-side-request-forgery/)
- [서비스 수준 협약](/wiki/service-level-agreement/)
- [상태 유지 API](/wiki/stateful-api/)
- [무상태 API](/wiki/stateless-api/)
- [동기 API 요청](/wiki/synchronous-api-request/)
- [동기 클라이언트](/wiki/synchronous-client/)
- [토큰 버킷](/wiki/token-bucket/)
- [도구 인수](/wiki/tool-argument/)
- [도구 선택 제어](/wiki/tool-choice/)
- [도구 정의](/wiki/tool-definition/)
- [도구 오류](/wiki/tool-error/)
- [도구 결과](/wiki/tool-result/)
- [전송 제어 프로토콜](/wiki/transmission-control-protocol/)
- [전송 계층 보안](/wiki/transport-layer-security/)
- [형식 지정 응답](/wiki/typed-response/)
- [통합 응답 API](/wiki/unified-response-api/)
- [통합 자원 식별자](/wiki/uri/)
- [통합 자원 위치 지정자](/wiki/url/)
- [사용량 계측](/wiki/usage-metering/)

## 이 문서를 포함하는 코스

[AI API 개발](/course/api-development/)

<div class="wiki-source-note">외부 백과는 표제어 범위와 용어 관계를 대조하는 데 사용했습니다. Wikipedia 자료는 CC BY-SA 4.0에 따라 출처를 표시하며, 본문은 원문을 복제하지 않고 1차 자료와 함께 재서술했습니다. Grokipedia는 robots.txt가 허용한 공개 메타데이터만 확인하고 본문은 가져오지 않았습니다.</div>

## 참고 문헌

<span id="reference-1"></span>1. [MDN Web Docs: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) — documentation
<span id="reference-2"></span>2. [API — 한국어 위키백과](https://ko.wikipedia.org/wiki/API) — encyclopedia
<span id="reference-3"></span>3. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) — standard

## 코스에서 계속 읽기

- **AI API 개발:** [다음 문서 — HTTP 요청](/wiki/http-request/)

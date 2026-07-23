---
title: "LLM과 토큰 처리"
description: "언어 모델의 입력·문맥·생성 단위"
---

언어 모델의 입력·문맥·생성 단위 분야의 검토 완료 백과 문서다.

<nav class="wiki-letter-index" aria-label="문서 초성 색인"><a href="#index-ko-g">ㄱ</a><a href="#index-ko-d">ㄷ</a><a href="#index-ko-m">ㅁ</a><a href="#index-ko-b">ㅂ</a><a href="#index-ko-s">ㅅ</a><a href="#index-ko-ng">ㅇ</a><a href="#index-ko-j">ㅈ</a><a href="#index-ko-ch">ㅊ</a><a href="#index-ko-k">ㅋ</a><a href="#index-ko-t">ㅌ</a><a href="#index-ko-p">ㅍ</a><a href="#index-ko-h">ㅎ</a><a href="#index-en-l">L</a><a href="#index-en-n">N</a><a href="#index-en-s">S</a><a href="#index-en-w">W</a></nav>

<div class="wiki-index-groups">
<section class="wiki-index-group" data-index-group="ko-g">
<h2 id="index-ko-g">ㄱ</h2>
<ul class="wiki-index-list">
<li data-article-id="retrieval-prompt"><a href="/wiki/retrieval-prompt/">검색 결합 프롬프트</a><span class="wiki-index-summary">검색 결합 프롬프트는 검색된 문서를 모델의 답변 근거로 제공하도록 문맥 배치, 인용 규칙과 불충분 정보 처리를 정의한 입력 형식이다.</span></li>
<li data-article-id="compute-optimal-training"><a href="/wiki/compute-optimal-training/">계산 최적 학습</a><span class="wiki-index-summary">계산 최적 학습은 고정된 총 계산 예산에서 모델 크기와 학습 토큰 수를 배분해 손실을 최소화하는 학습 설계다.</span></li>
<li data-article-id="cross-modal-latency-budget"><a href="/wiki/cross-modal-latency-budget/">교차 모달 지연 예산</a><span class="wiki-index-summary">교차 모달 지연 예산은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="structured-output-recovery"><a href="/wiki/structured-output-recovery/">구조화 출력 복구</a><span class="wiki-index-summary">구조화 출력 복구는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="long-context-routing"><a href="/wiki/long-context-routing/">긴 문맥 라우팅</a><span class="wiki-index-summary">긴 문맥 라우팅은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-d">
<h2 id="index-ko-d">ㄷ</h2>
<ul class="wiki-index-list">
<li data-article-id="multilingual-capability"><a href="/wiki/multilingual-capability/">다국어 능력</a><span class="wiki-index-summary">다국어 능력은 모델이 여러 언어의 입력을 이해하고 생성하며 언어 사이의 의미를 이전하는 능력이다.</span></li>
<li data-article-id="multilingual-language-model"><a href="/wiki/multilingual-language-model/">다국어 언어 모델</a><span class="wiki-index-summary">다국어 언어 모델은 여러 언어의 텍스트를 공동 학습해 언어 간에 표현과 능력을 공유하는 모델이다.</span></li>
<li data-article-id="next-token-prediction"><a href="/wiki/next-token-prediction/">다음 토큰 예측</a><span class="wiki-index-summary">앞선 토큰 문맥을 조건으로 바로 다음 토큰의 확률분포를 예측하도록 언어 모델을 학습하고 생성하는 방식이다.</span></li>
<li data-article-id="large-language-model"><a href="/wiki/large-language-model/">대규모 언어 모델</a><span class="wiki-index-summary">대규모 데이터와 많은 파라미터로 학습해 다양한 언어 과제를 수행하는 언어 모델이다.</span></li>
<li data-article-id="conversation-context"><a href="/wiki/conversation-context/">대화 문맥</a><span class="wiki-index-summary">대화 문맥은 현재 발화를 해석하고 응답하기 위해 모델에 제공되는 이전 메시지, 역할, 도구 결과와 대화 상태의 집합이다.</span></li>
<li data-article-id="conversation-state-compaction"><a href="/wiki/conversation-state-compaction/">대화 상태 압축</a><span class="wiki-index-summary">대화 상태 압축은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-m">
<h2 id="index-ko-m">ㅁ</h2>
<ul class="wiki-index-list">
<li data-article-id="masked-language-model"><a href="/wiki/masked-language-model/">마스크 언어 모델</a><span class="wiki-index-summary">마스크 언어 모델은 입력의 일부 토큰을 가리고 양쪽 문맥을 이용해 원래 토큰을 복원하도록 학습한다.</span></li>
<li data-article-id="multimodal-safety-evaluation"><a href="/wiki/multimodal-safety-evaluation/">멀티모달 안전 평가</a><span class="wiki-index-summary">멀티모달 안전 평가는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="multimodal-language-model"><a href="/wiki/multimodal-language-model/">멀티모달 언어 모델</a><span class="wiki-index-summary">멀티모달 언어 모델은 텍스트와 이미지, 오디오 등 다른 양식의 표현을 언어 모델과 결합해 이해와 생성을 수행한다.</span></li>
<li data-article-id="multimodal-input-contract"><a href="/wiki/multimodal-input-contract/">멀티모달 입력 계약</a><span class="wiki-index-summary">멀티모달 입력 계약은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="memory-token"><a href="/wiki/memory-token/">메모리 토큰</a><span class="wiki-index-summary">메모리 토큰은 구간을 넘어 유지할 정보를 담도록 학습되거나 갱신되는 특별한 토큰 표현이다.</span></li>
<li data-article-id="modality-fallback-policy"><a href="/wiki/modality-fallback-policy/">모달리티 대체 정책</a><span class="wiki-index-summary">모달리티 대체 정책은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-fallback-chain"><a href="/wiki/model-fallback-chain/">모델 대체 체인</a><span class="wiki-index-summary">모델 대체 체인은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-version-pinning"><a href="/wiki/model-version-pinning/">모델 버전 고정</a><span class="wiki-index-summary">모델 버전 고정은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-collapse"><a href="/wiki/model-collapse/">모델 붕괴</a><span class="wiki-index-summary">모델 붕괴는 생성 모델이 만든 합성 데이터가 반복적으로 다음 세대 학습에 섞일 때 원래 분포의 다양성과 희귀 사건을 잃으며 성능이 퇴화하는 현상이다.</span></li>
<li data-article-id="model-selection-policy"><a href="/wiki/model-selection-policy/">모델 선택 정책</a><span class="wiki-index-summary">모델 선택 정책은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-memorization"><a href="/wiki/model-memorization/">모델 암기</a><span class="wiki-index-summary">모델 암기는 학습 사례의 고유한 문자열이나 정보를 일반 규칙으로 추상화하지 않고 재현할 수 있게 저장한 현상이다.</span></li>
<li data-article-id="model-capability-profile"><a href="/wiki/model-capability-profile/">모델 역량 프로파일</a><span class="wiki-index-summary">모델 역량 프로파일은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-deprecation-migration"><a href="/wiki/model-deprecation-migration/">모델 종료 마이그레이션</a><span class="wiki-index-summary">모델 종료 마이그레이션은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="model-knowledge"><a href="/wiki/model-knowledge/">모델 지식</a><span class="wiki-index-summary">모델 지식은 학습 과정에서 매개변수와 표현에 압축되어 질의나 과제로 유도될 수 있는 사실·관계·절차 정보다.</span></li>
<li data-article-id="model-size"><a href="/wiki/model-size/">모델 크기</a><span class="wiki-index-summary">모델 크기는 파라미터 수뿐 아니라 가중치 정밀도와 실행·배포에 필요한 저장 공간과 메모리 규모를 나타내는 운영 지표다.</span></li>
<li data-article-id="model-compatibility-matrix"><a href="/wiki/model-compatibility-matrix/">모델 호환성 행렬</a><span class="wiki-index-summary">모델 호환성 행렬은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="context-length"><a href="/wiki/context-length/">문맥 길이</a><span class="wiki-index-summary">문맥 길이는 모델이 한 번의 처리나 생성에서 조건으로 사용할 수 있는 토큰 시퀀스의 범위다.</span></li>
<li data-article-id="in-context-generalization"><a href="/wiki/in-context-generalization/">문맥 내 일반화</a><span class="wiki-index-summary">문맥 내 일반화는 가중치 갱신 없이 프롬프트의 예시와 지시에서 규칙을 추론해 새로운 입력에 적용하는 능력이다.</span></li>
<li data-article-id="in-context-learning"><a href="/wiki/in-context-learning/">문맥 내 학습</a><span class="wiki-index-summary">문맥 내 학습은 모델 매개변수를 갱신하지 않고 프롬프트 속 지시·예시·관찰을 이용해 현재 과제에 맞는 동작을 구성하는 능력이다.</span></li>
<li data-article-id="out-of-context-reasoning"><a href="/wiki/out-of-context-reasoning/">문맥 밖 추론</a><span class="wiki-index-summary">문맥 밖 추론은 현재 프롬프트에 직접 제시되지 않은 학습된 정보 조각을 연결해 결론을 도출하는 능력이다.</span></li>
<li data-article-id="context-budget"><a href="/wiki/context-budget/">문맥 예산</a><span class="wiki-index-summary">문맥 예산은 한 모델 호출에서 지시, 대화, 검색 자료, 도구 결과와 생성에 배분할 수 있는 토큰 한도다.</span></li>
<li data-article-id="context-contamination"><a href="/wiki/context-contamination/">문맥 오염</a><span class="wiki-index-summary">문맥 오염은 관련 없는 정보, 악성 지시나 잘못된 과거 상태가 모델 문맥에 섞여 출력 판단을 왜곡하는 현상이다.</span></li>
<li data-article-id="context-truncation"><a href="/wiki/context-truncation/">문맥 절단</a><span class="wiki-index-summary">문맥 절단은 입력이 허용 토큰 수를 넘을 때 일부 내용을 제거해 모델의 문맥 창에 맞추는 처리다.</span></li>
<li data-article-id="context-utilization"><a href="/wiki/context-utilization/">문맥 활용률</a><span class="wiki-index-summary">문맥 활용률은 제공된 문맥 중 과제 해결에 필요한 정보를 모델이 실제 출력에 정확히 반영하는 정도다.</span></li>
<li data-article-id="character-tokenization"><a href="/wiki/character-tokenization/">문자 단위 토큰화</a><span class="wiki-index-summary">문자 단위 토큰화는 텍스트를 글자 또는 유니코드 문자 단위의 토큰 시퀀스로 표현하는 방식이다.</span></li>
<li data-article-id="style-transfer"><a href="/wiki/style-transfer/">문체 변환</a><span class="wiki-index-summary">문체 변환은 원문의 핵심 의미나 내용 속성을 유지하면서 어조·격식·감정·저자적 특징 같은 스타일 속성을 바꾸는 생성 과제다.</span></li>
<li data-article-id="out-of-vocabulary-token"><a href="/wiki/out-of-vocabulary-token/">미등록 토큰</a><span class="wiki-index-summary">미등록 토큰은 입력 문자열을 토크나이저 어휘의 알려진 항목으로 표현할 수 없을 때 사용하는 대체 식별자다.</span></li>
<li data-article-id="media-provenance-pipeline"><a href="/wiki/media-provenance-pipeline/">미디어 출처 파이프라인</a><span class="wiki-index-summary">미디어 출처 파이프라인은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="dense-language-model"><a href="/wiki/dense-language-model/">밀집 언어 모델</a><span class="wiki-index-summary">밀집 언어 모델은 각 입력 토큰이 대부분 또는 모든 모델 파라미터가 포함된 동일한 계산 경로를 통과하는 언어 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-b">
<h2 id="index-ko-b">ㅂ</h2>
<ul class="wiki-index-list">
<li data-article-id="byte-level-tokenization"><a href="/wiki/byte-level-tokenization/">바이트 단위 토큰화</a><span class="wiki-index-summary">바이트 단위 토큰화는 텍스트 인코딩의 바이트 값을 기본 단위로 사용해 임의 문자열을 유한 어휘로 표현하는 방식이다.</span></li>
<li data-article-id="byte-pair-encoding"><a href="/wiki/byte-pair-encoding/">바이트 페어 인코딩</a><span class="wiki-index-summary">자주 함께 나타나는 기호 쌍을 반복 병합해 서브워드 어휘를 만드는 방식이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-s">
<h2 id="index-ko-s">ㅅ</h2>
<ul class="wiki-index-list">
<li data-article-id="chain-of-thought-prompting"><a href="/wiki/chain-of-thought-prompting/">사고 과정 프롬프팅</a><span class="wiki-index-summary">사고 과정 프롬프팅은 복수 단계 문제에서 중간 추론 단계를 생성하도록 예시나 지시를 제공하는 프롬프팅 방식이다.</span></li>
<li data-article-id="user-prompt"><a href="/wiki/user-prompt/">사용자 프롬프트</a><span class="wiki-index-summary">사용자 프롬프트는 사용자가 모델에 전달하는 질문, 자료, 제약과 원하는 결과 형식을 담은 입력 메시지다.</span></li>
<li data-article-id="subword-token"><a href="/wiki/subword-token/">서브워드 토큰</a><span class="wiki-index-summary">서브워드 토큰은 단어보다 작고 문자보다 긴 경우가 많은 반복 문자열 조각을 나타내는 토큰이다.</span></li>
<li data-article-id="world-model"><a href="/wiki/world-model/">세계 모델</a><span class="wiki-index-summary">세계 모델은 환경 상태와 행동에 따른 다음 상태·관측·보상을 내부적으로 예측하는 학습된 표현 또는 생성 모델이다.</span></li>
<li data-article-id="small-language-model"><a href="/wiki/small-language-model/">소규모 언어 모델</a><span class="wiki-index-summary">대규모 언어 모델보다 파라미터·메모리·연산 요구량을 줄여 제한된 환경에서 운용하도록 설계한 언어 모델이다.</span></li>
<li data-article-id="recurrent-language-model-memory"><a href="/wiki/recurrent-language-model-memory/">순환형 언어 모델 메모리</a><span class="wiki-index-summary">순환형 언어 모델 메모리는 이전 구간의 내부 상태나 압축 표현을 다음 구간 계산에 반복 전달하는 장문맥 메커니즘이다.</span></li>
<li data-article-id="scaling-efficiency"><a href="/wiki/scaling-efficiency/">스케일링 효율</a><span class="wiki-index-summary">스케일링 효율은 모델·데이터·계산량을 늘릴 때 품질 개선이 추가 자원과 비용에 비해 얼마나 크게 나타나는지를 뜻한다.</span></li>
<li data-article-id="sliding-context-window"><a href="/wiki/sliding-context-window/">슬라이딩 컨텍스트 윈도우</a><span class="wiki-index-summary">슬라이딩 컨텍스트 윈도우는 긴 시퀀스를 처리할 때 최근 또는 인접한 일정 범위의 토큰만 주의 대상으로 유지하는 방식이다.</span></li>
<li data-article-id="demonstration-example"><a href="/wiki/demonstration-example/">시범 예시</a><span class="wiki-index-summary">시범 예시는 언어 모델 문맥 안에서 원하는 입력-출력 관계나 작업 수행 방식을 보여 주는 하나의 예제다.</span></li>
<li data-article-id="system-prompt"><a href="/wiki/system-prompt/">시스템 프롬프트</a><span class="wiki-index-summary">시스템 프롬프트는 대화형 언어 모델에 역할, 전역 규칙, 도구 사용과 응답 경계를 우선 문맥으로 제공하는 지시 메시지다.</span></li>
<li data-article-id="system-prompt-composition"><a href="/wiki/system-prompt-composition/">시스템 프롬프트 합성</a><span class="wiki-index-summary">시스템 프롬프트 합성은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="beginning-end-token"><a href="/wiki/beginning-end-token/">시작·종료 토큰</a><span class="wiki-index-summary">시작·종료 토큰은 시퀀스의 시작과 끝 경계를 모델에 명시하는 특수 토큰이다.</span></li>
<li data-article-id="sequence-likelihood"><a href="/wiki/sequence-likelihood/">시퀀스 우도</a><span class="wiki-index-summary">시퀀스 우도는 모델이 관측된 토큰열에 부여하는 결합확률이며 각 토큰의 조건부 확률 곱으로 계산할 수 있다.</span></li>
<li data-article-id="neural-language-model"><a href="/wiki/neural-language-model/">신경 언어 모델</a><span class="wiki-index-summary">신경 언어 모델은 토큰을 연속 벡터로 표현하고 신경망으로 다음 토큰이나 가려진 토큰의 분포를 예측한다.</span></li>
<li data-article-id="neural-scaling-law"><a href="/wiki/neural-scaling-law/">신경망 스케일링 법칙</a><span class="wiki-index-summary">신경망 스케일링 법칙은 모델·데이터·계산량이 증가할 때 손실이나 성능이 경험적으로 따르는 규칙적 관계다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ng">
<h2 id="index-ko-ng">ㅇ</h2>
<ul class="wiki-index-list">
<li data-article-id="sycophancy"><a href="/wiki/sycophancy/">아첨 현상</a><span class="wiki-index-summary">아첨 현상은 모델이 사실이나 독립 판단보다 사용자가 드러낸 신념과 선호에 과도하게 동조하는 행동이다.</span></li>
<li data-article-id="vocabulary"><a href="/wiki/vocabulary/">어휘 집합</a><span class="wiki-index-summary">토크나이저와 모델이 구분해 처리할 수 있는 토큰의 전체 목록이다.</span></li>
<li data-article-id="language-model"><a href="/wiki/language-model/">언어 모델</a><span class="wiki-index-summary">토큰 시퀀스의 확률 분포를 학습해 다음 토큰이나 누락된 토큰을 예측하는 모델이다.</span></li>
<li data-article-id="language-model-confidence"><a href="/wiki/language-model-confidence/">언어 모델 신뢰도</a><span class="wiki-index-summary">언어 모델 신뢰도는 모델이 생성한 답이나 토큰이 맞을 가능성에 대해 모델 점수 또는 별도 추정기가 나타내는 확신 정도다.</span></li>
<li data-article-id="external-language-model-memory"><a href="/wiki/external-language-model-memory/">언어 모델 외부 메모리</a><span class="wiki-index-summary">언어 모델 외부 메모리는 모델 매개변수와 현재 문맥 밖에 저장한 정보를 검색하거나 갱신해 생성에 사용하는 구성 요소다.</span></li>
<li data-article-id="role-prompting"><a href="/wiki/role-prompting/">역할 프롬프팅</a><span class="wiki-index-summary">역할 프롬프팅은 모델에 특정 직무, 관점 또는 책임 범위를 부여해 응답의 초점과 표현 기준을 조정하는 방법이다.</span></li>
<li data-article-id="unigram-language-model-tokenizer"><a href="/wiki/unigram-language-model-tokenizer/">유니그램 언어 모델 토크나이저</a><span class="wiki-index-summary">유니그램 언어 모델 토크나이저는 여러 서브워드 분할 후보의 확률을 독립 토큰 확률의 곱으로 평가하는 토큰화 방법이다.</span></li>
<li data-article-id="response-contract"><a href="/wiki/response-contract/">응답 계약</a><span class="wiki-index-summary">응답 계약은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="response-verbosity"><a href="/wiki/response-verbosity/">응답 장황성</a><span class="wiki-index-summary">응답 장황성은 필요한 정보량에 비해 출력이 얼마나 길고 반복적이며 우회적인지를 나타내는 특성이다.</span></li>
<li data-article-id="semantic-output-validation"><a href="/wiki/semantic-output-validation/">의미 기반 출력 검증</a><span class="wiki-index-summary">의미 기반 출력 검증은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="causal-language-model"><a href="/wiki/causal-language-model/">인과 언어 모델</a><span class="wiki-index-summary">인과 언어 모델은 각 위치가 자신보다 앞선 토큰만 보도록 제한해 다음 토큰 예측을 학습하는 언어 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-j">
<h2 id="index-ko-j">ㅈ</h2>
<ul class="wiki-index-list">
<li data-article-id="self-consistency-decoding"><a href="/wiki/self-consistency-decoding/">자기일관성 디코딩</a><span class="wiki-index-summary">자기일관성 디코딩은 같은 추론 문제에서 여러 사고 경로를 표본화하고 가장 일관되게 도출된 답을 선택하는 방식이다.</span></li>
<li data-article-id="autoregressive-language-model"><a href="/wiki/autoregressive-language-model/">자기회귀 언어 모델</a><span class="wiki-index-summary">자기회귀 언어 모델은 앞선 토큰을 조건으로 다음 토큰 확률을 예측하며 시퀀스의 결합확률을 분해하는 모델이다.</span></li>
<li data-article-id="automatic-prompt-optimization"><a href="/wiki/automatic-prompt-optimization/">자동 프롬프트 최적화</a><span class="wiki-index-summary">자동 프롬프트 최적화는 평가 신호를 사용해 프롬프트 후보를 자동 생성·선택·수정하는 탐색 과정이다.</span></li>
<li data-article-id="latent-knowledge"><a href="/wiki/latent-knowledge/">잠재 지식</a><span class="wiki-index-summary">잠재 지식은 모델 내부 표현에 반영되어 있지만 일반적인 직접 질의에서는 안정적으로 출력되지 않는 정보다.</span></li>
<li data-article-id="latent-reasoning"><a href="/wiki/latent-reasoning/">잠재 추론</a><span class="wiki-index-summary">잠재 추론은 자연어로 모든 중간 단계를 출력하지 않고 내부 연속 표현이나 숨은 토큰 상태에서 여러 계산 단계를 수행하는 접근이다.</span></li>
<li data-article-id="expert-routing"><a href="/wiki/expert-routing/">전문가 라우팅</a><span class="wiki-index-summary">전문가 라우팅은 혼합 전문가 모델에서 각 토큰을 처리할 일부 전문가를 점수화하고 선택하는 과정이다.</span></li>
<li data-article-id="expert-capacity-factor"><a href="/wiki/expert-capacity-factor/">전문가 용량 계수</a><span class="wiki-index-summary">전문가 용량 계수는 한 배치에서 각 전문가가 처리할 수 있는 토큰 수를 평균 부하 대비 어느 정도로 허용할지 정하는 값이다.</span></li>
<li data-article-id="mixture-of-experts"><a href="/wiki/mixture-of-experts/">전문가 혼합</a><span class="wiki-index-summary">입력마다 일부 전문가 네트워크만 선택해 계산량 대비 모델 용량을 늘리는 구조다.</span></li>
<li data-article-id="zero-shot-prompting"><a href="/wiki/zero-shot-prompting/">제로샷 프롬프팅</a><span class="wiki-index-summary">제로샷 프롬프팅은 과제의 정답 예시를 제공하지 않고 지시와 입력만으로 모델의 수행을 유도하는 방식이다.</span></li>
<li data-article-id="controllability"><a href="/wiki/controllability/">제어 가능성</a><span class="wiki-index-summary">제어 가능성은 지시·정책·설정 변화에 따라 모델 출력의 내용과 형식을 의도한 방향으로 안정적으로 조정할 수 있는 정도다.</span></li>
<li data-article-id="conditional-language-model"><a href="/wiki/conditional-language-model/">조건부 언어 모델</a><span class="wiki-index-summary">조건부 언어 모델은 텍스트 이외의 지시, 문서, 클래스, 이미지 같은 조건을 받아 출력 시퀀스의 확률을 모델링한다.</span></li>
<li data-article-id="steerability"><a href="/wiki/steerability/">조향 가능성</a><span class="wiki-index-summary">조향 가능성은 지시, 제어 신호나 선호 설정에 따라 모델의 내용·형식·행동을 예측 가능하게 바꿀 수 있는 정도다.</span></li>
<li data-article-id="lost-in-the-middle"><a href="/wiki/lost-in-the-middle/">중간 정보 손실 현상</a><span class="wiki-index-summary">중간 정보 손실 현상은 긴 문맥의 시작과 끝에 있는 정보보다 가운데 위치한 정보를 언어 모델이 덜 효과적으로 활용하는 경향이다.</span></li>
<li data-article-id="instruction-priority-architecture"><a href="/wiki/instruction-priority-architecture/">지시 우선순위 아키텍처</a><span class="wiki-index-summary">지시 우선순위 아키텍처는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="instruction-following"><a href="/wiki/instruction-following/">지시 이행</a><span class="wiki-index-summary">지시 이행은 언어 모델이 사용자의 명시적 요구와 상위 정책을 해석해 제약에 맞는 출력을 만드는 능력이다.</span></li>
<li data-article-id="instruction-conflict-resolution"><a href="/wiki/instruction-conflict-resolution/">지시 충돌 해소</a><span class="wiki-index-summary">지시 충돌 해소는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="instruction"><a href="/wiki/instruction/">지시문</a><span class="wiki-index-summary">지시문은 모델이 수행해야 할 과제, 입력의 의미, 제약과 성공 조건을 자연어나 구조화된 형식으로 기술한 내용이다.</span></li>
<li data-article-id="knowledge-cutoff"><a href="/wiki/knowledge-cutoff/">지식 기준 시점</a><span class="wiki-index-summary">지식 기준 시점은 모델 학습 자료나 보장된 지식이 특정 시점 이후 사건을 체계적으로 포함하지 않는 시간 경계다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-ch">
<h2 id="index-ko-ch">ㅊ</h2>
<ul class="wiki-index-list">
<li data-article-id="emergent-ability"><a href="/wiki/emergent-ability/">창발적 능력</a><span class="wiki-index-summary">창발적 능력은 모델 규모나 학습량이 증가할 때 특정 측정에서 이전보다 급격히 나타나는 것처럼 보이는 과제 수행 능력이다.</span></li>
<li data-article-id="inference-compute"><a href="/wiki/inference-compute/">추론 계산량</a><span class="wiki-index-summary">추론 계산량은 학습된 모델이 입력을 처리하고 출력을 생성하는 데 필요한 산술 연산과 자원 사용량이다.</span></li>
<li data-article-id="reasoning-effort-control"><a href="/wiki/reasoning-effort-control/">추론 노력 제어</a><span class="wiki-index-summary">추론 노력 제어는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="reasoning-capability"><a href="/wiki/reasoning-capability/">추론 능력</a><span class="wiki-index-summary">추론 능력은 모델이 주어진 정보에서 여러 단계의 관계를 구성해 새로운 결론이나 해결 절차를 도출하는 능력이다.</span></li>
<li data-article-id="reasoning-trace-policy"><a href="/wiki/reasoning-trace-policy/">추론 추적 정책</a><span class="wiki-index-summary">추론 추적 정책은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="output-constraint"><a href="/wiki/output-constraint/">출력 제약</a><span class="wiki-index-summary">출력 제약은 모델 응답이 따라야 할 형식, 길이, 값 범위, 어휘 또는 문법 조건이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-k">
<h2 id="index-ko-k">ㅋ</h2>
<ul class="wiki-index-list">
<li data-article-id="context-engineering"><a href="/wiki/context-engineering/">컨텍스트 엔지니어링</a><span class="wiki-index-summary">컨텍스트 엔지니어링은 모델이 작업할 때 필요한 지시, 자료, 도구 결과와 대화 상태를 선택·구성·갱신하는 시스템 설계 활동이다.</span></li>
<li data-article-id="context-window"><a href="/wiki/context-window/">컨텍스트 윈도우</a><span class="wiki-index-summary">모델이 한 번의 요청에서 참조할 수 있는 토큰 범위다.</span></li>
<li data-article-id="context-window-budgeting"><a href="/wiki/context-window-budgeting/">컨텍스트 창 예산 관리</a><span class="wiki-index-summary">컨텍스트 창 예산 관리는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="context-cache-coherence"><a href="/wiki/context-cache-coherence/">컨텍스트 캐시 일관성</a><span class="wiki-index-summary">컨텍스트 캐시 일관성은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="context-caching"><a href="/wiki/context-caching/">컨텍스트 캐싱</a><span class="wiki-index-summary">컨텍스트 캐싱은 반복되는 입력 접두사의 중간 계산 결과를 저장해 후속 모델 호출에서 재사용하는 최적화다.</span></li>
<li data-article-id="completion"><a href="/wiki/completion/">컴플리션</a><span class="wiki-index-summary">프롬프트와 이전 토큰을 조건으로 모델이 생성한 후속 토큰 시퀀스다.</span></li>
<li data-article-id="code-generation"><a href="/wiki/code-generation/">코드 생성</a><span class="wiki-index-summary">코드 생성은 자연어 요구나 부분 프로그램을 조건으로 실행 가능한 소스 코드와 관련 설명을 만드는 능력이다.</span></li>
<li data-article-id="code-language-model"><a href="/wiki/code-language-model/">코드 언어 모델</a><span class="wiki-index-summary">코드 언어 모델은 프로그래밍 언어와 관련 자연어를 학습해 코드 완성, 생성, 설명과 변환을 수행하는 언어 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-t">
<h2 id="index-ko-t">ㅌ</h2>
<ul class="wiki-index-list">
<li data-article-id="tokenizer"><a href="/wiki/tokenizer/">토크나이저</a><span class="wiki-index-summary">텍스트와 토큰 ID 사이의 분할·변환 규칙을 구현한 구성 요소다.</span></li>
<li data-article-id="token"><a href="/wiki/token/">토큰</a><span class="wiki-index-summary">언어 모델이 텍스트를 처리하기 위해 나눈 기본 기호 단위다.</span></li>
<li data-article-id="token-budget-controller"><a href="/wiki/token-budget-controller/">토큰 예산 제어기</a><span class="wiki-index-summary">토큰 예산 제어기는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="token-accounting"><a href="/wiki/token-accounting/">토큰 회계</a><span class="wiki-index-summary">토큰 회계는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="token-efficiency"><a href="/wiki/token-efficiency/">토큰 효율</a><span class="wiki-index-summary">토큰 효율은 주어진 품질이나 과제 성과를 달성하는 데 필요한 입력·출력 토큰 수가 얼마나 적은지를 나타내는 효율 관점이다.</span></li>
<li data-article-id="tokenization"><a href="/wiki/tokenization/">토큰화</a><span class="wiki-index-summary">문자열을 모델의 어휘 집합에 있는 토큰 ID 시퀀스로 변환하는 과정이다.</span></li>
<li data-article-id="speculative-generation-policy"><a href="/wiki/speculative-generation-policy/">투기적 생성 정책</a><span class="wiki-index-summary">투기적 생성 정책은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="special-token"><a href="/wiki/special-token/">특수 토큰</a><span class="wiki-index-summary">특수 토큰은 일반 텍스트 조각이 아니라 경계, 역할, 패딩, 마스킹이나 제어 의미를 모델에 전달하는 예약 토큰이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-p">
<h2 id="index-ko-p">ㅍ</h2>
<ul class="wiki-index-list">
<li data-article-id="parameter"><a href="/wiki/parameter/">파라미터</a><span class="wiki-index-summary">학습 과정에서 조정되어 모델의 입력-출력 변환을 결정하는 수치다.</span></li>
<li data-article-id="parameter-count"><a href="/wiki/parameter-count/">파라미터 수</a><span class="wiki-index-summary">파라미터 수는 모델이 학습 과정에서 조정하는 스칼라 가중치와 편향의 총개수다.</span></li>
<li data-article-id="padding-token"><a href="/wiki/padding-token/">패딩 토큰</a><span class="wiki-index-summary">패딩 토큰은 길이가 다른 시퀀스를 같은 배치 형태로 맞추기 위해 빈 위치에 채우는 특수 토큰이다.</span></li>
<li data-article-id="few-shot-prompting"><a href="/wiki/few-shot-prompting/">퓨샷 프롬프팅</a><span class="wiki-index-summary">퓨샷 프롬프팅은 소수의 입력-출력 예시를 문맥에 배치해 새 입력의 과제와 응답 패턴을 보여주는 방식이다.</span></li>
<li data-article-id="prompt"><a href="/wiki/prompt/">프롬프트</a><span class="wiki-index-summary">모델에 과제·문맥·제약·출력 형식을 전달하는 입력이다.</span></li>
<li data-article-id="prompt-contract-testing"><a href="/wiki/prompt-contract-testing/">프롬프트 계약 테스트</a><span class="wiki-index-summary">프롬프트 계약 테스트는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="prompt-delimiter"><a href="/wiki/prompt-delimiter/">프롬프트 구분자</a><span class="wiki-index-summary">프롬프트 구분자는 지시, 사용자 데이터, 예시, 인용문 같은 영역의 경계를 명확히 표시하는 문자 또는 태그다.</span></li>
<li data-article-id="prompt-release-governance"><a href="/wiki/prompt-release-governance/">프롬프트 릴리스 거버넌스</a><span class="wiki-index-summary">프롬프트 릴리스 거버넌스는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="prompt-sensitivity"><a href="/wiki/prompt-sensitivity/">프롬프트 민감도</a><span class="wiki-index-summary">프롬프트 민감도는 의미가 비슷한 입력의 표현·순서·예시 변화가 모델 출력에 미치는 변동 정도다.</span></li>
<li data-article-id="prompt-compression"><a href="/wiki/prompt-compression/">프롬프트 압축</a><span class="wiki-index-summary">프롬프트 압축은 핵심 의미와 과제 성능을 보존하면서 입력 문맥의 토큰 수를 줄이는 기법이다.</span></li>
<li data-article-id="prompt-engineering"><a href="/wiki/prompt-engineering/">프롬프트 엔지니어링</a><span class="wiki-index-summary">프롬프트 엔지니어링은 모델 입력의 지시, 문맥, 예시와 제약을 설계하고 평가해 원하는 출력을 안정적으로 얻는 과정이다.</span></li>
<li data-article-id="prompt-chaining"><a href="/wiki/prompt-chaining/">프롬프트 체이닝</a><span class="wiki-index-summary">프롬프트 체이닝은 복잡한 작업을 여러 모델 호출로 분해해 앞 단계 출력을 다음 단계 입력으로 연결하는 구성 방식이다.</span></li>
<li data-article-id="prompt-caching"><a href="/wiki/prompt-caching/">프롬프트 캐싱</a><span class="wiki-index-summary">프롬프트 캐싱은 반복되는 프롬프트 접두사의 모델 계산 결과나 완성 결과를 저장해 후속 요청에서 재사용하는 기법이다.</span></li>
<li data-article-id="prompt-template"><a href="/wiki/prompt-template/">프롬프트 템플릿</a><span class="wiki-index-summary">프롬프트 템플릿은 역할, 지시, 문맥, 예시와 출력 형식을 변수 슬롯으로 구조화해 반복 사용할 수 있게 한 입력 틀이다.</span></li>
<li data-article-id="prompt-portfolio-observability"><a href="/wiki/prompt-portfolio-observability/">프롬프트 포트폴리오 관측성</a><span class="wiki-index-summary">프롬프트 포트폴리오 관측성은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="ko-h">
<h2 id="index-ko-h">ㅎ</h2>
<ul class="wiki-index-list">
<li data-article-id="hyperparameter"><a href="/wiki/hyperparameter/">하이퍼파라미터</a><span class="wiki-index-summary">학습 전에 사람이 정하거나 탐색하며 학습 과정과 모델 구조를 제어하는 값이다.</span></li>
<li data-article-id="training-compute"><a href="/wiki/training-compute/">학습 계산량</a><span class="wiki-index-summary">학습 계산량은 순전파·역전파·파라미터 갱신을 수행하는 데 사용된 총 산술 연산과 하드웨어 시간이다.</span></li>
<li data-article-id="sparse-language-model"><a href="/wiki/sparse-language-model/">희소 언어 모델</a><span class="wiki-index-summary">희소 언어 모델은 토큰마다 파라미터나 연결의 일부만 활성화해 전체 용량과 실제 계산량을 분리하는 언어 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-l">
<h2 id="index-en-l">L</h2>
<ul class="wiki-index-list">
<li data-article-id="llm-api-contract-test"><a href="/wiki/llm-api-contract-test/">LLM API 계약 테스트</a><span class="wiki-index-summary">LLM API 계약 테스트는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-feature-flag"><a href="/wiki/llm-feature-flag/">LLM 기능 플래그</a><span class="wiki-index-summary">LLM 기능 플래그는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-routing-gateway"><a href="/wiki/llm-routing-gateway/">LLM 라우팅 게이트웨이</a><span class="wiki-index-summary">LLM 라우팅 게이트웨이는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-session-state"><a href="/wiki/llm-session-state/">LLM 세션 상태</a><span class="wiki-index-summary">LLM 세션 상태는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-request-envelope"><a href="/wiki/llm-request-envelope/">LLM 요청 엔벨로프</a><span class="wiki-index-summary">LLM 요청 엔벨로프는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-request-normalization"><a href="/wiki/llm-request-normalization/">LLM 요청 정규화</a><span class="wiki-index-summary">LLM 요청 정규화는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-workload-classification"><a href="/wiki/llm-workload-classification/">LLM 워크로드 분류</a><span class="wiki-index-summary">LLM 워크로드 분류는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-response-reproducibility"><a href="/wiki/llm-response-reproducibility/">LLM 응답 재현성</a><span class="wiki-index-summary">LLM 응답 재현성은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-response-normalization"><a href="/wiki/llm-response-normalization/">LLM 응답 정규화</a><span class="wiki-index-summary">LLM 응답 정규화는 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-output-determinism"><a href="/wiki/llm-output-determinism/">LLM 출력 결정성</a><span class="wiki-index-summary">LLM 출력 결정성은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
<li data-article-id="llm-client-conformance"><a href="/wiki/llm-client-conformance/">LLM 클라이언트 적합성</a><span class="wiki-index-summary">LLM 클라이언트 적합성은 대규모 언어 모델 응용의 지시·문맥·출력 계층에서 입력·판단·관측·복구 조건을 일관된 형식으로 관리하기 위한 운영 설계 개념이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-n">
<h2 id="index-en-n">N</h2>
<ul class="wiki-index-list">
<li data-article-id="n-gram-language-model"><a href="/wiki/n-gram-language-model/">N-그램 언어 모델</a><span class="wiki-index-summary">N-그램 언어 모델은 다음 단어의 확률이 직전 n-1개 단어에만 의존한다고 가정하는 통계적 언어 모델이다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-s">
<h2 id="index-en-s">S</h2>
<ul class="wiki-index-list">
<li data-article-id="sentencepiece"><a href="/wiki/sentencepiece/">SentencePiece</a><span class="wiki-index-summary">SentencePiece는 공백으로 미리 분리하지 않은 원시 문장에서 서브워드 어휘와 토큰화를 함께 학습하는 언어 독립 도구다.</span></li>
</ul>
</section>
<section class="wiki-index-group" data-index-group="en-w">
<h2 id="index-en-w">W</h2>
<ul class="wiki-index-list">
<li data-article-id="wordpiece"><a href="/wiki/wordpiece/">WordPiece</a><span class="wiki-index-summary">WordPiece는 어휘에 없는 단어를 자주 쓰이는 서브워드 조각의 조합으로 표현하도록 어휘를 학습하는 토큰화 방법이다.</span></li>
</ul>
</section>
</div>

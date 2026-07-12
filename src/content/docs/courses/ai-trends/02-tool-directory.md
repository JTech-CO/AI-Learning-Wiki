---
title: "작업별 AI 도구 디렉터리 — 텍스트·이미지·영상·음성·코딩"
description: "유행하는 도구 이름을 나열하는 대신, 작업·데이터·협업·예산 제약으로 후보를 좁히고 짧은 실전 시험으로 선택하는 갱신형 도구 디렉터리다."
sidebar:
  order: 2
---
_유행하는 도구 이름을 나열하는 대신, 작업·데이터·협업·예산 제약으로 후보를 좁히고 짧은 실전 시험으로 선택하는 갱신형 도구 디렉터리다._

:::note[학습 목표]
- 작업 유형과 민감도에 맞는 AI 도구 후보를 공식 제품 페이지에서 찾는다
- 무료 체험보다 내보내기·협업·권한·API·데이터 정책을 포함해 비교한다
- 한 도구에 종속되지 않도록 원본과 대체 경로를 남긴다
:::

> ‘최강 도구’는 작업과 제약에 따라 달라진다. 이 문서는 특정 제품을 영구 1위로 고정하지 않고 **후보군과 선택 절차**를 제공한다. 기능과 요금은 사용 직전에 공식 페이지를 확인한다.

## 작업별 후보군

### 텍스트·조사·문서

- [ChatGPT](https://openai.com/chatgpt/)
- [Claude](https://www.anthropic.com/claude)
- [Gemini](https://gemini.google.com/)

확인할 것: 파일 형식, 근거 링크, 프로젝트 지식, 공유 권한, 데이터 사용 설정.

### 코딩·리포지토리 작업

- [GitHub Copilot](https://github.com/features/copilot)
- [Cursor](https://www.cursor.com/)
- 각 모델 공급자의 코딩·에이전트 제품과 API

확인할 것: 저장소 전체 문맥, 터미널 승인, 테스트 실행, diff 검토, 비밀정보 제외, 조직 정책.

### 이미지·디자인

- [OpenAI 이미지 생성](https://platform.openai.com/docs/guides/image-generation)
- [Adobe Firefly](https://www.adobe.com/products/firefly.html)
- [Google 이미지 생성 모델](https://ai.google.dev/gemini-api/docs/image-generation)

확인할 것: 상업 이용 조건, 참조 이미지 처리, 편집·마스킹, 해상도, 브랜드 일관성.

### 영상·음성

- [OpenAI 영상](https://openai.com/sora/)
- [Google 영상 생성](https://deepmind.google/models/veo/)
- [ElevenLabs](https://elevenlabs.io/)

확인할 것: 길이, 워터마크, 화자 동의, 음성 복제 정책, 자막·프로젝트 파일 내보내기.

### 자동화·연결

- [Zapier](https://zapier.com/)
- [n8n](https://n8n.io/)
- [Make](https://www.make.com/)

확인할 것: 재시도, 분기, 비밀관리, 실행 기록, 자체 호스팅, 작업량별 비용.

## 20분 선택 시험

1. 실제 작업과 비슷하지만 민감정보가 없는 샘플 하나를 만든다.
2. 후보 2~3개에 같은 입력과 완료 기준을 적용한다.
3. 결과 품질, 수정 횟수, 걸린 시간, 내보내기 형식, 비용을 기록한다.
4. 원본 파일과 프롬프트를 공급자 밖에도 보관할 수 있는지 확인한다.
5. 기본 도구 하나와 대체 도구 하나를 정한다.

## 피해야 할 선택 방식

- 소셜미디어 데모 하나만 보고 결제
- 무료 여부만 비교하고 내보내기·협업 비용을 무시
- 민감한 실제 데이터를 체험 계정에 바로 입력
- 결과물을 공급자 전용 형식으로만 보관
- 자동화가 실패했을 때 재시도와 알림 없이 운영

## 완료 체크리스트

- 작업, 입력, 결과물, 민감도, 월 사용량을 먼저 적었다
- 후보별 공식 기능·요금·정책 페이지를 확인했다
- 같은 샘플로 후보를 시험했다
- 원본 보관과 대체 도구 전환 방법을 정했다

## 실전 프롬프트

### AI 도구 후보 3개로 좁히기

```text
아래 작업에 맞는 AI 도구 후보를 최대 3개로 좁혀줘. 최신 기능과 가격은 각 도구의 공식 페이지에서 확인해야 한다고 표시하고, 결과 품질·학습 난이도·협업·내보내기·데이터 정책·월 예상 비용을 비교하는 표를 만들어줘. 마지막에는 20분 안에 실행할 동일 샘플 테스트를 제안해줘.

[작업]: [예: 30초 제품 영상 제작]
[입력 자료]: [텍스트/이미지/영상/코드]
[필수 결과물]: [형식]
[민감정보]: [있음/없음]
[월 사용량·예산]: [설명]
```

#### 회의 요약 자동화 예시

**입력**

```text
[작업]: 한국어 회의 녹음에서 요약과 담당자별 할 일 생성
[입력 자료]: 30~60분 음성
[필수 결과물]: Markdown과 CSV
[민감정보]: 있음
[월 사용량·예산]: 월 40회, 10만원 이하
```

**기대 결과**

보안과 내보내기를 우선한 후보 비교표, 샘플 시험, 도입 전 확인 질문

> 💡 도구 추천 결과는 후보 생성용이다. 계약과 데이터 처리 조건은 공식 문서와 조직 정책으로 최종 확인한다.

`tool-selection` `comparison` `wiki-authored`

## 직접 만들기 (미션)

:::tip
지금 반복하는 작업 하나를 골라 후보 도구 2개를 같은 샘플로 시험하고, 기본 도구·대체 도구·원본 보관 방식을 한 장에 기록한다.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 도구 이름보다 작업과 완료 기준을 먼저 정의했는가 | 5 |
| 동일 샘플로 품질·시간·수정 횟수·내보내기를 비교했는가 | 5 |
| 데이터 정책과 대체 도구 전환 경로를 확인했는가 | 5 |

## 관련 개념

- [Tool Selection](/concepts/tool-selection/)
- [Requirements](/concepts/requirements/)
- [Privacy](/concepts/privacy/)
- [Workflow](/concepts/workflow/)
- [Export](/concepts/export/)
- [Vendor Lock In](/concepts/vendor-lock-in/)


---
<sub>출처: [ai-learning-wiki](https://eduverse-ai.app/learn?course=trends&node=ai_ref_tool_directory) · 방식: manual</sub>
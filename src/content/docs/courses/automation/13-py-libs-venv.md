---
title: "라이브러리·pip·가상환경"
description: "pip로 라이브러리 설치, 가상환경으로 프로젝트별 격리, requirements 관리."
sidebar:
  order: 13
---
_pip로 라이브러리 설치, 가상환경으로 프로젝트별 격리, requirements 관리._

:::note[학습 목표]
- 이 레슨이 끝나면, 프로젝트마다 독립된 가상환경을 만들고 pip로 라이브러리를 설치한 뒤 requirements.txt로 그 목록을 남겨, 다른 컴퓨터에서도 똑같이 재현할 수 있습니다.
:::

> "pip install 했더니 다른 프로젝트가 갑자기 깨졌다" — 파이썬 초보의 흔한 악몽입니다. 가상환경 하나만 배우면 이 지옥에서 영원히 탈출합니다.

## 이 레슨에서 만드는 것

이 레슨이 끝나면, 프로젝트마다 독립된 가상환경을 만들고 pip로 라이브러리를 설치한 뒤 requirements.txt로 그 목록을 남겨, 다른 컴퓨터에서도 똑같이 재현할 수 있습니다.

## 핵심 개념

파이썬은 pip라는 도구로 남이 만든 라이브러리(예: requests, pandas)를 인터넷에서 내려받아 씁니다. 그런데 모든 라이브러리를 컴퓨터 전체에 깔면 A프로젝트는 pandas 1.5가, B프로젝트는 2.0이 필요할 때 충돌이 납니다. 가상환경(venv)은 프로젝트마다 '전용 사물함'을 만들어 라이브러리를 그 안에만 격리시키는 장치입니다. 마지막으로 requirements.txt는 '내가 설치한 라이브러리 영수증'이라, 이 파일만 있으면 누구나 똑같은 환경을 복원할 수 있습니다.

### 왜 작동하는가

가상환경은 컴퓨터 안에 프로젝트별 '작은 상자'를 하나씩 따로 만드는 것과 같아요. venv가 라이브러리 설치 경로를 그 상자 안으로만 묶어두기 때문에, A 프로젝트의 pandas 1.5와 B 프로젝트의 pandas 2.0이 서로 부딪히지 않습니다. 그래서 당신은 프로젝트 폴더 안에서 venv를 켜고 설치만 하면, 충돌 걱정은 파이썬이 알아서 막아줍니다.

## 👀 따라하기 예시

새 프로젝트 'weather_app'에서 requests 라이브러리가 필요한 상황이에요. 제가 먼저 처음부터 끝까지 해볼게요, 눈으로 따라오세요.

### 1. ① 폴더 만들고 이동: mkdir weather_app && cd weather_app

**실제 결과**

```text
(터미널 프롬프트가) weather_app %
```

> 지금부터 하는 모든 설치는 이 폴더 전용 상자 안에만 담길 거예요.

### 2. ② 가상환경 생성: python -m venv venv

**실제 결과**

```text
(새 폴더 venv/ 가 생성됨, 별다른 출력 없음)
```

> venv 폴더 자체가 '전용 사물함'이에요. 아직 켜진 건 아니에요.

### 3. ③ 활성화: source venv/bin/activate

**실제 결과**

```text
(venv) weather_app %
```

> 프롬프트 맨 앞에 (venv) 가 뜨는 순간이 바로 '지금부터 이 상자 안에서 작업'이라는 신호예요. 이 표시 없이 설치하면 소용없어요.

### 4. ④ 설치 + 확인: pip install requests 후 pip list

**실제 결과**

```text
requests   2.32.3
```

> pip list로 실제로 상자 안에 들어갔는지 눈으로 확인하는 습관이 나중에 오류를 크게 줄여줘요.

### 완성 결과

완성물은 (venv)가 활성화된 weather_app 폴더 + 그 안에 설치된 requests 라이브러리예요. 좋은 결과의 기준: (1) 설치 전 프롬프트에 (venv)가 보였다 (2) pip list에 requests가 정확히 나타난다 (3) 다른 프로젝트 폴더에서는 이 requests가 안 보인다(=격리 성공).

## 단계별 따라하기

### 1단계 — 프로젝트 폴더 만들고 열기 (3분)

바탕화면에 프로젝트 폴더를 만들고 터미널(맥: 터미널, 윈도우: PowerShell)에서 그 폴더로 이동합니다. VS Code를 쓴다면 폴더를 열고 Ctrl+백틱으로 내장 터미널을 켜세요. 🙋나

**복사·실행 예시**

```text
mkdir my_first_app 로 폴더 생성 → cd my_first_app 로 진입. 프롬프트 끝이 my_first_app 으로 바뀌면 성공.
```

### 2단계 — 가상환경 생성하기 (2분)

파이썬 내장 venv 모듈로 'venv'라는 이름의 가상환경 폴더를 만듭니다. 폴더 안에 venv 하위 폴더가 생기며, 이 안에 라이브러리가 격리 저장됩니다. 🙋나

**복사·실행 예시**

```text
python -m venv venv  (윈도우에서 python이 안 되면 py -m venv venv). 실행 후 ls 또는 dir 하면 venv 폴더가 보임.
```

### 3단계 — 가상환경 활성화하기 (2분)

만든 가상환경을 켜야(activate) 이후 pip 설치가 그 안으로 들어갑니다. OS별 명령이 다릅니다. 켜지면 프롬프트 맨 앞에 (venv) 표시가 붙습니다. 🙋나

**복사·실행 예시**

```text
맥/리눅스: source venv/bin/activate  |  윈도우 PowerShell: venv\Scripts\Activate.ps1  → 줄 앞에 (venv) 가 뜨면 성공.
```

### 4단계 — 라이브러리 설치하기 (3분)

(venv)가 켜진 상태에서 pip install 로 원하는 라이브러리를 설치합니다. 설치 후 pip list 로 실제로 들어갔는지 확인하세요. 🙋나

**복사·실행 예시**

```text
pip install requests → 이어서 pip list 하면 requests 와 그 버전이 목록에 나타남.
```

### 5단계 — requirements.txt로 목록 저장하기 (2분)

pip freeze 명령으로 현재 설치된 라이브러리와 버전을 requirements.txt 파일에 저장합니다. 이 파일을 Git에 함께 올리면 협업자도 같은 환경을 만들 수 있습니다. 🙋나

**복사·실행 예시**

```text
pip freeze > requirements.txt → 파일을 열면 requests==2.32.3 처럼 이름==버전 이 줄마다 기록됨.
```

### 6단계 — 다른 곳에서 환경 복원 연습하기 (3분)

환경을 그대로 재현하는 반대 명령을 익힙니다. 새 컴퓨터/새 venv에서 requirements.txt 한 줄로 전부 설치됩니다. 막히면 🤖A 에이전트에게 에러 메시지를 붙여넣어 물어보세요. 🤝함께

**복사·실행 예시**

```text
새 가상환경 활성화 후 pip install -r requirements.txt → requirements 안의 모든 라이브러리가 자동 설치됨.
```

## 흔한 실수와 교정
- **실수:** 가상환경을 활성화하지 않고 pip install 을 실행해 라이브러리가 컴퓨터 전체에 깔린다.
  - **교정:** 설치 전 프롬프트 앞에 (venv) 표시가 있는지 항상 확인한다. 없으면 source venv/bin/activate(윈도우는 Activate.ps1)로 먼저 켠다.
- **실수:** venv 폴더를 통째로 Git에 커밋해서 저장소가 수백 MB로 부푼다.
  - **교정:** .gitignore 파일에 venv/ 한 줄을 추가한다. 공유할 것은 venv가 아니라 requirements.txt 뿐이다.
- **실수:** pip freeze 없이 라이브러리를 손으로 requirements.txt에 적어 버전이 빠지거나 오타가 난다.
  - **교정:** 항상 pip freeze > requirements.txt 로 자동 생성한다. 손으로 편집하지 않는다.

## 완료 체크리스트

- 프로젝트 전용 폴더를 만들고 그 안에서 터미널을 열었다
- python -m venv venv 로 가상환경을 생성했다
- activate 후 프롬프트 앞에 (venv) 표시를 확인했다
- pip install 로 라이브러리를 설치하고 pip list 로 확인했다
- pip freeze > requirements.txt 로 목록을 저장하고 .gitignore에 venv/를 추가했다

## 도구

- Python venv (https://docs.python.org/ko/3/library/venv.html) — 가상환경 생성 공식 문서
- pip (https://pip.pypa.io) — 라이브러리 설치·freeze 공식 도구
- PyPI (https://pypi.org) — 설치할 라이브러리 검색·버전 확인
- VS Code (https://code.visualstudio.com) — 내장 터미널로 venv 실습

## 참고 답안

mkdir my_notes && cd my_notes → python -m venv venv → source venv/bin/activate (윈도우는 venv\Scripts\Activate.ps1) → pip install pandas → pip freeze > requirements.txt → cat requirements.txt 로 pandas==버전 확인

## 실전 프롬프트

### venv 에러 해결 요청

```text
나는 파이썬 초보야. 아래 터미널 명령을 실행했더니 에러가 났어. 원인을 초보도 이해할 수 있게 한 문장으로 설명하고, 복사해서 그대로 실행할 해결 명령을 OS([맥/윈도우])에 맞게 알려줘.

실행한 명령: [내가 친 명령]
에러 메시지: [에러 전문 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `py-libs-venv`

### requirements.txt 검토

```text
아래는 내 requirements.txt 내용이야. 각 라이브러리가 무슨 용도인지 한 줄씩 설명하고, 버전이 고정되지 않았거나 위험해 보이는 항목이 있으면 알려줘.

[requirements.txt 내용 붙여넣기]
```

> 확인된 작성 예시 없음

`eduverse` `py-libs-venv`

### 가상환경 개념 재설명

```text
가상환경(venv)이 왜 필요한지, 실제 프로젝트 충돌 예시를 들어 초등학생도 이해할 비유로 설명해줘. 그리고 [맥/윈도우]에서 새 프로젝트를 시작할 때 쳐야 할 명령을 순서대로 정리해줘.
```

> 확인된 작성 예시 없음

`eduverse` `py-libs-venv`

### 활성화 확인 점검

```text
내 터미널 프롬프트가 지금 이렇게 생겼어: [프롬프트 줄 붙여넣기]. 가상환경이 지금 켜져 있는 상태인지 알려주고, 안 켜져 있다면 켜는 명령을 알려줘. OS는 [맥/윈도우]야.
```

> 확인된 작성 예시 없음

`eduverse` `py-libs-venv`

## 직접 만들기 (미션)

:::tip
이번엔 당신 차례! 새 폴더 'my_notes'를 만들고, 가상환경을 생성·활성화한 뒤 pandas 라이브러리를 설치하고, requirements.txt로 저장해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 설치하기 전 프롬프트에 (venv) 표시가 보였나요? | 5 |
| pip list에 pandas가 정확히 떴나요? | 5 |
| requirements.txt 파일을 열어보면 pandas==버전 형식으로 한 줄이 들어있나요? | 5 |

## 관련 개념

- [Libs](/concepts/libs/)
- [Venv](/concepts/venv/)


---
<sub>출처: [eduverse-ai.app](https://eduverse-ai.app/learn?course=automation&node=aut_py_libs_venv) · 방식: api-capture</sub>
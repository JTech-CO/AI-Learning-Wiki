---
title: "개발 환경 세팅: 파이썬·venv·에디터"
description: "파이썬 설치부터 가상환경(venv) 생성·활성화, pip 패키지 설치, VS Code 인터프리터 지정까지 AI 개발 환경을 처음부터 구축하고, 첫 파이썬 파일을 실행해 전체 연결을 확인한다."
sidebar:
  order: 1
---
_파이썬 설치부터 가상환경(venv) 생성·활성화, pip 패키지 설치, VS Code 인터프리터 지정까지 AI 개발 환경을 처음부터 구축하고, 첫 파이썬 파일을 실행해 전체 연결을 확인한다._

:::note[학습 목표]
- 파이썬을 설치하고 터미널에서 버전을 확인한다
- 프로젝트마다 venv를 만들고 활성화해 패키지를 격리하며, pip로 설치한 뒤 requirements.txt에 기록한다
- VS Code 인터프리터를 venv로 지정하고 첫 파이썬 파일을 실행해 환경 전체를 검증한다
:::

## 핵심 개념

개발 환경 세팅은 **요리하기 전에 주방을 세팅하는 일**이에요. 파이썬은 재료를 요리하는 도구(인터프리터), **가상환경(venv)**은 프로젝트마다 재료를 따로 담는 도시락통이라 A 프로젝트의 패키지가 B 프로젝트를 망가뜨리지 않게 격리해 줘요. `pip`는 필요한 재료(패키지)를 배달시키는 주문 앱이고, **VS Code**는 넓고 편한 조리대(에디터)예요. 이 네 가지를 처음에 제대로 맞춰두면 이후 모든 AI 코드가 예측 가능하게 돌아가요. **프로젝트마다 venv를 새로 만드는 습관**이 초보와 실무자를 가르는 가장 큰 차이예요.

### 왜 이게 될까?

컴퓨터는 명령어를 실행할 때마다 "어떤 파이썬을, 어떤 재료(패키지)와 함께" 쓸지 찾아요. venv는 프로젝트별로 독립된 도시락통을 만들어 그 안의 파이썬과 재료만 쓰게 강제하는 원리라, 활성화 표시 `(venv)`만 확인하면 돼요. 그래서 `(venv)`가 켜져 있는지만 챙기면 나머지 설치·실행은 항상 예측 가능하게 흘러가요.

## 👀 따라하기 예시 — 새 AI 프로젝트를 만들어 터미널에서 첫 코드 실행까지

**① 버전 확인** 터미널에 `python --version` → `Python 3.12.4`
> 💡 버전이 안 뜨면 PATH 설정부터 다시 봐야 하니 제일 먼저 확인해요.

**② 작업방 생성** `mkdir my-ai-project && cd my-ai-project` → 터미널 프롬프트가 `my-ai-project` 폴더 안으로 이동
> 💡 바탕화면에 흩어놓지 않고 한 폴더에 모아야 나중에 통째로 옮기거나 지우기 쉬워요.

**③ 도시락통 열기** `python -m venv venv` 후 `source venv/bin/activate` → `(venv) my-ai-project %`
> 💡 줄 앞에 `(venv)`가 뜨는 순간이 바로 "이 프로젝트 전용 도시락통이 열렸다"는 신호예요. 아하 포인트!

**④ 패키지 설치·기록** `pip install requests` 후 `pip freeze > requirements.txt` → `Successfully installed requests-2.32.3 …`
> 💡 설치만 하고 끝내면 나중에 재현이 안 돼요. `requirements.txt`에 기록해둬야 팀원이나 미래의 나도 똑같이 복원할 수 있어요.

좋은 결과의 기준: (1) 터미널 줄 앞에 항상 `(venv)` 표시가 보인다 (2) `requirements.txt`에 설치한 패키지가 버전과 함께 남아있다 (3) VS Code 하단 상태바가 `./venv` 인터프리터를 가리킨다.

## 단계별 따라하기

1. **파이썬 설치하고 버전 확인** — python.org 다운로드 페이지에서 최신 안정 버전(3.12 이상) 설치. Windows는 설치 첫 화면에서 반드시 **'Add Python to PATH'** 체크박스를 켠 뒤 설치, Mac은 홈브루가 있으면 `brew install python`. (터미널: `python --version` → `Python 3.12.4`. Mac에서 안 되면 `python3 --version`)
2. **프로젝트 폴더 만들고 그 안으로 이동** — 바탕화면이 아니라 관리하기 쉬운 위치에 프로젝트 폴더를 하나 만들고 터미널에서 그 폴더로 `cd`. (`mkdir my-ai-project` 후 `cd my-ai-project`. Windows 예: `cd C:\Users\내이름\my-ai-project`)
3. **가상환경(venv) 만들고 활성화** — 프로젝트 폴더 안에서 venv를 생성한 뒤 활성화. 활성화되면 터미널 줄 맨 앞에 `(venv)` 표시가 떠요. (생성: `python -m venv venv` / 활성화 Mac·Linux: `source venv/bin/activate` / 활성화 Windows PowerShell: `venv\Scripts\Activate.ps1`)
4. **pip로 첫 패키지 설치하고 기록 남기기** — `(venv)`가 켜진 상태에서 pip로 패키지를 설치하고, `requirements.txt`에 목록을 저장해두면 나중에 그대로 재현할 수 있어요. 에러가 나면 그 메시지를 그대로 AI에게 붙여넣어 해결해요. (설치: `pip install requests` → 기록: `pip freeze > requirements.txt` → `requests==2.32.3`처럼 저장)
5. **VS Code 설치하고 인터프리터를 venv로 지정** — VS Code 설치 후 Python 확장(마이크로소프트) 설치. 프로젝트 폴더를 열고 하단 상태바나 `Ctrl+Shift+P` → `Python: Select Interpreter`에서 방금 만든 `./venv`를 선택. 이걸 지정해야 VS Code가 도시락통 안의 파이썬을 써요. (목록에서 `('venv': venv)` 또는 `./venv/bin/python` 선택)
6. **첫 파이썬 파일 실행으로 전체 확인** — `hello.py` 파일을 만들어 한 줄 코드를 넣고 실행. 터미널에 결과가 뜨면 파이썬·venv·에디터가 모두 연결된 거예요.

```python
# hello.py
print("환경 세팅 성공")
```

```
python hello.py
# 출력: 환경 세팅 성공
```

## 흔한 실수 → 교정

- ✗ Windows 설치 때 'Add Python to PATH'를 체크 안 해서 터미널에서 `python` 명령이 안 먹힘 → **파이썬을 삭제 후 재설치하며 첫 화면에서 'Add Python to PATH'를 반드시 체크.** 재설치가 싫으면 설치 관리자의 Modify에서 PATH 옵션을 추가.
- ✗ venv를 만들어놓고 활성화(activate)를 안 한 채 `pip install` 해서 패키지가 엉뚱한 전역에 깔림 → **`pip install` 전에 터미널 줄 맨 앞에 `(venv)` 표시가 있는지 먼저 확인.** 없으면 activate 명령을 다시 실행한 뒤 설치.
- ✗ VS Code에서 인터프리터를 venv로 안 바꿔서 '패키지 설치했는데 import가 안 된다'며 헤맴 → **`Ctrl+Shift+P` → `Python: Select Interpreter`에서 `./venv`를 선택.** 상태바 하단에 venv 경로가 뜨는지 확인 후 파일을 다시 실행.

## 도구

- 🛠 **Python** (python.org) — 파이썬 인터프리터 설치.
- 🛠 **VS Code** (code.visualstudio.com) — 무료 코드 에디터.
- 🛠 **pip** (docs.python.org/ko) — 파이썬 패키지 설치·관리 도구.
- 🛠 **ChatGPT·Claude** (claude.ai) — 설치 에러·명령어를 즉시 해결해 주는 도우미.

## 실전 프롬프트

### 설치 에러 그대로 해결받기

```text
나는 [Windows 11 / macOS]에서 파이썬 개발 환경을 처음 세팅 중이야. 다음 명령을 실행했더니 이런 에러가 났어:
명령: [입력한 명령어]
에러 메시지: [전체 에러 메시지].
원인이 뭔지 초보도 알아듣게 설명하고, 복사해서 그대로 실행할 수 있는 해결 명령을 순서대로 알려줘.
```

`개발환경` `에러해결` `파이썬`

### 내 OS 맞춤 venv 명령 받기

```text
내 운영체제는 [Windows 11 PowerShell / macOS 터미널]이야. 'my-ai-project'라는 폴더에서 가상환경(venv)을 만들고 활성화하는 정확한 명령어를 한 줄씩 복사할 수 있게 순서대로 알려줘. 활성화가 됐는지 확인하는 방법도 함께.
```

`개발환경` `venv` `명령어`

### 패키지 무엇을 깔지 추천받기

```text
나는 [웹에서 데이터 가져와 분석하기 / 간단한 챗봇 만들기]를 파이썬으로 해보고 싶어. 초보에게 꼭 필요한 파이썬 패키지 3~5개를 추천하고, 각각 무슨 역할인지 한 줄 설명과 pip install 명령을 같이 줘.
```

`개발환경` `pip` `패키지`

### VS Code 세팅 점검받기

```text
VS Code에서 파이썬을 쓰려고 해. 방금 만든 venv를 인터프리터로 지정하는 방법을 단계별로 알려주고, 제대로 연결됐는지 확인하는 체크 포인트도 알려줘. 나는 [Windows / Mac] 사용자야.
```

`개발환경` `VS Code` `인터프리터`

## 직접 만들기 (미션)

:::tip
이제 당신 차례! requests 대신 다른 패키지(예: numpy)로 똑같은 흐름을 처음부터 끝까지 직접 해보세요. 새 폴더 생성 → venv 생성·활성화 → `pip install numpy` → `requirements.txt` 저장 → VS Code에서 인터프리터를 venv로 지정 → 파일 하나 실행까지 전 과정을 스스로 완주해보세요.
:::

## 채점 기준

| 기준 | 배점 |
| --- | --- |
| 설치·실행 내내 터미널 줄 앞에 (venv) 표시가 계속 떠 있었나 | 5 |
| requirements.txt에 numpy가 버전과 함께 기록되었나 | 5 |
| VS Code에서 인터프리터를 venv로 바꾼 뒤에 실행했나 | 5 |

## 관련 개념

- [Python](/concepts/python/)
- [Venv](/concepts/venv/)
- [Virtual Environment](/concepts/virtual-environment/)
- [Pip](/concepts/pip/)
- [Vscode](/concepts/vscode/)
- [Dev Environment](/concepts/dev-environment/)

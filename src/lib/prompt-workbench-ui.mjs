import {
  createWorkbenchStorageKey,
  extractBracketVariables,
  fillPromptTemplate,
  inferWorkbenchFormat,
  normalizeWorkbenchState,
  validateWorkbenchOutput,
} from './prompt-workbench.mjs';

function appendText(parent, tagName, text, className = '') {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.append(element);
  return element;
}

function readState(prompt, variables) {
  const defaultFormat = inferWorkbenchFormat(prompt.kind);
  try {
    const raw = localStorage.getItem(createWorkbenchStorageKey(prompt.id));
    const state = normalizeWorkbenchState(raw ? JSON.parse(raw) : {}, variables);
    if (!raw) state.validationFormat = defaultFormat;
    return state;
  } catch {
    return normalizeWorkbenchState({ validationFormat: defaultFormat }, variables);
  }
}

function labeledTextarea(labelText, { rows, value, placeholder }) {
  const label = document.createElement('label');
  appendText(label, 'span', labelText);
  const textarea = document.createElement('textarea');
  textarea.rows = rows;
  textarea.value = value;
  textarea.placeholder = placeholder;
  textarea.autocomplete = 'off';
  label.append(textarea);
  return { label, textarea };
}

export function createPromptWorkbench(prompt) {
  const details = document.createElement('details');
  details.className = 'prompt-workbench';
  details.dataset.promptWorkbench = prompt.id;
  const summary = document.createElement('summary');
  summary.textContent = '프롬프트 워크벤치 열기';
  details.append(summary);

  const initialize = () => {
    if (details.dataset.initialized === 'true') return;
    details.dataset.initialized = 'true';
    const variables = extractBracketVariables(prompt.template);
    let state = readState(prompt, variables);
    const panel = document.createElement('div');
    panel.className = 'prompt-workbench-panel';
    appendText(
      panel,
      'p',
      '변수를 채워 완성 프롬프트를 만들고, 테스트 메모와 기대 출력을 이 브라우저에만 저장할 수 있다. 외부 모델이나 서버로 전송하지 않는다.',
      'prompt-workbench-privacy',
    );

    appendText(panel, 'h4', '변수 입력');
    const variableGrid = document.createElement('div');
    variableGrid.className = 'prompt-workbench-variables';
    const variableInputs = new Map();
    if (variables.length) {
      variables.forEach((variable) => {
        const labelText = variable.occurrences > 1
          ? `${variable.label} (${variable.occurrences}곳)`
          : variable.label;
        const { label, textarea } = labeledTextarea(labelText, {
          rows: 2,
          value: state.variableValues[variable.token] ?? '',
          placeholder: variable.token,
        });
        textarea.dataset.variableToken = variable.token;
        variableGrid.append(label);
        variableInputs.set(variable.token, textarea);
      });
    } else {
      appendText(
        variableGrid,
        'p',
        '자동으로 추출할 대괄호 변수가 없다. 아래에서 원문 비교와 테스트 기록을 사용할 수 있다.',
        'prompt-workbench-empty',
      );
    }
    panel.append(variableGrid);

    appendText(panel, 'h4', '원본/변형 비교');
    const compare = document.createElement('div');
    compare.className = 'prompt-workbench-compare';
    const originalSection = document.createElement('section');
    appendText(originalSection, 'h5', '원본');
    const original = document.createElement('pre');
    original.tabIndex = 0;
    original.setAttribute('role', 'region');
    original.setAttribute('aria-label', '원본 프롬프트');
    appendText(original, 'code', prompt.template);
    originalSection.append(original);
    const completedSection = document.createElement('section');
    appendText(completedSection, 'h5', '변수 반영본');
    const completed = document.createElement('pre');
    completed.tabIndex = 0;
    completed.setAttribute('role', 'region');
    completed.setAttribute('aria-label', '변수 반영 프롬프트');
    const completedCode = appendText(completed, 'code', prompt.template);
    completedSection.append(completed);
    compare.append(originalSection, completedSection);
    panel.append(compare);

    const completionStatus = appendText(panel, 'p', '', 'prompt-workbench-status');
    completionStatus.setAttribute('role', 'status');
    completionStatus.setAttribute('aria-live', 'polite');
    const actions = document.createElement('div');
    actions.className = 'prompt-workbench-actions';
    const copyCompleted = appendText(actions, 'button', '완성 프롬프트 복사');
    copyCompleted.type = 'button';
    const resetVariables = appendText(actions, 'button', '변수 비우기');
    resetVariables.type = 'button';
    panel.append(actions);

    appendText(panel, 'h4', '로컬 테스트 기록');
    const testGrid = document.createElement('div');
    testGrid.className = 'prompt-workbench-tests';
    const testInputField = labeledTextarea('테스트 입력', {
      rows: 5,
      value: state.testInput,
      placeholder: '실행할 때 함께 제공할 입력이나 조건을 기록한다.',
    });
    const expectedOutputField = labeledTextarea('기대 출력', {
      rows: 5,
      value: state.expectedOutput,
      placeholder: '사람이 확인할 기대 결과 또는 출력 구조를 기록한다.',
    });
    testGrid.append(testInputField.label, expectedOutputField.label);
    panel.append(testGrid);

    const validationRow = document.createElement('div');
    validationRow.className = 'prompt-workbench-validation-controls';
    const formatLabel = document.createElement('label');
    appendText(formatLabel, 'span', '기대 출력 형식 검사');
    const format = document.createElement('select');
    [
      ['none', '검사 안 함'],
      ['markdown', 'Markdown'],
      ['json-schema', 'JSON Schema Draft 2020-12'],
      ['yaml', 'YAML 기본 구조'],
    ].forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      format.append(option);
    });
    format.value = state.validationFormat;
    formatLabel.append(format);
    const clearRecord = appendText(validationRow, 'button', '로컬 기록 지우기');
    clearRecord.type = 'button';
    validationRow.prepend(formatLabel);
    panel.append(validationRow);

    const validationResult = document.createElement('div');
    validationResult.className = 'prompt-workbench-validation';
    validationResult.setAttribute('role', 'status');
    validationResult.setAttribute('aria-live', 'polite');
    const validationSummary = appendText(validationResult, 'p', '');
    const validationIssues = document.createElement('ul');
    validationResult.append(validationIssues);
    panel.append(validationResult);
    const saveStatus = appendText(panel, 'p', '', 'prompt-workbench-save-status');
    saveStatus.setAttribute('aria-live', 'polite');

    const collectValues = () => Object.fromEntries(
      [...variableInputs].map(([token, input]) => [token, input.value]),
    );
    const save = () => {
      state = normalizeWorkbenchState({
        variableValues: collectValues(),
        testInput: testInputField.textarea.value,
        expectedOutput: expectedOutputField.textarea.value,
        validationFormat: format.value,
      }, variables);
      try {
        localStorage.setItem(createWorkbenchStorageKey(prompt.id), JSON.stringify(state));
        saveStatus.textContent = '이 브라우저에 자동 저장됐다.';
      } catch {
        saveStatus.textContent = '브라우저 저장 공간을 사용할 수 없어 현재 화면에서만 유지된다.';
      }
    };
    const updatePreview = () => {
      const filled = fillPromptTemplate(prompt.template, collectValues());
      completedCode.textContent = filled.completed;
      completionStatus.textContent = filled.unresolved.length
        ? `반영 ${filled.replacedCount}곳 · 미입력 변수 ${filled.unresolved.length}개`
        : `모든 변수 입력 완료 · ${filled.replacedCount}곳 반영`;
      copyCompleted.dataset.completedPrompt = filled.completed;
    };
    const updateValidation = () => {
      const result = validateWorkbenchOutput(expectedOutputField.textarea.value, format.value);
      validationResult.dataset.status = result.status;
      validationSummary.textContent = result.summary;
      validationIssues.replaceChildren(...result.issues.map(({ message, severity }) => {
        const item = document.createElement('li');
        item.dataset.severity = severity;
        item.textContent = message;
        return item;
      }));
    };
    const update = () => {
      updatePreview();
      updateValidation();
      save();
    };

    variableInputs.forEach((input) => input.addEventListener('input', update));
    testInputField.textarea.addEventListener('input', save);
    expectedOutputField.textarea.addEventListener('input', () => {
      updateValidation();
      save();
    });
    format.addEventListener('change', () => {
      updateValidation();
      save();
    });
    copyCompleted.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(copyCompleted.dataset.completedPrompt ?? prompt.template);
        copyCompleted.textContent = '완성 프롬프트 복사됨';
      } catch {
        saveStatus.textContent = '클립보드 권한이 없어 복사하지 못했다.';
      }
      setTimeout(() => { copyCompleted.textContent = '완성 프롬프트 복사'; }, 1200);
    });
    resetVariables.addEventListener('click', () => {
      variableInputs.forEach((input) => { input.value = ''; });
      update();
      variableInputs.values().next().value?.focus();
    });
    clearRecord.addEventListener('click', () => {
      variableInputs.forEach((input) => { input.value = ''; });
      testInputField.textarea.value = '';
      expectedOutputField.textarea.value = '';
      format.value = inferWorkbenchFormat(prompt.kind);
      try {
        localStorage.removeItem(createWorkbenchStorageKey(prompt.id));
      } catch {
        // 현재 화면의 초기화는 저장소 사용 가능 여부와 무관하게 유지한다.
      }
      updatePreview();
      updateValidation();
      saveStatus.textContent = '이 프롬프트의 로컬 기록을 지웠다.';
    });

    updatePreview();
    updateValidation();
    details.append(panel);
  };

  details.addEventListener('toggle', () => {
    if (details.open) initialize();
  });
  return details;
}

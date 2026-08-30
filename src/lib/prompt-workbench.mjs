import { validatePromptSchema } from './prompt-schema.mjs';

export const PROMPT_WORKBENCH_VERSION = '1.0.0';

const STORAGE_PREFIX = 'ai-learning-wiki:prompt-workbench:v1:';
const SUPPORTED_FORMATS = new Set(['none', 'markdown', 'json-schema', 'yaml']);
const BRACKET_VARIABLE = /\[([^\[\]\r\n]{1,120})\]/gu;

const issue = (message, severity = 'error') => ({ message, severity });

function normalizeLabel(value) {
  return String(value ?? '').replace(/\s+/gu, ' ').trim();
}

function balancedFlowCharacters(text) {
  const pairs = { ']': '[', '}': '{' };
  const stack = [];
  let quote = '';
  let escaped = false;

  for (const character of text) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (character === '\\' && quote === '"') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '[' || character === '{') stack.push(character);
    if (character === ']' || character === '}') {
      if (stack.pop() !== pairs[character]) return false;
    }
  }

  return stack.length === 0 && quote === '';
}

export function createWorkbenchStorageKey(promptId) {
  const normalized = String(promptId ?? '').trim();
  if (!normalized) throw new TypeError('프롬프트 ID가 필요하다.');
  return `${STORAGE_PREFIX}${normalized}`;
}

export function extractBracketVariables(template) {
  const source = String(template ?? '');
  const variables = [];
  const byToken = new Map();

  for (const match of source.matchAll(BRACKET_VARIABLE)) {
    const token = match[0];
    const label = normalizeLabel(match[1]);
    const start = match.index ?? 0;
    const end = start + token.length;
    const isEscaped = source[start - 1] === '\\';
    const isMarkdownLink = source[end] === '(' || (source[start - 1] === '!' && source[end] === '(');
    const looksLikeVariable = /[\p{L}\p{N}]/u.test(label) || /^(?:\.{2,}|…+)$/u.test(label);
    if (!label || isEscaped || isMarkdownLink || !looksLikeVariable) continue;

    const existing = byToken.get(token);
    if (existing) {
      existing.occurrences += 1;
      existing.positions.push(start);
      continue;
    }

    const variable = {
      id: `variable-${variables.length + 1}`,
      token,
      label,
      occurrences: 1,
      positions: [start],
    };
    byToken.set(token, variable);
    variables.push(variable);
  }

  return variables;
}

export function fillPromptTemplate(template, values = {}) {
  let completed = String(template ?? '');
  const variables = extractBracketVariables(completed);
  const unresolved = [];
  let replacedCount = 0;

  for (const variable of variables) {
    const rawValue = values instanceof Map ? values.get(variable.token) : values[variable.token];
    const value = String(rawValue ?? '').trim();
    if (!value) {
      unresolved.push(variable);
      continue;
    }
    completed = completed.split(variable.token).join(value);
    replacedCount += variable.occurrences;
  }

  return {
    completed,
    variables,
    unresolved,
    replacedCount,
    complete: unresolved.length === 0,
  };
}

export function inferWorkbenchFormat(promptKind) {
  const kind = String(promptKind ?? '').toLowerCase();
  if (kind === 'markdown') return 'markdown';
  if (kind === 'json-schema') return 'json-schema';
  if (kind === 'yaml') return 'yaml';
  return 'none';
}

function validateMarkdown(text) {
  const issues = [];
  const fenceStack = [];
  let previousHeadingLevel = 0;
  let hasStructure = false;

  for (const [index, line] of text.split(/\r?\n/u).entries()) {
    const lineNumber = index + 1;
    const fence = line.match(/^\s*(`{3,}|~{3,})/u);
    if (fence) {
      hasStructure = true;
      const marker = fence[1][0];
      if (fenceStack.at(-1)?.marker === marker) fenceStack.pop();
      else fenceStack.push({ marker, lineNumber });
      continue;
    }
    if (fenceStack.length) continue;

    if (/^\s{0,3}#{1,6}[^#\s]/u.test(line)) {
      issues.push(issue(`${lineNumber}행: 제목 기호 뒤에 공백이 필요하다.`));
    }
    const heading = line.match(/^\s{0,3}(#{1,6})\s+\S/u);
    if (heading) {
      hasStructure = true;
      const level = heading[1].length;
      if (previousHeadingLevel && level > previousHeadingLevel + 1) {
        issues.push(issue(`${lineNumber}행: 제목 단계가 ${previousHeadingLevel}단계에서 ${level}단계로 건너뛴다.`, 'warning'));
      }
      previousHeadingLevel = level;
    }
    if (/^\s*(?:[-+*]|\d+\.)\s+\S/u.test(line) || /\[[^\]]+\]\([^)]*\)/u.test(line)) hasStructure = true;
    if (/\[[^\]]+\]\(\s*\)/u.test(line)) issues.push(issue(`${lineNumber}행: 링크 주소가 비어 있다.`));
  }

  for (const fence of fenceStack) issues.push(issue(`${fence.lineNumber}행에서 연 코드 블록이 닫히지 않았다.`));
  if (!hasStructure) issues.push(issue('제목·목록·링크·코드 블록과 같은 Markdown 구조를 찾지 못했다.', 'warning'));
  return issues;
}

function validateJsonSchema(text) {
  try {
    const result = validatePromptSchema({
      promptText: '워크벤치 출력 형식 검증',
      outputSchema: text,
    });
    return result.validationReport.issues
      .filter(({ scope }) => scope === 'output-schema')
      .map(({ message, severity }) => issue(message, severity === 'blocking' ? 'error' : severity));
  } catch (error) {
    return [issue(error instanceof Error ? error.message : String(error))];
  }
}

function validateYaml(text) {
  const issues = [];
  const keyScopes = new Map();
  let hasStructure = false;
  let previousIndent = 0;
  let blockScalarIndent = null;

  for (const [index, rawLine] of text.split(/\r?\n/u).entries()) {
    const lineNumber = index + 1;
    if (rawLine.includes('\t')) issues.push(issue(`${lineNumber}행: YAML 들여쓰기에 탭을 사용할 수 없다.`));
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed === '---' || trimmed === '...') continue;

    const indent = rawLine.length - rawLine.trimStart().length;
    if (blockScalarIndent !== null && indent > blockScalarIndent) continue;
    blockScalarIndent = null;

    if (indent > previousIndent + 2) {
      issues.push(issue(`${lineNumber}행: 들여쓰기가 한 단계보다 크게 증가했다.`, 'warning'));
    }
    previousIndent = indent;

    const sequence = trimmed.match(/^-\s+(.*)$/u);
    const mapping = trimmed.match(/^([^'"{}\[\],][^:]*?):(?:\s+(.*)|\s*)$/u);
    if (sequence || mapping || /^[\[{]/u.test(trimmed)) hasStructure = true;

    if (mapping) {
      const key = normalizeLabel(mapping[1]);
      const scope = `${indent}:${key}`;
      if (keyScopes.has(scope)) issues.push(issue(`${lineNumber}행: 같은 들여쓰기 범위에 '${key}' 키가 중복됐다.`));
      keyScopes.set(scope, lineNumber);
      if (/^[|>][+-]?$/u.test(mapping[2] ?? '')) blockScalarIndent = indent;
    } else if (!sequence && trimmed.includes(':') && !/^https?:\/\//u.test(trimmed)) {
      issues.push(issue(`${lineNumber}행: 매핑의 콜론 뒤에는 공백 또는 줄바꿈이 필요하다.`, 'warning'));
    }

    if (!balancedFlowCharacters(trimmed)) issues.push(issue(`${lineNumber}행: 따옴표 또는 대괄호·중괄호의 짝이 맞지 않는다.`));
  }

  if (!hasStructure) issues.push(issue('키-값 또는 목록 구조를 찾지 못했다.', 'warning'));
  return issues;
}

export function validateWorkbenchOutput(rawText, requestedFormat = 'none') {
  const text = String(rawText ?? '');
  const format = SUPPORTED_FORMATS.has(requestedFormat) ? requestedFormat : 'none';
  if (!text.trim()) {
    return {
      format,
      status: 'idle',
      valid: null,
      summary: '검증할 기대 출력을 입력한다.',
      issues: [],
    };
  }
  if (format === 'none') {
    return {
      format,
      status: 'idle',
      valid: null,
      summary: '형식을 선택하면 브라우저에서 구조를 검사한다.',
      issues: [],
    };
  }

  const issues = format === 'markdown'
    ? validateMarkdown(text)
    : format === 'json-schema'
      ? validateJsonSchema(text)
      : validateYaml(text);
  const errors = issues.filter(({ severity }) => severity === 'error');
  const warnings = issues.filter(({ severity }) => severity !== 'error');
  const status = errors.length ? 'error' : warnings.length ? 'warning' : 'ok';
  const labels = { markdown: 'Markdown', 'json-schema': 'JSON Schema', yaml: 'YAML' };
  const summary = status === 'ok'
    ? `${labels[format]} 기본 구조 검사를 통과했다.`
    : status === 'warning'
      ? `${labels[format]} 구조를 읽었지만 확인할 항목이 ${warnings.length}개 있다.`
      : `${labels[format]} 구조에서 오류 ${errors.length}개를 찾았다.`;

  return { format, status, valid: errors.length === 0, summary, issues };
}

export function normalizeWorkbenchState(value, variables = []) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const allowedTokens = new Set(variables.map(({ token }) => token));
  const variableValues = {};
  if (source.variableValues && typeof source.variableValues === 'object' && !Array.isArray(source.variableValues)) {
    for (const [token, rawValue] of Object.entries(source.variableValues)) {
      if (allowedTokens.has(token) && typeof rawValue === 'string') variableValues[token] = rawValue.slice(0, 20000);
    }
  }
  return {
    version: PROMPT_WORKBENCH_VERSION,
    variableValues,
    testInput: typeof source.testInput === 'string' ? source.testInput.slice(0, 50000) : '',
    expectedOutput: typeof source.expectedOutput === 'string' ? source.expectedOutput.slice(0, 100000) : '',
    validationFormat: SUPPORTED_FORMATS.has(source.validationFormat) ? source.validationFormat : 'none',
  };
}

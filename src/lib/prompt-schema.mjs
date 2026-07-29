import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const FORMULA_VERSION = 'prompt-schema-v1';
const TOOL_VERSION = '1.0.0';
const JSON_SCHEMA_DIALECT = 'Draft 2020-12';
const MAX_PROMPT_LENGTH = 50000;
const MAX_JSON_LENGTH = 100000;
const VARIABLE_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]*$/;
const SEVERITY_ORDER = Object.freeze({ blocking: 0, caution: 1, info: 2 });

function createIssue({
  code,
  severity,
  scope,
  path,
  message,
  suggestion,
  keyword = null,
  wikiSlugs,
}) {
  return {
    code,
    severity,
    scope,
    path,
    message,
    suggestion,
    keyword,
    wikiSlugs,
  };
}

function hasValue(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null;
}

function lineAndColumn(text, position) {
  const prefix = text.slice(0, Math.max(0, position));
  const lines = prefix.split(/\r?\n/);
  return {
    line: lines.length,
    column: lines.at(-1).length + 1,
  };
}

function jsonErrorLocation(error, text) {
  const message = error instanceof Error ? error.message : String(error);
  const explicit = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (explicit) {
    return {
      line: Number(explicit[1]),
      column: Number(explicit[2]),
    };
  }
  const positioned = message.match(/position\s+(\d+)/i);
  return positioned ? lineAndColumn(text, Number(positioned[1])) : { line: 1, column: 1 };
}

function parseJsonField(rawValue, {
  fieldName,
  scope,
  invalidCode,
  wikiSlugs,
}) {
  if (!hasValue(rawValue)) {
    return {
      provided: false,
      syntaxValid: null,
      value: null,
      rawText: '',
      issues: [],
    };
  }

  if (typeof rawValue !== 'string') {
    return {
      provided: true,
      syntaxValid: true,
      value: rawValue,
      rawText: JSON.stringify(rawValue),
      issues: [],
    };
  }

  if (rawValue.length > MAX_JSON_LENGTH) {
    return {
      provided: true,
      syntaxValid: false,
      value: null,
      rawText: rawValue,
      issues: [
        createIssue({
          code: invalidCode,
          severity: 'blocking',
          scope,
          path: `${scope}:1:1`,
          message: `${fieldName}이(가) ${MAX_JSON_LENGTH.toLocaleString('ko-KR')}자를 초과한다.`,
          suggestion: '필요한 속성과 예시만 남겨 JSON 크기를 줄인다.',
          keyword: 'maxLength',
          wikiSlugs,
        }),
      ],
    };
  }

  try {
    return {
      provided: true,
      syntaxValid: true,
      value: JSON.parse(rawValue),
      rawText: rawValue,
      issues: [],
    };
  } catch (error) {
    const { line, column } = jsonErrorLocation(error, rawValue);
    return {
      provided: true,
      syntaxValid: false,
      value: null,
      rawText: rawValue,
      issues: [
        createIssue({
          code: invalidCode,
          severity: 'blocking',
          scope,
          path: `${scope}:${line}:${column}`,
          message: `${fieldName}의 JSON 문법을 해석할 수 없다.`,
          suggestion: '따옴표, 쉼표, 중괄호와 대괄호의 짝을 확인한다.',
          keyword: 'json-syntax',
          wikiSlugs,
        }),
      ],
    };
  }
}

function normalizeVariableDefinitions(parsed) {
  const issues = [];
  const definitions = [];
  if (!parsed.provided) return { definitions, issues, usable: true };
  if (!parsed.syntaxValid) return { definitions, issues, usable: false };

  const addDefinition = (name, value, path) => {
    if (typeof name !== 'string' || !VARIABLE_NAME_PATTERN.test(name.trim())) {
      issues.push(createIssue({
        code: 'INVALID_VARIABLE_DEFINITION',
        severity: 'blocking',
        scope: 'variable-definitions',
        path,
        message: '변수 이름은 영문자 또는 밑줄로 시작하고 영문자·숫자·밑줄·점·하이픈만 사용할 수 있다.',
        suggestion: '예: customer_name, order.id, output-format',
        keyword: 'name',
        wikiSlugs: ['prompt-template'],
      }));
      return;
    }

    const normalizedName = name.trim();
    let required = true;
    let description = '';

    if (typeof value === 'boolean') {
      required = value;
    } else if (typeof value === 'string') {
      description = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('required' in value && typeof value.required !== 'boolean') {
        issues.push(createIssue({
          code: 'INVALID_VARIABLE_DEFINITION',
          severity: 'blocking',
          scope: 'variable-definitions',
          path: `${path}/required`,
          message: `${normalizedName} 변수의 required는 불리언이어야 한다.`,
          suggestion: 'required 값을 true 또는 false로 바꾼다.',
          keyword: 'type',
          wikiSlugs: ['prompt-template'],
        }));
        return;
      }
      if ('description' in value && typeof value.description !== 'string') {
        issues.push(createIssue({
          code: 'INVALID_VARIABLE_DEFINITION',
          severity: 'blocking',
          scope: 'variable-definitions',
          path: `${path}/description`,
          message: `${normalizedName} 변수의 description은 문자열이어야 한다.`,
          suggestion: 'description을 짧은 문자열로 바꾼다.',
          keyword: 'type',
          wikiSlugs: ['prompt-template'],
        }));
        return;
      }
      required = value.required ?? true;
      description = value.description ?? '';
    } else if (value !== undefined) {
      issues.push(createIssue({
        code: 'INVALID_VARIABLE_DEFINITION',
        severity: 'blocking',
        scope: 'variable-definitions',
        path,
        message: `${normalizedName} 변수 정의는 불리언·문자열·객체 중 하나여야 한다.`,
        suggestion: '객체 형식이라면 required와 description만 사용한다.',
        keyword: 'type',
        wikiSlugs: ['prompt-template'],
      }));
      return;
    }

    definitions.push({
      name: normalizedName,
      required,
      description,
      path,
    });
  };

  if (Array.isArray(parsed.value)) {
    parsed.value.forEach((entry, index) => {
      const path = `/variable-definitions/${index}`;
      if (typeof entry === 'string') {
        addDefinition(entry, undefined, path);
      } else if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
        if (typeof entry.name !== 'string') {
          issues.push(createIssue({
            code: 'INVALID_VARIABLE_DEFINITION',
            severity: 'blocking',
            scope: 'variable-definitions',
            path,
            message: '배열의 변수 정의 객체에는 문자열 name이 필요하다.',
            suggestion: '예: {"name":"customer_name","required":true}',
            keyword: 'required',
            wikiSlugs: ['prompt-template'],
          }));
        } else {
          addDefinition(entry.name, entry, path);
        }
      } else {
        issues.push(createIssue({
          code: 'INVALID_VARIABLE_DEFINITION',
          severity: 'blocking',
          scope: 'variable-definitions',
          path,
          message: '변수 정의 배열에는 변수 이름 문자열 또는 정의 객체만 사용할 수 있다.',
          suggestion: '문자열이나 name을 가진 객체로 바꾼다.',
          keyword: 'type',
          wikiSlugs: ['prompt-template'],
        }));
      }
    });
  } else if (
    parsed.value
    && typeof parsed.value === 'object'
    && !Array.isArray(parsed.value)
  ) {
    for (const [name, value] of Object.entries(parsed.value)) {
      addDefinition(name, value, `/variable-definitions/${name}`);
    }
  } else {
    issues.push(createIssue({
      code: 'INVALID_VARIABLE_DEFINITION',
      severity: 'blocking',
      scope: 'variable-definitions',
      path: '/variable-definitions',
      message: '변수 정의의 최상위 값은 배열 또는 객체여야 한다.',
      suggestion: '["customer_name"] 또는 {"customer_name":{"required":true}} 형식을 사용한다.',
      keyword: 'type',
      wikiSlugs: ['prompt-template'],
    }));
  }

  const firstDefinition = new Map();
  for (const definition of definitions) {
    if (firstDefinition.has(definition.name)) {
      issues.push(createIssue({
        code: 'DUPLICATE_VARIABLE_DEFINITION',
        severity: 'blocking',
        scope: 'variable-definitions',
        path: definition.path,
        message: `${definition.name} 변수가 두 번 이상 정의되어 있다.`,
        suggestion: '같은 이름의 정의를 하나로 합친다.',
        keyword: 'uniqueItems',
        wikiSlugs: ['prompt-template'],
      }));
    } else {
      firstDefinition.set(definition.name, definition);
    }
  }

  return {
    definitions: [...firstDefinition.values()],
    issues,
    usable: !issues.some(({ severity }) => severity === 'blocking'),
  };
}

function promptPosition(promptText, index) {
  const { line, column } = lineAndColumn(promptText, index);
  return { line, column };
}

function extractPromptVariables(promptText) {
  const occurrences = [];
  const issues = [];
  const tokenPattern = /{{\s*([^{}]+?)\s*}}|\$\{\s*([^{}]+?)\s*}/g;
  let match;

  while ((match = tokenPattern.exec(promptText)) !== null) {
    const name = (match[1] ?? match[2] ?? '').trim();
    const syntax = match[1] !== undefined ? 'double-brace' : 'dollar-brace';
    const { line, column } = promptPosition(promptText, match.index);
    if (!VARIABLE_NAME_PATTERN.test(name)) {
      issues.push(createIssue({
        code: 'MALFORMED_VARIABLE_TOKEN',
        severity: 'caution',
        scope: 'prompt-text',
        path: `prompt:${line}:${column}`,
        message: `${match[0]} 변수 표기의 이름이 허용 형식과 맞지 않는다.`,
        suggestion: '공백 없이 {{customer_name}} 또는 ${customer_name} 형식을 사용한다.',
        keyword: 'variable-name',
        wikiSlugs: ['prompt-template'],
      }));
      continue;
    }
    occurrences.push({
      name,
      syntax,
      token: match[0],
      index: match.index,
      line,
      column,
    });
  }

  return { occurrences, issues };
}

function compareVariables(promptText, parsedDefinitions) {
  const extracted = extractPromptVariables(promptText);
  const normalized = normalizeVariableDefinitions(parsedDefinitions);
  const issues = [...parsedDefinitions.issues, ...normalized.issues, ...extracted.issues];
  const usedNames = [...new Set(extracted.occurrences.map(({ name }) => name))];
  const definedNames = normalized.definitions.map(({ name }) => name);
  const undefinedNames = [];
  const unusedNames = [];

  if (normalized.usable) {
    const definitionSet = new Set(definedNames);
    const usedSet = new Set(usedNames);
    for (const name of usedNames) {
      if (!definitionSet.has(name)) {
        undefinedNames.push(name);
        const first = extracted.occurrences.find((occurrence) => occurrence.name === name);
        issues.push(createIssue({
          code: 'UNDEFINED_VARIABLE',
          severity: 'caution',
          scope: 'prompt-text',
          path: `prompt:${first.line}:${first.column}`,
          message: `${name} 변수가 프롬프트에서 사용됐지만 정의 목록에 없다.`,
          suggestion: '변수 정의에 추가하거나 프롬프트의 표기 이름을 기존 정의와 맞춘다.',
          keyword: 'variable-use',
          wikiSlugs: ['prompt-template'],
        }));
      }
    }
    for (const definition of normalized.definitions) {
      if (!usedSet.has(definition.name)) {
        unusedNames.push(definition.name);
        issues.push(createIssue({
          code: 'UNUSED_VARIABLE',
          severity: 'info',
          scope: 'variable-definitions',
          path: definition.path,
          message: `${definition.name} 변수가 정의됐지만 프롬프트에서 사용되지 않는다.`,
          suggestion: '불필요한 정의를 제거하거나 프롬프트에서 해당 변수를 사용한다.',
          keyword: 'variable-definition',
          wikiSlugs: ['prompt-template'],
        }));
      }
    }
  }

  return {
    definitions: normalized.definitions,
    occurrences: extracted.occurrences,
    usedNames,
    definedNames,
    undefinedNames,
    unusedNames,
    issues,
    definitionsUsable: normalized.usable,
  };
}

function ajvIssue(error, scope = 'output-schema') {
  const path = error.instancePath || '/';
  return createIssue({
    code: 'INVALID_JSON_SCHEMA',
    severity: 'blocking',
    scope,
    path: `schema:${path}`,
    message: `JSON Schema가 ${error.message ?? '규격 제약을 만족하지 않는다'}.`,
    suggestion: `키워드 ${error.keyword ?? '구조'}의 값과 위치를 Draft 2020-12 규격에 맞춘다.`,
    keyword: error.keyword ?? null,
    wikiSlugs: ['json-schema'],
  });
}

function exampleIssue(error) {
  const path = error.instancePath || '/';
  let suggestion = `스키마의 ${error.keyword ?? '제약'} 조건과 예시 출력 값을 맞춘다.`;
  if (error.keyword === 'required') {
    suggestion = `${error.params?.missingProperty ?? '필수 속성'} 필드를 예시 출력에 추가한다.`;
  } else if (error.keyword === 'additionalProperties') {
    suggestion = `${error.params?.additionalProperty ?? '허용되지 않은 속성'} 필드를 제거하거나 스키마 properties에 선언한다.`;
  } else if (error.keyword === 'type') {
    suggestion = `값을 ${error.params?.type ?? '스키마가 요구하는 타입'} 형식으로 바꾼다.`;
  }
  return createIssue({
    code: 'SCHEMA_INSTANCE_MISMATCH',
    severity: 'caution',
    scope: 'example-output',
    path: `example:${path}`,
    message: `예시 출력이 ${error.message ?? '스키마 제약을 만족하지 않는다'}.`,
    suggestion,
    keyword: error.keyword ?? null,
    wikiSlugs: ['json-schema', 'structured-output'],
  });
}

function validateSchemaAndExample(parsedSchema, parsedExample) {
  const issues = [...parsedSchema.issues, ...parsedExample.issues];
  let schemaValid = parsedSchema.provided ? false : null;
  let exampleMatchesSchema = null;
  let compiledValidator = null;

  if (parsedSchema.provided && parsedSchema.syntaxValid) {
    try {
      const ajv = new Ajv2020({
        allErrors: true,
        strict: false,
        validateFormats: true,
        allowUnionTypes: true,
      });
      addFormats(ajv);
      schemaValid = ajv.validateSchema(parsedSchema.value);
      if (!schemaValid) {
        issues.push(...(ajv.errors ?? []).map((error) => ajvIssue(error)));
      } else if (
        parsedSchema.value
        && typeof parsedSchema.value === 'object'
        && parsedSchema.value.$async === true
      ) {
        schemaValid = false;
        issues.push(createIssue({
          code: 'INVALID_JSON_SCHEMA',
          severity: 'blocking',
          scope: 'output-schema',
          path: 'schema:/$async',
          message: '비동기 JSON Schema는 이 브라우저 검증기에서 지원하지 않는다.',
          suggestion: '$async를 제거하고 동기 제약만 사용한다.',
          keyword: '$async',
          wikiSlugs: ['json-schema'],
        }));
      } else {
        try {
          compiledValidator = ajv.compile(parsedSchema.value);
        } catch (error) {
          schemaValid = false;
          issues.push(createIssue({
            code: 'INVALID_JSON_SCHEMA',
            severity: 'blocking',
            scope: 'output-schema',
            path: 'schema:/',
            message: `JSON Schema를 컴파일할 수 없다: ${error instanceof Error ? error.message : String(error)}`,
            suggestion: '해결할 수 없는 $ref와 지원하지 않는 키워드 구성을 확인한다.',
            keyword: '$ref',
            wikiSlugs: ['json-schema'],
          }));
        }
      }
    } catch (error) {
      schemaValid = false;
      issues.push(createIssue({
        code: 'INVALID_JSON_SCHEMA',
        severity: 'blocking',
        scope: 'output-schema',
        path: 'schema:/',
        message: `JSON Schema 검증기를 초기화할 수 없다: ${error instanceof Error ? error.message : String(error)}`,
        suggestion: '스키마 크기와 중첩 구조를 줄인 뒤 다시 검사한다.',
        keyword: 'compile',
        wikiSlugs: ['json-schema'],
      }));
    }
  }

  if (parsedExample.provided && parsedExample.syntaxValid) {
    if (!parsedSchema.provided) {
      issues.push(createIssue({
        code: 'EXAMPLE_WITHOUT_SCHEMA',
        severity: 'caution',
        scope: 'example-output',
        path: 'example:/',
        message: '예시 출력은 있지만 비교할 출력 JSON Schema가 없다.',
        suggestion: '출력 스키마를 입력하거나 예시 출력 검사를 비워 둔다.',
        keyword: 'schema-required',
        wikiSlugs: ['structured-output', 'json-schema'],
      }));
    } else if (schemaValid && compiledValidator) {
      exampleMatchesSchema = compiledValidator(parsedExample.value);
      if (!exampleMatchesSchema) {
        issues.push(...(compiledValidator.errors ?? []).map(exampleIssue));
      }
    }
  } else if (parsedExample.provided) {
    exampleMatchesSchema = false;
  }

  return {
    schemaValid,
    exampleMatchesSchema,
    issues,
  };
}

function buildWarnings(issues) {
  const warnings = [];
  const hasVariableMismatch = issues.some(({ code }) =>
    ['UNDEFINED_VARIABLE', 'UNUSED_VARIABLE', 'MALFORMED_VARIABLE_TOKEN'].includes(code));
  const hasInvalidDefinitions = issues.some(({ scope, severity }) =>
    scope === 'variable-definitions' && severity === 'blocking');
  const hasInvalidSchema = issues.some(({ scope, severity }) =>
    scope === 'output-schema' && severity === 'blocking');
  const hasInvalidExample = issues.some(({ scope, severity }) =>
    scope === 'example-output' && severity === 'blocking');
  const hasExampleMismatch = issues.some(({ scope, severity }) =>
    scope === 'example-output' && severity !== 'blocking');

  if (hasVariableMismatch) {
    warnings.push({
      code: 'UNRESOLVED_VARIABLE',
      severity: 'caution',
      message: '프롬프트 변수 사용과 정의 목록이 일치하지 않는다. 미정의·미사용·잘못된 표기를 확인해야 한다.',
      wikiSlugs: ['prompt-template'],
    });
  }
  if (hasInvalidDefinitions) {
    warnings.push({
      code: 'INVALID_VARIABLE_DEFINITIONS',
      severity: 'blocking',
      message: '변수 정의 JSON의 문법 또는 항목 구조가 유효하지 않아 변수 대조를 완료하지 못했다.',
      wikiSlugs: ['prompt-template'],
    });
  }
  if (hasInvalidSchema) {
    warnings.push({
      code: 'INVALID_JSON_SCHEMA',
      severity: 'blocking',
      message: '출력 JSON Schema의 문법·메타스키마 또는 참조 구성이 유효하지 않아 예시 검증을 완료하지 못했다.',
      wikiSlugs: ['json-schema', 'structured-output'],
    });
  }
  if (hasInvalidExample) {
    warnings.push({
      code: 'INVALID_EXAMPLE_JSON',
      severity: 'blocking',
      message: '예시 출력 JSON의 문법이 유효하지 않아 출력 스키마와 일치하는지 검사하지 못했다.',
      wikiSlugs: ['json-schema', 'structured-output'],
    });
  }
  if (hasExampleMismatch) {
    warnings.push({
      code: 'EXAMPLE_SCHEMA_MISMATCH',
      severity: 'caution',
      message: '예시 출력이 없거나 출력 JSON Schema의 필수 필드·타입·속성 제약과 일치하지 않는다.',
      wikiSlugs: ['json-schema', 'structured-output'],
    });
  }
  return warnings;
}

export function validatePromptSchema(input = {}) {
  const promptText = String(input.promptText ?? '');
  if (promptText.trim().length < 1) {
    throw new RangeError('프롬프트 본문은 한 글자 이상이어야 한다.');
  }
  if (promptText.length > MAX_PROMPT_LENGTH) {
    throw new RangeError(`프롬프트 본문은 ${MAX_PROMPT_LENGTH.toLocaleString('ko-KR')}자를 초과할 수 없다.`);
  }

  const parsedDefinitions = parseJsonField(input.variableDefinitions, {
    fieldName: '변수 정의',
    scope: 'variable-definitions',
    invalidCode: 'INVALID_JSON_SYNTAX',
    wikiSlugs: ['prompt-template'],
  });
  const parsedSchema = parseJsonField(input.outputSchema, {
    fieldName: '출력 스키마',
    scope: 'output-schema',
    invalidCode: 'INVALID_JSON_SYNTAX',
    wikiSlugs: ['json-schema', 'structured-output'],
  });
  const parsedExample = parseJsonField(input.exampleOutput, {
    fieldName: '예시 출력',
    scope: 'example-output',
    invalidCode: 'INVALID_JSON_SYNTAX',
    wikiSlugs: ['json-schema', 'structured-output'],
  });

  const variableValidation = compareVariables(promptText, parsedDefinitions);
  const structuredValidation = validateSchemaAndExample(parsedSchema, parsedExample);
  const issues = [...variableValidation.issues, ...structuredValidation.issues]
    .map((issue, index) => ({ ...issue, order: index }))
    .sort((left, right) =>
      SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity]
      || left.order - right.order)
    .map(({ order, ...issue }) => issue);
  const warnings = buildWarnings(issues);
  const hasBlocking = issues.some(({ severity }) => severity === 'blocking');
  const hasCaution = issues.some(({ severity }) => severity === 'caution');
  const resultStatus = hasBlocking ? 'error' : hasCaution || warnings.length > 0 ? 'warning' : 'ok';

  const assumptions = [
    {
      id: 'supported-placeholder-syntax',
      text: '프롬프트 변수는 {{name}} 또는 ${name} 형식만 변수로 인식하며 일반 중괄호 텍스트는 검사하지 않는다.',
      sourceIds: ['prompt-template'],
    },
    {
      id: 'json-schema-dialect',
      text: '출력 스키마는 JSON Schema Draft 2020-12로 검사하며 외부 네트워크의 원격 참조는 불러오지 않는다.',
      sourceIds: ['json-schema'],
    },
    {
      id: 'single-example-validation',
      text: '예시 출력 검사는 입력한 JSON 값 한 건의 구조 일치만 확인하며 모델이 항상 같은 출력을 생성한다는 뜻이 아니다.',
      sourceIds: ['structured-output'],
    },
  ];

  return {
    toolId: 'prompt-schema',
    toolVersion: TOOL_VERSION,
    formulaVersion: FORMULA_VERSION,
    calculatedAt: new Date().toISOString(),
    resultStatus,
    promptValidation: {
      valid: !issues.some(({ scope, severity }) =>
        ['prompt-text', 'variable-definitions'].includes(scope) && severity !== 'info'),
      characterCount: promptText.length,
      lineCount: promptText.split(/\r?\n/).length,
      occurrenceCount: variableValidation.occurrences.length,
      definitionsUsable: variableValidation.definitionsUsable,
      definitions: variableValidation.definitions,
      occurrences: variableValidation.occurrences,
      usedVariables: variableValidation.usedNames,
      definedVariables: variableValidation.definedNames,
      unresolvedVariables: {
        undefined: variableValidation.undefinedNames,
        unused: variableValidation.unusedNames,
      },
    },
    schemaValidation: {
      dialect: JSON_SCHEMA_DIALECT,
      schemaProvided: parsedSchema.provided,
      schemaSyntaxValid: parsedSchema.syntaxValid,
      schemaValid: structuredValidation.schemaValid,
      exampleProvided: parsedExample.provided,
      exampleJsonValid: parsedExample.syntaxValid,
      exampleMatchesSchema: structuredValidation.exampleMatchesSchema,
    },
    validationReport: {
      issueCount: issues.length,
      blockingCount: issues.filter(({ severity }) => severity === 'blocking').length,
      cautionCount: issues.filter(({ severity }) => severity === 'caution').length,
      infoCount: issues.filter(({ severity }) => severity === 'info').length,
      issues,
    },
    warnings,
    assumptions,
  };
}

export function createPortablePromptSchemaReport(result) {
  return {
    toolId: result.toolId,
    toolVersion: result.toolVersion,
    formulaVersion: result.formulaVersion,
    resultStatus: result.resultStatus,
    promptSummary: {
      characterCount: result.promptValidation.characterCount,
      lineCount: result.promptValidation.lineCount,
      occurrenceCount: result.promptValidation.occurrenceCount,
      usedVariables: result.promptValidation.usedVariables,
      definedVariables: result.promptValidation.definedVariables,
      unresolvedVariables: result.promptValidation.unresolvedVariables,
    },
    schemaValidation: result.schemaValidation,
    validationReport: result.validationReport,
    assumptions: result.assumptions,
  };
}

export function toPromptSchemaLabSession(result) {
  return {
    schemaVersion: '1.0',
    toolId: result.toolId,
    toolVersion: result.toolVersion,
    locale: 'ko-KR',
    resultStatus: result.resultStatus,
    inputs: {
      'prompt-text': {
        characters: result.promptValidation.characterCount,
        lines: result.promptValidation.lineCount,
      },
      'variable-definitions': result.promptValidation.definitions,
      'output-schema': {
        provided: result.schemaValidation.schemaProvided,
        dialect: result.schemaValidation.dialect,
      },
      'example-output': {
        provided: result.schemaValidation.exampleProvided,
      },
    },
    outputs: {
      'validation-report': result.validationReport,
      'unresolved-variables': result.promptValidation.unresolvedVariables,
      'schema-validation': result.schemaValidation,
    },
    warnings: result.warnings,
    assumptions: result.assumptions,
    wikiLinks: [
      'prompt-template',
      'structured-output',
      'json-schema',
      'function-calling',
      'tool-calling',
    ],
    provenance: {
      formulaVersion: result.formulaVersion,
      sourceVersions: [
        { id: 'json-schema-2020', version: JSON_SCHEMA_DIALECT },
        { id: 'json-schema-validation-2020', version: JSON_SCHEMA_DIALECT },
        { id: 'prompt-library', version: 'W58 baseline' },
      ],
      calculatedAt: result.calculatedAt,
    },
    privacy: {
      execution: 'client-only',
      networkAccess: 'none',
      transmitted: false,
      persisted: 'none',
    },
  };
}

export const promptSchemaConstants = Object.freeze({
  formulaVersion: FORMULA_VERSION,
  toolVersion: TOOL_VERSION,
  jsonSchemaDialect: JSON_SCHEMA_DIALECT,
  maxPromptLength: MAX_PROMPT_LENGTH,
  maxJsonLength: MAX_JSON_LENGTH,
  supportedPlaceholderSyntax: ['double-brace', 'dollar-brace'],
});

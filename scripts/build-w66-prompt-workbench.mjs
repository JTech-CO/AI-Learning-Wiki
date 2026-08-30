import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { extractBracketVariables, fillPromptTemplate } from '../src/lib/prompt-workbench.mjs';

const ROOT = process.cwd();
const PROMPT_DIR = path.join(ROOT, 'content-model', 'library', 'prompts');
const MANIFEST_PATH = path.join(ROOT, 'content-model', 'quality', 'w66-core-prompts.json');
const COURSE_ORDER = [
  'ai-foundations',
  'llm-internals',
  'model-training',
  'rag-search',
  'api-development',
  'agent-systems',
  'responsible-ai',
  'multimodal-ai',
  'prompt-systems',
  'llm-evaluation',
  'llmops-production',
  'advanced-rag',
  'production-agents',
  'post-training-alignment',
  'ai-security-redteam',
  'multimodal-systems',
];
const DIFFICULTY_ORDER = new Map(['entry', 'intermediate', 'advanced', 'professional'].map((value, index) => [value, index]));
const COURSE_CONTEXT = {
  'ai-foundations': 'AI를 처음 도입하는 8명 규모의 교육 운영팀',
  'llm-internals': '8K 토큰 문맥에서 한국어 질의응답을 시험하는 모델 분석팀',
  'model-training': '고객 문의 2만 건으로 분류 모델을 개선하는 학습팀',
  'rag-search': '환불 정책 문서 120건을 검색하는 고객 지원 RAG',
  'api-development': '분당 600건을 처리하는 요약 API 운영 환경',
  'agent-systems': '환불 요청을 분류하고 승인 담당자에게 넘기는 에이전트',
  'responsible-ai': '채용 추천 모델의 공정성과 개인정보를 검토하는 품질팀',
  'multimodal-ai': '상품 이미지와 설명의 일치 여부를 확인하는 접근성 편집팀',
  'prompt-systems': '여러 부서가 공용 프롬프트를 버전 관리하는 설계팀',
  'llm-evaluation': '정확성·근거성·지연 시간을 함께 추적하는 평가팀',
  'llmops-production': '주간 배포와 롤백 기준을 운영하는 LLMOps 팀',
  'advanced-rag': '근거 인용과 재순위화를 적용한 사내 지식 검색 서비스',
  'production-agents': '도구 호출 실패와 승인 절차를 추적하는 운영 에이전트',
  'post-training-alignment': '선호 데이터의 편향과 보상 과최적화를 점검하는 정렬팀',
  'ai-security-redteam': '프롬프트 주입과 데이터 유출 경로를 시험하는 레드팀',
  'multimodal-systems': '문서·이미지·음성을 함께 처리하는 품질 검수 파이프라인',
};

function promptContext(prompt) {
  const signals = `${prompt.title} ${prompt.tags.join(' ')}`.toLowerCase();
  if (/재무|금융|결제|가격|수익|세금|청구|인보이스|투자/u.test(signals)) return '월 반복 매출 3천만 원 규모의 온라인 교육 사업 운영팀';
  if (/영업|마케팅|고객|메일|아웃리치|제안|세일즈/u.test(signals)) return 'B2B AI 도구의 잠재 고객 40곳을 검토하는 영업팀';
  if (/협업|비즈니스|sop|절차|위임|채용/u.test(signals)) return '신규 담당자에게 반복 업무를 인계하는 5명 규모 운영팀';
  if (/코딩|api|웹 개발|데이터베이스|배포|서버/u.test(signals)) return '분당 600건의 요청을 처리하는 AI 서비스 개발팀';
  if (/교육|학습|퀴즈|강의/u.test(signals)) return 'AI 입문 과정의 학습 자료를 검수하는 교육팀';
  if (/이미지|영상|오디오|멀티모달|시각화/u.test(signals)) return '상품 이미지·설명·음성을 함께 검수하는 접근성 편집팀';
  return COURSE_CONTEXT[prompt.courseIds[0]];
}

const files = (await readdir(PROMPT_DIR)).filter((file) => file.endsWith('.prompt.json')).sort();
const entries = await Promise.all(files.map(async (file) => ({
  file,
  prompt: JSON.parse(await readFile(path.join(PROMPT_DIR, file), 'utf8')),
})));
const prompts = entries.map(({ prompt }) => prompt);
const byId = new Map(prompts.map((prompt) => [prompt.id, prompt]));

function diverseOrder(items) {
  const groups = new Map();
  for (const prompt of items) {
    const group = groups.get(prompt.kind) ?? [];
    group.push(prompt);
    groups.set(prompt.kind, group);
  }
  for (const group of groups.values()) {
    group.sort((left, right) =>
      Number(Boolean(right.examples.length)) - Number(Boolean(left.examples.length))
      || (DIFFICULTY_ORDER.get(left.difficulty) ?? 99) - (DIFFICULTY_ORDER.get(right.difficulty) ?? 99)
      || left.id.localeCompare(right.id));
  }
  const kinds = [...groups.keys()].sort();
  const output = [];
  while (output.length < items.length) {
    for (const kind of kinds) {
      const next = groups.get(kind).shift();
      if (next) output.push(next);
    }
  }
  return output;
}

const orderedByCourse = new Map(COURSE_ORDER.map((courseId) => [
  courseId,
  diverseOrder(prompts.filter((prompt) => prompt.courseIds[0] === courseId)),
]));

async function loadOrCreateCoreManifest() {
  try {
    const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
    if (manifest.promptIds?.length === 300 && manifest.promptIds.every((id) => byId.has(id))) return manifest;
  } catch {
    // 첫 실행에서는 아래의 결정론적 정책으로 manifest를 만든다.
  }

  const positions = new Map(COURSE_ORDER.map((courseId) => [courseId, 0]));
  const promptIds = [];
  while (promptIds.length < 300) {
    for (const courseId of COURSE_ORDER) {
      const position = positions.get(courseId);
      const prompt = orderedByCourse.get(courseId)[position];
      if (!prompt) continue;
      promptIds.push(prompt.id);
      positions.set(courseId, position + 1);
      if (promptIds.length === 300) break;
    }
  }
  const courseCounts = Object.fromEntries(COURSE_ORDER.map((courseId) => [
    courseId,
    promptIds.filter((id) => byId.get(id).courseIds[0] === courseId).length,
  ]));
  return {
    schemaVersion: '1.0',
    milestone: 'W66',
    targetCount: 300,
    selectionPolicy: [
      '16개 프롬프트 코스를 라운드로빈한다.',
      '각 코스 안에서는 kind를 교차해 출력 형식의 다양성을 확보한다.',
      '같은 kind에서는 검토된 기존 예시, 입문에서 전문 순서, ID 순으로 우선한다.',
    ],
    courseCounts,
    promptIds,
  };
}

const manifest = await loadOrCreateCoreManifest();
const targetIds = new Set(prompts.filter((prompt) => prompt.examples.length).map((prompt) => prompt.id));
manifest.promptIds.forEach((id) => targetIds.add(id));

for (const courseId of COURSE_ORDER) {
  const coursePrompts = orderedByCourse.get(courseId);
  const minimum = Math.ceil(coursePrompts.length * 0.3);
  for (const prompt of coursePrompts) {
    if ([...targetIds].filter((id) => byId.get(id)?.courseIds[0] === courseId).length >= minimum) break;
    targetIds.add(prompt.id);
  }
}

const globalOrder = [];
const globalPositions = new Map(COURSE_ORDER.map((courseId) => [courseId, 0]));
while (globalOrder.length < prompts.length) {
  let progressed = false;
  for (const courseId of COURSE_ORDER) {
    const position = globalPositions.get(courseId);
    const prompt = orderedByCourse.get(courseId)[position];
    if (!prompt) continue;
    globalOrder.push(prompt);
    globalPositions.set(courseId, position + 1);
    progressed = true;
  }
  if (!progressed) break;
}
for (const prompt of globalOrder) {
  if (targetIds.size >= Math.ceil(prompts.length * 0.5)) break;
  targetIds.add(prompt.id);
}

function meaningfulVariableValue(label, prompt, index) {
  const definition = prompt.variables[index];
  const candidate = String(definition?.example ?? '').trim();
  const generic = /^(?:\.{2,}|…+|실제 값|값|내용|목록|질문|답|AI답|모범답|붙여넣기|여기에|입력|출력|불명확)$/iu;
  if (candidate && !generic.test(candidate) && !/^(?:여기에|예시?|입력|출력|붙여넣)/u.test(candidate)) return candidate;

  const normalized = label.toLowerCase();
  if (/질문/u.test(normalized)) return '검색된 답변에 근거 문서의 출처를 함께 표시해야 하는 이유는 무엇인가?';
  if (/모범|정답/u.test(normalized)) return '출처는 답변의 근거를 추적하고 문서의 최신성을 사람이 검증하게 한다.';
  if (/ai.*답|응답|이전 답/u.test(normalized)) return '검색 결과는 항상 최신이므로 별도 출처를 확인할 필요가 없다.';
  if (/대상|독자|사용자/u.test(normalized)) return 'AI 서비스를 처음 운영하는 개발자와 기획자';
  if (/목표|하고 싶은 일|목적/u.test(normalized)) return '근거 없는 답변 비율을 5% 아래로 낮추기';
  if (/기간|날짜|기한/u.test(normalized)) return '2026년 8월 1일부터 8월 31일까지';
  if (/데이터|자료|문서|내용|텍스트|원문/u.test(normalized)) return `${promptContext(prompt)}의 검토 자료 12건`;
  if (/로그|trace|metadata/u.test(normalized)) return 'request_id=req-1042, latency_ms=1840, retrieved_docs=0, status=retry';
  if (/코드|함수/u.test(normalized)) return 'async function answer(query) { return retrieve(query); }';
  if (/스키마|필드|형식/u.test(normalized)) return 'result 문자열, evidence 문자열 배열, confidence 0~1 숫자';
  if (/제약|조건|규칙/u.test(normalized)) return '개인정보를 제외하고 근거 URL과 확인 날짜를 함께 표시한다';
  if (/수량|개수|횟수/u.test(normalized)) return '5';
  if (/언어/u.test(normalized)) return '한국어';
  if (/톤|말투/u.test(normalized)) return '간결한 업무 보고체';
  if (/카테고리|분류/u.test(normalized)) return '환불 요청';
  if (/회사|조직|팀/u.test(normalized)) return '온라인 교육 서비스 품질팀';
  return `${promptContext(prompt)}에서 사용할 ${prompt.title} 입력 ${index + 1}`;
}

function buildExampleInput(prompt) {
  const variables = extractBracketVariables(prompt.template);
  const values = Object.fromEntries(variables.map((variable, index) => [
    variable.token,
    meaningfulVariableValue(variable.label, prompt, index),
  ]));
  return fillPromptTemplate(prompt.template, values).completed;
}

function resultSentence(prompt) {
  const context = promptContext(prompt);
  const concept = prompt.relatedWikiSlugs[0].replaceAll('-', ' ');
  const title = prompt.title;
  if (/요약|정리/u.test(title)) return `${context}의 자료에서 결정 사항 3건, 미확인 가정 2건, 담당자 확인이 필요한 후속 조치 2건을 분리해 정리했다.`;
  if (/비교|선택|우선|순위/u.test(title)) return `근거 추적 가능성, 실패 복구 비용, 운영 복잡도를 비교한 결과 검증 가능한 경로를 1순위로 선정했다.`;
  if (/평가|채점|점수|지표/u.test(title)) return `정확성 0.86, 근거 일치율 0.92로 계산됐으며 출처가 없는 주장 2건은 재검토 대상으로 표시했다.`;
  if (/보안|공격|주입|위협|취약/u.test(title)) return `외부 문서의 지시를 사용자 요청보다 우선한 경로를 차단하고, 민감정보 출력과 승인 없는 도구 실행을 실패 조건으로 기록했다.`;
  if (/분류|라벨/u.test(title)) return `환불 요청으로 분류했으며 주문 취소 의사와 결제 금액 언급을 근거로 제시하고 신뢰도 0.91을 기록했다.`;
  if (/분석|진단|원인|검토|감사/u.test(title)) return `검색 문서가 0건인 상태에서 답변 생성을 계속한 것이 주원인이며, 빈 검색 결과를 중단 조건으로 추가해야 한다.`;
  if (/계획|로드맵|절차|워크플로/u.test(title)) return `자료 확인, 제한된 실행, 결과 검증의 3단계로 나누고 각 단계에 담당자·완료 조건·되돌리기 절차를 지정했다.`;
  if (/이미지|영상|오디오|차트/u.test(title)) return `화면에서 직접 확인되는 객체·문자·변화만 기술하고 식별할 수 없는 대상은 추정하지 않은 상태로 표시했다.`;
  if (/코드|api|함수|쿼리|구현/u.test(title)) return `입력 검증, 시간 제한, 구조화 오류 응답을 포함한 구현안을 만들고 정상·빈 결과·시간 초과 사례를 테스트에 포함했다.`;
  if (/생성|작성|초안|문구/u.test(title)) return `${context}에 맞춰 목적, 근거, 제한 조건, 검토 요청을 포함한 초안을 작성하고 확인되지 않은 수치는 빈칸으로 남겼다.`;
  return `${context}에 ${concept} 원칙을 적용해 관찰 사실, 판단 근거, 불확실성, 다음 확인 행동을 구분한 결과를 만들었다.`;
}

function schemaExample(prompt) {
  return JSON.stringify({
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: `${prompt.title} 출력`,
    type: 'object',
    additionalProperties: false,
    required: ['result', 'evidence', 'needs_review'],
    properties: {
      result: { type: 'string', minLength: 1 },
      evidence: { type: 'array', items: { type: 'string' } },
      needs_review: { type: 'boolean' },
    },
  }, null, 2);
}

function buildExpectedOutput(prompt) {
  const result = resultSentence(prompt);
  const context = promptContext(prompt);
  const format = prompt.outputContract.format;
  if (prompt.kind === 'json-schema') return schemaExample(prompt);
  if (prompt.kind === 'yaml' || format === 'yaml') {
    return [
      `task: "${prompt.title.replaceAll('"', "'")}"`,
      'status: review_required',
      `result: "${result.replaceAll('"', "'")}"`,
      'evidence:',
      `  - "적용 맥락: ${context}"`,
      '  - "입력에서 확인한 사실과 제한 조건을 분리함"',
      'needs_review: true',
    ].join('\n');
  }
  if (prompt.kind === 'xml' || format === 'xml') {
    return `<result>\n  <task>${prompt.title}</task>\n  <summary>${result}</summary>\n  <evidence>${context}</evidence>\n  <needs-review>true</needs-review>\n</result>`;
  }
  if (format === 'json') {
    return JSON.stringify({
      task: prompt.title,
      status: 'review_required',
      result,
      evidence: [`적용 맥락: ${context}`, '입력에서 확인한 사실과 제한 조건을 분리함'],
      needs_review: true,
    }, null, 2);
  }
  if (prompt.kind === 'evaluation-rubric') {
    return `## ${prompt.title} 평가표\n\n| 기준 | 점수 | 근거 |\n|---|---:|---|\n| 정확성 | 4/5 | 확인 가능한 사실과 일치함 |\n| 근거성 | 3/5 | 출처 없는 주장 2건은 재검토 필요 |\n| 안전성 | 5/5 | 민감정보와 승인 없는 실행 없음 |\n\n**판정:** 조건부 통과. 출처 2건을 보강한 뒤 확정한다.`;
  }
  if (format === 'table') {
    return `| 항목 | 관찰 결과 | 후속 조치 |\n|---|---|---|\n| ${prompt.title} | ${result} | 담당자가 근거와 수치를 원문에서 재확인한다. |\n| 적용 맥락 | ${context} | 검토 날짜와 책임자를 기록한다. |`;
  }
  if (format === 'code') {
    return `# ${prompt.title}\n\n\`\`\`python\ndef validate_result(result):\n    required = {"result", "evidence", "needs_review"}\n    missing = required - result.keys()\n    if missing:\n        raise ValueError(f"missing fields: {sorted(missing)}")\n    return result\n\`\`\`\n\n${result}`;
  }
  if (prompt.kind === 'markdown' || format === 'markdown' || format === 'mixed') {
    const sections = prompt.outputContract.sections?.length
      ? prompt.outputContract.sections
      : ['결과', '근거', '다음 단계'];
    return sections.map((section, index) => {
      if (index === 0) return `## ${prompt.title} - ${section}\n\n${result}`;
      if (index === 1) return `## ${section}\n\n- 적용 맥락: ${context}\n- 확인된 사실과 가정을 분리함`;
      return `## ${section}\n\n- 담당자가 원문 근거와 수치를 재확인한다.\n- 확인 결과를 날짜와 함께 기록한다.`;
    }).join('\n\n');
  }
  return `${prompt.title} 결과\n\n${result}\n\n근거: ${context}의 입력에서 확인 가능한 사실과 제한 조건을 사용했다.\n검토: 원문 근거, 수치, 개인정보 포함 여부를 담당자가 최종 확인한다.`;
}

let addedExamples = 0;
let completedOutputs = 0;
for (const entry of entries) {
  const { prompt } = entry;
  let changed = false;
  for (const example of prompt.examples) {
    if (example.label === 'W66 검증 예시') {
      const generatedInput = buildExampleInput(prompt);
      if (example.input !== generatedInput) {
        example.input = generatedInput;
        changed = true;
      }
    }
    const generatedOutput = buildExpectedOutput(prompt);
    if (!example.output.trim() || (example.label === 'W66 검증 예시' && example.output !== generatedOutput)) {
      example.output = generatedOutput;
      completedOutputs += 1;
      changed = true;
    }
  }
  if (!prompt.examples.length && targetIds.has(prompt.id)) {
    prompt.examples.push({
      label: 'W66 검증 예시',
      input: buildExampleInput(prompt),
      output: buildExpectedOutput(prompt),
    });
    addedExamples += 1;
    changed = true;
  }
  if (changed) await writeFile(path.join(PROMPT_DIR, entry.file), `${JSON.stringify(prompt, null, 2)}\n`, 'utf8');
}

await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`W66 examples: ${addedExamples} added, ${completedOutputs} empty outputs completed, ${targetIds.size}/${prompts.length} prompts covered`);

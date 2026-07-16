import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const plan = readJson('content-model/research/w48-library-expansion-plan.json');
const tagPolicy = readJson('content-model/prompt-library-policy.json');
const tags = Object.fromEntries(tagPolicy.controlledTags.map((tag) => [tag.id, tag.label]));
const outputDir = path.join(root, 'content-model/staging/w49-prompts');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const courseTagIds = {
  'prompt-systems': ['prompt-design', 'structured-output', 'evaluation', 'verification'],
  'llm-evaluation': ['evaluation', 'testing', 'monitoring', 'data-analysis'],
  'llmops-production': ['deployment', 'monitoring', 'api', 'data-engineering'],
  'advanced-rag': ['rag', 'search', 'citation', 'verification'],
  'production-agents': ['agent', 'automation', 'testing', 'project-management'],
  'post-training-alignment': ['model-training', 'evaluation', 'safety', 'data-analysis'],
  'ai-security-redteam': ['security', 'safety', 'testing', 'privacy'],
  'multimodal-systems': ['multimodal', 'image', 'video', 'audio'],
};
const courseCodes = {
  'prompt-systems': 'ps', 'llm-evaluation': 'le', 'llmops-production': 'lp', 'advanced-rag': 'ar',
  'production-agents': 'pa', 'post-training-alignment': 'pt', 'ai-security-redteam': 'sr', 'multimodal-systems': 'mm',
};

function quotaSequence(quotas) {
  const remaining = { ...quotas };
  const result = [];
  while (Object.values(remaining).some((count) => count > 0)) {
    for (const key of Object.keys(remaining)) {
      if (remaining[key] > 0) {
        result.push(key);
        remaining[key] -= 1;
      }
    }
  }
  return result;
}

const kinds = quotaSequence(plan.promptKindQuotas);
const difficulties = quotaSequence(plan.promptDifficultyQuotas);
const formatByKind = {
  plain: 'text', markdown: 'markdown', 'json-schema': 'json', yaml: 'yaml', xml: 'xml',
  'multi-message': 'mixed', 'evaluation-rubric': 'table',
};

function structureInstruction(kind) {
  if (kind === 'markdown') return 'Markdown으로 작성하고 `## 판단`, `## 근거`, `## 위험`, `## 실행 계획`, `## 검증` 절을 이 순서로 둔다.';
  if (kind === 'json-schema') return 'JSON만 반환한다. 최상위 키는 `decision`, `evidence`, `risks`, `actions`, `validation`이며 각 값의 자료형을 바꾸지 않는다.';
  if (kind === 'yaml') return 'YAML만 반환한다. `decision`, `evidence`, `risks`, `actions`, `validation` 키를 사용하고 들여쓰기는 두 칸으로 통일한다.';
  if (kind === 'xml') return 'XML만 반환한다. `<review>` 아래에 `<decision>`, `<evidence>`, `<risks>`, `<actions>`, `<validation>`을 한 번씩 둔다.';
  if (kind === 'multi-message') return '[SYSTEM], [CONTEXT], [TASK], [CHECK] 네 메시지 블록으로 결과를 나누고 각 블록의 책임을 명시한다.';
  if (kind === 'evaluation-rubric') return '100점 평가표로 반환한다. 기준, 배점, 관찰 근거, 점수, 개선 조치 열을 만들고 총점과 통과 여부를 마지막에 쓴다.';
  return '일반 텍스트로 작성하되 판단, 근거, 위험, 실행 계획, 검증 결과를 번호가 있는 다섯 단락으로 분리한다.';
}

function makeTemplate({ title, summary, kind, variant }) {
  const role = variant === 'design' ? '시스템 설계 검토자' : '프로덕션 운영 책임자';
  const focus = variant === 'design'
    ? '요구사항과 설계 선택이 개념의 정의 및 제약에 맞는지 검토하고 대안 간 트레이드오프를 비교'
    : '배포 이후 관측, 실패 복구, 보안 경계와 승인 절차를 실행 가능한 운영 명세로 변환';
  return `당신은 ${role}다. 검토 주제는 “${title}”이며, 백과 요약은 다음과 같다: ${summary}\n\n`
    + `입력 문맥: {{context}}\n달성 목표: {{objective}}\n제약 조건: {{constraints}}\n사용 가능한 근거: {{evidence}}\n허용 가능한 위험 수준: {{risk_tolerance}}\n\n`
    + `핵심 과업은 ${focus}하는 것이다. 먼저 입력에서 확인된 사실, 추정, 아직 알 수 없는 항목을 분리한다. 근거가 없는 수치나 제품 동작을 만들어 내지 말고, 불확실한 판단에는 확인 방법과 담당자를 붙인다. 요구사항이 충돌하면 임의로 하나를 택하지 말고 충돌 지점, 영향 범위, 결정에 필요한 추가 정보를 명시한다.\n\n`
    + `다음 절차를 지킨다. 1) 목표를 측정 가능한 성공 기준으로 바꾼다. 2) 현재 설계 또는 운영안의 전제와 의존성을 표로 정리한다. 3) 최소 두 개의 대안을 비용, 품질, 지연, 보안, 유지보수 관점에서 비교한다. 4) 실패 모드와 조기 경보 신호를 연결한다. 5) 되돌릴 수 없는 조치에는 사람 승인 지점을 둔다. 6) 작은 검증 실험과 중단 기준을 제안한다. 7) 최종 권고에는 채택 조건과 재검토 시점을 포함한다.\n\n`
    + `${structureInstruction(kind)} 개인 정보, 인증 정보, 내부 비밀은 원문을 재출력하지 말고 마스킹한다. 제공된 근거와 일반 원칙을 구분해 표시하며, 실제 배포나 정책 결정 전에는 담당 전문가의 확인이 필요하다고 밝힌다.`;
}

function outputContract(kind) {
  const base = {
    format: formatByKind[kind],
    description: '근거와 가정을 구분하고 위험, 실행 조치, 검증 기준을 빠짐없이 포함한 전문 검토 결과',
    schema: null,
    sections: ['판단', '근거', '위험', '실행 계획', '검증'],
  };
  if (kind === 'json-schema') base.schema = {
    type: 'object', required: ['decision', 'evidence', 'risks', 'actions', 'validation'],
    properties: {
      decision: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } },
      risks: { type: 'array', items: { type: 'string' } }, actions: { type: 'array', items: { type: 'string' } },
      validation: { type: 'array', items: { type: 'string' } },
    },
  };
  return base;
}

const staged = [];
let globalIndex = 0;
for (const course of plan.courses) {
  const candidates = course.sourceSteps.flatMap((step) => [
    { ...step, variant: 'design', suffix: '설계 검토 패키지' },
    { ...step, variant: 'operations', suffix: '운영 명세 패키지' },
  ]).slice(0, course.promptQuota);
  for (const [courseIndex, candidate] of candidates.entries()) {
    const article = readJson(`content-model/articles/${candidate.wikiSlug}.article.json`);
    const kind = kinds[globalIndex];
    const difficulty = difficulties[globalIndex];
    const id = `pro-${courseCodes[course.courseId]}-${String(courseIndex + 1).padStart(2, '0')}-${candidate.variant === 'design' ? 'review' : 'ops'}`;
    const title = `${article.title} · ${course.title} ${candidate.suffix}`;
    const prompt = {
      id,
      version: 1,
      title,
      summary: `${article.title} 주제의 의사결정 근거, 위험, 실행 조치와 검증 기준을 전문 실무 수준으로 구조화한다.`,
      kind,
      difficulty,
      template: makeTemplate({ title: article.title, summary: article.summary, kind, variant: candidate.variant }),
      variables: [
        { name: 'context', description: '검토할 시스템과 현재 상황', required: true, example: `${article.title} 관련 신규 서비스 설계안` },
        { name: 'objective', description: '달성하려는 측정 가능한 목표', required: true, example: '품질 기준을 만족하며 운영 위험을 낮춘다' },
        { name: 'constraints', description: '예산, 일정, 규정 및 기술 제약', required: true, example: '4주 일정, 기존 API 호환, 개인 정보 최소 수집' },
        { name: 'evidence', description: '로그, 실험, 문서 등 확인 가능한 근거', required: true, example: '최근 평가 결과와 장애 기록' },
        { name: 'risk_tolerance', description: '허용 가능한 위험 수준과 승인 경계', required: false, example: '중간, 외부 전송은 사람 승인 필수' },
      ],
      outputContract: outputContract(kind),
      notes: '입력에 없는 사실이나 수치를 보완해 만들지 않는다. 보안·법률·의료 등 고위험 결정은 이 결과만으로 확정하지 말고 담당 전문가와 실제 근거를 함께 검토한다.',
      examples: [{
        label: `${article.title} 적용 예시`,
        input: `문맥: ${article.title} 기능을 다음 분기에 도입한다. 목표: 품질 기준과 운영 책임을 명확히 한다. 제약: 4주, 제한된 예산. 근거: 소규모 평가 결과.`,
        output: '권고안을 근거와 가정으로 나누고, 주요 위험과 승인 지점, 1주 이내 실행할 검증 실험을 지정한 구조화 결과',
      }],
      tags: courseTagIds[course.courseId].map((idValue) => tags[idValue]),
      courseIds: [course.courseId],
      relatedWikiSlugs: [candidate.wikiSlug],
      providerScope: 'provider-agnostic',
      provenance: { origin: 'wiki-original', authorship: 'editorial', legacyKey: null },
      status: 'draft',
      reviewedAt: '2026-07-16',
    };
    fs.writeFileSync(path.join(outputDir, `${id}.prompt.json`), `${JSON.stringify(prompt, null, 2)}\n`);
    staged.push({ id, courseId: course.courseId, wikiSlug: candidate.wikiSlug, kind, difficulty, templateSha256: createHash('sha256').update(prompt.template).digest('hex') });
    globalIndex += 1;
  }
}

const enrichments = plan.exampleEnrichmentPromptIds.map((id) => {
  const prompt = readJson(`content-model/library/prompts/${id}.prompt.json`);
  return {
    id,
    example: {
      label: `${prompt.title} 적용 예시`,
      input: `${prompt.title} 작업에 필요한 문맥, 목표, 제약과 확인 가능한 자료를 제공하고 결과를 요청한다.`,
      output: '요구된 형식에 맞춰 근거와 불확실성을 구분하고, 검토 가능한 결과를 제시한다.',
    },
  };
});
fs.writeFileSync(path.join(root, 'content-model/staging/w49-prompt-example-enrichments.json'), `${JSON.stringify({ schemaVersion: '1.0', milestone: 'W49', enrichments }, null, 2)}\n`);
fs.writeFileSync(path.join(root, 'content-model/staging/w49-prompt-manifest.json'), `${JSON.stringify({
  schemaVersion: '1.0', milestone: 'W49', stagedAt: '2026-07-16', status: 'editorial-staged',
  counts: { prompts: staged.length, exampleEnrichments: enrichments.length }, staged,
}, null, 2)}\n`);
console.log(`W49 staging: ${staged.length} professional prompts and ${enrichments.length} example enrichments`);

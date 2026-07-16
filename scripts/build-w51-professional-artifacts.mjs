import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const plan = readJson('content-model/research/w48-library-expansion-plan.json');
const tagPolicy = readJson('content-model/prompt-library-policy.json');
const tags = Object.fromEntries(tagPolicy.controlledTags.map((tag) => [tag.id, tag.label]));
const outputDir = path.join(root, 'content-model/staging/w51-artifacts');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const courseCodes = {
  'prompt-systems': 'ps', 'llm-evaluation': 'le', 'llmops-production': 'lp', 'advanced-rag': 'ar',
  'production-agents': 'pa', 'post-training-alignment': 'pt', 'ai-security-redteam': 'sr', 'multimodal-systems': 'mm',
};
const courseTagIds = {
  'prompt-systems': ['prompt-design', 'structured-output', 'testing'],
  'llm-evaluation': ['evaluation', 'testing', 'data-analysis'],
  'llmops-production': ['deployment', 'monitoring', 'data-engineering'],
  'advanced-rag': ['rag', 'search', 'verification'],
  'production-agents': ['agent', 'automation', 'project-management'],
  'post-training-alignment': ['model-training', 'evaluation', 'safety'],
  'ai-security-redteam': ['security', 'safety', 'privacy'],
  'multimodal-systems': ['multimodal', 'image', 'audio'],
};
const typeMeta = {
  code: { label: '검증 유틸리티', ext: 'py', language: 'Python', runtime: 'Python 3.11 이상 표준 라이브러리', method: 'syntax' },
  config: { label: '운영 설정', ext: 'yaml', language: 'YAML', runtime: 'YAML 1.2 호환 설정 로더', method: 'parse' },
  query: { label: '관측 SQL', ext: 'sql', language: 'SQL', runtime: 'ANSI SQL 호환 분석 데이터베이스', method: 'syntax' },
  payload: { label: 'API 요청 본문', ext: 'json', language: 'JSON', runtime: 'JSON 호환 HTTP 클라이언트', method: 'parse' },
  schema: { label: '출력 스키마', ext: 'schema.json', language: 'JSON Schema', runtime: 'JSON Schema Draft 2020-12 검증기', method: 'parse' },
  workflow: { label: '품질 게이트 워크플로', ext: 'workflow.yaml', language: 'YAML', runtime: 'CI 또는 워크플로 실행기', method: 'parse' },
  template: { label: '운영 기록 템플릿', ext: 'md', language: 'Markdown', runtime: 'CommonMark 호환 문서 도구', method: 'manual' },
};

function quotaSequence(quotas) {
  const remaining = { ...quotas };
  const result = [];
  while (Object.values(remaining).some((count) => count > 0)) {
    for (const key of Object.keys(remaining)) if (remaining[key] > 0) { result.push(key); remaining[key] -= 1; }
  }
  return result;
}
const types = quotaSequence(plan.artifactTypeQuotas);

function contentFor(type, topic, courseId) {
  if (type === 'code') return `"""${topic} 입력 레코드의 필수 필드와 승인 상태를 점검한다."""\nfrom dataclasses import dataclass\nfrom typing import Any\n\nTOPIC = ${JSON.stringify(topic)}\nREQUIRED_FIELDS = ("evidence", "owner", "status")\n\n@dataclass(frozen=True)\nclass CheckResult:\n    valid: bool\n    missing: tuple[str, ...]\n\ndef validate_record(record: dict[str, Any]) -> CheckResult:\n    missing = tuple(field for field in REQUIRED_FIELDS if not record.get(field))\n    return CheckResult(valid=not missing, missing=missing)\n\nif __name__ == "__main__":\n    sample = {"evidence": "evaluation.json", "owner": "reviewer", "status": "pending"}\n    result = validate_record(sample)\n    print({"topic": TOPIC, "valid": result.valid, "missing": result.missing})\n`;
  if (type === 'config') return `version: 1\ntopic: ${JSON.stringify(topic)}\ncourse: ${courseId}\nquality_gate:\n  required_evidence: true\n  minimum_reviewers: 1\n  block_on_high_risk: true\nlogging:\n  redact_personal_data: true\n  retention_days: 30\n`;
  if (type === 'query') return `-- ${topic} 운영 지표: 파라미터는 실행기가 바인딩한다.\nSELECT event_type, COUNT(*) AS event_count, AVG(latency_ms) AS avg_latency_ms\nFROM ai_system_events\nWHERE course_id = :course_id\n  AND occurred_at >= :window_start\nGROUP BY event_type\nORDER BY event_count DESC;\n`;
  if (type === 'payload') return `${JSON.stringify({ topic, course: courseId, objective: 'evidence-backed-review', inputs: { evidence_uri: 'https://example.invalid/evidence.json', risk_level: 'medium' }, controls: { human_approval: true, redact_sensitive_data: true } }, null, 2)}\n`;
  if (type === 'schema') return `${JSON.stringify({ $schema: 'https://json-schema.org/draft/2020-12/schema', title: `${topic} 검토 결과`, type: 'object', additionalProperties: false, required: ['decision', 'evidence', 'risks', 'actions'], properties: { decision: { type: 'string', minLength: 1 }, evidence: { type: 'array', items: { type: 'string' }, minItems: 1 }, risks: { type: 'array', items: { type: 'string' } }, actions: { type: 'array', items: { type: 'string' }, minItems: 1 }, approved: { type: 'boolean', default: false } } }, null, 2)}\n`;
  if (type === 'workflow') return `name: ${JSON.stringify(`${topic} 품질 게이트`)}\non:\n  workflow_dispatch:\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Validate reviewed artifacts\n        run: npm run wiki:w52:validate\n`;
  return `# ${topic} 운영 검토 기록\n\n## 문맥과 목표\n\n- 문맥:\n- 측정 가능한 목표:\n- 범위 밖 항목:\n\n## 근거와 가정\n\n| 구분 | 내용 | 출처 또는 확인 방법 | 담당자 |\n|---|---|---|---|\n| 근거 |  |  |  |\n| 가정 |  |  |  |\n\n## 위험과 통제\n\n- 주요 실패 모드:\n- 조기 경보 신호:\n- 사람 승인 지점:\n- 되돌리기 절차:\n\n## 실행 및 검증\n\n- 다음 조치:\n- 완료 기준:\n- 재검토 날짜:\n`;
}

const staged = [];
let globalIndex = 0;
for (const course of plan.courses) {
  for (const [courseIndex, step] of course.sourceSteps.slice(0, course.artifactQuota).entries()) {
    const article = readJson(`content-model/articles/${step.wikiSlug}.article.json`);
    const type = types[globalIndex];
    const meta = typeMeta[type];
    const id = `lab-${courseCodes[course.courseId]}-${String(courseIndex + 1).padStart(2, '0')}-${type}`;
    const filePath = `${id}.${meta.ext}`;
    const content = contentFor(type, article.title, course.courseId);
    const artifact = {
      id,
      version: 1,
      title: `${article.title} · ${course.title} ${meta.label}`,
      summary: `${article.title} 관련 설계와 운영 결정을 재현 가능하게 검토하기 위한 ${meta.label} 자료다.`,
      type,
      language: meta.language,
      runtime: meta.runtime,
      files: [{ path: filePath, content, language: meta.language }],
      dependencies: [],
      environmentVariables: [],
      runInstructions: ['파일을 격리된 시험 환경에 저장한다.', '실제 데이터 대신 비식별 시험 데이터로 검증한다.', '검증 결과와 승인자를 변경 기록에 남긴다.'],
      validation: {
        method: meta.method,
        command: type === 'code' ? `python -m py_compile ${filePath}` : null,
        expectedResult: type === 'code' ? '구문 오류 없이 컴파일되고 시험 레코드가 valid=true를 출력한다.' : '형식 파서 또는 검토 절차가 오류 없이 완료되고 필수 필드가 확인된다.',
      },
      securityNotes: ['인증 정보, 실제 개인 정보와 내부 비밀을 예제에 직접 기록하지 않는다.', '외부 전송과 배포 전에는 변경 내용과 권한 범위를 사람이 검토한다.'],
      tags: courseTagIds[course.courseId].map((idValue) => tags[idValue]),
      courseIds: [course.courseId],
      relatedWikiSlugs: [step.wikiSlug],
      provenance: { origin: 'wiki-original', authorship: 'editorial', legacyKey: null },
      status: 'draft',
      reviewedAt: '2026-07-16',
    };
    fs.writeFileSync(path.join(outputDir, `${id}.artifact.json`), `${JSON.stringify(artifact, null, 2)}\n`);
    staged.push({ id, courseId: course.courseId, wikiSlug: step.wikiSlug, type, filePath, contentSha256: createHash('sha256').update(content).digest('hex') });
    globalIndex += 1;
  }
}

const manifest = { schemaVersion: '1.0', milestone: 'W51', stagedAt: '2026-07-16', status: 'technical-review-staged', counts: { artifacts: staged.length }, staged };
fs.writeFileSync(path.join(root, 'content-model/staging/w51-artifact-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`W51 staging: ${staged.length} professional code and configuration artifacts`);

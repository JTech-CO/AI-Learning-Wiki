import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(
  await readFile(path.join(root, 'content-model', 'research', 'w59-term-catalog.json'), 'utf8')
);

const groups = new Map();
for (const term of catalog.terms) {
  const key = term.courseId + '::' + term.toolId;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(term);
}

const coursePlans = {
  'ai-foundations': {
    anchor: 'hallucination',
    before: true,
    required: false,
    reason: '맞춤 학습 경로가 목표·선수 관계·숙달 상태를 어떻게 사용하는지 확인하는 선택 심화 문서다.'
  },
  'llm-evaluation': {
    anchor: 'evaluation-uncertainty',
    before: false,
    required: false,
    reason: '평가 불확실성과 자동 판정 범위를 정량적으로 해석하기 위한 선택 심화 문서다.'
  },
  'llmops-production': {
    anchor: 'prompt-caching',
    before: false,
    required: true,
    reason: 'KV 캐시의 할당·재사용·전송과 분산 서빙을 용량 및 지연 계획에 연결하는 필수 운영 문서다.'
  },
  'prompt-systems': {
    anchor: 'json-schema',
    before: false,
    required: true,
    reason: 'JSON Schema의 방언·어휘·평가 의미를 구조화 출력 계약에 적용하는 필수 설계 문서다.'
  }
};

for (const [courseId, plan] of Object.entries(coursePlans)) {
  const coursePath = path.join(root, 'content-model', 'paths', courseId + '.path.json');
  const course = JSON.parse(await readFile(coursePath, 'utf8'));
  const terms = catalog.terms.filter((term) => term.courseId === courseId);
  const termIds = new Set(terms.map((term) => term.id));
  course.steps = course.steps.filter((step) => !termIds.has(step.ref));
  const anchorIndex = course.steps.findIndex((step) => step.ref === plan.anchor);
  if (anchorIndex < 0) throw new Error(courseId + ': missing insertion anchor ' + plan.anchor);
  const insertAt = plan.before ? anchorIndex : anchorIndex + 1;
  const steps = terms.map((term) => ({
    ref: term.id,
    required: plan.required,
    reason: plan.reason
  }));
  course.steps.splice(insertAt, 0, ...steps);
  await writeFile(coursePath, JSON.stringify(course, null, 2) + '\n', 'utf8');
}

const registryPath = path.join(root, 'content-model', 'labs', 'registry.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
registry.updatedAt = catalog.reviewedAt;

for (const tool of registry.tools) {
  const terms = catalog.terms.filter((term) => term.toolId === tool.id);
  if (terms.length === 0) continue;
  const newIds = new Set(terms.map((term) => term.id));
  tool.contentLinks.wikiSlugs = [
    ...tool.contentLinks.wikiSlugs.filter((slug) => !newIds.has(slug)),
    ...terms.map((term) => term.id)
  ];
}

await writeFile(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');

console.log(
  'W59 connections: ' + catalog.terms.length + ' articles linked to ' +
  groups.size + ' course/tool pairs.'
);

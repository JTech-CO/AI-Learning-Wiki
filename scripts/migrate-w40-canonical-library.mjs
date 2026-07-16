import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ajvMessage, loadLibraryV2Validators } from './library-v2-lib.mjs';

const VERSION = 'W40-2026-07-16';
const PROMPT_DIR = 'content-model/library/prompts';
const ARTIFACT_DIR = 'content-model/library/artifacts';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const [publicPromptText, publicArtifactText, additions] = await Promise.all([
  readFile('public/data/prompts.json', 'utf8'),
  readFile('public/data/snippets.json', 'utf8'),
  readFile('content-model/prompt-additions.json', 'utf8').then(JSON.parse),
]);
const publicPrompts = JSON.parse(publicPromptText).prompts;
const publicArtifacts = JSON.parse(publicArtifactText).snippets;
const originalIds = new Set(additions.prompts.map((prompt) => prompt.id));
const { validatePrompt, validateArtifact } = await loadLibraryV2Validators();

const usageNote = (tags) => {
  const set = new Set(tags);
  if (set.has('개인정보') || set.has('보안')) return '실제 비밀 키와 개인정보를 제거한 뒤 사용하고, 결과는 조직의 보안 정책에 따라 검토한다.';
  if (set.has('출처·인용') || set.has('조사') || set.has('검증')) return '중요한 사실·날짜·수치는 연결된 1차 출처에서 다시 확인하고, 확인되지 않은 내용은 사용하지 않는다.';
  if (set.has('재무·금융') || set.has('법무')) return '결과는 일반적인 초안이므로 실제 의사결정 전에 해당 분야 전문가와 공식 자료를 확인한다.';
  if (set.has('자동화') || set.has('AI 에이전트')) return '전송·저장·삭제 같은 부작용이 없는 시험 환경에서 먼저 실행하고, 되돌릴 수 없는 작업은 사람의 승인을 받는다.';
  if (set.has('코딩') || set.has('API')) return '비밀 키와 운영 데이터를 제거한 예제로 먼저 시험하고, 생성된 코드는 테스트와 보안 검토를 거친다.';
  return '입력 자리표시자를 실제 상황에 맞게 바꾸고, 결과의 사실성·톤·누락 여부를 사람이 최종 확인한다.';
};

const promptKind = (prompt) => {
  const text = `${prompt.title}\n${prompt.template}`;
  if (/json\s*schema|json\s*스키마/i.test(text)) return 'json-schema';
  if (/(?:^|\n)\s*(?:---|[\w-]+:)\s*(?:\n|$)/u.test(prompt.template) && /yaml/i.test(text)) return 'yaml';
  if (/<[a-z][^>]*>[\s\S]*<\/[a-z]+>/iu.test(prompt.template) || /xml/i.test(text)) return 'xml';
  if (/루브릭|채점 기준|평가 기준/u.test(text)) return 'evaluation-rubric';
  if (/(?:^|\n)#{1,6}\s|```|(?:^|\n)[-*]\s/u.test(prompt.template)) return 'markdown';
  return 'plain';
};

const outputFormat = (kind, prompt) => {
  if (kind === 'json-schema') return 'json';
  if (kind === 'yaml') return 'yaml';
  if (kind === 'xml') return 'xml';
  if (kind === 'markdown' || kind === 'evaluation-rubric') return 'markdown';
  if (/표(?:로| 형식)|테이블/u.test(`${prompt.title} ${prompt.template}`)) return 'table';
  if (/코드|함수|스크립트/u.test(`${prompt.title} ${prompt.template}`)) return 'code';
  return 'text';
};

const providerScope = (text) => {
  const scopes = [
    ['openai', /openai|chatgpt|\bgpt[- ]?\d/i],
    ['anthropic', /anthropic|claude/i],
    ['google', /google|gemini/i],
    ['local', /ollama|llama\.cpp|로컬 모델/i],
  ].filter(([, pattern]) => pattern.test(text)).map(([scope]) => scope);
  if (scopes.length > 1) return 'multi-provider';
  return scopes[0] ?? 'provider-agnostic';
};

const variablesOf = (template) => {
  const labels = [...template.matchAll(/\[([^\]\n]{1,100})\]/gu)].map((match) => match[1].trim()).filter((label) => label.length >= 2);
  const unique = [...new Set(labels)].slice(0, 20);
  return unique.map((label, index) => ({
    name: `input_${index + 1}`,
    description: label,
    required: true,
    example: label.replace(/^예\s*[:：-]?\s*/u, '') || '실제 값',
  }));
};

const difficultyOf = (prompt, kind) => {
  if (kind === 'json-schema' || kind === 'multi-message' || prompt.template.length >= 350) return 'advanced';
  if (prompt.tags.some((tag) => ['코딩', 'API', 'AI 에이전트', '모델 학습', '보안'].includes(tag))) return 'intermediate';
  return 'entry';
};

const prompts = publicPrompts.map((prompt) => {
  const kind = promptKind(prompt);
  const relatedWikiSlug = prompt.relatedWikiUrl.split('/').filter(Boolean).at(-1);
  const value = {
    id: prompt.id,
    version: 1,
    title: prompt.title,
    summary: `${prompt.title} 작업을 재사용 가능한 프롬프트로 수행하도록 입력과 출력 조건을 정리한다.`,
    kind,
    difficulty: difficultyOf(prompt, kind),
    template: prompt.template,
    variables: variablesOf(prompt.template),
    outputContract: {
      format: outputFormat(kind, prompt),
      description: '요청한 조건과 형식을 지키며 확인 가능한 결과만 반환한다.',
      schema: null,
      sections: [],
    },
    notes: prompt.notes || usageNote(prompt.tags),
    examples: prompt.examples,
    tags: prompt.tags,
    courseIds: [prompt.course],
    relatedWikiSlugs: [relatedWikiSlug],
    providerScope: providerScope(`${prompt.title}\n${prompt.template}`),
    provenance: {
      origin: originalIds.has(prompt.id) ? 'wiki-original' : 'migrated-reference',
      authorship: originalIds.has(prompt.id) ? 'editorial' : 'migration-reviewed',
      legacyKey: originalIds.has(prompt.id) ? null : `public:${prompt.id}`,
    },
    status: 'reviewed',
    reviewedAt: '2026-07-16',
  };
  assert.equal(validatePrompt(value), true, `${prompt.id}: ${ajvMessage(validatePrompt)}`);
  return value;
});

const languageOf = (artifact) => {
  const text = artifact.content;
  if (/```python|\bimport\s+[a-z_]+|\bdef\s+\w+\(/i.test(text)) return 'Python';
  if (/```(?:js|javascript|typescript)|\bconst\s+\w+\s*=|\basync\s+function/i.test(text)) return 'JavaScript';
  if (/```html|<!doctype html|<html/i.test(text)) return 'HTML';
  if (/\b(?:select|create table|insert into)\b/i.test(text)) return 'SQL';
  if (/```json|^\s*[\[{]/u.test(text)) return 'JSON';
  if (/cron|crontab/i.test(text)) return 'Cron';
  if (artifact.type === 'template') return 'Markdown';
  return 'Text';
};

const artifactExtension = (language) => ({ Python: 'py', JavaScript: 'js', HTML: 'html', SQL: 'sql', JSON: 'json', Cron: 'txt', Markdown: 'md', Text: 'txt' }[language]);
const artifactRuntime = (language) => ({ Python: 'Python 3.11 이상', JavaScript: 'Node.js 22 이상 또는 최신 브라우저', HTML: '최신 웹 브라우저', SQL: '표준 SQL 호환 데이터베이스', JSON: 'JSON 파서', Cron: 'cron 호환 스케줄러', Markdown: 'Markdown 렌더러', Text: '텍스트 편집기' }[language]);
const dependenciesOf = (content) => ['anthropic', 'requests', '@supabase/supabase-js'].filter((dependency) => content.toLowerCase().includes(dependency.toLowerCase()));

const artifacts = publicArtifacts.map((artifact) => {
  const language = languageOf(artifact);
  const relatedWikiSlug = artifact.relatedWikiUrl.split('/').filter(Boolean).at(-1);
  const value = {
    id: artifact.id,
    version: 1,
    title: artifact.title,
    summary: `${artifact.title} 작업에 재사용할 수 있는 ${artifact.typeLabel} 자료다.`,
    type: artifact.type,
    language,
    runtime: artifactRuntime(language),
    files: [{ path: `${artifact.id}.${artifactExtension(language)}`, content: artifact.content, language: language.toLowerCase() }],
    dependencies: dependenciesOf(artifact.content),
    environmentVariables: [],
    runInstructions: ['자리표시자와 환경 조건을 확인한 뒤 격리된 시험 환경에서 적용한다.'],
    validation: { method: 'manual', command: null, expectedResult: '형식과 예상 동작을 사람이 검토하고 실제 적용 전 시험한다.' },
    securityNotes: ['실제 API 키·비밀번호·개인정보를 코드나 설정 파일에 직접 기록하지 않는다.'],
    tags: artifact.tags,
    courseIds: [artifact.course],
    relatedWikiSlugs: [relatedWikiSlug],
    provenance: { origin: 'migrated-reference', authorship: 'migration-reviewed', legacyKey: `public:${artifact.id}` },
    status: 'reviewed',
    reviewedAt: '2026-07-16',
  };
  assert.equal(validateArtifact(value), true, `${artifact.id}: ${ajvMessage(validateArtifact)}`);
  return value;
});

await Promise.all([
  rm(PROMPT_DIR, { recursive: true, force: true }),
  rm(ARTIFACT_DIR, { recursive: true, force: true }),
]);
await Promise.all([mkdir(PROMPT_DIR, { recursive: true }), mkdir(ARTIFACT_DIR, { recursive: true }), mkdir('content-model/migration', { recursive: true })]);

const promptWrites = prompts.map((prompt) => writeFile(path.join(PROMPT_DIR, `${prompt.id}.prompt.json`), `${JSON.stringify(prompt, null, 2)}\n`, 'utf8'));
const artifactWrites = artifacts.map((artifact) => writeFile(path.join(ARTIFACT_DIR, `${artifact.id}.artifact.json`), `${JSON.stringify(artifact, null, 2)}\n`, 'utf8'));
await Promise.all([...promptWrites, ...artifactWrites]);

const migration = {
  version: VERSION,
  migratedAt: '2026-07-16',
  sourceSnapshot: {
    promptsSha256: sha256(publicPromptText),
    artifactsSha256: sha256(publicArtifactText),
  },
  counts: {
    prompts: prompts.length,
    artifacts: artifacts.length,
    wikiOriginalPrompts: prompts.filter((prompt) => prompt.provenance.origin === 'wiki-original').length,
    migratedReferencePrompts: prompts.filter((prompt) => prompt.provenance.origin === 'migrated-reference').length,
    promptsWithUsageNotes: prompts.filter((prompt) => prompt.notes).length,
    promptsWithExamples: prompts.filter((prompt) => prompt.examples.length > 0).length,
  },
  compatibility: {
    publicPromptIdsSha256: sha256(prompts.map((prompt) => prompt.id).sort().join('\n')),
    publicArtifactIdsSha256: sha256(artifacts.map((artifact) => artifact.id).sort().join('\n')),
    idsPreserved: true,
    routesPreserved: true,
  },
  legacyInputs: {
    moduleDirectory: 'content-model/data',
    courseFile: 'content-model/courses.json',
    retainedForAuditOnly: true,
    allowedAsBuildInput: false,
  },
};
await writeFile('content-model/migration/w40-library-migration.json', `${JSON.stringify(migration, null, 2)}\n`, 'utf8');
console.log(`W40 canonical migration: ${prompts.length} prompts and ${artifacts.length} artifacts written; ${migration.counts.promptsWithUsageNotes} prompts have usage notes`);

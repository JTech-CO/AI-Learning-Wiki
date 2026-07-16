import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export const W38_VERSION = 'W38-2026-07-16';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

async function walk(directory, suffix) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full, suffix));
    else if (entry.name.endsWith(suffix)) files.push(full);
  }
  return files.sort();
}

const sortedObject = (entries) => Object.fromEntries([...entries].sort(([left], [right]) => left.localeCompare(right)));

export async function buildW38IndependenceAudit(root = process.cwd()) {
  const resolve = (...parts) => path.join(root, ...parts);
  const moduleFiles = await walk(resolve('content-model', 'data'), '.module.json');
  const pathFiles = (await readdir(resolve('content-model', 'paths'))).filter((file) => file.endsWith('.path.json')).sort();
  const [legacyCourses, publicPrompts, publicSnippets] = await Promise.all([
    readJson(resolve('content-model', 'courses.json')),
    readJson(resolve('public', 'data', 'prompts.json')),
    readJson(resolve('public', 'data', 'snippets.json')),
  ]);
  const modules = await Promise.all(moduleFiles.map(readJson));
  const wikiPaths = await Promise.all(pathFiles.map((file) => readJson(resolve('content-model', 'paths', file))));

  const sourceDomains = new Map();
  const sourceMethods = new Map();
  for (const module of modules) {
    try {
      const hostname = new URL(module.source?.url).hostname;
      sourceDomains.set(hostname, (sourceDomains.get(hostname) ?? 0) + 1);
    } catch {}
    const method = module.source?.method ?? '(missing)';
    sourceMethods.set(method, (sourceMethods.get(method) ?? 0) + 1);
  }

  const promptLengths = publicPrompts.prompts.map((prompt) => prompt.template.length).sort((left, right) => left - right);
  const percentile = (value) => promptLengths[Math.floor((promptLengths.length - 1) * value)];
  const promptByCourse = new Map();
  for (const prompt of publicPrompts.prompts) promptByCourse.set(prompt.course, (promptByCourse.get(prompt.course) ?? 0) + 1);
  const snippetByType = new Map();
  for (const snippet of publicSnippets.snippets) snippetByType.set(snippet.type, (snippetByType.get(snippet.type) ?? 0) + 1);

  const consumers = [
    ['scripts/prompt-library.mjs', 'content-model', 'data'],
    ['scripts/build-pages.mjs', 'content-model/data'],
    ['scripts/validate-content.mjs', "path.join(CM, 'data')"],
  ];
  const activeLegacyConsumers = [];
  for (const [file, ...needles] of consumers) {
    const source = await readFile(resolve(...file.split('/')), 'utf8');
    if (needles.every((needle) => source.includes(needle))) activeLegacyConsumers.push(file);
  }

  return {
    version: W38_VERSION,
    auditedAt: '2026-07-16',
    objective: '공개 위키 라이브러리의 레거시 수집 데이터 종속을 제거하고 자체 원본 확장 기준을 잠근다.',
    baseline: {
      reviewedArticles: 1400,
      wikiCourses: wikiPaths.length,
      wikiCourseSteps: wikiPaths.reduce((sum, course) => sum + course.steps.length, 0),
      legacyCourseDefinitions: legacyCourses.length,
      legacyModules: modules.length,
      sourcePrompts: publicPrompts.counts.sourcePrompts,
      publicPrompts: publicPrompts.prompts.length,
      publicArtifacts: publicSnippets.snippets.length,
    },
    legacyDependency: {
      active: activeLegacyConsumers.length > 0,
      activeConsumers: activeLegacyConsumers,
      moduleSourceDomains: sortedObject(sourceDomains),
      moduleSourceMethods: sortedObject(sourceMethods),
      canonicalPromptSourceExists: false,
      canonicalArtifactSourceExists: false,
      publicLessonRoutesRemoved: true,
    },
    promptQuality: {
      byCourse: sortedObject(promptByCourse),
      lengthCharacters: {
        minimum: promptLengths[0],
        median: percentile(0.5),
        p90: percentile(0.9),
        p95: percentile(0.95),
        maximum: promptLengths.at(-1),
        atLeast500: promptLengths.filter((length) => length >= 500).length,
        atLeast1000: promptLengths.filter((length) => length >= 1000).length,
      },
      withExamples: publicPrompts.prompts.filter((prompt) => prompt.examples.length > 0).length,
      withUsageNotes: publicPrompts.prompts.filter((prompt) => Boolean(prompt.notes)).length,
      controlledTags: 55,
    },
    artifactQuality: {
      byType: sortedObject(snippetByType),
      withRuntimeMetadata: 0,
      withValidationCommand: 0,
      withExpectedResult: 0,
      withSecurityNotes: 0,
    },
    target: {
      reviewedArticles: 1600,
      wikiCourses: 16,
      publicPrompts: 1500,
      publicArtifacts: 120,
      longFormPromptsAtLeast500: 300,
      markdownPrompts: 200,
      schemaPrompts: 120,
      promptsWithExamples: 500,
      promptsWithUsageNotes: 1500,
    },
    gaps: {
      reviewedArticles: 200,
      wikiCourses: 8,
      publicPrompts: 358,
      publicArtifacts: 95,
      longFormPromptsAtLeast500: 300,
      promptsWithExamples: 386,
      promptsWithUsageNotes: 1384,
    },
    blockers: [
      {
        id: 'legacy-modules-are-build-input',
        severity: 'blocking',
        evidence: `${activeLegacyConsumers.length}개 활성 스크립트가 305개 레거시 모듈을 직접 읽는다.`,
        exitGate: '공개 프롬프트·자료 빌더가 자체 canonical library만 읽는다.',
      },
      {
        id: 'no-long-form-prompt',
        severity: 'high',
        evidence: `500자 이상 프롬프트 ${promptLengths.filter((length) => length >= 500).length}개, 최대 ${promptLengths.at(-1)}자다.`,
        exitGate: '500자 이상 300개와 스키마형 120개를 확보한다.',
      },
      {
        id: 'prompt-enrichment-coverage',
        severity: 'high',
        evidence: `예시 ${publicPrompts.prompts.filter((prompt) => prompt.examples.length > 0).length}개, 주의사항 ${publicPrompts.prompts.filter((prompt) => Boolean(prompt.notes)).length}개다.`,
        exitGate: '모든 프롬프트에 주의사항을 두고 최소 500개에 검토된 예시를 둔다.',
      },
      {
        id: 'artifact-schema-too-thin',
        severity: 'high',
        evidence: '25개 자료에 런타임·검증 명령·예상 결과·보안 주의사항 필드가 없다.',
        exitGate: 'v2 artifact schema와 형식별 자동 검증을 통과한다.',
      },
      {
        id: 'course-library-coupling',
        severity: 'medium',
        evidence: '공개 위키 코스 8개와 레거시 코스 정의 8개가 서로 다른 체계로 공존한다.',
        exitGate: '프롬프트는 courseIds 다대다 연결을 사용하고 위키 path만 공개 코스 원본이 된다.',
      },
    ],
    migrationOrder: [
      'v2 prompt·artifact schema를 먼저 고정한다.',
      '현재 공개 ID와 URL을 보존하며 자체 원본으로 이관한다.',
      '생성 결과 parity를 확인한 뒤 레거시 모듈 읽기를 차단한다.',
      '전문 코스·신규 문서·장문 프롬프트·검증 자료를 자체 원본에 추가한다.',
    ],
  };
}

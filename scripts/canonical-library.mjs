import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ajvMessage, loadLibraryV2Validators, readLibraryEntries } from './library-v2-lib.mjs';

export const WIKI_COURSES = {
  'ai-foundations': { title: 'AI 기초', url: '/course/ai-foundations/' },
  'llm-internals': { title: 'LLM 내부 구조', url: '/course/llm-internals/' },
  'model-training': { title: '모델 학습과 튜닝', url: '/course/model-training/' },
  'rag-search': { title: '임베딩과 RAG', url: '/course/rag-search/' },
  'api-development': { title: 'AI API 개발', url: '/course/api-development/' },
  'agent-systems': { title: 'AI 에이전트', url: '/course/agent-systems/' },
  'responsible-ai': { title: '신뢰할 수 있는 AI', url: '/course/responsible-ai/' },
  'multimodal-ai': { title: '멀티모달 AI', url: '/course/multimodal-ai/' },
  'prompt-systems': { title: '프롬프트 시스템 설계', url: '/course/prompt-systems/' },
  'llm-evaluation': { title: 'LLM 평가와 관측성', url: '/course/llm-evaluation/' },
  'llmops-production': { title: 'LLMOps와 프로덕션 서빙', url: '/course/llmops-production/' },
  'advanced-rag': { title: '고급 RAG와 지식 시스템', url: '/course/advanced-rag/' },
  'production-agents': { title: '프로덕션 AI 에이전트', url: '/course/production-agents/' },
  'post-training-alignment': { title: '사후학습과 정렬 심화', url: '/course/post-training-alignment/' },
  'ai-security-redteam': { title: 'AI 보안과 레드팀', url: '/course/ai-security-redteam/' },
  'multimodal-systems': { title: '멀티모달 AI 시스템', url: '/course/multimodal-systems/' },
};

const TYPE_LABELS = { code: '코드', config: '설정', query: '쿼리', payload: '요청 본문', schema: '스키마', workflow: '워크플로', template: '문서 양식' };

export async function buildPromptLibrary(root = process.cwd()) {
  const [promptEntries, artifactEntries, policy, controlledPolicy, validators] = await Promise.all([
    readLibraryEntries(path.join(root, 'content-model', 'library', 'prompts'), '.prompt.json'),
    readLibraryEntries(path.join(root, 'content-model', 'library', 'artifacts'), '.artifact.json'),
    readFile(path.join(root, 'content-model', 'library-policy-v2.json'), 'utf8').then(JSON.parse),
    readFile(path.join(root, 'content-model', 'prompt-library-policy.json'), 'utf8').then(JSON.parse),
    loadLibraryV2Validators(root),
  ]);

  for (const { file, value } of promptEntries) {
    if (!validators.validatePrompt(value)) throw new Error(`${file}: ${ajvMessage(validators.validatePrompt)}`);
  }
  for (const { file, value } of artifactEntries) {
    if (!validators.validateArtifact(value)) throw new Error(`${file}: ${ajvMessage(validators.validateArtifact)}`);
  }

  const courseOrder = new Map(Object.keys(WIKI_COURSES).map((id, index) => [id, index]));
  const promptValues = promptEntries.map((entry) => entry.value).sort((left, right) =>
    (courseOrder.get(left.courseIds[0]) ?? 999) - (courseOrder.get(right.courseIds[0]) ?? 999)
    || left.title.localeCompare(right.title, 'ko')
    || left.id.localeCompare(right.id));
  const artifactValues = artifactEntries.map((entry) => entry.value).sort((left, right) => left.title.localeCompare(right.title, 'ko') || left.id.localeCompare(right.id));

  const prompts = promptValues.map((prompt) => {
    const courseId = prompt.courseIds[0];
    const course = WIKI_COURSES[courseId];
    const relatedWikiUrl = `/wiki/${prompt.relatedWikiSlugs[0]}/`;
    return {
      id: prompt.id,
      course: courseId,
      courseTitle: course.title,
      courseUrl: course.url,
      title: prompt.title,
      template: prompt.template,
      notes: prompt.notes,
      tags: prompt.tags,
      examples: prompt.examples,
      relatedWikiUrl,
      url: relatedWikiUrl,
      kind: prompt.kind,
      difficulty: prompt.difficulty,
      providerScope: prompt.providerScope,
    };
  });

  const snippets = artifactValues.map((artifact) => {
    const courseId = artifact.courseIds[0];
    const course = WIKI_COURSES[courseId];
    const relatedWikiUrl = `/wiki/${artifact.relatedWikiSlugs[0]}/`;
    return {
      id: artifact.id,
      type: artifact.type,
      typeLabel: TYPE_LABELS[artifact.type],
      title: artifact.title,
      content: artifact.files.map((file) => file.content).join('\n\n'),
      tags: artifact.tags,
      course: courseId,
      courseTitle: course.title,
      courseUrl: course.url,
      relatedWikiUrl,
      url: relatedWikiUrl,
      language: artifact.language,
      runtime: artifact.runtime,
      validation: artifact.validation,
      securityNotes: artifact.securityNotes,
    };
  });

  const counts = {
    sourceModules: 0,
    sourcePrompts: prompts.length,
    duplicateMerges: 0,
    exactDuplicateMerges: 0,
    reviewedNearDuplicateMerges: 0,
    titleCleanups: 0,
    sourceNameCleanups: 0,
    snippets: snippets.length,
    additions: 0,
    prompts: prompts.length,
    canonicalPrompts: prompts.length,
    canonicalArtifacts: snippets.length,
  };

  return {
    policy: { ...policy, controlledTags: controlledPolicy.controlledTags },
    additions: { prompts: [], coveragePlan: [] },
    prompts,
    snippets,
    counts,
    sourceEntries: { prompts: promptValues, artifacts: artifactValues },
  };
}

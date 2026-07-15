import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ARTICLE_DIR = 'content-model/articles';
const AUDIT_FILE = 'content-model/evidence/w37-terminology-audit.json';
const WRITE = process.argv.includes('--write');
const VERSION = 'W37-2026-07-16';

const rules = [
  ['abuse-testing', '오용 테스트', ['오용 시험']],
  ['activation-maximization', '활성화 최대화', ['활성 최대화']],
  ['adaptive-computation-time-transformer', '적응형 계산 시간 트랜스포머', ['적응 계산 시간 트랜스포머']],
  ['adversarial-testing', '적대적 테스트', ['적대적 시험']],
  ['agent-task-success', '에이전트 과제 성공률', ['에이전트 과제 성공은 주어진 목표의 필수 완료 조건과 제약을 에이전트 실행 결과가 모두 만족한 상태다.'], '에이전트 과제 성공률은 주어진 목표의 필수 완료 조건과 제약을 모두 만족한 독립 실행이 전체 시도에서 차지하는 비율이다.'],
  ['ai-carbon-footprint', 'AI 탄소 발자국', ['AI 탄소발자국']],
  ['ai-compliance-monitoring', 'AI 준수 모니터링', ['AI 규정 준수 모니터링']],
  ['ai-incident-reporting', 'AI 사고 보고', ['AI 사건 보고']],
  ['ai-incident-response', 'AI 사고 대응', ['AI 사건 대응']],
  ['ai-red-teaming', 'AI 레드팀 평가', ['AI 레드팀']],
  ['ai-water-footprint', 'AI 물 발자국', ['AI 물발자국']],
  ['automatic-rater', '자동 평가자', ['자동 평가기']],
  ['best-of-n-sampling', 'Best-of-N 표본추출', ['Best-of-N 표집']],
  ['bias-variance-tradeoff', '편향-분산 절충', ['편향-분산 상충']],
  ['classifier-free-guidance', '분류기 없는 가이던스', ['분류기 비사용 유도']],
  ['content-provenance', '콘텐츠 출처 증명', ['콘텐츠 출처 추적']],
  ['cross-modal-alignment', '교차모달 정렬', ['교차 모달 정렬']],
  ['cross-modal-attention', '교차모달 어텐션', ['교차 모달 어텐션']],
  ['demographic-parity', '인구통계학적 동등성', ['인구통계적 동등성']],
  ['differentially-private-training', '차등 개인정보 보호 학습', ['차등 개인정보보호 학습']],
  ['disparate-impact', '차별적 영향', ['불균등 영향']],
  ['equality-of-opportunity', '기회 균등', ['기회균등']],
  ['equalized-odds', '동등 오즈', ['균등 오즈']],
  ['fairness-through-unawareness', '비인지에 의한 공정성', ['비인지 공정성']],
  ['feature-visualization', '특성 시각화', ['특징 시각화']],
  ['fully-sharded-data-parallel', '완전 샤딩 데이터 병렬화', ['완전 샤딩 데이터 병렬']],
  ['gradient-checkpointing', '그래디언트 체크포인팅', ['기울기 체크포인팅']],
  ['hierarchical-task-network', '계층적 과제 네트워크', ['계층적 작업 네트워크']],
  ['hierarchical-transformer', '계층형 트랜스포머', ['계층적 트랜스포머']],
  ['interleaved-multimodal-data', '교차 배열 멀티모달 데이터', ['교차 배치 멀티모달 데이터']],
  ['judge-model', '심사 모델', ['판정 모델']],
  ['k-nearest-neighbors', 'K-최근접 이웃', ['k-최근접 이웃']],
  ['kl-penalty', 'KL 페널티', ['KL 패널티']],
  ['latency-monitoring', '지연 시간 모니터링', ['지연시간 모니터링']],
  ['latency-throughput-tradeoff', '지연 시간-처리량 절충', ['지연시간-처리량 상충']],
  ['layer-wise-relevance-propagation', '계층별 관련성 전파', ['층별 관련성 전파']],
  ['leaky-bucket', '리키 버킷', ['누수 버킷']],
  ['llm-penetration-testing', 'LLM 침투 테스트', ['LLM 침투 시험']],
  ['machine-unlearning', '머신 언러닝', ['기계 언러닝']],
  ['mcp-transport', 'MCP 전송 계층', ['MCP 전송']],
  ['multimodal-instruction-tuning', '멀티모달 지시 튜닝', ['멀티모달 지시 미세조정']],
  ['multimodal-jailbreak', '멀티모달 탈옥 공격', ['멀티모달 탈옥']],
  ['pairwise-llm-judge', '쌍대 LLM 심사', ['쌍대 LLM 판정']],
  ['pointwise-llm-judge', '개별 LLM 심사', ['개별 LLM 판정']],
  ['reasoning-action-interleaving', '추론-행동 교차 수행', ['추론과 행동의 교차 수행']],
  ['reference-free-evaluation', '참조 없는 평가', ['무참조 평가']],
  ['reference-model', '참조 모델', ['기준 모델']],
  ['regression-evaluation', '회귀 테스트형 평가', ['회귀 평가']],
  ['retrieval-prompt', '검색 결합 프롬프트', ['검색 프롬프트']],
  ['rubric-based-judge', '루브릭 기반 심사', ['루브릭 기반 판정']],
  ['runaway-agent', '통제 이탈 에이전트', ['폭주 에이전트']],
  ['service-level-agreement', '서비스 수준 협약', ['서비스 수준 계약']],
  ['state-space-transformer-hybrid', '상태 공간-트랜스포머 하이브리드', ['상태공간-트랜스포머 하이브리드']],
  ['subgraph-retrieval', '부분 그래프 검색', ['하위 그래프 검색']],
  ['sycophancy', '아첨 현상', ['아첨 편향']],
  ['tool-choice', '도구 선택 제어', ['도구 선택']],
  ['triple-store', '트리플 저장소', ['트리플 스토어']],
  ['usage-metering', '사용량 계측', ['사용량 계량']],
].map(([articleId, canonicalTerm, replacedTerms, replacement = canonicalTerm]) => ({ articleId, canonicalTerm, replacedTerms, replacement }));

const acceptedVariants = [
  ['adam-optimizer', 'Adam', '고유 모델명 약칭'],
  ['bootstrap-method', '부트스트랩', '정착된 방법명 약칭'],
  ['conformer-architecture', 'Conformer', '고유 아키텍처명'],
  ['gguf-format', 'GGUF', '형식명 약칭'],
  ['helm-benchmark', 'HELM', '벤치마크명 약칭'],
  ['local-global-optimum', '국소 최적점', '한 문서에서 대조하는 두 하위 개념 중 하나'],
  ['local-interpretable-model-agnostic-explanations', 'LIME', '정착된 약칭'],
  ['meteor-score', 'METEOR', '평가 지표명 약칭'],
  ['rouge-score', 'ROUGE', '평가 지표명 약칭'],
  ['shapley-additive-explanations', 'SHAP', '정착된 약칭'],
  ['zero-redundancy-optimizer', '제로 중복 옵티마이저', 'ZeRO 영문명의 한국어 풀어쓰기'],
].map(([articleId, variant, rationale]) => ({ articleId, variant, rationale }));

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
const termPattern = (from, to) => {
  const embeddedAt = to.indexOf(from);
  const prefix = embeddedAt >= 0 ? to.slice(0, embeddedAt) : '';
  const suffix = embeddedAt >= 0 ? to.slice(embeddedAt + from.length) : '';
  return new RegExp(`${prefix ? `(?<!${escapeRegExp(prefix)})` : ''}${escapeRegExp(from)}${suffix ? `(?!${escapeRegExp(suffix)})` : ''}`, 'gu');
};
const replaceTerm = (text, from, to) => {
  const pattern = termPattern(from, to);
  let count = 0;
  return {
    text: text.replace(pattern, () => {
      count += 1;
      return to;
    }),
    count,
  };
};

const articleFiles = (await readdir(ARTICLE_DIR)).filter((file) => file.endsWith('.article.json'));
assert.equal(articleFiles.length, 1400, 'article corpus size changed');
const changes = [];

for (const rule of rules) {
  const file = path.join(ARTICLE_DIR, `${rule.articleId}.article.json`);
  const article = JSON.parse(await readFile(file, 'utf8'));
  assert.equal(article.title, rule.canonicalTerm, `${rule.articleId}: canonical title changed`);
  let replacements = 0;

  const update = (value) => {
    let current = value;
    for (const term of rule.replacedTerms) {
      const result = replaceTerm(current, term, rule.replacement);
      current = result.text;
      replacements += result.count;
    }
    return current;
  };

  article.summary = update(article.summary);
  article.sections = article.sections.map((section) => ({ ...section, body: update(section.body) }));
  assert.ok(replacements > 0, `${rule.articleId}: no outdated term found`);
  const searchable = [article.summary, ...article.sections.map((section) => section.body)].join('\n');
  const serialized = `${JSON.stringify(article, null, 2)}\n`;
  for (const term of rule.replacedTerms) assert.ok(!termPattern(term, rule.replacement).test(searchable), `${rule.articleId}: outdated term remains: ${term}`);
  if (WRITE) await writeFile(file, serialized, 'utf8');
  changes.push({
    articleId: rule.articleId,
    canonicalTerm: rule.canonicalTerm,
    replacedTerms: rule.replacedTerms,
    replacements,
  });
}

const audit = {
  version: VERSION,
  reviewedAt: '2026-07-16',
  reviewType: 'article-local-terminology-consistency',
  scope: {
    articleSourcesReviewed: articleFiles.length,
    articleSourcesChanged: changes.length,
    replacementsApplied: changes.reduce((sum, change) => sum + change.replacements, 0),
    lockedLedgerArticlesUpdated: 0,
    lockedClaimUnitsRehashed: 0,
  },
  editorialPolicy: [
    '문서 표제어를 본문의 기본 한국어 용어로 사용한다.',
    '약칭·영문 병기·서로 다른 하위 개념은 불일치로 간주하지 않는다.',
    '사실 주장과 출처 연결은 유지하고 용어 또는 띄어쓰기만 교정한다.',
  ],
  preservedFields: ['classification', 'decision', 'evidence', 'sourceRef', 'locator', 'claimId'],
  changes,
  acceptedVariants,
  ledgers: [],
};

if (WRITE) await writeFile(AUDIT_FILE, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
console.log(`W37 terminology ${WRITE ? 'applied' : 'dry run'}: ${changes.length} articles, ${audit.scope.replacementsApplied} replacements`);

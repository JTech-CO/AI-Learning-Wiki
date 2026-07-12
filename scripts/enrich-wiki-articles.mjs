import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { CATEGORY_META } from './wiki-core-data.mjs';

const files = (await readdir('content-model/articles')).filter((file) => file.endsWith('.article.json'));
const articles = await Promise.all(files.map(async (file) => ({ file, data: JSON.parse(await readFile(path.join('content-model/articles', file), 'utf8')) })));
const byId = new Map(articles.map(({ data }) => [data.id, data]));
const aliases = {
  'artificial-intelligence': ['AI'], 'machine-learning': ['ML'], 'deep-learning': ['DL'], 'generative-ai': ['GenAI', '생성 AI'],
  'large-language-model': ['LLM'], 'small-language-model': ['SLM'], 'mixture-of-experts': ['MoE'],
  'byte-pair-encoding': ['BPE'], 'approximate-nearest-neighbor': ['ANN'], 'rag': ['RAG'],
  'rlhf': ['RLHF'], 'dpo': ['DPO'], 'lora': ['LoRA'], 'peft': ['PEFT'],
  'api': ['API'], 'rest-api': ['REST'], 'sdk': ['SDK'], 'json': ['JSON'], 'ocr': ['OCR'],
  'mcp': ['MCP'], 'vision-language-model': ['VLM'], 'kv-cache': ['KV Cache'],
  'query-key-value': ['QKV'], 'top-k-sampling': ['Top-k'], 'top-p-sampling': ['Top-p']
};
const links = (refs) => refs.map((id) => `[${byId.get(id)?.title ?? id}](/wiki/${id}/)`).join(', ');

for (const { file, data } of articles) {
  data.aliases = [...new Set([...(data.aliases ?? []), ...(aliases[data.id] ?? [])])];
  const category = CATEGORY_META[data.categories[0]];
  const prior = links(data.prerequisites);
  const related = links(data.related);
  data.sections = [
    { id: 'overview', title: '개요', body: `${data.summary} 이 개념은 ${category[0]} 분야에서 시스템의 구성 요소와 선택 기준을 설명하는 데 쓰인다. 용어의 이름뿐 아니라 입력, 처리 과정, 출력, 적용 조건을 함께 확인해야 서로 다른 구현에서 같은 표현이 어떻게 달라지는지 이해할 수 있다.` },
    { id: 'principle', title: '핵심 원리', body: data.prerequisites.length ? `${data.title}을 이해하려면 먼저 ${prior}의 역할을 구분해야 한다. 이 선행 개념들이 데이터와 계산의 기본 단위를 제공하고, ${data.title}은 이를 특정 목적에 맞게 결합하거나 제어한다. 실제 결과는 모델 구조, 데이터 분포, 파라미터 설정에 따라 달라진다.` : `${data.title}은 ${category[1]}를 설명하는 출발점이다. 실제 시스템에서는 데이터가 어떤 표현으로 들어오고, 어떤 계산과 규칙을 거쳐, 어떤 형태의 결과로 나오는지를 기준으로 개념의 범위를 구분한다.` },
    { id: 'relationships', title: '관련 개념과 활용', body: `${data.title}은 ${related || '같은 분야의 여러 기술'}와 함께 사용된다. 이 관계를 알면 모델을 설계하거나 API를 선택하고, 품질·비용·안전 문제를 진단할 때 어느 계층의 문제인지 구분할 수 있다. 관련 문서의 정의와 선행 관계를 따라가면 단일 제품의 기능명에 종속되지 않는 지식 구조를 만들 수 있다.` },
    { id: 'limitations', title: '주의점', body: `${data.title}의 세부 동작과 성능은 구현 버전, 데이터, 실행 환경에 따라 달라진다. 하나의 수치나 사례를 모든 시스템에 일반화하지 말아야 하며, 안정적인 원리와 빠르게 변하는 제품 정보를 구분해야 한다. 중요한 판단에서는 아래 1차 자료와 실제 사용하는 구현의 최신 문서를 함께 확인한다.` }
  ];
  await writeFile(path.join('content-model/articles', file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}
console.log(`wiki enrichment: ${articles.length} articles, curated aliases and linked explanations`);

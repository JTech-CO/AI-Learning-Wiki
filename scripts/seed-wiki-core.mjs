import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ARTICLE_SEEDS, CATEGORY_META, WIKI_PATHS } from './wiki-core-data.mjs';

const articleDir = path.resolve('content-model/articles');
const pathDir = path.resolve('content-model/paths');
await mkdir(articleDir, { recursive: true });
await mkdir(pathDir, { recursive: true });

for (const dir of [articleDir, pathDir]) {
  for (const file of await readdir(dir)) if (file.endsWith('.json')) await rm(path.join(dir, file));
}

const byCategory = new Map();
for (const seed of ARTICLE_SEEDS) {
  if (!byCategory.has(seed.category)) byCategory.set(seed.category, []);
  byCategory.get(seed.category).push(seed);
}

for (const seed of ARTICLE_SEEDS) {
  const group = byCategory.get(seed.category);
  const meta = CATEGORY_META[seed.category];
  const related = [group[seed.index - 1]?.slug, group[seed.index + 1]?.slug, group[seed.index + 2]?.slug]
    .filter(Boolean).filter((value) => value !== seed.slug);
  const prerequisites = seed.index === 0 ? [] : group.slice(Math.max(0, seed.index - 2), seed.index).map((item) => item.slug);
  const article = {
    id: seed.slug,
    title: seed.title,
    englishTitle: seed.englishTitle,
    aliases: seed.englishTitle === seed.title ? [] : [seed.englishTitle],
    summary: seed.definition,
    sections: [
      {
        id: 'overview',
        title: '개요',
        body: `${seed.definition} 이 개념은 ‘${meta[0]}’ 분야에서 다른 용어와 기술의 관계를 이해하기 위한 기준점으로 사용된다. 이름만 외우기보다 어떤 입력을 받아 무엇을 바꾸고, 그 결과가 시스템의 어느 단계에서 쓰이는지 함께 살펴보는 것이 중요하다.`
      },
      {
        id: 'principle',
        title: '핵심 원리',
        body: `${seed.title}의 핵심은 독립된 기능 하나가 아니라 데이터, 모델, 계산 절차, 운영 조건 사이의 관계에 있다. 실제 시스템에서는 입력의 표현 방식과 사용 가능한 자원, 목표 지표에 따라 구현과 결과가 달라진다. 따라서 정의와 함께 선행 개념 및 인접 개념을 확인해야 같은 용어를 서로 다른 문맥에서 혼동하지 않는다.`
      },
      {
        id: 'use',
        title: '활용과 판단 기준',
        body: `${seed.title}은 모델을 설계하거나 API를 선택하고, 품질·비용·안전 문제를 진단할 때 공통 언어로 쓰인다. 적용 여부를 판단할 때는 해결하려는 문제, 데이터의 성격, 지연 시간과 비용, 검증 방법을 먼저 정한다. 특정 제품의 기능명과 일반 기술 개념을 구분하고 실제 결과는 재현 가능한 평가로 확인한다.`
      },
      {
        id: 'limitations',
        title: '주의점',
        body: `${seed.title}에 대한 설명은 모델 구조와 구현 버전, 데이터, 실행 환경에 따라 세부적으로 달라질 수 있다. 하나의 수치나 사례를 모든 시스템에 일반화하지 말아야 하며, 빠르게 변하는 제품 정보와 안정적인 원리를 구분해야 한다. 중요한 의사결정에서는 아래의 1차 자료와 해당 구현의 최신 문서를 함께 확인한다.`
      }
    ],
    categories: [seed.category],
    prerequisites,
    related,
    sources: [{ title: meta[3], url: meta[2], type: meta[4] }],
    status: 'reviewed',
    volatility: seed.category === 'ecosystem' ? 'periodic' : 'evergreen',
    reviewedAt: '2026-07-12'
  };
  await writeFile(path.join(articleDir, `${seed.slug}.article.json`), `${JSON.stringify(article, null, 2)}\n`, 'utf8');
}

for (const item of WIKI_PATHS) {
  await writeFile(path.join(pathDir, `${item.id}.path.json`), `${JSON.stringify(item, null, 2)}\n`, 'utf8');
}

console.log(`wiki seed: ${ARTICLE_SEEDS.length} articles, ${WIKI_PATHS.length} wiki courses`);

import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'content-model', 'data');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.name.endsWith('.module.json')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of await walk(DATA)) {
  const mod = JSON.parse(await readFile(file, 'utf8'));
  if (Array.isArray(mod.prompts) && mod.prompts.length) continue;
  const topic = mod.title?.ko ?? mod.id;
  const mission = mod.mission?.ko ?? mod.summary?.ko ?? '';
  mod.prompts = [{
    id: `${mod.id.split('/').at(-1)}-practice-coach`,
    title: { ko: '실습 코치 프롬프트' },
    template: {
      ko: `너는 학습 코치야. 아래 주제와 과제를 내가 직접 완수하도록 단계별로 도와줘. 결과를 대신 완성하지 말고, 먼저 내가 시도할 한 단계만 제시한 뒤 내 답을 기다려. 각 단계에서 잘된 점 1개와 개선점 1개를 알려줘.\n\n[학습 주제]\n${topic}\n\n[실습 과제]\n${mission}`,
    },
    examples: [],
    notes: { ko: '원문에 별도 복붙 템플릿이 없어 위키가 추가한 학습 보조 프롬프트입니다.' },
    tags: ['wiki-authored', 'practice-coach'],
  }];
  await writeFile(file, `${JSON.stringify(mod, null, 2)}\n`, 'utf8');
  changed += 1;
}
console.log(`prompt fallbacks added: ${changed}`);

// content-model(JSON) → Starlight 위키 페이지(MD) 생성기.
// 수집 방식(A/B/C)과 무관하게, 정규 스키마를 따르는 모듈 JSON을 받아 다국어 위키를 만든다.
//
// 입력:  content-model/courses.json  +  content-model/data/**/*.module.json
//        (data가 비어있으면 content-model/examples/ 를 사용 — 스캐폴드 검증용)
// 출력:  src/content/docs/**   (ko=루트, en/es/ja/zh=하위 디렉토리)
//        - courses/<course>/<order>-<slug>.md    각 모듈 문서
//        - courses/<course>/index.md              코스 개요(로드맵)
//        - concepts/<slug>.md                     개념 사전(backlink)
//        - prompts.md                             프롬프트 라이브러리
//        - index.mdx                              전체 개요

import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CM = path.join(ROOT, 'content-model');
const DOCS = path.join(ROOT, 'src', 'content', 'docs');

const LOCALES = ['ko', 'en', 'es', 'ja', 'zh'];
const ROOT_LOCALE = 'ko'; // Starlight root 로케일 → 문서 루트에 렌더
const localeSeg = (l) => (l === ROOT_LOCALE ? '' : l); // 경로 프리픽스

// 다국어 필드에서 언어 선택(없으면 ko로 폴백).
const pick = (i18n, lang) =>
  !i18n ? undefined : (i18n[lang] ?? i18n.ko ?? Object.values(i18n)[0]);

const loadJSON = async (p) => JSON.parse(await readFile(p, 'utf8'));
// YAML 스칼라: 숫자/불린은 그대로, 문자열은 안전하게 인용.
const yaml = (v) =>
  typeof v === 'number' || typeof v === 'boolean'
    ? String(v)
    : JSON.stringify(String(v ?? ''));

const humanize = (slug) =>
  slug.replace(/[-/]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

async function collectModuleFiles(dir) {
  const files = [];
  async function walk(d) {
    if (!existsSync(d)) return;
    for (const e of await readdir(d, { withFileTypes: true })) {
      const fp = path.join(d, e.name);
      if (e.isDirectory()) await walk(fp);
      else if (e.name.endsWith('.module.json')) files.push(fp);
    }
  }
  await walk(dir);
  return files;
}

async function findModuleFiles() {
  const dataDir = path.join(CM, 'data');
  const exDir = path.join(CM, 'examples');
  // data/ 에 (하위 폴더 포함) .module.json 이 하나라도 있으면 실제 데이터 사용.
  const dataFiles = await collectModuleFiles(dataDir);
  if (dataFiles.length) return { base: dataDir, files: dataFiles, usingExamples: false };
  return { base: exDir, files: await collectModuleFiles(exDir), usingExamples: true };
}

function moduleSlug(mod) {
  // id = "<course>/<slug>"  → 파일명은 "<order>-<slug>"
  const tail = mod.id.split('/').slice(1).join('-') || mod.id;
  const n = String(mod.order ?? 0).padStart(2, '0');
  return tail.startsWith(n) ? tail : `${n}-${tail}`;
}

function renderModuleBody(mod, lang, courseTitle) {
  const out = [];
  const summary = pick(mod.summary, lang);
  if (summary) out.push(`_${summary}_\n`);

  const objectives = (mod.objectives ?? []).map((o) => pick(o, lang)).filter(Boolean);
  if (objectives.length) {
    out.push(':::note[학습 목표]');
    out.push(objectives.map((o) => `- ${o}`).join('\n'));
    out.push(':::\n');
  }

  const body = pick(mod.body, lang);
  if (body) out.push(body + '\n');

  const prompts = mod.prompts ?? [];
  if (prompts.length) {
    out.push('## 실전 프롬프트\n');
    for (const p of prompts) {
      out.push(`### ${pick(p.title, lang) ?? '프롬프트'}`);
      const text = pick(p.text, lang);
      if (text) out.push('\n```text\n' + text.trim() + '\n```\n');
      const notes = pick(p.notes, lang);
      if (notes) out.push(`> 💡 ${notes}\n`);
      if (p.tags?.length) out.push(`\`${p.tags.join('` `')}\`\n`);
    }
  }

  const mission = pick(mod.mission, lang);
  if (mission) {
    out.push('## 직접 만들기 (미션)\n');
    out.push(':::tip');
    out.push(mission);
    out.push(':::\n');
  }

  if (mod.rubric?.length) {
    out.push('## 채점 기준\n');
    out.push('| 기준 | 배점 |');
    out.push('| --- | --- |');
    for (const r of mod.rubric)
      out.push(`| ${pick(r.criterion, lang)} | ${r.max ?? 5} |`);
    out.push('');
  }

  if (mod.concepts?.length) {
    out.push('## 관련 개념\n');
    out.push(
      mod.concepts
        .map((c) => `- [${humanize(c)}](${prefixLink(lang, `/concepts/${c}/`)})`)
        .join('\n') + '\n',
    );
  }

  if (mod.source?.url) {
    out.push(`\n---\n<sub>출처: [${mod.source.platform ?? 'eduverse'}](${mod.source.url}) · 방식: ${mod.source.method ?? '-'}</sub>`);
  }
  return out.join('\n');
}

function prefixLink(lang, link) {
  const seg = localeSeg(lang);
  return seg ? `/${seg}${link}` : link;
}

function frontmatter(fields) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'object') {
      lines.push(`${k}:`);
      for (const [k2, v2] of Object.entries(v)) lines.push(`  ${k2}: ${yaml(v2)}`);
    } else {
      lines.push(`${k}: ${yaml(v)}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function emit(lang, relPath, content) {
  const full = path.join(DOCS, localeSeg(lang), relPath);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, content, 'utf8');
}

async function main() {
  const courses = await loadJSON(path.join(CM, 'courses.json'));
  const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));
  const { base, files, usingExamples } = await findModuleFiles();
  const modules = [];
  for (const f of files) {
    try {
      const m = await loadJSON(f);
      if (m && m.id && m.course) modules.push(m);
    } catch (e) {
      console.warn(`skip ${f}: ${e.message}`);
    }
  }

  // 기존 생성물 정리(수동 작성 index.mdx 보존 위해 하위 생성 디렉토리만 제거)
  for (const seg of ['', ...LOCALES.filter((l) => l !== ROOT_LOCALE)]) {
    for (const d of ['courses', 'concepts']) {
      await rm(path.join(DOCS, seg, d), { recursive: true, force: true });
    }
  }

  const conceptIndex = new Map(); // slug -> [{mod, lang}]
  const allPrompts = []; // {mod, prompt}
  const byCourse = new Map();

  for (const mod of modules) {
    const langsForMod = LOCALES.filter((l) => pick(mod.title, l) && (l === 'ko' || mod.title?.[l] || mod.body?.[l]));
    // 항상 ko는 생성(폴백), 번역이 있는 언어도 생성.
    const langs = Array.from(new Set(['ko', ...langsForMod]));
    const course = courseById[mod.course] ?? { id: mod.course, title: { ko: mod.course } };
    if (!byCourse.has(mod.course)) byCourse.set(mod.course, []);
    byCourse.get(mod.course).push(mod);

    for (const p of mod.prompts ?? []) allPrompts.push({ mod, prompt: p });
    for (const c of mod.concepts ?? []) {
      if (!conceptIndex.has(c)) conceptIndex.set(c, []);
      conceptIndex.get(c).push(mod);
    }

    for (const lang of langs) {
      const title = pick(mod.title, lang);
      const desc = pick(mod.summary, lang);
      const fm = frontmatter({
        title,
        description: desc,
        sidebar: { order: mod.order ?? 0 },
      });
      const body = renderModuleBody(mod, lang, pick(course.title, lang));
      await emit(lang, path.join('courses', mod.course, `${moduleSlug(mod)}.md`), fm + body);
    }
  }

  // 코스 개요(로드맵) 페이지
  for (const c of courses) {
    const mods = (byCourse.get(c.id) ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    for (const lang of LOCALES) {
      const title = pick(c.title, lang) ?? c.id;
      const list = mods.length
        ? mods.map((m) => `1. [${pick(m.title, lang)}](${prefixLink(lang, `/courses/${c.id}/${moduleSlug(m)}/`)})`).join('\n')
        : '_아직 이 코스의 모듈이 수집되지 않았습니다._';
      const fm = frontmatter({
        title: `${title} — 로드맵`,
        description: pick(c.subtitle, lang) ?? `${title} 코스 개요`,
        sidebar: { order: 0, label: '📍 로드맵' },
      });
      const meta = `> 레벨: \`${c.level ?? '-'}\` · 모듈 ${mods.length}/${c.moduleCount ?? '?'}개${c.autoUpdated ? ' · 🔄 자동 갱신' : ''}\n`;
      await emit(lang, path.join('courses', c.id, 'index.md'), fm + meta + '\n' + list + '\n');
    }
  }

  // 개념 사전(위키식 backlink)
  for (const [slug, mods] of conceptIndex) {
    for (const lang of LOCALES) {
      const uniq = [...new Map(mods.map((m) => [m.id, m])).values()];
      const links = uniq
        .map((m) => `- [${pick(m.title, lang)}](${prefixLink(lang, `/courses/${m.course}/${moduleSlug(m)}/`)}) <sub>(${pick(courseById[m.course]?.title, lang) ?? m.course})</sub>`)
        .join('\n');
      const fm = frontmatter({
        title: humanize(slug),
        description: `'${humanize(slug)}' 개념을 다루는 모듈`,
      });
      await emit(lang, path.join('concepts', `${slug}.md`), fm + `이 개념을 다루는 모듈:\n\n${links}\n`);
    }
  }

  // 프롬프트 라이브러리
  for (const lang of LOCALES) {
    const rows = allPrompts.map(({ mod, prompt }) => {
      const t = pick(prompt.title, lang) ?? '프롬프트';
      const src = `[${pick(mod.title, lang)}](${prefixLink(lang, `/courses/${mod.course}/${moduleSlug(mod)}/`)})`;
      const tags = prompt.tags?.length ? '`' + prompt.tags.join('` `') + '`' : '';
      return `### ${t}\n\n\`\`\`text\n${(pick(prompt.text, lang) ?? '').trim()}\n\`\`\`\n\n출처: ${src} ${tags}\n`;
    });
    const fm = frontmatter({
      title: '프롬프트 라이브러리',
      description: '모든 모듈의 실전 프롬프트 모음',
    });
    await emit(lang, 'prompts.md', fm + (rows.length ? rows.join('\n') : '_아직 수집된 프롬프트가 없습니다._\n'));
  }

  console.log(`✔ 생성 완료`);
  console.log(`  소스: ${path.relative(ROOT, base)}${usingExamples ? '  (⚠ examples 사용 — 실제 데이터 아님)' : ''}`);
  console.log(`  모듈: ${modules.length}개 · 코스: ${byCourse.size}개 · 개념: ${conceptIndex.size}개 · 프롬프트: ${allPrompts.length}개`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

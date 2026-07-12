// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// 내부용 AI 지식 위키. Starlight = 사이드바 로드맵 네비 + Pagefind 전문검색(내부망 동작) + i18n.
export default defineConfig({
  site: 'https://ai-learning-wiki.internal',
  integrations: [
    starlight({
      title: 'AI Learning Wiki',
      description: 'EduVerse 기반 AI 지식·프롬프트 내부 위키 (입문→실무→빌더→엔지니어→자동화→금융→트렌드)',
      // ko를 루트 로케일(문서 최상단)로, 나머지는 하위 디렉토리로.
      locales: {
        root: { label: '한국어', lang: 'ko' },
        en: { label: 'English', lang: 'en' },
        es: { label: 'Español', lang: 'es' },
        ja: { label: '日本語', lang: 'ja' },
        zh: { label: '中文', lang: 'zh' },
      },
      // 사이드바는 코스=그룹, 모듈=항목. 디렉토리 자동생성.
      // (Starlight v0.39+ : autogenerate는 그룹의 items 배열 안에 넣는다)
      sidebar: [
        { label: '🧭 개요', link: '/' },
        { label: '📚 프롬프트 라이브러리', link: '/prompts/' },
        { label: '🗂 개념 사전', collapsed: true, items: [{ autogenerate: { directory: 'concepts' } }] },
        { label: '① AI 입문', collapsed: true, items: [{ autogenerate: { directory: 'courses/ai-intro' } }] },
        { label: '② AI 실무', collapsed: true, items: [{ autogenerate: { directory: 'courses/ai-work' } }] },
        { label: '③ AI 빌더', collapsed: true, items: [{ autogenerate: { directory: 'courses/ai-builder' } }] },
        { label: '④ AI 엔지니어', collapsed: true, items: [{ autogenerate: { directory: 'courses/ai-engineer' } }] },
        { label: '⑤ 자동화 개발', collapsed: true, items: [{ autogenerate: { directory: 'courses/automation' } }] },
        { label: '⑥ AI 금융', collapsed: true, items: [{ autogenerate: { directory: 'courses/ai-finance' } }] },
        { label: '⑦ AI 트렌드', collapsed: true, items: [{ autogenerate: { directory: 'courses/ai-trends' } }] },
      ],
      pagination: false,
    }),
  ],
});

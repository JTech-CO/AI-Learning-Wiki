import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: process.env.SITE_URL,
  integrations: [
    starlight({
      title: 'AI Learning Wiki',
      description: '목표와 수준에 맞춰 배우는 305개 AI 실전 학습 위키',
      customCss: ['./src/styles/custom.css', './src/styles/components.css'],
      head: [{ tag: 'script', attrs: { src: '/progress.js', defer: true } }],
      locales: { root: { label: '한국어', lang: 'ko' } },
      pagination: false,
      sidebar: [
        { label: '오늘의 학습', link: '/' },
        { label: '맞춤 로드맵', link: '/paths/' },
        { label: '전체 학습 탐색', link: '/explore/' },
        { label: '프롬프트 탐색', link: '/prompt-explorer/' },
        { label: '개념 사전', items: [{ autogenerate: { directory: 'concepts' } }] },
        { label: '처음 시작', items: [{ autogenerate: { directory: 'courses/ai-start' } }] },
        { label: 'AI 입문', items: [{ autogenerate: { directory: 'courses/ai-intro' } }] },
        { label: '업무 활용', items: [{ autogenerate: { directory: 'courses/ai-work' } }] },
        { label: '콘텐츠 제작', items: [{ autogenerate: { directory: 'courses/ai-content' } }] },
        { label: '개발·엔지니어링', items: [{ autogenerate: { directory: 'courses/ai-engineer' } }] },
        { label: '자동화·에이전트', items: [{ autogenerate: { directory: 'courses/ai-automation' } }] },
        { label: '비즈니스·수익화', items: [{ autogenerate: { directory: 'courses/ai-earn' } }] },
        { label: '최신 동향', items: [{ autogenerate: { directory: 'courses/ai-trends' } }] },
      ],
    }),
  ],
});

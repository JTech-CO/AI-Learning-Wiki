import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: process.env.SITE_URL,
  integrations: [
    starlight({
      title: 'AI Learning Wiki',
      description: 'AI와 LLM을 연결해 설명하는 한국어 백과사전',
      head: [{ tag: 'script', attrs: { src: '/wiki-course-progress.js', defer: true } }],
      customCss: ['./src/styles/wiki.css', './src/styles/wiki-library.css'],
      locales: { root: { label: '한국어', lang: 'ko' } },
      pagefind: false,
      pagination: false,
      components: {
        Header: './src/components/wiki/WikiHeader.astro',
        Sidebar: './src/components/wiki/WikiSidebar.astro',
        MobileMenuToggle: './src/components/wiki/WikiMobileMenuToggle.astro'
      },
      sidebar: [
        { label: '대문', link: '/' },
        { label: '전체 문서', link: '/special/all-pages/' },
        { label: '용어 색인', link: '/glossary/' },
        { label: '학습 코스', items: [{ autogenerate: { directory: 'course' } }] },
        { label: '백과 분류', items: [{ autogenerate: { directory: 'category' } }] },
        { label: '실습 자료실', link: '/explore/' },
        { label: '프롬프트 자료실', link: '/prompt-explorer/' }
      ]
    })
  ]
});

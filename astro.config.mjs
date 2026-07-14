import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const siteUrl = process.env.SITE_URL ?? 'https://ai-learning-wiki.bryan131.chatgpt.site';
const logoUrl = new URL('/logo.png', siteUrl).toString();

export default defineConfig({
  site: siteUrl,
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: 'AI Learning Wiki',
      description: 'AI와 LLM을 연결해 설명하는 한국어 백과사전',
      favicon: '/logo.png',
      head: [
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/logo.png' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#ffffff' } },
        { tag: 'meta', attrs: { property: 'og:image', content: logoUrl } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1254' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '1254' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'AI Learning Wiki 로고' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: logoUrl } }
      ],
      customCss: ['./src/styles/wiki.css', './src/styles/wiki-library.css'],
      locales: { root: { label: '한국어', lang: 'ko' } },
      pagefind: false,
      credits: false,
      pagination: false,
      components: {
        Header: './src/components/wiki/WikiHeader.astro',
        Sidebar: './src/components/wiki/WikiSidebar.astro',
        MobileMenuToggle: './src/components/wiki/WikiMobileMenuToggle.astro',
        Footer: './src/components/wiki/WikiFooter.astro'
      },
      sidebar: [
        { label: '대문', link: '/' },
        { label: '전체 문서', link: '/special/all-pages/' },
        { label: '용어 색인', link: '/glossary/' },
        { label: '학습 코스', items: [{ autogenerate: { directory: 'course' } }] },
        { label: '백과 분류', items: [{ autogenerate: { directory: 'category' } }] },
        { label: '프롬프트 자료실', link: '/prompt-explorer/' }
      ]
    })
  ]
});

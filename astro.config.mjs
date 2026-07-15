import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const siteUrl = process.env.SITE_URL ?? 'https://jtech-co.github.io';
const configuredBase = process.env.BASE_PATH ?? (process.argv.includes('dev') ? '/' : '/AI-Learning-Wiki');
const basePath = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
const withBase = (pathname) => `${basePath}${pathname}`;
const logoUrl = new URL(withBase('/logo.png'), siteUrl).toString();

export default defineConfig({
  site: siteUrl,
  base: basePath || '/',
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: 'AI Learning Wiki',
      description: 'AI와 LLM을 연결해 설명하는 한국어 백과사전',
      favicon: '/logo.png',
      head: [
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: withBase('/logo.png') } },
        { tag: 'link', attrs: { rel: 'manifest', href: withBase('/site.webmanifest') } },
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
      tableOfContents: false,
      credits: false,
      pagination: false,
      components: {
        Header: './src/components/wiki/WikiHeader.astro',
        Sidebar: './src/components/wiki/WikiSidebar.astro',
        MobileMenuToggle: './src/components/wiki/WikiMobileMenuToggle.astro',
        Footer: './src/components/wiki/WikiFooter.astro',
        TableOfContents: './src/components/wiki/WikiTableOfContents.astro',
        MobileTableOfContents: './src/components/wiki/WikiMobileTableOfContents.astro'
      },
      sidebar: [
        { label: '대문', link: '/' },
        { label: '전체 문서(색인)', link: '/special/all-pages/' },
        { label: '학습 코스', items: [{ autogenerate: { directory: 'course' } }] },
        { label: '백과 분류', items: [{ autogenerate: { directory: 'category' } }] },
        { label: '프롬프트 자료실', link: '/prompt-explorer/' },
        { label: '코드·설정 자료실', link: '/snippet-explorer/' }
      ]
    })
  ]
});

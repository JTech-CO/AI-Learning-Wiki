import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const siteUrl = process.env.SITE_URL ?? 'https://ai-wiki.kr';
const configuredBase = process.env.BASE_PATH ?? '/';
const basePath = configuredBase === '/' ? '' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}`;
const withBase = (pathname) => `${basePath}${pathname}`;
const ogImageUrl = new URL(withBase('/social/og-image.png'), siteUrl).toString();
const twitterImageUrl = new URL(withBase('/social/twitter-card.png'), siteUrl).toString();

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
        { tag: 'meta', attrs: { property: 'og:image', content: ogImageUrl } },
        { tag: 'meta', attrs: { property: 'og:image:secure_url', content: ogImageUrl } },
        { tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'AI Learning Wiki — AI와 LLM을 연결하는 백과사전' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: twitterImageUrl } },
        { tag: 'meta', attrs: { name: 'twitter:image:alt', content: 'AI Learning Wiki — AI와 LLM을 연결하는 백과사전' } }
      ],
      customCss: [
        './src/styles/wiki.css',
        './src/styles/wiki-library.css',
        './src/styles/wiki-lab.css',
        './src/styles/wiki-editor-quality.css'
      ],
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
        { label: 'AI 실험실', items: [{ autogenerate: { directory: 'lab' } }] },
        { label: '백과 분류', items: [{ autogenerate: { directory: 'category' } }] },
        { label: '프롬프트 자료실', link: '/prompt-explorer/' },
        { label: '코드·설정 자료실', link: '/snippet-explorer/' }
      ]
    })
  ]
});

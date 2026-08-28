import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://manmeetnain.github.io',
  base: '/storagecraft',
  integrations: [
    starlight({
      title: 'StorageCraft',
      description: 'The open knowledge base for storage systems and AI infrastructure — by Manmeet Nain.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/manmeetnain/storagecraft' },
      ],
      editLink: { baseUrl: 'https://github.com/manmeetnain/storagecraft/edit/main/' },
      lastUpdated: true,
      pagination: true,
      customCss: ['./src/assets/custom.css'],
      logo: { src: './src/assets/storagecraft-mark.svg' },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://manmeetnain.github.io/storagecraft/brand/storagecraft-social.png' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:site_name', content: 'StorageCraft by Manmeet Nain' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'author', content: 'Manmeet Nain' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#07111f' } },
      ],
      sidebar: [
        { label: 'About', link: '/about/' },
        {
          label: '🧠 Core Concepts',
          items: [{ autogenerate: { directory: 'concepts' } }],
        },
        {
          label: '🤖 AI Infrastructure',
          items: [{ autogenerate: { directory: 'ai-infra' } }],
        },
        {
          label: '✨ AI Practice',
          items: [{ autogenerate: { directory: 'ai-practice' } }],
        },
        {
          label: '⚙️ Storage Internals',
          items: [{ autogenerate: { directory: 'internals' } }],
        },
        {
          label: '⚖️ Comparisons',
          items: [{ autogenerate: { directory: 'comparisons' } }],
        },
        {
          label: '📊 Benchmarks',
          items: [{ autogenerate: { directory: 'benchmarks' } }],
        },
        {
          label: '🔬 Simulators',
          items: [{ autogenerate: { directory: 'simulators' } }],
        },
      ],
    }),
  ],
});

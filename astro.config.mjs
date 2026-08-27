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
      lastUpdated: true,
      pagination: true,
      customCss: ['./src/assets/custom.css'],
      logo: { src: './src/assets/storagecraft-mark.svg' },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://manmeetnain.github.io/storagecraft/brand/storagecraft-social.png' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#07111f' } },
      ],
      sidebar: [
        {
          label: '🧠 Core Concepts',
          items: [{ autogenerate: { directory: 'concepts' } }],
        },
        {
          label: '🤖 AI Infrastructure',
          items: [{ autogenerate: { directory: 'ai-infra' } }],
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

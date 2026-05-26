import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://manmeetnain.github.io',
  base: '/storagecraft',
  integrations: [
    starlight({
      title: 'StorageCraft',
      description: 'The open knowledge base for storage systems and AI infrastructure — by Manmeet Nain.',
      social: {
        github: 'https://github.com/manmeetnain/storagecraft',
      },
      editLink: {
        baseUrl: 'https://github.com/manmeetnain/storagecraft/edit/main/docs/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      customCss: ['./src/assets/custom.css'],
      sidebar: [
        {
          label: '🚀 Start Here',
          items: [
            { label: 'Welcome', link: '/' },
            { label: 'How to use this site', link: '/start/how-to-use' },
            { label: 'Contributing', link: '/start/contributing' },
          ],
        },
        { label: '🧠 Core Concepts', autogenerate: { directory: 'concepts' } },
        { label: '⚙️ Storage Internals', autogenerate: { directory: 'internals' } },
        { label: '🤖 AI Infrastructure', autogenerate: { directory: 'ai-infra' } },
        { label: '⚖️ Comparisons', autogenerate: { directory: 'comparisons' } },
        { label: '📊 Benchmarks', autogenerate: { directory: 'benchmarks' } },
        { label: '🔬 Simulators', autogenerate: { directory: 'simulators' } },
      ],
    }),
  ],
});

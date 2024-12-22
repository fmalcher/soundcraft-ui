import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'soundcraft-ui-connection',

  url: 'https://fmalcher.github.io',
  baseUrl: '/soundcraft-ui/',

  // GitHub pages deployment config
  organizationName: 'fmalcher',
  projectName: 'soundcraft-ui',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn', // 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/fmalcher/soundcraft-ui/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'soundcraft-ui-connection',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docSidebar',
          position: 'left',
          label: 'Home',
        },
        {
          href: 'https://github.com/fmalcher/soundcraft-ui',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'Documentation',
              to: '/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/fmalcher/soundcraft-ui',
            },
            {
              label: 'Sponsor this project ❤️',
              href: 'https://github.com/sponsors/fmalcher',
            },
            {
              label: 'Imprint',
              href: '/imprint',
            },
          ],
        },
      ],
      copyright: 'Made with ❤️ and ☕️ by Ferdinand Malcher',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

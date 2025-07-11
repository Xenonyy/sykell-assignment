import type { UrlAnalysis } from '../types/UrlAnalysis';

export const urlAnalyses: UrlAnalysis[] = [
  {
    id: '1',
    url: 'https://example.com',
    status: 'done',
    title: 'Example Domain',
    htmlVersion: 'HTML5',
    headings: { h1: 1, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 },
    internalLinks: 2,
    externalLinks: 1,
    brokenLinks: [{ url: 'https://example.com/broken', status: 404 }],
    hasLoginForm: false,
  },
  {
    id: '2',
    url: 'https://sykell.com',
    status: 'running',
    title: 'Sykell',
    htmlVersion: 'HTML5',
    headings: { h1: 1, h2: 2, h3: 3, h4: 0, h5: 0, h6: 0 },
    internalLinks: 10,
    externalLinks: 5,
    brokenLinks: [],
    hasLoginForm: true,
  },
];

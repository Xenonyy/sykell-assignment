export type UrlAnalysis = {
  id: string;
  url: string;
  status: 'queued' | 'running' | 'done' | 'error';
  title: string;
  htmlVersion: string;
  headings: { h1: number; h2: number; h3: number; h4: number; h5: number; h6: number };
  internalLinks: number;
  externalLinks: number;
  brokenLinks: { url: string; status: number }[];
  hasLoginForm: boolean;
};

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

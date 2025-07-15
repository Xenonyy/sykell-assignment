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

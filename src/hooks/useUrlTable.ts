import { useState } from 'react';
import type { UrlAnalysis } from '../types/UrlAnalysis';

export const useUrlTable = (initialAnalyses: UrlAnalysis[]) => {
  const [analyses, setAnalyses] = useState<UrlAnalysis[]>(initialAnalyses);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('url');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;
  const [filters, setFilters] = useState({
    url: '',
    title: '',
    htmlVersion: '',
    internalLinks: '',
    externalLinks: '',
    status: '',
  });

  function handleSelect(id: string, checked: boolean) {
    setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter((selected) => selected !== id));
  }

  function handleStart() {
    setAnalyses(
      analyses.map((url) =>
        selectedIds.includes(url.id) && url.status === 'queued' ? { ...url, status: 'running' } : url
      )
    );
  }
  function handleStop() {
    setAnalyses(
      analyses.map((url) =>
        selectedIds.includes(url.id) && url.status === 'running' ? { ...url, status: 'queued' } : url
      )
    );
  }

  const filtered = analyses
    .filter(
      (url) =>
        (url.url.toLowerCase().includes(search.toLowerCase()) ||
          url.title.toLowerCase().includes(search.toLowerCase())) &&
        (filters.url ? url.url.toLowerCase().includes(filters.url.toLowerCase()) : true) &&
        (filters.title ? url.title.toLowerCase().includes(filters.title.toLowerCase()) : true) &&
        (filters.htmlVersion ? url.htmlVersion.toLowerCase().includes(filters.htmlVersion.toLowerCase()) : true) &&
        (filters.internalLinks ? url.internalLinks === Number(filters.internalLinks) : true) &&
        (filters.externalLinks ? url.externalLinks === Number(filters.externalLinks) : true) &&
        (filters.status ? url.status === filters.status : true)
    )
    .sort((a, b) => {
      if (a[sortKey as keyof UrlAnalysis] < b[sortKey as keyof UrlAnalysis]) return sortAsc ? -1 : 1;
      if (a[sortKey as keyof UrlAnalysis] > b[sortKey as keyof UrlAnalysis]) return sortAsc ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return {
    analyses,
    setAnalyses,
    selectedIds,
    handleSelect,
    handleStart,
    handleStop,
    search,
    setSearch,
    sortKey,
    setSortKey,
    sortAsc,
    setSortAsc,
    page,
    setPage,
    pageSize,
    filters,
    setFilters,
    filtered,
    paginated,
    totalPages,
  };
};

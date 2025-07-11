import { urlAnalyses } from '../../api/urlCrawl';
import { useUrlTable } from '../../hooks/useUrlTable';
import { messages } from '../../messages';

const columns = [
  { key: 'url', label: 'URL', filterType: 'text', placeholder: messages.filterUrl },
  { key: 'title', label: 'Title', filterType: 'text', placeholder: messages.filterTitle },
  { key: 'htmlVersion', label: 'HTML Version', filterType: 'text', placeholder: messages.filterHtml },
  { key: 'internalLinks', label: '#Internal Links', filterType: 'number', placeholder: messages.filterInternal },
  { key: 'externalLinks', label: '#External Links', filterType: 'number', placeholder: messages.filterExternal },
  { key: 'status', label: 'Status', filterType: 'select', placeholder: messages.filterStatus },
];

const statusOptions = [
  { value: '', label: messages.filterStatus },
  { value: 'queued', label: messages.statusQueued },
  { value: 'running', label: messages.statusRunning },
  { value: 'done', label: messages.statusDone },
  { value: 'error', label: messages.statusError },
];

export default function UrlDashboard() {
  const {
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
    filters,
    setFilters,
    paginated,
    totalPages,
  } = useUrlTable(urlAnalyses);

  return (
    <div className="min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-white">{messages.dashboardTitle}</h1>
      <div className="flex gap-2 mb-4">
        <button
          className="bg-green-700 hover:bg-green-600 active:bg-green-800 text-white px-3 py-1 rounded transition-all duration-200 disabled:opacity-50"
          onClick={handleStart}
          disabled={selectedIds.length === 0}
        >
          {messages.start}
        </button>
        <button
          className="bg-yellow-700 hover:bg-yellow-600 active:bg-yellow-800 text-white px-3 py-1 rounded transition-all duration-200 disabled:opacity-50"
          onClick={handleStop}
          disabled={selectedIds.length === 0}
        >
          {messages.stop}
        </button>
      </div>
      <input
        type="text"
        placeholder={messages.searchPlaceholder}
        className="mb-4 p-2 border border-gray-700 bg-gray-800 text-gray-100 rounded w-full max-w-md transition-all duration-200 focus:border-blue-500"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <div className="grid grid-cols-7 gap-2 mb-2">
        {columns.map((col) =>
          col.filterType === 'select' ? (
            <select
              key={col.key}
              className="p-1 border border-gray-700 bg-gray-800 text-gray-100 rounded transition-all duration-200 focus:border-blue-500"
              value={(filters as Record<string, string>)[col.key]}
              onChange={(e) => {
                setFilters((f) => ({ ...f, [col.key]: e.target.value }));
                setPage(1);
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              key={col.key}
              type={col.filterType}
              className="p-1 border border-gray-700 bg-gray-800 text-gray-100 rounded transition-all duration-200 focus:border-blue-500"
              placeholder={col.placeholder}
              value={(filters as Record<string, string>)[col.key]}
              onChange={(e) => {
                setFilters((f) => ({ ...f, [col.key]: e.target.value }));
                setPage(1);
              }}
            />
          )
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded shadow transition-all duration-200">
          <thead>
            <tr>
              <th className="py-2 px-4"></th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="py-2 px-4 text-left cursor-pointer text-gray-200 transition-all duration-200"
                  onClick={() => {
                    setSortKey(col.key);
                    setSortAsc(sortKey === col.key ? !sortAsc : true);
                  }}
                >
                  {col.label}
                  {sortKey === col.key && (sortAsc ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.id} className="border-t border-gray-700 hover:bg-gray-700 transition-all duration-200">
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(u.id)}
                    onChange={(e) => handleSelect(u.id, e.target.checked)}
                  />
                </td>
                <td className="py-2 px-4">{u.url}</td>
                <td className="py-2 px-4">{u.title}</td>
                <td className="py-2 px-4">{u.htmlVersion}</td>
                <td className="py-2 px-4">{u.internalLinks}</td>
                <td className="py-2 px-4">{u.externalLinks}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs transition-all duration-200 ${
                      u.status === 'done'
                        ? 'bg-green-800 text-green-200'
                        : u.status === 'running'
                          ? 'bg-blue-800 text-blue-200'
                          : u.status === 'error'
                            ? 'bg-red-800 text-red-200'
                            : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-100 transition-all duration-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {messages.prev}
        </button>
        <span>
          {messages.page} {page} {messages.of} {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-gray-100 transition-all duration-200 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          {messages.next}
        </button>
      </div>
    </div>
  );
}

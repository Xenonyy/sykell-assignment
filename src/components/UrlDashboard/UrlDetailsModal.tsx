import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { UrlAnalysis } from '../../types/UrlAnalysis';
import { messages } from '../../messages';
import { memo, useEffect, useRef } from 'react';

Chart.register(ArcElement, Tooltip, Legend);

type UrlDetailsModalProps = {
  url: UrlAnalysis;
  onClose: () => void;
};

const UrlDetailsModalComponent = ({ url, onClose }: UrlDetailsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const data = {
    labels: [messages.modalInternalLinks, messages.modalExternalLinks],
    datasets: [
      {
        data: [url.internalLinks, url.externalLinks],
        backgroundColor: ['#2563eb', '#f59e42'],
        borderColor: ['#1e40af', '#b45309'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-10" onMouseDown={handleBackdropClick}>
      <div
        ref={modalRef}
        className="bg-violet-300 text-gray-100 rounded-lg p-6 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-6 scale-150 text-white hover:text-black cursor-pointer transition-all duration-300"
          onClick={onClose}
          aria-label={messages.modalClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">{url.title}</h2>
        <div className="mb-6 text-white scale-90">
          <Doughnut data={data} />
        </div>
        <div>
          <h3 className="font-semibold mb-2">{messages.modalBrokenLinksTitle}</h3>
          {Array.isArray(url.brokenLinks) ? (
            url.brokenLinks.length === 0 ? (
              <div className="text-white">{messages.modalNoBrokenLinks}</div>
            ) : (
              <ul className="list-disc pl-5">
                {url.brokenLinks.map((link) => (
                  <li key={link.url} className="break-all">
                    <span className="text-blue-400 pr-1">{link.url}</span>
                    <span className="text-red-400">({link.status})</span>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="text-white">{url.brokenLinks || messages.modalNoBrokenLinks}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const UrlDetailsModal = memo(UrlDetailsModalComponent);

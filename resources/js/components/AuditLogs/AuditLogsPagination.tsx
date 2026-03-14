import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Pagination } from './types';
import { useLanguage } from '@/components/language-provider';

interface AuditLogsPaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}

export function AuditLogsPagination({
  pagination,
  onPageChange,
  onPerPageChange,
  isRtl,
  t,
}: AuditLogsPaginationProps) {
  const { current_page, per_page, total, total_pages, has_more_pages } = pagination;
  const startRecord = total === 0 ? 0 : (current_page - 1) * per_page + 1;
  const endRecord = Math.min(current_page * per_page, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (total_pages <= maxVisiblePages) {
      for (let i = 1; i <= total_pages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current_page > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current_page - 1);
      const end = Math.min(total_pages - 1, current_page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current_page < total_pages - 2) {
        pages.push('...');
      }

      pages.push(total_pages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {t('Showing {start} to {end} of {total} results', 'عرض {start} إلى {end} من أصل {total} نتيجة').replace('{start}', String(startRecord)).replace('{end}', String(endRecord)).replace('{total}', String(total))}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={per_page}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            aria-label={t('Previous page', 'الصفحة السابقة')}
          >
            {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={typeof page !== 'number'}
              className={`min-w-[2.5rem] rounded border px-3 py-1.5 text-sm transition-colors ${
                page === current_page
                  ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-400'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={!has_more_pages}
            className="rounded border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            aria-label={t('Next page', 'الصفحة التالية')}
          >
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

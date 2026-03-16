import { Head, router } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AuditLogCard } from '@/components/AuditLogs/AuditLogCard';
import { AuditLogsEmptyState } from '@/components/AuditLogs/AuditLogsEmptyState';
import { AuditLogsHeader } from '@/components/AuditLogs/AuditLogsHeader';
import { AuditLogsPagination } from '@/components/AuditLogs/AuditLogsPagination';
import { AuditLogsStats } from '@/components/AuditLogs/AuditLogsStats';
import type { AuditLog, AuditLogFilters, Pagination } from '@/components/AuditLogs/types';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const INITIAL_FILTERS: AuditLogFilters = {
  search: '',
  action: 'all',
  resource: 'all',
  severity: 'all',
  dateRange: 'all',
};

export default function AuditLogs({ logs = [], pagination }: { logs?: AuditLog[], pagination?: Pagination }) {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('Audit Logs', 'سجلات التدقيق'), href: '/audit-logs' },
  ];

  const [filters, setFilters] = useState<AuditLogFilters>(INITIAL_FILTERS);
  const [perPage, setPerPage] = useState(pagination?.per_page || 50);

  function handleFiltersChange(partial: Partial<AuditLogFilters>) {
    const nextFilters = { ...filters, ...partial };
    setFilters(nextFilters);
    router.get('/audit-logs', buildQueryParams(1, perPage, nextFilters), {
      preserveState: true,
      replace: true,
    });
  }

  function buildQueryParams(pageNum: number, perPageNum: number, f: AuditLogFilters) {
    const params: Record<string, string | number | undefined> = {
      page: pageNum,
      per_page: perPageNum,
      search: f.search || undefined,
      action: f.action !== 'all' ? f.action : undefined,
      severity: f.severity !== 'all' ? f.severity : undefined,
      date_range: f.dateRange !== 'all' ? f.dateRange : undefined,
    };
    if (f.dateRange === 'custom' && f.startDate) params.start_date = typeof f.startDate === 'string' ? f.startDate : (f.startDate as Date).toISOString().slice(0, 10);
    if (f.dateRange === 'custom' && f.endDate) params.end_date = typeof f.endDate === 'string' ? f.endDate : (f.endDate as Date).toISOString().slice(0, 10);
    if (f.userId) params.user_id = f.userId;
    return params;
  }

  function handlePageChange(page: number) {
    router.get('/audit-logs', buildQueryParams(page, perPage, filters), {
      preserveState: true,
      replace: true,
    });
  }

  function handlePerPageChange(newPerPage: number) {
    setPerPage(newPerPage);
    router.get('/audit-logs', buildQueryParams(1, newPerPage, filters), {
      preserveState: true,
      replace: true,
    });
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
    router.get('/audit-logs', buildQueryParams(1, perPage, INITIAL_FILTERS), {
      preserveState: true,
      replace: true,
    });
  }

  const hasActiveFilters =
    filters.search !== '' ||
    filters.action !== 'all' ||
    filters.resource !== 'all' ||
    filters.severity !== 'all' ||
    filters.dateRange !== 'all';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Audit Logs', 'سجلات التدقيق')} />

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <AuditLogsHeader
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          resultCount={pagination?.total || logs.length}
          isRtl={isRtl}
          t={t}
        />

        <div className="flex flex-1 flex-col gap-6 p-6">
          {logs.length > 0 && (
            <AuditLogsStats logs={logs} t={t} isRtl={isRtl} />
          )}

          <div className="grid grid-cols-1 gap-5">
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => (
                <AuditLogCard
                  key={log.id}
                  log={log}
                  index={index}
                  isRtl={isRtl}
                  t={t}
                />
              ))}
            </AnimatePresence>

            {logs.length === 0 && (
              <AuditLogsEmptyState
                isRtl={isRtl}
                t={t}
                hasSearch={hasActiveFilters}
                searchQuery={filters.search}
                onClearSearch={hasActiveFilters ? handleClearFilters : undefined}
              />
            )}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <AuditLogsPagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              isRtl={isRtl}
              t={t}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

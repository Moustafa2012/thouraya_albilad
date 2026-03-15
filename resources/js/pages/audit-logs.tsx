import { Head, router } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(pagination?.current_page || 1);
  const [perPage, setPerPage] = useState(pagination?.per_page || 50);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          log.description.toLowerCase().includes(q) ||
          (log.userName && log.userName.toLowerCase().includes(q)) ||
          (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
          (log.ipAddress && log.ipAddress.includes(q)) ||
          log.action.includes(q) ||
          log.resource.includes(q);
        if (!matches) return false;
      }
      
      if (filters.action !== 'all' && log.action !== filters.action) return false;
      if (filters.resource !== 'all' && log.resource !== filters.resource) return false;
      if (filters.severity !== 'all' && log.severity !== filters.severity) return false;
      
      if (filters.dateRange !== 'all') {
        const logDate = new Date(log.createdAt);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (filters.dateRange) {
          case 'today':
            if (logDate < today) return false;
            break;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (logDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (logDate < monthAgo) return false;
            break;
        }
      }
      
      return true;
    });
  }, [logs, filters]);

  function handleFiltersChange(partial: Partial<AuditLogFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    router.get('/audit-logs', {
      page,
      per_page: perPage,
      ...filters,
    }, {
      preserveState: true,
      replace: true,
    });
  }

  function handlePerPageChange(newPerPage: number) {
    setPerPage(newPerPage);
    setCurrentPage(1);
    router.get('/audit-logs', {
      page: 1,
      per_page: newPerPage,
      ...filters,
    }, {
      preserveState: true,
      replace: true,
    });
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
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

import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { BankAccountCard } from '@/components/Banks/BankAccountCard';
import { BankAccountsEmptyState } from '@/components/Banks/BankAccountsEmptyStates';
import { BankAccountsHeader } from '@/components/Banks/BankAccountsHeader';
import { BankAccountsStats } from '@/components/Banks/BankAccountsStats';
import type { BankAccount, BankAccountFilters } from '@/components/Banks/types';
import { useLanguage } from '@/components/language-provider';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

const COPY_FEEDBACK_MS = 2000;
const NOTIFICATION_DURATION_MS = 5000;

const INITIAL_FILTERS: BankAccountFilters = {
  search: '',
  category: 'all',
  currency: 'all',
};

interface PageProps {
  accounts?: BankAccount[];
  flash?: { success?: string; error?: string };
}

export default function BankAccounts() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('bankAccounts.title', 'الحسابات البنكية'), href: '/bank-accounts' },
  ];

  const page = usePage();
  const { accounts = [], flash } = page.props as PageProps;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedIban, setRevealedIban] = useState<string | null>(null);
  const [filters, setFilters] = useState<BankAccountFilters>(INITIAL_FILTERS);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNotification(type: 'success' | 'error', message: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ type, message });
    timerRef.current = setTimeout(() => setNotification(null), NOTIFICATION_DURATION_MS);
  }

  function dismissNotification() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification(null);
  }

  // Show flash message from server on page load / navigation
  useEffect(() => {
    if (flash?.success) {
      const message = flash.success;
      if (message) setTimeout(() => showNotification('success', message), 0);
    } else if (flash?.error) {
      const message = flash.error;
      if (message) setTimeout(() => showNotification('error', message), 0);
    }
  }, [flash]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          a.holderNameEn.toLowerCase().includes(q) ||
          a.holderNameAr.includes(filters.search) ||
          a.bankName.toLowerCase().includes(q) ||
          a.accountNumber.includes(q) ||
          a.iban.includes(q.toUpperCase());
        if (!matches) return false;
      }
      if (filters.category !== 'all' && a.accountCategory !== filters.category) return false;
      if (filters.currency !== 'all' && a.currency !== filters.currency) return false;
      return true;
    });
  }, [accounts, filters]);

  function handleFiltersChange(partial: Partial<BankAccountFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  function handleDelete(id: string) {
    if (confirm(t('Are you sure you want to delete this account?', 'هل أنت متأكد من حذف هذا الحساب؟'))) {
      router.delete(`/bank-accounts/${id}`);
    }
  }

  function handleSetDefault(id: string) {
    router.put(`/bank-accounts/${id}`, { is_default: true });
  }

  function handleEdit(account: BankAccount) {
    router.visit(`/bank-accounts/${account.id}/edit`);
  }

  function handleCopy(text: string, id: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), COPY_FEEDBACK_MS);
    }
  }

  function handleToggleIban(id: string) {
    setRevealedIban((prev) => (prev === id ? null : id));
  }

  const hasActiveFilters =
    filters.search !== '' || filters.category !== 'all' || filters.currency !== 'all';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('bankAccounts.title', 'الحسابات البنكية')} />

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="flash"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={cn(
              'fixed inset-x-4 top-4 z-50 mx-auto flex max-w-xl items-start gap-3 rounded-xl border px-4 py-3 shadow-lg md:inset-x-auto md:left-1/2 md:-translate-x-1/2',
              notification.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'border-destructive/30 bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-200',
            )}
          >
            {notification.type === 'success'
              ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              : <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />}
            <p className="flex-1 text-sm font-medium">{notification.message}</p>
            <button
              type="button"
              onClick={dismissNotification}
              className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <BankAccountsHeader
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          resultCount={filteredAccounts.length}
          isRtl={isRtl}
          t={t}
        />

        <div className="flex flex-1 flex-col gap-6 p-6">
          {accounts.length > 0 && (
            <BankAccountsStats accounts={accounts} t={t} />
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAccounts.map((account, index) => (
                <BankAccountCard
                  key={account.id}
                  account={account}
                  index={index}
                  isIbanRevealed={revealedIban === account.id}
                  isCopied={copiedId === `iban-${account.id}`}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                  onToggleIban={handleToggleIban}
                  onCopy={handleCopy}
                  onEdit={handleEdit}
                  t={t}
                  isRtl={isRtl}
                />
              ))}
            </AnimatePresence>

            {filteredAccounts.length === 0 && (
              <BankAccountsEmptyState
                isRtl={isRtl}
                t={t}
                hasSearch={hasActiveFilters}
                searchQuery={filters.search}
                onClearSearch={hasActiveFilters ? handleClearFilters : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

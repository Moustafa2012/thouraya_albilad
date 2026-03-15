import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, CreditCard, Filter, Search, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed' | 'cancelled' | string;
type TransactionDirection = 'in' | 'out' | string;

type Transaction = {
  id: string;
  reference?: string | null;
  description?: string | null;
  counterpartyName?: string | null;
  amount?: number | null;
  currency?: string | null;
  status?: TransactionStatus | null;
  direction?: TransactionDirection | null;
  createdAt?: string | null;
};

type TransactionFilters = {
  search: string;
  status: 'all' | 'completed' | 'pending' | 'failed';
  direction: 'all' | 'in' | 'out';
  currency: 'all' | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED';
};

const INITIAL_FILTERS: TransactionFilters = {
  search: '',
  status: 'all',
  direction: 'all',
  currency: 'all',
};

const STATUS_OPTIONS: Array<{ value: TransactionFilters['status']; en: string; ar: string }> = [
  { value: 'all', en: 'All statuses', ar: 'كل الحالات' },
  { value: 'completed', en: 'Completed', ar: 'مكتملة' },
  { value: 'pending', en: 'Pending', ar: 'قيد المعالجة' },
  { value: 'failed', en: 'Failed', ar: 'فاشلة' },
];

const DIRECTION_OPTIONS: Array<{ value: TransactionFilters['direction']; en: string; ar: string }> = [
  { value: 'all', en: 'All directions', ar: 'كل الاتجاهات' },
  { value: 'out', en: 'Outgoing', ar: 'صادرة' },
  { value: 'in', en: 'Incoming', ar: 'واردة' },
];

const CURRENCY_OPTIONS: Array<{ value: TransactionFilters['currency']; en: string }> = [
  { value: 'all', en: 'All currencies' },
  { value: 'SAR', en: 'SAR' },
  { value: 'USD', en: 'USD' },
  { value: 'EUR', en: 'EUR' },
  { value: 'GBP', en: 'GBP' },
  { value: 'AED', en: 'AED' },
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function hasActiveFilters(f: TransactionFilters): boolean {
  return f.search.trim() !== '' || f.status !== 'all' || f.direction !== 'all' || f.currency !== 'all';
}

function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined,
  isRtl: boolean,
): string {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return '—';
  const cur = isNonEmptyString(currency) ? currency : 'SAR';
  try {
    return new Intl.NumberFormat(isRtl ? 'ar' : 'en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${cur}`;
  }
}

function TransactionsHeader({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  hasAnyTransactions,
  isRtl,
  t,
}: {
  filters: TransactionFilters;
  onFiltersChange: (partial: Partial<TransactionFilters>) => void;
  onClearFilters: () => void;
  resultCount: number;
  hasAnyTransactions: boolean;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}) {
  const uid = useId();
  const active = hasActiveFilters(filters);

  return (
    <header className="border-b border-border/60 bg-card/70 backdrop-blur-md">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary"
              aria-hidden="true"
            >
              <CreditCard className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('Transactions', 'المعاملات')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(
                  'Review payments, transfers, and account activity in one place.',
                  'راجع المدفوعات والتحويلات وحركة الحساب في مكان واحد.',
                )}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="shrink-0 gap-2 font-semibold"
            disabled={!hasAnyTransactions}
          >
            {t('Export', 'تصدير')}
          </Button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1" role="search">
            <Search
              className={cn(
                'pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
                isRtl ? 'right-3' : 'left-3',
              )}
              aria-hidden="true"
            />
            <Input
              id={`${uid}-search`}
              type="search"
              placeholder={t('Search transactions...', 'بحث في المعاملات...')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className={cn(
                'h-9 bg-background/60 backdrop-blur-sm',
                isRtl ? 'pr-9' : 'pl-9',
                filters.search && (isRtl ? 'pl-8' : 'pr-8'),
              )}
              aria-label={t('Search transactions', 'بحث في المعاملات')}
              aria-controls="transactions-list"
            />
            <AnimatePresence>
              {filters.search && (
                <motion.button
                  key="clear-search"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => onFiltersChange({ search: '' })}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground',
                    isRtl ? 'left-2' : 'right-2',
                  )}
                  aria-label={t('Clear search', 'مسح البحث')}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filters.status}
              onValueChange={(v) => onFiltersChange({ status: v as TransactionFilters['status'] })}
            >
              <SelectTrigger
                id={`${uid}-status`}
                className="h-9 w-44 bg-background/60 backdrop-blur-sm"
                aria-label={t('Filter by status', 'تصفية حسب الحالة')}
              >
                <Filter className="me-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.direction}
              onValueChange={(v) => onFiltersChange({ direction: v as TransactionFilters['direction'] })}
            >
              <SelectTrigger
                id={`${uid}-direction`}
                className="h-9 w-36 bg-background/60 backdrop-blur-sm"
                aria-label={t('Filter by direction', 'تصفية حسب الاتجاه')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIRECTION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.currency}
              onValueChange={(v) => onFiltersChange({ currency: v as TransactionFilters['currency'] })}
            >
              <SelectTrigger
                id={`${uid}-currency`}
                className="h-9 w-32 bg-background/60 backdrop-blur-sm"
                aria-label={t('Filter by currency', 'تصفية حسب العملة')}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AnimatePresence>
              {active && (
                <motion.div
                  key="clear-btn"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                    aria-label={t('Clear all filters', 'مسح كل المرشحات')}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                    {t('Clear', 'مسح')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {active && (
            <motion.p
              key="result-count"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-xs text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              {t(`${resultCount} transactions found`, `تم العثور على ${resultCount} معاملة`)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function TransactionsStats({
  transactions,
  isRtl,
  t,
}: {
  transactions: Transaction[];
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}) {
  if (transactions.length === 0) return null;

  const completed = transactions.filter((tx) => (tx.status ?? '').toString().toLowerCase() === 'completed').length;
  const pending = transactions.filter((tx) => (tx.status ?? '').toString().toLowerCase() === 'pending').length;
  const failed = transactions.filter((tx) => (tx.status ?? '').toString().toLowerCase() === 'failed').length;

  const chips: Array<{
    label: string;
    value: number;
    icon: React.ElementType;
    className: string;
  }> = [
    {
      label: t('Total', 'إجمالي'),
      value: transactions.length,
      icon: CreditCard,
      className: 'border-primary/25 bg-primary/10 text-primary',
    },
    {
      label: t('Completed', 'مكتملة'),
      value: completed,
      icon: CheckCircle2,
      className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    },
    {
      label: t('Pending', 'قيد المعالجة'),
      value: pending,
      icon: Clock,
      className: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    },
    {
      label: t('Failed', 'فاشلة'),
      value: failed,
      icon: AlertCircle,
      className: 'border-destructive/25 bg-destructive/10 text-destructive',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {chips.map(({ label, value, icon: Icon, className }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium', className)}
        >
          <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
          <span className="text-muted-foreground">{label}</span>
          <span className={cn('font-semibold', isRtl && 'tabular-nums')}>{value}</span>
        </motion.div>
      ))}
    </div>
  );
}

const STATUS_BADGE: Record<string, { en: string; ar: string; className: string }> = {
  completed: {
    en: 'Completed',
    ar: 'مكتملة',
    className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  pending: {
    en: 'Pending',
    ar: 'قيد المعالجة',
    className: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  },
  failed: {
    en: 'Failed',
    ar: 'فاشلة',
    className: 'border-destructive/25 bg-destructive/10 text-destructive',
  },
  reversed: {
    en: 'Reversed',
    ar: 'مُرجعة',
    className: 'border-border bg-muted/30 text-muted-foreground',
  },
  cancelled: {
    en: 'Cancelled',
    ar: 'ملغاة',
    className: 'border-border bg-muted/30 text-muted-foreground',
  },
};

function TransactionCard({
  transaction,
  index,
  isRtl,
  t,
}: {
  transaction: Transaction;
  index: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}) {
  const statusKey = (transaction.status ?? '').toString().toLowerCase();
  const status = STATUS_BADGE[statusKey] ?? {
    en: isNonEmptyString(transaction.status) ? transaction.status : t('Unknown', 'غير معروف'),
    ar: isNonEmptyString(transaction.status) ? transaction.status : t('Unknown', 'غير معروف'),
    className: 'border-border bg-muted/30 text-muted-foreground',
  };

  const directionKey = (transaction.direction ?? '').toString().toLowerCase();
  const directionLabel =
    directionKey === 'in'
      ? t('Incoming', 'واردة')
      : directionKey === 'out'
        ? t('Outgoing', 'صادرة')
        : t('Transfer', 'تحويل');

  const title = isNonEmptyString(transaction.counterpartyName)
    ? transaction.counterpartyName
    : t('Transaction', 'معاملة');

  const sub = isNonEmptyString(transaction.description)
    ? transaction.description
    : isNonEmptyString(transaction.reference)
      ? transaction.reference
      : t('No description', 'بدون وصف');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/30"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 px-5 py-4">
        <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold leading-tight text-white">{title}</h3>
            <p className="mt-0.5 truncate text-xs text-white/70">{directionLabel}</p>
          </div>

          <span
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm',
              status.className,
            )}
          >
            {isRtl ? status.ar : status.en}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Details', 'التفاصيل')}
            </p>
            <p className="truncate text-sm font-medium text-foreground">{sub}</p>
          </div>

          <div className="text-end">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Amount', 'المبلغ')}
            </p>
            <p className="text-sm font-semibold text-primary">
              {formatMoney(transaction.amount, transaction.currency, isRtl)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('Status', 'الحالة'), value: isRtl ? status.ar : status.en },
            { label: t('Currency', 'العملة'), value: transaction.currency ?? '—' },
            { label: t('Ref', 'مرجع'), value: transaction.reference ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="truncate font-mono text-xs font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TransactionsEmptyState({
  isRtl,
  t,
  hasSearch = false,
  searchQuery = '',
  onClearSearch,
}: {
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  hasSearch?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}) {
  if (hasSearch && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-8 py-16 text-center"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
          <CreditCard className="size-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{t('No results found', 'لم يتم العثور على نتائج')}</h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {t(
            `No transactions matching "${searchQuery}" were found.`,
            `لم يتم العثور على معاملات تطابق "${searchQuery}".`,
          )}
        </p>
        {onClearSearch && (
          <Button variant="outline" size="sm" onClick={onClearSearch}>
            {t('Clear search', 'مسح البحث')}
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="col-span-full"
    >
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/30 px-8 py-20 text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/15 bg-primary/8 text-primary/50">
          <CreditCard className="size-11" />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-foreground">{t('No transactions yet', 'لا توجد معاملات بعد')}</h2>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t(
            'Once you start making transfers and payouts, they will appear here with full details and statuses.',
            'عند البدء بإجراء التحويلات والمدفوعات، ستظهر هنا بكامل التفاصيل والحالات.',
          )}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/beneficiaries">
            <Button className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
              {t('Manage beneficiaries', 'إدارة المستفيدين')}
              <span className={cn('text-xs opacity-70', isRtl ? 'me-1' : 'ms-1')}>{t('→', '←')}</span>
            </Button>
          </Link>
          <Link href="/bank-accounts">
            <Button variant="outline" className="gap-2 font-semibold">
              {t('Manage bank accounts', 'إدارة الحسابات البنكية')}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Transactions({ transactions = [] }: { transactions?: Transaction[] }) {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const breadcrumbs: BreadcrumbItem[] = [{ title: t('transactions.title', 'المعاملات'), href: '/transactions' }];

  const [filters, setFilters] = useState<TransactionFilters>(INITIAL_FILTERS);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          (tx.reference ?? '').toString().toLowerCase().includes(q) ||
          (tx.description ?? '').toString().toLowerCase().includes(q) ||
          (tx.counterpartyName ?? '').toString().toLowerCase().includes(q) ||
          (tx.currency ?? '').toString().toLowerCase().includes(q) ||
          (tx.amount ?? '').toString().includes(filters.search);
        if (!matches) return false;
      }

      const statusKey = (tx.status ?? '').toString().toLowerCase();
      if (filters.status !== 'all' && statusKey !== filters.status) return false;

      const directionKey = (tx.direction ?? '').toString().toLowerCase();
      if (filters.direction !== 'all' && directionKey !== filters.direction) return false;

      const cur = (tx.currency ?? '').toString().toUpperCase();
      if (filters.currency !== 'all' && cur !== filters.currency) return false;

      return true;
    });
  }, [filters, transactions]);

  function handleFiltersChange(partial: Partial<TransactionFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const active = hasActiveFilters(filters);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('transactions.title', 'المعاملات')} />

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <TransactionsHeader
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          resultCount={filteredTransactions.length}
          hasAnyTransactions={transactions.length > 0}
          isRtl={isRtl}
          t={t}
        />

        <div className="flex flex-1 flex-col gap-6 p-6">
          {transactions.length > 0 && (
            <TransactionsStats transactions={transactions} isRtl={isRtl} t={t} />
          )}

          <div id="transactions-list" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTransactions.map((transaction, index) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  index={index}
                  isRtl={isRtl}
                  t={t}
                />
              ))}
            </AnimatePresence>

            {filteredTransactions.length === 0 && (
              <TransactionsEmptyState
                isRtl={isRtl}
                t={t}
                hasSearch={active}
                searchQuery={filters.search}
                onClearSearch={active ? handleClearFilters : undefined}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

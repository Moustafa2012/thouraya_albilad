import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Filter, Search, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type JournalEntryType = 'general' | 'transfer' | 'fee' | 'adjustment' | string;
type JournalEntryStatus = 'posted' | 'pending' | 'reversed' | string;

type JournalEntry = {
  id: string;
  date: string;
  description: string;
  reference?: string | null;
  type: JournalEntryType;
  status: JournalEntryStatus;
  amount: number;
  currency: string;
};

type JournalFilters = {
  search: string;
  type: 'all' | 'general' | 'transfer' | 'fee' | 'adjustment';
  status: 'all' | 'posted' | 'pending' | 'reversed';
  currency: 'all' | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED';
};

const INITIAL_FILTERS: JournalFilters = {
  search: '',
  type: 'all',
  status: 'all',
  currency: 'all',
};

const TYPE_OPTIONS: Array<{ value: JournalFilters['type']; en: string; ar: string }> = [
  { value: 'all', en: 'All types', ar: 'كل الأنواع' },
  { value: 'general', en: 'General', ar: 'عام' },
  { value: 'transfer', en: 'Transfer', ar: 'تحويل' },
  { value: 'fee', en: 'Fee', ar: 'رسوم' },
  { value: 'adjustment', en: 'Adjustment', ar: 'تسوية' },
];

const STATUS_OPTIONS: Array<{ value: JournalFilters['status']; en: string; ar: string }> = [
  { value: 'all', en: 'All statuses', ar: 'كل الحالات' },
  { value: 'posted', en: 'Posted', ar: 'مُرحلة' },
  { value: 'pending', en: 'Pending', ar: 'قيد المعالجة' },
  { value: 'reversed', en: 'Reversed', ar: 'مُرجعة' },
];

const CURRENCY_OPTIONS: Array<{ value: JournalFilters['currency']; en: string }> = [
  { value: 'all', en: 'All currencies' },
  { value: 'SAR', en: 'SAR' },
  { value: 'USD', en: 'USD' },
  { value: 'EUR', en: 'EUR' },
  { value: 'GBP', en: 'GBP' },
  { value: 'AED', en: 'AED' },
];

function formatMoney(amount: number, currency: string, isRtl: boolean): string {
  try {
    return new Intl.NumberFormat(isRtl ? 'ar' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function hasActiveFilters(f: JournalFilters): boolean {
  return f.search.trim() !== '' || f.type !== 'all' || f.status !== 'all' || f.currency !== 'all';
}

function JournalsHeader({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  isRtl,
  t,
}: {
  filters: JournalFilters;
  onFiltersChange: (partial: Partial<JournalFilters>) => void;
  onClearFilters: () => void;
  resultCount: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}) {
  const uid = useId();
  const active = hasActiveFilters(filters);

  return (
    <header className="border-b border-border bg-card">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary" aria-hidden="true">
              <BookOpen className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('Journals', 'القيود المختلفة')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(
                  'Track entries, references, and posting statuses across your activity.',
                  'تتبع القيود والمراجع وحالات الترحيل عبر نشاطك.',
                )}
              </p>
            </div>
          </div>

          <Link href="/journals/create">
            <Button type="button" variant="outline" className="shrink-0 font-semibold">
              {t('Add entry', 'إضافة قيد')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1" role="search">
            <Search className={cn('pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
            <Input
              id={`${uid}-search`}
              type="search"
              placeholder={t('Search journals...', 'بحث في القيود...')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className={cn('h-9 bg-background', isRtl ? 'pr-9' : 'pl-9', filters.search && (isRtl ? 'pl-8' : 'pr-8'))}
              aria-label={t('Search journals', 'بحث في القيود')}
              aria-controls="journals-list"
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
                  className={cn('absolute top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground', isRtl ? 'left-2' : 'right-2')}
                  aria-label={t('Clear search', 'مسح البحث')}
                >
                  <X className="size-3.5" aria-hidden="true" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filters.type} onValueChange={(v) => onFiltersChange({ type: v as JournalFilters['type'] })}>
              <SelectTrigger id={`${uid}-type`} className="h-9 w-40 bg-background" aria-label={t('Filter by type', 'تصفية حسب النوع')}>
                <Filter className="me-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => onFiltersChange({ status: v as JournalFilters['status'] })}>
              <SelectTrigger id={`${uid}-status`} className="h-9 w-40 bg-background" aria-label={t('Filter by status', 'تصفية حسب الحالة')}>
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

            <Select value={filters.currency} onValueChange={(v) => onFiltersChange({ currency: v as JournalFilters['currency'] })}>
              <SelectTrigger id={`${uid}-currency`} className="h-9 w-32 bg-background" aria-label={t('Filter by currency', 'تصفية حسب العملة')}>
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
                <motion.div key="clear-btn" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}>
                  <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9 gap-1.5 text-muted-foreground hover:text-foreground" aria-label={t('Clear all filters', 'مسح كل المرشحات')}>
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
            <motion.p key="result-count" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
              {t(`${resultCount} entries found`, `تم العثور على ${resultCount} قيد`)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function JournalsStats({
  entries,
  t,
  isRtl,
}: {
  entries: JournalEntry[];
  t: (en: string, ar: string) => string;
  isRtl: boolean;
}) {
  if (entries.length === 0) return null;

  const posted = entries.filter((e) => (e.status ?? '').toString().toLowerCase() === 'posted').length;
  const pending = entries.filter((e) => (e.status ?? '').toString().toLowerCase() === 'pending').length;
  const reversed = entries.filter((e) => (e.status ?? '').toString().toLowerCase() === 'reversed').length;

  return (
    <div className="flex flex-wrap gap-2.5">
      {[
        { label: t('Total', 'إجمالي'), value: entries.length, className: 'border-primary/25 bg-primary/10 text-primary', Icon: BookOpen },
        { label: t('Posted', 'مُرحلة'), value: posted, className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300', Icon: CheckCircle2 },
        { label: t('Pending', 'قيد المعالجة'), value: pending, className: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300', Icon: Filter },
        { label: t('Reversed', 'مُرجعة'), value: reversed, className: 'border-border bg-muted/30 text-muted-foreground', Icon: X },
      ].map(({ label, value, className, Icon }) => (
        <motion.div key={label} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={cn('flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium', className)}>
          <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
          <span className="text-muted-foreground">{label}</span>
          <span className={cn('font-semibold', isRtl && 'tabular-nums')}>{value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function statusBadge(status: JournalEntryStatus) {
  const key = (status ?? '').toString().toLowerCase();
  if (key === 'posted') {
    return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
  }
  if (key === 'pending') {
    return 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300';
  }
  if (key === 'reversed') {
    return 'border-border bg-muted/30 text-muted-foreground';
  }
  return 'border-border bg-muted/30 text-muted-foreground';
}

function JournalsEmptyState({
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
          <BookOpen className="size-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{t('No results found', 'لم يتم العثور على نتائج')}</h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {t(`No journal entries matching "${searchQuery}" were found.`, `لم يتم العثور على قيود تطابق "${searchQuery}".`)}
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-full">
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-background to-muted/30 px-8 py-20 text-center">
        <div className="mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/15 bg-primary/8 text-primary/50">
          <BookOpen className="size-11" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-foreground">{t('No journal entries yet', 'لا توجد قيود بعد')}</h2>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t(
            'Journal entries will appear here once transactions and adjustments are posted.',
            'ستظهر القيود هنا بمجرد ترحيل المعاملات والتسويات.',
          )}
        </p>
        <Button size="lg" variant="outline" className="font-semibold" disabled>
          {t('Add entry', 'إضافة قيد')}
        </Button>
      </div>
    </motion.div>
  );
}

function JournalCard({
  entry,
  index,
  isRtl,
  t,
}: {
  entry: JournalEntry;
  index: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}) {
  const badgeClass = statusBadge(entry.status);
  const typeLabel = (entry.type ?? '').toString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 280, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:ring-1 hover:ring-primary/30"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 px-5 py-4">
        <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold leading-tight text-white">{entry.description}</h3>
            <p className="mt-0.5 truncate text-xs text-white/70">{entry.date}</p>
          </div>
          <span className={cn('flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm', badgeClass)}>
            {isRtl ? t(entry.status, entry.status) : entry.status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('Type', 'النوع')}</p>
            <p className="truncate text-sm font-medium text-foreground">{typeLabel || '—'}</p>
          </div>
          <div className="text-end">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('Amount', 'المبلغ')}</p>
            <p className="text-sm font-semibold text-primary">{formatMoney(entry.amount, entry.currency, isRtl)}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('Currency', 'العملة'), value: entry.currency || '—' },
            { label: t('Ref', 'مرجع'), value: entry.reference || '—' },
            { label: t('ID', 'معرّف'), value: entry.id },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="truncate font-mono text-xs font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Journals({ journals = [] }: { journals?: JournalEntry[] }) {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';

  const breadcrumbs: BreadcrumbItem[] = [{ title: t('journals.title', 'القيود المختلفة'), href: '/journals' }];

  const [filters, setFilters] = useState<JournalFilters>(INITIAL_FILTERS);

  const filteredJournals = useMemo(() => {
    return journals.filter((e) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          e.description.toLowerCase().includes(q) ||
          (e.reference ?? '').toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (filters.type !== 'all' && (e.type ?? '').toString().toLowerCase() !== filters.type) return false;
      if (filters.status !== 'all' && (e.status ?? '').toString().toLowerCase() !== filters.status) return false;
      if (filters.currency !== 'all' && (e.currency ?? '').toString().toUpperCase() !== filters.currency) return false;

      return true;
    });
  }, [filters, journals]);

  function handleFiltersChange(partial: Partial<JournalFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const active = hasActiveFilters(filters);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('journals.title', 'القيود المختلفة')} />

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <JournalsHeader
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          resultCount={filteredJournals.length}
          isRtl={isRtl}
          t={t}
        />

        <div className="flex flex-1 flex-col gap-6 p-6">
          {journals.length > 0 && <JournalsStats entries={journals} t={t} isRtl={isRtl} />}

          <div id="journals-list" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredJournals.map((entry, index) => (
                <JournalCard key={entry.id} entry={entry} index={index} isRtl={isRtl} t={t} />
              ))}
            </AnimatePresence>

            {filteredJournals.length === 0 && (
              <JournalsEmptyState
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

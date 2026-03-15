import { Head, Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, CalendarDays, CheckCircle2, Clock, CreditCard, Filter, Search, X } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type TransferStatus = 'submitted' | 'emailed' | 'email_failed' | string;

type Transfer = {
  id: string;
  bankAccount?: { bankName?: string; iban?: string; currency?: string };
  beneficiary?: { nameAr?: string; nameEn?: string; bankName?: string; iban?: string };
  amount: number;
  currency: string;
  transferDate?: string | null;
  referenceNumber: string;
  status: TransferStatus;
  createdAt?: string | null;
};

type PageProps = {
  transfers?: Transfer[];
};

type TransferFilters = {
  search: string;
  status: 'all' | 'submitted' | 'emailed' | 'email_failed';
};

const INITIAL_FILTERS: TransferFilters = {
  search: '',
  status: 'all',
};

const STATUS_OPTIONS: Array<{ value: TransferFilters['status']; en: string; ar: string }> = [
  { value: 'all', en: 'All statuses', ar: 'كل الحالات' },
  { value: 'submitted', en: 'Submitted', ar: 'مرسلة للنظام' },
  { value: 'emailed', en: 'Emailed', ar: 'تم الإرسال للبنك' },
  { value: 'email_failed', en: 'Email failed', ar: 'فشل الإرسال' },
];

function statusBadge(
  status: TransferStatus,
  t: (en: string, ar: string) => string,
  isRtl: boolean,
) {
  const key = (status ?? '').toString().toLowerCase();

  if (key === 'emailed') {
    return {
      label: isRtl ? t('Emailed', 'تم الإرسال للبنك') : t('Emailed', 'تم الإرسال للبنك'),
      className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      Icon: CheckCircle2,
    };
  }

  if (key === 'email_failed') {
    return {
      label: isRtl ? t('Email failed', 'فشل الإرسال') : t('Email failed', 'فشل الإرسال'),
      className: 'border-destructive/25 bg-destructive/10 text-destructive',
      Icon: X,
    };
  }

  return {
    label: isRtl ? t('Submitted', 'مرسلة للنظام') : t('Submitted', 'مرسلة للنظام'),
    className: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    Icon: Clock,
  };
}

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

export default function Transfers() {
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const uid = useId();

  const { transfers = [] } = usePage().props as unknown as PageProps;

  const breadcrumbs: BreadcrumbItem[] = [{ title: t('Transfers', 'التحويلات'), href: '/transfers' }];

  const [filters, setFilters] = useState<TransferFilters>(INITIAL_FILTERS);

  const filteredTransfers = useMemo(() => {
    return transfers.filter((tx) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          (tx.referenceNumber ?? '').toLowerCase().includes(q) ||
          (tx.beneficiary?.nameEn ?? '').toLowerCase().includes(q) ||
          (tx.beneficiary?.nameAr ?? '').includes(filters.search) ||
          (tx.bankAccount?.bankName ?? '').toLowerCase().includes(q) ||
          (tx.beneficiary?.bankName ?? '').toLowerCase().includes(q) ||
          (tx.currency ?? '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (filters.status !== 'all' && (tx.status ?? '').toString().toLowerCase() !== filters.status) return false;

      return true;
    });
  }, [filters, transfers]);

  const active = filters.search.trim() !== '' || filters.status !== 'all';

  function onFiltersChange(partial: Partial<TransferFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }));
  }

  function onClearFilters() {
    setFilters(INITIAL_FILTERS);
  }

  const emailed = transfers.filter((x) => (x.status ?? '').toString().toLowerCase() === 'emailed').length;
  const submitted = transfers.filter((x) => (x.status ?? '').toString().toLowerCase() === 'submitted').length;
  const failed = transfers.filter((x) => (x.status ?? '').toString().toLowerCase() === 'email_failed').length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={t('Transfers', 'التحويلات')} />

      <div className="flex h-full flex-1 flex-col overflow-x-auto">
        <header className="border-b border-border/60 bg-card/70 backdrop-blur-md">
          <div className="px-6 py-4">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary" aria-hidden="true">
                  <ArrowLeftRight className="size-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{t('Transfers', 'التحويلات')}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {t(
                      'Create transfer requests from your registered bank accounts to beneficiaries.',
                      'إنشاء طلبات تحويل من حساباتك البنكية المسجلة إلى المستفيدين.',
                    )}
                  </p>
                </div>
              </div>

              <Link href="/transfers/create">
                <Button className="shrink-0 gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <CreditCard className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} />
                  {t('Add New Transfer', 'إضافة تحويل جديد')}
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
                  placeholder={t('Search transfers...', 'بحث في التحويلات...')}
                  value={filters.search}
                  onChange={(e) => onFiltersChange({ search: e.target.value })}
                  className={cn('h-9 bg-background/60 backdrop-blur-sm', isRtl ? 'pr-9' : 'pl-9', filters.search && (isRtl ? 'pl-8' : 'pr-8'))}
                  aria-label={t('Search transfers', 'بحث في التحويلات')}
                  aria-controls="transfers-list"
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
                <Select value={filters.status} onValueChange={(v) => onFiltersChange({ status: v as TransferFilters['status'] })}>
                  <SelectTrigger id={`${uid}-status`} className="h-9 w-44 bg-background/60 backdrop-blur-sm" aria-label={t('Filter by status', 'تصفية حسب الحالة')}>
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
                  {t(`${filteredTransfers.length} transfers found`, `تم العثور على ${filteredTransfers.length} تحويل`)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {transfers.length > 0 && (
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: t('Total', 'إجمالي'), value: transfers.length, Icon: ArrowLeftRight, className: 'border-primary/25 bg-primary/10 text-primary' },
                { label: t('Emailed', 'تم الإرسال للبنك'), value: emailed, Icon: CheckCircle2, className: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' },
                { label: t('Submitted', 'مرسلة للنظام'), value: submitted, Icon: Clock, className: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300' },
                { label: t('Failed', 'فشل الإرسال'), value: failed, Icon: X, className: 'border-destructive/25 bg-destructive/10 text-destructive' },
              ].map(({ label, value, Icon, className }) => (
                <motion.div key={label} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className={cn('flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium', className)}>
                  <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold">{value}</span>
                </motion.div>
              ))}
            </div>
          )}

          <div id="transfers-list" className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredTransfers.map((tx, index) => {
                const badge = statusBadge(tx.status, t, isRtl);
                const title = tx.beneficiary?.nameAr || tx.beneficiary?.nameEn || t('Beneficiary', 'المستفيد');
                const bank = tx.bankAccount?.bankName || t('Bank account', 'الحساب البنكي');
                const date = tx.transferDate || tx.createdAt || '';

                return (
                  <motion.div
                    key={tx.id}
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
                          <p className="mt-0.5 truncate text-xs text-white/70">{tx.referenceNumber}</p>
                        </div>

                        <span className={cn('flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm', badge.className)}>
                          <badge.Icon className="size-3" aria-hidden="true" />
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('From', 'من')}</p>
                          <p className="truncate text-sm font-medium text-foreground">{bank}</p>
                        </div>
                        <div className="text-end">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('Amount', 'المبلغ')}</p>
                          <p className="text-sm font-semibold text-primary">{formatMoney(tx.amount, tx.currency, isRtl)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: t('Currency', 'العملة'), value: tx.currency || '—' },
                          { label: t('Date', 'التاريخ'), value: date ? date.toString().slice(0, 10) : '—', Icon: CalendarDays },
                          { label: t('Status', 'الحالة'), value: (tx.status ?? '—').toString(), Icon: undefined },
                        ].map(({ label, value, Icon }) => (
                          <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
                            <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {Icon && <Icon className="size-3.5" aria-hidden="true" />}
                              {label}
                            </p>
                            <p className="truncate font-mono text-xs font-semibold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border px-4 py-3">
                      <Link href={`/transfers/${tx.id}`}>
                        <Button size="sm" variant="ghost" className="h-8 rounded-lg px-3 text-xs text-muted-foreground hover:text-primary">
                          {t('Open', 'فتح')}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredTransfers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-8 py-16 text-center"
              >
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
                  <ArrowLeftRight className="size-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {active ? t('No results found', 'لم يتم العثور على نتائج') : t('No transfers yet', 'لا توجد تحويلات بعد')}
                </h3>
                <p className="mb-6 max-w-xs text-sm text-muted-foreground">
                  {active
                    ? t('Try adjusting your filters to find what you need.', 'جرّب تعديل المرشحات للعثور على ما تحتاجه.')
                    : t('Create your first transfer request to get started.', 'أنشئ أول طلب تحويل للبدء.')}
                </p>
                <Link href="/transfers/create">
                  <Button className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                    <CreditCard className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} />
                    {t('Add New Transfer', 'إضافة تحويل جديد')}
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

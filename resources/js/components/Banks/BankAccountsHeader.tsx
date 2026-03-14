'use client';

import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Filter, Plus, Search, X } from 'lucide-react';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AccountCategory, BankAccountFilters, CurrencyCode } from './types';

const CATEGORY_OPTIONS = [
  { value: 'all', labelEn: 'All Categories', labelAr: 'جميع التصنيفات' },
  { value: 'personal', labelEn: 'Personal', labelAr: 'شخصي' },
  { value: 'business', labelEn: 'Business', labelAr: 'تجاري' },
] as const;

const CURRENCY_OPTIONS = [
  { value: 'all', labelEn: 'All Currencies' },
  { value: 'SAR', labelEn: 'SAR' },
  { value: 'USD', labelEn: 'USD' },
  { value: 'EUR', labelEn: 'EUR' },
  { value: 'GBP', labelEn: 'GBP' },
  { value: 'AED', labelEn: 'AED' },
] as const;

function hasActiveFilters(f: BankAccountFilters) {
  return f.search.trim() !== '' || f.category !== 'all' || f.currency !== 'all';
}

export interface BankAccountsHeaderProps {
  filters: BankAccountFilters;
  onFiltersChange: (filters: Partial<BankAccountFilters>) => void;
  onClearFilters: () => void;
  resultCount: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}

export function BankAccountsHeader({ filters, onFiltersChange, onClearFilters, resultCount, isRtl, t }: BankAccountsHeaderProps) {
  const uid = useId();
  const active = hasActiveFilters(filters);

  return (
    <header className="border-b border-border/60 backdrop-blur-md bg-card/70">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary" aria-hidden="true">
              <CreditCard className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t('Bank Accounts', 'الحسابات البنكية')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t('Manage your bank accounts for transfers and payouts.', 'إدارة حساباتك البنكية لتسهيل عمليات التحويل والمدفوعات.')}
              </p>
            </div>
          </div>
          <Link href="/bank-accounts/create">
            <Button className="shrink-0 gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg" aria-label={t('Add new bank account', 'إضافة حساب بنكي جديد')}>
              <Plus className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} aria-hidden="true" />
              {t('Add new account', 'إضافة حساب جديد')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1" role="search">
            <Search className={cn('pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
            <Input
              id={`${uid}-search`}
              type="search"
              placeholder={t('Search accounts...', 'بحث عن حسابات...')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className={cn('h-9 bg-background/60 backdrop-blur-sm', isRtl ? 'pr-9' : 'pl-9', filters.search && (isRtl ? 'pl-8' : 'pr-8'))}
              aria-label={t('Search bank accounts', 'بحث في الحسابات البنكية')}
              aria-controls="accounts-list"
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

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Select value={filters.category} onValueChange={(v) => onFiltersChange({ category: v as AccountCategory | 'all' })}>
              <SelectTrigger id={`${uid}-category`} className="h-9 w-44 bg-background/60 backdrop-blur-sm" aria-label={t('Filter by category', 'تصفية حسب الفئة')}>
                <Filter className="me-2 size-3.5 text-muted-foreground" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{isRtl ? opt.labelAr : opt.labelEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.currency} onValueChange={(v) => onFiltersChange({ currency: v as CurrencyCode | 'all' })}>
              <SelectTrigger id={`${uid}-currency`} className="h-9 w-32 bg-background/60 backdrop-blur-sm" aria-label={t('Filter by currency', 'تصفية حسب العملة')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.labelEn}</SelectItem>
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
              {t(`${resultCount} accounts found`, `تم العثور على ${resultCount} حساب`)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
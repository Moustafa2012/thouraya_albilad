import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Filter, Plus, Search, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { AccountType, BeneficiaryCategory, BeneficiaryFilters, CountryCode } from './types';

interface BeneficiariesHeaderProps {
  filters: BeneficiaryFilters;
  onFiltersChange: (partial: Partial<BeneficiaryFilters>) => void;
  onClearFilters: () => void;
  resultCount: number;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
}

const CATEGORY_OPTIONS: { value: BeneficiaryCategory | 'all'; en: string; ar: string }[] = [
  { value: 'all',         en: 'All Categories', ar: 'جميع التصنيفات' },
  { value: 'suppliers',   en: 'Suppliers',       ar: 'موردين'         },
  { value: 'employees',   en: 'Employees',       ar: 'موظفين'         },
  { value: 'partners',    en: 'Partners',        ar: 'شركاء'          },
  { value: 'contractors', en: 'Contractors',     ar: 'متعاقدين'       },
  { value: 'other',       en: 'Other',           ar: 'أخرى'           },
];

const ACCOUNT_TYPE_OPTIONS: { value: AccountType | 'all'; en: string; ar: string }[] = [
  { value: 'all',        en: 'All Types',   ar: 'جميع الأنواع' },
  { value: 'individual', en: 'Individual',  ar: 'أفراد'         },
  { value: 'business',   en: 'Business',    ar: 'شركات'         },
];

function hasActiveFilters(filters: BeneficiaryFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.category !== 'all' ||
    filters.accountType !== 'all'
  );
}

export function BeneficiariesHeader({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount,
  isRtl,
  t,
}: BeneficiariesHeaderProps) {
  const active = hasActiveFilters(filters);

  return (
    <div className="border-b border-border bg-card">
      <div className="px-6 py-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-primary/40 bg-primary/15 text-primary">
              <Users className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t('Beneficiaries', 'المستفيدون')}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(
                  'Manage your beneficiaries list for faster transfers.',
                  'إدارة قائمة المستفيدين لتسريع عمليات التحويل.',
                )}
              </p>
            </div>
          </div>

          <Link href="/beneficiaries/create">
            <Button className="shrink-0 gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
              <Plus className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} />
              {t('Add beneficiary', 'إضافة مستفيد')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className={cn(
                'absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
                isRtl ? 'right-3' : 'left-3',
              )}
            />
            <Input
              placeholder={t('Search beneficiaries...', 'بحث عن مستفيدين...')}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className={cn('h-9 bg-background', isRtl ? 'pr-9' : 'pl-9')}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFiltersChange({ search: '' })}
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground',
                  isRtl ? 'left-2' : 'right-2',
                )}
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filters.category}
              onValueChange={(v) => onFiltersChange({ category: v as BeneficiaryCategory | 'all' })}
            >
              <SelectTrigger className="h-9 w-44 bg-background">
                <Filter className="me-2 size-3.5 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.accountType}
              onValueChange={(v) => onFiltersChange({ accountType: v as AccountType | 'all' })}
            >
              <SelectTrigger className="h-9 w-36 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNT_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.ar : opt.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {active && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
                {t('Clear', 'مسح')}
              </Button>
            )}
          </div>
        </div>

        {active && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-xs text-muted-foreground"
          >
            {t(`${resultCount} beneficiaries found`, `تم العثور على ${resultCount} مستفيد`)}
          </motion.p>
        )}
      </div>
    </div>
  );
}
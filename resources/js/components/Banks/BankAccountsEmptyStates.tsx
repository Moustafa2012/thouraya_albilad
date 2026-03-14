'use client';

import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FEATURES = [
  { en: 'Secure storage for your banking details', ar: 'تخزين آمن لبياناتك المصرفية', icon: ShieldCheck },
  { en: 'Multiple accounts & currencies', ar: 'حسابات وعملات متعددة', icon: CreditCard },
  { en: 'International transfers made easy', ar: 'تحويلات دولية بكل سهولة', icon: Building2 },
];

export interface BankAccountsEmptyStateProps {
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  hasSearch?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function BankAccountsEmptyState({ isRtl, t, hasSearch = false, searchQuery = '', onClearSearch }: BankAccountsEmptyStateProps) {
  if (hasSearch && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full flex flex-col items-center justify-center rounded-2xl px-8 py-16 text-center border-2 border-dashed border-border/60 bg-card/40 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-card/60 text-muted-foreground" aria-hidden="true">
          <Building2 className="size-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">{t('No results found', 'لم يتم العثور على نتائج')}</h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {t(`No accounts matching "${searchQuery}" were found.`, `لم يتم العثور على حسابات تطابق "${searchQuery}".`)}
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-full" role="status">
      <div className="flex flex-col items-center justify-center rounded-2xl px-8 py-20 text-center border-2 border-dashed border-primary/20 bg-gradient-to-br from-background/80 to-muted/20 backdrop-blur-sm">
        <div className="mb-6 flex size-24 items-center justify-center rounded-3xl border border-primary/15 bg-primary/[0.06] text-primary/50" aria-hidden="true">
          <CreditCard className="size-11" />
        </div>
        <h2 className="mb-3 text-2xl font-bold">{t('No bank accounts yet', 'لا توجد حسابات بنكية')}</h2>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t('Add your first bank account to start managing transfers, payouts, and payments seamlessly.', 'أضف حسابك البنكي الأول لبدء إدارة التحويلات والمدفوعات بسهولة.')}
        </p>
        <ul className="mb-8 flex flex-col items-start gap-3 rounded-xl px-6 py-4 text-start border border-border/60 bg-card/50 backdrop-blur-sm" aria-label={t('Features', 'المزايا')}>
          {FEATURES.map(({ en, ar, icon: Icon }) => (
            <li key={en} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary" aria-hidden="true">
                <Icon className="size-3.5" />
              </span>
              <span className="text-sm text-muted-foreground">{t(en, ar)}</span>
            </li>
          ))}
        </ul>
        <Link href="/bank-accounts/create">
          <Button size="lg" className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
            <Plus className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} aria-hidden="true" />
            {t('Add your first account', 'أضف حسابك الأول')}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
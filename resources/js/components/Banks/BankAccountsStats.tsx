'use client';

import { motion } from 'framer-motion';
import { CreditCard, Globe, ShieldCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BankAccount, BankAccountStats } from './types';

function computeStats(accounts: BankAccount[]): BankAccountStats {
  return {
    total: accounts.length,
    active: accounts.filter((a) => a.isActive).length,
    hasDefault: accounts.some((a) => a.isDefault),
    byCategory: accounts.reduce((acc, a) => ({ ...acc, [a.accountCategory]: (acc[a.accountCategory] ?? 0) + 1 }), {} as BankAccountStats['byCategory']),
    byCurrency: accounts.reduce((acc, a) => ({ ...acc, [a.currency]: (acc[a.currency] ?? 0) + 1 }), {} as BankAccountStats['byCurrency']),
  };
}

function StatChip({ icon: Icon, label, value, highlight, index = 0 }: { icon: React.ElementType; label: string; value: string | number; highlight?: boolean; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors',
        highlight ? 'border-primary/25 bg-primary/[0.08] text-primary' : 'border-border/60 bg-card/60 text-foreground',
      )}
    >
      <Icon className="size-4 shrink-0 opacity-70" aria-hidden="true" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </motion.div>
  );
}

export interface BankAccountsStatsProps {
  accounts: BankAccount[];
  t: (en: string, ar: string) => string;
}

export function BankAccountsStats({ accounts, t }: BankAccountsStatsProps) {
  if (!accounts.length) return null;
  const stats = computeStats(accounts);
  const topCurrencies = Object.entries(stats.byCurrency).sort(([, a], [, b]) => b - a).slice(0, 3).map(([c]) => c).join(' · ');

  return (
    <div className="flex flex-wrap gap-2.5" role="region" aria-label={t('Account statistics', 'إحصائيات الحسابات')} aria-live="polite">
      <StatChip icon={CreditCard} label={t('Total', 'إجمالي')} value={stats.total} highlight index={0} />
      <StatChip icon={TrendingUp} label={t('Active', 'نشط')} value={stats.active} index={1} />
      {stats.hasDefault && <StatChip icon={ShieldCheck} label={t('Default set', 'الافتراضي محدد')} value="✓" highlight index={2} />}
      {topCurrencies && <StatChip icon={Globe} label={t('Currencies', 'العملات')} value={topCurrencies} index={3} />}
    </div>
  );
}
import { motion } from 'framer-motion';
import { Briefcase, Globe, Tag, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Beneficiary, BeneficiaryStats } from './types';

interface BeneficiariesStatsProps {
  beneficiaries: Beneficiary[];
  t: (en: string, ar: string) => string;
  isRtl: boolean;
}

function computeStats(beneficiaries: Beneficiary[]): BeneficiaryStats {
  return {
    total: beneficiaries.length,
    individuals: beneficiaries.filter((b) => b.accountType === 'individual').length,
    businesses: beneficiaries.filter((b) => b.accountType === 'business').length,
    byCategory: beneficiaries.reduce(
      (acc, b) => {
        acc[b.category] = (acc[b.category] ?? 0) + 1;
        return acc;
      },
      {} as BeneficiaryStats['byCategory'],
    ),
    byCountry: beneficiaries.reduce(
      (acc, b) => {
        acc[b.country] = (acc[b.country] ?? 0) + 1;
        return acc;
      },
      {} as BeneficiaryStats['byCountry'],
    ),
  };
}

interface ChipProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  highlight?: boolean;
}

function Chip({ icon: Icon, label, value, highlight }: ChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium',
        highlight
          ? 'border-primary/25 bg-primary/10 text-primary'
          : 'border-border bg-card text-foreground',
      )}
    >
      <Icon className="size-4 shrink-0 opacity-70" />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </motion.div>
  );
}

export function BeneficiariesStats({ beneficiaries, t, isRtl }: BeneficiariesStatsProps) {
  if (beneficiaries.length === 0) return null;

  const stats = computeStats(beneficiaries);
  const topCountries = Object.entries(stats.byCountry)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([code]) => code)
    .join(' · ');

  const topCategory = Object.entries(stats.byCategory).sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="flex flex-wrap gap-2.5">
      <Chip icon={Users}   label={t('Total', 'إجمالي')}      value={stats.total}       highlight />
      <Chip icon={User}    label={t('Individuals', 'أفراد')}  value={stats.individuals} />
      <Chip icon={Briefcase} label={t('Businesses', 'شركات')} value={stats.businesses} />
      {topCategory && (
        <Chip
          icon={Tag}
          label={t('Top category', 'الفئة الأكثر')}
          value={topCategory[0]}
        />
      )}
      {topCountries && (
        <Chip icon={Globe} label={t('Countries', 'الدول')} value={topCountries} />
      )}
    </div>
  );
}
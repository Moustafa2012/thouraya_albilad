import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, CreditCard, Plus, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BeneficiariesEmptyStateProps {
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  hasSearch?: boolean;
  searchQuery?: string;
  onClearSearch?: () => void;
}

const FEATURES = [
  { en: 'Faster recurring transfers', ar: 'تحويلات متكررة أسرع', icon: CreditCard },
  { en: 'Verified business & individual payees', ar: 'مستفيدون معتمدون من الأفراد والشركات', icon: UserCheck },
  { en: 'Supports 13+ countries & currencies', ar: 'يدعم أكثر من 13 دولة وعملة', icon: Building2 },
];

export function BeneficiariesEmptyState({
  isRtl,
  t,
  hasSearch = false,
  searchQuery = '',
  onClearSearch,
}: BeneficiariesEmptyStateProps) {
  if (hasSearch && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-8 py-16 text-center"
      >
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
          <Users className="size-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t('No results found', 'لم يتم العثور على نتائج')}
        </h3>
        <p className="mb-6 max-w-xs text-sm text-muted-foreground">
          {t(
            `No beneficiaries matching "${searchQuery}" were found.`,
            `لم يتم العثور على مستفيدين يطابقون "${searchQuery}".`,
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
          <Users className="size-11" />
        </div>

        <h2 className="mb-3 text-2xl font-bold text-foreground">
          {t('No beneficiaries yet', 'لا يوجد مستفيدون')}
        </h2>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t(
            'Add your first beneficiary to speed up transfers and simplify recurring payouts.',
            'أضف أول مستفيد لديك لتسريع التحويلات وتبسيط المدفوعات المتكررة.',
          )}
        </p>

        <div className="mb-8 flex flex-col items-start gap-3 rounded-xl border border-border bg-card px-6 py-4 text-start">
          {FEATURES.map(({ en, ar, icon: Icon }) => (
            <div key={en} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-3.5" />
              </span>
              <span className="text-sm text-muted-foreground">{t(en, ar)}</span>
            </div>
          ))}
        </div>

        <Link href="/beneficiaries/create">
          <Button
            size="lg"
            className="gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <Plus className={cn('size-4', isRtl ? 'ms-1' : 'me-1')} />
            {t('Add your first beneficiary', 'أضف أول مستفيد')}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
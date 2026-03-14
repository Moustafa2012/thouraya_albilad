import { motion } from 'framer-motion';
import {
  Building2, Check, Copy, Globe, Pencil, Tag, Trash2, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Beneficiary, BeneficiaryCategory, CATEGORY_CONFIG } from './types';

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  index: number;
  isCopied: boolean;
  onDelete: (id: string) => void;
  onEdit: (beneficiary: Beneficiary) => void;
  onCopy: (text: string, id: string) => void;
  t: (en: string, ar: string) => string;
  isRtl: boolean;
}

const CATEGORY_COLORS: Record<BeneficiaryCategory, string> = {
  suppliers:   'bg-blue-500/10 text-blue-600 border-blue-200',
  employees:   'bg-green-500/10 text-green-600 border-green-200',
  partners:    'bg-violet-500/10 text-violet-600 border-violet-200',
  contractors: 'bg-orange-500/10 text-orange-600 border-orange-200',
  other:       'bg-gray-500/10 text-gray-600 border-gray-200',
};

const CATEGORY_LABELS: Record<BeneficiaryCategory, { en: string; ar: string }> = {
  suppliers:   { en: 'Suppliers',   ar: 'موردين'   },
  employees:   { en: 'Employees',   ar: 'موظفين'   },
  partners:    { en: 'Partners',    ar: 'شركاء'    },
  contractors: { en: 'Contractors', ar: 'متعاقدين' },
  other:       { en: 'Other',       ar: 'أخرى'     },
};

function maskIban(iban: string): string {
  if (iban.length <= 8) return iban;
  return `${iban.slice(0, 4)} •••• •••• ${iban.slice(-4)}`;
}

export function BeneficiaryCard({
  beneficiary,
  index,
  isCopied,
  onDelete,
  onEdit,
  onCopy,
  t,
  isRtl,
}: BeneficiaryCardProps) {
  const catLabel = CATEGORY_LABELS[beneficiary.category];
  const catColor = CATEGORY_COLORS[beneficiary.category] ?? CATEGORY_COLORS.other;

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
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15">
              {beneficiary.accountType === 'business'
                ? <Building2 className="size-5 text-white" />
                : <User className="size-5 text-white" />}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-bold leading-tight text-white">{beneficiary.nameAr}</h3>
              <p className="mt-0.5 truncate text-xs text-white/70">{beneficiary.nameEn}</p>
            </div>
          </div>

          <span
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-sm',
              catColor,
            )}
          >
            <Tag className="size-2.5" />
            {isRtl ? catLabel.ar : catLabel.en}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Bank', 'البنك')}
            </p>
            <p className="truncate text-sm font-medium text-foreground">{beneficiary.bankName}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t('Country', 'الدولة')}
            </p>
            <p className="flex items-center gap-1 text-sm font-medium text-foreground">
              <Globe className="size-3.5 text-muted-foreground" />
              {beneficiary.country}
            </p>
          </div>
        </div>

        {beneficiary.iban && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                IBAN
              </span>
              <button
                type="button"
                onClick={() => onCopy(beneficiary.iban, `iban-${beneficiary.id}`)}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                aria-label="Copy IBAN"
              >
                {isCopied
                  ? <Check className="size-3.5 text-primary" />
                  : <Copy className="size-3.5" />}
                {isCopied ? t('Copied!', 'تم النسخ!') : t('Copy', 'نسخ')}
              </button>
            </div>
            <p className="font-mono text-sm font-medium tracking-wider text-foreground">
              {maskIban(beneficiary.iban)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'SWIFT', value: beneficiary.swiftCode },
            { label: t('Currency', 'العملة'), value: beneficiary.currency },
            { label: t('Acc #', 'رقم'), value: beneficiary.accountNumber },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </p>
              <p className="truncate font-mono text-xs font-semibold text-primary">{value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(beneficiary)}
            className="h-8 gap-1.5 rounded-lg px-3 text-xs text-muted-foreground hover:text-primary"
          >
            <Pencil className="size-3.5" />
            {t('Edit', 'تعديل')}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(beneficiary.id)}
            className="h-8 gap-1.5 rounded-lg px-3 text-xs text-destructive hover:bg-destructive/8"
          >
            <Trash2 className="size-3.5" />
            {t('Delete', 'حذف')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
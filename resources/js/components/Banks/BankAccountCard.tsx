'use client';

import { motion } from 'framer-motion';
import { Building2, Check, Copy, Pencil, ShieldCheck, Star, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { BankAccount } from './types';

const CATEGORY_CONFIG: Record<string, { gradient: string; icon: React.ElementType; labelEn: string; labelAr: string }> = {
  personal: { gradient: 'from-primary to-primary/80', icon: User, labelEn: 'Personal', labelAr: 'شخصي' },
  business: { gradient: 'from-emerald-600 to-emerald-500', icon: Building2, labelEn: 'Business', labelAr: 'تجاري' },
};

function formatBalance(value: number | null | undefined) {
  const amount = Number(value ?? 0);
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

function maskIban(iban: string) {
  return iban.length <= 8 ? iban : `${iban.slice(0, 4)} •••• •••• ${iban.slice(-4)}`;
}

export interface BankAccountCardProps {
  account: BankAccount;
  index: number;
  isIbanRevealed: boolean;
  isCopied: boolean;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onToggleIban: (id: string) => void;
  onCopy: (text: string, id: string) => void;
  onEdit: (account: BankAccount) => void;
  t: (en: string, ar: string) => string;
  isRtl: boolean;
}

export function BankAccountCard({
  account, index, isIbanRevealed, isCopied, onDelete, onSetDefault, onToggleIban, onCopy, onEdit, t, isRtl,
}: BankAccountCardProps) {
  const config = CATEGORY_CONFIG[account.accountCategory] ?? CATEGORY_CONFIG.personal;
  const CategoryIcon = config.icon;

  const balanceText = `${formatBalance(account.balance)} ${account.currency}`;

  const infoChips = [
    { label: 'SWIFT', value: account.swiftCode },
    { label: t('Balance', 'الرصيد'), value: balanceText },
    { label: t('Currency', 'العملة'), value: account.currency },
    ...(account.iban ? [] : [{ label: t('Acc #', 'رقم'), value: account.accountNumber }]),
  ].filter((c) => c.value);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 280, damping: 24 }}
      aria-label={[account.holderNameEn, account.accountType, account.currency, account.isDefault ? t('Default account', 'الحساب الافتراضي') : '', !account.isActive ? t('Inactive', 'غير نشط') : ''].filter(Boolean).join(', ')}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300',
        'backdrop-blur-sm bg-card/80 border border-border/60',
        account.isDefault ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : 'shadow-sm hover:shadow-md hover:ring-1 hover:ring-primary/30',
      )}
    >
      {/* Header */}
      <div className={cn('relative overflow-hidden bg-gradient-to-r px-5 py-4', config.gradient)}>
        <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/15" aria-hidden="true">
              <CategoryIcon className="size-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-bold leading-tight text-white">{account.bankName}</h3>
              {account.branchName && <p className="mt-0.5 truncate text-xs text-white/70">{account.branchName}</p>}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1" role="group" aria-label={t('Account status', 'حالة الحساب')}>
            <span className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90" role="status">
              {isRtl ? config.labelAr : config.labelEn}
            </span>
            {!account.isActive && (
              <span className="rounded-full border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80" role="status">
                {t('Inactive', 'غير نشط')}
              </span>
            )}
            {account.isDefault && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white"
                role="status"
              >
                <Star className="size-3 fill-current" aria-hidden="true" />
                {t('Default', 'افتراضي')}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('Account holder', 'صاحب الحساب')}</p>
            <p className="truncate text-sm font-semibold text-foreground">{account.holderNameAr}</p>
            <p className="truncate text-xs text-muted-foreground">{account.holderNameEn}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('Account type', 'نوع الحساب')}</p>
            <p className="text-sm font-medium capitalize text-foreground">{account.accountType}</p>
          </div>
        </div>

        {account.iban && (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">IBAN</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onToggleIban(account.id)}
                  className="rounded px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  aria-pressed={isIbanRevealed}
                  aria-label={isIbanRevealed ? t('Hide IBAN', 'إخفاء IBAN') : t('Show IBAN', 'إظهار IBAN')}
                >
                  {isIbanRevealed ? t('Hide', 'إخفاء') : t('Show', 'إظهار')}
                </button>
                <button
                  type="button"
                  onClick={() => onCopy(account.iban, `iban-${account.id}`)}
                  className="rounded p-1 transition-colors hover:bg-foreground/5"
                  aria-label={isCopied ? t('IBAN copied', 'تم نسخ IBAN') : t('Copy IBAN', 'نسخ IBAN')}
                >
                  {isCopied ? <Check className="size-3.5 text-primary" aria-hidden="true" /> : <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />}
                </button>
              </div>
            </div>
            <p className="font-mono text-sm font-medium tracking-wider text-foreground" aria-label={isIbanRevealed ? `IBAN: ${account.iban}` : t('IBAN hidden', 'IBAN مخفي')}>
              {isIbanRevealed ? account.iban : maskIban(account.iban)}
            </p>
          </div>
        )}

        <dl className={cn('grid gap-2', infoChips.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
          {infoChips.map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-muted/40 px-3 py-2.5">
              <dt className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
              <dd className="truncate font-mono text-xs font-semibold text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(account)} className="h-8 gap-1.5 rounded-lg px-3 text-xs text-muted-foreground hover:text-primary" aria-label={t(`Edit account ${account.bankName}`, `تعديل حساب ${account.bankName}`)}>
            <Pencil className="size-3.5" aria-hidden="true" />
            {t('Edit', 'تعديل')}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(account.id)} className="h-8 gap-1.5 rounded-lg px-3 text-xs text-destructive hover:bg-destructive/8" aria-label={t(`Delete account ${account.bankName}`, `حذف حساب ${account.bankName}`)}>
            <Trash2 className="size-3.5" aria-hidden="true" />
            {t('Delete', 'حذف')}
          </Button>
        </div>
        {!account.isDefault ? (
          <Button size="sm" variant="outline" onClick={() => onSetDefault(account.id)} className="h-8 gap-1.5 rounded-lg border-primary/30 px-3 text-xs font-medium text-primary hover:border-primary hover:scale-[1.02]" aria-label={t(`Set ${account.bankName} as default account`, `تعيين ${account.bankName} كحساب افتراضي`)}>
            <Star className="size-3.5" aria-hidden="true" />
            {t('Set default', 'تعيين كافتراضي')}
          </Button>
        ) : (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {t('Default', 'افتراضي')}
          </span>
        )}
      </div>
    </motion.article>
  );
}

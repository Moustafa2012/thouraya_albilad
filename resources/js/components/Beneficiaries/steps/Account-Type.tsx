import { motion } from 'framer-motion';
import { Briefcase, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccountType, CommonBeneficiaryStepProps } from '../types';

const ACCOUNT_TYPES: {
  value: AccountType;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: React.ElementType;
  color: string;
  ring: string;
}[] = [
  {
    value: 'individual',
    labelEn: 'Individual',
    labelAr: 'فرد',
    descriptionEn: 'A person — requires National ID or Passport number.',
    descriptionAr: 'شخص طبيعي — يتطلب هوية وطنية أو جواز سفر.',
    icon: User,
    color: 'bg-primary/10 text-primary border-primary/20',
    ring: 'ring-primary',
  },
  {
    value: 'business',
    labelEn: 'Business',
    labelAr: 'شركة',
    descriptionEn: 'A company or organization — requires commercial registration.',
    descriptionAr: 'شركة أو منظمة — يتطلب سجل تجاري.',
    icon: Briefcase,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    ring: 'ring-blue-500',
  },
];

export function StepAccountType({ formData, errors, isRtl, t, set }: CommonBeneficiaryStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Users className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Account Type', 'نوع الحساب')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Is this beneficiary an individual or a business?', 'هل المستفيد فرد أم شركة؟')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ACCOUNT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.accountType === type.value;

          return (
            <motion.button
              key={type.value}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => set('accountType', type.value)}
              className={cn(
                'relative flex flex-col items-center gap-4 rounded-2xl border-2 p-8 text-center transition-all duration-200',
                isSelected
                  ? `border-primary bg-primary/5 ring-2 ${type.ring} ring-offset-2`
                  : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30',
              )}
            >
              <span
                className={cn(
                  'flex size-14 items-center justify-center rounded-2xl border',
                  type.color,
                )}
              >
                <Icon className="size-7" />
              </span>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {isRtl ? type.labelAr : type.labelEn}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {isRtl ? type.descriptionAr : type.descriptionEn}
                </p>
              </div>
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-white"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {errors.accountType && (
        <p className="text-sm text-destructive">{errors.accountType}</p>
      )}
    </div>
  );
}
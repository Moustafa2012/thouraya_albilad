import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Briefcase, Hash, Info, User, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { CommonBeneficiaryStepProps } from '../types';

interface FieldProps {
  label: string;
  labelAr: string;
  error?: string;
  hint?: string;
  required?: boolean;
  isRtl: boolean;
  children: React.ReactNode;
}

function Field({ label, labelAr, error, hint, required, isRtl, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {isRtl ? labelAr : label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-xs font-medium text-destructive"
          >
            <AlertCircle className="size-3 shrink-0" />
            {error}
          </motion.p>
        ) : hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
          >
            <Info className="mt-0.5 size-3 shrink-0" />
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const inputClass = 'h-10 bg-background text-sm';

export function StepBasicInfo({ formData, errors, isRtl, t, set }: CommonBeneficiaryStepProps) {
  const isIndividual = formData.accountType === 'individual';
  const isBusiness = formData.accountType === 'business';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <User className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Basic Information', 'البيانات الأساسية')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Enter the beneficiary\'s identity details.', 'أدخل بيانات هوية المستفيد.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Name (Optional Arabic)"
          labelAr="الاسم (اختياري بالعربية)"
          error={errors.nameAr}
          isRtl={isRtl}
        >
          <div className="relative">
            <User className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.nameAr}
              onChange={(e) => set('nameAr', e.target.value)}
              placeholder={t('Optional', 'اختياري')}
              dir={isRtl ? 'rtl' : 'ltr'}
              className={cn(inputClass, isRtl ? 'pr-9' : 'pl-9', errors.nameAr && 'border-destructive')}
            />
          </div>
        </Field>

        <Field
          label="Beneficiary Name"
          labelAr="اسم المستفيد"
          error={errors.nameEn}
          required
          isRtl={isRtl}
        >
          <div className="relative">
            <UserCheck className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.nameEn}
              onChange={(e) => {
                const next = e.target.value;
                set('nameEn', next);
                if (!formData.nameAr.trim()) {
                  set('nameAr', next);
                }
              }}
              placeholder={t('e.g. Yıldız Makina Sanayi A.Ş.', 'مثال: Yıldız Makina Sanayi A.Ş.')}
              dir="ltr"
              className={cn(inputClass, isRtl ? 'pr-9' : 'pl-9', errors.nameEn && 'border-destructive')}
            />
          </div>
        </Field>
      </div>

      {isIndividual && (
        <Field
          label="National ID"
          labelAr="رقم الهوية الوطنية"
          error={errors.nationalId}
          hint={t('10-digit Saudi National ID number', 'رقم الهوية الوطنية السعودية من 10 أرقام')}
          required
          isRtl={isRtl}
        >
          <div className="relative">
            <Hash className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.nationalId ?? ''}
              onChange={(e) => set('nationalId', e.target.value.replace(/\D/g, ''))}
              placeholder="1234567890"
              dir="ltr"
              maxLength={10}
              className={cn(inputClass, 'font-mono', isRtl ? 'pr-9' : 'pl-9', errors.nationalId && 'border-destructive')}
            />
          </div>
        </Field>
      )}

      {isBusiness && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Business Registration"
            labelAr="السجل التجاري"
            error={errors.businessRegistration}
            required
            isRtl={isRtl}
          >
            <div className="relative">
              <Briefcase className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
              <Input
                value={formData.businessRegistration ?? ''}
                onChange={(e) => set('businessRegistration', e.target.value)}
                placeholder="1010XXXXXX"
                className={cn(inputClass, isRtl ? 'pr-9' : 'pl-9', errors.businessRegistration && 'border-destructive')}
              />
            </div>
          </Field>

          <Field
            label="Tax ID"
            labelAr="الرقم الضريبي"
            error={errors.taxId}
            hint={t('Optional', 'اختياري')}
            isRtl={isRtl}
          >
            <Input
              value={formData.taxId ?? ''}
              onChange={(e) => set('taxId', e.target.value)}
              placeholder="300XXXXXXXXX003"
              className={cn(inputClass, errors.taxId && 'border-destructive')}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Building2, Globe, Hash, Info, Lock, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { normalizeIBAN } from '@/types/Banking shared.types';
import type { CommonBeneficiaryStepProps, CountryCode, CurrencyCode } from '../types';

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

const COUNTRY_OPTIONS: { value: CountryCode; en: string; ar: string; flag: string }[] = [
  { value: 'SA', en: 'Saudi Arabia', ar: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { value: 'TR', en: 'Turkey', ar: 'تركيا', flag: '🇹🇷' },
  { value: 'AE', en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { value: 'US', en: 'United States', ar: 'الولايات المتحدة الأمريكية', flag: '🇺🇸' },
  { value: 'GB', en: 'United Kingdom', ar: 'المملكة المتحدة', flag: '🇬🇧' },
  { value: 'IN', en: 'India', ar: 'الهند', flag: '🇮🇳' },
  { value: 'AU', en: 'Australia', ar: 'أستراليا', flag: '🇦🇺' },
  { value: 'CA', en: 'Canada', ar: 'كندا', flag: '🇨🇦' },
  { value: 'KW', en: 'Kuwait', ar: 'الكويت', flag: '🇰🇼' },
  { value: 'QA', en: 'Qatar', ar: 'قطر', flag: '🇶🇦' },
  { value: 'BH', en: 'Bahrain', ar: 'البحرين', flag: '🇧🇭' },
  { value: 'OM', en: 'Oman', ar: 'عُمان', flag: '🇴🇲' },
  { value: 'JO', en: 'Jordan', ar: 'الأردن', flag: '🇯🇴' },
  { value: 'EG', en: 'Egypt', ar: 'مصر', flag: '🇪🇬' },
];

const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
  { value: 'SAR', label: 'SAR — Saudi Riyal' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'KWD', label: 'KWD — Kuwaiti Dinar' },
  { value: 'QAR', label: 'QAR — Qatari Riyal' },
  { value: 'BHD', label: 'BHD — Bahraini Dinar' },
  { value: 'OMR', label: 'OMR — Omani Rial' },
  { value: 'JOD', label: 'JOD — Jordanian Dinar' },
  { value: 'EGP', label: 'EGP — Egyptian Pound' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
];

const inputClass = 'h-10 bg-background text-sm';

export function StepBankDetails({ formData, errors, isRtl, t, set }: CommonBeneficiaryStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Bank Details', 'بيانات البنك')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('Enter the beneficiary\'s banking information.', 'أدخل معلومات البنك الخاصة بالمستفيد.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Country"
          labelAr="الدولة"
          error={errors.country}
          required
          isRtl={isRtl}
        >
          <Select value={formData.country} onValueChange={(v) => set('country', v as CountryCode)}>
            <SelectTrigger className={cn(inputClass, errors.country && 'border-destructive')}>
              <Globe className="me-2 size-4 text-muted-foreground" />
              <SelectValue placeholder={t('Select country', 'اختر الدولة')} />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{isRtl ? c.ar : c.en}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Currency"
          labelAr="العملة"
          error={errors.currency}
          required
          isRtl={isRtl}
        >
          <Select value={formData.currency} onValueChange={(v) => set('currency', v as CurrencyCode)}>
            <SelectTrigger className={cn(inputClass, errors.currency && 'border-destructive')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Bank Name"
          labelAr="اسم البنك"
          error={errors.bankName}
          required
          isRtl={isRtl}
        >
          <div className="relative">
            <Building2 className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.bankName}
              onChange={(e) => set('bankName', e.target.value)}
              placeholder={t('e.g. Al Rajhi Bank', 'مثال: مصرف الراجحي')}
              className={cn(inputClass, isRtl ? 'pr-9' : 'pl-9', errors.bankName && 'border-destructive')}
            />
          </div>
        </Field>

        <Field
          label="Account Number"
          labelAr="رقم الحساب"
          error={errors.accountNumber}
          required
          isRtl={isRtl}
        >
          <div className="relative">
            <Hash className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.accountNumber}
              onChange={(e) => set('accountNumber', e.target.value)}
              dir="ltr"
              className={cn(inputClass, 'font-mono', isRtl ? 'pr-9' : 'pl-9', errors.accountNumber && 'border-destructive')}
            />
          </div>
        </Field>

        <Field
          label="SWIFT / BIC Code"
          labelAr="رمز SWIFT / BIC"
          error={errors.swiftCode}
          hint="8 or 11 characters (e.g. RJHISARI)"
          required
          isRtl={isRtl}
        >
          <div className="relative">
            <Lock className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.swiftCode}
              onChange={(e) => set('swiftCode', e.target.value.toUpperCase())}
              placeholder="RJHISARI"
              dir="ltr"
              maxLength={11}
              className={cn(inputClass, 'font-mono uppercase', isRtl ? 'pr-9' : 'pl-9', errors.swiftCode && 'border-destructive')}
            />
          </div>
        </Field>

        <Field
          label="IBAN"
          labelAr="رقم IBAN"
          error={errors.iban}
          hint="ISO 13616 — leave blank if not applicable"
          isRtl={isRtl}
        >
          <div className="relative">
            <Shield className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} />
            <Input
              value={formData.iban}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\s/g, '').toUpperCase();
                set('iban', cleaned.length > 0 ? normalizeIBAN(cleaned) : '');
              }}
              placeholder="SA00 0000 0000 0000 0000 0000"
              dir="ltr"
              maxLength={34}
              className={cn(inputClass, 'font-mono tracking-widest uppercase', isRtl ? 'pr-9' : 'pl-9', errors.iban && 'border-destructive')}
            />
          </div>
        </Field>
      </div>

      {(formData.country === 'US' || formData.country === 'GB' || formData.country === 'IN' || formData.country === 'AU' || formData.country === 'CA') && (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('Country-Specific Fields', 'حقول خاصة بالدولة')}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {formData.country === 'US' && (
              <Field
                label="ABA Routing Number"
                labelAr="رقم التوجيه ABA"
                error={errors.routingNumber}
                hint="9-digit ABA number"
                isRtl={isRtl}
              >
                <Input
                  value={formData.routingNumber ?? ''}
                  onChange={(e) => set('routingNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="123456789"
                  dir="ltr"
                  maxLength={9}
                  className={cn(inputClass, 'font-mono', errors.routingNumber && 'border-destructive')}
                />
              </Field>
            )}
            {formData.country === 'GB' && (
              <Field
                label="Sort Code"
                labelAr="رمز الفرز"
                error={errors.sortCode}
                hint="Format: XX-XX-XX"
                isRtl={isRtl}
              >
                <Input
                  value={formData.sortCode ?? ''}
                  onChange={(e) => set('sortCode', e.target.value)}
                  placeholder="12-34-56"
                  dir="ltr"
                  maxLength={8}
                  className={cn(inputClass, 'font-mono', errors.sortCode && 'border-destructive')}
                />
              </Field>
            )}
            {formData.country === 'IN' && (
              <Field
                label="IFSC Code"
                labelAr="رمز IFSC"
                error={errors.ifscCode}
                hint="11-character Indian routing code"
                isRtl={isRtl}
              >
                <Input
                  value={formData.ifscCode ?? ''}
                  onChange={(e) => set('ifscCode', e.target.value.toUpperCase())}
                  placeholder="HDFCINBB001"
                  dir="ltr"
                  maxLength={11}
                  className={cn(inputClass, 'font-mono uppercase', errors.ifscCode && 'border-destructive')}
                />
              </Field>
            )}
            {formData.country === 'AU' && (
              <Field
                label="BSB Number"
                labelAr="رقم BSB"
                error={errors.bsbNumber}
                hint="Format: XXX-XXX"
                isRtl={isRtl}
              >
                <Input
                  value={formData.bsbNumber ?? ''}
                  onChange={(e) => set('bsbNumber', e.target.value)}
                  placeholder="123-456"
                  dir="ltr"
                  maxLength={7}
                  className={cn(inputClass, 'font-mono', errors.bsbNumber && 'border-destructive')}
                />
              </Field>
            )}
            {formData.country === 'CA' && (
              <Field
                label="Transit Number"
                labelAr="رقم الانتقال"
                error={errors.transitNumber}
                hint="9-digit Canadian transit number"
                isRtl={isRtl}
              >
                <Input
                  value={formData.transitNumber ?? ''}
                  onChange={(e) => set('transitNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="000000000"
                  dir="ltr"
                  maxLength={9}
                  className={cn(inputClass, 'font-mono', errors.transitNumber && 'border-destructive')}
                />
              </Field>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

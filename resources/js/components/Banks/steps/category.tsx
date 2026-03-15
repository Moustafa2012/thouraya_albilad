'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Globe, Hash, Lock, Shield } from 'lucide-react';
import { useState, useCallback } from 'react';
import { GlassField, inputCls } from '@/components/ui/GlassField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { normalizeIBAN, validateIBAN } from '@/types/Banking shared.types';
import { CURRENCIES } from '../BankAccountData';
import { getAccountTypeOptions } from '../BankAccountValidation';
import type { AccountTypeValue, CommonStepProps } from '../types';

function InternationalRoutingSection({ formData, errors, isRtl, t, onChange }: {
  formData: { bankCountry: string; swiftCode: string; routingNumber: string; sortCode: string; ifscCode: string; bankleitzahl: string; correspondentBank: string; correspondentSwift: string };
  errors: Record<string, string | undefined>;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 p-4 backdrop-blur-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t('International Routing (Optional)', 'التوجيه الدولي (اختياري)')}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <GlassField id="swift-code" label="SWIFT / BIC Code" labelAr="رمز SWIFT / BIC" error={errors.swiftCode} hint="8 or 11 characters (e.g. RJHISARI)" isRtl={isRtl}>
          <div className="relative">
            <Lock className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
            <Input id="swift-code" value={formData.swiftCode} onChange={(e) => onChange('swiftCode', e.target.value.toUpperCase())} placeholder="RJHISARI" dir="ltr" maxLength={11} className={cn(inputCls, 'font-mono uppercase', isRtl ? 'pr-9' : 'pl-9', errors.swiftCode && 'border-destructive')} aria-invalid={!!errors.swiftCode} aria-describedby={errors.swiftCode ? 'swift-code-error' : 'swift-code-hint'} />
          </div>
        </GlassField>

        {formData.bankCountry === 'US' && (
          <GlassField id="routing-number" label="ABA Routing Number" labelAr="رقم التوجيه ABA" error={errors.routingNumber} hint="9-digit ABA number" isRtl={isRtl}>
            <Input id="routing-number" value={formData.routingNumber} onChange={(e) => onChange('routingNumber', e.target.value.replace(/\D/g, ''))} placeholder="123456789" dir="ltr" maxLength={9} inputMode="numeric" className={cn(inputCls, 'font-mono', errors.routingNumber && 'border-destructive')} aria-invalid={!!errors.routingNumber} aria-describedby={errors.routingNumber ? 'routing-number-error' : 'routing-number-hint'} />
          </GlassField>
        )}

        {formData.bankCountry === 'GB' && (
          <GlassField id="sort-code" label="Sort Code" labelAr="رمز الفرز" error={errors.sortCode} hint="Format: XX-XX-XX" isRtl={isRtl}>
            <Input id="sort-code" value={formData.sortCode} onChange={(e) => onChange('sortCode', e.target.value)} placeholder="12-34-56" dir="ltr" maxLength={8} className={cn(inputCls, 'font-mono', errors.sortCode && 'border-destructive')} aria-invalid={!!errors.sortCode} aria-describedby={errors.sortCode ? 'sort-code-error' : 'sort-code-hint'} />
          </GlassField>
        )}

        {formData.bankCountry === 'IN' && (
          <GlassField id="ifsc-code" label="IFSC Code" labelAr="رمز IFSC" error={errors.ifscCode} hint="11-character Indian routing code" isRtl={isRtl}>
            <Input id="ifsc-code" value={formData.ifscCode} onChange={(e) => onChange('ifscCode', e.target.value.toUpperCase())} placeholder="HDFCINBB001" dir="ltr" maxLength={11} className={cn(inputCls, 'font-mono uppercase', errors.ifscCode && 'border-destructive')} aria-invalid={!!errors.ifscCode} aria-describedby={errors.ifscCode ? 'ifsc-code-error' : 'ifsc-code-hint'} />
          </GlassField>
        )}

        {formData.bankCountry === 'DE' && (
          <GlassField id="bankleitzahl" label="Bankleitzahl (BLZ)" labelAr="رمز Bankleitzahl" error={errors.bankleitzahl} hint="8-digit German bank code" isRtl={isRtl}>
            <Input id="bankleitzahl" value={formData.bankleitzahl} onChange={(e) => onChange('bankleitzahl', e.target.value.replace(/\D/g, ''))} placeholder="20010020" dir="ltr" maxLength={8} inputMode="numeric" className={cn(inputCls, 'font-mono', errors.bankleitzahl && 'border-destructive')} aria-invalid={!!errors.bankleitzahl} aria-describedby={errors.bankleitzahl ? 'bankleitzahl-error' : 'bankleitzahl-hint'} />
          </GlassField>
        )}

        <GlassField id="correspondent-bank" label="Correspondent Bank" labelAr="البنك المراسل" isRtl={isRtl}>
          <Input id="correspondent-bank" value={formData.correspondentBank} onChange={(e) => onChange('correspondentBank', e.target.value)} placeholder={t('Correspondent bank name', 'اسم البنك المراسل')} className={inputCls} />
        </GlassField>

        <GlassField id="correspondent-swift" label="Correspondent SWIFT" labelAr="سويفت البنك المراسل" isRtl={isRtl}>
          <Input id="correspondent-swift" value={formData.correspondentSwift} onChange={(e) => onChange('correspondentSwift', e.target.value.toUpperCase())} placeholder="XXXXXX00" dir="ltr" maxLength={11} className={cn(inputCls, 'font-mono uppercase')} />
        </GlassField>
      </div>
    </div>
  );
}

export function StepCategory({ formData, errors, isRtl, t, set }: CommonStepProps) {
  const accountTypeOptions = getAccountTypeOptions(formData.accountCategory);
  const [ibanFormatError, setIbanFormatError] = useState<string | undefined>(undefined);

  const handleIbanChange = useCallback((value: string) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const formatted = cleaned.length > 0 ? normalizeIBAN(cleaned) : '';
    set('iban', formatted);
    if (!formatted) { setIbanFormatError(undefined); return; }
    const result = validateIBAN(formatted);
    setIbanFormatError(result.valid ? undefined : (result.error ?? t('Invalid IBAN format', 'صيغة IBAN غير صحيحة')));
  }, [set, t]);

  const ibanError = errors.iban ?? ibanFormatError;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
          <CreditCard className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Account Details', 'تفاصيل الحساب')}</h2>
          <p className="text-sm text-muted-foreground">{t('Enter your account number, IBAN, and currency.', 'أدخل رقم الحساب والآيبان والعملة.')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassField id="account-type" label="Account Sub-Type" labelAr="نوع الحساب الفرعي" error={errors.accountType} hint={accountTypeOptions.length === 0 ? t('Sub-types are not available for the selected category.', 'لا توجد أنواع فرعية للفئة المحددة.') : undefined} required isRtl={isRtl}>
          <Select value={formData.accountType} onValueChange={(v) => set('accountType', v as AccountTypeValue)} disabled={accountTypeOptions.length === 0}>
            <SelectTrigger id="account-type" className={cn(inputCls, errors.accountType && 'border-destructive')} aria-invalid={!!errors.accountType} aria-describedby={errors.accountType ? 'account-type-error' : 'account-type-hint'}>
              <CreditCard className="me-2 size-4 text-muted-foreground" aria-hidden="true" />
              <SelectValue placeholder={t('Select type', 'اختر النوع')} />
            </SelectTrigger>
            <SelectContent>
              {accountTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{isRtl ? opt.labelAr : opt.labelEn}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </GlassField>

        <GlassField id="currency" label="Currency" labelAr="العملة" error={errors.currency} required isRtl={isRtl}>
          <Select value={formData.currency} onValueChange={(v) => set('currency', v)}>
            <SelectTrigger id="currency" className={cn(inputCls, errors.currency && 'border-destructive')} aria-invalid={!!errors.currency} aria-describedby={errors.currency ? 'currency-error' : undefined}>
              <Globe className="me-2 size-4 text-muted-foreground" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{c.symbol}</span>
                    <span>{c.code}</span>
                    <span className="text-muted-foreground">— {isRtl ? c.nameAr : c.nameEn}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </GlassField>

        <GlassField id="account-nickname" label="Account Nickname (Optional)" labelAr="اسم مستعار للحساب (اختياري)" isRtl={isRtl}>
          <Input id="account-nickname" value={formData.accountNickname} onChange={(e) => set('accountNickname', e.target.value)} placeholder={t('e.g., Main Operating Account, Payroll Account', 'مثال: الحساب التشغيلي الرئيسي، حساب الرواتب')} className={inputCls} />
        </GlassField>

        <GlassField id="account-number" label="Account Number" labelAr="رقم الحساب" error={errors.accountNumber} required isRtl={isRtl}>
          <div className="relative">
            <Hash className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
            <Input id="account-number" value={formData.accountNumber} onChange={(e) => set('accountNumber', e.target.value)} placeholder="SA...." dir="ltr" className={cn(inputCls, 'font-mono', isRtl ? 'pr-9' : 'pl-9', errors.accountNumber && 'border-destructive')} aria-invalid={!!errors.accountNumber} aria-describedby={errors.accountNumber ? 'account-number-error' : undefined} />
          </div>
        </GlassField>

        <GlassField id="iban" label="IBAN" labelAr="رقم IBAN" error={ibanError} hint={t('International Bank Account Number (ISO 13616)', 'رقم الحساب المصرفي الدولي (ISO 13616)')} isRtl={isRtl}>
          <div className="relative">
            <Shield className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
            <Input id="iban" value={formData.iban} onChange={(e) => handleIbanChange(e.target.value)} placeholder="SA00 0000 0000 0000 0000 0000" dir="ltr" className={cn(inputCls, 'font-mono tracking-wider uppercase', isRtl ? 'pr-9' : 'pl-9', ibanError && 'border-destructive')} aria-invalid={!!ibanError} aria-describedby={ibanError ? 'iban-error' : 'iban-hint'} />
          </div>
        </GlassField>

        {formData.accountCategory === 'business' && (
          <GlassField id="beneficial-ownership-pct" label="Beneficial Ownership Percentage" labelAr="نسبة الملكية الفعلية" error={errors.beneficialOwnershipPercentage} isRtl={isRtl}>
            <div className="relative">
              <Input id="beneficial-ownership-pct" value={formData.beneficialOwnershipPercentage} onChange={(e) => set('beneficialOwnershipPercentage', e.target.value)} placeholder={t('e.g., 25%', 'مثال: 25%')} className={cn(inputCls, errors.beneficialOwnershipPercentage && 'border-destructive')} aria-invalid={!!errors.beneficialOwnershipPercentage} aria-describedby={errors.beneficialOwnershipPercentage ? 'beneficial-ownership-pct-error' : undefined} />
              <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground" aria-hidden="true">%</span>
            </div>
          </GlassField>
        )}

        <GlassField id="monthly-transactions" label="Expected Monthly Transactions" labelAr="عدد العمليات الشهرية المتوقعة" isRtl={isRtl}>
          <Select value={formData.expectedMonthlyTransactions} onValueChange={(v) => set('expectedMonthlyTransactions', v)}>
            <SelectTrigger id="monthly-transactions" className={inputCls}>
              <SelectValue placeholder={t('Select volume', 'اختر عدد العمليات')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">{t('1-10 transactions', 'من 1 إلى 10 عمليات')}</SelectItem>
              <SelectItem value="11-50">{t('11-50 transactions', 'من 11 إلى 50 عملية')}</SelectItem>
              <SelectItem value="51-100">{t('51-100 transactions', 'من 51 إلى 100 عملية')}</SelectItem>
              <SelectItem value="100+">{t('More than 100 transactions', 'أكثر من 100 عملية')}</SelectItem>
            </SelectContent>
          </Select>
        </GlassField>

        <GlassField id="transaction-value" label="Expected Monthly Transaction Value" labelAr="القيمة الشهرية المتوقعة للمعاملات" isRtl={isRtl}>
          <Select value={formData.expectedTransactionValue} onValueChange={(v) => set('expectedTransactionValue', v)}>
            <SelectTrigger id="transaction-value" className={inputCls}>
              <SelectValue placeholder={t('Select value range', 'اختر نطاق القيمة')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<50k">{t('Up to SAR 50,000', 'حتى 50,000 ريال')}</SelectItem>
              <SelectItem value="50k-250k">{t('SAR 50,000 - 250,000', 'من 50,000 إلى 250,000 ريال')}</SelectItem>
              <SelectItem value="250k-1m">{t('SAR 250,000 - 1,000,000', 'من 250,000 إلى 1,000,000 ريال')}</SelectItem>
              <SelectItem value=">1m">{t('More than SAR 1,000,000', 'أكثر من 1,000,000 ريال')}</SelectItem>
            </SelectContent>
          </Select>
        </GlassField>
      </div>

      {formData.accountCategory !== 'business' && (
        <InternationalRoutingSection
          formData={formData}
          errors={errors as Record<string, string | undefined>}
          isRtl={isRtl}
          t={t}
          onChange={(field, value) => set(field as keyof typeof formData, value)}
        />
      )}
    </div>
  );
}
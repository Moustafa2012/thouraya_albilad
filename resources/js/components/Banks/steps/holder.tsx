'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AtSign, Briefcase, Lock, User, UserCheck } from 'lucide-react';
import { useMemo } from 'react';
import { ALL_COUNTRIES, PhoneInput, detectDialCode, onlyDigits } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getIdTypeOptions } from '../BankAccountValidation';
import type { BankAccountFormData, CommonStepProps } from '../types';
import { GlassField, inputCls } from '@/components/ui/GlassField';

function usePhoneValue(raw: string) {
  return useMemo(() => {
    if (!raw?.trim()) return undefined;
    const detected = detectDialCode(raw);
    if (detected) return { country: detected.country, digits: detected.nationalDigits };
    const digits = onlyDigits(raw);
    if (!digits) return undefined;
    return { country: ALL_COUNTRIES.find((c) => c.alpha2.toUpperCase() === 'SA'), digits };
  }, [raw]);
}

function PersonalIdentitySection({ formData, errors, idTypeOptions, isRtl, t, set }: {
  formData: BankAccountFormData;
  errors: Partial<Record<keyof BankAccountFormData, string>>;
  idTypeOptions: { value: string; labelEn: string; labelAr: string }[];
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  set: (field: keyof BankAccountFormData, value: string | boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur-sm sm:grid-cols-2">
        <p className="col-span-full text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t('Personal Identification', 'الهوية الشخصية')}
        </p>

        {idTypeOptions.length > 0 && (
          <GlassField
            id="holder-id-type"
            label="ID Type"
            labelAr="نوع الهوية"
            error={errors.holderIdType}
            required
            isRtl={isRtl}
          >
            <Select value={formData.holderIdType} onValueChange={(v) => set('holderIdType', v)}>
              <SelectTrigger
                id="holder-id-type"
                className={cn(inputCls, errors.holderIdType && 'border-destructive')}
                aria-invalid={!!errors.holderIdType}
                aria-describedby={errors.holderIdType ? 'holder-id-type-error' : undefined}
              >
                <Lock className="me-2 size-4 text-muted-foreground" aria-hidden="true" />
                <SelectValue placeholder={t('Select ID type', 'اختر نوع الهوية')} />
              </SelectTrigger>
              <SelectContent>
                {idTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {isRtl ? opt.labelAr : opt.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GlassField>
        )}

        <GlassField
          id="holder-id"
          label="ID Number"
          labelAr="رقم الهوية"
          error={errors.holderId}
          hint={t('National ID, Passport, or Iqama number', 'رقم الهوية الوطنية أو جواز السفر أو الإقامة')}
          required
          isRtl={isRtl}
          value={formData.holderId}
          onChange={(v) => set('holderId', v)}
          renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
            <div className="relative">
              <Lock
                className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')}
                aria-hidden="true"
              />
              <input
                id={id}
                value={formData.holderId}
                onChange={(e) => set('holderId', e.target.value)}
                placeholder="1234567890"
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, isRtl ? 'pr-9' : 'pl-9', invalid && 'border-destructive')}
              />
            </div>
          )}
        />

        <GlassField
          id="holder-dob"
          label="Date of Birth"
          labelAr="تاريخ الميلاد"
          error={errors.dateOfBirth}
          required
          isRtl={isRtl}
          value={formData.dateOfBirth}
          onChange={(v) => set('dateOfBirth', v)}
          renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
            <input
              id={id}
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => set('dateOfBirth', e.target.value)}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              className={cn(className, invalid && 'border-destructive')}
            />
          )}
        />

        <GlassField
          id="holder-ssn"
          label="SSN Last 4 Digits"
          labelAr="آخر 4 أرقام من رقم الضمان الاجتماعي"
          error={errors.ssnLast4}
          hint={t('Last 4 digits of your social security number', 'آخر 4 أرقام من رقم الضمان الاجتماعي')}
          required
          isRtl={isRtl}
          value={formData.ssnLast4}
          onChange={(v) => set('ssnLast4', v.replace(/\D/g, '').slice(0, 4))}
          renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
            <input
              id={id}
              value={formData.ssnLast4}
              onChange={(e) => set('ssnLast4', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="XXXX"
              maxLength={4}
              inputMode="numeric"
              aria-describedby={describedBy}
              aria-invalid={invalid}
              required={required}
              disabled={disabled}
              readOnly={readOnly}
              className={cn(className, invalid && 'border-destructive')}
            />
          )}
        />
      </div>
    </motion.div>
  );
}

function BusinessHolderSection({ formData, errors, isRtl, t, set, businessPhoneValue }: {
  formData: BankAccountFormData;
  errors: Partial<Record<keyof BankAccountFormData, string>>;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  set: (field: keyof BankAccountFormData, value: string | boolean) => void;
  businessPhoneValue: ReturnType<typeof usePhoneValue>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="space-y-4">
        {/* Business Details */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur-sm sm:grid-cols-2">
          <p className="col-span-full text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('Business Details', 'تفاصيل المنشأة')}
          </p>

          <GlassField
            id="business-name"
            label="Business Name"
            labelAr="اسم المنشأة"
            error={errors.businessName}
            required
            isRtl={isRtl}
            value={formData.businessName ?? ''}
            onChange={(v) => set('businessName', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <input
                id={id}
                value={formData.businessName ?? ''}
                onChange={(e) => set('businessName', e.target.value)}
                placeholder={t('Legal business name', 'الاسم القانوني للمنشأة')}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, invalid && 'border-destructive')}
              />
            )}
          />

          <GlassField
            id="business-type"
            label="Business Type"
            labelAr="نوع المنشأة"
            error={errors.businessType}
            required
            isRtl={isRtl}
            value={formData.businessType ?? ''}
            onChange={(v) => set('businessType', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <input
                id={id}
                value={formData.businessType ?? ''}
                onChange={(e) => set('businessType', e.target.value)}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, invalid && 'border-destructive')}
              />
            )}
          />

          <GlassField
            id="tax-id"
            label="Tax ID"
            labelAr="الرقم الضريبي"
            error={errors.taxId}
            required
            isRtl={isRtl}
            value={formData.taxId ?? ''}
            onChange={(v) => set('taxId', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <input
                id={id}
                value={formData.taxId ?? ''}
                onChange={(e) => set('taxId', e.target.value)}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, invalid && 'border-destructive')}
              />
            )}
          />

          <GlassField
            id="business-phone"
            label="Business Phone"
            labelAr="هاتف المنشأة"
            error={errors.businessPhone}
            required
            isRtl={isRtl}
          >
            <PhoneInput
              value={businessPhoneValue}
              defaultCountry="SA"
              onChange={(val) => set('businessPhone', val.e164)}
              className={cn(inputCls, errors.businessPhone && 'border-destructive')}
              aria-invalid={!!errors.businessPhone}
              aria-describedby={errors.businessPhone ? 'business-phone-error' : undefined}
            />
          </GlassField>

          <GlassField
            id="business-address"
            label="Business Address"
            labelAr="عنوان المنشأة"
            error={errors.businessAddress}
            required
            isRtl={isRtl}
            value={formData.businessAddress ?? ''}
            onChange={(v) => set('businessAddress', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <input
                id={id}
                value={formData.businessAddress ?? ''}
                onChange={(e) => set('businessAddress', e.target.value)}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, invalid && 'border-destructive')}
              />
            )}
          />

          <GlassField
            id="commercial-reg"
            label="Commercial Registration"
            labelAr="السجل التجاري"
            error={errors.commercialRegNumber}
            required
            isRtl={isRtl}
            value={formData.commercialRegNumber}
            onChange={(v) => set('commercialRegNumber', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <input
                id={id}
                value={formData.commercialRegNumber}
                onChange={(e) => set('commercialRegNumber', e.target.value)}
                placeholder="1010XXXXXX"
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, invalid && 'border-destructive')}
              />
            )}
          />
        </div>

        {/* Authorized Signatory */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border/50 bg-muted/30 p-5 backdrop-blur-sm sm:grid-cols-2">
          <p className="col-span-full text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t('Authorized Signatory', 'المفوض بالتوقيع')}
          </p>

          <GlassField
            id="signatory-name"
            label="Authorized Signatory Name"
            labelAr="اسم الموقّع المفوض"
            error={errors.authorizedSignatoryName}
            required
            isRtl={isRtl}
            value={formData.authorizedSignatoryName}
            onChange={(v) => set('authorizedSignatoryName', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <div className="relative">
                <UserCheck
                  className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')}
                  aria-hidden="true"
                />
                <input
                  id={id}
                  value={formData.authorizedSignatoryName}
                  onChange={(e) => set('authorizedSignatoryName', e.target.value)}
                  placeholder={t('Full name as per ID', 'الاسم الكامل حسب الهوية')}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(className, isRtl ? 'pr-9' : 'pl-9', invalid && 'border-destructive')}
                />
              </div>
            )}
          />

          <GlassField
            id="signatory-id"
            label="Authorized Signatory ID"
            labelAr="رقم هوية الموقّع"
            error={errors.authorizedSignatoryId}
            required
            isRtl={isRtl}
            value={formData.authorizedSignatoryId}
            onChange={(v) => set('authorizedSignatoryId', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <div className="relative">
                <Lock
                  className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')}
                  aria-hidden="true"
                />
                <input
                  id={id}
                  value={formData.authorizedSignatoryId}
                  onChange={(e) => set('authorizedSignatoryId', e.target.value)}
                  placeholder={t('National ID or Iqama', 'الهوية الوطنية أو الإقامة')}
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(className, isRtl ? 'pr-9' : 'pl-9', invalid && 'border-destructive')}
                />
              </div>
            )}
          />

          <GlassField
            id="signatory-position"
            label="Signatory Position / Title"
            labelAr="المنصب / المسمى الوظيفي"
            error={errors.signatoryPosition}
            required
            isRtl={isRtl}
            value={formData.signatoryPosition}
            onChange={(v) => set('signatoryPosition', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <input
                id={id}
                value={formData.signatoryPosition}
                onChange={(e) => set('signatoryPosition', e.target.value)}
                placeholder={t('e.g., CEO, Managing Director', 'مثال: الرئيس التنفيذي، المدير العام')}
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, invalid && 'border-destructive')}
              />
            )}
          />

          <GlassField
            id="beneficial-ownership"
            label="Beneficial Ownership %"
            labelAr="نسبة الملكية الفعلية"
            error={errors.beneficialOwnershipPercentage}
            required
            isRtl={isRtl}
            value={formData.beneficialOwnershipPercentage}
            onChange={(v) => set('beneficialOwnershipPercentage', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <div className="relative">
                <span
                  className={cn('pointer-events-none absolute top-1/2 -translate-y-1/2 text-sm text-muted-foreground', isRtl ? 'left-3' : 'right-3')}
                  aria-hidden="true"
                >
                  %
                </span>
                <input
                  id={id}
                  type="number"
                  min={0}
                  max={100}
                  value={formData.beneficialOwnershipPercentage}
                  onChange={(e) => set('beneficialOwnershipPercentage', e.target.value)}
                  placeholder="100"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(className, invalid && 'border-destructive')}
                />
              </div>
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function StepHolder({ formData, errors, isRtl, t, set }: CommonStepProps) {
  const isPersonal = formData.accountCategory === 'personal';
  const isBusiness = formData.accountCategory === 'business';
  const idTypeOptions = getIdTypeOptions(formData.accountCategory);
  const holderPhoneValue = usePhoneValue(formData.holderPhone);
  const businessPhoneValue = usePhoneValue(formData.businessPhone);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
          <User className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Account Holder', 'صاحب الحساب')}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Enter the account holder's identity information.", 'أدخل بيانات هوية صاحب الحساب.')}
          </p>
        </div>
      </div>

      {isPersonal && (
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="sr-only">{t('Full Name', 'الاسم الكامل')}</legend>

          <GlassField
            id="holder-name-ar"
            label="Full Name (Arabic)"
            labelAr="الاسم الكامل (عربي)"
            error={errors.holderNameAr}
            required
            isRtl={isRtl}
            value={formData.holderNameAr}
            onChange={(v) => set('holderNameAr', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <div className="relative">
                <User
                  className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')}
                  aria-hidden="true"
                />
                <input
                  id={id}
                  value={formData.holderNameAr}
                  onChange={(e) => set('holderNameAr', e.target.value)}
                  placeholder={isRtl ? 'مثال: محمد عبدالله' : 'e.g. محمد عبدالله'}
                  dir="rtl"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(className, isRtl ? 'pr-9' : 'pl-9', invalid && 'border-destructive')}
                />
              </div>
            )}
          />

          <GlassField
            id="holder-name-en"
            label="Full Name (English)"
            labelAr="الاسم الكامل (إنجليزي)"
            error={errors.holderNameEn}
            required
            isRtl={isRtl}
            value={formData.holderNameEn}
            onChange={(v) => set('holderNameEn', v)}
            renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
              <div className="relative">
                <UserCheck
                  className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')}
                  aria-hidden="true"
                />
                <input
                  id={id}
                  value={formData.holderNameEn}
                  onChange={(e) => set('holderNameEn', e.target.value)}
                  placeholder="e.g. Mohammed Abdullah"
                  dir="ltr"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                  required={required}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={cn(className, isRtl ? 'pr-9' : 'pl-9', invalid && 'border-destructive')}
                />
              </div>
            )}
          />
        </fieldset>
      )}

      <AnimatePresence>
        {isPersonal && (
          <PersonalIdentitySection
            key="personal-id"
            formData={formData}
            errors={errors}
            idTypeOptions={idTypeOptions}
            isRtl={isRtl}
            t={t}
            set={set}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBusiness && (
          <BusinessHolderSection
            key="business-holder"
            formData={formData}
            errors={errors}
            isRtl={isRtl}
            t={t}
            set={set}
            businessPhoneValue={businessPhoneValue}
          />
        )}
      </AnimatePresence>

      <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <legend className="sr-only">{t('Contact Information', 'معلومات الاتصال')}</legend>

        <GlassField
          id="holder-phone"
          label="Phone Number"
          labelAr="رقم الهاتف"
          error={errors.holderPhone}
          hint={t('Optional', 'اختياري')}
          isRtl={isRtl}
        >
          <PhoneInput
            value={holderPhoneValue}
            defaultCountry="SA"
            onChange={(val) => set('holderPhone', val.e164)}
            className={cn(inputCls, errors.holderPhone && 'border-destructive')}
            aria-invalid={!!errors.holderPhone}
            aria-describedby={errors.holderPhone ? 'holder-phone-error' : 'holder-phone-hint'}
          />
        </GlassField>

        <GlassField
          id="holder-email"
          label="Email Address"
          labelAr="البريد الإلكتروني"
          error={errors.holderEmail}
          hint={t('Optional', 'اختياري')}
          isRtl={isRtl}
          value={formData.holderEmail}
          onChange={(v) => set('holderEmail', v)}
          renderControl={({ id, describedBy, invalid, required, disabled, readOnly, className }) => (
            <div className="relative">
              <AtSign
                className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')}
                aria-hidden="true"
              />
              <input
                id={id}
                type="email"
                value={formData.holderEmail}
                onChange={(e) => set('holderEmail', e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                aria-describedby={describedBy}
                aria-invalid={invalid}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                className={cn(className, isRtl ? 'pr-9' : 'pl-9', invalid && 'border-destructive')}
              />
            </div>
          )}
        />
      </fieldset>
    </div>
  );
}
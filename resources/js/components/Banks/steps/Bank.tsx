'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AtSign, Building2, Landmark, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import { CountryDropdown } from '@/components/ui/country-dropdown';
import type { Country as UiCountry } from '@/components/ui/country-dropdown';
import { Input } from '@/components/ui/input';
import { PhoneInput, lookupCountry } from '@/components/ui/phone-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { COUNTRIES, BANKS } from '../BankAccountData';
import type { Country } from '../BankAccountData';
import type { BankAccountFormData, CommonStepProps } from '../types';
import { GlassField, inputCls } from '@/components/ui/GlassField';

function RoutingFieldsPanel({
  selectedCountry, formData, isRtl, set,
}: {
  selectedCountry: Country | undefined;
  formData: BankAccountFormData;
  isRtl: boolean;
  set: (field: keyof BankAccountFormData, value: string) => void;
}) {
  if (!selectedCountry?.routingFields.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border border-border/50 bg-muted/30 p-4 backdrop-blur-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isRtl ? 'التوجيه الخاص بالدولة' : 'Country-Specific Routing'}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {selectedCountry.routingFields.map((rf) => (
            <GlassField key={rf.key} id={`routing-${rf.key}`} label={rf.labelEn} labelAr={rf.labelAr} hint={isRtl ? rf.hintAr : rf.hintEn} isRtl={isRtl}>
              <Input
                id={`routing-${rf.key}`}
                value={(formData[rf.key as keyof BankAccountFormData] as string) ?? ''}
                onChange={(e) => set(rf.key as keyof BankAccountFormData, e.target.value)}
                placeholder={rf.placeholder}
                maxLength={rf.maxLength}
                className={inputCls}
              />
            </GlassField>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function StepBank({ formData, errors, isRtl, t, set }: CommonStepProps) {
  const [bankSearch, setBankSearch] = useState('');
  const [isCustomBank, setIsCustomBank] = useState(false);

  const selectedCountry = COUNTRIES.find((c) => c.code === formData.bankCountry);
  const availableBanks = BANKS[formData.bankCountry as keyof typeof BANKS] ?? [];
  const filteredBanks = availableBanks.filter(
    (b) => b.nameEn.toLowerCase().includes(bankSearch.toLowerCase()) || b.nameAr.includes(bankSearch),
  );

  function handleCountrySelect(country: UiCountry | undefined) {
    const nextCode = country?.alpha2.toUpperCase() ?? '';
    if (nextCode === formData.bankCountry) return;
    (['bankName', 'bankSwift', 'bankPhone', 'bankEmail', 'bankWebsite', 'swiftCode',
      'routingNumber', 'sortCode', 'ifscCode', 'bankleitzahl', 'bankRelationshipDuration', 'accountManagerName'] as const)
      .forEach((f) => set(f, ''));
    set('bankCountry', nextCode);
    setBankSearch('');
    setIsCustomBank(false);
  }

  function handleBankSelect(value: string) {
    if (value === '__custom__') {
      setIsCustomBank(true);
      (['bankName', 'bankSwift', 'bankPhone', 'bankEmail', 'bankWebsite'] as const).forEach((f) => set(f, ''));
      return;
    }
    setIsCustomBank(false);
    set('bankName', value);
    const found = availableBanks.find((b) => b.nameEn === value);
    if (found) {
      set('bankSwift', found.swiftEn);
      set('swiftCode', found.swiftEn);
      set('bankPhone', found.phone ?? '');
      set('bankEmail', found.email ?? '');
      set('bankWebsite', found.website ?? '');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary" aria-hidden="true">
          <Landmark className="size-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold">{t('Bank Information', 'معلومات البنك')}</h2>
          <p className="text-sm text-muted-foreground">{t('Select the bank and branch for this account.', 'اختر البنك والفرع لهذا الحساب.')}</p>
        </div>
      </div>

      <GlassField id="bank-country" label="Country" labelAr="الدولة" error={errors.bankCountry} required isRtl={isRtl}>
        <CountryDropdown
          defaultValue={formData.bankCountry}
          onChange={handleCountrySelect}
          placeholder={t('Select country', 'اختر الدولة')}
          locale={isRtl ? 'ar' : 'en'}
          dir={isRtl ? 'rtl' : 'ltr'}
          className={cn(errors.bankCountry && 'border-destructive')}
          aria-invalid={!!errors.bankCountry}
          aria-describedby={errors.bankCountry ? 'bank-country-error' : undefined}
        />
      </GlassField>

      <AnimatePresence>
        {formData.bankCountry && (
          <motion.div key="bank-fields" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="space-y-4">
            <GlassField id="bank-name" label="Bank Name" labelAr="اسم البنك" error={errors.bankName} required isRtl={isRtl}>
              <div className="space-y-2">
                {availableBanks.length > 5 && !isCustomBank && (
                  <div className="relative">
                    <Search className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
                    <Input value={bankSearch} onChange={(e) => setBankSearch(e.target.value)} placeholder={t('Search bank...', 'ابحث عن بنك...')} className={cn(inputCls, isRtl ? 'pr-9' : 'pl-9')} aria-label={t('Search banks', 'ابحث عن البنوك')} />
                  </div>
                )}
                <Select value={isCustomBank ? '__custom__' : formData.bankName} onValueChange={handleBankSelect}>
                  <SelectTrigger id="bank-name" className={cn(inputCls, errors.bankName && 'border-destructive')} aria-invalid={!!errors.bankName} aria-describedby={errors.bankName ? 'bank-name-error' : undefined}>
                    <Building2 className="me-2 size-4 text-muted-foreground" aria-hidden="true" />
                    <SelectValue placeholder={t('Select bank', 'اختر البنك')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredBanks.map((b) => (
                      <SelectItem key={b.nameEn} value={b.nameEn}>
                        <span className="flex flex-col">
                          <span>{isRtl ? b.nameAr : b.nameEn}</span>
                          {b.swiftEn && <span className="text-xs text-muted-foreground">{b.swiftEn}</span>}
                        </span>
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__">{t('Enter a bank not in the list', 'إدخال بنك غير موجود في القائمة')}</SelectItem>
                  </SelectContent>
                </Select>
                {isCustomBank && (
                  <Input value={formData.bankName} onChange={(e) => set('bankName', e.target.value)} placeholder={t('Enter bank name', 'اكتب اسم البنك')} className={inputCls} aria-label={t('Custom bank name', 'اسم البنك المخصص')} />
                )}
              </div>
            </GlassField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <GlassField id="branch-name" label="Branch Name" labelAr="اسم الفرع" isRtl={isRtl}>
                <Input id="branch-name" value={formData.branchName} onChange={(e) => set('branchName', e.target.value)} placeholder={t('e.g. Riyadh Main Branch', 'مثال: الفرع الرئيسي الرياض')} className={inputCls} />
              </GlassField>

              <GlassField id="branch-code" label="Branch Code" labelAr="كود الفرع" isRtl={isRtl}>
                <Input id="branch-code" value={formData.branchCode} onChange={(e) => set('branchCode', e.target.value)} placeholder="XXXXX" className={inputCls} />
              </GlassField>

              <GlassField id="bank-address" label="Bank Address" labelAr="عنوان البنك" isRtl={isRtl}>
                <div className="relative">
                  <MapPin className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
                  <Input id="bank-address" value={formData.bankAddress} onChange={(e) => set('bankAddress', e.target.value)} placeholder={t('Street address', 'العنوان')} className={cn(inputCls, isRtl ? 'pr-9' : 'pl-9')} />
                </div>
              </GlassField>

              <GlassField id="bank-city" label="City" labelAr="المدينة" isRtl={isRtl}>
                <Input id="bank-city" value={formData.bankCity} onChange={(e) => set('bankCity', e.target.value)} placeholder={t('e.g. Riyadh', 'مثال: الرياض')} className={inputCls} />
              </GlassField>

              <GlassField id="bank-phone" label="Bank Phone" labelAr="هاتف البنك" error={errors.bankPhone} hint={t('Auto-filled from bank selection', 'يُملأ تلقائيًا عند اختيار البنك')} isRtl={isRtl}>
                <PhoneInput value={{ digits: formData.bankPhone, country: lookupCountry(formData.bankCountry) }} onChange={(val) => set('bankPhone', val.digits || '')} placeholder={t('Phone number', 'رقم الهاتف')} defaultCountry={formData.bankCountry} aria-describedby={errors.bankPhone ? 'bank-phone-error' : 'bank-phone-hint'} />
              </GlassField>

              <GlassField id="bank-email" label="Bank Email" labelAr="بريد البنك" error={errors.bankEmail} required isRtl={isRtl}>
                <div className="relative">
                  <AtSign className={cn('absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground', isRtl ? 'right-3' : 'left-3')} aria-hidden="true" />
                  <Input id="bank-email" type="email" value={formData.bankEmail} onChange={(e) => set('bankEmail', e.target.value)} className={cn(inputCls, isRtl ? 'pr-9' : 'pl-9', errors.bankEmail && 'border-destructive')} aria-invalid={!!errors.bankEmail} aria-describedby={errors.bankEmail ? 'bank-email-error' : undefined} />
                </div>
              </GlassField>

              <GlassField id="bank-relationship" label="Bank Relationship Duration" labelAr="مدة العلاقة مع البنك" isRtl={isRtl}>
                <Select value={formData.bankRelationshipDuration} onValueChange={(v) => set('bankRelationshipDuration', v)}>
                  <SelectTrigger id="bank-relationship" className={inputCls}>
                    <SelectValue placeholder={t('Select duration', 'اختر المدة')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t('New customer', 'عميل جديد')}</SelectItem>
                    <SelectItem value="0-1">{t('Less than 1 year', 'أقل من سنة')}</SelectItem>
                    <SelectItem value="1-3">{t('1-3 years', 'من 1 إلى 3 سنوات')}</SelectItem>
                    <SelectItem value="3-5">{t('3-5 years', 'من 3 إلى 5 سنوات')}</SelectItem>
                    <SelectItem value="5+">{t('More than 5 years', 'أكثر من 5 سنوات')}</SelectItem>
                  </SelectContent>
                </Select>
              </GlassField>

              <GlassField id="account-manager" label="Account Manager Name" labelAr="اسم مدير الحساب" isRtl={isRtl}>
                <Input id="account-manager" value={formData.accountManagerName} onChange={(e) => set('accountManagerName', e.target.value)} placeholder={t('Optional - if assigned', 'اختياري - إن وُجد')} className={inputCls} />
              </GlassField>

              <GlassField id="preferred-language" label="Preferred Communication Language" labelAr="لغة التواصل المفضلة" isRtl={isRtl}>
                <Select value={formData.preferredLanguage} onValueChange={(v) => set('preferredLanguage', v)}>
                  <SelectTrigger id="preferred-language" className={inputCls}>
                    <SelectValue placeholder={t('Select language', 'اختر اللغة')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">{t('Arabic', 'العربية')}</SelectItem>
                    <SelectItem value="en">{t('English', 'الإنجليزية')}</SelectItem>
                    <SelectItem value="both">{t('Arabic & English', 'العربية والإنجليزية')}</SelectItem>
                  </SelectContent>
                </Select>
              </GlassField>
            </div>

            <AnimatePresence>
              {selectedCountry && selectedCountry.routingFields.length > 0 && (
                <RoutingFieldsPanel key={`routing-${formData.bankCountry}`} selectedCountry={selectedCountry} formData={formData} isRtl={isRtl} set={set as (field: keyof BankAccountFormData, value: string) => void} />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
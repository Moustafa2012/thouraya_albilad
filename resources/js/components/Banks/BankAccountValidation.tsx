'use client';

import {
  validateIBAN, validateSWIFT, validateABA, validateIFSC, validateSortCode, validateBankleitzahl, REGEX,
} from '@/types/Banking shared.types';
import type { AccountCategory, BankAccountFormData, StepKey, ValidationErrors } from './types';

type T = (en: string, ar: string) => string;

export function validateStepCategory(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!formData.accountCategory) errors.accountCategory = t('Account category is required', 'نوع الحساب مطلوب');
  return errors;
}

export function validateStepHolder(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};

  if (formData.holderNameAr.trim() && !REGEX.ARABIC.test(formData.holderNameAr)) {
    errors.holderNameAr = t('Please use Arabic characters', 'الرجاء استخدام الأحرف العربية');
  }
  if (formData.holderNameEn.trim() && !REGEX.ENGLISH_NAME.test(formData.holderNameEn.trim())) {
    errors.holderNameEn = t('Use English letters only', 'استخدم الأحرف الإنجليزية فقط');
  }

  if (formData.holderPhone && !REGEX.PHONE.test(formData.holderPhone))
    errors.holderPhone = t('Invalid phone number format', 'صيغة رقم الهاتف غير صحيحة');
  if (formData.holderEmail && !REGEX.EMAIL.test(formData.holderEmail))
    errors.holderEmail = t('Invalid email address', 'عنوان البريد الإلكتروني غير صحيح');

  return errors;
}

export function validateStepBank(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!formData.bankName) errors.bankName = t('Bank name is required', 'اسم البنك مطلوب');
  if (!formData.bankEmail.trim()) errors.bankEmail = t('Bank email is required', 'البريد الإلكتروني للبنك مطلوب');
  else if (!REGEX.EMAIL.test(formData.bankEmail)) errors.bankEmail = t('Invalid email address', 'عنوان البريد غير صحيح');
  return errors;
}

export function validateStepAccount(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!formData.accountNumber.trim()) errors.accountNumber = t('Account number is required', 'رقم الحساب مطلوب');
  if (!formData.currency) errors.currency = t('Currency is required', 'العملة مطلوبة');
  if (!formData.swiftCode.trim()) errors.swiftCode = t('SWIFT is required', 'رمز SWIFT مطلوب');

  if (!formData.iban.trim()) {
    errors.iban = t('IBAN is required', 'رمز IBAN مطلوب');
  } else {
    const r = validateIBAN(formData.iban);
    if (!r.valid) errors.iban = t(r.error ?? 'Invalid IBAN', r.error ?? 'رمز IBAN غير صحيح');
  }

  if (formData.swiftCode.trim()) {
    const r = validateSWIFT(formData.swiftCode.trim());
    if (!r.valid) errors.swiftCode = t(r.error ?? 'Invalid SWIFT', r.error ?? 'رمز SWIFT غير صحيح');
  }

  if (formData.routingNumber) {
    const r = validateABA(formData.routingNumber);
    if (!r.valid) errors.routingNumber = t(r.error ?? 'Invalid ABA', r.error ?? 'رقم ABA غير صحيح');
  }

  if (formData.sortCode) {
    const r = validateSortCode(formData.sortCode);
    if (!r.valid) errors.sortCode = t(r.error ?? 'Invalid sort code', r.error ?? 'رمز الفرز غير صحيح');
  }

  if (formData.ifscCode) {
    const r = validateIFSC(formData.ifscCode);
    if (!r.valid) errors.ifscCode = t(r.error ?? 'Invalid IFSC', r.error ?? 'رمز IFSC غير صحيح');
  }

  if (formData.bankleitzahl) {
    const r = validateBankleitzahl(formData.bankleitzahl);
    if (!r.valid) errors.bankleitzahl = t(r.error ?? 'Invalid Bankleitzahl', r.error ?? 'رمز Bankleitzahl غير صحيح');
  }
  return errors;
}

export function validateStepSettings(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  const raw = (formData.openingBalance ?? '').toString().replace(/,/g, '').trim();
  if (!raw) {
    errors.openingBalance = t('Opening balance is required', 'الرصيد الافتتاحي مطلوب');
    return errors;
  }

  const value = Number(raw);
  if (!Number.isFinite(value)) {
    errors.openingBalance = t('Opening balance must be a number', 'يجب أن يكون الرصيد الافتتاحي رقمًا');
  } else if (value < 0) {
    errors.openingBalance = t('Opening balance cannot be negative', 'لا يمكن أن يكون الرصيد الافتتاحي سالبًا');
  }

  return errors;
}

export function validateStep(step: StepKey, formData: BankAccountFormData, t: T): ValidationErrors {
  switch (step) {
    case 'category': return validateStepCategory(formData, t);
    case 'holder':   return validateStepHolder(formData, t);
    case 'bank':     return validateStepBank(formData, t);
    case 'account':  return validateStepAccount(formData, t);
    case 'settings': return validateStepSettings(formData, t);
    default:         return {};
  }
}

export function validateAllSteps(formData: BankAccountFormData, t: T) {
  const keys: StepKey[] = ['category', 'holder', 'bank', 'account', 'settings'];
  return keys
    .map((stepKey) => ({ stepKey, errors: validateStep(stepKey, formData, t) }))
    .filter(({ errors }) => hasErrors(errors));
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function getAccountTypeOptions(category: AccountCategory | '') {
  const map: Record<AccountCategory, { value: string; labelEn: string; labelAr: string }[]> = {
    personal: [
      { value: 'current', labelEn: 'Current Account', labelAr: 'حساب جاري' },
      { value: 'cheque',  labelEn: 'Cheque Account',  labelAr: 'حساب شيكات' },
    ],
    business: [
      { value: 'business',  labelEn: 'Business Account',  labelAr: 'حساب تجاري' },
      { value: 'corporate', labelEn: 'Corporate Account', labelAr: 'حساب مؤسسي' },
      { value: 'payroll',   labelEn: 'Payroll Account',   labelAr: 'حساب رواتب' },
    ],
  };
  return category ? (map[category] ?? []) : [];
}

export function getIdTypeOptions(category: AccountCategory | '') {
  if (category === 'business') {
    return [
      { value: 'commercial_reg', labelEn: 'Commercial Registration', labelAr: 'السجل التجاري' },
      { value: 'vat_number',     labelEn: 'VAT Registration Number', labelAr: 'رقم تسجيل ضريبة القيمة المضافة' },
      { value: 'license',        labelEn: 'Business License',        labelAr: 'رخصة تجارية' },
    ];
  }
  return [
    { value: 'national_id', labelEn: 'National ID', labelAr: 'الهوية الوطنية' },
    { value: 'passport',    labelEn: 'Passport',    labelAr: 'جواز السفر' },
    { value: 'iqama',       labelEn: 'Iqama',       labelAr: 'الإقامة' },
  ];
}

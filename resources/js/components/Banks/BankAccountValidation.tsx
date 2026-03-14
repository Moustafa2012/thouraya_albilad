'use client';

import {
  validateIBAN, validateSWIFT, validateABA, validateIFSC, validateSortCode, validateBankleitzahl, REGEX,
} from '@/types/Banking shared.types';
import type { AccountCategory, BankAccountFormData, StepKey, ValidationErrors } from './types';

type T = (en: string, ar: string) => string;

export function validateStepCategory(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!formData.accountCategory) errors.accountCategory = t('Account category is required', 'نوع الحساب مطلوب');
  if (formData.accountCategory === 'business') {
    if (!formData.establishmentType) errors.establishmentType = t('Establishment type is required for business accounts', 'نوع المنشأة مطلوب للحسابات التجارية');
    if (!formData.businessSector) errors.businessSector = t('Business sector is required', 'قطاع النشاط التجاري مطلوب');
  }
  return errors;
}

export function validateStepHolder(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};

  if (formData.accountCategory !== 'business') {
    if (!formData.holderNameAr.trim()) errors.holderNameAr = t('Arabic name is required', 'الاسم بالعربية مطلوب');
    else if (!REGEX.ARABIC.test(formData.holderNameAr)) errors.holderNameAr = t('Please use Arabic characters', 'الرجاء استخدام الأحرف العربية');
    if (!formData.holderNameEn.trim()) errors.holderNameEn = t('English name is required', 'الاسم بالإنجليزية مطلوب');
    else if (!REGEX.ENGLISH_NAME.test(formData.holderNameEn.trim())) errors.holderNameEn = t('Use English letters only', 'استخدم الأحرف الإنجليزية فقط');
  }

  if (formData.accountCategory === 'personal') {
    if (!formData.holderId.trim()) errors.holderId = t('ID number is required', 'رقم الهوية مطلوب');
    if (!formData.holderIdType) errors.holderIdType = t('ID type is required', 'نوع الهوية مطلوب');
    if (!formData.dateOfBirth) errors.dateOfBirth = t('Date of birth is required', 'تاريخ الميلاد مطلوب');
    if (!formData.ssnLast4) errors.ssnLast4 = t('SSN (Last 4) is required', 'الرقم الاجتماعي مطلوب');
    else if (!/^\d{4}$/.test(formData.ssnLast4)) errors.ssnLast4 = t('Must be 4 digits', 'يجب أن يكون 4 أرقام');
  }

  if (formData.accountCategory === 'business') {
    if (!formData.businessName?.trim()) errors.businessName = t('Business name is required', 'اسم المنشأة مطلوب');
    if (!formData.commercialRegNumber.trim()) {
      errors.commercialRegNumber = t('Commercial registration is required', 'السجل التجاري مطلوب');
    } else if (!/^\d{10}$/.test(formData.commercialRegNumber.trim())) {
      errors.commercialRegNumber = t('Commercial registration must be 10 digits', 'يجب أن يتكون السجل التجاري من 10 أرقام');
    }
    if (!formData.businessType) errors.businessType = t('Business type is required', 'نوع النشاط مطلوب');
    if (!formData.taxId) errors.taxId = t('Tax ID is required', 'الرقم الضريبي مطلوب');
    if (!formData.businessAddress) errors.businessAddress = t('Business address is required', 'عنوان المنشأة مطلوب');
    if (!formData.businessPhone) errors.businessPhone = t('Business phone is required', 'رقم هاتف المنشأة مطلوب');
    if (!formData.authorizedSignatoryName.trim()) errors.authorizedSignatoryName = t('Authorized signatory name is required', 'اسم الموقّع المفوض مطلوب');
    if (!formData.authorizedSignatoryId.trim()) errors.authorizedSignatoryId = t('Authorized signatory ID is required', 'رقم هوية الموقّع المفوض مطلوب');
    if (!formData.signatoryPosition.trim()) errors.signatoryPosition = t('Signatory position is required', 'الصفة أو المسمى الوظيفي للموقّع مطلوب');

    const beneficialOwner = (formData.beneficialOwnershipPercentage ?? '').trim();
    if (!beneficialOwner) {
      errors.beneficialOwnershipPercentage = t('Beneficial ownership percentage is required', 'نسبة الملكية الفعلية مطلوبة');
    } else {
      const numeric = Number(beneficialOwner.replace('%', '').trim());
      if (Number.isNaN(numeric) || numeric <= 0 || numeric > 100)
        errors.beneficialOwnershipPercentage = t('Enter a percentage between 0 and 100', 'أدخل نسبة بين 0 و 100');
    }
  }

  if (formData.accountCategory !== 'business' && formData.vatNumber?.trim()) {
    if (!/^\d{15}$/.test(formData.vatNumber.trim()))
      errors.vatNumber = t('VAT number must be 15 digits', 'يجب أن يتكون الرقم الضريبي من 15 رقمًا');
  }

  if (formData.holderPhone && !REGEX.PHONE.test(formData.holderPhone))
    errors.holderPhone = t('Invalid phone number format', 'صيغة رقم الهاتف غير صحيحة');
  if (formData.holderEmail && !REGEX.EMAIL.test(formData.holderEmail))
    errors.holderEmail = t('Invalid email address', 'عنوان البريد الإلكتروني غير صحيح');

  return errors;
}

export function validateStepBank(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!formData.bankCountry) errors.bankCountry = t('Country is required', 'الدولة مطلوبة');
  if (!formData.bankName) errors.bankName = t('Bank name is required', 'اسم البنك مطلوب');
  if (!formData.bankEmail.trim()) errors.bankEmail = t('Bank email is required', 'البريد الإلكتروني للبنك مطلوب');
  else if (!REGEX.EMAIL.test(formData.bankEmail)) errors.bankEmail = t('Invalid email address', 'عنوان البريد غير صحيح');
  return errors;
}

export function validateStepAccount(formData: BankAccountFormData, t: T): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!formData.accountType) errors.accountType = t('Account type is required', 'نوع الحساب مطلوب');
  if (!formData.accountNumber.trim()) errors.accountNumber = t('Account number is required', 'رقم الحساب مطلوب');
  if (!formData.currency) errors.currency = t('Currency is required', 'العملة مطلوبة');

  if (formData.iban) {
    const r = validateIBAN(formData.iban);
    if (!r.valid) errors.iban = t(r.error ?? 'Invalid IBAN', r.error ?? 'رمز IBAN غير صحيح');
  }

  if (formData.accountCategory !== 'business') {
    const checks: [string, () => ReturnType<typeof validateIBAN>, string, string][] = [
      ['swiftCode', () => validateSWIFT(formData.swiftCode), 'Invalid SWIFT', 'رمز SWIFT غير صحيح'],
      ['routingNumber', () => validateABA(formData.routingNumber), 'Invalid ABA', 'رقم ABA غير صحيح'],
      ['sortCode', () => validateSortCode(formData.sortCode), 'Invalid sort code', 'رمز الفرز غير صحيح'],
      ['ifscCode', () => validateIFSC(formData.ifscCode), 'Invalid IFSC', 'رمز IFSC غير صحيح'],
      ['bankleitzahl', () => validateBankleitzahl(formData.bankleitzahl), 'Invalid Bankleitzahl', 'رمز Bankleitzahl غير صحيح'],
    ];
    for (const [field, validate, fallbackEn, fallbackAr] of checks) {
      if (formData[field as keyof BankAccountFormData]) {
        const r = validate();
        if (!r.valid) (errors as Record<string, string>)[field] = t(r.error ?? fallbackEn, r.error ?? fallbackAr);
      }
    }
  }
  return errors;
}

export function validateStepSettings(_formData: BankAccountFormData, _t: T): ValidationErrors {
  return {};
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
import type { BeneficiaryFormData } from './types';

export const validateField = (field: string, value: any, t: (en: string, ar: string) => string, formData: BeneficiaryFormData): string | null => {
    switch (field) {
        case 'nameAr':
            if (!value || value.trim() === '') return null;
            if (value.length < 3) return t('Name must be at least 3 characters', 'الاسم يجب أن يكون 3 أحرف على الأقل');
            break;
        case 'nameEn':
            if (!value || value.trim() === '') return t('Beneficiary name is required', 'اسم المستفيد مطلوب');
            if (value.length < 3) return t('Name must be at least 3 characters', 'الاسم يجب أن يكون 3 أحرف على الأقل');
            if (!/^[\p{L}\p{M}\s.'’\-()&]+$/u.test(value)) return t('Please use letters and common punctuation only', 'الرجاء استخدام الأحرف وعلامات الترقيم الشائعة فقط');
            break;
        case 'nationalId':
            if (value && !/^\d{10}$/.test(value)) {
                return t('National ID must be 10 digits', 'رقم الهوية يجب أن يكون 10 أرقام');
            }
            break;
        case 'businessRegistration':
            break;
        case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return t('Invalid email format', 'تنسيق البريد الإلكتروني غير صحيح');
            }
            break;
        case 'phone':
            if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
                return t('Invalid phone format', 'تنسيق الهاتف غير صحيح');
            }
            break;
        case 'bankName':
            if (!value || value.trim() === '') return t('Bank name is required', 'اسم البنك مطلوب');
            break;
        case 'accountNumber':
            if (!value || value.trim() === '') return t('Account number is required', 'رقم الحساب مطلوب');
            break;
        case 'iban':
            if (!value || value.trim() === '') return t('IBAN is required', 'رقم IBAN مطلوب');
            break;
        case 'swiftCode':
            if (!value || value.trim() === '') return t('SWIFT code is required', 'رمز السويفت مطلوب');
            if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.toUpperCase())) {
                return t('Invalid SWIFT code format', 'تنسيق رمز السويفت غير صحيح');
            }
            break;
    }
    return null;
};

export const validateStep = (stepKey: string, formData: BeneficiaryFormData, t: (en: string, ar: string) => string): Record<string, string> => {
    const errors: Record<string, string> = {};
    const stepFields: Record<string, string[]> = {
        accountType: ['accountType'],
        basicInfo: ['nameEn'],
        contactInfo: [], // Optional
        bankDetails: ['country', 'currency', 'bankName', 'accountNumber', 'iban', 'swiftCode'],
        classification: ['category'],
    };

    const fields = stepFields[stepKey] || [];
    
    fields.forEach(field => {
        const value = formData[field as keyof BeneficiaryFormData];
        const error = validateField(field, value, t, formData);
        if (error) {
            errors[field] = error;
        }
    });

    return errors;
};

export const hasErrors = (errors: Record<string, string>): boolean => {
    return Object.keys(errors).length > 0;
};

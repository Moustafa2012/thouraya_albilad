export type AccountType = 'individual' | 'business';

export type BeneficiaryCategory =
  | 'suppliers' | 'employees' | 'partners' | 'contractors' | 'other';

export type CountryCode =
  | 'SA' | 'US' | 'IN' | 'GB' | 'AU' | 'CA'
  | 'AE' | 'KW' | 'QA' | 'BH' | 'OM' | 'JO' | 'EG';

export type CurrencyCode =
  | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED'
  | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'JOD'
  | 'EGP' | 'INR' | 'AUD' | 'CAD';

export interface BeneficiaryFormData {
  accountType: AccountType;
  nameAr: string;
  nameEn: string;
  nationalId?: string;
  businessRegistration?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  country: CountryCode;
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  currency: CurrencyCode;
  abaNumber?: string;
  routingNumber?: string;
  ifscCode?: string;
  sortCode?: string;
  bsbNumber?: string;
  transitNumber?: string;
  category: BeneficiaryCategory;
  notes: string;
}

export const INITIAL_BENEFICIARY_FORM_DATA: BeneficiaryFormData = {
  accountType: 'individual',
  nameAr: '',
  nameEn: '',
  nationalId: '',
  businessRegistration: '',
  taxId: '',
  email: '',
  phone: '',
  address: '',
  country: 'SA',
  bankName: '',
  accountNumber: '',
  iban: '',
  swiftCode: '',
  currency: 'SAR',
  abaNumber: '',
  routingNumber: '',
  ifscCode: '',
  sortCode: '',
  bsbNumber: '',
  transitNumber: '',
  category: 'other',
  notes: '',
};

export interface Beneficiary extends BeneficiaryFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface BeneficiaryFilters {
  search: string;
  category: BeneficiaryCategory | 'all';
  country: CountryCode | 'all';
  accountType: AccountType | 'all';
}

export interface BeneficiaryStats {
  total: number;
  byCategory: Partial<Record<BeneficiaryCategory, number>>;
  byCountry: Partial<Record<CountryCode, number>>;
  individuals: number;
  businesses: number;
}

export type BeneficiaryValidationErrors = Partial<Record<keyof BeneficiaryFormData, string>>;

export interface BeneficiaryStepDefinition {
  key: BeneficiaryStepKey;
  labelEn: string;
  labelAr: string;
  icon: string;
}

export type BeneficiaryStepKey =
  | 'accountType'
  | 'basicInfo'
  | 'contactInfo'
  | 'bankDetails'
  | 'classification';

export const BENEFICIARY_STEPS: BeneficiaryStepDefinition[] = [
  { key: 'accountType',   labelEn: 'Account Type',  labelAr: 'نوع الحساب',       icon: 'Users'     },
  { key: 'basicInfo',     labelEn: 'Basic Info',     labelAr: 'البيانات الأساسية', icon: 'User'      },
  { key: 'contactInfo',   labelEn: 'Contact Info',   labelAr: 'معلومات الاتصال',   icon: 'Contact'   },
  { key: 'bankDetails',   labelEn: 'Bank Details',   labelAr: 'بيانات البنك',      icon: 'Building2' },
  { key: 'classification',labelEn: 'Classification', labelAr: 'التصنيف',           icon: 'Tag'       },
];

export interface CommonBeneficiaryStepProps {
  formData: BeneficiaryFormData;
  errors: BeneficiaryValidationErrors;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  set: (field: keyof BeneficiaryFormData, value: string | boolean) => void;
}

export const CATEGORY_CONFIG: {
  value: BeneficiaryCategory;
  labelEn: string;
  labelAr: string;
  color: string;
}[] = [
  { value: 'suppliers',   labelEn: 'Suppliers',   labelAr: 'موردين',     color: 'bg-blue-500/10 text-blue-600 border-blue-200'   },
  { value: 'employees',   labelEn: 'Employees',   labelAr: 'موظفين',     color: 'bg-green-500/10 text-green-600 border-green-200' },
  { value: 'partners',    labelEn: 'Partners',    labelAr: 'شركاء',      color: 'bg-violet-500/10 text-violet-600 border-violet-200' },
  { value: 'contractors', labelEn: 'Contractors', labelAr: 'متعاقدين',   color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  { value: 'other',       labelEn: 'Other',       labelAr: 'أخرى',       color: 'bg-gray-500/10 text-gray-600 border-gray-200'    },
];
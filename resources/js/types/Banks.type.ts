// This file is the canonical type for the bank accounts listing page components.
// The full multi-step form uses ./types.ts instead.

export type AccountCategory = 'personal' | 'business';

export type StepKey = 'category' | 'holder' | 'bank' | 'account' | 'settings';

export type CurrencyCode =
  | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED'
  | 'KWD' | 'QAR' | 'BHD' | 'INR' | 'JPY' | 'CNY';

export type HolderIdType =
  | 'national_id' | 'passport' | 'iqama'
  | 'commercial_reg' | 'vat_number' | 'license';

export type AccountTypeValue =
  | 'current' | 'cheque'
  | 'business' | 'corporate' | 'payroll';

export interface BankAccount {
  id: string;
  holderNameAr: string;
  holderNameEn: string;
  holderIdType?: HolderIdType | '';
  holderId?: string;
  bankName: string;
  bankCountry: string;
  bankAddress?: string;
  bankPhone?: string;
  bankEmail?: string;
  accountNumber: string;
  iban: string;
  swiftCode: string;
  branchName?: string;
  branchCode?: string;
  routingNumber?: string;
  sortCode?: string;
  currency: CurrencyCode;
  accountType: AccountTypeValue;
  accountCategory: AccountCategory;
  balance?: number;
  status?: string;
  isDefault: boolean;
  isActive: boolean;
  notes?: string;
  metadata?: Record<string, unknown>;
  // Business-specific
  establishmentType?: string;
  businessSector?: string;
  businessActivity?: string;
  commercialRegNumber?: string;
  vatNumber?: string;
  authorizedSignatoryName?: string;
  authorizedSignatoryId?: string;
  signatoryPosition?: string;
  beneficialOwnershipPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BankAccountStats {
  total: number;
  active: number;
  hasDefault: boolean;
  byCategory: Record<AccountCategory, number>;
  byCurrency: Partial<Record<CurrencyCode, number>>;
}

export interface BankAccountFilters {
  search: string;
  category: AccountCategory | 'all';
  currency: CurrencyCode | 'all';
  isActive?: boolean;
}

export interface StepDefinition {
  key: StepKey;
  labelEn: string;
  labelAr: string;
  icon: string;
}

export const STEPS: StepDefinition[] = [
  { key: 'category', labelEn: 'Account Type',   labelAr: 'نوع الحساب',    icon: 'LayoutGrid' },
  { key: 'holder',   labelEn: 'Account Holder', labelAr: 'صاحب الحساب',   icon: 'User'       },
  { key: 'bank',     labelEn: 'Bank Info',       labelAr: 'معلومات البنك', icon: 'Landmark'   },
  { key: 'account',  labelEn: 'Account Details', labelAr: 'تفاصيل الحساب', icon: 'CreditCard' },
  { key: 'settings', labelEn: 'Settings',        labelAr: 'الإعدادات',     icon: 'Settings2'  },
];

export interface CommonStepProps {
  formData: BankAccountFormData;
  errors: Partial<Record<keyof BankAccountFormData, string>>;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  set: (field: keyof BankAccountFormData, value: string | boolean) => void;
}

export type ValidationErrors = Partial<Record<keyof BankAccountFormData, string>>;

export interface BankAccountFormData {
  accountCategory: AccountCategory | '';
  // Holder (common)
  holderNameAr: string;
  holderNameEn: string;
  holderPhone: string;
  holderEmail: string;
  // Holder (personal-specific)
  holderIdType: HolderIdType | '';
  holderId: string;
  // Holder (business-specific)
  commercialRegNumber: string;
  vatNumber: string;
  authorizedSignatoryName: string;
  authorizedSignatoryId: string;
  signatoryPosition: string;
  // Bank
  bankCountry: string;
  bankName: string;
  bankSwift: string;
  branchName: string;
  branchCode: string;
  bankPhone: string;
  bankEmail: string;
  bankWebsite: string;
  bankAddress: string;
  bankCity: string;
  bankRelationshipDuration: string;
  accountManagerName: string;
  preferredLanguage: string;
  // Account
  accountType: AccountTypeValue | '';
  accountNumber: string;
  iban: string;
  currency: CurrencyCode;
  swiftCode: string;
  routingNumber: string;
  sortCode: string;
  ifscCode: string;
  bankleitzahl: string;
  accountNickname: string;
  expectedMonthlyTransactions: string;
  expectedTransactionValue: string;
  correspondentBank: string;
  correspondentSwift: string;
  // Business-specific account
  establishmentType: string;
  businessSector: string;
  businessActivity: string;
  beneficialOwnershipPercentage: string;
  // Settings
  isDefault: boolean;
  isActive: boolean;
  notes: string;
  accountPurpose: string;
  monthlyTransactionLimit: string;
  lowBalanceAlerts: boolean;
  largeTransactionAlerts: boolean;
  statementFrequency: string;
}

export type FormData = BankAccountFormData;

export const INITIAL_FORM_DATA: BankAccountFormData = {
  accountCategory: '',
  holderNameAr: '',
  holderNameEn: '',
  holderPhone: '',
  holderEmail: '',
  holderIdType: '',
  holderId: '',
  commercialRegNumber: '',
  vatNumber: '',
  authorizedSignatoryName: '',
  authorizedSignatoryId: '',
  signatoryPosition: '',
  bankCountry: '',
  bankName: '',
  bankSwift: '',
  branchName: '',
  branchCode: '',
  bankPhone: '',
  bankEmail: '',
  bankWebsite: '',
  bankAddress: '',
  bankCity: '',
  bankRelationshipDuration: '',
  accountManagerName: '',
  preferredLanguage: '',
  accountType: '',
  accountNumber: '',
  iban: '',
  currency: 'SAR',
  swiftCode: '',
  routingNumber: '',
  sortCode: '',
  ifscCode: '',
  bankleitzahl: '',
  accountNickname: '',
  expectedMonthlyTransactions: '',
  expectedTransactionValue: '',
  correspondentBank: '',
  correspondentSwift: '',
  establishmentType: '',
  businessSector: '',
  businessActivity: '',
  beneficialOwnershipPercentage: '',
  isDefault: false,
  isActive: true,
  notes: '',
  accountPurpose: '',
  monthlyTransactionLimit: '',
  lowBalanceAlerts: true,
  largeTransactionAlerts: true,
  statementFrequency: 'monthly',
};
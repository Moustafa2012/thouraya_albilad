export type AccountCategory = 'personal' | 'business';

export type StepKey = 'category' | 'holder' | 'bank' | 'account' | 'settings';

export type CurrencyCode =
  | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED'
  | 'KWD' | 'QAR' | 'BHD' | 'INR' | 'JPY' | 'CNY';

export type HolderIdType =
  | 'national_id' | 'passport' | 'iqama'
  | 'commercial_reg' | 'vat_number' | 'license';

/** Account sub-types available for each category */
export type AccountTypeValue =
  | 'current' | 'cheque'          // personal
  | 'business' | 'corporate' | 'payroll'; // business

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
  currency: CurrencyCode;
  branchName?: string;
  branchCode?: string;
  routingNumber?: string;
  sortCode?: string;
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
  businessName?: string;
  businessType?: string;
  taxId?: string;
  businessAddress?: string;
  businessPhone?: string;
  // Personal-specific
  dateOfBirth?: string;
  ssnLast4?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Common fields shared by both Personal and Business ───────────────────────

export interface CommonFormFields {
  // Step 1: Category
  accountCategory: AccountCategory | '';
  // Step 2: Holder (common)
  holderNameAr: string;
  holderNameEn: string;
  holderPhone: string;
  holderEmail: string;
  // Step 3: Bank (common)
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
  // Step 4: Account (common)
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
  // Step 5: Settings (common)
  openingBalance: string;
  isDefault: boolean;
  isActive: boolean;
  notes: string;
  accountPurpose: string;
  monthlyTransactionLimit: string;
  lowBalanceAlerts: boolean;
  largeTransactionAlerts: boolean;
  statementFrequency: string;
}

// ─── Personal-specific fields ─────────────────────────────────────────────────

export interface PersonalFormFields {
  holderIdType: HolderIdType | '';
  holderId: string;
  dateOfBirth: string;
  ssnLast4: string;
}

// ─── Business-specific fields ─────────────────────────────────────────────────

export interface BusinessFormFields {
  // Step 1 continuation
  establishmentType: string;
  businessSector: string;
  businessActivity: string;
  // Step 2: Holder (business-specific)
  commercialRegNumber: string;
  vatNumber: string;
  authorizedSignatoryName: string;
  authorizedSignatoryId: string;
  signatoryPosition: string;
  // Step 4: Account (business-specific)
  beneficialOwnershipPercentage: string;
  // New Business Fields
  businessName: string;
  businessType: string;
  taxId: string;
  businessAddress: string;
  businessPhone: string;
}

// ─── Combined form data ────────────────────────────────────────────────────────

export type BankAccountFormData = CommonFormFields & PersonalFormFields & BusinessFormFields;

export type FormData = BankAccountFormData;

export const INITIAL_FORM_DATA: BankAccountFormData = {
  // Common
  accountCategory: 'business',
  holderNameAr: '',
  holderNameEn: '',
  holderPhone: '',
  holderEmail: '',
  bankCountry: 'SA',
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
  accountType: 'corporate',
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
  openingBalance: '0',
  isDefault: false,
  isActive: true,
  notes: '',
  accountPurpose: '',
  monthlyTransactionLimit: '',
  lowBalanceAlerts: true,
  largeTransactionAlerts: true,
  statementFrequency: 'monthly',

  // Personal-specific
  holderIdType: '',
  holderId: '',
  dateOfBirth: '',
  ssnLast4: '',

  // Business-specific
  establishmentType: '',
  businessSector: '',
  businessActivity: '',
  commercialRegNumber: '',
  vatNumber: '',
  authorizedSignatoryName: '',
  authorizedSignatoryId: '',
  signatoryPosition: '',
  beneficialOwnershipPercentage: '',
  businessName: '',
  businessType: '',
  taxId: '',
  businessAddress: '',
  businessPhone: '',
};

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
  { key: 'category', labelEn: 'Account Type',    labelAr: 'نوع الحساب',    icon: 'LayoutGrid' },
  { key: 'holder',   labelEn: 'Account Holder',  labelAr: 'صاحب الحساب',   icon: 'User'       },
  { key: 'bank',     labelEn: 'Bank Info',        labelAr: 'معلومات البنك', icon: 'Landmark'   },
  { key: 'account',  labelEn: 'Account Details',  labelAr: 'تفاصيل الحساب', icon: 'CreditCard' },
  { key: 'settings', labelEn: 'Settings',         labelAr: 'الإعدادات',     icon: 'Settings2'  },
];

export interface CommonStepProps {
  formData: BankAccountFormData;
  errors: Partial<Record<keyof BankAccountFormData, string>>;
  isRtl: boolean;
  t: (en: string, ar: string) => string;
  set: (field: keyof BankAccountFormData, value: string | boolean) => void;
}

export type ValidationErrors = Partial<Record<keyof BankAccountFormData, string>>;

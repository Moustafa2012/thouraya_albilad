/**
 * Enhanced Countries Configuration
 * Comprehensive country data with banking-specific requirements
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface BankingRequirements {
  requiresIban: boolean;
  ibanLength?: number;
  ibanFormat?: string;
  specificFields: BankingField[];
  swiftRequired: boolean;
  allowsInternationalTransfers: boolean;
  additionalDocuments?: string[];
}

export interface BankingField {
  fieldName: string;
  displayNameEn: string;
  displayNameAr: string;
  format: string;
  length: number;
  validation: string;
  example: string;
  required: boolean;
  description: string;
}

export interface CountryRegulation {
  sanctioned: boolean;
  restricted: boolean;
  requiresAdditionalVerification: boolean;
  complianceNotes?: string;
}

export interface Country {
  // Basic Info
  code: string; // ISO 3166-1 alpha-2
  englishName: string;
  arabicName: string;
  phoneCode: string;
  capital: string;
  
  // Currency Info
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  
  // Banking Requirements
  banking: BankingRequirements;
  
  // Regional Info
  region: string;
  subRegion: string;
  continent: string;
  
  // Regulatory Info
  regulation: CountryRegulation;
  
  // Additional Info
  language: string[];
  timezone: string[];
  isGCC?: boolean;
}

// ============================================================================
// Countries Data
// ============================================================================

export const countries: Country[] = [
  {
    code: "SA",
    englishName: "Saudi Arabia",
    arabicName: "المملكة العربية السعودية",
    phoneCode: "+966",
    capital: "Riyadh",
    currency: "Saudi riyal",
    currencyCode: "SAR",
    currencySymbol: "﷼",
    banking: {
      requiresIban: true,
      ibanLength: 24,
      ibanFormat: "SA00 0000 0000 0000 0000 0000",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["National ID", "Commercial Registration for Business"]
    },
    region: "Middle East",
    subRegion: "Arabian Peninsula",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic"],
    timezone: ["Asia/Riyadh"],
    isGCC: true
  },
  {
    code: "US",
    englishName: "United States",
    arabicName: "الولايات المتحدة",
    phoneCode: "+1",
    capital: "Washington, D.C.",
    currency: "United States Dollar",
    currencyCode: "USD",
    currencySymbol: "$",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "abaNumber",
          displayNameEn: "ABA Routing Number",
          displayNameAr: "رقم التوجيه ABA",
          format: "NNNNNNNNN",
          length: 9,
          validation: "^\\d{9}$",
          example: "021000021",
          required: true,
          description: "9-digit code identifying the financial institution"
        },
        {
          fieldName: "routingNumber",
          displayNameEn: "ACH Routing Number",
          displayNameAr: "رقم التوجيه ACH",
          format: "NNNNNNNNN",
          length: 9,
          validation: "^\\d{9}$",
          example: "021000021",
          required: true,
          description: "9-digit code for electronic transfers"
        },
        {
          fieldName: "accountType",
          displayNameEn: "Account Type",
          displayNameAr: "نوع الحساب",
          format: "Text",
          length: 20,
          validation: "^(Checking|Savings)$",
          example: "Checking",
          required: true,
          description: "Type of bank account (Checking or Savings)"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["SSN or EIN", "Photo ID"]
    },
    region: "North America",
    subRegion: "Northern America",
    continent: "North America",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["English"],
    timezone: ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"]
  },
  {
    code: "GB",
    englishName: "United Kingdom",
    arabicName: "المملكة المتحدة",
    phoneCode: "+44",
    capital: "London",
    currency: "Pound sterling",
    currencyCode: "GBP",
    currencySymbol: "£",
    banking: {
      requiresIban: true,
      ibanLength: 22,
      ibanFormat: "GB00 AAAA NNNN NNNN NNNN NN",
      specificFields: [
        {
          fieldName: "sortCode",
          displayNameEn: "Sort Code",
          displayNameAr: "رمز الفرز",
          format: "NN-NN-NN",
          length: 6,
          validation: "^\\d{6}$",
          example: "123456",
          required: true,
          description: "6-digit code identifying the bank branch"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Proof of Address", "Photo ID"]
    },
    region: "Europe",
    subRegion: "Northern Europe",
    continent: "Europe",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["English"],
    timezone: ["Europe/London"]
  },
  {
    code: "IN",
    englishName: "India",
    arabicName: "الهند",
    phoneCode: "+91",
    capital: "New Delhi",
    currency: "Indian rupee",
    currencyCode: "INR",
    currencySymbol: "₹",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "ifscCode",
          displayNameEn: "IFSC Code",
          displayNameAr: "رمز IFSC",
          format: "AAAA0NNNNNN",
          length: 11,
          validation: "^[A-Z]{4}0[A-Z0-9]{6}$",
          example: "SBIN0001234",
          required: true,
          description: "Indian Financial System Code - 11 characters"
        },
        {
          fieldName: "micrCode",
          displayNameEn: "MICR Code",
          displayNameAr: "رمز MICR",
          format: "NNNNNNNNN",
          length: 9,
          validation: "^\\d{9}$",
          example: "400002002",
          required: false,
          description: "Magnetic Ink Character Recognition code"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["PAN Card", "Aadhaar Card"]
    },
    region: "South Asia",
    subRegion: "Southern Asia",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Hindi", "English"],
    timezone: ["Asia/Kolkata"]
  },
  {
    code: "AU",
    englishName: "Australia",
    arabicName: "أستراليا",
    phoneCode: "+61",
    capital: "Canberra",
    currency: "Australian dollar",
    currencyCode: "AUD",
    currencySymbol: "A$",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "bsbNumber",
          displayNameEn: "BSB Number",
          displayNameAr: "رقم BSB",
          format: "NNN-NNN",
          length: 6,
          validation: "^\\d{6}$",
          example: "123456",
          required: true,
          description: "Bank State Branch number - 6 digits"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Driver's License", "Passport"]
    },
    region: "Oceania",
    subRegion: "Australia and New Zealand",
    continent: "Oceania",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["English"],
    timezone: ["Australia/Sydney", "Australia/Melbourne", "Australia/Perth"]
  },
  {
    code: "CA",
    englishName: "Canada",
    arabicName: "كندا",
    phoneCode: "+1",
    capital: "Ottawa",
    currency: "Canadian dollar",
    currencyCode: "CAD",
    currencySymbol: "C$",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "transitNumber",
          displayNameEn: "Transit Number",
          displayNameAr: "رقم التحويل",
          format: "NNNNN",
          length: 5,
          validation: "^\\d{5}$",
          example: "12345",
          required: true,
          description: "5-digit branch transit number"
        },
        {
          fieldName: "institutionNumber",
          displayNameEn: "Institution Number",
          displayNameAr: "رقم المؤسسة",
          format: "NNN",
          length: 3,
          validation: "^\\d{3}$",
          example: "001",
          required: true,
          description: "3-digit financial institution number"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["SIN", "Photo ID"]
    },
    region: "North America",
    subRegion: "Northern America",
    continent: "North America",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["English", "French"],
    timezone: ["America/Toronto", "America/Vancouver", "America/Halifax"]
  },
  {
    code: "AE",
    englishName: "United Arab Emirates",
    arabicName: "الإمارات العربية المتحدة",
    phoneCode: "+971",
    capital: "Abu Dhabi",
    currency: "United Arab Emirates Dirham",
    currencyCode: "AED",
    currencySymbol: "د.إ",
    banking: {
      requiresIban: true,
      ibanLength: 23,
      ibanFormat: "AE00 0000 0000 0000 0000 000",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Emirates ID", "Residence Visa"]
    },
    region: "Middle East",
    subRegion: "Arabian Peninsula",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic", "English"],
    timezone: ["Asia/Dubai"],
    isGCC: true
  },
  {
    code: "KW",
    englishName: "Kuwait",
    arabicName: "الكويت",
    phoneCode: "+965",
    capital: "Kuwait City",
    currency: "Kuwaiti dinar",
    currencyCode: "KWD",
    currencySymbol: "د.ك",
    banking: {
      requiresIban: true,
      ibanLength: 30,
      ibanFormat: "KW00 AAAA NNNN NNNN NNNN NNNN NNNN NN",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Civil ID", "Residency Permit"]
    },
    region: "Middle East",
    subRegion: "Arabian Peninsula",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic"],
    timezone: ["Asia/Kuwait"],
    isGCC: true
  },
  {
    code: "QA",
    englishName: "Qatar",
    arabicName: "قطر",
    phoneCode: "+974",
    capital: "Doha",
    currency: "Qatari riyal",
    currencyCode: "QAR",
    currencySymbol: "ر.ق",
    banking: {
      requiresIban: true,
      ibanLength: 29,
      ibanFormat: "QA00 AAAA NNNN NNNN NNNN NNNN NNNN N",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["QID", "Residence Permit"]
    },
    region: "Middle East",
    subRegion: "Arabian Peninsula",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic", "English"],
    timezone: ["Asia/Qatar"],
    isGCC: true
  },
  {
    code: "BH",
    englishName: "Bahrain",
    arabicName: "البحرين",
    phoneCode: "+973",
    capital: "Manama",
    currency: "Bahraini dinar",
    currencyCode: "BHD",
    currencySymbol: "د.ب",
    banking: {
      requiresIban: true,
      ibanLength: 22,
      ibanFormat: "BH00 AAAA NNNN NNNN NNNN NN",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["CPR", "Passport"]
    },
    region: "Middle East",
    subRegion: "Arabian Peninsula",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic", "English"],
    timezone: ["Asia/Bahrain"],
    isGCC: true
  },
  {
    code: "OM",
    englishName: "Oman",
    arabicName: "عمان",
    phoneCode: "+968",
    capital: "Muscat",
    currency: "Omani rial",
    currencyCode: "OMR",
    currencySymbol: "ر.ع.",
    banking: {
      requiresIban: true,
      ibanLength: 23,
      ibanFormat: "OM00 NNNN NNNN NNNN NNNN NNN",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Civil ID", "Passport"]
    },
    region: "Middle East",
    subRegion: "Arabian Peninsula",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic", "English"],
    timezone: ["Asia/Muscat"],
    isGCC: true
  },
  {
    code: "JO",
    englishName: "Jordan",
    arabicName: "الأردن",
    phoneCode: "+962",
    capital: "Amman",
    currency: "Jordanian dinar",
    currencyCode: "JOD",
    currencySymbol: "د.ا",
    banking: {
      requiresIban: true,
      ibanLength: 30,
      ibanFormat: "JO00 AAAA NNNN NNNN NNNN NNNN NNNN NN",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["National ID", "Passport"]
    },
    region: "Middle East",
    subRegion: "Levant",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic"],
    timezone: ["Asia/Amman"]
  },
  {
    code: "EG",
    englishName: "Egypt",
    arabicName: "مصر",
    phoneCode: "+20",
    capital: "Cairo",
    currency: "Egyptian pound",
    currencyCode: "EGP",
    currencySymbol: "£",
    banking: {
      requiresIban: true,
      ibanLength: 29,
      ibanFormat: "EG00 NNNN NNNN NNNN NNNN NNNN NNN",
      specificFields: [],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["National ID", "Tax Card"]
    },
    region: "Middle East/North Africa",
    subRegion: "Northern Africa",
    continent: "Africa",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Arabic"],
    timezone: ["Africa/Cairo"]
  },
  {
    code: "DE",
    englishName: "Germany",
    arabicName: "ألمانيا",
    phoneCode: "+49",
    capital: "Berlin",
    currency: "Euro",
    currencyCode: "EUR",
    currencySymbol: "€",
    banking: {
      requiresIban: true,
      ibanLength: 22,
      ibanFormat: "DE00 NNNN NNNN NNNN NNNN NN",
      specificFields: [
        {
          fieldName: "blz",
          displayNameEn: "BLZ (Bank Code)",
          displayNameAr: "رمز البنك BLZ",
          format: "NNNNNNNN",
          length: 8,
          validation: "^\\d{8}$",
          example: "37040044",
          required: false,
          description: "8-digit German bank code"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Personalausweis", "Residence Permit"]
    },
    region: "Europe",
    subRegion: "Western Europe",
    continent: "Europe",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["German"],
    timezone: ["Europe/Berlin"]
  },
  {
    code: "FR",
    englishName: "France",
    arabicName: "فرنسا",
    phoneCode: "+33",
    capital: "Paris",
    currency: "Euro",
    currencyCode: "EUR",
    currencySymbol: "€",
    banking: {
      requiresIban: true,
      ibanLength: 27,
      ibanFormat: "FR00 NNNN NNNN NNNN NNNN NNNN NNN",
      specificFields: [
        {
          fieldName: "rib",
          displayNameEn: "RIB (Bank Details)",
          displayNameAr: "تفاصيل البنك RIB",
          format: "NNNNNNNNNNNNNNNNNNNNNNNN",
          length: 23,
          validation: "^\\d{23}$",
          example: "30004000010001234567823",
          required: false,
          description: "Relevé d'Identité Bancaire"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["CNI", "Residence Permit"]
    },
    region: "Europe",
    subRegion: "Western Europe",
    continent: "Europe",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["French"],
    timezone: ["Europe/Paris"]
  },
  {
    code: "CN",
    englishName: "China",
    arabicName: "الصين",
    phoneCode: "+86",
    capital: "Beijing",
    currency: "Renminbi",
    currencyCode: "CNY",
    currencySymbol: "¥",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "cnaps",
          displayNameEn: "CNAPS Code",
          displayNameAr: "رمز CNAPS",
          format: "NNNNNNNNNNNNN",
          length: 12,
          validation: "^\\d{12}$",
          example: "102100099996",
          required: true,
          description: "China National Advanced Payment System code"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["Chinese ID", "Residence Permit"]
    },
    region: "East Asia",
    subRegion: "Eastern Asia",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: true,
      requiresAdditionalVerification: true,
      complianceNotes: "Strict capital controls, requires SAFE approval for large transfers"
    },
    language: ["Mandarin Chinese"],
    timezone: ["Asia/Shanghai"]
  },
  {
    code: "JP",
    englishName: "Japan",
    arabicName: "اليابان",
    phoneCode: "+81",
    capital: "Tokyo",
    currency: "Japanese yen",
    currencyCode: "JPY",
    currencySymbol: "¥",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "bankCode",
          displayNameEn: "Bank Code",
          displayNameAr: "رمز البنك",
          format: "NNNN",
          length: 4,
          validation: "^\\d{4}$",
          example: "0005",
          required: true,
          description: "4-digit bank code"
        },
        {
          fieldName: "branchCode",
          displayNameEn: "Branch Code",
          displayNameAr: "رمز الفرع",
          format: "NNN",
          length: 3,
          validation: "^\\d{3}$",
          example: "123",
          required: true,
          description: "3-digit branch code"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["My Number Card", "Residence Card"]
    },
    region: "East Asia",
    subRegion: "Eastern Asia",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Japanese"],
    timezone: ["Asia/Tokyo"]
  },
  {
    code: "BR",
    englishName: "Brazil",
    arabicName: "البرازيل",
    phoneCode: "+55",
    capital: "Brasilia",
    currency: "Brazilian real",
    currencyCode: "BRL",
    currencySymbol: "R$",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "bankCode",
          displayNameEn: "Bank Code",
          displayNameAr: "رمز البنك",
          format: "NNN",
          length: 3,
          validation: "^\\d{3}$",
          example: "001",
          required: true,
          description: "3-digit bank code"
        },
        {
          fieldName: "agencia",
          displayNameEn: "Agência (Branch)",
          displayNameAr: "الفرع",
          format: "NNNN",
          length: 4,
          validation: "^\\d{4}$",
          example: "1234",
          required: true,
          description: "4-digit branch number"
        },
        {
          fieldName: "cpfCnpj",
          displayNameEn: "CPF/CNPJ",
          displayNameAr: "رقم التعريف الضريبي",
          format: "NNNNNNNNNNNNN",
          length: 14,
          validation: "^\\d{11}|\\d{14}$",
          example: "12345678901",
          required: true,
          description: "Tax identification number"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["CPF", "RG"]
    },
    region: "South America",
    subRegion: "South America",
    continent: "South America",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: true,
      complianceNotes: "Requires Central Bank registration for international transfers"
    },
    language: ["Portuguese"],
    timezone: ["America/Sao_Paulo"]
  },
  {
    code: "MX",
    englishName: "Mexico",
    arabicName: "المكسيك",
    phoneCode: "+52",
    capital: "Mexico City",
    currency: "Mexican peso",
    currencyCode: "MXN",
    currencySymbol: "$",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "clabe",
          displayNameEn: "CLABE",
          displayNameAr: "رمز CLABE",
          format: "NNNNNNNNNNNNNNNNNN",
          length: 18,
          validation: "^\\d{18}$",
          example: "012180001234567897",
          required: true,
          description: "Standardized banking cipher key (18 digits)"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["CURP", "RFC"]
    },
    region: "North America",
    subRegion: "Central America",
    continent: "North America",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Spanish"],
    timezone: ["America/Mexico_City"]
  },
  {
    code: "SG",
    englishName: "Singapore",
    arabicName: "سنغافورة",
    phoneCode: "+65",
    capital: "Singapore",
    currency: "Singapore dollar",
    currencyCode: "SGD",
    currencySymbol: "S$",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "bankCode",
          displayNameEn: "Bank Code",
          displayNameAr: "رمز البنك",
          format: "NNNN",
          length: 4,
          validation: "^\\d{4}$",
          example: "7339",
          required: true,
          description: "4-digit bank code"
        },
        {
          fieldName: "branchCode",
          displayNameEn: "Branch Code",
          displayNameAr: "رمز الفرع",
          format: "NNN",
          length: 3,
          validation: "^\\d{3}$",
          example: "001",
          required: true,
          description: "3-digit branch code"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["NRIC", "Work Permit"]
    },
    region: "Southeast Asia",
    subRegion: "South-Eastern Asia",
    continent: "Asia",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["English", "Malay", "Mandarin", "Tamil"],
    timezone: ["Asia/Singapore"]
  },
  {
    code: "ZA",
    englishName: "South Africa",
    arabicName: "جنوب أفريقيا",
    phoneCode: "+27",
    capital: "Pretoria",
    currency: "South African rand",
    currencyCode: "ZAR",
    currencySymbol: "R",
    banking: {
      requiresIban: false,
      specificFields: [
        {
          fieldName: "branchCode",
          displayNameEn: "Branch Code",
          displayNameAr: "رمز الفرع",
          format: "NNNNNN",
          length: 6,
          validation: "^\\d{6}$",
          example: "250655",
          required: true,
          description: "6-digit branch code"
        }
      ],
      swiftRequired: true,
      allowsInternationalTransfers: true,
      additionalDocuments: ["SA ID", "Proof of Residence"]
    },
    region: "Southern Africa",
    subRegion: "Southern Africa",
    continent: "Africa",
    regulation: {
      sanctioned: false,
      restricted: false,
      requiresAdditionalVerification: false
    },
    language: ["Afrikaans", "English", "Zulu"],
    timezone: ["Africa/Johannesburg"]
  }
  // Add more countries as needed
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validates phone codes to ensure they follow the correct format
 */
export function isValidPhoneCode(phoneCode: string): boolean {
  return /^\+\d{1,4}(-\d{1,4})?$/.test(phoneCode);
}

/**
 * Gets a country by its code
 */
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

/**
 * Gets a country by its index
 */
export function getCountryByIndex(index: number): Country | undefined {
  if (index < 0 || index >= countries.length) {
    return undefined;
  }
  return countries[index];
}

/**
 * Gets countries by region
 */
export function getCountriesByRegion(region: string): Country[] {
  return countries.filter(country => country.region === region);
}

/**
 * Gets GCC countries
 */
export function getGCCCountries(): Country[] {
  return countries.filter(country => country.isGCC === true);
}

/**
 * Gets countries that require IBAN
 */
export function getIBANCountries(): Country[] {
  return countries.filter(country => country.banking.requiresIban);
}

/**
 * Gets countries with specific banking fields
 */
export function getCountriesWithSpecificFields(): Country[] {
  return countries.filter(country => country.banking.specificFields.length > 0);
}

/**
 * Gets sanctioned or restricted countries
 */
export function getRestrictedCountries(): Country[] {
  return countries.filter(
    country => country.regulation.sanctioned || country.regulation.restricted
  );
}

/**
 * Validates IBAN format for a specific country
 */
export function validateIBAN(iban: string, countryCode: string): boolean {
  const country = getCountryByCode(countryCode);
  if (!country || !country.banking.requiresIban) {
    return false;
  }
  
  const cleanIban = iban.replace(/\s/g, '');
  return cleanIban.length === country.banking.ibanLength;
}

/**
 * Validates a specific banking field
 */
export function validateBankingField(
  value: string, 
  countryCode: string, 
  fieldName: string
): boolean {
  const country = getCountryByCode(countryCode);
  if (!country) return false;
  
  const field = country.banking.specificFields.find(f => f.fieldName === fieldName);
  if (!field) return false;
  
  const regex = new RegExp(field.validation);
  return regex.test(value);
}

/**
 * Gets required documents for a country
 */
export function getRequiredDocuments(countryCode: string): string[] {
  const country = getCountryByCode(countryCode);
  return country?.banking.additionalDocuments || [];
}

/**
 * Checks if a country allows international transfers
 */
export function allowsInternationalTransfers(countryCode: string): boolean {
  const country = getCountryByCode(countryCode);
  return country?.banking.allowsInternationalTransfers || false;
}

// ============================================================================
// Export Lists
// ============================================================================

export const countryList: string[] = countries.map(c => c.englishName);
export const countryListArabic: string[] = countries.map(c => c.arabicName);
export const countryCodeList: string[] = countries.map(c => c.phoneCode);
export const countryCodes: string[] = countries.map(c => c.code);
export const currencyList: string[] = [...new Set(countries.map(c => c.currencyCode))];

// ============================================================================
// Region and Continent Lists
// ============================================================================

export const regions = [...new Set(countries.map(c => c.region))];
export const continents = [...new Set(countries.map(c => c.continent))];

// ============================================================================
// Banking Configuration Map
// ============================================================================

export const bankingConfigMap = countries.reduce((acc, country) => {
  acc[country.code] = country.banking;
  return acc;
}, {} as Record<string, BankingRequirements>);
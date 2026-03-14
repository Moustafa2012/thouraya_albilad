export type IBANString = string & { readonly __brand: 'IBAN' };
export type SWIFTString = string & { readonly __brand: 'SWIFT' };
export type ABAString = string & { readonly __brand: 'ABA' };
export type IFSCString = string & { readonly __brand: 'IFSC' };
export type SortCodeString = string & { readonly __brand: 'SortCode' };
export type BSBString = string & { readonly __brand: 'BSB' };
export type BankleitzahlString = string & { readonly __brand: 'Bankleitzahl' };
export type TransitNumberString = string & { readonly __brand: 'TransitNumber' };

export interface ValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

export interface IBANCountrySpec {
  countryCode: string;
  length: number;
  bbanPattern: RegExp;
}

export const IBAN_COUNTRY_SPECS: Record<string, IBANCountrySpec> = {
  SA: { countryCode: 'SA', length: 24, bbanPattern: /^[0-9]{22}$/ },
  AE: { countryCode: 'AE', length: 23, bbanPattern: /^[0-9]{21}$/ },
  GB: { countryCode: 'GB', length: 22, bbanPattern: /^[A-Z]{4}[0-9]{14}$/ },
  DE: { countryCode: 'DE', length: 22, bbanPattern: /^[0-9]{18}$/ },
  FR: { countryCode: 'FR', length: 27, bbanPattern: /^[0-9]{10}[A-Z0-9]{11}[0-9]{2}$/ },
  KW: { countryCode: 'KW', length: 30, bbanPattern: /^[A-Z]{4}[A-Z0-9]{22}$/ },
  QA: { countryCode: 'QA', length: 29, bbanPattern: /^[A-Z]{4}[A-Z0-9]{21}$/ },
  BH: { countryCode: 'BH', length: 22, bbanPattern: /^[A-Z]{4}[A-Z0-9]{14}$/ },
  OM: { countryCode: 'OM', length: 23, bbanPattern: /^[A-Z]{3}[0-9]{16}$/ },
  JO: { countryCode: 'JO', length: 30, bbanPattern: /^[A-Z]{4}[0-9]{22}$/ },
  EG: { countryCode: 'EG', length: 29, bbanPattern: /^[0-9]{27}$/ },
};

export const REGEX = {
  SWIFT_BIC: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  ABA_ROUTING: /^\d{9}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  SORT_CODE: /^\d{2}-?\d{2}-?\d{2}$/,
  BSB: /^\d{3}-?\d{3}$/,
  BANKLEITZAHL: /^\d{8}$/,
  TRANSIT_NUMBER: /^\d{9}$/,
  IBAN_BASIC: /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-().]{7,20}$/,
  ARABIC: /[\u0600-\u06FF]/,
  ENGLISH_NAME: /^[a-zA-Z\s.'\-]+$/,
};

function ibanChecksum(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged
    .toUpperCase()
    .split('')
    .map((ch) => {
      const code = ch.charCodeAt(0);
      return code >= 65 && code <= 90 ? String(code - 55) : ch;
    })
    .join('');
  let remainder = 0;
  for (let i = 0; i < numeric.length; i++) {
    remainder = (remainder * 10 + parseInt(numeric[i], 10)) % 97;
  }
  return remainder === 1;
}

export function validateIBAN(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'IBAN is required' };
  const normalized = value.replace(/\s/g, '').toUpperCase();
  if (!REGEX.IBAN_BASIC.test(normalized)) return { valid: false, error: 'Invalid IBAN format' };
  const countryCode = normalized.slice(0, 2);
  const spec = IBAN_COUNTRY_SPECS[countryCode];
  if (spec && normalized.length !== spec.length) {
    return { valid: false, error: `IBAN for ${countryCode} must be ${spec.length} characters` };
  }
  if (normalized.length < 15 || normalized.length > 34) {
    return { valid: false, error: 'IBAN must be between 15 and 34 characters' };
  }
  if (!ibanChecksum(normalized)) return { valid: false, error: 'Invalid IBAN checksum' };
  return { valid: true, normalized };
}

export function validateSWIFT(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'SWIFT/BIC code is required' };
  const normalized = value.trim().toUpperCase();
  if (!REGEX.SWIFT_BIC.test(normalized)) {
    return { valid: false, error: 'SWIFT/BIC must be 8 or 11 characters (e.g. RJHISARI or RJHISARI123)' };
  }
  return { valid: true, normalized };
}

export function validateABA(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'ABA routing number is required' };
  const normalized = value.trim().replace(/\s/g, '');
  if (!REGEX.ABA_ROUTING.test(normalized)) return { valid: false, error: 'ABA routing number must be exactly 9 digits' };
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1];
  const sum = normalized.split('').reduce((acc, digit, i) => acc + parseInt(digit, 10) * weights[i], 0);
  if (sum % 10 !== 0) return { valid: false, error: 'Invalid ABA routing number checksum' };
  return { valid: true, normalized };
}

export function validateIFSC(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'IFSC code is required' };
  const normalized = value.trim().toUpperCase();
  if (!REGEX.IFSC.test(normalized)) {
    return { valid: false, error: 'IFSC must be 11 characters: 4 letters, 0, then 6 alphanumeric (e.g. HDFCINBB001)' };
  }
  return { valid: true, normalized };
}

export function validateSortCode(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'Sort code is required' };
  const normalized = value.trim().replace(/-/g, '');
  if (!/^\d{6}$/.test(normalized)) return { valid: false, error: 'Sort code must be 6 digits (XX-XX-XX)' };
  const formatted = `${normalized.slice(0, 2)}-${normalized.slice(2, 4)}-${normalized.slice(4, 6)}`;
  return { valid: true, normalized: formatted };
}

export function validateBSB(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'BSB number is required' };
  const normalized = value.trim().replace(/-/g, '');
  if (!/^\d{6}$/.test(normalized)) return { valid: false, error: 'BSB number must be 6 digits (XXX-XXX)' };
  const formatted = `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}`;
  return { valid: true, normalized: formatted };
}

export function validateBankleitzahl(value: string): ValidationResult {
  if (!value || value.trim() === '') return { valid: false, error: 'Bankleitzahl is required' };
  const normalized = value.trim().replace(/\s/g, '');
  if (!REGEX.BANKLEITZAHL.test(normalized)) return { valid: false, error: 'Bankleitzahl must be exactly 8 digits' };
  return { valid: true, normalized };
}

export function validateRoutingField(fieldKey: string, value: string): ValidationResult {
  switch (fieldKey) {
    case 'swiftCode': return validateSWIFT(value);
    case 'routingNumber': return validateABA(value);
    case 'ifscCode': return validateIFSC(value);
    case 'sortCode': return validateSortCode(value);
    case 'bsbNumber': return validateBSB(value);
    case 'bankleitzahl': return validateBankleitzahl(value);
    default: return { valid: true };
  }
}

export function normalizeIBAN(value: string): string {
  return value.replace(/\s/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
}

export function maskIBAN(iban: string): string {
  if (iban.length <= 8) return iban;
  return iban.slice(0, 4) + ' •••• •••• ' + iban.slice(-4);
}

export function getIBANLength(countryCode: string): number | null {
  return IBAN_COUNTRY_SPECS[countryCode]?.length ?? null;
}

export const COUNTRY_REQUIRES_IBAN: readonly string[] = [
  'SA', 'AE', 'GB', 'DE', 'FR', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG',
] as const;

export function requiresIBAN(countryCode: string): boolean {
  return (COUNTRY_REQUIRES_IBAN as readonly string[]).includes(countryCode);
}
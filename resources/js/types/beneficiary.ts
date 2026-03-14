export interface Beneficiary {
    id: string;
    nameAr: string;
    nameEn: string;
    accountNumber: string;
    iban: string;
    bankName: string;
    swiftCode: string;
    country: string;
    currency: string;
    category: string;
    notes?: string;
}

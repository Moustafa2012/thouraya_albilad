import { create } from 'zustand';
import type { Beneficiary } from '@/types';

interface AppState {
  beneficiaries: Beneficiary[];
  addBeneficiary: (beneficiary: Omit<Beneficiary, 'id'>) => void;
  updateBeneficiary: (id: string, beneficiary: Partial<Beneficiary>) => void;
  deleteBeneficiary: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  beneficiaries: [
    {
      id: '1',
      nameAr: 'شركة التقنية المتقدمة',
      nameEn: 'Advanced Tech Co.',
      accountNumber: '1234567890',
      iban: 'SA0380000000608010167519',
      bankName: 'Al Rajhi Bank',
      swiftCode: 'RJHIXS',
      country: 'المملكة العربية السعودية',
      currency: 'SAR',
      category: 'suppliers',
      notes: 'مورد أجهزة حاسب آلي',
    },
    {
      id: '2',
      nameAr: 'محمد عبد الله',
      nameEn: 'Mohammed Abdullah',
      accountNumber: '0987654321',
      iban: 'SA0380000000608010167520',
      bankName: 'SNB',
      swiftCode: 'NCBKXS',
      country: 'المملكة العربية السعودية',
      currency: 'SAR',
      category: 'employees',
    },
  ],
  addBeneficiary: (beneficiary) =>
    set((state) => ({
      beneficiaries: [
        ...state.beneficiaries,
        { ...beneficiary, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  updateBeneficiary: (id, updatedBeneficiary) =>
    set((state) => ({
      beneficiaries: state.beneficiaries.map((b) =>
        b.id === id ? { ...b, ...updatedBeneficiary } : b
      ),
    })),
  deleteBeneficiary: (id) =>
    set((state) => ({
      beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
    })),
}));

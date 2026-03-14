import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { StepBank } from '@/components/Banks/steps/Bank';
import { INITIAL_FORM_DATA, BankAccountFormData } from '@/components/Banks/types';

// Mock the BankAccountData module
vi.mock('@/components/Banks/BankAccountData', () => ({
    COUNTRIES: [
        {
            code: 'SA',
            nameEn: 'Saudi Arabia',
            nameAr: 'المملكة العربية السعودية',
            flag: '🇸🇦',
            ibanPrefix: 'SA',
            ibanLength: 24,
            routingFields: [
                {
                    key: 'swiftCode',
                    labelEn: 'SWIFT / BIC Code',
                    labelAr: 'رمز السويفت / BIC',
                    placeholder: 'e.g. RJHISARI',
                    hintEn: '8 or 11 character code identifying the bank globally.',
                    hintAr: 'رمز من 8 أو 11 حرفًا يُعرّف البنك دوليًا.',
                    maxLength: 11
                },
            ],
        },
        {
            code: 'US',
            nameEn: 'United States',
            nameAr: 'الولايات المتحدة الأمريكية',
            flag: '🇺🇸',
            routingFields: [],
        }
    ],
    BANKS: {
        SA: [
            {
                nameEn: 'Al Rajhi Bank',
                nameAr: 'مصرف الراجحي',
                swiftEn: 'RJHISARI',
                phone: '920000802',
                email: 'info@alrajhibank.com.sa',
                website: 'www.alrajhibank.com.sa'
            },
        ],
        US: []
    }
}));

// Mock the UI components
vi.mock('@/components/ui/country-dropdown', () => ({
    CountryDropdown: ({ onChange, defaultValue, placeholder }: any) => (
        <select
            data-testid="country-select"
            value={defaultValue}
            onChange={(e) => onChange({ alpha2: e.target.value })}
        >
            <option value="">{placeholder}</option>
            <option value="SA">Saudi Arabia</option>
            <option value="US">United States</option>
        </select>
    )
}));

vi.mock('@/components/ui/select', () => ({
    Select: ({ onValueChange, value, children }: any) => (
        <div data-testid="mock-select-container">
            <select
                data-testid="internal-select"
                onChange={(e) => onValueChange(e.target.value)}
                value={value}
            >
                <option value="">Empty</option>
                <option value="Al Rajhi Bank">Al Rajhi Bank</option>
                <option value="__custom__">Custom Bank</option>
            </select>
            {children}
        </div>
    ),
    SelectTrigger: ({ children }: any) => <div>{children}</div>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
}));

vi.mock('@/components/ui/phone-input', () => ({
    PhoneInput: ({ onChange, defaultValue, placeholder }: any) => (
        <input
            data-testid="phone-input"
            defaultValue={defaultValue?.digits ?? defaultValue?.phone}
            placeholder={placeholder}
            onChange={(e) => onChange({ digits: e.target.value, phone: e.target.value })}
        />
    ),
    lookupCountry: () => 'SA',
}));

describe('StepBank', () => {
    // Mock T returns the fallback (Arabic) as per implementation
    const mockT = (key: string, fallback?: string) => fallback || key;
    const mockSet = vi.fn();

    const defaultProps = {
        formData: INITIAL_FORM_DATA,
        errors: {},
        isRtl: false,
        t: mockT,
        set: mockSet,
    };

    it('renders correctly', () => {
        render(<StepBank {...defaultProps} />);
        expect(screen.getByText('معلومات البنك')).toBeInTheDocument();
        expect(screen.getByTestId('country-select')).toBeInTheDocument();
    });

    it('handles country selection and resets fields', () => {
        render(<StepBank {...defaultProps} />);
        
        fireEvent.change(screen.getByTestId('country-select'), { target: { value: 'SA' } });
        
        expect(mockSet).toHaveBeenCalledWith('bankCountry', 'SA');
        // It should also reset bank details
        expect(mockSet).toHaveBeenCalledWith('bankName', '');
        expect(mockSet).toHaveBeenCalledWith('bankSwift', '');
    });

    it('shows bank selection when country is selected', () => {
        const props = {
            ...defaultProps,
            formData: { ...INITIAL_FORM_DATA, bankCountry: 'SA' }
        };
        render(<StepBank {...props} />);
        
        expect(screen.getByText('Bank Name')).toBeInTheDocument();
        // Check for the placeholder text of the SelectTrigger
        expect(screen.getByText('اختر البنك')).toBeInTheDocument();
    });

    it('autofills details when a bank is selected', () => {
        const props = {
            ...defaultProps,
            formData: { ...INITIAL_FORM_DATA, bankCountry: 'SA' }
        };
        render(<StepBank {...props} />);
        
        // Find the select associated with 'اختر البنك'
        const trigger = screen.getByText('اختر البنك');
        const container = trigger.closest('[data-testid="mock-select-container"]');
        const select = container?.querySelector('select');
        
        if (!select) throw new Error('Select not found');

        fireEvent.change(select, { target: { value: 'Al Rajhi Bank' } });
        
        expect(mockSet).toHaveBeenCalledWith('bankName', 'Al Rajhi Bank');
        expect(mockSet).toHaveBeenCalledWith('bankSwift', 'RJHISARI');
        expect(mockSet).toHaveBeenCalledWith('bankPhone', '920000802');
    });

    it('handles custom bank selection', () => {
        const props = {
            ...defaultProps,
            formData: { ...INITIAL_FORM_DATA, bankCountry: 'SA' }
        };
        render(<StepBank {...props} />);
        
        const trigger = screen.getByText('اختر البنك');
        const container = trigger.closest('[data-testid="mock-select-container"]');
        const select = container?.querySelector('select');

        if (!select) throw new Error('Select not found');

        fireEvent.change(select, { target: { value: '__custom__' } });
        
        // Should reset fields for manual entry
        expect(mockSet).toHaveBeenCalledWith('bankName', '');
        expect(mockSet).toHaveBeenCalledWith('bankSwift', '');
    });

    it('displays validation errors', () => {
        const props = {
            ...defaultProps,
            errors: { bankCountry: 'Country is required' }
        };
        render(<StepBank {...props} />);
        
        expect(screen.getByText('Country is required')).toBeInTheDocument();
    });
});

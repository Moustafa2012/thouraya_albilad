import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateBankAccount from '@/pages/Createbankaccount';
import { useLanguage } from '@/components/language-provider';
import type { BankAccount } from '@/components/Banks/types';

// Mock the language provider
vi.mock('@/components/language-provider', () => ({
  useLanguage: vi.fn(() => ({
    t: (en: string, ar: string) => en,
    direction: 'ltr',
  })),
}));

// Mock Inertia router
vi.mock('@inertiajs/react', () => ({
  router: {
    post: vi.fn(),
    put: vi.fn(),
    visit: vi.fn(),
  },
  usePage: vi.fn(() => ({
    props: {
      flash: {},
      account: null,
      isEdit: false,
    },
  })),
  Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock AppLayout
vi.mock('@/layouts/app-layout', () => ({
  default: ({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs: any[] }) => (
    <div>
      <div data-testid="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>{crumb.title}</span>
        ))}
      </div>
      {children}
    </div>
  ),
}));

// Mock step components
vi.mock('@/components/Banks/steps/account-type', () => ({
  StepAccountType: ({ formData, set, errors }: any) => (
    <div>
      <h2>Account Type Step</h2>
      <select
        data-testid="account-category"
        value={formData.accountCategory}
        onChange={(e) => set('accountCategory', e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="personal">Personal</option>
        <option value="business">Business</option>
      </select>
      {errors.accountCategory && <span data-testid="error-account-category">{errors.accountCategory}</span>}
    </div>
  ),
}));

vi.mock('@/components/Banks/steps/holder', () => ({
  StepHolder: ({ formData, set, errors }: any) => (
    <div>
      <h2>Account Holder Step</h2>
      <input
        data-testid="holder-name-en"
        value={formData.holderNameEn}
        onChange={(e) => set('holderNameEn', e.target.value)}
        placeholder="Holder Name (EN)"
      />
      <input
        data-testid="holder-name-ar"
        value={formData.holderNameAr}
        onChange={(e) => set('holderNameAr', e.target.value)}
        placeholder="Holder Name (AR)"
      />
      {formData.accountCategory === 'personal' && (
        <>
          <input
            data-testid="account-holder-name"
            value={formData.accountHolderName}
            onChange={(e) => set('accountHolderName', e.target.value)}
            placeholder="Account Holder Name"
          />
          <input
            data-testid="date-of-birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => set('dateOfBirth', e.target.value)}
          />
          <input
            data-testid="ssn-last-4"
            value={formData.ssnLast4}
            onChange={(e) => set('ssnLast4', e.target.value)}
            placeholder="SSN Last 4"
          />
        </>
      )}
      {formData.accountCategory === 'business' && (
        <>
          <input
            data-testid="business-name"
            value={formData.businessName}
            onChange={(e) => set('businessName', e.target.value)}
            placeholder="Business Name"
          />
          <input
            data-testid="business-type"
            value={formData.businessType}
            onChange={(e) => set('businessType', e.target.value)}
            placeholder="Business Type"
          />
          <input
            data-testid="tax-id"
            value={formData.taxId}
            onChange={(e) => set('taxId', e.target.value)}
            placeholder="Tax ID"
          />
        </>
      )}
      {errors.holderNameEn && <span data-testid="error-holder-name-en">{errors.holderNameEn}</span>}
    </div>
  ),
}));

vi.mock('@/components/Banks/steps/Bank', () => ({
  StepBank: ({ formData, set, errors }: any) => (
    <div>
      <h2>Bank Information Step</h2>
      <input
        data-testid="bank-name"
        value={formData.bankName}
        onChange={(e) => set('bankName', e.target.value)}
        placeholder="Bank Name"
      />
      <input
        data-testid="account-number"
        value={formData.accountNumber}
        onChange={(e) => set('accountNumber', e.target.value)}
        placeholder="Account Number"
      />
      <input
        data-testid="iban"
        value={formData.iban}
        onChange={(e) => set('iban', e.target.value)}
        placeholder="IBAN"
      />
      <input
        data-testid="currency"
        value={formData.currency}
        onChange={(e) => set('currency', e.target.value)}
        placeholder="Currency"
      />
      <input
        data-testid="routing-number"
        value={formData.routingNumber}
        onChange={(e) => set('routingNumber', e.target.value)}
        placeholder="Routing Number"
      />
      {errors.bankName && <span data-testid="error-bank-name">{errors.bankName}</span>}
      {errors.accountNumber && <span data-testid="error-account-number">{errors.accountNumber}</span>}
    </div>
  ),
}));

vi.mock('@/components/Banks/steps/category', () => ({
  StepCategory: ({ formData, set, errors }: any) => (
    <div>
      <h2>Account Details Step</h2>
      <input
        data-testid="account-type"
        value={formData.accountType}
        onChange={(e) => set('accountType', e.target.value)}
        placeholder="Account Type"
      />
      {errors.accountType && <span data-testid="error-account-type">{errors.accountType}</span>}
    </div>
  ),
}));

vi.mock('@/components/Banks/steps/Settings', () => ({
  StepSettings: ({ formData, set, errors }: any) => (
    <div>
      <h2>Settings Step</h2>
      <label>
        <input
          type="checkbox"
          data-testid="is-default"
          checked={formData.isDefault}
          onChange={(e) => set('isDefault', e.target.checked)}
        />
        Set as default account
      </label>
      <textarea
        data-testid="notes"
        value={formData.notes}
        onChange={(e) => set('notes', e.target.value)}
        placeholder="Notes"
      />
      {errors.notes && <span data-testid="error-notes">{errors.notes}</span>}
    </div>
  ),
}));

// Mock validation functions
vi.mock('@/components/Banks/BankAccountValidation', () => ({
  validateStep: vi.fn(() => ({})),
  validateAllSteps: vi.fn(() => []),
  hasErrors: vi.fn(() => false),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

describe('CreateBankAccount - Adding New Bank Account', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the create bank account form with all steps', () => {
    renderWithRouter(<CreateBankAccount />);

    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('Account Type Step')).toBeInTheDocument();
    expect(screen.getByTestId('account-category')).toBeInTheDocument();
  });

  it('allows navigation through steps for personal account creation', async () => {
    renderWithRouter(<CreateBankAccount />);

    // Step 1: Select Personal category
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'personal' } });

    // Click next button
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should be on Step 2: Account Holder
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
      expect(screen.getByText('Account Holder Step')).toBeInTheDocument();
    });

    // Fill personal holder information
    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('holder-name-ar'), { target: { value: 'جون دو' } });
    fireEvent.change(screen.getByTestId('account-holder-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('date-of-birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('ssn-last-4'), { target: { value: '1234' } });

    // Click next button
    fireEvent.click(nextButton);

    // Should be on Step 3: Bank Information
    await waitFor(() => {
      expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
      expect(screen.getByText('Bank Information Step')).toBeInTheDocument();
    });

    // Fill bank information
    fireEvent.change(screen.getByTestId('bank-name'), { target: { value: 'Al Rajhi Bank' } });
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('iban'), { target: { value: 'SA0380000000608010167519' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });
    fireEvent.change(screen.getByTestId('routing-number'), { target: { value: '123456789' } });

    // Click next button
    fireEvent.click(nextButton);

    // Should be on Step 4: Account Details
    await waitFor(() => {
      expect(screen.getByText('Step 4 of 5')).toBeInTheDocument();
      expect(screen.getByText('Account Details Step')).toBeInTheDocument();
    });

    // Fill account details
    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'current' } });

    // Click next button
    fireEvent.click(nextButton);

    // Should be on Step 5: Settings
    await waitFor(() => {
      expect(screen.getByText('Step 5 of 5')).toBeInTheDocument();
      expect(screen.getByText('Settings Step')).toBeInTheDocument();
    });

    // Set as default and add notes
    fireEvent.click(screen.getByTestId('is-default'));
    fireEvent.change(screen.getByTestId('notes'), { target: { value: 'Primary personal account' } });
  });

  it('allows navigation through steps for business account creation', async () => {
    renderWithRouter(<CreateBankAccount />);

    // Step 1: Select Business category
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'business' } });

    // Click next button
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should be on Step 2: Account Holder (Business fields)
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
      expect(screen.getByText('Account Holder Step')).toBeInTheDocument();
    });

    // Fill business holder information
    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'Tech Solutions' } });
    fireEvent.change(screen.getByTestId('holder-name-ar'), { target: { value: 'شركة التقنية' } });
    fireEvent.change(screen.getByTestId('business-name'), { target: { value: 'Tech Solutions Ltd' } });
    fireEvent.change(screen.getByTestId('business-type'), { target: { value: 'LLC' } });
    fireEvent.change(screen.getByTestId('tax-id'), { target: { value: '300000000000003' } });

    // Click next button
    fireEvent.click(nextButton);

    // Should be on Step 3: Bank Information
    await waitFor(() => {
      expect(screen.getByText('Step 3 of 5')).toBeInTheDocument();
      expect(screen.getByText('Bank Information Step')).toBeInTheDocument();
    });

    // Fill bank information
    fireEvent.change(screen.getByTestId('bank-name'), { target: { value: 'National Commercial Bank' } });
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByTestId('iban'), { target: { value: 'SA4400000000010000000001' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });
    fireEvent.change(screen.getByTestId('routing-number'), { target: { value: '987654321' } });

    // Continue to final steps
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByText('Step 4 of 5')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'business' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Step 5 of 5')).toBeInTheDocument();
    });
  });

  it('submits personal bank account form with correct payload', async () => {
    const { router } = require('@inertiajs/react');
    
    renderWithRouter(<CreateBankAccount />);

    // Complete all steps for personal account
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'personal' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('holder-name-en')).toBeInTheDocument();
    });

    // Fill all required fields
    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('holder-name-ar'), { target: { value: 'جون دو' } });
    fireEvent.change(screen.getByTestId('account-holder-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('date-of-birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('ssn-last-4'), { target: { value: '1234' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('bank-name')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('bank-name'), { target: { value: 'Al Rajhi Bank' } });
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('iban'), { target: { value: 'SA0380000000608010167519' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });
    fireEvent.change(screen.getByTestId('routing-number'), { target: { value: '123456789' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('account-type')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'current' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('is-default')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('is-default'));
    fireEvent.change(screen.getByTestId('notes'), { target: { value: 'Primary personal account' } });

    // Submit the form
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(router.post).toHaveBeenCalledWith('/bank-accounts', expect.objectContaining({
        account_category: 'personal',
        account_holder_name: 'John Doe',
        date_of_birth: '1990-01-01',
        ssn_last_4: '1234',
        holder_name_en: 'John Doe',
        holder_name_ar: 'جون دو',
        bank_name: 'Al Rajhi Bank',
        account_number: '1234567890',
        iban: 'SA0380000000608010167519',
        currency: 'SAR',
        routing_number: '123456789',
        account_type: 'current',
        is_default: true,
        notes: 'Primary personal account',
      }), expect.any(Object));
    });
  });

  it('submits business bank account form with correct payload', async () => {
    const { router } = require('@inertiajs/react');
    
    renderWithRouter(<CreateBankAccount />);

    // Complete all steps for business account
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'business' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('business-name')).toBeInTheDocument();
    });

    // Fill all required business fields
    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'Tech Solutions' } });
    fireEvent.change(screen.getByTestId('holder-name-ar'), { target: { value: 'شركة التقنية' } });
    fireEvent.change(screen.getByTestId('business-name'), { target: { value: 'Tech Solutions Ltd' } });
    fireEvent.change(screen.getByTestId('business-type'), { target: { value: 'LLC' } });
    fireEvent.change(screen.getByTestId('tax-id'), { target: { value: '300000000000003' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('bank-name')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('bank-name'), { target: { value: 'National Commercial Bank' } });
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByTestId('iban'), { target: { value: 'SA4400000000010000000001' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });
    fireEvent.change(screen.getByTestId('routing-number'), { target: { value: '987654321' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('account-type')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'business' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('is-default')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('notes'), { target: { value: 'Primary business account' } });

    // Submit the form
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(router.post).toHaveBeenCalledWith('/bank-accounts', expect.objectContaining({
        account_category: 'business',
        business_name: 'Tech Solutions Ltd',
        business_type: 'LLC',
        tax_id: '300000000000003',
        holder_name_en: 'Tech Solutions',
        holder_name_ar: 'شركة التقنية',
        bank_name: 'National Commercial Bank',
        account_number: '9876543210',
        iban: 'SA4400000000010000000001',
        currency: 'SAR',
        routing_number: '987654321',
        account_type: 'business',
        is_default: false,
        notes: 'Primary business account',
      }), expect.any(Object));
    });
  });

  it('shows validation errors when required fields are missing', async () => {
    const { validateStep, hasErrors } = require('@/components/Banks/BankAccountValidation');
    
    validateStep.mockReturnValue({ accountCategory: 'Account category is required' });
    hasErrors.mockReturnValue(true);

    renderWithRouter(<CreateBankAccount />);

    // Try to proceed without selecting category
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-account-category')).toBeInTheDocument();
      expect(screen.getByText('Account category is required')).toBeInTheDocument();
    });
  });

  it('allows backward navigation between steps', async () => {
    renderWithRouter(<CreateBankAccount />);

    // Step 1: Select category and go to step 2
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'personal' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
    });

    // Go back to step 1
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByText('Step 1 of 5')).toBeInTheDocument();
      expect(screen.getByTestId('account-category')).toBeInTheDocument();
    });

    // Verify selection is preserved
    expect(categorySelect).toHaveValue('personal');
  });

  it('shows success notification when account is created successfully', async () => {
    const { router } = require('@inertiajs/react');
    
    // Mock successful response
    router.post.mockImplementation((url: any, data: any, options: any) => {
      options.onSuccess();
    });

    renderWithRouter(<CreateBankAccount />);

    // Complete minimal required fields
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'personal' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('holder-name-en')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('account-holder-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('date-of-birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('ssn-last-4'), { target: { value: '1234' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('bank-name')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('bank-name'), { target: { value: 'Test Bank' } });
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });

    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByTestId('account-type')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'current' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    // Submit the form
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Account created successfully.')).toBeInTheDocument();
    });
  });

  it('shows error notification when account creation fails', async () => {
    const { router } = require('@inertiajs/react');
    
    // Mock error response
    router.post.mockImplementation((url: any, data: any, options: any) => {
      options.onError({ bank_name: 'Bank name is required' });
    });

    renderWithRouter(<CreateBankAccount />);

    // Complete minimal required fields
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'personal' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('holder-name-en')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('account-holder-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('date-of-birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('ssn-last-4'), { target: { value: '1234' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('bank-name')).toBeInTheDocument();
    });

    // Don't fill bank name to trigger validation error
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });

    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByTestId('account-type')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'current' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    // Submit the form
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Bank name is required')).toBeInTheDocument();
    });
  });

  it('prevents double submission when clicking submit multiple times', async () => {
    const { router } = require('@inertiajs/react');
    
    renderWithRouter(<CreateBankAccount />);

    // Complete all steps quickly
    const categorySelect = screen.getByTestId('account-category');
    fireEvent.change(categorySelect, { target: { value: 'personal' } });

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('holder-name-en')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('holder-name-en'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('account-holder-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('date-of-birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByTestId('ssn-last-4'), { target: { value: '1234' } });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('bank-name')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('bank-name'), { target: { value: 'Test Bank' } });
    fireEvent.change(screen.getByTestId('account-number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('currency'), { target: { value: 'SAR' } });

    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(screen.getByTestId('account-type')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId('account-type'), { target: { value: 'current' } });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    // Try to submit multiple times
    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    // Should only call router.post once
    await waitFor(() => {
      expect(router.post).toHaveBeenCalledTimes(1);
    });
  });
});

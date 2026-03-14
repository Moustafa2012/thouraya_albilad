import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { StepSettings } from '@/components/Banks/steps/Settings';
import { INITIAL_FORM_DATA } from '@/components/Banks/types';

// Mock UI components
vi.mock('@/components/ui/select', () => ({
    Select: ({ onValueChange, value, children }: any) => (
        <div data-testid="mock-select-container">
            <select
                data-testid="mock-select"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
            >
                {/* We can't easily render children as options here because children are components */}
                <option value="50000">SAR 50,000</option>
                <option value="monthly">Monthly statements</option>
            </select>
            {/* Render children hidden or just for existence check */}
            <div style={{ display: 'none' }}>{children}</div>
        </div>
    ),
    SelectTrigger: ({ children }: any) => <div>{children}</div>,
    SelectValue: () => null,
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ value, children }: any) => <option value={value}>{children}</option>,
}));

vi.mock('@/components/ui/switch', () => ({
    Switch: ({ checked, onCheckedChange }: any) => (
        <input
            type="checkbox"
            data-testid="mock-switch"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
        />
    ),
}));

vi.mock('@/components/ui/textarea', () => ({
    Textarea: (props: any) => <textarea {...props} />,
}));

describe('StepSettings', () => {
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
        render(<StepSettings {...defaultProps} />);
        expect(screen.getByText('إعدادات الحساب')).toBeInTheDocument();
        expect(screen.getByText('الحساب الافتراضي')).toBeInTheDocument();
        expect(screen.getByText('نشط')).toBeInTheDocument();
    });

    it('handles toggle switches', () => {
        render(<StepSettings {...defaultProps} />);
        
        const switches = screen.getAllByTestId('mock-switch');
        
        // Default Account switch (first one)
        fireEvent.click(switches[0]);
        expect(mockSet).toHaveBeenCalledWith('isDefault', true);

        // Active switch (second one)
        fireEvent.click(switches[1]);
        expect(mockSet).toHaveBeenCalledWith('isActive', false); // Toggling from true (default) to false
    });

    it('handles text inputs', () => {
        render(<StepSettings {...defaultProps} />);
        
        // Using Arabic fallback because mockT returns the second argument
        const accountPurposeInput = screen.getByPlaceholderText('صف الغرض الأساسي من هذا الحساب…');
        fireEvent.change(accountPurposeInput, { target: { value: 'Savings' } });
        expect(mockSet).toHaveBeenCalledWith('accountPurpose', 'Savings');

        const notesInput = screen.getByPlaceholderText('أي ملاحظات إضافية حول هذا الحساب…');
        fireEvent.change(notesInput, { target: { value: 'Some notes' } });
        expect(mockSet).toHaveBeenCalledWith('notes', 'Some notes');
    });

    it('displays character count for notes', () => {
        const props = {
            ...defaultProps,
            formData: { ...INITIAL_FORM_DATA, notes: 'Hello' }
        };
        render(<StepSettings {...props} />);
        
        // With the mockT returning the fallback, it should be 'حرف'
        expect(screen.getByText('5/500 حرف')).toBeInTheDocument();
    });
});

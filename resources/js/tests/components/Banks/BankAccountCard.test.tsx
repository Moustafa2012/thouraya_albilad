import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BankAccountCard } from '@/components/Banks/BankAccountCard';
import type { BankAccount } from '@/components/Banks/types';

const mockAccount: BankAccount = {
    id: '1',
    holderNameAr: 'أحمد',
    holderNameEn: 'Ahmed',
    bankName: 'Al Rajhi Bank',
    bankCountry: 'SA',
    accountNumber: '1234567890',
    iban: 'SA1234567890123456789012',
    swiftCode: 'RJHI',
    currency: 'SAR',
    accountType: 'current',
    accountCategory: 'personal',
    isDefault: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockT = (en: string, ar: string) => en;

describe('BankAccountCard', () => {
    it('renders account details correctly', () => {
        render(
            <BankAccountCard
                account={mockAccount}
                index={0}
                isIbanRevealed={false}
                isCopied={false}
                onDelete={() => {}}
                onSetDefault={() => {}}
                onToggleIban={() => {}}
                onCopy={() => {}}
                onEdit={() => {}}
                t={mockT}
                isRtl={false}
            />
        );

        expect(screen.getByText('Al Rajhi Bank')).toBeInTheDocument();
        expect(screen.getByText('Ahmed')).toBeInTheDocument();
        expect(screen.getByText('SAR')).toBeInTheDocument();
    });

    it('shows masked IBAN by default', () => {
        render(
            <BankAccountCard
                account={mockAccount}
                index={0}
                isIbanRevealed={false}
                isCopied={false}
                onDelete={() => {}}
                onSetDefault={() => {}}
                onToggleIban={() => {}}
                onCopy={() => {}}
                onEdit={() => {}}
                t={mockT}
                isRtl={false}
            />
        );

        expect(screen.getByText(/••••/)).toBeInTheDocument();
        expect(screen.queryByText('SA1234567890123456789012')).not.toBeInTheDocument();
    });

    it('shows full IBAN when revealed', () => {
        render(
            <BankAccountCard
                account={mockAccount}
                index={0}
                isIbanRevealed={true}
                isCopied={false}
                onDelete={() => {}}
                onSetDefault={() => {}}
                onToggleIban={() => {}}
                onCopy={() => {}}
                onEdit={() => {}}
                t={mockT}
                isRtl={false}
            />
        );

        expect(screen.getByText('SA1234567890123456789012')).toBeInTheDocument();
    });

    it('calls onToggleIban when show/hide button is clicked', () => {
        const onToggleIban = vi.fn();
        render(
            <BankAccountCard
                account={mockAccount}
                index={0}
                isIbanRevealed={false}
                isCopied={false}
                onDelete={() => {}}
                onSetDefault={() => {}}
                onToggleIban={onToggleIban}
                onCopy={() => {}}
                onEdit={() => {}}
                t={mockT}
                isRtl={false}
            />
        );

        fireEvent.click(screen.getByText('Show'));
        expect(onToggleIban).toHaveBeenCalledWith('1');
    });
});

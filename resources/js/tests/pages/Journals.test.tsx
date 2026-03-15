import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Journals from '@/pages/journals';

vi.mock('@/components/language-provider', () => ({
  useLanguage: vi.fn(() => ({
    t: (en: string, ar: string) => en,
    direction: 'ltr',
  })),
}));

vi.mock('@inertiajs/react', () => ({
  Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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

describe('Journals page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when there are no entries', () => {
    render(<Journals journals={[]} />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Journals')).toBeInTheDocument();
    expect(screen.getByText('No journal entries yet')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Add entry' }).length).toBeGreaterThan(0);
  });

  it('filters entries by search query', async () => {
    render(
      <Journals
        journals={[
          {
            id: 'j-1',
            date: '2026-03-15',
            description: 'Office supplies',
            reference: 'REF-001',
            type: 'general',
            status: 'posted',
            amount: 120,
            currency: 'SAR',
          },
          {
            id: 'j-2',
            date: '2026-03-16',
            description: 'Transfer to vendor',
            reference: 'INV-2026-001',
            type: 'transfer',
            status: 'pending',
            amount: 500,
            currency: 'SAR',
          },
        ]}
      />,
    );

    expect(screen.getByText('Office supplies')).toBeInTheDocument();
    expect(screen.getByText('Transfer to vendor')).toBeInTheDocument();

    const search = screen.getByLabelText('Search journals');
    fireEvent.change(search, { target: { value: 'office' } });

    expect(screen.getByText('Office supplies')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Transfer to vendor')).toBeNull();
    });
  });

  it('clears filters using the Clear button', () => {
    render(
      <Journals
        journals={[
          {
            id: 'j-1',
            date: '2026-03-15',
            description: 'Office supplies',
            reference: 'REF-001',
            type: 'general',
            status: 'posted',
            amount: 120,
            currency: 'SAR',
          },
          {
            id: 'j-2',
            date: '2026-03-16',
            description: 'Transfer to vendor',
            reference: 'INV-2026-001',
            type: 'transfer',
            status: 'pending',
            amount: 500,
            currency: 'SAR',
          },
        ]}
      />,
    );

    const search = screen.getByLabelText('Search journals');
    fireEvent.change(search, { target: { value: 'office' } });

    const clear = screen.getByRole('button', { name: 'Clear all filters' });
    fireEvent.click(clear);

    expect(screen.getByText('Office supplies')).toBeInTheDocument();
    expect(screen.getByText('Transfer to vendor')).toBeInTheDocument();
  });
});

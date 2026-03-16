import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateJournal from '@/pages/Createjournal';

vi.mock('@/components/language-provider', () => ({
  useLanguage: vi.fn(() => ({
    t: (en: string, ar: string) => en,
    direction: 'ltr',
  })),
}));

vi.mock('@inertiajs/react', () => {
  const router = {
    post: vi.fn(),
  };

  const useForm = (initial: any) => {
    const [data, setDataState] = React.useState(initial);
    const [processing] = React.useState(false);
    const [errors] = React.useState({});

    const setData = (key: any, value?: any) => {
      if (typeof key === 'string') {
        setDataState((prev: any) => ({ ...prev, [key]: value }));
      } else {
        setDataState(key);
      }
    };

    return {
      data,
      setData,
      processing,
      errors,
      clearErrors: vi.fn(),
      post: (url: string, options?: any) => {
        router.post(url, data, options);
      },
    };
  };

  return {
    router,
    useForm,
    usePage: vi.fn(() => ({
      props: {
        flash: {},
      },
    })),
    Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

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

describe('CreateJournal page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form', () => {
    render(<CreateJournal />);

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('Add journal entry')).toBeInTheDocument();
    expect(screen.getByText('Create entry')).toBeInTheDocument();
  });

  it('submits valid payload', async () => {
    const { router } = await import('@inertiajs/react');

    render(<CreateJournal />);

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-03-15' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. Office supplies'), { target: { value: 'Office supplies' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '120.00' } });

    fireEvent.click(screen.getByText('Create entry'));

    await waitFor(() => {
      expect(router.post).toHaveBeenCalledWith(
        '/journals',
        expect.objectContaining({
          date: '2026-03-15',
          description: 'Office supplies',
          amount: '120.00',
        }),
        expect.any(Object),
      );
    });
  });
});

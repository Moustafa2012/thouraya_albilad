import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepHolder } from '@/components/Banks/steps/holder';
import { INITIAL_FORM_DATA } from '@/components/Banks/types';

describe('StepHolder business mode visibility', () => {
  const t = (en: string, _ar: string) => en;
  const baseProps = {
    errors: {},
    isRtl: false,
    t,
    set: () => {},
  } as const;

  it('shows full name fields for personal accounts', () => {
    render(
      <StepHolder
        {...baseProps}
        formData={{ ...INITIAL_FORM_DATA, accountCategory: 'personal' }}
      />,
    );

    expect(screen.getByText('Full Name (Arabic)')).toBeInTheDocument();
    expect(screen.getByText('Full Name (English)')).toBeInTheDocument();
  });

  it('hides full name fields in business mode', () => {
    render(
      <StepHolder
        {...baseProps}
        formData={{ ...INITIAL_FORM_DATA, accountCategory: 'business' }}
      />,
    );

    expect(screen.queryByText('Full Name (Arabic)')).toBeNull();
    expect(screen.queryByText('Full Name (English)')).toBeNull();
  });
});


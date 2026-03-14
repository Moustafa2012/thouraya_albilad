import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StepCategory } from '@/components/Banks/steps/category';
import { INITIAL_FORM_DATA } from '@/components/Banks/types';

describe('StepCategory business mode routing visibility', () => {
  const t = (en: string, _ar: string) => en;
  const baseProps = {
    errors: {},
    isRtl: false,
    t,
    set: () => {},
  } as const;

  it('shows International Routing section for non-business accounts', () => {
    render(
      <StepCategory
        {...baseProps}
        formData={{ ...INITIAL_FORM_DATA, accountCategory: 'personal' }}
      />,
    );

    expect(screen.getByText('International Routing (Optional)')).toBeInTheDocument();
  });

  it('hides International Routing section in business mode', () => {
    render(
      <StepCategory
        {...baseProps}
        formData={{ ...INITIAL_FORM_DATA, accountCategory: 'business' }}
      />,
    );

    expect(
      screen.queryByText('International Routing (Optional)'),
    ).toBeNull();
  });
});


import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MultiLanguageSwitcher } from '@/components/MultiLanguageSwitcher';
import i18n from '@/services/i18n';

describe('MultiLanguageSwitcher', () => {
  it('renders with default language', () => {
    render(<MultiLanguageSwitcher />);

    expect(
      screen.getByText(/Welcome|Bienvenue|Bienvenido/),
    ).toBeInTheDocument();
  });

  it('switches language instantly', () => {
    render(<MultiLanguageSwitcher />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'fr' },
    });

    expect(i18n.language).toBe('fr');
  });

  it('persists preference in localStorage', () => {
    render(<MultiLanguageSwitcher />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'es' },
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'es');
  });
});

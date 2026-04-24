import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorRecoveryBoundary } from '@/components/error-recovery-boundary/ErrorRecoveryBoundary';

function Problematic() {
  throw new Error('Boom!');
}

describe('ErrorRecoveryBoundary', () => {
  it('renders fallback on error', () => {
    render(
      <ErrorRecoveryBoundary>
        <Problematic />
      </ErrorRecoveryBoundary>,
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });

  it('retry button resets error state', () => {
    render(
      <ErrorRecoveryBoundary>
        <Problematic />
      </ErrorRecoveryBoundary>,
    );

    fireEvent.click(screen.getByText('Retry'));
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});

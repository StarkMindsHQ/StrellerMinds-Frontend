import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityIndicator } from '@/components/ui/activity-indicator';
import { ActivityProvider, useActivity } from '@/contexts/activity-context';
import { act } from 'react-dom/test-utils';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const TestComponent = () => {
  const { startActivity, endActivity } = useActivity();
  return (
    <div>
      <button onClick={startActivity}>Start</button>
      <button onClick={endActivity}>End</button>
    </div>
  );
};

describe('ActivityIndicator', () => {
  it('is not visible by default', () => {
    const { container } = render(
      <ActivityProvider>
        <ActivityIndicator />
      </ActivityProvider>
    );
    // The bar has a specific class 'bg-primary'
    expect(container.querySelector('.bg-primary')).toBeNull();
  });

  it('becomes visible when activity starts', () => {
    const { container } = render(
      <ActivityProvider>
        <ActivityIndicator />
        <TestComponent />
      </ActivityProvider>
    );
    
    act(() => {
      screen.getByText('Start').click();
    });
    
    expect(container.querySelector('.bg-primary')).not.toBeNull();
  });

  it('stays visible if multiple activities are active', () => {
    const { container } = render(
      <ActivityProvider>
        <ActivityIndicator />
        <TestComponent />
      </ActivityProvider>
    );
    
    act(() => {
      screen.getByText('Start').click();
      screen.getByText('Start').click();
    });
    
    expect(container.querySelector('.bg-primary')).not.toBeNull();
    
    act(() => {
      screen.getByText('End').click();
    });
    
    expect(container.querySelector('.bg-primary')).not.toBeNull();
  });

  it('hides when all activities are ended', () => {
    const { container } = render(
      <ActivityProvider>
        <ActivityIndicator />
        <TestComponent />
      </ActivityProvider>
    );
    
    act(() => {
      screen.getByText('Start').click();
    });
    
    expect(container.querySelector('.bg-primary')).not.toBeNull();
    
    act(() => {
      screen.getByText('End').click();
    });
    
    expect(container.querySelector('.bg-primary')).toBeNull();
  });
});

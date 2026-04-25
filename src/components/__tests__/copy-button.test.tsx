import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from '@/components/ui/copy-button';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Copy: () => <div data-testid="copy-icon" />,
  Check: () => <div data-testid="check-icon" />,
}));

// Mock Sonner toast
const mockToast = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: (msg: string) => mockToast(msg),
    error: (msg: string) => mockToast(msg),
  },
}));

// Mock useCopyToClipboard hook
const mockCopy = vi.fn();
let mockCopied = false;
vi.mock('@/hooks/use-copy-to-clipboard', () => ({
  useCopyToClipboard: () => ({
    copied: mockCopied,
    copy: mockCopy,
  }),
}));

describe('CopyButton', () => {
  const value = 'Test text';

  beforeEach(() => {
    vi.clearAllMocks();
    mockCopied = false;
  });

  it('renders correctly with default label', () => {
    render(<CopyButton value={value} />);
    expect(screen.getByText('Copy')).toBeDefined();
    expect(screen.getByTestId('copy-icon')).toBeDefined();
  });

  it('renders with custom label', () => {
    render(<CopyButton value={value} label="Address" />);
    expect(screen.getByText('Address')).toBeDefined();
  });

  it('renders in iconMode', () => {
    render(<CopyButton value={value} iconMode />);
    expect(screen.queryByText('Copy')).toBeNull();
    expect(screen.getByTestId('copy-icon')).toBeDefined();
  });

  it('calls copy function when clicked', async () => {
    mockCopy.mockResolvedValue(true);
    render(<CopyButton value={value} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockCopy).toHaveBeenCalledWith(value);
  });

  it('shows success toast on successful copy', async () => {
    mockCopy.mockResolvedValue(true);
    render(<CopyButton value={value} label="Token" />);

    await fireEvent.click(screen.getByRole('button'));

    expect(mockToast).toHaveBeenCalledWith('Token copied!');
  });

  it('shows error toast on failed copy', async () => {
    mockCopy.mockResolvedValue(false);
    render(<CopyButton value={value} />);

    await fireEvent.click(screen.getByRole('button'));

    expect(mockToast).toHaveBeenCalledWith('Failed to copy to clipboard');
  });

  it('shows Copied state when copied is true', () => {
    mockCopied = true;
    render(<CopyButton value={value} />);

    expect(screen.getByText('Copied')).toBeDefined();
    expect(screen.getByTestId('check-icon')).toBeDefined();
  });
});

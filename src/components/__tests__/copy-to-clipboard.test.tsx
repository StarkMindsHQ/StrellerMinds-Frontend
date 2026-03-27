import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard';

const mockWriteText = vi.fn();
const mockToast = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (msg: string) => mockToast(msg),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
  mockWriteText.mockReset();
  mockToast.mockReset();

  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: mockWriteText },
    configurable: true,
    writable: true,
  });

  Object.defineProperty(window, 'isSecureContext', {
    value: true,
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CopyToClipboard', () => {
  it('renders with default aria-label when no label provided', () => {
    render(<CopyToClipboard text="hello" />);
    expect(
      screen.getByRole('button', { name: 'Copy to clipboard' }),
    ).toBeDefined();
  });

  it('renders with descriptive aria-label when label provided', () => {
    render(<CopyToClipboard text="0xabc" label="wallet address" />);
    expect(
      screen.getByRole('button', { name: 'Copy wallet address' }),
    ).toBeDefined();
  });

  it('calls navigator.clipboard.writeText with the correct text', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<CopyToClipboard text="0xdeadbeef" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(mockWriteText).toHaveBeenCalledWith('0xdeadbeef');
  });

  it('shows success state after copying', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<CopyToClipboard text="0xdeadbeef" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeDefined();
  });

  it('resets to idle state after 2000ms', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<CopyToClipboard text="abc" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeDefined();
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(
      screen.getByRole('button', { name: 'Copy to clipboard' }),
    ).toBeDefined();
  });

  it('fires toast with default message', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<CopyToClipboard text="abc" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(mockToast).toHaveBeenCalledWith('Copied!');
  });

  it('fires toast with label-based message when label provided', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<CopyToClipboard text="0xabc" label="wallet address" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(mockToast).toHaveBeenCalledWith('wallet address copied!');
  });

  it('fires toast with custom successMessage when provided', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(
      <CopyToClipboard text="abc" successMessage="Hash copied to clipboard" />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(mockToast).toHaveBeenCalledWith('Hash copied to clipboard');
  });

  it('does not fire toast when showToast is false', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<CopyToClipboard text="abc" showToast={false} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(mockToast).not.toHaveBeenCalled();
  });

  it('calls onCopy callback with the copied text', async () => {
    mockWriteText.mockResolvedValue(undefined);
    const onCopy = vi.fn();
    render(<CopyToClipboard text="0xabc123" onCopy={onCopy} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(onCopy).toHaveBeenCalledWith('0xabc123');
  });

  it('uses execCommand fallback when clipboard API is unavailable', async () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    });

    const execCommand = vi.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    render(<CopyToClipboard text="fallback-text" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(mockWriteText).not.toHaveBeenCalled();
  });

  it('renders children as label text', () => {
    render(<CopyToClipboard text="abc">Copy address</CopyToClipboard>);
    expect(screen.getByText('Copy address')).toBeDefined();
  });

  it('has an aria-live region for screen readers', () => {
    render(<CopyToClipboard text="abc" />);
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
  });
});

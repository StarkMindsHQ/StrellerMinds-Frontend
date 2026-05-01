import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InlineEditableField } from '@/components/ui/inline-editable-field';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  X: () => <div data-testid="x-icon" />,
  Pencil: () => <div data-testid="pencil-icon" />,
}));

describe('InlineEditableField', () => {
  const defaultProps = {
    value: 'Initial Value',
    onSave: vi.fn(),
    label: 'Test Field',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial value', () => {
    render(<InlineEditableField {...defaultProps} />);
    expect(screen.getByText('Initial Value')).toBeDefined();
  });

  it('switches to edit mode on click', () => {
    render(<InlineEditableField {...defaultProps} />);
    fireEvent.click(screen.getByText('Initial Value'));

    expect(screen.getByRole('textbox')).toBeDefined();
    expect(screen.getByDisplayValue('Initial Value')).toBeDefined();
    expect(screen.getByTestId('check-icon')).toBeDefined();
    expect(screen.getByTestId('x-icon')).toBeDefined();
  });

  it('calls onSave and exits edit mode when Check is clicked', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<InlineEditableField {...defaultProps} onSave={onSave} />);

    fireEvent.click(screen.getByText('Initial Value'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });

    fireEvent.click(screen.getByLabelText('Save'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('New Value');
    });

    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('calls onSave and exits edit mode on Enter key', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<InlineEditableField {...defaultProps} onSave={onSave} />);

    fireEvent.click(screen.getByText('Initial Value'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value via Enter' } });

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('New Value via Enter');
    });
  });

  it('cancels editing and reverts value when X is clicked', () => {
    const onCancel = vi.fn();
    render(<InlineEditableField {...defaultProps} onCancel={onCancel} />);

    fireEvent.click(screen.getByText('Initial Value'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Changed but Canceled' } });

    fireEvent.click(screen.getByLabelText('Cancel'));

    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText('Initial Value')).toBeDefined();
    expect(onCancel).toHaveBeenCalled();
  });

  it('cancels editing on Escape key', () => {
    render(<InlineEditableField {...defaultProps} />);

    fireEvent.click(screen.getByText('Initial Value'));
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByText('Initial Value')).toBeDefined();
  });

  it('shows validation error and prevents saving', () => {
    const validate = (val: string) => (val.length < 5 ? 'Too short' : null);
    const onSave = vi.fn();
    render(
      <InlineEditableField
        {...defaultProps}
        onSave={onSave}
        validate={validate}
      />,
    );

    fireEvent.click(screen.getByText('Initial Value'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });

    fireEvent.click(screen.getByLabelText('Save'));

    expect(screen.getByText('Too short')).toBeDefined();
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  it('shows loading state while saving', async () => {
    let resolveSave: (value: void | PromiseLike<void>) => void;
    const onSavePromise = new Promise<void>((resolve) => {
      resolveSave = resolve;
    });
    const onSave = vi.fn().mockReturnValue(onSavePromise);

    render(<InlineEditableField {...defaultProps} onSave={onSave} />);

    fireEvent.click(screen.getByText('Initial Value'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Loading Test' } });

    fireEvent.click(screen.getByLabelText('Save'));

    expect(input).toBeDisabled();
    expect(screen.getByLabelText('Save')).toBeDisabled();
    expect(screen.getByLabelText('Cancel')).toBeDisabled();

    await waitFor(() => resolveSave!());

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).toBeNull();
    });
  });
});

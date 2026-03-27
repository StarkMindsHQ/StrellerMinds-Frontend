import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/modal';
import { ConfirmModal } from '@/components/ui/confirm-modal';

describe('Modal', () => {
  it('renders content when open', () => {
    render(
      <Modal open={true} onOpenChange={vi.fn()} title="Test Modal">
        <p>Modal body</p>
      </Modal>,
    );
    expect(screen.getByText('Test Modal')).toBeDefined();
    expect(screen.getByText('Modal body')).toBeDefined();
  });

  it('does not render content when closed', () => {
    render(
      <Modal open={false} onOpenChange={vi.fn()} title="Test Modal">
        <p>Modal body</p>
      </Modal>,
    );
    expect(screen.queryByText('Test Modal')).toBeNull();
    expect(screen.queryByText('Modal body')).toBeNull();
  });

  it('renders description when provided', () => {
    render(
      <Modal
        open={true}
        onOpenChange={vi.fn()}
        title="Title"
        description="This is a description"
      >
        <p>body</p>
      </Modal>,
    );
    expect(screen.getByText('This is a description')).toBeDefined();
  });

  it('does not render description element when not provided', () => {
    render(
      <Modal open={true} onOpenChange={vi.fn()} title="Title">
        <p>body</p>
      </Modal>,
    );
    expect(
      document.querySelector('[data-slot="dialog-description"]'),
    ).toBeNull();
  });

  it('renders custom footer when provided', () => {
    render(
      <Modal
        open={true}
        onOpenChange={vi.fn()}
        title="Title"
        footer={<button>Custom Action</button>}
      >
        <p>body</p>
      </Modal>,
    );
    expect(screen.getByText('Custom Action')).toBeDefined();
  });

  it('calls onOpenChange(false) when Escape key is pressed', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Title">
        <p>body</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) when the close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <Modal open={true} onOpenChange={onOpenChange} title="Title">
        <p>body</p>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('ConfirmModal', () => {
  it('renders title and description', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={vi.fn()}
        title="Delete item"
        description="This cannot be undone."
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByText('Delete item')).toBeDefined();
    expect(screen.getByText('This cannot be undone.')).toBeDefined();
  });

  it('renders default button labels', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDefined();
  });

  it('renders custom button labels', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={vi.fn()}
        title="Delete"
        confirmLabel="Yes, delete"
        cancelLabel="No, keep it"
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'No, keep it' })).toBeDefined();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm"
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onOpenChange(false) when cancel button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <ConfirmModal
        open={true}
        onOpenChange={onOpenChange}
        title="Confirm"
        onConfirm={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disables buttons and shows spinner when isLoading is true', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={vi.fn()}
        title="Confirm"
        onConfirm={vi.fn()}
        isLoading={true}
      />,
    );
    const buttons = screen.getAllByRole('button');
    const actionButtons = buttons.filter(
      (b) =>
        b.textContent?.includes('Confirm') || b.textContent?.includes('Cancel'),
    );
    actionButtons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true);
    });
    expect(document.querySelector('.animate-spin')).not.toBeNull();
  });

  it('applies destructive variant to confirm button when variant="destructive"', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={vi.fn()}
        title="Delete"
        variant="destructive"
        onConfirm={vi.fn()}
      />,
    );
    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmBtn.className).toContain('destructive');
  });
});

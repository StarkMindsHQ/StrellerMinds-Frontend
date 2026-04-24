import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BulkUploadManager from '@/components/upload/BulkUploadManager';

describe('BulkUploadManager', () => {
  it('shows the selected file before upload starts', () => {
    const { container } = render(<BulkUploadManager />);
    const input = container.querySelector('input[type="file"]');

    expect(input).not.toBeNull();

    const file = new File(['hello'], 'notes.txt', { type: 'text/plain' });
    fireEvent.change(input as HTMLInputElement, {
      target: { files: [file] },
    });

    expect(screen.getByText(/notes.txt - pending/i)).toBeInTheDocument();
  });
});

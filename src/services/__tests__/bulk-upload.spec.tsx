import { render, screen, fireEvent } from '@testing-library/react';
import BulkUploadManager from '../src/components/upload/BulkUploadManager';

test('shows progress during upload', async () => {
  render(<BulkUploadManager />);
  const input = screen.getByRole('textbox'); // file input
  // simulate file selection and upload
});

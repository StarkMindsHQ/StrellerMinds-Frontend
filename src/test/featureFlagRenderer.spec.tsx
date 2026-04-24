import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureFlagRenderer } from '@/components/feature-flag-renderer/FeatureFlagRenderer';
import { FeatureFlagService } from '@/services/FeatureFlagService';

vi.mock('@/services/FeatureFlagService', () => ({
  FeatureFlagService: {
    isEnabled: vi.fn(),
    getVariant: vi.fn(),
  },
}));

describe('FeatureFlagRenderer', () => {
  beforeEach(() => {
    vi.mocked(FeatureFlagService.isEnabled).mockReset();
    vi.mocked(FeatureFlagService.getVariant).mockReset();
    vi.mocked(FeatureFlagService.getVariant).mockResolvedValue(undefined);
  });

  it('renders fallback when disabled', async () => {
    vi.mocked(FeatureFlagService.isEnabled).mockResolvedValue(false);

    render(
      <FeatureFlagRenderer flag="test" fallback={<p>Fallback</p>}>
        Enabled
      </FeatureFlagRenderer>,
    );

    expect(await screen.findByText('Fallback')).toBeInTheDocument();
  });

  it('renders children when enabled', async () => {
    vi.mocked(FeatureFlagService.isEnabled).mockResolvedValue(true);

    render(<FeatureFlagRenderer flag="test">Enabled</FeatureFlagRenderer>);

    expect(await screen.findByText('Enabled')).toBeInTheDocument();
  });

  it('renders variant when provided', async () => {
    vi.mocked(FeatureFlagService.isEnabled).mockResolvedValue(true);
    vi.mocked(FeatureFlagService.getVariant).mockResolvedValue('A');

    render(
      <FeatureFlagRenderer flag="test" variants={{ A: <p>Variant A</p> }}>
        Default
      </FeatureFlagRenderer>,
    );

    expect(await screen.findByText('Variant A')).toBeInTheDocument();
  });
});

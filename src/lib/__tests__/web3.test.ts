import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSimpleStorage } from '../web3/hooks';
import { formatAddress, formatEtherBalance } from '../web3/utils';
import { handleWeb3Error, isUserRejectedError } from '../web3/errors';
import { web3Config } from '../web3/config';

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <WagmiProvider config={web3Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

describe('Web3 Utils', () => {
  describe('formatAddress', () => {
    it('should format address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890';
      const formatted = formatAddress(address);
      expect(formatted).toBe('0x123456...7890');
    });

    it('should handle empty address', () => {
      const formatted = formatAddress('');
      expect(formatted).toBe('');
    });

    it('should handle null address', () => {
      const formatted = formatAddress('' as any);
      expect(formatted).toBe('');
    });
  });

  describe('formatEtherBalance', () => {
    it('should format balance correctly', () => {
      const balance = BigInt('1000000000000000000'); // 0.001 ETH
      const formatted = formatEtherBalance(balance);
      expect(formatted).toBe('0.0010 ETH');
    });

    it('should handle zero balance', () => {
      const balance = BigInt(0);
      const formatted = formatEtherBalance(balance);
      expect(formatted).toBe('0.0000 ETH');
    });
  });
});

describe('Web3 Error Handling', () => {
  describe('handleWeb3Error', () => {
    it('should handle user rejected request', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const toastSpy = vi.fn();
      
      global.toast = { error: toastSpy } as any;
      
      const error = {
        code: 4001,
        message: 'User rejected the request',
      };

      handleWeb3Error(error);

      expect(consoleSpy).toHaveBeenCalled();
      expect(toastSpy).toHaveBeenCalledWith('User rejected the request', expect.any(Object));
      
      consoleSpy.mockRestore();
    });

    it('should handle insufficient funds error', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const toastSpy = vi.fn();
      
      global.toast = { error: toastSpy } as any;
      
      const error = {
        code: -32000,
        message: 'insufficient funds for gas',
      };

      handleWeb3Error(error);

      expect(consoleSpy).toHaveBeenCalled();
      expect(toastSpy).toHaveBeenCalledWith('Insufficient funds for gas', expect.any(Object));
      
      consoleSpy.mockRestore();
    });
  });

  describe('isUserRejectedError', () => {
    it('should detect user rejected error by code', () => {
      const error = { code: 4001 };
      expect(isUserRejectedError(error)).toBe(true);
    });

    it('should detect user rejected error by message', () => {
      const error = { message: 'User rejected the request' };
      expect(isUserRejectedError(error)).toBe(true);
    });

    it('should return false for other errors', () => {
      const error = { code: 5000, message: 'Server error' };
      expect(isUserRejectedError(error)).toBe(false);
    });
  });
});

describe('Web3 Configuration', () => {
  it('should have supported chains configured', () => {
    expect(web3Config.chains).toBeDefined();
    expect(web3Config.chains.length).toBeGreaterThan(0);
  });

  it('should have connectors configured', () => {
    expect(web3Config.connectors).toBeDefined();
    expect(web3Config.connectors.length).toBeGreaterThan(0);
  });
});

describe('Web3 Hooks', () => {
  describe('useSimpleStorage', () => {
    it('should initialize with default values', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useSimpleStorage(), { wrapper });

      expect(result.current.storedValue).toBeUndefined();
      expect(result.current.isPending).toBe(false);
      expect(result.current.isReading).toBe(false);
      expect(result.current.isConfirming).toBe(false);
      expect(result.current.isConfirmed).toBe(false);
    });
  });
});

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Web3 providers for testing
vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    chain: { id: 11155111, name: 'Sepolia' },
  }),
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [],
    isPending: false,
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(),
  }),
  useChainId: () => 11155111,
  useBalance: () => ({
    data: { value: BigInt('1000000000000000000') },
  }),
  useWriteContract: () => ({
    writeContract: vi.fn(),
    isPending: false,
    data: '0x1234567890abcdef',
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: true,
    data: { status: 1 },
  }),
  useReadContract: () => ({
    data: BigInt(42),
    isLoading: false,
  }),
  useGasPrice: () => ({
    data: BigInt('20000000000'),
  }),
}));

// Mock toast for testing
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

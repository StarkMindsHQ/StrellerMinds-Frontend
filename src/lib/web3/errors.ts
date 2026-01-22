'use client';

import { toast } from 'sonner';

export interface Web3Error {
  code: string;
  message: string;
  action?: string;
}

export const WEB3_ERRORS: Record<string, Web3Error> = {
  // Wallet connection errors
  USER_REJECTED_REQUEST: {
    code: 'USER_REJECTED_REQUEST',
    message: 'User rejected the request',
    action: 'Please try again and approve the connection',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized access',
    action: 'Please check your wallet permissions',
  },
  UNSUPPORTED_CHAIN: {
    code: 'UNSUPPORTED_CHAIN',
    message: 'Unsupported network',
    action: 'Please switch to a supported network',
  },

  // Transaction errors
  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Insufficient funds for gas',
    action: 'Please add more ETH to your wallet',
  },
  NONCE_TOO_LOW: {
    code: 'NONCE_TOO_LOW',
    message: 'Nonce too low',
    action: 'Please try again in a few moments',
  },
  GAS_LIMIT_EXCEEDED: {
    code: 'GAS_LIMIT_EXCEEDED',
    message: 'Gas limit exceeded',
    action: 'Please try with a higher gas limit',
  },
  CONTRACT_EXECUTION_FAILED: {
    code: 'CONTRACT_EXECUTION_FAILED',
    message: 'Contract execution failed',
    action: 'Please check your inputs and try again',
  },

  // Network errors
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'Network connection error',
    action: 'Please check your internet connection',
  },
  TIMEOUT: {
    code: 'TIMEOUT',
    message: 'Transaction timeout',
    action: 'Please try again',
  },
};

export function handleWeb3Error(error: any): void {
  console.error('Web3 Error:', error);

  // Try to extract error code and message
  const errorCode = error.code || error.data?.code || 'UNKNOWN_ERROR';
  const errorMessage =
    error.message || error.data?.message || 'Unknown error occurred';

  // Find matching error in our error dictionary
  const web3Error = WEB3_ERRORS[errorCode] || {
    code: 'UNKNOWN_ERROR',
    message: errorMessage,
    action: 'Please try again',
  };

  // Show appropriate toast notification
  toast.error(web3Error.message, {
    description: web3.action,
    duration: 5000,
  });

  // Log detailed error for debugging
  console.error('Web3 Error Details:', {
    code: errorCode,
    message: errorMessage,
    originalError: error,
  });
}

export function isUserRejectedError(error: any): boolean {
  return (
    error.code === 4001 ||
    error.message?.includes('User rejected') ||
    error.message?.includes('User denied')
  );
}

export function isInsufficientFundsError(error: any): boolean {
  return (
    error.code === -32000 ||
    error.message?.includes('insufficient funds') ||
    error.message?.includes('not enough ETH')
  );
}

export function isNetworkError(error: any): boolean {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message?.includes('network') ||
    error.message?.includes('connection')
  );
}

export function getErrorMessage(error: any): string {
  if (isUserRejectedError(error)) {
    return 'Transaction was cancelled';
  }

  if (isInsufficientFundsError(error)) {
    return 'Insufficient funds for transaction';
  }

  if (isNetworkError(error)) {
    return 'Network connection error';
  }

  return error.message || 'An error occurred';
}

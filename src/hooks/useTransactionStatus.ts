'use client';

import { useState, useEffect } from 'react';
import { useWaitForTransactionReceipt, useTransaction } from 'wagmi';
import { toast } from 'sonner';

export type TransactionStatus =
  | 'idle'
  | 'pending'
  | 'confirmed'
  | 'failed'
  | 'timeout';

interface UseTransactionStatusProps {
  hash?: `0x${string}`;
  onConfirmed?: (receipt: any) => void;
  onFailed?: (error: any) => void;
  timeout?: number; // ms
}

/**
 * useTransactionStatus Hook
 * Tracks a blockchain transaction status from hashing to completion.
 * Support auto-updates and failure handling.
 */
export const useTransactionStatus = ({
  hash,
  onConfirmed,
  onFailed,
  timeout = 60000, // Default 60 seconds
}: UseTransactionStatusProps) => {
  const [status, setStatus] = useState<TransactionStatus>(
    hash ? 'pending' : 'idle',
  );
  const [error, setError] = useState<Error | null>(null);

  const {
    data: receipt,
    isError,
    isLoading,
    error: wagmiError,
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (!hash) {
      setStatus('idle');
      return;
    }

    if (isLoading) {
      setStatus('pending');
    } else if (receipt && status !== 'confirmed') {
      setStatus('confirmed');
      toast.success('Transaction confirmed!');
      if (onConfirmed) onConfirmed(receipt);
    } else if (isError || wagmiError) {
      setStatus('failed');
      setError((wagmiError as Error) || new Error('Transaction failed'));
      toast.error('Transaction failed!');
      if (onFailed) onFailed(wagmiError);
    }
  }, [
    hash,
    isLoading,
    receipt,
    isError,
    wagmiError,
    onConfirmed,
    onFailed,
    status,
  ]);

  // Handle timeout
  useEffect(() => {
    if (status === 'pending' && timeout > 0) {
      const timer = setTimeout(() => {
        if (status === 'pending') {
          setStatus('timeout');
          toast.error('Transaction monitoring timed out.');
        }
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [status, timeout]);

  return {
    status,
    receipt,
    error,
    isLoading: status === 'pending',
    isConfirmed: status === 'confirmed',
    isFailed: status === 'failed' || status === 'timeout',
  };
};

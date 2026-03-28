'use client';

import React, { useEffect, useRef, useState } from 'react';

type Updater<TValue> = TValue | ((current: TValue) => TValue);

export interface OptimisticActionContext<TValue> {
  mutationId: number;
  optimisticValue: TValue;
  previousValue: TValue;
}

export interface OptimisticActionState<TValue, TResult> {
  value: TValue;
  error: Error | null;
  isPending: boolean;
  applyOptimisticUpdate: (updater: Updater<TValue>) => Promise<TResult>;
  clearError: () => void;
  rollback: () => void;
}

interface UseOptimisticActionOptions<TValue, TResult> {
  value: TValue;
  action: (
    nextValue: TValue,
    context: OptimisticActionContext<TValue>,
  ) => Promise<TResult>;
  reconcile?: (
    result: TResult,
    nextValue: TValue,
    previousValue: TValue,
  ) => TValue;
  onChange?: (value: TValue) => void;
  onSuccess?: (result: TResult, value: TValue) => void;
  onError?: (error: Error, rollbackValue: TValue) => void;
}

interface OptimisticActionHandlerProps<TValue, TResult>
  extends UseOptimisticActionOptions<TValue, TResult> {
  children: (
    state: OptimisticActionState<TValue, TResult>,
  ) => React.ReactNode;
}

const resolveValue = <TValue,>(
  updater: Updater<TValue>,
  current: TValue,
): TValue => {
  if (typeof updater === 'function') {
    return (updater as (currentValue: TValue) => TValue)(current);
  }

  return updater;
};

export function useOptimisticAction<TValue, TResult>({
  value,
  action,
  reconcile,
  onChange,
  onSuccess,
  onError,
}: UseOptimisticActionOptions<TValue, TResult>): OptimisticActionState<
  TValue,
  TResult
> {
  const [optimisticValue, setOptimisticValue] = useState(value);
  const [error, setError] = useState<Error | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const committedValueRef = useRef(value);
  const optimisticValueRef = useRef(value);
  const mutationIdRef = useRef(0);
  const latestMutationIdRef = useRef(0);

  useEffect(() => {
    committedValueRef.current = value;

    if (pendingCount === 0) {
      optimisticValueRef.current = value;
      setOptimisticValue(value);
    }
  }, [pendingCount, value]);

  const clearError = () => {
    setError(null);
  };

  const rollback = () => {
    optimisticValueRef.current = committedValueRef.current;
    setOptimisticValue(committedValueRef.current);
    setError(null);
    onChange?.(committedValueRef.current);
  };

  const applyOptimisticUpdate = async (updater: Updater<TValue>) => {
    const previousValue = committedValueRef.current;
    const nextValue = resolveValue(updater, optimisticValueRef.current);
    const mutationId = mutationIdRef.current + 1;

    mutationIdRef.current = mutationId;
    latestMutationIdRef.current = mutationId;
    optimisticValueRef.current = nextValue;
    setOptimisticValue(nextValue);
    setError(null);
    setPendingCount((count) => count + 1);
    onChange?.(nextValue);

    try {
      const result = await action(nextValue, {
        mutationId,
        optimisticValue: nextValue,
        previousValue,
      });

      if (mutationId === latestMutationIdRef.current) {
        const reconciledValue = reconcile
          ? reconcile(result, nextValue, previousValue)
          : nextValue;

        committedValueRef.current = reconciledValue;
        optimisticValueRef.current = reconciledValue;
        setOptimisticValue(reconciledValue);
        onChange?.(reconciledValue);
        onSuccess?.(result, reconciledValue);
      }

      return result;
    } catch (caughtError) {
      const normalizedError =
        caughtError instanceof Error
          ? caughtError
          : new Error('Optimistic action failed');

      if (mutationId === latestMutationIdRef.current) {
        optimisticValueRef.current = committedValueRef.current;
        setOptimisticValue(committedValueRef.current);
        setError(normalizedError);
        onChange?.(committedValueRef.current);
        onError?.(normalizedError, committedValueRef.current);
      }

      throw normalizedError;
    } finally {
      setPendingCount((count) => Math.max(0, count - 1));
    }
  };

  return {
    value: optimisticValue,
    error,
    isPending: pendingCount > 0,
    applyOptimisticUpdate,
    clearError,
    rollback,
  };
}

export default function OptimisticActionHandler<TValue, TResult>({
  children,
  ...options
}: OptimisticActionHandlerProps<TValue, TResult>) {
  const state = useOptimisticAction(options);
  return <>{children(state)}</>;
}

import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OptimisticActionHandler, { useOptimisticAction } from '../OptimisticActionHandler';

describe('OptimisticActionHandler', () => {
  it('applies an optimistic update immediately and keeps the committed state on success', async () => {
    let resolveAction: ((value: { ok: boolean }) => void) | null = null;
    const action = vi.fn(
      (_nextValue: { liked: boolean; count: number }) => {
        return new Promise<{ ok: boolean }>((resolve) => {
          resolveAction = resolve;
        });
      },
    );

    const { result } = renderHook(() =>
      useOptimisticAction({
        value: { liked: false, count: 0 },
        action,
      }),
    );

    let mutationPromise: Promise<{ ok: boolean }> | null = null;

    act(() => {
      mutationPromise = result.current.applyOptimisticUpdate((currentValue) => ({
        liked: !currentValue.liked,
        count: currentValue.count + 1,
      }));
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(result.current.value).toEqual({ liked: true, count: 1 });
    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolveAction?.({ ok: true });
      await Promise.resolve();
    });

    await mutationPromise;

    expect(result.current.value).toEqual({ liked: true, count: 1 });
    expect(result.current.isPending).toBe(false);
  });

  it('rolls back the optimistic value when the mutation fails', async () => {
    let rejectAction: ((error: Error) => void) | null = null;
    const action = vi.fn(
      () =>
        new Promise<never>((_, reject) => {
          rejectAction = reject;
        }),
    );

    render(
      <OptimisticActionHandler
        value={{ liked: false, count: 0 }}
        action={action}
      >
        {({ value, error, applyOptimisticUpdate }) => (
          <div>
            <span>{value.liked ? 'liked' : 'not-liked'}</span>
            <span>{value.count}</span>
            {error && <span>{error.message}</span>}
            <button
              type="button"
              onClick={() =>
                void applyOptimisticUpdate((currentValue) => ({
                  liked: !currentValue.liked,
                  count: currentValue.count + 1,
                })).catch(() => undefined)
              }
            >
              Toggle
            </button>
          </div>
        )}
      </OptimisticActionHandler>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Toggle'));
      await Promise.resolve();
    });

    expect(screen.getByText('liked')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();

    await act(async () => {
      rejectAction?.(new Error('Request failed'));
      await Promise.resolve();
    });

    expect(screen.getByText('not-liked')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Request failed')).toBeInTheDocument();
  });
});

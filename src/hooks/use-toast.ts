import { useState } from 'react';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'info';
};

export function useToast() {
  const [toasts] = useState<Toast[]>([]);
  function push(_toast?: Partial<Toast>) {
    /* no-op placeholder for tests and type-checking */
  }
  return { toasts, push } as const;
}

export type UseToast = ReturnType<typeof useToast>;

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data, status } = useSession();

  return {
    user: data?.user,
    role: (data?.user as any)?.role,
    permissions: (data?.user as any)?.permissions ?? [],
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}

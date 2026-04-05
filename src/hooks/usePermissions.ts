'use client';

import { useQuery } from '@tanstack/react-query';

import {
  permissionService,
  type PermissionPayload,
} from '@/services/permission.service';

export function usePermissions() {
  const query = useQuery<PermissionPayload>({
    queryKey: ['permissions'],
    queryFn: () => permissionService.fetchPermissions(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    permissions: query.data?.permissions ?? [],
    role: query.data?.role ?? null,
    isAuthenticated: query.data?.authenticated ?? false,
  };
}

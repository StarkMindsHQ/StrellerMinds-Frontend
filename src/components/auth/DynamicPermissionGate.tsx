'use client';

import type { ReactNode } from 'react';

import { usePermissions } from '@/hooks/usePermissions';

interface DynamicPermissionGateProps {
  children: ReactNode;
  requiredPermissions?: string[];
  requireAll?: boolean;
  loadingFallback?: ReactNode;
  fallback?: ReactNode;
}

function hasRequiredPermissions(
  userPermissions: string[],
  requiredPermissions: string[],
  requireAll: boolean,
) {
  if (requiredPermissions.length === 0) {
    return true;
  }

  return requireAll
    ? requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      )
    : requiredPermissions.some((permission) =>
        userPermissions.includes(permission),
      );
}

export function DynamicPermissionGate({
  children,
  requiredPermissions = [],
  requireAll = true,
  loadingFallback = null,
  fallback = null,
}: DynamicPermissionGateProps) {
  const { permissions, isLoading, isAuthenticated } = usePermissions();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  const isAuthorized =
    isAuthenticated &&
    hasRequiredPermissions(permissions, requiredPermissions, requireAll);

  if (!isAuthorized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

export type AllowedRole = string | string[];

export interface RoleGuardProps {
  roles: AllowedRole;
  children: ReactNode;
  fallback?: ReactNode;
  user?: { role?: string } | null;
}

const normalizeRoles = (roles: AllowedRole): string[] =>
  Array.isArray(roles) ? roles : [roles];

export function RoleGuard({ roles, children, fallback = null, user }: RoleGuardProps) {
  const { user: authUser } = useAuth();
  const currentUser = user ?? authUser;
  const role = currentUser?.role;

  if (!role) {
    return <>{fallback}</>;
  }

  const allowedRoles = normalizeRoles(roles);
  const hasAccess = allowedRoles.includes(role);

  return <>{hasAccess ? children : fallback}</>;
}

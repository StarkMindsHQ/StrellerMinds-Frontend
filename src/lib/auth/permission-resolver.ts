import { Permissions } from '@/domain/auth/permissions';
import { Roles } from '@/domain/auth/roles';

const rolePermissionMap: Record<string, string[]> = {
  [Roles.ADMIN]: Object.values(Permissions),
  [Roles.SELLER]: [Permissions.CREATE_PRODUCT, Permissions.UPDATE_PRODUCT],
  [Roles.USER]: [],
};

export function resolvePermissionsForRole(role?: string | null): string[] {
  if (!role) {
    return [];
  }

  return rolePermissionMap[role] ?? [];
}

export function normalizePermissions(
  permissions?: string[] | null,
  role?: string | null,
): string[] {
  const resolvedPermissions =
    permissions && permissions.length > 0
      ? permissions
      : resolvePermissionsForRole(role);

  return Array.from(new Set(resolvedPermissions));
}

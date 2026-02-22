export type Role = 'admin' | 'seller' | 'user';

export function hasRole(user: any, roles: Role[] | Role): boolean {
  if (!user?.role) return false;

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  return allowedRoles.includes(user.role);
}

export function hasPermission(user: any, permission: string): boolean {
  if (!user?.permissions) return false;
  return user.permissions.includes(permission);
}

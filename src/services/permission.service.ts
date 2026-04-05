import { env } from '@/lib/env';

export interface PermissionPayload {
  authenticated: boolean;
  role: string | null;
  permissions: string[];
}

interface PermissionResponse {
  success: boolean;
  message: string;
  data?: PermissionPayload;
}

export const permissionService = {
  async fetchPermissions(): Promise<PermissionPayload> {
    const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error('Failed to load permissions');
    }

    const result = (await response.json()) as PermissionResponse;

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Invalid permissions response');
    }

    return result.data;
  },
};

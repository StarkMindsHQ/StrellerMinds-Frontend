import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createApiSuccess, handleApiError } from '@/lib/api-validation';
import { normalizePermissions } from '@/lib/auth/permission-resolver';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as
      | {
          id?: string;
          role?: string | null;
          permissions?: string[] | null;
        }
      | undefined;

    const role = user?.role ?? null;
    const permissions = normalizePermissions(user?.permissions, role);

    return createApiSuccess('Permissions loaded successfully', {
      authenticated: Boolean(session?.user),
      role,
      permissions,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/permissions');
  }
}

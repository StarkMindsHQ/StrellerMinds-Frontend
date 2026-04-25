import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { validateRequestBody, createApiSuccess, createApiError } from '@/lib/api-validation';
import { Report, ReportStatus } from '@/types/report';
import { reportStore } from '@/lib/reportStore';

const updateReportSchema = z.object({
  status: z.nativeEnum(ReportStatus).optional(),
  adminNotes: z.string().optional(),
});

/**
 * GET /api/admin/reports/[id]
 * Get a single report (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createApiError('Unauthorized', 401);
    }

    // Check admin role - mock: users with email containing 'admin' are admins
    const userEmail = session.user.email || '';
    const isAdmin = userEmail.includes('admin');

    if (!isAdmin) {
      return createApiError('Forbidden: Admin access required', 403);
    }

    const { id } = await params;

    const report = reportStore.find(r => r.id === id);

    if (!report) {
      return createApiError('Report not found', 404);
    }

    return createApiSuccess('Report retrieved successfully', { report: report as Report });
  } catch (error) {
    console.error('GET /api/admin/reports/[id] error:', error);
    return createApiError('Failed to fetch report', 500);
  }
}

/**
 * PATCH /api/admin/reports/[id]
 * Update a report (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createApiError('Unauthorized', 401);
    }

    // Check admin role - mock: users with email containing 'admin' are admins
    const userEmail = session.user.email || '';
    const isAdmin = userEmail.includes('admin');

    if (!isAdmin) {
      return createApiError('Forbidden: Admin access required', 403);
    }

    const { id } = await params;

    const validation = await validateRequestBody(request, updateReportSchema);
    if (!validation.success) {
      return validation.response as NextResponse;
    }

    const { status, adminNotes } = validation.data;

    // Find report index
    const reportIndex = reportStore.findIndex(r => r.id === id);

    if (reportIndex === -1) {
      return createApiError('Report not found', 404);
    }

    // Update fields
    if (status) {
      reportStore[reportIndex].status = status;
      if (status === 'RESOLVED' || status === 'DISMISSED') {
        reportStore[reportIndex].resolvedAt = new Date().toISOString();
        reportStore[reportIndex].resolvedBy = session.user.id;
        reportStore[reportIndex].resolvedByUser = {
          id: session.user.id,
          name: session.user.name || null,
          email: session.user.email || '',
        };
      }
    }
    if (adminNotes !== undefined) {
      reportStore[reportIndex].adminNotes = adminNotes;
    }
    reportStore[reportIndex].updatedAt = new Date().toISOString();

    return createApiSuccess('Report updated successfully', { report: reportStore[reportIndex] as Report });
  } catch (error) {
    console.error('PATCH /api/admin/reports/[id] error:', error);
    return createApiError('Failed to update report', 500);
  }
}

/**
 * DELETE /api/admin/reports/[id]
 * Delete a report (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createApiError('Unauthorized', 401);
    }

    // Check admin role - mock: users with email containing 'admin' are admins
    const userEmail = session.user.email || '';
    const isAdmin = userEmail.includes('admin');

    if (!isAdmin) {
      return createApiError('Forbidden: Admin access required', 403);
    }

    const { id } = await params;

    const reportIndex = reportStore.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      return createApiError('Report not found', 404);
    }

    reportStore.splice(reportIndex, 1);

    return createApiSuccess('Report deleted successfully');
  } catch (error) {
    console.error('DELETE /api/admin/reports/[id] error:', error);
    return createApiError('Failed to delete report', 500);
  }
}

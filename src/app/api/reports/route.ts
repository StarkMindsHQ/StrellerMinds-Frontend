import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { z } from 'zod';
import { createApiSuccess, createApiError, validateRequestBody, validateRequest } from '@/lib/api-validation';
import {
  Report,
  ReportsListResponse,
  CreateReportResponse,
  ReportContentType,
  ReportReason,
  ReportStatus,
} from '@/types/report';
import { reportStore, reportIdCounter as reportCounter } from '@/lib/reportStore';

// Schema for creating a report
const createReportSchema = z.object({
  contentType: z.nativeEnum(ReportContentType),
  contentId: z.string().min(1),
  reason: z.nativeEnum(ReportReason),
  details: z.string().optional(),
});

// Schema for query parameters
const reportsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.string().optional(),
  contentType: z.string().optional(),
});

/**
 * GET /api/reports
 * - For regular users: returns their own reports (unless admin)
 * - For admins: returns all reports with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createApiError('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const queryObject = Object.fromEntries(searchParams.entries());
    const validation = validateRequest(reportsQuerySchema, queryObject);

    if (!validation.success) {
      return createApiError(`Validation failed: ${validation.error.message}`, 400);
    }

    const { page, limit, status, contentType } = validation.data;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10));

    // In a real app, check user role from database; for mock, assume non-admin
    // For demo purposes, we'll treat users with email containing 'admin' as admins
    const userEmail = session.user.email || '';
    const isAdmin = userEmail.includes('admin');

    // Filter reports
    let filteredReports = [...mockReports];
    if (!isAdmin) {
      filteredReports = filteredReports.filter(r => r.reporterId === session.user.id);
    }
    if (status && isAdmin) {
      filteredReports = filteredReports.filter(r => r.status === status);
    }
    if (contentType && isAdmin) {
      filteredReports = filteredReports.filter(r => r.contentType === contentType);
    }

    // Sort by createdAt descending
    filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filteredReports.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + limitNum);

    const response: ReportsListResponse = {
      success: true,
      reports: paginatedReports,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return createApiError('Failed to fetch reports', 500);
  }
}

/**
 * POST /api/reports
 * Create a new report (any authenticated user)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createApiError('Unauthorized', 401);
    }

    const validation = await validateRequestBody(request, createReportSchema);
    if (!validation.success) {
      return validation.response as NextResponse;
    }

    const { contentType, contentId, reason, details } = validation.data;

    // Check if user has already reported this content recently (within 24 hours)
    const recentTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReport = mockReports.find(
      r =>
        r.reporterId === session.user.id &&
        r.contentType === contentType &&
        r.contentId === contentId &&
        new Date(r.createdAt) > recentTime
    );

    if (existingReport) {
      return createApiError('You have already reported this content recently', 400);
    }

    // Create report
    const now = new Date().toISOString();
    const newReport: StoredReport = {
      id: `report-${reportIdCounter++}`,
      contentType,
      contentId,
      reason,
      details: details || null,
      status: ReportStatus.PENDING,
      reporterId: session.user.id,
      reporter: {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || '',
      },
      resolvedBy: null,
      resolvedByUser: null,
      resolvedAt: null,
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
    };

    mockReports.push(newReport);

    const response: CreateReportResponse = {
      success: true,
      message: 'Report submitted successfully',
      report: newReport as Report,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return createApiError('Failed to create report', 500);
  }
}

    const { searchParams } = new URL(request.url);
    const queryObject = Object.fromEntries(searchParams.entries());
    const validation = validateRequest(reportsQuerySchema, queryObject);

    if (!validation.success) {
      return createApiError(`Validation failed: ${validation.error.message}`, 400);
    }

    const { page, limit, status, contentType } = validation.data;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    const isAdmin = user?.role === 'ADMIN';

    // Filter reports
    let filteredReports = reportStore.filter(r => isAdmin ? true : r.reporterId === session.user.id);
    if (status && isAdmin) {
      filteredReports = filteredReports.filter(r => r.status === status);
    }
    if (contentType && isAdmin) {
      filteredReports = filteredReports.filter(r => r.contentType === contentType);
    }

    const total = filteredReports.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedReports = filteredReports.slice(startIndex, startIndex + limitNum);

    const response: ReportsListResponse = {
      success: true,
      reports: paginatedReports,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return createApiError('Failed to fetch reports', 500);
  }
}

/**
 * POST /api/reports
 * Create a new report (any authenticated user)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createApiError('Unauthorized', 401);
    }

    const validation = await validateRequestBody(request, createReportSchema);
    if (!validation.success) {
      return validation.response as NextResponse;
    }

    const { contentType, contentId, reason, details } = validation.data;

    // Check if user has already reported this content recently (within 24 hours)
    const recentTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReport = reportStore.find(
      r =>
        r.reporterId === session.user.id &&
        r.contentType === contentType &&
        r.contentId === contentId &&
        new Date(r.createdAt) > recentTime
    );

    if (existingReport) {
      return createApiError('You have already reported this content recently', 400);
    }

    // Create report
    const now = new Date().toISOString();
    const newReport: StoredReport = {
      id: `report-${reportCounter++}`,
      contentType,
      contentId,
      reason,
      details: details || null,
      status: ReportStatus.PENDING,
      reporterId: session.user.id,
      reporter: {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || '',
      },
      resolvedBy: null,
      resolvedByUser: null,
      resolvedAt: null,
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
    };

    reportStore.push(newReport);

    const response: CreateReportResponse = {
      success: true,
      message: 'Report submitted successfully',
      report: newReport as Report,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return createApiError('Failed to create report', 500);
  }
}

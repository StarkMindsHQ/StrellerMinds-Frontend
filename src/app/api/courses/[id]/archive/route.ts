import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  validateRequestBody,
  createApiSuccess,
  createApiError,
} from '@/lib/api-validation';

// Schema for archive action
export const archiveCourseSchema = z.object({
  action: z.enum(['archive', 'unarchive']),
});

export type ArchiveAction = z.infer<typeof archiveCourseSchema>;

// In-memory course store (mirrors MOCK_COURSES but mutable)
let courseStore = [
  {
    id: '1',
    title: 'Introduction to Blockchain',
    slug: 'intro-blockchain',
    status: 'published',
    enrolledCount: 124,
    modulesCount: 8,
    lastUpdated: '2025-02-18',
  },
  {
    id: '2',
    title: 'Smart Contracts & Solidity',
    slug: 'smart-contracts-solidity',
    status: 'published',
    enrolledCount: 89,
    modulesCount: 12,
    lastUpdated: '2025-02-15',
  },
  {
    id: '3',
    title: 'DeFi Fundamentals',
    slug: 'defi-fundamentals',
    status: 'draft',
    enrolledCount: 0,
    modulesCount: 10,
    lastUpdated: '2025-02-20',
  },
  {
    id: '4',
    title: 'Web3 Development',
    slug: 'web3-development',
    status: 'published',
    enrolledCount: 56,
    modulesCount: 6,
    lastUpdated: '2025-02-10',
  },
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    // Validate request body
    const validation = await validateRequestBody(request, archiveCourseSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { action } = validation.data;

    // Find course index
    const courseIndex = courseStore.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) {
      return createApiError('Course not found', 404);
    }

    // Update status
    const newStatus = action === 'archive' ? 'archived' : 'published';
    courseStore[courseIndex].status = newStatus;

    return createApiSuccess(`Course ${action}d successfully`, {
      course: { ...courseStore[courseIndex] },
    });
  } catch (error) {
    console.error('Error in PATCH /api/courses/[courseId]/archive:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

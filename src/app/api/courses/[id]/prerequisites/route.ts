import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  validateQueryParams,
  createApiSuccess,
  createApiError,
} from '@/lib/api-validation';

// Schema for prerequisite check query
export const prerequisiteCheckSchema = z.object({
  userId: z.string().optional(),
});

// Mock data - in production this would come from database
const { mockCourses } = require('@/lib/mock-course-data');

// Mock enrollments (userId -> course completions) - for demo purposes
const mockEnrollments = [
  {
    userId: 'user@example.com',
    courseId: 'blockchain-fundamentals',
    completed: true,
  },
];

// Helper to check if user has completed a course
function hasUserCompletedCourse(
  userId: string | undefined,
  courseId: string,
): boolean {
  if (!userId || userId === 'anonymous') return false;
  return mockEnrollments.some(
    (e: any) => e.userId === userId && e.courseId === courseId && e.completed,
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    // Validate query
    const validation = validateQueryParams(request, prerequisiteCheckSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { userId } = validation.data;

    // Find the course (using mockCourses)
    const course = mockCourses[courseId];
    if (!course) {
      return createApiError('Course not found', 404);
    }

    // Get prerequisite course IDs - in a real app this would come from DB relation
    const prerequisiteCourseIds = getPrerequisiteCourseIds(courseId);

    // Check each prerequisite
    const prerequisites = await Promise.all(
      prerequisiteCourseIds.map(async (prereqId) => {
        const prereqCourse = mockCourses[prereqId];
        if (!prereqCourse) return null;

        const completed = hasUserCompletedCourse(userId, prereqId);

        return {
          courseId: prereqId,
          title: prereqCourse.title,
          completed,
          required: true,
        };
      }),
    );

    // Filter out nulls and check if all are met
    const validPrereqs = prerequisites.filter(
      (p): p is NonNullable<typeof p> => p !== null,
    );
    const allMet = validPrereqs.every((p) => p.completed);

    return createApiSuccess('Prerequisites checked', {
      courseId,
      prerequisites: validPrereqs,
      allMet,
      missingCount: validPrereqs.filter((p) => !p.completed).length,
    });
  } catch (error) {
    console.error('Error in GET /api/courses/[courseId]/prerequisites:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    // Validate query
    const validation = validateQueryParams(request, prerequisiteCheckSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { userId } = validation.data;

    // Find the course
    const course = allCourses.find((c: any) => c.id === courseId);
    if (!course) {
      return createApiError('Course not found', 404);
    }

    // Get prerequisite course IDs - in a real app this would come from DB relation
    // For demo, we'll define prerequisites based on course logic
    const prerequisiteCourseIds = getPrerequisiteCourseIds(course.id);

    // Check each prerequisite
    const prerequisites = await Promise.all(
      prerequisiteCourseIds.map(async (prereqId) => {
        const prereqCourse = allCourses.find((c: any) => c.id === prereqId);
        if (!prereqCourse) return null;

        const completed = hasUserCompletedCourse(userId, prereqId);

        return {
          courseId: prereqId,
          title: prereqCourse.title,
          completed,
          required: true,
        };
      }),
    );

    // Filter out nulls and check if all are met
    const validPrereqs = prerequisites.filter(
      (p): p is NonNullable<typeof p> => p !== null,
    );
    const allMet = validPrereqs.every((p) => p.completed);

    return createApiSuccess('Prerequisites checked', {
      courseId,
      prerequisites: validPrereqs,
      allMet,
      missingCount: validPrereqs.filter((p) => !p.completed).length,
    });
  } catch (error) {
    console.error('Error in GET /api/courses/[courseId]/prerequisites:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

// Define prerequisite rules based on course ID
// In production, this would be stored in the database
function getPrerequisiteCourseIds(courseId: string): string[] {
  const prerequisiteMap: Record<string, string[]> = {
    // Prerequisites based on course IDs (matching mock-course-data IDs)
    'stellar-smart-contracts': ['blockchain-fundamentals'],
    'defi-fundamentals': ['stellar-smart-contracts', 'blockchain-fundamentals'],
    'blockchain-security': ['blockchain-fundamentals'],
    'nft-development': ['stellar-smart-contracts'],
    'blockchain-governance': ['blockchain-fundamentals'],
    // Also support IDs from allCourses if different
    'stellar-smart-contract': ['blockchain-fundamentals'],
    'defi-stellar': ['stellar-smart-contract', 'blockchain-fundamentals'],
  };

  return prerequisiteMap[courseId] || [];
}

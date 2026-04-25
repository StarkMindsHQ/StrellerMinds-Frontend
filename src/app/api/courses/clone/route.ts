import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateQueryParams, createApiSuccess, createApiError } from '@/lib/api-validation';
import { allCourses } from '@/lib/course-data';

// Schema for course cloning request
export const courseCloneSchema = z.object({
  originalCourseId: z.string(),
  cloneOptions: z.object({
    title: z.string().min(1),
    description: z.string(),
    includeContent: z.boolean(),
    includeStructure: z.boolean(),
    includeSettings: z.boolean(),
    newPrice: z.number().optional(),
    status: z.enum(['draft', 'published']),
  }),
});

// Mock database for cloned courses
const clonedCourses = new Map<string, any>();

// Helper to generate unique course ID
function generateCourseId(originalId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${originalId}-clone-${timestamp}-${random}`;
}

// Helper to clone course data
function cloneCourseData(originalCourse: any, options: any, newId: string): any {
  const clonedCourse = {
    ...originalCourse,
    id: newId,
    title: options.title,
    description: options.description,
    status: options.status,
    clonedFrom: originalCourse.id,
    clonedAt: new Date().toISOString(),
  };

  // Update price if provided
  if (options.newPrice !== undefined) {
    clonedCourse.price = options.newPrice;
    clonedCourse.originalPrice = originalCourse.price;
  }

  // Clone content if requested
  if (options.includeContent) {
    clonedCourse.lessons = originalCourse.lessons || [];
    clonedCourse.resources = originalCourse.resources || [];
    clonedCourse.quizzes = originalCourse.quizzes || [];
  }

  // Clone structure if requested
  if (options.includeStructure) {
    clonedCourse.modules = originalCourse.modules || [];
    clonedCourse.sections = originalCourse.sections || [];
    clonedCourse.prerequisites = originalCourse.prerequisites || [];
  }

  // Clone settings if requested
  if (options.includeSettings) {
    clonedCourse.settings = originalCourse.settings || {};
    clonedCourse.configuration = originalCourse.configuration || {};
  }

  return clonedCourse;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateQueryParams(request, courseCloneSchema, body);
    
    if (!validation.success) {
      return validation.response;
    }

    const { originalCourseId, cloneOptions } = validation.data;

    // Find the original course
    const originalCourse = allCourses.find(course => course.id === originalCourseId);
    if (!originalCourse) {
      return createApiError('Original course not found', 404);
    }

    // Generate new course ID
    const newCourseId = generateCourseId(originalCourseId);

    // Clone the course data
    const clonedCourse = cloneCourseData(originalCourse, cloneOptions, newCourseId);

    // Store the cloned course (in production, save to database)
    clonedCourses.set(newCourseId, clonedCourse);

    // Add to the courses array for this session
    allCourses.push(clonedCourse);

    return createApiSuccess('Course cloned successfully', {
      course: clonedCourse,
      cloneId: newCourseId,
      clonedFrom: originalCourseId,
    });
  } catch (error) {
    console.error('Error in POST /api/courses/clone:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const originalCourseId = searchParams.get('originalCourseId');
    const userId = searchParams.get('userId');

    if (originalCourseId) {
      // Get all clones of a specific course
      const clones = Array.from(clonedCourses.values()).filter(
        course => course.clonedFrom === originalCourseId
      );
      
      return createApiSuccess('Course clones retrieved successfully', {
        clones,
        count: clones.length,
        originalCourseId,
      });
    } else if (userId) {
      // Get all cloned courses by a user (instructor)
      const userClones = Array.from(clonedCourses.values()).filter(
        course => course.instructorId === userId || course.createdBy === userId
      );
      
      return createApiSuccess('User cloned courses retrieved successfully', {
        clones: userClones,
        count: userClones.length,
      });
    } else {
      // Get all cloned courses
      const allClonedCourses = Array.from(clonedCourses.values());
      return createApiSuccess('All cloned courses retrieved successfully', {
        clones: allClonedCourses,
        count: allClonedCourses.length,
      });
    }
  } catch (error) {
    console.error('Error in GET /api/courses/clone:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cloneId, action, updates } = body;

    if (action === 'update') {
      const clonedCourse = clonedCourses.get(cloneId);
      if (!clonedCourse) {
        return createApiError('Cloned course not found', 404);
      }

      // Update the cloned course
      const updatedCourse = { ...clonedCourse, ...updates, updatedAt: new Date().toISOString() };
      clonedCourses.set(cloneId, updatedCourse);

      // Update in the courses array
      const courseIndex = allCourses.findIndex(course => course.id === cloneId);
      if (courseIndex !== -1) {
        allCourses[courseIndex] = updatedCourse;
      }

      return createApiSuccess('Cloned course updated successfully', updatedCourse);
    } else if (action === 'publish') {
      const clonedCourse = clonedCourses.get(cloneId);
      if (!clonedCourse) {
        return createApiError('Cloned course not found', 404);
      }

      // Publish the cloned course
      clonedCourse.status = 'published';
      clonedCourse.publishedAt = new Date().toISOString();

      return createApiSuccess('Cloned course published successfully', clonedCourse);
    } else {
      return createApiError('Invalid action', 400);
    }
  } catch (error) {
    console.error('Error in PUT /api/courses/clone:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cloneId = searchParams.get('cloneId');

    if (!cloneId) {
      return createApiError('Clone ID is required', 400);
    }

    const clonedCourse = clonedCourses.get(cloneId);
    if (!clonedCourse) {
      return createApiError('Cloned course not found', 404);
    }

    // Remove from cloned courses
    clonedCourses.delete(cloneId);

    // Remove from courses array
    const courseIndex = allCourses.findIndex(course => course.id === cloneId);
    if (courseIndex !== -1) {
      allCourses.splice(courseIndex, 1);
    }

    return createApiSuccess('Cloned course deleted successfully', { cloneId });
  } catch (error) {
    console.error('Error in DELETE /api/courses/clone:', error);
    return createApiError('An unexpected error occurred', 500);
  }
}

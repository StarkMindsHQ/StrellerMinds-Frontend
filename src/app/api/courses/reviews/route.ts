import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  validateQueryParams,
  createApiSuccess,
  handleApiError,
} from '@/lib/api-validation';
import type { CourseReview, CourseRatingSummary } from '@/types/course-review';

// Mock data storage (replace with database in production)
const mockReviews: Map<string, CourseReview[]> = new Map();
const mockSummaries: Map<string, CourseRatingSummary> = new Map();

// Initialize with some mock data
function initializeMockData() {
  const courseId1 = 'course-1';
  const courseId2 = 'course-2';

  // Mock reviews for course-1
  mockReviews.set(courseId1, [
    {
      id: 'review-1',
      courseId: courseId1,
      userId: 'user-1',
      userName: 'Sarah Johnson',
      userAvatar: '/avatars/sarah.jpg',
      rating: 5,
      comment:
        'Excellent course! The content is well-structured and the instructor explains complex concepts clearly. Highly recommend for anyone wanting to learn blockchain development.',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      helpfulCount: 12,
    },
    {
      id: 'review-2',
      courseId: courseId1,
      userId: 'user-2',
      userName: 'Michael Chen',
      rating: 4,
      comment:
        'Great course overall. Would have liked more hands-on projects, but the theory is solid.',
      createdAt: '2024-02-20T14:45:00Z',
      updatedAt: '2024-02-20T14:45:00Z',
      helpfulCount: 8,
    },
    {
      id: 'review-3',
      courseId: courseId1,
      userId: 'user-3',
      userName: 'Emily Rodriguez',
      rating: 5,
      comment:
        'Best blockchain course I have taken! The practical examples really helped me understand the concepts.',
      createdAt: '2024-03-10T09:15:00Z',
      updatedAt: '2024-03-10T09:15:00Z',
      helpfulCount: 15,
    },
  ]);

  // Mock summary for course-1
  mockSummaries.set(courseId1, {
    courseId: courseId1,
    averageRating: 4.7,
    totalReviews: 3,
    ratingDistribution: {
      5: 2,
      4: 1,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  // Mock reviews for course-2
  mockReviews.set(courseId2, [
    {
      id: 'review-4',
      courseId: courseId2,
      userId: 'user-4',
      userName: 'David Kim',
      rating: 3,
      comment:
        'Decent course but could use more updated content. Some examples feel outdated.',
      createdAt: '2024-01-25T16:20:00Z',
      updatedAt: '2024-01-25T16:20:00Z',
      helpfulCount: 5,
    },
  ]);

  // Mock summary for course-2
  mockSummaries.set(courseId2, {
    courseId: courseId2,
    averageRating: 3.0,
    totalReviews: 1,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 1,
      2: 0,
      1: 0,
    },
  });
}

// Initialize mock data on module load
initializeMockData();

// Schema for creating a review
const createReviewSchema = z.object({
  courseId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

// Schema for query parameters
const reviewQuerySchema = z.object({
  courseId: z.string().min(1),
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const queryValidation = validateQueryParams(request, reviewQuerySchema);
    if (!queryValidation.success) {
      return queryValidation.response;
    }

    const { courseId, page, limit } = queryValidation.data;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Get reviews for the course
    const courseReviews = mockReviews.get(courseId) || [];
    const summary =
      mockSummaries.get(courseId) ||
      ({
        courseId,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      } as CourseRatingSummary);

    // Paginate reviews
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedReviews = courseReviews.slice(
      startIndex,
      startIndex + limitNum,
    );

    return createApiSuccess('Reviews retrieved successfully', {
      reviews: paginatedReviews,
      summary,
      total: courseReviews.length,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/courses/reviews');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createReviewSchema.safeParse(body);
    if (!validation.success) {
      return handleApiError(
        new Error(`Invalid input: ${validation.error.message}`),
        'POST /api/courses/reviews',
      );
    }

    const { courseId, rating, comment } = validation.data;

    // Mock user data (replace with actual auth in production)
    const mockUser = {
      id: 'current-user-id',
      name: 'Current User',
      avatar: undefined,
    };

    // Check if user already reviewed this course
    const courseReviews = mockReviews.get(courseId) || [];
    const existingReview = courseReviews.find((r) => r.userId === mockUser.id);

    if (existingReview) {
      return handleApiError(
        new Error('You have already reviewed this course'),
        'POST /api/courses/reviews',
      );
    }

    // Create new review
    const newReview: CourseReview = {
      id: `review-${Date.now()}`,
      courseId,
      userId: mockUser.id,
      userName: mockUser.name,
      userAvatar: mockUser.avatar,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpfulCount: 0,
    };

    // Add review to storage
    const updatedReviews = [...courseReviews, newReview];
    mockReviews.set(courseId, updatedReviews);

    // Update summary
    const currentSummary = mockSummaries.get(courseId) || {
      courseId,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    const newTotal = currentSummary.totalReviews + 1;
    const newAverage =
      (currentSummary.averageRating * currentSummary.totalReviews + rating) /
      newTotal;

    const updatedSummary: CourseRatingSummary = {
      ...currentSummary,
      averageRating: newAverage,
      totalReviews: newTotal,
      ratingDistribution: {
        ...currentSummary.ratingDistribution,
        [rating]:
          currentSummary.ratingDistribution[
            rating as keyof typeof currentSummary.ratingDistribution
          ] + 1,
      },
    };

    mockSummaries.set(courseId, updatedSummary);

    return createApiSuccess('Review submitted successfully', {
      review: newReview,
      summary: updatedSummary,
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/courses/reviews');
  }
}

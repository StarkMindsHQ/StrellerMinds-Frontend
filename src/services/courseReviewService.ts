import type {
  CourseReview,
  CourseRatingSummary,
  SubmitReviewInput,
  GetReviewsResponse,
  SubmitReviewResponse,
} from '@/types/course-review';
import { env } from '@/lib/env';

export interface FetchReviewsOptions {
  courseId: string;
  page?: number;
  limit?: number;
}

export const courseReviewService = {
  /**
   * Fetch reviews for a course
   */
  async fetchReviews(
    options: FetchReviewsOptions,
  ): Promise<GetReviewsResponse> {
    const { courseId, page = 1, limit = 10 } = options;

    const params = new URLSearchParams({
      courseId,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/courses/reviews?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Submit a new review
   */
  async submitReview(input: SubmitReviewInput): Promise<SubmitReviewResponse> {
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_BASE_URL}/courses/reviews`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(env.NEXT_PUBLIC_API_TIMEOUT),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit review');
    }

    const data = await response.json();
    return data;
  },

  /**
   * Mark a review as helpful
   */
  async markReviewHelpful(reviewId: string): Promise<{ success: boolean }> {
    // Mock implementation - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
};

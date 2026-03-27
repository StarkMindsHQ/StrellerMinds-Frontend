export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  updatedAt: string;
  helpfulCount?: number;
}

export interface CourseRatingSummary {
  courseId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface SubmitReviewInput {
  courseId: string;
  rating: number;
  comment: string;
}

export interface SubmitReviewResponse {
  success: boolean;
  message: string;
  review?: CourseReview;
}

export interface GetReviewsResponse {
  success: boolean;
  reviews: CourseReview[];
  summary: CourseRatingSummary;
  total: number;
}

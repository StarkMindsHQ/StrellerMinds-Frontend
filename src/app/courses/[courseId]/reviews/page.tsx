'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { CourseRating } from '@/components/CourseRating';
import { CourseReviews } from '@/components/CourseReviews';
import { courseReviewService } from '@/services/courseReviewService';
import type { CourseReview, CourseRatingSummary } from '@/types/course-review';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function CourseReviewsDemoPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const { toast } = useToast();

  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [summary, setSummary] = useState<CourseRatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      if (!courseId) return;

      try {
        setIsLoading(true);
        const data = await courseReviewService.fetchReviews({
          courseId,
          page: 1,
          limit: 10,
        });

        setReviews(data.reviews);
        setSummary(data.summary);
        setError(null);
      } catch (err) {
        console.error('Error loading reviews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
        toast({
          title: 'Error',
          description: 'Failed to load reviews. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();
  }, [courseId, toast]);

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!courseId) return;

    try {
      const result = await courseReviewService.submitReview({
        courseId,
        rating,
        comment,
      });

      // Update the reviews list with the new review
      if (result.review && result.summary) {
        setReviews((prev) => [result.review!, ...prev]);
        setSummary(result.summary);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    try {
      await courseReviewService.markReviewHelpful(reviewId);

      // Optimistically update the UI
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review,
        ),
      );

      toast({
        title: 'Thanks!',
        description: 'Your feedback has been recorded.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to mark review as helpful.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout variant="container" padding="medium">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout variant="container" padding="medium">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout variant="container" padding="medium">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Course Reviews & Ratings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Share your experience and learn from other students
          </p>
        </div>

        {/* Rating Form */}
        <CourseRating
          courseId={courseId || 'demo-course'}
          onRatingSubmit={handleRatingSubmit}
        />

        {/* Reviews Display */}
        {summary && (
          <CourseReviews
            reviews={reviews}
            summary={summary}
            onHelpfulClick={handleHelpfulClick}
          />
        )}
      </div>
    </MainLayout>
  );
}

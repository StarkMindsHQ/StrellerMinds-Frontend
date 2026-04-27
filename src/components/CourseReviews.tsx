'use client';

import React from 'react';
import { Star, User, ThumbsUp, Calendar, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { CourseReview, CourseRatingSummary } from '@/types/course-review';
import type { ReportContentType } from '@/types/report';

interface CourseReviewsProps {
  reviews: CourseReview[];
  summary: CourseRatingSummary;
  onHelpfulClick?: (reviewId: string) => void;
  onReportClick?: (contentType: ReportContentType, contentId: string) => void;
}

export function CourseReviews({
  reviews,
  summary,
  onHelpfulClick,
  onReportClick,
}: CourseReviewsProps) {
  const renderStars = (rating: number, size: number = 4) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-${size} h-${size} ${
              star <= rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Course Ratings & Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                {summary.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(summary.averageRating), 8)}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {summary.totalReviews}{' '}
                {summary.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count =
                  summary.ratingDistribution[
                    stars as keyof typeof summary.ratingDistribution
                  ];
                const percentage =
                  summary.totalReviews > 0
                    ? (count / summary.totalReviews) * 100
                    : 0;

                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{stars}</span>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </div>
                    <Progress
                      value={percentage}
                      className="flex-1 h-2"
                      indicatorClassName="bg-purple-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Student Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No reviews yet. Be the first to review this course!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Reviewer Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={review.userAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                          {getInitials(review.userName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {review.userName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    {renderStars(review.rating, 4)}
                  </div>

                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}

                  {/* Actions */}
                  {review.helpfulCount !== undefined && (
                    <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onHelpfulClick?.(review.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Helpful ({review.helpfulCount})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReportClick?.(ReportContentType.REVIEW, review.id)}
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 ml-auto"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

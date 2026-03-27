'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CourseRatingProps {
  courseId: string;
  initialRating?: number;
  onRatingSubmit?: (rating: number, comment: string) => Promise<void>;
}

export function CourseRating({
  courseId,
  initialRating = 0,
  onRatingSubmit,
}: CourseRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleStarEnter = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    if (comment.trim().length < 10) {
      toast({
        title: 'Comment Too Short',
        description:
          'Please provide a more detailed comment (at least 10 characters).',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onRatingSubmit?.(selectedRating, comment);

      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
        variant: 'default',
      });

      // Reset form
      setSelectedRating(0);
      setComment('');
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStarColor = (starIndex: number) => {
    const displayRating = hoverRating || selectedRating;
    if (starIndex <= displayRating) {
      return 'text-yellow-500 fill-yellow-500';
    }
    return 'text-gray-300 dark:text-gray-600';
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Rate This Course
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Rating
          </label>
          <div className="flex gap-2" onMouseLeave={handleStarLeave}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarEnter(star)}
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors',
                    getStarColor(star),
                  )}
                />
              </button>
            ))}
          </div>
          {selectedRating > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {selectedRating} out of 5 stars
            </p>
          )}
        </div>

        {/* Comment Box */}
        <div className="space-y-2">
          <label
            htmlFor="comment"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Your Review (Optional)
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this course..."
            className="min-h-[120px] resize-y"
            disabled={isSubmitting}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Minimum 10 characters. Be constructive and specific in your
            feedback.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || selectedRating === 0}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
}

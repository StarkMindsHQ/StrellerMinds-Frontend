'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ReviewItem {
  id: string;
  title: string;
  nextReview: Date;
  interval: number;
  repetitions: number;
  easeFactor: number;
}

interface SpacedRepetitionSchedulerProps {
  items: ReviewItem[];
  onReview?: (itemId: string) => void;
  onScheduleUpdate?: (items: ReviewItem[]) => void;
}

const SpacedRepetitionScheduler: React.FC<SpacedRepetitionSchedulerProps> = ({
  items: initialItems,
  onReview,
  onScheduleUpdate,
}) => {
  const [items, setItems] = useState<ReviewItem[]>(initialItems);
  const [dueNow, setDueNow] = useState<ReviewItem[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<ReviewItem[]>([]);

  useEffect(() => {
    const now = new Date();
    const due = items.filter((item) => new Date(item.nextReview) <= now);
    const upcoming = items.filter((item) => new Date(item.nextReview) > now);

    setDueNow(due);
    setUpcomingReviews(upcoming.sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()));
  }, [items]);

  const calculateNextReview = (
    currentInterval: number,
    easeFactor: number,
    quality: number // 0-5 scale
  ): { newInterval: number; newEase: number } => {
    let newEase = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * 0.08);
    let newInterval = currentInterval;

    if (quality >= 3) {
      newInterval = currentInterval === 0 ? 1 : Math.round(currentInterval * newEase);
    } else {
      newInterval = 1;
    }

    return { newInterval, newEase: newEase };
  };

  const handleReviewComplete = (itemId: string, quality: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const { newInterval, newEase } = calculateNextReview(item.interval, item.easeFactor, quality);
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + newInterval);

        return {
          ...item,
          nextReview,
          interval: newInterval,
          easeFactor: newEase,
          repetitions: item.repetitions + 1,
        };
      }
      return item;
    });

    setItems(updatedItems);
    onScheduleUpdate?.(updatedItems);
    onReview?.(itemId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Spaced Repetition Review Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Due Now</h3>
              </div>
              <p className="text-2xl font-bold text-red-600">{dueNow.length}</p>
              <p className="text-sm text-red-700">Items to review</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Upcoming</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{upcomingReviews.length}</p>
              <p className="text-sm text-blue-700">Scheduled reviews</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Items Due for Review</h4>
            {dueNow.length === 0 ? (
              <p className="text-gray-500">All items reviewed!</p>
            ) : (
              <div className="space-y-2">
                {dueNow.map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Reviewed {item.repetitions} times</p>
                    </div>
                    <div className="flex gap-2">
                      {[1, 3, 5].map((quality) => (
                        <Button key={quality} size="sm" variant="outline" onClick={() => handleReviewComplete(item.id, quality)}>
                          {quality === 1 ? 'Hard' : quality === 3 ? 'Good' : 'Easy'}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Upcoming Reviews</h4>
            {upcomingReviews.length === 0 ? (
              <p className="text-gray-500">No upcoming reviews scheduled</p>
            ) : (
              <div className="space-y-2">
                {upcomingReviews.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-3 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-600">Due in {Math.ceil((new Date(item.nextReview).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</p>
                    </div>
                    <Badge variant="secondary">Day {item.interval}</Badge>
                  </div>
                ))}
                {upcomingReviews.length > 5 && (
                  <p className="text-sm text-gray-600">+{upcomingReviews.length - 5} more</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpacedRepetitionScheduler;

'use client';

import React, { useEffect, useRef } from 'react';
import { useActivityMonitor } from '@/hooks/useActivityMonitor';
import { EngagementMeter } from './EngagementMeter';
import VideoPlayer from './VideoPlayer';
import { activityLogger } from '@/services/activityLogger';
import { cn } from '@/lib/utils';

export interface MonitoredLessonPlayerProps {
  lessonId: string;
  userId: string;
  courseId?: string;
  videoUrl: string;
  videoTitle: string;
  showEngagementMeter?: boolean;
  engagementMeterPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onEngagementChange?: (score: number) => void;
  className?: string;
}

export const MonitoredLessonPlayer: React.FC<MonitoredLessonPlayerProps> = ({
  lessonId,
  userId,
  courseId,
  videoUrl,
  videoTitle,
  showEngagementMeter = true,
  engagementMeterPosition = 'top-right',
  onEngagementChange,
  className,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const logIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize activity monitor
  const {
    metrics,
    isActive,
    isTabVisible,
    trackVideoPause,
    trackVideoPlay,
    getActivitySummary,
    resetMetrics,
  } = useActivityMonitor({
    enableTracking: true,
    lessonId,
    userId,
    onEngagementScoreChange: (score) => {
      onEngagementChange?.(score);
      
      // Alert if engagement drops below 40%
      if (score < 40) {
        console.warn('Low engagement detected:', score);
      }
    },
  });

  // Log activity periodically
  useEffect(() => {
    logIntervalRef.current = setInterval(() => {
      const summary = getActivitySummary();
      
      activityLogger.logActivity(
        userId,
        lessonId,
        summary,
        summary.activityLog,
        courseId
      );
    }, 60000); // Log every minute

    return () => {
      if (logIntervalRef.current) {
        clearInterval(logIntervalRef.current);
      }
    };
  }, [userId, lessonId, courseId, getActivitySummary]);

  // Log final activity on unmount
  useEffect(() => {
    return () => {
      const summary = getActivitySummary();
      activityLogger.logActivity(
        userId,
        lessonId,
        summary,
        summary.activityLog,
        courseId
      );
    };
  }, [userId, lessonId, courseId, getActivitySummary]);

  // Track video events
  const handleVideoPlay = () => {
    trackVideoPlay();
  };

  const handleVideoPause = () => {
    trackVideoPause();
  };

  // Get engagement meter position classes
  const getPositionClasses = () => {
    switch (engagementMeterPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Video Player */}
      <div className="mb-6">
        <VideoPlayer
          videoId={lessonId}
          videoUrl={videoUrl}
          title={videoTitle}
          onProgressUpdate={(watched, total) => {
            // Track progress
          }}
        />
      </div>

      {/* Engagement Meter Overlay */}
      {showEngagementMeter && (
        <div className={cn("fixed z-50", getPositionClasses())}>
          <EngagementMeter
            metrics={metrics}
            isActive={isActive}
            isTabVisible={isTabVisible}
            showDetails={true}
            className="shadow-2xl"
          />
        </div>
      )}

      {/* Hidden video element for tracking */}
      <video
        ref={videoRef}
        style={{ display: 'none' }}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      />

      {/* Engagement Alerts */}
      {!isTabVisible && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
              ⚠️ Tab switched - Your engagement score may be affected
            </p>
          </div>
        </div>
      )}

      {!isActive && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
              💤 No activity detected - Are you still there?
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoredLessonPlayer;

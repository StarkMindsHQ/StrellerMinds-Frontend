'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { debounce } from '@/utils/debounce';

/**
 * Issue #355: Playback Analytics Tracker Component
 * 
 * Tracks user interactions with video playback to understand learning behavior.
 * Features:
 * - Track play, pause, skip events
 * - Send data to backend
 * - Minimal performance impact using debouncing and batching
 */

export interface PlaybackEvent {
  type: 'play' | 'pause' | 'skip' | 'seek' | 'speed_change' | 'complete';
  timestamp: number;
  videoTime: number;
  metadata?: Record<string, unknown>;
}

export interface PlaybackAnalyticsTrackerProps {
  videoId: string;
  lessonId: string;
  userId?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onAnalyticsEvent?: (event: PlaybackEvent) => void;
  batchSize?: number;
  batchInterval?: number;
  enabled?: boolean;
}

export const PlaybackAnalyticsTracker: React.FC<PlaybackAnalyticsTrackerProps> = ({
  videoId,
  lessonId,
  userId,
  videoRef,
  onAnalyticsEvent,
  batchSize = 10,
  batchInterval = 5000,
  enabled = true,
}) => {
  const eventQueueRef = useRef<PlaybackEvent[]>([]);
  const lastEventTimeRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Send events to backend
  const sendEventsToBackend = useCallback(async (events: PlaybackEvent[]) => {
    if (events.length === 0) return;

    try {
      const response = await fetch('/api/analytics/playback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          lessonId,
          userId,
          events,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        console.error('Failed to send analytics events:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending analytics events:', error);
    }
  }, [videoId, lessonId, userId]);

  // Flush event queue
  const flushEvents = useCallback(() => {
    if (eventQueueRef.current.length > 0) {
      const eventsToSend = [...eventQueueRef.current];
      eventQueueRef.current = [];
      sendEventsToBackend(eventsToSend);
    }
  }, [sendEventsToBackend]);

  // Track event with batching
  const trackEvent = useCallback((event: PlaybackEvent) => {
    if (!enabled) return;

    // Add to queue
    eventQueueRef.current.push(event);

    // Call optional callback
    onAnalyticsEvent?.(event);

    // Flush if batch size reached
    if (eventQueueRef.current.length >= batchSize) {
      flushEvents();
    }
  }, [enabled, batchSize, flushEvents, onAnalyticsEvent]);

  // Debounced seek tracking to avoid excessive events
  const trackSeek = useCallback(
    debounce((currentTime: number, previousTime: number) => {
      const skipAmount = currentTime - previousTime;
      
      // Only track significant seeks (> 2 seconds)
      if (Math.abs(skipAmount) > 2) {
        trackEvent({
          type: 'skip',
          timestamp: Date.now(),
          videoTime: currentTime,
          metadata: {
            skipAmount,
            direction: skipAmount > 0 ? 'forward' : 'backward',
          },
        });
      }
    }, 500),
    [trackEvent]
  );

  useEffect(() => {
    if (!enabled || !videoRef.current) return;

    const video = videoRef.current;

    // Play event handler
    const handlePlay = () => {
      trackEvent({
        type: 'play',
        timestamp: Date.now(),
        videoTime: video.currentTime,
      });
    };

    // Pause event handler
    const handlePause = () => {
      trackEvent({
        type: 'pause',
        timestamp: Date.now(),
        videoTime: video.currentTime,
      });
    };

    // Seeking event handler
    const handleSeeking = () => {
      const currentTime = video.currentTime;
      const previousTime = previousTimeRef.current;
      
      trackSeek(currentTime, previousTime);
    };

    // Time update handler to track current position
    const handleTimeUpdate = () => {
      previousTimeRef.current = video.currentTime;
    };

    // Speed change handler
    const handleRateChange = () => {
      trackEvent({
        type: 'speed_change',
        timestamp: Date.now(),
        videoTime: video.currentTime,
        metadata: {
          playbackRate: video.playbackRate,
        },
      });
    };

    // Video ended handler
    const handleEnded = () => {
      trackEvent({
        type: 'complete',
        timestamp: Date.now(),
        videoTime: video.duration,
      });
      flushEvents(); // Flush immediately on completion
    };

    // Attach event listeners
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeking', handleSeeking);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ratechange', handleRateChange);
    video.addEventListener('ended', handleEnded);

    // Set up batch interval timer
    batchTimerRef.current = setInterval(() => {
      flushEvents();
    }, batchInterval);

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeking', handleSeeking);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ratechange', handleRateChange);
      video.removeEventListener('ended', handleEnded);

      if (batchTimerRef.current) {
        clearInterval(batchTimerRef.current);
      }

      // Flush remaining events on unmount
      flushEvents();
    };
  }, [enabled, videoRef, trackEvent, trackSeek, flushEvents, batchInterval]);

  // Flush events on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushEvents();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [flushEvents]);

  // This component doesn't render anything
  return null;
};

export default PlaybackAnalyticsTracker;

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface ActivityEvent {
  type:
    | 'tab_switch'
    | 'video_pause'
    | 'video_play'
    | 'inactivity'
    | 'mouse_move'
    | 'key_press'
    | 'scroll';
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface ActivityMetrics {
  totalTime: number;
  activeTime: number;
  inactiveTime: number;
  tabSwitches: number;
  videoPauses: number;
  engagementScore: number;
  attentionSpan: number;
  lastActivity: number;
}

export interface UseActivityMonitorOptions {
  inactivityThreshold?: number; // ms before considering user inactive
  onActivityChange?: (metrics: ActivityMetrics) => void;
  onEngagementScoreChange?: (score: number) => void;
  enableTracking?: boolean;
  lessonId?: string;
  userId?: string;
}

export const useActivityMonitor = (options: UseActivityMonitorOptions = {}) => {
  const {
    inactivityThreshold = 30000, // 30 seconds
    onActivityChange,
    onEngagementScoreChange,
    enableTracking = true,
    lessonId,
    userId,
  } = options;

  const [metrics, setMetrics] = useState<ActivityMetrics>({
    totalTime: 0,
    activeTime: 0,
    inactiveTime: 0,
    tabSwitches: 0,
    videoPauses: 0,
    engagementScore: 100,
    attentionSpan: 0,
    lastActivity: Date.now(),
  });

  const [isActive, setIsActive] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);

  const activityLog = useRef<ActivityEvent[]>([]);
  const startTime = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const metricsUpdateTimer = useRef<NodeJS.Timeout | null>(null);

  // Log activity event
  const logActivity = useCallback(
    (event: ActivityEvent) => {
      if (!enableTracking) return;

      activityLog.current.push(event);
      lastActivityTime.current = Date.now();

      // Keep only last 1000 events to prevent memory issues
      if (activityLog.current.length > 1000) {
        activityLog.current = activityLog.current.slice(-1000);
      }
    },
    [enableTracking],
  );

  // Calculate engagement score
  const calculateEngagementScore = useCallback((): number => {
    const now = Date.now();
    const totalDuration = now - startTime.current;

    if (totalDuration === 0) return 100;

    const activeRatio = metrics.activeTime / totalDuration;
    const tabSwitchPenalty = Math.min(metrics.tabSwitches * 2, 30);
    const pausePenalty = Math.min(metrics.videoPauses * 1.5, 20);
    const inactivityPenalty = Math.min(
      (metrics.inactiveTime / totalDuration) * 50,
      40,
    );

    let score = 100;
    score -= tabSwitchPenalty;
    score -= pausePenalty;
    score -= inactivityPenalty;
    score = Math.max(0, Math.min(100, score));

    return Math.round(score);
  }, [metrics]);

  // Update metrics
  const updateMetrics = useCallback(() => {
    const now = Date.now();
    const totalTime = now - startTime.current;
    const engagementScore = calculateEngagementScore();

    setMetrics((prev) => {
      const updated = {
        ...prev,
        totalTime,
        engagementScore,
        lastActivity: lastActivityTime.current,
      };

      onActivityChange?.(updated);

      if (prev.engagementScore !== engagementScore) {
        onEngagementScoreChange?.(engagementScore);
      }

      return updated;
    });
  }, [calculateEngagementScore, onActivityChange, onEngagementScoreChange]);

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (!enableTracking) return;

    const now = Date.now();
    const wasInactive = !isActive;

    setIsActive(true);
    lastActivityTime.current = now;

    if (wasInactive) {
      const inactiveDuration = now - lastActivityTime.current;
      setMetrics((prev) => ({
        ...prev,
        inactiveTime: prev.inactiveTime + inactiveDuration,
      }));

      logActivity({
        type: 'inactivity',
        timestamp: now,
        metadata: { duration: inactiveDuration },
      });
    }

    // Reset inactivity timer
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      setIsActive(false);
    }, inactivityThreshold);
  }, [enableTracking, isActive, inactivityThreshold, logActivity]);

  // Track mouse movement
  const handleMouseMove = useCallback(() => {
    handleActivity();
    logActivity({
      type: 'mouse_move',
      timestamp: Date.now(),
    });
  }, [handleActivity, logActivity]);

  // Track key press
  const handleKeyPress = useCallback(() => {
    handleActivity();
    logActivity({
      type: 'key_press',
      timestamp: Date.now(),
    });
  }, [handleActivity, logActivity]);

  // Track scroll
  const handleScroll = useCallback(() => {
    handleActivity();
    logActivity({
      type: 'scroll',
      timestamp: Date.now(),
    });
  }, [handleActivity, logActivity]);

  // Track tab visibility
  const handleVisibilityChange = useCallback(() => {
    const isVisible = !document.hidden;
    setIsTabVisible(isVisible);

    if (!isVisible) {
      setMetrics((prev) => ({
        ...prev,
        tabSwitches: prev.tabSwitches + 1,
      }));

      logActivity({
        type: 'tab_switch',
        timestamp: Date.now(),
        metadata: { visible: false },
      });
    } else {
      logActivity({
        type: 'tab_switch',
        timestamp: Date.now(),
        metadata: { visible: true },
      });
    }
  }, [logActivity]);

  // Track video pause
  const trackVideoPause = useCallback(() => {
    setMetrics((prev) => ({
      ...prev,
      videoPauses: prev.videoPauses + 1,
    }));

    logActivity({
      type: 'video_pause',
      timestamp: Date.now(),
    });
  }, [logActivity]);

  // Track video play
  const trackVideoPlay = useCallback(() => {
    logActivity({
      type: 'video_play',
      timestamp: Date.now(),
    });
  }, [logActivity]);

  // Get activity summary
  const getActivitySummary = useCallback(() => {
    const now = Date.now();
    const totalDuration = now - startTime.current;

    return {
      ...metrics,
      totalTime: totalDuration,
      activityLog: activityLog.current,
      isActive,
      isTabVisible,
      lessonId,
      userId,
    };
  }, [metrics, isActive, isTabVisible, lessonId, userId]);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    startTime.current = Date.now();
    lastActivityTime.current = Date.now();
    activityLog.current = [];

    setMetrics({
      totalTime: 0,
      activeTime: 0,
      inactiveTime: 0,
      tabSwitches: 0,
      videoPauses: 0,
      engagementScore: 100,
      attentionSpan: 0,
      lastActivity: Date.now(),
    });
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!enableTracking) return;

    // Throttle mouse move events
    let mouseMoveTimeout: NodeJS.Timeout;
    const throttledMouseMove = () => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        handleMouseMove();
        mouseMoveTimeout = null as any;
      }, 1000);
    };

    // Throttle scroll events
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null as any;
      }, 1000);
    };

    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('scroll', throttledScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Update metrics every 5 seconds
    metricsUpdateTimer.current = setInterval(updateMetrics, 5000);

    // Initial inactivity timer
    inactivityTimer.current = setTimeout(() => {
      setIsActive(false);
    }, inactivityThreshold);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('scroll', throttledScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (metricsUpdateTimer.current) {
        clearInterval(metricsUpdateTimer.current);
      }
    };
  }, [
    enableTracking,
    handleMouseMove,
    handleKeyPress,
    handleScroll,
    handleVisibilityChange,
    inactivityThreshold,
    updateMetrics,
  ]);

  return {
    metrics,
    isActive,
    isTabVisible,
    trackVideoPause,
    trackVideoPlay,
    getActivitySummary,
    resetMetrics,
    logActivity,
  };
};

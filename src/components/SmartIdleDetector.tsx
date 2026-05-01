'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { useCrossTabSync } from './CrossTabSyncComponent';

export const SMART_IDLE_EVENT_PREFIX = 'smart-idle-detector';

type SmartIdleStatus = 'active' | 'warning' | 'idle';

export interface SmartIdleState {
  status: SmartIdleStatus;
  timeoutMs: number;
  warningDurationMs: number;
  lastActivityAt: number;
  remainingMs: number;
}

interface SmartIdleDetectorProps {
  enabled?: boolean;
  timeoutMs?: number;
  warningDurationMs?: number;
  triggerLogoutOnIdle?: boolean;
  requireAuthenticatedSession?: boolean;
  activityEvents?: Array<keyof WindowEventMap>;
  onActive?: (state: SmartIdleState) => void;
  onWarning?: (state: SmartIdleState) => void;
  onIdle?: (state: SmartIdleState) => void;
  children?: React.ReactNode | ((state: SmartIdleState) => React.ReactNode);
}

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_WARNING_DURATION_MS = 60 * 1000;
const DEFAULT_ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
];

export default function SmartIdleDetector({
  enabled = true,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  warningDurationMs = DEFAULT_WARNING_DURATION_MS,
  triggerLogoutOnIdle = false,
  requireAuthenticatedSession = true,
  activityEvents = DEFAULT_ACTIVITY_EVENTS,
  onActive,
  onWarning,
  onIdle,
  children,
}: SmartIdleDetectorProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const crossTabSync = useCrossTabSync({ optional: true });

  const [state, setState] = useState<SmartIdleState>({
    status: 'active',
    timeoutMs,
    warningDurationMs,
    lastActivityAt: Date.now(),
    remainingMs: timeoutMs,
  });

  const warningTimerRef = useRef<number | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const lastActivityAtRef = useRef(Date.now());
  const hasTriggeredIdleRef = useRef(false);
  const statusRef = useRef<SmartIdleStatus>('active');

  const trackingEnabled =
    enabled && !isLoading && (!requireAuthenticatedSession || isAuthenticated);

  const clearTimers = () => {
    if (warningTimerRef.current) {
      window.clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  };

  const buildState = (
    nextStatus: SmartIdleStatus,
    nextLastActivityAt = lastActivityAtRef.current,
  ): SmartIdleState => {
    const elapsed = Date.now() - nextLastActivityAt;
    const remainingMs = Math.max(timeoutMs - elapsed, 0);

    return {
      status: nextStatus,
      timeoutMs,
      warningDurationMs,
      lastActivityAt: nextLastActivityAt,
      remainingMs,
    };
  };

  const emitStateChange = (
    eventName: 'active' | 'warning' | 'idle',
    nextState: SmartIdleState,
  ) => {
    window.dispatchEvent(
      new CustomEvent<SmartIdleState>(
        `${SMART_IDLE_EVENT_PREFIX}:${eventName}`,
        {
          detail: nextState,
        },
      ),
    );
  };

  const setWarningState = () => {
    statusRef.current = 'warning';
    const nextState = buildState('warning');
    setState(nextState);
    onWarning?.(nextState);
    emitStateChange('warning', nextState);

    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
    }

    countdownTimerRef.current = window.setInterval(() => {
      const countdownState = buildState('warning');
      setState(countdownState);

      if (countdownState.remainingMs <= 0 && countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    }, 1000);
  };

  const setIdleState = () => {
    if (hasTriggeredIdleRef.current) {
      return;
    }

    hasTriggeredIdleRef.current = true;
    statusRef.current = 'idle';

    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    const nextState = buildState('idle');
    setState(nextState);
    onIdle?.(nextState);
    emitStateChange('idle', nextState);

    if (triggerLogoutOnIdle) {
      crossTabSync?.broadcastAuthLogout('idle-timeout');
      void authService.logout();
    }
  };

  const armTimers = () => {
    clearTimers();

    const warningDelay = Math.max(timeoutMs - warningDurationMs, 0);
    if (warningDelay > 0) {
      warningTimerRef.current = window.setTimeout(
        setWarningState,
        warningDelay,
      );
    }

    idleTimerRef.current = window.setTimeout(setIdleState, timeoutMs);
  };

  const handleActivity = () => {
    const wasInactive = statusRef.current !== 'active';
    hasTriggeredIdleRef.current = false;
    lastActivityAtRef.current = Date.now();
    armTimers();

    statusRef.current = 'active';
    const nextState = buildState('active', lastActivityAtRef.current);
    setState(nextState);

    if (wasInactive) {
      onActive?.(nextState);
      emitStateChange('active', nextState);
    }
  };

  useEffect(() => {
    setState((previousState) => ({
      ...previousState,
      timeoutMs,
      warningDurationMs,
    }));
  }, [timeoutMs, warningDurationMs]);

  useEffect(() => {
    if (!trackingEnabled) {
      clearTimers();
      return;
    }

    lastActivityAtRef.current = Date.now();
    hasTriggeredIdleRef.current = false;
    statusRef.current = 'active';
    setState(buildState('active', lastActivityAtRef.current));
    armTimers();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleActivity();
      }
    };

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimers();
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackingEnabled, timeoutMs, warningDurationMs, triggerLogoutOnIdle]);

  if (!children) {
    return null;
  }

  return <>{typeof children === 'function' ? children(state) : children}</>;
}

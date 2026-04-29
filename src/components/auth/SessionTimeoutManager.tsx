'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useActivityMonitor } from '@/hooks/useActivityMonitor';
import { Clock } from 'lucide-react';
import { authService } from '@/services/auth.service';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 mins (standard NextAuth JWT default is much longer, but for security we might want shorter)
const WARNING_THRESHOLD = 2 * 60 * 1000; // 2 mins before expiry
const EXTEND_SESSION_INTERVAL = 5 * 60 * 1000; // Extend every 5 mins on activity

/**
 * SessionTimeoutManager
 * Manages user session expiration dynamically by showing a warning modal before expiry,
 * extending the session on user activity, and automatically logging out when expired.
 */
export const SessionTimeoutManager = () => {
  const { data: session, status, update } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WARNING_THRESHOLD);
  const lastUpdateRef = useRef<number>(Date.now());
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const { isActive } = useActivityMonitor({
    inactivityThreshold: 60000, // 1 min inactivity detection
  });

  const handleLogout = useCallback(async () => {
    await authService.logout();
  }, []);

  const handleExtend = useCallback(async () => {
    lastUpdateRef.current = Date.now();
    setShowWarning(false);
    // Sync with backend session using update()
    // This refreshes the session from the client side
    await update();
    startTimers();
  }, [update]);

  // Use a stable reference to startTimers to avoid re-renders
  const startTimers = useCallback(() => {
    // Clear existing timers
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    // If we're not authenticated, don't start any timers
    if (status !== 'authenticated') return;

    // Set logout timer
    logoutTimerRef.current = setTimeout(handleLogout, SESSION_TIMEOUT);

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeLeft(WARNING_THRESHOLD);

      // Start countdown interval
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            if (countdownIntervalRef.current)
              clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    }, SESSION_TIMEOUT - WARNING_THRESHOLD);
  }, [handleLogout, status]);

  // Extend session automatically on activity
  useEffect(() => {
    if (status === 'authenticated' && isActive) {
      const now = Date.now();
      // If the session hasn't been extended in the last EXTEND_SESSION_INTERVAL
      // and we are active, refresh the session
      if (now - lastUpdateRef.current > EXTEND_SESSION_INTERVAL) {
        handleExtend();
      }
    }
  }, [isActive, status, handleExtend]);

  // Restart timers whenever session status changes to authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      startTimers();
    }

    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current)
        clearInterval(countdownIntervalRef.current);
    };
  }, [status, startTimers]);

  // Close warning if session state changes externally (e.g. extension from another tab)
  // useSession update will trigger a re-render
  useEffect(() => {
    if (status === 'authenticated' && showWarning && timeLeft > 0) {
      // If timeLeft was reset somehow, we might want to close the warning
      // but in NextAuth v4, update() returns the new session data which might not change the expiration immediately
      // unless the backend sends a new one. For now, we trust the local timer mostly.
    }
  }, [session, status, showWarning, timeLeft]);

  if (status !== 'authenticated') return null;

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      open={showWarning}
      onOpenChange={(open) => {
        if (!open) {
          // If the user closed the modal via backdrop or Esc, we extend the session
          handleExtend();
        }
      }}
      title="Session Expiring"
      description="Your session is about to expire due to inactivity. For your security, we will log you out soon if you are not active."
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-6">
        <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-4 animate-pulse">
          <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-foreground">
            Logging out in{' '}
            <span className="text-amber-600 dark:text-amber-400 tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </p>
          <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
            Click 'Stay Logged In' to continue your session and prevent being
            logged out.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full sm:w-auto hover:bg-destructive/10 hover:text-destructive"
        >
          Logout Now
        </Button>
        <Button onClick={handleExtend} className="w-full sm:w-auto">
          Stay Logged In
        </Button>
      </div>
    </Modal>
  );
};

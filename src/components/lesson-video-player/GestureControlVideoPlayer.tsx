'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Issue #357: Gesture-Control Video Player Component
 * 
 * Adds gesture-based controls for mobile devices to improve mobile usability.
 * Features:
 * - Swipe to seek (left/right)
 * - Tap to pause/play
 * - Double tap to skip forward/backward
 * - Smooth interaction with visual feedback
 */

export interface GestureControlVideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  seekAmount?: number;
  doubleTapSeekAmount?: number;
  enabled?: boolean;
  onGesture?: (gesture: string) => void;
}

type GestureType = 'tap' | 'double-tap-left' | 'double-tap-right' | 'swipe-left' | 'swipe-right';

export const GestureControlVideoPlayer: React.FC<GestureControlVideoPlayerProps> = ({
  videoRef,
  seekAmount = 10,
  doubleTapSeekAmount = 10,
  enabled = true,
  onGesture,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gestureIndicator, setGestureIndicator] = useState<{
    type: GestureType;
    x: number;
    y: number;
  } | null>(null);

  // Touch tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number } | null>(null);
  const doubleTapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update playing state
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set initial state
    setIsPlaying(!video.paused);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef]);

  // Show gesture indicator
  const showGestureIndicator = useCallback((type: GestureType, x: number, y: number) => {
    setGestureIndicator({ type, x, y });
    setTimeout(() => setGestureIndicator(null), 800);
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  // Seek video
  const seekVideo = useCallback((seconds: number) => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    video.currentTime = newTime;
  }, [videoRef]);

  // Handle touch start
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enabled || !containerRef.current) return;

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, [enabled]);

  // Handle touch end
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!enabled || !touchStartRef.current || !containerRef.current) return;

    const touch = e.changedTouches[0];
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    const deltaTime = touchEnd.time - touchStartRef.current.time;

    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = touch.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    const isLeftSide = relativeX < containerWidth / 2;

    // Detect swipe (fast horizontal movement)
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 2 && deltaTime < 300) {
      if (deltaX > 0) {
        // Swipe right - seek forward
        seekVideo(seekAmount);
        showGestureIndicator('swipe-right', touchEnd.x, touchEnd.y);
        onGesture?.('swipe-right');
      } else {
        // Swipe left - seek backward
        seekVideo(-seekAmount);
        showGestureIndicator('swipe-left', touchEnd.x, touchEnd.y);
        onGesture?.('swipe-left');
      }
    }
    // Detect tap (minimal movement, quick)
    else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
      const now = Date.now();
      
      // Check for double tap
      if (lastTapRef.current && now - lastTapRef.current.time < 300) {
        // Clear single tap timeout
        if (doubleTapTimeoutRef.current) {
          clearTimeout(doubleTapTimeoutRef.current);
          doubleTapTimeoutRef.current = null;
        }

        // Double tap detected
        if (isLeftSide) {
          // Double tap left side - seek backward
          seekVideo(-doubleTapSeekAmount);
          showGestureIndicator('double-tap-left', touchEnd.x, touchEnd.y);
          onGesture?.('double-tap-left');
        } else {
          // Double tap right side - seek forward
          seekVideo(doubleTapSeekAmount);
          showGestureIndicator('double-tap-right', touchEnd.x, touchEnd.y);
          onGesture?.('double-tap-right');
        }

        lastTapRef.current = null;
      } else {
        // Single tap - wait to see if it becomes a double tap
        lastTapRef.current = { time: now, x: touchEnd.x };
        
        doubleTapTimeoutRef.current = setTimeout(() => {
          // Single tap confirmed - toggle play/pause
          togglePlayPause();
          showGestureIndicator('tap', touchEnd.x, touchEnd.y);
          onGesture?.('tap');
          lastTapRef.current = null;
        }, 300);
      }
    }

    touchStartRef.current = null;
  }, [enabled, seekVideo, seekAmount, doubleTapSeekAmount, togglePlayPause, showGestureIndicator, onGesture]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (doubleTapTimeoutRef.current) {
        clearTimeout(doubleTapTimeoutRef.current);
      }
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Gesture Indicators */}
      <AnimatePresence>
        {gestureIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-none"
            style={{
              left: gestureIndicator.x,
              top: gestureIndicator.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Tap - Play/Pause */}
            {gestureIndicator.type === 'tap' && (
              <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                {isPlaying ? (
                  <Pause className="w-12 h-12 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-12 h-12 text-white" fill="currentColor" />
                )}
              </div>
            )}

            {/* Double Tap Left - Seek Backward */}
            {gestureIndicator.type === 'double-tap-left' && (
              <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <SkipBack className="w-10 h-10 text-white" fill="currentColor" />
                  <span className="text-white font-bold text-lg">{doubleTapSeekAmount}s</span>
                </div>
              </div>
            )}

            {/* Double Tap Right - Seek Forward */}
            {gestureIndicator.type === 'double-tap-right' && (
              <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold text-lg">{doubleTapSeekAmount}s</span>
                  <SkipForward className="w-10 h-10 text-white" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Swipe Left - Seek Backward */}
            {gestureIndicator.type === 'swipe-left' && (
              <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <SkipBack className="w-8 h-8 text-white" />
                  <span className="text-white font-bold">{seekAmount}s</span>
                </div>
              </div>
            )}

            {/* Swipe Right - Seek Forward */}
            {gestureIndicator.type === 'swipe-right' && (
              <div className="bg-black/70 rounded-full p-4 backdrop-blur-sm">
                <div className="flex items-center gap-1">
                  <span className="text-white font-bold">{seekAmount}s</span>
                  <SkipForward className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Touch zones indicator (only visible during development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-20 transition-opacity">
          <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-blue-500 border-r-2 border-white">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs">
              Double Tap: -{doubleTapSeekAmount}s
            </span>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-green-500">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs">
              Double Tap: +{doubleTapSeekAmount}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestureControlVideoPlayer;

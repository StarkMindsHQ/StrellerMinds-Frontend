'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// ── Storage helpers ────────────────────────────────────────────────────────────

const STORAGE_KEY = (videoId: string) => `auto-resume-${videoId}`;

function savePosition(videoId: string, time: number): void {
  try {
    localStorage.setItem(STORAGE_KEY(videoId), JSON.stringify({ time, savedAt: Date.now() }));
  } catch {
    // storage unavailable — silently ignore
  }
}

function loadPosition(videoId: string): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(videoId));
    if (!raw) return 0;
    const { time } = JSON.parse(raw) as { time: number; savedAt: number };
    return typeof time === 'number' ? time : 0;
  } catch {
    return 0;
  }
}

function clearPosition(videoId: string): void {
  try {
    localStorage.removeItem(STORAGE_KEY(videoId));
  } catch {
    // ignore
  }
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AutoResumePlaybackProps {
  videoId: string;
  videoUrl: string;
  title?: string;
  /** Interval in ms to persist progress (default 2000) */
  saveIntervalMs?: number;
  onProgressChange?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * AutoResumePlayback — Issue #352
 *
 * Persists and restores video playback position across sessions.
 * Position is saved to localStorage keyed by videoId and restored
 * on mount. Clearing the stored position on completion prevents
 * re-resuming a finished video.
 */
export default function AutoResumePlayback({
  videoId,
  videoUrl,
  title,
  saveIntervalMs = 2000,
  onProgressChange,
  onEnded,
  className = '',
}: AutoResumePlaybackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [resumedFrom, setResumedFrom] = useState(0);

  // Restore position on mount
  useEffect(() => {
    const saved = loadPosition(videoId);
    if (saved > 0 && videoRef.current) {
      videoRef.current.currentTime = saved;
      setResumedFrom(saved);
      setResumed(true);
    }
  }, [videoId]);

  // Periodic position save
  useEffect(() => {
    saveTimerRef.current = setInterval(() => {
      if (videoRef.current && isPlaying) {
        savePosition(videoId, videoRef.current.currentTime);
      }
    }, saveIntervalMs);
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [videoId, isPlaying, saveIntervalMs]);

  const handleLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration ?? 0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    setCurrentTime(t);
    onProgressChange?.(t, videoRef.current?.duration ?? 0);
  }, [onProgressChange]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    clearPosition(videoId);
    onEnded?.();
  }, [videoId, onEnded]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setResumed(false);
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`rounded-xl overflow-hidden bg-black shadow-lg ${className}`} data-testid="auto-resume-playback">
      {/* Resume banner */}
      {resumed && (
        <div className="bg-blue-600 text-white text-sm px-4 py-2 flex items-center justify-between">
          <span>Resuming from {formatTime(resumedFrom)}</span>
          <button onClick={restart} className="flex items-center gap-1 underline text-xs">
            <RotateCcw className="w-3 h-3" /> Start over
          </button>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        data-testid="video-element"
      />

      {/* Controls */}
      <div className="bg-gray-900 px-4 py-3 space-y-2">
        {title && <p className="text-white text-sm font-medium truncate">{title}</p>}

        {/* Progress bar */}
        <div className="relative h-1.5 bg-gray-700 rounded-full">
          <div
            className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="text-white hover:text-blue-400 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <span className="text-gray-400 text-xs tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

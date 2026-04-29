'use client';

import React from 'react';
import { Volume2, VolumeX, SkipForward, Settings } from 'lucide-react';

export interface AutoSkipSilenceControlsProps {
  /** Whether silence detection is enabled */
  isEnabled: boolean;
  /** Whether currently detecting silence */
  isDetecting: boolean;
  /** Whether currently in a silent period */
  isSilent: boolean;
  /** Total time skipped in seconds */
  totalSkippedTime: number;
  /** Toggle silence detection */
  onToggle: () => void;
  /** Current audio level (0-255) */
  audioLevel?: number;
  className?: string;
}

/**
 * AutoSkipSilenceControls - UI controls for the auto-skip silence feature
 * Provides toggle button and displays skip statistics
 */
export default function AutoSkipSilenceControls({
  isEnabled,
  isDetecting,
  isSilent,
  totalSkippedTime,
  onToggle,
  audioLevel = 0,
  className = '',
}: AutoSkipSilenceControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-all duration-200 ease-in-out
          ${isDetecting
            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
            : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700/70'
          }
        `}
        aria-label={isDetecting ? 'Disable auto-skip silence' : 'Enable auto-skip silence'}
        title={isDetecting ? 'Auto-skip silence is ON' : 'Auto-skip silence is OFF'}
      >
        {isDetecting ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isDetecting ? 'Skip Silence' : 'Skip Silence'}
        </span>
      </button>

      {/* Status Indicator */}
      {isDetecting && isSilent && (
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
          <SkipForward className="w-3 h-3 animate-pulse" />
          <span>Skipping...</span>
        </div>
      )}

      {/* Time Saved Display */}
      {isDetecting && totalSkippedTime > 0 && (
        <div
          className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
          title="Total time saved by skipping silence"
        >
          <span>Saved: {formatTime(totalSkippedTime)}</span>
        </div>
      )}
    </div>
  );
}

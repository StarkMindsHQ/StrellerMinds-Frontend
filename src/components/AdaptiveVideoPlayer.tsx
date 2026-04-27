'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Settings, Loader2 } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export type QualityLevel = 'auto' | '1080p' | '720p' | '480p' | '360p';
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;

export interface QualitySource {
  quality: Exclude<QualityLevel, 'auto'>;
  url: string;
}

export interface AdaptiveVideoPlayerProps {
  sources: QualitySource[];
  lessonId: string;
  title?: string;
  /** Override automatic quality selection */
  initialQuality?: QualityLevel;
  onQualityChange?: (q: QualityLevel) => void;
  onSpeedChange?: (s: PlaybackSpeed) => void;
  className?: string;
}

// ── Bandwidth estimation ───────────────────────────────────────────────────────

function estimateBandwidthKbps(): number {
  // Use Navigator connection API when available
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = (navigator as { connection?: { downlink?: number } }).connection;
    if (conn?.downlink) return conn.downlink * 1000; // Mbps → kbps
  }
  return 5000; // fallback: assume good connection
}

function pickQuality(kbps: number): Exclude<QualityLevel, 'auto'> {
  if (kbps >= 8000) return '1080p';
  if (kbps >= 3000) return '720p';
  if (kbps >= 1500) return '480p';
  return '360p';
}

// ── Storage helpers ────────────────────────────────────────────────────────────

const RESUME_KEY = (id: string) => `adaptive-resume-${id}`;

function saveTime(lessonId: string, t: number) {
  try { localStorage.setItem(RESUME_KEY(lessonId), String(t)); } catch { /* ignore */ }
}

function loadTime(lessonId: string): number {
  try { return parseFloat(localStorage.getItem(RESUME_KEY(lessonId)) ?? '0') || 0; } catch { return 0; }
}

// ── Component ──────────────────────────────────────────────────────────────────

const SPEEDS: PlaybackSpeed[] = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * AdaptiveVideoPlayer — Issue #350
 *
 * Auto-selects quality based on estimated bandwidth, resumes from the last
 * saved position, and provides speed-control options. Shows buffering state
 * visually while data loads.
 */
export default function AdaptiveVideoPlayer({
  sources,
  lessonId,
  title,
  initialQuality = 'auto',
  onQualityChange,
  onSpeedChange,
  className = '',
}: AdaptiveVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState<QualityLevel>(initialQuality);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [showMenu, setShowMenu] = useState(false);

  // Pick initial quality automatically
  useEffect(() => {
    if (initialQuality === 'auto') {
      const kbps = estimateBandwidthKbps();
      setQuality(pickQuality(kbps));
    }
  }, [initialQuality]);

  // Change source when quality changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = quality === 'auto'
      ? sources[0]?.url
      : sources.find(s => s.quality === quality)?.url ?? sources[0]?.url;
    if (!src || video.src === src) return;
    const savedTime = video.currentTime || loadTime(lessonId);
    video.src = src;
    video.currentTime = savedTime;
    if (isPlaying) video.play().catch(() => {});
    onQualityChange?.(quality);
  }, [quality]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resume position on mount
  useEffect(() => {
    const saved = loadTime(lessonId);
    if (saved > 0 && videoRef.current) videoRef.current.currentTime = saved;
  }, [lessonId]);

  // Apply speed changes
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
    onSpeedChange?.(speed);
  }, [speed, onSpeedChange]);

  const handleTimeUpdate = useCallback(() => {
    const t = videoRef.current?.currentTime ?? 0;
    setCurrentTime(t);
    saveTime(lessonId, t);
  }, [lessonId]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); }
    else { videoRef.current.play().catch(() => {}); }
    setIsPlaying(!isPlaying);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div className={`rounded-xl overflow-hidden bg-black shadow-lg relative ${className}`} data-testid="adaptive-video-player">
      {/* Buffering overlay */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      <video
        ref={videoRef}
        src={sources.find(s => s.quality === quality)?.url ?? sources[0]?.url}
        className="w-full"
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onEnded={() => { setIsPlaying(false); }}
        data-testid="adaptive-video-element"
      />

      {/* Controls bar */}
      <div className="bg-gray-900 px-4 py-3 space-y-2">
        {title && <p className="text-white text-sm font-medium truncate">{title}</p>}

        {/* Seek */}
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.5}
          value={currentTime}
          onChange={seek}
          className="w-full accent-blue-500"
          aria-label="Seek"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-blue-400" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-gray-400 text-xs tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
          </div>

          {/* Settings menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-white"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute bottom-8 right-0 bg-gray-800 rounded-lg p-3 min-w-[160px] z-20 space-y-3 shadow-xl">
                {/* Quality */}
                <div>
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Quality</p>
                  {(['auto', '1080p', '720p', '480p', '360p'] as QualityLevel[]).map(q => (
                    <button
                      key={q}
                      onClick={() => { setQuality(q); setShowMenu(false); }}
                      className={`block w-full text-left text-sm px-2 py-1 rounded ${quality === q ? 'text-blue-400 font-semibold' : 'text-white hover:bg-gray-700'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Speed */}
                <div>
                  <p className="text-gray-400 text-xs mb-1 uppercase tracking-wide">Speed</p>
                  {SPEEDS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSpeed(s); setShowMenu(false); }}
                      className={`block w-full text-left text-sm px-2 py-1 rounded ${speed === s ? 'text-blue-400 font-semibold' : 'text-white hover:bg-gray-700'}`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

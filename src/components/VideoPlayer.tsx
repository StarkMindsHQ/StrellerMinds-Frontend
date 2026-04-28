'use client';

import React, { useRef, useEffect, useState } from 'react';
import { updateVideoProgress } from '@/services/videoProgress';
import { enhancedVideoProgressService } from '@/services/enhancedVideoProgress';
import { Play, Pause, Volume2, VolumeX, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { useSilenceDetector } from '@/hooks/useSilenceDetector';
import AutoSkipSilenceControls from '@/components/learning/AutoSkipSilenceControls';

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  title: string;
  onProgressUpdate?: (watched: number, total: number) => void;
  /** Enable auto-skip silence feature */
  enableSilenceSkip?: boolean;
  /** Silence detection threshold (0-255) */
  silenceThreshold?: number;
  /** Minimum silence duration to skip (seconds) */
  minSilenceDuration?: number;
}

export default function VideoPlayer({
  videoId,
  videoUrl,
  title,
  onProgressUpdate,
  enableSilenceSkip = false,
  silenceThreshold = 20,
  minSilenceDuration = 1.5,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [resumePosition, setResumePosition] = useState(0);

  // Available playback speeds
  const playbackSpeeds = [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 1.75, label: '1.75x' },
    { value: 2, label: '2x' },
  ];

  // Initialize enhanced tracking
  useEffect(() => {
    // Set a mock user ID (in production, this would come from auth)
    enhancedVideoProgressService.setCurrentUser('demo-user');

    // Get resume position
    const lastPosition =
      enhancedVideoProgressService.getResumePosition(videoId);
    setResumePosition(lastPosition);
  }, [videoId]);

  // Initialize silence detector
  const {
    isDetecting: isSilenceDetecting,
    isSilent,
    totalSkippedTime,
    toggleDetection: toggleSilenceDetection,
    currentLevel: audioLevel,
  } = useSilenceDetector(videoRef.current, {
    enabled: enableSilenceSkip,
    threshold: silenceThreshold,
    minSilenceDuration,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Update progress every 2 seconds to avoid excessive updates
      const now = Date.now();
      if (now - lastUpdateTime >= 2000) {
        const watchedTime = Math.min(video.currentTime, video.duration); // Ensure watched time doesn't exceed duration

        // Update both old and new progress services
        updateVideoProgress(videoId, watchedTime, video.duration);
        enhancedVideoProgressService.updatePosition(
          videoId,
          watchedTime,
          video.duration,
        );

        onProgressUpdate?.(watchedTime, video.duration);
        setLastUpdateTime(now);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);

      // Ensure we mark as completed with exact duration
      updateVideoProgress(videoId, video.duration, video.duration);
      enhancedVideoProgressService.updatePosition(
        videoId,
        video.duration,
        video.duration,
      );
      enhancedVideoProgressService.recordEvent('play');

      // End the tracking session
      enhancedVideoProgressService.endSession();
      setCurrentSessionId(null);

      onProgressUpdate?.(video.duration, video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoId, onProgressUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSessionId) {
        enhancedVideoProgressService.endSession();
      }
    };
  }, [currentSessionId]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      enhancedVideoProgressService.recordEvent('pause');
    } else {
      // Start tracking session if not already started
      if (!currentSessionId) {
        const sessionId = enhancedVideoProgressService.startSession(videoId);
        setCurrentSessionId(sessionId);

        // Resume from last position if available
        if (
          resumePosition > 0 &&
          Math.abs(video.currentTime - resumePosition) < 5
        ) {
          video.currentTime = resumePosition;
        }
      }

      video.play();
      enhancedVideoProgressService.recordEvent('play');
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);

    // Record speed change event
    enhancedVideoProgressService.recordEvent('speed_change', { speed });
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);

    // Record seek event
    enhancedVideoProgressService.recordEvent('seek', {
      fromTime: video.currentTime,
      toTime: newTime,
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="relative bg-black rounded-xl overflow-hidden group shadow-2xl border border-white/10"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Aspect Ratio Container for Video */}
      <div className="aspect-video w-full relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          preload="metadata"
          playsInline
        />

        {/* Play Button Overlay - Larger for touch */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10"
            >
              <Button
                onClick={togglePlay}
                className="bg-primary/90 hover:bg-primary text-white border border-white/20 rounded-full w-20 h-20 md:w-24 md:h-24 shadow-2xl transition-transform active:scale-95"
              >
                <Play
                  className="w-10 h-10 md:w-12 md:h-12 ml-1"
                  fill="currentColor"
                />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Controls - More touch friendly */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 md:p-6 transition-all duration-300 z-20 ${
          showControls || !isPlaying
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Progress Bar Container with larger hit area */}
        <div
          className="w-full h-6 flex items-center mb-2 md:mb-4 cursor-pointer group/progress"
          onClick={handleProgressClick}
        >
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/progress:h-2 transition-all">
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-100 flex items-center justify-end"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white hover:bg-white/10 p-2 h-10 w-10 md:h-12 md:w-12 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 md:w-7 md:w-7" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6 md:w-7 md:w-7" fill="currentColor" />
              )}
            </Button>

            <div className="flex items-center gap-1 md:gap-2 group/volume">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/10 p-2 h-10 w-10 md:h-12 md:w-12 rounded-full"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 md:w-7 md:w-7" />
                ) : (
                  <Volume2 className="w-6 h-6 md:w-7 md:w-7" />
                )}
              </Button>
            </div>

            {/* Auto-skip silence controls */}
            {enableSilenceSkip && (
              <AutoSkipSilenceControls
                isEnabled={enableSilenceSkip}
                isDetecting={isSilenceDetecting}
                isSilent={isSilent}
                totalSkippedTime={totalSkippedTime}
                onToggle={toggleSilenceDetection}
                audioLevel={audioLevel}
              />
            )}

            <span className="text-white text-sm md:text-base font-medium tabular-nums shadow-sm">
              {formatTime(currentTime)} <span className="text-white/60">/</span>{' '}
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Control */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:bg-white/10 p-2 h-10 w-10 md:h-12 md:w-12 rounded-full relative"
              >
                <Gauge className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -bottom-1 -right-1 text-xs text-white bg-[#5c0f49] rounded-full w-4 h-4 flex items-center justify-center">
                  {playbackSpeed}x
                </span>
              </Button>

              {/* Speed Menu */}
              <AnimatePresence>
                {showSpeedMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 backdrop-blur-sm rounded-lg p-1 shadow-xl border border-white/10 z-30"
                  >
                    <div className="grid grid-cols-1 gap-1 min-w-[80px]">
                      {playbackSpeeds.map((speed) => (
                        <Button
                          key={speed.value}
                          variant={
                            playbackSpeed === speed.value ? 'default' : 'ghost'
                          }
                          size="sm"
                          onClick={() => changePlaybackSpeed(speed.value)}
                          className={`text-xs px-3 py-1 h-8 justify-center ${
                            playbackSpeed === speed.value
                              ? 'bg-[#5c0f49] text-white'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {speed.label}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden sm:block text-white text-sm md:text-base font-semibold truncate max-w-[200px] md:max-w-md drop-shadow-md">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}

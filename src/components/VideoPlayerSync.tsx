'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSilenceDetector } from '@/hooks/useSilenceDetector';
import AutoSkipSilenceControls from '@/components/learning/AutoSkipSilenceControls';
import SubtitleCustomizationPanel from '@/components/lesson-video-player/SubtitleCustomizationPanel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subtitles, Settings } from 'lucide-react';

export interface SubtitleTrack {
  src: string;
  srclang: string;
  label: string;
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  default?: boolean;
}

interface VideoPlayerSyncProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  videoId: string;
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  saveProgress?: boolean;
  /** Enable auto-skip silence feature */
  enableSilenceSkip?: boolean;
  /** Silence detection threshold (0-255) */
  silenceThreshold?: number;
  /** Minimum silence duration to skip (seconds) */
  minSilenceDuration?: number;
  /** Subtitle tracks for the video */
  subtitleTracks?: SubtitleTrack[];
}

const VideoPlayerSync: React.FC<VideoPlayerSyncProps> = ({
  videoId,
  src,
  poster,
  className,
  autoPlay = false,
  saveProgress = true,
  enableSilenceSkip = false,
  silenceThreshold = 20,
  minSilenceDuration = 1.5,
  subtitleTracks = [],
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('off');
  const [showSubtitleSettings, setShowSubtitleSettings] = useState(false);

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

  // Load subtitle preferences
  useEffect(() => {
    const savedEnabled = localStorage.getItem(`starkminds-video-subtitles-enabled-${videoId}`);
    const savedLanguage = localStorage.getItem(`starkminds-video-subtitles-language-${videoId}`);
    
    if (savedEnabled !== null) {
      setSubtitlesEnabled(savedEnabled === 'true');
    }
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, [videoId]);

  // Handle subtitle track changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Update text tracks based on selection
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      if (track.kind === 'subtitles' || track.kind === 'captions') {
        if (selectedLanguage === 'off') {
          track.mode = 'disabled';
        } else if (track.language === selectedLanguage) {
          track.mode = subtitlesEnabled ? 'showing' : 'hidden';
        } else {
          track.mode = 'disabled';
        }
      }
    }
  }, [selectedLanguage, subtitlesEnabled]);

  // Handle state restoration and persistence logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoaded(true);

      // Restore volume (Global preference)
      const savedVolume = localStorage.getItem('starkminds-video-volume');
      if (savedVolume !== null) {
        video.volume = parseFloat(savedVolume);
      }

      // Restore progress (Per video)
      if (saveProgress) {
        const savedTime = localStorage.getItem(
          `starkminds-video-progress-${videoId}`,
        );
        if (savedTime) {
          const time = parseFloat(savedTime);
          if (time < video.duration) {
            video.currentTime = time;
          }
        }
      }

      // Restore play state or respect autoPlay
      const wasPlaying =
        localStorage.getItem(`starkminds-video-playing-${videoId}`) === 'true';
      if (wasPlaying || autoPlay) {
        video.play().catch((err) => {
          console.debug('Autoplay prevented:', err);
        });
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoId, saveProgress, autoPlay, src]);

  // Event Handlers for State Persistence
  const onTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (saveProgress) {
      const video = e.currentTarget;
      localStorage.setItem(
        `starkminds-video-progress-${videoId}`,
        video.currentTime.toString(),
      );
    }
    props.onTimeUpdate?.(e);
  };

  const onVolumeChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    localStorage.setItem('starkminds-video-volume', video.volume.toString());
    props.onVolumeChange?.(e);
  };

  const onPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    localStorage.setItem(`starkminds-video-playing-${videoId}`, 'true');
    localStorage.setItem('starkminds-last-watched', videoId);
    props.onPlay?.(e);
  };

  const onPause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    localStorage.setItem(`starkminds-video-playing-${videoId}`, 'false');
    props.onPause?.(e);
  };

  // Subtitle handlers
  const toggleSubtitles = () => {
    const newEnabled = !subtitlesEnabled;
    setSubtitlesEnabled(newEnabled);
    localStorage.setItem(`starkminds-video-subtitles-enabled-${videoId}`, newEnabled.toString());
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem(`starkminds-video-subtitles-language-${videoId}`, language);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-black shadow-lg',
        className,
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            controls
            onTimeUpdate={onTimeUpdate}
            onVolumeChange={onVolumeChange}
            onPlay={onPlay}
            onPause={onPause}
            {...props}
          >
            {/* Subtitle tracks */}
            {subtitleTracks.map((track, index) => (
              <track
                key={index}
                src={track.src}
                kind={track.kind || 'subtitles'}
                srclang={track.srclang}
                label={track.label}
                default={track.default}
              />
            ))}
          </video>
          
          {/* Auto-skip silence controls overlay */}
          {enableSilenceSkip && (
            <div className="absolute top-4 right-4 z-10">
              <AutoSkipSilenceControls
                isEnabled={enableSilenceSkip}
                isDetecting={isSilenceDetecting}
                isSilent={isSilent}
                totalSkippedTime={totalSkippedTime}
                onToggle={toggleSilenceDetection}
                audioLevel={audioLevel}
              />
            </div>
          )}

          {/* Subtitle controls overlay */}
          {subtitleTracks.length > 0 && (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {/* Subtitle toggle button */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSubtitles}
                className={cn(
                  "bg-black/50 hover:bg-black/70 text-white border-white/20",
                  subtitlesEnabled && "bg-blue-600/70 hover:bg-blue-700/70"
                )}
                title={subtitlesEnabled ? "Disable Subtitles" : "Enable Subtitles"}
              >
                <Subtitles className="w-5 h-5" />
              </Button>

              {/* Language selector */}
              <Select value={selectedLanguage} onValueChange={selectLanguage}>
                <SelectTrigger className="w-24 bg-black/50 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  {subtitleTracks.map((track, index) => (
                    <SelectItem key={index} value={track.srclang}>
                      {track.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Subtitle settings */}
              <SubtitleCustomizationPanel
                videoRef={videoRef}
                storageKey={`subtitle-preferences-${videoId}`}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayerSync;

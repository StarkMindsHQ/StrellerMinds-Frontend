'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VideoPlayerSyncProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  videoId: string;
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  saveProgress?: boolean;
}

const VideoPlayerSync: React.FC<VideoPlayerSyncProps> = ({
  videoId,
  src,
  poster,
  className,
  autoPlay = false,
  saveProgress = true,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
        const savedTime = localStorage.getItem(`starkminds-video-progress-${videoId}`);
        if (savedTime) {
          const time = parseFloat(savedTime);
          if (time < video.duration) {
            video.currentTime = time;
          }
        }
      }

      // Restore play state or respect autoPlay
      const wasPlaying = localStorage.getItem(`starkminds-video-playing-${videoId}`) === 'true';
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
      localStorage.setItem(`starkminds-video-progress-${videoId}`, video.currentTime.toString());
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

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-black shadow-lg", className)}>
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
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayerSync;
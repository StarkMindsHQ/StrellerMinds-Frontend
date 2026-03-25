import React, { useEffect, useRef, useState } from "react";
import { LessonVideoPlayerProps } from "./LessonVideoPlayer.types";
import { saveProgress, getProgress } from "./videoPlayer.utils";
import { VideoControls } from "./VideoControls";

export const LessonVideoPlayer: React.FC<LessonVideoPlayerProps> = ({
  src,
  lessonId,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);

  // Resume from last saved time
  useEffect(() => {
    const savedTime = getProgress(lessonId);
    if (videoRef.current) {
      videoRef.current.currentTime = savedTime;
    }
  }, [lessonId]);

  // Track progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
    saveProgress(lessonId, current);
  };

  // Controls
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-2xl overflow-hidden group"
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
      />

      <VideoControls
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={togglePlay}
        onSkip={skip}
        onSpeedChange={changeSpeed}
        onFullscreen={toggleFullscreen}
      />
    </div>
  );
};
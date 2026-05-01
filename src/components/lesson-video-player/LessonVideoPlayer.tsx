import React, { useEffect, useRef, useState } from 'react';
import { LessonVideoPlayerProps } from './LessonVideoPlayer.types';
import { saveProgress, getProgress } from './videoPlayer.utils';
import { VideoControls } from './VideoControls';
import { useLazyVideo } from '@/hooks/useLazyVideo';
import SubtitleCustomizationPanel from './SubtitleCustomizationPanel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subtitles } from 'lucide-react';
import { SubtitleTrack } from '@/components/VideoPlayerSync';

export const LessonVideoPlayer: React.FC<LessonVideoPlayerProps> = ({
  src,
  lessonId,
  autoPlay = false,
  subtitleTracks = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldLoad, triggerLoad } = useLazyVideo(videoRef);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('off');

  // Resume from last saved time
  useEffect(() => {
    const savedTime = getProgress(lessonId);
    if (videoRef.current) {
      videoRef.current.currentTime = savedTime;
    }
  }, [lessonId]);

  // Load subtitle preferences
  useEffect(() => {
    const savedEnabled = localStorage.getItem(`lesson-subtitles-enabled-${lessonId}`);
    const savedLanguage = localStorage.getItem(`lesson-subtitles-language-${lessonId}`);
    
    if (savedEnabled !== null) {
      setSubtitlesEnabled(savedEnabled === 'true');
    }
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, [lessonId]);

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

  useEffect(() => {
    if (autoPlay) {
      triggerLoad();
    }
  }, [autoPlay, triggerLoad]);

  // Track progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
    saveProgress(lessonId, current);
  };

  // Controls
  const ensureVideoLoaded = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!shouldLoad) {
      triggerLoad();
      if (!video.src) {
        video.src = src;
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    ensureVideoLoaded();

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

  // Subtitle handlers
  const toggleSubtitles = () => {
    const newEnabled = !subtitlesEnabled;
    setSubtitlesEnabled(newEnabled);
    localStorage.setItem(`lesson-subtitles-enabled-${lessonId}`, newEnabled.toString());
  };

  const selectLanguage = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem(`lesson-subtitles-language-${lessonId}`, language);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-2xl overflow-hidden group"
    >
      <video
        ref={videoRef}
        src={shouldLoad ? src : undefined}
        preload="metadata"
        playsInline
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
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

      {/* Subtitle controls overlay */}
      {subtitleTracks.length > 0 && (
        <div className="absolute top-4 left-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Subtitle toggle button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSubtitles}
            className="bg-black/50 hover:bg-black/70 text-white border-white/20"
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
            storageKey={`lesson-subtitle-preferences-${lessonId}`}
          />
        </div>
      )}

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

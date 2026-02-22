'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic } from 'lucide-react';

interface VoiceNotePlayerProps {
  audioUrl: string;
  duration: number;
  userName: string;
  isCurrentUser: boolean;
}

export default function VoiceNotePlayer({
  audioUrl,
  duration,
  userName,
  isCurrentUser,
}: VoiceNotePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!audioUrl || audioUrl.trim() === '') {
      console.warn('VoiceNotePlayer: No audioUrl provided');
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onpause = () => {
        setIsPlaying(false);
      };

      audio.onplay = () => {
        setIsPlaying(true);
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    } catch (error) {
      console.error('VoiceNotePlayer: Error creating audio element:', error);
      audioRef.current = null;
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) {
      console.warn('VoiceNotePlayer: No audio element available');
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('VoiceNotePlayer: Error playing audio:', error);
      });
    }
  };

  if (!audioUrl || audioUrl.trim() === '') {
    return (
      <div
        className={`flex items-center gap-2 p-3 rounded-lg ${
          isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
        style={{ maxWidth: '80%', minWidth: '200px' }}
      >
        <Mic className="h-4 w-4 opacity-50" />
        <span className="text-sm opacity-70">Voice note (no audio data)</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg ${
        isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}
      style={{ maxWidth: '100%', minWidth: '180px' }}
    >
      <Button
        onClick={togglePlay}
        variant="ghost"
        size="icon"
        className={`h-10 w-10 sm:h-8 sm:w-8 touch-manipulation flex-shrink-0 ${
          isCurrentUser ? 'hover:bg-primary-foreground/20' : ''
        }`}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 sm:h-4 sm:w-4" />
        ) : (
          <Play className="h-5 w-5 sm:h-4 sm:w-4" />
        )}
      </Button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <Mic className="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-70 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-mono whitespace-nowrap">
            {formatDuration(currentTime)}
          </span>
          <span className="text-xs opacity-70">/</span>
          <span className="text-xs sm:text-sm font-mono opacity-70 whitespace-nowrap">
            {formatDuration(duration)}
          </span>
        </div>
        <div className="h-1.5 sm:h-1 bg-black/20 rounded-full overflow-hidden touch-none">
          <div
            className="h-full bg-current transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

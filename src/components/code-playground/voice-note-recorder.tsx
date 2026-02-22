'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Send } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceNoteRecorderProps {
  onRecordComplete: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

export default function VoiceNoteRecorder({
  onRecordComplete,
  disabled = false,
}: VoiceNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);

  // Format duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if pause/resume is supported
  const isPauseSupported = () => {
    return (
      mediaRecorderRef.current?.state && 'pause' in mediaRecorderRef.current
    );
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Stop any existing recording first
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Find supported MIME type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          setAudioBlob(blob);
        } else {
          toast.error('No audio data recorded');
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error('Recording error occurred');
        stopRecording();
      };

      // Start recording with timeslice to ensure data is collected
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      setDuration(0);

      // Update duration every 100ms
      durationIntervalRef.current = setInterval(() => {
        if (!isPaused) {
          const elapsed =
            (Date.now() - startTimeRef.current - pausedDurationRef.current) /
            1000;
          setDuration(elapsed);
        }
      }, 100);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
    setIsRecording(false);
    setIsPaused(false);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  };

  // Pause/Resume recording
  const togglePause = () => {
    if (!mediaRecorderRef.current) return;

    const recorder = mediaRecorderRef.current;
    const state = recorder.state;

    if (state === 'inactive') {
      return; // Can't pause if not recording
    }

    try {
      if (isPaused) {
        // Resume
        if (state === 'paused' && isPauseSupported()) {
          recorder.resume();
          startTimeRef.current = Date.now() - duration * 1000;
          pausedDurationRef.current = 0;
          durationIntervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            setDuration(elapsed);
          }, 100);
          setIsPaused(false);
        }
      } else {
        // Pause
        if (state === 'recording' && isPauseSupported()) {
          const pauseStartTime = Date.now();
          recorder.pause();
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
          }
          pausedDurationRef.current += Date.now() - pauseStartTime;
          setIsPaused(true);
        }
      }
    } catch (error) {
      console.error('Error toggling pause:', error);
      // If pause/resume not supported, just continue recording
      toast.info('Pause/resume not supported in this browser');
    }
  };

  // Play preview
  const playPreview = () => {
    if (!audioBlob) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
          toast.error('Failed to play audio');
        });
        setIsPlaying(true);
      }
    } else {
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        if (audioRef.current) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      };
      audio.onpause = () => {
        setIsPlaying(false);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error('Failed to play audio');
      };
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play audio');
      });
      setIsPlaying(true);
    }
  };

  // Send voice note
  const sendVoiceNote = () => {
    if (audioBlob && audioBlob.size > 0) {
      onRecordComplete(audioBlob, duration);
      // Reset
      setAudioBlob(null);
      setDuration(0);
      setIsPlaying(false);
      pausedDurationRef.current = 0;
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
    } else {
      toast.error('No audio to send');
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
    pausedDurationRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch (error) {
          console.error('Error stopping recorder on cleanup:', error);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      {!isRecording && !audioBlob && (
        <Button
          onClick={startRecording}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="w-full gap-2 min-h-[44px] sm:min-h-0 touch-manipulation"
        >
          <Mic className="h-4 w-4" />
          <span className="text-sm sm:text-base">Record Voice Note</span>
        </Button>
      )}

      {isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm sm:text-base font-mono">
                {formatDuration(duration)}
              </span>
            </div>
            <div className="flex gap-1 sm:gap-2">
              {isPauseSupported() && (
                <Button
                  onClick={togglePause}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-8 sm:w-8 touch-manipulation"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </Button>
              )}
              <Button
                onClick={stopRecording}
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-8 sm:w-8 touch-manipulation"
                title="Stop"
              >
                <Square className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {audioBlob && !isRecording && (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-md flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button
                onClick={playPreview}
                variant="ghost"
                size="icon"
                className="h-10 w-10 sm:h-8 sm:w-8 touch-manipulation flex-shrink-0"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
              <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-mono whitespace-nowrap">
                  {formatDuration(duration)}
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({(audioBlob.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <Button
                onClick={sendVoiceNote}
                size="sm"
                className="gap-2 min-h-[44px] sm:min-h-0 touch-manipulation"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
              <Button
                onClick={cancelRecording}
                variant="ghost"
                size="sm"
                className="min-h-[44px] sm:min-h-0 touch-manipulation"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseSilenceDetectorOptions {
  /** Audio volume threshold to consider as silence (0-255) */
  threshold?: number;
  /** Minimum duration of silence to trigger skip (in seconds) */
  minSilenceDuration?: number;
  /** Whether silence detection is enabled */
  enabled?: boolean;
  /** Callback when silence is detected and skipped */
  onSilenceSkip?: (startTime: number, endTime: number) => void;
}

export interface UseSilenceDetectorReturn {
  /** Whether silence detection is currently active */
  isDetecting: boolean;
  /** Whether currently in a silence period */
  isSilent: boolean;
  /** Total time skipped by silence detection (in seconds) */
  totalSkippedTime: number;
  /** Toggle silence detection on/off */
  toggleDetection: () => void;
  /** Current audio level (0-255) */
  currentLevel: number;
}

/**
 * Hook to detect silence in video audio and automatically skip it
 * Uses the Web Audio API to analyze audio levels
 */
export function useSilenceDetector(
  videoElement: HTMLVideoElement | null,
  options: UseSilenceDetectorOptions = {}
): UseSilenceDetectorReturn {
  const {
    threshold = 20,
    minSilenceDuration = 1.5,
    enabled = true,
    onSilenceSkip,
  } = options;

  const [isDetecting, setIsDetecting] = useState(enabled);
  const [isSilent, setIsSilent] = useState(false);
  const [totalSkippedTime, setTotalSkippedTime] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const isDisposedRef = useRef(false);

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    silenceStartRef.current = null;
    setIsSilent(false);
  }, []);

  const detectSilence = useCallback(() => {
    if (!analyserRef.current || !videoElement) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    setCurrentLevel(average);

    if (average < threshold) {
      // Silence detected
      if (!silenceStartRef.current) {
        silenceStartRef.current = videoElement.currentTime;
      } else {
        const silenceDuration = videoElement.currentTime - silenceStartRef.current;
        if (silenceDuration >= minSilenceDuration) {
          setIsSilent(true);
          // Skip forward by the silence duration
          videoElement.currentTime += silenceDuration;
          setTotalSkippedTime(prev => prev + silenceDuration);
          onSilenceSkip?.(silenceStartRef.current, videoElement.currentTime);
          silenceStartRef.current = null;
          setIsSilent(false);
        }
      }
    } else {
      // Not silent, reset silence timer
      silenceStartRef.current = null;
      setIsSilent(false);
    }

    if (isDetecting && !isDisposedRef.current) {
      animationFrameRef.current = requestAnimationFrame(detectSilence);
    }
  }, [videoElement, threshold, minSilenceDuration, isDetecting, onSilenceSkip]);

  useEffect(() => {
    if (!videoElement || !isDetecting) {
      cleanup();
      return;
    }

    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser node
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Create source from video element
      const source = audioContext.createMediaElementSource(videoElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;

      // Start detection loop
      animationFrameRef.current = requestAnimationFrame(detectSilence);
    } catch (error) {
      console.error('Failed to initialize silence detector:', error);
      cleanup();
    }

    return () => {
      isDisposedRef.current = true;
      cleanup();
    };
  }, [videoElement, isDetecting, detectSilence, cleanup]);

  const toggleDetection = useCallback(() => {
    setIsDetecting(prev => !prev);
  }, []);

  return {
    isDetecting,
    isSilent,
    totalSkippedTime,
    toggleDetection,
    currentLevel,
  };
}

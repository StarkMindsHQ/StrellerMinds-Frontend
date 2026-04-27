'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  List, 
  X, 
  Play, 
  GripVertical, 
  Check, 
  Clock,
  ListVideo,
  Shuffle,
  Repeat
} from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

/**
 * Issue #361: Multi-video Playlist Queue Component
 * 
 * Queue multiple lessons for continuous playback to improve learning flow.
 * Features:
 * - Add/remove videos from queue
 * - Auto-play next video
 * - Reorder queue with drag and drop
 * - Save queue state
 */

export interface VideoQueueItem {
  id: string;
  title: string;
  duration: number;
  thumbnail?: string;
  lessonId: string;
  courseId?: string;
  url: string;
  completed?: boolean;
}

export interface MultiVideoPlaylistQueueProps {
  currentVideo?: VideoQueueItem;
  initialQueue?: VideoQueueItem[];
  onVideoSelect?: (video: VideoQueueItem) => void;
  onQueueChange?: (queue: VideoQueueItem[]) => void;
  onVideoComplete?: (video: VideoQueueItem) => void;
  autoPlayNext?: boolean;
  storageKey?: string;
}

export const MultiVideoPlaylistQueue: React.FC<MultiVideoPlaylistQueueProps> = ({
  currentVideo,
  initialQueue = [],
  onVideoSelect,
  onQueueChange,
  onVideoComplete,
  autoPlayNext: initialAutoPlay = true,
  storageKey = 'video-playlist-queue',
}) => {
  const [queue, setQueue] = useState<VideoQueueItem[]>(initialQueue);
  const [isOpen, setIsOpen] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(initialAutoPlay);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');

  // Load queue from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setQueue(parsed.queue || []);
        setAutoPlayNext(parsed.autoPlayNext ?? true);
        setRepeatMode(parsed.repeatMode || 'none');
      }
    } catch (error) {
      console.error('Error loading playlist queue:', error);
    }
  }, [storageKey]);

  // Save queue to localStorage
  const saveQueue = useCallback((newQueue: VideoQueueItem[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        queue: newQueue,
        autoPlayNext,
        repeatMode,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error saving playlist queue:', error);
    }
  }, [storageKey, autoPlayNext, repeatMode]);

  // Update queue
  const updateQueue = useCallback((newQueue: VideoQueueItem[]) => {
    setQueue(newQueue);
    saveQueue(newQueue);
    onQueueChange?.(newQueue);
  }, [saveQueue, onQueueChange]);

  // Add video to queue
  const addToQueue = useCallback((video: VideoQueueItem) => {
    const exists = queue.some(item => item.id === video.id);
    if (!exists) {
      const newQueue = [...queue, video];
      updateQueue(newQueue);
    }
  }, [queue, updateQueue]);

  // Remove video from queue
  const removeFromQueue = useCallback((videoId: string) => {
    const newQueue = queue.filter(item => item.id !== videoId);
    updateQueue(newQueue);
  }, [queue, updateQueue]);

  // Move video in queue
  const moveVideo = useCallback((fromIndex: number, toIndex: number) => {
    const newQueue = [...queue];
    const [removed] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, removed);
    updateQueue(newQueue);
  }, [queue, updateQueue]);

  // Play next video
  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    const nextVideo = queue[0];
    
    if (repeatMode === 'one' && currentVideo) {
      // Repeat current video
      onVideoSelect?.(currentVideo);
    } else {
      // Play next in queue
      onVideoSelect?.(nextVideo);
      
      if (repeatMode === 'all') {
        // Move to end of queue for repeat all
        const newQueue = [...queue.slice(1), nextVideo];
        updateQueue(newQueue);
      } else {
        // Remove from queue
        const newQueue = queue.slice(1);
        updateQueue(newQueue);
      }
    }
  }, [queue, currentVideo, repeatMode, onVideoSelect, updateQueue]);

  // Clear queue
  const clearQueue = useCallback(() => {
    updateQueue([]);
  }, [updateQueue]);

  // Shuffle queue
  const shuffleQueue = useCallback(() => {
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    updateQueue(shuffled);
  }, [queue, updateQueue]);

  // Mark video as completed
  const markCompleted = useCallback((videoId: string) => {
    const newQueue = queue.map(item =>
      item.id === videoId ? { ...item, completed: true } : item
    );
    updateQueue(newQueue);
  }, [queue, updateQueue]);

  // Handle video end (for auto-play)
  useEffect(() => {
    if (!currentVideo) return;

    const handleVideoEnd = () => {
      markCompleted(currentVideo.id);
      onVideoComplete?.(currentVideo);
      
      if (autoPlayNext && queue.length > 0) {
        setTimeout(() => {
          playNext();
        }, 1000); // Small delay before auto-playing next
      }
    };

    // This would be connected to the actual video player's ended event
    // For now, it's just a placeholder for the integration point
    return () => {
      // Cleanup
    };
  }, [currentVideo, autoPlayNext, queue.length, playNext, markCompleted, onVideoComplete]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate total duration
  const totalDuration = queue.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 hover:bg-black/70 text-white border-white/20 relative"
        title="Playlist Queue"
      >
        <ListVideo className="w-5 h-5" />
        {queue.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {queue.length}
          </span>
        )}
      </Button>

      {/* Queue Panel */}
      {isOpen && (
        <Card className="absolute bottom-full right-0 mb-2 w-96 max-h-[600px] z-50 shadow-xl border-white/10 bg-black/95 text-white flex flex-col">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <List className="w-5 h-5" />
                Playlist Queue
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-400">
              {queue.length} videos • {formatDuration(totalDuration)} total
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {/* Controls */}
            <div className="space-y-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay-toggle" className="text-sm">
                  Auto-play next
                </Label>
                <Switch
                  id="autoplay-toggle"
                  checked={autoPlayNext}
                  onCheckedChange={setAutoPlayNext}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const modes: Array<'none' | 'all' | 'one'> = ['none', 'all', 'one'];
                    const currentIndex = modes.indexOf(repeatMode);
                    const nextMode = modes[(currentIndex + 1) % modes.length];
                    setRepeatMode(nextMode);
                  }}
                  className="flex-1 border-white/20 hover:bg-white/10"
                >
                  <Repeat className="w-4 h-4 mr-2" />
                  {repeatMode === 'none' && 'No Repeat'}
                  {repeatMode === 'all' && 'Repeat All'}
                  {repeatMode === 'one' && 'Repeat One'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={shuffleQueue}
                  disabled={queue.length < 2}
                  className="border-white/20 hover:bg-white/10"
                  title="Shuffle"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              </div>

              {queue.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearQueue}
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  Clear Queue
                </Button>
              )}
            </div>

            {/* Queue List */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              {queue.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ListVideo className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No videos in queue</p>
                  <p className="text-xs mt-1">Add videos to start your playlist</p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={queue}
                  onReorder={updateQueue}
                  className="space-y-2"
                >
                  {queue.map((video, index) => (
                    <Reorder.Item
                      key={video.id}
                      value={video}
                      className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start gap-3">
                        {/* Drag Handle */}
                        <div className="flex-shrink-0 mt-1 cursor-grab">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>

                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-16 h-12 bg-gray-800 rounded overflow-hidden">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">
                                {video.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(video.duration)}
                                </span>
                                {video.completed && (
                                  <span className="text-xs text-green-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onVideoSelect?.(video)}
                                className="h-8 w-8 hover:bg-white/10"
                                title="Play now"
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromQueue(video.id)}
                                className="h-8 w-8 hover:bg-red-500/10 text-red-400"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiVideoPlaylistQueue;

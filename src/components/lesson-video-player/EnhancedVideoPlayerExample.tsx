'use client';

import React, { useRef, useState } from 'react';
import { LessonVideoPlayer } from './LessonVideoPlayer';
import PlaybackAnalyticsTracker from './PlaybackAnalyticsTracker';
import SubtitleCustomizationPanel from './SubtitleCustomizationPanel';
import GestureControlVideoPlayer from './GestureControlVideoPlayer';
import MultiVideoPlaylistQueue, { VideoQueueItem } from './MultiVideoPlaylistQueue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Enhanced Video Player Example
 * 
 * Demonstrates integration of all 4 new video player features:
 * - #355: Playback Analytics Tracker
 * - #357: Gesture-Control Video Player
 * - #358: Subtitle Customization Panel
 * - #361: Multi-video Playlist Queue
 */

const SAMPLE_VIDEOS: VideoQueueItem[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    duration: 720,
    lessonId: 'lesson-1',
    courseId: 'react-course',
    url: '/videos/react-hooks-intro.mp4',
    thumbnail: '/images/thumbnails/react-hooks.jpg',
  },
  {
    id: '2',
    title: 'Understanding useState',
    duration: 540,
    lessonId: 'lesson-2',
    courseId: 'react-course',
    url: '/videos/usestate-deep-dive.mp4',
    thumbnail: '/images/thumbnails/usestate.jpg',
  },
  {
    id: '3',
    title: 'useEffect Explained',
    duration: 660,
    lessonId: 'lesson-3',
    courseId: 'react-course',
    url: '/videos/useeffect-explained.mp4',
    thumbnail: '/images/thumbnails/useeffect.jpg',
  },
];

export const EnhancedVideoPlayerExample: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoQueueItem>(SAMPLE_VIDEOS[0]);
  const [analyticsEvents, setAnalyticsEvents] = useState<string[]>([]);

  const handleAnalyticsEvent = (event: { type: string; timestamp: number; videoTime: number }) => {
    const eventLog = `${event.type} at ${event.videoTime.toFixed(2)}s`;
    setAnalyticsEvents(prev => [...prev.slice(-4), eventLog]);
  };

  const handleVideoSelect = (video: VideoQueueItem) => {
    setCurrentVideo(video);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Video Player</CardTitle>
          <CardDescription>
            Featuring analytics tracking, gesture controls, subtitle customization, and playlist queue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Player Container */}
          <div className="relative">
            <div className="relative bg-black rounded-xl overflow-hidden">
              {/* Main Video Element */}
              <video
                ref={videoRef}
                src={currentVideo.url}
                className="w-full aspect-video"
                controls
                crossOrigin="anonymous"
              >
                {/* Add subtitle tracks here */}
                <track
                  kind="subtitles"
                  src="/subtitles/en.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
              </video>

              {/* Gesture Control Overlay */}
              <GestureControlVideoPlayer
                videoRef={videoRef}
                seekAmount={10}
                doubleTapSeekAmount={10}
                enabled={true}
                onGesture={(gesture) => console.log('Gesture:', gesture)}
              />
            </div>

            {/* Control Panel */}
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <SubtitleCustomizationPanel
                videoRef={videoRef}
                onPreferencesChange={(prefs) => console.log('Subtitle prefs:', prefs)}
              />
              <MultiVideoPlaylistQueue
                currentVideo={currentVideo}
                initialQueue={SAMPLE_VIDEOS.slice(1)}
                onVideoSelect={handleVideoSelect}
                onQueueChange={(queue) => console.log('Queue updated:', queue)}
                autoPlayNext={true}
              />
            </div>

            {/* Analytics Tracker (invisible) */}
            <PlaybackAnalyticsTracker
              videoId={currentVideo.id}
              lessonId={currentVideo.lessonId}
              userId="demo-user"
              videoRef={videoRef}
              onAnalyticsEvent={handleAnalyticsEvent}
              enabled={true}
            />
          </div>

          {/* Current Video Info */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">{currentVideo.title}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Lesson ID: {currentVideo.lessonId}</span>
              <span>Duration: {Math.floor(currentVideo.duration / 60)}:{(currentVideo.duration % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Analytics Events Log */}
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-sm">Recent Analytics Events</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsEvents.length === 0 ? (
                <p className="text-sm text-gray-500">No events yet. Interact with the video to see analytics.</p>
              ) : (
                <ul className="space-y-1">
                  {analyticsEvents.map((event, index) => (
                    <li key={index} className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {event}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Feature Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📊 Analytics Tracking (#355)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Tracks play, pause, skip events</li>
                  <li>Batches events for performance</li>
                  <li>Sends data to backend API</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">👆 Gesture Controls (#357)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Tap to play/pause</li>
                  <li>Double tap sides to skip ±10s</li>
                  <li>Swipe left/right to seek</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📝 Subtitle Customization (#358)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Adjust font size and color</li>
                  <li>Change background opacity</li>
                  <li>Preferences saved locally</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📋 Playlist Queue (#361)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-400">
                <ul className="list-disc list-inside space-y-1">
                  <li>Add/remove videos from queue</li>
                  <li>Auto-play next video</li>
                  <li>Drag to reorder playlist</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedVideoPlayerExample;

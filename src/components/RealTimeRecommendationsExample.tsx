'use client';

import React, { useState } from 'react';
import RealTimeRecommendations, { VideoRecommendation } from './RealTimeRecommendations';

// Example usage component
export default function RealTimeRecommendationsExample() {
  const [selectedVideo, setSelectedVideo] = useState<string>('current-video-123');

  const handleVideoSelect = (videoId: string) => {
    console.log('Selected video:', videoId);
    setSelectedVideo(videoId);
    
    // In a real application, you would:
    // 1. Navigate to the video page
    // 2. Update the video player
    // 3. Update analytics tracking
    // 4. Refresh recommendations based on new video
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Real-Time Recommendations Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience dynamic video recommendations with smooth animations and real-time updates.
          </p>
        </div>

        {/* Current Video Info */}
        <div className="bg-white dark:bg-gray-950 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Currently Watching</h2>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
              <div className="w-8 h-8 bg-blue-600 rounded" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {selectedVideo === 'current-video-123' ? 'Introduction to Blockchain Technology' : 'Selected Video'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Video ID: {selectedVideo}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations Component */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Standard Recommendations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Standard Recommendations</h3>
            <RealTimeRecommendations
              currentVideoId={selectedVideo}
              onVideoSelect={handleVideoSelect}
              maxRecommendations={3}
              refreshInterval={30000}
              showRelevanceScore={false}
              enableWebSocket={false}
            />
          </div>

          {/* Advanced Recommendations with WebSocket */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Real-Time with Relevance Scores</h3>
            <RealTimeRecommendations
              currentVideoId={selectedVideo}
              onVideoSelect={handleVideoSelect}
              maxRecommendations={3}
              refreshInterval={15000}
              showRelevanceScore={true}
              enableWebSocket={true}
              className="border-l-4 border-blue-500 pl-4"
            />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 bg-white dark:bg-gray-950 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-medium mb-1">Real-Time Updates</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dynamic recommendations via API or WebSocket
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">🎬</span>
              </div>
              <h4 className="font-medium mb-1">Smooth Animations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                CLS-friendly transitions with Framer Motion
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="font-medium mb-1">Relevance Scoring</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered recommendation rankings
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-medium mb-1">Responsive Design</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mobile-first with touch interactions
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Usage Instructions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {'<RealTimeRecommendations currentVideoId="video-id" onVideoSelect={handleSelect} />'}
              </code>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Click on any recommendation card to select it</li>
              <li>Watch the smooth animations as cards appear and disappear</li>
              <li>Notice the minimal layout shifts (CLS-friendly)</li>
              <li>Enable WebSocket for real-time updates (requires server)</li>
              <li>Toggle relevance scores to see recommendation rankings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

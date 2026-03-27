'use client';

import React, { useState } from 'react';
import InfiniteScrollFeed, { GridConfig } from './InfiniteScrollFeed';
import { mockVideoService } from './MockVideoService';
import { Settings, Grid, Zap, Database, BarChart3 } from 'lucide-react';

// Example usage component
export default function InfiniteScrollFeedExample() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    gap: 'gap-4',
  });
  const [batchSize, setBatchSize] = useState(12);
  const [showRefreshButton, setShowRefreshButton] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | undefined>(
    undefined,
  );

  const handleVideoSelect = (video: any) => {
    console.log('Selected video:', video);
    setSelectedVideo(video.id);

    // In a real application, you would:
    // 1. Navigate to the video page
    // 2. Update the video player
    // 3. Update analytics tracking
    // 4. Store user preferences
  };

  const gridPresets = [
    {
      name: 'Mobile First',
      icon: Grid,
      config: {
        columns: { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 },
        gap: 'gap-4',
      } as GridConfig,
    },
    {
      name: 'Balanced',
      icon: BarChart3,
      config: {
        columns: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
        gap: 'gap-4',
      } as GridConfig,
    },
    {
      name: 'Desktop Heavy',
      icon: Database,
      config: {
        columns: { xs: 1, sm: 2, md: 4, lg: 5, xl: 6 },
        gap: 'gap-3',
      } as GridConfig,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Infinite Scroll Feed Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience smooth infinite scrolling with prefetching, caching, and
            beautiful animations.
          </p>
        </div>

        {/* Selected Video Info */}
        {selectedVideo && (
          <div className="bg-white dark:bg-gray-950 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Currently Selected</h2>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3">
                <div className="w-8 h-8 bg-blue-600 rounded" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Video ID: {selectedVideo}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click on any video card to select it
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Panel */}
        <div className="bg-white dark:bg-gray-950 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">Configuration</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Grid Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grid Layout
              </label>
              <div className="space-y-2">
                {gridPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setGridConfig(preset.config)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors
                      ${
                        JSON.stringify(gridConfig) ===
                        JSON.stringify(preset.config)
                          ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <preset.icon className="w-4 h-4" />
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Batch Size
              </label>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                <option value={6}>6 items</option>
                <option value={12}>12 items</option>
                <option value={24}>24 items</option>
                <option value={36}>36 items</option>
              </select>
            </div>

            {/* Refresh Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Refresh Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showRefreshButton}
                    onChange={(e) => setShowRefreshButton(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Show Refresh Button
                </label>
                <select
                  value={refreshInterval || ''}
                  onChange={(e) =>
                    setRefreshInterval(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="w-full px-3 py-1 text-sm border border-gray-200 rounded bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                >
                  <option value="">Auto-refresh: Off</option>
                  <option value={30000}>30 seconds</option>
                  <option value={60000}>1 minute</option>
                  <option value={300000}>5 minutes</option>
                </select>
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Performance Features
              </label>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Prefetching enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span>TanStack Query caching</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span>Intersection observer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infinite Scroll Feed */}
        <div className="bg-white dark:bg-gray-950 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Video Feed</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Scroll down to load more videos
            </div>
          </div>

          <InfiniteScrollFeed
            fetchVideos={mockVideoService.fetchVideos.bind(mockVideoService)}
            batchSize={batchSize}
            gridConfig={gridConfig}
            onVideoSelect={handleVideoSelect}
            prefetchThreshold={200}
            refreshInterval={refreshInterval}
            showRefreshButton={showRefreshButton}
            emptyStateMessage="No videos available at the moment"
            loadingSpinnerSize="md"
          />
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 bg-white dark:bg-gray-950 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold mb-4">
            Key Features Demonstrated
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">∞</span>
              </div>
              <h4 className="font-medium mb-1">Infinite Scrolling</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Seamless loading with intersection observer
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="font-medium mb-1">Smart Prefetching</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loads next batch before you reach bottom
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">🎬</span>
              </div>
              <h4 className="font-medium mb-1">Smooth Animations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Staggered card appearances with Framer Motion
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">💾</span>
              </div>
              <h4 className="font-medium mb-1">Intelligent Caching</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                TanStack Query with 5-minute stale time
              </p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-medium mb-1">Responsive Grid</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adaptive columns for all screen sizes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 mb-2">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="font-medium mb-1">Auto Refresh</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Optional periodic data updates
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
                {'<InfiniteScrollFeed fetchVideos={fetchFn} batchSize={12} />'}
              </code>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Scroll down to automatically load more videos</li>
              <li>Click on any video card to select it</li>
              <li>
                Adjust grid layout and batch size using the configuration panel
              </li>
              <li>Enable auto-refresh for periodic updates</li>
              <li>Watch the smooth animations as cards appear</li>
              <li>
                Notice the prefetching - next batch loads before you reach
                bottom
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

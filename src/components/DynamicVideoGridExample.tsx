'use client';

import React, { useState } from 'react';
import { DynamicVideoGrid, Video, GridConfig } from './DynamicVideoGrid';
import { VideoDetailModal } from './VideoDetailModal';

// Mock video data generator
const generateMockVideos = (count: number): Video[] => {
  const levels: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced'];
  const instructors = ['Dr. Sarah Chen', 'Prof. Michael Torres', 'Dr. Aisha Patel', 'Prof. James Wilson'];
  const topics = [
    'Blockchain Fundamentals',
    'Smart Contract Development',
    'DeFi Protocols',
    'NFT Development',
    'Web3 Frontend',
    'Cryptography Basics',
    'Tokenomics',
    'DAO Governance',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `video-${i + 1}`,
    title: `${topics[i % topics.length]} - Part ${Math.floor(i / topics.length) + 1}`,
    description: `Learn the essential concepts and practical applications of ${topics[i % topics.length].toLowerCase()}. This comprehensive course covers everything you need to know.`,
    thumbnailUrl: `/images/courses/${topics[i % topics.length].toLowerCase().replace(/\s+/g, '-')}.jpg`,
    duration: Math.floor(Math.random() * 3600) + 600, // 10 min to 1 hour
    instructor: instructors[i % instructors.length],
    studentsCount: Math.floor(Math.random() * 10000) + 100,
    rating: 4 + Math.random(),
    level: levels[i % levels.length],
    tags: ['Blockchain', 'Web3', topics[i % topics.length]],
    views: Math.floor(Math.random() * 50000) + 1000,
  }));
};

export const DynamicVideoGridExample: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoCount, setVideoCount] = useState(50);
  const [enableVirtualScroll, setEnableVirtualScroll] = useState(true);

  // Generate videos
  const videos = generateMockVideos(videoCount);

  // Custom grid configuration
  const gridConfig: GridConfig = {
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    gap: 20,
    rowHeight: 400,
    overscan: 2,
  };

  const handleVideoSelect = (video: Video) => {
    console.log('Selected video:', video);
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setVideoCount(prev => prev + 20);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Video Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our collection of {videoCount} educational videos
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={enableVirtualScroll}
                onChange={(e) => setEnableVirtualScroll(e.target.checked)}
                className="rounded"
              />
              Enable Virtual Scroll
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({videoCount} videos loaded)
            </span>
          </div>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Loading...' : 'Load More Videos'}
          </button>
        </div>

        {/* Video Grid */}
        <DynamicVideoGrid
          videos={videos}
          onVideoSelect={handleVideoSelect}
          gridConfig={gridConfig}
          loading={loading}
          enableVirtualScroll={enableVirtualScroll}
          className="pb-8"
        />

        {/* Video Detail Modal */}
        {selectedVideo && (
          <VideoDetailModal
            video={selectedVideo}
            isOpen={!!selectedVideo}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default DynamicVideoGridExample;

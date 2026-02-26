'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DynamicVideoGrid, Video, GridConfig } from './DynamicVideoGrid';
import { VideoDetailModal } from './VideoDetailModal';
import { RefreshCw, Filter } from 'lucide-react';

interface VideoAPIResponse {
  videos: Video[];
  total: number;
  page: number;
  pageSize: number;
}

interface DynamicVideoGridWithAPIProps {
  apiEndpoint?: string;
  filters?: {
    level?: string;
    instructor?: string;
    tags?: string[];
  };
  gridConfig?: GridConfig;
  className?: string;
}

export const DynamicVideoGridWithAPI: React.FC<DynamicVideoGridWithAPIProps> = ({
  apiEndpoint = '/api/videos',
  filters = {},
  gridConfig,
  className,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [localFilters, setLocalFilters] = useState(filters);

  // Fetch videos from API
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<VideoAPIResponse>({
    queryKey: ['videos', localFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (localFilters.level) {
        params.append('level', localFilters.level);
      }
      if (localFilters.instructor) {
        params.append('instructor', localFilters.instructor);
      }
      if (localFilters.tags && localFilters.tags.length > 0) {
        params.append('tags', localFilters.tags.join(','));
      }

      const response = await fetch(`${apiEndpoint}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setLocalFilters(newFilters);
  };

  // Error state
  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="text-red-600 dark:text-red-400 mb-4">
          <RefreshCw className="w-12 h-12 mx-auto mb-2 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Failed to Load Videos
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {error instanceof Error ? error.message : 'An error occurred'}
        </p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {data?.total ? `${data.total} videos` : 'Loading...'}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Video Grid */}
      <DynamicVideoGrid
        videos={data?.videos || []}
        onVideoSelect={handleVideoSelect}
        gridConfig={gridConfig}
        loading={isLoading}
        className="mb-8"
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
  );
};

export default DynamicVideoGridWithAPI;

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Clock, Users, Star, Play, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  instructor: string;
  studentsCount: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  views: number;
  createdAt: string;
  isLive?: boolean;
}

export interface GridConfig {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export interface FetchVideosResponse {
  videos: VideoItem[];
  hasMore: boolean;
  nextCursor?: string;
  totalCount: number;
}

export interface InfiniteScrollFeedProps {
  fetchVideos: (cursor?: string, limit?: number) => Promise<FetchVideosResponse>;
  batchSize?: number;
  gridConfig?: GridConfig;
  className?: string;
  onVideoSelect?: (video: VideoItem) => void;
  prefetchThreshold?: number;
  refreshInterval?: number;
  showRefreshButton?: boolean;
  emptyStateMessage?: string;
  loadingSpinnerSize?: 'sm' | 'md' | 'lg';
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95 
  },
};

// Video Card Component
const VideoCard: React.FC<{
  video: VideoItem;
  onSelect?: (video: VideoItem) => void;
  index: number;
}> = ({ video, onSelect, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleClick = useCallback(() => {
    onSelect?.(video);
  }, [video, onSelect]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="group cursor-pointer"
    >
      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Thumbnail Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          {/* Live Badge */}
          {video.isLive && (
            <div className="absolute top-2 left-2 z-10">
              <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>
          )}

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white/90 hover:bg-white text-blue-600 rounded-full p-3 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2">
            <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
              {formatDuration(video.duration)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {video.description}
          </p>

          {/* Instructor and Level */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {video.instructor}
            </span>
            <span className={cn(
              'text-xs font-semibold px-2 py-1 rounded-full',
              getLevelColor(video.level)
            )}>
              {video.level}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 3).map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{video.tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{video.studentsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{video.rating}</span>
              </div>
            </div>
            <span>{formatViews(video.views)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Loading Spinner Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex justify-center py-8">
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-blue-600')} />
    </div>
  );
};

// Intersection Observer Trigger Component
const ScrollTrigger: React.FC<{
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  prefetchThreshold?: number;
}> = ({ hasNextPage, isFetchingNextPage, onLoadMore, prefetchThreshold = 200 }) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(triggerRef, {
    amount: 0.1,
    margin: `${prefetchThreshold}px`,
  });

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, onLoadMore]);

  if (!hasNextPage) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">You've reached the end of the feed</p>
      </div>
    );
  }

  return (
    <div ref={triggerRef} className="py-4">
      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
};

// Main Component
export const InfiniteScrollFeed: React.FC<InfiniteScrollFeedProps> = ({
  fetchVideos,
  batchSize = 12,
  gridConfig = {},
  className,
  onVideoSelect,
  prefetchThreshold = 200,
  refreshInterval,
  showRefreshButton = false,
  emptyStateMessage = 'No videos found',
  loadingSpinnerSize = 'md',
}) => {
  const queryClient = useQueryClient();
  const controls = useAnimation();

  // Default grid configuration
  const defaultGridConfig: GridConfig = {
    columns: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
    },
    gap: 'gap-4',
    className: '',
  };

  const mergedGridConfig = { ...defaultGridConfig, ...gridConfig };

  // Generate grid classes based on column configuration
  const getGridClasses = () => {
    const { columns, gap, className: gridClassName } = mergedGridConfig;
    let gridClass = `grid ${gap || 'gap-4'} ${gridClassName || ''}`;
    
    if (columns) {
      if (columns.xs) gridClass += ` grid-cols-${columns.xs}`;
      if (columns.sm) gridClass += ` sm:grid-cols-${columns.sm}`;
      if (columns.md) gridClass += ` md:grid-cols-${columns.md}`;
      if (columns.lg) gridClass += ` lg:grid-cols-${columns.lg}`;
      if (columns.xl) gridClass += ` xl:grid-cols-${columns.xl}`;
    }
    
    return gridClass;
  };

  // Infinite query with TanStack Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['infinite-videos'],
    queryFn: ({ pageParam }) => fetchVideos(pageParam, batchSize),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    refetchInterval: refreshInterval,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });

  // Prefetch next page
  const prefetchNextPage = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      const lastPage = data?.pages[data.pages.length - 1];
      if (lastPage?.nextCursor) {
        await queryClient.prefetchInfiniteQuery({
          queryKey: ['infinite-videos'],
          queryFn: ({ pageParam }) => fetchVideos(lastPage.nextCursor, batchSize),
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          initialPageParam: undefined,
        });
      }
    }
  }, [hasNextPage, isFetchingNextPage, data, fetchVideos, batchSize, queryClient]);

  // Flatten all pages into a single array
  const allVideos = data?.pages.flatMap(page => page.videos) || [];

  // Handle video selection
  const handleVideoSelect = useCallback((video: VideoItem) => {
    onVideoSelect?.(video);
    
    // Prefetch next page when user interacts
    prefetchNextPage();
  }, [onVideoSelect, prefetchNextPage]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Start animation when data loads
  useEffect(() => {
    if (allVideos.length > 0) {
      controls.start('show');
    }
  }, [allVideos.length, controls]);

  // Error state
  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-red-600 dark:text-red-400 mb-4">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {error instanceof Error ? error.message : 'Failed to load videos'}
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

  // Loading state
  if (isLoading) {
    return (
      <div className={cn(getGridClasses(), className)}>
        {Array.from({ length: batchSize }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (allVideos.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-gray-300 dark:text-gray-600 mb-4">
          <Play className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {emptyStateMessage}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header with refresh button */}
      {showRefreshButton && (
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {data?.pages[0]?.totalCount ? 
              `${data.pages[0].totalCount} videos` : 
              `${allVideos.length} videos`
            }
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>
      )}

      {/* Video Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={getGridClasses()}
      >
        <AnimatePresence mode="popLayout">
          {allVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={handleVideoSelect}
              index={index}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Scroll Trigger */}
      <ScrollTrigger
        hasNextPage={!!hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        prefetchThreshold={prefetchThreshold}
      />
    </div>
  );
};

export default InfiniteScrollFeed;

'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, Users, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration: number;
  instructor: string;
  studentsCount: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  views?: number;
}

export interface GridConfig {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  rowHeight?: number;
  overscan?: number;
}

export interface DynamicVideoGridProps {
  videos: Video[];
  onVideoSelect?: (video: Video) => void;
  gridConfig?: GridConfig;
  className?: string;
  loading?: boolean;
  enableVirtualScroll?: boolean;
  animationDelay?: number;
}

// Default configuration
const DEFAULT_CONFIG: Required<GridConfig> = {
  columns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
  gap: 16,
  rowHeight: 380,
  overscan: 3,
};

// Animation variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9 
  },
  visible: (custom: number) => ({ 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      delay: custom * 0.05,
    }
  }),
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  },
};

// Video Card Component
const VideoCard: React.FC<{
  video: Video;
  onSelect?: (video: Video) => void;
  index: number;
}> = React.memo(({ video, onSelect, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
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
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className="group cursor-pointer h-full"
    >
      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {/* Thumbnail Container */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden flex-shrink-0">
          {/* Thumbnail Image with Lazy Loading */}
          {video.thumbnailUrl && (
            <>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </>
          )}

          {/* Play Button Overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white/95 hover:bg-white text-blue-600 rounded-full p-4 shadow-2xl"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </motion.div>
          </motion.div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 z-10">
            <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold">
              {formatDuration(video.duration)}
            </div>
          </div>

          {/* Level Badge */}
          <div className="absolute top-2 right-2 z-10">
            <span className={cn(
              'text-xs font-semibold px-2 py-1 rounded-full',
              getLevelColor(video.level)
            )}>
              {video.level}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
            {video.instructor}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
            {video.description}
          </p>

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
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
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-800 mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{video.studentsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{video.rating.toFixed(1)}</span>
              </div>
            </div>
            {video.views !== undefined && (
              <span className="font-medium">{video.views.toLocaleString()} views</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

VideoCard.displayName = 'VideoCard';

// Virtual Scroll Hook
const useVirtualScroll = (
  itemCount: number,
  rowHeight: number,
  columns: number,
  overscan: number = 3
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const totalRows = Math.ceil(itemCount / columns);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const visibleRange = {
    start: startRow * columns,
    end: Math.min(endRow * columns, itemCount),
  };

  return {
    totalHeight,
    visibleRange,
    setScrollTop,
    setContainerHeight,
  };
};

// Get current column count based on window width
const useResponsiveColumns = (columns: GridConfig['columns']) => {
  const [currentColumns, setCurrentColumns] = useState(columns?.md || 3);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentColumns(columns?.xs || 1);
      } else if (width < 768) {
        setCurrentColumns(columns?.sm || 2);
      } else if (width < 1024) {
        setCurrentColumns(columns?.md || 3);
      } else if (width < 1280) {
        setCurrentColumns(columns?.lg || 4);
      } else {
        setCurrentColumns(columns?.xl || 5);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  return currentColumns;
};

// Main Component
export const DynamicVideoGrid: React.FC<DynamicVideoGridProps> = ({
  videos,
  onVideoSelect,
  gridConfig = {},
  className,
  loading = false,
  enableVirtualScroll = true,
  animationDelay = 50,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const config = { ...DEFAULT_CONFIG, ...gridConfig };
  const currentColumns = useResponsiveColumns(config.columns);

  const {
    totalHeight,
    visibleRange,
    setScrollTop,
    setContainerHeight,
  } = useVirtualScroll(
    videos.length,
    config.rowHeight,
    currentColumns,
    config.overscan
  );

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);

  // Update container height
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setContainerHeight]);

  // Get visible videos
  const visibleVideos = useMemo(() => {
    if (!enableVirtualScroll || videos.length < 20) {
      return videos;
    }
    return videos.slice(visibleRange.start, visibleRange.end);
  }, [videos, visibleRange, enableVirtualScroll]);

  // Calculate offset for virtual scrolling
  const offsetY = enableVirtualScroll && videos.length >= 20
    ? Math.floor(visibleRange.start / currentColumns) * config.rowHeight
    : 0;

  // Generate grid classes
  const gridClasses = cn(
    'grid',
    `gap-${config.gap / 4}`,
    `grid-cols-${config.columns.xs || 1}`,
    `sm:grid-cols-${config.columns.sm || 2}`,
    `md:grid-cols-${config.columns.md || 3}`,
    `lg:grid-cols-${config.columns.lg || 4}`,
    `xl:grid-cols-${config.columns.xl || 5}`
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn(gridClasses, className)} style={{ gap: `${config.gap}px` }}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
            style={{ height: `${config.rowHeight}px` }}
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <div className={cn("text-center py-16", className)}>
        <div className="text-gray-300 dark:text-gray-600 mb-4">
          <Play className="w-16 h-16 mx-auto" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No videos available
        </p>
      </div>
    );
  }

  const content = (
    <div
      className={gridClasses}
      style={{
        gap: `${config.gap}px`,
        transform: `translateY(${offsetY}px)`,
      }}
    >
      <AnimatePresence mode="popLayout">
        {visibleVideos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={onVideoSelect}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  // With virtual scrolling
  if (enableVirtualScroll && videos.length >= 20) {
    return (
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={cn("overflow-y-auto", className)}
        style={{ height: '100vh', maxHeight: '100vh' }}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          {content}
        </div>
      </div>
    );
  }

  // Without virtual scrolling
  return <div className={className}>{content}</div>;
};

export default DynamicVideoGrid;

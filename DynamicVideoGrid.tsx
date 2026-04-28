'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  [key: string]: any;
}
<!-- 
The Auto-Skip Silence feature automatically detects and skips silent parts of videos, saving users time during playback. It uses the Web Audio API to analyze audio levels in real-time and skips segments that fall below a configurable silence threshold. -->
export interface GridConfig {
  columns: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

interface DynamicVideoGridProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  gridConfig: GridConfig;
  className?: string;
  itemClassName?: string;
  placeholderCount?: number;
  enableAnimation?: boolean;
  animationType?: 'fade' | 'slide';
  animationDuration?: number;
}

const DynamicVideoGrid: React.FC<DynamicVideoGridProps> = ({
  videos,
  onVideoSelect,
  gridConfig,
  className,
  itemClassName,
  placeholderCount = 6,
  enableAnimation = true,
  animationType = 'fade',
  animationDuration = 0.3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  // Intersection Observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const videoId = entry.target.id;

        if (entry.isIntersecting) {
          setVisibleItems((prev) => {
            if (prev.includes(videoId)) return prev;
            return [...prev, videoId];
          });
        } else {
          setVisibleItems((prev) => prev.filter((id) => id !== videoId));
        }
      });
    },
    [],
  );

  // Set up Intersection Observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.2,
    });

    const currentRef = containerRef.current;

    if (currentRef) {
      const items = Array.from(currentRef.children);
      items.forEach((item) => observer.observe(item));
    }

    return () => {
      if (currentRef) {
        const items = Array.from(currentRef.children);
        items.forEach((item) => observer.unobserve(item));
      }
      observer.disconnect();
    };
  }, [videos, handleIntersection]);

  // Animation variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: animationType === 'slide' ? 50 : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: animationDuration,
        ease: 'easeInOut',
      },
    },
  };

  // Grid column configuration
  const gridColumns = {
    ...(gridConfig.columns.xs && { 'grid-cols-xs': gridConfig.columns.xs }),
    ...(gridConfig.columns.sm && { 'grid-cols-sm': gridConfig.columns.sm }),
    ...(gridConfig.columns.md && { 'grid-cols-md': gridConfig.columns.md }),
    ...(gridConfig.columns.lg && { 'grid-cols-lg': gridConfig.columns.lg }),
    ...(gridConfig.columns.xl && { 'grid-cols-xl': gridConfig.columns.xl }),
  };

  const renderPlaceholders = () =>
    Array.from({ length: placeholderCount }).map((_, index) => (
      <div key={`skeleton-${index}`} className={itemClassName}>
        <Card className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-5/6" />
          </CardContent>
        </Card>
      </div>
    ));

  return (
    <div
      ref={containerRef}
      className={cn('grid', gridConfig.gap || 'gap-4', gridColumns, className)}
    >
      {videos.length > 0
        ? videos.map((video) => (
            <motion.div
              key={video.id}
              id={video.id}
              className={itemClassName}
              variants={itemVariants}
              initial="hidden"
              animate={
                enableAnimation && visibleItems.includes(video.id)
                  ? 'visible'
                  : 'hidden'
              }
              onClick={() => onVideoSelect(video)}
              style={{ cursor: 'pointer' }}
            >
              <Card className="overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="aspect-video w-full object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <span>{video.duration}</span>
                    <span className="ml-2">{video.views} views</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        : renderPlaceholders()}
    </div>
  );
};

export default DynamicVideoGrid;

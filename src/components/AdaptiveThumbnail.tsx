'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Play, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface ThumbnailSize {
  width: number;
  height: number;
  quality?: number;
}

export interface ThumbnailSources {
  xs?: string; // 0-575px
  sm?: string; // 576-767px
  md?: string; // 768-991px
  lg?: string; // 992-1199px
  xl?: string; // 1200-1399px
  xxl?: string; // 1400px+
}

export interface AdaptiveThumbnailProps {
  thumbnailUrl: string;
  altText: string;
  onClick?: () => void;
  className?: string;
  sources?: ThumbnailSources;
  sizes?: ThumbnailSize;
  priority?: boolean;
  lazy?: boolean;
  enableCache?: boolean;
  cacheKey?: string;
  hoverEffect?: 'zoom' | 'fade' | 'slide' | 'none';
  showPlayButton?: boolean;
  showLoadingSpinner?: boolean;
  fallbackComponent?: React.ComponentType<{ className?: string }>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  placeholder?: string;
  blurDataURL?: string;
}

// Cache service for thumbnails
class ThumbnailCache {
  private cache = new Map<string, { data: string; timestamp: number }>();
  private maxAge = 1000 * 60 * 60 * 24; // 24 hours
  private maxSize = 100; // Max cached items

  set(key: string, data: string): void {
    // Clean old entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

const thumbnailCache = new ThumbnailCache();

// Responsive image service
class ResponsiveImageService {
  private breakpoints = {
    xs: 575,
    sm: 767,
    md: 991,
    lg: 1199,
    xl: 1399,
    xxl: Infinity,
  };

  getOptimalSource(sources: ThumbnailSources): string {
    if (typeof window === 'undefined') {
      // Server-side: return largest available
      return (
        sources.xxl ||
        sources.xl ||
        sources.lg ||
        sources.md ||
        sources.sm ||
        sources.xs ||
        ''
      );
    }

    const width = window.innerWidth;

    if (width <= this.breakpoints.xs && sources.xs) return sources.xs;
    if (width <= this.breakpoints.sm && sources.sm) return sources.sm;
    if (width <= this.breakpoints.md && sources.md) return sources.md;
    if (width <= this.breakpoints.lg && sources.lg) return sources.lg;
    if (width <= this.breakpoints.xl && sources.xl) return sources.xl;
    if (sources.xxl) return sources.xxl;

    // Fallback to first available source
    return (
      sources.xs ||
      sources.sm ||
      sources.md ||
      sources.lg ||
      sources.xl ||
      sources.xxl ||
      ''
    );
  }

  generateResponsiveUrl(baseUrl: string, size: ThumbnailSize): string {
    if (!baseUrl) return '';

    // If URL already has parameters, add to them
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}w=${size.width}&h=${size.height}&q=${size.quality || 75}`;
  }

  getDefaultSizes(): ThumbnailSize {
    if (typeof window === 'undefined') {
      return { width: 400, height: 225, quality: 75 };
    }

    const width = window.innerWidth;

    if (width <= 575) return { width: 300, height: 169, quality: 70 };
    if (width <= 767) return { width: 400, height: 225, quality: 75 };
    if (width <= 991) return { width: 500, height: 281, quality: 75 };
    if (width <= 1199) return { width: 600, height: 338, quality: 80 };
    if (width <= 1399) return { width: 700, height: 394, quality: 80 };

    return { width: 800, height: 450, quality: 85 };
  }
}

const responsiveImageService = new ResponsiveImageService();

// Default placeholder component
const DefaultPlaceholder: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={cn(
      'flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
      className,
    )}
  >
    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
  </div>
);

// Animation variants
const animationVariants = {
  zoom: {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  },
  fade: {
    hover: { opacity: 0.8, transition: { duration: 0.3 } },
    tap: { opacity: 0.9, transition: { duration: 0.1 } },
  },
  slide: {
    hover: { y: -4, transition: { duration: 0.3 } },
    tap: { y: -2, transition: { duration: 0.1 } },
  },
  none: {
    hover: {},
    tap: {},
  },
};

// Main Component
export const AdaptiveThumbnail: React.FC<AdaptiveThumbnailProps> = ({
  thumbnailUrl,
  altText,
  onClick,
  className,
  sources,
  sizes,
  priority = false,
  lazy = true,
  enableCache = true,
  cacheKey,
  hoverEffect = 'zoom',
  showPlayButton = false,
  showLoadingSpinner = true,
  fallbackComponent: FallbackComponent = DefaultPlaceholder,
  onLoad,
  onError,
  placeholder,
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isInView = useInView(containerRef, {
    amount: 0.1,
    once: !priority,
  });

  // Generate cache key
  const effectiveCacheKey = cacheKey || thumbnailUrl;

  // Get optimal image source
  const getOptimalSource = useCallback(() => {
    if (sources) {
      return responsiveImageService.getOptimalSource(sources);
    }

    const defaultSizes = sizes || responsiveImageService.getDefaultSizes();
    return responsiveImageService.generateResponsiveUrl(
      thumbnailUrl,
      defaultSizes,
    );
  }, [sources, sizes, thumbnailUrl]);

  // Load image
  const loadImage = useCallback(
    async (src: string) => {
      if (!src) return;

      // Check cache first
      if (enableCache && effectiveCacheKey) {
        const cached = thumbnailCache.get(effectiveCacheKey);
        if (cached) {
          setCurrentSrc(cached);
          setIsLoading(false);
          setHasError(false);
          onLoad?.();
          return;
        }
      }

      setIsLoading(true);
      setHasError(false);

      try {
        // Create new image to preload
        const img = new Image();
        img.src = src;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        setCurrentSrc(src);

        // Cache the loaded image
        if (enableCache && effectiveCacheKey) {
          thumbnailCache.set(effectiveCacheKey, src);
        }

        onLoad?.();
      } catch (error) {
        setHasError(true);
        onError?.(
          error instanceof Error ? error : new Error('Failed to load image'),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [enableCache, effectiveCacheKey, onLoad, onError],
  );

  // Handle intersection observer and responsive changes
  useEffect(() => {
    if (priority || (lazy && isInView)) {
      const src = getOptimalSource();
      if (src && src !== currentSrc) {
        loadImage(src);
      }
    }
  }, [priority, lazy, isInView, getOptimalSource, loadImage, currentSrc]);

  // Handle window resize for responsive images
  useEffect(() => {
    if (!sources && !sizes) return;

    const handleResize = () => {
      const src = getOptimalSource();
      if (src && src !== currentSrc && (priority || isInView)) {
        loadImage(src);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [
    sources,
    sizes,
    getOptimalSource,
    loadImage,
    currentSrc,
    priority,
    isInView,
  ]);

  // Start animation when image loads
  useEffect(() => {
    if (!isLoading && !hasError) {
      controls.start('visible');
    }
  }, [isLoading, hasError, controls]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    controls.start('hover');
  }, [controls]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    controls.start('initial');
  }, [controls]);

  const variants = animationVariants[hoverEffect];

  // Generate blur placeholder
  const generateBlurPlaceholder = () => {
    if (blurDataURL) return blurDataURL;
    if (placeholder) return placeholder;

    // Generate a simple blur placeholder
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="225" fill="#f3f4f6"/>
        <rect width="400" height="225" fill="#e5e7eb" opacity="0.5"/>
      </svg>
    `)}`;
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-lg cursor-pointer group',
        className,
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={variants}
      initial="initial"
      animate={controls}
      whileTap="tap"
    >
      {/* Loading State */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <span className="text-xs text-red-500 dark:text-red-400">
            Failed to load
          </span>
        </div>
      )}

      {/* Image */}
      {!hasError && currentSrc ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <Image
            ref={imgRef}
            src={currentSrc}
            alt={altText}
            fill
            loading={lazy ? 'lazy' : 'eager'}
            sizes="(max-width: 575px) 300px, (max-width: 767px) 400px, (max-width: 991px) 500px, (max-width: 1199px) 600px, (max-width: 1399px) 700px, 800px"
            quality={sizes?.quality || 75}
            placeholder="blur"
            blurDataURL={generateBlurPlaceholder()}
            className="object-cover transition-transform duration-300"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            priority={priority}
          />
        </motion.div>
      ) : (
        !isLoading && <FallbackComponent className="w-full h-full" />
      )}

      {/* Play Button Overlay */}
      {showPlayButton && (
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
      )}

      {/* Hover Overlay */}
      {hoverEffect !== 'none' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};

export default AdaptiveThumbnail;

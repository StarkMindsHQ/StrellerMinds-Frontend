'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface SmartImageLoaderProps extends Omit<
  ImageProps,
  'onError' | 'onLoadingComplete'
> {
  fallbackSrc?: string | StaticImageData;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: any) => void;
  containerClassName?: string;
}

/**
 * SmartImageLoader component provides an optimized image loader with lazy loading, fallback image support,
 * and progressive loading with a blur effect.
 */
export function SmartImageLoader({
  src,
  alt,
  fallbackSrc = '/images/placeholder.svg', // Ensure this exists or use a default URL
  blurDataURL,
  className,
  containerClassName,
  onLoad,
  onError,
  ...props
}: SmartImageLoaderProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(
    (error: any) => {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.(error);
    },
    [fallbackSrc, onError],
  );

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300 ease-in-out',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        onError={handleError}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
      />

      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
          <Skeleton className="w-full h-full" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          {/* Fallback UI can be an icon or just the fallbackSrc already being shown by the Image component */}
          <span className="sr-only">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

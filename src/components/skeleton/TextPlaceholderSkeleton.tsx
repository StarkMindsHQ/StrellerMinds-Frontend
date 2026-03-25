'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TextPlaceholderProps {
  lines?: number;
  className?: string;
  animated?: boolean;
  variant?: 'paragraph' | 'list' | 'heading';
}

// Multi-line text placeholder
export function TextPlaceholder({
  lines = 3,
  className,
  animated = true,
  variant = 'paragraph',
}: TextPlaceholderProps) {
  if (variant === 'heading') {
    return (
      <div className={cn('space-y-3', className)}>
        <Skeleton
          className={cn('h-8 w-3/4', animated && 'animate-pulse')}
        />
        <Skeleton
          className={cn('h-6 w-1/2', animated && 'animate-pulse')}
        />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Skeleton
              className={cn(
                'h-2 w-2 rounded-full',
                animated && 'animate-pulse',
              )}
            />
            <Skeleton
              className={cn(
                'h-4',
                index === lines - 1 ? 'w-2/3' : 'w-full',
                animated && 'animate-pulse',
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  // paragraph variant
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            'h-4',
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
            animated && 'animate-pulse',
          )}
        />
      ))}
    </div>
  );
}

// Inline text placeholder for forms
export function InlineTextSkeleton({
  width,
  className,
}: {
  width?: string;
  className?: string;
}) {
  return (
    <Skeleton
      className={cn('h-4', width || 'w-32', className)}
    />
  );
}

// Form field skeleton
export function FormFieldSkeleton({
  label = true,
  input = true,
  error = false,
  className,
}: {
  label?: boolean;
  input?: boolean;
  error?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Skeleton className="h-4 w-24" />
      )}
      {input && (
        <Skeleton className="h-10 w-full rounded-md" />
      )}
      {error && (
        <Skeleton className="h-3 w-48" />
      )}
    </div>
  );
}

// Card content placeholder
export function CardContentSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <TextPlaceholder lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}
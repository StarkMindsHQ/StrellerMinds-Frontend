import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

// Base skeleton component
export function Skeleton({ className, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-skeleton rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
      {...props}
    />
  );
}

// Skeleton text component for different text sizes
export function SkeletonText({ 
  className, 
  lines = 1, 
  ...props 
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement> & { lines?: number }) {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          className={cn(
            "h-4",
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full",
            className
          )}
        />
      ))}
    </div>
  );
}

// Skeleton avatar component
export function SkeletonAvatar({ className, size = "md", ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-16 w-16"
  };
  
  return (
    <Skeleton
      className={cn(
        "rounded-full",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

// Skeleton button component
export function SkeletonButton({ className, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(
        "h-10 w-24 rounded-md",
        className
      )}
      {...props}
    />
  );
}

// Skeleton image/thumbnail component
export function SkeletonImage({ className, aspect = "square", ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement> & { aspect?: "square" | "video" | "wide" }) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[2/1]"
  };
  
  return (
    <Skeleton
      className={cn(
        "w-full rounded-md",
        aspectClasses[aspect],
        className
      )}
      {...props}
    />
  );
}

// Skeleton badge component
export function SkeletonBadge({ className, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn(
        "h-6 w-16 rounded-full",
        className
      )}
      {...props}
    />
  );
}

// Skeleton card wrapper
export function SkeletonCard({ className, children, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 
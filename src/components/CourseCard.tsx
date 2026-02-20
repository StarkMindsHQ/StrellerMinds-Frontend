import { Clock, Users, Star, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceholderSVG } from './PlaceholderSVG';
import { cn } from '@/lib/utils';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCardVariant = 'default' | 'featured' | 'compact';

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  durationHours: number;
  studentsCount: number;
  rating: number;
  imageUrl: string;
  // Optional props for enhanced functionality
  instructor?: string;
  features?: string[];
  tags?: string[];
  price?: number;
  originalPrice?: number;
  variant?: CourseCardVariant;
  className?: string;
  // New props for consistency
  showStats?: boolean;
  showFeatures?: boolean;
  maxFeaturesDisplay?: number;
}

export function CourseCard({
  id,
  title,
  description,
  level,
  durationHours,
  studentsCount,
  rating,
  imageUrl,
  instructor,
  features = [],
  tags = [],
  price,
  originalPrice,
  variant = 'default',
  className,
  showStats = true,
  showFeatures = true,
  maxFeaturesDisplay = 3,
}: CourseCardProps) {
  // Map level to appropriate badge styles
  const getBadgeStyles = (level: CourseLevel): string => {
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

  // Get card height classes based on variant
  const getCardClasses = () => {
    const baseClasses =
      'group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg dark:border-gray-800 dark:bg-gray-950';

    switch (variant) {
      case 'featured':
        return cn(
          baseClasses,
          'h-full min-h-[420px] hover:scale-[1.02] hover:shadow-xl',
        );
      case 'compact':
        return cn(baseClasses, 'h-full min-h-[320px]');
      default:
        return cn(baseClasses, 'h-full min-h-[380px] hover:scale-[1.01]');
    }
  };

  // Format duration consistently
  const formatDuration = () => {
    if (durationHours === 1) return '1 hour';
    return `${durationHours} hours`;
  };

  const displayFeatures = features.slice(0, maxFeaturesDisplay);

  return (
    <div className={cn(getCardClasses(), className)}>
      {/* Card Header with Image */}
      <div className="relative shrink-0">
        <div className="absolute right-3 top-3 z-10">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getBadgeStyles(level)}`}
          >
            {level}
          </span>
        </div>

        {/* Price badge for featured variant */}
        {variant === 'featured' && price && (
          <div className="absolute left-3 top-3 z-10">
            <div className="flex flex-col items-start">
              <span className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                ${price}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="mt-1 rounded bg-red-100 px-2 py-0.5 text-xs text-red-600 line-through dark:bg-red-900/30 dark:text-red-400">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            'flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
            variant === 'compact' ? 'h-40' : 'h-48',
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={variant === 'compact' ? 60 : 80}
              height={variant === 'compact' ? 60 : 80}
              className={cn(
                'object-contain opacity-80 transition-opacity group-hover:opacity-100',
                variant === 'compact' ? 'h-15 w-15' : 'h-20 w-20',
              )}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 60px, 80px"
              priority={variant === 'featured'}
            />
          ) : (
            <PlaceholderSVG />
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Title and Description */}
        <div className="mb-4 grow">
          <h3
            className={cn(
              'font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2',
              variant === 'compact' ? 'text-lg' : 'text-xl',
            )}
          >
            {title}
          </h3>

          {instructor && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2 font-medium">
              by {instructor}
            </p>
          )}

          <p
            className={cn(
              'text-gray-600 dark:text-gray-400 line-clamp-3',
              variant === 'compact' ? 'text-xs' : 'text-sm',
            )}
          >
            {description}
          </p>
        </div>

        {/* Features List */}
        {showFeatures &&
          displayFeatures.length > 0 &&
          variant !== 'compact' && (
            <div className="mb-4">
              <ul className="space-y-2">
                {displayFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {features.length > maxFeaturesDisplay && (
                <p className="text-xs text-gray-500 mt-2">
                  +{features.length - maxFeaturesDisplay} more features
                </p>
              )}
            </div>
          )}

        {/* Tags */}
        {tags.length > 0 && variant === 'featured' && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats and CTA Section */}
        <div className="mt-auto">
          {/* Stats Row */}
          {showStats && (
            <div
              className={cn(
                'flex justify-between border-t border-gray-200 pt-4 dark:border-gray-800',
                variant === 'compact' ? 'mb-3' : 'mb-4',
              )}
            >
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {formatDuration()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {studentsCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Link
            href={`/courses/${id}`}
            className={cn(
              'inline-flex w-full items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              variant === 'featured'
                ? 'bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
                : 'bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700',
              variant === 'compact' ? 'text-sm py-2' : 'text-sm',
            )}
          >
            {variant === 'featured' ? 'Start Learning' : 'Enroll Now'}
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

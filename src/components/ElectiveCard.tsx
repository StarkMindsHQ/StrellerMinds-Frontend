import { Clock, Users, Star, BookOpen, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceholderSVG } from './PlaceholderSVG';
import { cn } from '@/lib/utils';
import type { ElectiveData } from '@/lib/electives-data';

export interface ElectiveCardProps extends ElectiveData {
  className?: string;
  variant?: 'default' | 'compact';
}

export function ElectiveCard({
  id,
  name,
  description,
  category,
  creditHours,
  instructor,
  level,
  duration,
  prerequisites = [],
  studentsEnrolled,
  rating,
  reviewCount,
  imageUrl,
  tags,
  className,
  variant = 'default',
}: ElectiveCardProps) {
  // Map level to appropriate badge styles
  const getBadgeStyles = (level: string): string => {
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

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors = {
      'Ethics & Philosophy':
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      Economics:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      Design:
        'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      Development:
        'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'Art & Creativity':
        'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
      'Law & Regulation':
        'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      'Trading & Finance':
        'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
      Governance:
        'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
      Sustainability:
        'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
      'Virtual Reality':
        'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
      Security: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'Media & Communication':
        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    };
    return (
      colors[category as keyof typeof colors] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    );
  };

  const cardClasses = cn(
    'group flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg dark:border-gray-800 dark:bg-gray-950',
    variant === 'compact'
      ? 'h-full min-h-[320px]'
      : 'h-full min-h-[420px] hover:scale-[1.01]',
    className,
  );

  return (
    <div className={cardClasses}>
      {/* Card Header with Image */}
      <div className="relative flex-shrink-0">
        {/* Level Badge */}
        <div className="absolute right-3 top-3 z-10">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getBadgeStyles(level)}`}
          >
            {level}
          </span>
        </div>

        {/* Credit Hours Badge */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center gap-1 rounded-lg bg-[#5c0f49] px-2 py-1 text-xs font-bold text-white">
            <BookOpen className="h-3 w-3" />
            {creditHours} {creditHours === 1 ? 'Credit' : 'Credits'}
          </span>
        </div>

        <div
          className={cn(
            'flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800',
            variant === 'compact' ? 'h-40' : 'h-48',
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={variant === 'compact' ? 60 : 80}
              height={variant === 'compact' ? 60 : 80}
              className={cn(
                'object-contain opacity-80 transition-opacity group-hover:opacity-100',
                variant === 'compact' ? 'h-15 w-15' : 'h-20 w-20',
              )}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 60px, 80px"
            />
          ) : (
            <PlaceholderSVG />
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getCategoryColor(category)}`}
          >
            {category}
          </span>
        </div>

        {/* Title and Instructor */}
        <div className="mb-3">
          <h3
            className={cn(
              'font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2',
              variant === 'compact' ? 'text-lg' : 'text-xl',
            )}
          >
            {name}
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            by {instructor}
          </p>
        </div>

        {/* Description */}
        <p
          className={cn(
            'text-gray-600 dark:text-gray-400 line-clamp-3 mb-4',
            variant === 'compact' ? 'text-xs' : 'text-sm',
          )}
        >
          {description}
        </p>

        {/* Prerequisites */}
        {prerequisites.length > 0 && variant !== 'compact' && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Prerequisites:
            </p>
            <div className="flex flex-wrap gap-1">
              {prerequisites.slice(0, 2).map((prerequisite, index) => (
                <span
                  key={index}
                  className="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {prerequisite}
                </span>
              ))}
              {prerequisites.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{prerequisites.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && variant !== 'compact' && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats and CTA Section */}
        <div className="mt-auto">
          {/* Stats Row */}
          <div
            className={cn(
              'flex justify-between border-t border-gray-200 pt-4 dark:border-gray-800',
              variant === 'compact' ? 'mb-3' : 'mb-4',
            )}
          >
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {duration}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {studentsEnrolled}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/electives/${id}`}
            className={cn(
              'inline-flex w-full items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700',
              variant === 'compact' ? 'text-sm py-2' : 'text-sm',
            )}
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Enroll in Elective
          </Link>
        </div>
      </div>
    </div>
  );
}

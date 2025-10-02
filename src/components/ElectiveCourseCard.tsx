'use client';

import React, { useState } from 'react';
import { Clock, Users, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceholderSVG } from './PlaceholderSVG';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DeleteCourseDialog } from './DeleteCourseDialog';
import type { ElectiveCourseData } from '@/lib/elective-course-data';

interface ElectiveCourseCardProps extends ElectiveCourseData {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  showStats?: boolean;
  showFeatures?: boolean;
  maxFeaturesDisplay?: number;
  onDelete?: (courseId: string) => Promise<void>;
  showDeleteButton?: boolean;
}

export function ElectiveCourseCard({
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
  price,
  originalPrice,
  variant = 'default',
  className,
  showStats = true,
  showFeatures = true,
  maxFeaturesDisplay = 3,
  onDelete,
  showDeleteButton = true,
}: ElectiveCourseCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayFeatures = features.slice(0, maxFeaturesDisplay);

  const getLevelColor = () => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

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
        return cn(baseClasses, 'h-full min-h-[380px]');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={cn(getCardClasses(), className)}>
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imageUrl.startsWith('/images') ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5/ooooA//2Q=="
            />
          ) : (
            <PlaceholderSVG />
          )}

          {/* Level Badge */}
          <div className="absolute left-3 top-3">
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold',
                getLevelColor(),
              )}
            >
              {level}
            </span>
          </div>

          {/* Admin Actions */}
          {showDeleteButton && (
            <div className="absolute right-3 top-3">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteClick}
                className="h-8 w-8 rounded-full p-0 shadow-md hover:scale-110 transition-transform"
                title="Delete course"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Title and Instructor */}
          <div className="mb-3">
            <h3
              className={cn(
                'font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1',
                variant === 'compact' ? 'text-base' : 'text-lg',
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
                <ul className="space-y-1">
                  {displayFeatures.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Stats */}
          {showStats && (
            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {durationHours}h
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

          {/* Price and CTA */}
          <div className="mt-auto">
            {price && (
              <div className="mb-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  ${price}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
            )}

            <Link
              href={`/dashboard/admin/elective-courses/${id}`}
              className={cn(
                'inline-flex w-full items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                variant === 'featured'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg'
                  : 'bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700',
                variant === 'compact' ? 'text-sm py-2' : 'text-sm',
              )}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        courseTitle={title}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

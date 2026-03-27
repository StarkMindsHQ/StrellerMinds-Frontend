'use client';

import React from 'react';
import { Play, Lock, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Lesson } from '@/types/lesson';

interface LessonCardProps {
  lesson: Lesson;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export function LessonCard({
  lesson,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}: LessonCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 cursor-pointer',
        'hover:shadow-md hover:border-primary/20',
        isActive && 'bg-primary/5 border-primary shadow-sm',
        isLocked && 'opacity-60 cursor-not-allowed',
        !isLocked && 'hover:bg-accent/50',
      )}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Status Icon */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors',
          isCompleted && 'bg-green-100 text-green-600',
          isActive && !isCompleted && 'bg-primary/10 text-primary',
          !isActive &&
            !isCompleted &&
            !isLocked &&
            'bg-muted text-muted-foreground',
          isLocked && 'bg-muted text-muted-foreground',
        )}
      >
        {isCompleted ? (
          <CheckCircle className="w-5 h-5" />
        ) : isLocked ? (
          <Lock className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={cn(
              'font-medium text-sm truncate',
              isActive && 'text-primary',
              isLocked && 'text-muted-foreground',
            )}
          >
            {lesson.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDuration(lesson.duration)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {lesson.description}
        </p>
      </div>

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
    </div>
  );
}

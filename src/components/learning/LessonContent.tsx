'use client';

import React from 'react';
import { VideoContainer } from './VideoContainer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play } from 'lucide-react';
import { Lesson } from '@/types/lesson';
import { useCourseProgress } from '@/contexts/CourseProgressContext';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function LessonContent({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext, 
  hasPrevious 
}: LessonContentProps) {
  const { state } = useCourseProgress();
  const isCompleted = state.completedLessons.includes(lesson.id);
  const lessonProgress = state.lessonProgress[lesson.id];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!lessonProgress) return 0;
    return Math.round((lessonProgress.watchedSeconds / lessonProgress.totalSeconds) * 100);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Lesson Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant={lesson.type === 'video' ? 'default' : 'secondary'} className="capitalize">
              <Play className="w-3 h-3 mr-1" />
              {lesson.type}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(lesson.duration)}</span>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
          
          {lessonProgress && !isCompleted && (
            <div className="text-sm text-muted-foreground">
              {getProgressPercentage()}% watched
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>

      {/* Video Content */}
      <div className="flex-1 p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <VideoContainer
            videoUrl={lesson.videoUrl}
            lessonId={lesson.id}
            title={lesson.title}
            onVideoComplete={onComplete}
          />
        </div>
      </div>

      {/* Lesson Actions */}
      <div className="p-3 sm:p-6 border-t border-border bg-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {!isCompleted && (
              <Button onClick={onComplete} className="gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark as Complete
              </Button>
            )}
            
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Lesson Completed!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasPrevious && (
              <Button variant="outline" onClick={onPrevious} className="flex-1 sm:flex-none">
                Previous Lesson
              </Button>
            )}
            
            {hasNext && (
              <Button 
                onClick={onNext}
                disabled={!isCompleted}
                className="gap-2 flex-1 sm:flex-none"
              >
                Next Lesson
                <Play className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
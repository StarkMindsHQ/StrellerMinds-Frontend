'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LessonCard } from './LessonCard';
import { Course } from '@/types/lesson';
import { useCourseProgress } from '@/contexts/CourseProgressContext';
import { BookOpen, Trophy } from 'lucide-react';

interface LessonSidebarProps {
  course: Course;
  onLessonSelect: (lessonId: string) => void;
}

export function LessonSidebar({ course, onLessonSelect }: LessonSidebarProps) {
  const { state } = useCourseProgress();

  const isLessonLocked = (lessonOrder: number) => {
    if (lessonOrder === 1) return false; // First lesson is always unlocked
    
    // Check if previous lesson is completed
    const previousLesson = course.lessons.find(l => l.order === lessonOrder - 1);
    return previousLesson ? !state.completedLessons.includes(previousLesson.id) : true;
  };

  const completedCount = state.completedLessons.length;
  const totalLessons = course.lessons.length;

  return (
    <div className="w-80 bg-card border-r border-border h-full flex flex-col">
      {/* Course Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <Badge variant="secondary" className="text-xs">
            Course
          </Badge>
        </div>
        <h1 className="text-lg font-semibold mb-2 line-clamp-2">
          {course.title}
        </h1>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedCount}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={state.overallProgress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{Math.round(state.overallProgress)}% complete</span>
            {completedCount === totalLessons && (
              <div className="flex items-center gap-1 text-yellow-600">
                <Trophy className="w-3 h-3" />
                <span>Completed!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Lessons
          </h2>
          <div className="space-y-2">
            {course.lessons
              .sort((a, b) => a.order - b.order)
              .map((lesson) => {
                const isActive = state.currentLessonId === lesson.id;
                const isCompleted = state.completedLessons.includes(lesson.id);
                const isLocked = isLessonLocked(lesson.order);

                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isActive={isActive}
                    isCompleted={isCompleted}
                    isLocked={isLocked}
                    onClick={() => onLessonSelect(lesson.id)}
                  />
                );
              })}
          </div>
        </div>
      </div>

      {/* Course Info Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Instructor:</span>
            <span className="font-medium">{course.instructor}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Duration:</span>
            <span className="font-medium">
              {Math.round(course.lessons.reduce((acc, lesson) => acc + lesson.duration, 0) / 60)} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
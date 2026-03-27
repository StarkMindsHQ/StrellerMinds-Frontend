'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { CourseProgressProvider, useCourseProgress } from '@/contexts/CourseProgressContext';
import { 
  LessonSidebar, 
  MobileLessonNav, 
  LessonContent, 
  CourseOverview,
  DynamicCourseContentLoader 
} from '@/components/learning';
import { getCourseById } from '@/lib/mock-course-data';
import { Course } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type ViewMode = 'overview' | 'lesson';

function LearningInterface({ course }: { course: Course }) {
  const { state, setCurrentLesson, completeLesson } = useCourseProgress();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  const currentLesson = course.lessons.find(
    (lesson) => lesson.id === state.currentLessonId,
  );
  const currentLessonIndex = course.lessons.findIndex(
    (lesson) => lesson.id === state.currentLessonId,
  );

  const handleLessonSelect = (lessonId: string) => {
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    // Check if lesson is locked
    const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex > 0) {
      const previousLesson = course.lessons[lessonIndex - 1];
      if (!state.completedLessons.includes(previousLesson.id)) {
        return; // Don't allow selection of locked lessons
      }
    }

    setCurrentLesson(lessonId);
    setViewMode('lesson');
  };

  const handleStartLearning = () => {
    // Find the first incomplete lesson or start from the beginning
    const firstIncompleteLesson = course.lessons
      .sort((a, b) => a.order - b.order)
      .find((lesson) => !state.completedLessons.includes(lesson.id));

    const targetLesson = firstIncompleteLesson || course.lessons[0];
    setCurrentLesson(targetLesson.id);
    setViewMode('lesson');
  };

  const handleLessonComplete = () => {
    if (currentLesson) {
      completeLesson(currentLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      const nextLesson = course.lessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson.id);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = course.lessons[currentLessonIndex - 1];
      setCurrentLesson(previousLesson.id);
    }
  };

  const hasNext = currentLessonIndex < course.lessons.length - 1;
  const hasPrevious = currentLessonIndex > 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Courses</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>

          <MobileLessonNav
            course={course}
            onLessonSelect={handleLessonSelect}
          />

          {viewMode === 'lesson' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('overview')}
              className="hidden md:inline-flex"
            >
              Course Overview
            </Button>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            {state.completedLessons.length} / {course.lessons.length} lessons
            completed
          </span>
          <span className="sm:hidden">
            {state.completedLessons.length}/{course.lessons.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block">
          <LessonSidebar course={course} onLessonSelect={handleLessonSelect} />
        </div>

        <div className="flex-1 flex flex-col">
          {viewMode === 'overview' ? (
            <CourseOverview
              course={course}
              onStartLearning={handleStartLearning}
            />
          ) : currentLesson ? (
            <DynamicCourseContentLoader
              courseId={course.id}
              lessonId={currentLesson.id}
              nextLessonId={hasNext ? course.lessons[currentLessonIndex + 1].id : undefined}
              onComplete={handleLessonComplete}
              onNext={hasNext ? handleNextLesson : undefined}
              onPrevious={hasPrevious ? handlePreviousLesson : undefined}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Select a lesson to begin
                </h2>
                <p className="text-muted-foreground">
                  Choose a lesson from the sidebar to start learning.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  // Fetch the course data based on courseId
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Course not found</h1>
          <p className="text-muted-foreground mb-4">
            The requested course could not be found.
          </p>
          <Link href="/courses">
            <Button>Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CourseProgressProvider courseId={courseId}>
      <LearningInterface course={course} />
    </CourseProgressProvider>
  );
}

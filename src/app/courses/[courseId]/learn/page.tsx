'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CourseProgressProvider,
  useCourseProgress,
} from '@/contexts/CourseProgressContext';
import {
  CourseTranslationProvider,
  useCourseTranslation,
} from '@/contexts/CourseTranslationContext';
import {
  LessonSidebar,
  MobileLessonNav,
  CourseOverview,
  DynamicCourseContentLoader,
} from '@/components/learning';
import { getCourseById } from '@/lib/mock-course-data';
import { Course } from '@/types/lesson';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Lock,
  CheckCircle,
  BookOpen,
  AlertCircle,
  Languages,
} from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEnrollment } from '@/hooks/useEnrollment';

type ViewMode = 'overview' | 'lesson';

function LearningInterface({ course }: { course: Course }) {
  const { state, setCurrentLesson, completeLesson } = useCourseProgress();
  const { enrollment, prerequisites, loading, enroll, canAccess } =
    useEnrollment(course.id);
  const {
    language,
    setLanguage,
    translation,
    loading: translationLoading,
  } = useCourseTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [enrolling, setEnrolling] = useState(false);

  // Merge original course with translations
  const translatedCourse = {
    ...course,
    title: translation?.title || course.title,
    description: translation?.description || course.description,
    lessons: course.lessons.map((lesson) => {
      const translatedLesson = translation?.lessons?.find(
        (l: any) => l.id === lesson.id,
      );
      return {
        ...lesson,
        title: translatedLesson?.title || lesson.title,
        description: translatedLesson?.description || lesson.description,
      };
    }),
  };

  const currentLesson = translatedCourse.lessons.find(
    (lesson) => lesson.id === state.currentLessonId,
  );
  const currentLessonIndex = translatedCourse.lessons.findIndex(
    (lesson) => lesson.id === state.currentLessonId,
  );

  const handleLessonSelect = (lessonId: string) => {
    if (!canAccess) return;
    const lesson = translatedCourse.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    // Check if lesson is locked (previous lesson not complete)
    const lessonIndex = translatedCourse.lessons.findIndex(
      (l) => l.id === lessonId,
    );
    if (lessonIndex > 0) {
      const previousLesson = translatedCourse.lessons[lessonIndex - 1];
      if (!state.completedLessons.includes(previousLesson.id)) {
        return; // Don't allow selection of locked lessons
      }
    }

    setCurrentLesson(lessonId);
    setViewMode('lesson');
  };

  const handleStartLearning = () => {
    if (!canAccess) return;
    const firstIncompleteLesson = translatedCourse.lessons
      .sort((a, b) => a.order - b.order)
      .find((lesson) => !state.completedLessons.includes(lesson.id));

    const targetLesson = firstIncompleteLesson || translatedCourse.lessons[0];
    setCurrentLesson(targetLesson.id);
    setViewMode('lesson');
  };

  const handleLessonComplete = () => {
    if (currentLesson) {
      completeLesson(currentLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < translatedCourse.lessons.length - 1) {
      const nextLesson = translatedCourse.lessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson.id);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = translatedCourse.lessons[currentLessonIndex - 1];
      setCurrentLesson(previousLesson.id);
    }
  };

  const hasNext = currentLessonIndex < translatedCourse.lessons.length - 1;
  const hasPrevious = currentLessonIndex > 0;

  const handleEnrollClick = async () => {
    setEnrolling(true);
    const result = await enroll();
    setEnrolling(false);
    if (result.success) {
      // Start learning after successful enrollment
      handleStartLearning();
    } else {
      alert(result.error || 'Failed to enroll');
    }
  };

  // Show prerequisites/ enrollment screen if no access
  if (!loading && !canAccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-lg mx-4">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-6 h-6 text-amber-600" />
              <CardTitle>Enrollment Required</CardTitle>
            </div>
            <CardDescription>
              This course has prerequisites that must be completed before you
              can access it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {prerequisites && prerequisites.prerequisites.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium">
                  Complete these courses first:
                </p>
                {prerequisites.prerequisites.map((prereq) => (
                  <div
                    key={prereq.courseId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      prereq.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {prereq.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                      )}
                      <span
                        className={
                          prereq.completed
                            ? 'line-through text-muted-foreground'
                            : ''
                        }
                      >
                        {prereq.title}
                      </span>
                    </div>
                    {prereq.completed && (
                      <Badge variant="default" className="bg-green-600">
                        Completed
                      </Badge>
                    )}
                  </div>
                ))}
                {prerequisites.missingCount > 0 && (
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    You need to complete {prerequisites.missingCount}{' '}
                    prerequisite(s) first.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                This course does not have any prerequisites. Click below to
                enroll.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {!enrollment.isEnrolled ? (
              <Button
                onClick={handleEnrollClick}
                disabled={enrolling || prerequisites?.allMet === false}
                className="w-full"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            ) : (
              <div className="w-full space-y-2">
                <Button variant="outline" disabled className="w-full">
                  Already Enrolled
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Complete all prerequisites above to access course content.
                </p>
              </div>
            )}
            <Link href="/courses" className="w-full">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Courses
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main learning interface (only shown if canAccess)
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
            course={translatedCourse}
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

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">
              {state.completedLessons.length} /{' '}
              {translatedCourse.lessons.length} lessons completed
            </span>
            <span className="sm:hidden">
              {state.completedLessons.length}/{translatedCourse.lessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block">
          <LessonSidebar
            course={translatedCourse}
            onLessonSelect={handleLessonSelect}
          />
        </div>

        <div className="flex-1 flex flex-col">
          {viewMode === 'overview' ? (
            <CourseOverview
              course={translatedCourse}
              onStartLearning={handleStartLearning}
            />
          ) : currentLesson ? (
            <DynamicCourseContentLoader
              courseId={translatedCourse.id}
              lessonId={currentLesson.id}
              nextLessonId={
                hasNext
                  ? translatedCourse.lessons[currentLessonIndex + 1].id
                  : undefined
              }
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
      <CourseTranslationProvider>
        <LearningInterface course={course} />
      </CourseTranslationProvider>
    </CourseProgressProvider>
  );
}

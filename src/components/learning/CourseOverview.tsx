'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Trophy,
  Target,
  CheckCircle,
} from 'lucide-react';
import { Course } from '@/types/lesson';
import { useCourseProgress } from '@/contexts/CourseProgressContext';
import { RecommendationEngine } from './RecommendationEngine';

interface CourseOverviewProps {
  course: Course;
  onStartLearning: () => void;
}

export function CourseOverview({
  course,
  onStartLearning,
}: CourseOverviewProps) {
  const { state } = useCourseProgress();

  const totalDuration = course.lessons.reduce(
    (acc, lesson) => acc + lesson.duration,
    0,
  );
  const completedCount = state.completedLessons.length;
  const isCompleted = completedCount === course.lessons.length;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getNextLesson = () => {
    if (completedCount === 0) return course.lessons[0];

    const nextIncompleteLesson = course.lessons
      .sort((a, b) => a.order - b.order)
      .find((lesson) => !state.completedLessons.includes(lesson.id));

    return nextIncompleteLesson || course.lessons[course.lessons.length - 1];
  };

  const nextLesson = getNextLesson();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
        {/* Course Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <Badge variant="secondary">Course Overview</Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold">{course.title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {course.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(totalDuration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Play className="w-4 h-4" />
              <span>{course.lessons.length} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>By {course.instructor}</span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {completedCount} of {course.lessons.length} lessons completed
              </span>
              <span className="font-medium">
                {Math.round(state.overallProgress)}%
              </span>
            </div>

            <Progress value={state.overallProgress} className="h-3" />

            {isCompleted ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">
                  Congratulations! You&apos;ve completed this course!
                </span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4">
                <div>
                  <p className="font-medium">Continue Learning</p>
                  <p className="text-sm text-muted-foreground">
                    Next: {nextLesson?.title}
                  </p>
                </div>
                <Button
                  onClick={onStartLearning}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Play className="w-4 h-4" />
                  {completedCount === 0 ? 'Start Course' : 'Continue'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <RecommendationEngine learnerId={`${course.id}-active-learner`} />

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson, index) => {
                  const isCompleted = state.completedLessons.includes(
                    lesson.id,
                  );
                  const isLocked =
                    index > 0 &&
                    !state.completedLessons.includes(
                      course.lessons[index - 1].id,
                    );

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${
                          isCompleted
                            ? 'bg-green-100 text-green-600'
                            : isLocked
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-primary/10 text-primary'
                        }
                      `}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span>{lesson.order}</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3
                          className={`font-medium ${isLocked ? 'text-muted-foreground' : ''}`}
                        >
                          {lesson.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(lesson.duration)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            lesson.type === 'video' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {lesson.type}
                        </Badge>
                        {isLocked && (
                          <Badge variant="outline" className="text-xs">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              What You&apos;ll Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Understand blockchain fundamentals and core concepts
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Learn about cryptographic principles and security
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Explore distributed ledger technology
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Master consensus mechanisms and algorithms
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Introduction to smart contracts
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Understand different blockchain networks
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Learn about security and vulnerabilities
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Explore the future of blockchain technology
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

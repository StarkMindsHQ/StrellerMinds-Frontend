'use client';

import React from 'react';
import Link from 'next/link';
import { getAllCourses } from '@/lib/mock-course-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User, Play, ArrowRight } from 'lucide-react';

export default function LearningDemoPage() {
  const courses = getAllCourses();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getTotalDuration = (lessons: any[]) => {
    const totalSeconds = lessons.reduce(
      (acc, lesson) => acc + lesson.duration,
      0,
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              Interactive Learning Experience
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Master Blockchain Technology
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our comprehensive courses designed to take you from
              beginner to expert. Each course features interactive lessons,
              hands-on projects, and real-world applications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>
                  {courses.reduce((acc, c) => acc + c.totalLessons, 0)} Total
                  Lessons
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>Self-paced Learning</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-primary" />
                <span>Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Available Courses</h2>
          <p className="text-muted-foreground">
            Choose a course to start your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="mb-2">
                    {course.totalLessons} Lessons
                  </Badge>
                  <Badge variant="secondary">
                    {getTotalDuration(course.lessons)}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Course Content:</div>
                    <ul className="space-y-1">
                      {course.lessons.slice(0, 3).map((lesson, index) => (
                        <li
                          key={lesson.id}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span className="line-clamp-1">{lesson.title}</span>
                        </li>
                      ))}
                      {course.lessons.length > 3 && (
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>
                            And {course.lessons.length - 3} more lessons...
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Link href={`/courses/${course.id}/learn`} className="flex-1">
                  <Button className="w-full gap-2">
                    <Play className="w-4 h-4" />
                    Start Learning
                  </Button>
                </Link>
                <Link href={`/courses/${course.id}/learn`}>
                  <Button variant="outline" size="icon">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Why Choose Our Learning Platform?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Structured Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Progressive lessons that build on each other for optimal
                  learning
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Video Content</h3>
                <p className="text-sm text-muted-foreground">
                  High-quality video lessons with practical demonstrations
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Self-Paced</h3>
                <p className="text-sm text-muted-foreground">
                  Learn at your own pace with progress tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Clock, BookOpen, Trophy, X } from 'lucide-react';
import { loadProgress } from '@/services/storage';
import { calculateCourseCompletion } from '@/services/progressCalculator';
import { evaluateAchievements } from '@/services/achievements';
import { CourseProgress } from '@/types/progress';
import VideoPlayer from '@/components/VideoPlayer';
import { populateTestData } from '@/utils/testData';
import {
  getLessonsWithLockStatus,
  getLessonCompletionStatus,
  type Lesson,
} from '@/services/lessonLockService';
import LockedLessonCard from '@/components/LockedLessonCard';

interface SampleVideo {
  id: string;
  title: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
}

const sampleVideos: SampleVideo[] = [
  {
    id: '1',
    title: 'Introduction to Blockchain',
    duration: 300,
    thumbnail: '/videos/thumb1.jpg',
    videoUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    //   'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  },
  {
    id: '2',
    title: 'Smart Contracts Basics',
    duration: 540, // 9 minutes for testing
    thumbnail: '/videos/thumb2.jpg',
    videoUrl:
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
  },
  {
    id: '3',
    title: 'Stellar Network Overview',
    duration: 360,
    thumbnail: '/videos/thumb3.jpg',
    videoUrl:
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
  },
  {
    id: '4',
    title: 'Building Your First Contract',
    duration: 600,
    thumbnail: '/videos/thumb4.jpg',
    videoUrl:
      'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_10mb.mp4',
  },
];

// Convert sample videos to lessons for locking mechanism
const lessons: Lesson[] = sampleVideos.map((video, index) => ({
  id: video.id,
  title: video.title,
  order: index,
  videoId: video.id,
}));

export default function CourseProgressTracker() {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [playingVideo, setPlayingVideo] = useState<SampleVideo | null>(null);
  const [lessonsWithStatus, setLessonsWithStatus] = useState<
    (Lesson & { isLocked: boolean; isCompleted: boolean })[]
  >([]);

  useEffect(() => {
    const loadedProgress = loadProgress();
    setProgress(loadedProgress);
    setCompletionPercentage(calculateCourseCompletion(loadedProgress));
    setAchievements(evaluateAchievements(loadedProgress));

    // Initialize lessons with lock and completion status
    const lessonCompletionStatus = getLessonCompletionStatus(lessons);
    setLessonsWithStatus(lessonCompletionStatus);

    // Add some sample data for testing if none exists
    if (loadedProgress.quizzes.length === 0) {
      populateTestData();

      // Refresh data
      const updatedProgress = loadProgress();
      setProgress(updatedProgress);
      setCompletionPercentage(calculateCourseCompletion(updatedProgress));
      setAchievements(evaluateAchievements(updatedProgress));

      // Update lessons with new progress
      const updatedLessonStatus = getLessonCompletionStatus(lessons);
      setLessonsWithStatus(updatedLessonStatus);
    }
  }, []);

  const handleVideoPlay = (video: SampleVideo) => {
    setPlayingVideo(video);
  };

  const handleProgressUpdate = () => {
    // Refresh progress data after video progress update
    const loadedProgress = loadProgress();
    setProgress(loadedProgress);
    setCompletionPercentage(calculateCourseCompletion(loadedProgress));
    setAchievements(evaluateAchievements(loadedProgress));

    // Update lessons with new progress and lock status
    const updatedLessonStatus = getLessonCompletionStatus(lessons);
    setLessonsWithStatus(updatedLessonStatus);
  };

  const handleLessonAccess = (lessonId: string) => {
    const lesson = lessonsWithStatus.find((l) => l.lessonId === lessonId);
    if (!lesson) return;

    // Check if lesson is locked
    if (lesson.isLocked) {
      const previousLesson = lessons.find((l) => l.order === lesson.order - 1);
      alert(
        `Complete "${previousLesson?.title || 'the previous lesson'}" before accessing this lesson`,
      );
      return;
    }

    // Find the corresponding video and play it
    const video = sampleVideos.find((v) => v.id === lessonId);
    if (video) {
      handleVideoPlay(video);
    }
  };

  const resetProgress = () => {
    localStorage.removeItem('course_progress');
    setProgress(null);
    setCompletionPercentage(0);
    setAchievements([]);
    // Reload the page to reset everything
    window.location.reload();
  };

  const closeVideoPlayer = () => {
    setPlayingVideo(null);
  };

  if (!progress) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f3f6f8] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold text-[#5c0f49] mb-2">
            Course Progress Tracker
          </h1>
          <p className="text-gray-600">
            Track your learning journey and achievements
          </p>
          <Button
            onClick={resetProgress}
            variant="outline"
            className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
          >
            Reset Progress (For Testing)
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 border-[#ffcc00]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#5c0f49]">
              <Trophy className="w-5 h-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Course Completion</span>
                  <span className="text-sm text-[#5c0f49] font-bold">
                    {completionPercentage}%
                  </span>
                </div>
                <Progress
                  value={completionPercentage}
                  className="h-3 bg-[#5c0f49]/10"
                />
              </div>

              {achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#5c0f49]">
                    Achievements Unlocked
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((achievement, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#ffcc00] text-[#5c0f49] border-[#5c0f49]/20"
                      >
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lesson Progress with Locking */}
        <Card className="mb-8 border-[#ffcc00]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#5c0f49]">
              <Play className="w-5 h-5" />
              Course Lessons
            </CardTitle>
            <p className="text-sm text-gray-600">
              Complete each lesson to unlock the next one
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {lessonsWithStatus.map((lesson) => {
                const previousLesson = lessons.find(
                  (l) => l.order === lesson.order - 1,
                );
                return (
                  <LockedLessonCard
                    key={lesson.lessonId}
                    lesson={lesson}
                    onPlayVideo={handleLessonAccess}
                    previousLessonTitle={previousLesson?.title}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quiz Progress */}
        <Card className="mb-8 border-[#ffcc00]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#5c0f49]">
              <BookOpen className="w-5 h-5" />
              Quiz Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {progress.quizzes.length === 0 ? (
                <p className="text-gray-500">No quizzes attempted yet.</p>
              ) : (
                progress.quizzes.map((quiz) => (
                  <div
                    key={quiz.quizId}
                    className="flex items-center justify-between p-4 border border-[#ffcc00]/10 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-[#5c0f49]">
                        Quiz {quiz.quizId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Attempts: {quiz.attempts} | Best Score: {quiz.bestScore}
                        %
                      </p>
                    </div>
                    <Badge
                      variant={quiz.bestScore >= 80 ? 'default' : 'secondary'}
                      className={
                        quiz.bestScore >= 80
                          ? 'bg-green-500 text-white'
                          : 'bg-[#ffcc00] text-[#5c0f49]'
                      }
                    >
                      {quiz.bestScore >= 80 ? 'Passed' : 'In Progress'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Progress */}
        <Card className="border-[#ffcc00]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#5c0f49]">
              <Clock className="w-5 h-5" />
              Assignment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {progress.assignments.length === 0 ? (
                <p className="text-gray-500">No assignments submitted yet.</p>
              ) : (
                progress.assignments.map((assignment) => (
                  <div
                    key={assignment.assignmentId}
                    className="flex items-center justify-between p-4 border border-[#ffcc00]/10 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-[#5c0f49]">
                        Assignment {assignment.assignmentId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Status: {assignment.status}
                        {assignment.grade && ` | Grade: ${assignment.grade}%`}
                      </p>
                      {assignment.submittedAt && (
                        <p className="text-xs text-gray-500">
                          Submitted:{' '}
                          {new Date(
                            assignment.submittedAt,
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        assignment.status === 'graded'
                          ? 'default'
                          : assignment.status === 'submitted'
                            ? 'secondary'
                            : 'outline'
                      }
                      className={
                        assignment.status === 'graded'
                          ? 'bg-green-500 text-white'
                          : assignment.status === 'submitted'
                            ? 'bg-[#ffcc00] text-[#5c0f49]'
                            : 'border-[#5c0f49] text-[#5c0f49]'
                      }
                    >
                      {assignment.status === 'graded'
                        ? 'Graded'
                        : assignment.status === 'submitted'
                          ? 'Submitted'
                          : 'Not Submitted'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#5c0f49] text-[#ffcc00]">
              <h2 className="text-xl font-bold">{playingVideo.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeVideoPlayer}
                className="text-[#ffcc00] hover:bg-[#ffcc00]/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <VideoPlayer
                videoId={playingVideo.id}
                videoUrl={playingVideo.videoUrl}
                title={playingVideo.title}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Play, CheckCircle } from 'lucide-react';
import { Lesson } from '@/services/lessonLockService';

interface LockedLessonCardProps {
  lesson: Lesson & { isLocked: boolean; isCompleted?: boolean };
  onPlayVideo: (lessonId: string) => void;
  previousLessonTitle?: string;
}

export default function LockedLessonCard({
  lesson,
  onPlayVideo,
  previousLessonTitle,
}: LockedLessonCardProps) {
  if (lesson.isLocked) {
    return (
      <Card className="border-gray-200 bg-gray-50 opacity-75">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-700">{lesson.title}</h3>
            </div>
            <Badge variant="secondary" className="bg-gray-200 text-gray-600">
              Locked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {previousLessonTitle 
                ? `Complete "${previousLessonTitle}" before accessing this lesson`
                : 'Complete the previous lesson before accessing this lesson'
              }
            </p>
            <Button 
              disabled 
              className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              <Lock className="w-4 h-4 mr-2" />
              Lesson Locked
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#ffcc00]/20 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {lesson.isCompleted ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Play className="w-4 h-4 text-[#5c0f49]" />
            )}
            <h3 className="font-semibold text-[#5c0f49]">{lesson.title}</h3>
          </div>
          {lesson.isCompleted && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => onPlayVideo(lesson.id)}
          className="w-full bg-[#5c0f49] hover:bg-[#7a1a5f] text-[#ffcc00] border border-[#ffcc00]/20"
        >
          <Play className="w-4 h-4 mr-2" />
          {lesson.isCompleted ? 'Review Lesson' : 'Start Lesson'}
        </Button>
      </CardContent>
    </Card>
  );
}

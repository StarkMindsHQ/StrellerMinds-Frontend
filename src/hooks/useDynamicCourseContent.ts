'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Lesson } from '@/types/lesson';
import { useCallback, useEffect } from 'react';

interface UseDynamicCourseContentProps {
  courseId: string;
  lessonId?: string;
}

/**
 * useDynamicCourseContent Hook
 * Handles dynamic fetching and prefetching of course lessons.
 */
export const useDynamicCourseContent = ({
  courseId,
  lessonId,
}: UseDynamicCourseContentProps) => {
  const queryClient = useQueryClient();

  // Mock fetcher for a single lesson
  const fetchLesson = async (cid: string, lid: string): Promise<Lesson> => {
    // In a real app, this would be: await api.get(`/courses/${cid}/lessons/${lid}`)
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency

    // Mock data based on ID
    return {
      id: lid,
      title: `Dynamic Lesson: ${lid.split('-').pop()}`,
      description: 'This lesson was loaded dynamically to optimize initial course load time.',
      videoUrl: 'https://sample-videos.com/video123.mp4',
      duration: 600,
      order: parseInt(lid.split('-').pop() || '1', 10),
      type: 'video',
    };
  };

  const {
    data: lesson,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => fetchLesson(courseId, lessonId!),
    enabled: !!lessonId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Prefetch logic for the next lesson
  const prefetchNextLesson = useCallback(async (nextLessonId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['lesson', courseId, nextLessonId],
      queryFn: () => fetchLesson(courseId, nextLessonId),
      staleTime: 1000 * 60 * 5,
    });
    console.log(`Prefetched lesson: ${nextLessonId}`);
  }, [courseId, queryClient]);

  return {
    lesson,
    isLoading,
    error,
    refetch,
    prefetchNextLesson,
  };
};

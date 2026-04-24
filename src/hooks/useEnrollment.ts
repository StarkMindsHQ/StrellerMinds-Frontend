'use client';

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Types
export interface PrerequisiteCourse {
  courseId: string;
  title: string;
  completed: boolean;
  required: boolean;
}

export interface PrerequisiteCheckResult {
  courseId: string;
  prerequisites: PrerequisiteCourse[];
  allMet: boolean;
  missingCount: number;
}

export interface EnrollmentInfo {
  isEnrolled: boolean;
  enrolledAt?: string;
  progress: number;
  completed: boolean;
}

/**
 * Hook to manage course enrollment and prerequisite checking
 */
export function useEnrollment(courseId: string) {
  const { data: session } = useSession();
  const userId = session?.user?.email || 'anonymous'; // Use email as userId for mock

  const [enrollment, setEnrollment] = useState<EnrollmentInfo>({
    isEnrolled: false,
    progress: 0,
    completed: false,
  });
  const [prerequisites, setPrerequisites] =
    useState<PrerequisiteCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  // Load enrollment from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`enrollment-${courseId}-${userId}`);
    if (saved) {
      try {
        setEnrollment(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse enrollment:', e);
      }
    }
    setLoading(false);
  }, [courseId, userId]);

  // Check prerequisites from API
  useEffect(() => {
    const checkPrereqs = async () => {
      try {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        const res = await fetch(
          `/api/courses/${courseId}/prerequisites?${params}`,
        );
        const data = await res.json();
        if (res.ok) {
          setPrerequisites(data.data);
        } else {
          console.error('Failed to check prerequisites:', data.error);
        }
      } catch (error) {
        console.error('Error checking prerequisites:', error);
      }
    };

    if (courseId) {
      checkPrereqs();
    }
  }, [courseId, userId]);

  // Save enrollment to localStorage when changed
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        `enrollment-${courseId}-${userId}`,
        JSON.stringify(enrollment),
      );
    }
  }, [enrollment, courseId, userId, loading]);

  /**
   * Enroll in the course after verifying prerequisites
   */
  const enroll = async (): Promise<{ success: boolean; error?: string }> => {
    // Check prerequisites first
    if (prerequisites && !prerequisites.allMet) {
      return {
        success: false,
        error: 'You must complete all prerequisite courses before enrolling.',
      };
    }

    setEnrolling(true);
    try {
      // In a real app, this would be an API call
      // For mock, we just update local state
      const newEnrollment: EnrollmentInfo = {
        isEnrolled: true,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completed: false,
      };
      setEnrollment(newEnrollment);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enroll',
      };
    } finally {
      setEnrolling(false);
    }
  };

  /**
   * Unenroll from the course
   */
  const unenroll = () => {
    setEnrollment({
      isEnrolled: false,
      progress: 0,
      completed: false,
    });
    localStorage.removeItem(`enrollment-${courseId}-${userId}`);
  };

  /**
   * Check if user can access the course (enrolled and prerequisites met)
   */
  const canAccess =
    enrollment.isEnrolled && (!prerequisites || prerequisites.allMet);

  return {
    ...enrollment,
    prerequisites,
    loading,
    enrolling,
    enroll,
    unenroll,
    canAccess,
    hasAccess: canAccess, // alias
  };
}

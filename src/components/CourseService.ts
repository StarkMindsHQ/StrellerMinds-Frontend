import type { EnhancedCourseData } from '@/lib/course-data';
import { logger } from '@/lib/logger';

// This file will would be used to fetch course data from the API and handle abstraction for data fetching operations
export async function fetchFeaturedCourses(
  tab = 'popular',
): Promise<EnhancedCourseData[]> {
  try {
    const response = await fetch(`/api/courses?tab=${tab}`);

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await response.json();
    return data.courses;
  } catch (error) {
    logger.error('Error fetching courses:', error);
    return [];
  }
}

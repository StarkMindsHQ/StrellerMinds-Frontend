import type { EnhancedCourseData } from '@/lib/course-data';
import { logger } from '@/lib/logger';

// This file will would be used to fetch course data from the API and handle abstraction for data fetching operations
export async function fetchFeaturedCourses(
  tab = 'popular',
  retries = 5,
  delay = 2000,
): Promise<EnhancedCourseData[]> {
  let lastError: any;

  for (let attempt = 1; attempt < retries; ++attempt) {
    try {
      const response = await fetch(`/api/courses?tab=${tab}`);

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      return data.courses;
    } catch (error: unknown) {
      lastError = error;
      logger.error('Error fetching courses:', error);

      if (error instanceof Error) {
        console.error(`Attempt ${attempt} failed: ${error.message}`);

        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        }
      } else {
        console.error('Unknown error occurred:', error);
        break;
      }
    }
  }

  if (lastError instanceof Error) {
    const newError = new Error(
      `Failed to fetch courses after ${retries} attempts: ${lastError.message}`,
    );
    newError.stack = lastError.stack;
    throw newError;
  } else {
    throw new Error(
      `Unknown error occurred while fetching courses after retries`,
    );
  }
}

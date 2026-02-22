import {
  electiveCourses,
  type ElectiveCourseData,
} from '@/lib/elective-course-data';

export interface EnrollmentSummary {
  id: string;
  title: string;
  enrollments: number;
  level: ElectiveCourseData['level'];
  category: string;
}

export interface EnrollmentTrendPoint {
  label: string;
  enrollments: number;
}

export interface EnrollmentCategoryDistribution {
  category: string;
  enrollments: number;
  percentage: number;
}

export interface EnrollmentAnalytics {
  totals: {
    courses: number;
    enrollments: number;
    averageEnrollmentsPerCourse: number;
    levels: Array<{ level: ElectiveCourseData['level']; count: number }>;
  };
  popularCourses: {
    topCourses: EnrollmentSummary[];
    mostPopular: EnrollmentSummary;
    leastPopular: EnrollmentSummary;
  };
  trend: EnrollmentTrendPoint[];
  categoryDistribution: EnrollmentCategoryDistribution[];
}

export interface FetchEnrollmentAnalyticsOptions {
  simulateDelay?: number;
  simulateError?: boolean;
}

const buildAnalyticsSnapshot = (): EnrollmentAnalytics => {
  const courses = electiveCourses.length;
  const enrollments = electiveCourses.reduce((total, course) => {
    return total + course.studentsCount;
  }, 0);

  const averageEnrollmentsPerCourse = courses
    ? Math.round((enrollments / courses) * 10) / 10
    : 0;

  const sortedByEnrollment = [...electiveCourses].sort((a, b) => {
    return b.studentsCount - a.studentsCount;
  });

  const toSummary = (course: ElectiveCourseData): EnrollmentSummary => ({
    id: course.id,
    title: course.title,
    enrollments: course.studentsCount,
    level: course.level,
    category: course.category,
  });

  const topCourses = sortedByEnrollment.slice(0, 3).map(toSummary);
  const mostPopular: EnrollmentSummary = sortedByEnrollment[0]
    ? toSummary(sortedByEnrollment[0])
    : {
        id: '',
        title: 'No courses available',
        enrollments: 0,
        level: 'Beginner' as const,
        category: 'N/A',
      };

  const leastPopular: EnrollmentSummary = sortedByEnrollment[
    sortedByEnrollment.length - 1
  ]
    ? toSummary(sortedByEnrollment[sortedByEnrollment.length - 1])
    : mostPopular;

  const levelMap: Record<ElectiveCourseData['level'], number> = {
    Beginner: 0,
    Intermediate: 0,
    Advanced: 0,
  };

  for (const course of electiveCourses) {
    levelMap[course.level] += 1;
  }

  const categoryMap = electiveCourses.reduce<Map<string, number>>(
    (map, course) => {
      const current = map.get(course.category) ?? 0;
      map.set(course.category, current + course.studentsCount);
      return map;
    },
    new Map(),
  );

  const categoryDistribution: EnrollmentCategoryDistribution[] = Array.from(
    categoryMap.entries(),
  )
    .map(([category, total]) => ({
      category,
      enrollments: total,
      percentage: enrollments
        ? Math.round((total / enrollments) * 1000) / 10
        : 0,
    }))
    .sort((a, b) => b.enrollments - a.enrollments);

  const trend: EnrollmentTrendPoint[] = [
    { label: 'Apr', enrollments: 420 },
    { label: 'May', enrollments: 465 },
    { label: 'Jun', enrollments: 512 },
    { label: 'Jul', enrollments: 498 },
    { label: 'Aug', enrollments: 534 },
    { label: 'Sep', enrollments: 561 },
  ];

  return {
    totals: {
      courses,
      enrollments,
      averageEnrollmentsPerCourse,
      levels: Object.entries(levelMap).map(([level, count]) => ({
        level: level as ElectiveCourseData['level'],
        count,
      })),
    },
    popularCourses: {
      topCourses,
      mostPopular,
      leastPopular,
    },
    trend,
    categoryDistribution,
  };
};

const MOCK_ANALYTICS = buildAnalyticsSnapshot();

export const enrollmentAnalyticsService = {
  async fetchEnrollmentAnalytics(
    options: FetchEnrollmentAnalyticsOptions = {},
  ): Promise<EnrollmentAnalytics> {
    const { simulateDelay = 600, simulateError = false } = options;

    await new Promise((resolve) => setTimeout(resolve, simulateDelay));

    if (simulateError) {
      throw new Error(
        'Unable to load enrollment analytics. Please try again later.',
      );
    }

    return MOCK_ANALYTICS;
  },
};

export type { EnrollmentAnalytics as EnrollmentAnalyticsResponse };

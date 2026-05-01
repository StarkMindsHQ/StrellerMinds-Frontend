import { NextRequest, NextResponse } from 'next/server';
import { generateMockLearningRecords } from '@/data/learningAnalyticsMock';
import type {
  LeaderboardEntry,
  LeaderboardResponse,
  LeaderboardFilters,
} from '@/types/leaderboard';
import type { StudentLearningRecord } from '@/types/learningAnalytics';

/**
 * GET /api/leaderboard/students
 *
 * Fetches top students leaderboard data
 * Query params:
 * - metricType: 'completion' | 'quiz_score' | 'combined'
 * - courseId: string (optional)
 * - limit: number (default: 20)
 * - offset: number (default: 0)
 * - userId: string (optional, for highlighting current user)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const metricType = (searchParams.get('metricType') as any) || 'completion';
    const courseId = searchParams.get('courseId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const userId = searchParams.get('userId') || undefined;

    // Validate metric type
    if (!['completion', 'quiz_score', 'combined'].includes(metricType)) {
      return NextResponse.json(
        {
          error:
            'Invalid metric type. Must be completion, quiz_score, or combined',
        },
        { status: 400 },
      );
    }

    // Generate mock data (in production, this would come from database)
    const allStudents = generateMockLearningRecords(50);

    // Filter by course if specified
    let filteredStudents = allStudents;
    if (courseId) {
      filteredStudents = allStudents.filter((s) => s.courseId === courseId);
    }

    // Calculate score based on metric type
    const calculateScore = (student: (typeof allStudents)[0]): number => {
      switch (metricType) {
        case 'completion':
          return student.currentProgress;
        case 'quiz_score':
          return Math.round(student.quizAverageScore);
        case 'combined':
          return Math.round(
            student.currentProgress * 0.6 + student.quizAverageScore * 0.4,
          );
        default:
          return student.currentProgress;
      }
    };

    // Sort by score (descending)
    const ranked = filteredStudents
      .map((student) => ({
        ...student,
        score: calculateScore(student),
      }))
      .sort((a, b) => b.score - a.score);

    // Get paginated results
    const total = ranked.length;
    const paginated = ranked.slice(offset, offset + limit);

    // Build leaderboard entries
    const entries: LeaderboardEntry[] = paginated.map((student, index) => ({
      rank: offset + index + 1,
      studentId: student.studentId,
      studentName: student.studentName,
      avatarUrl: `/avatars/${student.studentName.toLowerCase().replace(/\s+/g, '.')}.jpg`,
      courseId: student.courseId,
      courseName: student.courseName,
      cohort: student.cohort,
      score: student.score,
      metricType,
      coursesCompleted: Math.floor(student.currentProgress / 25),
      quizzesTaken: student.quizzesAssigned,
      averageQuizScore: Math.round(student.quizAverageScore),
      completionRate: student.currentProgress,
    }));

    // Find current user if userId provided
    let currentUserEntry: LeaderboardEntry | undefined;
    if (userId) {
      const userRank = ranked.findIndex((s) => s.studentId === userId);
      if (userRank !== -1) {
        const user = ranked[userRank];
        currentUserEntry = {
          rank: userRank + 1,
          studentId: user.studentId,
          studentName: user.studentName,
          avatarUrl: `/avatars/${user.studentName.toLowerCase().replace(/\s+/g, '.')}.jpg`,
          courseId: user.courseId,
          courseName: user.courseName,
          cohort: user.cohort,
          score: user.score,
          metricType,
          coursesCompleted: Math.floor(user.currentProgress / 25),
          quizzesTaken: user.quizzesAssigned,
          averageQuizScore: Math.round(user.quizAverageScore),
          completionRate: user.currentProgress,
        };
      }
    }

    const response: LeaderboardResponse = {
      entries,
      totalCount: total,
      currentUserEntry,
      hasMore: offset + limit < total,
      filters: {
        metricType,
        courseId,
        limit,
        offset,
      },
      lastUpdatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 },
    );
  }
}

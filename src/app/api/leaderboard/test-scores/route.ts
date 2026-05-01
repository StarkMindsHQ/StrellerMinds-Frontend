import { NextRequest, NextResponse } from 'next/server';
import { getTestScoreLeaderboard } from '@/lib/leaderboard/testScoreLeaderboardService';
import type {
  TestScoreLeaderboardQueryParams,
  TestScoreLeaderboardResponse,
} from '@/types/testScoreLeaderboard';

/**
 * GET /api/leaderboard/test-scores
 *
 * Fetches test score leaderboard data with cursor-based pagination.
 * Supports filtering by course and test (quiz), with ranking and current user highlighting.
 *
 * Query parameters:
 * - courseId: string (optional) - filter by course
 * - testId: string (optional) - filter by quiz/test ID
 * - moduleId: string (optional) - filter by module
 * - sortBy: 'score' | 'timeSpent' | 'attempts' (default: 'score')
 * - order: 'asc' | 'desc' (default: 'desc' for score, 'asc' for time/attempts)
 * - limit: number (default: 20, max: 100)
 * - cursor: string (base64 encoded cursor for pagination)
 * - currentUserId: string (optional) - highlight specific user
 *
 * Response:
 * {
 *   data: TestScoreLeaderboardEntry[],
 *   nextCursor: string | null,
 *   hasMore: boolean,
 *   totalCount: number,
 *   currentUserEntry?: TestScoreLeaderboardEntry,
 *   filters: TestScoreLeaderboardFilters,
 *   sortBy: string,
 *   order: string
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters with defaults
    const courseId = searchParams.get('courseId') || undefined;
    const testId = searchParams.get('testId') || undefined;
    const moduleId = searchParams.get('moduleId') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'score';
    const order =
      (searchParams.get('order') as any) ||
      (sortBy === 'score' ? 'desc' : 'asc');
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '20', 10),
      100,
    );
    const cursor = searchParams.get('cursor') || undefined;
    const currentUserId = searchParams.get('currentUserId') || undefined;

    // Validate sortBy
    const validSortBy = ['score', 'timeSpent', 'attempts'];
    if (!validSortBy.includes(sortBy)) {
      return NextResponse.json(
        { error: `Invalid sortBy. Must be one of: ${validSortBy.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate order
    if (order !== 'asc' && order !== 'desc') {
      return NextResponse.json(
        { error: 'Invalid order. Must be "asc" or "desc"' },
        { status: 400 },
      );
    }

    // Build query params
    const queryParams: TestScoreLeaderboardQueryParams = {
      courseId,
      testId,
      moduleId,
      sortBy,
      order,
      limit,
      cursor,
      currentUserId,
    };

    // Fetch leaderboard data from service
    const result = await getTestScoreLeaderboard(queryParams);

    const response: TestScoreLeaderboardResponse = {
      data: result.data,
      nextCursor: result.nextCursor,
      hasMore: result.hasMore,
      totalCount: result.totalCount,
      currentUserEntry: result.currentUserEntry,
      filters: result.filters,
      sortBy: result.sortBy,
      order: result.order,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Test Score Leaderboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test score leaderboard' },
      { status: 500 },
    );
  }
}

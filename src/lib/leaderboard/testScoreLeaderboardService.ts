import { prisma } from '@/lib/prisma';
import type {
  TestScoreLeaderboardEntry,
  TestScoreLeaderboardResponse,
  TestScoreLeaderboardFilters,
  TestScoreLeaderboardQueryParams,
  CursorInfo,
} from '@/types/testScoreLeaderboard';

/**
 * Ranking Strategy: Shared ranking (ties get same rank, next rank skips)
 * Example: Scores [100, 95, 95, 90] → Ranks: [1, 2, 2, 4]
 *
 * This is also known as "competition ranking" or "1224 ranking".
 * - Each unique score gets a distinct rank number
 * - Tied scores share the same rank
 * - The next rank after ties is incremented by the number of tied entries
 */

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Encode cursor to base64 for transmission
 */
function encodeCursor(cursor: CursorInfo): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
}

/**
 * Decode cursor from base64
 */
function decodeCursor(cursor: string): CursorInfo {
  return JSON.parse(Buffer.from(cursor, 'base64').toString());
}

/**
 * Build the base query for quiz attempts with necessary joins
 */
function getBaseQuery(params: TestScoreLeaderboardQueryParams) {
  const where: Record<string, any> = {};

  if (params.courseId) {
    where.courseId = params.courseId;
  }
  if (params.testId) {
    where.quizId = params.testId;
  }
  if (params.moduleId) {
    // Join through Quiz to filter by module
    // This will be handled in the full query
  }

  return where;
}

/**
 * Get current user's entry with rank calculation
 */
async function getCurrentUserEntryForFilters(
  userId: string,
  filters: TestScoreLeaderboardFilters,
): Promise<TestScoreLeaderboardEntry | undefined> {
  const where: Record<string, any> = { userId };
  if (filters.courseId) where.courseId = filters.courseId;
  if (filters.testId) where.quizId = filters.testId;

  // Get user's best attempt
  const bestAttempt = await prisma.quizAttempt.findFirst({
    where,
    orderBy: [{ score: 'desc' }, { completedAt: 'desc' }],
    select: {
      score: true,
      totalPoints: true,
      maxPoints: true,
      correctAnswers: true,
      totalQuestions: true,
      attempts: true,
      timeSpent: true,
      completedAt: true,
      courseId: true,
      quizId: true,
    },
  });

  if (!bestAttempt) return undefined;

  // Calculate rank using subquery
  const rankResult = await prisma.$queryRaw<Array<{ rank: number }>>`
    SELECT COUNT(*) + 1 as rank
    FROM "QuizAttempt" qa
    WHERE (
      qa.score > ${bestAttempt.score}
      OR (
        qa.score = ${bestAttempt.score}
        AND qa.userId < ${userId}
      )
    )
    ${filters.courseId ? `AND qa."courseId" = '${filters.courseId}'` : ''}
    ${filters.testId ? `AND qa."quizId" = '${filters.testId}'` : ''}
  `;

  const rank = rankResult[0]?.rank || 0;

  // Get course and quiz names
  const [course, quiz] = await Promise.all([
    bestAttempt.courseId
      ? prisma.course.findUnique({
          where: { id: bestAttempt.courseId },
          select: { title: true },
        })
      : Promise.resolve(null),
    prisma.quiz.findUnique({
      where: { id: bestAttempt.quizId },
      select: { title: true },
    }),
  ]);

  // Get user name
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  return {
    rank,
    userId,
    userName: user?.name || 'Unknown',
    score: bestAttempt.score,
    totalPoints: bestAttempt.totalPoints ?? undefined,
    maxPoints: bestAttempt.maxPoints ?? undefined,
    correctAnswers: bestAttempt.correctAnswers ?? undefined,
    totalQuestions: bestAttempt.totalQuestions ?? undefined,
    attempts: bestAttempt.attempts,
    timeSpent: bestAttempt.timeSpent ?? undefined,
    completedAt:
      bestAttempt.completedAt?.toISOString() || new Date().toISOString(),
    courseId: bestAttempt.courseId ?? undefined,
    courseName: course?.title ?? undefined,
    testId: bestAttempt.quizId,
    testTitle: quiz?.title ?? undefined,
  };
}

/**
 * Get total count matching filters
 */
async function getTotalCount(
  filters: TestScoreLeaderboardFilters,
): Promise<number> {
  const where: Record<string, any> = {};
  if (filters.courseId) where.courseId = filters.courseId;
  if (filters.testId) where.quizId = filters.testId;

  return await prisma.quizAttempt.count({ where });
}

/**
 * Fetch the best score per user (or latest attempt) for leaderboard
 * Uses window functions for efficient ranking
 */
export async function getTestScoreLeaderboard(
  params: TestScoreLeaderboardQueryParams,
): Promise<TestScoreLeaderboardResponse> {
  const limit = Math.min(params.limit || DEFAULT_LIMIT, MAX_LIMIT);
  const sortBy = params.sortBy || 'score';
  const order = params.order || 'desc';
  const cursor = params.cursor;

  // Build filter conditions
  const filters: TestScoreLeaderboardFilters = {
    courseId: params.courseId,
    testId: params.testId,
    moduleId: params.moduleId,
    sortBy,
    order,
  };

  // Build base WHERE clause
  const whereClause: Record<string, any> = {};
  if (params.courseId) {
    whereClause.courseId = params.courseId;
  }
  if (params.testId) {
    whereClause.quizId = params.testId;
  }

  // Determine cursor position if provided
  let cursorCondition: Record<string, any> = {};
  if (cursor) {
    try {
      const cursorData = decodeCursor(cursor);
      // Cursor represents position after the last item of the previous page
      // We need to find items that come after the cursor position
      cursorCondition = {
        OR: [
          // Lower score if descending (assuming score DESC)
          ...(order === 'desc'
            ? [{ score: { lt: cursorData.lastScore } }]
            : [{ score: { gt: cursorData.lastScore } }]),
          // Same score but user ID after (for deterministic ordering)
          ...(order === 'desc'
            ? [
                {
                  score: cursorData.lastScore,
                  userId: { gt: cursorData.lastUserId },
                },
              ]
            : [
                {
                  score: cursorData.lastScore,
                  userId: { lt: cursorData.lastUserId },
                },
              ]),
        ],
      };
    } catch (e) {
      // Invalid cursor - ignore and start from beginning
    }
  }

  // Combine where conditions
  const finalWhere =
    Object.keys(whereClause).length > 0 ||
    Object.keys(cursorCondition).length > 0
      ? { AND: [whereClause, cursorCondition].filter(Boolean) }
      : {};

  // Build SQL query
  const sql = `
    SELECT
      RANK() OVER (
        ORDER BY qa.score ${order === 'desc' ? 'DESC' : 'ASC'},
                 qa.userId
      ) as rank,
      qa.userId,
      u.name as userName,
      qa.score,
      qa."totalPoints",
      qa."maxPoints",
      qa."correctAnswers",
      qa."totalQuestions",
      qa.attempts,
      qa."timeSpent",
      qa."completedAt",
      qa."courseId",
      c.title as "courseName",
      qa."quizId",
      q.title as "quizTitle"
    FROM "QuizAttempt" qa
    INNER JOIN "User" u ON qa.userId = u.id
    INNER JOIN "Quiz" q ON qa."quizId" = q.id
    LEFT JOIN "Course" c ON qa."courseId" = c.id
    ${Object.keys(finalWhere).length > 0 ? 'WHERE ' + buildWhereClause(finalWhere) : ''}
    ORDER BY qa.score ${order === 'desc' ? 'DESC' : 'ASC'}, qa.userId
    LIMIT ${limit + 1}
  `;

  // Fetch page data using raw SQL for window function ranking
  const pageData = (await (prisma as any).$queryRaw(sql)) as Array<{
    rank: number;
    userId: string;
    userName: string;
    score: number;
    totalPoints: number | null;
    maxPoints: number | null;
    correctAnswers: number | null;
    totalQuestions: number | null;
    attempts: number;
    timeSpent: number | null;
    completedAt: Date;
    courseId: string | null;
    courseName: string | null;
    quizId: string;
    quizTitle: string | null;
  }>;

  const hasMore = pageData.length > limit;
  const page = hasMore ? pageData.slice(0, limit) : pageData;

  // Build next cursor if there are more results
  let nextCursor: string | null = null;
  if (hasMore) {
    const lastItem = pageData[limit];
    nextCursor = encodeCursor({
      lastScore: lastItem.score,
      lastUserId: lastItem.userId,
      lastAttemptId: lastItem.quizId,
      createdAt: lastItem.completedAt.toISOString(),
    });
  }

  // Get total count (approximate - could be expensive on large datasets)
  const totalCount = await getTotalCount(filters);

  // Get current user entry separately if requested
  let currentUserEntry: TestScoreLeaderboardEntry | undefined;
  if (params.currentUserId) {
    currentUserEntry = await getCurrentUserEntryForFilters(
      params.currentUserId,
      filters,
    );
  }

  // Transform to response format
  const data: TestScoreLeaderboardEntry[] = page.map((row) => ({
    rank: row.rank,
    userId: row.userId,
    userName: row.userName,
    score: row.score,
    totalPoints: row.totalPoints ?? undefined,
    maxPoints: row.maxPoints ?? undefined,
    correctAnswers: row.correctAnswers ?? undefined,
    totalQuestions: row.totalQuestions ?? undefined,
    attempts: row.attempts,
    timeSpent: row.timeSpent ?? undefined,
    completedAt: row.completedAt.toISOString(),
    courseId: row.courseId ?? undefined,
    courseName: row.courseName ?? undefined,
    testId: row.quizId,
    testTitle: row.quizTitle ?? undefined,
  }));

  return {
    data,
    nextCursor,
    hasMore,
    totalCount: totalCount, // approximate from count query
    currentUserEntry,
    filters,
    sortBy,
    order,
  };
}

/**
 * Build WHERE clause string for raw SQL
 */
function buildWhereClause(where: Record<string, any>): string {
  const conditions: string[] = [];

  for (const [key, value] of Object.entries(where)) {
    if (key === 'AND') {
      const andClauses = (value as Array<Record<string, any>>).map((clause) =>
        buildWhereClause(clause),
      );
      conditions.push(`(${andClauses.join(' AND ')})`);
    } else if (key === 'OR') {
      const orClauses = (value as Array<Record<string, any>>).map((clause) =>
        buildWhereClause(clause),
      );
      conditions.push(`(${orClauses.join(' OR ')})`);
    } else if (typeof value === 'object' && value !== null) {
      const operator = Object.keys(value)[0] as string;
      const val = value[operator];
      const column = `"${key}"`;
      switch (operator) {
        case 'lt':
          conditions.push(`${column} < ${JSON.stringify(val)}`);
          break;
        case 'gt':
          conditions.push(`${column} > ${JSON.stringify(val)}`);
          break;
        case 'eq':
          conditions.push(`${column} = ${JSON.stringify(val)}`);
          break;
        default:
          conditions.push(`${column} = ${JSON.stringify(val)}`);
      }
    } else {
      conditions.push(`"${key}" = ${JSON.stringify(value)}`);
    }
  }

  return conditions.join(' AND ');
}

/**
 * Get distinct users who have made attempts for a given course/test
 * Useful for filtering/display
 */
export async function getDistinctUsersForTest(
  testId: string,
  courseId?: string,
): Promise<Array<{ userId: string; userName: string }>> {
  const where: Record<string, any> = { quizId: testId };
  if (courseId) where.courseId = courseId;

  const attempts = await prisma.quizAttempt.findMany({
    where,
    distinct: ['userId'],
    select: {
      userId: true,
      user: {
        select: { name: true },
      },
    },
    orderBy: { userId: 'asc' },
  });

  return attempts.map((a) => ({
    userId: a.userId,
    userName: a.user.name || 'Unknown',
  }));
}

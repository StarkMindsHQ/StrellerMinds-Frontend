import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock the leaderboard service
vi.mock('@/lib/leaderboard/testScoreLeaderboardService', () => ({
  getTestScoreLeaderboard: vi.fn(),
}));

import { getTestScoreLeaderboard } from '@/lib/leaderboard/testScoreLeaderboardService';

describe('Test Score Leaderboard API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return successful response with default parameters', async () => {
    const mockResult = {
      data: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
      filters: {},
      sortBy: 'score' as const,
      order: 'desc' as const,
    };
    vi.mocked(getTestScoreLeaderboard).mockResolvedValue(mockResult);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/leaderboard/test-scores'),
    );

    const response = await GET(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('nextCursor');
    expect(data).toHaveProperty('hasMore');
    expect(data).toHaveProperty('totalCount');
    expect(data).toHaveProperty('filters');
    expect(data).toHaveProperty('sortBy');
    expect(data).toHaveProperty('order');
  });

  it('should pass query parameters to service', async () => {
    const mockResult = {
      data: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
      filters: { courseId: 'course-1', testId: 'test-1' },
      sortBy: 'score' as const,
      order: 'desc' as const,
    };
    vi.mocked(getTestScoreLeaderboard).mockResolvedValue(mockResult);

    const request = new NextRequest(
      new URL(
        'http://localhost:3000/api/leaderboard/test-scores?courseId=course-1&testId=test-1&sortBy=score&order=desc&limit=10',
      ),
    );

    await GET(request);

    expect(getTestScoreLeaderboard).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: 'course-1',
        testId: 'test-1',
        sortBy: 'score',
        order: 'desc',
        limit: 10,
      }),
    );
  });

  it('should validate sortBy parameter', async () => {
    const request = new NextRequest(
      new URL(
        'http://localhost:3000/api/leaderboard/test-scores?sortBy=invalid',
      ),
    );

    const response = await GET(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Invalid sortBy');
  });

  it('should validate order parameter', async () => {
    const mockResult = {
      data: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
      filters: {},
      sortBy: 'score' as const,
      order: 'desc' as const,
    };
    vi.mocked(getTestScoreLeaderboard).mockResolvedValue(mockResult);

    const request = new NextRequest(
      new URL(
        'http://localhost:3000/api/leaderboard/test-scores?order=invalid',
      ),
    );

    const response = await GET(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Invalid order');
  });

  it('should respect limit maximum', async () => {
    const mockResult = {
      data: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
      filters: {},
      sortBy: 'score' as const,
      order: 'desc' as const,
    };
    vi.mocked(getTestScoreLeaderboard).mockResolvedValue(mockResult);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/leaderboard/test-scores?limit=200'),
    );

    await GET(request);

    expect(getTestScoreLeaderboard).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 100, // should be capped at 100
      }),
    );
  });

  it('should handle cursor pagination', async () => {
    const mockResult = {
      data: [],
      nextCursor: 'cursor123',
      hasMore: true,
      totalCount: 50,
      filters: {},
      sortBy: 'score' as const,
      order: 'desc' as const,
    };
    vi.mocked(getTestScoreLeaderboard).mockResolvedValue(mockResult);

    const request = new NextRequest(
      new URL(
        'http://localhost:3000/api/leaderboard/test-scores?cursor=cursor123',
      ),
    );

    await GET(request);

    expect(getTestScoreLeaderboard).toHaveBeenCalledWith(
      expect.objectContaining({
        cursor: 'cursor123',
      }),
    );
  });

  it('should handle service errors gracefully', async () => {
    vi.mocked(getTestScoreLeaderboard).mockRejectedValue(
      new Error('Database error'),
    );

    const request = new NextRequest(
      new URL('http://localhost:3000/api/leaderboard/test-scores'),
    );

    const response = await GET(request);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Failed to fetch test score leaderboard');
  });
});

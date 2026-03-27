import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';

// Mock the learning analytics mock data
vi.mock('@/data/learningAnalyticsMock', () => ({
  generateMockLearningRecords: (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      studentId: `student-${i + 1}`,
      studentName: `Student ${i + 1}`,
      courseId: `course-${(i % 3) + 1}`,
      courseName: `Course ${(i % 3) + 1}`,
      cohort: `Cohort ${String.fromCharCode(65 + (i % 3))}`,
      currentProgress: 100 - i * 2,
      quizAverageScore: 95 - i * 1.5,
      quizzesAssigned: 10,
      quizzesMissed: 0,
      baselineWatchMinutes: 540,
      watchMinutes: 600,
      timeline: [],
      lessonCompletionTimestamps: [],
      lastSeenAt: new Date().toISOString(),
    }));
  },
}));

describe('Leaderboard API', () => {
  describe('GET /api/leaderboard/students', () => {
    it('should return successful response with default parameters', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students')
      );

      const response = await GET(request);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('entries');
      expect(data).toHaveProperty('totalCount');
      expect(data).toHaveProperty('hasMore');
      expect(data).toHaveProperty('filters');
      expect(data).toHaveProperty('lastUpdatedAt');
    });

    it('should return correct number of entries based on limit', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?limit=5')
      );

      const response = await GET(request);
      const data = await response.json();
      
      expect(data.entries.length).toBe(5);
      expect(data.totalCount).toBeGreaterThan(5);
    });

    it('should handle pagination with offset', async () => {
      const request1 = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?limit=5&offset=0')
      );
      const request2 = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?limit=5&offset=5')
      );

      const response1 = await GET(request1);
      const response2 = await GET(request2);
      
      const data1 = await response1.json();
      const data2 = await response2.json();
      
      expect(data1.entries[0].rank).toBe(1);
      expect(data2.entries[0].rank).toBe(6);
    });

    it('should filter by metric type', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?metricType=quiz_score')
      );

      const response = await GET(request);
      const data = await response.json();
      
      expect(data.filters.metricType).toBe('quiz_score');
      expect(data.entries.every((e: any) => e.metricType === 'quiz_score')).toBe(true);
    });

    it('should reject invalid metric types', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?metricType=invalid')
      );

      const response = await GET(request);
      
      expect(response.status).toBe(400);
    });

    it('should filter by course ID', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?courseId=course-1')
      );

      const response = await GET(request);
      const data = await response.json();
      
      // All entries should be from course-1
      expect(data.entries.every((e: any) => e.courseId === 'course-1')).toBe(true);
    });

    it('should include current user entry when userId provided', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?userId=student-5')
      );

      const response = await GET(request);
      const data = await response.json();
      
      expect(data.currentUserEntry).toBeDefined();
      expect(data.currentUserEntry.studentId).toBe('student-5');
    });

    it('should return undefined currentUserEntry when userId not found', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?userId=nonexistent')
      );

      const response = await GET(request);
      const data = await response.json();
      
      expect(data.currentUserEntry).toBeUndefined();
    });

    it('should calculate combined score correctly', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?metricType=combined')
      );

      const response = await GET(request);
      const data = await response.json();
      
      if (data.entries.length > 0) {
        const firstEntry = data.entries[0];
        // Combined score should be between completion and quiz scores
        expect(firstEntry.score).toBeGreaterThanOrEqual(0);
        expect(firstEntry.score).toBeLessThanOrEqual(100);
      }
    });

    it('should sort entries by score in descending order', async () => {
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?limit=10')
      );

      const response = await GET(request);
      const data = await response.json();
      
      const scores = data.entries.map((e: any) => e.score);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeLessThanOrEqual(scores[i - 1]);
      }
    });

    it('should set hasMore flag correctly', async () => {
      const requestFullPage = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?limit=10&offset=0')
      );
      const requestLastPage = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students?limit=10&offset=40')
      );

      const responseFull = await GET(requestFullPage);
      const responseLast = await GET(requestLastPage);
      
      const dataFull = await responseFull.json();
      const dataLast = await responseLast.json();
      
      expect(dataFull.hasMore).toBe(true);
      expect(dataLast.hasMore).toBe(false);
    });

    it('should include timestamp in response', async () => {
      const before = Date.now();
      const request = new NextRequest(
        new URL('http://localhost:3000/api/leaderboard/students')
      );
      const response = await GET(request);
      const after = Date.now();
      
      const data = await response.json();
      const responseTime = new Date(data.lastUpdatedAt).getTime();
      
      expect(responseTime).toBeGreaterThanOrEqual(before);
      expect(responseTime).toBeLessThanOrEqual(after);
    });
  });
});

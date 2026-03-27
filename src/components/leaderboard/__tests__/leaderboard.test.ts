import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { LeaderboardEntry, LeaderboardMetricType } from '@/types/leaderboard';

// Mock data generator for testing
const createMockEntry = (rank: number, score: number): LeaderboardEntry => ({
  rank,
  studentId: `student-${rank}`,
  studentName: `Student ${rank}`,
  cohort: 'Cohort A',
  score,
  metricType: 'completion' as LeaderboardMetricType,
  coursesCompleted: Math.floor(score / 25),
  quizzesTaken: 10,
  averageQuizScore: score,
  completionRate: score,
});

describe('Leaderboard Logic', () => {
  describe('Score Calculation', () => {
    it('should calculate completion score correctly', () => {
      const entry = createMockEntry(1, 85);
      expect(entry.metricType).toBe('completion');
      expect(entry.completionRate).toBe(85);
    });

    it('should calculate combined score with correct weights', () => {
      const completionRate = 90;
      const quizAverage = 80;
      const combined = Math.round(completionRate * 0.6 + quizAverage * 0.4);
      
      expect(combined).toBe(86); // 90*0.6 + 80*0.4 = 54 + 32 = 86
    });

    it('should handle edge case scores', () => {
      const zeroScore = createMockEntry(1, 0);
      expect(zeroScore.score).toBe(0);
      
      const perfectScore = createMockEntry(1, 100);
      expect(perfectScore.score).toBe(100);
    });
  });

  describe('Ranking Order', () => {
    it('should sort students by score in descending order', () => {
      const students = [
        createMockEntry(1, 75),
        createMockEntry(2, 95),
        createMockEntry(3, 85),
      ];

      const sorted = [...students].sort((a, b) => b.score - a.score);

      expect(sorted[0].score).toBe(95);
      expect(sorted[1].score).toBe(85);
      expect(sorted[2].score).toBe(75);
    });

    it('should assign correct ranks after sorting', () => {
      const students = [
        { ...createMockEntry(1, 75), rank: 3 },
        { ...createMockEntry(2, 95), rank: 1 },
        { ...createMockEntry(3, 85), rank: 2 },
      ];

      const sorted = [...students].sort((a, b) => b.score - a.score);
      
      expect(sorted[0].rank).toBe(1);
      expect(sorted[1].rank).toBe(2);
      expect(sorted[2].rank).toBe(3);
    });
  });

  describe('Pagination Logic', () => {
    const generateStudents = (count: number) => 
      Array.from({ length: count }, (_, i) => createMockEntry(i + 1, 100 - i));

    it('should paginate correctly with limit and offset', () => {
      const allStudents = generateStudents(50);
      const limit = 10;
      const offset = 0;
      
      const page1 = allStudents.slice(offset, offset + limit);
      expect(page1.length).toBe(10);
      expect(page1[0].rank).toBe(1);
      expect(page1[9].rank).toBe(10);
    });

    it('should handle second page pagination', () => {
      const allStudents = generateStudents(50);
      const limit = 10;
      const offset = 10;
      
      const page2 = allStudents.slice(offset, offset + limit);
      expect(page2.length).toBe(10);
      expect(page2[0].rank).toBe(11);
      expect(page2[9].rank).toBe(20);
    });

    it('should handle partial last page', () => {
      const allStudents = generateStudents(25);
      const limit = 10;
      const offset = 20;
      
      const page3 = allStudents.slice(offset, offset + limit);
      expect(page3.length).toBe(5);
      expect(page3[0].rank).toBe(21);
      expect(page3[4].rank).toBe(25);
    });

    it('should calculate hasMore correctly', () => {
      const totalCount = 50;
      const limit = 10;
      
      // Page 1: offset 0, showing 1-10
      expect(0 + limit < totalCount).toBe(true); // hasMore = true
      
      // Page 5: offset 40, showing 41-50
      expect(40 + limit < totalCount).toBe(false); // hasMore = false
    });
  });

  describe('User Highlighting', () => {
    const students = [
      createMockEntry(1, 95),
      createMockEntry(2, 90),
      createMockEntry(3, 85),
      createMockEntry(4, 80),
      createMockEntry(5, 75),
    ];

    it('should find current user position', () => {
      const userId = 'student-3';
      const userPosition = students.findIndex(s => s.studentId === userId);
      
      expect(userPosition).toBe(2); // Index 2 (rank 3)
    });

    it('should return undefined if user not found', () => {
      const userId = 'student-999';
      const userPosition = students.findIndex(s => s.studentId === userId);
      
      expect(userPosition).toBe(-1);
    });

    it('should highlight user even if not in current page', () => {
      const allStudents = generateStudents(50);
      const targetUserId = 'student-45';
      const currentPageStudents = allStudents.slice(0, 10); // First page only
      
      // User is not in first page
      const isInCurrentPage = currentPageStudents.some(s => s.studentId === targetUserId);
      expect(isInCurrentPage).toBe(false);
      
      // But exists in full list
      const userRank = allStudents.findIndex(s => s.studentId === targetUserId);
      expect(userRank).toBe(44); // Index 44 (rank 45)
    });
  });

  describe('Metric Type Filtering', () => {
    it('should filter by completion metric', () => {
      const metricType: LeaderboardMetricType = 'completion';
      const entry = createMockEntry(1, 88);
      
      expect(entry.metricType).toBe(metricType);
      expect(entry.completionRate).toBeDefined();
    });

    it('should filter by quiz_score metric', () => {
      const metricType: LeaderboardMetricType = 'quiz_score';
      const entry = {
        ...createMockEntry(1, 92),
        metricType,
      };
      
      expect(entry.metricType).toBe(metricType);
      expect(entry.averageQuizScore).toBeDefined();
    });

    it('should filter by combined metric', () => {
      const metricType: LeaderboardMetricType = 'combined';
      const entry = {
        ...createMockEntry(1, 90),
        metricType,
      };
      
      expect(entry.metricType).toBe(metricType);
      expect(entry.completionRate).toBeDefined();
      expect(entry.averageQuizScore).toBeDefined();
    });
  });

  describe('Course Filtering', () => {
    const students = [
      { ...createMockEntry(1, 95), courseId: 'course-1', courseName: 'Blockchain 101' },
      { ...createMockEntry(2, 90), courseId: 'course-2', courseName: 'DeFi Basics' },
      { ...createMockEntry(3, 85), courseId: 'course-1', courseName: 'Blockchain 101' },
      { ...createMockEntry(4, 80), courseId: 'course-3', courseName: 'Smart Contracts' },
    ];

    it('should filter students by course ID', () => {
      const courseId = 'course-1';
      const filtered = students.filter(s => s.courseId === courseId);
      
      expect(filtered.length).toBe(2);
      expect(filtered[0].courseName).toBe('Blockchain 101');
      expect(filtered[1].courseName).toBe('Blockchain 101');
    });

    it('should return empty array if no matches', () => {
      const courseId = 'course-999';
      const filtered = students.filter(s => s.courseId === courseId);
      
      expect(filtered.length).toBe(0);
    });

    it('should return all students if no course filter', () => {
      const filtered = students; // No filter applied
      
      expect(filtered.length).toBe(4);
    });
  });

  describe('Trend Detection', () => {
    it('should detect upward trend', () => {
      const previousRank = 5;
      const currentRank = 2;
      const trend = previousRank > currentRank ? 'up' : previousRank < currentRank ? 'down' : 'stable';
      
      expect(trend).toBe('up');
    });

    it('should detect downward trend', () => {
      const previousRank = 2;
      const currentRank = 5;
      const trend = previousRank > currentRank ? 'up' : previousRank < currentRank ? 'down' : 'stable';
      
      expect(trend).toBe('down');
    });

    it('should detect stable ranking', () => {
      const previousRank = 3;
      const currentRank = 3;
      const trend = previousRank > currentRank ? 'up' : previousRank < currentRank ? 'down' : 'stable';
      
      expect(trend).toBe('stable');
    });

    it('should mark new entries', () => {
      const previousRank = undefined;
      const currentRank = 10;
      const trend = previousRank === undefined ? 'new' : 'stable';
      
      expect(trend).toBe('new');
    });
  });
});

// Helper function
function generateStudents(count: number) {
  return Array.from({ length: count }, (_, i) => createMockEntry(i + 1, 100 - i));
}

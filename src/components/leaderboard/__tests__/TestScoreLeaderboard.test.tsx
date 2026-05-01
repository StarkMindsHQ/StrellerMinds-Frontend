import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TestScoreLeaderboard } from '../TestScoreLeaderboard';
import type { TestScoreLeaderboardEntry } from '@/types/testScoreLeaderboard';

// Mock fetch globally
const mockFetch = vi.fn();
Object.defineProperty(global, 'fetch', {
  value: mockFetch,
  writable: true,
});

const mockEntry = (
  overrides: Partial<TestScoreLeaderboardEntry> = {},
): TestScoreLeaderboardEntry => ({
  rank: 1,
  userId: 'user-1',
  userName: 'John Doe',
  score: 95,
  attempts: 1,
  completedAt: new Date().toISOString(),
  testId: 'test-1',
  ...overrides,
});

const createMockResponse = (
  data: TestScoreLeaderboardEntry[],
  hasMore = false,
  totalCount = data.length,
  currentUserEntry?: TestScoreLeaderboardEntry,
) => ({
  data,
  nextCursor: hasMore ? 'cursor123' : null,
  hasMore,
  totalCount,
  currentUserEntry,
  filters: {},
  sortBy: 'score' as const,
  order: 'desc' as const,
});

describe('TestScoreLeaderboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<TestScoreLeaderboard />);

    // Wait for loading state - skeleton elements have animation classes
    await waitFor(() => {
      const skeletonElements = document.querySelectorAll('[class*="skeleton"]');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  it('should render leaderboard entries after successful fetch', async () => {
    const entries = [
      mockEntry({ rank: 1, userName: 'Alice', score: 100 }),
      mockEntry({ rank: 2, userName: 'Bob', score: 95 }),
      mockEntry({ rank: 3, userName: 'Charlie', score: 90 }),
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Score Leaderboard')).toBeInTheDocument();
  });

  it('should highlight current user when userId matches', async () => {
    const entries = [
      mockEntry({ rank: 1, userId: 'user-1', userName: 'Alice' }),
      mockEntry({ rank: 2, userId: 'user-2', userName: 'Bob' }),
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard currentUserId="user-2" />);

    await waitFor(() => {
      const youBadge = screen.getAllByText('You');
      expect(youBadge.length).toBe(1);
    });
  });

  it('should show empty state when no entries', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse([])),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(screen.getByText('No test scores found')).toBeInTheDocument();
    });
  });

  it('should display score as percentage', async () => {
    const entries = [mockEntry({ score: 87.5 })];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(screen.getByText('87.5%')).toBeInTheDocument();
    });
  });

  it('should pass courseId and testId to API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse([])),
    } as Response);

    render(<TestScoreLeaderboard courseId="course-123" testId="test-456" />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('courseId=course-123'),
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('testId=test-456'),
      );
    });
  });

  it('should display top 3 with special badges', async () => {
    const entries = [
      mockEntry({ rank: 1, userName: 'First', score: 100 }),
      mockEntry({ rank: 2, userName: 'Second', score: 95 }),
      mockEntry({ rank: 3, userName: 'Third', score: 90 }),
      mockEntry({ rank: 4, userName: 'Fourth', score: 85 }),
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(document.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('should show "Load More" button when hasMore is true', async () => {
    const entries = [mockEntry({ rank: 1 })];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries, true, 50)),
    } as Response);

    render(<TestScoreLeaderboard limit={10} />);

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });
  });

  it('should hide "Load More" button when no more data', async () => {
    const entries = [mockEntry({ rank: 1 })];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries, false)),
    } as Response);

    render(<TestScoreLeaderboard limit={10} />);

    await waitFor(() => {
      expect(screen.queryByText('Load More')).not.toBeInTheDocument();
    });
  });

  it('should show error state and retry button on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load leaderboard'),
      ).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('should call onEntryClick when a row is clicked', async () => {
    const entries = [mockEntry({ rank: 1, userId: 'user-1' })];
    const onEntryClick = vi.fn();

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard onEntryClick={onEntryClick} />);

    await waitFor(() => {
      const row = screen
        .getByText('John Doe')
        .closest('[class*="cursor-pointer"]') as HTMLElement;
      if (row) row.click();
    });

    expect(onEntryClick).toHaveBeenCalledWith(entries[0]);
  });

  it('should display sort options when showFilters is true', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse([])),
    } as Response);

    render(<TestScoreLeaderboard showFilters={true} />);

    await waitFor(() => {
      expect(screen.getByText('Score')).toBeInTheDocument();
      const select = document.querySelector('[role="combobox"]');
      expect(select).toBeInTheDocument();
    });
  });

  it('should show user rank position outside current page', async () => {
    const page1Entries = [mockEntry({ rank: 1, userId: 'user-1' })];
    const currentUserEntry = mockEntry({
      rank: 45,
      userId: 'user-45',
      userName: 'Current User',
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve(
          createMockResponse(page1Entries, false, 100, currentUserEntry),
        ),
    } as Response);

    render(<TestScoreLeaderboard currentUserId="user-45" limit={10} />);

    await waitFor(() => {
      expect(screen.getByText('Your Position')).toBeInTheDocument();
      expect(screen.getByText('Current User')).toBeInTheDocument();
    });
  });
});

describe('Ranking Logic', () => {
  it('should display ranks in descending score order', async () => {
    const entries = [
      mockEntry({ rank: 1, userName: 'High', score: 100 }),
      mockEntry({ rank: 2, userName: 'Mid', score: 50 }),
      mockEntry({ rank: 3, userName: 'Low', score: 20 }),
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      const rankBadges = document.querySelectorAll('[class*="rounded-full"]');
      expect(rankBadges[0].textContent).toContain('1');
    });
  });
});

describe('Time Formatting', () => {
  it('should format time spent correctly', async () => {
    const entries = [mockEntry({ timeSpent: 90 })];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(screen.getByText('1m')).toBeInTheDocument();
    });
  });

  it('should format hours correctly', async () => {
    const entries = [mockEntry({ timeSpent: 5400 })];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(createMockResponse(entries)),
    } as Response);

    render(<TestScoreLeaderboard />);

    await waitFor(() => {
      expect(screen.getByText('1h 30m')).toBeInTheDocument();
    });
  });
});

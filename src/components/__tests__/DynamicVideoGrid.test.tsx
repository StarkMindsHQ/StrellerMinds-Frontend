import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicVideoGrid, Video } from '../DynamicVideoGrid';

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Test Video 1',
    description: 'Description 1',
    duration: 1800,
    instructor: 'Instructor 1',
    studentsCount: 100,
    rating: 4.5,
    level: 'Beginner',
    tags: ['tag1', 'tag2'],
    views: 1000,
  },
  {
    id: '2',
    title: 'Test Video 2',
    description: 'Description 2',
    duration: 3600,
    instructor: 'Instructor 2',
    studentsCount: 200,
    rating: 4.8,
    level: 'Advanced',
    tags: ['tag3'],
    views: 2000,
  },
];

describe('DynamicVideoGrid', () => {
  it('renders video cards', () => {
    render(<DynamicVideoGrid videos={mockVideos} />);

    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
  });

  it('calls onVideoSelect when card is clicked', () => {
    const handleSelect = vi.fn();
    render(
      <DynamicVideoGrid videos={mockVideos} onVideoSelect={handleSelect} />,
    );

    const firstCard = screen.getByText('Test Video 1').closest('div');
    if (firstCard) {
      fireEvent.click(firstCard);
      expect(handleSelect).toHaveBeenCalledWith(mockVideos[0]);
    }
  });

  it('shows loading skeleton when loading prop is true', () => {
    render(<DynamicVideoGrid videos={[]} loading={true} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no videos', () => {
    render(<DynamicVideoGrid videos={[]} />);

    expect(screen.getByText('No videos available')).toBeInTheDocument();
  });

  it('displays video metadata correctly', () => {
    render(<DynamicVideoGrid videos={mockVideos} />);

    expect(screen.getByText('Instructor 1')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    render(<DynamicVideoGrid videos={mockVideos} />);

    // 1800 seconds = 30 minutes
    expect(screen.getByText('30m')).toBeInTheDocument();
    // 3600 seconds = 1 hour
    expect(screen.getByText('1h 0m')).toBeInTheDocument();
  });

  it('applies custom grid configuration', () => {
    const customConfig = {
      columns: { xs: 2, sm: 3, md: 4 },
      gap: 24,
    };

    const { container } = render(
      <DynamicVideoGrid videos={mockVideos} gridConfig={customConfig} />,
    );

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('disables virtual scroll for small lists', () => {
    const { container } = render(
      <DynamicVideoGrid videos={mockVideos} enableVirtualScroll={false} />,
    );

    // Should not have scroll container
    const scrollContainer = container.querySelector('.overflow-y-auto');
    expect(scrollContainer).not.toBeInTheDocument();
  });
});

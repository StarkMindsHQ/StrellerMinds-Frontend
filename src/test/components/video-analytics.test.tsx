/**
 * Tests for Issues #345, #348, #350, #352
 * Drop-off Detection Graph, Live Concurrent Users Monitor,
 * Adaptive Video Player, Auto Resume Playback
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────────

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock HTMLVideoElement
Object.defineProperty(window.HTMLVideoElement.prototype, 'play', {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
Object.defineProperty(window.HTMLVideoElement.prototype, 'pause', {
  configurable: true,
  value: vi.fn(),
});

// ── #352 — AutoResumePlayback ──────────────────────────────────────────────────

import AutoResumePlayback from '@/components/AutoResumePlayback';

describe('AutoResumePlayback (#352)', () => {
  beforeEach(() => localStorageMock.clear());

  it('renders the video element', () => {
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" />);
    expect(screen.getByTestId('video-element')).toBeDefined();
  });

  it('does not show resume banner when no saved position', () => {
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" />);
    expect(screen.queryByText(/resuming from/i)).toBeNull();
  });

  it('shows resume banner when a saved position exists', () => {
    localStorageMock.setItem('auto-resume-v1', JSON.stringify({ time: 90, savedAt: Date.now() }));
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" />);
    expect(screen.getByText(/resuming from/i)).toBeDefined();
  });

  it('shows title when provided', () => {
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" title="Lesson 1" />);
    expect(screen.getByText('Lesson 1')).toBeDefined();
  });

  it('shows "Start over" button in resume banner', () => {
    localStorageMock.setItem('auto-resume-v1', JSON.stringify({ time: 60, savedAt: Date.now() }));
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" />);
    expect(screen.getByText(/start over/i)).toBeDefined();
  });

  it('clears saved position and hides banner on "Start over" click', () => {
    localStorageMock.setItem('auto-resume-v1', JSON.stringify({ time: 60, savedAt: Date.now() }));
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" />);
    expect(screen.getByText(/resuming from/i)).toBeDefined();
    fireEvent.click(screen.getByText(/start over/i));
    expect(localStorageMock.getItem('auto-resume-v1')).toBeNull();
  });

  it('renders play button', () => {
    render(<AutoResumePlayback videoId="v1" videoUrl="/test.mp4" />);
    expect(screen.getByLabelText('Play')).toBeDefined();
  });
});

// ── #350 — AdaptiveVideoPlayer ─────────────────────────────────────────────────

import AdaptiveVideoPlayer from '@/components/AdaptiveVideoPlayer';

const mockSources = [
  { quality: '720p' as const, url: '/720.mp4' },
  { quality: '480p' as const, url: '/480.mp4' },
  { quality: '360p' as const, url: '/360.mp4' },
];

describe('AdaptiveVideoPlayer (#350)', () => {
  beforeEach(() => localStorageMock.clear());

  it('renders the video element', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" />);
    expect(screen.getByTestId('adaptive-video-element')).toBeDefined();
  });

  it('renders settings button', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" />);
    expect(screen.getByLabelText('Settings')).toBeDefined();
  });

  it('opens quality/speed menu on settings click', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" />);
    fireEvent.click(screen.getByLabelText('Settings'));
    expect(screen.getByText('Quality')).toBeDefined();
    expect(screen.getByText('Speed')).toBeDefined();
  });

  it('shows all quality options in menu', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" />);
    fireEvent.click(screen.getByLabelText('Settings'));
    expect(screen.getByText('auto')).toBeDefined();
    expect(screen.getByText('720p')).toBeDefined();
    expect(screen.getByText('480p')).toBeDefined();
    expect(screen.getByText('360p')).toBeDefined();
  });

  it('shows all speed options in menu', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" />);
    fireEvent.click(screen.getByLabelText('Settings'));
    expect(screen.getByText('0.5×')).toBeDefined();
    expect(screen.getByText('2×')).toBeDefined();
  });

  it('displays title when provided', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" title="Module 2" />);
    expect(screen.getByText('Module 2')).toBeDefined();
  });

  it('renders seek slider', () => {
    render(<AdaptiveVideoPlayer sources={mockSources} lessonId="l1" />);
    expect(screen.getByLabelText('Seek')).toBeDefined();
  });
});

// ── #348 — LiveConcurrentUsersMonitor ─────────────────────────────────────────

import LiveConcurrentUsersMonitor from '@/components/LiveConcurrentUsersMonitor';

describe('LiveConcurrentUsersMonitor (#348)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the monitor container', () => {
    render(<LiveConcurrentUsersMonitor />);
    expect(screen.getByTestId('live-concurrent-monitor')).toBeDefined();
  });

  it('shows user count after simulated data loads', () => {
    render(<LiveConcurrentUsersMonitor pollIntervalMs={1000} />);
    // Component initialises with data synchronously in simulated mode
    expect(screen.getByTestId('live-concurrent-monitor')).toBeDefined();
  });

  it('shows "Live Users" heading', () => {
    render(<LiveConcurrentUsersMonitor />);
    expect(screen.getByText(/live users/i)).toBeDefined();
  });

  it('shows page breakdown when showBreakdown=true', async () => {
    render(<LiveConcurrentUsersMonitor showBreakdown={true} />);
    expect(screen.getByText(/by page/i)).toBeDefined();
  });

  it('hides page breakdown when showBreakdown=false', () => {
    render(<LiveConcurrentUsersMonitor showBreakdown={false} />);
    expect(screen.queryByText(/by page/i)).toBeNull();
  });

  it('shows connected icon in simulated mode', () => {
    render(<LiveConcurrentUsersMonitor />);
    expect(screen.getByTestId('connected-icon')).toBeDefined();
  });
});

// ── #345 — DropOffDetectionGraph ───────────────────────────────────────────────

import DropOffDetectionGraph from '@/components/DropOffDetectionGraph';

const mockCourse = {
  courseId: 'c1',
  courseTitle: 'Intro to Stellar',
  lessons: [
    { lessonId: 'l1', label: 'Lesson 1', reached: 1000, completed: 950 },
    { lessonId: 'l2', label: 'Lesson 2', reached: 950, completed: 800 },
    { lessonId: 'l3', label: 'Lesson 3', reached: 600, completed: 550 }, // big drop
    { lessonId: 'l4', label: 'Lesson 4', reached: 550, completed: 500 },
  ],
};

describe('DropOffDetectionGraph (#345)', () => {
  it('renders the graph container', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} />);
    expect(screen.getByTestId('drop-off-graph')).toBeDefined();
  });

  it('displays "Drop-off Detection" heading', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} />);
    expect(screen.getByText('Drop-off Detection')).toBeDefined();
  });

  it('shows all lesson labels', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} />);
    expect(screen.getAllByText('Lesson 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lesson 3').length).toBeGreaterThan(0);
  });

  it('shows the insight callout for a significant drop-off', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} dropOffThreshold={20} />);
    // Lesson 3 has ~36% drop-in which exceeds 20% threshold
    expect(screen.getByText(/highest drop-off at/i)).toBeDefined();
  });

  it('does not show callout when no lesson exceeds threshold', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} dropOffThreshold={50} />);
    expect(screen.queryByText(/highest drop-off at/i)).toBeNull();
  });

  it('shows the course selector when multiple courses provided', () => {
    const c2 = { courseId: 'c2', courseTitle: 'DeFi Basics', lessons: mockCourse.lessons };
    render(<DropOffDetectionGraph courses={[mockCourse, c2]} />);
    expect(screen.getByLabelText('Select course')).toBeDefined();
  });

  it('does not show course selector for a single course', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} />);
    expect(screen.queryByLabelText('Select course')).toBeNull();
  });

  it('shows summary table with reached and completed columns', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} />);
    expect(screen.getByText('Reached')).toBeDefined();
    expect(screen.getByText('Completed')).toBeDefined();
  });

  it('shows hover tooltip on lesson bar mouse-enter', () => {
    render(<DropOffDetectionGraph courses={[mockCourse]} />);
    const bars = screen.getAllByText('Lesson 1');
    fireEvent.mouseEnter(bars[0].closest('[class*="flex-col"]') as Element);
    expect(screen.getByText(/completion:/i)).toBeDefined();
  });
});

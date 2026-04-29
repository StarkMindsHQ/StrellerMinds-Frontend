import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VideoPlayerSync, { SubtitleTrack } from '../VideoPlayerSync';

// Mock the hooks
jest.mock('@/hooks/useSilenceDetector', () => ({
  useSilenceDetector: () => ({
    isDetecting: false,
    isSilent: false,
    totalSkippedTime: 0,
    toggleDetection: jest.fn(),
    currentLevel: 0,
  }),
}));

const mockSubtitleTracks: SubtitleTrack[] = [
  {
    src: '/videos/subtitles/demo-en.vtt',
    srclang: 'en',
    label: 'English',
    kind: 'subtitles',
  },
  {
    src: '/videos/subtitles/demo-es.vtt',
    srclang: 'es',
    label: 'Español',
    kind: 'subtitles',
  },
];

describe('VideoPlayerSync Subtitle Support', () => {
  const defaultProps = {
    videoId: 'test-video',
    src: '/videos/demo-video.mp4',
    subtitleTracks: mockSubtitleTracks,
  };

  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders subtitle controls when subtitle tracks are provided', () => {
    render(<VideoPlayerSync {...defaultProps} />);
    
    expect(screen.getByTitle('Enable Subtitles')).toBeInTheDocument();
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  it('does not render subtitle controls when no subtitle tracks are provided', () => {
    render(<VideoPlayerSync {...defaultProps} subtitleTracks={[]} />);
    
    expect(screen.queryByTitle('Enable Subtitles')).not.toBeInTheDocument();
  });

  it('includes subtitle track elements in the video', () => {
    render(<VideoPlayerSync {...defaultProps} />);
    
    const video = screen.getByRole('video');
    const tracks = video.querySelectorAll('track');
    
    expect(tracks).toHaveLength(2);
    expect(tracks[0]).toHaveAttribute('srclang', 'en');
    expect(tracks[0]).toHaveAttribute('label', 'English');
    expect(tracks[1]).toHaveAttribute('srclang', 'es');
    expect(tracks[1]).toHaveAttribute('label', 'Español');
  });

  it('toggles subtitle state when subtitle button is clicked', () => {
    render(<VideoPlayerSync {...defaultProps} />);
    
    const subtitleButton = screen.getByTitle('Enable Subtitles');
    fireEvent.click(subtitleButton);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'starkminds-video-subtitles-enabled-test-video',
      'true'
    );
  });

  it('changes selected language when language selector is used', () => {
    render(<VideoPlayerSync {...defaultProps} />);
    
    const languageSelect = screen.getByText('Off');
    fireEvent.click(languageSelect);
    
    const englishOption = screen.getByText('English');
    fireEvent.click(englishOption);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'starkminds-video-subtitles-language-test-video',
      'en'
    );
  });
});
import { renderHook, act } from '@testing-library/react';
import { useSilenceDetector } from '../useSilenceDetector';

// Mock Web Audio API
class MockAnalyserNode {
  frequencyBinCount = 1024;
  fftSize = 2048;
  smoothingTimeConstant = 0.8;
  
  getByteFrequencyData = vi.fn().mockImplementation((array) => {
    // Fill with mock data
    for (let i = 0; i < array.length; i++) {
      array[i] = 0;
    }
  });
  
  disconnect = vi.fn();
}

class MockAudioContext {
  state = 'running';
  createAnalyser = vi.fn(() => new MockAnalyserNode());
  createMediaElementSource = vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
  });
  destination = {};
  close = vi.fn();
}

// Mock window.AudioContext
beforeAll(() => {
  (window as any).AudioContext = MockAudioContext;
  (window as any).webkitAudioContext = MockAudioContext;
});

describe('useSilenceDetector', () => {
  let mockVideo: HTMLVideoElement;

  beforeEach(() => {
    mockVideo = {
      currentTime: 0,
      duration: 100,
    } as any as HTMLVideoElement;
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should initialize with detection enabled', () => {
    const { result } = renderHook(() =>
      useSilenceDetector(mockVideo, { enabled: true })
    );

    expect(result.current.isDetecting).toBe(true);
    expect(result.current.isSilent).toBe(false);
    expect(result.current.totalSkippedTime).toBe(0);
  });

  it('should initialize with detection disabled', () => {
    const { result } = renderHook(() =>
      useSilenceDetector(mockVideo, { enabled: false })
    );

    expect(result.current.isDetecting).toBe(false);
  });

  it('should toggle detection', () => {
    const { result } = renderHook(() =>
      useSilenceDetector(mockVideo, { enabled: true })
    );

    expect(result.current.isDetecting).toBe(true);

    act(() => {
      result.current.toggleDetection();
    });

    expect(result.current.isDetecting).toBe(false);

    act(() => {
      result.current.toggleDetection();
    });

    expect(result.current.isDetecting).toBe(true);
  });

  it('should have default configuration', () => {
    const { result } = renderHook(() =>
      useSilenceDetector(mockVideo)
    );

    expect(result.current.isDetecting).toBe(true);
  });

  it('should return all required properties', () => {
    const { result } = renderHook(() =>
      useSilenceDetector(mockVideo, { enabled: true })
    );

    expect(result.current).toHaveProperty('isDetecting');
    expect(result.current).toHaveProperty('isSilent');
    expect(result.current).toHaveProperty('totalSkippedTime');
    expect(result.current).toHaveProperty('toggleDetection');
    expect(result.current).toHaveProperty('currentLevel');
    
    expect(typeof result.current.isDetecting).toBe('boolean');
    expect(typeof result.current.isSilent).toBe('boolean');
    expect(typeof result.current.totalSkippedTime).toBe('number');
    expect(typeof result.current.toggleDetection).toBe('function');
    expect(typeof result.current.currentLevel).toBe('number');
  });
});

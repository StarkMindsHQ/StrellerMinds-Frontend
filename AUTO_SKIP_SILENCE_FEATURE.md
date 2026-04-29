# Auto-Skip Silence Feature

## Overview

The Auto-Skip Silence feature automatically detects and skips silent parts of videos, saving users time during playback. It uses the Web Audio API to analyze audio levels in real-time and skips segments that fall below a configurable silence threshold.

<!-- ## Features
## Overview

The Auto-Skip Silence feature automatically detects and skips silent parts of videos, saving users time during playback. It uses the Web Audio API to analyze audio levels in real-time and skips segments that fall below a configurable silence threshold. -->

## Features

✅ **Silence Detection** - Real-time audio analysis using Web Audio API  
✅ **Automatic Skipping** - Seamlessly skips silent portions  
✅ **Toggle Control** - Easy on/off switch in video controls  
✅ **Time Saved Display** - Shows total time saved by skipping  
✅ **Visual Feedback** - Status indicator when skipping occurs  
✅ **Configurable** - Adjustable threshold and minimum duration  

## Components

### 1. `useSilenceDetector` Hook

Located at: `src/hooks/useSilenceDetector.ts`

A React hook that provides silence detection functionality for video elements.

#### Usage

```typescript
import { useSilenceDetector } from '@/hooks/useSilenceDetector';

function MyVideoComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    isDetecting,      // Whether detection is active
    isSilent,         // Whether currently in silence
    totalSkippedTime, // Total seconds skipped
    toggleDetection,  // Toggle on/off
    currentLevel,     // Current audio level (0-255)
  } = useSilenceDetector(videoRef.current, {
    enabled: true,              // Enable detection
    threshold: 20,              // Silence threshold (0-255)
    minSilenceDuration: 1.5,    // Min silence duration to skip (seconds)
    onSilenceSkip: (start, end) => {
      console.log(`Skipped from ${start}s to ${end}s`);
    },
  });

  return <video ref={videoRef} src="video.mp4" />;
}
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Whether silence detection is enabled |
| `threshold` | number | `20` | Audio level threshold (0-255). Lower = more sensitive |
| `minSilenceDuration` | number | `1.5` | Minimum silence duration in seconds before skipping |
| `onSilenceSkip` | function | - | Callback when silence is skipped `(start, end) => void` |

### 2. `AutoSkipSilenceControls` Component

Located at: `src/components/learning/AutoSkipSilenceControls.tsx`

UI component that provides controls and displays status for the silence detection feature.

#### Usage

```typescript
import AutoSkipSilenceControls from '@/components/learning/AutoSkipSilenceControls';

<AutoSkipSilenceControls
  isEnabled={true}
  isDetecting={isDetecting}
  isSilent={isSilent}
  totalSkippedTime={totalSkippedTime}
  onToggle={toggleDetection}
  audioLevel={currentLevel}
/>
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `isEnabled` | boolean | Whether the feature is enabled |
| `isDetecting` | boolean | Whether detection is currently active |
| `isSilent` | boolean | Whether currently in a silent period |
| `totalSkippedTime` | number | Total time skipped in seconds |
| `onToggle` | function | Toggle detection on/off |
| `audioLevel` | number | Current audio level (0-255) |
| `className` | string | Additional CSS classes |

## Integration

The feature is already integrated into three video player components:

### 1. AdaptiveVideoPlayer

```typescript
import AdaptiveVideoPlayer from '@/components/AdaptiveVideoPlayer';

<AdaptiveVideoPlayer
  sources={[{ quality: '720p', url: '/video.mp4' }]}
  lessonId="lesson-1"
  enableSilenceSkip={true}
  silenceThreshold={20}
  minSilenceDuration={1.5}
  onSilenceSkip={(start, end) => console.log('Skipped:', start, end)}
/>
```

### 2. VideoPlayerSync

```typescript
import VideoPlayerSync from '@/components/VideoPlayerSync';

<VideoPlayerSync
  videoId="video-1"
  src="/video.mp4"
  enableSilenceSkip={true}
  silenceThreshold={20}
  minSilenceDuration={1.5}
/>
```

### 3. VideoPlayer

```typescript
import VideoPlayer from '@/components/VideoPlayer';

<VideoPlayer
  videoId="video-1"
  videoUrl="/video.mp4"
  title="My Video"
  enableSilenceSkip={true}
  silenceThreshold={20}
  minSilenceDuration={1.5}
/>
```

## How It Works

1. **Audio Analysis**: Uses Web Audio API's `AnalyserNode` to extract frequency data from video audio
2. **Volume Calculation**: Computes average audio level from frequency data (0-255 scale)
3. **Silence Detection**: When audio level drops below threshold, starts timing
4. **Skip Trigger**: If silence duration exceeds minimum, skips forward automatically
5. **User Feedback**: Shows visual indicators and time saved

## Performance Considerations

- Uses `requestAnimationFrame` for efficient audio analysis
- Automatically cleans up audio context on unmount
- Only analyzes when detection is enabled
- Minimal performance impact on video playback

## Browser Compatibility

Works in all modern browsers that support:
- Web Audio API
- `MediaElementAudioSourceNode`
- `AnalyserNode`

Fallback: Feature gracefully disables if Web Audio API is not available.

## Configuration Tips

### For Lectures/Talks
```typescript
{
  threshold: 25,           // Slightly higher to catch more silence
  minSilenceDuration: 1.0  // Skip shorter pauses
}
```

### For Music/Performances
```typescript
{
  threshold: 15,           // Lower to avoid skipping quiet parts
  minSilenceDuration: 3.0  // Only skip long silences
}
```

### For Tutorials
```typescript
{
  threshold: 20,           // Default works well
  minSilenceDuration: 1.5  // Balanced approach
}
```

## Testing

To test the feature:

1. Use a video with noticeable silent portions
2. Enable silence skip in the video player controls
3. Watch for the "Skipping..." indicator
4. Check the "Time Saved" counter increases

## Future Enhancements

- [ ] User-adjustable sensitivity slider
- [ ] Visual waveform showing detected silence regions
- [ ] Skip preview before jumping
- [ ] Different detection algorithms for content types
- [ ] Persistence of user preferences
- [ ] Analytics on time saved across platform

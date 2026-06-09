# Subtitle Support Implementation

This document describes the subtitle support implementation for the StarkMinds video players.

## Features

- ✅ Toggle subtitles ON/OFF
- ✅ Support multiple languages
- ✅ Subtitles sync correctly with video
- ✅ Language switching works seamlessly
- ✅ Persistent user preferences
- ✅ Customizable subtitle appearance

## Components

### VideoPlayerSync
Enhanced video player component with subtitle support.

**Props:**
- `subtitleTracks`: Array of `SubtitleTrack` objects
- All standard HTML video props

**SubtitleTrack Interface:**
```typescript
interface SubtitleTrack {
  src: string;        // Path to .vtt file
  srclang: string;    // Language code (e.g., 'en', 'es')
  label: string;      // Display label (e.g., 'English', 'Español')
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  default?: boolean;  // Whether this track is default
}
```

### LessonVideoPlayer
Updated lesson video player with subtitle support.

**Props:**
- `subtitleTracks`: Array of `SubtitleTrack` objects
- All existing lesson player props

### SubtitleCustomizationPanel
Existing component for customizing subtitle appearance:
- Font size, color, family
- Background color and opacity
- Persistent settings per video

## Usage

### Basic Usage
```tsx
import VideoPlayerSync, { SubtitleTrack } from '@/components/VideoPlayerSync';

const subtitleTracks: SubtitleTrack[] = [
  {
    src: '/videos/subtitles/video-en.vtt',
    srclang: 'en',
    label: 'English',
    kind: 'subtitles',
  },
  {
    src: '/videos/subtitles/video-es.vtt',
    srclang: 'es',
    label: 'Español',
    kind: 'subtitles',
  },
];

<VideoPlayerSync
  videoId="my-video"
  src="/videos/my-video.mp4"
  subtitleTracks={subtitleTracks}
/>
```

### Lesson Video Player
```tsx
import { LessonVideoPlayer } from '@/components/lesson-video-player/LessonVideoPlayer';

<LessonVideoPlayer
  src="/videos/lesson.mp4"
  lessonId="lesson-1"
  subtitleTracks={subtitleTracks}
/>
```

## File Structure

```
public/videos/subtitles/
├── demo-en.vtt      # English subtitles
├── demo-es.vtt      # Spanish subtitles
└── ...

src/components/
├── VideoPlayerSync.tsx
├── lesson-video-player/
│   ├── LessonVideoPlayer.tsx
│   └── SubtitleCustomizationPanel.tsx
└── __tests__/
    └── VideoPlayerSync.test.tsx
```

## Demo

Visit `/subtitle-demo` to see the subtitle functionality in action.

## Technical Details

### Subtitle Synchronization
- Uses HTML5 `<track>` elements
- Automatic synchronization with video timeline
- WebVTT format support

### State Management
- Subtitle enabled/disabled state
- Selected language
- Preferences stored in localStorage
- Per-video preference persistence

### UI Controls
- Toggle button with visual feedback
- Language dropdown selector
- Settings panel for customization
- Overlay controls that appear on hover

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Customizable text styling for better readability

## Browser Support

- Modern browsers with HTML5 video support
- WebVTT subtitle format
- CSS ::cue pseudo-element for styling

## Future Enhancements

- Auto-detection of user language preferences
- Subtitle search and navigation
- Offline subtitle caching
- AI-powered subtitle generation
- Multi-track synchronization
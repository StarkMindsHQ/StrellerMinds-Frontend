# Auto-Skip Silence Feature - Quick Start Guide

## 🎯 What It Does

Automatically detects and skips silent portions of videos to save time during playback.

<!-- 
The Auto-Skip Silence feature automatically detects and skips silent parts of videos, saving users time during playback. It uses the Web Audio API to analyze audio levels in real-time and skips segments that fall below a configurable silence threshold. -->---

## 🚀 Quick Start (3 Steps)

### Step 1: Add Props to Your Video Player

```tsx
import AdaptiveVideoPlayer from '@/components/AdaptiveVideoPlayer';

<AdaptiveVideoPlayer
  sources={[{ quality: '720p', url: '/video.mp4' }]}
  lessonId="lesson-1"
  enableSilenceSkip={true}  // ← Add this
/>
```

### Step 2: Configure (Optional)

```tsx
<AdaptiveVideoPlayer
  sources={[{ quality: '720p', url: '/video.mp4' }]}
  lessonId="lesson-1"
  enableSilenceSkip={true}
  silenceThreshold={20}        // Adjust sensitivity (5-50)
  minSilenceDuration={1.5}     // Min silence to skip (seconds)
  onSilenceSkip={(start, end) => console.log('Skipped:', start, end)}
/>
```

### Step 3: Use the Feature

- Play your video
- Click the **"Skip Silence"** button in controls to toggle on/off
- Watch silent portions get automatically skipped!

---

## 📦 What's Included

✅ **Hook:** `useSilenceDetector` - Core silence detection logic  
✅ **UI Component:** `AutoSkipSilenceControls` - Toggle button & status display  
✅ **Integration:** Added to all 3 video players (AdaptiveVideoPlayer, VideoPlayer, VideoPlayerSync)  
✅ **Demo Page:** `/auto-skip-silence-demo` - Test and configure  
✅ **Tests:** Unit tests for hook and UI component  
✅ **Docs:** Complete documentation in `AUTO_SKIP_SILENCE_FEATURE.md`

---

## 🎛️ Configuration

### Basic Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `enableSilenceSkip` | `false` | Turn feature on/off |
| `silenceThreshold` | `20` | Audio level threshold (0-255) |
| `minSilenceDuration` | `1.5` | Minimum silence duration (seconds) |

### Recommended Presets

**For Lectures:**
```tsx
silenceThreshold={25}
minSilenceDuration={1.0}
```

**For Tutorials:**
```tsx
silenceThreshold={20}
minSilenceDuration={1.5}
```

**For Music/Performances:**
```tsx
silenceThreshold={15}
minSilenceDuration={3.0}
```

---

## 🎨 UI Features

### Toggle Button
- **Blue** = Active (skipping enabled)
- **Gray** = Inactive (skipping disabled)
- Icon changes: Volume2 (on) / VolumeX (off)

### Status Indicators
- **"Skipping..."** - Appears when silence is being skipped
- **"Saved: X:XX"** - Shows total time saved

---

## 🧪 Testing

### Try the Demo
```bash
npm run dev
# Visit: http://localhost:3000/auto-skip-silence-demo
```

### Run Tests
```bash
npm test -- useSilenceDetector
npm test -- AutoSkipSilenceControls
```

---

## 📖 Examples

### Example 1: Basic Usage
```tsx
<VideoPlayer
  videoId="video-1"
  videoUrl="/lecture.mp4"
  title="Introduction to Blockchain"
  enableSilenceSkip={true}
/>
```

### Example 2: With Custom Settings
```tsx
<VideoPlayerSync
  videoId="video-2"
  src="/tutorial.mp4"
  enableSilenceSkip={true}
  silenceThreshold={25}
  minSilenceDuration={1.0}
/>
```

### Example 3: With Callback
```tsx
<AdaptiveVideoPlayer
  sources={[{ quality: '720p', url: '/course.mp4' }]}
  lessonId="lesson-5"
  enableSilenceSkip={true}
  onSilenceSkip={(start, end) => {
    analytics.track('silence_skip', { start, end });
  }}
/>
```

---

## 🔧 How It Works

1. **Analyzes** video audio in real-time using Web Audio API
2. **Detects** when audio level drops below threshold
3. **Waits** for minimum duration to confirm it's silence
4. **Skips** forward automatically
5. **Tracks** total time saved

---

## ✅ Acceptance Criteria

- ✅ **Detect silence** - Real-time audio analysis
- ✅ **Skip automatically** - Seamless forward seeking
- ✅ **Toggle feature** - Easy on/off control

---

## 🐛 Troubleshooting

**Feature not working?**
- Check that `enableSilenceSkip={true}` is set
- Ensure video has audio track
- Try adjusting `silenceThreshold` lower (more sensitive)

**Skipping too much?**
- Increase `silenceThreshold` (less sensitive)
- Increase `minSilenceDuration` (skip only longer silences)

**Not skipping enough?**
- Decrease `silenceThreshold` (more sensitive)
- Decrease `minSilenceDuration` (skip shorter silences)

---

## 📚 More Info

- **Full Documentation:** `AUTO_SKIP_SILENCE_FEATURE.md`
- **Implementation Details:** `AUTO_SKIP_SILENCE_IMPLEMENTATION.md`
- **Source Code:** `src/hooks/useSilenceDetector.ts`
- **Demo:** `/auto-skip-silence-demo`

---

## 🎉 That's It!

You're ready to save time by automatically skipping silence in your videos!

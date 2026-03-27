# RealTimeRecommendations Component

A dynamic video recommendations component for the StrellerMinds platform that provides real-time, animated recommendations with minimal layout shifts.

## Features

- **Dynamic Fetching**: Fetches recommendations via API or WebSocket
- **Smooth Animations**: CLS-friendly animated insertion/removal using Framer Motion
- **Real-Time Updates**: WebSocket support for live recommendation updates
- **Responsive Design**: Mobile-first with touch interactions
- **Relevance Scoring**: Optional display of AI-powered recommendation rankings
- **Live Content**: Support for live video indicators
- **Accessibility**: Semantic HTML with proper ARIA labels

## Props Interface

```typescript
interface RealTimeRecommendationsProps {
  currentVideoId: string; // ID of currently playing video
  onVideoSelect: (videoId: string) => void; // Callback for video selection
  maxRecommendations?: number; // Max recommendations to show (default: 3)
  refreshInterval?: number; // Auto-refresh interval in ms (default: 30000)
  className?: string; // Additional CSS classes
  showRelevanceScore?: boolean; // Show relevance scores (default: false)
  enableWebSocket?: boolean; // Enable WebSocket updates (default: false)
}
```

## Usage

### Basic Usage

```tsx
import RealTimeRecommendations from '@/components/RealTimeRecommendations';

function VideoPage({ videoId }: { videoId: string }) {
  const handleVideoSelect = (selectedVideoId: string) => {
    // Navigate to new video or update player
    router.push(`/videos/${selectedVideoId}`);
  };

  return (
    <RealTimeRecommendations
      currentVideoId={videoId}
      onVideoSelect={handleVideoSelect}
    />
  );
}
```

### Advanced Usage with WebSocket

```tsx
<RealTimeRecommendations
  currentVideoId={currentVideoId}
  onVideoSelect={handleVideoSelect}
  maxRecommendations={5}
  refreshInterval={15000}
  showRelevanceScore={true}
  enableWebSocket={true}
  className="mt-8"
/>
```

## Component Structure

### Main Component

- `RealTimeRecommendations`: Main container with state management
- Handles API/WebSocket connections
- Manages loading states and error handling
- Coordinates animations and updates

### Sub-Components

- `RecommendationCard`: Individual recommendation card with hover effects
- `RecommendationService`: Service class for API/WebSocket communication

## Animation Features

### CLS-Friendly Design

- Fixed aspect ratios prevent layout shifts
- Skeleton loaders maintain space during loading
- Smooth transitions with proper exit animations

### Animation Variants

- **Staggered Entry**: Cards appear with sequential delays
- **Hover Effects**: Scale and overlay animations on interaction
- **Exit Animations**: Smooth removal when recommendations change

## API Integration

### Mock Service

The component includes a mock `RecommendationService` that simulates API calls:

```typescript
// Mock recommendation data structure
interface VideoRecommendation {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnailUrl?: string;
  instructor: string;
  studentsCount: number;
  rating: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  views: number;
  relevanceScore?: number;
  isLive?: boolean;
}
```

### WebSocket Integration

When `enableWebSocket` is true, the component connects to a WebSocket endpoint:

```typescript
// Expected WebSocket message format
{
  type: 'recommendations_update';
  recommendations: VideoRecommendation[];
}
```

## Styling

### Design System Integration

- Uses Tailwind CSS for styling
- Integrates with existing design tokens
- Supports dark/light themes
- Responsive breakpoints for mobile/tablet/desktop

### Customization

The component accepts a `className` prop for additional styling:

```tsx
<RealTimeRecommendations
  // ...props
  className="border-l-4 border-blue-500 pl-4"
/>
```

## Performance Considerations

### Optimization Features

- **Debounced Updates**: Prevents excessive re-renders
- **Memoized Callbacks**: Reduces unnecessary function recreations
- **Lazy Loading**: Images load on demand
- **Efficient Animations**: GPU-accelerated transforms

### Bundle Size

- Tree-shakable imports from Framer Motion
- Minimal external dependencies
- Optimized SVG icons from Lucide React

## Error Handling

### Graceful Degradation

- Shows retry buttons on API failures
- Maintains UI state during errors
- Automatic WebSocket reconnection
- Fallback to polling if WebSocket fails

## Accessibility

### Features

- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Touch-friendly interactions

## Testing

### Example Component

Use the `RealTimeRecommendationsExample` component to test and demonstrate features:

```tsx
import RealTimeRecommendationsExample from '@/components/RealTimeRecommendationsExample';

// In your page or storybook
<RealTimeRecommendationsExample />;
```

## Future Enhancements

### Planned Features

- [ ] Infinite scroll pagination
- [ ] Category filtering
- [ ] User preference learning
- [ ] A/B testing integration
- [ ] Analytics tracking
- [ ] Social proof indicators

### API Improvements

- [ ] GraphQL support
- [ ] Caching strategies
- [ ] Offline support
- [ ] Predictive preloading

## Dependencies

### Required

- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

### Optional

- Socket.io-client (for WebSocket support)

## Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Progressive enhancement for older browsers

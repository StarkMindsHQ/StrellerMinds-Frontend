# Top Students Leaderboard - Implementation Guide

## 🎯 Overview

The **Top Students Leaderboard** feature displays top-performing students based on course completion rates, quiz scores, or combined metrics. It includes pagination, user highlighting, and responsive design.

## ✨ Features

### Core Functionality
- ✅ **Dynamic Data Fetching** - API endpoint with filtering and sorting
- ✅ **Multiple Metrics** - Course completion, quiz scores, or combined scoring
- ✅ **User Avatar & Name** - Beautiful display with fallback initials
- ✅ **Score Display** - Clear percentage-based scoring
- ✅ **Pagination Support** - Navigate through large datasets
- ✅ **User Highlighting** - Highlights logged-in user's position
- ✅ **Responsive Design** - Mobile-friendly and adaptive layouts
- ✅ **Real-time Updates** - Optional auto-refresh capability
- ✅ **Trend Indicators** - Shows ranking changes (up/down/stable/new)

## 📁 File Structure

```
src/
├── types/
│   └── leaderboard.ts                    # TypeScript type definitions
├── app/
│   ├── api/
│   │   └── leaderboard/
│   │       └── students/
│   │           ├── route.ts              # API endpoint
│   │           └── __tests__/
│   │               └── route.test.ts     # API tests
│   └── leaderboard-demo/
│       └── page.tsx                      # Demo page
├── components/
│   └── leaderboard/
│       ├── TopStudentsLeaderboard.tsx    # Main component
│       └── __tests__/
│           └── leaderboard.test.ts       # Component tests
```

## 🚀 Usage

### Basic Example

```tsx
import { TopStudentsLeaderboard } from '@/components/leaderboard/TopStudentsLeaderboard';

export default function MyPage() {
  return (
    <TopStudentsLeaderboard
      metricType="completion"
      limit={20}
      highlightUserId={currentUser.id}
      showPagination={true}
    />
  );
}
```

### Advanced Configuration

```tsx
<TopStudentsLeaderboard
  metricType="combined"           // 'completion' | 'quiz_score' | 'combined'
  courseId="blockchain-101"       // Filter by specific course
  limit={25}                      // Items per page
  showPagination={true}           // Enable pagination controls
  highlightUserId="student-123"   // Highlight current user
  showTrends={true}               // Show ranking trend indicators
  enableRealTime={false}          // Enable auto-refresh
  className="shadow-xl"           // Custom CSS classes
  onStudentClick={(student) => {  // Click handler
    console.log('Selected:', student);
  }}
/>
```

## 📊 API Reference

### GET `/api/leaderboard/students`

Fetches leaderboard data with optional filtering.

#### Query Parameters

| Parameter   | Type     | Default | Description                                      |
|-------------|----------|---------|--------------------------------------------------|
| `metricType` | string   | `'completion'` | Metric to rank by: `completion`, `quiz_score`, or `combined` |
| `courseId`   | string   | -       | Filter by specific course ID                     |
| `limit`      | number   | `20`    | Number of entries per page                       |
| `offset`     | number   | `0`     | Pagination offset                                |
| `userId`     | string   | -       | User ID to highlight (shows their position)      |

#### Response Format

```typescript
interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
  currentUserEntry?: LeaderboardEntry;
  hasMore: boolean;
  filters: LeaderboardFilters;
  lastUpdatedAt: string;
}
```

#### Example Response

```json
{
  "entries": [
    {
      "rank": 1,
      "studentId": "student-1",
      "studentName": "Alice Johnson",
      "avatarUrl": "/avatars/alice.johnson.jpg",
      "courseId": "blockchain-101",
      "courseName": "Blockchain Fundamentals",
      "cohort": "Cohort A",
      "score": 98,
      "metricType": "completion",
      "coursesCompleted": 4,
      "quizzesTaken": 12,
      "averageQuizScore": 95,
      "completionRate": 98
    }
  ],
  "totalCount": 150,
  "currentUserEntry": {
    "rank": 42,
    "studentId": "student-42",
    "studentName": "John Doe",
    "score": 75
  },
  "hasMore": true,
  "filters": {
    "metricType": "completion",
    "limit": 20,
    "offset": 0
  },
  "lastUpdatedAt": "2025-03-27T10:30:00.000Z"
}
```

## 🎨 Component Props

### LeaderboardProps

| Prop               | Type                        | Default        | Description                                    |
|--------------------|-----------------------------|----------------|------------------------------------------------|
| `metricType`       | `LeaderboardMetricType`     | `'completion'` | Ranking metric to use                          |
| `courseId`         | `string`                    | -              | Filter by course                               |
| `limit`            | `number`                    | `20`           | Entries per page                               |
| `showPagination`   | `boolean`                   | `true`         | Show pagination controls                       |
| `highlightUserId`  | `string`                    | -              | User ID to highlight                           |
| `showTrends`       | `boolean`                   | `false`        | Show trend indicators                          |
| `enableRealTime`   | `boolean`                   | `false`        | Enable auto-refresh                            |
| `className`        | `string`                    | -              | Additional CSS classes                         |
| `onStudentClick`   | `(entry) => void`           | -              | Callback when student is clicked               |

## 🔧 Score Calculation

### Completion Metric
```typescript
score = currentProgress (0-100)
```

### Quiz Score Metric
```typescript
score = quizAverageScore (0-100)
```

### Combined Metric
```typescript
score = (currentProgress × 0.6) + (quizAverageScore × 0.4)
```

## 🎯 Acceptance Criteria ✓

All requirements have been met:

- ✅ **Fetches data dynamically** - Uses fetch API with configurable parameters
- ✅ **User avatar, name, score** - Displays complete student profile
- ✅ **Supports pagination or scrolling** - Implements traditional pagination
- ✅ **Highlights logged-in user** - Special styling for current user
- ✅ **Responsive & mobile-friendly** - Adaptive design with Tailwind breakpoints

## 🧪 Testing

### Run Unit Tests

```bash
pnpm test src/components/leaderboard/__tests__/leaderboard.test.ts
pnpm test src/app/api/leaderboard/students/__tests__/route.test.ts
```

### Test Coverage

Tests cover:
- Score calculation logic
- Pagination functionality
- User highlighting
- Trend detection
- API filtering and sorting
- Edge cases and error handling

## 🎨 Customization

### Styling

The component uses Tailwind CSS and Shadcn UI components. Customize by:

1. **Override with className prop**
2. **Modify theme colors in tailwind.config.cjs**
3. **Replace Shadcn components with custom variants**

### Example: Dark Theme

```tsx
<TopStudentsLeaderboard
  className="dark bg-gradient-to-r from-gray-900 to-gray-800 text-white"
/>
```

## 🔌 Integration Points

### Dashboard Integration

Add to your dashboard tabs:

```tsx
<TabsContent value="leaderboard">
  <TopStudentsLeaderboard
    metricType="combined"
    highlightUserId={session.user.id}
  />
</TabsContent>
```

### Navigation Link

```tsx
<Link href="/leaderboard-demo">
  <Button variant="ghost">
    <Trophy className="h-4 w-4 mr-2" />
    Leaderboard
  </Button>
</Link>
```

## 🚧 Future Enhancements

Potential improvements:

1. **WebSocket Integration** - Real-time ranking updates
2. **Historical Trends** - Graph showing rank over time
3. **Social Sharing** - Share achievements on social media
4. **Achievement Badges** - Display medals and awards
5. **Filter Sidebar** - Advanced filtering options
6. **Export Functionality** - Download as PDF/CSV
7. **Gamification** - Streaks, levels, and rewards

## ⚠️ Considerations

### Performance
- Virtual scrolling recommended for >100 items
- Implement caching (SWR/React Query)
- Debounce filter changes

### Privacy
- Ensure FERPA/GDPR compliance
- Allow users to opt-out
- Anonymize data if needed

### Tie-Breaking
Current implementation maintains original order for equal scores. Consider adding:
- Secondary sort by quiz average
- Timestamp-based tie-breaking
- Alphabetical ordering

## 📝 Examples

### Multiple Leaderboards Side-by-Side

```tsx
<div className="grid md:grid-cols-2 gap-6">
  <TopStudentsLeaderboard
    metricType="completion"
    title="By Completion"
  />
  
  <TopStudentsLeaderboard
    metricType="quiz_score"
    title="By Quiz Scores"
  />
</div>
```

### With Custom Filters

```tsx
const [filters, setFilters] = useState({
  metricType: 'completion',
  courseId: 'all',
});

<Select
  value={filters.metricType}
  onValueChange={(v) => setFilters({ ...filters, metricType: v })}
>
  <SelectItem value="completion">Completion</SelectItem>
  <SelectItem value="quiz_score">Quiz Scores</SelectItem>
  <SelectItem value="combined">Combined</SelectItem>
</Select>
```

## 🛠️ Troubleshooting

### Issue: Avatar images not loading
**Solution:** Check that avatar paths exist in `/public/avatars/` or fallback will be used.

### Issue: Pagination not working
**Solution:** Ensure `showPagination={true}` and check `limit`/`offset` calculations.

### Issue: User not highlighted
**Solution:** Verify `highlightUserId` matches a valid `studentId` in the dataset.

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review test files for usage examples
3. Inspect browser console for errors
4. Verify API response format

---

**Built with ❤️ using Next.js, TypeScript, and Shadcn UI**

# Leaderboard Component Architecture

## 🏗️ Component Hierarchy

```
TopStudentsLeaderboard (Main Container)
├── Card (Shadcn wrapper)
│   ├── CardHeader
│   │   ├── Title + Trophy Icon
│   │   ├── Description
│   │   └── Controls (Select + Refresh Button)
│   └── CardContent
│       ├── Error State (if error)
│       ├── Loading Skeleton (if loading)
│       ├── Empty State (if no data)
│       └── Leaderboard Content
│           ├── Entries List
│           │   └── LeaderboardRow (repeated)
│           │       ├── RankBadge (Trophy/Medal/Award/Number)
│           │       ├── Avatar (with fallback)
│           │       ├── Student Info (Name, Cohort, Course)
│           │       ├── Score Display
│           │       └── Additional Stats (Desktop)
│           ├── Current User Separator
│           └── Pagination Controls
```

## 📊 Data Flow Diagram

```mermaid
graph TB
    A[User Opens Page] --> B[Component Mounts]
    B --> C[useEffect Triggers]
    C --> D[Fetch API Call]
    D --> E[/api/leaderboard/students]
    E --> F[Generate Mock Data]
    F --> G[Calculate Scores]
    G --> H[Sort by Score]
    H --> I[Paginate Results]
    I --> J[Find Current User]
    J --> K[Return Response]
    K --> L[Update State]
    L --> M[Render UI]
    M --> N{User Interaction?}
    N -->|Change Metric| C
    N -->|Next Page| C
    N -->|Refresh| C
    N -->|Click Student| O[Callback Handler]
```

## 🎨 Visual Layout

### Desktop View (1920x1080)
```
┌─────────────────────────────────────────────────────────────┐
│  🏆 Top Students Leaderboard                    [Select▼] 🔃 │
│  Ranking by completion performance                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  🥇  [Avatar]  Alice Johnson              Cohort A          │
│            Blockchain Fundamentals                           │
│                                      98%  💼 4 courses      │
│                                           🏆 12 quizzes      │
│                                                              │
│  🥈  [Avatar]  Bob Smith                  Cohort B          │
│            DeFi Basics                                       │
│                                      95%  💼 3 courses      │
│                                           🏆 10 quizzes      │
│                                                              │
│  🥉  [Avatar]  Carol White                Cohort A          │
│            Smart Contracts                                   │
│                                      92%  💼 4 courses      │
│                                           🏆 11 quizzes      │
│                                                              │
│  4   [Avatar]  David Brown                Cohort C          │
│            Blockchain Fundamentals                           │
│                                      89%  💼 3 courses      │
│                                           🏆 9 quizzes       │
│                                                              │
│  ... (16 more entries)                                       │
│                                                              │
│  ───────────────── Your Position ────────────                │
│                                                              │
│  ✨  [Avatar]  John Doe (You)             Cohort B          │
│            Blockchain Fundamentals                           │
│                                      75%  💼 2 courses      │
│                                           🏆 8 quizzes       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Showing 1 to 20 of 150 students                             │
│  [< Previous] [Page 1 of 8] [Next >]                        │
└─────────────────────────────────────────────────────────────┘
```

### Mobile View (375x812)
```
┌─────────────────────┐
│ 🏆 Leaderboard  🔃  │
│ by completion       │
├─────────────────────┤
│ 🥇 [AV] Alice J.    │
│    Cohort A         │
│              98%    │
│                     │
│ 🥈 [AV] Bob S.      │
│    Cohort B         │
│              95%    │
│                     │
│ 🥉 [AV] Carol W.    │
│    Cohort A         │
│              92%    │
│                     │
│ 4  [AV] David B.    │
│    Cohort C         │
│              89%    │
│                     │
│ ...                 │
│                     │
│ ─── Your Pos ───    │
│                     │
│ ✨ [AV] John D. You │
│    Cohort B         │
│              75%    │
│                     │
├─────────────────────┤
│ 1-20 of 150         │
│ [<] [1/8] [>]       │
└─────────────────────┘
```

## 🔄 State Management

```typescript
interface ComponentState {
  currentPage: number;      // Active page number
  data: LeaderboardData | null;  // API response
  isLoading: boolean;       // Loading indicator
  error: Error | null;      // Error state
}

interface LeaderboardData {
  entries: LeaderboardEntry[];     // Current page entries
  totalCount: number;              // Total students
  currentUserEntry?: LeaderboardEntry; // Highlighted user
  hasMore: boolean;                // Pagination flag
  filters: LeaderboardFilters;     // Applied filters
  lastUpdatedAt: string;           // Cache timestamp
}
```

## 🎯 Component Props Flow

```
Parent Component
    ↓
TopStudentsLeaderboard
    ├─ metricType → API Query Param
    ├─ courseId → API Query Param
    ├─ limit → Pagination Calc
    ├─ showPagination → Conditional Render
    ├─ highlightUserId → User Matching Logic
    ├─ showTrends → Trend Indicator Display
    ├─ enableRealTime → Refetch Interval
    └─ onStudentClick → Callback Handler
```

## 📱 Responsive Breakpoints

| Breakpoint | Width | Columns | Features |
|------------|-------|---------|----------|
| `xs` | <640px | 1 | Stack all info vertically |
| `sm` | ≥640px | 1 | Larger tap targets |
| `md` | ≥768px | 2 | Show additional stats |
| `lg` | ≥1024px | 2+ | Full desktop layout |
| `xl` | ≥1280px | 3+ | Enhanced spacing |

## 🎨 Color Scheme

### Light Mode
- **Background:** `bg-background` (white/slate-50)
- **Cards:** `bg-card` (white with shadow)
- **Primary:** `text-primary` (brand color)
- **Accent:** `bg-accent/50` (hover states)
- **Gold:** `text-yellow-500` (#EAB308)
- **Silver:** `text-gray-400` (#9CA3AF)
- **Bronze:** `text-amber-600` (#D97706)

### Dark Mode
- **Background:** `bg-background` (slate-900)
- **Cards:** `bg-card` (slate-800)
- **Primary:** `text-primary` (brighter brand)
- **Accent:** `bg-accent/50` (muted hover)
- **Gold:** `text-yellow-400` (lighter)
- **Silver:** `text-gray-300` (brighter)
- **Bronze:** `text-amber-500` (more vibrant)

## ⚡ Performance Metrics

### Target Load Times
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **LCP (Largest Contentful Paint):** <2.5s
- **CLS (Cumulative Layout Shift):** <0.1

### Optimization Techniques
1. **Code Splitting** - Lazy load non-critical components
2. **Image Optimization** - Next.js Image with placeholders
3. **Debouncing** - Throttle rapid filter changes
4. **Memoization** - React.memo for list items
5. **Virtual Scrolling** - For lists >100 items (future)

## 🧩 Integration Points

### Authentication
```typescript
// Get current user from session
const userId = session?.user?.id || highlightUserId;
```

### Analytics Tracking
```typescript
onStudentClick={(student) => {
  analytics.track('Leaderboard Student Clicked', {
    studentId: student.studentId,
    rank: student.rank,
    metricType: student.metricType,
  });
}}
```

### Real-time Updates
```typescript
// WebSocket integration (future)
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001');
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    if (update.type === 'RANKING_CHANGE') {
      refetch();
    }
  };
  return () => ws.close();
}, []);
```

## 🎯 Future Enhancements

### Phase 2 Roadmap
1. **Historical Trends Chart**
   ```
   Rank Over Time:
   Week 1: #15 → Week 2: #12 → Week 3: #8
   ```

2. **Achievement Badges**
   ```
   🏅 Top 10 Club
   ⭐ Most Improved
   🔥 10-Week Streak
   ```

3. **Social Features**
   ```
   [Share Achievement] button
   [Challenge Friend] button
   ```

4. **Advanced Filtering**
   ```
   - Date Range Picker
   - Cohort Multi-Select
   - Course Category Filter
   ```

---

**Architecture designed for scalability and maintainability** 🚀

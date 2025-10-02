# Skeleton Loading System Implementation

## Overview

This implementation provides a comprehensive skeleton loading system for React applications using Tailwind CSS. It includes reusable skeleton components that match the application's actual component layouts, ensuring smooth loading transitions without layout shift.

## Features

✅ **Placeholder cards appear during loading**
✅ **Loading state transitions smoothly**
✅ **No content layout shift**
✅ **Dark mode support**
✅ **Customizable animations**
✅ **TypeScript support**
✅ **Responsive design**

## Components Created

### Base Skeleton Components (`src/components/ui/skeleton.tsx`)

- `Skeleton` - Base skeleton component
- `SkeletonText` - Multi-line text skeleton
- `SkeletonAvatar` - Avatar/profile picture skeleton
- `SkeletonButton` - Button skeleton
- `SkeletonImage` - Image/thumbnail skeleton
- `SkeletonBadge` - Badge/chip skeleton
- `SkeletonCard` - Card wrapper skeleton

### Specific Component Skeletons

1. **CourseCardSkeleton** (`src/components/skeleton/CourseCardSkeleton.tsx`)
   - Matches CourseCard component layout exactly
   - Includes image, title, description, stats, and button placeholders
   - `CourseGridSkeleton` for multiple cards

2. **DashboardSkeleton** (`src/components/skeleton/DashboardSkeleton.tsx`)
   - `DashboardStatsCardSkeleton` - Stats cards
   - `DashboardProgressCardSkeleton` - Progress cards
   - `DashboardActivityCardSkeleton` - Activity/events cards
   - `DashboardRecommendationsCardSkeleton` - Recommendation cards
   - `DashboardCommunityCardSkeleton` - Community activity cards
   - `DashboardSkeleton` - Full dashboard layout

3. **FeatureCardSkeleton** (`src/components/skeleton/FeatureCardSkeleton.tsx`)
   - Individual feature card skeleton
   - `FeatureCardsGridSkeleton` - Full feature section

4. **CodePlaygroundSkeleton** (`src/components/skeleton/CodePlaygroundSkeleton.tsx`)
   - `CodeEditorSkeleton` - Code editor area
   - `OutputPanelSkeleton` - Output panel
   - `SavedSnippetsSkeleton` - Saved snippets list
   - `SaveCodeFormSkeleton` - Save form
   - `DocumentationPanelSkeleton` - Documentation panel
   - `CodePlaygroundSkeleton` - Full playground layout

5. **TestimonialSkeleton** (`src/components/skeleton/TestimonialSkeleton.tsx`)
   - Individual testimonial card skeleton
   - `TestimonialsSkeleton` - Full testimonials section

6. **HeroSkeleton** (`src/components/skeleton/HeroSkeleton.tsx`)
   - `HeroSkeleton` - Full hero section
   - `HeroSectionSkeleton` - Simplified hero section

## Hooks

### `useLoading` (`src/hooks/useLoading.ts`)

Custom hook for managing loading states with smooth transitions:

```typescript
const { isLoading, startLoading, stopLoading, setLoading } = useLoading({
  minLoadingTime: 800, // Minimum loading time in ms
  initialLoading: false,
});
```

### `useAsyncData`

Hook for data fetching with automatic loading states:

```typescript
const { data, error, isLoading } = useAsyncData(
  () => fetchCourses(),
  [dependencies],
  { minLoadingTime: 1200 },
);
```

## Usage Examples

### 1. Next.js Route Loading Pages

```typescript
// src/app/courses/loading.tsx
import { CourseGridSkeleton } from '@/components/skeleton';

export default function CoursesLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <CourseGridSkeleton count={6} />
    </main>
  );
}
```

### 2. Component-Level Loading

```typescript
import { CourseGridSkeleton } from '@/components/skeleton';
import { useLoading } from '@/hooks/useLoading';

export function FeaturedCourses() {
  const { isLoading } = useLoading();

  if (isLoading) {
    return <CourseGridSkeleton count={3} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <div
          key={course.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CourseCard {...course} />
        </div>
      ))}
    </div>
  );
}
```

### 3. Conditional Skeleton Loading

```typescript
import { DashboardSkeleton } from '@/components/skeleton';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData().then(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {isLoading ? <DashboardSkeleton /> : <DashboardContent />}
    </div>
  );
}
```

## Animation Configuration

### Tailwind Config (`tailwind.config.cjs`)

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        skeleton: 'skeleton 2s ease-in-out infinite alternate',
        'pulse-skeleton': 'pulse-skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        skeleton: {
          '0%': { backgroundColor: 'hsl(210, 40%, 94%)' },
          '100%': { backgroundColor: 'hsl(210, 40%, 98%)' },
        },
        'pulse-skeleton': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
};
```

### Global CSS (`src/app/globals.css`)

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out forwards;
}
```

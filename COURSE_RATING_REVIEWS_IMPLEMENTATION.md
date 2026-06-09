# Course Rating & Review System

## Overview
This implementation provides a complete course rating and review system for the StrellerMinds platform, allowing students to rate courses with stars and submit detailed reviews.
<!-- 
The Auto-Skip Silence feature automatically detects and skips silent parts of videos, saving users time during playback. It uses the Web Audio API to analyze audio levels in real-time and skips segments that fall below a configurable silence threshold. -->
## Features Implemented

### ✅ Core Features
1. **Star Rating Input** - Interactive 5-star rating system with hover effects
2. **Comment Box** - Text area for detailed course reviews (minimum 10 characters)
3. **Average Rating Display** - Large, prominent display of course average rating
4. **Rating Distribution** - Visual breakdown of ratings (5★ to 1★) with progress bars
5. **Reviews List** - Display all student reviews with user info, date, and helpfulness voting
6. **Real-time Updates** - UI updates immediately after submitting a review
7. **Input Validation** - Validates rating selection and comment length before submission

### 🎨 UI/UX Features
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications for user feedback
- Accessible with ARIA labels and keyboard navigation

## Files Created

### Components
1. **`src/components/CourseRating.tsx`**
   - Star rating input component
   - Comment text area
   - Form validation
   - Submit functionality

2. **`src/components/CourseReviews.tsx`**
   - Average rating display
   - Rating distribution visualization
   - Reviews list with user avatars
   - Helpful vote buttons

### Types
3. **`src/types/course-review.ts`**
   - `CourseReview` interface
   - `CourseRatingSummary` interface
   - `SubmitReviewInput` interface
   - API response types

### API
4. **`src/app/api/courses/reviews/route.ts`**
   - GET endpoint for fetching reviews
   - POST endpoint for submitting reviews
   - Mock data storage (ready for database integration)
   - Pagination support

### Services
5. **`src/services/courseReviewService.ts`**
   - Service layer for review operations
   - API abstraction
   - Error handling
   - Helper methods

### Demo Page
6. **`src/app/courses/[courseId]/reviews/page.tsx`**
   - Integration demo page
   - Real-time state management
   - Error and loading states

## How to Use

### 1. Access the Demo Page
Navigate to: `/courses/[courseId]/reviews`

Example: `http://localhost:3000/courses/course-1/reviews`

### 2. Submit a Rating
1. Click on the star rating (1-5 stars)
2. Optionally add a detailed comment (min 10 characters)
3. Click "Submit Review"
4. Receive instant feedback via toast notification

### 3. View Reviews
- See average rating prominently displayed
- View rating distribution breakdown
- Read individual student reviews
- Mark reviews as helpful

## API Endpoints

### GET /api/courses/reviews
Fetch reviews for a course with pagination.

**Query Parameters:**
- `courseId` (required): The course ID
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [...],
    "summary": {
      "courseId": "course-1",
      "averageRating": 4.7,
      "totalReviews": 3,
      "ratingDistribution": { "5": 2, "4": 1, "3": 0, "2": 0, "1": 0 }
    },
    "total": 3
  }
}
```

### POST /api/courses/reviews
Submit a new course review.

**Request Body:**
```json
{
  "courseId": "course-1",
  "rating": 5,
  "comment": "Excellent course with great content!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "review": { ... },
    "summary": { ... }
  }
}
```

## Component Props

### CourseRating
```typescript
interface CourseRatingProps {
  courseId: string;
  initialRating?: number;
  onRatingSubmit?: (rating: number, comment: string) => Promise<void>;
}
```

### CourseReviews
```typescript
interface CourseReviewsProps {
  reviews: CourseReview[];
  summary: CourseRatingSummary;
  onHelpfulClick?: (reviewId: string) => void;
}
```

## Mock Data
The system includes pre-populated mock data for demonstration:

**Course-1:**
- 3 reviews
- Average rating: 4.7
- Reviews from: Sarah Johnson, Michael Chen, Emily Rodriguez

**Course-2:**
- 1 review
- Average rating: 3.0
- Review from: David Kim

## Acceptance Criteria ✅

### ✅ Star rating + comment box
- Interactive 5-star rating with visual feedback
- Comment textarea with character minimum validation
- Submit button with loading state

### ✅ Average rating display
- Large, prominent average rating number
- Visual star representation
- Total review count display
- Rating distribution breakdown

### ✅ Accepts initial ratings as props
- `initialRating` prop supported
- Can be used as controlled or uncontrolled component

### ✅ Updates in real-time after submission
- State updates immediately after successful submission
- New review appears at top of list
- Summary statistics recalculate instantly

### ✅ Validates input
- Requires star rating (1-5)
- Minimum 10 character comment
- Maximum 1000 character comment
- Prevents duplicate submissions
- Shows error messages via toast notifications

## Testing

### Manual Testing Steps
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to demo page:
   ```
   http://localhost:3000/courses/course-1/reviews
   ```

3. Test scenarios:
   - Submit a new review with rating and comment
   - Try submitting without selecting stars (should show error)
   - Try submitting with short comment (should show error)
   - Mark existing reviews as helpful
   - Check responsive design on mobile viewport

## Future Enhancements

### Ready for Production
When ready to integrate with a real backend:

1. **Replace Mock Storage**
   - Update `src/app/api/courses/reviews/route.ts`
   - Connect to database (PostgreSQL, MongoDB, etc.)
   - Add authentication middleware

2. **Add User Authentication**
   - Replace mock user with actual auth context
   - Verify user enrollment before allowing review
   - Prevent duplicate reviews per user

3. **Add Admin Features**
   - Review moderation dashboard
   - Flag inappropriate reviews
   - Delete spam reviews

4. **Enhanced Features**
   - Edit own reviews
   - Sort reviews (newest, highest, lowest)
   - Filter by rating
   - Load more pagination
   - User profile links from reviews

## Code Quality

- ✅ TypeScript strict mode
- ✅ ESLint compliant
- ✅ Prettier formatted
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Responsive design
- ✅ Dark mode compatible
- ✅ Error handling
- ✅ Loading states

## Dependencies Used
- React (useState, useEffect)
- Next.js (App Router, API Routes)
- Lucide React (icons)
- Radix UI (Button, Textarea, Card, Progress, Avatar)
- Tailwind CSS (styling)
- Zod (validation)

## Notes
- All components use 'use client' directive for client-side interactivity
- Mock data persists only during server session (resets on restart)
- API endpoints follow RESTful conventions
- Service layer provides clean abstraction for future API changes

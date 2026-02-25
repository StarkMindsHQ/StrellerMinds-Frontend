# Learning Experience Demo

This document describes the interactive learning experience implementation for the platform.

## Overview

The learning experience provides a comprehensive, interactive environment for students to engage with course content through video lessons, progress tracking, and structured learning paths.

## Features

### 1. Course Structure
- Multiple courses with unique content
- Lessons organized in sequential order
- Progress tracking per course
- Locked/unlocked lesson system

### 2. Learning Interface
- **Desktop View**: Sidebar navigation with lesson list
- **Mobile View**: Collapsible lesson navigation
- **Video Player**: Integrated video content with controls
- **Progress Tracking**: Visual indicators for completed lessons

### 3. Available Courses

#### Blockchain Fundamentals (8 lessons)
- Introduction to blockchain technology
- Cryptographic foundations
- Distributed ledger technology
- Consensus mechanisms
- Smart contracts basics
- Blockchain networks
- Security and vulnerabilities
- Future of blockchain

#### Stellar Smart Contracts (6 lessons)
- Introduction to Stellar
- Soroban basics
- Writing your first contract
- Contract testing
- Advanced contract patterns
- Production deployment

#### DeFi Fundamentals (7 lessons)
- What is DeFi?
- Liquidity pools
- Stellar DEX
- Lending protocols
- Yield farming
- Risk management
- Building a DeFi app

#### NFT Development (5 lessons)
- NFT fundamentals
- Token standards
- Minting NFTs
- NFT marketplace
- Royalties & licensing

## How to Access

### Demo Page
Visit `/learning-demo` to see all available courses with descriptions and quick access links.

### Individual Course Learning
Access any course directly via `/courses/{courseId}/learn`:
- `/courses/blockchain-fundamentals/learn`
- `/courses/stellar-smart-contracts/learn`
- `/courses/defi-fundamentals/learn`
- `/courses/nft-development/learn`

## Key Components

### 1. LessonSidebar
- Desktop navigation for lessons
- Shows completion status
- Displays lesson duration
- Locks future lessons until prerequisites are completed

### 2. MobileLessonNav
- Mobile-friendly lesson navigation
- Sheet-based UI for compact screens
- Same functionality as desktop sidebar

### 3. LessonContent
- Video player integration
- Lesson description and metadata
- Navigation controls (Previous/Next)
- Completion button

### 4. CourseOverview
- Course introduction and description
- Instructor information
- Lesson list with durations
- "Start Learning" call-to-action

### 5. VideoContainer
- Responsive video player
- Custom controls
- Progress tracking
- Playback speed control

## Progress Tracking

The system uses `CourseProgressContext` to manage:
- Current lesson ID
- Completed lessons array
- Progress percentage
- Lesson unlocking logic

Progress is stored in localStorage and persists across sessions.

## Lesson Unlocking Logic

1. First lesson is always unlocked
2. Subsequent lessons unlock when the previous lesson is completed
3. Users cannot skip ahead without completing prerequisites
4. Completed lessons can be revisited anytime

## Responsive Design

- **Desktop (lg+)**: Sidebar always visible
- **Tablet (md-lg)**: Collapsible sidebar
- **Mobile (<md)**: Sheet-based navigation

## Future Enhancements

- Quiz integration after lessons
- Code playground integration
- Discussion forums per lesson
- Downloadable resources
- Certificate generation
- Bookmarking functionality
- Note-taking feature
- Lesson search and filtering

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Storage**: localStorage for progress
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Development Notes

### Mock Data
All course data is currently stored in `src/lib/mock-course-data.ts`. In production, this should be replaced with API calls to fetch course data from a database.

### Video Content
Currently using a demo video (`/videos/demo-video.mp4`) for all lessons. Replace with actual lesson videos in production.

### Progress Persistence
Progress is stored in localStorage. Consider implementing:
- Backend API for progress syncing
- User authentication integration
- Cross-device progress sync
- Analytics tracking

## Testing the Demo

1. Visit `/learning-demo` to see all courses
2. Click "Start Learning" on any course
3. Watch the video and click "Mark as Complete"
4. Notice the next lesson unlocks automatically
5. Navigate between lessons using sidebar or navigation buttons
6. Test on mobile to see responsive behavior
7. Refresh the page to verify progress persistence

## Customization

### Adding New Courses
Edit `src/lib/mock-course-data.ts` and add a new course object to the `mockCourses` record.

### Modifying Lesson Structure
Update the `Lesson` type in `src/types/lesson.ts` to add new fields or modify existing ones.

### Styling
All components use Tailwind CSS and can be customized via the theme configuration or component-level classes.

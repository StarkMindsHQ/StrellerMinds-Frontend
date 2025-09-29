import { NextResponse } from 'next/server';
import { allCourses } from '@/lib/course-data';

export async function GET(request: Request) {
  // Parse URL to get query parameters
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'popular';
  const limit = Number.parseInt(searchParams.get('limit') || '0');

  // Filter courses based on the tab
  let filteredCourses = [...allCourses];

  switch (tab) {
    case 'popular':
      // Sort by popularity (highest first)
      filteredCourses.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'new':
      // Sort by date added (newest first)
      filteredCourses.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
      );
      break;
    case 'trending':
      // Sort by trending score (highest first)
      filteredCourses.sort((a, b) => b.trendingScore - a.trendingScore);
      break;
  }

  // Apply limit if specified
  if (limit > 0) {
    filteredCourses = filteredCourses.slice(0, limit);
  }

  return NextResponse.json({ courses: filteredCourses });
}

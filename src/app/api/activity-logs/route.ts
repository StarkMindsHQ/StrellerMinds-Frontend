import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (replace with database in production)
const activityLogsStore: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { logs } = await request.json();

    if (!logs || !Array.isArray(logs)) {
      return NextResponse.json({ error: 'Invalid logs data' }, { status: 400 });
    }

    // Store logs (in production, save to database)
    activityLogsStore.push(...logs);

    // Keep only last 10000 logs to prevent memory issues
    if (activityLogsStore.length > 10000) {
      activityLogsStore.splice(0, activityLogsStore.length - 10000);
    }

    return NextResponse.json({
      success: true,
      count: logs.length,
      message: 'Activity logs saved successfully',
    });
  } catch (error) {
    console.error('Error saving activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to save activity logs' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const lessonId = searchParams.get('lessonId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredLogs = [...activityLogsStore];

    // Filter by userId
    if (userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === userId);
    }

    // Filter by lessonId
    if (lessonId) {
      filteredLogs = filteredLogs.filter((log) => log.lessonId === lessonId);
    }

    // Sort by start time (most recent first)
    filteredLogs.sort((a, b) => b.startTime - a.startTime);

    // Limit results
    filteredLogs = filteredLogs.slice(0, limit);

    return NextResponse.json(filteredLogs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 },
    );
  }
}

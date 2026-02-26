import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (should match the main route)
// In production, this would query the database
const activityLogsStore: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const lessonId = searchParams.get('lessonId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    let filteredLogs = activityLogsStore.filter(log => log.userId === userId);

    // Filter by lessonId
    if (lessonId) {
      filteredLogs = filteredLogs.filter(log => log.lessonId === lessonId);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate).getTime();
      filteredLogs = filteredLogs.filter(log => log.startTime >= start);
    }

    if (endDate) {
      const end = new Date(endDate).getTime();
      filteredLogs = filteredLogs.filter(log => log.startTime <= end);
    }

    // Calculate summary
    const totalSessions = filteredLogs.length;
    
    if (totalSessions === 0) {
      return NextResponse.json({
        totalSessions: 0,
        averageEngagement: 0,
        totalTime: 0,
        totalTabSwitches: 0,
        totalVideoPauses: 0,
        engagementTrend: 'stable',
      });
    }

    const totalEngagement = filteredLogs.reduce(
      (sum, log) => sum + log.metrics.engagementScore,
      0
    );
    const averageEngagement = totalEngagement / totalSessions;

    const totalTime = filteredLogs.reduce(
      (sum, log) => sum + log.metrics.totalTime,
      0
    );

    const totalTabSwitches = filteredLogs.reduce(
      (sum, log) => sum + log.metrics.tabSwitches,
      0
    );

    const totalVideoPauses = filteredLogs.reduce(
      (sum, log) => sum + log.metrics.videoPauses,
      0
    );

    // Calculate engagement trend
    const sortedLogs = [...filteredLogs].sort((a, b) => a.startTime - b.startTime);
    const midpoint = Math.floor(sortedLogs.length / 2);
    
    const firstHalf = sortedLogs.slice(0, midpoint);
    const secondHalf = sortedLogs.slice(midpoint);

    const avgFirstHalf = firstHalf.reduce(
      (sum, log) => sum + log.metrics.engagementScore,
      0
    ) / firstHalf.length;
    
    const avgSecondHalf = secondHalf.reduce(
      (sum, log) => sum + log.metrics.engagementScore,
      0
    ) / secondHalf.length;

    const difference = avgSecondHalf - avgFirstHalf;

    let engagementTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (difference > 5) engagementTrend = 'improving';
    else if (difference < -5) engagementTrend = 'declining';

    return NextResponse.json({
      totalSessions,
      averageEngagement: Math.round(averageEngagement),
      totalTime,
      totalTabSwitches,
      totalVideoPauses,
      engagementTrend,
    });
  } catch (error) {
    console.error('Error calculating activity summary:', error);
    return NextResponse.json(
      { error: 'Failed to calculate activity summary' },
      { status: 500 }
    );
  }
}

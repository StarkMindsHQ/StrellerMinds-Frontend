'use client';

import React from 'react';
import { Trophy, Users, Target, BarChart3 } from 'lucide-react';
import { TopStudentsLeaderboard } from '@/components/leaderboard/TopStudentsLeaderboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LeaderboardDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-black tracking-tight">Student Leaderboard</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating top performers across all courses. Track your progress and compete with peers!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                Active learners this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,678</div>
              <p className="text-xs text-muted-foreground">
                Total attempts this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">
                Highest quiz average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Leaderboard */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              By Course Completion
            </h2>
            <TopStudentsLeaderboard
              metricType="completion"
              limit={10}
              highlightUserId="student-1"
              showTrends={true}
              onStudentClick={(student) => console.log('Clicked:', student)}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              By Quiz Scores
            </h2>
            <TopStudentsLeaderboard
              metricType="quiz_score"
              limit={10}
              highlightUserId="student-1"
              showTrends={true}
              onStudentClick={(student) => console.log('Clicked:', student)}
            />
          </div>
        </div>

        {/* Combined Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-500" />
            Overall Combined Ranking
          </h2>
          <TopStudentsLeaderboard
            metricType="combined"
            limit={20}
            highlightUserId="student-1"
            showPagination={true}
            showTrends={true}
            className="shadow-xl"
            onStudentClick={(student) => {
              alert(`Selected: ${student.studentName}\nRank: ${student.rank}\nScore: ${student.score}%`);
            }}
          />
        </div>

        {/* Features Section */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Leaderboard Features
            </CardTitle>
            <CardDescription>
              Everything you need to track and celebrate student achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">Metrics</Badge>
                <p className="text-sm">Track by course completion, quiz scores, or combined performance</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">Real-time</Badge>
                <p className="text-sm">Live updates ensure rankings are always current</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">User Highlight</Badge>
                <p className="text-sm">Easily find your position in the rankings</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">Responsive</Badge>
                <p className="text-sm">Perfect viewing experience on all devices</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">Pagination</Badge>
                <p className="text-sm">Navigate through large datasets effortlessly</p>
              </div>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">Trends</Badge>
                <p className="text-sm">Visual indicators show ranking changes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Example */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
            <CardDescription>
              Integration example for developers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`<TopStudentsLeaderboard
  metricType="completion"
  courseId="blockchain-101"
  limit={20}
  showPagination={true}
  highlightUserId={currentUser.id}
  showTrends={true}
  enableRealTime={false}
  onStudentClick={(student) => {
    // Handle student selection
    console.log('Selected:', student);
  }}
/>`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper component for the example
function Award({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

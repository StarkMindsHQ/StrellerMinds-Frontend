'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Settings, BarChart3 } from 'lucide-react';
import ActivityFeed from './ActivityFeed';
import { activityFeedService } from '@/services/activityFeedService';
import { ActivityFilter } from '@/types/activity';

export default function ActivityFeedExample() {
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    if (simulationInterval) return;
    
    setIsSimulating(true);
    
    // Simulate activities every 3 seconds
    const interval = setInterval(() => {
      activityFeedService.simulateActivity();
    }, 3000);
    
    setSimulationInterval(interval);
  };

  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);
  };

  const instructorFilter: ActivityFilter = {
    // Show all activities for instructor view
  };

  const courseFilter: ActivityFilter = {
    courseId: 'course1', // Filter by specific course
  };

  const quizFilter: ActivityFilter = {
    type: 'quiz_submission', // Show only quiz submissions
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Feed Demo</h1>
          <p className="text-gray-600 mt-2">
            Real-time learning activity monitoring with filtering and search capabilities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={isSimulating ? stopSimulation : startSimulation}
            variant={isSimulating ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="instructor" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instructor" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Instructor View
          </TabsTrigger>
          <TabsTrigger value="course" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Course Filter
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Quiz Only
          </TabsTrigger>
          <TabsTrigger value="minimal" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Minimal View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instructor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Dashboard - All Activities</CardTitle>
              <p className="text-sm text-gray-600">
                Complete view of all learning activities across the platform. Ideal for instructors and administrators.
              </p>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                filter={instructorFilter}
                showFilters={true}
                realTime={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course-Specific Activities</CardTitle>
              <p className="text-sm text-gray-600">
                Activities filtered for "Blockchain Fundamentals" course only.
              </p>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                filter={courseFilter}
                showFilters={true}
                realTime={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Submissions Only</CardTitle>
              <p className="text-sm text-gray-600">
                Focus on quiz performance and submission patterns.
              </p>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                filter={quizFilter}
                showFilters={false}
                realTime={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="minimal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minimal Widget View</CardTitle>
              <p className="text-sm text-gray-600">
                Compact version suitable for embedding in dashboards or sidebars.
              </p>
            </CardHeader>
            <CardContent>
              <ActivityFeed
                maxItems={5}
                showFilters={false}
                realTime={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Features & Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🚀 Key Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Real-time WebSocket updates</li>
                <li>• Advanced filtering (type, course, user, date)</li>
                <li>• Search functionality</li>
                <li>• Pagination with virtualization</li>
                <li>• Activity statistics dashboard</li>
                <li>• Responsive design</li>
                <li>• Error handling and loading states</li>
                <li>• Performance optimized</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">📊 Activity Types</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 📚 Course enrollments</li>
                <li>• ✅ Lesson completions</li>
                <li>• 📝 Quiz submissions</li>
                <li>• 🎓 Certificate issuances</li>
                <li>• 📋 Assignment submissions</li>
                <li>• 🚀 Course starts</li>
                <li>• 🎬 Video progress</li>
                <li>• 🏆 Achievement unlocks</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">🎮 Demo Controls</h3>
            <p className="text-sm text-gray-600 mb-2">
              Use the "Start Simulation" button to generate real-time activity updates. 
              This simulates user interactions across the platform to demonstrate the live feed functionality.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span>Live updates enabled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>WebSocket connected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

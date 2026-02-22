'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, FileCheck, BarChart3 } from 'lucide-react';
import CourseManagement from './CourseManagement';
import StudentList from './StudentList';
import ApplicationReview from './ApplicationReview';
import AnalyticsDashboard from './AnalyticsDashboard';
import { cn } from '@/lib/utils';

type InstructorTabValue = 'courses' | 'students' | 'applications' | 'analytics';

const tabs: { value: InstructorTabValue; label: string; icon: React.ElementType }[] = [
  { value: 'courses', label: 'Courses', icon: BookOpen },
  { value: 'students', label: 'Students', icon: Users },
  { value: 'applications', label: 'Applications', icon: FileCheck },
  { value: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function InstructorTabs() {
  const [activeTab, setActiveTab] = useState<InstructorTabValue>('courses');

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as InstructorTabValue)}
      className="w-full flex flex-col gap-4"
    >
      <TabsList className="w-full max-w-full sm:w-auto flex flex-nowrap sm:flex-wrap h-auto gap-1 p-1.5 rounded-xl border border-[#5c0f49]/20 bg-gradient-to-r from-[#5c0f49]/10 to-[#ffcc00]/10 overflow-x-auto">
        {tabs.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 border border-transparent',
              'data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#5c0f49] data-[state=active]:to-purple-600',
              'data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border-[#ffcc00]/50'
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="courses" className="mt-0 flex-1 outline-none">
        <CourseManagement />
      </TabsContent>
      <TabsContent value="students" className="mt-0 flex-1 outline-none">
        <StudentList />
      </TabsContent>
      <TabsContent value="applications" className="mt-0 flex-1 outline-none">
        <ApplicationReview />
      </TabsContent>
      <TabsContent value="analytics" className="mt-0 flex-1 outline-none">
        <AnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
}

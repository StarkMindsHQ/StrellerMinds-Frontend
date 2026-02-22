'use client';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import InstructorTabs from '@/components/instructor/InstructorTabs';
import { GraduationCap } from 'lucide-react';

export default function InstructorPage() {
  return (
    <MainLayout variant="container" padding="medium">
      <div className="space-y-6">
        <header className="rounded-2xl border border-[#5c0f49]/20 bg-gradient-to-r from-[#5c0f49]/10 via-purple-500/5 to-[#ffcc00]/10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#5c0f49] to-purple-600 text-white shadow-md">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#5c0f49] to-purple-600 bg-clip-text text-transparent">
                  Instructor dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage courses, students, applications, and view analytics
                </p>
              </div>
            </div>
          </div>
        </header>

        <InstructorTabs />
      </div>
    </MainLayout>
  );
}

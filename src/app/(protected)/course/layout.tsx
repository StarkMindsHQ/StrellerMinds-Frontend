"use client";

import { ReactNode } from "react";
import { CourseProvider } from "@/contexts/CourseContext";
import LessonSidebar from "@/components/course/LessonSidebar";


interface CourseLayoutProps {
  children: ReactNode;
}

export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <CourseProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* Header Placeholder */}
        <header className="h-16 border-b bg-white flex items-center px-4 md:px-8">
          <h1 className="text-lg md:text-xl font-semibold">
            Course Title
          </h1>
        </header>

        {/* Main Section */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <aside
  className="
    hidden md:flex
    md:w-72 lg:w-80
    border-r bg-white
    overflow-y-auto
  "
>
  <LessonSidebar />
</aside>


          {/* Main Content Area */}
          <main className="
            flex-1
            overflow-y-auto
            p-4
            sm:p-6
            lg:p-8
          ">
            {children}
          </main>
        </div>

      </div>
    </CourseProvider>
  );
}

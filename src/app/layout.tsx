"use client";

import { ReactNode, useState } from "react";
import { CourseProvider } from "@/contexts/CourseContext";
import LessonSidebar from "@/components/course/LessonSidebar";
import { Menu, X } from "lucide-react";

export default function CourseLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <CourseProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-8">
          <h1 className="text-lg md:text-xl font-semibold">
            Course Title
          </h1>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex md:w-72 lg:w-80 border-r bg-white overflow-y-auto">
            <LessonSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="relative w-72 bg-white h-full shadow-lg p-4 animate-slide-in">
              <button
                onClick={() => setMobileOpen(false)}
                className="mb-4"
              >
                <X className="w-6 h-6" />
              </button>
              <LessonSidebar />
            </div>
          </div>
        )}
      </div>
    </CourseProvider>
  );
}

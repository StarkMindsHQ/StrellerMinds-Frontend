'use client';
import Link from 'next/link';
import { Course } from '@/services/electiveService';
import type { ElectiveData } from '@/lib/electives-data';
import { Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course | ElectiveData;
  className?: string;
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  const title = (course as any).title ?? (course as any).name ?? 'Untitled';
  return (
    <Link href={`/electives/${course.id}`}>
      <div
        className={cn(
          'group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#5c0f49] transition-all duration-300 overflow-hidden cursor-pointer',
          className,
        )}
      >
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-900 to-[#5c0f49] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl text-nowrap font-semibold text-gray-900 group-hover:text-[#5c0f49] transition-colors duration-200 mb-1">
                {title}
              </h3>
              <span className="inline-block px-3 py-1 text-xs font-medium text-[#ffcc09] bg-[#5c0f49] rounded-full">
                {course.category}
              </span>
            </div>
            <div className="flex-shrink-0 ml-4">
              {course.isActive ? (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-900 rounded-full mr-1.5 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-full border border-gray-200">
                  Inactive
                </span>
              )}
            </div>
          </div>

          {course.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {course.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{course.creditHours} Credits</span>
            </div>

            {course.instructor && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover background effect */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>
    </Link>
  );
};

// Backwards-compatible alias: some modules import `ElectiveCard`
export const ElectiveCard = CourseCard;

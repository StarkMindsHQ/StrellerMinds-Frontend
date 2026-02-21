"use client";

import { useCourse } from "@/contexts/CourseContext";

export default function ProgressBar() {
  const { getProgress } = useCourse();
  const progress = getProgress();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">
          Course Progress
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {progress}%
        </span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

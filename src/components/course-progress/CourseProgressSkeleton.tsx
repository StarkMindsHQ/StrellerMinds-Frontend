import React from "react";

export const CourseProgressSkeleton = () => {
  return (
    <div className="animate-pulse w-full">
      <div className="flex justify-between mb-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full w-full" />
    </div>
  );
};
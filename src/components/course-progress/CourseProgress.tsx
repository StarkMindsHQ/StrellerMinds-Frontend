import React, { useMemo } from "react";
import clsx from "clsx";
import { CourseProgressProps } from "./CourseProgress.types";
import { CourseProgressSkeleton } from "./CourseProgressSkeleton";

export const CourseProgress: React.FC<CourseProgressProps> = ({
  totalLessons,
  completedLessons,
  showLabel = true,
  size = "md",
  loading = false,
}) => {
  const percentage = useMemo(() => {
    if (totalLessons === 0) return 0;
    return Math.min((completedLessons / totalLessons) * 100, 100);
  }, [completedLessons, totalLessons]);

  if (loading) return <CourseProgressSkeleton />;

  return (
    <div className="w-full">
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>{completedLessons} / {totalLessons} lessons</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}

      {/* Progress Bar */}
      <div
        className={clsx(
          "w-full bg-gray-200 rounded-full overflow-hidden",
          size === "sm" && "h-1.5",
          size === "md" && "h-2.5",
          size === "lg" && "h-4"
        )}
      >
        <div
          className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
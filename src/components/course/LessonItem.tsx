"use client";

import clsx from "clsx";
import { Lock } from "lucide-react";

interface LessonItemProps {
  id: string;
  title: string;
  isActive: boolean;
  isLocked: boolean;
  onClick: () => void;
}

export default function LessonItem({
  title,
  isActive,
  isLocked,
  onClick,
}: LessonItemProps) {
  return (
    <button
      disabled={isLocked}
      onClick={onClick}
      className={clsx(
        "w-full text-left px-4 py-3 rounded-lg transition-all duration-200",
        "flex items-center justify-between",
        isActive && "bg-blue-50 text-blue-600 font-medium",
        !isActive && !isLocked && "hover:bg-gray-100",
        isLocked && "opacity-50 cursor-not-allowed"
      )}
    >
      <span className="text-sm md:text-base">{title}</span>

      {isLocked && (
        <Lock className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}
